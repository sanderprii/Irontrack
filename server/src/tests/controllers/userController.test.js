const { test, expect } = require('@playwright/test');


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
                dateOfBirth: originalProfile.dateOfBirth || '',
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

                throw error;
            }
        });
    });

    // Test adding and deleting user notes (affiliate only)
    test.describe.serial('User Notes tests', () => {
        let createdNoteId = null;
        let userId = null;

        // Setup - get user ID first
        test.beforeAll(async ({ request }) => {
            try {
                if (!affiliateToken) {
                    console.error('Affiliate token not available for notes tests');
                    return;
                }

                const profileResponse = await request.get('http://localhost:5000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                if (!profileResponse.ok()) {
                    console.error('Failed to get user profile:', await profileResponse.text());
                    return;
                }

                const userProfile = await profileResponse.json();
                userId = userProfile.id;
                console.log('Got user ID for notes tests:', userId);
            } catch (error) {
                console.error('Failed to get user ID:', error);
            }
        });

        // Test addUserNote endpoint
        test('POST /api/user/notes/:userId/notes - should add a note to a user', async ({ request }) => {
            try {
                if (!affiliateToken) {
                    console.error('Skipping add note test - missing affiliate token');
                    return;
                }

                if (!userId) {
                    console.error('Skipping add note test - missing user ID');
                    return;
                }

                const noteData = {
                    note: 'This is a test note added during API testing',
                    flag: 'green'
                };

                console.log('Adding note for user:', userId);

                const response = await request.post(`http://localhost:5000/api/user/notes/${userId}/notes`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    },
                    data: noteData
                });

                if (!response.ok()) {
                    console.error('Failed to add note:', await response.text());
                    throw new Error('Failed to add note');
                }

                const result = await response.json();
                console.log('Add user note result:', result);

                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('userId', userId);
                expect(result).toHaveProperty('note', noteData.note);
                expect(result).toHaveProperty('flag', noteData.flag);

                createdNoteId = result.id;
                console.log('Created note with ID:', createdNoteId);

            } catch (error) {

                throw error;
            }
        });

        // Test deleteUserNote endpoint
        test('DELETE /api/user/notes/:userId/notes/:noteId - should delete a user note', async ({ request }) => {
            try {
                if (!affiliateToken) {
                    console.error('Skipping delete note test - missing affiliate token');
                    return;
                }

                if (!userId) {
                    console.error('Skipping delete note test - missing user ID');
                    return;
                }

                if (!createdNoteId) {
                    console.error('Skipping delete note test - missing note ID');
                    return;
                }

                console.log('Attempting to delete note:', {
                    userId,
                    noteId: createdNoteId
                });

                const response = await request.delete(`http://localhost:5000/api/user/notes/${userId}/notes/${createdNoteId}`, {
                    headers: {
                        'Authorization': `Bearer ${affiliateToken}`
                    }
                });

                if (!response.ok()) {
                    console.error('Failed to delete note:', await response.text());
                    throw new Error('Failed to delete note');
                }

                const result = await response.json();
                console.log('Delete user note result:', result);

                expect(result).toHaveProperty('id', createdNoteId);

            } catch (error) {

                throw error;
            }
        });
    });
});