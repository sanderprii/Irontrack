const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const {sendMessage} = require("../utils/emailService");

// Klasside info saamine
const getClassInfo = async (req, res) => {
    const classId = parseInt(req.query.classId);
    if (!classId) return res.status(400).json({error: "Class ID required."});

    try {
        const cls = await prisma.classSchedule.findUnique({
            where: {id: classId},
            select: {memberCapacity: true}
        });

        if (!cls) {
            return res.status(404).json({error: "Class not found."});
        }

        // Leia registreeritud kasutajate arv
        const count = await prisma.classAttendee.count({where: {classId}});

        res.json({memberCapacity: cls.memberCapacity, enrolledCount: count});
    } catch (error) {
        console.error("Error fetching class info:", error);
        res.status(500).json({error: "Internal server error."});
    }
};

// Klasside nimekirja pärimine
const getClasses = async (req, res) => {

    let {affiliateId, start, end} = req.query;
    // Kontrolli ja teisenda kuupäevad õigesse formaati
    let startDate = new Date(start);
    let endDate = new Date(end);

    // Kui start või end on kehtetu, määrame vaikimisi käesoleva nädala alguse ja lõpu
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn("⚠️ Kehtetu kuupäev, määrame vaikimisi väärtused.");
        startDate = new Date(); // Tänane kuupäev
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Esmaspäev
        startDate.setHours(0, 0, 0, 0); // Alustame päeva algusega

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // Pühapäev
        endDate.setHours(23, 59, 59, 999); // Päeva lõpp
    }


    try {
        const classes = await prisma.classSchedule.findMany({
            where: {
                affiliateId: parseInt(affiliateId),
                time: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {time: "asc"}
        });

        res.json(classes);
    } catch (error) {
        console.error("❌ Error fetching classes:", error);
        res.status(500).json({error: "Failed to fetch classes."});
    }
};

// Uue klassi loomine
const createClass = async (req, res) => {
    try {
        const {
            affiliateId,
            trainingType,
            trainingName,
            time,
            duration,
            trainer,
            memberCapacity,
            location,
            repeatWeekly,
            wodName,
            wodType
        } = req.body;
        const owner = parseInt(req.user?.id);


        // Loome Prisma jaoks sobiva DateTime formaadi (YYYY-MM-DDTHH:MM:SS.000Z)
        const classTime = new Date(time.replace("Z", ""));


        // Kontrollime, kas loodud kuupäev on kehtiv


        // Esmalt loo klass ilma seriesId-ta
        const newClass = await prisma.classSchedule.create({
            data: {
                trainingType,
                trainingName,
                time: classTime,
                duration: parseInt(duration),
                trainer,
                memberCapacity: parseInt(memberCapacity),
                location,
                repeatWeekly,
                wodName: wodName.toUpperCase(),
                wodType,
                ownerId: owner,
                affiliateId: parseInt(affiliateId)
            }
        });

// Seejärel uuenda sama klassi, määrates seriesId = id
        const updatedClass = await prisma.classSchedule.update({
            where: { id: newClass.id },
            data: { seriesId: newClass.id }
        });

        // if repeatWeekly is true, create new classes for the next 52 weeks. seriedId is the id of the first class in the series
        if (repeatWeekly) {
            const seriesId = newClass.id;
            const series = [];
            for (let i = 0; i < 52; i++) {
                series.push({
                    trainingType,
                    trainingName,
                    time: new Date(classTime.setDate(classTime.getDate() + 7)), // ✅ Õige DateTime väärtus Prisma jaoks
                    duration: parseInt(duration),
                    trainer,
                    memberCapacity: parseInt(memberCapacity),
                    location,
                    repeatWeekly,


                    ownerId: owner,
                    affiliateId: parseInt(affiliateId),
                    seriesId
                });
            }

            await prisma.classSchedule.createMany({data: series});
        }


        res.status(201).json({message: "Class created successfully!", class: updatedClass});
    } catch (error) {
        console.error("❌ Error creating class:", error);
        res.status(500).json({error: "Failed to create class."});
    }
};


