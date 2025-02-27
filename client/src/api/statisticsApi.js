// src/api/statisticsApi.js
export async function getStatistics(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/statistics?${query.toString()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }
        return await response.json();
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        return null;
    }
}

export async function getAllStatistics () {
    try {

        const response = await fetch('/api/statistics/all', {
            method: 'GET',

        });
        if (!response.ok) {
            throw new Error('Failed to fetch statistics');
        }
        return await response.json();
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        return null;
    }
}
