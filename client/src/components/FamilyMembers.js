import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import { getFamilyMembers, addFamilyMember, deleteFamilyMember, getAffiliateFamilyMembers } from '../api/familyApi';

export default function FamilyMembers({ user }) {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // Fetch family members when component mounts
    useEffect(() => {
        loadFamilyMembers();
    }, []);

    const role = localStorage.getItem("role");

    const loadFamilyMembers = async () => {
        try {
            if (role === "regular") {
                setIsLoading(true);
                const data = await getFamilyMembers();

            setFamilyMembers(data);
            } else
            if (role === "affiliate") {
                setIsLoading(true);
                const data = await getAffiliateFamilyMembers(user.id);
                setFamilyMembers(data);
            }
            setIsLoading(false);
        } catch (error) {
            showErrorMessage('Failed to load family members');
            setIsLoading(false);
        }
    };

    // Add a new family member
    const handleAddMember = async () => {
        try {
            if (!newMemberName.trim()) {
                showErrorMessage('Please enter a name');
                return;
            }

            await addFamilyMember(newMemberName);
            showSuccessMessage('Family member added successfully!');
            setNewMemberName('');
            setShowAddForm(false);
            await loadFamilyMembers();
        } catch (error) {
            showErrorMessage('Failed to add family member');
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteConfirm = (memberId) => {
        setMemberToDelete(memberId);
        setConfirmDialogOpen(true);
    };

    // Delete a family member
    const handleDeleteMember = async () => {
        try {
            if (!memberToDelete) return;

            await deleteFamilyMember(memberToDelete);
            showSuccessMessage('Family member removed successfully!');
            setConfirmDialogOpen(false);
            await loadFamilyMembers();
        } catch (error) {
            showErrorMessage('Failed to remove family member');
        }
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

    return (
        <>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Children</Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Registered Children</Typography>
                    { role === "regular" && (
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        Add Child
                    </Button>
                    )}
                </Box>

                {/* Add new family member form */}
                {showAddForm && (
                    <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            New Child
                        </Typography>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handleAddMember}
                            >
                                Add
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Loading indicator */}
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    /* Family members list */
                    familyMembers.length > 0 ? (
                        <Box>
                            {familyMembers.map((member) => (
                                <Card key={member.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ color: 'gray' }} />
                                                <Typography variant="h6">{member.fullName}</Typography>
                                            </Box>
                                            { role === "regular" && (
                                            <IconButton
                                                onClick={() => handleOpenDeleteConfirm(member.id)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: 'darkred' }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                            Added: {new Date(member.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ my: 4, textAlign: 'center', color: 'text.secondary' }}>
                            No children added yet
                        </Typography>
                    )
                )}
            </CardContent>

            {/* Success Dialog */}
            <Dialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
            >
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
            >
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this child? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteMember} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}