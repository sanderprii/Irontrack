import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL

export const getUserCredits = async (affiliateId, userId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    try {
        const response = await axios.get(`${BASE_URL}/credit`, {
            params: {
                affiliateId,
                userId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "role": `${role}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user credit:", error);
    }
}

export const addCredit = async (userId, affiliateId, amount, description) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.post(`${BASE_URL}/credit`,
            {
                userId,
                amount,
                affiliateId,
                description
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.status >= 200 && response.status < 300;
    } catch (error) {
        console.error("Error adding credit:", error);
    }
}

export const getCreditHistory = async (affiliateId, userId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    try {
        const response = await axios.get(`${BASE_URL}/credit/history`, {
            params: {
                affiliateId,
                userId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "role": `${role}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching credit history:", error);
    }
}

export const getUserTransactions = async (affiliateId, userId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${BASE_URL}/credit/transactions`, {
            params: {
                affiliateId,
                userId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user transactions:", error);
    }
}

export const getAffiliateTransactions = async (affiliateId) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`${BASE_URL}/credit/affiliate-transactions`, {
            params: {
                affiliateId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching affiliate transactions:", error);
    }
}