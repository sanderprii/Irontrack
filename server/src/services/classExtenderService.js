const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Extends repeating classes by adding a new class one week after the latest one
 * This is run weekly to ensure there's always a future class available for registration
 */
async function extendRepeatingClasses() {
    console.log('Starting to extend repeating classes');

    try {
        // Get all distinct seriesIds where repeatWeekly is true
        const seriesClasses = await prisma.classSchedule.findMany({
            where: {
                repeatWeekly: true,
                seriesId: {
                    not: null
                }
            },
            select: {
                seriesId: true
            },
            distinct: ['seriesId']
        });

        console.log(`Found ${seriesClasses.length} series with repeatWeekly=true`);
        let createdCount = 0;

        // For each seriesId, find the class with the latest time and add a new one
        for (const { seriesId } of seriesClasses) {
            // Find the class with the latest time for this seriesId
            const latestClass = await prisma.classSchedule.findFirst({
                where: {
                    seriesId,
                    repeatWeekly: true
                },
                orderBy: {
                    time: 'desc'
                }
            });

            if (!latestClass) {
                console.log(`No latest class found for seriesId ${seriesId}, skipping`);
                continue;
            }

            // Calculate the new time (one week later)
            const newTime = new Date(latestClass.time);
            newTime.setDate(newTime.getDate() + 7);

            // Create a new class with the same data but time + 1 week
            const newClass = await prisma.classSchedule.create({
                data: {
                    trainingType: latestClass.trainingType,
                    trainingName: latestClass.trainingName,
                    time: newTime,
                    duration: latestClass.duration,
                    trainer: latestClass.trainer,
                    memberCapacity: latestClass.memberCapacity,
                    location: latestClass.location,
                    repeatWeekly: latestClass.repeatWeekly,
                    ownerId: latestClass.ownerId,
                    affiliateId: latestClass.affiliateId,
                    seriesId: latestClass.seriesId,
                    wodName: latestClass.wodName || '',
                    wodType: latestClass.wodType,
                    description: latestClass.description,
                    canRegister: latestClass.canRegister,
                    freeClass: latestClass.freeClass
                }
            });

            createdCount++;
            console.log(`Created new class for seriesId ${seriesId} with time ${newTime.toISOString()}`);
        }

        console.log(`Finished extending repeating classes: added ${createdCount} new classes`);
        return { success: true, count: createdCount };
    } catch (error) {
        console.error('Error extending repeating classes:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    extendRepeatingClasses
};