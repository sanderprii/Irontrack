import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

// 📌 ✅ Võta tellimused (`orders`)
export const getOrders = async (affiliateId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
            params: {
                affiliateId
            },
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data; // ⬅️ Massiiv tellimustega
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        return [];
    }
};

// 📌 ✅ Võta finantsandmed (`finance`)
export const getFinanceData = async (params) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`${API_BASE_URL}/finance`, {
            params: params,
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data; // ⬅️ { revenue, activeMembers, expiredMembers, totalMembers }
    } catch (error) {
        console.error("❌ Error fetching finance data:", error);
        return { revenue: 0, activeMembers: 0, expiredMembers: 0, totalMembers: 0 };
    }
};