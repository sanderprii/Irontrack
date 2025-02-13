import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Autocomplete,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
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
    const [contractType, setContractType] = useState('MonthlyMembership');
    const [content, setContent] = useState('');

    // Uued väljad
    const [paymentType, setPaymentType] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentInterval, setPaymentInterval] = useState('month'); // default väärtus
    const [paymentDay, setPaymentDay] = useState(1);
    const [validUntil, setValidUntil] = useState('');

    // Laeme default contract template, kui modal avaneb
    useEffect(() => {
        if (open) {
            loadTemplate();
        }
    }, [open]);

    const loadTemplate = async () => {
        const template = await getLatestContractTemplate(affiliateId);
        if (template?.content) {
            setContent(template.content);
        }
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
        if (!selectedUser) {
            alert('Please select a user!');
            return;
        }
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
        };

        await createContract(payload);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Contract</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Fill the fields to create a new contract.
                </Typography>

                {/* Kasutaja otsing (Autocomplete) */}
                <Autocomplete
                    sx={{ mb: 2 }}
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

                {/* Contract type */}
                <TextField
                    label="Contract Type"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />



                {/* Payment Type */}
                <TextField
                    label="Payment Type"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                {/* Payment Amount */}
                <TextField
                    label="Payment Amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                {/* Payment Interval (Select) */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="payment-interval-label">Payment Interval</InputLabel>
                    <Select
                        labelId="payment-interval-label"
                        label="Payment Interval"
                        value={paymentInterval}
                        onChange={(e) => setPaymentInterval(e.target.value)}
                    >
                        <MenuItem value="month">Month</MenuItem>
                        <MenuItem value="year">Year</MenuItem>
                    </Select>
                </FormControl>

                {/* Payment Day (1..28) */}
                <TextField
                    label="Payment Day"
                    type="number"
                    inputProps={{ min: 1, max: 28 }}
                    value={paymentDay}
                    onChange={(e) => setPaymentDay(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                {/* Valid Until (kuupäev) */}
                <TextField
                    label="Valid Until"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                        shrink: true, // kuvab labeli korrektselt kuupäevavälja puhul
                    }}
                />
                {/* Lepingu sisu (textarea) */}
                <FormControl fullWidth margin="normal">
                    <TextareaAutosize
                        minRows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Contract
                </Button>
            </DialogActions>
        </Dialog>
    );
}
