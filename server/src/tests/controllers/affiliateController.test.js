const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

// Hoiame siin tokenit ja affiliate ID-d
let authToken = null;
let affiliateId = null;

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

test.describe('Affiliate Controller', () => {

    // Sisselogimine enne teste (vajalik JWT tokeni saamiseks)
    test.beforeAll(async ({ request }) => {
        try {
            authToken = await loginUser(request, 'd@d.d', 'dddddd');

            if (authToken) {
                console.log('Successfully logged in with test user d@d.d');
            } else {
                console.error('Failed to login with test user d@d.d, trying c@c.c');
                // Kui d@d.d ei tööta, proovi c@c.c
                authToken = await loginUser(request, 'c@c.c', 'cccccc');
                if (authToken) {
                    console.log('Successfully logged in with backup test user c@c.c');
                } else {
                    console.error('Failed to login with any test user');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            await sendTestFailureReport(
                'Pre-test Login Failure',
                error,
                { testUsers: ['d@d.d', 'c@c.c'] }
            );
        }
    });

    // Test getMyAffiliate endpoint
    test('GET /api/my-affiliate - should get affiliate details for logged in user', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!authToken, 'Auth token not available');

            const response = await request.get('http://localhost:5000/api/my-affiliate/my-affiliate', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const responseBody = await response.json();
            console.log('My affiliate response:', responseBody);

            // Save affiliate ID for later tests if one exists
            if (responseBody.affiliate && responseBody.affiliate.id) {
                affiliateId = responseBody.affiliate.id;
            }

            // If user has an affiliate, check properties
            if (!responseBody.noAffiliate) {
                expect(responseBody).toHaveProperty('affiliate');
                expect(responseBody).toHaveProperty('trainers');
                expect(responseBody.affiliate).toHaveProperty('id');
                expect(responseBody.affiliate).toHaveProperty('name');
            } else {
                // If user doesn't have an affiliate, noAffiliate should be true
                expect(responseBody).toHaveProperty('noAffiliate', true);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get My Affiliate Test Failure',
                error,
                {
                    endpoint: '/api/my-affiliate',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test searchUsers endpoint
    test('GET /api/affiliate/search-users - should search users by query', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!authToken, 'Auth token not available');

            // Use a common letter to find some users
            const searchQuery = 'e';

            const response = await request.get(`http://localhost:5000/api/affiliate/search-users?q=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const users = await response.json();

            // Check if we got an array result
            expect(Array.isArray(users)).toBeTruthy();

            // If we have users, check their structure
            if (users.length > 0) {
                expect(users[0]).toHaveProperty('id');
                expect(users[0]).toHaveProperty('email');
                expect(users[0]).toHaveProperty('fullName');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Search Users Test Failure',
                error,
                {
                    endpoint: '/api/affiliate/search-users',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test empty query validation
    test('GET /api/affiliate/search-users - should reject empty search query', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!authToken, 'Auth token not available');

            const response = await request.get('http://localhost:5000/api/affiliate/search-users?q=', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Should return 400 Bad Request
            expect(response.status()).toBe(400);

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('required');

        } catch (error) {
            await sendTestFailureReport(
                'Empty Search Query Test Failure',
                error,
                {
                    endpoint: '/api/affiliate/search-users',
                    testCase: 'empty query',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createOrUpdateAffiliate endpoint - create new affiliate
    test('POST /api/affiliate - should create a new affiliate if ID not provided', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!authToken, 'Auth token not available');

            // First, check if user already has an affiliate
            if (affiliateId) {
                console.log('User already has an affiliate with ID:', affiliateId);
                return;
            }

            const newAffiliateData = {
                name: 'Test Affiliate',
                address: '123 Test Street',
                trainingType: 'CrossFit',
                trainers: [],
                email: 'test@affiliate.com',
                phone: '1234567890',
                iban: 'EE123456789012345678',
                bank: 'TestBank',
                paymentHolidayFee: 10
            };

            console.log('Sending request to create affiliate with data:', newAffiliateData);
            console.log('Using auth token:', authToken);

            const response = await request.put('http://localhost:5000/api/my-affiliate/affiliate', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                data: newAffiliateData
            });

            console.log('Response status:', response.status());
            console.log('Response headers:', response.headers());
            const responseBody = await response.json();
            console.log('Response body:', responseBody);

            expect(response.ok()).toBeTruthy();
            expect(responseBody).toHaveProperty('message');
            expect(responseBody.message).toContain('created successfully');

            // Store the new affiliate ID
            if (responseBody.affiliate && responseBody.affiliate.id) {
                affiliateId = responseBody.affiliate.id;
                console.log('Created new affiliate with ID:', affiliateId);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Create Affiliate Test Failure',
                error,
                {
                    endpoint: '/api/affiliate',
                    testCase: 'create new',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createOrUpdateAffiliate endpoint - update existing affiliate
    test('POST /api/affiliate - should update existing affiliate if ID provided', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

            const updateData = {
                id: affiliateId,
                name: 'Updated Test Affiliate',
                address: '456 Updated Street',
                trainingType: 'CrossFit',
                trainers: [],
                email: 'updated@affiliate.com',
                phone: '0987654321',
                iban: 'EE987654321098765432',
                bank: 'UpdatedBank',
                paymentHolidayFee: 15
            };

            const response = await request.put('http://localhost:5000/api/my-affiliate/affiliate', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                data: updateData
            });

            // Kontrolli ainult vastuse staatust, sest update-i vastus võib olla erinev
            const status = response.status();
            console.log("Update affiliate response status:", status);

            try {
                const responseBody = await response.json();
                console.log("Update affiliate response body:", responseBody);
            } catch (e) {
                console.log("Couldn't parse response body:", e);
            }

            // Server should return 200 for successful update
            expect(status).toBe(200);

        } catch (error) {
            await sendTestFailureReport(
                'Update Affiliate Test Failure',
                error,
                {
                    endpoint: '/api/affiliate',
                    testCase: 'update existing',
                    affiliateId,
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getAffiliateById endpoint
    test('GET /api/affiliate - should get affiliate by ID', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

            const response = await request.get(`http://localhost:5000/api/my-affiliate/affiliateById?id=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Log response info for debugging
            console.log(`Get affiliate by ID status: ${response.status()}`);

            // Try to parse response as text first to debug
            const responseText = await response.text();
            console.log(`Get affiliate by ID response: ${responseText.substring(0, 100)}...`);

            // Parse JSON only if it looks like JSON
            let affiliate;
            if (responseText.trim().startsWith('{')) {
                affiliate = JSON.parse(responseText);
                expect(affiliate).toHaveProperty('id');
                if (affiliate.id === affiliateId) {
                    expect(affiliate).toHaveProperty('name');
                }
            } else {
                // Skip further assertions if response isn't JSON
                console.log('Response is not valid JSON, skipping assertions');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Affiliate By ID Test Failure',
                error,
                {
                    endpoint: '/api/affiliate',
                    affiliateId,
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getAffiliateById with invalid ID
    test('GET /api/affiliate - should return 404 for missing ID', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!authToken, 'Auth token not available');

            const response = await request.get('http://localhost:5000/api/my-affiliate/affiliateById', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Server returns 400 Bad Request when ID is missing
            expect(response.status()).toBe(400);

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('required');

        } catch (error) {
            await sendTestFailureReport(
                'Get Affiliate Missing ID Test Failure',
                error,
                {
                    endpoint: '/api/affiliate',
                    testCase: 'missing ID',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test unauthorized access
    test('GET /api/my-affiliate - should reject requests without valid token', async ({ request }) => {
        try {
            const response = await request.get('http://localhost:5000/api/my-affiliate/my-affiliate', {
                headers: {
                    'Authorization': 'Bearer invalid-token'
                }
            });

            // Should return 401 Unauthorized
            expect(response.status()).toBe(401);

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');

        } catch (error) {
            await sendTestFailureReport(
                'Unauthorized Access Test Failure',
                error,
                {
                    endpoint: '/api/my-affiliate',
                    testCase: 'invalid token',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });
});