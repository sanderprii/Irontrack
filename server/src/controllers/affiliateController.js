const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Veendu, et module.exports on õigesti seadistatud
const getMyAffiliate = async (req, res) => {
    try {
        const userId = req.user?.id; // JWT-st saadud kasutaja ID


        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }



        const affiliate = await prisma.affiliate.findFirst({
            where: { ownerId: userId },
            include: {
                trainers: {
                    include: {
                        trainer: {
                            select: {
                                fullName: true,
                                logo: true,
                            },
                        }
                    },
                },
            },
        });

        if (!affiliate) {

            return res.json({ noAffiliate: true });
        }

        const trainers = affiliate.trainers.map((t) => ({
            fullName: t.trainer.fullName || "",
            username: t.trainer.username,
            trainerId: t.trainerId,
        }));


        res.json({ affiliate, trainers });
    } catch (error) {
        console.error("❌ Error loading affiliate:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const searchUsers = async (req, res) => {

    try {
        const query = req.query.q;
        const userId = req.user?.id;

        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Query parameter is required." });
        }


        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: query} },
                    { fullName: { contains: query, mode: 'insensitive'} },
                ],
                id: { not: userId },
            },
            select: {
                id: true,
                email: true,
                fullName: true,
            },
            take: 10,
        });


        res.json(users);
    } catch (error) {
        console.error("❌ Error searching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createOrUpdateAffiliate = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id, name, address, trainingType, trainers, email, phone, iban, bank, paymentHolidayFee, website, feedback } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }
const affiliateId = parseInt(id)
        const trainerIds = Array.isArray(trainers)
            ? trainers.map((t) => parseInt(t.trainerId)).filter((id) => !isNaN(id))
            : [];

        if (affiliateId) {
            const existing = await prisma.affiliate.findUnique({
                where: { id: parseInt(affiliateId) },
            });

            if (!existing) {
                console.error("❌ Affiliate not found");
                return res.status(404).json({ error: "Affiliate not found" });
            }

            if (existing.ownerId !== userId) {
                console.error("❌ Unauthorized affiliate update attempt");
                return res.status(403).json({ error: "Not authorized or affiliate not found" });
            }

            // ✅ Uuendame affiliate põhivälju
            await prisma.affiliate.update({
                where: { id: parseInt(affiliateId) },
                data: {
                    name,
                    address,
                    trainingType,
                    email,
                    website,
                    phone,
                    iban,
                    bankName: bank,
                    paymentHolidayFee: parseInt(paymentHolidayFee),
                    feedback,
                },
            });

            // ✅ Leiame olemasolevad treenerid andmebaasis
            const existingTrainers = await prisma.affiliateTrainer.findMany({
                where: { affiliateId },
            });

            const existingTrainerIds = existingTrainers.map((t) => t.trainerId);

            // ✅ Leiame uued treenerid, kes tuleb lisada
            const newTrainerIds = trainerIds.filter((id) => !existingTrainerIds.includes(id));

            // ✅ Leiame treenerid, kes tuleb eemaldada
            const removedTrainerIds = existingTrainerIds.filter((id) => !trainerIds.includes(id));




            // ✅ Lisame ainult uued treenerid (väldime `NaN` ID-sid)
            if (newTrainerIds.length > 0) {
                await prisma.affiliateTrainer.createMany({
                    data: newTrainerIds.map((tId) => ({
                        affiliateId,
                        trainerId: tId,
                    })),
                });
            }

            // ✅ Eemaldame ainult treenerid, kes enam ei peaks seal olema
            if (removedTrainerIds.length > 0) {
                await prisma.affiliateTrainer.deleteMany({
                    where: {
                        affiliateId,
                        trainerId: { in: removedTrainerIds },
                    },
                });
            }

            res.json({ message: "Affiliate updated successfully!" });
        } else {
            // ✅ Kui affiliate puudub, loome uue ja lisame treenerid
            const newAffiliate = await prisma.affiliate.create({
                data: {
                    name,
                    address,
                    trainingType,
                    ownerId: userId,
                    email,
                    website,
                    phone,
                    iban,
                    bankName: bank,
                    paymentHolidayFee: parseInt(paymentHolidayFee),
                    feedback,
                },
            });

            if (trainerIds.length > 0) {
                await prisma.affiliateTrainer.createMany({
                    data: trainerIds.map((tId) => ({
                        affiliateId: newAffiliate.id,
                        trainerId: tId,
                    })),
                });
            }

            res.status(201).json({ message: "Affiliate created successfully!", affiliate: newAffiliate });
        }
    } catch (error) {
        console.error("❌ Error saving affiliate info:", error);
        res.status(500).json({ error: "Failed to save affiliate info." });
    }
};

