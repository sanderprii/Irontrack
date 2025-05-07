// src/pages/TrainingsPage.js

import React, {useState, useEffect} from 'react';

// Material-UI
import {
    Container,
    Typography,
    Select,
    MenuItem,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    InputLabel,
    Box,
    Alert,
    List,
    ListItemButton,
    CircularProgress,
    Paper,
    Grid,
    Divider,
    IconButton,
    Chip,
    Radio,
    RadioGroup,
    FormControlLabel,
    useMediaQuery,
    useTheme,
    TextareaAutosize
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TimerIcon from '@mui/icons-material/Timer';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import RowingIcon from '@mui/icons-material/Rowing';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

// FullCalendar React
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import AppTheme from "../shared-theme/AppTheme";
import DOMPurify from "dompurify";

import WeightliftingPercentageCalculator from "../components/WeightliftingPercentageCalculator";
// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(3),

}));

const FormPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    width: '100%'
}));

const CalendarPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    overflow: 'hidden',
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const StyledListContainer = styled(Paper)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    maxHeight: 150,
    overflowY: 'auto',
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
}));

const TypeChip = styled(Chip)(({ theme, trainingtype }) => {
    let chipColor, textColor;

    switch(trainingtype) {
        case 'WOD':
            chipColor = 'rgba(25, 118, 210, 0.85)'; // Lighter blue
            textColor = '#FFFFFF';
            break;
        case 'Weightlifting':
            chipColor = 'rgba(76, 175, 80, 0.85)'; // Lighter green
            textColor = '#FFFFFF';
            break;
        case 'Cardio':
            chipColor = 'rgba(255, 152, 0, 0.85)'; // Lighter orange
            textColor = '#000000'; // Black text for better contrast with orange
            break;
        case 'Rowing':
            chipColor = 'rgba(156, 39, 176, 0.85)'; // Purple
            textColor = '#FFFFFF';
            break;
        case 'Gymnastics':
            chipColor = 'rgba(233, 30, 99, 0.85)'; // Pink
            textColor = '#FFFFFF';
            break;
        default:
            chipColor = 'rgba(211, 211, 211, 0.8)'; // white
            textColor = '#FFFFFF';
    }

    return {
        backgroundColor: chipColor,
        color: textColor,
        fontWeight: 'bold',
        padding: '4px 8px',
        '& .MuiChip-label': {
            padding: '0 8px'
        }
    };
});

const getTypeIcon = (type) => {
    switch(type) {
        case 'WOD':
            return <TimerIcon />;
        case 'Weightlifting':
            return <FitnessCenterIcon />;
        case 'Cardio':
            return <DirectionsRunIcon />;
        case 'Rowing':
            return <RowingIcon />;
        case 'Gymnastics':
            return <SportsGymnasticsIcon />;
        default:
            return <SportsMartialArtsIcon />;
    }
};

