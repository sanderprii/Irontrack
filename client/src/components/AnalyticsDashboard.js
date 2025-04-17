// src/components/AnalyticsDashboard.js
import React, {useState, useEffect, useRef} from 'react';
import {
    Box, Grid, Paper, Typography, Card, CardContent, CardHeader,
    Divider, CircularProgress, Button, Chip, Avatar, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    List, ListItem, ListItemText, ListItemAvatar,
    Alert, Tabs, Tab, Tooltip, LinearProgress,
    useMediaQuery, IconButton, Collapse, Menu, MenuItem,
    SwipeableDrawer, ListItemButton, ListItemIcon
} from '@mui/material';
import {
    Warning, Error, Info, TrendingUp, AccessTime, Person,
    CalendarToday, AttachMoney, Refresh, MoreVert,
    ExpandMore, ExpandLess, Dashboard, DirectionsRun,
    MonetizationOn, FitnessCenter, PeopleAlt, TrendingUpOutlined,
    FilterList, KeyboardArrowRight
} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {analyticsApi} from '../api/analyticsApi';
import {Line, Bar, Pie} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PeriodSelector from './PeriodSelector';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    ChartTooltip,
    Legend
);

// Heat map colors
const getHeatMapColor = (count) => {
    if (count >= 10) return 'rgba(76, 175, 80, 0.8)';    // Green for 10+
    if (count >= 5) return 'rgba(255, 193, 7, 0.8)';     // Yellow for 5-9
    if (count >= 0.5) return 'rgba(213, 0, 0, 0.8)';     // Red for 1-4
    return 'rgba(224, 224, 224, 0.5)';                   // Light gray (default)
};

