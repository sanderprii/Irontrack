const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

test.describe('Contact Note Controller', () => {
    let authToken;
    let affiliateId;

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
            affiliateId = loginData.userId;
        } catch (error) {
            await sendTestFailureReport(
                'Contact Note Controller Setup Failure',
                error,
                {
                    endpoint: '/api/auth/login',
                    email: 'd@d.d',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    test.describe('getContactNotes', () => {
        test('should return contact notes for a user', async ({ request }) => {
            try {
                const response = await request.get(`/api/contact-notes?userId=${affiliateId}&affiliateId=${affiliateId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(200);
                
                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
                if (data.length > 0) {
                    expect(data[0]).toHaveProperty('id');
                    expect(data[0]).toHaveProperty('note');
                    expect(data[0]).toHaveProperty('createdAt');
                }
            } catch (error) {
                await sendTestFailureReport(
                    'Get Contact Notes Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-notes',
                        userId: affiliateId,
                        affiliateId: affiliateId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 400 if userId or affiliateId is missing', async ({ request }) => {
            try {
                const response = await request.get('/api/contact-notes', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(400);
            } catch (error) {
                await sendTestFailureReport(
                    'Get Contact Notes Missing Parameters Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-notes',
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            try {
                const response = await request.get(`/api/contact-notes?userId=${affiliateId}&affiliateId=${affiliateId}`);
                expect(response.status()).toBe(401);
            } catch (error) {
                await sendTestFailureReport(
                    'Get Contact Notes Unauthorized Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-notes',
                        userId: affiliateId,
                        affiliateId: affiliateId,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    test.describe('createContactNote', () => {
        test('should create a new contact note', async ({ request }) => {
            try {
                const newNote = {
                    userId: affiliateId,
                    affiliateId: affiliateId,
                    note: 'Test contact note'
                };

                const response = await request.post('/api/contact-note', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newNote
                });
                expect(response.status()).toBe(201);
                
                const data = await response.json();
                expect(data).toHaveProperty('id');
                expect(data.note).toBe(newNote.note);
            } catch (error) {
                await sendTestFailureReport(
                    'Create Contact Note Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note',
                        userId: affiliateId,
                        affiliateId: affiliateId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 400 for invalid note data', async ({ request }) => {
            try {
                const invalidNote = {
                    // Missing required fields
                };

                const response = await request.post('/api/contact-note', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: invalidNote
                });
                expect(response.status()).toBe(400);
            } catch (error) {
                await sendTestFailureReport(
                    'Create Contact Note Invalid Data Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note',
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    test.describe('updateContactNote', () => {
        test('should update an existing contact note', async ({ request }) => {
            try {
                // First create a note
                const newNote = {
                    userId: affiliateId,
                    affiliateId: affiliateId,
                    note: 'Test contact note'
                };

                const createResponse = await request.post('/api/contact-note', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newNote
                });
                const createdNote = await createResponse.json();

                // Then update it
                const updatedData = {
                    note: 'Updated test contact note'
                };

                const updateResponse = await request.put(`/api/contact-note/${createdNote.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: updatedData
                });
                expect(updateResponse.status()).toBe(200);
                
                const updatedNote = await updateResponse.json();
                expect(updatedNote.note).toBe(updatedData.note);
            } catch (error) {
                await sendTestFailureReport(
                    'Update Contact Note Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note',
                        userId: affiliateId,
                        affiliateId: affiliateId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 404 for non-existent note', async ({ request }) => {
            try {
                const response = await request.put('/api/contact-note/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: {
                        note: 'Updated content'
                    }
                });
                expect(response.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport(
                    'Update Non-existent Contact Note Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note/999999',
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });

    test.describe('deleteContactNote', () => {
        test('should delete an existing contact note', async ({ request }) => {
            try {
                // First create a note
                const newNote = {
                    userId: affiliateId,
                    affiliateId: affiliateId,
                    note: 'Test contact note'
                };

                const createResponse = await request.post('/api/contact-note', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: newNote
                });
                const createdNote = await createResponse.json();

                // Then delete it
                const deleteResponse = await request.delete(`/api/contact-note/${createdNote.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(deleteResponse.status()).toBe(200);

                // Verify it's deleted
                const getResponse = await request.get(`/api/contact-note/${createdNote.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(getResponse.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport(
                    'Delete Contact Note Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note',
                        userId: affiliateId,
                        affiliateId: affiliateId,
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });

        test('should return 404 for non-existent note', async ({ request }) => {
            try {
                const response = await request.delete('/api/contact-note/999999', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                expect(response.status()).toBe(404);
            } catch (error) {
                await sendTestFailureReport(
                    'Delete Non-existent Contact Note Test Failure',
                    error,
                    {
                        endpoint: '/api/contact-note/999999',
                        authTokenPresent: !!authToken,
                        timestamp: new Date().toISOString()
                    }
                );
                throw error;
            }
        });
    });
}); 