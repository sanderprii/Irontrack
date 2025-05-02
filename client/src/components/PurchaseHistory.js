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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InfoIcon from '@mui/icons-material/Info';
import PaymentIcon from "@mui/icons-material/Payment";

export default function PurchaseHistory({ userId, affiliateId }) {
    const [purchases, setPurchases] = useState([]);
    const [openRow, setOpenRow] = useState(null);

    const token = localStorage.getItem('token');
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/user/user-purchase-history?userId=${userId}&affiliateId=${affiliateId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setPurchases(data);
                } else {
                    setPurchases([]);
                }
            })
            .catch((err) => {
                console.error('Error loading purchase history:', err);
                setPurchases([]);
            });
    }, [token, userId, affiliateId]);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Row click handler for expansion
    const handleRowClick = (id) => {
        if (openRow === id) {
            setOpenRow(null);
        } else {
            setOpenRow(id);
        }
    };

    // Parse training types from JSON string
    const parseTrainingTypes = (trainingTypeString) => {
        try {
            return JSON.parse(trainingTypeString);
        } catch (e) {
            return [];
        }
    };

    // Calculate status based on end date
    const calculateStatus = (endDate) => {
        const now = new Date();
        const expDate = new Date(endDate);

        if (expDate < now) {
            return { label: "Expired", color: "error" };
        }

        const diffTime = Math.abs(expDate - now);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
            return { label: "Expiring Soon", color: "warning" };
        }

        return { label: "Active", color: "success" };
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ ml: 2 }}>
                Purchase History
            </Typography>
            <Paper>
                {purchases.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1">No purchase history available.</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>

                                <TableCell>Plan Name</TableCell>
                                <TableCell>Purchase Date</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {purchases.map((purchase) => {
                                const isOpen = openRow === purchase.id;
                                const trainingTypes = parseTrainingTypes(purchase.trainingType);
                                const status = calculateStatus(purchase.endDate);

                                return (
                                    <React.Fragment key={purchase.id}>
                                        {/* Main Row */}
                                        <TableRow
                                            hover
                                            onClick={() => handleRowClick(purchase.id)}
                                            sx={{ cursor: 'pointer' }}
                                        >

                                            <TableCell>{purchase.planName}</TableCell>
                                            <TableCell>{formatDate(purchase.purchasedAt)}</TableCell>

                                            <TableCell sx={{ fontWeight: 'bold' }}>{purchase.price} €</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={status.label}
                                                    color={status.color}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* Detail Row */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 2 }}>
                                                        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                            Purchase Details
                                                        </Typography>

                                                        <Grid container spacing={3}>
                                                            {/* Purchase Overview Card */}
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1} sx={{ height: '100%' }}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <ShoppingBagIcon sx={{ mr: 1 }} />
                                                                            Purchase Information
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                            {purchase.affiliateName && (
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Affiliate Name:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {purchase.affiliateName}
                                                                                </Typography>
                                                                            </Box>
                                                                            )}
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Plan Name:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {purchase.planName}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Purchase ID:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {purchase.id}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Purchase Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {new Date(purchase.purchasedAt).toLocaleString()}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Validity Period:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {purchase.validityDays} days
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Expiration Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {new Date(purchase.endDate).toLocaleString()}
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
                                                                                    Price:
                                                                                </Typography>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                                    {purchase.price} €
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    License Type:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    Single License
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Sessions:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {purchase.sessionsLeft === 9999 ? "Unlimited" : purchase.sessionsLeft}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Status:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={status.label}
                                                                                    color={status.color}
                                                                                />
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            {/* Plan Details Card */}
                                                            <Grid item xs={12}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <InfoIcon sx={{ mr: 1 }} />
                                                                            Plan Details
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Training Types:
                                                                                    </Typography>
                                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                                        {trainingTypes.map((type, index) => (
                                                                                            <Chip
                                                                                                key={index}
                                                                                                label={type}
                                                                                                size="small"
                                                                                                color="primary"
                                                                                            />
                                                                                        ))}
                                                                                    </Box>
                                                                                </Box>
                                                                            </Grid>


                                                                        </Grid>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
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
                )}
            </Paper>
        </Box>
    );
}