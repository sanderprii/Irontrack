const { test, expect } = require('@playwright/test');
const config = require('../config');

// Configure test to run in serial mode
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

test.describe('Contact Note Controller', () => {
    let authToken;
    let affiliateId;
    let testNoteId;

    test.beforeAll(async ({ request }) => {
        try {
            console.log('Starting login sequence...');
            authToken = await loginUser(request, 'd@d.d', 'dddddd');

            if (authToken) {
                console.log('Successfully logged in with d@d.d');

                // Get the affiliate ID
                const response = await request.get(`${config.baseURL}/api/my-affiliate`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });

                if (response.ok()) {
                    const data = await response.json();
                    if (data.affiliate && data.affiliate.id) {
                        affiliateId = data.affiliate.id;
                        console.log(`Found affiliate ID: ${affiliateId}`);
                    }
                }
            } else {
                console.error('Failed to login with d@d.d');
            }
        } catch (error) {
            console.error('Login setup error:', error);
            throw error;
        }
    });

    test.describe('getContactNotes', () => {
        test('should return contact notes for a user', async ({ request }) => {
            test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

            const response = await request.get(`${config.baseURL}/api/contact-notes?userId=${affiliateId}&affiliateId=${affiliateId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            expect(response.ok()).toBeTruthy();
            const data = await response.json();

            expect(Array.isArray(data)).toBe(true);
            if (data.length > 0) {
                expect(data[0]).toHaveProperty('id');
                expect(data[0]).toHaveProperty('note');
                expect(data[0]).toHaveProperty('createdAt');
            }
        });

        test('should return 400 if userId or affiliateId is missing', async ({ request }) => {
            test.skip(!authToken, 'Auth token not available');

            const response = await request.get(`${config.baseURL}/api/contact-notes`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            expect(response.status()).toBe(400);
            const data = await response.json();
            expect(data).toHaveProperty('error');
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            test.skip(!affiliateId, 'Affiliate ID not available');

            const response = await request.get(`${config.baseURL}/api/contact-notes?userId=${affiliateId}&affiliateId=${affiliateId}`);
            expect(response.status()).toBe(401);
        });
    });

    test.describe('createContactNote', () => {
        test('should create a new contact note', async ({ request }) => {
            test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

            const newNote = {
                userId: affiliateId,
                affiliateId: affiliateId,
                note: 'Test contact note'
            };

            const response = await request.post(`${config.baseURL}/api/contact-note`, {
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

            // Store the note ID for later tests
            testNoteId = data.id;
            console.log(`Created test note with ID: ${testNoteId}`);
        });

        test('should return 400 for invalid note data', async ({ request }) => {
            test.skip(!authToken, 'Auth token not available');

            const invalidNote = {
                // Missing required fields
            };

            const response = await request.post(`${config.baseURL}/api/contact-note`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: invalidNote
            });

            expect(response.status()).toBe(400);
            const data = await response.json();
            expect(data).toHaveProperty('error');
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            test.skip(!affiliateId, 'Affiliate ID not available');

            const newNote = {
                userId: affiliateId,
                affiliateId: affiliateId,
                note: 'Test note without auth'
            };

            const response = await request.post(`${config.baseURL}/api/contact-note`, {
                headers: { 'Content-Type': 'application/json' },
                data: newNote
            });

            expect(response.status()).toBe(401);
        });
    });

    test.describe('updateContactNote', () => {
        test('should update an existing contact note', async ({ request }) => {
            test.skip(!authToken || !testNoteId, 'Auth token or test note not available');

            const updatedData = {
                note: 'Updated test contact note'
            };

            const updateResponse = await request.put(`${config.baseURL}/api/contact-note/${testNoteId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: updatedData
            });

            expect(updateResponse.status()).toBe(200);
            const updatedNote = await updateResponse.json();
            expect(updatedNote.note).toBe(updatedData.note);
        });

        test('should return 404 for non-existent note', async ({ request }) => {
            test.skip(!authToken, 'Auth token not available');

            const response = await request.put(`${config.baseURL}/api/contact-note/999999`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: { note: 'Updated content' }
            });

            expect(response.status()).toBe(404);
            const data = await response.json();
            expect(data).toHaveProperty('error');
        });

        test('should return 400 for invalid data', async ({ request }) => {
            test.skip(!authToken || !testNoteId, 'Auth token or test note not available');

            // Try to update with empty note
            const response = await request.put(`${config.baseURL}/api/contact-note/${testNoteId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                data: {} // Missing note field
            });

            expect(response.status()).toBe(400);
            const data = await response.json();
            expect(data).toHaveProperty('error');
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            test.skip(!testNoteId, 'Test note not available');

            const response = await request.put(`${config.baseURL}/api/contact-note/${testNoteId}`, {
                headers: { 'Content-Type': 'application/json' },
                data: { note: 'Updated without auth' }
            });

            expect(response.status()).toBe(401);
        });
    });

    test.describe('deleteContactNote', () => {
        test('should delete an existing contact note', async ({ request }) => {
            test.skip(!authToken || !testNoteId, 'Auth token or test note not available');

            const deleteResponse = await request.delete(`${config.baseURL}/api/contact-note/${testNoteId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            expect(deleteResponse.status()).toBe(200);
            const result = await deleteResponse.json();
            expect(result).toHaveProperty('success', true);

            // Verify it's deleted by trying to fetch it
            const getResponse = await request.get(`${config.baseURL}/api/contact-notes?userId=${affiliateId}&affiliateId=${affiliateId}`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            expect(getResponse.ok()).toBeTruthy();
            const notes = await getResponse.json();
            const deletedNote = notes.find(note => note.id === testNoteId);
            expect(deletedNote).toBeUndefined();
        });

        test('should return 404 for non-existent note', async ({ request }) => {
            test.skip(!authToken, 'Auth token not available');

            const response = await request.delete(`${config.baseURL}/api/contact-note/999999`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            expect(response.status()).toBe(404);
            const data = await response.json();
            expect(data).toHaveProperty('error');
        });

        test('should return 401 if not authenticated', async ({ request }) => {
            const response = await request.delete(`${config.baseURL}/api/contact-note/123`, {
                headers: {}
            });

            expect(response.status()).toBe(401);
        });
    });

    // Test to create a new note for future use (if needed)
    test('should create additional test note for future tests', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const newNote = {
            userId: affiliateId,
            affiliateId: affiliateId,
            note: 'Additional test contact note'
        };

        const response = await request.post(`${config.baseURL}/api/contact-note`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            data: newNote
        });

        expect(response.status()).toBe(201);
        const data = await response.json();

        // Clean up this note
        await request.delete(`${config.baseURL}/api/contact-note/${data.id}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
    });
});