const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTrainerAffiliates = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        const trainerAffiliates = await prisma.affiliate.findMany({
            where: {
                trainers: {
                    some: {
                        trainerId: userId,
                    },
                },
            },
        });

        res.json(trainerAffiliates);
    } catch (error) {
        console.error("❌ Error loading trainer affiliates:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get classes for a specific day
const getClassesForDay = async (req, res) => {
    try {
        const { affiliateId, date } = req.params;

        // Create date range for the given day (start of day to end of day)
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const classes = await prisma.classSchedule.findMany({
            where: {
                affiliateId: parseInt(affiliateId),
                time: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                time: 'asc'
            }
        });

        res.json(classes);
    } catch (error) {
        console.error("❌ Error fetching classes for day:", error);
        res.status(500).json({ error: "Failed to fetch classes" });
    }
};

// Assign trainer to multiple classes
const assignTrainerToClasses = async (req, res) => {
    try {
        const { classIds, trainerName } = req.body;



        if (!classIds || !Array.isArray(classIds) || classIds.length === 0) {
            return res.status(400).json({ error: "Invalid or missing classIds" });
        }

        if (!trainerName) {
            return res.status(400).json({ error: "Missing trainerName" });
        }

        // Update all selected classes with the trainer name
        const updatePromises = classIds.map(classId => {
            const id = parseInt(classId);


            return prisma.classSchedule.update({
                where: { id: id },
                data: { trainer: trainerName }
            }).catch(err => {
                console.error(`Error updating class ${id}:`, err);
                throw new Error(`Failed to update class ${id}: ${err.message}`);
            });
        });

        await Promise.all(updatePromises);


        res.json({ success: true, message: "Trainer assigned successfully" });
    } catch (error) {
        console.error("❌ Error assigning trainer to classes:", error);
        res.status(500).json({ error: error.message || "Failed to assign trainer to classes" });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 3) {
            return res.status(400).json({ error: "Search query must be at least 3 characters" });
        }

        const users = await prisma.user.findMany({
            where: {
                fullName: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                fullName: true,
                email: true
            },
            take: 10 // Limit results to 10
        });

        res.json(users);
    } catch (error) {
        console.error("❌ Error searching users:", error);
        res.status(500).json({ error: "Failed to search users" });
    }
};

// Get family members for a user
const getFamilyMembers = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const familyMembers = await prisma.familyMember.findMany({
            where: { userId: parseInt(userId) }
        });

        res.json(familyMembers);
    } catch (error) {
        console.error("❌ Error fetching family members:", error);
        res.status(500).json({ error: "Failed to fetch family members" });
    }
};

// Register a member for a class
const registerMemberForClass = async (req, res) => {
    try {
        const { classId, planId, affiliateId, userId, isFamilyMember, familyMemberId } = req.body;

        if (!classId || !userId) {
            return res.status(400).json({ error: "Class ID and User ID required" });
        }

        // Validate family member information if provided
        if (isFamilyMember) {
            if (!familyMemberId) {
                return res.status(400).json({ error: "Family member ID is required when booking for a family member" });
            }

            // Verify the family member belongs to this user
            const validFamilyMember = await prisma.familyMember.findFirst({
                where: {
                    id: parseInt(familyMemberId),
                    userId: parseInt(userId)
                }
            });

            if (!validFamilyMember) {
                return res.status(400).json({ error: "Invalid family member selected" });
            }
        }

        // Verify that the user has permission to do this
        const requestingUserId = req.user?.id;
        if (!requestingUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Check if the user is an affiliate owner or a trainer for this affiliate
        const isAffiliateOwner = await prisma.affiliate.findFirst({
            where: {
                id: parseInt(affiliateId),
                ownerId: requestingUserId
            }
        });

        const isTrainer = await prisma.affiliateTrainer.findFirst({
            where: {
                affiliateId: parseInt(affiliateId),
                trainerId: requestingUserId
            }
        });

        if (!isAffiliateOwner && !isTrainer) {
            return res.status(403).json({ error: "Forbidden: You don't have permission to register members for this affiliate" });
        }

        // Get class details
        const classInfo = await prisma.classSchedule.findUnique({
            where: { id: parseInt(classId) },
            select: {
                memberCapacity: true,
                freeClass: true,
                affiliateId: true
            }
        });

        if (!classInfo) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Check if member is already registered
        const existingRegistration = await prisma.classAttendee.findFirst({
            where: {
                classId: parseInt(classId),
                userId: parseInt(userId),
                isFamilyMember: Boolean(isFamilyMember),
                familyMemberId: isFamilyMember ? parseInt(familyMemberId) : null
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                error: isFamilyMember
                    ? "This family member is already registered for this class"
                    : "Member is already registered for this class"
            });
        }

        // Check if class is full
        const enrolledCount = await prisma.classAttendee.count({
            where: { classId: parseInt(classId) }
        });



        // For free classes, we can register directly
        if (classInfo.freeClass) {
            await prisma.classAttendee.create({
                data: {
                    userId: parseInt(userId),
                    classId: parseInt(classId),
                    checkIn: false,
                    userPlanId: 0,
                    affiliateId: classInfo.affiliateId,
                    isFamilyMember: Boolean(isFamilyMember),
                    familyMemberId: isFamilyMember ? parseInt(familyMemberId) : null
                }
            });

            return res.status(200).json({ message: "Successfully registered!" });
        }

        // For paid classes, verify the plan
        if (!planId) {
            return res.status(400).json({ error: "Plan ID required for paid classes" });
        }

        const plan = await prisma.userPlan.findFirst({
            where: {
                id: parseInt(planId),
                userId: parseInt(userId),
                affiliateId: parseInt(affiliateId)
            }
        });

        if (!plan) {
            return res.status(400).json({ error: "Invalid plan" });
        }

        if (plan.sessionsLeft <= 0) {
            return res.status(400).json({ error: "No sessions left in the selected plan" });
        }

        // Create registration and update plan sessions in a transaction
        await prisma.$transaction([
            prisma.classAttendee.create({
                data: {
                    userId: parseInt(userId),
                    classId: parseInt(classId),
                    checkIn: false,
                    userPlanId: parseInt(planId),
                    affiliateId: classInfo.affiliateId,
                    isFamilyMember: Boolean(isFamilyMember),
                    familyMemberId: isFamilyMember ? parseInt(familyMemberId) : null
                }
            }),
            prisma.userPlan.update({
                where: { id: parseInt(planId) },
                data: { sessionsLeft: { decrement: 1 } }
            })
        ]);

        res.status(200).json({ message: "Successfully registered!" });
    } catch (error) {
        console.error("❌ Error registering member for class:", error);
        res.status(500).json({ error: "Failed to register member for class" });
    }
};

module.exports = {
    getTrainerAffiliates,
    getClassesForDay,
    assignTrainerToClasses,
    searchUsers,
    getFamilyMembers,
    registerMemberForClass
};