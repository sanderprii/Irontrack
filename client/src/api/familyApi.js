// api/familyApi.js
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Fetches all family members for the current user
 * @returns {Array} List of family members
 */
export const getFamilyMembers = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/family-members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Error response:', await response.text());
            return [];
        }

        return await response.json();
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
        const response = await fetch(`${API_URL}/user/family-members`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ fullName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(errorText || 'Failed to add family member');
        }

        return await response.json();
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
        const response = await fetch(`${API_URL}/user/family-members/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(errorText || 'Failed to delete family member');
        }

        return true;
    } catch (error) {
        console.error('Error deleting family member:', error);
        throw error;
    }
};

export default {
    getFamilyMembers,
    addFamilyMember,
    deleteFamilyMember
};