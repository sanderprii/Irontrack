// src/api/messageApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Funktsioon e-kirja saatmiseks
export const sendMessage = async ({ recipientType, groupName, senderId, recipientId, subject, body, affiliateEmail }) => {
    try {
        // Kui sul on vaja tokenit localStoragest, saad selle siit kätte
        const token = localStorage.getItem('token');

        // Veendume, et need on õiged tüübid
        const payload = {
            recipientType,
            groupName,
            senderId,
            recipientId,
            subject,
            body,
            affiliateEmail,
        };

        console.log("Saadan päringu andmetega:", payload);

        const response = await fetch(`${API_URL}/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Kui sul on vaja autoriseeringut, lisan siia
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload), // Saadame andmed nii, et igal väljal on õige nimi
        });

        if (!response.ok) {
            throw new Error(`Viga saatmisel: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Emaili saatmise viga:', error);
        throw error;
    }
};


export const getSentMessages = async (affiliate) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messages/sent?affiliate=${affiliate}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });
        if (!response.ok) {
            throw new Error('Failed to fetch sent messages');
        }
        return await response.json();
    } catch (error) {
        console.error('getSentMessages error:', error);
        throw error;
    }
};

export const sendMessageToAffiliate = async (senderEmail, affiliateEmail, subject, body) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messages/send-to-affiliate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                affiliateEmail,
                senderEmail,
                subject,
                body,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message to affiliate');
        }

        return await response.json();
    } catch (error) {
        console.error('sendMessageToAffiliate error:', error);
        throw error;
    }
};