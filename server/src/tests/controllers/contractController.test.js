const { test, expect } = require('@playwright/test');
const config = require('../config');

test.describe.configure({ mode: 'serial' });
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
            console.error('Get contracts test failed:', error);
            throw error;
        }
    });

    // Test createContract endpoint
    test('2. POST /api/contracts - should create a new contract', async ({ request }) => {
        try {
            if (!affiliateToken || !affiliateId || !testUserId) {
                throw new Error('Required credentials missing');
            }

            const contractData = {
                userId: testUserId,
                contractType: 'Monthly Membership',
                content: 'Test contract content',
                affiliateId: affiliateId,
                paymentType: 'monthly',
                paymentAmount: 100,
                paymentInterval: null,
                paymentDay: 1,
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
                startDate: new Date().toISOString(),
                trainingTypes: ['WOD', 'Gymnastics'],
                firstPaymentAmount: 50
            };

            console.log('Sending contract data:', JSON.stringify(contractData, null, 2));

            const response = await request.post(`${config.baseURL}/api/contracts`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`,
                    'Content-Type': 'application/json'
                },
                data: contractData
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Create contract failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const newContract = await response.json();
            console.log(`Created contract with ID: ${newContract.id}`);

            // Store the contract ID for later tests
            testContractId = newContract.id;

            // Verify contract structure
            expect(newContract).toHaveProperty('id');
            expect(newContract.status).toBe('draft');
            expect(newContract.userId).toBe(testUserId);
            expect(newContract.affiliateId).toBe(affiliateId);

        } catch (error) {
            console.error('Create contract test failed:', error);
            throw error;
        }
    });

    // Test getContractById endpoint
    test('3. GET /api/contracts/:id - should get a specific contract', async ({ request }) => {
        try {
            if (!affiliateToken || !testContractId) {
                throw new Error('Auth token or contract ID not available');
            }

            const response = await request.get(`${config.baseURL}/api/contracts/${testContractId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get contract by ID failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const contract = await response.json();
            expect(contract.id).toBe(testContractId);
            expect(contract).toHaveProperty('contractType');
            expect(contract).toHaveProperty('status');

        } catch (error) {
            console.error('Get contract by ID test failed:', error);
            throw error;
        }
    });

    // Test acceptContract endpoint
    test('4. POST /api/contracts/:id/accept - should accept a contract', async ({ request }) => {
        try {
            if (!userToken || !testContractId || !testUserId || !affiliateId) {
                throw new Error('Required credentials or contract ID missing');
            }

            const acceptData = {
                userId: testUserId,
                affiliateId: affiliateId,
                contractId: testContractId,
                acceptType: 'checkbox',
                contractTermsId: 2,
                appliedCredit: 0,
                invoiceNumber: `TEST-${testContractId}-${Date.now()}`
            };

            const response = await request.post(`${config.baseURL}/api/contracts/${testContractId}/accept`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                data: acceptData
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Accept contract failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const acceptedContract = await response.json();
            expect(acceptedContract.status).toBe('accepted');
            expect(acceptedContract).toHaveProperty('acceptedAt');

            console.log(`Successfully accepted contract with ID: ${testContractId}`);

        } catch (error) {
            console.error('Accept contract test failed:', error);
            throw error;
        }
    });

    // Test getUserContracts endpoint
    test('5. GET /api/contracts/user/:userId - should get user contracts', async ({ request }) => {
        try {
            if (!userToken || !testUserId || !affiliateId) {
                throw new Error('Auth token or user ID not available');
            }

            const response = await request.get(`${config.baseURL}/api/contracts/user/${testUserId}?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get user contracts failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const userContracts = await response.json();
            expect(Array.isArray(userContracts)).toBeTruthy();

            // Should include our test contract
            const testContract = userContracts.find(c => c.id === testContractId);
            expect(testContract).toBeDefined();
            expect(testContract.status).toBe('accepted');

        } catch (error) {
            console.error('Get user contracts test failed:', error);
            throw error;
        }
    });

    // Test createPaymentHoliday endpoint
    test('6. POST /api/contracts/:id/payment-holiday - should create a payment holiday', async ({ request }) => {
        try {
            if (!userToken || !testContractId || !testUserId || !affiliateId) {
                throw new Error('Required credentials or contract ID missing');
            }

            const holidayData = {
                userId: testUserId,
                affiliateId: affiliateId,
                month: '2024-06',
                reason: 'Summer vacation'
            };

            const response = await request.post(`${config.baseURL}/api/contracts/${testContractId}/payment-holiday`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                data: holidayData
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Create payment holiday failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const result = await response.json();
            expect(result.success).toBe(true);
            expect(result.paymentHoliday).toHaveProperty('id');
            expect(result.paymentHoliday.accepted).toBe('pending');

        } catch (error) {
            console.error('Create payment holiday test failed:', error);
            throw error;
        }
    });

    // Test getUnpaidUsers endpoint
    test('7. GET /api/contracts/unpaid - should get unpaid users', async ({ request }) => {
        try {
            if (!affiliateToken || !affiliateId) {
                throw new Error('Auth token or affiliate ID not available');
            }

            const response = await request.get(`${config.baseURL}/api/contracts/unpaid?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            if (!response.ok()) {
                const errorText = await response.text();
                console.error(`Get unpaid users failed with status ${response.status()}`);
                console.error('Error response:', errorText);
            }

            expect(response.ok()).toBeTruthy();

            const unpaidUsers = await response.json();
            expect(Array.isArray(unpaidUsers)).toBeTruthy();

            console.log(`Found ${unpaidUsers.length} unpaid users`);

        } catch (error) {
            console.error('Get unpaid users test failed:', error);
            throw error;
        }
    });




});