// Klasside uuendamine
const updateClass = async (req, res) => {
    const classId = parseInt(req.params.id);
    const {
        trainingType,
        trainingName,
        time,
        duration,
        trainer,
        memberCapacity,
        location,
        repeatWeekly,
        wodName,
        wodType,
        description,
        applyToAllFutureTrainings
    } = req.body;

    // time võib tulla õiges formaadis kui ka dateTTime formaadis. Kontrollime ja teisendame õigesse formaati
    let classTime = new Date(time);
    if (isNaN(classTime.getTime())) {
        // Kui kuupäev on vigane, proovime teisendada
        classTime = new Date(`${time}:00.000Z`);
    } else {
        // Kui kuupäev on õige, siis teisendame UTC formaati
        classTime = new Date(classTime.toISOString());
    }

    try {
        // Leia praegune klass, et kontrollida vana mahutavust
        const currentClass = await prisma.classSchedule.findUnique({
            where: { id: classId },
            include: {
                affiliate: true
            }
        });

        if (!currentClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Uuenda klass uute andmetega
        const updatedClass = await prisma.classSchedule.update({
            where: {id: classId},
            data: {
                trainingType,
                trainingName,
                time: classTime,
                duration: parseInt(duration),
                trainer,
                memberCapacity: parseInt(memberCapacity),
                location,
                repeatWeekly,
                wodName: wodName.toUpperCase(),
                wodType,
                description
            }
        });

        // Kontrolli, kas mahutavus suurenes
        const oldCapacity = currentClass.memberCapacity;
        const newCapacity = parseInt(memberCapacity);
        const capacityIncrease = newCapacity - oldCapacity;

        // Kui mahutavus suurenes, kontrolli ootelisti
        if (capacityIncrease > 0) {
            // Leia praegune osalejate arv
            const enrolledCount = await prisma.classAttendee.count({
                where: { classId }
            });

            // Arvuta vabad kohad
            const availableSpots = newCapacity - enrolledCount;

            if (availableSpots > 0) {
                // Leia inimesed ootelististist (vanemad kõigepealt)
                const waitlistEntries = await prisma.waitlist.findMany({
                    where: { classId },
                    orderBy: { createdAt: 'asc' },
                    include: {
                        user: true,
                        userPlan: true
                    },
                    take: availableSpots // Võta vaid nii palju kui kohti on
                });

                // Töötle iga ootelisti kirjet
                for (const entry of waitlistEntries) {
                    // Tasuliste klasside puhul kontrolli, kas plaan on kehtiv
                    if (!currentClass.freeClass && entry.userPlanId > 0) {
                        const plan = await prisma.userPlan.findUnique({
                            where: { id: entry.userPlanId }
                        });

                        if (!plan || plan.sessionsLeft <= 0) {
                            // Jäta see inimene vahele, kuna tema plaan pole enam kehtiv
                            continue;
                        }
                    }

                    // Alusta tehingut selle inimese jaoks
                    await prisma.$transaction(async (tx) => {
                        let isFamilyMember = false;
                        if (entry.userPlan && entry.userPlan.familyMemberId > 0) {
                            isFamilyMember = true;
                        }

                        // Registreeri inimene ootenimekirjast
                        await tx.classAttendee.create({
                            data: {
                                userId: entry.userId,
                                classId,
                                checkIn: false,
                                userPlanId: entry.userPlanId,
                                affiliateId: currentClass.affiliateId,
                                isFamilyMember: isFamilyMember || false,
                                familyMemberId: entry.userPlan?.familyMemberId || null
                            }
                        });

                        // Kui see on tasuline klass, vähenda sessioone
                        if (!currentClass.freeClass && entry.userPlanId > 0) {
                            await tx.userPlan.update({
                                where: { id: entry.userPlanId },
                                data: { sessionsLeft: { decrement: 1 } }
                            });
                        }

                        // Eemalda inimene ootenimekirjast
                        await tx.waitlist.delete({
                            where: {
                                classId_userId: {
                                    classId,
                                    userId: entry.userId
                                }
                            }
                        });
                    });

                    // Saada e-maili teavitus
                    try {
                        const emailData = {
                            recipientType: 'user',
                            senderId: currentClass.affiliateId,
                            recipientId: entry.userId,
                            subject: `You've been registered for ${currentClass.trainingName}`,
                            body: `
Dear ${entry.user.fullName},

Good news! A spot has opened up in the class "${currentClass.trainingName}" scheduled for ${new Date(currentClass.time).toLocaleString()}.

You have been automatically registered for this class from the waitlist.
${entry.userPlan && entry.userPlan.familyMemberId ? `This registration is for your family member.` : ''}

Time: ${new Date(currentClass.time).toLocaleString()}
Trainer: ${currentClass.trainer || 'N/A'}

We look forward to seeing you there!

IronTrack Team
                            `,
                            affiliateEmail: currentClass.affiliate.email
                        };

                        await sendMessage(emailData);
                    } catch (emailError) {
                        console.error('Error sending notification email:', emailError);
                        // Jätka töötlemist, isegi kui e-maili saatmine ebaõnnestub
                    }
                }
            }
        }

        if (repeatWeekly < 1) {
            // kustuta kõik klassid, kus seriesId on sama mis antud klassil, seriesId on olemas ja id on suurem kui classId
            const seriesIdGet = await prisma.classSchedule.findFirst({where: {id: classId}});
            const seriesId = seriesIdGet.seriesId;

            if (seriesId) {
                await prisma.classSchedule.deleteMany({
                    where: {
                        seriesId,
                        id: {gt: classId}
                    }
                });
            }
        }

        // If applyToAllFutureTrainings is true, update all future classes
        if (applyToAllFutureTrainings) {
            const seriesIdGet = await prisma.classSchedule.findFirst({where: {id: classId}});
            const seriesId = seriesIdGet.seriesId;

            if (seriesId) {
                // Get all future classes in the series
                const futureClasses = await prisma.classSchedule.findMany({
                    where: {
                        seriesId,
                        id: {gt: classId}
                    },
                    orderBy: {
                        time: 'asc'
                    }
                });

                // Update each future class with an incrementing date
                for (let i = 0; i < futureClasses.length; i++) {
                    const futureClass = futureClasses[i];

                    // Create a new date object for each class
                    const newTime = new Date(classTime);
                    newTime.setDate(newTime.getDate() + (i+1) * 7);

                    await prisma.classSchedule.update({
                        where: { id: futureClass.id },
                        data: {
                            trainingType,
                            trainingName,
                            time: newTime,
                            duration: parseInt(duration),
                            trainer,
                            memberCapacity: parseInt(memberCapacity),
                            location,
                            repeatWeekly,
                            wodName: wodName ? wodName.toUpperCase() : '',
                            wodType,
                            description
                        }
                    });
                }
            }
        }

        res.status(200).json({message: "Class updated successfully!", class: updatedClass});
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({error: "Failed to update class."});
    }
};

// Klasside kustutamine
const deleteClass = async (req, res) => {
    const classId = parseInt(req.params.id);

    try {
        await prisma.classSchedule.delete({where: {id: classId}});
        res.status(200).json({message: "Class deleted successfully!"});
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({error: "Failed to delete class."});
    }
};

// Klasside osalejate pärimine
// Klasside osalejate pärimine
const getClassAttendees = async (req, res) => {
    const classId = parseInt(req.query.classId);
    if (!classId) return res.status(400).json({error: "Class ID required."});

    try {
        // Fetch attendees with additional user info including dateOfBirth
        const attendees = await prisma.classAttendee.findMany({
            where: {classId},
            include: {user: {select: {id: true, fullName: true, dateOfBirth: true}}}
        });

        if (attendees.length === 0) {
            return res.status(200).json({message: "No attendees found."});
        } else {
            // Kogu attendee userIds massiiv
            const attendeeUserIds = attendees.map(att => att.userId);

            // Leia kõik userNoted, mis on seotud nende userIdega
            const userNotes = await prisma.userNote.findMany({
                where: {
                    userId: {
                        in: attendeeUserIds
                    }
                }
            });

            // Get all family member IDs from attendees
            const familyMemberIds = attendees
                .filter(att => att.isFamilyMember && att.familyMemberId)
                .map(att => att.familyMemberId);

            // Fetch family members if we have any
            let familyMemberMap = {};
            if (familyMemberIds.length > 0) {
                const familyMembers = await prisma.familyMember.findMany({
                    where: {
                        id: {
                            in: familyMemberIds
                        }
                    }
                });

                // Create a map of family member ID to full name
                familyMemberMap = familyMembers.reduce((acc, member) => {
                    acc[member.id] = member.fullName;
                    return acc;
                }, {});
            }

            // Loo kaart userNotes-te sidumiseks õigete userIdega
            const userNotesMap = userNotes.reduce((acc, note) => {
                if (!acc[note.userId]) {
                    acc[note.userId] = [];
                }
                acc[note.userId].push(note);
                return acc;
            }, {});

            // Get previous attendances for all users in a single query
            const userAttendanceCounts = await prisma.classAttendee.groupBy({
                by: ['userId'],
                _count: {
                    userId: true
                },
                where: {
                    userId: {
                        in: attendeeUserIds
                    }
                }
            });

            // Create a map of user ID to attendance count
            const attendanceCountMap = userAttendanceCounts.reduce((acc, item) => {
                acc[item.userId] = item._count.userId;
                return acc;
            }, {});

            // Get today's date for birthday checking
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
            const currentDay = today.getDate();

            // Koosta vastus, kus igal kasutajal on ainult tema enda märkmed
            const response = attendees.map(att => {
                // Determine display name
                let displayName = att.user.fullName;

                // If this is a family member registration and we have the family member info
                if (att.isFamilyMember && att.familyMemberId && familyMemberMap[att.familyMemberId]) {
                    displayName = familyMemberMap[att.familyMemberId];
                }

                // If attendance count is 1, this is their first training
                // (the current attendance is counted in this number)
                const attendanceCount = attendanceCountMap[att.userId] || 0;
                const firstTraining = attendanceCount <= 1;

                // Check if it's the user's birthday
                let isBirthday = false;
                if (att.user.dateOfBirth) {
                    const birthDate = new Date(att.user.dateOfBirth);
                    const birthMonth = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
                    const birthDay = birthDate.getDate();

                    isBirthday = (birthMonth === currentMonth && birthDay === currentDay);
                }

                return {
                    userId: att.user.id,
                    fullName: displayName,
                    registrantName: att.user.fullName, // Original account owner name
                    checkIn: att.checkIn,
                    firstTraining: firstTraining,
                    isBirthday: isBirthday,
                    isFamilyMember: att.isFamilyMember || false,
                    familyMemberId: att.familyMemberId || null,
                    // Lisa ainult selle kasutaja märkmed
                    userNotes: userNotesMap[att.user.id] || []
                };
            });

            res.json(response);
        }
    } catch (error) {
        console.error("❌ Error fetching attendees:", error);
        res.status(500).json({error: "Failed to fetch attendees."});
    }
};

const checkInAttendee = async (req, res) => {

    const {classId, userId} = req.body;
    if (!classId || !userId) return res.status(400).json({error: "Class ID and User ID required."});

    try {
        await prisma.classAttendee.updateMany({
            where: {classId: parseInt(classId), userId: parseInt(userId)},
            data: {checkIn: true}
        });

        res.json({message: "Check-in successful!"});
    } catch (error) {
        console.error("❌ Error checking in attendee:", error);
        res.status(500).json({error: "Failed to check in attendee."});
    }
};

const deleteAttendee = async (req, res) => {
    const {classId, freeClass, userId} = req.body;


    try {
        // First, find the registration outside of the transaction
        const registration = await prisma.classAttendee.findFirst({
            where: {userId: parseInt(userId), classId: parseInt(classId)},
        });

        if (!registration) {
            return res.status(404).json({error: "Registration not found"});
        }

        // Initialize variables we'll need later
        let nextPerson = null;
        let classInfo = null;

        // Start transaction with increased timeout
        await prisma.$transaction(async (tx) => {
            // Delete the registration
            await tx.classAttendee.delete({
                where: {id: registration.id},
            });

            if (!freeClass) {
                // Return session to user
                await tx.userPlan.update({
                    where: {id: registration.userPlanId},
                    data: {sessionsLeft: {increment: 1}},
                });
            }

            // Check if there's anyone in the waitlist
            const waitlistEntries = await tx.waitlist.findMany({
                where: {classId: parseInt(classId)},
                orderBy: {createdAt: 'asc'},
                include: {
                    user: true,
                    userPlan: true,
                },
                take: 1 // Get the first (earliest) entry
            });

            if (waitlistEntries.length > 0) {
                nextPerson = waitlistEntries[0];

                // Check if their plan is still valid (for paid classes)
                if (!freeClass && nextPerson.userPlanId > 0) {
                    const plan = await tx.userPlan.findUnique({
                        where: {id: nextPerson.userPlanId}
                    });

                    if (!plan || plan.sessionsLeft <= 0) {
                        // Skip this person as their plan is no longer valid
                        nextPerson = null;
                        return;
                    }
                }

                // Get class and affiliate information
                classInfo = await tx.classSchedule.findUnique({
                    where: {id: parseInt(classId)},
                    include: {
                        affiliate: true
                    }
                });
                let isFamilyMember = false;
                if (nextPerson.userPlan.familyMemberId > 0) {
                    isFamilyMember = true;
                }

                // Register the person from waitlist, including family member info
                await tx.classAttendee.create({
                    data: {
                        userId: nextPerson.userId,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: nextPerson.userPlanId,
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: isFamilyMember || false,
                        familyMemberId: nextPerson.userPlan.familyMemberId || null

                    },
                });

                // If it's a paid class, decrease the sessions count
                if (!freeClass && nextPerson.userPlanId > 0) {
                    await tx.userPlan.update({
                        where: {id: nextPerson.userPlanId},
                        data: {sessionsLeft: {decrement: 1}},
                    });
                }

                // Remove the person from waitlist
                await tx.waitlist.delete({
                    where: {
                        classId_userId: {
                            classId: parseInt(classId),
                            userId: nextPerson.userId
                        }
                    }
                });
            }
        }, {
            timeout: 10000 // Increase timeout to 10 seconds
        });

        // Send email notification outside of the transaction
        if (nextPerson && classInfo) {
            const emailData = {
                recipientType: 'user',
                senderId: classInfo.affiliateId,
                recipientId: nextPerson.userId,
                subject: `You've been registered for ${classInfo.trainingName}`,
                body: `
Dear ${nextPerson.user.fullName},

Good news! A spot has opened up in the class "${classInfo.trainingName}" scheduled for ${new Date(classInfo.time).toLocaleString()}.

You have been automatically registered for this class from the waitlist.
${nextPerson.familyMember ? `This registration is for your family member.` : ''}

Time: ${new Date(classInfo.time).toLocaleString()}
Trainer: ${classInfo.trainer || 'N/A'}

We look forward to seeing you there!

IronTrack Team
                `,
                affiliateEmail: classInfo.affiliate.email
            };

            try {
                // Use your sendMessage function
                await sendMessage(emailData);
            } catch (emailError) {
                console.error('Error sending notification email:', emailError);
                // Continue with success response even if email fails
            }
        }

        res.status(200).json({message: "Registration cancelled successfully!"});
    } catch (error) {
        console.error("❌ Error canceling registration:", error);
        res.status(500).json({error: "Failed to cancel registration."});
    }
};

// classes anttendees count
const getClassAttendeesCount = async (req, res) => {
    const classId = parseInt(req.params.classId);
    if (!classId) return res.status(400).json({error: "Class ID required"});
    try {
        const count = await prisma.classAttendee.count({where: {classId}});
        res.json({count});
    } catch (error) {
        console.error("Error fetching attendees count:", error);
        res.status(500).json({error: "Failed to fetch attendees count"});
    }
};

// UPDATED: Kasutaja registreerumine klassi with family member support
// UPDATED: Kasutaja registreerumine klassi with family member support
const registerForClass = async (req, res) => {
    const {classId, planId, isFamilyMember, familyMemberId} = req.body;
    const userId = req.user?.id;

    if (!classId || !userId) {
        return res.status(400).json({error: "Class ID and User ID required"});
    }

    // Validate familyMember boolean and familyMemberId if familyMember is true


    if (isFamilyMember) {
        if (!familyMemberId) {
            return res.status(400).json({error: "Family member ID is required when booking for a family member"});
        }

        // Verify the family member belongs to this user
        const validFamilyMember = await prisma.familyMember.findFirst({
            where: {
                id: parseInt(familyMemberId),
                userId: parseInt(userId)
            }
        });

        if (!validFamilyMember) {
            return res.status(400).json({error: "Invalid family member selected"});
        }

    }


    try {
        // Get class details
        const classInfo = await prisma.classSchedule.findUnique({
            where: {id: parseInt(classId)},
            select: {
                memberCapacity: true,
                freeClass: true,
                affiliateId: true
            }
        });

        if (!classInfo) {
            return res.status(404).json({error: "Class not found"});
        }

        // Check if user is already registered
        const existingRegistration = await prisma.classAttendee.findFirst({
            where: {
                classId: parseInt(classId),
                userId: parseInt(userId),
                isFamilyMember: isFamilyMember,
                familyMemberId: familyMemberId
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                error: isFamilyMember
                    ? "This family member is already registered for this class"
                    : "You are already registered for this class"
            });
        }

        // Check if class is full
        const enrolledCount = await prisma.classAttendee.count({
            where: {classId: parseInt(classId)}
        });

        if (enrolledCount >= classInfo.memberCapacity) {
            return res.status(400).json({error: "Class is full"});
        }
        console.log()
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
                    familyMemberId: parseInt(familyMemberId) || null
                }
            });

            return res.status(200).json({message: "Successfully registered!"});
        }

        // For paid classes, verify the plan
        if (!planId) {
            return res.status(400).json({error: "Plan ID required for paid classes"});
        }

        const plan = await prisma.userPlan.findFirst({
            where: {
                id: parseInt(planId),
                userId: parseInt(userId),
                affiliateId: classInfo.affiliateId,

            }
        });

        if (!plan) {
            return res.status(400).json({error: "Invalid plan"});
        }

        if (plan.sessionsLeft <= 0) {
            return res.status(400).json({error: "No sessions left in the selected plan"});
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
                    isFamilyMember: isFamilyMember,
                    familyMemberId: familyMemberId,
                }
            }),
            prisma.userPlan.update({
                where: {id: parseInt(planId)},
                data: {sessionsLeft: {decrement: 1}}
            })
        ]);

        res.status(200).json({message: "Successfully registered!"});
    } catch (error) {
        console.error("❌ Error registering for class:", error);
        res.status(500).json({error: "Failed to register for class"});
    }
};