const getAffiliateById = async (req, res) => {
    try {

        const affiliateId = parseInt(req.query.id);



        if (!affiliateId) {
            return res.status(400).json({ error: "Affiliate ID is required" });
        }

        const affiliate = await prisma.affiliate.findFirst({
            where: { id: affiliateId},

        });

        if (!affiliate) {
            return res.status(404).json({ error: "Affiliate not found" });
        }

        res.json(affiliate);
    } catch (error) {
        console.error("❌ Error fetching affiliate:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const createAffiliateTerms = async (req, res) => {
    try {
        const { terms, affiliateId } = req.body;

        if (!terms) {
            return res.status(400).json({ error: "Terms are required" });
        }

        const newTerms = await prisma.affiliateTerms.create({
            data: { terms, affiliateId: parseInt(affiliateId) },
        });

        res.status(201).json(newTerms);
    } catch (error) {
        console.error("❌ Error creating affiliate terms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateAffiliateTerms = async (req, res) => {
    try {
        const { terms, affiliateId } = req.body;

        if (!terms) {
            return res.status(400).json({ error: "Terms are required" });
        }

        // First, check if terms already exist for this affiliate
        const existingTerms = await prisma.affiliateTerms.findFirst({
            where: { affiliateId: parseInt(affiliateId) }
        });

        let result;

        if (existingTerms) {
            // If terms exist, update using the id
            result = await prisma.affiliateTerms.update({
                where: { id: existingTerms.id }, // Use the primary key
                data: { terms }
            });
        } else {
            // If no terms exist, create new ones
            result = await prisma.affiliateTerms.create({
                data: {
                    terms,
                    affiliateId: parseInt(affiliateId)
                }
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error updating/creating affiliate terms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAffiliateTerms = async (req, res) => {
    try {
        const affiliateId = parseInt(req.query.id);

        if (!affiliateId) {
            return res.status(400).json({ error: "Affiliate ID is required" });
        }

        const terms = await prisma.affiliateTerms.findFirst({
            where: { affiliateId },
        });

        if (!terms) {
            return res.status(404).json({ error: "Terms not found" });
        }

        res.json(terms);
    } catch (error) {
        // If it's a 404 error, it means terms don't exist yet - this is normal
        if (error.response && error.response.status === 404) {
            // Return a standardized empty response instead of null
            return { terms: '', exists: false };
        }

        // For any other error, log it as an actual error
        console.error("❌ Error fetching affiliate terms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const acceptAffiliateTerms = async (req, res) => {
    try {
        const { affiliateId } = req.body;
const userId = req.user?.id;
        if (!affiliateId ) {
            return res.status(400).json({ error: "Affiliate ID is required" });
        }

        // Check if terms exist
        const terms = await prisma.affiliateTerms.findFirst({
            where: {affiliateId: parseInt(affiliateId) }
        });

        if (!terms) {
            return res.status(404).json({ error: "Terms not found" });
        }

        // Create acceptance record
        await prisma.affiliateTermsAccepted.create({
            data: {
                terms: terms.terms,
                userId: parseInt(userId),
                affiliateId: parseInt(affiliateId)
            }
        });

        res.status(200).json({ message: "Terms accepted successfully" });
    } catch (error) {
        console.error("❌ Error accepting affiliate terms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const isUserAcceptedAffiliateTerms = async (req, res) => {
    try {
        const { affiliateId } = req.query;
        const userId = req.user?.id;

        if (!affiliateId) {
            return res.status(400).json({ error: "Affiliate ID is required" });
        }

        const accepted = await prisma.affiliateTermsAccepted.findFirst({
            where: {
                affiliateId: parseInt(affiliateId),
                userId: parseInt(userId)
            }
        });

        res.json({ accepted: !!accepted });
    } catch (error) {
        console.error("❌ Error checking if user accepted affiliate terms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// ✅ Kasuta `module.exports`, mitte `exports`
module.exports = { getMyAffiliate, searchUsers, createOrUpdateAffiliate, getAffiliateById, createAffiliateTerms,
    updateAffiliateTerms, getAffiliateTerms, acceptAffiliateTerms, isUserAcceptedAffiliateTerms};
