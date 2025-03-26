// server/src/middlewares/ensureAdmin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware, mis kontrollib, kas kasutaja on administraator
 * Eeldab, et ensureAuthenticatedJWT middleware on juba rakendatud
 * ning req.user.id on olemas
 */
module.exports = async function ensureAdmin(req, res, next) {
    try {
        // Kontrollime, kas kasutaja ID on olemas (JWT valideerimisest)
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Autentimata' });
        }

        // Leiame kasutaja
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { email: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Kasutajat ei leitud' });
        }

        // Kontrollime, kas see on admin kasutaja (prii.sander@gmail.com)
        if (user.email !== 'prii.sander@gmail.com') {
            return res.status(403).json({ error: 'Administraatori õigused puuduvad' });
        }

        // Kõik korras, jätkame
        next();
    } catch (error) {
        console.error('Viga admin kontrollimisel:', error);
        res.status(500).json({ error: 'Serveri viga' });
    }
};