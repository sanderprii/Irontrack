const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get contact notes for a specific user
 */
const getContactNotes = async (req, res) => {
    try {
        const userId = req.user?.id; // User ID from JWT
        const targetUserId = parseInt(req.query.userId);
        const affiliateId = parseInt(req.query.affiliateId);

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        if (!targetUserId || !affiliateId) {
            console.error("❌ Missing required query parameters");
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        // Fetch notes
        const notes = await prisma.contactNote.findMany({
            where: {
                userId: targetUserId,
                affiliateId: affiliateId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(notes);
    } catch (error) {
        console.error("❌ Error fetching contact notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Create a new contact note
 */
const createContactNote = async (req, res) => {
    try {
        const userId = req.user?.id; // User ID from JWT
        const { affiliateId, userId: targetUserId, note } = req.body;

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        if (!targetUserId || !affiliateId || !note) {
            console.error("❌ Missing required parameters");
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // Create new note
        const newNote = await prisma.contactNote.create({
            data: {
                userId: parseInt(targetUserId),
                affiliateId: parseInt(affiliateId),
                note
            }
        });

        res.status(201).json(newNote);
    } catch (error) {
        console.error("❌ Error creating contact note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Update an existing contact note
 */
const updateContactNote = async (req, res) => {
    try {
        const userId = req.user?.id; // User ID from JWT
        const noteId = parseInt(req.params.id);
        const { note } = req.body;

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        if (!noteId || !note) {
            console.error("❌ Missing required parameters");
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // Find the note
        const existingNote = await prisma.contactNote.findUnique({
            where: { id: noteId }
        });

        if (!existingNote) {
            console.error("❌ Note not found");
            return res.status(404).json({ error: "Note not found" });
        }

        // Update the note
        const updatedNote = await prisma.contactNote.update({
            where: { id: noteId },
            data: { note }
        });

        res.json(updatedNote);
    } catch (error) {
        console.error("❌ Error updating contact note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Delete a contact note
 */
const deleteContactNote = async (req, res) => {
    try {
        const userId = req.user?.id; // User ID from JWT
        const noteId = parseInt(req.params.id);

        if (!userId) {
            console.error("❌ Missing userId in JWT");
            return res.status(401).json({ error: "Unauthorized: Missing userId" });
        }

        if (!noteId) {
            console.error("❌ Missing required parameters");
            return res.status(400).json({ error: "Missing note id" });
        }

        // Find the note
        const existingNote = await prisma.contactNote.findUnique({
            where: { id: noteId }
        });

        if (!existingNote) {
            console.error("❌ Note not found");
            return res.status(404).json({ error: "Note not found" });
        }

        // Delete the note
        await prisma.contactNote.delete({
            where: { id: noteId }
        });

        res.json({ success: true });
    } catch (error) {
        console.error("❌ Error deleting contact note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getContactNotes,
    createContactNote,
    updateContactNote,
    deleteContactNote
};