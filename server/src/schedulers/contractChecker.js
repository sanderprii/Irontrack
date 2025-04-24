const cron = require('node-cron');
const { processContractPayments } = require('../services/contractService');

// Käivita iga päev kell 8:00 hommikul
function startScheduler() {
    console.log('Contract payment scheduler initialized');

    cron.schedule('42 10 * * *', async () => {
        console.log('Running contract payment job at:', new Date().toISOString());
        try {
            await processContractPayments();
            console.log('Contract payment job completed successfully');
        } catch (error) {
            console.error('Contract payment job failed:', error);
        }
    });
}

module.exports = { startScheduler };