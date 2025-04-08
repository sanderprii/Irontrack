const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

test.describe('Training Plan Controller', () => {
    let authToken;
    let userId;

    test.beforeEach(async ({ request }) => {
        try {
            // Authenticate before each test
            const loginResponse = await request.post('http://localhost:5000/api/auth/login', {
                data: {
                    email: 'd@d.d',
                    password: 'dddddd'
                }
            });
            expect(loginResponse.status()).toBe(200);
            const loginData = await loginResponse.json();
            authToken = loginData.token;
            userId = loginData.user.id;
        } catch (error) {
            await sendTestFailureReport(
                'Training Plan Controller - Authentication Setup Failure',
                error,
                {
                    testUser: 'd@d.d',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    test.describe('getTrainingPlans', () => {
        test('should return training plans for a user', async ({ request }) => {
            try {
                const response = await request.get(`http://localhost:5000/api/trainer/plans?role=trainer&selectedUserId=${userId}`, {
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
                    expect(data[0]).toHaveProperty('creatorId');
                    expect(data[0]).toHaveProperty('userId');
                }
            } catch (error) {
                await sendTestFailureReport(
                    'Get Training Plans Test Failure',
                    error,
                    {
                        endpoint: '/api/trainer/plans',
                        userId: userId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return filtered training plans', async ({ request }) => {
            const response = await request.get(`/api/trainer/plans?role=trainer&selectedUserId=${userId}`, {
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
                expect(data[0]).toHaveProperty('creatorId');
                expect(data[0]).toHaveProperty('userId');
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get(`http://localhost:5000/api/trainer/plans?role=trainer&selectedUserId=${userId}`);
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport(
                    'Unauthorized Training Plans Test Failure',
                    error,
                    {
                        endpoint: '/api/trainer/plans',
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    test.describe('getTrainingPlanById', () => {
        test('should return specific training plan', async ({ request }) => {
            try {
                // First create a plan
                const newPlan = {
                    name: 'Test Plan',
                    userId: userId,
                    trainingDays: [
                        {
                            name: 'Day 1',
                            sectors: [
                                {
                                    type: 'Exercise',
                                    content: 'Push-ups',
                                    youtubeLinks: []
                                }
                            ]
                        }
                    ]
                };

                const createResponse = await request.post('http://localhost:5000/api/trainer/plans', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newPlan
                });
                expect(createResponse.status()).toBe(201);
                const createdPlan = await createResponse.json();

                // Then get it
                const response = await request.get(`http://localhost:5000/api/trainer/plans/${createdPlan.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(200);
                
                const data = await response.json();
                expect(data).toHaveProperty('id');
                expect(data).toHaveProperty('name');
                expect(data).toHaveProperty('creatorId');
                expect(data).toHaveProperty('userId');
                expect(data).toHaveProperty('trainingDays');
            } catch (error) {
                await sendTestFailureReport(
                    'Get Training Plan By ID Test Failure',
                    error,
                    {
                        endpoint: '/api/trainer/plans/:id',
                        userId: userId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 404 for non-existent plan', async ({ request }) => {
            try {
                const response = await request.get('http://localhost:5000/api/trainer/plans/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport(
                    'Get Non-existent Training Plan Test Failure',
                    error,
                    {
                        endpoint: '/api/trainer/plans/999999',
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    test.describe('createTrainingPlan', () => {
        test('should create a new training plan', async ({ request }) => {
            const newPlan = {
                name: 'Test Plan',
                userId: userId,
                trainingDays: [
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const response = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });
            expect(response.status()).toBe(201);
            
            const data = await response.json();
            expect(data).toHaveProperty('id');
            expect(data.name).toBe(newPlan.name);
            expect(data).toHaveProperty('trainingDays');
            expect(data.trainingDays).toHaveLength(1);
            expect(data.trainingDays[0].name).toBe(newPlan.trainingDays[0].name);
        });

        test('should return 400 for invalid plan data', async ({ request }) => {
            const invalidPlan = {
                // Missing required fields
            };

            const response = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: invalidPlan
            });
            expect(response.status()).toBe(400);
        });
    });

    test.describe('updateTrainingPlan', () => {
        test('should update an existing training plan', async ({ request }) => {
            // First create a plan
            const newPlan = {
                name: 'Test Plan',
                userId: userId,
                trainingDays: [
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    },
                    {
                        name: 'Day 2',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Pull-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const createResponse = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });
            expect(createResponse.status()).toBe(201);
            const createdPlan = await createResponse.json();

            // Then update it with modified training day names and sectors
            const updatedData = {
                name: 'Updated Plan',
                trainingDays: [
                    {
                        name: 'Updated Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Pull-ups',
                                youtubeLinks: []
                            }
                        ]
                    },
                    {
                        name: 'Updated Day 2',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            },
                            {
                                type: 'Rest',
                                content: '5 minutes',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const updateResponse = await request.put(`/api/trainer/plans/${createdPlan.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: updatedData
            });
            expect(updateResponse.status()).toBe(200);
            
            const updatedPlan = await updateResponse.json();
            expect(updatedPlan.name).toBe(updatedData.name);
            expect(updatedPlan.trainingDays).toHaveLength(2);
            expect(updatedPlan.trainingDays[0].name).toBe(updatedData.trainingDays[0].name);
            expect(updatedPlan.trainingDays[1].name).toBe(updatedData.trainingDays[1].name);
            expect(updatedPlan.trainingDays[1].sectors).toHaveLength(2);
        });

        test('should handle training day reordering', async ({ request }) => {
            // First create a plan
            const newPlan = {
                name: 'Test Plan',
                userId: userId,
                trainingDays: [
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    },
                    {
                        name: 'Day 2',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Pull-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const createResponse = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });
            expect(createResponse.status()).toBe(201);
            const createdPlan = await createResponse.json();

            // Update with reordered days
            const updatedData = {
                name: 'Updated Plan',
                trainingDays: [
                    {
                        name: 'Day 2',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Pull-ups',
                                youtubeLinks: []
                            }
                        ]
                    },
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const updateResponse = await request.put(`/api/trainer/plans/${createdPlan.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: updatedData
            });
            expect(updateResponse.status()).toBe(200);
            
            const updatedPlan = await updateResponse.json();
            expect(updatedPlan.trainingDays).toHaveLength(2);
            expect(updatedPlan.trainingDays[0].name).toBe('Day 2');
            expect(updatedPlan.trainingDays[1].name).toBe('Day 1');
        });


    });

    test.describe('deleteTrainingPlan', () => {
        test('should delete an existing training plan', async ({ request }) => {
            // First create a plan
            const newPlan = {
                name: 'Test Plan',
                userId: userId,
                trainingDays: [
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const createResponse = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });
            expect(createResponse.status()).toBe(201);
            const createdPlan = await createResponse.json();

            // Then delete it
            const deleteResponse = await request.delete(`/api/trainer/plans/${createdPlan.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            expect(deleteResponse.status()).toBe(200);

            // Verify it's deleted
            const getResponse = await request.get(`/api/trainer/plans/${createdPlan.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            expect(getResponse.status()).toBe(404);
        });

        test('should return 404 for non-existent plan', async ({ request }) => {
            const response = await request.delete('/api/trainer/plans/999999', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            expect(response.status()).toBe(404);
        });
    });




    test.describe('completeSector', () => {
        test('should mark a sector as complete', async ({ request }) => {
            // First create a plan with a sector
            const newPlan = {
                name: 'Test Plan',
                userId: userId,
                trainingDays: [
                    {
                        name: 'Day 1',
                        sectors: [
                            {
                                type: 'Exercise',
                                content: 'Push-ups',
                                youtubeLinks: []
                            }
                        ]
                    }
                ]
            };

            const createResponse = await request.post('/api/trainer/plans', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: newPlan
            });
            expect(createResponse.status()).toBe(201);
            const createdPlan = await createResponse.json();

            const sectorData = {
                sectorId: createdPlan.trainingDays[0].sectors[0].id,
                completed: true
            };

            const response = await request.put('/api/trainer/plans/sector/complete', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: sectorData
            });
            expect(response.status()).toBe(200);
            
            const data = await response.json();
            expect(data).toHaveProperty('id');
            expect(data.completed).toBe(true);
        });

        test('should return 404 for non-existent sector', async ({ request }) => {
            const response = await request.put('/api/trainer/plans/sector/complete', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    sectorId: 999999,
                    completed: true
                }
            });
            expect(response.status()).toBe(404);
        });
    });


}); 