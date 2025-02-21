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
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AppTheme from "../shared-theme/AppTheme";
// ==== Lisatud ====
import RecordModal from "../components/RecordModal";

const StyledContainer = styled(Container)(({ theme }) => ({
    pt: { xs: 4, sm: 12 },
    pb: { xs: 8, sm: 16 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "0.3s",
    width: "125px",
    height: "75px",
    cursor: "pointer",
    "&:hover": {
        boxShadow: theme.shadows[5],
    },
}));

export default function RecordsPage() {
    const [recordType, setRecordType] = useState('WOD');
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [recordName, setRecordName] = useState('');
    const [recordDate, setRecordDate] = useState('');
    const [recordScore, setRecordScore] = useState('');
    const [recordWeight, setRecordWeight] = useState('');
    const [recordTime, setRecordTime] = useState('');

    // Uus: otsingusisendi olek
    const [searchQuery, setSearchQuery] = useState('');

    // Uus: valitud kaardile klõpsamise modaal
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [recordModalOpen, setRecordModalOpen] = useState(false);

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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordTypeChange = (event, newType) => {
        if (newType) {
            setRecordType(newType);
            setSearchQuery(''); // tühjenda otsing, kui tüüp muutub
        }
    };

    const handleOpenAddRecord = () => {
        setError('');
        setRecordName('');
        setRecordDate('');
        setRecordScore('');
        setRecordWeight('');
        setRecordTime('');
        setAddModalOpen(true);
    };

    const handleCloseAddRecord = () => {
        setAddModalOpen(false);
    };

    const handleSaveRecord = async () => {
        try {
            setError('');
            const token = localStorage.getItem('token');
            let payload = {
                type: recordType,
                name: recordName,
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

    // Otsing
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
            <StyledContainer maxWidth={false}>
                <Typography variant="h4" gutterBottom>
                    Records
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {/* Spinner */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <CircularProgress />
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        flexWrap: 'wrap',
                        gap: 2
                    }}
                >
                    <ToggleButtonGroup
                        color="primary"
                        value={recordType}
                        exclusive
                        onChange={handleRecordTypeChange}
                    >
                        <ToggleButton value="WOD">WOD</ToggleButton>
                        <ToggleButton value="Weightlifting">Weightlifting</ToggleButton>
                        <ToggleButton value="Cardio">Cardio</ToggleButton>
                    </ToggleButtonGroup>

                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, score, etc."
                        sx={{ maxWidth: 200 }}
                    />

                    <Button variant="contained" onClick={handleOpenAddRecord}>
                        Add Record
                    </Button>
                </Box>

                {!loading && filteredRecords.length === 0 && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        No records found.
                    </Typography>
                )}

                <Grid container spacing={2} sx={{ justifyContent: "center" }}>
                    {filteredRecords.map((rec) => {
                        let displayText = '';
                        if (recordType === 'WOD') {
                            displayText = `Score: ${rec.score}`;
                        } else if (recordType === 'Weightlifting') {
                            displayText = `Weight: ${rec.weight} kg`;
                        } else if (recordType === 'Cardio') {
                            displayText = `Time: ${rec.time}`;
                        }

                        return (
                            <Grid item key={rec.id}>
                                <StyledCard
                                    sx={{ bgcolor: "background.paper"}}
                                    onClick={() => handleOpenRecordModal(rec)}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {rec.name}
                                        </Typography>
                                        <Typography variant="body2">{displayText}</Typography>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        );
                    })}
                </Grid>

                <Dialog open={addModalOpen} onClose={handleCloseAddRecord}>
                    <DialogTitle>Add Record</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Name"
                            value={recordName}
                            onChange={(e) => setRecordName(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                            placeholder="Enter name/title"
                        />
                        <TextField
                            label="Date"
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                            helperText="Select date for this record"
                        />
                        {recordType === 'WOD' && (
                            <TextField
                                label="Score"
                                value={recordScore}
                                onChange={(e) => setRecordScore(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="e.g. number of rounds, reps, etc."
                            />
                        )}
                        {recordType === 'Weightlifting' && (
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                value={recordWeight}
                                onChange={(e) => setRecordWeight(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="Enter weight in kg"
                            />
                        )}
                        {recordType === 'Cardio' && (
                            <TextField
                                label="Time (mm:ss)"
                                value={recordTime}
                                onChange={(e) => setRecordTime(e.target.value)}
                                fullWidth
                                sx={{ mb: 2 }}
                                placeholder="mm:ss"
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddRecord}>Cancel</Button>
                        <Button variant="contained" onClick={handleSaveRecord}>Save</Button>
                    </DialogActions>
                </Dialog>

                {/* Modaal, mis näitab täpsemalt kõikide tulemuste graafikut */}
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
