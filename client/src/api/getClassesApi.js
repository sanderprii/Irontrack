import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchAffiliates = async (query) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/search-affiliates`, {
            params: { q: query },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching affiliates:", error);
        return [];
    }
};

export const fetchAffiliateInfo = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/get-affiliate-by-id`, {
            params: { id: affiliateId },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching affiliate info:", error);
        return null;
    }
};

export const addHomeAffiliate = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/add-home-affiliate`,
            { affiliateId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error adding home affiliate:", error);
        throw error;
    }
};

export const removeHomeAffiliate = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/remove-home-affiliate`,
            { affiliateId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error removing home affiliate:", error);
        throw error;
    }
};

export const fetchPlans = async (ownerId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/affiliate-plans`, {
            params: { ownerId },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching plans:", error);
        throw error;
    }
};

export const checkHomeAffiliate = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/user-home-affiliate`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.homeAffiliate || null;
    } catch (error) {
        console.error("Error checking home affiliate:", error);
        return null;
    }
};