const { PrismaClient } = require('@prisma/client');
const {parse} = require("dotenv");
const prisma = new PrismaClient();

/**
 * Lepingute toomine (otsing + sortimine)
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getAllContracts = async (req, res) => {
    try {
        const { search = '', sortBy = 'createdAt', sortOrder = 'desc', affiliateId } = req.query;

        let orderBy = {};

        // Kui kasutaja soovib sorteerida täisnime järgi
        if (sortBy === 'fullName') {
            orderBy = {
                user: { fullName: sortOrder }, // Kasutab Prisma nested orderBy
            };
        } else {
            orderBy[sortBy] = sortOrder; // Vaikimisi sorteerimine
        }

        // Fetch basic contracts data
        const contracts = await prisma.contract.findMany({
            where: {
                affiliateId: parseInt(affiliateId),
            },
            include: {
                user: { select: { fullName: true } },
                paymentHolidays: true
            },
            orderBy: orderBy
        });

        // Get IDs of terminated contracts
        const terminatedContractIds = contracts
            .filter(c => c.status === 'terminated')
            .map(c => c.id);

        // If there are any terminated contracts, fetch their most recent logs
        let contractLogs = [];
        if (terminatedContractIds.length > 0) {
            // For each terminated contract, get the most recent log
            const logPromises = terminatedContractIds.map(contractId =>
                prisma.contractLogs.findFirst({
                    where: { contractId },
                    orderBy: { createdAt: 'desc' }
                })
            );

            contractLogs = await Promise.all(logPromises);

            // Filter out null results (contracts without logs)
            contractLogs = contractLogs.filter(log => log !== null);
        }

        // Create a map of contractId -> latestLog for quick lookup
        const logMap = {};
        contractLogs.forEach(log => {
            logMap[log.contractId] = log;
        });

        // Enhance contracts with their latest log if they're terminated
        const enhancedContracts = contracts.map(contract => {
            if (contract.status === 'terminated' && logMap[contract.id]) {
                return {
                    ...contract,
                    latestLog: logMap[contract.id]
                };
            }
            return contract;
        });

        res.json(enhancedContracts);
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: 'Failed to fetch contracts' });
    }
};

/**
 * Lepingu loomine
 */
exports.createContract = async (req, res) => {
    try {
        const {
            userId,
            contractType,
            content,
            affiliateId,
            paymentType,
            paymentAmount,
            paymentInterval,
            paymentDay,
            validUntil,
            trainingTypes, // Extract trainingTypes from request
        } = req.body;

        const validUntilDate = new Date(validUntil);

        // Store training types as a JSON string array instead of comma-separated string
        // This matches the format in the database: ["WOD","Gymnastics","Weightlifting"]
        const trainingType = Array.isArray(trainingTypes)
            ? JSON.stringify(trainingTypes)
            : null;

        const newContract = await prisma.contract.create({
            data: {
                affiliateId: parseInt(affiliateId),
                userId,
                contractType,
                content,
                status: 'draft',
                paymentType,
                paymentAmount,
                paymentInterval,
                paymentDay,
                validUntil: validUntilDate,
                trainingType, // Use singular field name matching the schema
            },
        });

        res.json(newContract);
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ error: 'Failed to create contract' });
    }
};

/**
 * Lepingute detailide saamine ID järgi
 */
exports.getContractById = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await prisma.contract.findUnique({
            where: { id: parseInt(id) },

        });
        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }
        res.json(contract);
    } catch (error) {
        console.error('Error fetching contract by id:', error);
        res.status(500).json({ error: 'Failed to fetch contract' });
    }
};

/**
 * Lepingute uuendamine (nt kui kasutaja kinnitab)
 */
exports.updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, acceptedAt, contractType, content, endDate, affiliateId, userId, action } = req.body;

        // Loome dünaamilise data objekti, mis sisaldab ainult olemasolevaid välju
        const data = {};

        if (status !== undefined) data.status = status;
        if (acceptedAt !== undefined) data.acceptedAt = acceptedAt;
        if (contractType !== undefined) data.contractType = contractType;
        if (content !== undefined) data.content = content;
        if (endDate !== undefined) data.validUntil = new Date(endDate); // validUntil vastendatakse endDate'ile

        // Kui ühtegi välja pole määratud, tagasta veateade
        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No fields provided to update' });
        }

        // Uuenda leping ainult olemasolevate väljadega
        const updatedContract = await prisma.contract.update({
            where: { id: parseInt(id) },
            data,
        });

        // Lisa logi, kui affiliateId ja userId on olemas
        if (affiliateId && userId) {
            await prisma.contractLogs.create({
                data: {
                    contractId: parseInt(id),
                    affiliateId: parseInt(affiliateId),
                    userId: parseInt(userId),
                    action,
                },
            });
        }

        res.json(updatedContract);
    } catch (error) {
        console.error('Error updating contract:', error);
        res.status(500).json({ error: 'Failed to update contract' });
    }
};
/**
 * Lepingute kustutamine
 */
