import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Paper,
    Chip,
    IconButton,
    InputAdornment,
    useMediaQuery,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    Divider
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AppTheme from "../shared-theme/AppTheme";
import RecordModal from "../components/RecordModal";

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(3),
}));

const RecordCard = styled(Paper)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(2, 3),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[6],
    },
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
    },
}));

const ProgressChip = styled(Chip)(({ theme, progress }) => ({
    fontWeight: 'bold',
    backgroundColor: progress > 0
        ? 'rgba(46, 125, 50, 0.2)'
        : 'rgba(211, 47, 47, 0.2)',
    color: progress > 0
        ? theme.palette.success.main
        : theme.palette.error.main,
}));

export default function RecordsPage() {
    const [recordType, setRecordType] = useState('WOD');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    // Record form state
    const [recordName, setRecordName] = useState('');
    const [selectedExistingName, setSelectedExistingName] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [recordScore, setRecordScore] = useState('');
    const [recordWeight, setRecordWeight] = useState('');
    const [recordTime, setRecordTime] = useState('');

    // Track existing record names for the dropdown
    const [existingNames, setExistingNames] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [recordModalOpen, setRecordModalOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        loadRecords();
    }, [recordType]);

    const loadRecords = async () => {
        try {
            setError('');
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/records?type=${recordType}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error fetching records');
            }

            const data = await response.json();
            setRecords(data);

            // Extract unique names for the dropdown
            const names = data.map(record => record.name);
            setExistingNames(names);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordTypeChange = (event, newType) => {
        if (newType) {
            setRecordType(newType);
            setSearchQuery('');
        }
    };

    const handleOpenAddRecord = () => {
        setError('');
        setRecordName('');
        setSelectedExistingName('');
        setRecordDate('');
        setRecordScore('');
        setRecordWeight('');
        setRecordTime('');
        setAddModalOpen(true);
    };

    const handleCloseAddRecord = () => {
        setAddModalOpen(false);
    };

    const handleExistingNameChange = (event) => {
        const selectedName = event.target.value;
        setSelectedExistingName(selectedName);

        // If a name is selected from dropdown, clear the manual input
        if (selectedName) {
            setRecordName('');
        }
    };

    const handleManualNameChange = (event) => {
        const manualName = event.target.value;
        setRecordName(manualName);

        // If user starts typing a name manually, clear the dropdown selection
        if (manualName) {
            setSelectedExistingName('');
        }
    };

    const getFinalName = () => {
        // Return either the selected name from dropdown or manually entered name
        return selectedExistingName || recordName;
    };

    const handleSaveRecord = async () => {
        try {
            setError('');

            // Validate that either a dropdown selection or manual name is provided
            const finalName = getFinalName();
            if (!finalName) {
                setError('Please select an existing name or enter a new one');
                return;
            }

            // Validate date
            if (!recordDate) {
                setError('Please enter a date');
                return;
            }

            // Validate type-specific fields
            if (recordType === 'WOD' && !recordScore) {
                setError('Please enter a score');
                return;
            } else if (recordType === 'Weightlifting' && !recordWeight) {
                setError('Please enter a weight');
                return;
            } else if (recordType === 'Cardio' && !recordTime) {
                setError('Please enter a time');
                return;
            }

            const token = localStorage.getItem('token');
            let payload = {
                type: recordType,
                name: finalName.toUpperCase(),
                date: recordDate,
            };

            // vastavalt tüübile
            if (recordType === 'WOD') {
                payload.score = recordScore;
            } else if (recordType === 'Weightlifting') {
                payload.weight = recordWeight;
            } else if (recordType === 'Cardio') {
                payload.time = recordTime;
            }

            const response = await fetch(`${API_URL}/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Failed to create record');
            }
            setAddModalOpen(false);
            loadRecords();
        } catch (err) {
            setError(err.message);
        }
    };

    // Kaardile klõps -> avame RecordModal
    const handleOpenRecordModal = (record) => {
        setSelectedRecord(record);
        setRecordModalOpen(true);
    };

    const handleCloseRecordModal = () => {
        setRecordModalOpen(false);
        setSelectedRecord(null);
    };

    // Mock function to simulate progress data
    // In a real app, this would come from your API
    const getProgressData = (record) => {
        // This is just for demonstration - you would replace this with real logic
        if (record.name.includes('PRESS')) return 13;
        if (record.name.includes('DEADLIFT')) return -6;
        if (record.name.includes('OVERHEAD')) return -10;
        return null; // No progress data available
    };

    // Filter records based on search query
    const filteredRecords = records.filter((rec) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            rec.name.toLowerCase().includes(lowerCaseQuery) ||
            (recordType === 'WOD' && rec.score?.toString().toLowerCase().includes(lowerCaseQuery)) ||
            (recordType === 'Weightlifting' && rec.weight?.toString().toLowerCase().includes(lowerCaseQuery)) ||
            (recordType === 'Cardio' && rec.time?.toString().toLowerCase().includes(lowerCaseQuery))
        );
    });

    return (
        <AppTheme>
            <StyledContainer maxWidth="md">
                <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                    RECORDS
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

                <FilterContainer elevation={3}>
                    <ToggleButtonGroup
                        color="primary"
                        value={recordType}
                        exclusive
                        onChange={handleRecordTypeChange}
                        aria-label="record type"
                        sx={{
                            '& .MuiToggleButton-root': {
                                px: 3,
                                py: 1,
                                fontWeight: 'medium',
                            }
                        }}
                    >
                        <ToggleButton value="WOD">WOD</ToggleButton>
                        <ToggleButton value="Weightlifting">Weightlifting</ToggleButton>
                        <ToggleButton value="Cardio">Cardio</ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                            justifyContent: 'space-between'
                        }
                    }}>
                        <TextField
                            placeholder="Search records..."
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ minWidth: isMobile ? '100%' : 200 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenAddRecord}
                            startIcon={<AddIcon />}
                            sx={{
                                fontWeight: 'bold',
                                [theme.breakpoints.down('sm')]: {
                                    width: '100%'
                                }
                            }}
                        >
                            Add Record
                        </Button>
                    </Box>
                </FilterContainer>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {filteredRecords.length === 0 ? (
                            <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
                                No records found. Add your first record!
                            </Typography>
                        ) : (
                            <Box sx={{ width: '100%' }}>
                                {filteredRecords.map((rec) => {
                                    let valueDisplay = '';
                                    if (recordType === 'WOD') {
                                        valueDisplay = rec.score || '';
                                    } else if (recordType === 'Weightlifting') {
                                        valueDisplay = `${rec.weight || ''} KG`;
                                    } else if (recordType === 'Cardio') {
                                        valueDisplay = rec.time || '';
                                    }

                                    const progress = getProgressData(rec);

                                    return (
                                        <RecordCard
                                            key={rec.id}
                                            elevation={2}
                                            onClick={() => handleOpenRecordModal(rec)}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        letterSpacing: '0.5px',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {rec.name}
                                                </Typography>

                                                {progress !== null && (
                                                    <ProgressChip
                                                        label={`${progress > 0 ? '+' : ''}${progress}%`}
                                                        size="small"
                                                        progress={progress}
                                                        icon={progress > 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                                    />
                                                )}
                                            </Box>
                                            <Typography
                                                variant="h5"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {valueDisplay}
                                            </Typography>
                                        </RecordCard>
                                    );
                                })}
                            </Box>
                        )}
                    </>
                )}

                {/* Add Record Modal */}
                <Dialog open={addModalOpen} onClose={handleCloseAddRecord} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Record</DialogTitle>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Select for existing names */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="existing-name-label"></InputLabel>
                            <Select
                                labelId="existing-name-label"
                                value={selectedExistingName}
                                onChange={handleExistingNameChange}

                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>Select an existing name or enter new below</em>
                                </MenuItem>
                                {existingNames.map((name, index) => (
                                    <MenuItem key={index} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                Choose an existing name or add a new one below
                            </FormHelperText>
                        </FormControl>

                        <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                            <Divider sx={{ flex: 1 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                                OR
                            </Typography>
                            <Divider sx={{ flex: 1 }} />
                        </Box>

                        {/* Manual input for new name */}
                        <TextField
                            label="New Exercise Name"
                            value={recordName}
                            onChange={handleManualNameChange}
                            fullWidth
                            margin="normal"
                            placeholder="e.g. 1RM BACK SQUAT"
                            disabled={!!selectedExistingName}
                            helperText={
                                selectedExistingName
                                    ? "Clear selection above to enter new name"
                                    : "Enter a new exercise name"
                            }
                        />

                        <TextField
                            label="Date"
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        {recordType === 'WOD' && (
                            <TextField
                                label="Score"
                                value={recordScore}
                                onChange={(e) => setRecordScore(e.target.value)}
                                fullWidth
                                margin="normal"
                                placeholder="Enter score (reps, rounds, etc.)"
                            />
                        )}

                        {recordType === 'Weightlifting' && (
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                value={recordWeight}
                                onChange={(e) => setRecordWeight(e.target.value)}
                                fullWidth
                                margin="normal"
                                placeholder="Enter weight in kg"
                            />
                        )}

                        {recordType === 'Cardio' && (
                            <TextField
                                label="Time"
                                value={recordTime}
                                onChange={(e) => setRecordTime(e.target.value)}
                                fullWidth
                                margin="normal"
                                placeholder="Format: mm:ss"
                            />
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseAddRecord} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSaveRecord}
                            startIcon={<CheckCircleRoundedIcon />}
                        >
                            Save Record
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Record Detail Modal */}
                {selectedRecord && (
                    <RecordModal
                        open={recordModalOpen}
                        onClose={handleCloseRecordModal}
                        recordType={recordType}
                        recordName={selectedRecord.name}
                    />
                )}
            </StyledContainer>
        </AppTheme>
    );
}