// UPDATED: In your classController.js file, modify your cancelRegistration function with family member support
const cancelRegistration = async (req, res) => {
    const {classId, freeClass} = req.body;
    const userId = req.user.id;

    try {
        // First, find the registration outside of the transaction
        const registration = await prisma.classAttendee.findFirst({
            where: {userId: parseInt(userId), classId: parseInt(classId)},
        });

        if (!registration) {
            return res.status(404).json({error: "Registration not found"});
        }

        // Initialize variables we'll need later
        let nextPerson = null;
        let classInfo = null;

        // Start transaction with increased timeout
        await prisma.$transaction(async (tx) => {
            // Delete the registration
            await tx.classAttendee.delete({
                where: {id: registration.id},
            });

            if (!freeClass) {
                // Return session to user
                await tx.userPlan.update({
                    where: {id: registration.userPlanId},
                    data: {sessionsLeft: {increment: 1}},
                });
            }

            // Check if there's anyone in the waitlist
            const waitlistEntries = await tx.waitlist.findMany({
                where: {classId: parseInt(classId)},
                orderBy: {createdAt: 'asc'},
                include: {
                    user: true,
                    userPlan: true
                },
                take: 1 // Get the first (earliest) entry
            });

            if (waitlistEntries.length > 0) {
                nextPerson = waitlistEntries[0];

                // Check if their plan is still valid (for paid classes)
                if (!freeClass && nextPerson.userPlanId > 0) {
                    const plan = await tx.userPlan.findUnique({
                        where: {id: nextPerson.userPlanId}
                    });

                    if (!plan || plan.sessionsLeft <= 0) {
                        // Skip this person as their plan is no longer valid
                        nextPerson = null;
                        return;
                    }
                }

                // Get class and affiliate information
                classInfo = await tx.classSchedule.findUnique({
                    where: {id: parseInt(classId)},
                    include: {
                        affiliate: true
                    }
                });
                let isFamilyMember = false;
                if (nextPerson.userPlan.familyMemberId > 0) {
                    isFamilyMember = true;
                }
                // Register the person from waitlist with family member info
                await tx.classAttendee.create({
                    data: {
                        userId: nextPerson.userId,
                        classId: parseInt(classId),
                        checkIn: false,
                        userPlanId: nextPerson.userPlanId,
                        affiliateId: classInfo.affiliateId,
                        isFamilyMember: isFamilyMember || false,
                        familyMemberId: nextPerson.userPlan.familyMemberId || null
                    },
                });

                // If it's a paid class, decrease the sessions count
                if (!freeClass && nextPerson.userPlanId > 0) {
                    await tx.userPlan.update({
                        where: {id: nextPerson.userPlanId},
                        data: {sessionsLeft: {decrement: 1}},
                    });
                }

                // Remove the person from waitlist
                await tx.waitlist.delete({
                    where: {
                        classId_userId: {
                            classId: parseInt(classId),
                            userId: nextPerson.userId
                        }
                    }
                });
            }
        }, {
            timeout: 10000 // Increase timeout to 10 seconds
        });

        // Send email notification outside of the transaction
        if (nextPerson && classInfo) {
            // Determine if this is for a family member
            const recipientText = nextPerson.familyMember ?
                "This registration is for your family member." : "";

            const emailData = {
                recipientType: 'user',
                senderId: classInfo.affiliateId,
                recipientId: nextPerson.userId,
                subject: `You've been registered for ${classInfo.trainingName}`,
                body: `
Dear ${nextPerson.user.fullName},

Good news! A spot has opened up in the class "${classInfo.trainingName}" scheduled for ${new Date(classInfo.time).toLocaleString()}.

You have been automatically registered for this class from the waitlist.
${recipientText}

Time: ${new Date(classInfo.time).toLocaleString()}
Trainer: ${classInfo.trainer || 'N/A'}

We look forward to seeing you there!

IronTrack Team
                `,
                affiliateEmail: classInfo.affiliate.email
            };

            try {
                // Use your sendMessage function
                await sendMessage(emailData);
            } catch (emailError) {
                console.error('Error sending notification email:', emailError);
                // Continue with success response even if email fails
            }
        }

        res.status(200).json({message: "Registration cancelled successfully!"});
    } catch (error) {
        console.error("❌ Error canceling registration:", error);
        res.status(500).json({error: "Failed to cancel registration."});
    }
};

