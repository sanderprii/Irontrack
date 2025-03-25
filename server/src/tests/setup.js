const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Performs setup operations before tests run
 */
async function globalSetup() {
    console.log('Starting test setup...');

    try {
        // Check database connection
        await prisma.$connect();
        console.log('Database connection successful');

        // Create test user c@c.c if it doesn't exist
        const testUser1 = await prisma.user.findUnique({
            where: { email: 'c@c.c' }
        });

        if (!testUser1) {
            console.log('Creating test user c@c.c...');
            // Using bcrypt directly to avoid circular dependencies
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('cccccc', 10);

            await prisma.user.create({
                data: {
                    email: 'c@c.c',
                    password: hashedPassword,
                    fullName: 'Test User C',
                    emailConfirmed: true,
                }
            });
            console.log('Test user c@c.c created');
        } else {
            console.log('Test user c@c.c already exists');
        }

        // Create test user d@d.d if it doesn't exist
        const testUser2 = await prisma.user.findUnique({
            where: { email: 'd@d.d' }
        });

        if (!testUser2) {
            console.log('Creating test user d@d.d...');
            // Using bcrypt directly to avoid circular dependencies
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('dddddd', 10);

            await prisma.user.create({
                data: {
                    email: 'd@d.d',
                    password: hashedPassword,
                    fullName: 'Test User D',
                    emailConfirmed: true,
                }
            });
            console.log('Test user d@d.d created');
        } else {
            console.log('Test user d@d.d already exists');
        }

    } catch (error) {
        console.error('Setup error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    console.log('Setup completed');
}

module.exports = globalSetup;