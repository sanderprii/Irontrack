import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid,
    Collapse,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem
} from '@mui/material';
import { getPlans, assignPlanToUser, updateUserPlan } from '../api/planApi';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";

const ActivePlans = ({ userId, affiliateId }) => {
    const [plans, setPlans] = useState([]);
    const [affiliatePlans, setAffiliatePlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openRow, setOpenRow] = useState(null);

    // Edit mode state
    const [editRowId, setEditRowId] = useState(null);
    const [editData, setEditData] = useState({
        sessionsLeft: '',
        endDate: '',
    });

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;
    const role = localStorage.getItem('role');

    // Load user's active plans
    const loadUserActivePlans = () => {
        fetch(`${API_URL}/user/user-purchase-history?userId=${userId}&affiliateId=${affiliateId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const now = new Date();
                // Filter active plans
                const active = data.filter((p) => new Date(p.endDate) >= now);
                setPlans(active);
            })
            .catch((err) => console.log('Error loading active plans:', err));
    };

    // Initial loading
    useEffect(() => {
        loadUserActivePlans();
    }, [token, userId, affiliateId]);

    // Load affiliate plans
    useEffect(() => {
        getPlans().then((allPlans) => {
            const activeAffiliatePlans = allPlans.filter((pl) => pl.active === true);
            setAffiliatePlans(activeAffiliatePlans);
        });
    }, []);

    // Row click handler for expansion
    const handleRowClick = (id) => {
        if (openRow === id) {
            setOpenRow(null);
        } else {
            setOpenRow(id);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Parse training types from JSON string
    const parseTrainingTypes = (trainingTypeString) => {
        try {
            return JSON.parse(trainingTypeString);
        } catch (e) {
            return [];
        }
    };

    // Calculate days left until expiration
    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const expDate = new Date(endDate);
        const diffTime = Math.abs(expDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Modal handlers
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPlanId('');
    };

    const handleSaveModal = async () => {
        if (!selectedPlanId) return;
        await assignPlanToUser(Number(selectedPlanId), Number(userId), affiliateId);
        handleCloseModal();
        loadUserActivePlans();
    };

    // Edit mode handlers
    const handleEdit = (e, row) => {
        e.stopPropagation(); // Prevent row expansion when clicking edit
        setEditRowId(row.id);
        setEditData({
            sessionsLeft: row.sessionsLeft || '',
            endDate: row.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
        });
    };

    const handleChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    const handleSaveEdit = async (e) => {
        e.stopPropagation(); // Prevent row expansion when clicking save

        const body = {
            sessionsLeft: Number(editData.sessionsLeft),
            endDate: editData.endDate ? new Date(editData.endDate) : null,
        };

        await updateUserPlan(editRowId, body);
        setEditRowId(null);
        loadUserActivePlans();
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation(); // Prevent row expansion when clicking cancel
        setEditRowId(null);
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{
                ml: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                Active Plans
                {role === 'affiliate' && (
                    <Button
                        variant="contained"
                        onClick={handleOpenModal}
                        startIcon={<AddIcon />}
                        sx={{ mr: 2 }}
                    >
                        Add Plan
                    </Button>
                )}
            </Typography>

            <Paper>
                {plans.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1">No active plans found.</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>

                                <TableCell>Plan Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Sessions Left</TableCell>
                                {role === 'affiliate' && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((plan) => {
                                const isOpen = openRow === plan.id;
                                const isEditing = editRowId === plan.id;
                                const trainingTypes = parseTrainingTypes(plan.trainingType);
                                const daysLeft = calculateDaysLeft(plan.endDate);

                                return (
                                    <React.Fragment key={plan.id}>
                                        {/* Main Row */}
                                        <TableRow
                                            hover
                                            onClick={() => !isEditing && handleRowClick(plan.id)}
                                            sx={{ cursor: isEditing ? 'default' : 'pointer' }}
                                        >


                                            <TableCell>{plan.planName}</TableCell>


                                            {isEditing ? (
                                                <>
                                                    <TableCell>{formatDate(plan.purchasedAt)}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
                                                                Plan End Date
                                                            </Typography>
                                                            <TextField
                                                                type="date"
                                                                size="small"
                                                                value={editData.endDate}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handleChange('endDate', e.target.value)}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{plan.price} €</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
                                                                Remaining Sessions
                                                            </Typography>
                                                            <TextField
                                                                type="number"
                                                                size="small"
                                                                value={editData.sessionsLeft}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handleChange('sessionsLeft', e.target.value)}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={handleSaveEdit}
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={handleCancelEdit}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>

                                                    <TableCell sx={{ fontWeight: 'bold' }}>{plan.price} €</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={plan.sessionsLeft === 9999 ? "Unlimited" : plan.sessionsLeft}
                                                            color={plan.sessionsLeft > 5 ? "success" : plan.sessionsLeft > 0 ? "warning" : "error"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    {role === 'affiliate' && (
                                                        <TableCell>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={(e) => handleEdit(e, plan)}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </>
                                            )}
                                        </TableRow>

                                        {/* Detail Row */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={isOpen && !isEditing} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 2 }}>
                                                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                            Plan Details
                                                        </Typography>

                                                        <Grid container spacing={3}>
                                                            {/* Plan Overview Card */}
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1} sx={{ height: '100%' }}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <FitnessCenterIcon sx={{ mr: 1 }} />
                                                                            Plan Overview
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                            {plan.familyMember?.fullName && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Family Member:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {plan.familyMember.fullName}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Plan Name:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {plan.planName}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Price:
                                                                                </Typography>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                    {plan.price} €
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Training Types:
                                                                                </Typography>
                                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                                    {trainingTypes.map((type, index) => (
                                                                                        <Chip
                                                                                            key={index}
                                                                                            label={type}
                                                                                            size="small"
                                                                                            color="primary"
                                                                                        />
                                                                                    ))}
                                                                                </Box>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Validity Period:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {plan.validityDays} days
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            {/* Membership Status Card */}
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1} sx={{ height: '100%' }}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <DateRangeIcon sx={{ mr: 1 }} />
                                                                            Membership Status
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Sessions Left:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={plan.sessionsLeft === 9999 ? "Unlimited" : plan.sessionsLeft}
                                                                                    color={plan.sessionsLeft > 5 ? "success" : plan.sessionsLeft > 0 ? "warning" : "error"}
                                                                                />
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Start Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {new Date(plan.purchasedAt).toLocaleString()}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    End Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {new Date(plan.endDate).toLocaleString()}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Days Left:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={`${daysLeft} days`}
                                                                                    color={daysLeft > 14 ? "success" : daysLeft > 7 ? "warning" : "error"}
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                        </Grid>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            {/* Modal for adding new plan */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Assign Plan to User</DialogTitle>
                <DialogContent sx={{ minWidth: 300, pt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                        Choose one of your affiliate plans:
                    </Typography>
                    <Select
                        fullWidth
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        <MenuItem value="">-- Please choose --</MenuItem>
                        {affiliatePlans.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>
                                {plan.name} ({plan.price} €)
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveModal}
                        disabled={!selectedPlanId}
                        startIcon={<AddIcon />}
                    >
                        Assign Plan
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ActivePlans;