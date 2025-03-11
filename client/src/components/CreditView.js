// src/components/CreditView.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ml: 2}}>
                Credit
            </Typography>

            {/* Kui pole üldse credits, näita "Add Credit" vormi */}
            {credits.length === 0 && canAddCredit && (
                <Paper sx={{ mb: 4, p: 2 }}>
                    <Typography variant="h6">Add Credit</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                        <TextField
                            label="Amount"
                            type="number"
                            value={creditInputs['new']?.amount || ''}
                            onChange={(e) => handleInputChange('new', 'amount', e.target.value)}
                        />
                        <TextField
                            label="Description"
                            value={creditInputs['new']?.description || ''}
                            onChange={(e) => handleInputChange('new', 'description', e.target.value)}
                        />
                        <Button variant="contained" onClick={() => handleAddCredit('new', affiliateId)}>
                            Apply
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Credits-tabel */}
            <Paper sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Credit Amount</TableCell>
                            <TableCell>Affiliate</TableCell>
                            {canAddCredit && <TableCell>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {credits.map((credit) => (
                            <React.Fragment key={credit.id}>
                                <TableRow>
                                    <TableCell>{credit.credit} €</TableCell>
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
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                                                <TextField
                                                    label="Amount"
                                                    type="number"
                                                    value={creditInputs[credit.id]?.amount || ''}
                                                    onChange={(e) => handleInputChange(credit.id, 'amount', e.target.value)}
                                                />
                                                <TextField
                                                    label="Description"
                                                    value={creditInputs[credit.id]?.description || ''}
                                                    onChange={(e) => handleInputChange(credit.id, 'description', e.target.value)}
                                                />
                                                <Button variant="contained" onClick={() => handleAddCredit(credit.id, credit.affiliateId)}>
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
            </Paper>

            {/* Credit History tabel */}
            <Typography variant="h6" gutterBottom sx={{ml: 2}}>
                Credit History
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {creditHistory.map((entry) => (
                            <React.Fragment key={entry.id}>
                                {/* Peamine rida */}
                                <TableRow
                                    hover
                                    onClick={() => handleHistoryRowClick(entry.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell>
                                        {new Date(entry.createdAt).toLocaleDateString('et-EE', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>{entry.description}</TableCell>
                                    <TableCell>
                                        {entry.decrease ? '-' : '+'}{entry.amount}€
                                    </TableCell>
                                </TableRow>

                                {/* Kui rida on avatud => Näitame detailset vaadet */}
                                {openHistoryRow === entry.id && (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ bgcolor: '#f5f5f5' }}>
                                            <Box sx={{ p: 1 }}>
                                                <Typography variant="subtitle2">
                                                    Details:
                                                </Typography>
                                                <Typography variant="body2">ID: {entry.id}</Typography>
                                                <Typography variant="body2">Invoice Number: {entry.invoiceNumber}</Typography>
                                                <Typography variant="body2">Status: {entry.status}</Typography>
                                                <Typography variant="body2">Type: {entry.type}</Typography>
                                                <Typography variant="body2">isCredit: {String(entry.isCredit)}</Typography>
                                                <Typography variant="body2">decrease: {String(entry.decrease)}</Typography>
                                                <Typography variant="body2">Affiliate ID: {entry.affiliateId}</Typography>
                                                <Typography variant="body2">Credit ID: {entry.creditId}</Typography>
                                                {/* ... Kui tahad kuvada ka planId, memberId, jms ... */}
                                                <Typography variant="body2">Plan ID: {entry.planId}</Typography>
                                                <Typography variant="body2">Member ID: {entry.memberId}</Typography>

                                                {/* Kui sul on seal veel välju, võid neid lisada */}
                                                {/* <pre>{JSON.stringify(entry, null, 2)}</pre> */}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default CreditView;
