// api/familyApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Fetches all family members for the current user
 * @returns {Array} List of family members
 */
export const getFamilyMembers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/family-members`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching family members:', error);
        return [];
    }
};

/**
 * Adds a new family member
 * @param {string} fullName - The full name of the family member
 * @returns {Object} The newly created family member
 */
export const addFamilyMember = async (fullName) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/user/family-members`,
            { fullName },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error adding family member:', error);
        throw error;
    }
};

/**
 * Deletes a family member
 * @param {number} id - The ID of the family member to delete
 * @returns {boolean} True if successfully deleted
 */
export const deleteFamilyMember = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/user/family-members/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return true;
    } catch (error) {
        console.error('Error deleting family member:', error);
        throw error;
    }
};

export const getAffiliateFamilyMembers = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user/family-members/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching affiliate family members:', error);
        return [];
    }
}

export default {
    getFamilyMembers,
    addFamilyMember,
    deleteFamilyMember
};