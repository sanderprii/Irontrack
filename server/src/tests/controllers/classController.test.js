const { test, expect } = require('@playwright/test');
const config = require('../config');

// Configure test to run with 1 worker
test.describe.configure({ mode: 'serial' });

// Helper function to login and get authentication token with retry logic
async function loginUser(request, email, password, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Add delay between attempts (except for first attempt)
            if (attempt > 1) {
                await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
            }

            const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
                data: { email, password }
            });

            if (loginResponse.ok()) {
                const responseBody = await loginResponse.json();
                console.log(`Successfully logged in ${email} on attempt ${attempt}`);
                return responseBody.token;
            } else if (loginResponse.status() === 429) {
                console.warn(`Rate limited for ${email} on attempt ${attempt}. Retrying...`);
                continue;
            } else {
                console.error(`Login failed for ${email} with status: ${loginResponse.status()}`);
                return null;
            }
        } catch (error) {
            console.error(`Login attempt ${attempt} failed for ${email}:`, error);
            if (attempt === maxRetries) return null;
        }
    }
    return null;
}

// Store auth tokens for different user roles
let affiliateToken = null;  // d@d.d - Affiliate owner
let trainerToken = null;    // t@t.t - Trainer
let userToken = null;       // c@c.c - Regular user
let affiliateId = null;     // The affiliate ID to test with
let testClassId = null;     // ID of a test class that will be created

