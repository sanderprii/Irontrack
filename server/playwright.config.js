// @ts-check
const { defineConfig } = require('@playwright/test');
require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    testDir: './src/tests',
    globalSetup: './src/tests/setup.js',
    globalTeardown: './src/tests/teardown.js',
    timeout: 30000, // 30 seconds
    fullyParallel: false, // Run tests in order
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 1, // Run one at a time for API tests
    reporter: 'html',

    use: {
        baseURL: 'http://localhost:5000',
        trace: 'on-first-retry',
        extraHTTPHeaders: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },

    projects: [
        {
            name: 'api',
            testMatch: /.*\.test\.js/,
        },
    ],

    // Run your local dev server before starting the tests
    webServer: {
        command: 'node src/index.js',
        url: 'http://localhost:5000/api',
        reuseExistingServer: !process.env.CI,
        timeout: 30000, // Increased timeout for server start
    },
});