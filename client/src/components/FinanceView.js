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
    Chip,
    useMediaQuery,
    useTheme,
    Tabs,
    Tab,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    SwipeableDrawer,
    AppBar,
    Toolbar,
    Pagination,
    PaginationItem
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
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function FinanceView() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("0");
    const [activeTab, setActiveTab] = useState("orders");
    const [affiliateId, setAffiliateId] = useState(null);
    const [expandedTransactionId, setExpandedTransactionId] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [transactionSearchQuery, setTransactionSearchQuery] = useState("");

    // Pagination state
    const [ordersPage, setOrdersPage] = useState(1);
    const [transactionsPage, setTransactionsPage] = useState(1);
    const itemsPerPage = 50;

    // Mobile UI state
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [sortDrawerOpen, setSortDrawerOpen] = useState(false);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
    const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);

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

    // Reset pagination when filters change
    useEffect(() => {
        setOrdersPage(1);
    }, [searchQuery, sortBy]);

    useEffect(() => {
        setTransactionsPage(1);
    }, [transactionSearchQuery]);

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
    const handleTransactionClick = (transaction) => {
        if (isMobile) {
            setSelectedTransaction(transaction);
            setTransactionDetailsOpen(true);
        } else {
            if (expandedTransactionId === transaction.id) {
                setExpandedTransactionId(null);
            } else {
                setExpandedTransactionId(transaction.id);
            }
        }
    };

    // Order handling
    const handleOrderClick = (order) => {
        if (isMobile) {
            setSelectedOrder(order);
            setOrderDetailsOpen(true);
        } else {
            if (expandedOrderId === order.id) {
                setExpandedOrderId(null);
            } else {
                setExpandedOrderId(order.id);
            }
        }
    };

    const handleTransactionSearchChange = (event) => {
        setTransactionSearchQuery(event.target.value || "");
    };

    // Search and sort
    const handleSearchChange = (event) => setSearchQuery(event.target.value || "");
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setSortDrawerOpen(false);
    };

    // Date filters
    const handleDateFilter = () => {
        fetchFinance();
        setDateFilterOpen(false);
    };

    const handleLastYear = () => {
        const lastYear = new Date().getFullYear() - 1;
        setStartDate(`${lastYear}-01-01`);
        setEndDate(`${lastYear}-12-31`);
        fetchFinance();
        setDateFilterOpen(false);
    };

    const handleCurrentYear = () => {
        const currentYear = new Date().getFullYear();
        setStartDate(`${currentYear}-01-01`);
        setEndDate(`${currentYear}-12-31`);
        fetchFinance();
        setDateFilterOpen(false);
    };

    // Pagination handlers
    const handleOrdersPageChange = (event, value) => {
        setOrdersPage(value);
    };

    const handleTransactionsPageChange = (event, value) => {
        setTransactionsPage(value);
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

    // Pagination logic for orders
    const ordersTotalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const paginatedOrders = sortedOrders.slice(
        (ordersPage - 1) * itemsPerPage,
        ordersPage * itemsPerPage
    );

    // Filter transactions
    const filteredTransactions = (transactions || []).filter(transaction => {
        const searchLower = transactionSearchQuery.toLowerCase();
        return (
            (transaction?.invoiceNumber?.toLowerCase() || "").includes(searchLower) ||
            (transaction?.user?.fullName?.toLowerCase() || "").includes(searchLower)
        );
    });

    // Pagination logic for transactions
    const transactionsTotalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (transactionsPage - 1) * itemsPerPage,
        transactionsPage * itemsPerPage
    );

    // Custom pagination component
    const renderPagination = (page, totalPages, handleChange) => {
        if (totalPages <= 1) return null;

        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    siblingCount={1}
                    boundaryCount={1}
                    renderItem={(item) => {
                        if (item.type === 'previous') {
                            return <PaginationItem {...item} icon={<ArrowBackIcon />} />;
                        }
                        if (item.type === 'next') {
                            return <PaginationItem {...item} icon={<ArrowForwardIcon />} />;
                        }
                        return <PaginationItem {...item} />;
                    }}
                />
            </Box>
        );
    };

    // Render mobile order card
    const renderOrderCard = (order) => {
        const status = calculateStatus(order.endDate);

        return (
            <Card
                key={order.id}
                sx={{
                    mb: 2,
                    position: 'relative',
                    '&:active': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
                onClick={() => handleOrderClick(order)}
            >
                <CardContent sx={{ pb: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                                {order.user.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {order.planName}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                                €{order.price.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                            {new Date(order.purchasedAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Render mobile transaction card
    const renderTransactionCard = (transaction) => {
        return (
            <Card
                key={transaction.id}
                sx={{
                    mb: 2,
                    position: 'relative',
                    '&:active': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
                onClick={() => handleTransactionClick(transaction)}
            >
                <CardContent sx={{ pb: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={7}>
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                                {transaction.invoiceNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {transaction.user?.fullName || "Unknown"}
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color={transaction.isCredit ? "success.main" : "primary"}>
                                €{transaction.amount.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                            {new Date(transaction.createdAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                            label={transaction.status || "N/A"}
                            color={
                                transaction.status === 'completed' ? 'success' :
                                    transaction.status === 'pending' ? 'warning' :
                                        transaction.status === 'failed' ? 'error' : 'default'
                            }
                            size="small"
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Render Order Details Dialog
    const renderOrderDetailsDialog = () => {
        if (!selectedOrder) return null;

        const status = calculateStatus(selectedOrder.endDate);

        return (
            <Dialog
                open={orderDetailsOpen}
                onClose={() => setOrderDetailsOpen(false)}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
            >
                {isMobile && (
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setOrderDetailsOpen(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                                Order Details
                            </Typography>
                        </Toolbar>
                    </AppBar>
                )}

                {!isMobile && (
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">Order Details</Typography>
                            <IconButton onClick={() => setOrderDetailsOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                )}

                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: isMobile ? 1 : 0 }}>
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Name:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedOrder.user.fullName}
                                            </Typography>
                                        </Box>

                                        {selectedOrder.user.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                    Email:
                                                </Typography>
                                                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                                    {selectedOrder.user.email}
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Price:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2ecc71' }}>
                                                €{selectedOrder.price.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Payment Date:
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(selectedOrder.purchasedAt).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Status:
                                            </Typography>
                                            <Chip
                                                label={status.label}
                                                color={status.color}
                                                size="small"
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Plan Name:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedOrder.planName}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Sessions Left:
                                            </Typography>
                                            <Chip
                                                label={selectedOrder.sessionsLeft === 9999 ? "Unlimited" : selectedOrder.sessionsLeft}
                                                color={selectedOrder.sessionsLeft > 5 ? "success" : selectedOrder.sessionsLeft > 0 ? "warning" : "error"}
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Start Date:
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(selectedOrder.purchasedAt).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                End Date:
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(selectedOrder.endDate).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Days Left:
                                            </Typography>
                                            <Chip
                                                label={`${calculateDaysLeft(selectedOrder.endDate)} days`}
                                                color={status.color}
                                                size="small"
                                            />
                                        </Box>

                                        {selectedOrder.validityDays && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                    Validity Period:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedOrder.validityDays} days
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                {!isMobile && (
                    <DialogActions>
                        <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
                    </DialogActions>
                )}
            </Dialog>
        );
    };

    // Render Transaction Details Dialog
    const renderTransactionDetailsDialog = () => {
        if (!selectedTransaction) return null;

        return (
            <Dialog
                open={transactionDetailsOpen}
                onClose={() => setTransactionDetailsOpen(false)}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
            >
                {isMobile && (
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setTransactionDetailsOpen(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                                Transaction Details
                            </Typography>
                        </Toolbar>
                    </AppBar>
                )}

                {!isMobile && (
                    <DialogTitle>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">Transaction Details</Typography>
                            <IconButton onClick={() => setTransactionDetailsOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                )}

                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: isMobile ? 1 : 0 }}>
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Invoice Number:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedTransaction.invoiceNumber}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Transaction Date:
                                            </Typography>
                                            <Typography variant="body1">
                                                {new Date(selectedTransaction.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Status:
                                            </Typography>
                                            <Chip
                                                label={selectedTransaction.status || "N/A"}
                                                color={
                                                    selectedTransaction.status === 'completed' ? 'success' :
                                                        selectedTransaction.status === 'pending' ? 'warning' :
                                                            selectedTransaction.status === 'failed' ? 'error' : 'default'
                                                }
                                                size="small"
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Type:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedTransaction.type || "N/A"}
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Amount:
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2ecc71' }}>
                                                €{selectedTransaction.amount.toFixed(2)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                Credit Operation:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedTransaction.isCredit ? "Yes" : "No"}
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
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                User:
                                            </Typography>
                                            <Typography variant="body1">
                                                {selectedTransaction.user?.fullName || "Unknown"}
                                            </Typography>
                                        </Box>

                                        {selectedTransaction.user?.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1, minWidth: isMobile ? 100 : 140 }}>
                                                    Email:
                                                </Typography>
                                                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                                    {selectedTransaction.user.email}
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
                                            {selectedTransaction.description || "No description available"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                {!isMobile && (
                    <DialogActions>
                        <Button onClick={() => setTransactionDetailsOpen(false)}>Close</Button>
                    </DialogActions>
                )}
            </Dialog>
        );
    };

    // Render Sort Drawer
    const renderSortDrawer = () => {
        return (
            <SwipeableDrawer
                anchor="bottom"
                open={sortDrawerOpen}
                onClose={() => setSortDrawerOpen(false)}
                onOpen={() => setSortDrawerOpen(true)}
                disableSwipeToOpen
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>Sort Orders</Typography>
                    <List>
                        <ListItem button selected={sortBy === "0"} onClick={() => handleSortChange({ target: { value: "0" } })}>
                            <ListItemText primary="Sort by User" />
                        </ListItem>
                        <ListItem button selected={sortBy === "1"} onClick={() => handleSortChange({ target: { value: "1" } })}>
                            <ListItemText primary="Sort by Plan" />
                        </ListItem>
                        <ListItem button selected={sortBy === "2"} onClick={() => handleSortChange({ target: { value: "2" } })}>
                            <ListItemText primary="Sort by Price" />
                        </ListItem>
                        <ListItem button selected={sortBy === "3"} onClick={() => handleSortChange({ target: { value: "3" } })}>
                            <ListItemText primary="Sort by Purchased Date" />
                        </ListItem>
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="outlined" onClick={() => setSortDrawerOpen(false)}>Cancel</Button>
                    </Box>
                </Box>
            </SwipeableDrawer>
        );
    };

    // Render Date Filter Dialog
    const renderDateFilterDialog = () => {
        return (
            <Dialog open={dateFilterOpen} onClose={() => setDateFilterOpen(false)}>
                <DialogTitle>Select Date Range</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Start Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                    <Box sx={{ mt: 3, mb: 1 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleLastYear}
                            sx={{ mb: 1 }}
                        >
                            Last Year
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleCurrentYear}
                        >
                            Current Year
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDateFilterOpen(false)}>Cancel</Button>
                    <Button onClick={handleDateFilter} variant="contained">Apply</Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <Container maxWidth={false} sx={{ pb: isMobile ? 7 : 2 }}>
            <Box sx={{ textAlign: "center", my: isMobile ? 2 : 4 }}>
                <Typography variant="h5" color="primary">Finance</Typography>
            </Box>

            {/* Responsive Tabs */}
            {isMobile ? (
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        sx={{ minHeight: 56 }}
                    >
                        <Tab
                            icon={<ReceiptLongIcon />}
                            label="Orders"
                            value="orders"
                            sx={{ minHeight: 56 }}
                        />
                        <Tab
                            icon={<LocalAtmIcon />}
                            label="Finance"
                            value="finance"
                            sx={{ minHeight: 56 }}
                        />
                        <Tab
                            icon={<ShowChartIcon />}
                            label="Transactions"
                            value="transactions"
                            sx={{ minHeight: 56 }}
                        />
                    </Tabs>
                </Paper>
            ) : (
                <Box display="flex" justifyContent="center" mb={3}>
                    <Button
                        variant={activeTab === "orders" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setActiveTab("orders")}
                        sx={{ mx: 1 }}
                        startIcon={<ReceiptLongIcon />}
                    >
                        Orders History
                    </Button>
                    <Button
                        variant={activeTab === "finance" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setActiveTab("finance")}
                        sx={{ mx: 1 }}
                        startIcon={<LocalAtmIcon />}
                    >
                        Finance
                    </Button>
                    <Button
                        variant={activeTab === "transactions" ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => setActiveTab("transactions")}
                        sx={{ mx: 1 }}
                        startIcon={<ShowChartIcon />}
                    >
                        Transactions
                    </Button>
                </Box>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
                <Box my={2}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Orders History</Typography>

                    {/* Search and Sort Controls - Mobile vs Desktop */}
                    {isMobile ? (
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                placeholder="Search by user or plan..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setSortDrawerOpen(true)}
                                                size="small"
                                            >
                                                <SortIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={8}>
                                <TextField
                                    label="Search by user or plan..."
                                    fullWidth
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    displayEmpty
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <SortIcon />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="0">Sort by User</MenuItem>
                                    <MenuItem value="1">Sort by Plan</MenuItem>
                                    <MenuItem value="2">Sort by Price</MenuItem>
                                    <MenuItem value="3">Sort by Purchased Date</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    )}

                    {/* Mobile Card View vs Desktop Table View */}
                    {isMobile ? (
                        <Box>
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map(order => renderOrderCard(order))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No orders found</Typography>
                                </Box>
                            )}
                            {renderPagination(ordersPage, ordersTotalPages, handleOrdersPageChange)}
                        </Box>
                    ) : (
                        <>
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
                                        {paginatedOrders.map(order => {
                                            const isOpen = expandedOrderId === order.id;
                                            const status = calculateStatus(order.endDate);

                                            return (
                                                <React.Fragment key={order.id}>
                                                    {/* Main Order Row */}
                                                    <TableRow
                                                        hover
                                                        onClick={() => handleOrderClick(order)}
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
                            {renderPagination(ordersPage, ordersTotalPages, handleOrdersPageChange)}
                        </>
                    )}
                </Box>
            )}

            {/* FINANCE TAB */}
            {activeTab === "finance" && (
                <Box my={3}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Financial Summary</Typography>

                    {/* Mobile-friendly finance cards */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', p: isMobile ? 1.5 : 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Revenue
                                    </Typography>
                                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                                        €{revenue.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', p: isMobile ? 1.5 : 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Active Members
                                    </Typography>
                                    <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
                                        {activeMembers}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', p: isMobile ? 1.5 : 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Expired Members
                                    </Typography>
                                    <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                                        {expiredMembers}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={3}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', p: isMobile ? 1.5 : 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Total Members
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {totalMembers}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Date filter - Mobile vs Desktop */}
                    {isMobile ? (
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<FilterListIcon />}
                            onClick={() => setDateFilterOpen(true)}
                            sx={{ mb: 3 }}
                        >
                            Filter by Date
                        </Button>
                    ) : (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>Date Range Filter</Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Start Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="End Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleLastYear}
                                        >
                                            Last Year
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCurrentYear}
                                        >
                                            Current Year
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleDateFilter}
                                        >
                                            Update
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Box>
            )}

            {/* TRANSACTIONS TAB */}
            {activeTab === "transactions" && (
                <Box my={2}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Transactions</Typography>

                    {/* Search Box */}
                    <TextField
                        placeholder="Search by invoice number or user..."
                        fullWidth
                        value={transactionSearchQuery}
                        onChange={handleTransactionSearchChange}
                        margin="normal"
                        size={isMobile ? "small" : "medium"}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    {/* Mobile Card View vs Desktop Table View */}
                    {isMobile ? (
                        <Box>
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map(transaction => renderTransactionCard(transaction))
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No transactions found</Typography>
                                </Box>
                            )}
                            {renderPagination(transactionsPage, transactionsTotalPages, handleTransactionsPageChange)}
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper}>
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
                                        {paginatedTransactions.map(transaction => (
                                            <React.Fragment key={transaction.id}>
                                                <TableRow
                                                    hover
                                                    onClick={() => handleTransactionClick(transaction)}
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
                            {renderPagination(transactionsPage, transactionsTotalPages, handleTransactionsPageChange)}
                        </>
                    )}
                </Box>
            )}

            {/* Mobile UI Drawers & Dialogs */}
            {renderSortDrawer()}
            {renderDateFilterDialog()}
            {renderOrderDetailsDialog()}
            {renderTransactionDetailsDialog()}

        </Container>
    );
}