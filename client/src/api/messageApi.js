// src/api/messageApi.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Funktsioon e-kirja saatmiseks
export const sendMessage = async ({ recipientType, groupName, senderId, recipientId, subject, body, affiliateEmail }) => {
    try {
        // Kui sul on vaja tokenit localStoragest, saad selle siit kätte
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Kui sul on vaja autoriseeringut, lisan siia
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                groupName,
                recipientType,
                senderId,
                recipientId,
                subject,
                body,
                affiliateEmail,
            }),
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