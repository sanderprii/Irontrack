const { test, expect } = require('@playwright/test');
const { sendTestFailureReport } = require('../helpers/emailHelper');

// Configure test to use the correct server URL
test.use({ baseURL: 'http://localhost:5000' });

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
        
        console.log('Login response status:', loginResponse.status());
        console.log('Login response headers:', loginResponse.headers());
        const loginData = await loginResponse.json();
        console.log('Login response data:', loginData);
        
        expect(loginResponse.ok()).toBeTruthy();
        authToken = loginData.token;
        affiliateId = loginData.user.id; // Use the user's ID as affiliate ID since they are an affiliate owner
    } catch (error) {
        await sendTestFailureReport(
            'Analytics Test Login Failure',
            error,
            { testUser: 'd@d.d' }
        );
        throw error;
    }
});

test('should return dashboard overview data', async ({ request }) => {
    try {
        console.log('Using auth token:', authToken);
        console.log('Using affiliate ID:', affiliateId);
        
        const response = await request.get(`/api/analytics/dashboard/${affiliateId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        console.log('Dashboard response status:', response.status());
        console.log('Dashboard response headers:', response.headers());
        const responseText = await response.text();
        console.log('Dashboard response body:', responseText);
        
        expect(response.ok()).toBeTruthy();
        
        const data = JSON.parse(responseText);
        expect(data).toHaveProperty('totalMembers');
        expect(data).toHaveProperty('visitsInPeriod');
        expect(data).toHaveProperty('revenueInPeriod');
        expect(data).toHaveProperty('activePlans');
    } catch (error) {
        await sendTestFailureReport(
            'Dashboard Overview Test Failure',
            error,
            {
                endpoint: '/api/analytics/dashboard',
                affiliateId,
                authTokenPresent: !!authToken
            }
        );
        throw error;
    }
});

test('should return 401 if not authenticated for dashboard', async ({ request }) => {
    try {
        const response = await request.get(`/api/analytics/dashboard/${affiliateId}`);
        expect(response.status()).toBe(401);
    } catch (error) {
        await sendTestFailureReport(
            'Unauthenticated Dashboard Test Failure',
            error,
            {
                endpoint: '/api/analytics/dashboard',
                affiliateId
            }
        );
        throw error;
    }
});

test('should return top members by check-ins', async ({ request }) => {
    try {
        const response = await request.get(`/api/analytics/top-members-checkins/${affiliateId}`, {
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
    } catch (error) {
        await sendTestFailureReport(
            'Top Members Test Failure',
            error,
            {
                endpoint: '/api/analytics/top-members-checkins',
                affiliateId,
                authTokenPresent: !!authToken
            }
        );
        throw error;
    }
});

test('should return filtered top members', async ({ request }) => {
    try {
        const response = await request.get(`/api/analytics/top-members-checkins/${affiliateId}?period=THIS_MONTH`, {
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
    } catch (error) {
        await sendTestFailureReport(
            'Filtered Top Members Test Failure',
            error,
            {
                endpoint: '/api/analytics/top-members-checkins',
                affiliateId,
                period: 'THIS_MONTH',
                authTokenPresent: !!authToken
            }
        );
        throw error;
    }
});

test('should return activity metrics', async ({ request }) => {
    try {
        const response = await request.get(`/api/analytics/activity/${affiliateId}`, {
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
    } catch (error) {
        await sendTestFailureReport(
            'Activity Metrics Test Failure',
            error,
            {
                endpoint: '/api/analytics/activity',
                affiliateId,
                authTokenPresent: !!authToken
            }
        );
        throw error;
    }
});

test('should return filtered activity metrics', async ({ request }) => {
    try {
        const response = await request.get(`/api/analytics/activity/${affiliateId}?period=LAST_30_DAYS`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        expect(response.ok()).toBeTruthy();
        
        const data = await response.json();
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('periodLabel');
        expect(Array.isArray(data.data)).toBe(true);
        
        if (data.data.length > 0) {
            expect(data.data[0]).toHaveProperty('date');
            expect(data.data[0]).toHaveProperty('count');
        }
    } catch (error) {
        await sendTestFailureReport(
            'Filtered Activity Metrics Test Failure',
            error,
            {
                endpoint: '/api/analytics/activity',
                affiliateId,
                period: 'LAST_30_DAYS',
                authTokenPresent: !!authToken
            }
        );
        throw error;
    }
});

test.describe('getVisitHeatmap', () => {
    test('should return visit heatmap data', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/heatmap/${affiliateId}`, {
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
        } catch (error) {
            await sendTestFailureReport(
                'Visit Heatmap Test Failure',
                error,
                {
                    endpoint: '/api/analytics/heatmap',
                    affiliateId,
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });

    test('should return filtered heatmap data', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/heatmap/${affiliateId}?period=LAST_90_DAYS`, {
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
        } catch (error) {
            await sendTestFailureReport(
                'Filtered Heatmap Test Failure',
                error,
                {
                    endpoint: '/api/analytics/heatmap',
                    affiliateId,
                    period: 'LAST_90_DAYS',
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });
});

test.describe('getAtRiskMembers', () => {
    test('should return at-risk members', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/at-risk/${affiliateId}`, {
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
                expect(responseData.data[0]).toHaveProperty('last_visit');
            }
        } catch (error) {
            await sendTestFailureReport(
                'At Risk Members Test Failure',
                error,
                {
                    endpoint: '/api/analytics/at-risk',
                    affiliateId,
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });
});

test.describe('getVisitFrequency', () => {
    test('should return visit frequency data', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/visit-frequency/${affiliateId}`, {
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
        } catch (error) {
            await sendTestFailureReport(
                'Visit Frequency Test Failure',
                error,
                {
                    endpoint: '/api/analytics/visit-frequency',
                    affiliateId,
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });
});

test.describe('getContractOverview', () => {
    test('should return contract overview data', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/contracts-overview/${affiliateId}`, {
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
        } catch (error) {
            await sendTestFailureReport(
                'Contract Overview Test Failure',
                error,
                {
                    endpoint: '/api/analytics/contracts-overview',
                    affiliateId,
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });
});

test.describe('getArpu', () => {
    test('should return ARPU data', async ({ request }) => {
        try {
            const response = await request.get(`/api/analytics/arpu/${affiliateId}`, {
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
        } catch (error) {
            await sendTestFailureReport(
                'ARPU Test Failure',
                error,
                {
                    endpoint: '/api/analytics/arpu',
                    affiliateId,
                    authTokenPresent: !!authToken
                }
            );
            throw error;
        }
    });
});

test.describe('getPaymentHealth', () => {
    test('should return payment health data', async ({ request }) => {
        const response = await request.get(`/api/analytics/payment-health/${affiliateId}`, {
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
});

test.describe('getSuspendedContracts', () => {
    test('should return suspended contracts', async ({ request }) => {
        const response = await request.get(`/api/analytics/suspended-contracts/${affiliateId}`, {
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
});

test.describe('getContractExpirations', () => {
    test('should return contract expirations', async ({ request }) => {
        const response = await request.get(`/api/analytics/expiring-contracts/${affiliateId}`, {
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
});

test.describe('getClassCapacity', () => {
    test('should return class capacity data', async ({ request }) => {
        const response = await request.get(`/api/analytics/class-capacity/${affiliateId}`, {
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
});

test.describe('getTrainingTypePopularity', () => {
    test('should return training type popularity data', async ({ request }) => {
        const response = await request.get(`/api/analytics/training-types/${affiliateId}`, {
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
});

test.describe('getTrainerComparison', () => {
    test('should return trainer comparison data', async ({ request }) => {
        const response = await request.get(`/api/analytics/trainer-comparison/${affiliateId}`, {
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
});

test.describe('getChurnAnalysis', () => {
    test('should return churn analysis data', async ({ request }) => {
        const response = await request.get(`/api/analytics/churn/${affiliateId}`, {
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
});

test.describe('getClientLifecycle', () => {
    test('should return client lifecycle data', async ({ request }) => {
        const response = await request.get(`/api/analytics/client-lifecycle/${affiliateId}`, {
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
});

test.describe('getClientAchievements', () => {
    test('should return client achievements data', async ({ request }) => {
        const response = await request.get(`/api/analytics/client-achievements/${affiliateId}`, {
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
});

test.describe('getDormantClients', () => {
    test('should return dormant clients', async ({ request }) => {
        const response = await request.get(`/api/analytics/dormant-clients/${affiliateId}`, {
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
});

test.describe('getGrowthOpportunities', () => {
    test('should return growth opportunities', async ({ request }) => {
        const response = await request.get(`/api/analytics/growth-opportunities/${affiliateId}`, {
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
});

test.describe('getEarlyWarnings', () => {
    test('should return early warnings', async ({ request }) => {
        const response = await request.get(`/api/analytics/early-warnings/${affiliateId}`, {
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
});