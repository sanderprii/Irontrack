const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit'); // Add rate limiter
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const util = require('util');
require('dotenv').config();


// Configure trust proxy for accurate IP detection behind reverse proxies
app.set('trust proxy', 1);

// Override JSON.stringify to handle BigInt values
JSON.stringify = (function(originalStringify) {
    return function(value, replacer, space) {
        return originalStringify(value, function(key, value) {
            // Convert BigInt to string
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return replacer ? replacer(key, value) : value;
        }, space);
    };
})(JSON.stringify);

// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://www.irontrack.ee',
    'https://www.irontrack.ee/api',
    'https://irontrack.ee',
    'http://localhost:5000',
    'http://crossfittartu.localhost:3000',
    'https://www.crossfittartu.irontack.ee',
    'https://crossfittartu.irontrack.ee',
    'http://crossfitviljandi.localhost:3000',
    'https://www.crossfitviljandi.irontrack.ee',
];

app.use(cors({
    origin: function(origin, callback) {
        // If no origin (e.g., Postman or server-to-server requests), allow the request
        if (!origin) return callback(null, true);

        // Check for allowed subdomain pattern
        const isIrontrackSubdomain = origin &&
            origin.match(/^https:\/\/[a-z0-9-]+\.irontrack.ee$/);

        if (allowedOrigins.indexOf(origin) !== -1 || isIrontrackSubdomain) {
            return callback(null, true);
        }

        const msg = 'CORS error: This site (' + origin + ') is not allowed to access the resource.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    exposedHeaders: ['Retry-After',
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset']
}));

app.options('*', cors());

// IP tracking middleware
const trackIP = async (req, res, next) => {
    try {
        // Get IP address
        const ip = req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            'unknown';

        // Store IP information in request for further use
        req.clientIP = ip;

        // Track request in database if you have an IPTracker model
        // This would require adding the IPTracker model to your Prisma schema

        await prisma.iPTracker.upsert({
            where: { ip },
            update: {
                requestCount: { increment: 1 },
                lastRequest: new Date()
            },
            create: {
                ip,
                requestCount: 1,
                lastRequest: new Date()
            }
        });

        // Check if IP is blocked
        const ipRecord = await prisma.iPTracker.findUnique({
            where: { ip }
        });

        if (ipRecord && ipRecord.blocked) {
            return res.status(403).json({ error: 'Access forbidden due to suspicious activity.' });
        }


        next();
    } catch (error) {
        console.error('IP tracking error:', error);
        next(); // Allow request to proceed even if tracking fails
    }
};

// Apply IP tracking middleware
app.use(trackIP);





// Server.js - muuda rate limiter seadistust
const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 minut
    max: 50000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        // Saada struktureeritud JSON vastus
        res.status(429).json({
            status: 'error',
            message: 'Päringute limiit ületatud, proovi hiljem uuesti',
            retryAfter: 60 // sekundites
        });
    }
});

// Apply global rate limiter to all requests
app.use(globalLimiter);

// More restrictive rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts. Please try again later.'
});


// Configure CORS


// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../client/build')));

// Parse JSON requests
app.use(express.json({
    replacer: (key, value) => {
        if (typeof value === 'bigint') {
            return value.toString();
        }
        return value;
    }
}));

// Middleware to handle subdomains
app.use(async (req, res, next) => {
    // Parse hostname to extract subdomain
    const hostname = req.hostname;

    // Skip for direct domain access but allow localhost subdomains
    if ((hostname === 'localhost' || hostname === 'irontrack.ee' || hostname === 'www.irontrack.ee') &&
        !hostname.match(/^[^.]+\.localhost$/)) {
        return next();
    }

    // Extract subdomain
    const parts = hostname.split('.');
    const subdomain = parts.length > 2 ? parts[0] : null;

    if (subdomain) {
        try {
            // Find affiliate by subdomain
            const affiliate = await prisma.affiliate.findFirst({
                where: { subdomain },
                include: {
                    trainers: {
                        include: {
                            trainer: true,
                        },
                    },
                    ClassSchedule: true,
                },
            });

            if (affiliate) {
                // Store affiliate data for use in frontend
                res.locals.affiliate = affiliate;

                // For API requests, continue to regular routing
                if (req.path.startsWith('/api/')) {
                    return next();
                }

                // Serve React app for all non-API requests
                // KEY POINT: Serve the React application's index.html
                const indexPath = path.join(__dirname, '../../client/build/index.html');

                // Check if file exists
                if (fs.existsSync(indexPath)) {
                    return res.sendFile(indexPath);
                } else {
                    return res.status(500).send("React build not found");
                }
            }
        } catch (error) {
            console.error('Error handling subdomain:', error);
        }
    }

    next();
});

