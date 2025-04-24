// src/api/analyticsApi.js

const API_URL = process.env.REACT_APP_API_URL;

export const analyticsApi = {
    // Dashboard Overview
    getDashboardOverview: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await fetch(`${API_URL}/analytics/dashboard/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getTopMembersByCheckIns: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await fetch(`${API_URL}/analytics/top-members-checkins/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Activity & Behavior
    getActivityMetrics: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/activity/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getVisitHeatmap: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/heatmap/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getAtRiskMembers: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/at-risk/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getVisitFrequency: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/visit-frequency/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Financial Analysis
    getContractOverview: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await fetch(`${API_URL}/analytics/contracts-overview/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getArpu: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await fetch(`${API_URL}/analytics/arpu/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getPaymentHealth: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/payment-health/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getSuspendedContracts: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await fetch(`${API_URL}/analytics/suspended-contracts/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getContractExpirations: async (token, affiliateId, period = 'NEXT_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/expiring-contracts/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Training & Service Analysis
    getClassCapacity: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/class-capacity/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getTrainingTypePopularity: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/training-types/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getTrainerComparison: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/trainer-comparison/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Client Retention & Engagement
    getChurnAnalysis: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await fetch(`${API_URL}/analytics/churn/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getClientLifecycle: async (token, affiliateId, period = 'ALL_TIME') => {
        const response = await fetch(`${API_URL}/analytics/client-lifecycle/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getClientAchievements: async (token, affiliateId, period = 'ALL_TIME') => {
        const response = await fetch(`${API_URL}/analytics/client-achievements/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Growth Potential
    getDormantClients: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/dormant-clients/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getGrowthOpportunities: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/growth-opportunities/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    // Early Warning System
    getEarlyWarnings: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await fetch(`${API_URL}/analytics/early-warnings/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getNewMembers: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await fetch(`${API_URL}/analytics/new-members/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

    getContractAndPlanMetrics: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await fetch(`${API_URL}/analytics/contract-plan-metrics/${affiliateId}?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
    },

};