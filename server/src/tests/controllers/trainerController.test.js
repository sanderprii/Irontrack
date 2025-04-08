const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

test.describe('Trainer Controller', () => {
    let authToken;

    test.beforeEach(async ({ request }) => {
        try {
            // Authenticate before each test
            const loginResponse = await request.post('/api/auth/login', {
                data: {
                    email: 'd@d.d',
                    password: 'dddddd'
                }
            });
            expect(loginResponse.status()).toBe(200);
            const loginData = await loginResponse.json();
            authToken = loginData.token;
        } catch (error) {
            await sendTestFailureReport({
                testName: 'Trainer Controller - Authentication',
                error: error.message,
                endpoint: '/api/auth/login',
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    });

    test.describe('getTrainerAffiliates', () => {
        test('should return trainer affiliates', async ({ request }) => {
            try {
                const response = await request.get('/api/trainer/affiliates', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(200);
                
                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
                // Don't check for specific properties since the array might be empty
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Trainer Controller - Get Trainer Affiliates',
                    error: error.message,
                    endpoint: '/api/trainer/affiliates',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get('/api/trainer/affiliates');
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Trainer Controller - Get Trainer Affiliates Unauthorized',
                    error: error.message,
                    endpoint: '/api/trainer/affiliates',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });
}); 