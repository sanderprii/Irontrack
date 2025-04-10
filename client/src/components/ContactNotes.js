import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    List,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid,
    Alert,
    TextareaAutosize
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
    getContactNotes,
    addContactNote,
    updateContactNote,
    deleteContactNote
} from '../api/contactNoteApi';

const ContactNotes = ({ user, affiliateId, userId }) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Check if user has permission to view/edit notes
    const userRole = localStorage.getItem('userRole');
    const hasPermission = userRole === 'affiliate' || userRole === 'trainer';

    useEffect(() => {


        // Use either provided userId or get it from user object
        const targetUserId = userId || (user?.id || user?.userId);

        if (!hasPermission) {

            return;
        }

        if (!targetUserId) {

            setError("Kasutaja ID puudub, ei saa märkmeid laadida");
            return;
        }

        if (!affiliateId) {

            setError("Klubi ID puudub, ei saa märkmeid laadida");
            return;
        }

        fetchNotes(targetUserId);
    }, [user, userId, affiliateId]);

    const fetchNotes = async (targetUserId) => {
        setIsLoading(true);
        setError(null);

        try {

            const data = await getContactNotes(affiliateId, targetUserId);

            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Error fetching contact notes:', err);
            setError('Märkmete laadimine ebaõnnestus: ' + (err.message || 'Tundmatu viga'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setIsLoading(true);
        setError(null);

        // Use either provided userId or get it from user object
        const targetUserId = userId || (user?.id || user?.userId);

        if (!targetUserId) {
            setError('User ID is missing, cannot add note');
            setIsLoading(false);
            return;
        }

        try {

            await addContactNote(affiliateId, targetUserId, newNote);
            setNewNote('');
            await fetchNotes(targetUserId);
            showSuccessMessage('Note added successfully!');
        } catch (err) {
            console.error('❌ Error adding contact note:', err);
            setError('Failed to add note: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartEdit = (note) => {
        setEditingNote(note.id);
        setEditedContent(note.note);
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
        setEditedContent('');
    };

    const handleSaveEdit = async () => {
        if (!editedContent.trim() || !editingNote) return;

        setIsLoading(true);
        setError(null);

        // Use either provided userId or get it from user object
        const targetUserId = userId || (user?.id || user?.userId);

        try {

            await updateContactNote(editingNote, editedContent);
            setEditingNote(null);
            await fetchNotes(targetUserId);
            showSuccessMessage('Note updated successfully!');
        } catch (err) {
            console.error('❌ Error updating contact note:', err);
            setError('Failed to update note: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDeleteConfirm = (noteId) => {
        setNoteToDelete(noteId);
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setNoteToDelete(null);
    };

    const handleDeleteNote = async () => {
        if (!noteToDelete) return;

        setIsLoading(true);
        setError(null);

        // Use either provided userId or get it from user object
        const targetUserId = userId || (user?.id || user?.userId);

        try {

            await deleteContactNote(noteToDelete);
            setDeleteConfirmOpen(false);
            setNoteToDelete(null);
            await fetchNotes(targetUserId);
            showSuccessMessage('Note deleted successfully!');
        } catch (err) {
            console.error('❌ Error deleting contact note:', err);
            setError('Failed to delete note: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('et-EE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Use either provided userId or get it from user object
    const targetUserId = userId || (user?.id || user?.userId);

    if (!targetUserId) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    User ID is missing, cannot load notes
                </Alert>
            </Box>
        );
    }

    if (!affiliateId) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">
                    Club ID is missing, cannot load notes
                </Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <NoteAddIcon sx={{ mr: 1 }} />
                Client Notes
            </Typography>

            {/* Success message */}
            {successMessage && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#e6f7e6', borderRadius: 1 }}>
                    <Typography color="success">{successMessage}</Typography>
                </Box>
            )}

            {/* Error message */}
            {error && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            {/* New note form */}
            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Add New Note
                    </Typography>
                    <TextareaAutosize
                        minRows={10}
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter a new note about this client..."
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            borderColor: '#AAAAAA',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            marginBottom: '16px'
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<NoteAddIcon />}
                        onClick={handleAddNote}
                        disabled={isLoading || !newNote.trim()}
                    >
                        Add Note
                    </Button>
                </CardContent>
            </Card>

            {/* Notes list */}
            <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Previous Notes
                    <Chip
                        label={notes.length}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                    />
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {isLoading ? (
                    <Typography>Loading...</Typography>
                ) : notes.length > 0 ? (
                    <List>
                        {notes.map((note) => (
                            <Card key={note.id} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent sx={{ pb: 1 }}>
                                    <Grid container justifyContent="space-between" alignItems="flex-start">
                                        <Grid item xs>
                                            {editingNote === note.id ? (
                                                <TextareaAutosize
                                                    minRows={10}
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    disabled={isLoading}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        borderRadius: '4px',
                                                        borderColor: '#AAAAAA',
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        marginBottom: '16px'
                                                    }}
                                                />
                                            ) : (
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {note.note}
                                                </Typography>
                                            )}
                                        </Grid>
                                        <Grid item>
                                            {editingNote === note.id ? (
                                                <Box sx={{ display: 'flex' }}>
                                                    <IconButton
                                                        onClick={handleSaveEdit}
                                                        disabled={isLoading || !editedContent.trim()}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={handleCancelEdit}
                                                        disabled={isLoading}
                                                        color="default"
                                                        size="small"
                                                    >
                                                        <CancelIcon />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex' }}>
                                                    <IconButton
                                                        onClick={() => handleStartEdit(note)}
                                                        disabled={isLoading}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleOpenDeleteConfirm(note.id)}
                                                        disabled={isLoading}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', mt: 1, textAlign: 'right' }}
                                    >
                                        Added: {formatDate(note.createdAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        No notes have been added yet. Add your first note using the form above.
                    </Typography>
                )}
            </Paper>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this note? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteNote} color="error" disabled={isLoading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ContactNotes;