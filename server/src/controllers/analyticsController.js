// server/controllers/analyticsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to convert BigInt values to regular numbers for JSON serialization
const transformBigInts = (data) => {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data === 'bigint') {
        return Number(data);
    }

    if (Array.isArray(data)) {
        return data.map(item => transformBigInts(item));
    }

    if (typeof data === 'object') {
        const transformed = {};
        for (const key in data) {
            if (data[key] instanceof Date) {
                // Keep Date objects as they are
                transformed[key] = data[key];
            } else {
                transformed[key] = transformBigInts(data[key]);
            }
        }
        return transformed;
    }

    return data;
};

// Helper function to validate affiliate ownership
const validateAffiliateAccess = async (userId, affiliateId) => {
    try {
        const affiliate = await prisma.affiliate.findUnique({
            where: { id: parseInt(affiliateId) },
            select: { ownerId: true }
        });

        if (!affiliate || affiliate.ownerId !== userId) {
            throw new Error('Unauthorized access to affiliate data');
        }

        return true;
    } catch (error) {
        console.error("❌ Error validating affiliate access:", error);
        throw error;
    }
};

// Helper function to get date ranges based on period
const getDateRangeForPeriod = (period) => {
    const now = new Date();
    let startDate = new Date(2000, 0, 1); // Default to a very old date for ALL_TIME
    let endDate = new Date(now.getTime() + 86400000); // Tomorrow
    let periodLabel = 'All Time';

    switch(period) {
        case 'LAST_YEAR':
            startDate = new Date(now.getFullYear() - 1, 0, 1); // Jan 1st of previous year
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59); // Dec 31st of previous year
            periodLabel = `Year ${now.getFullYear() - 1}`;
            break;
        case 'THIS_YEAR':
            startDate = new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // Dec 31st of current year
            periodLabel = `Year ${now.getFullYear()}`;
            break;
        case 'LAST_MONTH':
            const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
            const yearOfLastMonth = lastMonth === 11 ? now.getFullYear() - 1 : now.getFullYear();
            startDate = new Date(yearOfLastMonth, lastMonth, 1); // 1st of previous month
            endDate = new Date(yearOfLastMonth, lastMonth + 1, 0, 23, 59, 59); // Last day of previous month
            periodLabel = `${startDate.toLocaleString('default', { month: 'long' })} ${yearOfLastMonth}`;
            break;
        case 'THIS_MONTH':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // 1st of current month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); // Last day of current month
            periodLabel = `${startDate.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
            break;
        case 'LAST_30_DAYS':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            periodLabel = 'Last 30 Days';
            break;
        case 'LAST_90_DAYS':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
            periodLabel = 'Last 90 Days';
            break;
        case 'ALL_TIME':
        default:
            periodLabel = 'All Time';
            break;
    }

    return { startDate, endDate, periodLabel };
};

// Dashboard Overview
const getDashboardOverview = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        await validateAffiliateAccess(req.user.id, affiliateId);

        // Get period parameter, default to THIS_MONTH
        const period = req.query.period || 'THIS_MONTH';
        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get KPIs
        const totalMembers = await prisma.members.count({
            where: { affiliateId, isActive: true }
        });

        const visitsInPeriod = await prisma.classAttendee.count({
            where: {
                affiliateId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const transactionsInPeriod = await prisma.transactions.aggregate({
            where: {
                affiliateId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: { amount: true }
        });

        const today = new Date();
        const activePlans = await prisma.userPlan.count({
            where: {
                affiliateId,
                endDate: { gt: today }
            }
        });

        // Get at-risk members
        const atRiskMembers = await prisma.$queryRaw`
            SELECT m."userId", u."fullName", COUNT(ca.id) as visits
            FROM "Members" m
            JOIN "User" u ON m."userId" = u.id
            LEFT JOIN "ClassAttendee" ca ON ca."userId" = m."userId" AND ca."affiliateId" = m."affiliateId"
              AND ca."createdAt" > NOW() - INTERVAL '30 days'
            WHERE m."affiliateId" = ${affiliateId} AND m."isActive" = true
            GROUP BY m."userId", u."fullName"
            HAVING COUNT(ca.id) <= 1
            LIMIT 5
        `;

        // Get expiring contracts
        const expiringContracts = await prisma.contract.findMany({
            where: {
                affiliateId,
                active: true,
                validUntil: {
                    lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
                }
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            },
            take: 5
        });

        res.json({
            totalMembers,
            visitsInPeriod,
            revenueInPeriod: transactionsInPeriod._sum?.amount || 0,
            activePlans,
            atRiskMembers,
            expiringContracts,
            periodLabel
        });
    } catch (error) {
        console.error("❌ Error in getDashboardOverview:", error);
        res.status(500).json({ error: error.message });
    }
};

const getTopMembersByCheckIns = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'THIS_MONTH';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Query to get the top 10 members by check-ins
        const topMembers = await prisma.$queryRaw`
            SELECT 
                m."userId",
                u."fullName",
                COUNT(ca.id) as check_in_count
            FROM "Members" m
            JOIN "User" u ON m."userId" = u.id
            JOIN "ClassAttendee" ca ON ca."userId" = m."userId" 
                AND ca."affiliateId" = m."affiliateId"
                AND ca."checkIn" = true
                AND ca."createdAt" >= ${startDate}
                AND ca."createdAt" <= ${endDate}
                AND ca."isFamilyMember" = false
            WHERE m."affiliateId" = ${affiliateId} 
              AND m."isActive" = true
            GROUP BY m."userId", u."fullName"
            ORDER BY check_in_count DESC
            LIMIT 10
        `;

        res.json(transformBigInts({
            data: topMembers,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getTopMembersByCheckIns:", error);
        res.status(500).json({ error: error.message });
    }
};

// Activity & Behavior
const getActivityMetrics = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Fetch daily visit counts based on ClassSchedule.time instead of ClassAttendee.createdAt
        const dailyVisits = await prisma.$queryRaw`
            SELECT cs.time::date as date, COUNT(*) as count
            FROM "ClassAttendee" ca
                     JOIN "ClassSchedule" cs ON ca."classId" = cs.id
            WHERE ca."affiliateId" = ${affiliateId}
              AND cs.time >= ${startDate}
              AND cs.time <= ${endDate}
            GROUP BY cs.time::date
            ORDER BY date
        `;



        res.json({
            data: transformBigInts(dailyVisits),
            periodLabel
        });
    } catch (error) {
        console.error("❌ Error in getActivityMetrics:", error);
        res.status(500).json({ error: error.message });
    }
};

const getVisitHeatmap = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_90_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get visit counts by day of week and hour
        const heatmapData = await prisma.$queryRaw`
            SELECT
                CASE WHEN EXTRACT(DOW FROM cs.time AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Tallinn') = 0
                         THEN 7 ELSE EXTRACT(DOW FROM cs.time AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Tallinn') END as "dayOfWeek",
                EXTRACT(HOUR FROM cs.time AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Tallinn') as hour,
                COUNT(ca.id) as count
            FROM "ClassAttendee" ca
                     JOIN "ClassSchedule" cs ON ca."classId" = cs.id
            WHERE ca."affiliateId" = ${affiliateId}
              AND cs.time >= ${startDate}
              AND cs.time <= ${endDate}
            GROUP BY EXTRACT(DOW FROM cs.time AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Tallinn'),
                     EXTRACT(HOUR FROM cs.time AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Tallinn')
            ORDER BY "dayOfWeek", hour
        `;



        // Create a map for fast lookup using a string key like "1-10" for day 1, hour 10
        const dataMap = {};

        // Properly convert the PostgreSQL values to numbers
        for (const item of heatmapData) {
            // Handle both BigInt and Decimal objects from PostgreSQL
            const day = typeof item.dayOfWeek === 'object' ?
                Number(item.dayOfWeek.toString()) :
                Number(item.dayOfWeek);

            const hour = typeof item.hour === 'object' ?
                Number(item.hour.toString()) :
                Number(item.hour);

            const count = typeof item.count === 'bigint' ?
                Number(item.count) :
                Number(item.count);

            const key = `${day}-${hour}`;
            dataMap[key] = count;
        }

        // Add missing hours for a complete heatmap
        const completeHeatmap = [];

        // For each day of the week (1-7)
        for (let day = 1; day <= 7; day++) {
            // For business hours (6AM-11PM)
            for (let hour = 6; hour <= 23; hour++) {
                const key = `${day}-${hour}`;
                completeHeatmap.push({
                    dayOfWeek: day,
                    hour: hour,
                    count: dataMap[key] || 0
                });
            }
        }



        res.json({
            data: completeHeatmap,
            periodLabel
        });
    } catch (error) {
        console.error("❌ Error in getVisitHeatmap:", error);
        res.status(500).json({ error: error.message });
    }
};

const getAtRiskMembers = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_90_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Calculate comparison periods based on selected period length
        const periodLength = endDate.getTime() - startDate.getTime();
        const currentPeriodStart = new Date(endDate.getTime() - (periodLength * 0.33)); // Last third of the period
        const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1); // End of previous period
        const previousPeriodStart = new Date(startDate.getTime()); // Start of previous period

        // Members with significant drop in attendance
        const atRiskMembers = await prisma.$queryRaw`
            SELECT 
              m."userId",
              u."fullName",
              u.email,
              COUNT(CASE WHEN ca."createdAt" >= ${currentPeriodStart} AND ca."createdAt" <= ${endDate} THEN ca.id END) as recent_visits,
              COUNT(CASE WHEN ca."createdAt" >= ${previousPeriodStart} AND ca."createdAt" <= ${previousPeriodEnd} THEN ca.id END) as previous_visits,
              MAX(ca."createdAt") as last_visit
            FROM "Members" m
            JOIN "User" u ON m."userId" = u.id
            LEFT JOIN "ClassAttendee" ca ON ca."userId" = m."userId" AND ca."affiliateId" = m."affiliateId"
                AND ca."createdAt" >= ${startDate} AND ca."createdAt" <= ${endDate}
            WHERE m."affiliateId" = ${affiliateId} 
              AND m."isActive" = true
            GROUP BY m."userId", u."fullName", u.email
            HAVING (COUNT(CASE WHEN ca."createdAt" >= ${currentPeriodStart} AND ca."createdAt" <= ${endDate} THEN ca.id END) = 0 
                   AND COUNT(CASE WHEN ca."createdAt" >= ${previousPeriodStart} AND ca."createdAt" <= ${previousPeriodEnd} THEN ca.id END) > 4)
               OR (COUNT(CASE WHEN ca."createdAt" >= ${currentPeriodStart} AND ca."createdAt" <= ${endDate} THEN ca.id END) <= 1 
                   AND COUNT(CASE WHEN ca."createdAt" >= ${previousPeriodStart} AND ca."createdAt" <= ${previousPeriodEnd} THEN ca.id END) >= 8)
            ORDER BY last_visit ASC
        `;

        res.json({
            data: transformBigInts(atRiskMembers),
            periodLabel,
            comparisonInfo: {
                currentPeriod: `${currentPeriodStart.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
                previousPeriod: `${previousPeriodStart.toLocaleDateString()} to ${previousPeriodEnd.toLocaleDateString()}`
            }
        });
    } catch (error) {
        console.error("❌ Error in getAtRiskMembers:", error);
        res.status(500).json({ error: error.message });
    }
};

const getVisitFrequency = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get visit frequency distribution
        const visitFrequency = await prisma.$queryRaw`
            WITH user_visits AS (
              SELECT 
                ca."userId",
                COUNT(ca.id) as visit_count
              FROM "ClassAttendee" ca
              WHERE ca."affiliateId" = ${affiliateId}
                AND ca."createdAt" >= ${startDate}
                AND ca."createdAt" <= ${endDate}
              GROUP BY ca."userId"
            ),
            member_visits AS (
              SELECT 
                m."userId",
                COALESCE(uv.visit_count, 0) as visit_count
              FROM "Members" m
              LEFT JOIN user_visits uv ON m."userId" = uv."userId"
              WHERE m."affiliateId" = ${affiliateId} AND m."isActive" = true
            ),
            frequency_ranges AS (
              SELECT 
                CASE 
                  WHEN visit_count = 0 THEN '0 visits'
                  WHEN visit_count = 1 THEN '1 visit'
                  WHEN visit_count BETWEEN 2 AND 4 THEN '2-4 visits'
                  WHEN visit_count BETWEEN 5 AND 8 THEN '5-8 visits'
                  WHEN visit_count BETWEEN 9 AND 12 THEN '9-12 visits'
                  ELSE '13+ visits'
                END as frequency_range,
                CASE 
                  WHEN visit_count = 0 THEN 1
                  WHEN visit_count = 1 THEN 2
                  WHEN visit_count BETWEEN 2 AND 4 THEN 3
                  WHEN visit_count BETWEEN 5 AND 8 THEN 4
                  WHEN visit_count BETWEEN 9 AND 12 THEN 5
                  ELSE 6
                END as sort_order
              FROM member_visits
            )
            SELECT 
              frequency_range,
              COUNT(*) as member_count
            FROM frequency_ranges
            GROUP BY frequency_range, sort_order
            ORDER BY sort_order
        `;

        res.json({
            data: transformBigInts(visitFrequency),
            periodLabel
        });
    } catch (error) {
        console.error("❌ Error in getVisitFrequency:", error);
        res.status(500).json({ error: error.message });
    }
};

