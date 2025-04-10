const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/records?type=...
exports.getRecords = async (req, res) => {
    const type = req.query.type || 'WOD';

    try {
        const userId = req.user.id; // JWT abil saadud kasutaja ID
        // Leia kõik salvestused
        const records = await prisma.record.findMany({
            where: { userId, type },
            orderBy: { date: 'desc' },
        });

        // Tagastame iga name kohta ainult viimase
        const latestRecords = [];
        const namesSet = new Set();

        records.forEach((record) => {
            if (!namesSet.has(record.name)) {
                latestRecords.push(record);
                namesSet.add(record.name);
            }
        });

        res.json(latestRecords);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records.' });
    }
};

// GET /api/records/:name?type=...
exports.getRecordsByName = async (req, res) => {
    const { name } = req.params;
    const type = req.query.type || 'WOD';

    try {
        const userId = req.user.id; // JWT
        const records = await prisma.record.findMany({
            where: { userId, type, name },
            orderBy: { date: 'desc' },
            select: {
                id: true,
                date: true,
                score: true,
                weight: true,
                time: true,
                comment: true,
            },
        });

        res.json(records);
    } catch (error) {
        console.error('Error fetching records by name:', error);
        res.status(500).json({ error: 'Failed to fetch records by name.' });
    }
};

// GET /api/records/stats/:name?type=...
exports.getRecordStats = async (req, res) => {
    const { name } = req.params;
    const type = req.query.type || 'WOD';

    try {
        const userId = req.user.id;
        const records = await prisma.record.findMany({
            where: { userId, type, name },
            orderBy: { date: 'asc' },
            select: {
                id: true,
                date: true,
                score: true,
                weight: true,
                time: true,
                comment: true,
            },
        });

        if (records.length === 0) {
            return res.json({
                best: null,
                worst: null,
                average: null,
                progress: null,
                totalEntries: 0
            });
        }

        let best, worst, average, progress;
        const totalEntries = records.length;

        // Calculate stats based on record type
        if (type === 'Weightlifting') {
            const weights = records.map(r => r.weight).filter(Boolean);

            if (weights.length > 0) {
                best = Math.max(...weights);
                worst = Math.min(...weights);
                average = weights.reduce((sum, w) => sum + w, 0) / weights.length;

                // Progress calculation (first vs last entry)
                if (weights.length >= 2) {
                    const first = records[0].weight;
                    const last = records[records.length - 1].weight;
                    progress = ((last - first) / first) * 100;
                }
            }
        } else if (type === 'Cardio') {
            // For cardio, convert times to seconds for calculation
            const times = records.map(r => {
                if (!r.time) return null;
                const [min, sec] = r.time.split(':').map(Number);
                return min * 60 + sec;
            }).filter(Boolean);

            if (times.length > 0) {
                // For cardio, lower is better
                best = Math.min(...times);
                worst = Math.max(...times);
                average = times.reduce((sum, t) => sum + t, 0) / times.length;

                // Progress calculation (first vs last entry)
                if (times.length >= 2) {
                    const first = times[0];
                    const last = times[times.length - 1];
                    // Negative progress is good for cardio (faster time)
                    progress = ((last - first) / first) * 100;
                }
            }
        } else {
            // WOD - assuming higher score is better, but scores might be strings
            const scores = records.map(r => {
                if (!r.score) return null;
                // Try to convert to number if possible
                const num = parseFloat(r.score);
                return isNaN(num) ? null : num;
            }).filter(Boolean);

            if (scores.length > 0) {
                best = Math.max(...scores);
                worst = Math.min(...scores);
                average = scores.reduce((sum, s) => sum + s, 0) / scores.length;

                // Progress calculation (first vs last entry)
                if (scores.length >= 2) {
                    const first = scores[0];
                    const last = scores[scores.length - 1];
                    progress = ((last - first) / first) * 100;
                }
            }
        }

        res.json({
            best,
            worst,
            average: average !== undefined ? average.toFixed(2) : null,
            progress: progress !== undefined ? progress.toFixed(2) : null,
            totalEntries
        });
    } catch (error) {
        console.error('Error calculating record stats:', error);
        res.status(500).json({ error: 'Failed to calculate record statistics.' });
    }
};

// POST /api/records
exports.createRecord = async (req, res) => {
    const { type, name, date, score, weight, time, comment } = req.body;

    try {
        const userId = req.user.id; // JWT
        // Koosta recordi andmed
        const recordData = {
            type,
            name: name.toUpperCase(),
            date: new Date(date),
            userId,
            score: score || null,
            weight: weight ? parseFloat(weight) : null,
            time: time || null,
            comment: comment || null,
        };

        await prisma.record.create({ data: recordData });

        res.status(201).json({ message: 'Record added successfully!' });
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Failed to add record.' });
    }
};

// PUT /api/records/:id
exports.updateRecord = async (req, res) => {
    const recordId = parseInt(req.params.id, 10);
    const { date, score, weight, time, comment } = req.body;

    try {
        const userId = req.user.id;

        // Check if record exists and belongs to user
        const existingRecord = await prisma.record.findUnique({
            where: { id: recordId },
        });

        if (!existingRecord || existingRecord.userId !== userId) {
            return res.status(404).json({ error: 'Record not found or not authorized.' });
        }

        // Prepare update data
        const updateData = {
            date: date ? new Date(date) : undefined,
            score: score !== undefined ? score : undefined,
            weight: weight !== undefined ? parseFloat(weight) : undefined,
            time: time !== undefined ? time : undefined,
            comment: comment !== undefined ? comment : undefined,
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        // Update the record
        await prisma.record.update({
            where: { id: recordId },
            data: updateData,
        });

        res.status(200).json({ message: 'Record updated successfully!' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record.', details: error.message });
    }
};

// DELETE /api/records/:id
exports.deleteRecord = async (req, res) => {
    const recordId = parseInt(req.params.id, 10);

    try {
        const userId = req.user.id; // JWT
        // Otsi record
        const record = await prisma.record.findUnique({
            where: { id: recordId },
        });

        if (!record || record.userId !== userId) {
            return res.status(404).json({ error: 'Record not found or not authorized.' });
        }

        await prisma.record.delete({
            where: { id: recordId },
        });

        res.status(200).json({ message: 'Record deleted successfully!' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record.', details: error.message });
    }
};