exports.deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contract.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        res.status(500).json({ error: 'Failed to delete contract' });
    }
};

/*
 * Lepingu “põhja” (template) lisamine
 */
exports.createContractTemplate = async (req, res) => {
    try {

        const { content, affiliateId } = req.body;

        const newTemplate = await prisma.contractTemplate.create({
            data: {
                affiliateId: parseInt(affiliateId),
                content,
            },
        });

        res.json(newTemplate);
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
};

/**
 * Too viimane lisatud template (või vali kindlale affiliate'ile).
 */
exports.getLatestContractTemplate = async (req, res) => {
    try {
        const { affiliateId } = req.query;

        const template = await prisma.contractTemplate.findFirst({
            where: { affiliateId: parseInt(affiliateId) },
            orderBy: { createdAt: 'desc' },
        });
        res.json(template || null);
    } catch (error) {
        console.error('Error fetching latest template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
};

exports.getUserContracts = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const affiliateId = req.query.affiliateId || '';
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        if(!isNaN(affiliateId)){
            const affiliateIds = parseInt(affiliateId, 10);

            const contracts = await prisma.contract.findMany({
                where: { userId, affiliateId: affiliateIds },
                include: {
                    logs: true,     // kui tahad logs'id
                    signed: true,   // kui tahad SignedContract ridu
                    affiliate: {select: {name: true}}, // kui tahad affiliate infot
                    paymentHolidays: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            res.json(contracts);

        } else {

            // Toome contractid koos vajaliku infoga
            const contracts = await prisma.contract.findMany({
                where: {userId},
                include: {
                    logs: true,     // kui tahad logs'id
                    signed: true,   // kui tahad SignedContract ridu
                    affiliate: {select: {name: true}}, // kui tahad affiliate infot
                    paymentHolidays: true,
                },
                orderBy: {createdAt: 'desc'},
            });
            res.json(contracts);
        }

    } catch (error) {
        console.error('Error getUserContracts:', error);
        res.status(500).json({ error: 'Failed to fetch user contracts' });
    }
};

/**
 * Kasutaja acceptib lepingu:
 * 1) Uuendame status -> 'accepted', acceptedAt -> now
 * 2) Loome ContractLogs kirje
 * 3) Loome SignedContract kirje (nt acceptType = 'checkbox')
 * PUT /contracts/:contractId/accept
 */
exports.acceptContract = async (req, res) => {
    try {
        const { contractId } = req.params;
        const { userId, affiliateId, acceptType, contractTermsId, paymentCompleted } = req.body;

        // Kui makse pole lõpetatud, saadame tagasi hoiatava teate
        if (!paymentCompleted) {
            return res.status(400).json({
                error: "Payment must be completed before accepting the contract",
                requiresPayment: true
            });
        }

        // Leiame lepingu andmed, et saada vajalik info UserPlan jaoks
        const contract = await prisma.contract.findUnique({
            where: { id: parseInt(contractId) },
            include: {
                userPlan: true // Kontrollime, kas on juba seotud UserPlan
            }
        });

        if (!contract) {
            return res.status(404).json({ error: "Contract not found" });
        }

        // Uuendame Contract staatust
        const updatedContract = await prisma.contract.update({
            where: { id: parseInt(contractId) },
            data: {
                status: 'accepted',
                acceptedAt: new Date(),
            },
        });

        // Lisa logi
        await prisma.contractLogs.create({
            data: {
                contractId: parseInt(contractId),
                userId: userId,
                affiliateId: affiliateId,
                action: 'User accepted the contract',
            },
        });

        // Lisa SignedContract
        await prisma.signedContract.create({
            data: {
                contractId: parseInt(contractId),
                userId: userId,
                affiliateId: affiliateId,
                acceptType: acceptType || 'checkbox',
                contractTermsId: contractTermsId,
            },
        });

        // Kontrolli kas UserPlan on juba olemas selle lepinguga
        // Kui ei ole, siis loome uue UserPlan
        if (!contract.userPlan || contract.userPlan.length === 0) {
            // Arvutame lõppkuupäeva (1 kuu alates tänasest)
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);

            // Loome UserPlan kirje
            await prisma.userPlan.create({
                data: {
                    userId: userId,
                    affiliateId: affiliateId,
                    contractId: parseInt(contractId),
                    planName: `${contract.contractType || 'Monthly'}`,
                    validityDays: 31, // Standard 30-päevane periood
                    price: contract.paymentAmount,
                    purchasedAt: new Date(),
                    endDate: endDate,
                    sessionsLeft: 9999, // Piiramatu arv sessioone (lepingupõhine)
                    planId: 0,
                    trainingType: contract.trainingType
                }
            });
        }

        res.json(updatedContract);
    } catch (error) {
        console.error('Error acceptContract:', error);
        res.status(500).json({ error: 'Failed to accept contract' });
    }
};

/**
 * Toome contractTerms sisu
 * GET /contracts/terms/:termsId
 */
exports.getContractTermsById = async (req, res) => {
    try {
        const termsType = req.params;


        const foundTerms = await prisma.contractTerms.findFirst({
            where: { type: termsType.termsId },

        });

        if (!foundTerms) {
            return res.status(404).json({ error: 'Contract terms not found' });
        }

        res.json(foundTerms);
    } catch (error) {
        console.error('Error getContractTermsById:', error);
        res.status(500).json({ error: 'Failed to fetch contract terms' });
    }
};

exports.createPaymentHoliday = async (req, res) => {
    try {
        const { contractId } = req.params;
        const {
            userId,
            affiliateId,
            month,
            reason,
        } = req.body;

        // Kontrollime, kas contractId ja userId on kehtivad
        const contractInt = parseInt(contractId, 10);
        const userInt = parseInt(userId, 10);
        const affInt = parseInt(affiliateId, 10);

        // Otsi leping andmebaasist, et saada affiliate info
        const contract = await prisma.contract.findUnique({
            where: { id: contractInt },
            include: {
                affiliate: true, // et saada affiliate.email
            },
        });

        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        // Loo PaymentHoliday kirje
        const newPh = await prisma.paymentHoliday.create({
            data: {
                contractId: contractInt,
                userId: userInt,
                affiliateId: affInt,
                month: month,
                reason: reason || '',
                accepted: 'pending',
                // monthlyFee, accepted, jne, kui vajad
            },
        });



        return res.json({ success: true, paymentHoliday: newPh });
    } catch (error) {
        console.error('Error creating payment holiday:', error);
        return res.status(500).json({ error: 'Failed to create payment holiday' });
    }
};

exports.updatePaymentHoliday = async (req, res) => {
    try {
        const { phId } = req.params;
        const { accepted } = req.body;

        const updatedPh = await prisma.paymentHoliday.update({
            where: { id: parseInt(phId) },
            data: {
                accepted,
            },
        });

        return res.json({ success: true, paymentHoliday: updatedPh });
    } catch (error) {
        console.error('Error updating payment holiday:', error);
        return res.status(500).json({ error: 'Failed to update payment holiday' });
    }
}

exports.getUnpaidUsers = async (req, res) => {
    try {
        const { affiliateId } = req.query;

        // Kontrolli, kas affiliateId on olemas
        if (!affiliateId) {
            return res.status(400).json({ error: 'Affiliate ID is required' });
        }

        // Teisenda affiliateId numbriks
        const affiliateIdInt = parseInt(affiliateId);

        // Leia kõik tehingud, millel on status='pending'
        const pendingTransactions = await prisma.transactions.findMany({
            where: {
                status: 'pending',
                affiliateId: affiliateIdInt
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Kui tehinguid pole, tagasta tühi massiiv
        if (pendingTransactions.length === 0) {
            return res.json([]);
        }

        // Kogu kõik kasutaja ID-d, kellel on maksmata tehingud
        const userIds = [...new Set(pendingTransactions.map(t => t.userId))];

        // Leia nende kasutajate aktiivsed lepingud
        const contracts = await prisma.contract.findMany({
            where: {
                userId: { in: userIds },
                affiliateId: affiliateIdInt,
                active: true
            }
        });

        // Loo kaardistus kasutaja ID -> tema lepingud
        const userContractsMap = {};
        contracts.forEach(contract => {
            if (!userContractsMap[contract.userId]) {
                userContractsMap[contract.userId] = [];
            }
            userContractsMap[contract.userId].push(contract);
        });

        // Ühenda andmed: iga tehingu juurde lisa vastav leping
        const unpaidUsersData = pendingTransactions.map(transaction => {
            const userContracts = userContractsMap[transaction.userId] || [];

            // Kui kasutajal on mitu lepingut, võta kõige värskem
            const relatedContract = userContracts.length > 0
                ? userContracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                : null;

            return {
                ...transaction,
                contract: relatedContract
            };
        });

        res.json(unpaidUsersData);
    } catch (error) {
        console.error('Error fetching unpaid users:', error);
        res.status(500).json({ error: 'Failed to fetch unpaid users' });
    }
};