// Financial Analysis
const getContractOverview = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'THIS_MONTH';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Distribution of contract types for active contracts
        const contractTypes = await prisma.$queryRaw`
            SELECT
                "contractType",
                COUNT(*) as count
            FROM "Contract"
            WHERE "affiliateId" = ${affiliateId}
              AND active = true
              AND "createdAt" <= ${endDate}
              AND (
                "validUntil" >= ${startDate}
                    OR "validUntil" IS NULL
                )
            GROUP BY "contractType"
        `;

        // Avg contract value for contracts active during the period
        const avgContractValue = await prisma.contract.aggregate({
            where: {
                affiliateId,
                active: true,
                createdAt: { lte: endDate },
                OR: [
                    { validUntil: { gte: startDate } },
                    { validUntil: null }
                ]
            },
            _avg: {
                paymentAmount: true
            }
        });

        // New contracts during period
        const newContractsCount = await prisma.contract.count({
            where: {
                affiliateId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        res.json(transformBigInts({
            contractTypes,
            avgContractValue: avgContractValue._avg.paymentAmount,
            newContractsCount,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getContractOverview:", error);
        res.status(500).json({ error: error.message });
    }
};

const getArpu = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_6_MONTHS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        // For ARPU, we need to set appropriate date range
        let { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Override for LAST_6_MONTHS if that's the period
        if (period === 'LAST_6_MONTHS') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            startDate = sixMonthsAgo;
            periodLabel = 'Last 6 Months';
        }

        // Calculate monthly revenue for the period
        const monthlyRevenue = await prisma.$queryRaw`
            SELECT
                TO_CHAR("createdAt", 'YYYY-MM') as month,
                SUM(amount) as revenue,
                COUNT(DISTINCT "userId") as users
            FROM transactions
            WHERE "affiliateId" = ${affiliateId}
              AND "createdAt" >= ${startDate}
              AND "createdAt" <= ${endDate}
              AND type NOT LIKE '%refund%'
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY month
        `;

        // Calculate ARPU for each month
        const arpuData = monthlyRevenue.map(month => {
            const revenue = Number(month.revenue);
            const users = Number(month.users);
            return {
                month: month.month,
                revenue: revenue,
                users: users,
                arpu: parseFloat((revenue / users).toFixed(2))
            };
        });

        res.json({
            data: arpuData,
            periodLabel
        });
    } catch (error) {
        console.error("❌ Error in getArpu:", error);
        res.status(500).json({ error: error.message });
    }
};

const getPaymentHealth = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_90_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get payment status categories
        const paymentHealth = await prisma.$queryRaw`
            SELECT
                CASE
                    WHEN status = 'pending' THEN 'Pending'
                    WHEN status = 'failed' THEN 'Failed'
                    WHEN status = 'delayed' THEN 'Delayed'
                    ELSE 'Completed'
                    END as payment_status,
                COUNT(*) as count
            FROM transactions
            WHERE "affiliateId" = ${affiliateId}
              AND "createdAt" >= ${startDate}
              AND "createdAt" <= ${endDate}
            GROUP BY payment_status
        `;

        // Get users with failed payments
        const failedPayments = await prisma.transactions.findMany({
            where: {
                affiliateId,
                status: 'failed',
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(transformBigInts({
            paymentHealth,
            failedPayments,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getPaymentHealth:", error);
        res.status(500).json({ error: error.message });
    }
};

const getSuspendedContracts = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_6_MONTHS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        let { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Override for LAST_6_MONTHS if that's the period
        if (period === 'LAST_6_MONTHS') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            startDate = sixMonthsAgo;
            periodLabel = 'Last 6 Months';
        }

        // Get payment holiday stats
        const paymentHolidays = await prisma.paymentHoliday.findMany({
            where: {
                affiliateId,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                contract: {
                    select: {
                        paymentAmount: true,
                        contractType: true
                    }
                }
            }
        });

        // Group by reason
        const holidayReasons = {};
        paymentHolidays.forEach(holiday => {
            const reason = holiday.reason || 'Not specified';
            if (!holidayReasons[reason]) {
                holidayReasons[reason] = 0;
            }
            holidayReasons[reason]++;
        });

        // Monthly trend
        const monthlyHolidays = await prisma.$queryRaw`
            SELECT
                TO_CHAR("createdAt", 'YYYY-MM') as month,
                COUNT(*) as count
            FROM "PaymentHoliday"
            WHERE "affiliateId" = ${affiliateId}
              AND "createdAt" >= ${startDate}
              AND "createdAt" <= ${endDate}
            GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
            ORDER BY month
        `;

        res.json(transformBigInts({
            paymentHolidays,
            holidayReasons,
            monthlyHolidays,
            totalLostRevenue: paymentHolidays.reduce((sum, h) => sum + (h.monthlyFee || 0), 0),
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getSuspendedContracts:", error);
        res.status(500).json({ error: error.message });
    }
};

const getContractExpirations = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'NEXT_90_DAYS';
        const days = parseInt(req.query.days) || 90;
        await validateAffiliateAccess(req.user.id, affiliateId);

        // For contract expirations, we want to look forward
        let startDate = new Date();
        let endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
        let periodLabel = `Next ${days} Days`;

        if (period === 'NEXT_30_DAYS') {
            endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
            periodLabel = 'Next 30 Days';
        } else if (period === 'NEXT_60_DAYS') {
            endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);
            periodLabel = 'Next 60 Days';
        } else if (period === 'NEXT_90_DAYS') {
            endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
            periodLabel = 'Next 90 Days';
        } else if (period === 'THIS_MONTH') {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);
            periodLabel = `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
        } else if (period === 'NEXT_MONTH') {
            const nextMonth = startDate.getMonth() === 11 ? 0 : startDate.getMonth() + 1;
            const yearOfNextMonth = nextMonth === 0 ? startDate.getFullYear() + 1 : startDate.getFullYear();
            startDate = new Date(yearOfNextMonth, nextMonth, 1);
            endDate = new Date(yearOfNextMonth, nextMonth + 1, 0, 23, 59, 59);
            periodLabel = `${startDate.toLocaleString('default', { month: 'long' })} ${yearOfNextMonth}`;
        }

        // Get expiring contracts
        const expiringContracts = await prisma.contract.findMany({
            where: {
                affiliateId,
                active: true,
                validUntil: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                validUntil: 'asc'
            }
        });

        // Group by month
        const today = new Date();
        const monthlyExpirations = expiringContracts.reduce((acc, contract) => {
            const monthYear = `${contract.validUntil.getMonth() + 1}-${contract.validUntil.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    month: monthYear,
                    count: 0,
                    value: 0
                };
            }
            acc[monthYear].count++;
            acc[monthYear].value += Number(contract.paymentAmount) || 0;
            return acc;
        }, {});

        res.json(transformBigInts({
            expiringContracts,
            monthlyExpirations: Object.values(monthlyExpirations),
            totalExpirations: expiringContracts.length,
            atRiskRevenue: expiringContracts.reduce((sum, c) => sum + (Number(c.paymentAmount) || 0), 0),
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getContractExpirations:", error);
        res.status(500).json({ error: error.message });
    }
};

// Training & Service Analysis
const getClassCapacity = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get class capacity data
        const classes = await prisma.classSchedule.findMany({
            where: {
                affiliateId,
                time: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                _count: {
                    select: {
                        attendees: true
                    }
                }
            }
        });

        // Calculate utilization
        const classCapacity = classes.map(cls => ({
            id: cls.id,
            name: cls.trainingName,
            time: cls.time,
            capacity: cls.memberCapacity,
            attendees: cls._count.attendees,
            utilization: Math.round((cls._count.attendees / cls.memberCapacity) * 100)
        }));

        // Group by training type
        const byTrainingType = {};
        classes.forEach(cls => {
            const type = cls.trainingType || 'Other';
            if (!byTrainingType[type]) {
                byTrainingType[type] = {
                    totalCapacity: 0,
                    totalAttendees: 0
                };
            }
            byTrainingType[type].totalCapacity += cls.memberCapacity;
            byTrainingType[type].totalAttendees += cls._count.attendees;
        });

        // Calculate utilization by type
        Object.keys(byTrainingType).forEach(type => {
            byTrainingType[type].utilization = Math.round(
                (byTrainingType[type].totalAttendees / byTrainingType[type].totalCapacity) * 100
            );
        });

        res.json(transformBigInts({
            classCapacity,
            byTrainingType,
            averageUtilization: Math.round(
                (classCapacity.reduce((sum, c) => sum + c.utilization, 0) / classCapacity.length) || 0
            ),
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getClassCapacity:", error);
        res.status(500).json({ error: error.message });
    }
};

const getTrainingTypePopularity = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_90_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get popularity by training type
        const popularity = await prisma.$queryRaw`
            SELECT 
              cs."trainingType",
              COUNT(ca.id) as attendees
            FROM "ClassAttendee" ca
            JOIN "ClassSchedule" cs ON ca."classId" = cs.id
            WHERE ca."affiliateId" = ${affiliateId}
              AND ca."createdAt" >= ${startDate}
              AND ca."createdAt" <= ${endDate}
            GROUP BY cs."trainingType"
            ORDER BY attendees DESC
        `;

        // Time of day preference
        const timePreference = await prisma.$queryRaw`
            SELECT
                CASE
                    WHEN EXTRACT(HOUR FROM cs.time) < 9 THEN 'Early Morning (before 9 AM)'
                    WHEN EXTRACT(HOUR FROM cs.time) BETWEEN 9 AND 11 THEN 'Morning (9-12)'
                    WHEN EXTRACT(HOUR FROM cs.time) BETWEEN 12 AND 15 THEN 'Afternoon (12-4)'
                    WHEN EXTRACT(HOUR FROM cs.time) BETWEEN 16 AND 18 THEN 'Evening (4-7)'
                    ELSE 'Night (after 7 PM)'
                    END as time_of_day,
                COUNT(ca.id) as attendees
            FROM "ClassAttendee" ca
                     JOIN "ClassSchedule" cs ON ca."classId" = cs.id
            WHERE ca."affiliateId" = ${affiliateId}
              AND ca."createdAt" >= ${startDate}
              AND ca."createdAt" <= ${endDate}
            GROUP BY time_of_day
            ORDER BY attendees DESC
        `;

        res.json(transformBigInts({
            popularity,
            timePreference,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getTrainingTypePopularity:", error);
        res.status(500).json({ error: error.message });
    }
};

const getTrainerComparison = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_90_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get trainers for this affiliate
        const trainers = await prisma.affiliateTrainer.findMany({
            where: {
                affiliateId
            },
            include: {
                trainer: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });

        // Async map to get attendance data for each trainer
        const trainerStats = await Promise.all(
            trainers.map(async trainer => {
                // Get classes taught by this trainer during the period
                const classes = await prisma.classSchedule.findMany({
                    where: {
                        affiliateId,
                        trainer: trainer.trainer.fullName,
                        time: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    select: {
                        id: true
                    }
                });

                const classIds = classes.map(c => c.id);

                // Get attendance for these classes
                const attendance = await prisma.classAttendee.count({
                    where: {
                        affiliateId,
                        classId: {
                            in: classIds
                        }
                    }
                });

                // Calculate retention (members who attended at least 2 classes)
                let retention;
                if (classIds.length > 0) {
                    const classIdsParam = classIds.map(id => Number(id));
                    retention = await prisma.$queryRaw`
                        SELECT COUNT(DISTINCT ca."userId") as retained
                        FROM "ClassAttendee" ca
                        WHERE ca."affiliateId" = ${affiliateId}
                          AND ca."classId" = ANY(${classIdsParam}::int[])
                          AND (
                            SELECT COUNT(ca2.id)
                            FROM "ClassAttendee" ca2
                            WHERE ca2."userId" = ca."userId"
                              AND ca2."classId" = ANY(${classIdsParam}::int[])
                          ) >= 2
                    `;
                } else {
                    retention = [{ retained: 0 }];
                }

                return {
                    trainerId: trainer.trainerId,
                    trainerName: trainer.trainer.fullName,
                    classesCount: classes.length,
                    totalAttendance: attendance,
                    averageAttendance: classes.length > 0 ? Math.round(attendance / classes.length) : 0,
                    retention: retention[0]?.retained || 0
                };
            })
        );

        res.json(transformBigInts({
            data: trainerStats,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getTrainerComparison:", error);
        res.status(500).json({ error: error.message });
    }
};

// Client Retention & Engagement
const getChurnAnalysis = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_6_MONTHS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        let { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Override for LAST_6_MONTHS if that's the period
        if (period === 'LAST_6_MONTHS') {
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            startDate = sixMonthsAgo;
            periodLabel = 'Last 6 Months';
        }

        // Define churn: Members who haven't visited in 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get churned members
        const churnedMembers = await prisma.$queryRaw`
            SELECT
                m."userId",
                u."fullName",
                u.email,
                m."addScoreCount" AS progress_entries,
                MAX(ca."createdAt") as last_visit
            FROM "Members" m
                     JOIN "User" u ON m."userId" = u.id
                     LEFT JOIN "ClassAttendee" ca ON ca."userId" = m."userId" AND ca."affiliateId" = m."affiliateId"
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
            GROUP BY m."userId", u."fullName", u.email, m."addScoreCount"
            HAVING MAX(ca."createdAt") < ${thirtyDaysAgo} OR MAX(ca."createdAt") IS NULL
            ORDER BY last_visit
        `;

        // Calculate churn rate by month for the requested period
        const monthlyChurn = await prisma.$queryRaw`
            WITH monthly_stats AS (
                SELECT
                    TO_CHAR(ca."createdAt", 'YYYY-MM') as month,
                    COUNT(DISTINCT ca."userId") as active_users
                FROM "ClassAttendee" ca
                WHERE ca."affiliateId" = ${affiliateId}
                  AND ca."createdAt" >= ${startDate}
                  AND ca."createdAt" <= ${endDate}
                GROUP BY TO_CHAR(ca."createdAt", 'YYYY-MM')
            ),
                 prev_month_active AS (
                     SELECT
                         ms.month,
                         ms.active_users,
                         LAG(ms.active_users, 1) OVER (ORDER BY ms.month) as prev_month_users
                     FROM monthly_stats ms
                 )
            SELECT
                pma.month,
                pma.active_users,
                pma.prev_month_users,
                CASE
                    WHEN pma.prev_month_users IS NULL THEN 0
                    ELSE ROUND(
                            (pma.prev_month_users - pma.active_users) / pma.prev_month_users * 100,
                            1
                         )
                    END as churn_rate
            FROM prev_month_active pma
            ORDER BY pma.month
        `;

        res.json(transformBigInts({
            churnedMembers,
            monthlyChurn,
            currentChurnRate: monthlyChurn.length > 0 ? monthlyChurn[monthlyChurn.length - 1].churn_rate : 0,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getChurnAnalysis:", error);
        res.status(500).json({ error: error.message });
    }
};

const getClientLifecycle = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'ALL_TIME'; // This is typically an all-time metric
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Membership duration distribution
        const membershipDuration = await prisma.$queryRaw`
            WITH durations AS (
                SELECT
                    CASE
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) < 30 THEN 'Less than 1 month'
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 30 AND 90 THEN '1-3 months'
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 91 AND 180 THEN '3-6 months'
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 181 AND 365 THEN '6-12 months'
                        ELSE 'Over 1 year'
                        END as duration,
                    CASE
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) < 30 THEN 1
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 30 AND 90 THEN 2
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 91 AND 180 THEN 3
                        WHEN EXTRACT(DAY FROM NOW() - MIN(ca."createdAt")) BETWEEN 181 AND 365 THEN 4
                        ELSE 5
                        END as sort_order,
                    ca."userId"
                FROM "ClassAttendee" ca
                WHERE ca."affiliateId" = ${affiliateId}
                  AND ca."createdAt" >= ${startDate}
                  AND ca."createdAt" <= ${endDate}
                GROUP BY ca."userId"
            )
            SELECT
                duration,
                COUNT(*) as members
            FROM durations
            GROUP BY duration, sort_order
            ORDER BY sort_order
        `;

        // Engagement levels (frequency of visits)
        const engagementLevels = await prisma.$queryRaw`
            WITH user_visits AS (
                SELECT
                    "userId",
                    COUNT(*) as visit_count,
                    EXTRACT(DAY FROM NOW() - MIN("createdAt")) as days_since_first
                FROM "ClassAttendee"
                WHERE "affiliateId" = ${affiliateId}
                  AND "createdAt" >= ${startDate}
                  AND "createdAt" <= ${endDate}
                GROUP BY "userId"
            ),
                 engagement_data AS (
                     SELECT
                         "userId",
                         visit_count,
                         days_since_first,
                         CASE
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) < 1 THEN 'Low (less than once/week)'
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) BETWEEN 1 AND 2 THEN 'Medium (1-2 times/week)'
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) BETWEEN 2 AND 4 THEN 'High (2-4 times/week)'
                             ELSE 'Very High (4+ times/week)'
                             END as engagement_level,
                         CASE
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) < 1 THEN 1
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) BETWEEN 1 AND 2 THEN 2
                             WHEN visit_count / NULLIF((days_since_first / 7), 0) BETWEEN 2 AND 4 THEN 3
                             ELSE 4
                             END as sort_order
                     FROM user_visits
                     WHERE days_since_first >= 30
                 )
            SELECT
                engagement_level,
                COUNT(*) as members
            FROM engagement_data
            GROUP BY engagement_level, sort_order
            ORDER BY sort_order
        `;

        res.json(transformBigInts({
            membershipDuration,
            engagementLevels,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getClientLifecycle:", error);
        res.status(500).json({ error: error.message });
    }
};

const getClientAchievements = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'ALL_TIME';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Get clients with most records/achievements
        const topAchievers = await prisma.$queryRaw`
            SELECT
                m."userId",
                u."fullName",
                COUNT(r.id) as records_count,
                MAX(r.date) as last_record
            FROM "Members" m
                     JOIN "User" u ON m."userId" = u.id
                     JOIN "Record" r ON r."userId" = m."userId"
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
              AND r.date >= ${startDate}
              AND r.date <= ${endDate}
            GROUP BY m."userId", u."fullName"
            ORDER BY records_count DESC
            LIMIT 10
        `;

        // Records by type
        const recordsByType = await prisma.$queryRaw`
            SELECT
                r.type,
                COUNT(r.id) as count
            FROM "Record" r
                     JOIN "Members" m ON r."userId" = m."userId"
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
              AND r.date >= ${startDate}
              AND r.date <= ${endDate}
            GROUP BY r.type
            ORDER BY count DESC
        `;

        // Progress trends
        const progressTrends = await prisma.$queryRaw`
            WITH user_records AS (
                SELECT
                    r."userId",
                    r.name,
                    r.date,
                    r.weight,
                    ROW_NUMBER() OVER (PARTITION BY r."userId", r.name ORDER BY r.date) as record_order
                FROM "Record" r
                         JOIN "Members" m ON r."userId" = m."userId"
                WHERE m."affiliateId" = ${affiliateId}
                  AND m."isActive" = true
                  AND r.type = 'Weightlifting'
                  AND r.weight IS NOT NULL
                  AND r.date >= ${startDate}
                  AND r.date <= ${endDate}
            )
            SELECT
                ur1.name as exercise,
                AVG(ur2.weight - ur1.weight) as avg_improvement
            FROM user_records ur1
                     JOIN user_records ur2 ON ur1."userId" = ur2."userId"
                AND ur1.name = ur2.name
                AND ur1.record_order = 1
                AND ur2.record_order = (
                    SELECT MAX(record_order)
                    FROM user_records ur3
                    WHERE ur3."userId" = ur1."userId"
                      AND ur3.name = ur1.name
                )
            GROUP BY ur1.name
            HAVING COUNT(*) >= 5
            ORDER BY avg_improvement DESC
        `;

        res.json(transformBigInts({
            topAchievers,
            recordsByType,
            progressTrends,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getClientAchievements:", error);
        res.status(500).json({ error: error.message });
    }
};

// Growth Potential
const getDormantClients = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Dormant clients: have active plans but low attendance
        const dormantClients = await prisma.$queryRaw`
            SELECT
                m."userId",
                u."fullName",
                u.email,
                up."planName",
                up."endDate",
                COUNT(ca.id) as visits_in_last_30_days,
                EXTRACT(DAYS FROM (up."endDate" - NOW())) as days_remaining
            FROM "Members" m
                     JOIN "User" u ON m."userId" = u.id
                     JOIN "UserPlan" up ON up."userId" = m."userId" AND up."affiliateId" = m."affiliateId"
                     LEFT JOIN "ClassAttendee" ca ON ca."userId" = m."userId"
                AND ca."affiliateId" = m."affiliateId"
                AND ca."createdAt" >= ${startDate}
                AND ca."createdAt" <= ${endDate}
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
              AND up."endDate" > NOW()
              AND up."sessionsLeft" > 0
            GROUP BY m."userId", u."fullName", u.email, up."planName", up."endDate"
            HAVING COUNT(ca.id) < 3
            ORDER BY visits_in_last_30_days, up."endDate"
        `;

        // Calculate value at risk
        const valueAtRisk = dormantClients.reduce((sum, client) => {
            // Use the extracted days_remaining from the query
            const daysRemaining = Number(client.days_remaining);
            // Assume average plan price of $100/month
            const estimatedMonthlyValue = 50;
            const estimatedValue = (daysRemaining / 30) * estimatedMonthlyValue;
            return sum + estimatedValue;
        }, 0);

        const transformedDormantClients = dormantClients.map(client => ({
            ...client,
            endDate: client.endDate ? new Date(client.endDate) : null
        }));

        res.json(transformBigInts({
            dormantClients: transformedDormantClients,
            valueAtRisk,
            reactivationPotential: dormantClients.length,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getDormantClients:", error);
        res.status(500).json({ error: error.message });
    }
};

const getGrowthOpportunities = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Clients consistently near capacity
        const frequentAttenders = await prisma.$queryRaw`
            SELECT
                m."userId",
                u."fullName",
                u.email,
                COUNT(DISTINCT ca.id) as visits_in_last_30_days,
                MAX(up."planName") as current_plan,
                SUM(up."sessionsLeft") as sessions_left
            FROM "Members" m
                     JOIN "User" u ON m."userId" = u.id
                     JOIN "ClassAttendee" ca ON ca."userId" = m."userId" AND ca."affiliateId" = m."affiliateId"
                     JOIN "UserPlan" up ON up."userId" = m."userId" AND up."affiliateId" = m."affiliateId"
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
              AND ca."createdAt" >= ${startDate}
              AND ca."createdAt" <= ${endDate}
              AND up."endDate" > NOW()
            GROUP BY m."userId", u."fullName", u.email
            HAVING COUNT(DISTINCT ca.id) > 8
               AND SUM(up."sessionsLeft") < 10
            ORDER BY sessions_left
        `;

        // Clients near plan expiration with good attendance
        const expiringActivePlans = await prisma.$queryRaw`
            SELECT
                m."userId",
                u."fullName",
                u.email,
                up."planName",
                up."endDate",
                COUNT(DISTINCT ca.id) as visits_in_last_30_days
            FROM "Members" m
                     JOIN "User" u ON m."userId" = u.id
                     JOIN "UserPlan" up ON up."userId" = m."userId" AND up."affiliateId" = m."affiliateId"
                     JOIN "ClassAttendee" ca ON ca."userId" = m."userId"
                AND ca."affiliateId" = m."affiliateId"
                AND ca."createdAt" >= ${startDate}
                AND ca."createdAt" <= ${endDate}
            WHERE m."affiliateId" = ${affiliateId}
              AND m."isActive" = true
              AND up."endDate" BETWEEN NOW() AND NOW() + INTERVAL '14 days'
            GROUP BY m."userId", u."fullName", u.email, up."planName", up."endDate"
            HAVING COUNT(DISTINCT ca.id) >= 4
            ORDER BY up."endDate"
        `;

        res.json(transformBigInts({
            frequentAttenders,
            expiringActivePlans,
            upgradePotential: frequentAttenders.length,
            renewalPotential: expiringActivePlans.length,
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getGrowthOpportunities:", error);
        res.status(500).json({ error: error.message });
    }
};

// Early Warning System
const getEarlyWarnings = async (req, res) => {
    try {
        const affiliateId = parseInt(req.params.affiliateId);
        const period = req.query.period || 'LAST_30_DAYS';
        await validateAffiliateAccess(req.user.id, affiliateId);

        const { startDate, endDate, periodLabel } = getDateRangeForPeriod(period);

        // Consolidate all warning indicators
        const warnings = {
            // Payment issues
            paymentIssues: await prisma.transactions.findMany({
                where: {
                    affiliateId,
                    status: 'failed',
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),

            // Attendance drop
            attendanceDrops: await prisma.$queryRaw`
                SELECT 
                  m."userId",
                  u."fullName",
                  u.email,
                  COUNT(CASE WHEN ca."createdAt" >= ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} AND ca."createdAt" <= ${endDate} THEN ca.id END) as recent_visits,
                  COUNT(CASE WHEN ca."createdAt" >= ${startDate} AND ca."createdAt" < ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} THEN ca.id END) as previous_visits
                FROM "Members" m
                JOIN "User" u ON m."userId" = u.id
                LEFT JOIN "ClassAttendee" ca ON ca."userId" = m."userId" AND ca."affiliateId" = m."affiliateId"
                WHERE m."affiliateId" = ${affiliateId} 
                  AND m."isActive" = true
                GROUP BY m."userId", u."fullName", u.email
                HAVING (COUNT(CASE WHEN ca."createdAt" >= ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} AND ca."createdAt" <= ${endDate} THEN ca.id END) = 0 
                       AND COUNT(CASE WHEN ca."createdAt" >= ${startDate} AND ca."createdAt" < ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} THEN ca.id END) > 4)
                   OR (COUNT(CASE WHEN ca."createdAt" >= ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} AND ca."createdAt" <= ${endDate} THEN ca.id END) <= 1 
                       AND COUNT(CASE WHEN ca."createdAt" >= ${startDate} AND ca."createdAt" < ${new Date(endDate.getTime() - 14 * 24 * 60 * 60 * 1000)} THEN ca.id END) >= 8)
                ORDER BY previous_visits DESC
            `,

            // Expiring contracts
            expiringContracts: await prisma.contract.findMany({
                where: {
                    affiliateId,
                    active: true,
                    validUntil: {
                        lte: new Date(new Date().setDate(new Date().getDate() + 14))
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    validUntil: 'asc'
                }
            }),

            // Class capacity issues
            capacityIssues: await prisma.$queryRaw`
                SELECT
                    cs.id,
                    cs."trainingName",
                    cs.time,
                    cs."memberCapacity",
                    COUNT(ca.id) as attendees,
                    ROUND((COUNT(ca.id) / cs."memberCapacity") * 100) as utilization
                FROM "ClassSchedule" cs
                         LEFT JOIN "ClassAttendee" ca ON ca."classId" = cs.id
                WHERE cs."affiliateId" = ${affiliateId}
                  AND cs.time BETWEEN ${startDate} AND ${endDate}
                GROUP BY cs.id, cs."trainingName", cs.time, cs."memberCapacity"
                HAVING ROUND((COUNT(ca.id) / cs."memberCapacity") * 100) > 95
                ORDER BY cs.time ASC
            `
        };

        // Calculate severity scores and prioritize warnings
        const prioritizedWarnings = [];

        // Payment issues
        warnings.paymentIssues.forEach(issue => {
            prioritizedWarnings.push({
                type: 'Payment Issue',
                severity: 'High',
                user: issue.user,
                details: `Failed payment of ${issue.amount} on ${issue.createdAt.toLocaleDateString()}`,
                date: issue.createdAt
            });
        });

        // Attendance drops
        warnings.attendanceDrops.forEach(drop => {
            // Explicitly convert to numbers to avoid BigInt issues
            const previousVisits = Number(drop.previous_visits);
            const recentVisits = Number(drop.recent_visits);

            const severityScore = previousVisits > 0
                ? Math.round(((previousVisits - recentVisits) / previousVisits) * 100)
                : 0;

            prioritizedWarnings.push({
                type: 'Attendance Drop',
                severity: severityScore > 80 ? 'High' : 'Medium',
                user: {
                    id: Number(drop.userId),
                    fullName: drop.fullName,
                    email: drop.email
                },
                details: `Attendance dropped from ${previousVisits} to ${recentVisits} visits`,
                date: new Date()
            });
        });

        // Expiring contracts
        warnings.expiringContracts.forEach(contract => {
            const daysUntilExpiry = Math.ceil((contract.validUntil - new Date()) / (1000 * 60 * 60 * 24));
            prioritizedWarnings.push({
                type: 'Expiring Contract',
                severity: daysUntilExpiry <= 7 ? 'High' : 'Medium',
                user: contract.user,
                details: `Contract expires on ${contract.validUntil.toLocaleDateString()}`,
                date: contract.validUntil
            });
        });

        // Class capacity issues
        warnings.capacityIssues.forEach(issue => {
            prioritizedWarnings.push({
                type: 'Capacity Issue',
                severity: issue.utilization >= 100 ? 'High' : 'Medium',
                details: `${issue.trainingName} at ${issue.time.toLocaleString()} is at ${issue.utilization}% capacity`,
                date: issue.time
            });
        });

        // Sort by severity and date
        prioritizedWarnings.sort((a, b) => {
            if (a.severity === 'High' && b.severity !== 'High') return -1;
            if (a.severity !== 'High' && b.severity === 'High') return 1;
            return new Date(a.date) - new Date(b.date);
        });

        res.json(transformBigInts({
            warnings: prioritizedWarnings,
            summary: {
                high: prioritizedWarnings.filter(w => w.severity === 'High').length,
                medium: prioritizedWarnings.filter(w => w.severity === 'Medium').length,
                low: prioritizedWarnings.filter(w => w.severity === 'Low').length,
            },
            periodLabel
        }));
    } catch (error) {
        console.error("❌ Error in getEarlyWarnings:", error);
        res.status(500).json({ error: error.message });
    }
};

// Export all functions
module.exports = {
    getDashboardOverview,
    getActivityMetrics,
    getVisitHeatmap,
    getAtRiskMembers,
    getVisitFrequency,
    getContractOverview,
    getArpu,
    getPaymentHealth,
    getSuspendedContracts,
    getContractExpirations,
    getClassCapacity,
    getTrainingTypePopularity,
    getTrainerComparison,
    getChurnAnalysis,
    getClientLifecycle,
    getClientAchievements,
    getDormantClients,
    getGrowthOpportunities,
    getEarlyWarnings,
    getTopMembersByCheckIns
};