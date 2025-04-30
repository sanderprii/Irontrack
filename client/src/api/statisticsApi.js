// src/api/statisticsApi.js
import axios from 'axios';

export async function getStatistics(params = {}) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/statistics', {
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        return null;
    }
}

export async function getAllStatistics() {
    try {
        const response = await axios.get('/api/statistics/all');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        return null;
    }
}