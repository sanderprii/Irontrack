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
    IconButton
} from '@mui/material';
import { getUserTransactions } from '../api/creditApi';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DateRangeIcon from '@mui/icons-material/DateRange';

const Transactions = ({ user, affiliateId }) => {
    const [transactions, setTransactions] = useState([]);
    const [openRow, setOpenRow] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUserTransactions(affiliateId, user.id);
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setTransactions([]);
            }
        };
        fetchData();
    }, [user.id, affiliateId]);

    const handleRowClick = (id) => {
        if (openRow === id) {
            setOpenRow(null);
        } else {
            setOpenRow(id);
        }
    };

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
            <Typography variant="h5" gutterBottom sx={{ ml: 2 }}>
                Transactions
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell width="50px"></TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((tx) => {
                            const sign = tx.decrease ? '-' : '+';
                            const displayAmount = `${sign}${tx.amount}`;
                            const isOpen = openRow === tx.id;

                            return (
                                <React.Fragment key={tx.id}>
                                    {/* Main Row */}
                                    <TableRow
                                        hover
                                        onClick={() => handleRowClick(tx.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <IconButton size="small">
                                                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>{formatDate(tx.createdAt)}</TableCell>
                                        <TableCell>{tx.description}</TableCell>
                                        <TableCell sx={{
                                            color: tx.decrease ? '#e74c3c' : '#2ecc71',
                                            fontWeight: 'bold'
                                        }}>
                                            {displayAmount} €
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tx.status || "N/A"}
                                                color={
                                                    tx.status === 'completed' ? 'success' :
                                                        tx.status === 'pending' ? 'warning' :
                                                            tx.status === 'failed' ? 'error' :
                                                                'default'
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {/* Detail Row */}
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                        Transaction Details
                                                    </Typography>

                                                    <Grid container spacing={3}>
                                                        {/* Transaction Overview Card */}
                                                        <Grid item xs={12} md={6}>
                                                            <Card elevation={1} sx={{ height: '100%' }}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <ReceiptIcon sx={{ mr: 1 }} />
                                                                        Invoice Information
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                ID:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {tx.id}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Invoice Number:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {tx.invoiceNumber || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Status:
                                                                            </Typography>
                                                                            <Chip
                                                                                label={tx.status || "N/A"}
                                                                                color={
                                                                                    tx.status === 'completed' ? 'success' :
                                                                                        tx.status === 'pending' ? 'warning' :
                                                                                            tx.status === 'failed' ? 'error' :
                                                                                                'default'
                                                                                }
                                                                                size="small"
                                                                            />
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Type:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {tx.type || 'N/A'}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Affiliate ID:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {tx.affiliateId}
                                                                            </Typography>
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
                                                                        Payment Information
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Amount:
                                                                            </Typography>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: tx.decrease ? '#e74c3c' : '#2ecc71' }}>
                                                                                {displayAmount} €
                                                                            </Typography>
                                                                        </Box>



                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Credit Operation:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {tx.isCredit ? "Yes" : "No"}
                                                                            </Typography>
                                                                        </Box>

                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                Created At:
                                                                            </Typography>
                                                                            <Typography variant="body1">
                                                                                {new Date(tx.createdAt).toLocaleString()}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Description Card */}
                                                        <Grid item xs={12}>
                                                            <Card elevation={1}>
                                                                <CardContent>
                                                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                        <DescriptionIcon sx={{ mr: 1 }} />
                                                                        Description
                                                                    </Typography>
                                                                    <Divider sx={{ mb: 2 }} />

                                                                    <Box sx={{ p: 1 }}>
                                                                        <Typography variant="body1">
                                                                            {tx.description || "No description available"}
                                                                        </Typography>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>

                                                        {/* Additional Info Card - for any other properties */}
                                                        {(tx.planId || tx.memberId) && (
                                                            <Grid item xs={12}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <DateRangeIcon sx={{ mr: 1 }} />
                                                                            Additional Information
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Grid container spacing={2}>
                                                                            {tx.planId && (
                                                                                <Grid item xs={6}>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                                                            Plan ID:
                                                                                        </Typography>
                                                                                        <Typography variant="body1">
                                                                                            {tx.planId}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Grid>
                                                                            )}
                                                                            {tx.memberId && (
                                                                                <Grid item xs={6}>
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                                                            Member ID:
                                                                                        </Typography>
                                                                                        <Typography variant="body1">
                                                                                            {tx.memberId}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Grid>
                                                                            )}
                                                                        </Grid>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        )}
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
            </Paper>
        </Box>
    );
};

export default Transactions;