export default function TrainingsPage() {
    // --- State for creating new training ---
    const [trainingType, setTrainingType] = useState('');
    const [trainingDate, setTrainingDate] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    // WOD-specific
    const [wodSearch, setWodSearch] = useState('');
    const [wodSearchResults, setWodSearchResults] = useState([]);
    const [wodName, setWodName] = useState('');
    const [wodType, setWodType] = useState('');
    const [wodDescription, setWodDescription] = useState('');
    const [wodScore, setWodScore] = useState('');

    // Weightlifting, Cardio, Other => exercises in one multiline
    const [exercises, setExercises] = useState('');

    // --- Loaded trainings for FullCalendar ---
    const [trainings, setTrainings] = useState([]);
    const [loadingTrainings, setLoadingTrainings] = useState(true);
    const [error, setError] = useState('');

    // --- Modal (Dialog) for viewing/editing a single training ---
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTraining, setModalTraining] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form section visibility
    const [formExpanded, setFormExpanded] = useState(true);

    // Dialog states
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');

    // New Add to Records with Comment dialog states
    const [addToRecordsDialogOpen, setAddToRecordsDialogOpen] = useState(false);
    const [recordComment, setRecordComment] = useState('');

    // Theme and responsive design
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const API_URL = process.env.REACT_APP_API_URL;

    // --- 1) Load trainings on mount ---
    useEffect(() => {
        loadTrainings();
    }, []);

    // Show success message
    const showSuccessMessage = (message) => {
        setDialogMessage(message);
        setSuccessDialogOpen(true);
    };

    // Show error message
    const showErrorMessage = (message) => {
        setDialogMessage(message);
        setErrorDialogOpen(true);
    };

    // Show confirmation dialog
    const showConfirmDialog = (title, message, onConfirm) => {
        setConfirmDialogTitle(title);
        setConfirmDialogMessage(message);
        setConfirmAction(() => onConfirm);
        setConfirmDialogOpen(true);
    };

    async function loadTrainings() {
        try {
            setLoadingTrainings(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/trainings`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to load trainings');
            }
            const data = await response.json();
            setTrainings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingTrainings(false);
        }
    }

    // --- 2) Training type selection ---
    function handleTrainingTypeChange(e) {
        const val = e.target.value;
        setTrainingType(val);
        setShowOptions(!!val);
        if (!val) {
            setTrainingDate('');
        }
    }

    // --- 3) WOD search logic ---
    useEffect(() => {
        if (!wodSearch.trim()) {
            setWodSearchResults([]);
            return;
        }
        const fetchWods = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/wods/search-default-wods?q=${encodeURIComponent(wodSearch.toUpperCase())}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (response.ok) {
                    const results = await response.json();
                    setWodSearchResults(results.slice(0, 10)); // show top 10
                }
            } catch (error) {
                console.error('Error fetching WODs:', error);
            }
        };
        fetchWods();
    }, [wodSearch]);

    function handleSelectWod(wod) {
        setWodName(wod.name);
        setWodType(wod.type || '');
        // transform description for multiline
        const replaced = wod.description
            .replace(/:/g, ':\n')
            .replace(/,/g, '\n');
        setWodDescription(replaced);
        setWodSearchResults([]);
    }

    function initDOMPurify() {
        // Configure DOMPurify to allow style attributes and common formatting tags
        DOMPurify.addHook('afterSanitizeAttributes', function(node) {
            // Allow all style attributes
            if (node.hasAttribute('style')) {
                // Do nothing, let the style attribute remain
                return;
            }
        });
    }

// Call this in a useEffect to initialize DOMPurify when the component mounts
    useEffect(() => {
        initDOMPurify();
    }, []);

    // --- 4) Submit new training ---
    async function handleSubmitTraining(e) {
        e.preventDefault();
        if (!trainingType || !trainingDate) {
            setError('Please select training type and date!');
            return;
        }

        let payload = {
            type: trainingType,
            date: trainingDate,
        };

        if (trainingType === 'WOD') {
            payload = {
                ...payload,
                wodName: wodName.toUpperCase(),
                wodType,
                exercises: wodDescription,
                score: wodScore,
            };
        } else {
            payload = {
                ...payload,
                exercises,
            };
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/training`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) {
                showErrorMessage(result.error || 'Error creating training');
                return;
            }
            // If server returns updated training list, set it:
            setTrainings(result.trainings || []);

            // Clear form
            setTrainingType('');
            setTrainingDate('');
            setWodName('');
            setWodType('');
            setWodDescription('');
            setWodScore('');
            setExercises('');
            setShowOptions(false);
            setError('');

            // Show success message
            showSuccessMessage('Training created successfully!');
        } catch (error) {
            showErrorMessage('Error: ' + error.message);
        }
    }

    // --- 5) FullCalendar event logic ---
    // Convert trainings -> FullCalendar events
    function getCalendarEvents() {
        return trainings.map((t) => {
            // Using more vibrant, slightly transparent colors
            let bgColor;
            switch(t.type) {
                case 'WOD':
                    bgColor = 'rgba(25, 118, 210, 0.85)'; // Blue
                    break;
                case 'Weightlifting':
                    bgColor = 'rgba(76, 175, 80, 0.85)'; // Green
                    break;
                case 'Cardio':
                    bgColor = 'rgba(255, 152, 0, 0.85)'; // Orange
                    break;
                case 'Rowing':
                    bgColor = 'rgba(156, 39, 176, 0.85)'; // Purple
                    break;
                case 'Gymnastics':
                    bgColor = 'rgba(233, 30, 99, 0.85)'; // Pink
                    break;
                default:
                    bgColor = 'rgba(211, 211, 211, 0.8)'; // Info blue
            }

            return {
                id: t.id,
                title: t.type,
                start: t.date,
                backgroundColor: bgColor,
                borderColor: '#0d1117',
                extendedProps: {training: t},
            };
        });
    }

    // On eventClick -> open modal
    function handleEventClick(clickInfo) {
        const training = clickInfo.event.extendedProps.training;
        openTrainingModal(training);
    }

    // eventContent, to replicate the "colored bar"
    function renderEventContent(arg) {
        // Use more vibrant, slightly transparent colors for better visibility
        let backgroundColor;
        switch(arg.event.title) {
            case 'WOD':
                backgroundColor = 'rgba(25, 118, 210, 0.85)'; // Blue
                break;
            case 'Weightlifting':
                backgroundColor = 'rgba(76, 175, 80, 0.85)'; // Green
                break;
            case 'Cardio':
                backgroundColor = 'rgba(255, 152, 0, 0.85)'; // Orange
                break;
            case 'Rowing':
                backgroundColor = 'rgba(156, 39, 176, 0.85)'; // Purple
                break;
            case 'Gymnastics':
                backgroundColor = 'rgba(233, 30, 99, 0.85)'; // Pink
                break;
            default:
                backgroundColor = 'rgba(211, 211, 211, 0.8)';

        }

        return {
            html: `<div style="width:100%;height:14px;background-color:${backgroundColor};border-radius:3px;margin-bottom:2px; border: #0d1117"></div>`,
        };
    }

    // --- 6) Modal open/close ---
    function openTrainingModal(training) {
        setModalTraining(training);
        setIsEditing(false);
        setModalOpen(true);
    }

    function closeModal() {
        if (isEditing) {

                    setModalOpen(false);
                    setModalTraining(null);
                    setIsEditing(false);


        } else {
            setModalOpen(false);
            setModalTraining(null);
        }
    }

    // --- 7) Edit / Save in modal ---
    function handleEdit() {
        setIsEditing(true);
    }

    async function handleSave() {
        if (!modalTraining) return;

        // Prepare the data for submission
        const trainingData = {
            ...modalTraining,
            // Make sure date is in the correct format
            date: modalTraining.date?.split('T')[0] || modalTraining.date
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/training/${modalTraining.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trainingData),
            });
            if (!response.ok) {
                const resErr = await response.json();
                showErrorMessage('Error: ' + (resErr.error || 'Unknown'));
                return;
            }
            setIsEditing(false);
            closeModal();
            await loadTrainings();
            showSuccessMessage("Training updated successfully!");
        } catch (err) {
            showErrorMessage('Error saving training: ' + err.message);
        }
    }

    // Add to records if WOD - MODIFIED
    function handleAddToRecords() {
        if (!modalTraining) return;
        if (modalTraining.type !== 'WOD' || !modalTraining.wodName) return;

        // Reset comment and open the new dialog
        setRecordComment('');
        setAddToRecordsDialogOpen(true);
    }

    // New function to handle the actual record submission with comment
    async function submitAddToRecords() {
        const recordData = {
            type: 'WOD',
            name: modalTraining.wodName,
            date: modalTraining.date,
            score: modalTraining.score,
            comment: recordComment // Include the comment
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/records`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recordData),
            });

            if (!response.ok) {
                const resErr = await response.json();
                showErrorMessage('Error: ' + (resErr.error || 'Could not add to records'));
                return;
            }

            showSuccessMessage('WOD added to records successfully!');
            setAddToRecordsDialogOpen(false);
        } catch (err) {
            showErrorMessage('Error: ' + err.message);
        }
    }

    // Update modal training field
    function updateModalField(field, value) {
        setModalTraining((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    // For updating exercises in modal
    function updateExercise(index, newValue) {
        setModalTraining((prev) => {
            const newExercises = [...(prev.exercises || [])];
            newExercises[index] = {exerciseData: newValue};
            return {...prev, exercises: newExercises};
        });
    }

    // Toggle form visibility
    const toggleForm = () => {
        setFormExpanded(!formExpanded);
    };



    async function handleDelete() {
        if (!modalTraining) return;

        // Ask for confirmation before deleting
        showConfirmDialog(
            "Delete Training",
            "Are you sure you want to delete this training? This action cannot be undone.",
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/training/${modalTraining.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const resErr = await response.json();
                        showErrorMessage('Error: ' + (resErr.error || 'Unknown error'));
                        return;
                    }

                    // Close modal and reload trainings
                    closeModal();
                    await loadTrainings();
                    showSuccessMessage("Training successfully deleted!");
                } catch (err) {
                    showErrorMessage('Error deleting training: ' + err.message);
                }
            }
        );
    }

    return (
        <AppTheme>
            <StyledContainer maxWidth="lg" sx={{ width: '100%', pl: 0, pr: 0 }}>
                <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                    TRAININGS
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ width: '100%' }}
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}

                {/* Add Training Form Section */}
                <FormPaper>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="medium">
                            Add New Training
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={formExpanded ? <CloseIcon /> : <AddIcon />}
                            onClick={toggleForm}
                            size="small"
                        >
                            {formExpanded ? 'Hide Form' : 'Show Form'}
                        </Button>
                    </Box>

                    {formExpanded && (
                        <Box component="form" onSubmit={handleSubmitTraining}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="training-type-label">Training Type</InputLabel>
                                        <Select
                                            labelId="training-type-label"
                                            value={trainingType}
                                            label="Training Type"
                                            onChange={handleTrainingTypeChange}
                                        >
                                            <MenuItem value="">-- Select Training Type --</MenuItem>
                                            <MenuItem value="WOD">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <TimerIcon sx={{ mr: 1 }} />
                                                    WOD
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="Weightlifting">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <FitnessCenterIcon sx={{ mr: 1 }} />
                                                    Weightlifting
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="Cardio">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <DirectionsRunIcon sx={{ mr: 1 }} />
                                                    Cardio
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="Rowing">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <RowingIcon sx={{ mr: 1 }} />
                                                    Rowing
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="Gymnastics">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <SportsGymnasticsIcon sx={{ mr: 1 }} />
                                                    Gymnastics
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="Other">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <SportsMartialArtsIcon sx={{ mr: 1 }} />
                                                    Other
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {showOptions && (
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date"
                                            value={trainingDate}
                                            onChange={(e) => setTrainingDate(e.target.value)}
                                            InputLabelProps={{shrink: true}}
                                            required
                                        />
                                    </Grid>
                                )}
                            </Grid>

                            {/* WOD stuff */}
                            {trainingType === 'WOD' && showOptions && (
                                <Box sx={{ mt: 3 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            {/* Search default WODs */}
                                            <TextField
                                                fullWidth
                                                label="Search Default WODs"
                                                value={wodSearch}
                                                onChange={(e) => setWodSearch(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                                    ),
                                                }}
                                            />
                                            {wodSearchResults.length > 0 && (
                                                <StyledListContainer>
                                                    <List dense>
                                                        {wodSearchResults.map((w) => (
                                                            <StyledListItem key={w.name} onClick={() => handleSelectWod(w)}>
                                                                <Typography>{w.name}</Typography>
                                                            </StyledListItem>
                                                        ))}
                                                    </List>
                                                </StyledListContainer>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="WOD Name"
                                                value={wodName}
                                                onChange={(e) => setWodName(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <FormControl component="fieldset">
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    WOD Type
                                                </Typography>
                                                <RadioGroup
                                                    row
                                                    name="wod-type"
                                                    value={wodType}
                                                    onChange={(e) => setWodType(e.target.value)}
                                                >
                                                    {['For Time', 'EMOM', 'Tabata', 'AMRAP', 'For Load', 'For Quality', 'NONE'].map((val) => (
                                                        <FormControlLabel
                                                            key={val}
                                                            value={val}
                                                            control={<Radio />}
                                                            label={val}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    WOD Description
                                                </Typography>
                                                <TextareaAutosize
                                                    minRows={5}
                                                    maxRows={20}
                                                    value={wodDescription}
                                                    onChange={(e) => {
                                                        const text = e.target.value;
                                                        // Set a 2000 character limit (adjust as needed)
                                                        if (text.length <= 2000) {
                                                            setWodDescription(text);
                                                        }
                                                    }}
                                                    placeholder="Enter exercises and reps"
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        borderRadius: '4px',
                                                        borderColor: '#AAAAAA',
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit'
                                                    }}
                                                />
                                                {wodDescription.length >= 1500 && (
                                                    <Typography
                                                        variant="caption"
                                                        color={wodDescription.length >= 2000 ? "error" : "warning"}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {wodDescription.length >= 5000
                                                            ? "Maximum 2000 characters allowed. You've reached the limit."
                                                            : `${2000 - wodDescription.length} characters remaining.`}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Score"
                                                value={wodScore}
                                                onChange={(e) => setWodScore(e.target.value)}
                                                placeholder="Enter your result"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Weightlifting, Cardio, Other */}
                            {['Weightlifting', 'Cardio', 'Rowing', 'Gymnastics', 'Other'].includes(trainingType) && showOptions && (
                                <Box sx={{ mt: 3 }}>
                                    <Divider sx={{ my: 2 }} />
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Exercises
                                        </Typography>
                                        <TextareaAutosize
                                            minRows={5}
                                            maxRows={20}
                                            value={exercises}
                                            onChange={(e) => {
                                                const text = e.target.value;
                                                // Set a 2000 character limit
                                                if (text.length <= 2000) {
                                                    setExercises(text);
                                                }
                                            }}
                                            placeholder="Enter your exercises, sets, reps and weights"
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '4px',
                                                borderColor: '#AAAAAA',
                                                fontSize: '14px',
                                                lineHeight: '1.5',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        {/* Character counter and warning message */}
                                        {exercises.length >= 1800 && (
                                            <Typography
                                                variant="caption"
                                                color={exercises.length >= 2000 ? "error" : "warning"}
                                                sx={{ mt: 1 }}
                                            >
                                                {exercises.length >= 2000
                                                    ? "Maximum 2000 characters allowed. You've reached the limit."
                                                    : `${2000 - exercises.length} characters remaining.`}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Box>
                            )}

                            {showOptions && (
                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        size="large"
                                    >
                                        Save Training
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                </FormPaper>

                {/* Training Calendar Section */}
                <CalendarPaper>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight="medium">
                            Training Calendar
                        </Typography>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <TypeChip
                            label="WOD"
                            icon={<TimerIcon sx={{ color: 'inherit' }} />}
                            trainingtype="WOD"
                            size="medium"
                        />
                        <TypeChip
                            label="Weightlifting"
                            icon={<FitnessCenterIcon sx={{ color: 'inherit' }} />}
                            trainingtype="Weightlifting"
                            size="medium"
                        />
                        <TypeChip
                            label="Cardio"
                            icon={<DirectionsRunIcon sx={{ color: 'inherit' }} />}
                            trainingtype="Cardio"
                            size="medium"
                        />
                        <TypeChip
                            label="Rowing"
                            icon={<RowingIcon sx={{ color: 'inherit' }} />}
                            trainingtype="Rowing"
                            size="medium"
                        />
                        <TypeChip
                            label="Gymnastics"
                            icon={<SportsGymnasticsIcon sx={{ color: 'inherit' }} />}
                            trainingtype="Gymnastics"
                            size="medium"
                        />
                        <TypeChip
                            label="Other"
                            icon={<SportsMartialArtsIcon sx={{ color: 'inherit' }} />}
                            trainingtype="Other"
                            size="medium"
                        />
                    </Box>

                    {/* Error or loading indicator */}
                    {loadingTrainings && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* FULLCALENDAR to display trainings */}
                    {!loadingTrainings && (
                        <Box sx={{ '.fc': { fontFamily: 'inherit' }, '.fc-toolbar-title': { fontSize: '1.2em' }}}>
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={getCalendarEvents()}
                                eventClick={handleEventClick}
                                eventContent={renderEventContent}
                                height="auto"
                                firstDay={1}
                                headerToolbar={{
                                    left: 'prev',
                                    center: 'title',
                                    right: 'today next'
                                }}
                            />
                        </Box>
                    )}
                </CalendarPaper>

                {/* MODAL (Dialog) for training details */}
                <Dialog
                    open={modalOpen}
                    onClose={closeModal}
                    maxWidth="md"
                    fullWidth
                    fullScreen={isMobile}
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {modalTraining && (
                                    <>
                                        {getTypeIcon(modalTraining.type)}
                                        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                            {modalTraining.type === 'WOD' ? modalTraining.wodName || 'Training Details' : 'Training Details'}
                                        </Typography>
                                        <TypeChip
                                            label={modalTraining.type}
                                            trainingtype={modalTraining.type}
                                            size="small"
                                            sx={{ ml: 2 }}
                                        />
                                    </>
                                )}
                            </Box>
                            <IconButton onClick={closeModal} edge="end">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers>
                        {modalTraining && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Date"
                                        type="date"
                                        value={modalTraining.date?.split('T')[0] || ''}
                                        fullWidth
                                        onChange={(e) => updateModalField('date', e.target.value)}
                                        disabled={!isEditing}
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>

                                {/* If WOD */}
                                {modalTraining.type === 'WOD' && (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="WOD Name"
                                                value={modalTraining.wodName || ''}
                                                fullWidth
                                                disabled={!isEditing}
                                                onChange={(e) => updateModalField('wodName', e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="WOD Type"
                                                value={modalTraining.wodType || ''}
                                                fullWidth
                                                disabled={!isEditing}
                                                onChange={(e) => updateModalField('wodType', e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Score"
                                                value={modalTraining.score || ''}
                                                fullWidth
                                                disabled={!isEditing}
                                                onChange={(e) => updateModalField('score', e.target.value)}
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* Exercises */}
                                {modalTraining && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Exercises:
                                        </Typography>
                                        {isEditing ? (
                                            <FormControl fullWidth>
                                                <TextareaAutosize
                                                    minRows={5}
                                                    maxRows={20}
                                                    value={typeof modalTraining.exercises === 'string' ?
                                                        modalTraining.exercises :
                                                        Array.isArray(modalTraining.exercises) ?
                                                            modalTraining.exercises.map(ex => ex.exerciseData || '').join('\n') :
                                                            ''}
                                                    onChange={(e) => {
                                                        const text = e.target.value;
                                                        // Set a 2000 character limit
                                                        if (text.length <= 2000) {
                                                            updateModalField('exercises', text);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        borderRadius: '4px',
                                                        borderColor: '#AAAAAA',
                                                        fontSize: '14px',
                                                        lineHeight: '1.5',
                                                        resize: 'vertical',
                                                        fontFamily: 'inherit',
                                                        whiteSpace: 'pre-wrap'
                                                    }}
                                                />
                                                {/* Character counter and warning message */}
                                                {(typeof modalTraining.exercises === 'string' && modalTraining.exercises.length >= 1800) && (
                                                    <Typography
                                                        variant="caption"
                                                        color={modalTraining.exercises.length >= 2000 ? "error" : "warning"}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        {modalTraining.exercises.length >= 2000
                                                            ? "Maximum 2000 characters allowed. You've reached the limit."
                                                            : `${2000 - modalTraining.exercises.length} characters remaining.`}
                                                    </Typography>
                                                )}
                                            </FormControl>
                                        ) : (
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: 1,
                                                    minHeight: '100px'
                                                }}
                                            >
                                                {typeof modalTraining.exercises === 'string' ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(modalTraining.exercises, {
                                                                ADD_ATTR: ['style'], // Allow style attributes
                                                                USE_PROFILES: {html: true} // Use HTML profile
                                                            })
                                                        }}
                                                        style={{
                                                            whiteSpace: 'pre-line' // Add this style
                                                        }}
                                                    />
                                                ) : Array.isArray(modalTraining.exercises) ? (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(
                                                                modalTraining.exercises.map(ex => ex.exerciseData || '').join('<br>'),
                                                                {
                                                                    ADD_ATTR: ['style'], // Allow style attributes
                                                                    USE_PROFILES: {html: true} // Use HTML profile
                                                                }
                                                            )
                                                        }}
                                                        style={{
                                                            whiteSpace: 'pre-line' // Add this style
                                                        }}
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </Paper>
                                        )}
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        {modalTraining?.type === 'Weightlifting' && !isEditing && (
                            <Box sx={{ flexGrow: 1 }}>
                                <WeightliftingPercentageCalculator />
                            </Box>
                        )}
                        {modalTraining?.type === 'WOD' && modalTraining?.wodName && !isEditing && (
                            <Button
                                onClick={handleAddToRecords}
                                color="secondary"
                                startIcon={<BookmarkAddIcon />}
                            >
                                Add to Records
                            </Button>
                        )}

                        {!isEditing ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={handleEdit}
                                    startIcon={<EditIcon />}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleDelete}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSave}
                                startIcon={<SaveIcon />}
                            >
                                Save Changes
                            </Button>
                        )}

                        <Button
                            variant={isEditing ? "outlined" : "text"}
                            onClick={isEditing ? () => setIsEditing(false) : closeModal}
                            color="inherit"
                        >
                            {isEditing ? "Cancel" : "Close"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* New Add to Records Dialog with Comment Field */}
                <Dialog
                    open={addToRecordsDialogOpen}
                    onClose={() => setAddToRecordsDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Add to Records</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Do you want to add this WOD to your records?
                        </DialogContentText>

                        <Box sx={{ mt: 2 }}>
                            <Typography><strong>WOD:</strong> {modalTraining?.wodName ? modalTraining.wodName.toUpperCase() : "WOD"}</Typography>
                            <Typography><strong>Date:</strong> {modalTraining ? new Date(modalTraining.date).toLocaleDateString() : ""}</Typography>
                            <Typography><strong>Score:</strong> {modalTraining?.score || ""}</Typography>
                            <Typography><strong>Type:</strong> {modalTraining?.wodType?.toUpperCase() || ""}</Typography>
                        </Box>

                        {/* Comment Field */}
                        <TextField
                            label="Comment (Optional)"
                            multiline
                            rows={3}
                            fullWidth
                            value={recordComment}
                            onChange={(e) => setRecordComment(e.target.value)}
                            margin="normal"
                            placeholder="Enter any notes about your performance..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setAddToRecordsDialogOpen(false)}
                            color="inherit"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitAddToRecords}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success Dialog */}
                <Dialog
                    open={successDialogOpen}
                    onClose={() => setSuccessDialogOpen(false)}
                >
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Error Dialog */}
                <Dialog
                    open={errorDialogOpen}
                    onClose={() => setErrorDialogOpen(false)}
                >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog
                    open={confirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                >
                    <DialogTitle>{confirmDialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {confirmDialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (confirmAction) confirmAction();
                                setConfirmDialogOpen(false);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </StyledContainer>
        </AppTheme>
    );
}