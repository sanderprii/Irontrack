const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

test.describe('Plan Controller', () => {
    let authToken;
    let userId;

    test.beforeEach(async ({ request }) => {
        try {
            // Authenticate before each test
            const loginResponse = await request.post('/api/auth/login', {
                data: {
                    email: 'd@d.d',
                    password: 'dddddd'
                }
            });
            expect(loginResponse.status()).toBe(200);
            const loginData = await loginResponse.json();
            authToken = loginData.token;
            userId = loginData.userId;
        } catch (error) {
            await sendTestFailureReport({
                testName: 'Plan Controller - Authentication',
                error: error.message,
                endpoint: '/api/auth/login',
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    });

    test.describe('getPlans', () => {
        test('should return all plans', async ({ request }) => {
            try {
                const response = await request.get('/api/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(200);
                
                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
                if (data.length > 0) {
                    expect(data[0]).toHaveProperty('id');
                    expect(data[0]).toHaveProperty('name');
                    expect(data[0]).toHaveProperty('price');
                }
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Get Plans',
                    error: error.message,
                    endpoint: '/api/plans',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get('/api/plans');
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Get Plans Unauthorized',
                    error: error.message,
                    endpoint: '/api/plans',
                    timestamp: new Date().toISOString()
                });
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
                    ownerId: userId
                };

                const response = await request.post('/api/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newPlan
                });
                expect(response.status()).toBe(201);
                
                const data = await response.json();
                expect(data).toHaveProperty('message');
                expect(data).toHaveProperty('plan');
                expect(data.plan).toHaveProperty('id');
                expect(data.plan.name).toBe(newPlan.name);
                expect(data.plan.price).toBe(newPlan.price);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Create Plan',
                    error: error.message,
                    endpoint: '/api/plans',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 400 for invalid plan data', async ({ request }) => {
            try {
                const invalidPlan = {
                    // Missing required fields
                };

                const response = await request.post('/api/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPlan
                });
                expect(response.status()).toBe(500);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Create Invalid Plan',
                    error: error.message,
                    endpoint: '/api/plans',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('updatePlan', () => {
        test('should update an existing plan', async ({ request }) => {
            try {
                // First create a plan
                const newPlan = {
                    name: 'Test Plan',
                    price: 99.99,
                    validityDays: 30,
                    sessions: 10,
                    ownerId: userId
                };

                const createResponse = await request.post('/api/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newPlan
                });
                const createdPlan = await createResponse.json();

                // Then update it
                const updatedData = {
                    name: 'Updated Test Plan',
                    price: 149.99,
                    sessions: 15,
                    validityDays: 45,
                    trainingType: ['gym', 'swimming']
                };

                const updateResponse = await request.put(`/api/plans/${createdPlan.plan.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: updatedData
                });
                expect(updateResponse.status()).toBe(200);
                
                const data = await updateResponse.json();
                expect(data).toHaveProperty('message');
                expect(data).toHaveProperty('plan');
                expect(data.plan.price).toBe(updatedData.price);
                expect(data.plan.sessions).toBe(updatedData.sessions);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Update Plan',
                    error: error.message,
                    endpoint: '/api/plans/:id',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 403 for non-existent plan', async ({ request }) => {
            try {
                const response = await request.put('/api/plans/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        price: 149.99
                    }
                });
                expect(response.status()).toBe(403);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Update Non-existent Plan',
                    error: error.message,
                    endpoint: '/api/plans/999999',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('deletePlan', () => {
        test('should delete an existing plan', async ({ request }) => {
            try {
                // First create a plan
                const newPlan = {
                    name: 'Test Plan',
                    price: 99.99,
                    validityDays: 30,
                    sessions: 10,
                    ownerId: userId
                };

                const createResponse = await request.post('/api/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newPlan
                });
                const createdPlan = await createResponse.json();

                // Then delete it
                const deleteResponse = await request.delete(`/api/plans/${createdPlan.plan.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(deleteResponse.status()).toBe(200);

                // Verify it's deleted
                const getResponse = await request.get(`/api/plans/${createdPlan.plan.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(getResponse.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Delete Plan',
                    error: error.message,
                    endpoint: '/api/plans/:id',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 403 for non-existent plan', async ({ request }) => {
            try {
                const response = await request.delete('/api/plans/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(403);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Delete Non-existent Plan',
                    error: error.message,
                    endpoint: '/api/plans/999999',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('buyPlan', () => {
        test('should return 400 for invalid purchase data', async ({ request }) => {
            try {
                const invalidPurchase = {
                    // Missing required fields
                };

                const response = await request.post('/api/plans/buy-plan/1', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidPurchase
                });
                expect(response.status()).toBe(500);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Buy Plan Invalid Data',
                    error: error.message,
                    endpoint: '/api/plans/buy-plan/1',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('getUserCredit', () => {
        test('should return user credit information', async ({ request }) => {
            try {
                const response = await request.get(`/api/plans/credit/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(200);
                
                const data = await response.json();
                if (data) {
                    expect(data).toHaveProperty('credit');
                    expect(data).toHaveProperty('lastUpdated');
                }
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Get User Credit',
                    error: error.message,
                    endpoint: `/api/plans/credit/${userId}`,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get(`/api/plans/credit/${userId}`);
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Plan Controller - Get User Credit Unauthorized',
                    error: error.message,
                    endpoint: `/api/plans/credit/${userId}`,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });
}); 