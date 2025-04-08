// This script can be used to run all tests in sequence
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const controllers = [
    'auth',
    'affiliate',
    'class',
    'contract',
    'credit',
    'wod',
    'training',
    'user',
    'payment',
    'admin',
    'defaultWOD',
    'groups',
    'logo',
    'message',
    'statistics',
    'leaderboard',
    'trainer',
    'records',
    'trainingPlan',
    'analytics',
    'plan',
    'contactNote'
];

async function runTests() {
    console.log('Starting all tests...\n');

    for (const controller of controllers) {
        try {
            console.log(`Running tests for ${controller}Controller...`);
            const { stdout, stderr } = await execAsync(`npm run test:${controller}`);
            console.log(stdout);
            if (stderr) console.error(stderr);
            console.log(`\nTests for ${controller}Controller completed.\n`);
        } catch (error) {
            console.error(`Error running tests for ${controller}Controller:`, error);
        }
    }

    console.log('All tests completed.');
}

runTests().catch(console.error);