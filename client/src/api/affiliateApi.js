import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const getAffiliate = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/my-affiliate`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching affiliate data:", error);
        return null;
    }
};

export const getAffiliateBySubdomain = async (subdomain) => {
    try {
        const response = await axios.get(`${API_URL}/affiliate-by-subdomain`, {
            params: {
                subdomain: subdomain
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching affiliate data:", error);
        return null;
    }
};

// Affiliate andmete uuendamine
export const updateAffiliate = async (affiliate) => {
    try {
        const token = localStorage.getItem("token");

        await axios.put(`${API_URL}/affiliate`, affiliate, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return true;
    } catch (error) {
        console.error("Error updating affiliate:", error);
        return false;
    }
};

// Treenerite otsing (kasutaja sisendi põhjal)
export const searchTrainers = async (query) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/search-users`, {
            params: {
                q: query
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error searching trainers:", error);
        return [];
    }
};

export const getAffiliateById = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/affiliateById`, {
            params: {
                id: id
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching affiliate data:", error);
        return null;
    }
};

// Create new affiliate terms
export const createAffiliateTerms = async (termsData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/affiliate-terms`, termsData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error creating affiliate terms:", error);
        return null;
    }
};

// Update existing affiliate terms
export const updateAffiliateTerms = async (termsData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.put(`${API_URL}/affiliate-terms`, termsData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error updating affiliate terms:", error);
        return null;
    }
};

// Get affiliate terms by affiliate ID
export const getAffiliateTerms = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/affiliate-terms`, {
            params: {
                id: affiliateId
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching affiliate terms:", error);
        return null;
    }
};

export const acceptAffiliateTerms = async (data) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/affiliate-terms/accept`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error accepting affiliate terms:", error);
        return null;
    }

}

export const isUserAcceptedAffiliateTerms = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_URL}/affiliate-terms/accepted?affiliateId=${affiliateId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        return response.data.accepted; // Return the boolean directly
    } catch (error) {
        console.error("❌ Error checking if user accepted affiliate terms:", error);
        return false; // Return false on error instead of null for better handling
    }
}