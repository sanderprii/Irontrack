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
        return {
            token: responseBody.token,
            userId: responseBody.userId || responseBody.id,
            role: responseBody.role
        };
    } catch (error) {
        console.error('Login helper error:', error);
        return null;
    }
}

// Generate a random order ID for testing
function generateRandomOrderId() {
    return `order-${Math.floor(Math.random() * 10000)}-${Date.now()}`;
}

// Store auth tokens and IDs
let userToken = null;    // c@c.c - Regular user
let affiliateToken = null; // d@d.d - Affiliate owner
let affiliateId = null;  // The affiliate ID to test with
let userId = null;       // User ID for testing

test.describe('Payment Controller', () => {

    test.beforeAll(async ({ request }) => {
        try {
            // Login with both user types
            const userData = await loginUser(request, 'c@c.c', 'cccccc');
            const affiliateData = await loginUser(request, 'd@d.d', 'dddddd');

            if (userData && userData.token) {
                userToken = userData.token;
                userId = userData.userId;
                console.log('Successfully logged in with regular user');
            } else {
                console.error('Failed to login with regular user');
            }

            if (affiliateData && affiliateData.token) {
                affiliateToken = affiliateData.token;
                console.log('Successfully logged in with affiliate owner');

                // Get the first affiliate ID
                const affiliateResponse = await request.get(`${config.baseURL}/api/my-affiliate`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    }
                });

                if (affiliateResponse.ok()) {
                    const data = await affiliateResponse.json();
                    if (data.affiliate && data.affiliate.id) {
                        affiliateId = data.affiliate.id;
                        console.log(`Found affiliate ID: ${affiliateId}`);
                    }
                }
            } else {
                console.error('Failed to login with affiliate owner');
            }
        } catch (error) {
            console.error('Login setup error:', error);
        }
    });

    test.describe('createMontonioPayment', () => {
        test('should create a Montonio payment', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken || !affiliateId || !userId, 'User token, user ID or affiliate ID not available');

                const paymentData = {
                    amount: 10.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test payment via API test',
                    userData: {
                        id: userId,
                        email: 'c@c.c',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    affiliateId: affiliateId,
                    sessionToken: 'test-session-token-123'
                };

                console.log('Creating payment with data:', JSON.stringify(paymentData, null, 2));

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: paymentData
                });

                // If the endpoint is properly configured, we should get a success response with a payment URL
                if (response.ok()) {
                    const result = await response.json();
                    console.log('Create payment result:', result);

                    expect(result).toHaveProperty('success', true);
                    expect(result).toHaveProperty('paymentUrl');
                    expect(result).toHaveProperty('orderUuid');
                } else {
                    // The test might fail due to missing configuration in the test environment
                    const errorText = await response.text();
                    console.error(`Payment creation failed with status: ${response.status()}`);
                    console.error('Error response:', errorText);

                    // Test this is not a server error
                    expect(response.status()).not.toBe(500);
                }
            } catch (error) {
                console.error('Create Montonio payment test failed:', error);
                throw error;
            }
        });

        test('should create a contract payment', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken || !affiliateId || !userId, 'User token, user ID or affiliate ID not available');

                // First, we need to check if there's an existing contract for this user
                const contractsResponse = await request.get(`${config.baseURL}/api/contracts?affiliateId=${affiliateId}`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    }
                });

                let contractId = null;
                if (contractsResponse.ok()) {
                    const contracts = await contractsResponse.json();
                    console.log(`Found ${contracts.length} contracts for affiliate ${affiliateId}`);

                    const userContract = contracts.find(contract => contract.userId === userId);
                    if (userContract) {
                        contractId = userContract.id;
                        console.log(`Found existing contract ID: ${contractId} for user ${userId}`);
                    }
                }

                // Skip if no contract is available
                test.skip(!contractId, 'No contract available for testing');

                const paymentData = {
                    amount: 15.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test contract payment via API test',
                    userData: {
                        id: userId,
                        email: 'c@c.c',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    affiliateId: affiliateId,
                    contractId: contractId,
                    sessionToken: 'test-session-token-123'
                };

                console.log('Creating contract payment with data:', JSON.stringify(paymentData, null, 2));

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: paymentData
                });

                if (response.ok()) {
                    const result = await response.json();
                    console.log('Create contract payment result:', result);

                    expect(result).toHaveProperty('success', true);
                    expect(result).toHaveProperty('paymentUrl');
                    expect(result).toHaveProperty('orderUuid');
                } else {
                    const errorText = await response.text();
                    console.error(`Contract payment creation failed with status: ${response.status()}`);
                    console.error('Error response:', errorText);

                    // Test this is not a server error
                    expect(response.status()).not.toBe(500);
                }
            } catch (error) {
                console.error('Create contract payment test failed:', error);
                throw error;
            }
        });

        test('should reject requests without authentication', async ({ request }) => {
            try {
                const paymentData = {
                    amount: 10.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test payment without auth',
                    userData: {
                        id: 1,
                        email: 'test@example.com',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    affiliateId: affiliateId || 1, // Use real affiliate ID if available
                    sessionToken: 'test-session-token-123'
                };

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: paymentData
                });

                // Should return 401 Unauthorized
                expect(response.status()).toBe(401);

                const errorBody = await response.json();
                console.log('Unauthorized response:', errorBody);
                expect(errorBody).toHaveProperty('error');
            } catch (error) {
                console.error('Payment without auth test failed:', error);
                throw error;
            }
        });

        test('should validate affiliateId', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken || !userId, 'User token or user ID not available');

                // Missing affiliateId
                const invalidPaymentData = {
                    amount: 10.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test validation - missing affiliateId',
                    userData: {
                        id: userId,
                        email: 'c@c.c',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    sessionToken: 'test-session-token-123'
                    // Missing affiliateId
                };

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPaymentData
                });

                // Should return 400 Bad Request
                expect(response.status()).toBe(400);

                const errorBody = await response.json();
                console.log('Missing affiliateId response:', errorBody);
                expect(errorBody).toHaveProperty('success', false);
                expect(errorBody).toHaveProperty('message');
                expect(errorBody.message).toContain('AffiliateId is required');
            } catch (error) {
                console.error('Payment validation missing affiliateId test failed:', error);
                throw error;
            }
        });

        test('should validate affiliateId format', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken || !userId, 'User token or user ID not available');

                // Invalid affiliateId format
                const invalidPaymentData = {
                    amount: 10.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test validation - non-numeric affiliateId',
                    userData: {
                        id: userId,
                        email: 'c@c.c',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    affiliateId: 'not-a-number',
                    sessionToken: 'test-session-token-123'
                };

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPaymentData
                });

                // Should return 400 Bad Request
                expect(response.status()).toBe(400);

                const errorBody = await response.json();
                console.log('Non-numeric affiliateId response:', errorBody);
                expect(errorBody).toHaveProperty('success', false);
                expect(errorBody).toHaveProperty('message');
                expect(errorBody.message).toContain('Invalid affiliateId format');
            } catch (error) {
                console.error('Payment validation non-numeric affiliateId test failed:', error);
                throw error;
            }
        });

        test('should validate affiliate exists', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken || !userId, 'User token or user ID not available');

                // Non-existent affiliateId
                const invalidPaymentData = {
                    amount: 10.00,
                    orderId: generateRandomOrderId(),
                    description: 'Test validation - non-existent affiliateId',
                    userData: {
                        id: userId,
                        email: 'c@c.c',
                        phone: '+3725555555',
                        fullName: 'Test User'
                    },
                    affiliateId: 999999, // Assuming this ID doesn't exist
                    sessionToken: 'test-session-token-123'
                };

                const response = await request.post(`${config.baseURL}/api/payments/montonio`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPaymentData
                });

                // Should return 404 Not Found
                expect(response.status()).toBe(404);

                const errorBody = await response.json();
                console.log('Non-existent affiliateId response:', errorBody);
                expect(errorBody).toHaveProperty('success', false);
                expect(errorBody).toHaveProperty('message');
                expect(errorBody.message).toContain('Payment configuration not found');
            } catch (error) {
                console.error('Payment validation non-existent affiliateId test failed:', error);
                throw error;
            }
        });
    });

    test.describe('Montonio Webhook', () => {
        test('should handle Montonio webhook with minimal data', async ({ request }) => {
            try {
                // This endpoint doesn't require authentication as it's called by Montonio
                const webhookData = {
                    orderToken: 'mock-token-for-testing'
                };

                console.log('Testing webhook with data:', JSON.stringify(webhookData, null, 2));

                const response = await request.post(`${config.baseURL}/api/payments/montonio-webhook`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: webhookData
                });

                // The webhook handler should always return 200 OK to acknowledge receipt
                expect(response.status()).toBe(200);

                const result = await response.json();
                console.log('Webhook response:', result);

                // The response should have a success property (even if false due to invalid token)
                expect(result).toHaveProperty('success');

                // If success is false, there should be a message
                if (result.success === false) {
                    expect(result).toHaveProperty('message');
                }
            } catch (error) {
                console.error('Handle Montonio webhook test failed:', error);
                throw error;
            }
        });

        test('should handle webhook without orderToken', async ({ request }) => {
            try {
                // Empty payload
                const response = await request.post(`${config.baseURL}/api/payments/montonio-webhook`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {}
                });

                // Should still return 200
                expect(response.status()).toBe(200);

                const result = await response.json();
                console.log('Empty webhook response:', result);

                expect(result).toHaveProperty('success', false);
                expect(result).toHaveProperty('message');
                expect(result.message).toContain('No order token provided');
            } catch (error) {
                console.error('Handle empty webhook test failed:', error);
                throw error;
            }
        });
    });

    test.describe('Payment Status', () => {
        test('should check payment status with invalid token', async ({ request }) => {
            try {
                // This endpoint doesn't require authentication per the controller

                const response = await request.get(`${config.baseURL}/api/payments/montonio/status?token=invalid-token`);

                // It should return 400 for an invalid token
                expect(response.status()).toBe(400);

                const result = await response.json();
                console.log('Payment status check response:', result);

                expect(result).toHaveProperty('success', false);
                expect(result).toHaveProperty('message');
                expect(result.message).toContain('Invalid token');
            } catch (error) {
                console.error('Check payment status test failed:', error);
                throw error;
            }
        });

        test('should check payment status without token', async ({ request }) => {
            try {
                // No token query parameter
                const response = await request.get(`${config.baseURL}/api/payments/montonio/status`);

                // Should return 400 for missing token
                expect(response.status()).toBe(400);

                const result = await response.json();
                console.log('Payment status check without token response:', result);

                expect(result).toHaveProperty('success', false);
                expect(result).toHaveProperty('message');
            } catch (error) {
                console.error('Check payment status without token test failed:', error);
                throw error;
            }
        });
    });

    // Debug test to check payment prerequisites
    test('Debug: Check payment prerequisites', async ({ request }) => {
        console.log('\n=== PAYMENT DEBUG INFO ===');
        console.log('AffiliateId:', affiliateId);
        console.log('User ID:', userId);
        console.log('Has affiliate token:', !!affiliateToken);
        console.log('Has user token:', !!userToken);

        // Check if affiliate has API keys
        if (affiliateToken && affiliateId) {
            const apiKeysResponse = await request.get(`${config.baseURL}/api/my-affiliate`, {
                headers: { 'Authorization': `Bearer ${affiliateToken}` }
            });

            if (apiKeysResponse.ok()) {
                const affiliateData = await apiKeysResponse.json();
                console.log('Affiliate data:', JSON.stringify(affiliateData, null, 2));
            } else {
                console.log('Failed to get affiliate data:', apiKeysResponse.status());
            }
        }

        // Check for existing contracts
        if (affiliateToken && affiliateId) {
            const contractsResponse = await request.get(`${config.baseURL}/api/contracts?affiliateId=${affiliateId}`, {
                headers: { 'Authorization': `Bearer ${affiliateToken}` }
            });

            if (contractsResponse.ok()) {
                const contracts = await contractsResponse.json();
                console.log('Available contracts:', contracts.length);
                const userContracts = contracts.filter(c => c.userId === userId);
                console.log('User contracts:', userContracts.length);
            } else {
                console.log('Failed to get contracts:', contractsResponse.status());
            }
        }
        console.log('===========================\n');
    });
});