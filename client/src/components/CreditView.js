// src/components/CreditView.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getUserCredits, addCredit } from '../api/creditApi';

const CreditView = ({ user, affiliateId }) => {
    // Algväärtused on tühjad massiivid
    const [credits, setCredits] = useState([]);

    // Juba olemasolev AddCredit plokk
    const [openRow, setOpenRow] = useState(null);
    const [creditInputs, setCreditInputs] = useState({});

    // Laadime kasutaja krediidi andmed
    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const data = await getUserCredits(affiliateId, user.id);
                setCredits(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching credits", error);
                setCredits([]);
            }
        };
        fetchCredits();
    }, [affiliateId, user.id]);

    const handleToggleAdd = (creditId) => {
        if (openRow === creditId) {
            setOpenRow(null);
        } else {
            setOpenRow(creditId);
            setCreditInputs((prev) => ({
                ...prev,
                [creditId]: { amount: '', description: '' }
            }));
        }
    };

    const handleInputChange = (creditId, field, value) => {
        setCreditInputs((prev) => ({
            ...prev,
            [creditId]: {
                ...prev[creditId],
                [field]: value
            }
        }));
    };

    // Check if inputs for a specific credit ID are valid
    const areInputsValid = (creditId) => {
        const inputs = creditInputs[creditId];
        if (!inputs) return false;

        const amount = inputs.amount?.trim();
        const description = inputs.description?.trim();

        // Both fields must be filled and amount must be a valid number
        return amount && description && !isNaN(parseFloat(amount));
    };

    const handleAddCredit = async (creditId, affiliateId) => {
        // Additional validation before proceeding
        if (!areInputsValid(creditId)) {
            return;
        }

        const inputs = creditInputs[creditId];
        const amount = parseFloat(inputs.amount);
        const description = inputs.description;

        try {
            await addCredit(user.id, affiliateId, amount, description);
            // Värskendame andmeid pärast edukat API vastust
            const updatedCredits = await getUserCredits(affiliateId, user.id);
            setCredits(Array.isArray(updatedCredits) ? updatedCredits : []);
            setOpenRow(null);
        } catch (error) {
            console.error("Error adding credit", error);
        }
    };

    const role = localStorage.getItem('role');

    // Lisamise funktsiooni võib kasutada ainult, kui kasutaja roll on affiliate või trainer
    const canAddCredit = role === 'affiliate';

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ml: 2, fontWeight: 'bold'}}>
                Credit
            </Typography>

            {/* Kui pole üldse credits, näita "Add Credit" vormi */}
            {credits.length === 0 && canAddCredit && (
                <Card elevation={2} sx={{ mb: 4, overflow: 'visible' }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AddCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                            Add Credit
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="Amount"
                                type="number"
                                value={creditInputs['new']?.amount || ''}
                                onChange={(e) => handleInputChange('new', 'amount', e.target.value)}
                                InputProps={{
                                    startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>€</Box>,
                                }}
                            />
                            <TextField
                                label="Description"
                                value={creditInputs['new']?.description || ''}
                                onChange={(e) => handleInputChange('new', 'description', e.target.value)}
                                sx={{ flexGrow: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleAddCredit('new', affiliateId)}
                                startIcon={<AddCircleIcon />}
                                disabled={!areInputsValid('new')}
                                sx={{
                                    opacity: areInputsValid('new') ? 1 : 0.7,
                                    cursor: areInputsValid('new') ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Apply
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Credits-tabel */}
            <Card elevation={2} sx={{ mb: 4, overflow: 'hidden', mx: { xs: 0, sm: 2, md: 2, lg: 2 } }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AccountBalanceWalletIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Available Credit
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                </CardContent>

                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Credit Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Affiliate</TableCell>
                            {canAddCredit && <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {credits.map((credit) => (
                            <React.Fragment key={credit.id}>
                                <TableRow>
                                    <TableCell>
                                        <Typography sx={{ fontWeight: 'bold', color: '#2ecc71' }}>
                                            {credit.credit} €
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{credit.affiliate?.name}</TableCell>
                                    {canAddCredit && (
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                startIcon={<AddCircleIcon />}
                                                onClick={() => handleToggleAdd(credit.id)}
                                            >
                                                Add Credit
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                                {openRow === credit.id && (
                                    <TableRow>
                                        <TableCell colSpan={canAddCredit ? 3 : 2}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, backgroundColor: '#f8f9fa' }}>
                                                <TextField
                                                    label="Amount"
                                                    type="number"
                                                    value={creditInputs[credit.id]?.amount || ''}
                                                    onChange={(e) => handleInputChange(credit.id, 'amount', e.target.value)}
                                                    InputProps={{
                                                        startAdornment: <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>€</Box>,
                                                    }}
                                                />
                                                <TextField
                                                    label="Description"
                                                    value={creditInputs[credit.id]?.description || ''}
                                                    onChange={(e) => handleInputChange(credit.id, 'description', e.target.value)}
                                                    sx={{ flexGrow: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleAddCredit(credit.id, credit.affiliateId)}
                                                    startIcon={<AddCircleIcon />}
                                                    disabled={!areInputsValid(credit.id)}
                                                    sx={{
                                                        opacity: areInputsValid(credit.id) ? 1 : 0.7,
                                                        cursor: areInputsValid(credit.id) ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
};

export default CreditView;