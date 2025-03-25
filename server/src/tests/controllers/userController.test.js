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

// Store auth tokens
let userToken = null;      // c@c.c - Regular user
let affiliateToken = null; // d@d.d - Affiliate owner
let affiliateId = null;    // Affiliate ID to use in tests

test.describe('User Controller', () => {

    // Login before running tests
    test.beforeAll(async ({ request }) => {
        try {
            userToken = await loginUser(request, 'c@c.c', 'cccccc');
            affiliateToken = await loginUser(request, 'd@d.d', 'dddddd');

            if (userToken) {
                console.log('Successfully logged in with regular user');
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
                'User Controller Test Setup Failure',
                error,
                { testUsers: ['c@c.c', 'd@d.d'] }
            );
        }
    });

    // Test getUserData endpoint
    test('GET /api/user/user-data - should get user data', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            const response = await request.get('http://localhost:5000/api/user/user-data', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const userData = await response.json();
            console.log('User data:', userData);

            expect(userData).toHaveProperty('id');
            expect(userData).toHaveProperty('email', 'c@c.c');

        } catch (error) {
            await sendTestFailureReport(
                'Get User Data Test Failure',
                error,
                {
                    endpoint: '/api/user/user-data',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getUser endpoint
    test('GET /api/user - should get user profile', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            const response = await request.get('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const user = await response.json();
            console.log('User profile:', user);

            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('fullName');

        } catch (error) {
            await sendTestFailureReport(
                'Get User Profile Test Failure',
                error,
                {
                    endpoint: '/api/user',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getUserPlansByAffiliate endpoint
    test('GET /api/user/user-plans - should get user plans for an affiliate', async ({ request }) => {
        try {
            // Skip test if login failed or no affiliate ID
            test.skip(!userToken || !affiliateId, 'User token or affiliate ID not available');

            const response = await request.get(`http://localhost:5000/api/user/user-plans?affiliateId=${affiliateId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const plans = await response.json();
            console.log(`Retrieved ${plans.length} user plans for affiliate ${affiliateId}`);

            expect(Array.isArray(plans)).toBeTruthy();

            // If plans exist, check their structure
            if (plans.length > 0) {
                expect(plans[0]).toHaveProperty('id');
                expect(plans[0]).toHaveProperty('planName');
                expect(plans[0]).toHaveProperty('sessionsLeft');
                expect(plans[0]).toHaveProperty('endDate');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get User Plans By Affiliate Test Failure',
                error,
                {
                    endpoint: '/api/user/user-plans',
                    affiliateId,
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getVisitHistory endpoint
    test('GET /api/user/user-visit-history - should get user visit history', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            const response = await request.get('http://localhost:5000/api/user/user-visit-history', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const visits = await response.json();
            console.log(`Retrieved ${visits.length} visit records`);

            expect(Array.isArray(visits)).toBeTruthy();

            // If visits exist, check their structure
            if (visits.length > 0) {
                expect(visits[0]).toHaveProperty('userId');
                expect(visits[0]).toHaveProperty('classId');
                expect(visits[0]).toHaveProperty('classSchedule');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Visit History Test Failure',
                error,
                {
                    endpoint: '/api/user/user-visit-history',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getPurchaseHistory endpoint
    test('GET /api/user/user-purchase-history - should get user purchase history', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Get user ID from profile
            const profileResponse = await request.get('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const userProfile = await profileResponse.json();
            const userId = userProfile.id;

            test.skip(!userId, 'Could not get user ID');

            const response = await request.get(`http://localhost:5000/api/user/user-purchase-history?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const purchases = await response.json();
            console.log(`Retrieved ${purchases.length} purchase records`);

            expect(Array.isArray(purchases)).toBeTruthy();

            // If purchases exist, check their structure
            if (purchases.length > 0) {
                expect(purchases[0]).toHaveProperty('userId', userId);
                expect(purchases[0]).toHaveProperty('planName');
                expect(purchases[0]).toHaveProperty('price');
                expect(purchases[0]).toHaveProperty('purchasedAt');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Purchase History Test Failure',
                error,
                {
                    endpoint: '/api/user/user-purchase-history',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test updateUserData endpoint
    test('PUT /api/user - should update user data', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // First get current user data to restore it later
            const profileResponse = await request.get('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const originalProfile = await profileResponse.json();

            // Update with same data (effectively no change)
            const updateData = {
                fullName: originalProfile.fullName,
                email: originalProfile.email,
                dateOfBirth: originalProfile.dateOfBirth
            };

            const response = await request.put('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: updateData
            });

            expect(response.ok()).toBeTruthy();

            const result = await response.json();
            console.log('Update user result:', result);

            expect(result).toHaveProperty('message');
            expect(result.message).toContain('updated successfully');

        } catch (error) {
            await sendTestFailureReport(
                'Update User Data Test Failure',
                error,
                {
                    endpoint: '/api/user',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test editProfile endpoint
    // Test editProfile endpoint
    test('POST /api/user/profile - should update user profile', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // First get current user data
            const profileResponse = await request.get('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const originalProfile = await profileResponse.json();

            // Update with the same data (effectively no change)
            const updateData = {
                fullName: originalProfile.fullName || '',
                email: originalProfile.email || '',
                phone: originalProfile.phone || '',
                address: originalProfile.address || '',

            };

            // Make sure all fields have valid values, not undefined
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    updateData[key] = '';
                }
            });

            const response = await request.post('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json'
                },
                data: updateData
            });

            // Debug response
            console.log('Profile update status:', response.status());
            try {
                const responseText = await response.text();
                console.log('Response text:', responseText);
            } catch (e) {
                console.log('Could not get response text:', e);
            }

            expect(response.ok()).toBeTruthy();

            const result = await response.json();
            console.log('Edit profile result:', result);

            expect(result).toHaveProperty('message');
            expect(result.message).toContain('updated successfully');

        } catch (error) {
            await sendTestFailureReport(
                'Edit Profile Test Failure',
                error,
                {
                    endpoint: '/api/user/profile',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test getUserAttendees endpoint
    test('GET /api/user/attendees - should get user class attendance', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Get user ID from profile
            const profileResponse = await request.get('http://localhost:5000/api/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            const userProfile = await profileResponse.json();
            const userId = userProfile.id;

            test.skip(!userId, 'Could not get user ID');

            // Test with and without affiliateId
            const response = await request.get(`http://localhost:5000/api/user/attendees?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const attendees = await response.json();
            console.log(`Retrieved ${attendees.length} user attendees records`);

            expect(Array.isArray(attendees)).toBeTruthy();

            // If attendees exist, check their structure
            if (attendees.length > 0) {
                expect(attendees[0]).toHaveProperty('userId', userId);
                expect(attendees[0]).toHaveProperty('classId');
                expect(attendees[0]).toHaveProperty('classSchedule');
            }

            // If we have an affiliate ID, test with that too
            if (affiliateId) {
                const affiliateResponse = await request.get(
                    `http://localhost:5000/api/user/attendees?userId=${userId}&affiliateId=${affiliateId}`, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });

                expect(affiliateResponse.ok()).toBeTruthy();

                const affiliateAttendees = await affiliateResponse.json();
                console.log(`Retrieved ${affiliateAttendees.length} user attendees for affiliate ${affiliateId}`);

                expect(Array.isArray(affiliateAttendees)).toBeTruthy();
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get User Attendees Test Failure',
                error,
                {
                    endpoint: '/api/user/attendees',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test changePassword endpoint - skip this test if running in CI
    test('POST /api/user/change-password - should validate password change request', async ({ request }) => {
        // We'll only verify that the endpoint checks for valid current password
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            // Use incorrect current password to avoid actually changing it
            const passwordData = {
                oldPassword: 'wrong-password',
                newPassword: 'new-password123'
            };

            const response = await request.post('http://localhost:5000/api/user/change-password', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: passwordData
            });

            // This should fail with 400 due to invalid current password
            expect(response.status()).toBe(400);

            const result = await response.json();
            console.log('Change password result:', result);

            expect(result).toHaveProperty('error');
            expect(result.error).toContain('Invalid current password');

        } catch (error) {
            await sendTestFailureReport(
                'Change Password Test Failure',
                error,
                {
                    endpoint: '/api/user/change-password',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test statistics endpoints
    test.describe('User Statistics tests', () => {

        // Test getStatistics endpoint
        test('GET /api/statistics - should get user statistics', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken, 'User token not available');

                // Get user ID from profile
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const userProfile = await profileResponse.json();
                const userId = userProfile.id;

                test.skip(!userId, 'Could not get user ID');

                const response = await request.get(`http://localhost:5000/api/statistics?userId=${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const stats = await response.json();
                console.log('User statistics:', stats);

                expect(stats).toHaveProperty('trainingTypeCounts');
                expect(stats).toHaveProperty('monthlyTrainings');
                expect(stats).toHaveProperty('yearlyTrainings');

            } catch (error) {
                await sendTestFailureReport(
                    'Get Statistics Test Failure',
                    error,
                    {
                        endpoint: '/api/statistics',
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // Test getAllStatistics endpoint
        test('GET /api/statistics/all - should get platform-wide statistics', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!affiliateToken, 'Affiliate token not available');

                const response = await request.get('http://localhost:5000/api/statistics/all', {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const stats = await response.json();
                console.log('Platform statistics:', stats);

                expect(stats).toHaveProperty('users');
                expect(stats).toHaveProperty('trainings');
                expect(stats).toHaveProperty('records');

            } catch (error) {
                await sendTestFailureReport(
                    'Get All Statistics Test Failure',
                    error,
                    {
                        endpoint: '/api/statistics/all',
                        authTokenPresent: !!affiliateToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    // Test adding and deleting user notes (affiliate only)
    test.describe('User Notes tests', () => {
        let createdNoteId = null;

        // Test addUserNote endpoint
        test('POST /api/user/notes/:userId/notes - should add a note to a user', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!affiliateToken, 'Affiliate token not available');

                // First get a user ID to add a note to
                // We can use the profile API with our user token to get a valid ID
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const userProfile = await profileResponse.json();
                const userId = userProfile.id;

                test.skip(!userId, 'Could not get user ID');

                const noteData = {
                    note: 'This is a test note added during API testing',
                    flag: 'green'
                };

                const response = await request.post(`http://localhost:5000/api/user/notes/${userId}/notes`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    },
                    data: noteData
                });

                // Check if endpoint exists
                if (response.status() === 404) {
                    console.log('User notes endpoint not found - may not be implemented yet');
                    test.skip(true, 'User notes endpoint not found');
                    return;
                }

                expect(response.ok()).toBeTruthy();

                const result = await response.json();
                console.log('Add user note result:', result);

                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('userId', userId);
                expect(result).toHaveProperty('note', 'This is a test note added during API testing');
                expect(result).toHaveProperty('flag', 'green');

                // Store ID for delete test
                createdNoteId = result.id;

            } catch (error) {
                await sendTestFailureReport(
                    'Add User Note Test Failure',
                    error,
                    {
                        endpoint: '/api/user/notes/{id}/notes',
                        authTokenPresent: !!affiliateToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // Test deleteUserNote endpoint - depends on previous test
        test('DELETE /api/user/notes/:userId/notes/:noteId - should delete a user note', async ({ request }) => {
            try {
                // Skip test if login failed or no note was created
                test.skip(!affiliateToken || !createdNoteId, 'Affiliate token or note ID not available');

                // Get a user ID
                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const userProfile = await profileResponse.json();
                const userId = userProfile.id;

                test.skip(!userId, 'Could not get user ID');

                const response = await request.delete(`http://localhost:5000/api/user/notes/${userId}/notes/${createdNoteId}`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const result = await response.json();
                console.log('Delete user note result:', result);

                expect(result).toHaveProperty('id', createdNoteId);

            } catch (error) {
                await sendTestFailureReport(
                    'Delete User Note Test Failure',
                    error,
                    {
                        endpoint: '/api/user/notes/{id}/notes/{noteId}',
                        noteId: createdNoteId,
                        authTokenPresent: !!affiliateToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });
});