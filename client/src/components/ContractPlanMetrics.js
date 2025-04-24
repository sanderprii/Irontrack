import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { analyticsApi } from '../api/analyticsApi';

const ContractPlanMetrics = ({ affiliateId, period }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, [period, affiliateId]);

    const loadMetrics = async () => {

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const result = await analyticsApi.getContractAndPlanMetrics(token, affiliateId, period);
            setMetrics(result);
        } catch (error) {
            console.error('Error loading contract and plan metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    if (loading) {
        return (
            <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                    Contract & Plan Overview
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {metrics?.periodLabel}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="subtitle1">
                                    Contract Clients
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h3" align="center" sx={{ my: 2, fontWeight: 'bold' }}>
                                {metrics?.contractClientsCount || 0}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Members with active contracts for this period
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <ReceiptIcon sx={{ mr: 1, color: 'info.main' }} />
                                <Typography variant="subtitle1">
                                    Non-Contract Clients
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h3" align="center" sx={{ my: 2, fontWeight: 'bold' }}>
                                {metrics?.nonContractClientsCount || 0}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Members with plans but no contracts for this period
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <AttachMoneyIcon sx={{ mr: 1, color: 'warning.main' }} />
                                <Typography variant="subtitle1">
                                    Plan Revenue
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h3" align="center" sx={{ my: 2, fontWeight: 'bold' }}>
                                {formatCurrency(metrics?.planRevenue || 0)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" align="center">
                                Total revenue from plans for this period
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                                <ShoppingCartIcon sx={{ mr: 1, color: 'success.main' }} />
                                <Typography variant="subtitle1">
                                    Plans Purchased by Type
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />

                            {metrics?.plansPurchasedByName?.length > 0 ? (
                                <TableContainer sx={{ mt: 2 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Plan Name</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {metrics.plansPurchasedByName.map((plan, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{plan.planName}</TableCell>
                                                    <TableCell align="right">{plan.count}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                    {metrics.totalPurchasedPlansCount || 0}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography variant="body1" color="textSecondary">
                                        No plans purchased during this period
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ContractPlanMetrics;