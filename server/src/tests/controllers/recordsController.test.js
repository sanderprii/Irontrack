const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

test.describe('Records Controller', () => {
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
                testName: 'Records Controller - Authentication',
                error: error.message,
                endpoint: '/api/auth/login',
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    });

    test.describe('getRecords', () => {
        test('should return records for a user', async ({ request }) => {
            try {
                const response = await request.get('/api/records?type=WOD', {
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
                    expect(data[0]).toHaveProperty('date');
                }
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Get Records',
                    error: error.message,
                    endpoint: '/api/records?type=WOD',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get('/api/records?type=WOD');
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Get Records Unauthorized',
                    error: error.message,
                    endpoint: '/api/records?type=WOD',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('createRecord', () => {
        test('should create a new record', async ({ request }) => {
            try {
                const newRecord = {
                    type: 'WOD',
                    name: 'TEST-RECORD',
                    date: new Date().toISOString(),
                    score: '10:30'
                };

                const response = await request.post('/api/records', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newRecord
                });
                expect(response.status()).toBe(201);
                
                const data = await response.json();
                expect(data).toHaveProperty('message');
                expect(data.message).toBe('Record added successfully!');
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Create Record',
                    error: error.message,
                    endpoint: '/api/records',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 500 for invalid record data', async ({ request }) => {
            try {
                const invalidRecord = {
                    // Missing required fields
                };

                const response = await request.post('/api/records', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidRecord
                });
                expect(response.status()).toBe(500);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Create Invalid Record',
                    error: error.message,
                    endpoint: '/api/records',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('updateRecord', () => {
        test('should update an existing record', async ({ request }) => {
            try {
                // First create a record
                const newRecord = {
                    type: 'WOD',
                    name: 'TEST-RECORD',
                    date: new Date().toISOString(),
                    score: '10:30'
                };

                const createResponse = await request.post('/api/records', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newRecord
                });
                const createData = await createResponse.json();
                expect(createResponse.status()).toBe(201);

                // Get the created record
                const getResponse = await request.get('/api/records?type=WOD', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                const records = await getResponse.json();
                const createdRecord = records.find(r => r.name === 'TEST-RECORD');
                expect(createdRecord).toBeTruthy();

                // Then update it
                const updatedData = {
                    date: new Date().toISOString(),
                    score: '9:45'
                };

                const updateResponse = await request.put(`/api/records/${createdRecord.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: updatedData
                });
                expect(updateResponse.status()).toBe(200);
                
                const data = await updateResponse.json();
                expect(data).toHaveProperty('message');
                expect(data.message).toBe('Record updated successfully!');
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Update Record',
                    error: error.message,
                    endpoint: '/api/records/:id',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 404 for non-existent record', async ({ request }) => {
            try {
                const response = await request.put('/api/records/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        score: '9:45'
                    }
                });
                expect(response.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Update Non-existent Record',
                    error: error.message,
                    endpoint: '/api/records/999999',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });

    test.describe('deleteRecord', () => {
        test('should delete an existing record', async ({ request }) => {
            try {
                // First create a record
                const newRecord = {
                    type: 'WOD',
                    name: 'TEST-RECORD',
                    date: new Date().toISOString(),
                    score: '10:30'
                };

                const createResponse = await request.post('/api/records', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newRecord
                });
                expect(createResponse.status()).toBe(201);

                // Get the created record
                const getResponse = await request.get('/api/records?type=WOD', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                const records = await getResponse.json();
                const createdRecord = records.find(r => r.name === 'TEST-RECORD');
                expect(createdRecord).toBeTruthy();

                // Then delete it
                const deleteResponse = await request.delete(`/api/records/${createdRecord.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(deleteResponse.status()).toBe(200);
                
                const data = await deleteResponse.json();
                expect(data).toHaveProperty('message');
                expect(data.message).toBe('Record deleted successfully!');

                // Add a small delay to ensure deletion is processed
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify deletion by checking the records list
                const verifyResponse = await request.get('/api/records?type=WOD', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(verifyResponse.status()).toBe(200);
                const remainingRecords = await verifyResponse.json();
                const deletedRecord = remainingRecords.find(r => r.id === createdRecord.id);
                expect(deletedRecord).toBeUndefined();
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Delete Record',
                    error: error.message,
                    endpoint: '/api/records/:id',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });

        test('should return 404 for non-existent record', async ({ request }) => {
            try {
                const response = await request.delete('/api/records/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport({
                    testName: 'Records Controller - Delete Non-existent Record',
                    error: error.message,
                    endpoint: '/api/records/999999',
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        });
    });
}); 