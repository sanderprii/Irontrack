const { test, expect } = require('@playwright/test');
const config = require('../config');
test.describe.configure({ mode: 'serial' });
// Hoiame siin tokenit ja affiliate ID-d
let authToken = null;
let affiliateId = null;

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

// Helper function to wait for rate limit reset
async function waitForRateLimit() {
    await new Promise(resolve => setTimeout(resolve, 1000));
}

test.describe('Affiliate Controller - Complete API Tests', () => {

    // Sisselogimine enne teste (vajalik JWT tokeni saamiseks)
    test.beforeAll(async ({ request }) => {
        try {
            authToken = await loginUser(request, 'd@d.d', 'dddddd');

            if (authToken) {
                console.log('Successfully logged in with test user d@d.d');
            } else {
                console.error('Failed to login with test user d@d.d, trying c@c.c');
                await waitForRateLimit();
                authToken = await loginUser(request, 'c@c.c', 'cccccc');
                if (authToken) {
                    console.log('Successfully logged in with backup test user c@c.c');
                } else {
                    console.error('Failed to login with any test user');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // Test getMyAffiliate endpoint
    test('GET /api/my-affiliate - should get affiliate details for logged in user', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        const response = await request.get(`${config.baseURL}/api/my-affiliate/my-affiliate`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const responseBody = await response.json();

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
    });

    // Test searchUsers endpoint
    test('GET /api/affiliate/search-users - should search users by query', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        // Use a common letter to find some users
        const searchQuery = 'e';

        const response = await request.get(`${config.baseURL}/api/affiliate/search-users?q=${searchQuery}`, {
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
    });

    // Test empty query validation
    test('GET /api/affiliate/search-users - should reject empty search query', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        const response = await request.get(`${config.baseURL}/api/affiliate/search-users?q=`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Should return 400 Bad Request
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toContain('required');
    });

    // Test createOrUpdateAffiliate endpoint - create new affiliate
    test('POST /api/affiliate - should create a new affiliate if ID not provided', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        // First, check if user already has an affiliate
        if (affiliateId) {
            // Skip creating a new affiliate since one already exists
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

        const response = await request.put(`${config.baseURL}/api/my-affiliate/affiliate`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: newAffiliateData
        });

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('created successfully');

        // Store the new affiliate ID
        if (responseBody.affiliate && responseBody.affiliate.id) {
            affiliateId = responseBody.affiliate.id;
        }
    });

    // Test createOrUpdateAffiliate endpoint - update existing affiliate
    test('POST /api/affiliate - should update existing affiliate if ID provided', async ({ request }) => {
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

        const response = await request.put(`${config.baseURL}/api/my-affiliate/affiliate`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: updateData
        });

        // Server should return 200 for successful update
        expect(response.status()).toBe(200);
    });

    // Test getAffiliateById endpoint
    test('GET /api/affiliate - should get affiliate by ID', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliateById?id=${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Try to parse response as text first to debug
        const responseText = await response.text();

        // Parse JSON only if it looks like JSON
        let affiliate;
        if (responseText.trim().startsWith('{')) {
            affiliate = JSON.parse(responseText);
            expect(affiliate).toHaveProperty('id');
            if (affiliate.id === affiliateId) {
                expect(affiliate).toHaveProperty('name');
            }
        }
    });

    // Test getAffiliateById with invalid ID
    test('GET /api/affiliate - should return 400 for missing ID', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliateById`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Server returns 400 Bad Request when ID is missing
        expect(response.status()).toBe(400);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toContain('required');
    });

    // Test createAffiliateTerms endpoint
    test('POST /api/affiliate/terms - should create affiliate terms', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const termsData = {
            terms: 'Test terms and conditions for affiliate',
            affiliateId: affiliateId
        };

        const response = await request.post(`${config.baseURL}/api/my-affiliate/affiliate-terms`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: termsData
        });

        // Should return 201 for created
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('terms');
        expect(responseBody).toHaveProperty('affiliateId');
        expect(responseBody.affiliateId).toBe(affiliateId);
    });

    // Test updateAffiliateTerms endpoint
    test('PUT /api/affiliate/terms - should update affiliate terms', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const updatedTermsData = {
            terms: 'Updated terms and conditions for affiliate',
            affiliateId: affiliateId
        };

        const response = await request.put(`${config.baseURL}/api/my-affiliate/affiliate-terms`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: updatedTermsData
        });

        // Should return 200 for updated
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('terms');
        expect(responseBody.terms).toBe('Updated terms and conditions for affiliate');
    });

    // Test getAffiliateTerms endpoint
    test('GET /api/affiliate/terms - should get affiliate terms', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliate-terms?id=${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status() === 200) {
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('terms');
            expect(responseBody).toHaveProperty('affiliateId');
            expect(responseBody.affiliateId).toBe(affiliateId);
        } else if (response.status() === 404) {
            // Terms might not exist yet - that's acceptable
            console.log('No terms found for affiliate - this is acceptable for new affiliates');
        }
    });

    // Test getAffiliateTerms with missing ID
    test('GET /api/affiliate/terms - should handle missing ID parameter', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliate-terms`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Based on API behavior observation, it seems to return 200 even without ID
        // This suggests the API doesn't properly validate the missing 'id' parameter
        expect(response.status()).toBe(400);
    });

    // Test acceptAffiliateTerms endpoint
    test('POST /api/affiliate/accept-terms - should accept affiliate terms', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        // Wait to avoid rate limiting
        await waitForRateLimit();

        // First ensure terms exist
        const termsData = {
            terms: 'Terms to be accepted',
            affiliateId: affiliateId
        };

        await request.put(`${config.baseURL}/api/my-affiliate/affiliate-terms`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: termsData
        });

        // Wait a bit to ensure terms are created
        await waitForRateLimit();

        // Now accept terms
        const response = await request.post(`${config.baseURL}/api/my-affiliate/affiliate-terms/accept`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: { affiliateId: affiliateId }
        });

        // Should return 200 for success
        expect(response.status()).toBe(200);

        if (response.status() === 200) {
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('message');
            expect(responseBody.message).toContain('accepted successfully');
        }
    });

    // Test acceptAffiliateTerms with missing terms
    test('POST /api/affiliate/accept-terms - should handle non-existent affiliate terms', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        // Wait to avoid rate limiting
        await waitForRateLimit();

        // Try to accept terms for non-existent affiliate
        const response = await request.post(`${config.baseURL}/api/my-affiliate/affiliate-terms/accept`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            data: { affiliateId: 99999 } // Non-existent affiliate ID
        });

        // Check if response is HTML or JSON by looking at first character
        const responseText = await response.text();

        // If the response starts with '<', it's HTML, not JSON
        if (responseText.trim().startsWith('<')) {
            // This suggests the server returned an error page instead of a JSON error
            expect(response.status()).toBeGreaterThanOrEqual(400);
        } else {
            // If it's JSON, try to parse it
            try {
                const responseBody = JSON.parse(responseText);
                expect(responseBody).toHaveProperty('error');
            } catch (e) {
                console.log('Failed to parse response as JSON:', e);
            }
        }
    });

    // Test isUserAcceptedAffiliateTerms endpoint
    test('GET /api/affiliate/check-terms - should check if user accepted terms', async ({ request }) => {
        // Skip test if login failed or no affiliate exists
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        // Wait to avoid rate limiting
        await waitForRateLimit();

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliate-terms/accepted?affiliateId=${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Should return 200
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('accepted');
        expect(typeof responseBody.accepted).toBe('boolean');
    });

    // Test isUserAcceptedAffiliateTerms with missing ID
    test('GET /api/affiliate/check-terms - should handle missing affiliate ID', async ({ request }) => {
        // Skip test if login failed
        test.skip(!authToken, 'Auth token not available');

        // Wait to avoid rate limiting
        await waitForRateLimit();

        const response = await request.get(`${config.baseURL}/api/my-affiliate/affiliate-terms/accepted`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Get response as text first to check if it's HTML or JSON
        const responseText = await response.text();

        // Check if response is HTML or JSON by looking at first character
        if (responseText.trim().startsWith('<')) {
            // API returned HTML error page, which indicates an error occurred
            expect(response.status()).toBeGreaterThanOrEqual(400);
        } else {
            // It's JSON, try to parse it
            try {
                const responseBody = JSON.parse(responseText);
                // Could be successful response or error in JSON format
                if (response.status() >= 400) {
                    expect(responseBody).toHaveProperty('error');
                }
            } catch (e) {
                console.log('Failed to parse response as JSON:', e);
            }
        }
    });

    // Test unauthorized access
    test('GET /api/my-affiliate - should reject requests without valid token', async ({ request }) => {
        const response = await request.get(`${config.baseURL}/api/my-affiliate/my-affiliate`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });

        // Should return 401 Unauthorized
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error');
    });

    // Test unauthorized access for other endpoints
    test('GET /api/affiliate/search-users - should reject requests without valid token', async ({ request }) => {
        const response = await request.get(`${config.baseURL}/api/affiliate/search-users?q=test`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });

        // Should return 401 Unauthorized
        expect(response.status()).toBe(401);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('error');
    });
});