// ✅ Kontrolli, kas kasutaja on klassis registreeritud
const checkUserEnrollment = async (req, res) => {
    const classId = parseInt(req.query.classId);
    const userId = req.user.id;

    try {
        const enrollment = await prisma.classAttendee.findFirst({
            where: {
                classId,
                userId: parseInt(userId)
            },
        });

        res.json({enrolled: !!enrollment});
    } catch (error) {
        console.error("❌ Error checking enrollment:", error);
        res.status(500).json({error: "Failed to check enrollment."});
    }
};

const checkClassScore = async (req, res) => {
    try {
        const {classId} = req.query;
        const userId = req.user?.id;

        if (!classId) {
            return res.status(400).json({error: "Class ID is required"});
        }

        if (!userId) {
            return res.status(401).json({error: "User not authenticated"});
        }

        const existing = await prisma.classLeaderboard.findFirst({
            where: {classId: parseInt(classId), userId},
        });

        if (!existing) {
            return res.json({hasScore: false});
        }

        res.json({
            hasScore: true,
            scoreType: existing.scoreType,
            score: existing.score
        });
    } catch (error) {
        console.error("Error checking class score:", error);
        res.status(500).json({error: "Failed to check class score"});
    }
};

const addClassScore = async (req, res) => {
    try {
        const {classData, scoreType, score} = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({error: "User not authenticated"});
        }

        if (!classData?.id || !scoreType || score === undefined) {
            return res.status(400).json({error: "Missing required fields: classData.id, scoreType, or score"});
        }

        // Check if this score already exists
        const existing = await prisma.classLeaderboard.findFirst({
            where: {classId: parseInt(classData.id), userId},
        });

        if (existing) {
            return res.status(400).json({error: "Score already exists. Please update instead."});
        }

        // Create new score
        await prisma.classLeaderboard.create({
            data: {
                classId: parseInt(classData.id),
                userId,
                scoreType,
                score
            },
        });

        // Create training record if class data is complete
        if (classData.trainingType && classData.time) {
            await prisma.training.create({
                data: {
                    userId: userId,
                    type: classData.trainingType,
                    score: score,
                    date: classData.time,
                    wodName: classData.wodName || null,
                    wodType: classData.wodType || null,
                    exercises: classData.description ? {
                        create: {
                            exerciseData: classData.description,
                        }
                    } : undefined
                }
            });
        }

        res.status(200).json({message: "Score added successfully."});
    } catch (error) {
        console.error("Error adding class score:", error);
        res.status(500).json({error: "Failed to add class score"});
    }
};

