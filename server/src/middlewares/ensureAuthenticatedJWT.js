const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Loome eraldi rate limiteri autenditud päringutele
const authenticatedRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minutiline aken
    max: 300, // lubab 300 päringut IP kohta iga 15 minuti jooksul
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    // See funktsioon võimaldab eri kasutajatel eri limiite
    keyGenerator: (req) => {
        // Kui autenditud, kasutame kasutaja ID + IP kombinatsiooni
        // See hoiab ära olukorra, kus mitu kasutajat sama IP alt jagavad limiiti
        return req.user ? `${req.user.id}:${req.ip}` : req.ip;
    }
});

// Loodame middleware'i funktsiooni, mis kombineerib autentimise ja päringupiirangud
module.exports = function secureAuth(req, res, next) {
    // Esimesena kontrollime autentimist
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Eraldame tokeni
    let token;
    if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = authHeader;
    }

    if (!token) {
        return res.status(401).json({ error: 'Invalid Authorization format' });
    }



    try {
        // Kontrollime JWT tokenit
        const decoded = jwt.verify(token, JWT_SECRET);

        // Kontrollime kasutaja ID olemasolu
        if (!decoded.userId) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Lisame kasutaja ID päringule, et rate limiter saaks seda kasutada
        req.user = {
            id: decoded.userId
        };

        // Nüüd, kui JWT on valideeritud, rakendame rate limiterit
        authenticatedRateLimiter(req, res, async () => {
            try {
                // Kontrollime, et kasutaja eksisteerib
                const user = await prisma.user.findUnique({
                    where: { id: decoded.userId, emailConfirmed: true }
                });

                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }

                // Täiendame kasutaja infot päringus
                req.user = {
                    id: decoded.userId,
                    email: user.email,
                    role: user.affiliateOwner ? 'affiliate' : 'regular'
                };

                // Jätkame päringuga
                next();
            } catch (dbError) {
                console.error('Database error:', dbError);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    } catch (err) {
        console.error('JWT authentication error:', err);
        return res.status(401).json({ error: 'Authentication failed' });
    }
};