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
    IconButton,
    Collapse,
    Card,
    CardContent,
    Divider,
    Chip,
    Grid
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { getUserCredits, getCreditHistory, addCredit } from '../api/creditApi';

const CreditView = ({ user, affiliateId }) => {
    // Algväärtused on tühjad massiivid
    const [credits, setCredits] = useState([]);
    const [creditHistory, setCreditHistory] = useState([]);

    // Juba olemasolev AddCredit plokk
    const [openRow, setOpenRow] = useState(null);
    const [creditInputs, setCreditInputs] = useState({});

    // UUS state detailivaate avamiseks creditHistory reas
    const [openHistoryRow, setOpenHistoryRow] = useState(null);

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

    // Laadime krediidi ajalugu
    useEffect(() => {
        const fetchCreditHistory = async () => {
            try {
                const data = await getCreditHistory(affiliateId, user.id);
                setCreditHistory(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching credit history", error);
                setCreditHistory([]);
            }
        };
        fetchCreditHistory();
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

    const handleAddCredit = async (creditId, affiliateId) => {
        const inputs = creditInputs[creditId];
        const amount = parseFloat(inputs.amount);
        const description = inputs.description;
        if (isNaN(amount)) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            await addCredit(user.id, affiliateId, amount, description);
            // Värskendame andmeid pärast edukat API vastust
            const updatedCredits = await getUserCredits(affiliateId, user.id);
            setCredits(Array.isArray(updatedCredits) ? updatedCredits : []);
            const updatedHistory = await getCreditHistory(affiliateId, user.id);
            setCreditHistory(Array.isArray(updatedHistory) ? updatedHistory : []);
            setOpenRow(null);
        } catch (error) {
            console.error("Error adding credit", error);
        }
    };

    // Kui klikime CreditHistory rea peale, avame/sulgeme detailvaate
    const handleHistoryRowClick = (id) => {
        if (openHistoryRow === id) {
            setOpenHistoryRow(null);
        } else {
            setOpenHistoryRow(id);
        }
    };

    const role = localStorage.getItem('role');

    // Lisamise funktsiooni võib kasutada ainult, kui kasutaja roll on affiliate või trainer
    const canAddCredit = role === 'affiliate';

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('et-EE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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
                            >
                                Apply
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Credits-tabel */}
            <Card elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
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

            {/* Credit History tabel */}
            <Card elevation={2} sx={{ overflow: 'hidden' }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Credit History
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                </CardContent>

                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell width="50px"></TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {creditHistory.map((entry) => (
                            <React.Fragment key={entry.id}>
                                {/* Peamine rida */}
                                <TableRow
                                    hover
                                    onClick={() => handleHistoryRowClick(entry.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        <IconButton size="small">
                                            {openHistoryRow === entry.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell>
                                        <Typography sx={{
                                            fontWeight: 'bold',
                                            color: entry.decrease ? '#e74c3c' : '#2ecc71'
                                        }}>
                                            {entry.decrease ? '-' : '+'}{entry.amount}€
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {/* Kui rida on avatud => Näitame detailset vaadet */}
                                <TableRow>
                                    <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse in={openHistoryRow === entry.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                    Transaction Details
                                                </Typography>

                                                <Grid container spacing={3}>
                                                    {/* Transaction Information Card */}
                                                    <Grid item xs={12} md={6}>
                                                        <Card elevation={1} sx={{ height: '100%' }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                    <ReceiptIcon sx={{ mr: 1 }} />
                                                                    Transaction Information
                                                                </Typography>
                                                                <Divider sx={{ mb: 2 }} />

                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            ID:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {entry.id}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Invoice Number:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {entry.invoiceNumber || 'N/A'}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Date:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {formatDate(entry.createdAt)}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Status:
                                                                        </Typography>
                                                                        <Chip
                                                                            label={entry.status || 'N/A'}
                                                                            color={
                                                                                entry.status === 'completed' ? 'success' :
                                                                                    entry.status === 'pending' ? 'warning' :
                                                                                        entry.status === 'failed' ? 'error' :
                                                                                            'default'
                                                                            }
                                                                            size="small"
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>

                                                    {/* Payment Information Card */}
                                                    <Grid item xs={12} md={6}>
                                                        <Card elevation={1} sx={{ height: '100%' }}>
                                                            <CardContent>
                                                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                    <PaymentIcon sx={{ mr: 1 }} />
                                                                    Payment Details
                                                                </Typography>
                                                                <Divider sx={{ mb: 2 }} />

                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Amount:
                                                                        </Typography>
                                                                        <Typography variant="body1" sx={{
                                                                            fontWeight: 'bold',
                                                                            color: entry.decrease ? '#e74c3c' : '#2ecc71'
                                                                        }}>
                                                                            {entry.decrease ? '-' : '+'}{entry.amount} €
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Type:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {entry.type || 'N/A'}
                                                                        </Typography>
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Direction:
                                                                        </Typography>
                                                                        <Chip
                                                                            label={entry.decrease ? "Debit" : "Credit"}
                                                                            color={entry.decrease ? "error" : "success"}
                                                                            size="small"
                                                                        />
                                                                    </Box>

                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                            Credit Operation:
                                                                        </Typography>
                                                                        <Typography variant="body1">
                                                                            {entry.isCredit ? "Yes" : "No"}
                                                                        </Typography>
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
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </Box>
    );
};

export default CreditView;