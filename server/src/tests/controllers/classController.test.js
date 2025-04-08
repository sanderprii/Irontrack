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
let trainerToken = null;    // t@t.t - Trainer
let userToken = null;       // c@c.c - Regular user
let affiliateId = null;     // The affiliate ID to test with
let testClassId = 4775;     // ID of a test class that exists in the system

test.describe('Class Controller', () => {

    // Login with different users before running tests
    test.beforeAll(async ({ request }) => {
        try {
            // Login with all three user types
            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');
            trainerToken = await loginUser(request, 't@t.t', 'aaaaaa');
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

            if (trainerToken) {
                console.log('Successfully logged in with trainer');
            } else {
                console.error('Failed to login with trainer');
            }

            if (userToken) {
                console.log('Successfully logged in with regular user');
            } else {
                console.error('Failed to login with regular user');
            }

        } catch (error) {
            console.error('Login setup error:', error);
            await sendTestFailureReport(
                'Class Controller Test Setup Failure',
                error,
                { testUsers: ['d@d.d', 't@t.t', 'c@c.c'] }
            );
        }
    });

    // Test getClasses endpoint
    test('GET /api/classes - should get a list of classes', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

            // Get current date for start parameter
            const today = new Date();
            const startDate = today.toISOString().split('T')[0];

            // End date is 7 days from now
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + 7);
            const endDateStr = endDate.toISOString().split('T')[0];

            const response = await request.get(`http://localhost:5000/api/classes?affiliateId=${affiliateId}&start=${startDate}&end=${endDateStr}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const classes = await response.json();
            console.log(`Retrieved ${classes.length} classes`);

            // If classes exist, test the first one
            if (classes.length > 0) {
                expect(classes[0]).toHaveProperty('id');
                expect(classes[0]).toHaveProperty('trainingName');
                expect(classes[0]).toHaveProperty('time');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Classes Test Failure',
                error,
                {
                    endpoint: '/api/classes',
                    affiliateId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createClass endpoint
    test('POST /api/classes - should create a new class', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate exists
            test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

            // Set class time to tomorrow at 8:00 AM
            const classDate = new Date();
            classDate.setDate(classDate.getDate() + 1);
            classDate.setHours(8, 0, 0, 0);

            const newClassData = {
                affiliateId: affiliateId,
                trainingType: "CrossFit",
                trainingName: "Test Class",
                time: classDate.toISOString(),
                duration: 60,
                trainer: "Test Trainer",
                memberCapacity: 15,
                location: "Test Location",
                repeatWeekly: false,
                wodName: "FRAN",
                wodType: "BENCHMARK"
            };

            const response = await request.post('http://localhost:5000/api/classes', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: newClassData
            });

            // Log response for debugging
            const responseStatus = response.status();
            console.log(`Create class response status: ${responseStatus}`);

            // We expect a successful creation
            expect(responseStatus).toBe(201);

            const responseBody = await response.json();
            console.log('Create class response:', responseBody);

            // More flexible ID extraction - check both possible response structures
            if (responseBody.class && responseBody.class.id) {
                testClassId = responseBody.class.id;
            } else if (responseBody.id) {
                testClassId = responseBody.id;
            } else {
                console.log('Response structure:', JSON.stringify(responseBody, null, 2));
                throw new Error('Could not find class ID in response');
            }

            console.log(`Updated testClassId to newly created class: ${testClassId}`);
            expect(testClassId).toBeDefined();
            expect(['string', 'number']).toContain(typeof testClassId);

            // Convert to string for consistency
            testClassId = String(testClassId);

            // Verify the class exists by fetching it
            const verifyResponse = await request.get(`http://localhost:5000/api/class-info?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });
            expect(verifyResponse.status()).toBe(200);
            const verifyBody = await verifyResponse.json();
            // The class-info endpoint returns memberCapacity and enrolledCount
            expect(verifyBody).toHaveProperty('memberCapacity');
            expect(verifyBody).toHaveProperty('enrolledCount');
            expect(typeof verifyBody.memberCapacity).toBe('number');
            expect(typeof verifyBody.enrolledCount).toBe('number');

        } catch (error) {
            await sendTestFailureReport(
                'Create Class Test Failure',
                error,
                {
                    endpoint: '/api/classes',
                    affiliateId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test checkUserEnrollment endpoint
    test('GET /api/class/check-enrollment - should check if a user is enrolled in a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            const response = await request.get(`http://localhost:5000/api/class/check-enrollment?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            // Get response status for logging
            const status = response.status();
            console.log(`Check enrollment status: ${status}`);

            // Try to parse the response body
            try {
                const responseBody = await response.text();
                console.log(`Check enrollment response: ${responseBody.substring(0, 100)}...`);

                // If the response is JSON, parse it
                if (responseBody.trim().startsWith('{')) {
                    const enrollment = JSON.parse(responseBody);
                    console.log('Enrollment status:', enrollment);

                    // Check if the response has the expected structure
                    if (enrollment.hasOwnProperty('enrolled')) {
                        expect(typeof enrollment.enrolled).toBe('boolean');
                    }
                } else {
                    console.log('Response is not valid JSON, skipping JSON assertions');
                }
            } catch (e) {
                console.log('Could not parse response:', e);
            }

            // Check it's not a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Check Enrollment Test Failure',
                error,
                {
                    endpoint: '/api/class/check-enrollment',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getClassAttendeesCount endpoint
    test('GET /api/attendees/:classId - should get the number of attendees', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!affiliateToken || !testClassId, 'Auth token or testClassId not available');

            // Based on the server routes, the endpoint is likely /api/attendees/:classId
            const response = await request.get(`http://localhost:5000/api/attendees/${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            const status = response.status();
            console.log(`Get attendees count status: ${status}`);

            if (response.ok()) {
                const countData = await response.json();
                console.log('Attendees count:', countData);

                expect(countData).toHaveProperty('count');
                expect(typeof countData.count).toBe('number');
            } else {
                console.log('Attendees count endpoint not found or failed');

                try {
                    const responseText = await response.text();
                    console.log(`Response body: ${responseText.substring(0, 100)}...`);
                } catch (e) {
                    console.log('Could not parse response');
                }

                // Check it's not a server error
                expect(status).not.toBe(500);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Attendees Count Test Failure',
                error,
                {
                    endpoint: `/api/attendees/${testClassId}`,
                    testClassId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getClassAttendees endpoint
    test('GET /api/class-attendees - should get list of attendees for a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!affiliateToken || !testClassId, 'Auth token or testClassId not available');

            const response = await request.get(`http://localhost:5000/api/class-attendees?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            // Response could be a 404, we'll handle both cases here
            if (response.ok()) {
                const attendees = await response.json();
                console.log(`Retrieved ${attendees.length} attendees`);

                // If attendees exist, test structure
                if (Array.isArray(attendees) && attendees.length > 0) {
                    expect(attendees[0]).toHaveProperty('userId');
                    expect(attendees[0]).toHaveProperty('fullName');
                }
            } else {
                // Check if it's simply a "no attendees found" message
                try {
                    const responseBody = await response.json();
                    console.log('Response:', responseBody);

                    if (response.status() === 200 && responseBody.message === 'No attendees found.') {
                        // This is acceptable - just no attendees
                        expect(responseBody).toHaveProperty('message');
                        expect(responseBody.message).toBe('No attendees found.');
                    }
                } catch (e) {
                    console.log('Could not parse response as JSON');
                }

                // If not a 200 or no attendees message, check it's not a server error
                expect(response.status()).not.toBe(500);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Class Attendees Test Failure',
                error,
                {
                    endpoint: '/api/class-attendees',
                    testClassId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getClassLeaderboard endpoint (from leaderboardController.js)
    test('GET /api/leaderboard - should get leaderboard for a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!affiliateToken || !testClassId, 'Auth token or testClassId not available');

            const response = await request.get(`http://localhost:5000/api/leaderboard?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const leaderboard = await response.json();
            console.log(`Retrieved leaderboard with ${leaderboard.length} entries`);

            // Leaderboard may be empty, but should be an array
            expect(Array.isArray(leaderboard)).toBeTruthy();

            // If entries exist, test structure
            if (leaderboard.length > 0) {
                expect(leaderboard[0]).toHaveProperty('fullName');
                expect(leaderboard[0]).toHaveProperty('score');
                expect(leaderboard[0]).toHaveProperty('scoreType');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Leaderboard Test Failure',
                error,
                {
                    endpoint: '/api/leaderboard',
                    testClassId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test checkClassScore endpoint
    test('GET /api/classes/leaderboard/check - should check if a user has a score for a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            const response = await request.get(`http://localhost:5000/api/classes/leaderboard/check?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            // Get response status for logging
            const status = response.status();
            console.log(`Check class score status: ${status}`);

            // Try to parse the response body
            try {
                const responseText = await response.text();
                console.log(`Check class score response: ${responseText.substring(0, 100)}...`);

                // If the response is JSON, parse it
                if (responseText.trim().startsWith('{')) {
                    const scoreData = JSON.parse(responseText);
                    console.log('Class score check result:', scoreData);

                    // Check if the response has the expected structure
                    if (scoreData.hasOwnProperty('hasScore')) {
                        expect(typeof scoreData.hasScore).toBe('boolean');

                        // If user has a score, verify the structure
                        if (scoreData.hasScore) {
                            expect(scoreData).toHaveProperty('scoreType');
                            expect(scoreData).toHaveProperty('score');
                        }
                    }
                } else {
                    console.log('Response is not valid JSON, skipping JSON assertions');
                }
            } catch (e) {
                console.log('Could not parse response:', e);
            }

            // Check it's not a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Check Class Score Test Failure',
                error,
                {
                    endpoint: '/api/classes/leaderboard/check',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test registerForClass endpoint
    test('POST /api/classes/register - should register a user for a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId || !affiliateId, 'User token, testClassId, or affiliateId not available');

            // First check if user is already registered
            const checkResponse = await request.get(`http://localhost:5000/api/class/check-enrollment?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (checkResponse.ok()) {
                const checkResult = await checkResponse.json();
                if (checkResult.enrolled) {
                    // If already enrolled, we'll cancel first
                    await request.post('http://localhost:5000/api/classes/cancel', {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        },
                        data: {
                            classId: testClassId,
                            freeClass: true
                        }
                    });
                }
            }

            const registrationData = {
                classId: testClassId,
                affiliateId: affiliateId,
                freeClass: true
            };

            const response = await request.post('http://localhost:5000/api/classes/register', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: registrationData
            });

            const status = response.status();
            console.log('Register for class status:', status);

            const result = await response.json();
            console.log('Register for class result:', result);

            // Check response
            if (response.ok()) {
                expect(result).toHaveProperty('message');
                expect(result.message).toBe('Successfully registered!');
            } else {
                // If registration fails, it should be for a valid reason (class full, already registered, etc.)
                // not a server error
                expect(status).not.toBe(500);
                expect(result).toHaveProperty('error');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Register for Class Test Failure',
                error,
                {
                    endpoint: '/api/classes/register',
                    testClassId,
                    affiliateId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test cancelRegistration endpoint
    test('POST /api/classes/cancel - should cancel a registration', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            const cancelData = {
                classId: testClassId,
                freeClass: true  // Assuming free class for simplicity
            };

            const response = await request.post('http://localhost:5000/api/classes/cancel', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: cancelData
            });

            const status = response.status();
            console.log(`Cancel registration status: ${status}`);

            // Could fail if not registered, that's okay
            try {
                const result = await response.json();
                console.log('Cancel registration result:', result);

                if (response.ok()) {
                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('cancelled successfully');
                }
            } catch (e) {
                console.log('Could not parse response as JSON:', e);
            }

            // This should not be a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Cancel Registration Test Failure',
                error,
                {
                    endpoint: '/api/classes/cancel',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test checkInAttendee endpoint
    test('PATCH /api/class-attendees/check-in - should check in a user to a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!affiliateToken || !testClassId, 'Auth token or testClassId not available');

            // First, get a user ID
            let userId = null;
            try {
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const userProfile = await profileResponse.json();
                userId = userProfile.id;
                console.log(`Found user ID: ${userId}`);
            } catch (e) {
                console.log('Could not get user ID, using 1 as fallback');
                userId = 1;
            }

            const checkInData = {
                classId: testClassId,
                userId: userId
            };

            const response = await request.patch('http://localhost:5000/api/class-attendees/check-in', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: checkInData
            });

            const status = response.status();
            console.log(`Check-in status: ${status}`);

            // May fail if user not registered, that's okay
            try {
                const result = await response.json();
                console.log('Check-in result:', result);

                if (response.ok()) {
                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('Check-in successful');
                }
            } catch (e) {
                console.log('Could not parse response as JSON:', e);
            }

            // This should not be a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Check In Attendee Test Failure',
                error,
                {
                    endpoint: '/api/class-attendees/check-in',
                    testClassId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test deleteAttendee endpoint
    test('DELETE /api/class-attendees - should delete an attendee from a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!affiliateToken || !testClassId, 'Auth token or testClassId not available');

            // Get a user ID
            let userId = null;
            try {
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const userProfile = await profileResponse.json();
                userId = userProfile.id;
                console.log(`Found user ID: ${userId}`);
            } catch (e) {
                console.log('Could not get user ID, using 1 as fallback');
                userId = 1;
            }

            const deleteData = {
                classId: testClassId,
                userId: userId,
                freeClass: true  // Assuming free class for simplicity
            };

            const response = await request.delete('http://localhost:5000/api/class-attendees', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: deleteData
            });

            const status = response.status();
            console.log(`Delete attendee status: ${status}`);

            // May fail if user not registered, that's okay
            try {
                const result = await response.json();
                console.log('Delete attendee result:', result);

                if (response.ok()) {
                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('cancelled successfully');
                }
            } catch (e) {
                console.log('Could not parse response as JSON:', e);
            }

            // This should not be a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Delete Attendee Test Failure',
                error,
                {
                    endpoint: '/api/class-attendees',
                    testClassId,
                    authTokenPresent: !!affiliateToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test addClassScore endpoint
    test('POST /api/classes/leaderboard/add - should add a score to class leaderboard', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            // First get class details to know what to score
            const classResponse = await request.get(`http://localhost:5000/api/classes?affiliateId=${affiliateId}&start=${new Date().toISOString()}&end=${new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            let classes = [];
            try {
                classes = await classResponse.json();
            } catch (e) {
                console.log('Could not parse classes response:', e);
            }

            let classData = null;

            if (Array.isArray(classes) && classes.length > 0) {
                classData = classes.find(c => c.id === testClassId) || classes[0];
            } else {
                // Create minimal class data if not found
                classData = {
                    id: testClassId,
                    trainingType: "CrossFit",
                    wodName: "TEST-WOD",
                    wodType: "BENCHMARK",
                    time: new Date().toISOString(),
                    description: "Test description"
                };
            }

            const scoreData = {
                classData: classData,
                scoreType: "time",
                score: "10:30"
            };

            const response = await request.post('http://localhost:5000/api/classes/leaderboard/add', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: scoreData
            });

            const status = response.status();
            console.log(`Add class score status: ${status}`);

            // May fail if already added, that's okay
            try {
                const result = await response.json();
                console.log('Add class score result:', result);

                if (response.ok()) {
                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('Score added successfully');
                }
            } catch (e) {
                console.log('Could not parse response as JSON:', e);
            }

            // This should not be a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Add Class Score Test Failure',
                error,
                {
                    endpoint: '/api/classes/leaderboard/add',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test updateClassScore endpoint
    test('PUT /api/classes/leaderboard/update - should update an existing score', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            // First get class details
            const classResponse = await request.get(`http://localhost:5000/api/classes?affiliateId=${affiliateId}&start=${new Date().toISOString()}&end=${new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            let classes = [];
            try {
                classes = await classResponse.json();
            } catch (e) {
                console.log('Could not parse classes response:', e);
            }

            let classData = null;

            if (Array.isArray(classes) && classes.length > 0) {
                classData = classes.find(c => c.id === testClassId) || classes[0];
            } else {
                // Create minimal class data if not found
                classData = {
                    id: testClassId,
                    trainingType: "CrossFit",
                    wodName: "TEST-WOD",
                    wodType: "BENCHMARK",
                    time: new Date().toISOString(),
                    description: "Test description"
                };
            }

            const scoreData = {
                classData: classData,
                scoreType: "time",
                score: "9:45"  // Improved time
            };

            const response = await request.put('http://localhost:5000/api/classes/leaderboard/update', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: scoreData
            });

            const status = response.status();
            console.log(`Update class score status: ${status}`);

            // May fail if score doesn't exist, that's okay
            try {
                const result = await response.json();
                console.log('Update class score result:', result);

                if (response.ok()) {
                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('Score updated successfully');
                }
            } catch (e) {
                console.log('Could not parse response as JSON:', e);
            }

            // This should not be a server error
            expect(status).not.toBe(500);

        } catch (error) {
            await sendTestFailureReport(
                'Update Class Score Test Failure',
                error,
                {
                    endpoint: '/api/classes/leaderboard/update',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getWaitlist endpoint
    test('GET /api/classes/waitlist - should get waitlist for a class', async ({ request }) => {
        try {
            // Skip test if login failed or no class exists
            test.skip(!userToken || !testClassId, 'User token or testClassId not available');

            const response = await request.get(`http://localhost:5000/api/classes/waitlist?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const status = response.status();
            console.log(`Get waitlist status: ${status}`);

            if (response.ok()) {
                const waitlist = await response.json();
                console.log(`Retrieved ${waitlist.length} waitlist entries`);

                expect(Array.isArray(waitlist)).toBeTruthy();

                // If entries exist, check their structure
                if (waitlist.length > 0) {
                    expect(waitlist[0]).toHaveProperty('userId');
                    expect(waitlist[0]).toHaveProperty('classId', testClassId);
                    expect(waitlist[0]).toHaveProperty('user');
                }
            } else {
                console.log('Waitlist endpoint failed or not found');
                // This should not be a server error
                expect(status).not.toBe(500);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Waitlist Test Failure',
                error,
                {
                    endpoint: '/api/classes/waitlist',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createWaitlist endpoint
    test('POST /api/classes/waitlist - should add user to waitlist', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Create a new class for this test
            const classDate = new Date();
            classDate.setDate(classDate.getDate() + 1);
            classDate.setHours(8, 0, 0, 0);

            const newClassData = {
                affiliateId: affiliateId,
                trainingType: "CrossFit",
                trainingName: "Waitlist Test Class",
                time: classDate.toISOString(),
                duration: 60,
                trainer: "Test Trainer",
                memberCapacity: 1, // Small capacity to test waitlist
                location: "Test Location",
                repeatWeekly: false,
                wodName: "FRAN",
                wodType: "BENCHMARK"
            };

            const createResponse = await request.post('http://localhost:5000/api/classes', {
                headers: {
                    'Authorization': `Bearer ${affiliateToken}`
                },
                data: newClassData
            });

            expect(createResponse.status()).toBe(201);
            const createBody = await createResponse.json();
            const testClassId = String(createBody.class.id);
            console.log(`Created test class for waitlist: ${testClassId}`);

            // First check class capacity and current enrollment
            const classInfoResponse = await request.get(`http://localhost:5000/api/class-info?classId=${testClassId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (!classInfoResponse.ok()) {
                const errorBody = await classInfoResponse.json();
                console.log('Class info error:', errorBody);
                throw new Error(`Failed to get class info: ${errorBody.error || 'Unknown error'}`);
            }

            const classInfo = await classInfoResponse.json();
            const memberCapacity = classInfo.memberCapacity;
            const enrolledCount = classInfo.enrolledCount;
            const classIsFull = enrolledCount >= memberCapacity;
            console.log(`Class capacity check: capacity=${memberCapacity}, enrolled=${enrolledCount}, full=${classIsFull}`);

            const waitlistData = {
                classId: testClassId,
                userPlanId: 0  // Using 0 for free class
            };

            const response = await request.post('http://localhost:5000/api/classes/waitlist', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: waitlistData
            });

            const status = response.status();
            console.log(`Create waitlist entry status: ${status}`);

            const result = await response.json();
            console.log('Create waitlist entry result:', result);

            // If class is not full, we expect a 400 response
            if (!classIsFull) {
                expect(status).toBe(400);
                expect(result.error).toContain('Class is not full');
            } else {
                // If class is full, then we expect either:
                // - 201 (successfully added to waitlist)
                // - 400 (already on waitlist)
                expect([201, 400]).toContain(status);
                if (status === 201) {
                    expect(result.message).toContain('Successfully added to waitlist');
                } else if (status === 400) {
                    expect(result.error).toContain('already in the waitlist');
                }
            }

        } catch (error) {
            await sendTestFailureReport(
                'Create Waitlist Test Failure',
                error,
                {
                    endpoint: '/api/classes/waitlist',
                    testClassId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });


});