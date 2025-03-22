const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all training plans for a user (either created by or assigned to)
exports.getTrainingPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.query.role;
        const selectedUserId = req.query.selectedUserId;


        let trainingPlans;
        if (role === 'affiliate' || role === 'trainer') {
            // Trainers/affiliates see plans they created
            trainingPlans = await prisma.trainingPlan.findMany({
                where: {
                    creatorId: parseInt(userId),
                    userId: parseInt(selectedUserId),
                },
                include: {
                    user: {
                        select: {
                            fullName: true
                        }
                    },
                    creator: {
                        select: {
                            fullName: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            // Regular users see plans assigned to them
            trainingPlans = await prisma.trainingPlan.findMany({
                where: {
                    userId: userId
                },
                include: {
                    creator: {
                        select: {
                            fullName: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        res.json(trainingPlans);
    } catch (error) {
        console.error('Error fetching training plans:', error);
        res.status(500).json({ error: 'Failed to load training plans.' });
    }
};

// Get a single training plan by ID
exports.getTrainingPlanById = async (req, res) => {
    try {
        const planId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        const trainingPlan = await prisma.trainingPlan.findUnique({
            where: { id: planId },
            include: {
                trainingDays: {
                    include: {
                        sectors: {
                            include: {
                                youtubeLinks: true
                            }
                        },
                        comments: {
                            include: {
                                user: {
                                    select: {
                                        fullName: true
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    },
                    orderBy: {
                        name: 'asc'
                    }
                },
                creator: {
                    select: {
                        fullName: true,
                        id: true
                    }
                },
                user: {
                    select: {
                        fullName: true,
                        id: true
                    }
                }
            }
        });

        if (!trainingPlan) {
            return res.status(404).json({ error: 'Training plan not found.' });
        }

        // Check if the user has access to this plan
        if (trainingPlan.creatorId !== userId && trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to view this training plan.' });
        }

        res.json(trainingPlan);
    } catch (error) {
        console.error('Error fetching training plan:', error);
        res.status(500).json({ error: 'Failed to load training plan.' });
    }
};

// Create a new training plan
exports.createTrainingPlan = async (req, res) => {
    try {
        const { name, userId, trainingDays } = req.body;
        const creatorId = req.user.id;


        // Verify the user has permission to create training plans


        const trainingPlan = await prisma.trainingPlan.create({
            data: {
                name,
                creatorId,
                userId,
                trainingDays: {
                    create: trainingDays.map(day => ({
                        name: day.name,
                        sectors: {
                            create: day.sectors.map(sector => ({
                                type: sector.type,
                                content: sector.content,
                                youtubeLinks: {
                                    create: sector.youtubeLinks.filter(link => link.url.trim()).map(link => ({
                                        url: link.url
                                    }))
                                }
                            }))
                        }
                    }))
                }
            },
            include: {
                trainingDays: {
                    include: {
                        sectors: {
                            include: {
                                youtubeLinks: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json(trainingPlan);
    } catch (error) {
        console.error('Error creating training plan:', error);
        res.status(500).json({ error: 'Failed to create training plan.' });
    }
};

// Update a training plan
exports.updateTrainingPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { name, trainingDays } = req.body;

        // Find existing plan
        const existingPlan = await prisma.trainingPlan.findUnique({
            where: { id: planId },
            include: {
                trainingDays: {
                    include: {
                        sectors: {
                            include: {
                                youtubeLinks: true
                            }
                        }
                    }
                }
            }
        });

        if (!existingPlan) {
            return res.status(404).json({ error: 'Training plan not found.' });
        }

        // Check permissions
        if (existingPlan.creatorId !== userId && existingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this training plan.' });
        }

        // First update plan name
        await prisma.trainingPlan.update({
            where: { id: planId },
            data: { name }
        });

        // For each training day in the request...
        for (const day of trainingDays) {
            if (day.id) {
                // Update existing day
                await prisma.trainingDay.update({
                    where: { id: day.id },
                    data: { name: day.name }
                });

                // For each sector in the day...
                for (const sector of day.sectors) {
                    if (sector.id) {
                        // Update existing sector
                        await prisma.trainingSector.update({
                            where: { id: sector.id },
                            data: {
                                type: sector.type,
                                content: sector.content,
                            }
                        });

                        // Delete any existing YouTube links for this sector
                        await prisma.sectorYoutubeLink.deleteMany({
                            where: { trainingSectorId: sector.id }
                        });

                        // Add the new YouTube links
                        for (const link of sector.youtubeLinks) {
                            await prisma.sectorYoutubeLink.create({
                                data: {
                                    url: link.url,
                                    trainingSectorId: sector.id
                                }
                            });
                        }
                    } else {
                        // Create new sector
                        await prisma.trainingSector.create({
                            data: {
                                type: sector.type,
                                content: sector.content,
                                trainingDayId: day.id,
                                youtubeLinks: {
                                    create: sector.youtubeLinks.map(link => ({
                                        url: link.url
                                    }))
                                }
                            }
                        });
                    }
                }
            } else {
                // Create new day
                await prisma.trainingDay.create({
                    data: {
                        name: day.name,
                        trainingPlanId: planId,
                        sectors: {
                            create: day.sectors.map(sector => ({
                                type: sector.type,
                                content: sector.content,
                                youtubeLinks: {
                                    create: sector.youtubeLinks.map(link => ({
                                        url: link.url
                                    }))
                                }
                            }))
                        }
                    }
                });
            }
        }

        // Return the updated plan
        const updatedPlan = await prisma.trainingPlan.findUnique({
            where: { id: planId },
            include: {
                trainingDays: {
                    include: {
                        sectors: {
                            include: {
                                youtubeLinks: true
                            }
                        }
                    }
                }
            }
        });

        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating training plan:', error);
        res.status(500).json({ error: 'Failed to update training plan.' });
    }
};

// Delete a training plan
exports.deleteTrainingPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        // Check if the plan exists and if the user has permission to delete it
        const existingPlan = await prisma.trainingPlan.findUnique({
            where: { id: planId }
        });

        if (!existingPlan) {
            return res.status(404).json({ error: 'Training plan not found.' });
        }

        // Only the user to whom the plan is assigned can delete it
        if (existingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this training plan.' });
        }

        // Delete the plan and all related records (using Prisma's cascading deletes)
        await prisma.trainingPlan.delete({
            where: { id: planId }
        });

        res.json({ message: 'Training plan deleted successfully.' });
    } catch (error) {
        console.error('Error deleting training plan:', error);
        res.status(500).json({ error: 'Failed to delete training plan.' });
    }
};

// Add a comment to a training day
exports.addComment = async (req, res) => {
    try {
        const trainingDayId = parseInt(req.params.id, 10);
        const { content } = req.body;
        const userId = req.user.id;

        // Find the training day
        const trainingDay = await prisma.trainingDay.findUnique({
            where: { id: trainingDayId },
            include: {
                trainingPlan: true
            }
        });

        if (!trainingDay) {
            return res.status(404).json({ error: 'Training day not found.' });
        }

        // Check if the user has access to this training day
        if (trainingDay.trainingPlan.creatorId !== userId && trainingDay.trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to add comments to this training day.' });
        }

        // Create the comment
        const comment = await prisma.sectorComment.create({
            data: {
                content,
                trainingDayId,
                userId
            },
            include: {
                user: {
                    select: {
                        fullName: true
                    }
                }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
};

// Mark a sector as complete
exports.completeSector = async (req, res) => {
    try {
        const sectorId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { completed } = req.body;

        // Find the sector
        const sector = await prisma.trainingSector.findUnique({
            where: { id: sectorId },
            include: {
                trainingDay: {
                    include: {
                        trainingPlan: true
                    }
                }
            }
        });

        if (!sector) {
            return res.status(404).json({ error: 'Sector not found.' });
        }

        // Check if the user is the one to whom the plan is assigned
        if (sector.trainingDay.trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to mark this sector as complete.' });
        }

        // Update the sector
        const updatedSector = await prisma.trainingSector.update({
            where: { id: sectorId },
            data: {
                completed
            }
        });

        res.json(updatedSector);
    } catch (error) {
        console.error('Error completing sector:', error);
        res.status(500).json({ error: 'Failed to complete sector.' });
    }
};

// Add a sector to the user's trainings
exports.addSectorToTraining = async (req, res) => {
    try {
        const sectorId = parseInt(req.params.id, 10);
        const userId = req.user.id;

        // Find the sector with all its details
        const sector = await prisma.trainingSector.findUnique({
            where: { id: sectorId },
            include: {
                trainingDay: {
                    include: {
                        trainingPlan: true
                    }
                }
            }
        });

        if (!sector) {
            return res.status(404).json({ error: 'Sector not found.' });
        }

        // Check if the user is the one to whom the plan is assigned
        if (sector.trainingDay.trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to add this sector to your trainings.' });
        }

        // Determine the training type based on sector type
        let trainingType;
        switch (sector.type) {
            case 'Strength':
                trainingType = 'Weightlifting';
                break;
            case 'WOD':
                trainingType = 'WOD';
                break;
            case 'Essentials':
            default:
                trainingType = 'Other';
        }

        // Create a new training
        const training = await prisma.training.create({
            data: {
                type: trainingType,
                date: new Date(),
                wodName: sector.type === 'WOD' ? `${sector.trainingDay.trainingPlan.name} - ${sector.trainingDay.name}` : null,
                wodType: sector.type === 'WOD' ? 'Training Plan' : null,
                userId,
                exercises: {
                    create: {
                        exerciseData: sector.content
                    }
                }
            },
            include: {
                exercises: true
            }
        });

        res.status(201).json(training);
    } catch (error) {
        console.error('Error adding sector to training:', error);
        res.status(500).json({ error: 'Failed to add sector to training.' });
    }
};