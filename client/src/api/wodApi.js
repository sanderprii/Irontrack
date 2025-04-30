import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const getTodayWOD = async (affiliateId, date) => {
    try {
        const token = localStorage.getItem("token");
        const date1 = new Date(date).toISOString(); // ✅ Vormindatud ISO kuupäev

        const response = await axios.get(`${API_URL}/get-today-wod`, {
            params: {
                date: date1,
                affiliateId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching today's WOD:", error);
    }
};

export const getWeekWODs = async (affiliateId, startDate1) => {
    try {
        const token = localStorage.getItem("token");
        const startDate = new Date(startDate1);
        startDate.setHours(2, 0, 0, 0);

        const response = await axios.get(`${API_URL}/get-week-wods`, {
            params: {
                startDate: startDate.toISOString(),
                affiliateId
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching week's WODs:", error);
    }
};

export const saveTodayWOD = async (affiliateId, wodData) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(`${API_URL}/today-wod`,
            wodData, // ✅ Edasta ainult ühe päeva WOD
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error saving today's WOD:", error);
    }
};

export const applyWODToTrainings = async (affiliateId, date) => {
    try {
        const token = localStorage.getItem("token");
        const formattedDate = new Date(date);
        const date1 = formattedDate.toISOString(); // ✅ Vormindatud ISO kuupäev

        const requestBody = { affiliateId, date: date1 }; // ✅ Parandatud JSON body

        const response = await axios.post(`${API_URL}/apply-wod`,
            requestBody, // ✅ Axios teisendab andmed automaatselt JSON-iks
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error applying WOD to trainings:", error);
    }
};

export const searchDefaultWODs = async (query) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/search-default-wods`, {
            params: {
                q: query
            },
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error searching default WODs:", error);
    }
};