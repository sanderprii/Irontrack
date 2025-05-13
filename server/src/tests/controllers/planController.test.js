const { test, expect } = require('@playwright/test');
const config = require('../config');

test.describe('Plan Controller', () => {
    let authToken;
    let userId;
    let affiliateId;

    test.beforeEach(async ({ request }) => {
        try {
            // Authenticate before each test with affiliate owner
            const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
                data: {
                    email: 'd@d.d',
                    password: 'dddddd'
                }
            });

            if (!loginResponse.ok()) {
                const errorText = await loginResponse.text();
                console.error(`Login failed with status ${loginResponse.status()}`);
                console.error('Login error response:', errorText);
            }

            expect(loginResponse.status()).toBe(200);
            const loginData = await loginResponse.json();
            authToken = loginData.token;
            userId = loginData.userId || loginData.id;

            // Get affiliate ID
            const affiliateResponse = await request.get(`${config.baseURL}/api/my-affiliate`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (affiliateResponse.ok()) {
                const affiliateData = await affiliateResponse.json();
                if (affiliateData.affiliate && affiliateData.affiliate.id) {
                    affiliateId = affiliateData.affiliate.id;
                    console.log(`Found affiliate ID: ${affiliateId}`);
                }
            }
        } catch (error) {
            console.error('Authentication setup error:', error);
            throw error;
        }
    });

    test.describe('getPlans', () => {
        test('should return all plans', async ({ request }) => {
            try {
                const response = await request.get(`${config.baseURL}/api/plans`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok()) {
                    const errorText = await response.text();
                    console.error(`Get plans failed with status ${response.status()}`);
                    console.error('Error response:', errorText);
                }

                expect(response.status()).toBe(200);

                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
                console.log(`Retrieved ${data.length} plans`);

                if (data.length > 0) {
                    expect(data[0]).toHaveProperty('id');
                    expect(data[0]).toHaveProperty('name');
                    expect(data[0]).toHaveProperty('price');
                }
            } catch (error) {
                console.error('Get plans test failed:', error);
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get(`${config.baseURL}/api/plans`);
                expect(response.status()).toBe(401);

                const errorBody = await response.json();
                console.log('Unauthorized response:', errorBody);
                expect(errorBody).toHaveProperty('error');
            } catch (error) {
                console.error('Get plans unauthorized test failed:', error);
                throw error;
            }
        });
    });

    test.describe('createPlan', () => {
        test('should create a new plan', async ({ request }) => {
            try {
                const newPlan = {
                    name: 'Test Plan',
                    price: 99.99,
                    validityDays: 30,
                    sessions: 10,
                    trainingType: ['gym', 'crossfit'],
                    active: true
                };

                console.log('Creating plan with data:', JSON.stringify(newPlan, null, 2));

                const response = await request.post(`${config.baseURL}/api/plans`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newPlan
                });

                if (!response.ok()) {
                    const errorText = await response.text();
                    console.error(`Create plan failed with status ${response.status()}`);
                    console.error('Error response:', errorText);
                }

                expect(response.status()).toBe(201);

                const data = await response.json();
                expect(data).toHaveProperty('message');
                expect(data).toHaveProperty('plan');
                expect(data.plan).toHaveProperty('id');
                expect(data.plan.name).toBe(newPlan.name);
                expect(data.plan.price).toBe(newPlan.price);

                console.log(`Created plan with ID: ${data.plan.id}`);
            } catch (error) {
                console.error('Create plan test failed:', error);
                throw error;
            }
        });

        test('should return 500 for invalid plan data', async ({ request }) => {
            try {
                const invalidPlan = {
                    // Missing required fields
                };

                const response = await request.post(`${config.baseURL}/api/plans`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPlan
                });

                expect(response.status()).toBe(500);

                const errorText = await response.text();
                console.log('Invalid plan creation response:', errorText);
            } catch (error) {
                console.error('Create invalid plan test failed:', error);
                throw error;
            }
        });
    });

    test.describe('updatePlan', () => {
        let createdPlanId;

        test.beforeEach(async ({ request }) => {
            // Create a plan before each update test
            const newPlan = {
                name: 'Test Plan for Update',
                price: 99.99,
                validityDays: 30,
                sessions: 10,
                trainingType: ['gym'],
                active: true
            };

            const createResponse = await request.post(`${config.baseURL}/api/plans`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });

            const createdData = await createResponse.json();
            createdPlanId = createdData.plan.id;
        });

        test('should update an existing plan', async ({ request }) => {
            try {
                const updatedData = {
                    name: 'Updated Test Plan',
                    price: 149.99,
                    sessions: 15,
                    validityDays: 45,
                    trainingType: ['gym', 'swimming'],
                    active: true
                };

                console.log(`Updating plan ${createdPlanId} with data:`, JSON.stringify(updatedData, null, 2));

                const updateResponse = await request.put(`${config.baseURL}/api/plans/${createdPlanId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: updatedData
                });

                if (!updateResponse.ok()) {
                    const errorText = await updateResponse.text();
                    console.error(`Update plan failed with status ${updateResponse.status()}`);
                    console.error('Error response:', errorText);
                }

                expect(updateResponse.status()).toBe(200);

                const data = await updateResponse.json();
                expect(data).toHaveProperty('message');
                expect(data).toHaveProperty('plan');
                expect(data.plan.price).toBe(updatedData.price);
                expect(data.plan.sessions).toBe(updatedData.sessions);

                console.log(`Successfully updated plan ${createdPlanId}`);
            } catch (error) {
                console.error('Update plan test failed:', error);
                throw error;
            }
        });

        test('should return 403 for non-existent plan', async ({ request }) => {
            try {
                const response = await request.put(`${config.baseURL}/api/plans/999999`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        price: 149.99,
                        name: 'Non-existent plan'
                    }
                });

                expect(response.status()).toBe(403);

                const errorBody = await response.json();
                console.log('Non-existent plan update response:', errorBody);
                expect(errorBody).toHaveProperty('error');
            } catch (error) {
                console.error('Update non-existent plan test failed:', error);
                throw error;
            }
        });
    });

    test.describe('deletePlan', () => {
        let createdPlanId;

        test.beforeEach(async ({ request }) => {
            // Create a plan before each delete test
            const newPlan = {
                name: 'Test Plan for Delete',
                price: 99.99,
                validityDays: 30,
                sessions: 10,
                trainingType: ['gym'],
                active: true
            };

            const createResponse = await request.post(`${config.baseURL}/api/plans`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });

            const createdData = await createResponse.json();
            createdPlanId = createdData.plan.id;
        });

        test('should delete an existing plan', async ({ request }) => {
            try {
                console.log(`Deleting plan ${createdPlanId}`);

                const deleteResponse = await request.delete(`${config.baseURL}/api/plans/${createdPlanId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!deleteResponse.ok()) {
                    const errorText = await deleteResponse.text();
                    console.error(`Delete plan failed with status ${deleteResponse.status()}`);
                    console.error('Error response:', errorText);
                }

                expect(deleteResponse.status()).toBe(200);

                const data = await deleteResponse.json();
                expect(data).toHaveProperty('message');
                console.log(`Successfully deleted plan ${createdPlanId}`);
            } catch (error) {
                console.error('Delete plan test failed:', error);
                throw error;
            }
        });

        test('should return 403 for non-existent plan', async ({ request }) => {
            try {
                const response = await request.delete(`${config.baseURL}/api/plans/999999`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                expect(response.status()).toBe(403);

                const errorBody = await response.json();
                console.log('Non-existent plan delete response:', errorBody);
                expect(errorBody).toHaveProperty('error');
            } catch (error) {
                console.error('Delete non-existent plan test failed:', error);
                throw error;
            }
        });
    });

    test.describe('handleBuyPlan', () => {
        test('should return 500 for invalid purchase data', async ({ request }) => {
            try {
                const invalidPurchase = {
                    // Missing required fields
                };

                console.log('Testing buy plan with invalid data');

                const response = await request.post(`${config.baseURL}/api/plans/buy-plan/${affiliateId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPurchase
                });

                expect(response.status()).toBe(500);

                const errorText = await response.text();
                console.log('Invalid buy plan response:', errorText);
            } catch (error) {
                console.error('Buy plan invalid data test failed:', error);
                throw error;
            }
        });
    });

    test.describe('getUserCredit', () => {
        test('should return user credit information', async ({ request }) => {
            try {
                test.skip(!affiliateId, 'Affiliate ID not available');

                const response = await request.get(`${config.baseURL}/api/plans/credit/${affiliateId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok()) {
                    const errorText = await response.text();
                    console.error(`Get user credit failed with status ${response.status()}`);
                    console.error('Error response:', errorText);
                }

                expect(response.status()).toBe(200);

                const data = await response.json();
                console.log('User credit data:', data);

                if (data && data !== null) {
                    expect(data).toHaveProperty('credit');
                }
            } catch (error) {
                console.error('Get user credit test failed:', error);
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                test.skip(!affiliateId, 'Affiliate ID not available');

                const response = await request.get(`${config.baseURL}/api/plans/credit/${affiliateId}`);
                expect(response.status()).toBe(401);

                const errorBody = await response.json();
                console.log('Unauthorized credit response:', errorBody);
                expect(errorBody).toHaveProperty('error');
            } catch (error) {
                console.error('Get user credit unauthorized test failed:', error);
                throw error;
            }
        });
    });

    test.describe('assignPlanToUser', () => {
        test('should handle invalid assignment data', async ({ request }) => {
            try {
                test.skip(!affiliateId, 'Affiliate ID not available');

                const invalidAssignment = {
                    // Missing required fields
                };

                console.log('Testing assign plan with invalid data');

                const response = await request.post(`${config.baseURL}/api/plans/assign`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidAssignment
                });

                expect(response.status()).toBe(500);

                const errorText = await response.text();
                console.log('Invalid assign plan response:', errorText);
            } catch (error) {
                console.error('Assign plan invalid data test failed:', error);
                throw error;
            }
        });
    });

    // Debug test to check plan system prerequisites
    test('Debug: Check plan system prerequisites', async ({ request }) => {
        console.log('\n=== PLAN DEBUG INFO ===');
        console.log('Auth token present:', !!authToken);
        console.log('User ID:', userId);
        console.log('Affiliate ID:', affiliateId);

        // Check existing plans
        if (authToken) {
            const plansResponse = await request.get(`${config.baseURL}/api/plans`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (plansResponse.ok()) {
                const plans = await plansResponse.json();
                console.log('Available plans:', plans.length);
                console.log('First plan sample:', plans[0] ? JSON.stringify(plans[0], null, 2) : 'None');
            } else {
                console.log('Failed to get plans:', plansResponse.status());
            }
        }

        // Check user credit if affiliate ID available
        if (authToken && affiliateId) {
            const creditResponse = await request.get(`${config.baseURL}/api/plans/credit/${affiliateId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (creditResponse.ok()) {
                const credit = await creditResponse.json();
                console.log('User credit info:', credit);
            } else {
                console.log('Failed to get credit info:', creditResponse.status());
            }
        }
        console.log('========================\n');
    });
});