import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    Divider,
    Stack,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper,
    Tooltip,
    Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { addUserNote, deleteUserNote } from "../api/profileApi";
import DeleteIcon from "@mui/icons-material/Delete";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function ProfileView({
                                        user,
                                        onEditProfile,
                                        onChangePassword,
                                        onUploadProfilePicture
                                    }) {
    const [showAddNote, setShowAddNote] = useState(false);
    const [newFlag, setNewFlag] = useState("red");
    const [newNote, setNewNote] = useState("");

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [noteToDelete, setNoteToDelete] = useState(null);

    // Helper function to format date as DD.MM.YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUploadProfilePicture(file);
        }
    };

    const reloadUserData = async () => {
        window.location.reload();
    };

    // Show success message
    const showSuccessMessage = (message) => {
        setDialogMessage(message);
        setSuccessDialogOpen(true);
    };

    // Show error message
    const showErrorMessage = (message) => {
        setDialogMessage(message);
        setErrorDialogOpen(true);
    };

    const handleAddNote = async () => {
        try {
            if (!newNote.trim()) {
                showErrorMessage("Please enter a note text!");
                return;
            }
            await addUserNote(user.id, { note: newNote, flag: newFlag });
            showSuccessMessage("Note added successfully!");
            setNewNote("");
            setNewFlag("red");
            setShowAddNote(false);
            await reloadUserData();
        } catch (error) {
            console.error("Error adding note:", error);
            showErrorMessage("Failed to add note");
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteConfirm = (noteId) => {
        setNoteToDelete(noteId);
        setConfirmDialogOpen(true);
    };

    // Delete note
    const handleDeleteNote = async () => {
        try {
            if (!noteToDelete) return;
            await deleteUserNote(user.id, noteToDelete);
            showSuccessMessage("Note deleted successfully!");
            setConfirmDialogOpen(false);
            await reloadUserData();
        } catch (error) {
            console.error("Error deleting note:", error);
            showErrorMessage("Failed to delete note");
        }
    };

    const role = localStorage.getItem("role");

    // Flag colors for notes
    const flagColors = {
        red: { light: "rgba(255, 0, 0, 0.08)", main: "#f44336" },
        yellow: { light: "rgba(255, 255, 0, 0.08)", main: "#ffc107" },
        green: { light: "rgba(0, 255, 0, 0.08)", main: "#4caf50" }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)'
                }}
            >
                {/* Profile Header with softer, more muted background */}
                <Box
                    sx={{
                        position: 'relative',
                        height: 150,
                        background: 'linear-gradient(45deg, #546e7a, #78909c)', // Softer blue-grey
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    {/* Profile Picture with centered position */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '-60px',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Avatar
                            src={user?.logo || "https://via.placeholder.com/120"}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>

                    {/* Action buttons - only show if role is "regular" */}
                    {role === "regular" && (
                        <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
                            <Tooltip title="Edit Profile">
                                <IconButton
                                    onClick={onEditProfile}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        marginRight: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'scale(1.05)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Change Password">
                                <IconButton
                                    onClick={onChangePassword}
                                    sx={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            transform: 'scale(1.05)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <LockIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>

                {/* User name displayed prominently */}
                <Box sx={{ mt: 8, textAlign: 'center', px: 2 }}>
                    <Typography variant="h5" fontWeight="bold">
                        {user.fullName}
                    </Typography>

                    {/* Upload profile picture button */}
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <input
                            type="file"
                            accept="image/*"
                            id="profile-pic-input"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profile-pic-input">
                            <Button
                                variant="outlined"
                                component="span"
                                size="small"
                                sx={{
                                    mt: 1,
                                    borderRadius: 1,
                                    textTransform: 'none', // Keeps the original case
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                Upload Profile Picture
                            </Button>
                        </label>
                    </Box>

                    {role !== "regular" && user.isAcceptedTerms !== undefined && (
                        <Chip
                            label={user.isAcceptedTerms ? "Terms Accepted" : "Terms Not Accepted"}
                            color={user.isAcceptedTerms ? "success" : "error"}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    )}
                </Box>

                <Divider sx={{ my: 2, mx: 3 }} />

                {/* User Information Section */}
                <Box sx={{ px: 4, py: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <InfoItem
                                icon={<CakeIcon color="primary" />}
                                label="Birth Date"
                                value={formatDate(user.dateOfBirth)}
                            />
                            <InfoItem
                                icon={<EmailIcon color="primary" />}
                                label="Email"
                                value={user.email}
                            />
                            <InfoItem
                                icon={<PhoneAndroidIcon color="primary" />}
                                label="Phone"
                                value={user.phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InfoItem
                                icon={<LocalHospitalIcon color="error" />}
                                label="Emergency Contact"
                                value={user.emergencyContact}
                            />
                            <InfoItem
                                icon={<LocationOnIcon color="primary" />}
                                label="Address"
                                value={user.address}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Notes Section (only for non-regular users) */}
                {role !== "regular" && (
                    <Box sx={{ px: 4, py: 2, mt: 2 }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2
                        }}>
                            <Typography variant="h6" fontWeight="medium">User Notes</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => setShowAddNote(!showAddNote)}
                                sx={{
                                    borderRadius: 20,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    },
                                    transition: 'all 0.2s'
                                }}
                            >
                                Add Note
                            </Button>
                        </Box>

                        {/* Notes List */}
                        {user.userNotes && user.userNotes.length > 0 ? (
                            <Stack spacing={2}>
                                {user.userNotes.map((note) => (
                                    <Paper
                                        key={note.id}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            borderLeft: `4px solid ${flagColors[note.flag]?.main || '#ccc'}`,
                                            backgroundColor: flagColors[note.flag]?.light || 'inherit',
                                            position: 'relative',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ pr: 4 }}>{note.note}</Typography>
                                        <IconButton
                                            onClick={() => handleOpenDeleteConfirm(note.id)}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                color: 'rgba(0,0,0,0.5)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'rgba(255,0,0,0.7)',
                                                    backgroundColor: 'rgba(255,0,0,0.1)',
                                                    transform: 'rotate(5deg)'
                                                },
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                                <Typography variant="body2">No notes have been added yet</Typography>
                            </Box>
                        )}

                        {/* Add Note Form */}
                        {showAddNote && (
                            <Paper
                                elevation={2}
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#f9f9f9',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                    Choose Flag:
                                </Typography>
                                <RadioGroup
                                    row
                                    value={newFlag}
                                    onChange={(e) => setNewFlag(e.target.value)}
                                    sx={{ mb: 2 }}
                                >
                                    <FormControlLabel
                                        value="red"
                                        control={<Radio sx={{
                                            color: flagColors.red.main,
                                            '&.Mui-checked': { color: flagColors.red.main }
                                        }}/>}
                                        label="Red"
                                    />
                                    <FormControlLabel
                                        value="yellow"
                                        control={<Radio sx={{
                                            color: flagColors.yellow.main,
                                            '&.Mui-checked': { color: flagColors.yellow.main }
                                        }}/>}
                                        label="Yellow"
                                    />
                                    <FormControlLabel
                                        value="green"
                                        control={<Radio sx={{
                                            color: flagColors.green.main,
                                            '&.Mui-checked': { color: flagColors.green.main }
                                        }}/>}
                                        label="Green"
                                    />
                                </RadioGroup>

                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                                    Note Content:
                                </Typography>
                                <FormControl fullWidth>
                                    <TextareaAutosize
                                        minRows={3}
                                        value={newNote}
                                        onChange={(e) => {
                                            const text = e.target.value;
                                            if (text.length <= 2000) {
                                                setNewNote(text);
                                            }
                                        }}
                                        placeholder="Enter your note here..."
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            borderColor: '#e0e0e0',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            backgroundColor: 'white'
                                        }}
                                    />
                                    {newNote.length >= 1800 && (
                                        <Typography
                                            variant="caption"
                                            color={newNote.length >= 2000 ? "error" : "warning"}
                                            sx={{ mt: 1 }}
                                        >
                                            {newNote.length >= 2000
                                                ? "Maximum 2000 characters allowed. You've reached the limit."
                                                : `${2000 - newNote.length} characters remaining.`}
                                        </Typography>
                                    )}
                                </FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={() => setShowAddNote(false)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-2px)'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddNote}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Save Note
                                    </Button>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Dialog Components */}
            <Dialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
            >
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setSuccessDialogOpen(false)}
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setErrorDialogOpen(false)}
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this note? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmDialogOpen(false)}
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteNote}
                        color="error"
                        sx={{ cursor: 'pointer' }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// Helper component for displaying info items
const InfoItem = ({ icon, label, value }) => {
    if (!value) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ mr: 2 }}>{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                <Typography variant="body1">{value}</Typography>
            </Box>
        </Box>
    );
};

// Simple Grid component to avoid requiring the full Grid import
const Grid = ({ container, item, xs, sm, md, lg, children, spacing, ...props }) => {
    if (container) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: spacing ? -spacing/2 : 0,
                    ...props.sx
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }

    if (item) {
        const getWidth = (size) => {
            if (!size) return undefined;
            return `${(size / 12) * 100}%`;
        };

        return (
            <Box
                sx={{
                    padding: spacing ? spacing/2 : 0,
                    width: {
                        xs: getWidth(xs),
                        sm: getWidth(sm),
                        md: getWidth(md),
                        lg: getWidth(lg),
                    },
                    ...props.sx
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }

    return <Box {...props}>{children}</Box>;
};