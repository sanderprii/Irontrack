// src/api/analyticsApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const analyticsApi = {
    // Dashboard Overview
    getDashboardOverview: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await axios.get(`${API_URL}/analytics/dashboard/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getTopMembersByCheckIns: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await axios.get(`${API_URL}/analytics/top-members-checkins/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Activity & Behavior
    getActivityMetrics: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/activity/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getVisitHeatmap: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/heatmap/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getAtRiskMembers: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/at-risk/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getVisitFrequency: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/visit-frequency/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Financial Analysis
    getContractOverview: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await axios.get(`${API_URL}/analytics/contracts-overview/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getArpu: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await axios.get(`${API_URL}/analytics/arpu/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getPaymentHealth: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/payment-health/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getSuspendedContracts: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await axios.get(`${API_URL}/analytics/suspended-contracts/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getContractExpirations: async (token, affiliateId, period = 'NEXT_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/expiring-contracts/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Training & Service Analysis
    getClassCapacity: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/class-capacity/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getTrainingTypePopularity: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/training-types/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getTrainerComparison: async (token, affiliateId, period = 'LAST_90_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/trainer-comparison/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client Retention & Engagement
    getChurnAnalysis: async (token, affiliateId, period = 'LAST_6_MONTHS') => {
        const response = await axios.get(`${API_URL}/analytics/churn/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getClientLifecycle: async (token, affiliateId, period = 'ALL_TIME') => {
        const response = await axios.get(`${API_URL}/analytics/client-lifecycle/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getClientAchievements: async (token, affiliateId, period = 'ALL_TIME') => {
        const response = await axios.get(`${API_URL}/analytics/client-achievements/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Growth Potential
    getDormantClients: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/dormant-clients/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getGrowthOpportunities: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/growth-opportunities/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Early Warning System
    getEarlyWarnings: async (token, affiliateId, period = 'LAST_30_DAYS') => {
        const response = await axios.get(`${API_URL}/analytics/early-warnings/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getNewMembers: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await axios.get(`${API_URL}/analytics/new-members/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    getContractAndPlanMetrics: async (token, affiliateId, period = 'THIS_MONTH') => {
        const response = await axios.get(`${API_URL}/analytics/contract-plan-metrics/${affiliateId}`, {
            params: { period },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
};