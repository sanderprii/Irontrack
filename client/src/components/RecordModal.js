import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    useMediaQuery,
    useTheme,
    Box,
    Typography,
    Grid,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { alpha } from '@mui/material/styles';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
    LabelList
} from 'recharts';

// Import the RecordEditModal component
import RecordEditModal from './RecordEditModal';

const RecordModal = ({ open, onClose, recordType, recordName }) => {
    const [allRecords, setAllRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);
    const [chartType, setChartType] = useState('line');
    const [viewEditRecord, setViewEditRecord] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null);

    // Responsive design
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Number of records to display
    const sliceAmount = isMobile ? 3 : 10;
    const [startIndex, setStartIndex] = useState(0);

    // Load all records for this name
    const loadAllRecords = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(
                `${baseUrl}/records/${encodeURIComponent(recordName)}?type=${recordType}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (!response.ok) {
                throw new Error('Error fetching records by name');
            }
            const data = await response.json();
            setAllRecords(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Load data when modal opens
    useEffect(() => {
        if (open && recordName) {
            loadAllRecords();
        }
        // eslint-disable-next-line
    }, [open, recordName]);

    // Set default view to show newest records
    useEffect(() => {
        if (!allRecords || allRecords.length === 0) {
            setStartIndex(0);
            return;
        }

        const total = allRecords.length;
        const desiredStart = total - sliceAmount;
        const clampedStart = desiredStart < 0 ? 0 : desiredStart;
        setStartIndex(clampedStart);
    }, [allRecords, sliceAmount]);

    // Handle record deletion
    const handleDeleteRecord = async (recordId) => {
        try {
            const confirmDelete = window.confirm('Do you want to delete this record?');
            if (!confirmDelete) return;

            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL;
            const response = await fetch(`${baseUrl}/records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete record');
            }
            loadAllRecords();
        } catch (err) {
            console.error(err);
        }
    };

    // Open edit dialog for a record
    const handleEditRecord = (record) => {
        console.log('record', record);
        setViewEditRecord(record);
        setShowEditDialog(true);
    };

    // Format date for display on chart
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = d.getFullYear().toString().slice(-2);
        return `${mm}/${yy}`;
    };

    // Format full date for table view
    const formatFullDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle chart click for record deletion
    const handleChartClick = (state) => {
        if (state && state.activePayload) {
            const { payload } = state.activePayload[0] || {};
            if (payload && payload.id) {
                handleDeleteRecord(payload.id);
            }
        }
    };

    const toggleRowExpand = (recordId) => {
        if (isMobile) {
            setExpandedRowId(prevId => prevId === recordId ? null : recordId);
        }
    };

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!allRecords || allRecords.length === 0) return [];

        // Sort by date (oldest to newest)
        const sorted = [...allRecords].sort((a, b) => new Date(a.date) - new Date(b.date));

        return sorted.map((r) => {
            let rawValue = '';
            if (recordType === 'Cardio') {
                rawValue = r.time || '';
            } else if (recordType === 'Weightlifting') {
                rawValue = r.weight != null ? String(r.weight) : '';
            } else {
                // WOD
                rawValue = r.score || '';
            }

            // Convert time format for Y-axis
            const parseString = rawValue.includes(':')
                ? rawValue.replace(':', '.')
                : rawValue;

            const floatVal = parseFloat(parseString) || 0;

            return {
                id: r.id,
                date: formatDate(r.date),
                value: floatVal,
                displayValue: rawValue,
                fullDate: r.date,
                comment: r.comment
            };
        });
    }, [allRecords, recordType]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return {
                bestValue: 0,
                bestDate: '',
                worstValue: 0,
                worstDate: '',
                avgValue: 0,
                totalEntries: 0,
                recentTrend: 0,
                progress: 0
            };
        }

        let bestRecord, worstRecord;

        if (recordType === 'Cardio') {
            // For Cardio, lower is better
            bestRecord = [...chartData].sort((a, b) => a.value - b.value)[0];
            worstRecord = [...chartData].sort((a, b) => b.value - a.value)[0];
        } else {
            // For Weightlifting and WOD, higher is better
            bestRecord = [...chartData].sort((a, b) => b.value - a.value)[0];
            worstRecord = [...chartData].sort((a, b) => a.value - b.value)[0];
        }

        // Calculate average
        const sum = chartData.reduce((acc, record) => acc + record.value, 0);
        const avg = sum / chartData.length;

        // Calculate recent trend (last 5 records or fewer)
        const sortedByDate = [...chartData].sort((a, b) =>
            new Date(b.fullDate) - new Date(a.fullDate));

        let recentTrend = 0;
        let progress = 0;

        if (sortedByDate.length >= 2) {
            const latest = sortedByDate[0].value;
            const previous = sortedByDate[1].value;

            if (recordType === 'Cardio') {
                // For Cardio, negative percentage is good (faster time)
                recentTrend = ((latest - previous) / previous) * 100;

                // Overall progress (first record vs latest record)
                const first = chartData[0].value;
                progress = ((latest - first) / first) * 100;
            } else {
                // For Weightlifting and WOD, positive percentage is good
                recentTrend = ((latest - previous) / previous) * 100;

                // Overall progress
                const first = chartData[0].value;
                progress = ((latest - first) / first) * 100;
            }
        }

        return {
            bestValue: bestRecord?.displayValue || 0,
            bestDate: formatFullDate(bestRecord?.fullDate) || '',
            worstValue: worstRecord?.displayValue || 0,
            worstDate: formatFullDate(worstRecord?.fullDate) || '',
            avgValue: avg.toFixed(recordType === 'Weightlifting' ? 1 : 2),
            totalEntries: chartData.length,
            recentTrend: recentTrend.toFixed(1),
            progress: progress.toFixed(1)
        };
    }, [chartData, recordType]);

    // Data to display in chart (based on current slice)
    const endIndex = startIndex + sliceAmount;
    const showData = chartData.slice(startIndex, endIndex);

    // Navigation state
    const hasOlder = startIndex > 0;
    const hasNewer = endIndex < chartData.length;

    // Navigation handlers
    const handleShowOlder = () => {
        setStartIndex((prev) => Math.max(0, prev - sliceAmount));
    };

    const handleShowNewer = () => {
        setStartIndex((prev) => Math.min(chartData.length - sliceAmount, prev + sliceAmount));
    };

    // Tab change handler
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Toggle chart type
    const toggleChartType = () => {
        setChartType(prev => prev === 'line' ? 'bar' : 'line');
    };

    // Determine if trend is positive or negative based on record type
    const isTrendPositive = (value) => {
        if (recordType === 'Cardio') {
            // For Cardio, negative trend is good (faster time)
            return parseFloat(value) < 0;
        }
        // For Weightlifting and WOD, positive trend is good
        return parseFloat(value) > 0;
    };

    // Get trend color based on value and record type
    const getTrendColor = (value) => {
        const isPositive = isTrendPositive(value);
        return isPositive ? theme.palette.success.main : theme.palette.error.main;
    };

    // Get trend icon based on value and record type
    const getTrendIcon = (value) => {
        const isPositive = isTrendPositive(value);
        return isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />;
    };

    // Render stat card with icon, title, and value
    const StatCard = ({ icon, title, value, color, secondary }) => (
        <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {icon}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color }}>
                    {value}
                </Typography>
                {secondary && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {secondary}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullScreen={isMobile}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {recordName}
                            <Typography component="span" variant="subtitle1" sx={{ ml: 1, color: 'text.secondary' }}>
                                ({recordType})
                            </Typography>
                        </Typography>
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{ ml: 'auto' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : showData.length === 0 ? (
                        <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                            No data found for this record.
                        </Typography>
                    ) : (
                        <>
                            {/* Stats summary section */}
                            <Box sx={{ mb: 4 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<EmojiEventsIcon color="primary" />}
                                            title="Personal Best"
                                            value={stats.bestValue}
                                            color={theme.palette.primary.main}
                                            secondary={`Achieved on ${stats.bestDate}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={getTrendIcon(stats.recentTrend)}
                                            title="Recent Trend"
                                            value={`${stats.recentTrend}%`}
                                            color={getTrendColor(stats.recentTrend)}
                                            secondary="Last record vs previous"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={getTrendIcon(stats.progress)}
                                            title="Overall Progress"
                                            value={`${stats.progress}%`}
                                            color={getTrendColor(stats.progress)}
                                            secondary="First record vs latest"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <StatCard
                                            icon={<BarChartIcon />}
                                            title="Average"
                                            value={stats.avgValue}
                                            secondary={`From ${stats.totalEntries} entries`}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Tabs for different views */}
                            <Paper sx={{ mb: 3 }}>
                                <Tabs
                                    value={selectedTab}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label="Chart" icon={<TimelineIcon />} />
                                    <Tab label="Data Table" icon={<BarChartIcon />} />
                                </Tabs>
                            </Paper>

                            {/* Chart View */}
                            {selectedTab === 0 && (
                                <>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mb: 1
                                    }}>
                                        <Button
                                            size="small"
                                            onClick={toggleChartType}
                                            startIcon={chartType === 'line' ? <BarChartIcon /> : <TimelineIcon />}
                                        >
                                            Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
                                        </Button>
                                    </Box>
                                    <Box sx={{ width: '100%', height: 400 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            {chartType === 'line' ? (
                                                <LineChart
                                                    data={showData}
                                                    margin={{ top: 60, right: 30, left: 20, bottom: 30 }}
                                                    onClick={handleChartClick}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value, name) => {
                                                            return showData.find(d => d.value === value)?.displayValue || value;
                                                        }}
                                                    />
                                                    <Legend />
                                                    <ReferenceLine
                                                        y={parseFloat(stats.avgValue)}
                                                        stroke="#FF9800"
                                                        strokeDasharray="3 3"
                                                        label={{
                                                            value: 'Average',
                                                            position: 'right',
                                                            fill: '#FF9800'
                                                        }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke="#1976d2"
                                                        strokeWidth={2}
                                                        dot={{ r: 5 }}
                                                        activeDot={{ r: 8 }}
                                                        isAnimationActive={false}
                                                    >
                                                        <LabelList dataKey="displayValue" position="top" offset={10} />
                                                    </Line>
                                                </LineChart>
                                            ) : (
                                                <BarChart
                                                    data={showData}
                                                    margin={{ top: 60, right: 30, left: 20, bottom: 30 }}
                                                    onClick={handleChartClick}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value, name) => {
                                                            return showData.find(d => d.value === value)?.displayValue || value;
                                                        }}
                                                    />
                                                    <Legend />
                                                    <ReferenceLine
                                                        y={parseFloat(stats.avgValue)}
                                                        stroke="#FF9800"
                                                        strokeDasharray="3 3"
                                                        label={{
                                                            value: 'Average',
                                                            position: 'right',
                                                            fill: '#FF9800'
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="value"
                                                        fill="#1976d2"
                                                        isAnimationActive={false}
                                                    >
                                                        <LabelList dataKey="displayValue" position="top" offset={10} />
                                                    </Bar>
                                                </BarChart>
                                            )}
                                        </ResponsiveContainer>
                                    </Box>

                                    {/* Navigation buttons */}
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {hasOlder ? (
                                            <Button variant="contained" onClick={handleShowOlder}>
                                                Show older
                                            </Button>
                                        ) : (
                                            <span />
                                        )}

                                        {hasNewer ? (
                                            <Button variant="contained" onClick={handleShowNewer}>
                                                Show newer
                                            </Button>
                                        ) : (
                                            <span />
                                        )}
                                    </Box>
                                </>
                            )}

                            {/* Data Table View */}
                            {selectedTab === 1 && (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>
                                                    {recordType === 'Weightlifting' ? 'Weight (kg)' :
                                                        recordType === 'Cardio' ? 'Time' : 'Score'}
                                                </TableCell>
                                                <TableCell>Change</TableCell>
                                                {!isMobile && (
                                                    <TableCell>Comment</TableCell>
                                                )}
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {chartData.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate)).map((record, idx, arr) => {
                                                // Calculate change from previous record (if exists)
                                                let change = null;
                                                if (idx < arr.length - 1) {
                                                    const prevValue = arr[idx + 1].value;
                                                    const currValue = record.value;
                                                    const diff = ((currValue - prevValue) / prevValue) * 100;
                                                    change = diff.toFixed(1);
                                                }

                                                return (
                                                    <React.Fragment key={record.id}>
                                                        <TableRow
                                                            hover
                                                            onClick={() => toggleRowExpand(record.id)}
                                                            sx={{
                                                                cursor: isMobile ? 'pointer' : 'default',
                                                                '& > *': { borderBottom: expandedRowId === record.id ? 0 : undefined }
                                                            }}
                                                        >
                                                            <TableCell>{formatFullDate(record.fullDate)}</TableCell>
                                                            <TableCell>{record.displayValue}</TableCell>
                                                            <TableCell>
                                                                {change !== null && (
                                                                    <Chip
                                                                        size="small"
                                                                        label={`${change > 0 ? '+' : ''}${change}%`}
                                                                        color={
                                                                            isTrendPositive(change)
                                                                                ? 'success'
                                                                                : 'error'
                                                                        }
                                                                        icon={getTrendIcon(change)}
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            {!isMobile && (
                                                                <TableCell>
                                                                    {record.comment && (
                                                                        <Typography variant="body2" sx={{
                                                                            maxWidth: 200,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap'
                                                                        }}>
                                                                            {record.comment}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                            )}
                                                            <TableCell align="right">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Väldi rea avamist kui vajutatakse nuppu
                                                                        handleEditRecord(record);
                                                                    }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Väldi rea avamist kui vajutatakse nuppu
                                                                        handleDeleteRecord(record.id);
                                                                    }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>

                                                        {/* Kommentaari rida mobiilvaates */}
                                                        {isMobile && expandedRowId === record.id && record.comment && (
                                                            <TableRow sx={{ backgroundColor: theme.palette.primary.light + '0D' }}>
                                                                <TableCell colSpan={5} sx={{ py: 1.5, px: 2 }}>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                            Comment:
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            {record.comment}
                                                                        </Typography>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} variant="outlined">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Record Modal */}
            {showEditDialog && viewEditRecord && (
                <RecordEditModal
                    open={showEditDialog}
                    onClose={() => setShowEditDialog(false)}
                    record={viewEditRecord}
                    recordType={recordType}
                    onSave={loadAllRecords}
                />
            )}
        </>
    );
};

export default RecordModal;