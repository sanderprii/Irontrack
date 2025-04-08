import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Collapse,
    IconButton,
    Card,
    CardContent,
    Divider,
    Chip
} from "@mui/material";
import { getOrders, getFinanceData } from "../api/financeApi";
import { getAffiliateTransactions } from "../api/creditApi";
import { getOwnerAffiliateId } from "../api/membersApi";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DateRangeIcon from '@mui/icons-material/DateRange';


export default function FinanceView() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("0");
    const [activeTab, setActiveTab] = useState("orders");
    const [affiliateId, setAffiliateId] = useState(null);
    const [expandedTransactionId, setExpandedTransactionId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // New state for expanded order
    const [transactions, setTransactions] = useState([]);
    const [transactionSearchQuery, setTransactionSearchQuery] = useState("");

    // Finance data
    const [revenue, setRevenue] = useState(0);
    const [activeMembers, setActiveMembers] = useState(0);
    const [expiredMembers, setExpiredMembers] = useState(0);
    const [totalMembers, setTotalMembers] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 1. Initial fetch of affiliate ID
    useEffect(() => {
        fetchAffiliateId();
    }, []);

    // 2. Fetch data when affiliate ID is available
    useEffect(() => {
        if (affiliateId) {
            fetchOrders();
            fetchFinance();
            fetchTransactions();
        }
    }, [affiliateId, startDate, endDate]);

    const fetchAffiliateId = async () => {
        try {
            const response = await getOwnerAffiliateId();
            setAffiliateId(response.affiliateId || null);
        } catch (error) {
            console.error("❌ Error fetching affiliate ID:", error);
        }
    };

    const fetchOrders = async () => {
        if (!affiliateId) return;
        try {
            const response = await getOrders(affiliateId);
            if (!Array.isArray(response)) {
                console.error("❌ API ERROR: Orders response is not an array", response);
                setOrders(Array.isArray(response) ? response : []);
            } else {
                setOrders(response || []);
            }
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            setOrders([]);
        }
    };

    const fetchFinance = async () => {
        if (!affiliateId) return;
        try {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            params.append("affiliateId", affiliateId);

            const response = await getFinanceData(params);

            if (response) {
                setRevenue(response.revenue || 0);
                setActiveMembers(response.activeMembers || 0);
                setExpiredMembers(response.expiredMembers || 0);
                setTotalMembers(response.totalMembers || 0);
            }
        } catch (error) {
            console.error("❌ Error fetching finance data:", error);
        }
    };

    const fetchTransactions = async () => {
        if (!affiliateId) return;
        try {
            const response = await getAffiliateTransactions(affiliateId);
            if (Array.isArray(response)) {
                setTransactions(response);
            } else {
                console.error("❌ API ERROR: Transactions response is not an array", response);
                setTransactions([]);
            }
        } catch (error) {
            console.error("❌ Error fetching transactions:", error);
            setTransactions([]);
        }
    };

    // Transaction handling
    const handleTransactionClick = (transactionId) => {
        if (expandedTransactionId === transactionId) {
            setExpandedTransactionId(null); // collapse if already expanded
        } else {
            setExpandedTransactionId(transactionId); // expand the clicked transaction
        }
    };

    // Order handling - new handler for order expansion
    const handleOrderClick = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null); // collapse if already expanded
        } else {
            setExpandedOrderId(orderId); // expand the clicked order
        }
    };

    const handleTransactionSearchChange = (event) => {
        setTransactionSearchQuery(event.target.value || "");
    };

    // Search and sort
    const handleSearchChange = (event) => setSearchQuery(event.target.value || "");
    const handleSortChange = (event) => setSortBy(event.target.value);

    // Date filters
    const handleDateFilter = (e) => {
        e.preventDefault();
        fetchFinance();
    };
    const handleLastYear = () => {
        const lastYear = new Date().getFullYear() - 1;
        setStartDate(`${lastYear}-01-01`);
        setEndDate(`${lastYear}-12-31`);
        fetchFinance();
    };
    const handleCurrentYear = () => {
        const currentYear = new Date().getFullYear();
        setStartDate(`${currentYear}-01-01`);
        setEndDate(`${currentYear}-12-31`);
        fetchFinance();
    };

    // Calculate days left until expiration
    const calculateDaysLeft = (endDate) => {
        const today = new Date();
        const expDate = new Date(endDate);
        const diffTime = Math.abs(expDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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

    // Filter and sort
    const filteredOrders = (orders || []).filter(order =>
        ((order?.user?.fullName.toLowerCase() ?? "").includes(searchQuery.toLowerCase())) ||
        ((order?.planName.toLowerCase() ?? "").includes(searchQuery.toLowerCase()))
    );
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case "1":
                return a.planName.localeCompare(b.planName);
            case "2":
                return b.price - a.price;
            case "3":
                return new Date(b.purchasedAt) - new Date(a.purchasedAt);
            default:
                return a.user.fullName.localeCompare(b.user.fullName);
        }
    });

    // Filter transactions
    const filteredTransactions = (transactions || []).filter(transaction => {
        const searchLower = transactionSearchQuery.toLowerCase();
        return (
            (transaction?.invoiceNumber?.toLowerCase() || "").includes(searchLower) ||
            (transaction?.user?.fullName?.toLowerCase() || "").includes(searchLower)
        );
    });

    return (
        <Container maxWidth={false}>
            <Box textAlign="center" my={4}>
                <Typography variant="h5" color="primary">Finance</Typography>
            </Box>

            {/* Tabs: Orders vs Finance vs Transactions */}
            <Box display="flex" justifyContent="center" mb={3}>
                <Button
                    variant={activeTab === "orders" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setActiveTab("orders")}
                    sx={{ mx: 1 }}
                >
                    Orders History
                </Button>
                <Button
                    variant={activeTab === "finance" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setActiveTab("finance")}
                    sx={{ mx: 1 }}
                >
                    Finance
                </Button>
                <Button
                    variant={activeTab === "transactions" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setActiveTab("transactions")}
                    sx={{ mx: 1 }}
                >
                    Transactions
                </Button>
            </Box>

            {/* REDESIGNED Orders History */}
            {activeTab === "orders" && (
                <Box my={3}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Orders History</Typography>

                    {/* Search and Sort Controls */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Search by user or plan..."
                                fullWidth
                                onChange={handleSearchChange}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                <MenuItem value="0">Sort by User</MenuItem>
                                <MenuItem value="1">Sort by Plan</MenuItem>
                                <MenuItem value="2">Sort by Price</MenuItem>
                                <MenuItem value="3">Sort by Purchased Date</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    {/* Orders Table with Expandable Rows */}
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell width="50px"></TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Plan</TableCell>
                                    <TableCell>Price (€)</TableCell>
                                    <TableCell>Purchased At</TableCell>
                                    <TableCell>Valid Until</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedOrders.map(order => {
                                    const isOpen = expandedOrderId === order.id;
                                    const status = calculateStatus(order.endDate);

                                    return (
                                        <React.Fragment key={order.id}>
                                            {/* Main Order Row */}
                                            <TableRow
                                                hover
                                                onClick={() => handleOrderClick(order.id)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell>
                                                    <IconButton size="small">
                                                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{order.user.fullName}</TableCell>
                                                <TableCell>{order.planName}</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>€{order.price.toFixed(2)}</TableCell>
                                                <TableCell>{new Date(order.purchasedAt).toLocaleDateString()}</TableCell>
                                                <TableCell>{new Date(order.endDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={status.label}
                                                        color={status.color}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>

                                            {/* Expanded Details Row */}
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 2 }}>
                                                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3 }}>
                                                                Order Details
                                                            </Typography>

                                                            <Grid container spacing={3}>
                                                                {/* User Information Card */}
                                                                <Grid item xs={12} md={6}>
                                                                    <Card elevation={1} sx={{ height: '100%' }}>
                                                                        <CardContent>
                                                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                                <PersonIcon sx={{ mr: 1 }} />
                                                                                Customer Information
                                                                            </Typography>
                                                                            <Divider sx={{ mb: 2 }} />

                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Name:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {order.user.fullName}
                                                                                    </Typography>
                                                                                </Box>

                                                                                {order.user.email && (
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                            Email:
                                                                                        </Typography>
                                                                                        <Typography variant="body1">
                                                                                            {order.user.email}
                                                                                        </Typography>
                                                                                    </Box>
                                                                                )}


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
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2ecc71' }}>
                                                                                        €{order.price.toFixed(2)}
                                                                                    </Typography>
                                                                                </Box>

                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Payment Date:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {new Date(order.purchasedAt).toLocaleString()}
                                                                                    </Typography>
                                                                                </Box>

                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                                                                <Grid item xs={12} md={6}>
                                                                    <Card elevation={1}>
                                                                        <CardContent>
                                                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                                <FitnessCenterIcon sx={{ mr: 1 }} />
                                                                                Plan Details
                                                                            </Typography>
                                                                            <Divider sx={{ mb: 2 }} />

                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Plan Name:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {order.planName}
                                                                                    </Typography>
                                                                                </Box>


                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Sessions Left:
                                                                                    </Typography>
                                                                                    <Chip
                                                                                        label={order.sessionsLeft === 9999 ? "Unlimited" : order.sessionsLeft}
                                                                                        color={order.sessionsLeft > 5 ? "success" : order.sessionsLeft > 0 ? "warning" : "error"}
                                                                                        size="small"
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>

                                                                {/* Membership Timeline Card */}
                                                                <Grid item xs={12} md={6}>
                                                                    <Card elevation={1}>
                                                                        <CardContent>
                                                                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                                <DateRangeIcon sx={{ mr: 1 }} />
                                                                                Membership Timeline
                                                                            </Typography>
                                                                            <Divider sx={{ mb: 2 }} />

                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Start Date:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {new Date(order.purchasedAt).toLocaleString()}
                                                                                    </Typography>
                                                                                </Box>

                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        End Date:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {new Date(order.endDate).toLocaleString()}
                                                                                    </Typography>
                                                                                </Box>

                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Days Left:
                                                                                    </Typography>
                                                                                    <Chip
                                                                                        label={`${calculateDaysLeft(order.endDate)} days`}
                                                                                        color={status.color}
                                                                                        size="small"
                                                                                    />
                                                                                </Box>

                                                                                {order.validityDays && (
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                            Validity Period:
                                                                                        </Typography>
                                                                                        <Typography variant="body1">
                                                                                            {order.validityDays} days
                                                                                        </Typography>
                                                                                    </Box>
                                                                                )}
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
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Finance Section - Unchanged */}
            {activeTab === "finance" && (
                <Box my={4}>
                    <Typography variant="h6">Financial Summary</Typography>

                    <form onSubmit={handleDateFilter}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={6}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button onClick={handleLastYear} variant="outlined" sx={{ mr: 1 }}>
                                Last Year
                            </Button>
                            <Button onClick={handleCurrentYear} variant="outlined" sx={{ mr: 1 }}>
                                Current Year
                            </Button>
                            <Button type="submit" variant="contained">Update</Button>
                        </Box>
                    </form>

                    <Typography>Total Revenue: <strong>€{revenue.toFixed(2)}</strong></Typography>
                    <Typography>Active Members: <strong>{activeMembers}</strong></Typography>
                    <Typography>Expired Members: <strong>{expiredMembers}</strong></Typography>
                    <Typography>Total Members: <strong>{totalMembers}</strong></Typography>
                </Box>
            )}

            {/* Transactions Section - Unchanged */}
            {activeTab === "transactions" && (
                <Box my={3}>
                    <Typography variant="h6">Transactions</Typography>
                    <TextField
                        label="Search by invoice number or user..."
                        fullWidth
                        onChange={handleTransactionSearchChange}
                        margin="normal"
                    />

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="50px"></TableCell>
                                    <TableCell>Invoice Number</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Amount (€)</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactions.map(transaction => (
                                    <React.Fragment key={transaction.id}>
                                        <TableRow
                                            hover
                                            onClick={() => handleTransactionClick(transaction.id)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                <IconButton size="small">
                                                    {expandedTransactionId === transaction.id ?
                                                        <KeyboardArrowUpIcon /> :
                                                        <KeyboardArrowDownIcon />
                                                    }
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{transaction.invoiceNumber}</TableCell>
                                            <TableCell>{transaction.user?.fullName || "Unknown"}</TableCell>
                                            <TableCell>€{transaction.amount.toFixed(2)}</TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell>{transaction.type || "N/A"}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={transaction.status || "N/A"}
                                                    color={
                                                        transaction.status === 'completed' ? 'success' :
                                                            transaction.status === 'pending' ? 'warning' :
                                                                transaction.status === 'failed' ? 'error' :
                                                                    'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                        </TableRow>

                                        {/* Expanded Details Row */}
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={expandedTransactionId === transaction.id} timeout="auto" unmountOnExit>
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
                                                                                    Invoice Number:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {transaction.invoiceNumber}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Transaction Date:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {new Date(transaction.createdAt).toLocaleString()}
                                                                                </Typography>
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Status:
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={transaction.status || "N/A"}
                                                                                    color={
                                                                                        transaction.status === 'completed' ? 'success' :
                                                                                            transaction.status === 'pending' ? 'warning' :
                                                                                                transaction.status === 'failed' ? 'error' :
                                                                                                    'default'
                                                                                    }
                                                                                    size="small"
                                                                                />
                                                                            </Box>

                                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Type:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {transaction.type || "N/A"}
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
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2ecc71' }}>
                                                                                    €{transaction.amount.toFixed(2)}
                                                                                </Typography>
                                                                            </Box>



                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    Credit Operation:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {transaction.isCredit ? "Yes" : "No"}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            {/* User Information Card */}
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <PersonIcon sx={{ mr: 1 }} />
                                                                            User Information
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                    User:
                                                                                </Typography>
                                                                                <Typography variant="body1">
                                                                                    {transaction.user?.fullName || "Unknown"}
                                                                                </Typography>
                                                                            </Box>

                                                                            {transaction.user?.email && (
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: 140 }}>
                                                                                        Email:
                                                                                    </Typography>
                                                                                    <Typography variant="body1">
                                                                                        {transaction.user.email}
                                                                                    </Typography>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>

                                                            {/* Description Card */}
                                                            <Grid item xs={12} md={6}>
                                                                <Card elevation={1}>
                                                                    <CardContent>
                                                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                                                            <DescriptionIcon sx={{ mr: 1 }} />
                                                                            Description
                                                                        </Typography>
                                                                        <Divider sx={{ mb: 2 }} />

                                                                        <Box sx={{ p: 1 }}>
                                                                            <Typography variant="body1">
                                                                                {transaction.description || "No description available"}
                                                                            </Typography>
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
                    </TableContainer>
                </Box>
            )}
        </Container>
    );
}