const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getClassLeaderboard = async (req, res) => {
    const classId = parseInt(req.query.classId);
    if (!classId) {
        return res.status(400).json({ error: "Class ID is required." });
    }

    try {
        // First, get the class to know its wodName
        const classInfo = await prisma.classSchedule.findUnique({
            where: { id: classId },
            select: { wodName: true }
        });

        // Get the leaderboard entries
        const leaderboard = await prisma.classLeaderboard.findMany({
            where: { classId },
            include: {
                user: {
                    select: { id: true, fullName: true },
                },
            },
            orderBy: { score: "desc" },
        });

        // If there's a wodName, try to find previous records for each user
        const leaderboardWithPrevious = await Promise.all(
            leaderboard.map(async (entry) => {
                let previousRecord = null;

                if (classInfo?.wodName) {
                    // Find the most recent record that matches the wodName (case insensitive)
                    previousRecord = await prisma.record.findFirst({
                        where: {
                            userId: entry.userId,
                            name: {
                                equals: classInfo.wodName.toUpperCase(),
                                mode: 'insensitive'
                            },
                            // Get records older than this leaderboard entry
                            date: {
                                lt: entry.createdAt
                            }
                        },
                        orderBy: {
                            date: 'desc' // Get the most recent one
                        },
                        select: {
                            type: true,
                            score: true,
                            time: true,
                            weight: true
                        }
                    });
                }

                // Determine what field to use for previous score based on the record type
                let previousScore = null;
                if (previousRecord) {
                    if (previousRecord.type === 'WOD' && previousRecord.score) {
                        previousScore = previousRecord.score;
                    } else if (previousRecord.type === 'Cardio' && previousRecord.time) {
                        previousScore = previousRecord.time;
                    } else if (previousRecord.type === 'Weightlifting' && previousRecord.weight) {
                        previousScore = `${previousRecord.weight} KG`;
                    }
                }

                return {
                    id: entry.id,
                    fullName: entry.user.fullName || "Anonymous",
                    score: entry.score,
                    scoreType: entry.scoreType.toLowerCase(),
                    previousScore
                };
            })
        );

        res.json(leaderboardWithPrevious);
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
};

module.exports = { getClassLeaderboard };