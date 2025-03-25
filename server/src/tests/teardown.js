const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Performs cleanup operations after tests run
 */
async function globalTeardown() {
    console.log('Starting test cleanup...');

    try {
        // Any cleanup that needs to happen after tests
        // For real tests, you might want to clean up test data
        // For this example, we're keeping the test user

        await prisma.$disconnect();
        console.log('Database disconnected');
    } catch (error) {
        console.error('Teardown error:', error);
    }

    console.log('Cleanup completed');
}

module.exports = globalTeardown;