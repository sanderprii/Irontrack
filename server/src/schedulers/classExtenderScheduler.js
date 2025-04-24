const cron = require('node-cron');
const { extendRepeatingClasses } = require('../services/classExtenderService');

/**
 * Starts the scheduler that extends repeating classes
 * Runs every Thursday at 3:00 AM
 */
function startScheduler() {
    console.log('Class extender scheduler initialized');

    // Run every Thursday at 3:00 AM (0 3 * * 4)
    // Day 4 = Thursday (0=Sunday, 1=Monday, ..., 6=Saturday)
    cron.schedule('0 3 * * 4', async () => {
        console.log('Running class extender job at:', new Date().toISOString());
        try {
            const result = await extendRepeatingClasses();
            if (result.success) {
                console.log(`Class extender job completed successfully, added ${result.count} new classes`);
            } else {
                console.error('Class extender job failed:', result.error);
            }
        } catch (error) {
            console.error('Class extender job failed with exception:', error);
        }
    });
}

module.exports = { startScheduler };