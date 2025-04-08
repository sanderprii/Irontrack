const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './server/src/tests/controllers',
  testMatch: '**/*.test.js',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 2,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    actionTimeout: 0,
  },
}); 