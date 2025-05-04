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
    Tooltip,
    Alert,
    FormHelperText,
} from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import CalculateIcon from '@mui/icons-material/Calculate';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { createContract, getLatestContractTemplate, updateContract } from '../api/contractApi';
import { searchUsers } from '../api/membersApi';
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function CreateContract({ open, onClose, affiliateId, contractToEdit }) {
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
    const [startDate, setStartDate] = useState('');
    const [firstPaymentAmount, setFirstPaymentAmount] = useState('');
    const [isFirstPayment, setIsFirstPayment] = useState(true);
    const [calculationComplete, setCalculationComplete] = useState(false);

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    // First payment calculation preview
    const [paymentPreview, setPaymentPreview] = useState(null);

    // Add error state tracking for all fields
    const [errors, setErrors] = useState({
        selectedUser: false,
        contractType: false,
        content: false,
        paymentType: false,
        paymentAmount: false,
        paymentInterval: false,
        paymentDay: false,
        startDate: false,
        validUntil: false,
        trainingTypes: false,
        firstPaymentAmount: false
    });

    // Load contract data if editing or template if creating
    useEffect(() => {
        if (open && contractToEdit) {
            // Pre-fill form with contract data
            setSelectedUser({
                id: contractToEdit.userId,
                fullName: contractToEdit.user?.fullName || 'Unknown User'
            });
            setContractType(contractToEdit.contractType || 'Monthly Membership');
            setContent(contractToEdit.content || '');
            setPaymentType(contractToEdit.paymentType || '');
            setPaymentAmount(contractToEdit.paymentAmount?.toString() || '');
            setPaymentInterval(contractToEdit.paymentInterval || 'month');
            setPaymentDay(contractToEdit.paymentDay || 1);
            setStartDate(contractToEdit.startDate ? new Date(contractToEdit.startDate).toISOString().split('T')[0] : '');
            setIsFirstPayment(contractToEdit.isFirstPayment !== undefined ? contractToEdit.isFirstPayment : true);
            setFirstPaymentAmount(contractToEdit.firstPaymentAmount?.toString() || '');
            setCalculationComplete(!!contractToEdit.firstPaymentAmount);

            // Format the validUntil date for the input field
            if (contractToEdit.validUntil) {
                const date = new Date(contractToEdit.validUntil);
                setValidUntil(date.toISOString().split('T')[0]);
            } else {
                setValidUntil('');
            }

            // Parse training types (could be a JSON string or already an array)
            try {
                if (contractToEdit.trainingType) {
                    // Try to parse as JSON if it's a string
                    const trainingTypesArray = typeof contractToEdit.trainingType === 'string'
                        ? JSON.parse(contractToEdit.trainingType)
                        : contractToEdit.trainingType;
                    setTrainingTypes(trainingTypesArray);
                } else {
                    setTrainingTypes([]);
                }
            } catch (e) {
                // If parsing fails, try to use it as a comma-separated string
                const types = contractToEdit.trainingType?.split(',') || [];
                setTrainingTypes(types.map(t => t.trim()).filter(t => t));
            }

            // Calculate first payment even when editing
            if (contractToEdit.startDate && contractToEdit.paymentDay && contractToEdit.paymentAmount) {
                calculateFirstPayment();
            }

            // Reset errors when loading an existing contract
            resetErrors();
        } else if (open && !contractToEdit) {
            // Reset form for new contract
            setSelectedUser(null);
            setContractType('Monthly Membership');
            setPaymentType('');
            setPaymentAmount('');
            setPaymentInterval('month');
            setPaymentDay(1);
            setStartDate('');
            setValidUntil('');
            setTrainingTypes([]);
            setFirstPaymentAmount('');
            setIsFirstPayment(true);
            setCalculationComplete(false);
            setPaymentPreview(null);

            // Reset errors for new contract
            resetErrors();

            // Load template for new contracts
            loadTemplate();
        }
    }, [open, contractToEdit]);

    // Reset all error states
    const resetErrors = () => {
        setErrors({
            selectedUser: false,
            contractType: false,
            content: false,
            paymentType: false,
            paymentAmount: false,
            paymentInterval: false,
            paymentDay: false,
            startDate: false,
            validUntil: false,
            trainingTypes: false,
            firstPaymentAmount: false
        });
        setValidationError('');
    };

    // Calculate first payment amount when relevant fields change
    useEffect(() => {
        if (startDate && paymentDay && paymentAmount) {
            calculateFirstPayment();
        } else {
            setCalculationComplete(false);
        }
    }, [startDate, paymentDay, paymentAmount]);

    // Laeme default contract template, kui modal avaneb
    useEffect(() => {
        if (open && !contractToEdit) {
            loadTemplate();
        }
    }, [open, contractToEdit]);

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

    /**
     * Calculates the first payment amount for a contract based on start date and payment day
     */
    const calculateFirstPayment = () => {
        if (!startDate || !paymentAmount || !paymentDay) {
            setFirstPaymentAmount('');
            setPaymentPreview(null);
            setCalculationComplete(false);
            return;
        }

        const paymentAmountNum = parseFloat(paymentAmount);
        if (isNaN(paymentAmountNum)) {
            setFirstPaymentAmount('');
            setPaymentPreview(null);
            setCalculationComplete(false);
            return;
        }

        // Parse start date
        const startDateObj = new Date(startDate);
        if (isNaN(startDateObj.getTime())) {
            setFirstPaymentAmount('');
            setPaymentPreview(null);
            setCalculationComplete(false);
            return;
        }

        // If payment day is same as start date day, use regular amount
        if (startDateObj.getDate() === parseInt(paymentDay)) {
            setFirstPaymentAmount(paymentAmountNum.toString());
            setPaymentPreview({
                firstPaymentAmount: paymentAmountNum,
                includesNextMonth: false,
                daysUntilNextPayment: 0,
                explanation: "Payment day matches contract start day, so regular monthly payment applies.",
                startDateFormatted: startDateObj.toLocaleDateString(),
                paymentDayFormatted: startDateObj.toLocaleDateString()
            });
            setCalculationComplete(true);

            // Clear error for first payment amount when calculation is successful
            if (errors.firstPaymentAmount) {
                setErrors(prev => ({ ...prev, firstPaymentAmount: false }));
            }

            return;
        }

        // Get current month's length
        const currentMonth = startDateObj.getMonth();
        const currentYear = startDateObj.getFullYear();
        const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Calculate next payment date
        let nextPaymentMonth = currentMonth;
        let nextPaymentYear = currentYear;

        // If start date day is after payment day, next payment is in next month
        if (startDateObj.getDate() > parseInt(paymentDay)) {
            nextPaymentMonth = currentMonth + 1;
            if (nextPaymentMonth > 11) {
                nextPaymentMonth = 0;
                nextPaymentYear++;
            }
        }

        const nextPaymentDate = new Date(nextPaymentYear, nextPaymentMonth, parseInt(paymentDay));

        // If next payment day doesn't exist in that month (e.g., 31 in February),
        // use the last day of the month
        if (nextPaymentDate.getDate() !== parseInt(paymentDay)) {
            nextPaymentDate.setDate(0); // Last day of previous month
        }

        // Calculate days until next payment date
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysUntilNextPayment = Math.round((nextPaymentDate - startDateObj) / msPerDay);

        // Check if less than 10 days remain until next payment
        const includesNextMonth = daysUntilNextPayment < 10;

        // Calculate daily rate
        const dailyRate = paymentAmountNum / daysInCurrentMonth;

        // Calculate partial period amount
        let calculatedFirstPayment = daysUntilNextPayment * dailyRate;

        // If less than 10 days until next payment, add another full month
        if (includesNextMonth) {
            calculatedFirstPayment += paymentAmountNum;
        }

        // Round to 2 decimal places
        calculatedFirstPayment = Math.round(calculatedFirstPayment * 100) / 100;

        setFirstPaymentAmount(calculatedFirstPayment.toString());

        // Clear error for first payment amount when calculation is successful
        if (errors.firstPaymentAmount) {
            setErrors(prev => ({ ...prev, firstPaymentAmount: false }));
        }

        // Create explanatory text for preview
        let explanation = "";
        if (includesNextMonth) {
            explanation = `First payment includes ${daysUntilNextPayment} days until next payment date (${nextPaymentDate.toLocaleDateString()}) plus the next full month because less than 10 days remain.`;
        } else {
            explanation = `First payment covers ${daysUntilNextPayment} days until next payment date (${nextPaymentDate.toLocaleDateString()}).`;
        }

        setPaymentPreview({
            firstPaymentAmount: calculatedFirstPayment,
            includesNextMonth,
            daysUntilNextPayment,
            nextPaymentDate: nextPaymentDate.toLocaleDateString(),
            explanation,
            startDateFormatted: startDateObj.toLocaleDateString(),
            paymentDayFormatted: nextPaymentDate.toLocaleDateString()
        });

        setCalculationComplete(true);
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

    // Generic change handler that updates value and clears error
    const handleChange = (field, value) => {
        // Update the field value using the appropriate setter function
        switch (field) {
            case 'selectedUser':
                setSelectedUser(value);
                break;
            case 'contractType':
                setContractType(value);
                break;
            case 'content':
                setContent(value);
                break;
            case 'paymentType':
                setPaymentType(value);
                break;
            case 'paymentAmount':
                setPaymentAmount(value);
                break;
            case 'paymentInterval':
                setPaymentInterval(value);
                break;
            case 'paymentDay':
                setPaymentDay(value);
                break;
            case 'startDate':
                setStartDate(value);
                break;
            case 'validUntil':
                setValidUntil(value);
                break;
            case 'trainingTypes':
                setTrainingTypes(value);
                break;
            case 'firstPaymentAmount':
                setFirstPaymentAmount(value);
                break;
            default:
                break;
        }

        // Clear the error for this field
        if (errors[field]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: false
            }));
        }
    };

    // Handle start date change with automatic calculation
    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);

        // Clear the error for this field
        if (errors.startDate) {
            setErrors(prevErrors => ({
                ...prevErrors,
                startDate: false
            }));
        }

        // Calculation will happen in useEffect
    };

    // Handle payment day change with automatic calculation
    const handlePaymentDayChange = (e) => {
        const value = e.target.value;
        setPaymentDay(value);

        // Clear the error for this field
        if (errors.paymentDay) {
            setErrors(prevErrors => ({
                ...prevErrors,
                paymentDay: false
            }));
        }

        // Calculation will happen in useEffect
    };

    // Handle payment amount change with automatic calculation
    const handlePaymentAmountChange = (e) => {
        const value = e.target.value;
        setPaymentAmount(value);

        // Clear the error for this field
        if (errors.paymentAmount) {
            setErrors(prevErrors => ({
                ...prevErrors,
                paymentAmount: false
            }));
        }

        // Calculation will happen in useEffect
    };

    // Validate all form fields
    const validateForm = () => {
        const newErrors = {
            selectedUser: !selectedUser,
            contractType: !contractType,
            content: !content,
            paymentType: !paymentType,
            paymentAmount: !paymentAmount,
            paymentInterval: !paymentInterval,
            paymentDay: !paymentDay,
            startDate: !startDate,
            validUntil: !validUntil,
            trainingTypes: trainingTypes.length === 0,
            firstPaymentAmount: !firstPaymentAmount
        };

        setErrors(newErrors);

        // Check if any errors exist
        const hasErrors = Object.values(newErrors).some(error => error);

        if (hasErrors) {
            // Display generic validation error
            setValidationError('Please fill in all required fields before saving.');
        } else {
            setValidationError('');
        }

        return !hasErrors;
    };

    // Lepingu salvestamine
    const handleSave = async () => {
        // Validate all fields
        const isValid = validateForm();

        if (!isValid) {
            return; // Stop if validation failed
        }

        try {
            // Koostame payload
            const payload = {
                affiliateId,
                userId: selectedUser.id,
                contractType,
                content,
                paymentType,
                paymentAmount: paymentAmount ? parseFloat(paymentAmount) : null,
                paymentInterval,
                paymentDay: paymentDay ? parseInt(paymentDay, 10) : null,
                startDate,
                validUntil,
                trainingTypes, // Send as array, backend will convert to string
                isFirstPayment: true, // Always set to true for new contracts
                firstPaymentAmount: firstPaymentAmount ? parseFloat(firstPaymentAmount) : null,
                status: "draft"
            };

            let result;
            if (contractToEdit) {
                // Update existing contract
                payload.isFirstPayment = isFirstPayment; // Preserve the existing value
                result = await updateContract(contractToEdit.id, payload);
                showSuccessMessage('Contract updated successfully!');
            } else {
                // Create new contract
                result = await createContract(payload);
                showSuccessMessage('Contract created successfully!');
            }

            // Close on success after a short delay
            setTimeout(() => {
                setSuccessDialogOpen(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error(contractToEdit ? 'Error updating contract:' : 'Error creating contract:', error);
            showErrorMessage(contractToEdit ? 'Failed to update contract. Please try again.' : 'Failed to create contract. Please try again.');
        }
    };

    // Force recalculation
    const handleForceCalculate = () => {
        calculateFirstPayment();
    };

    // Handle training types change with error clearing
    const handleTrainingTypesChange = (event, newValue) => {
        setTrainingTypes(newValue);

        // Clear error if at least one type is selected
        if (newValue.length > 0 && errors.trainingTypes) {
            setErrors(prev => ({ ...prev, trainingTypes: false }));
        }
    };

    // Improved helper component tooltip (compact version)
    const InfoTooltip = ({ title }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <Box
                component="span"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    mr: 1,
                    position: 'relative',
                }}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <InfoIcon fontSize="small" color="action" sx={{ fontSize: '16px' }} />
                {isOpen && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '-40px',
                            left: '50%',
                            backgroundColor: 'rgba(97, 97, 97, 0.9)',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            maxWidth: '250px', // Piirab tooltip'i laiust
                            whiteSpace: 'normal', // Lubab tekstil murduda
                            zIndex: 1000,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                        }}
                    >
                        {title}
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{contractToEdit ? 'Edit Contract' : 'Create Contract'}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {contractToEdit
                        ? 'Edit the contract details below. All fields are required.'
                        : 'Fill the fields to create a new contract. All fields are required.'}
                </Typography>

                {/* Display validation error if any */}
                {validationError && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                        {validationError}
                    </Alert>
                )}

                {/* Kasutaja otsing (Autocomplete) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Search for a member" />
                    <Autocomplete
                        fullWidth
                        options={userOptions}
                        getOptionLabel={(option) => option.fullName || ''}
                        value={selectedUser}
                        onChange={(event, newValue) => {
                            setSelectedUser(newValue);
                            // Clear error when a user is selected
                            if (newValue && errors.selectedUser) {
                                setErrors(prev => ({ ...prev, selectedUser: false }));
                            }
                        }}
                        onInputChange={(event, newInputValue) => {
                            setUserQuery(newInputValue);
                        }}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search User by fullName *"
                                error={errors.selectedUser}
                                helperText={errors.selectedUser ? "User selection is required" : ""}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                                disabled={!!contractToEdit} // Disable when editing
                            />
                        )}
                        disabled={!!contractToEdit} // Disable entire component when editing
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
                        onChange={handleTrainingTypesChange}
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
                                label="Training Types *"
                                placeholder="Select training types"
                                error={errors.trainingTypes}
                                helperText={errors.trainingTypes ? "At least one training type is required" : ""}
                            />
                        )}
                    />
                </Box>

                {/* Contract type */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Contract name" />
                    <TextField
                        label="Contract Name *"
                        value={contractType}
                        onChange={(e) => handleChange('contractType', e.target.value)}
                        fullWidth
                        error={errors.contractType}
                        helperText={errors.contractType ? "Contract name is required" : ""}
                    />
                </Box>

                {/* Payment Type */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Type of payment" />
                    <TextField
                        label="Payment Type *"
                        value={paymentType}
                        onChange={(e) => handleChange('paymentType', e.target.value)}
                        fullWidth
                        error={errors.paymentType}
                        helperText={errors.paymentType ? "Payment type is required" : ""}
                    />
                </Box>

                {/* Payment Amount */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Regular monthly payment amount. If you want to receive transactions outside this application, then put it 0." />
                    <TextField
                        label="Monthly Payment Amount *"
                        type="number"
                        value={paymentAmount}
                        onChange={handlePaymentAmountChange}
                        fullWidth
                        error={errors.paymentAmount}
                        helperText={errors.paymentAmount ? "Payment amount is required" : ""}
                    />
                </Box>

                {/* Payment Interval (Select) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Frequency of payments" />
                    <FormControl fullWidth error={errors.paymentInterval}>
                        <InputLabel id="payment-interval-label">Payment Interval *</InputLabel>
                        <Select
                            labelId="payment-interval-label"
                            label="Payment Interval *"
                            value={paymentInterval}
                            onChange={(e) => handleChange('paymentInterval', e.target.value)}
                        >
                            <MenuItem value="month">Month</MenuItem>
                        </Select>
                        {errors.paymentInterval && (
                            <FormHelperText error>Payment interval is required</FormHelperText>
                        )}
                    </FormControl>
                </Box>

                {/* Payment Day (1..28) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Day of payment (1-28)" />
                    <TextField
                        label="Payment Day *"
                        type="number"
                        inputProps={{ min: 1, max: 28 }}
                        value={paymentDay}
                        onChange={handlePaymentDayChange}
                        fullWidth
                        error={errors.paymentDay}
                        helperText={errors.paymentDay ? "Payment day is required" : ""}
                    />
                </Box>

                {/* start date (kuupäev) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Contract start date" />
                    <TextField
                        label="Start Date *"
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        fullWidth
                        error={errors.startDate}
                        helperText={errors.startDate ? "Start date is required" : ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* First Payment Amount (auto-calculated and editable) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="First payment amount (auto-calculated based on start date and payment day)" />
                    <TextField
                        label="First Payment Amount *"
                        type="number"
                        value={firstPaymentAmount}
                        onChange={(e) => handleChange('firstPaymentAmount', e.target.value)}
                        fullWidth
                        error={errors.firstPaymentAmount}
                        helperText={errors.firstPaymentAmount ? "First payment amount is required" : ""}
                        InputProps={{
                            endAdornment: (
                                <Tooltip title="Recalculate first payment amount">
                                    <Button
                                        onClick={handleForceCalculate}
                                        sx={{ ml: 1 }}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<CalculateIcon />}
                                    >
                                        Calculate
                                    </Button>
                                </Tooltip>
                            ),
                        }}
                    />
                </Box>

                {/* First Payment Preview */}
                {paymentPreview && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight="bold">
                            First Payment Calculation:
                        </Typography>
                        <Typography variant="body2">
                            {paymentPreview.explanation}
                        </Typography>
                        {paymentPreview.includesNextMonth && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Period 1:</strong> {paymentPreview.startDateFormatted} to {paymentPreview.paymentDayFormatted} - {paymentPreview.daysUntilNextPayment} days
                                <br />
                                <strong>Period 2:</strong> Full next month
                                <br />
                                <strong>Total amount:</strong> {paymentPreview.firstPaymentAmount}€
                            </Typography>
                        )}
                    </Alert>
                )}

                {/* Valid Until (kuupäev) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Expiration date" />
                    <TextField
                        label="Valid Until *"
                        type="date"
                        value={validUntil}
                        onChange={(e) => handleChange('validUntil', e.target.value)}
                        fullWidth
                        error={errors.validUntil}
                        helperText={errors.validUntil ? "End date is required" : ""}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>

                {/* Lepingu sisu (textarea) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <InfoTooltip title="Contract text content" />
                    <FormControl fullWidth error={errors.content}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Contract Content *</Typography>
                        <TextareaAutosize
                            minRows={10}
                            value={content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                borderColor: errors.content ? '#d32f2f' : '#AAAAAA',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        {errors.content && (
                            <FormHelperText error>Contract content is required</FormHelperText>
                        )}
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                >
                    {contractToEdit ? 'Update Contract' : 'Save Contract'}
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