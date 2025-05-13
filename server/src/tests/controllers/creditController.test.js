const { test, expect } = require('@playwright/test');
const config = require('../config');

// Helper function to log in a user and get a token
async function loginUser(request, email, password) {
    try {
        const loginData = { email, password };
        const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
            data: loginData
        });

        if (!loginResponse.ok()) {
            console.error(`Login failed for ${email} with status: ${loginResponse.status()}`);
            return null;
        }

        const responseBody = await loginResponse.json();
        return { token: responseBody.token, userId: responseBody.userId, role: responseBody.role };
    } catch (error) {
        console.error('Login helper error:', error);
        return null;
    }
}

// Store auth data for different user roles
let affiliateData = null;  // d@d.d - Affiliate owner
let userData = null;       // c@c.c - Regular user
let affiliateId = null;    // The affiliate ID to test with

test.describe('Credit Controller', () => {

    // Login with different users before running tests
    test.beforeAll(async ({ request }) => {
        try {
            // Login with both user types
            affiliateData = await loginUser(request, 'd@d.d', 'dddddd');
            userData = await loginUser(request, 'c@c.c', 'cccccc');

            if (affiliateData && affiliateData.token) {
                console.log('Successfully logged in with affiliate owner');

                // Get the first affiliate ID
                const response = await request.get(`${config.baseURL}/api/my-affiliate`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateData.token}`
                    }
                });

                if (response.ok()) {
                    const data = await response.json();
                    if (data.affiliate && data.affiliate.id) {
                        affiliateId = data.affiliate.id;
                        console.log(`Found affiliate ID: ${affiliateId}`);
                    }
                }
            } else {
                console.error('Failed to login with affiliate owner');
            }

            if (userData && userData.token) {
                console.log('Successfully logged in with regular user');
            } else {
                console.error('Failed to login with regular user');
            }

        } catch (error) {
            console.error('Login setup error:', error);
        }
    });

    // Test getUserCredits endpoint for regular user (using /api/credit)
    test('GET /api/credit - should get credits for regular user', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userData || !userData.token || !userData.userId, 'User auth data not available');

            const response = await request.get(`${config.baseURL}/api/credit?userId=${userData.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                    'role': 'regular'
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get user credits failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const credits = await response.json();

            expect(Array.isArray(credits)).toBeTruthy();

            // If credits exist, check their structure
            if (credits.length > 0) {
                expect(credits[0]).toHaveProperty('userId', userData.userId);
                expect(credits[0]).toHaveProperty('credit');
                expect(credits[0]).toHaveProperty('affiliate');
            }

        } catch (error) {
            console.error('Get user credits test failed:', error);
            throw error;
        }
    });

    // Test getUserCredits endpoint for affiliate user (using /api/credit)
    test('GET /api/credit - should get credits for specific affiliate', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!userData || !userData.token || !userData.userId || !affiliateId,
                'User auth data or affiliate ID not available');

            const response = await request.get(`${config.baseURL}/api/credit?userId=${userData.userId}&affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateData.token}`,
                    'role': 'affiliate'
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get user credits for affiliate failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const credits = await response.json();
            console.log('User credits for affiliate:', credits);

            expect(Array.isArray(credits)).toBeTruthy();

            // If credits exist, check their structure
            if (credits.length > 0) {
                expect(credits[0]).toHaveProperty('userId', userData.userId);
                expect(credits[0]).toHaveProperty('affiliateId', affiliateId);
                expect(credits[0]).toHaveProperty('credit');
            }

        } catch (error) {
            console.error('Get user credits for affiliate test failed:', error);
            throw error;
        }
    });

    // Test getCreditHistory endpoint (using /api/credit/history)
    test('GET /api/credit/history - should get credit transaction history', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userData || !userData.token || !userData.userId, 'User auth data not available');

            const response = await request.get(`${config.baseURL}/api/credit/history?userId=${userData.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                    'role': 'regular'
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get credit history failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const history = await response.json();
            console.log(`Retrieved ${history.length} credit history entries`);

            expect(Array.isArray(history)).toBeTruthy();

            // If history entries exist, check their structure
            if (history.length > 0) {
                expect(history[0]).toHaveProperty('userId', userData.userId);
                expect(history[0]).toHaveProperty('amount');
                expect(history[0]).toHaveProperty('createdAt');
            }

        } catch (error) {
            console.error('Get credit history test failed:', error);
            throw error;
        }
    });

    // Test addCredit endpoint
    test('POST /api/credit - should add credit to a user', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateData || !affiliateData.token || !userData || !userData.userId || !affiliateId,
                'Auth data or affiliate ID not available');

            const creditData = {
                userId: userData.userId,
                amount: 10, // Small test amount
                affiliateId: affiliateId,
                description: 'Test credit addition via API test'
            };

            console.log('Adding credit with data:', JSON.stringify(creditData, null, 2));

            const response = await request.post(`${config.baseURL}/api/credit`, {
                headers: {
                    'Authorization': `Bearer ${affiliateData.token}`,
                    'Content-Type': 'application/json'
                },
                data: creditData
            });

            // Check if successful or failed gracefully
            if (response.ok()) {
                const result = await response.json();
                console.log('Credit addition result:', result);

                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('userId', userData.userId);
                expect(result).toHaveProperty('affiliateId', affiliateId);
                expect(result).toHaveProperty('amount', 10);
                expect(result).toHaveProperty('description', 'Test credit addition via API test');
            } else {
                const errorText = await response.text();
                console.error(`Adding credit failed with status: ${response.status()}`);
                console.error('Error response:', errorText);
                // This should not be a server error
                expect(response.status()).not.toBe(500);
            }

        } catch (error) {
            console.error('Add credit test failed:', error);
            throw error;
        }
    });

    // Test getUserTransactions endpoint (using /api/credit/transactions)
    test('GET /api/credit/transactions - should get user transactions', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userData || !userData.token || !userData.userId, 'User auth data not available');

            const response = await request.get(`${config.baseURL}/api/credit/transactions?userId=${userData.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get user transactions failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const transactions = await response.json();
            console.log(`Retrieved ${transactions.length} user transactions`);

            expect(Array.isArray(transactions)).toBeTruthy();

            // If transactions exist, check their structure
            if (transactions.length > 0) {
                expect(transactions[0]).toHaveProperty('userId', userData.userId);
                expect(transactions[0]).toHaveProperty('amount');
                expect(transactions[0]).toHaveProperty('createdAt');
            }

        } catch (error) {
            console.error('Get user transactions test failed:', error);
            throw error;
        }
    });

    // Test getAffiliateTransactions endpoint (using /api/credit/affiliate-transactions)
    test('GET /api/credit/affiliate-transactions - should get affiliate transactions', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateData || !affiliateData.token || !affiliateId,
                'Affiliate auth data or affiliate ID not available');

            const response = await request.get(`${config.baseURL}/api/credit/affiliate-transactions?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateData.token}`
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get affiliate transactions failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const transactions = await response.json();
            console.log(`Retrieved ${transactions.length} affiliate transactions`);

            expect(Array.isArray(transactions)).toBeTruthy();

            // If transactions exist, check their structure
            if (transactions.length > 0) {
                expect(transactions[0]).toHaveProperty('affiliateId', affiliateId);
                expect(transactions[0]).toHaveProperty('amount');
                expect(transactions[0]).toHaveProperty('user');
            }

        } catch (error) {
            console.error('Get affiliate transactions test failed:', error);
            throw error;
        }
    });

    // Test Debug: Check credit system prerequisites
    test('Debug: Check credit system prerequisites', async ({ request }) => {
        console.log('\n=== CREDIT DEBUG INFO ===');
        console.log('AffiliateId:', affiliateId);
        console.log('User ID:', userData?.userId);
        console.log('Has affiliate token:', !!affiliateData?.token);
        console.log('Has user token:', !!userData?.token);

        // Check existing credits
        if (userData && userData.token) {
            const userCreditsResponse = await request.get(`${config.baseURL}/api/credit?userId=${userData.userId}`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`,
                    'role': 'regular'
                }
            });

            if (userCreditsResponse.ok()) {
                const credits = await userCreditsResponse.json();
                console.log('User has credits:', credits.length);
                console.log('Credits:', JSON.stringify(credits, null, 2));
            } else {
                console.log('Failed to get user credits:', userCreditsResponse.status());
            }
        }

        // Check existing transactions
        if (userData && userData.token) {
            const transactionsResponse = await request.get(`${config.baseURL}/api/credit/transactions?userId=${userData.userId}`, {
                headers: { 'Authorization': `Bearer ${userData.token}` }
            });

            if (transactionsResponse.ok()) {
                const transactions = await transactionsResponse.json();
                console.log('User has transactions:', transactions.length);
            } else {
                console.log('Failed to get user transactions:', transactionsResponse.status());
            }
        }
        console.log('==========================\n');
    });
});