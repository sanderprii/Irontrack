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

        // Get users matching the search term
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
                email: true,

            },
            take: 10
        });

        // Get family members matching the search term
        const familyMembers = await prisma.familyMember.findMany({
            where: {
                fullName: {
                    contains: q,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                fullName: true,
                userId: true, // Need parent user ID
            },

            take: 10
        });

        // Format family members to match user structure with additional fields
        const formattedFamilyMembers = familyMembers.map(fm => ({
            id: fm.id,
            fullName: fm.fullName,

            parentUserId: fm.userId, // Store parent user ID
            type: 'familyMember' // Add a type field to identify as family member
        }));

        // Combine both results
        const combinedResults = [...users, ...formattedFamilyMembers];

        res.json(combinedResults);
    } catch (error) {
        console.error("❌ Error searching users and family members:", error);
        res.status(500).json({ error: "Failed to search" });
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

const registerMemberForClass = async (req, res) => {
    try {
        const { classId, planId, affiliateId, userId, memberType, memberId } = req.body;

        if (!classId || (!userId && memberType !== 'familyMember') || (memberType === 'familyMember' && !memberId)) {
            return res.status(400).json({ error: "Required parameters missing" });
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

        // Handle different registration types
        if (memberType === 'familyMember') {
            // Direct family member registration
            const familyMember = await prisma.familyMember.findUnique({
                where: { id: parseInt(memberId) }
            });

            if (!familyMember) {
                return res.status(404).json({ error: "Family member not found" });
            }

            // Check if family member is already registered
            const existingRegistration = await prisma.classAttendee.findFirst({
                where: {
                    classId: parseInt(classId),
                    userId: familyMember.userId,
                    isFamilyMember: true,
                    familyMemberId: parseInt(memberId)
                }
            });

            if (existingRegistration) {
                return res.status(400).json({ error: "This family member is already registered for this class" });
            }

            // For free classes, we can register directly
            if (classInfo.freeClass) {
                await prisma.classAttendee.create({
                    data: {
                        userId: familyMember.userId,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: 0,
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: true,
                        familyMemberId: parseInt(memberId)
                    }
                });

                return res.status(200).json({ message: "Successfully registered family member!" });
            }

            // For paid classes, verify the plan
            if (!planId) {
                return res.status(400).json({ error: "Plan ID required for paid classes" });
            }

            const plan = await prisma.userPlan.findFirst({
                where: {
                    id: parseInt(planId),
                    userId: familyMember.userId,
                    affiliateId: parseInt(affiliateId),
                    familyMemberId: parseInt(memberId)
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
                        userId: familyMember.userId,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: parseInt(planId),
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: true,
                        familyMemberId: parseInt(memberId)
                    }
                }),
                prisma.userPlan.update({
                    where: { id: parseInt(planId) },
                    data: { sessionsLeft: { decrement: 1 } }
                })
            ]);

            return res.status(200).json({ message: "Successfully registered family member!" });
        } else {
            // Regular user registration (existing code)
            const userIdToUse = parseInt(userId);

            // Check if member is already registered
            const existingRegistration = await prisma.classAttendee.findFirst({
                where: {
                    classId: parseInt(classId),
                    userId: userIdToUse,
                    isFamilyMember: false
                }
            });

            if (existingRegistration) {
                return res.status(400).json({ error: "Member is already registered for this class" });
            }

            // For free classes, we can register directly
            if (classInfo.freeClass) {
                await prisma.classAttendee.create({
                    data: {
                        userId: userIdToUse,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: 0,
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: false,
                        familyMemberId: null
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
                        userId: userIdToUse,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: parseInt(planId),
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: false,
                        familyMemberId: null
                    }
                }),
                prisma.userPlan.update({
                    where: { id: parseInt(planId) },
                    data: { sessionsLeft: { decrement: 1 } }
                })
            ]);

            res.status(200).json({ message: "Successfully registered!" });
        }
    } catch (error) {
        console.error("❌ Error registering for class:", error);
        res.status(500).json({ error: error.message || "Failed to register for class" });
    }
};

const getMemberPlans = async (req, res) => {
    try {
        const { userId, affiliateId, memberType, familyMemberId } = req.query;

        if (!userId || !affiliateId) {
            return res.status(400).json({ error: "User ID and Affiliate ID are required" });
        }

        // Validate requesting user has permission
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
            return res.status(403).json({ error: "Forbidden: You don't have permission to view member plans for this affiliate" });
        }

        // Determine whether to get plans for a user or a family member
        const isFamilyMember = memberType === 'familyMember';
        let planQuery = {
            where: {
                userId: parseInt(userId),
                affiliateId: parseInt(affiliateId),
                // Filter by family member ID if applicable
                ...(isFamilyMember && familyMemberId ? { familyMemberId: parseInt(familyMemberId) } : {})
            }
        };

        // Get plans for the selected user/family member
        const userPlans = await prisma.userPlan.findMany(planQuery);

        // Format the plans for the frontend
        const formattedPlans = userPlans.map(plan => ({
            userPlanId: plan.id,
            planName: plan.planName,
            trainingType: plan.trainingType,
            endDate: plan.endDate,
            sessionsLeft: plan.sessionsLeft,
            familyMemberId: plan.familyMemberId
        }));

        // Also get the member's basic info
        let memberInfo;
        if (isFamilyMember && familyMemberId) {
            memberInfo = await prisma.familyMember.findUnique({
                where: { id: parseInt(familyMemberId) },
                select: {
                    id: true,
                    fullName: true,
                    userId: true
                }
            });
        } else {
            memberInfo = await prisma.user.findUnique({
                where: { id: parseInt(userId) },
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            });
        }

        res.json({
            member: memberInfo,
            plans: formattedPlans
        });
    } catch (error) {
        console.error("❌ Error loading member plans:", error);
        res.status(500).json({ error: "Failed to load member plans" });
    }
};

module.exports = {
    getTrainerAffiliates,
    getClassesForDay,
    assignTrainerToClasses,
    searchUsers,
    getFamilyMembers,
    registerMemberForClass,
    getMemberPlans
};