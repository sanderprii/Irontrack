import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

// Get contact notes for a specific user
export const getContactNotes = async (affiliateId, userId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token || !affiliateId || !userId) {
            throw new Error("Missing required parameters");
        }

        const response = await axios.get(`${API_URL}/contact-notes`, {
            params: {
                affiliateId,
                userId
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error fetching contact notes:", error);
        throw error;
    }
};

// Add a new contact note
export const addContactNote = async (affiliateId, userId, note) => {
    try {
        const token = localStorage.getItem("token");

        if (!token || !affiliateId || !userId || !note) {
            throw new Error("Missing required parameters");
        }

        const response = await axios.post(`${API_URL}/contact-note`,
            {
                affiliateId,
                userId,
                note
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error adding contact note:", error);
        throw error;
    }
};

// Update an existing contact note
export const updateContactNote = async (noteId, note) => {
    try {
        const token = localStorage.getItem("token");

        if (!token || !noteId || !note) {
            throw new Error("Missing required parameters");
        }

        const response = await axios.put(`${API_URL}/contact-note/${noteId}`,
            {
                note
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("❌ Error updating contact note:", error);
        throw error;
    }
};

// Delete a contact note
export const deleteContactNote = async (noteId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token || !noteId) {
            throw new Error("Missing required parameters");
        }

        await axios.delete(`${API_URL}/contact-note/${noteId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return true;
    } catch (error) {
        console.error("❌ Error deleting contact note:", error);
        throw error;
    }
};