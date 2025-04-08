// @ts-check
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './src/tests',
    testMatch: '**/*.test.js',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'api',
            testMatch: /.*\.test\.js/,
        },
    ],

    // Run your local dev server before starting the tests
    webServer: {
        command: 'npm start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});