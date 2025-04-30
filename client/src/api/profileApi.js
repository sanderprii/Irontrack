import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/user`,
            userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return true;
    } catch (error) {
        console.error('Error updating profile:', error);
        return false;
    }
};

export const changeUserPassword = async (passwordData) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/user/change-password`,
            passwordData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        return true;
    } catch (error) {
        console.error('Error changing password:', error);
        return false;
    }
};

export const getUserPlansByAffiliate = async (affiliateId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/user/user-plans`, {
            params: {
                affiliateId
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching plans:', error);
        return [];
    }
};

export async function addUserNote(userId, noteData) {
    // noteData = { note, flag }
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/user/notes/${userId}/notes`,
            noteData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data; // Tagastab loodud note
    } catch (error) {
        console.error("❌ addUserNote error:", error);
        throw error;
    }
}

export async function deleteUserNote(userId, noteId) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/user/notes/${userId}/notes/${noteId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return true;
    } catch (error) {
        console.error("❌ deleteUserNote error:", error);
        throw error;
    }
}

export async function getUserAttendees(affiliateId, userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/attendees`, {
            params: {
                affiliateId,
                userId
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendees:', error);
        return [];
    }
}