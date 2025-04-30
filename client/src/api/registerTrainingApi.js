import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL

export const fetchAffiliates = async (query) => {
    try {
        const response = await axios.get(`${API_BASE}/api/search-affiliates`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching affiliates:', error);
        return [];
    }
};

export const fetchAffiliateInfo = async (affiliateId) => {
    try {
        const response = await axios.get(`${API_BASE}/api/get-affiliate-by-id`, {
            params: { id: affiliateId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching affiliate info:', error);
        return null;
    }
};

export const addHomeAffiliate = async (affiliateId) => {
    try {
        return await axios.post(`${API_BASE}/api/add-home-affiliate`,
            { affiliateId },
            {
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error('Error adding home affiliate:', error);
        throw error;
    }
};

export const removeHomeAffiliate = async (affiliateId) => {
    try {
        return await axios.post(`${API_BASE}/api/remove-home-affiliate`,
            { affiliateId },
            {
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.error('Error removing home affiliate:', error);
        throw error;
    }
};

export const fetchPlans = async (affiliateId) => {
    try {
        const response = await axios.get(`${API_BASE}/api/plans`, {
            params: { ownerId: affiliateId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
    }
};