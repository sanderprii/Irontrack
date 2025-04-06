const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ensureAuthenticated = require("../middlewares/ensureAuthenticatedJWT");


// 📌 GET: Kõik tellimused
router.get("/orders", ensureAuthenticated, async (req, res) => {
    try {
        const affiliateIds = parseInt(req.query.affiliateId);

        const orders = await prisma.userPlan.findMany({
            where: { affiliateId: { in: Array.isArray(affiliateIds) ? affiliateIds : [affiliateIds] } },
            include: { user: { select: { fullName: true, email: true } } },
            orderBy: { purchasedAt: "desc" }
        });

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 📌 GET: Ühe kasutaja tellimused
router.get("/orders/:userId", ensureAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.userId);

    try {
        const orders = await prisma.userPlan.findMany({
            where: { userId },
            include: { user: { select: { fullName: true, email: true } } },
            orderBy: { purchasedAt: "desc" }
        });

        res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 📌 Endpoint to get revenue and transaction data for a specific affiliate
router.get('/finance', ensureAuthenticated, async (req, res) => {
    try {
        const { startDate, endDate, affiliateId } = req.query;

        // 📌 Default date range (current year)
        const currentYear = new Date().getFullYear();
        const defaultStart = new Date(`${currentYear}-01-01`);
        const defaultEnd = new Date(`${currentYear}-12-31`);

        const start = startDate ? new Date(startDate) : defaultStart;
        const end = endDate ? new Date(endDate) : defaultEnd;

        // 📌 Ensure affiliateId is a number
        const affiliateIds = parseInt(affiliateId);

        if (!affiliateIds) {
            return res.status(403).json({ error: "No affiliate access" });
        }

        // 📌 Calculate total revenue from all transactions including credits
        const revenueResult = await prisma.transactions.aggregate({
            _sum: { amount: true },
            where: {
                affiliateId: affiliateIds,
                createdAt: { gte: start, lte: end }
                // No filter on decrease or isCredit to include all transactions
            }
        });

        // 📌 Analyze transaction types and plans (keeping original filter for plans)
        const plansSold = await prisma.transactions.groupBy({
            by: ['type', 'description'],
            _count: { type: true },
            where: {
                affiliateId: affiliateIds,
                createdAt: { gte: start, lte: end },
                decrease: true
            },
            orderBy: { _count: { type: 'desc' } }
        });

        // 📌 Calculate member statistics
        const activeMembers = await prisma.members.count({
            where: {
                affiliateId: affiliateIds,
                isActive: true
            }
        });

        const expiredMembers = await prisma.members.count({
            where: {
                affiliateId: affiliateIds,
                isActive: false
            }
        });

        const totalMembers = await prisma.members.count({
            where: { affiliateId: affiliateIds }
        });

        // 📌 Return response with total revenue including credits
        res.json({
            revenue: revenueResult._sum.amount || 0,
            plansSold,
            activeMembers,
            expiredMembers,
            totalMembers
        });

    } catch (error) {
        console.error("❌ Error fetching finance data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;