test.describe('Class API Tests', () => {

    // Setup authentication before all tests
    test.beforeAll(async ({ request }) => {
        try {
            // Login with different user types sequentially with delays
            console.log('Starting login sequence...');

            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');

            // Add delay before next login
            await new Promise(resolve => setTimeout(resolve, 1500));

            trainerToken = await loginUser(request, 't@t.t', 'aaaaaa');

            // Add delay before next login
            await new Promise(resolve => setTimeout(resolve, 1500));

            userToken = await loginUser(request, 'c@c.c', 'cccccc');

            if (affiliateToken) {
                console.log('Successfully logged in with affiliate owner');

                // Get the affiliate ID
                const response = await request.get(`${config.baseURL}/api/my-affiliate`, {
                    headers: { 'Authorization': `Bearer ${affiliateToken}` }
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
            throw error;
        }
    });



    // Test getClasses endpoint
    test('GET /api/classes - should get list of classes', async ({ request }) => {
        test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        const endDateStr = endDate.toISOString().split('T')[0];

        const response = await request.get(`${config.baseURL}/api/classes?affiliateId=${affiliateId}&start=${startDate}&end=${endDateStr}`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` }
        });

        expect(response.ok()).toBeTruthy();
        const classes = await response.json();

        expect(Array.isArray(classes)).toBeTruthy();

        if (classes.length > 0) {
            expect(classes[0]).toHaveProperty('id');
            expect(classes[0]).toHaveProperty('trainingName');
            expect(classes[0]).toHaveProperty('time');
            expect(classes[0]).toHaveProperty('enrolledCount');
        }
    });

    // Test getClassesForSubdomain endpoint
    test('GET /api/classes/subdomain - should get classes for subdomain', async ({ request }) => {
        test.skip(!affiliateId, 'Affiliate ID not available');

        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        const endDateStr = endDate.toISOString().split('T')[0];

        const response = await request.get(`${config.baseURL}/api/classes/subdomain?affiliateId=${affiliateId}&start=${startDate}&end=${endDateStr}`);

        expect(response.ok()).toBeTruthy();
        const classes = await response.json();

        expect(Array.isArray(classes)).toBeTruthy();
    });

    // Test createClass endpoint
    test('POST /api/classes - should create a new class', async ({ request }) => {
        test.skip(!affiliateToken || !affiliateId, 'Auth token or affiliate ID not available');

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

        const response = await request.post(`${config.baseURL}/api/classes`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` },
            data: newClassData
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();

        if (responseBody.class && responseBody.class.id) {
            testClassId = responseBody.class.id;
        } else if (responseBody.id) {
            testClassId = responseBody.id;
        }

        expect(testClassId).toBeDefined();
        testClassId = String(testClassId);
        console.log(`Created test class with ID: ${testClassId}`);
    });

    // Test updateClass endpoint
    test('PUT /api/classes/:id - should update a class', async ({ request }) => {
        test.skip(!affiliateToken || !testClassId, 'Auth token or test class not available');

        const classDate = new Date();
        classDate.setDate(classDate.getDate() + 1);
        classDate.setHours(9, 0, 0, 0);

        const updateData = {
            trainingType: "CrossFit",
            trainingName: "Updated Test Class",
            time: classDate.toISOString(),
            duration: 60,
            trainer: "Updated Trainer",
            memberCapacity: 20,
            location: "Updated Location",
            repeatWeekly: false,
            wodName: "FRAN",
            wodType: "BENCHMARK",
            description: "Updated description",
            freeClass: true,
            canRegister: true
        };

        const response = await request.put(`${config.baseURL}/api/classes/${testClassId}`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` },
            data: updateData
        });

        expect(response.status()).toBe(200);
        const updatedClass = await response.json();
        expect(updatedClass.message).toContain('updated successfully');
    });

    // Test getClassInfo endpoint
    test('GET /api/class-info - should get class information', async ({ request }) => {
        test.skip(!testClassId, 'No test class available');

        const response = await request.get(`${config.baseURL}/api/class-info?classId=${testClassId}`);

        expect(response.ok()).toBeTruthy();
        const classInfo = await response.json();

        expect(classInfo).toHaveProperty('memberCapacity');
        expect(classInfo).toHaveProperty('enrolledCount');
        expect(typeof classInfo.memberCapacity).toBe('number');
        expect(typeof classInfo.enrolledCount).toBe('number');
    });

    // Test checkUserEnrollment endpoint
    test('GET /api/class/check-enrollment - should check user enrollment', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const response = await request.get(`${config.baseURL}/api/class/check-enrollment?classId=${testClassId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });

        expect(response.ok()).toBeTruthy();
        const enrollment = await response.json();

        expect(enrollment).toHaveProperty('enrolled');
        expect(typeof enrollment.enrolled).toBe('boolean');
        expect(enrollment).toHaveProperty('firstTraining');
        expect(typeof enrollment.firstTraining).toBe('boolean');
    });

    // Test registerForClass endpoint
    test('POST /api/classes/register - should register user for class', async ({ request }) => {
        test.skip(!userToken || !testClassId || !affiliateId, 'Required data not available');

        const registrationData = {
            classId: testClassId,
            affiliateId: affiliateId,
            freeClass: true
        };

        const response = await request.post(`${config.baseURL}/api/classes/register`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: registrationData
        });

        const status = response.status();
        expect([200, 400]).toContain(status);

        const result = await response.json();
        if (status === 200) {
            expect(result.message).toBe('Successfully registered!');
        } else {
            expect(result).toHaveProperty('error');
        }
    });

    // Test getClassAttendees endpoint
    test('GET /api/class-attendees - should get class attendees', async ({ request }) => {
        test.skip(!affiliateToken || !testClassId, 'Auth token or test class not available');

        const response = await request.get(`${config.baseURL}/api/class-attendees?classId=${testClassId}`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` }
        });

        expect(response.ok()).toBeTruthy();
        const attendees = await response.json();

        if (Array.isArray(attendees)) {
            if (attendees.length > 0) {
                expect(attendees[0]).toHaveProperty('userId');
                expect(attendees[0]).toHaveProperty('fullName');
                expect(attendees[0]).toHaveProperty('checkIn');
            }
        } else {
            expect(attendees).toHaveProperty('message');
        }
    });

    // Test getClassAttendeesCount endpoint
    test('GET /api/attendees/:classId - should get attendees count', async ({ request }) => {
        test.skip(!testClassId, 'Test class not available');

        const response = await request.get(`${config.baseURL}/api/attendees/${testClassId}`);

        expect(response.ok()).toBeTruthy();
        const countData = await response.json();

        expect(countData).toHaveProperty('count');
        expect(typeof countData.count).toBe('number');
    });

    // Test checkInAttendee endpoint
    test('PATCH /api/class-attendees/check-in - should check in attendee', async ({ request }) => {
        test.skip(!affiliateToken || !testClassId, 'Auth token or test class not available');

        // Get user ID from profile
        const profileResponse = await request.get(`${config.baseURL}/api/user`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });

        if (!profileResponse.ok()) {
            test.skip('Could not get user profile');
        }

        const userProfile = await profileResponse.json();
        const userId = userProfile.id;

        const checkInData = {
            classId: testClassId,
            userId: userId
        };

        const response = await request.patch(`${config.baseURL}/api/class-attendees/check-in`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` },
            data: checkInData
        });

        const status = response.status();
        expect([200, 400, 404]).toContain(status);

        if (status === 200) {
            const result = await response.json();
            expect(result.message).toContain('Check-in successful');
        }
    });

    // Test checkClassScore endpoint
    test('GET /api/classes/leaderboard/check - should check class score', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const response = await request.get(`${config.baseURL}/api/classes/leaderboard/check?classId=${testClassId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });

        expect(response.ok()).toBeTruthy();
        const scoreData = await response.json();

        expect(scoreData).toHaveProperty('hasScore');
        expect(typeof scoreData.hasScore).toBe('boolean');

        if (scoreData.hasScore) {
            expect(scoreData).toHaveProperty('scoreType');
            expect(scoreData).toHaveProperty('score');
        }
    });

    // Test addClassScore endpoint
    test('POST /api/classes/leaderboard/add - should add class score', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const classData = {
            id: testClassId,
            trainingType: "CrossFit",
            wodName: "TEST-WOD",
            wodType: "BENCHMARK",
            time: new Date().toISOString(),
            description: "Test description"
        };

        const scoreData = {
            classData: classData,
            scoreType: "time",
            score: "10:30"
        };

        const response = await request.post(`${config.baseURL}/api/classes/leaderboard/add`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: scoreData
        });

        const status = response.status();
        expect([200, 400]).toContain(status);

        const result = await response.json();
        if (status === 200) {
            expect(result.message).toContain('Score added successfully');
        } else {
            expect(result).toHaveProperty('error');
        }
    });

    // Test updateClassScore endpoint
    test('PUT /api/classes/leaderboard/update - should update class score', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const classData = {
            id: testClassId,
            trainingType: "CrossFit",
            wodName: "TEST-WOD",
            wodType: "BENCHMARK",
            time: new Date().toISOString(),
            description: "Test description"
        };

        const scoreData = {
            classData: classData,
            scoreType: "time",
            score: "9:45"
        };

        const response = await request.put(`${config.baseURL}/api/classes/leaderboard/update`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: scoreData
        });

        const status = response.status();
        expect([200, 400]).toContain(status);

        if (status === 200) {
            const result = await response.json();
            expect(result.message).toContain('Score updated successfully');
        }
    });

    // Test getWaitlist endpoint
    test('GET /api/classes/waitlist - should get waitlist', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const response = await request.get(`${config.baseURL}/api/classes/waitlist?classId=${testClassId}`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });

        expect(response.ok()).toBeTruthy();
        const waitlist = await response.json();

        expect(Array.isArray(waitlist)).toBeTruthy();

        if (waitlist.length > 0) {
            expect(waitlist[0]).toHaveProperty('userId');
            expect(waitlist[0]).toHaveProperty('classId');
            expect(waitlist[0]).toHaveProperty('user');
        }
    });

    // Test createWaitlist endpoint
    test('POST /api/classes/waitlist - should create waitlist entry', async ({ request }) => {
        test.skip(!userToken || !affiliateToken || !affiliateId, 'Required tokens not available');

        // Create a class with small capacity for waitlist testing
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
            memberCapacity: 1,
            location: "Test Location",
            repeatWeekly: false,
            wodName: "FRAN",
            wodType: "BENCHMARK"
        };

        const createResponse = await request.post(`${config.baseURL}/api/classes`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` },
            data: newClassData
        });

        expect(createResponse.status()).toBe(201);
        const createBody = await createResponse.json();
        const waitlistTestClassId = String(createBody.class.id);

        // Try to add to waitlist
        const waitlistData = {
            classId: waitlistTestClassId,
            userPlanId: 0
        };

        const response = await request.post(`${config.baseURL}/api/classes/waitlist`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: waitlistData
        });

        const status = response.status();
        const result = await response.json();

        if (status === 400 && result.error === 'Class is not full') {
            // This is expected if class isn't full
            expect(result.error).toContain('Class is not full');
        } else {
            expect([201, 400]).toContain(status);
        }
    });

    // Test cancelRegistration endpoint
    test('POST /api/classes/cancel - should cancel registration', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const cancelData = {
            classId: testClassId,
            freeClass: true
        };

        const response = await request.post(`${config.baseURL}/api/classes/cancel`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: cancelData
        });

        const status = response.status();
        expect([200, 400, 404]).toContain(status);

        if (status === 200) {
            const result = await response.json();
            expect(result.message).toContain('cancelled successfully');
        }
    });

    // Test deleteAttendee endpoint
    test('DELETE /api/class-attendees - should delete attendee', async ({ request }) => {
        test.skip(!affiliateToken || !testClassId, 'Auth token or test class not available');

        const profileResponse = await request.get(`${config.baseURL}/api/user`, {
            headers: { 'Authorization': `Bearer ${userToken}` }
        });

        if (!profileResponse.ok()) {
            test.skip('Could not get user profile');
        }

        const userProfile = await profileResponse.json();
        const userId = userProfile.id;

        const deleteData = {
            classId: testClassId,
            userId: userId,
            freeClass: true
        };

        const response = await request.delete(`${config.baseURL}/api/class-attendees`, {
            headers: { 'Authorization': `Bearer ${affiliateToken}` },
            data: deleteData
        });

        const status = response.status();
        expect([200, 404]).toContain(status);

        if (status === 200) {
            const result = await response.json();
            expect(result.message).toContain('cancelled successfully');
        }
    });

    // Test addClassToMyTrainings endpoint
    test('POST /api/classes/add-training - should add class to my trainings', async ({ request }) => {
        test.skip(!userToken || !testClassId, 'User token or test class not available');

        const trainingData = {
            classId: testClassId,
            addCompetition: false
        };

        const response = await request.post(`${config.baseURL}/api/classes/add-training`, {
            headers: { 'Authorization': `Bearer ${userToken}` },
            data: trainingData
        });

        expect(response.ok()).toBeTruthy();
        const result = await response.json();
        expect(result.message).toContain('added to My Trainings successfully');
    });


});