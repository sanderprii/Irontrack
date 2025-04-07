import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    TextField,
    Typography,
    Autocomplete,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import { createContract, getLatestContractTemplate } from '../api/contractApi';
import { searchUsers } from '../api/membersApi';
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function CreateContract({ open, onClose, affiliateId }) {
    // Kasutaja otsing
    const [userQuery, setUserQuery] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lepingu põhiandmed
    const [contractType, setContractType] = useState('Monthly Membership');
    const [content, setContent] = useState('');

    // Training types
    const [trainingTypes, setTrainingTypes] = useState([]);
    const trainingTypeOptions = [
        'All classes',
        'WOD',
        'Weightlifting',
        'Rowing',
        'Gymnastics',
        'Open Gym',
        'Cardio'
    ];

    // Uued väljad
    const [paymentType, setPaymentType] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentInterval, setPaymentInterval] = useState('month'); // default väärtus
    const [paymentDay, setPaymentDay] = useState(1);
    const [validUntil, setValidUntil] = useState('');

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    // Laeme default contract template, kui modal avaneb
    useEffect(() => {
        if (open) {
            loadTemplate();
        }
    }, [open]);

    const loadTemplate = async () => {
        try {
            const template = await getLatestContractTemplate(affiliateId);
            if (template?.content) {
                setContent(template.content);
            }
        } catch (error) {
            console.error('Error loading contract template:', error);
            showErrorMessage('Failed to load contract template.');
        }
    };

    // Show success message via dialog
    const showSuccessMessage = (message) => {
        setDialogMessage(message);
        setSuccessDialogOpen(true);
    };

    // Show error message via dialog
    const showErrorMessage = (message) => {
        setDialogMessage(message);
        setErrorDialogOpen(true);
    };

    // Otsime kasutajaid iga kord, kui userQuery muutub
    useEffect(() => {
        let active = true;
        const fetchUsers = async () => {
            if (userQuery.length === 0) {
                setUserOptions([]);
                return;
            }
            setLoading(true);
            const results = await searchUsers(userQuery);
            if (active) {
                setUserOptions(results || []);
            }
            setLoading(false);
        };

        fetchUsers();
        return () => {
            active = false;
        };
    }, [userQuery]);

    // Lepingu salvestamine
    const handleSave = async () => {
        // Reset any validation errors
        setValidationError('');

        // Check if a user is selected
        if (!selectedUser) {
            setValidationError('Please select a user!');
            return;
        }

        try {
            // Koostame payload, kus on lisaks uued väljad
            const payload = {
                affiliateId,
                userId: selectedUser.id, // eeldame, et user-objektil on 'id'
                contractType,
                content,
                paymentType,
                paymentAmount: paymentAmount ? parseFloat(paymentAmount) : null,
                paymentInterval,
                paymentDay: paymentDay ? parseInt(paymentDay, 10) : null,
                validUntil,
                trainingTypes, // Send as array, backend will convert to string
            };

            await createContract(payload);

            // Show success message
            showSuccessMessage('Contract created successfully!');

            // Close on success after a short delay
            setTimeout(() => {
                setSuccessDialogOpen(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error creating contract:', error);
            showErrorMessage('Failed to create contract. Please try again.');
        }
    };

    // Improved helper component tooltip (compact version)
    const InfoTooltip = ({ title }) => (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                mr: 1,
                position: 'relative',
                '&:hover::after': {
                    content: `"${title}"`,
                    position: 'absolute',
                    top: '-24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(97, 97, 97, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    zIndex: 1000
                }
            }}
        >
            <InfoIcon fontSize="small" color="action" sx={{ fontSize: '16px' }} />
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Contract</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Fill the fields to create a new contract.
                </Typography>

                {/* Display validation error if any */}
                {validationError && (
                    <Box sx={{ color: 'error.main', mb: 2, mt: 1, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
                        {validationError}
                    </Box>
                )}

                {/* Kasutaja otsing (Autocomplete) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Search for a member" />
                    <Autocomplete
                        fullWidth
                        options={userOptions}
                        getOptionLabel={(option) => option.fullName || ''}
                        value={selectedUser}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        onInputChange={(event, newInputValue) => {
                            setUserQuery(newInputValue);
                        }}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search User by fullName"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>

                {/* Training Types (Multi-select) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Select available training types" />
                    <Autocomplete
                        multiple
                        fullWidth
                        options={trainingTypeOptions}
                        value={trainingTypes}
                        onChange={(event, newValue) => setTrainingTypes(newValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    label={option}
                                    size="small"
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Training Types"
                                placeholder="Select training types"
                            />
                        )}
                    />
                </Box>

                {/* Contract type */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Type of contract" />
                    <TextField
                        label="Contract Type"
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Payment Amount */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Amount per period" />
                    <TextField
                        label="Payment Amount"
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Payment Interval (Select) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Frequency of payments" />
                    <FormControl fullWidth>
                        <InputLabel id="payment-interval-label">Payment Interval</InputLabel>
                        <Select
                            labelId="payment-interval-label"
                            label="Payment Interval"
                            value={paymentInterval}
                            onChange={(e) => setPaymentInterval(e.target.value)}
                        >
                            <MenuItem value="month">Month</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Payment Day (1..28) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Day of payment (1-28)" />
                    <TextField
                        label="Payment Day"
                        type="number"
                        inputProps={{ min: 1, max: 28 }}
                        value={paymentDay}
                        onChange={(e) => setPaymentDay(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* Valid Until (kuupäev) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Expiration date" />
                    <TextField
                        label="Valid Until"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* Lepingu sisu (textarea) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <InfoTooltip title="Contract text content" />
                    <FormControl fullWidth>
                        <TextareaAutosize
                            minRows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                borderColor: '#AAAAAA',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Contract
                </Button>
            </DialogActions>

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
        </Dialog>
    );
}