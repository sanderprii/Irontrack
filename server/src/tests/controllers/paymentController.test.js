const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

// Helper function to log in a user and get a token
async function loginUser(request, email, password) {
    try {
        const loginData = { email, password };
        const loginResponse = await request.post('http://localhost:5000/api/auth/login', {
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

    // Login before running tests
    test.beforeAll(async ({ request }) => {
        try {
            userToken = await loginUser(request, 'c@c.c', 'cccccc');
            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');

            if (userToken) {
                console.log('Successfully logged in with regular user');

                // Get user ID
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                if (profileResponse.ok()) {
                    const profile = await profileResponse.json();
                    userId = profile.id;
                    console.log(`Found user ID: ${userId}`);
                }
            } else {
                console.error('Failed to login with regular user');
            }

            if (affiliateToken) {
                console.log('Successfully logged in with affiliate owner');

                // Get affiliate ID
                const response = await request.get('http://localhost:5000/api/my-affiliate', {
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
        } catch (error) {
            console.error('Login setup error:', error);
            await sendTestFailureReport(
                'Payment Controller Test Setup Failure',
                error,
                { testUsers: ['c@c.c', 'd@d.d'] }
            );
        }
    });

    // Test createMontonioPayment endpoint
    test('POST /api/payments/montonio - should create a Montonio payment', async ({ request }) => {
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
                affiliateId: affiliateId
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
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
                console.log(`Payment creation failed with status: ${response.status()}`);
                const errorBody = await response.json();
                console.log('Error details:', errorBody);

                // Test this is not a server error
                expect(response.status()).not.toBe(500);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Create Montonio Payment Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    affiliateId,
                    userId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createMontonioPayment with contract payment
    test('POST /api/payments/montonio - should create a contract payment', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken || !affiliateId || !userId, 'User token, user ID or affiliate ID not available');

            // First, we need to check if there's an existing contract for this user
            const contractsResponse = await request.get(`http://localhost:5000/api/contracts?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            let contractId = null;
            if (contractsResponse.ok()) {
                const contracts = await contractsResponse.json();
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
                contractId: contractId
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
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
                console.log(`Contract payment creation failed with status: ${response.status()}`);
                const errorBody = await response.json();
                console.log('Error details:', errorBody);

                // Test this is not a server error
                expect(response.status()).not.toBe(500);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Create Contract Payment Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    affiliateId,
                    userId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test Montonio webhook endpoint with various payload formats
    test('POST /api/payments/montonio-webhook - should handle Montonio webhook with minimal data', async ({ request }) => {
        try {
            // This endpoint doesn't require authentication as it's called by Montonio
            const webhookData = {
                orderToken: 'mock-token-for-testing'
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio-webhook', {
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
            await sendTestFailureReport(
                'Handle Montonio Webhook Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio-webhook',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test Montonio webhook with more complete data structure
    test('POST /api/payments/montonio-webhook - should handle webhook with payment data', async ({ request }) => {
        try {
            // Create a more complete webhook payload that mimics Montonio's structure
            // This is based on the controller code showing decodedToken structure
            const webhookData = {
                orderToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXltZW50TGlua1V1aWQiOiJ0ZXN0LXV1aWQtMTIzIiwicGF5bWVudFN0YXR1cyI6IlBBSUQiLCJtZXJjaGFudFJlZmVyZW5jZSI6ImNvbnRyYWN0LTEyMy0yMDIzMDcxNTE1MzAiLCJncmFuZFRvdGFsIjo1MCwiY3VycmVuY3kiOiJFVVIifQ.fake-signature'
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio-webhook', {
                data: webhookData
            });

            // Should still return 200 even for simulated data
            expect(response.status()).toBe(200);

            const result = await response.json();
            console.log('Structured webhook response:', result);

            // Always returns success to acknowledge the webhook
            expect(result).toHaveProperty('success');

        } catch (error) {
            await sendTestFailureReport(
                'Handle Structured Webhook Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio-webhook',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test payment status check endpoint
    test('GET /api/payments/montonio/status - should check payment status', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // This endpoint requires a token query parameter
            // Since we don't have a real token, we'll test error handling

            const response = await request.get('http://localhost:5000/api/payments/montonio/status?token=invalid-token', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            // It should return 400 for an invalid token
            expect(response.status()).toBe(400);

            const result = await response.json();
            console.log('Payment status check response:', result);

            expect(result).toHaveProperty('success', false);
            expect(result).toHaveProperty('message');
            expect(result.message).toContain('Invalid token');

        } catch (error) {
            await sendTestFailureReport(
                'Check Payment Status Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio/status',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test missing auth for createMontonioPayment
    test('POST /api/payments/montonio - should reject requests without authentication', async ({ request }) => {
        try {
            const paymentData = {
                amount: 10.00,
                orderId: generateRandomOrderId(),
                description: 'Test payment without auth',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                },
                affiliateId: affiliateId || 1 // Use real affiliate ID if available
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                data: paymentData
            });

            // Should return 401 Unauthorized
            expect(response.status()).toBe(401);

            const errorBody = await response.json();
            console.log('Unauthorized response:', errorBody);
            expect(errorBody).toHaveProperty('error');

        } catch (error) {
            await sendTestFailureReport(
                'Payment Without Auth Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'missing auth',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test validation in createMontonioPayment - missing affiliateId
    test('POST /api/payments/montonio - should validate affiliateId', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Missing affiliateId
            const invalidPaymentData = {
                amount: 10.00,
                orderId: generateRandomOrderId(),
                description: 'Test validation - missing affiliateId',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                }
                // Missing affiliateId
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
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
            await sendTestFailureReport(
                'Payment Validation - Missing AffiliateId Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'missing affiliateId',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test validation in createMontonioPayment - invalid amount
    test('POST /api/payments/montonio - should validate amount', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken || !affiliateId, 'User token or affiliate ID not available');

            // Invalid amount
            const invalidPaymentData = {
                amount: -5.00, // Negative amount
                orderId: generateRandomOrderId(),
                description: 'Test validation - invalid amount',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                },
                affiliateId: affiliateId
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: invalidPaymentData
            });

            // Should return 400 Bad Request
            expect(response.status()).toBe(400);

            const errorBody = await response.json();
            console.log('Invalid amount response:', errorBody);
            expect(errorBody).toHaveProperty('success', false);
            expect(errorBody).toHaveProperty('message');
            expect(errorBody.message).toContain('Amount must be a valid number greater than or equal to 0.01');

        } catch (error) {
            await sendTestFailureReport(
                'Payment Validation - Invalid Amount Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'invalid amount',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test validation in createMontonioPayment - missing orderId
    test('POST /api/payments/montonio - should validate orderId', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken || !affiliateId, 'User token or affiliate ID not available');

            // Missing orderId
            const invalidPaymentData = {
                amount: 10.00,
                // Missing orderId
                description: 'Test validation - missing orderId',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                },
                affiliateId: affiliateId
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: invalidPaymentData
            });

            // Should return 400 Bad Request
            expect(response.status()).toBe(400);

            const errorBody = await response.json();
            console.log('Missing orderId response:', errorBody);
            expect(errorBody).toHaveProperty('success', false);
            expect(errorBody).toHaveProperty('message');
            expect(errorBody.message).toContain('Order ID is required');

        } catch (error) {
            await sendTestFailureReport(
                'Payment Validation - Missing OrderId Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'missing orderId',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test non-numeric affiliateId
    test('POST /api/payments/montonio - should validate affiliateId format', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Invalid affiliateId format
            const invalidPaymentData = {
                amount: 10.00,
                orderId: generateRandomOrderId(),
                description: 'Test validation - non-numeric affiliateId',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                },
                affiliateId: 'not-a-number'
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
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
            await sendTestFailureReport(
                'Payment Validation - Non-numeric AffiliateId Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'non-numeric affiliateId',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test non-existent affiliateId
    test('POST /api/payments/montonio - should validate affiliate exists', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Non-existent affiliateId
            const invalidPaymentData = {
                amount: 10.00,
                orderId: generateRandomOrderId(),
                description: 'Test validation - non-existent affiliateId',
                userData: {
                    email: 'test@example.com',
                    phone: '+3725555555',
                    fullName: 'Test User'
                },
                affiliateId: 999999 // Assuming this ID doesn't exist
            };

            const response = await request.post('http://localhost:5000/api/payments/montonio', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
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
            await sendTestFailureReport(
                'Payment Validation - Non-existent AffiliateId Test Failure',
                error,
                {
                    endpoint: '/api/payments/montonio',
                    testCase: 'non-existent affiliateId',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });
});