const AnalyticsDashboard = ({affiliateId}) => {
    // Theme and responsive breakpoints
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Drawer state for mobile period selector
    const [periodDrawerOpen, setPeriodDrawerOpen] = useState(false);
    const [cardMenuAnchorEl, setCardMenuAnchorEl] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});

    // Period states for different tabs
    const [dashboardPeriod, setDashboardPeriod] = useState('THIS_MONTH');
    const [activityPeriod, setActivityPeriod] = useState('LAST_30_DAYS');
    const [financialPeriod, setFinancialPeriod] = useState('THIS_MONTH');
    const [trainingPeriod, setTrainingPeriod] = useState('LAST_30_DAYS');
    const [retentionPeriod, setRetentionPeriod] = useState('LAST_90_DAYS');
    const [growthPeriod, setGrowthPeriod] = useState('LAST_30_DAYS');

    const token = localStorage.getItem('token');

    // States for each analytics section
    const [dashboardData, setDashboardData] = useState(null);
    const [activityData, setActivityData] = useState(null);
    const [heatmapData, setHeatmapData] = useState(null);
    const [atRiskData, setAtRiskData] = useState(null);
    const [visitFrequencyData, setVisitFrequencyData] = useState(null);
    const [contractsData, setContractsData] = useState(null);
    const [arpuData, setArpuData] = useState(null);
    const [paymentHealthData, setPaymentHealthData] = useState(null);
    const [suspendedContractsData, setSuspendedContractsData] = useState(null);
    const [expiringContractsData, setExpiringContractsData] = useState(null);
    const [classCapacityData, setClassCapacityData] = useState(null);
    const [trainingTypesData, setTrainingTypesData] = useState(null);
    const [trainerComparisonData, setTrainerComparisonData] = useState(null);
    const [churnData, setChurnData] = useState(null);
    const [clientLifecycleData, setClientLifecycleData] = useState(null);
    const [clientAchievementsData, setClientAchievementsData] = useState(null);
    const [dormantClientsData, setDormantClientsData] = useState(null);
    const [growthOpportunitiesData, setGrowthOpportunitiesData] = useState(null);
    const [earlyWarningsData, setEarlyWarningsData] = useState(null);
    const [topMembersData, setTopMembersData] = useState(null);

    // Chart options adjusted for mobile
    const getChartOptions = (isMobileView = false) => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000
            },
            scales: {
                x: {
                    display: !isMobileView, // Hide x-axis on mobile
                    ticks: {
                        maxRotation: isMobileView ? 45 : 0,
                        font: {
                            size: isMobileView ? 10 : 12
                        }
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: isMobileView ? 10 : 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: isMobileView ? 10 : 40,
                        padding: isMobileView ? 10 : 20,
                        font: {
                            size: isMobileView ? 10 : 12
                        }
                    }
                },
                tooltip: {
                    titleFont: {
                        size: isMobileView ? 10 : 14
                    },
                    bodyFont: {
                        size: isMobileView ? 10 : 14
                    },
                    displayColors: !isMobileView
                }
            }
        };
    };

    // Use ref to track if charts have been resized
    const chartContainers = useRef({});

    // Helper for card expansion
    const handleCardExpandToggle = (cardId) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    // Menu handlers
    const handleCardMenuOpen = (event) => {
        setCardMenuAnchorEl(event.currentTarget);
    };

    const handleCardMenuClose = () => {
        setCardMenuAnchorEl(null);
    };

    // Get the current active period based on the tab
    const getCurrentPeriod = () => {
        switch (activeTab) {
            case 0:
                return dashboardPeriod;
            case 1:
                return activityPeriod;
            case 2:
                return financialPeriod;
            case 3:
                return trainingPeriod;
            case 4:
                return retentionPeriod;
            case 5:
                return growthPeriod;
            default:
                return 'ALL_TIME';
        }
    };

    // Handle period change for the current tab
    const handlePeriodChange = (newPeriod) => {
        switch (activeTab) {
            case 0:
                setDashboardPeriod(newPeriod);
                setDashboardData(null);
                setTopMembersData(null);
                break;
            case 1:
                setActivityPeriod(newPeriod);
                setActivityData(null);
                setHeatmapData(null);
                setAtRiskData(null);
                setVisitFrequencyData(null);
                break;
            case 2:
                setFinancialPeriod(newPeriod);
                setContractsData(null);
                setArpuData(null);
                setPaymentHealthData(null);
                setSuspendedContractsData(null);
                setExpiringContractsData(null);
                break;
            case 3:
                setTrainingPeriod(newPeriod);
                setClassCapacityData(null);
                setTrainingTypesData(null);
                setTrainerComparisonData(null);
                break;
            case 4:
                setRetentionPeriod(newPeriod);
                setChurnData(null);
                setClientLifecycleData(null);
                setClientAchievementsData(null);
                break;
            case 5:
                setGrowthPeriod(newPeriod);
                setDormantClientsData(null);
                setGrowthOpportunitiesData(null);
                setEarlyWarningsData(null);
                break;
            default:
                break;
        }

        // Close period drawer after selection on mobile
        if (isMobile) {
            setPeriodDrawerOpen(false);
        }
    };

    // Fetch data for active tab
    useEffect(() => {
        const fetchTabData = async () => {
            if (!affiliateId || !token) return;

            setLoading(true);
            try {
                const currentPeriod = getCurrentPeriod();

                switch (activeTab) {
                    case 0: // Dashboard overview
                        if (!dashboardData) {
                            const data = await analyticsApi.getDashboardOverview(token, affiliateId, dashboardPeriod);
                            setDashboardData(data);
                        }
                        if (!topMembersData) {
                            const data = await analyticsApi.getTopMembersByCheckIns(token, affiliateId, dashboardPeriod);
                            setTopMembersData(data);
                        }
                        break;

                    case 1: // Activity & Behavior
                        if (!activityData) {
                            const data = await analyticsApi.getActivityMetrics(token, affiliateId, activityPeriod);
                            setActivityData(data);
                        }
                        if (!heatmapData) {
                            const data = await analyticsApi.getVisitHeatmap(token, affiliateId, activityPeriod);
                            setHeatmapData(data);
                        }
                        if (!atRiskData) {
                            const data = await analyticsApi.getAtRiskMembers(token, affiliateId, activityPeriod);
                            setAtRiskData(data);
                        }
                        if (!visitFrequencyData) {
                            const data = await analyticsApi.getVisitFrequency(token, affiliateId, activityPeriod);
                            setVisitFrequencyData(data);
                        }
                        break;

                    case 2: // Financial Analysis
                        if (!contractsData) {
                            const data = await analyticsApi.getContractOverview(token, affiliateId, financialPeriod);
                            setContractsData(data);
                        }
                        if (!arpuData) {
                            const data = await analyticsApi.getArpu(token, affiliateId, financialPeriod);
                            setArpuData(data);
                        }
                        if (!paymentHealthData) {
                            const data = await analyticsApi.getPaymentHealth(token, affiliateId, financialPeriod);
                            setPaymentHealthData(data);
                        }
                        if (!suspendedContractsData) {
                            const data = await analyticsApi.getSuspendedContracts(token, affiliateId, financialPeriod);
                            setSuspendedContractsData(data);
                        }
                        if (!expiringContractsData) {
                            // Use a forward-looking period for expirations
                            const expirationPeriod =
                                financialPeriod === 'THIS_MONTH' ? 'THIS_MONTH' :
                                    financialPeriod === 'NEXT_MONTH' ? 'NEXT_MONTH' : 'NEXT_90_DAYS';
                            const data = await analyticsApi.getContractExpirations(token, affiliateId, expirationPeriod);
                            setExpiringContractsData(data);
                        }
                        break;

                    case 3: // Training & Service Analysis
                        if (!classCapacityData) {
                            const data = await analyticsApi.getClassCapacity(token, affiliateId, trainingPeriod);
                            setClassCapacityData(data);
                        }
                        if (!trainingTypesData) {
                            const data = await analyticsApi.getTrainingTypePopularity(token, affiliateId, trainingPeriod);
                            setTrainingTypesData(data);
                        }
                        if (!trainerComparisonData) {
                            const data = await analyticsApi.getTrainerComparison(token, affiliateId, trainingPeriod);
                            setTrainerComparisonData(data);
                        }
                        break;

                    case 4: // Client Retention & Engagement
                        if (!churnData) {
                            const data = await analyticsApi.getChurnAnalysis(token, affiliateId, retentionPeriod);
                            setChurnData(data);
                        }
                        if (!clientLifecycleData) {
                            const data = await analyticsApi.getClientLifecycle(token, affiliateId, retentionPeriod);
                            setClientLifecycleData(data);
                        }
                        if (!clientAchievementsData) {
                            const data = await analyticsApi.getClientAchievements(token, affiliateId, retentionPeriod);
                            setClientAchievementsData(data);
                        }
                        break;

                    case 5: // Growth Potential & Early Warnings
                        if (!dormantClientsData) {
                            const data = await analyticsApi.getDormantClients(token, affiliateId, growthPeriod);
                            setDormantClientsData(data);
                        }
                        if (!growthOpportunitiesData) {
                            const data = await analyticsApi.getGrowthOpportunities(token, affiliateId, growthPeriod);
                            setGrowthOpportunitiesData(data);
                        }
                        if (!earlyWarningsData) {
                            const data = await analyticsApi.getEarlyWarnings(token, affiliateId, growthPeriod);
                            setEarlyWarningsData(data);
                        }
                        break;

                    default:
                        break;
                }
                setError(null);
            } catch (err) {
                setError(`Failed to load data for ${getTabLabel(activeTab)}. Please try again.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTabData();
    }, [
        activeTab, affiliateId, token,
        dashboardData, dashboardPeriod, topMembersData,
        activityData, heatmapData, atRiskData, visitFrequencyData, activityPeriod,
        contractsData, arpuData, paymentHealthData, suspendedContractsData, expiringContractsData, financialPeriod,
        classCapacityData, trainingTypesData, trainerComparisonData, trainingPeriod,
        churnData, clientLifecycleData, clientAchievementsData, retentionPeriod,
        dormantClientsData, growthOpportunitiesData, earlyWarningsData, growthPeriod
    ]);

    const handleRefresh = () => {
        // Reset state for current tab
        switch (activeTab) {
            case 0:
                setDashboardData(null);
                setTopMembersData(null);
                break;
            case 1:
                setActivityData(null);
                setHeatmapData(null);
                setAtRiskData(null);
                setVisitFrequencyData(null);
                break;
            case 2:
                setContractsData(null);
                setArpuData(null);
                setPaymentHealthData(null);
                setSuspendedContractsData(null);
                setExpiringContractsData(null);
                break;
            case 3:
                setClassCapacityData(null);
                setTrainingTypesData(null);
                setTrainerComparisonData(null);
                break;
            case 4:
                setChurnData(null);
                setClientLifecycleData(null);
                setClientAchievementsData(null);
                break;
            case 5:
                setDormantClientsData(null);
                setGrowthOpportunitiesData(null);
                setEarlyWarningsData(null);
                break;
            default:
                break;
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        // Reset expanded cards state when changing tabs
        setExpandedCards({});
    };

    const getTabLabel = (index) => {
        const labels = [
            'Dashboard',
            'Activity & Behavior',
            'Financial Analysis',
            'Training Analysis',
            'Client Retention',
            'Growth & Warnings'
        ];
        return labels[index];
    };

    // Short labels for mobile tabs
    const getTabShortLabel = (index) => {
        const labels = [
            'Dashboard',
            'Activity',
            'Finance',
            'Training',
            'Retention',
            'Growth'
        ];
        return labels[index];
    };

    // Icon for each tab
    const getTabIcon = (index) => {
        const icons = [
            <Dashboard fontSize="small"/>,
            <DirectionsRun fontSize="small"/>,
            <MonetizationOn fontSize="small"/>,
            <FitnessCenter fontSize="small"/>,
            <PeopleAlt fontSize="small"/>,
            <TrendingUpOutlined fontSize="small"/>
        ];
        return icons[index];
    };

    // Determine which period selector to show based on the active tab
    const getPeriodSelectorType = () => {
        switch (activeTab) {
            case 0:
                return 'financial'; // Dashboard shows financial periods
            case 1:
                return 'behavior';  // Activity shows behavior periods
            case 2:
                return 'financial'; // Financial shows financial periods
            case 3:
                return 'behavior';  // Training shows behavior periods
            case 4:
                return 'historical'; // Retention shows historical periods
            case 5:
                return 'behavior';  // Growth shows behavior periods
            default:
                return 'all';
        }
    };

    // Get the current period for the active tab
    const getActivePeriod = () => {
        switch (activeTab) {
            case 0:
                return dashboardPeriod;
            case 1:
                return activityPeriod;
            case 2:
                return financialPeriod;
            case 3:
                return trainingPeriod;
            case 4:
                return retentionPeriod;
            case 5:
                return growthPeriod;
            default:
                return 'ALL_TIME';
        }
    };

    // Get period label for displaying in UI
    const getPeriodLabel = (data) => {
        return data && data.periodLabel ? data.periodLabel : '';
    };

    // Helper method to make card header consistent
    const renderCardHeader = (title, subtitle, cardId, actionComponent = null) => {
        return (
            <CardHeader
                title={
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant={isMobile ? "subtitle1" : "h6"} component="div" sx={{fontWeight: "medium"}}>
                            {title}
                        </Typography>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {actionComponent}
                            {cardId && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleCardExpandToggle(cardId)}
                                    aria-expanded={expandedCards[cardId]}
                                    aria-label="show more"
                                >
                                    {expandedCards[cardId] ? <ExpandLess/> : <ExpandMore/>}
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                }
                subheader={subtitle ?
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography> : null
                }
                sx={{
                    p: isMobile ? 1.5 : 2,
                    '& .MuiCardHeader-action': {m: 0}
                }}
            />
        );
    };

    // Mobile-optimized table container
    const renderMobileTable = (columns, data, heightLimit = 300) => {
        return (
            <TableContainer sx={{maxHeight: heightLimit, overflowX: 'auto'}}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell key={index} align={column.align || 'left'}
                                           sx={{whiteSpace: 'nowrap', px: 1.5}}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column, cellIndex) => (
                                    <TableCell key={cellIndex} align={column.align || 'left'}
                                               sx={{whiteSpace: 'nowrap', px: 1.5}}>
                                        {column.render ? column.render(row) : row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // Mobile optimized period selector button
    const renderMobilePeriodSelector = () => {
        return (
            <Box sx={{mb: 2}}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPeriodDrawerOpen(true)}
                    startIcon={<FilterList/>}
                    fullWidth
                    sx={{justifyContent: 'space-between'}}
                >
                    {getActivePeriod().replace(/_/g, ' ')}
                    <KeyboardArrowRight/>
                </Button>

                <SwipeableDrawer
                    anchor="bottom"
                    open={periodDrawerOpen}
                    onClose={() => setPeriodDrawerOpen(false)}
                    onOpen={() => setPeriodDrawerOpen(true)}
                    SwipeAreaProps={{height: 20}}
                    PaperProps={{
                        sx: {
                            mb: 4 // Make sure it's above the bottom navbar
                        }
                    }}
                >
                    <Box sx={{p: 2}}>
                        <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 'medium'}}>
                            Select Period
                        </Typography>
                        <Divider sx={{mb: 2}}/>
                        <PeriodSelector
                            period={getActivePeriod()}
                            onPeriodChange={handlePeriodChange}
                            periodsToShow={getPeriodSelectorType()}
                            isMobile={true}
                        />
                    </Box>
                </SwipeableDrawer>
            </Box>
        );
    };

    if (!affiliateId) {
        return (
            <Alert severity="warning">
                Please select an affiliate to view analytics.
            </Alert>
        );
    }

    return (
        <Box sx={{width: '100%'}}>
            {/* Header + Actions */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: isMobile ? 2 : 3,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 0
            }}>
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="h2"
                    fontWeight="bold"
                    align={isMobile ? "center" : "left"}
                    sx={{width: isMobile ? '100%' : 'auto'}}
                >
                    Analytics Dashboard
                </Typography>

                {isMobile ? (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh/>}
                        onClick={handleRefresh}
                        disabled={loading}
                        fullWidth
                    >
                        Refresh Data
                    </Button>
                ) : (
                    <Box sx={{display: 'flex', gap: 2}}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Refresh/>}
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            Refresh Data
                        </Button>
                    </Box>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{mb: 3}}>
                    {error}
                </Alert>
            )}

            {/* Tabs - Mobile optimized */}
            <Paper
                sx={{
                    mb: 2,
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden'
                }}
                elevation={1}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons={isMobile ? "auto" : false}
                    allowScrollButtonsMobile
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '& .MuiTabs-flexContainer': {
                            justifyContent: isMobile ? 'flex-start' : 'space-evenly'
                        },
                        '& .MuiTab-root': {
                            minWidth: isMobile ? 'auto' : 100,
                            p: isMobile ? 1 : 2,
                        }
                    }}
                >
                    {[0, 1, 2, 3, 4, 5].map(index => (
                        <Tab
                            key={index}
                            label={isMobile ? undefined : getTabShortLabel(index)}
                            icon={getTabIcon(index)}
                            iconPosition={isMobile ? "top" : "start"}
                            sx={{
                                minHeight: isMobile ? 60 : 72,
                                fontSize: isMobile ? '0.7rem' : '0.875rem',

                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Period Selector - Desktop version */}
            {!isMobile && (
                <Box sx={{mb: 3}}>
                    <PeriodSelector
                        period={getActivePeriod()}
                        onPeriodChange={handlePeriodChange}
                        periodsToShow={getPeriodSelectorType()}
                    />
                </Box>
            )}

            {/* Period Selector - Mobile version */}
            {isMobile && renderMobilePeriodSelector()}

            {loading && (
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4}}>
                    <CircularProgress size={40} sx={{mb: 2}}/>
                    <Typography variant="body1" color="textSecondary">
                        Loading {getTabLabel(activeTab)} data...
                    </Typography>
                </Box>
            )}

            {!loading && (
                <>
                    {/* Dashboard Overview */}
                    {activeTab === 0 && dashboardData && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(dashboardData)}
                            </Typography>

                            {/* KPI Cards - Mobile Optimized */}
                            <Grid container spacing={isMobile ? 1 : 3} sx={{mb: 3}}>
                                {/* Active Members */}
                                <Grid item xs={6} sm={6} md={3}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: isMobile ? 1.5 : 2}}>
                                            <Typography variant={isMobile ? "caption" : "subtitle2"}
                                                        color="textSecondary" gutterBottom>
                                                Active Members
                                            </Typography>
                                            <Typography
                                                variant={isMobile ? "h5" : "h4"}
                                                component="div"
                                                sx={{fontWeight: 'bold'}}
                                            >
                                                {dashboardData.totalMembers}
                                            </Typography>
                                            <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                                                <Person fontSize="small" color="primary" sx={{mr: 0.5}}/>
                                                <Typography variant="body2" color="textSecondary"
                                                            sx={{fontSize: isMobile ? '0.7rem' : '0.875rem'}}>
                                                    Total enrolled members
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Visits */}
                                <Grid item xs={6} sm={6} md={3}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: isMobile ? 1.5 : 2}}>
                                            <Typography variant={isMobile ? "caption" : "subtitle2"}
                                                        color="textSecondary" gutterBottom>
                                                Visits
                                            </Typography>
                                            <Typography
                                                variant={isMobile ? "h5" : "h4"}
                                                component="div"
                                                sx={{fontWeight: 'bold'}}
                                            >
                                                {dashboardData.visitsInPeriod}
                                            </Typography>
                                            <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                                                <CalendarToday fontSize="small" color="primary" sx={{mr: 0.5}}/>
                                                <Typography variant="body2" color="textSecondary"
                                                            sx={{fontSize: isMobile ? '0.7rem' : '0.875rem'}}>
                                                    Check-ins {isMobile ? '' : `during ${dashboardData.periodLabel.toLowerCase()}`}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Revenue */}
                                <Grid item xs={6} sm={6} md={3}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: isMobile ? 1.5 : 2}}>
                                            <Typography variant={isMobile ? "caption" : "subtitle2"}
                                                        color="textSecondary" gutterBottom>
                                                Revenue
                                            </Typography>
                                            <Typography
                                                variant={isMobile ? "h5" : "h4"}
                                                component="div"
                                                sx={{fontWeight: 'bold'}}
                                            >
                                                €{dashboardData.revenueInPeriod.toFixed(0)}
                                            </Typography>
                                            <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                                                <AttachMoney fontSize="small" color="primary" sx={{mr: 0.5}}/>
                                                <Typography variant="body2" color="textSecondary"
                                                            sx={{fontSize: isMobile ? '0.7rem' : '0.875rem'}}>
                                                    Total
                                                    revenue {isMobile ? '' : `for ${dashboardData.periodLabel.toLowerCase()}`}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Active Plans */}
                                <Grid item xs={6} sm={6} md={3}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: isMobile ? 1.5 : 2}}>
                                            <Typography variant={isMobile ? "caption" : "subtitle2"}
                                                        color="textSecondary" gutterBottom>
                                                Active Plans
                                            </Typography>
                                            <Typography
                                                variant={isMobile ? "h5" : "h4"}
                                                component="div"
                                                sx={{fontWeight: 'bold'}}
                                            >
                                                {dashboardData.activePlans}
                                            </Typography>
                                            <Box sx={{mt: 1, display: 'flex', alignItems: 'center'}}>
                                                <AccessTime fontSize="small" color="primary" sx={{mr: 0.5}}/>
                                                <Typography variant="body2" color="textSecondary"
                                                            sx={{fontSize: isMobile ? '0.7rem' : '0.875rem'}}>
                                                    Current valid memberships
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Alert Summaries - Stacked on mobile */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: 3}}>
                                {/* At-Risk Members */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "At-Risk Members",
                                            null,
                                            "atRiskMembers"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["atRiskMembers"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    maxHeight: 300,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {dashboardData.atRiskMembers.length > 0 ? (
                                                    <List disablePadding>
                                                        {dashboardData.atRiskMembers.map((member, index) => (
                                                            <ListItem
                                                                key={index}
                                                                divider={index < dashboardData.atRiskMembers.length - 1}
                                                                sx={{px: isMobile ? 1 : 2, py: 1}}
                                                            >
                                                                <ListItemAvatar sx={{minWidth: isMobile ? 40 : 56}}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: 'error.light',
                                                                            width: isMobile ? 32 : 40,
                                                                            height: isMobile ? 32 : 40
                                                                        }}
                                                                    >
                                                                        {member.fullName.charAt(0)}
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography
                                                                            variant={isMobile ? "body2" : "body1"}
                                                                            sx={{fontWeight: "medium"}}
                                                                        >
                                                                            {member.fullName}
                                                                        </Typography>
                                                                    }
                                                                    secondary={
                                                                        <Typography
                                                                            variant={isMobile ? "caption" : "body2"}>
                                                                            {member.visits} visits in the last 30 days
                                                                        </Typography>
                                                                    }
                                                                />
                                                                <Chip
                                                                    label="At Risk"
                                                                    color="error"
                                                                    size="small"
                                                                    sx={{ml: 1}}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary"
                                                                sx={{textAlign: 'center', py: 3}}>
                                                        No at-risk members detected
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                {/* Expiring Contracts */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Expiring Contracts",
                                            null,
                                            "expiringContracts"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["expiringContracts"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    maxHeight: 300,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {dashboardData.expiringContracts.length > 0 ? (
                                                    <List disablePadding>
                                                        {dashboardData.expiringContracts.map((contract, index) => {
                                                            const daysUntil = Math.ceil((new Date(contract.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
                                                            return (
                                                                <ListItem
                                                                    key={index}
                                                                    divider={index < dashboardData.expiringContracts.length - 1}
                                                                    sx={{px: isMobile ? 1 : 2, py: 1}}
                                                                >
                                                                    <ListItemAvatar sx={{minWidth: isMobile ? 40 : 56}}>
                                                                        <Avatar
                                                                            sx={{
                                                                                bgcolor: 'warning.light',
                                                                                width: isMobile ? 32 : 40,
                                                                                height: isMobile ? 32 : 40
                                                                            }}
                                                                        >
                                                                            {contract.user.fullName.charAt(0)}
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant={isMobile ? "body2" : "body1"}
                                                                                sx={{fontWeight: "medium"}}
                                                                            >
                                                                                {contract.user.fullName}
                                                                            </Typography>
                                                                        }
                                                                        secondary={
                                                                            <Typography
                                                                                variant={isMobile ? "caption" : "body2"}>
                                                                                Expires in {daysUntil} days
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                    <Chip
                                                                        label={daysUntil <= 7 ? "Urgent" : "Soon"}
                                                                        color={daysUntil <= 7 ? "error" : "warning"}
                                                                        size="small"
                                                                        sx={{ml: 1}}
                                                                    />
                                                                </ListItem>
                                                            );
                                                        })}
                                                    </List>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary"
                                                                sx={{textAlign: 'center', py: 3}}>
                                                        No contracts expiring in the next 30 days
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                {/* Top Members */}
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "Top Members by Check-Ins",
                                            topMembersData ? `Most active members in ${topMembersData.periodLabel}` : "",
                                            "topMembers"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["topMembers"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 250 : 350,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {topMembersData && topMembersData.data.length > 0 ? (
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Rank</TableCell>
                                                                    <TableCell>Member</TableCell>
                                                                    <TableCell align="right">Check-Ins</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {topMembersData.data.map((member, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell>{member.fullName}</TableCell>
                                                                        <TableCell
                                                                            align="right">{member.check_in_count}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary"
                                                                sx={{textAlign: 'center', py: 4}}>
                                                        No check-in data available for this period
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Activity & Behavior - Mobile Optimized */}
                    {activeTab === 1 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(activityData)}
                            </Typography>

                            {/* Activity Graph - Full Width Always */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "Member Activity",
                                            null,
                                            "memberActivity"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["memberActivity"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['memberActivity'] = el}
                                                sx={{
                                                    height: isMobile ? 200 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {activityData ? (
                                                    <Line
                                                        data={{
                                                            labels: activityData.data.map(d => new Date(d.date).toLocaleDateString()),
                                                            datasets: [
                                                                {
                                                                    label: 'Daily Visits',
                                                                    data: activityData.data.map(d => d.count),
                                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                                    tension: 0.3,
                                                                    pointRadius: isMobile ? 0 : 3,
                                                                    borderWidth: isMobile ? 2 : 3
                                                                }
                                                            ]
                                                        }}
                                                        options={getChartOptions(isMobile)}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Heatmap & Visit Frequency - Stack on Mobile */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                {/* Visit Frequency - Pie Chart */}
                                <Grid item xs={12} md={6} sx={{order: {xs: 1, md: 2}}}>
                                    <Card>
                                        {renderCardHeader(
                                            "Visit Frequency",
                                            "Distribution of member attendance",
                                            "visitFrequency"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["visitFrequency"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['visitFrequency'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 350,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {visitFrequencyData ? (
                                                    <Box sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Pie
                                                            data={{
                                                                labels: visitFrequencyData.data.map(d => d.frequency_range),
                                                                datasets: [
                                                                    {
                                                                        data: visitFrequencyData.data.map(d => d.member_count),
                                                                        backgroundColor: [
                                                                            'rgba(255, 99, 132, 0.7)',
                                                                            'rgba(255, 159, 64, 0.7)',
                                                                            'rgba(255, 205, 86, 0.7)',
                                                                            'rgba(75, 192, 192, 0.7)',
                                                                            'rgba(54, 162, 235, 0.7)',
                                                                            'rgba(153, 102, 255, 0.7)'
                                                                        ]
                                                                    }
                                                                ]
                                                            }}
                                                            options={getChartOptions(isMobile)}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                {/* Visit Heatmap - Simplified on mobile */}
                                <Grid item xs={12} md={6} sx={{order: {xs: 2, md: 1}}}>
                                    <Card>
                                        {renderCardHeader(
                                            "Visit Heatmap",
                                            "Most popular days and times",
                                            "visitHeatmap"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["visitHeatmap"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 250 : 350,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {heatmapData ? (
                                                    <Box sx={{width: '100%', height: '100%', overflow: 'hidden'}}>
                                                        <Box sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                                            gap: isMobile ? 0.5 : 1,
                                                            height: '100%'
                                                        }}>
                                                            {Array.from(Array(7)).map((_, day) => (
                                                                <Box key={day} sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    height: '100%'
                                                                }}>
                                                                    <Typography
                                                                        variant={isMobile ? "caption" : "body2"}
                                                                        align="center"
                                                                        sx={{mb: isMobile ? 0.5 : 1}}
                                                                    >
                                                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][day]}
                                                                    </Typography>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        flexGrow: 1,
                                                                        gap: isMobile ? 0.3 : 0.5
                                                                    }}>
                                                                        {/* Show fewer hour blocks on mobile */}
                                                                        {Array.from(Array(isMobile ? 8 : 17)).map((_, hour) => {
                                                                            // For mobile, show every other hour or key hours
                                                                            const hourOffset = isMobile ? hour * 2 + 6 : hour + 6;

                                                                            const hourData = heatmapData.data.find(
                                                                                d => d.dayOfWeek === day + 1 && d.hour === hourOffset
                                                                            );
                                                                            const value = hourData ? hourData.count : 0;
                                                                            const maxValue = Math.max(...heatmapData.data.map(d => d.count));
                                                                            const normalizedValue = maxValue > 0 ? value / maxValue : 0;

                                                                            return (
                                                                                <Tooltip
                                                                                    key={hour}
                                                                                    title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]} ${hourOffset}:00 - ${value} visits`}
                                                                                    arrow
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            height: '100%',
                                                                                            flexGrow: 1,
                                                                                            backgroundColor: getHeatMapColor(normalizedValue),
                                                                                            borderRadius: isMobile ? 0.5 : 1,
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                    />
                                                                                </Tooltip>
                                                                            );
                                                                        })}
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* At-Risk Members */}
                            <Grid container spacing={isMobile ? 2 : 3}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "At-Risk Members",
                                            "Members who have significantly reduced their attendance",
                                            "atRiskMembersDetailed"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["atRiskMembersDetailed"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {atRiskData ? (
                                                    <>
                                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                                            Comparison: {atRiskData.comparisonInfo?.currentPeriod} vs {atRiskData.comparisonInfo?.previousPeriod}
                                                        </Typography>
                                                        {atRiskData.data.length > 0 ? (
                                                            <TableContainer sx={{
                                                                maxHeight: isMobile ? 250 : 400,
                                                                overflowX: 'auto'
                                                            }}>
                                                                <Table size="small" stickyHeader>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Member</TableCell>
                                                                            {!isMobile && <TableCell>Email</TableCell>}
                                                                            <TableCell align="center">Recent</TableCell>
                                                                            <TableCell
                                                                                align="center">Previous</TableCell>
                                                                            {!isMobile && <TableCell align="center">Last
                                                                                Visit</TableCell>}
                                                                            <TableCell align="center">Risk</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {atRiskData.data.map((member, index) => {
                                                                            const dropPercentage = Math.round(
                                                                                ((member.previous_visits - member.recent_visits) / member.previous_visits) * 100
                                                                            );
                                                                            let riskLevel = 'Medium';
                                                                            if (dropPercentage > 80) riskLevel = 'High';
                                                                            if (dropPercentage < 40) riskLevel = 'Low';

                                                                            return (
                                                                                <TableRow key={index}>
                                                                                    <TableCell
                                                                                        sx={{whiteSpace: 'nowrap'}}>{member.fullName}</TableCell>
                                                                                    {!isMobile &&
                                                                                        <TableCell>{member.email}</TableCell>}
                                                                                    <TableCell
                                                                                        align="center">{member.recent_visits}</TableCell>
                                                                                    <TableCell
                                                                                        align="center">{member.previous_visits}</TableCell>
                                                                                    {!isMobile && (
                                                                                        <TableCell align="center">
                                                                                            {new Date(member.last_visit).toLocaleDateString()}
                                                                                        </TableCell>
                                                                                    )}
                                                                                    <TableCell align="center">
                                                                                        <Chip
                                                                                            label={riskLevel}
                                                                                            color={
                                                                                                riskLevel === 'High' ? 'error' :
                                                                                                    riskLevel === 'Medium' ? 'warning' : 'success'
                                                                                            }
                                                                                            size="small"
                                                                                        />
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        ) : (
                                                            <Typography variant="body2" color="textSecondary"
                                                                        sx={{textAlign: 'center', py: 3}}>
                                                                No at-risk members detected
                                                            </Typography>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 200
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Financial Analysis - Mobile Optimized */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(contractsData)}
                            </Typography>

                            {/* Contracts Overview & ARPU - Stack on Mobile */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Contract Types",
                                            "Distribution of active contracts",
                                            "contractTypes"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["contractTypes"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['contractTypes'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {contractsData ? (
                                                    <Box sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Pie
                                                            data={{
                                                                labels: contractsData.contractTypes.map(t => t.contractType || 'Not specified'),
                                                                datasets: [
                                                                    {
                                                                        data: contractsData.contractTypes.map(t => t.count),
                                                                        backgroundColor: [
                                                                            'rgba(54, 162, 235, 0.7)',
                                                                            'rgba(255, 99, 132, 0.7)',
                                                                            'rgba(255, 205, 86, 0.7)',
                                                                            'rgba(75, 192, 192, 0.7)',
                                                                            'rgba(153, 102, 255, 0.7)'
                                                                        ]
                                                                    }
                                                                ]
                                                            }}
                                                            options={getChartOptions(isMobile)}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Average Revenue Per User (ARPU)",
                                            arpuData ? `Period: ${arpuData.periodLabel}` : "Monthly trend",
                                            "arpu"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["arpu"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['arpu'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {arpuData ? (
                                                    <Line
                                                        data={{
                                                            labels: arpuData.data.map(d => d.month),
                                                            datasets: [
                                                                {
                                                                    label: 'ARPU (€)',
                                                                    data: arpuData.data.map(d => d.arpu),
                                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                                    yAxisID: 'y',
                                                                    pointRadius: isMobile ? 0 : 3
                                                                },
                                                                {
                                                                    label: 'Revenue (€)',
                                                                    data: arpuData.data.map(d => d.revenue),
                                                                    borderColor: 'rgba(54, 162, 235, 1)',
                                                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                                    yAxisID: 'y1',
                                                                    type: 'bar'
                                                                }
                                                            ]
                                                        }}
                                                        options={{
                                                            ...getChartOptions(isMobile),
                                                            scales: {
                                                                y: {
                                                                    type: 'linear',
                                                                    display: true,
                                                                    position: 'left',
                                                                    title: {
                                                                        display: !isMobile,
                                                                        text: 'ARPU (€)'
                                                                    },
                                                                    ticks: {
                                                                        font: {
                                                                            size: isMobile ? 10 : 12
                                                                        }
                                                                    }
                                                                },
                                                                y1: {
                                                                    type: 'linear',
                                                                    display: true,
                                                                    position: 'right',
                                                                    grid: {
                                                                        drawOnChartArea: false
                                                                    },
                                                                    title: {
                                                                        display: !isMobile,
                                                                        text: 'Revenue (€)'
                                                                    },
                                                                    ticks: {
                                                                        font: {
                                                                            size: isMobile ? 10 : 12
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Payment Health */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "Payment Health",
                                            paymentHealthData ? `Period: ${paymentHealthData.periodLabel}` : "Payment status and issues",
                                            "paymentHealth"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["paymentHealth"] !== false} timeout="auto">
                                            <CardContent sx={{p: isMobile ? 1 : 2}}>
                                                <Grid container spacing={isMobile ? 2 : 3}>
                                                    <Grid item xs={12} md={4}>
                                                        {paymentHealthData ? (
                                                            <Box
                                                                ref={el => chartContainers.current['paymentHealthPie'] = el}
                                                                sx={{
                                                                    height: isMobile ? 180 : 200,
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <Pie
                                                                    data={{
                                                                        labels: paymentHealthData.paymentHealth.map(p => p.payment_status),
                                                                        datasets: [
                                                                            {
                                                                                data: paymentHealthData.paymentHealth.map(p => p.count),
                                                                                backgroundColor: [
                                                                                    'rgba(76, 175, 80, 0.7)',  // Completed
                                                                                    'rgba(255, 193, 7, 0.7)',  // Pending
                                                                                    'rgba(255, 152, 0, 0.7)',  // Delayed
                                                                                    'rgba(244, 67, 54, 0.7)'   // Failed
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }}
                                                                    options={getChartOptions(isMobile)}
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: 200
                                                            }}>
                                                                <CircularProgress size={30}/>
                                                            </Box>
                                                        )}
                                                    </Grid>

                                                    <Grid item xs={12} md={8}>
                                                        <Typography variant="subtitle1" gutterBottom
                                                                    sx={{fontSize: isMobile ? '0.9rem' : '1rem'}}>
                                                            Failed Payments
                                                        </Typography>
                                                        {paymentHealthData ? (
                                                            paymentHealthData.failedPayments.length > 0 ? (
                                                                <TableContainer sx={{
                                                                    maxHeight: isMobile ? 200 : 300,
                                                                    overflowX: 'auto'
                                                                }}>
                                                                    <Table size="small" stickyHeader>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>Member</TableCell>
                                                                                <TableCell>Amount</TableCell>
                                                                                {!isMobile &&
                                                                                    <TableCell>Date</TableCell>}
                                                                                <TableCell
                                                                                    align="right">Actions</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {paymentHealthData.failedPayments.map((payment, index) => (
                                                                                <TableRow key={index}>
                                                                                    <TableCell>{payment.user.fullName}</TableCell>
                                                                                    <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                                                                                    {!isMobile &&
                                                                                        <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>}
                                                                                    <TableCell align="right">
                                                                                        <Button size="small"
                                                                                                variant="outlined">
                                                                                            Contact
                                                                                        </Button>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            ) : (
                                                                <Typography variant="body2" color="textSecondary"
                                                                            sx={{textAlign: 'center', py: 3}}>
                                                                    No failed payments
                                                                    in {paymentHealthData.periodLabel.toLowerCase()}
                                                                </Typography>
                                                            )
                                                        ) : (
                                                            <Box sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: isMobile ? 100 : 200
                                                            }}>
                                                                <CircularProgress size={30}/>
                                                            </Box>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Payment Holidays & Expiring Contracts - Stack on Mobile */}
                            <Grid container spacing={isMobile ? 2 : 3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Payment Holidays",
                                            suspendedContractsData ? `Period: ${suspendedContractsData.periodLabel}` : "Suspended contracts",
                                            "paymentHolidays"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["paymentHolidays"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 'auto' : 350,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {suspendedContractsData ? (
                                                    <Box>
                                                        <Typography
                                                            variant={isMobile ? "body2" : "subtitle2"}
                                                            gutterBottom
                                                            sx={{fontWeight: 'medium'}}
                                                        >
                                                            Payment Holiday Reasons
                                                        </Typography>
                                                        <Box
                                                            ref={el => chartContainers.current['holidayReasons'] = el}
                                                            sx={{
                                                                mb: 3,
                                                                height: isMobile ? 120 : 150
                                                            }}
                                                        >
                                                            <Bar
                                                                data={{
                                                                    labels: Object.keys(suspendedContractsData.holidayReasons),
                                                                    datasets: [
                                                                        {
                                                                            label: 'Count',
                                                                            data: Object.values(suspendedContractsData.holidayReasons),
                                                                            backgroundColor: 'rgba(153, 102, 255, 0.7)'
                                                                        }
                                                                    ]
                                                                }}
                                                                options={getChartOptions(isMobile)}
                                                            />
                                                        </Box>
                                                        <Typography
                                                            variant={isMobile ? "body2" : "subtitle2"}
                                                            gutterBottom
                                                            sx={{fontWeight: 'medium'}}
                                                        >
                                                            Revenue Impact
                                                        </Typography>
                                                        <Typography variant={isMobile ? "subtitle1" : "h6"}
                                                                    color="error">
                                                            €{suspendedContractsData.totalLostRevenue.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Total revenue lost from payment holidays
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Expiring Contracts",
                                            expiringContractsData ? `Period: ${expiringContractsData.periodLabel}` : "Upcoming contract expirations",
                                            "expiringContracts"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["expiringContracts"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 'auto' : 350,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {expiringContractsData ? (
                                                    <Box>
                                                        <Typography
                                                            variant={isMobile ? "body2" : "subtitle2"}
                                                            gutterBottom
                                                            sx={{fontWeight: 'medium'}}
                                                        >
                                                            Monthly Expirations
                                                        </Typography>
                                                        <Box
                                                            ref={el => chartContainers.current['monthlyExpirations'] = el}
                                                            sx={{
                                                                mb: 3,
                                                                height: isMobile ? 120 : 150
                                                            }}
                                                        >
                                                            <Bar
                                                                data={{
                                                                    labels: expiringContractsData.monthlyExpirations.map(m => m.month),
                                                                    datasets: [
                                                                        {
                                                                            label: 'Contracts',
                                                                            data: expiringContractsData.monthlyExpirations.map(m => m.count),
                                                                            backgroundColor: 'rgba(255, 99, 132, 0.7)'
                                                                        },
                                                                        {
                                                                            label: 'Value (€)',
                                                                            data: expiringContractsData.monthlyExpirations.map(m => m.value),
                                                                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                                                                            yAxisID: 'y1'
                                                                        }
                                                                    ]
                                                                }}
                                                                options={{
                                                                    ...getChartOptions(isMobile),
                                                                    scales: {
                                                                        y: {
                                                                            type: 'linear',
                                                                            position: 'left',
                                                                            title: {
                                                                                display: !isMobile,
                                                                                text: 'Contract Count'
                                                                            },
                                                                            ticks: {
                                                                                font: {
                                                                                    size: isMobile ? 10 : 12
                                                                                }
                                                                            }
                                                                        },
                                                                        y1: {
                                                                            type: 'linear',
                                                                            position: 'right',
                                                                            grid: {
                                                                                drawOnChartArea: false
                                                                            },
                                                                            title: {
                                                                                display: !isMobile,
                                                                                text: 'Value (€)'
                                                                            },
                                                                            ticks: {
                                                                                font: {
                                                                                    size: isMobile ? 10 : 12
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            mt: 2,
                                                            flexDirection: isMobile ? 'column' : 'row',
                                                            gap: isMobile ? 1 : 0
                                                        }}>
                                                            <Box>
                                                                <Typography
                                                                    variant={isMobile ? "body2" : "subtitle2"}
                                                                    gutterBottom
                                                                    sx={{fontWeight: 'medium'}}
                                                                >
                                                                    Total Expirations
                                                                </Typography>
                                                                <Typography variant={isMobile ? "subtitle1" : "h6"}>
                                                                    {expiringContractsData.totalExpirations}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography
                                                                    variant={isMobile ? "body2" : "subtitle2"}
                                                                    gutterBottom
                                                                    sx={{fontWeight: 'medium'}}
                                                                >
                                                                    At-Risk Revenue
                                                                </Typography>
                                                                <Typography variant={isMobile ? "subtitle1" : "h6"}
                                                                            color="error">
                                                                    €{expiringContractsData.atRiskRevenue.toFixed(2)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Training & Service Analysis */}
                    {activeTab === 3 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(classCapacityData)}
                            </Typography>

                            {/* Class Capacity */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "Class Capacity",
                                            "Utilization rates by training type",
                                            "classCapacity"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["classCapacity"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 'auto' : 350,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {classCapacityData ? (
                                                    <Grid container spacing={isMobile ? 2 : 3}>
                                                        <Grid item xs={12} md={7}>
                                                            <Box
                                                                ref={el => chartContainers.current['capacityBar'] = el}
                                                                sx={{
                                                                    height: isMobile ? 200 : 300
                                                                }}
                                                            >
                                                                <Bar
                                                                    data={{
                                                                        labels: Object.keys(classCapacityData.byTrainingType),
                                                                        datasets: [
                                                                            {
                                                                                label: 'Utilization (%)',
                                                                                data: Object.values(classCapacityData.byTrainingType).map(t => t.utilization),
                                                                                backgroundColor: Object.values(classCapacityData.byTrainingType).map(t =>
                                                                                    t.utilization > 90 ? 'rgba(244, 67, 54, 0.7)' :  // red
                                                                                        t.utilization > 70 ? 'rgba(255, 152, 0, 0.7)' :  // orange
                                                                                            t.utilization > 50 ? 'rgba(255, 193, 7, 0.7)' :  // amber
                                                                                                'rgba(76, 175, 80, 0.7)'                         // green
                                                                                )
                                                                            }
                                                                        ]
                                                                    }}
                                                                    options={{
                                                                        ...getChartOptions(isMobile),
                                                                        indexAxis: 'y',
                                                                        scales: {
                                                                            x: {
                                                                                min: 0,
                                                                                max: 100,
                                                                                title: {
                                                                                    display: !isMobile,
                                                                                    text: 'Utilization (%)'
                                                                                },
                                                                                ticks: {
                                                                                    font: {
                                                                                        size: isMobile ? 10 : 12
                                                                                    }
                                                                                },
                                                                                display: true
                                                                            },
                                                                            y: {
                                                                                ticks: {
                                                                                    font: {
                                                                                        size: isMobile ? 10 : 12
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} md={5}>
                                                            <Box sx={{mb: 3, textAlign: isMobile ? 'center' : 'left'}}>
                                                                <Typography
                                                                    variant={isMobile ? "body2" : "subtitle2"}
                                                                    gutterBottom
                                                                    sx={{fontWeight: 'medium'}}
                                                                >
                                                                    Average Utilization
                                                                </Typography>
                                                                <Typography
                                                                    variant={isMobile ? "h5" : "h4"}
                                                                    sx={{fontWeight: 'medium'}}
                                                                >
                                                                    {classCapacityData.averageUtilization}%
                                                                </Typography>
                                                                <Typography variant="caption" color="textSecondary">
                                                                    across all classes
                                                                    in {classCapacityData.periodLabel.toLowerCase()}
                                                                </Typography>
                                                            </Box>

                                                            {!isMobile && (
                                                                <>
                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                        Utilization Breakdown
                                                                    </Typography>
                                                                    <TableContainer>
                                                                        <Table size="small">
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell>Training Type</TableCell>
                                                                                    <TableCell
                                                                                        align="right">Capacity</TableCell>
                                                                                    <TableCell
                                                                                        align="right">Attendees</TableCell>
                                                                                    <TableCell
                                                                                        align="right">Utilization</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                {Object.entries(classCapacityData.byTrainingType).map(([type, data], index) => (
                                                                                    <TableRow key={index}>
                                                                                        <TableCell>{type}</TableCell>
                                                                                        <TableCell
                                                                                            align="right">{data.totalCapacity}</TableCell>
                                                                                        <TableCell
                                                                                            align="right">{data.totalAttendees}</TableCell>
                                                                                        <TableCell align="right">
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                justifyContent: 'flex-end'
                                                                                            }}>
                                                                                                <Typography
                                                                                                    variant="body2"
                                                                                                    sx={{mr: 1}}>
                                                                                                    {data.utilization}%
                                                                                                </Typography>
                                                                                                <Box sx={{width: 40}}>
                                                                                                    <LinearProgress
                                                                                                        variant="determinate"
                                                                                                        value={data.utilization}
                                                                                                        color={
                                                                                                            data.utilization > 90 ? 'error' :
                                                                                                                data.utilization > 70 ? 'warning' :
                                                                                                                    'success'
                                                                                                        }
                                                                                                        sx={{
                                                                                                            height: 8,
                                                                                                            borderRadius: 4
                                                                                                        }}
                                                                                                    />
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))}
                                                                            </TableBody>
                                                                        </Table>
                                                                    </TableContainer>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Training Popularity & Time Preference - Stack on mobile */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Training Type Popularity",
                                            trainingTypesData ? `Period: ${trainingTypesData.periodLabel}` : "Attendance by training type",
                                            "trainingPopularity"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["trainingPopularity"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['trainingPopularity'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {trainingTypesData ? (
                                                    <Pie
                                                        data={{
                                                            labels: trainingTypesData.popularity.map(p => p.trainingType || 'Other'),
                                                            datasets: [
                                                                {
                                                                    data: trainingTypesData.popularity.map(p => p.attendees),
                                                                    backgroundColor: [
                                                                        'rgba(255, 99, 132, 0.7)',
                                                                        'rgba(54, 162, 235, 0.7)',
                                                                        'rgba(255, 206, 86, 0.7)',
                                                                        'rgba(75, 192, 192, 0.7)',
                                                                        'rgba(153, 102, 255, 0.7)',
                                                                        'rgba(255, 159, 64, 0.7)'
                                                                    ]
                                                                }
                                                            ]
                                                        }}
                                                        options={getChartOptions(isMobile)}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Time of Day Preference",
                                            "Attendance by time of day",
                                            "timePreference"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["timePreference"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['timePreference'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {trainingTypesData ? (
                                                    <Bar
                                                        data={{
                                                            labels: trainingTypesData.timePreference.map(p => p.time_of_day),
                                                            datasets: [
                                                                {
                                                                    label: 'Attendees',
                                                                    data: trainingTypesData.timePreference.map(p => p.attendees),
                                                                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                                                                }
                                                            ]
                                                        }}
                                                        options={getChartOptions(isMobile)}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Trainer Comparison */}

                            <Grid container spacing={isMobile ? 2 : 3}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            "Trainer Performance",
                                            trainerComparisonData ?
                                                `Comparison of trainers by attendance and retention in ${trainerComparisonData.periodLabel.toLowerCase()}`
                                                : "Comparison of trainers by attendance and retention",
                                            "trainerPerformance"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["trainerPerformance"] !== false} timeout="auto">
                                            <CardContent sx={{p: isMobile ? 1 : 2}}>
                                                {trainerComparisonData ? (
                                                    <TableContainer sx={{
                                                        maxHeight: isMobile ? 300 : 400,
                                                        overflowX: 'auto'
                                                    }}>
                                                        <Table stickyHeader size={isMobile ? "small" : "medium"}>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Trainer</TableCell>
                                                                    <TableCell align="center">Classes</TableCell>
                                                                    {!isMobile && <TableCell align="center">Total
                                                                        Attendance</TableCell>}
                                                                    <TableCell align="center">Avg Attendance</TableCell>
                                                                    {!isMobile &&
                                                                        <TableCell align="center">Retention</TableCell>}
                                                                    <TableCell align="center">Retention Rate</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {trainerComparisonData.data.map((trainer, index) => {
                                                                    const retentionRate = trainer.totalAttendance > 0 ?
                                                                        (trainer.retention / trainer.totalAttendance * 100).toFixed(1) : '0';

                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell
                                                                                sx={{whiteSpace: 'nowrap'}}>{trainer.trainerName}</TableCell>
                                                                            <TableCell
                                                                                align="center">{trainer.classesCount}</TableCell>
                                                                            {!isMobile && <TableCell
                                                                                align="center">{trainer.totalAttendance}</TableCell>}
                                                                            <TableCell
                                                                                align="center">{trainer.averageAttendance}</TableCell>
                                                                            {!isMobile && <TableCell
                                                                                align="center">{trainer.retention}</TableCell>}
                                                                            <TableCell align="center">
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                    flexDirection: isMobile ? 'column' : 'row'
                                                                                }}>
                                                                                    <Typography variant="body2" sx={{
                                                                                        mr: isMobile ? 0 : 1,
                                                                                        mb: isMobile ? 0.5 : 0
                                                                                    }}>
                                                                                        {retentionRate}%
                                                                                    </Typography>
                                                                                    <Box
                                                                                        sx={{width: isMobile ? 40 : 60}}>
                                                                                        <LinearProgress
                                                                                            variant="determinate"
                                                                                            value={Math.min(parseFloat(retentionRate), 100)}
                                                                                            color={
                                                                                                parseFloat(retentionRate) > 70 ? 'success' :
                                                                                                    parseFloat(retentionRate) > 40 ? 'warning' :
                                                                                                        'error'
                                                                                            }
                                                                                            sx={{
                                                                                                height: isMobile ? 6 : 8,
                                                                                                borderRadius: 4
                                                                                            }}
                                                                                        />
                                                                                    </Box>
                                                                                </Box>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 200
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Client Retention & Engagement - Mobile Optimized */}
                    {activeTab === 4 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(churnData)}
                            </Typography>

                            {/* Churn Analysis */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        {renderCardHeader(
                                            "Churn Rate Trend",
                                            "Monthly churn rate",
                                            "churnRateTrend"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["churnRateTrend"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['churnRateTrend'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {churnData ? (
                                                    <Line
                                                        data={{
                                                            labels: churnData.monthlyChurn.map(d => d.month),
                                                            datasets: [
                                                                {
                                                                    label: 'Churn Rate (%)',
                                                                    data: churnData.monthlyChurn.map(d => d.churn_rate),
                                                                    borderColor: 'rgba(255, 99, 132, 1)',
                                                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                                                    tension: 0.3,
                                                                    pointRadius: isMobile ? 1 : 3,
                                                                    borderWidth: isMobile ? 2 : 3
                                                                },
                                                                {
                                                                    label: 'Active Users',
                                                                    data: churnData.monthlyChurn.map(d => d.active_users),
                                                                    borderColor: 'rgba(54, 162, 235, 1)',
                                                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                                    tension: 0.3,
                                                                    yAxisID: 'y1',
                                                                    pointRadius: isMobile ? 1 : 3,
                                                                    borderWidth: isMobile ? 2 : 3
                                                                }
                                                            ]
                                                        }}
                                                        options={{
                                                            ...getChartOptions(isMobile),
                                                            scales: {
                                                                y: {
                                                                    title: {
                                                                        display: !isMobile,
                                                                        text: 'Churn Rate (%)'
                                                                    },
                                                                    min: 0,
                                                                    ticks: {
                                                                        font: {
                                                                            size: isMobile ? 10 : 12
                                                                        }
                                                                    }
                                                                },
                                                                y1: {
                                                                    type: 'linear',
                                                                    display: true,
                                                                    position: 'right',
                                                                    grid: {
                                                                        drawOnChartArea: false
                                                                    },
                                                                    title: {
                                                                        display: !isMobile,
                                                                        text: 'Active Users'
                                                                    },
                                                                    ticks: {
                                                                        font: {
                                                                            size: isMobile ? 10 : 12
                                                                        }
                                                                    }
                                                                },
                                                                x: {
                                                                    ticks: {
                                                                        font: {
                                                                            size: isMobile ? 10 : 12
                                                                        },
                                                                        display: !isMobile
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card sx={{height: '100%'}}>
                                        {renderCardHeader(
                                            "Current Churn Rate",
                                            null,
                                            "currentChurnRate"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["currentChurnRate"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: isMobile ? 200 : 240,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {churnData ? (
                                                    <Box sx={{textAlign: 'center'}}>
                                                        <Typography
                                                            variant={isMobile ? "h3" : "h2"}
                                                            sx={{
                                                                mb: 1,
                                                                color: churnData.currentChurnRate > 10 ? 'error.main' :
                                                                    churnData.currentChurnRate > 5 ? 'warning.main' :
                                                                        'success.main'
                                                            }}
                                                        >
                                                            {churnData.currentChurnRate}%
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {churnData.currentChurnRate > 10 ? 'High churn rate!' :
                                                                churnData.currentChurnRate > 5 ? 'Moderate churn rate' :
                                                                    'Healthy churn rate'}
                                                        </Typography>
                                                        <Box sx={{mt: 2}}>
                                                            {churnData.currentChurnRate > 10 ? (
                                                                <Chip
                                                                    icon={<Warning/>}
                                                                    label="Action Required"
                                                                    color="error"
                                                                    variant="outlined"
                                                                    size={isMobile ? "small" : "medium"}
                                                                />
                                                            ) : churnData.currentChurnRate > 5 ? (
                                                                <Chip
                                                                    icon={<Info/>}
                                                                    label="Monitor Closely"
                                                                    color="warning"
                                                                    variant="outlined"
                                                                    size={isMobile ? "small" : "medium"}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    icon={<CheckCircleOutlineIcon/>}
                                                                    label="Good Standing"
                                                                    color="success"
                                                                    variant="outlined"
                                                                    size={isMobile ? "small" : "medium"}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <CircularProgress size={30}/>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Client Lifecycle & Member Distribution - Stack on mobile */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Membership Duration",
                                            clientLifecycleData ? `Period: ${clientLifecycleData.periodLabel}` : "Length of client relationships",
                                            "membershipDuration"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["membershipDuration"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['membershipDuration'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {clientLifecycleData ? (
                                                    <Pie
                                                        data={{
                                                            labels: clientLifecycleData.membershipDuration.map(d => d.duration),
                                                            datasets: [
                                                                {
                                                                    data: clientLifecycleData.membershipDuration.map(d => d.members),
                                                                    backgroundColor: [
                                                                        'rgba(255, 99, 132, 0.7)',
                                                                        'rgba(255, 159, 64, 0.7)',
                                                                        'rgba(255, 205, 86, 0.7)',
                                                                        'rgba(75, 192, 192, 0.7)',
                                                                        'rgba(54, 162, 235, 0.7)'
                                                                    ]
                                                                }
                                                            ]
                                                        }}
                                                        options={getChartOptions(isMobile)}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Engagement Levels",
                                            "Member participation frequency",
                                            "engagementLevels"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["engagementLevels"] !== false} timeout="auto">
                                            <CardContent
                                                ref={el => chartContainers.current['engagementLevels'] = el}
                                                sx={{
                                                    height: isMobile ? 250 : 300,
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {clientLifecycleData ? (
                                                    <Bar
                                                        data={{
                                                            labels: clientLifecycleData.engagementLevels.map(d => d.engagement_level),
                                                            datasets: [
                                                                {
                                                                    label: 'Members',
                                                                    data: clientLifecycleData.engagementLevels.map(d => d.members),
                                                                    backgroundColor: [
                                                                        'rgba(244, 67, 54, 0.7)',
                                                                        'rgba(255, 152, 0, 0.7)',
                                                                        'rgba(76, 175, 80, 0.7)',
                                                                        'rgba(33, 150, 243, 0.7)'
                                                                    ]
                                                                }
                                                            ]
                                                        }}
                                                        options={getChartOptions(isMobile)}
                                                    />
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Client Achievements - Stack on mobile */}
                            <Grid container spacing={isMobile ? 2 : 3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Top Achievers",
                                            clientAchievementsData ? `Period: ${clientAchievementsData.periodLabel}` : "Members with most recorded achievements",
                                            "topAchievers"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["topAchievers"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 250 : 350,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {clientAchievementsData ? (
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Member</TableCell>
                                                                    <TableCell align="center">Records</TableCell>
                                                                    <TableCell>Last Record</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {clientAchievementsData.topAchievers.map((achiever, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell
                                                                            sx={{whiteSpace: 'nowrap'}}>{achiever.fullName}</TableCell>
                                                                        <TableCell
                                                                            align="center">{achiever.records_count}</TableCell>
                                                                        <TableCell>{new Date(achiever.last_record).toLocaleDateString()}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Progress Trends",
                                            "Average improvement in weightlifting exercises",
                                            "progressTrends"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["progressTrends"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 250 : 350,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {clientAchievementsData ? (
                                                    <Box>
                                                        {clientAchievementsData.progressTrends.length > 0 ? (
                                                            <Box
                                                                ref={el => chartContainers.current['progressTrends'] = el}
                                                                sx={{
                                                                    height: isMobile ? 150 : 200
                                                                }}
                                                            >
                                                                <Bar
                                                                    data={{
                                                                        labels: clientAchievementsData.progressTrends.map(d =>
                                                                            isMobile && d.exercise.length > 10 ? d.exercise.slice(0, 10) + '...' : d.exercise
                                                                        ),
                                                                        datasets: [
                                                                            {
                                                                                label: 'Avg. Improvement (kg)',
                                                                                data: clientAchievementsData.progressTrends.map(d => d.avg_improvement),
                                                                                backgroundColor: clientAchievementsData.progressTrends.map(d =>
                                                                                    d.avg_improvement > 0 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)'
                                                                                )
                                                                            }
                                                                        ]
                                                                    }}
                                                                    options={{
                                                                        ...getChartOptions(isMobile),
                                                                        indexAxis: 'y'
                                                                    }}
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="textSecondary"
                                                                        sx={{textAlign: 'center', py: 3}}>
                                                                Not enough data to show progress trends
                                                            </Typography>
                                                        )}

                                                        <Divider sx={{my: 2}}/>

                                                        <Typography
                                                            variant={isMobile ? "body2" : "subtitle2"}
                                                            gutterBottom
                                                            sx={{fontWeight: 'medium'}}
                                                        >
                                                            Records by Type
                                                        </Typography>
                                                        <Box sx={{mt: 1}}>
                                                            {clientAchievementsData.recordsByType.map((type, index) => (
                                                                <Box key={index} sx={{mb: 1}}>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        mb: 0.5
                                                                    }}>
                                                                        <Typography
                                                                            variant={isMobile ? "caption" : "body2"}>{type.type}</Typography>
                                                                        <Typography
                                                                            variant={isMobile ? "caption" : "body2"}
                                                                            fontWeight="medium">{type.count}</Typography>
                                                                    </Box>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={Math.min((type.count / Math.max(...clientAchievementsData.recordsByType.map(t => t.count))) * 100, 100)}
                                                                        sx={{height: isMobile ? 6 : 8, borderRadius: 4}}
                                                                    />
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Growth Potential & Early Warnings - Mobile Optimized */}
                    {activeTab === 5 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data
                                for: {getPeriodLabel(earlyWarningsData || dormantClientsData || growthOpportunitiesData)}
                            </Typography>

                            {/* Early Warning System */}
                            <Grid container spacing={isMobile ? 2 : 3} sx={{mb: isMobile ? 2 : 3}}>
                                <Grid item xs={12}>
                                    <Card>
                                        {renderCardHeader(
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Error color="error" sx={{mr: 1}}/>
                                                <Typography variant={isMobile ? "subtitle1" : "h6"}>Early Warning
                                                    System</Typography>
                                                {earlyWarningsData && earlyWarningsData.summary && (
                                                    <Badge
                                                        badgeContent={earlyWarningsData.summary.high}
                                                        color="error"
                                                        sx={{ml: 2}}
                                                    />
                                                )}
                                            </Box>,
                                            "Critical issues requiring attention",
                                            "earlyWarnings"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["earlyWarnings"] !== false} timeout="auto">
                                            <CardContent sx={{p: isMobile ? 1 : 2}}>
                                                {earlyWarningsData ? (
                                                    earlyWarningsData.warnings && earlyWarningsData.warnings.length > 0 ? (
                                                        <TableContainer sx={{
                                                            maxHeight: isMobile ? 250 : 350,
                                                            overflowX: 'auto'
                                                        }}>
                                                            <Table stickyHeader size={isMobile ? "small" : "medium"}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Severity</TableCell>
                                                                        <TableCell>Type</TableCell>
                                                                        <TableCell>Details</TableCell>
                                                                        {!isMobile && <TableCell>Date</TableCell>}

                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {earlyWarningsData.warnings.map((warning, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>
                                                                                <Chip
                                                                                    label={warning.severity}
                                                                                    size="small"
                                                                                    color={
                                                                                        warning.severity === 'High' ? 'error' :
                                                                                            warning.severity === 'Medium' ? 'warning' :
                                                                                                'success'
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell sx={{whiteSpace: 'nowrap'}}>{warning.type} - {warning.user?.fullName || ""}</TableCell>
                                                                            <TableCell>
                                                                                {isMobile && warning.details.length > 30 ?
                                                                                    warning.details.substring(0, 30) + '...' :
                                                                                    warning.details
                                                                                }
                                                                            </TableCell>
                                                                            {!isMobile &&
                                                                                <TableCell>{new Date(warning.date).toLocaleDateString()}</TableCell>}

                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{textAlign: 'center', py: 3}}>
                                                            No warnings detected - everything looks good!
                                                        </Typography>
                                                    )
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 200
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Dormant Clients & Growth Opportunities - Stack on mobile */}
                            <Grid container spacing={isMobile ? 2 : 3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Dormant Clients",
                                            "Members with active plans but low attendance",
                                            "dormantClients"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["dormantClients"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 320 : 400,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                {dormantClientsData ? (
                                                    dormantClientsData.dormantClients && dormantClientsData.dormantClients.length > 0 ? (
                                                        <TableContainer>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Member</TableCell>
                                                                        <TableCell>Plan</TableCell>
                                                                        <TableCell align="center">Recent</TableCell>
                                                                        <TableCell align="right">Exp. Date</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {dormantClientsData.dormantClients.map((client, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell
                                                                                sx={{whiteSpace: 'nowrap'}}>{client.fullName}</TableCell>
                                                                            <TableCell>
                                                                                {isMobile && client.planName.length > 15 ?
                                                                                    client.planName.substring(0, 15) + '...' :
                                                                                    client.planName
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center">{client.visits_in_last_30_days}</TableCell>
                                                                            <TableCell
                                                                                align="right">{new Date(client.endDate).toLocaleDateString()}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{textAlign: 'center', py: 3}}>
                                                            No dormant clients detected
                                                        </Typography>
                                                    )
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: '100%'
                                                    }}>
                                                        <CircularProgress size={30}/>
                                                    </Box>
                                                )}

                                                {dormantClientsData &&
                                                    dormantClientsData.dormantClients &&
                                                    dormantClientsData.dormantClients.length > 0 &&
                                                    dormantClientsData.valueAtRisk && (
                                                        <Box sx={{
                                                            mt: 2,
                                                            p: 2,
                                                            bgcolor: 'background.paper',
                                                            borderRadius: 1
                                                        }}>
                                                            <Typography
                                                                variant={isMobile ? "body2" : "subtitle2"}
                                                                gutterBottom
                                                                sx={{fontWeight: 'medium'}}
                                                            >
                                                                Value at Risk
                                                            </Typography>
                                                            <Typography variant={isMobile ? "subtitle1" : "h6"}
                                                                        color="error">
                                                                €{dormantClientsData.valueAtRisk.toFixed(2)}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Potential revenue loss if these members cancel
                                                            </Typography>
                                                        </Box>
                                                    )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        {renderCardHeader(
                                            "Growth Opportunities",
                                            "Members ready for upgrades or renewals",
                                            "growthOpportunities"
                                        )}
                                        <Divider/>
                                        <Collapse in={expandedCards["growthOpportunities"] !== false} timeout="auto">
                                            <CardContent
                                                sx={{
                                                    height: isMobile ? 320 : 400,
                                                    overflow: 'auto',
                                                    p: isMobile ? 1 : 2
                                                }}
                                            >
                                                <Typography
                                                    variant={isMobile ? "body2" : "subtitle2"}
                                                    gutterBottom
                                                    sx={{fontWeight: 'medium'}}
                                                >
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <TrendingUp sx={{mr: 1, color: 'success.main'}}
                                                                    fontSize="small"/>
                                                        Potential Upgrades
                                                    </Box>
                                                </Typography>
                                                {growthOpportunitiesData ? (
                                                    growthOpportunitiesData.frequentAttenders && growthOpportunitiesData.frequentAttenders.length > 0 ? (
                                                        <TableContainer sx={{mb: 3}}>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Member</TableCell>
                                                                        <TableCell>Current Plan</TableCell>
                                                                        <TableCell align="center">Recent</TableCell>
                                                                        <TableCell align="center">Left</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {growthOpportunitiesData.frequentAttenders.map((client, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell
                                                                                sx={{whiteSpace: 'nowrap'}}>{client.fullName}</TableCell>
                                                                            <TableCell>
                                                                                {isMobile && client.current_plan.length > 12 ?
                                                                                    client.current_plan.substring(0, 12) + '...' :
                                                                                    client.current_plan
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center">{client.visits_in_last_30_days}</TableCell>
                                                                            <TableCell align="center">
                                                                                <Chip
                                                                                    label={client.sessions_left}
                                                                                    size="small"
                                                                                    color={client.sessions_left < 5 ? 'error' : 'warning'}
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{textAlign: 'center', py: 2, mb: 2}}>
                                                            No upgrade opportunities detected
                                                        </Typography>
                                                    )
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 100
                                                    }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                )}

                                                <Divider sx={{my: 2}}/>

                                                <Typography
                                                    variant={isMobile ? "body2" : "subtitle2"}
                                                    gutterBottom
                                                    sx={{fontWeight: 'medium'}}
                                                >
                                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                        <AccessTime sx={{mr: 1, color: 'warning.main'}}
                                                                    fontSize="small"/>
                                                        Active Plans Expiring Soon
                                                    </Box>
                                                </Typography>
                                                {growthOpportunitiesData ? (
                                                    growthOpportunitiesData.expiringActivePlans && growthOpportunitiesData.expiringActivePlans.length > 0 ? (
                                                        <TableContainer>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Member</TableCell>
                                                                        <TableCell>Plan</TableCell>
                                                                        <TableCell align="center">Recent</TableCell>
                                                                        <TableCell align="right">Exp. Date</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {growthOpportunitiesData.expiringActivePlans.map((client, index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell
                                                                                sx={{whiteSpace: 'nowrap'}}>{client.fullName}</TableCell>
                                                                            <TableCell>
                                                                                {isMobile && client.planName.length > 12 ?
                                                                                    client.planName.substring(0, 12) + '...' :
                                                                                    client.planName
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell
                                                                                align="center">{client.visits_in_last_30_days}</TableCell>
                                                                            <TableCell
                                                                                align="right">{new Date(client.endDate).toLocaleDateString()}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{textAlign: 'center', py: 2}}>
                                                            No active plans expiring soon
                                                        </Typography>
                                                    )
                                                ) : (
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 100
                                                    }}>
                                                        <CircularProgress size={24}/>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default AnalyticsDashboard;