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
        const { affiliateId } = parseInt(req.query); // Eeldame, et auth middleware paneb req.user sisse.
        // Või loe affiliateId muul moel, kui roll on affiliate.

        const { search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        let orderBy = {};

        // Kui kasutaja soovib sorteerida täisnime järgi
        if (sortBy === 'fullName') {
            orderBy = {
                user: { fullName: sortOrder }, // Kasutab Prisma nested orderBy
            };
        } else {
            orderBy[sortBy] = sortOrder; // Vaikimisi sorteerimine
        }

        const contracts = await prisma.contract.findMany({
            where: {
                affiliateId: affiliateId,
            },
            include: {
                user: { select: { fullName: true } },
            },
            orderBy: orderBy, // Siin toimub õige sorteerimine
        });

        res.json(contracts);
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
        } = req.body;

        const validUntilDate = new Date(validUntil);



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
            where: { id },

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
        const { status, acceptedAt, contractType, content } = req.body;

        const updatedContract = await prisma.contract.update({
            where: { id },
            data: {
                status,
                acceptedAt,
                contractType,
                content,
            },
        });
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
        await prisma.contract.delete({ where: { id } });
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
        const { affiliateId } = parseInt(req.query);
        const template = await prisma.contractTemplate.findFirst({
            where: { affiliateId },
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
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        // Toome contractid koos vajaliku infoga
        const contracts = await prisma.contract.findMany({
            where: { userId },
            include: {
                logs: true,     // kui tahad logs'id
                signed: true,   // kui tahad SignedContract ridu
        affiliate: {select: {name: true}}, // kui tahad affiliate infot
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(contracts);
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
        const { userId, affiliateId, acceptType, contractTermsId } = req.body;

        // Uuendame Contract staatust
        const updatedContract = await prisma.contract.update({
            where: { id: contractId },
            data: {
                status: 'accepted',
                acceptedAt: new Date(),
            },
        });

        // Lisa logi
        await prisma.contractLogs.create({
            data: {
                contractId: contractId,
                userId: userId,
                affiliateId: affiliateId,
                action: 'User accepted the contract',
            },
        });

        // Lisa SignedContract
        await prisma.signedContract.create({
            data: {
                contractId: contractId,
                userId: userId,
                affiliateId: affiliateId,
                acceptType: acceptType || 'checkbox',
                contractTermsId: contractTermsId,
            },
        });

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
        const termsType = req.params.termsType;


        const foundTerms = await prisma.contractTerms.findFirst({
            where: { type: termsType },

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
