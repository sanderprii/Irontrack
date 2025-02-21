import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { getUserTransactions } from '../api/creditApi'; // eeldame, et seal on funktsioon getUserTransactions

const Transactions = ({ user, affiliateId }) => {
    const [transactions, setTransactions] = useState([]);
    const [openRow, setOpenRow] = useState(null); // hoiab ID-d, mille all detailid on lahti

    useEffect(() => {
        const fetchData = async () => {
            try {
                // user.id => userId; affiliateId => kas tühi või number
                const data = await getUserTransactions(affiliateId, user.id);
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setTransactions([]);
            }
        };
        fetchData();
    }, [user.id, affiliateId]);

    // Kui klikime rea peale, avame või sulgeme detailvaate
    const handleRowClick = (id) => {
        if (openRow === id) {
            setOpenRow(null);
        } else {
            setOpenRow(id);
        }
    };

    // Abifunktsioon formindamiseks
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
            <Typography variant="h5" gutterBottom sx={{ml: 2}}>
                Transactions
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Created At</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx) => {
                            // Vastavalt decrease väärtusele lisame + või -
                            const sign = tx.decrease ? '-' : '+';
                            const displayAmount = `${sign}${tx.amount}`;

                            return (
                                <React.Fragment key={tx.id}>
                                    {/* PÕHIRIDA */}
                                    <TableRow
                                        hover
                                        onClick={() => handleRowClick(tx.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell>{displayAmount} €</TableCell>
                                    </TableRow>

                                    {/* DETAILRIDA (kuvatakse ainult siis, kui see rida on avatud) */}
                                    {openRow === tx.id && (
                                        <TableRow>
                                            {/* colspan = veergude arv, mis põhitabelis on */}
                                            <TableCell colSpan={3} sx={{ bgcolor: '#f5f5f5' }}>
                                                <Box sx={{ p: 2 }}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Transaction Details
                                                    </Typography>
                                                    {/* Siin kuvad KÕIK tx objektis leiduvad andmed, nt invoiceNumber, status, isCredit jne */}
                                                    <Typography variant="body2">ID: {tx.id}</Typography>
                                                    <Typography variant="body2">Invoice Number: {tx.invoiceNumber}</Typography>
                                                    <Typography variant="body2">Status: {tx.status}</Typography>
                                                    <Typography variant="body2">Type: {tx.type}</Typography>
                                                    <Typography variant="body2">isCredit: {String(tx.isCredit)}</Typography>
                                                    <Typography variant="body2">decrease: {String(tx.decrease)}</Typography>
                                                    <Typography variant="body2">Affiliate ID: {tx.affiliateId}</Typography>
                                                    <Typography variant="body2">Credit ID: {tx.creditId}</Typography>
                                                    {/* ... Kui tahad kuvada ka planId, memberId, jms ... */}
                                                    <Typography variant="body2">Plan ID: {tx.planId}</Typography>
                                                    <Typography variant="body2">Member ID: {tx.memberId}</Typography>

                                                    {/* Võid lisada ka JSON formaadi: */}
                                                    {/* <pre>{JSON.stringify(tx, null, 2)}</pre> */}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default Transactions;
