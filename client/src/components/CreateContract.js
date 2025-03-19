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
    Box,
} from '@mui/material';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

    // Helper komponent tooltip ikooniga
    const InfoTooltip = ({ title }) => (
        <Tooltip
            title={title}
            arrow
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={1500}
        >
            <IconButton
                size="small"
                sx={{
                    mr: 1,
                    margin: 0,
                    padding: 0,
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                    }
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                tabIndex={0}
            >
                <HelpOutlineIcon fontSize="small" color="action" />
            </IconButton>
        </Tooltip>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Contract</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Fill the fields to create a new contract.
                </Typography>

                {/* Kasutaja otsing (Autocomplete) */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Search for a member by their full name" />
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

                {/* Contract type */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Type of contract (e.g. Monthly Membership, Annual Membership)" />
                    <TextField
                        label="Contract Type"
                        value={contractType}
                        onChange={(e) => setContractType(e.target.value)}
                        fullWidth
                    />
                </Box>



                {/* Payment Amount */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoTooltip title="Amount to be charged in each payment period" />
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
                    <InfoTooltip title="Frequency of payments (monthly or yearly)" />
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
                    <InfoTooltip title="Day of the month when payment will be processed (1-28)" />
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
                    <InfoTooltip title="Date when the contract expires" />
                    <TextField
                        label="Valid Until"
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true, // kuvab labeli korrektselt kuupäevavälja puhul
                        }}
                    />
                </Box>

                {/* Lepingu sisu (textarea) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <InfoTooltip title="Full text content of the contract" />
                    <FormControl fullWidth>
                        <TextareaAutosize
                            minRows={6}
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
        </Dialog>
    );
}