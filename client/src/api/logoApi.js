// src/api/logoApi.js

const API_URL = process.env.REACT_APP_API_URL

export async function uploadAffiliateLogo(file, affiliateId) {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('affiliateId', affiliateId);

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/upload-logo`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,

        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload logo');
    }

    return response.json();
}

export async function uploadProfilePicture(file, userId) {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('userId', userId);

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/upload-profile-picture`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload profile picture');
    }

    return response.json();
}
