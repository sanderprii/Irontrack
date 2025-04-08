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
        baseURL: 'http://localhost:5000',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'api',
            testMatch: /.*\.test\.js/,
        },
    ],

  
});