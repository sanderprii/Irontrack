// src/api/logoApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export async function uploadAffiliateLogo(file, affiliateId) {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('affiliateId', affiliateId);

    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${API_URL}/upload-logo`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Content-Type pole vaja käsitsi määrata, Axios teeb seda automaatselt FormData puhul
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'Failed to upload logo');
        }
        throw error;
    }
}

export async function uploadProfilePicture(file, userId) {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('userId', userId);

    const token = localStorage.getItem('token');

    try {
        const response = await axios.post(`${API_URL}/upload-profile-picture`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                // Content-Type pole vaja käsitsi määrata, Axios teeb seda automaatselt FormData puhul
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || 'Failed to upload profile picture');
        }
        throw error;
    }
}