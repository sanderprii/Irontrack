const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all training plans for a user (either created by or assigned to)
exports.getTrainingPlans = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.query.role;
        const selectedUserId = req.query.selectedUserId;

        if (!selectedUserId) {
            return res.status(400).json({ error: 'Selected user ID is required.' });
        }

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
        const { name, trainingDays } = req.body;
        const creatorId = req.user.id;
let userId = req.body.userId;
        // Validate required fields
        if (!name || !userId || !trainingDays || !Array.isArray(trainingDays)) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Validate training days
        for (const day of trainingDays) {
            if (!day.name || !day.sectors || !Array.isArray(day.sectors)) {
                return res.status(400).json({ error: 'Invalid training day format.' });
            }
            for (const sector of day.sectors) {
                if (!sector.type || !sector.content) {
                    return res.status(400).json({ error: 'Invalid sector format.' });
                }
            }
        }

        if ( userId === "self" ) {
            // If userId is "self", set it to the creatorId
            userId = creatorId;
        }

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
                                    create: sector.youtubeLinks?.filter(link => link.url?.trim())?.map(link => ({
                                        url: link.url
                                    })) || []
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
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A training plan with this name already exists.' });
        }
        res.status(500).json({ error: 'Failed to create training plan.' });
    }
};

// Update a training plan
exports.updateTrainingPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.id, 10);
        const userId = req.user.id;
        const { name, trainingDays } = req.body;

        // Validate required fields
        if (!name || !trainingDays || !Array.isArray(trainingDays)) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

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

        // Delete all existing training days and their related records
        await prisma.trainingDay.deleteMany({
            where: { trainingPlanId: planId }
        });

        // Update plan name and create new training days
        const updatedPlan = await prisma.trainingPlan.update({
            where: { id: planId },
            data: {
                name,
                trainingDays: {
                    create: trainingDays.map(day => ({
                        name: day.name,
                        sectors: {
                            create: day.sectors.map(sector => ({
                                type: sector.type,
                                content: sector.content,
                                youtubeLinks: {
                                    create: sector.youtubeLinks?.filter(link => link.url?.trim())?.map(link => ({
                                        url: link.url
                                    })) || []
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

        res.json(updatedPlan);
    } catch (error) {
        console.error('Error updating training plan:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'A training plan with this name already exists.' });
        }
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

        // Both the creator and the assigned user can delete the plan
        if (existingPlan.creatorId !== userId && existingPlan.userId !== userId) {
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
        const { trainingDayId, content } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!trainingDayId || !content) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Check if training day exists
        const trainingDay = await prisma.trainingDay.findUnique({
            where: { id: trainingDayId },
            include: {
                trainingPlan: true
            }
        });

        if (!trainingDay) {
            return res.status(404).json({ error: 'Training day not found.' });
        }

        // Check if user has access to this training day
        if (trainingDay.trainingPlan.creatorId !== userId && trainingDay.trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to add comments to this training day.' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                userId,
                trainingDayId
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

// Add a sector to a training day
exports.addSector = async (req, res) => {
    try {
        const { trainingDayId, type, content, youtubeLinks } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!trainingDayId || !type || !content) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Check if training day exists
        const trainingDay = await prisma.trainingDay.findUnique({
            where: { id: trainingDayId },
            include: {
                trainingPlan: true
            }
        });

        if (!trainingDay) {
            return res.status(404).json({ error: 'Training day not found.' });
        }

        // Check if user has access to this training day
        if (trainingDay.trainingPlan.creatorId !== userId && trainingDay.trainingPlan.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to add sectors to this training day.' });
        }

        const sector = await prisma.trainingSector.create({
            data: {
                type,
                content,
                trainingDayId,
                youtubeLinks: {
                    create: youtubeLinks?.filter(link => link.url?.trim())?.map(link => ({
                        url: link.url
                    })) || []
                }
            },
            include: {
                youtubeLinks: true
            }
        });

        res.status(201).json(sector);
    } catch (error) {
        console.error('Error adding sector:', error);
        res.status(500).json({ error: 'Failed to add sector.' });
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

        // Map sector type to training type - now correctly handles all training types
        let trainingType;
        switch (sector.type) {
            case 'WOD':
                trainingType = 'WOD';
                break;
            case 'Weightlifting':
                trainingType = 'Weightlifting';
                break;
            case 'Cardio':
                trainingType = 'Cardio';
                break;
            case 'Rowing':
                trainingType = 'Rowing';  // Now correctly maps Rowing
                break;
            case 'Gymnastics':
                trainingType = 'Gymnastics';  // Now correctly maps Gymnastics
                break;
            default:
                trainingType = 'Other';
        }

        // Create a new training
        const training = await prisma.training.create({
            data: {
                type: trainingType,  // This will now be the correct type including Rowing/Gymnastics
                date: new Date(),
                wodName: trainingType === 'WOD' ? `${sector.trainingDay.trainingPlan.name} - ${sector.trainingDay.name}` : null,
                wodType: trainingType === 'WOD' ? 'Training Plan' : null,
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