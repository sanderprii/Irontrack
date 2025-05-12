const { test, expect } = require('@playwright/test');
const config = require('../config');

// Configure tests to run serially
test.describe.configure({ mode: 'serial' });

let authToken;
let affiliateId;

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
        return { token: responseBody.token, user: responseBody.user };
    } catch (error) {
        console.error('Login helper error:', error);
        return null;
    }
}

test.describe('Analytics Controller Tests', () => {

    test.beforeAll(async ({ request }) => {
        try {
            // Authenticate with test user
            const loginResult = await loginUser(request, 'd@d.d', 'dddddd');

            if (loginResult && loginResult.token) {
                authToken = loginResult.token;

                // Get the actual affiliate ID for this user
                const affiliateResponse = await request.get(`${config.baseURL}/api/my-affiliate/my-affiliate`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (affiliateResponse.ok()) {
                    const affiliateData = await affiliateResponse.json();
                    if (affiliateData.affiliate && affiliateData.affiliate.id) {
                        affiliateId = affiliateData.affiliate.id;
                        console.log('Successfully logged in and found affiliate ID:', affiliateId);
                    } else {
                        console.error('User does not have an affiliate');
                    }
                }
            } else {
                console.error('Failed to login with test user d@d.d');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    // Dashboard Overview
    test('should return dashboard overview data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/dashboard/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('totalMembers');
        expect(data).toHaveProperty('visitsInPeriod');
        expect(data).toHaveProperty('revenueInPeriod');
        expect(data).toHaveProperty('activePlans');
    });

    test('should return 401 if not authenticated for dashboard', async ({ request }) => {
        test.skip(!affiliateId, 'Affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/dashboard/${affiliateId}`);
        expect(response.status()).toBe(401);
    });

    // Top Members
    test('should return top members by check-ins', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/top-members-checkins/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBeTruthy();

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('userId');
            expect(data.data[0]).toHaveProperty('fullName');
            expect(data.data[0]).toHaveProperty('check_in_count');
        }
    });

    test('should return filtered top members', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/top-members-checkins/${affiliateId}?period=THIS_MONTH`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBeTruthy();
    });

    // Activity Metrics
    test('should return activity metrics', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/activity/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('date');
            expect(data.data[0]).toHaveProperty('count');
        }
    });

    test('should return filtered activity metrics', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/activity/${affiliateId}?period=LAST_30_DAYS`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);
    });

    // Visit Heatmap
    test('should return visit heatmap data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/heatmap/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('dayOfWeek');
            expect(data.data[0]).toHaveProperty('hour');
            expect(data.data[0]).toHaveProperty('count');
        }
    });

    test('should return filtered heatmap data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/heatmap/${affiliateId}?period=LAST_90_DAYS`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);
    });

    // At Risk Members
    test('should return at-risk members', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/at-risk/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const responseData = await response.json();
        expect(responseData).toHaveProperty('data');
        expect(responseData).toHaveProperty('periodLabel');
        expect(responseData).toHaveProperty('comparisonInfo');
        expect(Array.isArray(responseData.data)).toBe(true);

        if (responseData.data.length > 0) {
            expect(responseData.data[0]).toHaveProperty('userId');
            expect(responseData.data[0]).toHaveProperty('fullName');
            expect(responseData.data[0]).toHaveProperty('email');
            expect(responseData.data[0]).toHaveProperty('recent_visits');
            expect(responseData.data[0]).toHaveProperty('previous_visits');
        }
    });

    // Visit Frequency
    test('should return visit frequency data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/visit-frequency/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const responseData = await response.json();
        expect(responseData).toHaveProperty('data');
        expect(responseData).toHaveProperty('periodLabel');
        expect(Array.isArray(responseData.data)).toBe(true);

        if (responseData.data.length > 0) {
            expect(responseData.data[0]).toHaveProperty('frequency_range');
            expect(responseData.data[0]).toHaveProperty('member_count');
        }
    });

    // Contract Overview
    test('should return contract overview data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/contracts-overview/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('contractTypes');
        expect(data).toHaveProperty('avgContractValue');
        expect(data).toHaveProperty('newContractsCount');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.contractTypes)).toBe(true);
    });

    // ARPU
    test('should return ARPU data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/arpu/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('month');
            expect(data.data[0]).toHaveProperty('arpu');
        }
    });

    // Payment Health
    test('should return payment health data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/payment-health/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('paymentHealth');
        expect(data).toHaveProperty('failedPayments');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.paymentHealth)).toBe(true);
        expect(Array.isArray(data.failedPayments)).toBe(true);
    });

    // Suspended Contracts
    test('should return suspended contracts', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/suspended-contracts/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('paymentHolidays');
        expect(data).toHaveProperty('holidayReasons');
        expect(data).toHaveProperty('monthlyHolidays');
        expect(data).toHaveProperty('totalLostRevenue');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.paymentHolidays)).toBe(true);
        expect(Array.isArray(data.monthlyHolidays)).toBe(true);
    });

    // Contract Expirations
    test('should return contract expirations', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/expiring-contracts/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('expiringContracts');
        expect(data).toHaveProperty('monthlyExpirations');
        expect(data).toHaveProperty('totalExpirations');
        expect(data).toHaveProperty('atRiskRevenue');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.expiringContracts)).toBe(true);
        expect(Array.isArray(data.monthlyExpirations)).toBe(true);
    });

    // Class Capacity
    test('should return class capacity data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/class-capacity/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('classCapacity');
        expect(data).toHaveProperty('byTrainingType');
        expect(data).toHaveProperty('averageUtilization');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.classCapacity)).toBe(true);

        if (data.classCapacity.length > 0) {
            expect(data.classCapacity[0]).toHaveProperty('id');
            expect(data.classCapacity[0]).toHaveProperty('name');
            expect(data.classCapacity[0]).toHaveProperty('capacity');
            expect(data.classCapacity[0]).toHaveProperty('attendees');
            expect(data.classCapacity[0]).toHaveProperty('utilization');
        }
    });

    // Training Type Popularity
    test('should return training type popularity data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/training-types/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('popularity');
        expect(data).toHaveProperty('timePreference');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.popularity)).toBe(true);
        expect(Array.isArray(data.timePreference)).toBe(true);

        if (data.popularity.length > 0) {
            expect(data.popularity[0]).toHaveProperty('trainingType');
            expect(data.popularity[0]).toHaveProperty('attendees');
        }

        if (data.timePreference.length > 0) {
            expect(data.timePreference[0]).toHaveProperty('time_of_day');
            expect(data.timePreference[0]).toHaveProperty('attendees');
        }
    });

    // Trainer Comparison
    test('should return trainer comparison data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/trainer-comparison/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('trainerId');
            expect(data.data[0]).toHaveProperty('trainerName');
            expect(data.data[0]).toHaveProperty('classesCount');
            expect(data.data[0]).toHaveProperty('totalAttendance');
            expect(data.data[0]).toHaveProperty('averageAttendance');
        }
    });

    // Churn Analysis
    test('should return churn analysis data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/churn/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('churnedMembers');
        expect(data).toHaveProperty('monthlyChurn');
        expect(data).toHaveProperty('currentChurnRate');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.churnedMembers)).toBe(true);
        expect(Array.isArray(data.monthlyChurn)).toBe(true);
    });

    // Client Lifecycle
    test('should return client lifecycle data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/client-lifecycle/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('membershipDuration');
        expect(data).toHaveProperty('engagementLevels');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.membershipDuration)).toBe(true);
        expect(Array.isArray(data.engagementLevels)).toBe(true);

        if (data.membershipDuration.length > 0) {
            expect(data.membershipDuration[0]).toHaveProperty('duration');
            expect(data.membershipDuration[0]).toHaveProperty('members');
        }

        if (data.engagementLevels.length > 0) {
            expect(data.engagementLevels[0]).toHaveProperty('engagement_level');
            expect(data.engagementLevels[0]).toHaveProperty('members');
        }
    });

    // Client Achievements
    test('should return client achievements data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/client-achievements/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('topAchievers');
        expect(data).toHaveProperty('recordsByType');
        expect(data).toHaveProperty('progressTrends');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.topAchievers)).toBe(true);
        expect(Array.isArray(data.recordsByType)).toBe(true);
        expect(Array.isArray(data.progressTrends)).toBe(true);

        if (data.topAchievers.length > 0) {
            expect(data.topAchievers[0]).toHaveProperty('userId');
            expect(data.topAchievers[0]).toHaveProperty('fullName');
            expect(data.topAchievers[0]).toHaveProperty('records_count');
        }
    });

    // Dormant Clients
    test('should return dormant clients', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/dormant-clients/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('dormantClients');
        expect(data).toHaveProperty('valueAtRisk');
        expect(data).toHaveProperty('reactivationPotential');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.dormantClients)).toBe(true);

        if (data.dormantClients.length > 0) {
            expect(data.dormantClients[0]).toHaveProperty('userId');
            expect(data.dormantClients[0]).toHaveProperty('fullName');
            expect(data.dormantClients[0]).toHaveProperty('email');
            expect(data.dormantClients[0]).toHaveProperty('visits_in_last_30_days');
        }
    });

    // Growth Opportunities
    test('should return growth opportunities', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/growth-opportunities/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('frequentAttenders');
        expect(data).toHaveProperty('expiringActivePlans');
        expect(data).toHaveProperty('upgradePotential');
        expect(data).toHaveProperty('renewalPotential');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.frequentAttenders)).toBe(true);
        expect(Array.isArray(data.expiringActivePlans)).toBe(true);
    });

    // Early Warnings
    test('should return early warnings', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/early-warnings/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('warnings');
        expect(data).toHaveProperty('summary');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.warnings)).toBe(true);
        expect(data.summary).toHaveProperty('high');
        expect(data.summary).toHaveProperty('medium');
        expect(data.summary).toHaveProperty('low');

        if (data.warnings.length > 0) {
            expect(data.warnings[0]).toHaveProperty('type');
            expect(data.warnings[0]).toHaveProperty('severity');
        }
    });

    // New Members
    test('should return new members data', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/new-members/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);

        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('userId');
            expect(data.data[0]).toHaveProperty('fullName');
            expect(data.data[0]).toHaveProperty('email');
            expect(data.data[0]).toHaveProperty('createdAt');
            expect(data.data[0]).toHaveProperty('hasActivePlan');
        }
    });

    // Contract and Plan Metrics
    test('should return contract and plan metrics', async ({ request }) => {
        test.skip(!authToken || !affiliateId, 'Auth token or affiliate ID not available');

        const response = await request.get(`${config.baseURL}/api/analytics/contract-plan-metrics/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty('contractClientsCount');
        expect(data).toHaveProperty('nonContractClientsCount');
        expect(data).toHaveProperty('totalPurchasedPlansCount');
        expect(data).toHaveProperty('plansPurchasedByName');
        expect(data).toHaveProperty('planRevenue');
        expect(data).toHaveProperty('periodLabel');

        expect(Array.isArray(data.plansPurchasedByName)).toBe(true);
    });
});