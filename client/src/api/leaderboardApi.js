import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const getClassLeaderboard = async (classId) => {
    try {
        const response = await axios.get(`${API_URL}/leaderboard`, {
            params: {
                classId
            },
            headers: {
                "Content-Type": "application/json"
            }
        });
        return Array.isArray(response.data) ? response.data : []; // ✅ Kui response pole massiiv, tagastame tühja massiivi
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        return []; // ✅ Kui viga, tagastame tühja massiivi
    }
};