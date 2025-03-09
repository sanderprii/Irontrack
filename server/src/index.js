const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const fs = require('fs');
const express = require('express');
const app = express();
app.set('trust proxy', 1);

require('dotenv').config();

const path = require('path');

const allowedOrigins = [
    'http://localhost:3000',
    'https://www.irontrack.ee',
    'https://www.irontrack.ee/api',
    'https://irontrack.ee',
    'http://localhost:5000',
    'http://crossfittartu.localhost:3000',
    'https://www.crossfittartu.irontack.ee',
    'https://crossfittartu.irontrack.ee',
];


app.use(cors({
    origin: function(origin, callback) {
        // Debug: Logi origin, et näha, mida täpselt võrreldakse


        // Kui päringu päritolu pole määratud (nt Postmani või server-to-server päringud), lase see läbi
        if (!origin) return callback(null, true);

        // Lisa dünaamiline localhost subdomainide kontroll
        const isLocalSubdomain = origin &&
            origin.match(/^https:\/\/[a-z0-9-]+\.irontrack.ee$/);

        if (allowedOrigins.indexOf(origin) !== -1 || isLocalSubdomain) {
            return callback(null, true);
        }

        const msg = 'CORS error: This site (' + origin + ') is not allowed to access the resource.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

// Lisa see enne marsruutide defineerimist
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(express.json());
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

                
                // TÄRGE KOHT: Teenuse React rakenduse index.html
                const indexPath = path.join(__dirname, '../../client/build/index.html');

                
                // Kontrolli kas fail eksisteerib
                if (fs.existsSync(indexPath)) {

                    return res.sendFile(indexPath);
                } else {

                    return res.status(500).send("React build not found");
                }
            } else {

            }
        } catch (error) {

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



const session = require('express-session');
const MemoryStore = require('memorystore')(session);
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

const { startScheduler } = require('./schedulers/contractChecker');








{/*
app.use(cors({
    origin: function(origin, callback) {
        // Debug: Logi origin, et näha, mida täpselt võrreldakse
        console.log('Origin header:', origin);

        // Kui päringu päritolu pole määratud (nt Postmani või server-to-server päringud), lase see läbi
        if (!origin) return callback(null, true);

        // Lisa dünaamiline localhost subdomainide kontroll
        const isLocalSubdomain = origin &&
            origin.match(/^http:\/\/[a-z0-9-]+\.localhost:3000$/);

        if (allowedOrigins.indexOf(origin) !== -1 || isLocalSubdomain) {
            return callback(null, true);
        }

        const msg = 'CORS error: This site (' + origin + ') is not allowed to access the resource.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
//*/}




// Liidame auth-routingu
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
// Lihtne test endpoint
app.get('/api', (req, res) => {
    res.json({ message: 'Tere tulemast meie API-sse!' });
});

process.on('uncaughtException', (err) => {
    console.error('Kritiline viga:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Töötlemata lubamus:', promise, 'Põhjus:', reason);
});

async function checkDatabase() {
    try {
        await prisma.$connect();
        console.log('Andmebaasi ühendus OK');
    } catch (error) {
        console.error('Andmebaasi ühenduse viga:', error);
        process.exit(1);
    }
}

checkDatabase();

// Serveri käivitamine
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server käivitunud pordil ${PORT}`);

    startScheduler();
});
