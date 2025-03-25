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

// Store auth tokens for different user roles
let affiliateToken = null;  // d@d.d - Affiliate owner
let userToken = null;       // c@c.c - Regular user
let affiliateId = null;     // The affiliate ID to test with

test.describe('WOD Controller', () => {

    // Login with different users before running tests
    test.beforeAll(async ({ request }) => {
        try {
            // Login with both user types
            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');
            userToken = await loginUser(request, 'c@c.c', 'cccccc');

            if (affiliateToken) {
                console.log('Successfully logged in with affiliate owner');

                // Get the first affiliate ID
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

            if (userToken) {
                console.log('Successfully logged in with regular user');
            } else {
                console.error('Failed to login with regular user');
            }

        } catch (error) {
            console.error('Login setup error:', error);
            await sendTestFailureReport(
                'WOD Controller Test Setup Failure',
                error,
                { testUsers: ['d@d.d', 'c@c.c'] }
            );
        }
    });

    // Test saveTodayWOD endpoint
    test('POST /api/today-wod - should create a WOD for today', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

            const today = new Date();
            const wodData = {
                affiliateId: affiliateId,
                wodName: 'TEST-WOD',
                wodType: 'FOR TIME',
                description: 'This is a test WOD created via API test',
                date: today.toISOString()
            };

            const response = await request.post('http://localhost:5000/api/today-wod', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: wodData
            });

            expect(response.ok()).toBeTruthy();

            const result = await response.json();
            console.log('Create WOD result:', result);

            expect(result).toHaveProperty('message');
            expect(result.message).toMatch(/WOD (added|updated) successfully/);

        } catch (error) {
            await sendTestFailureReport(
                'Save Today WOD Test Failure',
                error,
                {
                    endpoint: '/api/today-wod',
                    affiliateId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getTodayWOD endpoint
    test('GET /api/get-today-wod - should get today\'s WOD', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!userToken || !affiliateId, 'User token or affiliate ID not available');

            const today = new Date();

            const response = await request.get(`http://localhost:5000/api/get-today-wod?affiliateId=${affiliateId}&date=${today.toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            // The endpoint might return 404 if no WOD exists for today
            if (response.ok()) {
                const wod = await response.json();
                console.log('Today\'s WOD:', wod);

                expect(wod).toHaveProperty('affiliateId', affiliateId);
                expect(wod).toHaveProperty('wodName');
                expect(wod).toHaveProperty('description');
            } else if (response.status() === 404) {
                console.log('No WOD found for today (404)');
                // This is an acceptable response
            } else {
                // Any other error status is unexpected
                expect(response.status()).toBe(404);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Today WOD Test Failure',
                error,
                {
                    endpoint: '/api/get-today-wod',
                    affiliateId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getWeekWODs endpoint
    test('GET /api/get-week-wods - should get WODs for the week', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!userToken || !affiliateId, 'User token or affiliate ID not available');

            const today = new Date();

            const response = await request.get(`http://localhost:5000/api/get-week-wods?affiliateId=${affiliateId}&startDate=${today.toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const wods = await response.json();
            console.log(`Retrieved ${wods.length} WODs for the week`);

            expect(Array.isArray(wods)).toBeTruthy();

            // If WODs exist, check their structure
            if (wods.length > 0) {
                expect(wods[0]).toHaveProperty('affiliateId', affiliateId);
                expect(wods[0]).toHaveProperty('wodName');
                expect(wods[0]).toHaveProperty('date');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Week WODs Test Failure',
                error,
                {
                    endpoint: '/api/get-week-wods',
                    affiliateId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test applyWODToTrainings endpoint
    test('POST /api/apply-wod - should apply WOD to today\'s trainings', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

            const today = new Date();
            const applyData = {
                date: today.toISOString(),
                affiliateId: affiliateId
            };

            const response = await request.post('http://localhost:5000/api/apply-wod', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: applyData
            });

            // This might return 404 if no WOD exists for today
            if (response.ok()) {
                const result = await response.json();
                console.log('Apply WOD result:', result);

                expect(result).toHaveProperty('message');
                expect(result.message).toContain('WOD applied');
            } else if (response.status() === 404) {
                console.log('No WOD found to apply (404)');
                // This is an acceptable response
                try {
                    const errorBody = await response.json();
                    expect(errorBody).toHaveProperty('error');
                    expect(errorBody.error).toContain('No WOD found');
                } catch (e) {
                    // If we can't parse the response as JSON, that's okay too
                    console.log('Could not parse error response as JSON');
                }
            } else {
                // Any other error status is unexpected
                expect(response.status()).toBe(404);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Apply WOD to Trainings Test Failure',
                error,
                {
                    endpoint: '/api/apply-wod',
                    affiliateId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test searchDefaultWODs endpoint (from defaultWOD.js)
    test('GET /api/search-default-wods - should search for default WODs', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!affiliateToken, 'Auth token not available');

            // Search for a common benchmark WOD
            const searchQuery = 'FRAN';

            const response = await request.get(`http://localhost:5000/api/search-default-wods?q=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const wods = await response.json();
            console.log(`Found ${wods.length} default WODs matching "${searchQuery}"`);

            expect(Array.isArray(wods)).toBeTruthy();

            // If results exist, check their structure
            if (wods.length > 0) {
                expect(wods[0]).toHaveProperty('name');
                expect(wods[0].name).toContain(searchQuery);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Search Default WODs Test Failure',
                error,
                {
                    endpoint: '/api/search-default-wods',
                    query: 'FRAN',
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test empty search query validation
    test('GET /api/search-default-wods - should reject empty search query', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!affiliateToken, 'Auth token not available');

            const response = await request.get('http://localhost:5000/api/search-default-wods?q=', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            // Should return 400 Bad Request
            expect(response.status()).toBe(400);

            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('required');

        } catch (error) {
            await sendTestFailureReport(
                'Empty WOD Search Query Test Failure',
                error,
                {
                    endpoint: '/api/search-default-wods',
                    testCase: 'empty query',
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });
});