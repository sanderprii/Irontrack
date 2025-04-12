    // server/src/controllers/statisticsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStatistics = async (req, res) => {
    try {
        const { userId, affiliateId } = req.query;

        // -- Konverteerime userId numbriks, kui see olemas
        let userIdNum = null;
        if (userId) {
            userIdNum = parseInt(userId, 10);
        }

        // -- 1) Otsime useri (kui userId on antud), et saada homeAffiliate
        let user = null;
        let homeAffiliateName = null;
        let homeAffiliateId = null;

        if (userIdNum) {
            user = await prisma.user.findUnique({
                where: { id: userIdNum },
                select: {
                    homeAffiliate: true, // int
                },
            });
            if (user && user.homeAffiliate) {
                homeAffiliateId = user.homeAffiliate;
                // leiame affiliate, et saada nimi
                const aff = await prisma.affiliate.findUnique({
                    where: { id: homeAffiliateId },
                    select: { name: true },
                });
                homeAffiliateName = aff?.name || null;
            }
        }

        // -- 2) Treeningute type-count (WOD, Weightlifting, Cardio, Other)
        const trainingWhere = {};
        if (userIdNum) {
            trainingWhere.userId = userIdNum;
        }
        if (affiliateId) {
            // soovi korral lisa tingimus trainingWhere.affiliateId = parseInt(affiliateId, 10);
        }

        const trainingTypes = ["WOD", "Weightlifting", "Cardio", "Gymnastics", "Rowing", "Other"];
        const trainingTypeCounts = {
            WOD: 0,
            Weightlifting: 0,
            Cardio: 0,
            Other: 0,
            Rowing: 0,
            Gymnastics: 0,
        };

        // toome välja treeningud
        const allTrainings = await prisma.training.findMany({
            where: trainingWhere,
            select: { type: true },
        });
        allTrainings.forEach((t) => {
            if (trainingTypes.includes(t.type)) {
                trainingTypeCounts[t.type] += 1;
            } else {
                trainingTypeCounts.Other += 1;
            }
        });

        // -- 3) Treeningud kuude kaupa
        const monthlyFromDb = await prisma.training.findMany({
            where: trainingWhere,
            select: { date: true },
        });
        const monthlyMap = {};
        monthlyFromDb.forEach((tr) => {
            if (tr.date) {
                const d = new Date(tr.date);
                const m = d.getMonth() + 1;
                monthlyMap[m] = (monthlyMap[m] || 0) + 1;
            }
        });
        const monthlyTrainings = Object.keys(monthlyMap).map((m) => ({
            month: parseInt(m, 10),
            count: monthlyMap[m],
        }));

        // -- 4) Treeningud aastate kaupa
        const yearlyMap = {};
        monthlyFromDb.forEach((tr) => {
            if (tr.date) {
                const year = new Date(tr.date).getFullYear();
                yearlyMap[year] = (yearlyMap[year] || 0) + 1;
            }
        });
        const yearlyTrainings = Object.keys(yearlyMap).map((y) => ({
            year: parseInt(y, 10),
            count: yearlyMap[y],
        }));

        // -- 5) Aasta "skoor" -> leaderboard sisestused
        const leaderboardWhere = {};
        if (userIdNum) {
            leaderboardWhere.userId = userIdNum;
        }
        if (affiliateId) {
            // soovi korral lisa: leaderboardWhere.affiliateId = parseInt(affiliateId, 10);
        }

        const leaderboardEntries = await prisma.classLeaderboard.findMany({
            where: leaderboardWhere,
            select: { createdAt: true },
        });
        const yearlyScoreMap = {};
        leaderboardEntries.forEach((entry) => {
            if (entry.createdAt) {
                const y = new Date(entry.createdAt).getFullYear();
                yearlyScoreMap[y] = (yearlyScoreMap[y] || 0) + 1;
            }
        });
        const yearlyScores = Object.keys(yearlyScoreMap).map((y) => ({
            year: parseInt(y, 10),
            score: yearlyScoreMap[y],
        }));

        // -- 6) HomeAffiliate treeningud (ClassAttendee, checkIn=true)
        // Vaatame, mitu korda kasutaja (userId) käis kodus affiliate-is
        // classSchedule.affiliateId = user.homeAffiliate
        let homeAffiliateYearlyTrainings = [];
        if (homeAffiliateId && userIdNum) {
            const homeCheckIns = await prisma.classAttendee.findMany({
                where: {
                    userId: userIdNum,
                    checkIn: true,
                    isFamilyMember: false, // Exclude family member attendances
                    classSchedule: {
                        affiliateId: homeAffiliateId,
                    },
                },
                // peame välja tooma classSchedule.time, et saaks aastad kätte
                include: {
                    classSchedule: {
                        select: { time: true },
                    },
                },
            });

            const hafMap = {}; // { 2022: arv, 2023: arv, ... }
            homeCheckIns.forEach((att) => {
                const t = att.classSchedule?.time;
                if (t) {
                    const year = new Date(t).getFullYear();
                    hafMap[year] = (hafMap[year] || 0) + 1;
                }
            });

            homeAffiliateYearlyTrainings = Object.keys(hafMap).map((y) => ({
                year: parseInt(y, 10),
                count: hafMap[y],
            }));
        }

        // -- Tagastame vastuse
        res.json({
            trainingTypeCounts,
            monthlyTrainings,
            yearlyTrainings,
            yearlyScores,
            homeAffiliateName,
            homeAffiliateYearlyTrainings,
        });
    } catch (err) {
        console.error("❌ Error in getStatistics:", err);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getAllStatistics = async (req, res) => {
    // võta kogu kasutajate arv, treeningute arv, mille time on tänasest möödas, rekordite arv
    try {
        const userCount = await prisma.user.count();

        const pastTrainings = await prisma.classSchedule.count({
            where: {
                time: {
                    lt: new Date(),
                },

            },
        });
        const recordCount = await prisma.record.count();

        res.json({
            users: userCount,

            trainings: pastTrainings,
            records: recordCount,
        });
    } catch (err) {
        console.error("❌ Error in getAllStatistics:", err);
        res.status(500).json({ error: "Server error" });
    }
}