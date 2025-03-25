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

// Store auth tokens and IDs
let userToken = null;        // c@c.c - Regular user
let createdTrainingId = null; // ID of training created during testing

test.describe('Training Controller', () => {

    // Login before running tests
    test.beforeAll(async ({ request }) => {
        try {
            userToken = await loginUser(request, 'c@c.c', 'cccccc');

            if (userToken) {
                console.log('Successfully logged in with regular user');
            } else {
                console.error('Failed to login with regular user');
            }

        } catch (error) {
            console.error('Login setup error:', error);
            await sendTestFailureReport(
                'Training Controller Test Setup Failure',
                error,
                { testUser: 'c@c.c' }
            );
        }
    });

    // Test getTrainings endpoint
    test('GET /api/training - should get user trainings', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            const response = await request.get('http://localhost:5000/api/training', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            expect(response.ok()).toBeTruthy();

            const trainings = await response.json();
            console.log(`Retrieved ${trainings.length} trainings`);

            expect(Array.isArray(trainings)).toBeTruthy();

            // If trainings exist, check their structure
            if (trainings.length > 0) {
                expect(trainings[0]).toHaveProperty('id');
                expect(trainings[0]).toHaveProperty('type');
                expect(trainings[0]).toHaveProperty('date');
                expect(trainings[0]).toHaveProperty('exercises');
            }

        } catch (error) {
            await sendTestFailureReport(
                'Get Trainings Test Failure',
                error,
                {
                    endpoint: '/api/training',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test createTraining endpoint
    test('POST /api/training - should create a new training', async ({ request }) => {
        try {
            // Skip test if login failed
            test.skip(!userToken, 'User token not available');

            const trainingData = {
                type: 'WOD',
                date: new Date().toISOString(),
                wodName: 'TEST-WOD',
                wodType: 'FOR TIME',
                score: '5:30',
                exercises: 'This is a test exercise data'
            };

            const response = await request.post('http://localhost:5000/api/training', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
                data: trainingData
            });

            expect(response.ok()).toBeTruthy();

            const result = await response.json();
            console.log('Create training result:', result);

            expect(result).toHaveProperty('message');
            expect(result.message).toContain('added successfully');
            expect(result).toHaveProperty('trainings');
            expect(Array.isArray(result.trainings)).toBeTruthy();

            // Store ID of the first training for update/delete tests
            if (result.trainings && result.trainings.length > 0) {
                createdTrainingId = result.trainings[0].id;
                console.log(`Created training with ID: ${createdTrainingId}`);
            }

        } catch (error) {
            await sendTestFailureReport(
                'Create Training Test Failure',
                error,
                {
                    endpoint: '/api/training',
                    authTokenPresent: !!userToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // The following tests depend on having a created training ID
    test.describe('Training-specific tests', () => {
        test.beforeEach(() => {
            test.skip(!createdTrainingId, 'No created training ID available');
        });

        // Test updateTraining endpoint
        test('PUT /api/training/:id - should update a training', async ({ request }) => {
            try {
                const updateData = {
                    type: 'WOD',
                    date: new Date().toISOString(),
                    wodName: 'UPDATED-WOD',
                    wodType: 'FOR TIME',
                    score: '5:15',
                    exercises: [{ exerciseData: 'Updated exercise data' }]
                };

                const response = await request.put(`http://localhost:5000/api/training/${createdTrainingId}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    },
                    data: updateData
                });

                expect(response.ok()).toBeTruthy();

                const result = await response.json();
                console.log('Update training result:', result);

                expect(result).toHaveProperty('message');
                expect(result.message).toContain('updated successfully');
                expect(result).toHaveProperty('training');
                expect(result.training).toHaveProperty('id', createdTrainingId);
                expect(result.training).toHaveProperty('wodName', 'UPDATED-WOD');

            } catch (error) {
                await sendTestFailureReport(
                    'Update Training Test Failure',
                    error,
                    {
                        endpoint: `/api/training/${createdTrainingId}`,
                        trainingId: createdTrainingId,
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // Test deleteTraining endpoint - run this last
        test('DELETE /api/training/:id - should delete a training', async ({ request }) => {
            try {
                const response = await request.delete(`http://localhost:5000/api/training/${createdTrainingId}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const result = await response.json();
                console.log('Delete training result:', result);

                expect(result).toHaveProperty('message');
                expect(result.message).toContain('deleted successfully');

            } catch (error) {
                await sendTestFailureReport(
                    'Delete Training Test Failure',
                    error,
                    {
                        endpoint: `/api/training/${createdTrainingId}`,
                        trainingId: createdTrainingId,
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    // Test Records endpoints (from recordsController.js)
    test.describe('Records tests', () => {
        let createdRecordId = null;

        // Test getRecords endpoint
        test('GET /api/records - should get user records', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken, 'User token not available');

                const response = await request.get('http://localhost:5000/api/records?type=WOD', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const records = await response.json();
                console.log(`Retrieved ${records.length} records`);

                expect(Array.isArray(records)).toBeTruthy();

                // If records exist, check their structure
                if (records.length > 0) {
                    expect(records[0]).toHaveProperty('id');
                    expect(records[0]).toHaveProperty('name');
                    expect(records[0]).toHaveProperty('date');
                }

            } catch (error) {
                await sendTestFailureReport(
                    'Get Records Test Failure',
                    error,
                    {
                        endpoint: '/api/records',
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // Test createRecord endpoint
        test('POST /api/records - should create a new record', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken, 'User token not available');

                const recordData = {
                    type: 'WOD',
                    name: 'TEST-RECORD',
                    date: new Date().toISOString(),
                    score: '10:30'
                };

                const response = await request.post('http://localhost:5000/api/records', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    },
                    data: recordData
                });

                expect(response.ok()).toBeTruthy();

                const result = await response.json();
                console.log('Create record result:', result);

                expect(result).toHaveProperty('message');
                expect(result.message).toContain('added successfully');

                // Get the created record ID for further tests
                const recordsResponse = await request.get('http://localhost:5000/api/records?type=WOD', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                const records = await recordsResponse.json();
                const createdRecord = records.find(r => r.name === 'TEST-RECORD');

                if (createdRecord) {
                    createdRecordId = createdRecord.id;
                    console.log(`Found created record with ID: ${createdRecordId}`);
                }

            } catch (error) {
                await sendTestFailureReport(
                    'Create Record Test Failure',
                    error,
                    {
                        endpoint: '/api/records',
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // Test getRecordsByName endpoint
        test('GET /api/records/:name - should get records by name', async ({ request }) => {
            try {
                // Skip test if login failed
                test.skip(!userToken, 'User token not available');

                // Use a generic name in case we don't have our created record
                const recordName = 'TEST-RECORD';

                const response = await request.get(`http://localhost:5000/api/records/${recordName}?type=WOD`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                expect(response.ok()).toBeTruthy();

                const records = await response.json();
                console.log(`Retrieved ${records.length} records for name "${recordName}"`);

                expect(Array.isArray(records)).toBeTruthy();

                // If records exist, check their structure
                if (records.length > 0) {
                    expect(records[0]).toHaveProperty('id');
                    expect(records[0]).toHaveProperty('score');
                    expect(records[0]).toHaveProperty('date');
                }

            } catch (error) {
                await sendTestFailureReport(
                    'Get Records By Name Test Failure',
                    error,
                    {
                        endpoint: '/api/records/TEST-RECORD',
                        authTokenPresent: !!userToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        // The following tests depend on having a created record ID
        test.describe('Record-specific tests', () => {
            test.beforeEach(() => {
                test.skip(!createdRecordId, 'No created record ID available');
            });

            // Test updateRecord endpoint
            test('PUT /api/records/:id - should update a record', async ({ request }) => {
                try {
                    const updateData = {
                        date: new Date().toISOString(),
                        score: '9:45'
                    };

                    const response = await request.put(`http://localhost:5000/api/records/${createdRecordId}`, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        },
                        data: updateData
                    });

                    expect(response.ok()).toBeTruthy();

                    const result = await response.json();
                    console.log('Update record result:', result);

                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('updated successfully');

                } catch (error) {
                    await sendTestFailureReport(
                        'Update Record Test Failure',
                        error,
                        {
                            endpoint: `/api/records/${createdRecordId}`,
                            recordId: createdRecordId,
                            authTokenPresent: !!userToken,
                            timestamp: new Date().toISOString()
                        }
                    );
                    throw error;
                }
            });

            // Note: This test is removed because the stats endpoint doesn't exist in your routes
            // If you want to add it back, you need to implement the endpoint in your backend

            // Test deleteRecord endpoint - run this last
            test('DELETE /api/records/:id - should delete a record', async ({ request }) => {
                try {
                    const response = await request.delete(`http://localhost:5000/api/records/${createdRecordId}`, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });

                    expect(response.ok()).toBeTruthy();

                    const result = await response.json();
                    console.log('Delete record result:', result);

                    expect(result).toHaveProperty('message');
                    expect(result.message).toContain('deleted successfully');

                } catch (error) {
                    await sendTestFailureReport(
                        'Delete Record Test Failure',
                        error,
                        {
                            endpoint: `/api/records/${createdRecordId}`,
                            recordId: createdRecordId,
                            authTokenPresent: !!userToken,
                            timestamp: new Date().toISOString()
                        }
                    );
                    throw error;
                }
            });
        });
    });
});