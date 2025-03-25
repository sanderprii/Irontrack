const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

let authToken = null; // Will store the JWT token after login

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

test.describe('Authentication Controller', () => {

    test('POST /api/auth/login - should login with test user', async ({ request }) => {
        try {
            const loginData = {
                email: 'c@c.c',
                password: 'cccccc'
            };

            const loginResponse = await request.post('http://localhost:5000/api/auth/login', {
                data: loginData
            });

            // Check response status
            expect(loginResponse.ok()).toBeTruthy();

            // Parse response body
            const responseBody = await loginResponse.json();

            // Verify response structure and store token
            expect(responseBody).toHaveProperty('token');
            expect(responseBody).toHaveProperty('user');
            expect(responseBody.user).toHaveProperty('id');
            expect(responseBody.user).toHaveProperty('email', 'c@c.c');

            // Store the token for subsequent tests
            authToken = responseBody.token;

        } catch (error) {
            // Send email on test failure with detailed information
            await sendTestFailureReport(
                'Login Test Failure',
                error,
                {
                    endpoint: '/api/auth/login',
                    testUser: 'c@c.c',
                    timestamp: new Date().toISOString()
                }
            );
            // Re-throw to fail the test
            throw error;
        }
    });

    test('GET /api/auth/me - should retrieve user profile with token', async ({ request }) => {
        try {
            // Skip if login test failed
            test.skip(!authToken, 'Auth token not available');

            const meResponse = await request.get('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Check response status
            expect(meResponse.ok()).toBeTruthy();

            // Parse response body
            const userProfile = await meResponse.json();

            // Verify user profile data
            expect(userProfile).toHaveProperty('id');
            expect(userProfile).toHaveProperty('email', 'c@c.c');
            expect(userProfile).toHaveProperty('emailConfirmed', true);

        } catch (error) {
            // Send email on test failure
            await sendTestFailureReport(
                'Get User Profile Test Failure',
                error,
                {
                    endpoint: '/api/auth/me',
                    authTokenPresent: !!authToken,
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    test('POST /api/auth/request-password-reset - should accept password reset request', async ({ request }) => {
        try {
            const resetData = {
                email: 'c@c.c'
            };

            const resetResponse = await request.post('http://localhost:5000/api/auth/request-password-reset', {
                data: resetData
            });

            // Check response status
            expect(resetResponse.ok()).toBeTruthy();

            // Parse response body
            const responseBody = await resetResponse.json();

            // Verify response contains expected message
            expect(responseBody).toHaveProperty('message');
            // The message is intentionally vague for security reasons
            expect(responseBody.message).toContain('receive a password reset link');

        } catch (error) {
            // Send email on test failure
            await sendTestFailureReport(
                'Password Reset Request Test Failure',
                error,
                {
                    endpoint: '/api/auth/request-password-reset',
                    testUser: 'c@c.c',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test invalid login credentials
    test('POST /api/auth/login - should reject invalid credentials', async ({ request }) => {
        try {
            const invalidLoginData = {
                email: 'c@c.c',
                password: 'wrong-password'
            };

            const loginResponse = await request.post('http://localhost:5000/api/auth/login', {
                data: invalidLoginData
            });

            // Check response status - should be 401 Unauthorized
            expect(loginResponse.status()).toBe(401);

            // Parse response body
            const responseBody = await loginResponse.json();

            // Verify error message
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('Invalid email or password');

        } catch (error) {
            // Send email on test failure
            await sendTestFailureReport(
                'Invalid Login Test Failure',
                error,
                {
                    endpoint: '/api/auth/login',
                    testCase: 'invalid credentials',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });

    // Test unauthorized access to protected route
    test('GET /api/auth/me - should reject requests without valid token', async ({ request }) => {
        try {
            const meResponse = await request.get('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': 'Bearer invalid-token'
                }
            });

            // Check response status - should be 401 Unauthorized
            expect(meResponse.status()).toBe(401);

            // Parse response body
            const responseBody = await meResponse.json();

            // Verify error message
            expect(responseBody).toHaveProperty('error');

        } catch (error) {
            // Send email on test failure
            await sendTestFailureReport(
                'Unauthorized Access Test Failure',
                error,
                {
                    endpoint: '/api/auth/me',
                    testCase: 'invalid token',
                    timestamp: new Date().toISOString()
                }
            );
            throw error;
        }
    });
});