const updateClassScore = async (req, res) => {
    try {
        const {classData, scoreType, score} = req.body;
        const userId = req.user.id;

        // Kontrolli, et kirje on olemas
        const existing = await prisma.classLeaderboard.findFirst({
            where: {classId: parseInt(classData.id), userId},
        });
        if (!existing) {
            return res
                .status(400)
                .json({error: "No existing score found for this class."});
        }

        // Uuenda
        await prisma.classLeaderboard.update({
            where: {id: existing.id},
            data: {
                scoreType,
                score
            },
        });

        res.status(200).json({message: "Score updated successfully."});
    } catch (error) {
        console.error("Error updating class score:", error);
        res.status(500).json({error: "Failed to update class score"});
    }
};

// UPDATED: Get waitlist for a class with family member info
const getWaitlist = async (req, res) => {
    const {classId} = req.query;

    try {
        const waitlist = await prisma.waitlist.findMany({
            where: {
                classId: parseInt(classId)
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                userPlan: true
            },
            orderBy: {
                createdAt: 'asc' // Oldest first to maintain fairness
            }
        });

        res.status(200).json(waitlist);
    } catch (error) {
        console.error("❌ Error getting waitlist:", error);
        res.status(500).json({error: "Failed to get waitlist"});
    }
};

// UPDATED: Create waitlist entry with family member support
const createWaitlist = async (req, res) => {
    const {classId, userPlanId, familyMember, familyMemberId} = req.body;
    const userId = req.user?.id;

    if (!classId || !userId) {
        return res.status(400).json({error: "Class ID and User ID required"});
    }

    // Validate familyMember boolean and familyMemberId if familyMember is true
    const isFamilyMember = familyMember === true;
    let familyId = null;

    if (isFamilyMember) {
        if (!familyMemberId) {
            return res.status(400).json({error: "Family member ID is required when booking for a family member"});
        }

        // Verify the family member belongs to this user
        const validFamilyMember = await prisma.familyMember.findFirst({
            where: {
                id: parseInt(familyMemberId),
                userId: parseInt(userId)
            }
        });

        if (!validFamilyMember) {
            return res.status(400).json({error: "Invalid family member selected"});
        }

        familyId = parseInt(familyMemberId);
    }

    try {
        // First check if the class is full
        const classInfo = await prisma.classSchedule.findUnique({
            where: {id: parseInt(classId)},
            select: {
                memberCapacity: true,
                freeClass: true,
                affiliateId: true
            }
        });

        if (!classInfo) {
            return res.status(404).json({error: "Class not found"});
        }

        const enrolledCount = await prisma.classAttendee.count({
            where: {classId: parseInt(classId)}
        });

        if (enrolledCount < classInfo.memberCapacity) {
            return res.status(400).json({error: "Class is not full"});
        }

        // Check if user is already in waitlist
        const existingWaitlist = await prisma.waitlist.findFirst({
            where: {
                classId: parseInt(classId),
                userId: parseInt(userId),
            }
        });

        if (existingWaitlist) {
            return res.status(400).json({
                error: isFamilyMember
                    ? "This family member is already in the waitlist for this class"
                    : "You are already in the waitlist for this class"
            });
        }

        // For free classes, we don't need to verify the plan
        if (!classInfo.freeClass && userPlanId) {
            const plan = await prisma.userPlan.findFirst({
                where: {
                    id: parseInt(userPlanId),
                    userId: parseInt(userId),
                    affiliateId: classInfo.affiliateId,

                }
            });

            if (!plan) {
                return res.status(400).json({error: "Invalid plan selected"});
            }

            if (plan.sessionsLeft <= 0) {
                return res.status(400).json({error: "Selected plan has no sessions left"});
            }
        }

        // Add user to waitlist with family member info
        const waitlistEntry = await prisma.waitlist.create({
            data: {
                classId: parseInt(classId),
                userId: parseInt(userId),
                userPlanId: userPlanId ? parseInt(userPlanId) : 0, // 0 for free classes

            }
        });

        res.status(201).json({
            message: "Successfully added to waitlist",
            waitlistEntry
        });

    } catch (error) {
        console.error("❌ Error adding to waitlist:", error);
        res.status(500).json({error: "Failed to add to waitlist"});
    }
};

