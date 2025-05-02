const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

const getUserCredits = async (req, res) => {
    const affiliateId = parseInt(req.query.affiliateId, 10);
    const userId = parseInt(req.query.userId, 10);


    const role = req.headers.role;


    try {
        let credits
        if (role === 'regular') {
            credits = await prisma.credit.findMany({
                where: {userId},
                include: {
                    affiliate: true
                },

            });
        } else {


            credits = await prisma.credit.findMany({
                where: {userId, affiliateId},
                include: {
                    affiliate: true
                }
            });
        }

        res.json(credits);
    } catch (error) {
        console.error("Error fetching user credits:", error);
        res.status(500).json({error: "Internal server error"});
    }
};

const getCreditHistory = async (req, res) => {
    const affiliateId = parseInt(req.query.affiliateId, 10);
    const userId = parseInt(req.query.userId, 10);

    const role = req.headers.role;

    try {
        let history

        if (role === 'regular') {
            history = await prisma.transactions.findMany({
                where: {userId},
                include: {
                    affiliate: true
                },
                orderBy: {createdAt: "desc"},
            });
        } else {

            history = await prisma.transactions.findMany({
                where: {userId, affiliateId},
                include: {
                    affiliate: true
                },
                orderBy: {createdAt: "desc"},
            });
        }

        res.json(history);
    } catch (error) {
        console.error("Error fetching credit history:", error);
        res.status(500).json({error: "Internal server error"});
    }
}

const addCredit = async (req, res) => {
    const {userId, amount, affiliateId, description} = req.body;
let creditAccount;
    try {
        const isCreditAccount = await prisma.credit.findFirst({
            where: {userId, affiliateId}
        });

        if (!isCreditAccount) {
            await prisma.credit.create({
                data: {
                    userId,
                    affiliateId,
                    credit: amount
                }
            });

            creditAccount = await prisma.credit.findFirst({
                where: {userId, affiliateId}
            });


        } else {
            await prisma.credit.update({
                where: {
                    userId_affiliateId: { userId, affiliateId }
                },
                data: {
                    credit: {
                        increment: amount
                    }
                }
            });


        }

        const creditId = isCreditAccount ? isCreditAccount.id : creditAccount.id;

        const invoicenumberDateandTime = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);


        const responseOK = await prisma.transactions.create({
            data: {
                userId: userId,
                affiliateId: affiliateId,
                amount,
                isCredit: true,
                description,
                invoiceNumber: invoicenumberDateandTime,
                creditId: creditId,
                status: "success",
                decrease: false

            }
        });

        res.json(responseOK);
    } catch (error) {
        console.error("Error adding credit:", error);
        res.status(500).json({error: "Internal server error"});
    }
}

const getUserTransactions = async (req, res) => {
    try {
        const { userId, affiliateId } = req.query;
        const user = req.user?.id;
        console.log( "userId and user", userId, user)
        // Kontrollime, et userId on olemas
        if (!userId) {
            return res.status(400).json({ error: "userId is required." });
        }

        // Koostame where tingimuse
        const whereClause = {
            userId: parseInt(userId, 10),
        };


        // Kui affiliateId on antud, lisame ka selle
        if (parseInt(affiliateId) > 0 && parseInt(userId) !== user) {
            whereClause.affiliateId = parseInt(affiliateId, 10);
        }

        // Pärime andmebaasist
        const transactions = await prisma.transactions.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc", // sort kahanevas järjekorras
            },
            include: {
                affiliate: {select: { name: true}}
            }
        });

        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const getAffiliateTransactions = async (req, res) => {
    try {
        const { affiliateId } = req.query;

        // Kontrollime, et affiliateId on olemas
        if (!affiliateId) {
            return res.status(400).json({ error: "affiliateId is required." });
        }

        // Pärime andmebaasist
        const transactions = await prisma.transactions.findMany({
            where: {
                affiliateId: parseInt(affiliateId, 10),
            },
            include: {
                user: {select: { fullName: true, email: true }},
            },
            orderBy: {
                createdAt: "desc", // sort kahanevas järjekorras
            },
        });

        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

module.exports = {
    getUserCredits,
    getCreditHistory,
    addCredit,
    getUserTransactions,
    getAffiliateTransactions
};