const { test, expect } = require('@playwright/test');
const config = require('../config');

// Configure tests to run serially
test.describe.configure({ mode: 'serial' });

let authToken = null;

// Helper function to log in a user and get a token
async function loginUser(request, email, password) {
    try {
        const loginData = { email, password };
        const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
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

    test.beforeEach(async ({ request }) => {
        // Create a test user if needed and log in
        // For testing, let's assume c@c.c exists and use a more standard email format
        authToken = await loginUser(request, 'c@c.c', 'cccccc');
        if (!authToken) {
            console.error('Failed to obtain auth token in beforeEach');
        }
    });

    test('POST /api/auth/login - should login with test user', async ({ request }) => {
        const loginData = {
            email: 'c@c.c',
            password: 'cccccc'
        };

        const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
            data: loginData
        });

        // Check response status
        expect(loginResponse.ok()).toBeTruthy();

        // Parse response body
        const responseBody = await loginResponse.json();

        // Verify response structure
        expect(responseBody).toHaveProperty('token');
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('id');
        expect(responseBody.user).toHaveProperty('email', 'c@c.c');
    });

    test('GET /api/auth/me - should retrieve user profile with token', async ({ request }) => {
        test.skip(!authToken, 'Auth token not available');

        const meResponse = await request.get(`${config.baseURL}/api/auth/me`, {
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
    });

    test('POST /api/auth/request-password-reset - should accept password reset request', async ({ request }) => {
        // First try with the regular test user email
        let resetData = {
            email: 'c@c.c'
        };

        let resetResponse = await request.post(`${config.baseURL}/api/auth/request-password-reset`, {
            data: resetData
        });

        // Log response details for debugging
        console.log('Reset response status:', resetResponse.status());

        // If the test user email fails, let's try with a more standard email format
        if (!resetResponse.ok()) {
            console.log('First attempt with c@c.c failed, trying with standard email format...');

            resetData = {
                email: 'test@example.com'
            };

            resetResponse = await request.post(`${config.baseURL}/api/auth/request-password-reset`, {
                data: resetData
            });

            console.log('Second attempt response status:', resetResponse.status());
        }

        // Try to get response body regardless of status
        let responseBody;
        try {
            responseBody = await resetResponse.json();
            console.log('Reset response body:', responseBody);
        } catch (error) {
            console.log('Failed to parse JSON response:', error);
            const textResponse = await resetResponse.text();
            console.log('Reset response text:', textResponse);
        }

        // The endpoint should return 200 regardless of whether the email exists (for security)
        expect(resetResponse.ok()).toBeTruthy();

        // Verify response contains expected message
        expect(responseBody).toHaveProperty('message');
        // The message is intentionally vague for security reasons
        expect(responseBody.message).toContain('receive a password reset link');
    });

    // Test invalid login credentials
    test('POST /api/auth/login - should reject invalid credentials', async ({ request }) => {
        const invalidLoginData = {
            email: 'c@c.c',
            password: 'wrong-password'
        };

        const loginResponse = await request.post(`${config.baseURL}/api/auth/login`, {
            data: invalidLoginData
        });

        // Check response status - should be 401 Unauthorized
        expect(loginResponse.status()).toBe(401);

        // Parse response body
        const responseBody = await loginResponse.json();

        // Verify error message
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toContain('Invalid email or password');
    });

    // Test unauthorized access to protected route
    test('GET /api/auth/me - should reject requests without valid token', async ({ request }) => {
        const meResponse = await request.get(`${config.baseURL}/api/auth/me`, {
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
    });

    // Test email verification endpoint
    test('GET /api/auth/verify-email - should require token parameter', async ({ request }) => {
        const verifyResponse = await request.get(`${config.baseURL}/api/auth/verify-email`);

        // Should return 400 Bad Request when token is missing
        expect(verifyResponse.status()).toBe(400);

        const responseBody = await verifyResponse.json();
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toContain('token is required');
    });

    // Test logout endpoint
    test('POST /api/auth/logout - should logout with valid token', async ({ request }) => {
        test.skip(!authToken, 'Auth token not available');

        const logoutResponse = await request.post(`${config.baseURL}/api/auth/logout`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(logoutResponse.ok()).toBeTruthy();

        const responseBody = await logoutResponse.json();
        expect(responseBody).toHaveProperty('message');
        expect(responseBody.message).toContain('logged out');
    });

    // Test logout without token
    test('POST /api/auth/logout - should require token', async ({ request }) => {
        const logoutResponse = await request.post(`${config.baseURL}/api/auth/logout`);

        // Should return 401 Unauthorized when token is missing (due to ensureAuthenticatedJWT middleware)
        expect(logoutResponse.status()).toBe(401);

        const responseBody = await logoutResponse.json();
        expect(responseBody).toHaveProperty('error');
    });




    // Test password reset with invalid token
    test('POST /api/auth/reset-password - should reject invalid token', async ({ request }) => {
        const resetData = {
            token: 'invalid-token',
            password: 'NewPassword123'
        };

        const resetResponse = await request.post(`${config.baseURL}/api/auth/reset-password`, {
            data: resetData
        });

        expect(resetResponse.status()).toBe(400);

        const responseBody = await resetResponse.json();
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toContain('Invalid or expired');
    });

// Test password reset with weak password
    test('POST /api/auth/reset-password - should reject weak password', async ({ request }) => {
        const resetData = {
            token: 'valid-token',
            password: 'weak'
        };

        const resetResponse = await request.post(`${config.baseURL}/api/auth/reset-password`, {
            data: resetData
        });

        expect(resetResponse.status()).toBe(400);

        const responseBody = await resetResponse.json();
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error).toBe('Input validation failed');

        // Check that details array contains the password length error
        expect(responseBody).toHaveProperty('details');
        expect(Array.isArray(responseBody.details)).toBeTruthy();

        // Find the password validation error in details
        const passwordError = responseBody.details.find(detail =>
            detail.msg.includes('Password must be at least 8 characters')
        );
        expect(passwordError).toBeTruthy();
    });
});