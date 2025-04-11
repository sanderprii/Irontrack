// api/familyApi.js
const API_URL = process.env.REACT_APP_API_URL;

// Get family members for the current user
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

        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error fetching family members:', error);
        return [];
    }
};

// Add a new family member
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
            throw new Error('Failed to add family member');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding family member:', error);
        throw error;
    }
};

// Delete a family member
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
            throw new Error('Failed to delete family member');
        }

        return true;
    } catch (error) {
        console.error('Error deleting family member:', error);
        throw error;
    }
};