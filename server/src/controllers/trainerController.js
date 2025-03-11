const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTrainerAffiliates = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        const trainerAffiliates = await prisma.affiliate.findMany({
            where: {
                trainers: {
                    some: {
                        trainerId: userId,
                    },
                },
            },
        });

        res.json(trainerAffiliates);
    } catch (error) {
        console.error("❌ Error loading trainer affiliates:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getTrainerAffiliates,
};