// Add an API endpoint to get affiliate info by subdomain
app.get('/api/affiliate-by-subdomain', async (req, res) => {
    // If we already have the affiliate from the middleware
    if (res.locals.affiliate) {
        return res.json(res.locals.affiliate);
    }

    let subdomain;

    // First try: check if subdomain was passed in query parameter
    if (req.query.subdomain) {
        subdomain = req.query.subdomain;
    } else {
        // Second try: extract from hostname
        const hostname = req.hostname;
        const parts = hostname.split('.');
        subdomain = parts.length > 2 ? parts[0] : null;

        if (hostname.includes('localhost') && hostname !== 'localhost') {
            subdomain = hostname.split('.')[0];
        }
    }

    if (!subdomain || subdomain === 'www') {
        return res.status(400).json({ error: 'Invalid subdomain' });
    }

    try {
        const affiliate = await prisma.affiliate.findFirst({
            where: { subdomain },
            include: {
                trainers: {
                    include: {
                        trainer: true,
                    },
                },
                ClassSchedule: true,
            },
        });

        if (!affiliate) {
            return res.status(404).json({ error: 'Affiliate not found' });
        }

        res.json(affiliate);
    } catch (error) {
        console.error('Error fetching affiliate from subdomain:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const multer = require('multer');
const upload = multer({
    limits: { fileSize: 15 * 1024 * 1024 }, // 5MB
    storage: multer.memoryStorage()
});

// Import route modules
const trainingRoutes = require('./routes/trainingRoutes');
const recordsRoutes = require('./routes/recordsRoutes');
const authRoutes = require('./routes/auth');
const defaultWodRoutes = require('./routes/defaultWODRoutes');
const userRoutes = require('./routes/userRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');
const planRoutes = require('./routes/planRoutes');
const classRoutes = require("./routes/classRoutes");
const wodRoutes = require("./routes/wodRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const membersRoutes = require("./routes/membersController");
const financeRoutes = require("./routes/financeRoutes");
const getClassesRoutes = require("./routes/getClassesRoutes");
const creditRoutes = require('./routes/creditRoutes');
const logoRoutes = require('./routes/logoRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupsRoutes = require('./routes/groupsRoutes');
const contractRoutes = require('./routes/contractRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const trainingPlanRoutes = require('./routes/trainingPlanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const contactNoteRoutes = require('./routes/contactNoteRoutes');

// Import schedulers
const { startScheduler } = require('./schedulers/contractChecker');
const { startScheduler: startClassExtenderScheduler } = require('./schedulers/classExtenderScheduler');

// Apply specific rate limiters to auth routes
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/request-password-reset', authLimiter);

// Set up all API routes
app.use('/api/auth', authRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/wods', defaultWodRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/my-affiliate', affiliateRoutes);
app.use("/api", affiliateRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use("/api", planRoutes);
app.use("/api", classRoutes);
app.use("/api", wodRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", membersRoutes);
app.use("/api", financeRoutes);
app.use("/api", getClassesRoutes);
app.use('/api', logoRoutes);
app.use('/api', creditRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/messagegroups', groupsRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api', paymentRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/training-plans', trainingPlanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', contactNoteRoutes);

// Simple test endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to our API!' });
});

// Serve React app for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Critical error:', err);
    process.exit(1);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', promise, 'Reason:', reason);
});

// Function to check database connection
async function checkDatabase() {
    try {
        await prisma.$connect();
        console.log('Database connection OK');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

// Check database connection
checkDatabase();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // Start schedulers
    startScheduler();
    startClassExtenderScheduler();
});