const deleteWaitlist = async (req, res) => {
    const {classId} = req.body;
    const userId = req.user?.id
    if (!classId || !userId) return res.status(400).json({error: "Class ID and User ID required"});
    try {
        await prisma.waitlist.deleteMany({
            where: {classId, userId}
        });
        res.status(200).json({message: "Successfully removed from waitlist"});
    } catch (error) {
        console.error("Error removing from waitlist:", error);
        res.status(500).json({error: "Failed to remove from waitlist"});
    }
}

const addClassToMyTrainings = async (req, res) => {
    const {classId, addCompetition} = req.body;
    const userId = req.user?.id;

    if (!classId || !userId) {
        return res.status(400).json({error: "Class ID and User ID required"});
    }

    try {
        const classInfo = await prisma.classSchedule.findUnique({
            where: {id: parseInt(classId)},
        });

        if (!classInfo) {
            return res.status(404).json({error: "Class not found"});
        }

        let description = classInfo.description || "";

        // If addCompetition flag is true and there is competition info,
        // append it to the description with a header
        if (addCompetition && classInfo.competitionInfo) {
            description += "\n\n<b>Competition Extra:</b>\n" + classInfo.competitionInfo;
        }

        await prisma.training.create({
            data: {
                userId,
                type: classInfo.trainingType,
                date: classInfo.time,
                wodName: classInfo.wodName || null,
                wodType: classInfo.wodType || null,
                exercises: description ? {
                    create: {
                        exerciseData: description,
                    }
                } : undefined
            }
        });

        res.status(200).json({message: "Class added to My Trainings successfully!"});
    } catch (error) {
        console.error("❌ Error adding class to My Trainings:", error);
        res.status(500).json({error: "Failed to add class to My Trainings"});
    }
}

module.exports = {
    getClassInfo,
    getClasses,
    createClass,
    updateClass,
    deleteClass,
    getClassAttendees,
    registerForClass,
    cancelRegistration,
    checkUserEnrollment,
    getClassAttendeesCount,
    checkInAttendee,
    deleteAttendee,
    addClassScore,
    updateClassScore,
    checkClassScore,
    getWaitlist,
    createWaitlist,
    deleteWaitlist,
    addClassToMyTrainings
};