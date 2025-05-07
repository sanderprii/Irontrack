const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();



// ✅ Fetch today's WOD
const getWeekWODs = async (req, res) => {
    const { affiliateId } = req.query;

    if (!affiliateId) {
        return res.status(400).json({ error: "Affiliate ID is required." });
    }
const startDate = new Date(req.query.startDate);
    try {
        // ✅ Leia nädala algus ja lõpp
        const startOfWeek = new Date(startDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // ✅ Tõmba kõik WODid selle nädala jaoks
        const weekWODs = await prisma.todayWOD.findMany({
            where: {
                affiliateId: parseInt(affiliateId),
                date: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            },
            orderBy: { date: "asc" }
        });

        return res.json(weekWODs);
    } catch (error) {
        console.error("❌ Error fetching week WODs:", error);
        res.status(500).json({ error: "Failed to fetch week WODs." });
    }
};

// ✅ Create or Update Today's WOD
const saveTodayWOD = async (req, res) => {
    const { affiliateId, wodName, wodType, description, date, notes, competitionInfo } = req.body; // ✅ Ainult ühe päeva andmed

    if (!affiliateId) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const existingWOD = await prisma.todayWOD.findFirst({
            where: { affiliateId: parseInt(affiliateId), date: new Date(date) }
        });

        if (wodName !== "") {
            const isDefaultWOD = await prisma.defaultWOD.findFirst({
                where: { name: wodName }
            } );
            if (!isDefaultWOD) {
                await prisma.defaultWOD.create({
                    data: {
                        name: wodName || "",
                        type: wodType,
                        description: description || "",

                    }
                });
            }
        }

        if (existingWOD) {
            // ✅ Uuenda, kui see päev on juba olemas
            await prisma.todayWOD.update({
                where: { id: existingWOD.id },
                data: { wodName, type: wodType, description, notes, competitionInfo, isApplied: false }
            });
            return res.json({ message: "WOD updated successfully." });
        } else {
            // ✅ Lisa uus WOD, kui pole olemas
            await prisma.todayWOD.create({
                data: {
                    affiliateId: parseInt(affiliateId),
                    wodName,
                    type: wodType,
                    description,
                    date: new Date(date),
                    notes,
                    competitionInfo,

                }
            });
            return res.json({ message: "WOD added successfully." });
        }


    } catch (error) {
        console.error("❌ Error saving today's WOD:", error);
        res.status(500).json({ error: "Failed to save WOD." });
    }
};

const getTodayWOD = async (req, res) => {
    const { affiliateId, date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required." });

    try {
        // Parsime kuupäeva ja loome alguse ja lõpu kuupäeva objektid
        const dateObj = new Date(date);
        const startOfDay = new Date(dateObj);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateObj);
        endOfDay.setHours(23, 59, 59, 999);

        // Otsime WOD-i, mille kuupäev on sama päeva sees
        const wod = await prisma.todayWOD.findFirst({
            where: {
                affiliateId: parseInt(affiliateId),
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });

        if (!wod) return res.status(404).json({ error: "No WOD found for this date." });

        res.json(wod);
    } catch (error) {
        console.error("❌ Error fetching WOD:", error);
        res.status(500).json({ error: "Failed to fetch WOD." });
    }
};

// ✅ Apply WOD to Today's Trainings
const applyWODToTrainings = async (req, res) => {
    const date = req.body.date;
    const affiliateId = req.body.affiliateId;
    if (!date) return res.status(400).json({error: "Date is required."});

    const affiliateIds = parseInt(affiliateId);

    try {
        // Määrame päeva alguse ja lõpu ajad
        const dateObj = new Date(date);
        const startOfDay = new Date(dateObj);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(dateObj);
        endOfDay.setHours(23, 59, 59, 999);

        // Otsime WOD-i selle kuupäeva järgi, kellaaegasid arvestamata
        const wod = await prisma.todayWOD.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                affiliateId: affiliateIds
            }
        });

        if (!wod) return res.status(404).json({error: "No WOD found for this date."});

        // Määrame päeva alguse ja lõpu kõikide treeningute jaoks,
        // et saaks kõik selle päeva treeningud kätte
        const nextDay = new Date(dateObj);
        nextDay.setDate(dateObj.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);

        // Apply WOD to all classes with `trainingType: "WOD"`
        await prisma.classSchedule.updateMany({
            where: {
                time: {
                    gte: startOfDay,
                    lt: nextDay
                },
                trainingType: "WOD",
                affiliateId: affiliateIds
            },
            data: {
                wodName: wod.wodName,
                wodType: wod.type,
                description: wod.description,
                competitionInfo: wod.competitionInfo,
            }
        });

        await prisma.todayWOD.update ({
            where: { id: wod.id },
            data: { isApplied: true }
        });

        res.json({message: "WOD applied to all trainings for this date!"});
    } catch (error) {
        console.error("❌ Error applying WOD to trainings:", error);
        res.status(500).json({error: "Failed to apply WOD to trainings."});
    }
};


module.exports = { getTodayWOD, getWeekWODs, saveTodayWOD, applyWODToTrainings };
