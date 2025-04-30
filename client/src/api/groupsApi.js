// src/api/groupsApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getGroups = async (affiliate) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/messagegroups`, {
            params: {
                affiliateId: affiliate
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('getGroups error:', error);
        throw error;
    }
};

export const createGroup = async (groupData, affiliate) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/messagegroups`,
            groupData,
            {
                params: {
                    affiliateId: affiliate
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('createGroup error:', error);
        throw error;
    }
};

export const updateGroup = async (groupData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/messagegroups/${groupData.id}`,
            groupData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('updateGroup error:', error);
        throw error;
    }
};