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
    CircularProgress,
    Collapse,
    Chip,
    Grid,
    Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getFamilyMembers, addFamilyMember, deleteFamilyMember, getAffiliateFamilyMembers } from '../api/familyApi';

export default function FamilyMembers({ user }) {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedMember, setExpandedMember] = useState(null);

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
            } else if (role === "affiliate") {
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

    // Toggle expanded state for a family member
    const toggleMemberExpand = (memberId) => {
        if (expandedMember === memberId) {
            setExpandedMember(null);
        } else {
            setExpandedMember(memberId);
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
    const handleOpenDeleteConfirm = (e, memberId) => {
        e.stopPropagation(); // Prevent expansion toggle
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

            if (expandedMember === memberToDelete) {
                setExpandedMember(null);
            }
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

    // Parse training types from JSON string
    const parseTrainingTypes = (trainingTypeString) => {
        if (!trainingTypeString) return [];
        try {
            return JSON.parse(trainingTypeString);
        } catch (e) {
            return Array.isArray(trainingTypeString) ? trainingTypeString : [trainingTypeString];
        }
    };

    return (
        <Box sx={{ pt: 2, pb: 2, px: {xs: 0, md: 2, lg: 2} }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Children</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Registered Children</Typography>
                {role === "regular" && (
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setShowAddForm(!showAddForm)}
                        size="small"
                        sx={{ borderRadius: '20px' }}
                    >
                        Add Child
                    </Button>
                )}
            </Box>

            {/* Add new family member form */}
            {showAddForm && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 2, mb: 3, bgcolor: '#f9f9f9' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                            variant="contained"
                            onClick={handleAddMember}
                            size="small"
                        >
                            Add
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setShowAddForm(false)}
                            size="small"
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
                            <Card
                                key={member.id}
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: '#f9f9f9',
                                    boxShadow: 'none',
                                    border: '1px solid #eee'
                                }}
                            >
                                {/* Member header */}
                                <Box
                                    onClick={() => toggleMemberExpand(member.id)}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <PersonIcon color="action" />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {member.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Added: {new Date(member.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {role === "regular" && (
                                            <IconButton
                                                onClick={(e) => handleOpenDeleteConfirm(e, member.id)}
                                                size="small"
                                                color="error"
                                                sx={{ mr: 1 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                        {expandedMember === member.id ? (
                                            <KeyboardArrowUpIcon color="action" />
                                        ) : (
                                            <KeyboardArrowDownIcon color="action" />
                                        )}
                                    </Box>
                                </Box>

                                {/* Plans Section */}
                                <Collapse in={expandedMember === member.id} timeout="auto" unmountOnExit>
                                    <Divider />
                                    <Box sx={{ p: 2, bgcolor: 'white' }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="medium"
                                            sx={{ mb: 2 }}
                                        >
                                            Active Plans
                                        </Typography>

                                        {!member.userplans || member.userplans.filter(plan => new Date(plan.endDate) > new Date()).length === 0 ? (
                                            <Typography color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                                                No active plans found for this child.
                                            </Typography>
                                        ) : (
                                            <>
                                                {member.userplans
                                                    .filter(plan => new Date(plan.endDate) > new Date())
                                                    .map((plan) => (
                                                        <Box
                                                            key={plan.id}
                                                            sx={{
                                                                mb: 2,
                                                                p: 2,
                                                                bgcolor: '#f9f9f9',
                                                                borderRadius: 1,
                                                                border: '1px solid #eee'
                                                            }}
                                                        >
                                                            {/* Plan Name */}
                                                            <Box sx={{ mb: 1.5 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Plan Name
                                                                    </Typography>
                                                                </Box>
                                                                <Typography variant="body1" fontWeight="medium">
                                                                    {plan.planName}
                                                                </Typography>
                                                            </Box>

                                                            {/* Affiliate */}
                                                            <Box sx={{ mb: 1.5 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Affiliate
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {plan.affiliateName || 'Unknown'}
                                                                </Typography>
                                                            </Box>

                                                            {/* Price */}
                                                            <Box sx={{ mb: 1.5 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Price
                                                                </Typography>
                                                                <Typography variant="body1" fontWeight="medium">
                                                                    {plan.price}€
                                                                </Typography>
                                                            </Box>

                                                            {/* Sessions Left */}
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Sessions Left
                                                                </Typography>
                                                                <Box sx={{ mt: 0.5 }}>
                                                                    <Chip
                                                                        label={plan.sessionsLeft === 9999 ? "Unlimited" : plan.sessionsLeft}
                                                                        color={plan.sessionsLeft > 5 ? "success" : plan.sessionsLeft > 0 ? "warning" : "error"}
                                                                        size="small"
                                                                        sx={{ fontWeight: 'medium' }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    ))}

                                                {/* Training Types Section */}
                                                <Box sx={{ mt: 3 }}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Training Types
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {member.userplans
                                                            .filter(plan => new Date(plan.endDate) > new Date())
                                                            .flatMap(plan => parseTrainingTypes(plan.trainingType))
                                                            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                                                            .map((type, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={type}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderRadius: '16px',
                                                                        bgcolor: 'rgba(0,0,0,0.05)'
                                                                    }}
                                                                />
                                                            ))}
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Collapse>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1" sx={{ my: 4, textAlign: 'center', color: 'text.secondary' }}>
                        No children added yet
                    </Typography>
                )
            )}

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
        </Box>
    );
}