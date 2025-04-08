const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');
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
        return responseBody.token;
    } catch (error) {
        console.error('Login helper error:', error);
        return null;
    }
}

// Helper function to get a test user ID
async function getUserIdForTesting(request, token = null) {
    try {
        if (!token) return null;

        const response = await request.get(`${config.baseURL}/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok()) {
            const user = await response.json();
            return user.id;
        }

        return null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}

// Store auth tokens for different user roles
let affiliateToken = null;  // d@d.d - Affiliate owner
let userToken = null;       // c@c.c - Regular user
let affiliateId = null;     // The affiliate ID to test with
let testContractId = null;  // Contract ID created during testing
let testUserId = null;      // User ID for testing

// Configure tests to run in serial mode
test.describe.configure({ mode: 'serial' });

test.describe('Contract Controller', () => {
    // Login with different users before running tests
    test.beforeAll(async ({ request }) => {
        try {
            // Login with both user types
            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');
            userToken = await loginUser(request, 'c@c.c', 'cccccc');

            if (affiliateToken) {
                console.log('Successfully logged in with affiliate owner');

                // Get the first affiliate ID
                const response = await request.get(`${config.baseURL}/api/my-affiliate`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
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

            if (userToken) {
                console.log('Successfully logged in with regular user');
                testUserId = await getUserIdForTesting(request, userToken);
                console.log(`Found user ID: ${testUserId}`);
            } else {
                console.error('Failed to login with regular user');
            }

        } catch (error) {
            console.error('Login setup error:', error);
            await sendTestFailureReport(
                'Contract Controller Test Setup Failure',
                error,
                { testUsers: ['d@d.d', 'c@c.c'] }
            );
        }
    });

    // Test getAllContracts endpoint
    test('1. GET /api/contracts - should get a list of contracts', async ({ request }) => {
        try {
            if (!affiliateToken || !affiliateId) {
                throw new Error('Auth token or affiliate ID not available');
            }

            const response = await request.get(`${config.baseURL}/api/contracts?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const contracts = await response.json();
            console.log(`Retrieved ${contracts.length} contracts`);

            // Contracts should be an array
            expect(Array.isArray(contracts)).toBeTruthy();

            // If contracts exist, test the structure
            if (contracts.length > 0) {
                expect(contracts[0]).toHaveProperty('id');
                expect(contracts[0]).toHaveProperty('status');
                expect(contracts[0]).toHaveProperty('user');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Contracts Test Failure',
                error,
                {
                    endpoint: '/api/contracts',
                    affiliateId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });
});