// src/api/groupsApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getGroups = async (affiliate) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messagegroups?affiliateId=${affiliate}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch groups');
        }
        return await response.json();
    } catch (error) {
        console.error('getGroups error:', error);
        throw error;
    }
};

export const createGroup = async (groupData, affiliate) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messagegroups?affiliateId=${affiliate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(groupData),
        });
        if (!response.ok) {
            throw new Error('Failed to create group');
        }
        return await response.json();
    } catch (error) {
        console.error('createGroup error:', error);
        throw error;
    }
};

export const updateGroup = async (groupData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messagegroups/${groupData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(groupData),
        });
        if (!response.ok) {
            throw new Error('Failed to update group');
        }
        return await response.json();
    } catch (error) {
        console.error('updateGroup error:', error);
        throw error;
    }
};


