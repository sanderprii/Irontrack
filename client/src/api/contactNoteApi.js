const API_URL = process.env.REACT_APP_API_URL

// Get contact notes for a specific user
export const getContactNotes = async (affiliateId, userId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token || !affiliateId || !userId) {
            throw new Error("Missing required parameters");
        }

        const response = await fetch(`${API_URL}/contact-notes?affiliateId=${affiliateId}&userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching contact notes: ${response.statusText}`);
        }

        return await response.json();
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

        const response = await fetch(`${API_URL}/contact-note`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                affiliateId,
                userId,
                note
            })
        });

        if (!response.ok) {
            throw new Error(`Error adding contact note: ${response.statusText}`);
        }

        return await response.json();
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

        const response = await fetch(`${API_URL}/contact-note/${noteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                note
            })
        });

        if (!response.ok) {
            throw new Error(`Error updating contact note: ${response.statusText}`);
        }

        return await response.json();
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

        const response = await fetch(`${API_URL}/contact-note/${noteId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error deleting contact note: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error("❌ Error deleting contact note:", error);
        throw error;
    }
};