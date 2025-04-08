// src/components/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Paper, Typography, Card, CardContent, CardHeader,
    Divider, CircularProgress, Button, Chip, Avatar, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    List, ListItem, ListItemText, ListItemAvatar,
    Alert, Tab, Tabs, Tooltip, LinearProgress
} from '@mui/material';
import {
    Warning, Error, Info,
    TrendingUp, AccessTime, Person,
    CalendarToday, AttachMoney, Refresh
} from '@mui/icons-material';
import { analyticsApi } from '../api/analyticsApi';
import { Line, Bar, Pie } from 'react-chartjs-2';
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

// Chart style configuration
const chartOptions = {
    scales: {
        x: {
            display: false // See peidab x-telje koos kuupäevadega
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000
    },
    plugins: {
        legend: {
            position: 'bottom',

        },
    },
};

// Heat map colors
const getHeatMapColor = (count) => {
    if (count >= 10) return 'rgba(76, 175, 80, 0.8)';    // Green for 10+
    if (count >= 5) return 'rgba(255, 193, 7, 0.8)';     // Yellow for 5-9
    if (count >= 0.5) return 'rgba(213, 0, 0, 0.8)';       // Red for 1-4
    return 'rgba(224, 224, 224, 0.5)';                   // Light gray (default)
};

const AnalyticsDashboard = ({ affiliateId }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    // Get the current active period based on the tab
    const getCurrentPeriod = () => {
        switch (activeTab) {
            case 0: return dashboardPeriod;
            case 1: return activityPeriod;
            case 2: return financialPeriod;
            case 3: return trainingPeriod;
            case 4: return retentionPeriod;
            case 5: return growthPeriod;
            default: return 'ALL_TIME';
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

    // Determine which period selector to show based on the active tab
    const getPeriodSelectorType = () => {
        switch (activeTab) {
            case 0: return 'financial'; // Dashboard shows financial periods
            case 1: return 'behavior';  // Activity shows behavior periods
            case 2: return 'financial'; // Financial shows financial periods
            case 3: return 'behavior';  // Training shows behavior periods
            case 4: return 'historical'; // Retention shows historical periods
            case 5: return 'behavior';  // Growth shows behavior periods
            default: return 'all';
        }
    };

    // Get the current period for the active tab
    const getActivePeriod = () => {
        switch (activeTab) {
            case 0: return dashboardPeriod;
            case 1: return activityPeriod;
            case 2: return financialPeriod;
            case 3: return trainingPeriod;
            case 4: return retentionPeriod;
            case 5: return growthPeriod;
            default: return 'ALL_TIME';
        }
    };

    // Get period label for displaying in UI
    const getPeriodLabel = (data) => {
        return data && data.periodLabel ? data.periodLabel : '';
    };

    if (!affiliateId) {
        return (
            <Alert severity="warning">
                Please select an affiliate to view analytics.
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                    Analytics Dashboard
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Refresh Data
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Dashboard" />
                    <Tab label="Activity & Behavior" />
                    <Tab label="Financial Analysis" />
                    <Tab label="Training Analysis" />
                    <Tab label="Client Retention" />
                    <Tab label="Growth & Warnings" />
                </Tabs>
            </Paper>

            {/* Period Selector */}
            <PeriodSelector
                period={getActivePeriod()}
                onPeriodChange={handlePeriodChange}
                periodsToShow={getPeriodSelectorType()}
            />

            {loading && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
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

                            {/* KPI Cards */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Active Members
                                            </Typography>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {dashboardData.totalMembers}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                <Person fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Total enrolled members
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Visits
                                            </Typography>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {dashboardData.visitsInPeriod}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                <CalendarToday fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Check-ins during {dashboardData.periodLabel.toLowerCase()}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Revenue
                                            </Typography>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                €{dashboardData.revenueInPeriod.toFixed(2)}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                <AttachMoney fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Total revenue for {dashboardData.periodLabel.toLowerCase()}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Active Plans
                                            </Typography>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {dashboardData.activePlans}
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                <AccessTime fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                                                <Typography variant="body2" color="textSecondary">
                                                    Current valid memberships
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Alert Summaries */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="At-Risk Members" />
                                        <Divider />
                                        <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {dashboardData.atRiskMembers.length > 0 ? (
                                                <List>
                                                    {dashboardData.atRiskMembers.map((member, index) => (
                                                        <ListItem key={index} divider={index < dashboardData.atRiskMembers.length - 1}>
                                                            <ListItemAvatar>
                                                                <Avatar sx={{ bgcolor: 'error.light' }}>
                                                                    {member.fullName.charAt(0)}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={member.fullName}
                                                                secondary={`${member.visits} visits in the last 30 days`}
                                                            />
                                                            <Chip
                                                                label="At Risk"
                                                                color="error"
                                                                size="small"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                                                    No at-risk members detected
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Expiring Contracts" />
                                        <Divider />
                                        <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {dashboardData.expiringContracts.length > 0 ? (
                                                <List>
                                                    {dashboardData.expiringContracts.map((contract, index) => {
                                                        const daysUntil = Math.ceil((new Date(contract.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
                                                        return (
                                                            <ListItem key={index} divider={index < dashboardData.expiringContracts.length - 1}>
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{ bgcolor: 'warning.light' }}>
                                                                        {contract.user.fullName.charAt(0)}
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={contract.user.fullName}
                                                                    secondary={`Expires in ${daysUntil} days (${new Date(contract.validUntil).toLocaleDateString()})`}
                                                                />
                                                                <Chip
                                                                    label={daysUntil <= 7 ? "Urgent" : "Soon"}
                                                                    color={daysUntil <= 7 ? "error" : "warning"}
                                                                    size="small"
                                                                    sx={{ ml: 1 }}
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                                                    No contracts expiring in the next 30 days
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Top Members by Check-Ins"
                                            subheader={`Most active members in ${topMembersData.periodLabel}`}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 350, overflow: 'auto' }}>
                                            {topMembersData.data.length > 0 ? (
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
                                                                    <TableCell align="right">{member.check_in_count}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                                                    No check-in data available for this period
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Activity & Behavior */}
                    {activeTab === 1 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(activityData)}
                            </Typography>

                            {/* Activity Graph */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader title="Member Activity" />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                                tension: 0.3
                                                            }
                                                        ]
                                                    }}
                                                    options={chartOptions}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Heatmap & Visit Frequency */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Visit Heatmap" subheader="Most popular days and times" />
                                        <Divider />
                                        <CardContent sx={{ height: 350 }}>
                                            {heatmapData ? (
                                                <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, height: '100%' }}>
                                                        {Array.from(Array(7)).map((_, day) => (
                                                            <Box key={day} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                                <Typography variant="caption" align="center" sx={{ mb: 1 }}>
                                                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 0.5 }}>
                                                                    {Array.from(Array(17)).map((_, hour) => {
                                                                        const hourData = heatmapData.data.find(d => d.dayOfWeek === day + 1 && d.hour === hour + 6);
                                                                        const value = hourData ? hourData.count : 0;
                                                                        const maxValue = Math.max(...heatmapData.data.map(d => d.count));
                                                                        const normalizedValue = maxValue > 0 ? value / maxValue : 0;

                                                                        return (
                                                                            <Tooltip
                                                                                key={hour}
                                                                                title={`${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]} ${hour + 6}:00 - ${value} visits`}
                                                                                arrow
                                                                            >
                                                                                <Box
                                                                                    sx={{
                                                                                        height: '100%',
                                                                                        flexGrow: 1,
                                                                                        backgroundColor: getHeatMapColor(normalizedValue),
                                                                                        borderRadius: 1,
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
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Visit Frequency" subheader="Distribution of member attendance" />
                                        <Divider />
                                        <CardContent sx={{ height: 350 }}>
                                            {visitFrequencyData ? (
                                                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                                        options={{
                                                            ...chartOptions,
                                                            plugins: {
                                                                ...chartOptions.plugins,
                                                                tooltip: {
                                                                    callbacks: {
                                                                        label: function(context) {
                                                                            const label = context.label || '';
                                                                            const value = context.formattedValue || '';
                                                                            const dataset = context.dataset;
                                                                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                                                            const percentage = Math.round((context.raw / total) * 100);
                                                                            return `${label}: ${value} members (${percentage}%)`;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* At-Risk Members */}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            title="At-Risk Members"
                                            subheader="Members who have significantly reduced their attendance"
                                        />
                                        <Divider />
                                        <CardContent>
                                            {atRiskData ? (
                                                <>
                                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                                        Comparison: {atRiskData.comparisonInfo?.currentPeriod} vs {atRiskData.comparisonInfo?.previousPeriod}
                                                    </Typography>
                                                    {atRiskData.data.length > 0 ? (
                                                        <TableContainer sx={{ maxHeight: 400 }}>
                                                            <Table size="small" stickyHeader>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Member</TableCell>
                                                                        <TableCell>Email</TableCell>
                                                                        <TableCell align="center">Recent Visits</TableCell>
                                                                        <TableCell align="center">Previous Visits</TableCell>
                                                                        <TableCell align="center">Last Visit</TableCell>
                                                                        <TableCell align="center">Risk Level</TableCell>
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
                                                                                <TableCell>{member.fullName}</TableCell>
                                                                                <TableCell>{member.email}</TableCell>
                                                                                <TableCell align="center">{member.recent_visits}</TableCell>
                                                                                <TableCell align="center">{member.previous_visits}</TableCell>
                                                                                <TableCell align="center">
                                                                                    {new Date(member.last_visit).toLocaleDateString()}
                                                                                </TableCell>
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
                                                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                                            No at-risk members detected
                                                        </Typography>
                                                    )}
                                                </>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Financial Analysis */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(contractsData)}
                            </Typography>

                            {/* Contracts Overview & ARPU */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Contract Types" subheader="Distribution of active contracts" />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
                                            {contractsData ? (
                                                <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                                        options={chartOptions}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Average Revenue Per User (ARPU)"
                                            subheader={arpuData ? `Period: ${arpuData.periodLabel}` : "Monthly trend"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                                yAxisID: 'y'
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
                                                        ...chartOptions,
                                                        scales: {
                                                            y: {
                                                                type: 'linear',
                                                                display: true,
                                                                position: 'left',
                                                                title: {
                                                                    display: true,
                                                                    text: 'ARPU (€)'
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
                                                                    display: true,
                                                                    text: 'Revenue (€)'
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Payment Health */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            title="Payment Health"
                                            subheader={paymentHealthData ? `Period: ${paymentHealthData.periodLabel}` : "Payment status and issues"}
                                        />
                                        <Divider />
                                        <CardContent>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={4}>
                                                    {paymentHealthData ? (
                                                        <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                                                options={chartOptions}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                                            <CircularProgress size={30} />
                                                        </Box>
                                                    )}
                                                </Grid>

                                                <Grid item xs={12} md={8}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Failed Payments
                                                    </Typography>
                                                    {paymentHealthData ? (
                                                        paymentHealthData.failedPayments.length > 0 ? (
                                                            <TableContainer sx={{ maxHeight: 300 }}>
                                                                <Table size="small" stickyHeader>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Member</TableCell>
                                                                            <TableCell>Amount</TableCell>
                                                                            <TableCell>Date</TableCell>
                                                                            <TableCell align="right">Actions</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {paymentHealthData.failedPayments.map((payment, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{payment.user.fullName}</TableCell>
                                                                                <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                                                                                <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                                                                                <TableCell align="right">
                                                                                    <Button size="small" variant="outlined">
                                                                                        Contact
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        ) : (
                                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                                                No failed payments in {paymentHealthData.periodLabel.toLowerCase()}
                                                            </Typography>
                                                        )
                                                    ) : (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                                            <CircularProgress size={30} />
                                                        </Box>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Payment Holidays & Expiring Contracts */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Payment Holidays"
                                            subheader={suspendedContractsData ? `Period: ${suspendedContractsData.periodLabel}` : "Suspended contracts"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 350 }}>
                                            {suspendedContractsData ? (
                                                <Box>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Payment Holiday Reasons
                                                    </Typography>
                                                    <Box sx={{ mb: 3, height: 150 }}>
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
                                                            options={chartOptions}
                                                        />
                                                    </Box>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Revenue Impact
                                                    </Typography>
                                                    <Typography variant="h6" color="error">
                                                        €{suspendedContractsData.totalLostRevenue.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        Total revenue lost from payment holidays
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Expiring Contracts"
                                            subheader={expiringContractsData ? `Period: ${expiringContractsData.periodLabel}` : "Upcoming contract expirations"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 350 }}>
                                            {expiringContractsData ? (
                                                <Box>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Monthly Expirations
                                                    </Typography>
                                                    <Box sx={{ mb: 3, height: 150 }}>
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
                                                                ...chartOptions,
                                                                scales: {
                                                                    y: {
                                                                        type: 'linear',
                                                                        position: 'left',
                                                                        title: {
                                                                            display: true,
                                                                            text: 'Contract Count'
                                                                        }
                                                                    },
                                                                    y1: {
                                                                        type: 'linear',
                                                                        position: 'right',
                                                                        grid: {
                                                                            drawOnChartArea: false
                                                                        },
                                                                        title: {
                                                                            display: true,
                                                                            text: 'Value (€)'
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                        <Box>
                                                            <Typography variant="subtitle2" gutterBottom>
                                                                Total Expirations
                                                            </Typography>
                                                            <Typography variant="h6">
                                                                {expiringContractsData.totalExpirations}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="subtitle2" gutterBottom>
                                                                At-Risk Revenue
                                                            </Typography>
                                                            <Typography variant="h6" color="error">
                                                                €{expiringContractsData.atRiskRevenue.toFixed(2)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
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
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader title="Class Capacity" subheader="Utilization rates by training type" />
                                        <Divider />
                                        <CardContent sx={{ height: 350 }}>
                                            {classCapacityData ? (
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={7}>
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
                                                                ...chartOptions,
                                                                indexAxis: 'y',
                                                                scales: {
                                                                    x: {
                                                                        min: 0,
                                                                        max: 100,
                                                                        title: {
                                                                            display: true,
                                                                            text: 'Utilization (%)'
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={5}>
                                                        <Box sx={{ mb: 3 }}>
                                                            <Typography variant="subtitle2" gutterBottom>
                                                                Average Utilization
                                                            </Typography>
                                                            <Typography variant="h4" sx={{ fontWeight: 'medium' }}>
                                                                {classCapacityData.averageUtilization}%
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                across all classes in {classCapacityData.periodLabel.toLowerCase()}
                                                            </Typography>
                                                        </Box>

                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Utilization Breakdown
                                                        </Typography>
                                                        <TableContainer>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Training Type</TableCell>
                                                                        <TableCell align="right">Capacity</TableCell>
                                                                        <TableCell align="right">Attendees</TableCell>
                                                                        <TableCell align="right">Utilization</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {Object.entries(classCapacityData.byTrainingType).map(([type, data], index) => (
                                                                        <TableRow key={index}>
                                                                            <TableCell>{type}</TableCell>
                                                                            <TableCell align="right">{data.totalCapacity}</TableCell>
                                                                            <TableCell align="right">{data.totalAttendees}</TableCell>
                                                                            <TableCell align="right">
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                                                                        {data.utilization}%
                                                                                    </Typography>
                                                                                    <Box sx={{ width: 40 }}>
                                                                                        <LinearProgress
                                                                                            variant="determinate"
                                                                                            value={data.utilization}
                                                                                            color={
                                                                                                data.utilization > 90 ? 'error' :
                                                                                                    data.utilization > 70 ? 'warning' :
                                                                                                        'success'
                                                                                            }
                                                                                            sx={{ height: 8, borderRadius: 4 }}
                                                                                        />
                                                                                    </Box>
                                                                                </Box>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Training Popularity & Time Preference */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Training Type Popularity"
                                            subheader={trainingTypesData ? `Period: ${trainingTypesData.periodLabel}` : "Attendance by training type"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                    options={chartOptions}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Time of Day Preference" subheader="Attendance by time of day" />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                    options={chartOptions}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Trainer Comparison */}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            title="Trainer Performance"
                                            subheader={trainerComparisonData ?
                                                `Comparison of trainers by attendance and retention in ${trainerComparisonData.periodLabel.toLowerCase()}`
                                                : "Comparison of trainers by attendance and retention"
                                            }
                                        />
                                        <Divider />
                                        <CardContent>
                                            {trainerComparisonData ? (
                                                <TableContainer sx={{ maxHeight: 400 }}>
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Trainer</TableCell>
                                                                <TableCell align="center">Classes Taught</TableCell>
                                                                <TableCell align="center">Total Attendance</TableCell>
                                                                <TableCell align="center">Avg Attendance</TableCell>
                                                                <TableCell align="center">Retention</TableCell>
                                                                <TableCell align="center">Retention Rate</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {trainerComparisonData.data.map((trainer, index) => {
                                                                const retentionRate = trainer.totalAttendance > 0 ?
                                                                    (trainer.retention / trainer.totalAttendance * 100).toFixed(1) : '0';

                                                                return (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{trainer.trainerName}</TableCell>
                                                                        <TableCell align="center">{trainer.classesCount}</TableCell>
                                                                        <TableCell align="center">{trainer.totalAttendance}</TableCell>
                                                                        <TableCell align="center">{trainer.averageAttendance}</TableCell>
                                                                        <TableCell align="center">{trainer.retention}</TableCell>
                                                                        <TableCell align="center">
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                                <Typography variant="body2" sx={{ mr: 1 }}>
                                                                                    {retentionRate}%
                                                                                </Typography>
                                                                                <Box sx={{ width: 60 }}>
                                                                                    <LinearProgress
                                                                                        variant="determinate"
                                                                                        value={Math.min(parseFloat(retentionRate), 100)}
                                                                                        color={
                                                                                            parseFloat(retentionRate) > 70 ? 'success' :
                                                                                                parseFloat(retentionRate) > 40 ? 'warning' :
                                                                                                    'error'
                                                                                        }
                                                                                        sx={{ height: 8, borderRadius: 4 }}
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
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Client Retention & Engagement */}
                    {activeTab === 4 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(churnData)}
                            </Typography>

                            {/* Churn Analysis */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        <CardHeader title="Churn Rate Trend" subheader="Monthly churn rate" />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                                tension: 0.3
                                                            },
                                                            {
                                                                label: 'Active Users',
                                                                data: churnData.monthlyChurn.map(d => d.active_users),
                                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                                                tension: 0.3,
                                                                yAxisID: 'y1'
                                                            }
                                                        ]
                                                    }}
                                                    options={{
                                                        ...chartOptions,
                                                        scales: {
                                                            y: {
                                                                title: {
                                                                    display: true,
                                                                    text: 'Churn Rate (%)'
                                                                },
                                                                min: 0
                                                            },
                                                            y1: {
                                                                type: 'linear',
                                                                display: true,
                                                                position: 'right',
                                                                grid: {
                                                                    drawOnChartArea: false
                                                                },
                                                                title: {
                                                                    display: true,
                                                                    text: 'Active Users'
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card sx={{ height: '100%' }}>
                                        <CardHeader title="Current Churn Rate" />
                                        <Divider />
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                                            {churnData ? (
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h2" sx={{ mb: 1, color:
                                                            churnData.currentChurnRate > 10 ? 'error.main' :
                                                                churnData.currentChurnRate > 5 ? 'warning.main' :
                                                                    'success.main'
                                                    }}>
                                                        {churnData.currentChurnRate}%
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {churnData.currentChurnRate > 10 ? 'High churn rate!' :
                                                            churnData.currentChurnRate > 5 ? 'Moderate churn rate' :
                                                                'Healthy churn rate'}
                                                    </Typography>
                                                    <Box sx={{ mt: 2 }}>
                                                        {churnData.currentChurnRate > 10 ? (
                                                            <Chip
                                                                icon={<Warning />}
                                                                label="Action Required"
                                                                color="error"
                                                                variant="outlined"
                                                            />
                                                        ) : churnData.currentChurnRate > 5 ? (
                                                            <Chip
                                                                icon={<Info />}
                                                                label="Monitor Closely"
                                                                color="warning"
                                                                variant="outlined"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                icon={<CheckCircleOutlineIcon />}
                                                                label="Good Standing"
                                                                color="success"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <CircularProgress size={30} />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Client Lifecycle & Member Distribution */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Membership Duration"
                                            subheader={clientLifecycleData ? `Period: ${clientLifecycleData.periodLabel}` : "Length of client relationships"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                    options={chartOptions}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Engagement Levels" subheader="Member participation frequency" />
                                        <Divider />
                                        <CardContent sx={{ height: 300 }}>
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
                                                    options={chartOptions}
                                                />
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Client Achievements */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Top Achievers"
                                            subheader={clientAchievementsData ? `Period: ${clientAchievementsData.periodLabel}` : "Members with most recorded achievements"}
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 350, overflow: 'auto' }}>
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
                                                                    <TableCell>{achiever.fullName}</TableCell>
                                                                    <TableCell align="center">{achiever.records_count}</TableCell>
                                                                    <TableCell>{new Date(achiever.last_record).toLocaleDateString()}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title="Progress Trends" subheader="Average improvement in weightlifting exercises" />
                                        <Divider />
                                        <CardContent sx={{ height: 350, overflow: 'auto' }}>
                                            {clientAchievementsData ? (
                                                <Box>
                                                    {clientAchievementsData.progressTrends.length > 0 ? (
                                                        <Bar
                                                            data={{
                                                                labels: clientAchievementsData.progressTrends.map(d => d.exercise),
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
                                                                ...chartOptions,
                                                                indexAxis: 'y'
                                                            }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                                            Not enough data to show progress trends
                                                        </Typography>
                                                    )}

                                                    <Divider sx={{ my: 2 }} />

                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Records by Type
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {clientAchievementsData.recordsByType.map((type, index) => (
                                                            <Box key={index} sx={{ mb: 1 }}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                                    <Typography variant="body2">{type.type}</Typography>
                                                                    <Typography variant="body2" fontWeight="medium">{type.count}</Typography>
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={Math.min((type.count / Math.max(...clientAchievementsData.recordsByType.map(t => t.count))) * 100, 100)}
                                                                    sx={{ height: 8, borderRadius: 4 }}
                                                                />
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Growth Potential & Early Warnings */}
                    {activeTab === 5 && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Showing data for: {getPeriodLabel(earlyWarningsData || dormantClientsData || growthOpportunitiesData)}
                            </Typography>

                            {/* Early Warning System */}
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            title={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Error color="error" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">Early Warning System</Typography>
                                                    {earlyWarningsData && earlyWarningsData.summary && (
                                                        <Badge
                                                            badgeContent={earlyWarningsData.summary.high}
                                                            color="error"
                                                            sx={{ ml: 2 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            subheader="Critical issues requiring attention"
                                        />
                                        <Divider />
                                        <CardContent>
                                            {earlyWarningsData ? (
                                                earlyWarningsData.warnings && earlyWarningsData.warnings.length > 0 ? (
                                                    <TableContainer sx={{ maxHeight: 350 }}>
                                                        <Table stickyHeader>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Severity</TableCell>
                                                                    <TableCell>Type</TableCell>
                                                                    <TableCell>Details</TableCell>
                                                                    <TableCell>Date</TableCell>
                                                                    <TableCell align="right">Actions</TableCell>
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
                                                                        <TableCell>{warning.type}</TableCell>
                                                                        <TableCell>{warning.details}</TableCell>
                                                                        <TableCell>{new Date(warning.date).toLocaleDateString()}</TableCell>
                                                                        <TableCell align="right">
                                                                            {warning.user && (
                                                                                <Button size="small" variant="outlined">
                                                                                    Contact
                                                                                </Button>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                                        No warnings detected - everything looks good!
                                                    </Typography>
                                                )
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Dormant Clients & Growth Opportunities */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Dormant Clients"
                                            subheader="Members with active plans but low attendance"
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 400, overflow: 'auto' }}>
                                            {dormantClientsData ? (
                                                dormantClientsData.dormantClients && dormantClientsData.dormantClients.length > 0 ? (
                                                    <TableContainer>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Member</TableCell>
                                                                    <TableCell>Plan</TableCell>
                                                                    <TableCell align="center">Recent Visits</TableCell>
                                                                    <TableCell align="right">Exp. Date</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {dormantClientsData.dormantClients.map((client, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{client.fullName}</TableCell>
                                                                        <TableCell>{client.planName}</TableCell>
                                                                        <TableCell align="center">{client.visits_in_last_30_days}</TableCell>
                                                                        <TableCell align="right">{new Date(client.endDate).toLocaleDateString()}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                                                        No dormant clients detected
                                                    </Typography>
                                                )
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                    <CircularProgress size={30} />
                                                </Box>
                                            )}

                                            {dormantClientsData &&
                                                dormantClientsData.dormantClients &&
                                                dormantClientsData.dormantClients.length > 0 &&
                                                dormantClientsData.valueAtRisk && (
                                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Value at Risk
                                                        </Typography>
                                                        <Typography variant="h6" color="error">
                                                            €{dormantClientsData.valueAtRisk.toFixed(2)}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Potential revenue loss if these members cancel
                                                        </Typography>
                                                    </Box>
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardHeader
                                            title="Growth Opportunities"
                                            subheader="Members ready for upgrades or renewals"
                                        />
                                        <Divider />
                                        <CardContent sx={{ height: 400, overflow: 'auto' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TrendingUp sx={{ mr: 1, color: 'success.main' }} fontSize="small" />
                                                    Potential Upgrades
                                                </Box>
                                            </Typography>
                                            {growthOpportunitiesData ? (
                                                growthOpportunitiesData.frequentAttenders && growthOpportunitiesData.frequentAttenders.length > 0 ? (
                                                    <TableContainer sx={{ mb: 3 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Member</TableCell>
                                                                    <TableCell>Current Plan</TableCell>
                                                                    <TableCell align="center">Recent Visits</TableCell>
                                                                    <TableCell align="center">Sessions Left</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {growthOpportunitiesData.frequentAttenders.map((client, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{client.fullName}</TableCell>
                                                                        <TableCell>{client.current_plan}</TableCell>
                                                                        <TableCell align="center">{client.visits_in_last_30_days}</TableCell>
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
                                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2, mb: 2 }}>
                                                        No upgrade opportunities detected
                                                    </Typography>
                                                )
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                                                    <CircularProgress size={24} />
                                                </Box>
                                            )}

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="subtitle2" gutterBottom>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AccessTime sx={{ mr: 1, color: 'warning.main' }} fontSize="small" />
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
                                                                    <TableCell align="center">Recent Visits</TableCell>
                                                                    <TableCell align="right">Exp. Date</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {growthOpportunitiesData.expiringActivePlans.map((client, index) => (
                                                                    <TableRow key={index}>
                                                                        <TableCell>{client.fullName}</TableCell>
                                                                        <TableCell>{client.planName}</TableCell>
                                                                        <TableCell align="center">{client.visits_in_last_30_days}</TableCell>
                                                                        <TableCell align="right">{new Date(client.endDate).toLocaleDateString()}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                                        No active plans expiring soon
                                                    </Typography>
                                                )
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                                                    <CircularProgress size={24} />
                                                </Box>
                                            )}
                                        </CardContent>
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