import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    CircularProgress,
    Paper,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    FormControlLabel,
    Checkbox,
    Tooltip,
    useTheme,
    useMediaQuery,
    Alert,
    TextareaAutosize,
    Collapse,
    ListItemIcon,
    ListItemButton,
    Container,
    Badge
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    YouTube as YouTubeIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as UncheckedIcon,
    FitnessCenter as FitnessCenterIcon,
    Timer as TimerIcon,
    DirectionsRun as DirectionsRunIcon,
    Comment as CommentIcon,
    PlayArrow as PlayArrowIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CalendarToday as CalendarIcon,
    Person as PersonIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import WeightliftingPercentageCalculator from './WeightliftingPercentageCalculator';
import { getTrainingPlans, getTrainingPlanById, createTrainingPlan, updateTrainingPlan, deleteTrainingPlan, addCommentToTrainingDay, updateSectorCompletion, addSectorToTraining } from '../api/trainingPlanApi';

// YouTube video component
const YouTubeEmbed = ({ url }) => {
    // Extract video ID from YouTube URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);

    if (!videoId) return <Typography color="error">Invalid YouTube URL</Typography>;

    return (
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', mb: 2 }}>
            <iframe
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '4px'
                }}
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </Box>
    );
};

// YouTube link input component
const YouTubeInput = ({ links, setLinks, index, sectorIndex }) => {
    const handleLinkChange = (e) => {
        const newLinks = [...links];
        newLinks[index].url = e.target.value;
        setLinks(newLinks, sectorIndex);
    };

    const handleRemoveLink = () => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks, sectorIndex);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
                fullWidth
                size="small"
                label="YouTube URL"
                value={links[index]?.url || ''}
                onChange={handleLinkChange}
                InputProps={{
                    startAdornment: <YouTubeIcon color="error" sx={{ mr: 1 }} />
                }}
            />
            {index > 0 && (
                <IconButton onClick={handleRemoveLink} size="small" color="error" sx={{ ml: 1 }}>
                    <CloseIcon />
                </IconButton>
            )}
        </Box>
    );
};

const TrainingPlans = ({ userId, role, userName, userFullName }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [trainingPlans, setTrainingPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Creation/editing state
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [planName, setPlanName] = useState('');
    const [trainingDays, setTrainingDays] = useState([]);
    const [targetUserId, setTargetUserId] = useState('');
    const [targetUserName, setTargetUserName] = useState('');

    // Track which training day is expanded
    const [expandedDay, setExpandedDay] = useState(0);

    // Plan view state
    const [viewOpen, setViewOpen] = useState(false);
    const [viewPlan, setViewPlan] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [expandedDays, setExpandedDays] = useState({});

    // Comment state
    const [commentOpen, setCommentOpen] = useState({});
    const [commentText, setCommentText] = useState('');

    // Delete confirmation
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    const fetchTrainingPlans = async () => {
        try {
            setLoading(true);
            const data = await getTrainingPlans(userId);
            setTrainingPlans(data);
        } catch (err) {
            setError('Failed to load training plans');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainingPlans();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setPlanName('');
        setTrainingDays([{
            name: 'Day 1',
            sectors: [
                {
                    type: 'Strength',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                },
                {
                    type: 'WOD',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                },
                {
                    type: 'Essentials',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                }
            ]
        }]);
        setExpandedDay(0);

        // If a member page passes userId, use that
        if (userId && userId !== 'self') {
            setTargetUserId(userId);
            setTargetUserName(userFullName || userName);
        } else {
            setTargetUserId('');
            setTargetUserName('');
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddDay = () => {
        const dayNumber = trainingDays.length + 1;
        const newDay = {
            name: `Day ${dayNumber}`,
            sectors: [
                {
                    type: 'Strength',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                },
                {
                    type: 'WOD',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                },
                {
                    type: 'Essentials',
                    content: '',
                    youtubeLinks: [{ url: '' }]
                }
            ]
        };

        setTrainingDays([...trainingDays, newDay]);
        // Automatically expand the newly added day
        setExpandedDay(trainingDays.length);
    };

    const handleDayNameChange = (index, name) => {
        const newDays = [...trainingDays];
        newDays[index].name = name;
        setTrainingDays(newDays);
    };

    const handleSectorContentChange = (dayIndex, sectorIndex, content) => {
        const newDays = [...trainingDays];
        newDays[dayIndex].sectors[sectorIndex].content = content;
        setTrainingDays(newDays);
    };

    const handleYoutubeLinksChange = (links, sectorIndex, dayIndex) => {
        const newDays = [...trainingDays];
        newDays[dayIndex].sectors[sectorIndex].youtubeLinks = links;
        setTrainingDays(newDays);
    };

    const handleAddYoutubeLink = (dayIndex, sectorIndex) => {
        const newDays = [...trainingDays];
        newDays[dayIndex].sectors[sectorIndex].youtubeLinks.push({ url: '' });
        setTrainingDays(newDays);
    };

    const handleExpandDay = (index) => {
        setExpandedDay(expandedDay === index ? -1 : index);
    };

    const handleSavePlan = async () => {
        try {
            if (!planName.trim()) {
                setError('Please enter a plan name');
                return;
            }

            if (!targetUserId && role !== 'regular') {
                setError('Please select a user for this training plan');
                return;
            }

            // When editing, make sure to include the IDs of existing days and sectors
            let planData = {
                name: planName,
                userId: targetUserId || userId,
            };

            if (editMode && selectedPlan) {
                // If editing, preserve the existing IDs for days and sectors
                planData.trainingDays = trainingDays.map(day => {
                    // Create a days object with preserved ID if it exists
                    const dayObj = {
                        name: day.name,
                        // Include the ID if it exists (for existing days)
                        ...(day.id && { id: day.id })
                    };

                    // Handle sectors preserving IDs
                    dayObj.sectors = day.sectors.map(sector => {
                        // Create sector with preserved ID if it exists
                        const sectorObj = {
                            type: sector.type,
                            content: sector.content,
                            // Include the ID if it exists (for existing sectors)
                            ...(sector.id && { id: sector.id })
                        };

                        // Handle YouTube links preserving IDs
                        sectorObj.youtubeLinks = sector.youtubeLinks
                            .filter(link => link.url.trim())
                            .map(link => ({
                                url: link.url,
                                // Include the ID if it exists (for existing links)
                                ...(link.id && { id: link.id })
                            }));

                        return sectorObj;
                    });

                    return dayObj;
                });

                console.log('Updating existing plan with ID:', selectedPlan.id);
                console.log('Update data includes day IDs:', planData.trainingDays.map(d => d.id));
                await updateTrainingPlan(selectedPlan.id, planData);
            } else {
                // For new plans, no need to include IDs
                planData.trainingDays = trainingDays.map(day => ({
                    name: day.name,
                    sectors: day.sectors.map(sector => ({
                        type: sector.type,
                        content: sector.content,
                        youtubeLinks: sector.youtubeLinks.filter(link => link.url.trim()).map(link => ({
                            url: link.url
                        }))
                    }))
                }));

                console.log('Creating new plan');
                await createTrainingPlan(planData);
            }

            setOpen(false);
            setSelectedPlan(null); // Reset selectedPlan after saving
            setEditMode(false);    // Reset editMode after saving
            fetchTrainingPlans();
        } catch (err) {
            setError('Failed to save training plan');
            console.error(err);
        }
    };

    const handlePlanClick = async (plan) => {
        try {
            console.log('Viewing plan with ID:', plan.id);
            setViewOpen(true);
            setLoading(true);
            setActiveTab(0);
            setExpandedDays({}); // Reset all days to collapsed

            const planDetails = await getTrainingPlanById(plan.id);
            setViewPlan(planDetails);
        } catch (err) {
            setError('Failed to load training plan details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPlan = () => {
        if (!viewPlan) return;

        // Set the selectedPlan to the viewPlan so we update instead of create
        setSelectedPlan(viewPlan);
        setEditMode(true);
        setPlanName(viewPlan.name);
        setTrainingDays(viewPlan.trainingDays);
        setTargetUserId(viewPlan.userId);
        setTargetUserName(viewPlan.user?.fullName || '');
        setExpandedDay(0);

        setViewOpen(false);
        setOpen(true);
    };

    const handleDeleteClick = (plan) => {
        setPlanToDelete(plan);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            if (!planToDelete) return;

            await deleteTrainingPlan(planToDelete.id);
            setDeleteConfirmOpen(false);
            setPlanToDelete(null);

            if (viewOpen && viewPlan?.id === planToDelete.id) {
                setViewOpen(false);
            }

            fetchTrainingPlans();
        } catch (err) {
            setError('Failed to delete training plan');
            console.error(err);
        }
    };

    const handleToggleComment = (dayId) => {
        setCommentOpen(prev => ({
            ...prev,
            [dayId]: !prev[dayId]
        }));
        setCommentText('');
    };

    const handleAddComment = async (dayId) => {
        try {
            if (!commentText.trim()) return;

            await addCommentToTrainingDay(dayId, commentText);

            // Refresh the plan to show the new comment
            if (viewPlan) {
                const updatedPlan = await getTrainingPlanById(viewPlan.id);
                setViewPlan(updatedPlan);
            }

            setCommentText('');
            setCommentOpen(prev => ({
                ...prev,
                [dayId]: false
            }));
        } catch (err) {
            setError('Failed to add comment');
            console.error(err);
        }
    };

    const handleCompleteSector = async (sectorId, completed) => {
        try {
            await updateSectorCompletion(sectorId, completed);

            // Refresh the plan to show the updated completion status
            if (viewPlan) {
                const updatedPlan = await getTrainingPlanById(viewPlan.id);
                setViewPlan(updatedPlan);
            }
        } catch (err) {
            setError('Failed to update sector completion');
            console.error(err);
        }
    };

    const handleAddToTraining = async (sectorId) => {
        try {
            alert('Adding to trainings');
            await addSectorToTraining(sectorId);
            setError({ severity: 'success', message: 'Successfully added to your trainings!' });
        } catch (err) {
            setError('Failed to add to trainings');
            console.error(err);
        }
    };

    const toggleDayExpansion = (dayIndex) => {
        setExpandedDays(prev => ({
            ...prev,
            [dayIndex]: !prev[dayIndex]
        }));
    };

    // Determine if current user is the plan's assignee
    const isPlanAssignee = (plan) => {
        if (!plan) return false;

        // If userId is "self", this means we're in the MyProfile page,
        // so the current user is viewing their own assigned plans
        if (userId === "self") {
            return true;
        }

        // For regular numeric IDs, directly compare
        return plan.userId === parseInt(userId);
    };

    // Determine if current user is the plan's creator
    const isPlanCreator = (plan) => {
        if (!plan) return false;
        return plan.creatorId === parseInt(userId);
    };

    // Check if any sector in the day is completed
    const isDayPartiallyCompleted = (day) => {
        if (!day || !day.sectors) return false;
        return day.sectors.some(sector => sector.completed);
    };

    // Check if all sectors in the day are completed
    const isDayFullyCompleted = (day) => {
        if (!day || !day.sectors || day.sectors.length === 0) return false;
        return day.sectors.every(sector => sector.completed);
    };

    // Get icon for sector type
    const getSectorIcon = (type) => {
        switch (type) {
            case 'Strength':
                return <FitnessCenterIcon />;
            case 'WOD':
                return <TimerIcon />;
            case 'Essentials':
                return <DirectionsRunIcon />;
            default:
                return <FitnessCenterIcon />;
        }
    };



    return (
        <Container maxWidth="xl" sx={{ width: '100%', px: 0 }}>
            {error && (
                <Alert
                    severity={typeof error === 'object' ? error.severity : 'error'}
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {typeof error === 'object' ? error.message : error}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                    Training Plans
                </Typography>

                {/* Only affiliates and trainers can create plans */}
                {(role === 'affiliate' || role === 'trainer') && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                    >
                        Create Training Plan
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : trainingPlans.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary">
                        No training plans found.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {trainingPlans.map((plan) => (
                        <Grid item xs={12} sm={6} md={4} key={plan.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    '&:hover': {
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => handlePlanClick(plan)}
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div" gutterBottom>
                                        {plan.name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Created by: {plan.creator?.fullName || 'Unknown'}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {format(new Date(plan.createdAt), 'dd.MM.yyyy')}
                                    </Typography>

                                    <Typography variant="body2">
                                        {role === 'regular'
                                            ? null
                                            : `For: ${plan.user?.fullName || 'Unknown'}`}
                                    </Typography>

                                    {/* Only plan assignees can delete plans */}
                                    {role === 'regular' && (
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(plan);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit Training Plan Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            {editMode ? 'Edit Training Plan' : 'Create New Training Plan'}
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Plan Name"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                margin="normal"
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="For User"
                                value={targetUserName}
                                disabled={!!userId || editMode}
                                margin="normal"
                                helperText={targetUserName ? `Creating plan for: ${targetUserName}` : 'Please select a user'}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Training Days
                            </Typography>

                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddDay}
                            >
                                Add Training Day
                            </Button>
                        </Box>

                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {trainingDays.map((day, dayIndex) => (
                                <Paper key={dayIndex} sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden'
                                }}>
                                    <ListItemButton
                                        onClick={() => handleExpandDay(dayIndex)}
                                        sx={{
                                            bgcolor: expandedDay === dayIndex ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                            borderBottom: expandedDay === dayIndex ? '1px solid' : 'none',
                                            borderColor: 'divider',
                                            py: 1.5
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CalendarIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <TextField
                                                    value={day.name}
                                                    onChange={(e) => handleDayNameChange(dayIndex, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    variant="standard"
                                                    fullWidth
                                                    sx={{ fontSize: '1.1rem', fontWeight: 'medium' }}
                                                />
                                            }
                                        />
                                        {expandedDay === dayIndex ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </ListItemButton>

                                    <Collapse in={expandedDay === dayIndex} timeout="auto" unmountOnExit>
                                        <Box sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                {day.sectors.map((sector, sectorIndex) => (
                                                    <Grid item xs={12} md={4} key={sectorIndex}>
                                                        <Paper
                                                            elevation={2}
                                                            sx={{
                                                                p: 2,
                                                                height: '100%',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                position: 'relative',
                                                                borderRadius: '8px',
                                                            }}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                {getSectorIcon(sector.type)}
                                                                <Typography variant="h6" sx={{ ml: 1 }}>
                                                                    {sector.type}
                                                                </Typography>
                                                            </Box>

                                                            <TextareaAutosize
                                                                minRows={4}
                                                                placeholder={`Enter ${sector.type} training content...`}
                                                                value={sector.content}
                                                                onChange={(e) => handleSectorContentChange(dayIndex, sectorIndex, e.target.value)}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '8px',
                                                                    marginBottom: '16px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #ccc',
                                                                    fontFamily: 'inherit',
                                                                    fontSize: '14px',
                                                                    resize: 'vertical'
                                                                }}
                                                            />

                                                            <Typography variant="subtitle2" gutterBottom>
                                                                YouTube Links:
                                                            </Typography>

                                                            {sector.youtubeLinks.map((_, linkIndex) => (
                                                                <YouTubeInput
                                                                    key={linkIndex}
                                                                    links={sector.youtubeLinks}
                                                                    setLinks={(links) => handleYoutubeLinksChange(links, sectorIndex, dayIndex)}
                                                                    index={linkIndex}
                                                                    sectorIndex={sectorIndex}
                                                                />
                                                            ))}

                                                            <Button
                                                                startIcon={<AddIcon />}
                                                                size="small"
                                                                onClick={() => handleAddYoutubeLink(dayIndex, sectorIndex)}
                                                                sx={{ alignSelf: 'flex-end', mt: 1 }}
                                                            >
                                                                Add Link
                                                            </Button>
                                                        </Paper>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Collapse>
                                </Paper>
                            ))}
                        </List>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSavePlan}
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                    >
                        {editMode ? 'Update Plan' : 'Create Plan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Training Plan Dialog */}
            <Dialog
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                maxWidth="lg"
                fullWidth
                fullScreen={isMobile}
            >
                {viewPlan ? (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    {viewPlan.name}
                                </Typography>
                                <Box>
                                    {/* Plan creator or the user can edit */}
                                    {(viewPlan.creatorId === parseInt(userId) || viewPlan.userId === parseInt(userId)) && (
                                        <Tooltip title="Edit Plan">
                                            <IconButton onClick={handleEditPlan} sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <IconButton onClick={() => setViewOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Created by {viewPlan.creator?.fullName} for {viewPlan.user?.fullName}
                                </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Created on {format(new Date(viewPlan.createdAt), 'dd.MM.yyyy')}
                            </Typography>
                        </DialogTitle>

                        <DialogContent dividers>
                            {viewPlan.trainingDays?.length > 0 ? (
                                <>
                                    {/* Display Days as Collapsible Sections */}
                                    <Box sx={{ width: '100%', mb: 3 }}>
                                        {viewPlan.trainingDays.map((day, dayIndex) => {
                                            const isPartiallyComplete = isDayPartiallyCompleted(day);
                                            const isFullyComplete = isDayFullyCompleted(day);

                                            return (
                                                <Paper
                                                    key={dayIndex}
                                                    elevation={2}
                                                    sx={{
                                                        mb: 2,
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <ListItemButton
                                                        onClick={() => toggleDayExpansion(dayIndex)}
                                                        sx={{
                                                            py: 2,
                                                            px: 3,
                                                            bgcolor: expandedDays[dayIndex] ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                                            borderLeft: isFullyComplete ? '4px solid #4caf50' : isPartiallyComplete ? '4px solid #90caf9' : '4px solid transparent',
                                                            transition: 'all 0.2s ease-in-out'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarIcon color="primary" sx={{ mr: 2 }} />
                                                            <Typography variant="h6">
                                                                {day.name}
                                                            </Typography>
                                                        </Box>

                                                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                                            {/* Display completion status */}
                                                            {isPartiallyComplete && (
                                                                <Tooltip title={isFullyComplete ? "All sections completed" : "Some sections completed"}>
                                                                    <CheckCircleIcon
                                                                        color="success"
                                                                        sx={{
                                                                            mr: 1,
                                                                            opacity: isFullyComplete ? 1 : 0.7
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                            {expandedDays[dayIndex] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </Box>
                                                    </ListItemButton>

                                                    <Collapse in={expandedDays[dayIndex]} timeout="auto">
                                                        <Box sx={{ p: 3 }}>
                                                            {day.sectors?.map((sector, sectorIndex) => (
                                                                <Paper
                                                                    key={sectorIndex}
                                                                    elevation={1}
                                                                    sx={{
                                                                        p: 3,
                                                                        mb: 3,
                                                                        borderRadius: '8px',
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                        position: 'relative'
                                                                    }}
                                                                >
                                                                    <Box sx={{
                                                                        position: 'absolute',
                                                                        top: 10,
                                                                        right: 10,
                                                                        display: 'flex',
                                                                        gap: 1
                                                                    }}>
                                                                        {/* If user is the creator, show completion status */}
                                                                        {isPlanCreator(viewPlan) && sector.completed && (
                                                                            <Tooltip title="User completed this section">
                                                                                <CheckCircleIcon color="success" />
                                                                            </Tooltip>
                                                                        )}

                                                                        {/* Only the assigned user can complete and add to trainings */}
                                                                        { role === 'regular' && (
                                                                            <>
                                                                                <Tooltip title="Add to My Trainings">
                                                                                    <IconButton
                                                                                        color="primary"
                                                                                        onClick={() => handleAddToTraining(sector.id)}
                                                                                        size="small"
                                                                                    >
                                                                                        <AddIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>

                                                                                <Tooltip title={sector.completed ? "Mark as Incomplete" : "Mark as Complete"}>
                                                                                    <IconButton
                                                                                        color={sector.completed ? "success" : "default"}
                                                                                        onClick={() => handleCompleteSector(sector.id, !sector.completed)}
                                                                                        size="small"
                                                                                    >
                                                                                        {sector.completed ? <CheckCircleIcon /> : <UncheckedIcon />}
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </>
                                                                        )}
                                                                    </Box>

                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        mb: 2,
                                                                        pr: isPlanAssignee(viewPlan) || (isPlanCreator(viewPlan) && sector.completed) ? 8 : 0
                                                                    }}>
                                                                        {getSectorIcon(sector.type)}
                                                                        <Typography variant="h6" sx={{ ml: 1 }}>
                                                                            {sector.type}
                                                                        </Typography>
                                                                    </Box>

                                                                    {/* YouTube Videos */}
                                                                    {sector.youtubeLinks?.length > 0 && (
                                                                        <Box sx={{ mb: 3 }}>
                                                                            <Typography variant="subtitle1" gutterBottom>
                                                                                Training Videos:
                                                                            </Typography>

                                                                            <Grid container spacing={2}>
                                                                                {sector.youtubeLinks.map((link, linkIndex) => (
                                                                                    <Grid item xs={12} md={6} key={linkIndex}>
                                                                                        <YouTubeEmbed url={link.url} />
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>
                                                                        </Box>
                                                                    )}

                                                                    {/* Content */}
                                                                    <Typography variant="subtitle1" gutterBottom>
                                                                        Workout Details:
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        sx={{
                                                                            whiteSpace: 'pre-wrap',
                                                                            p: 2,
                                                                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                                                            borderRadius: 1,
                                                                            mb: 2
                                                                        }}
                                                                    >
                                                                        {sector.content || 'No details provided.'}
                                                                    </Typography>
                                                                </Paper>
                                                            ))}

                                                            {/* Comments section */}
                                                            <Box sx={{ mt: 4 }}>
                                                                <Paper
                                                                    elevation={1}
                                                                    sx={{
                                                                        p: 3,
                                                                        borderRadius: '8px',
                                                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                                    }}
                                                                >
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                                        <Typography variant="h6">
                                                                            Comments
                                                                        </Typography>

                                                                        <Button
                                                                            startIcon={<CommentIcon />}
                                                                            onClick={() => handleToggleComment(day.id)}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        >
                                                                            Add Comment
                                                                        </Button>
                                                                    </Box>

                                                                    {commentOpen[day.id] && (
                                                                        <Box sx={{ mb: 3 }}>
                                                                            <TextareaAutosize
                                                                                minRows={5}
                                                                                maxRows={20}
                                                                                label="Your Comment"
                                                                                value={commentText}
                                                                                onChange={(e) => setCommentText(e.target.value)}
                                                                                variant="outlined"
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

                                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                                <Button
                                                                                    onClick={() => handleToggleComment(day.id)}
                                                                                    sx={{ mr: 1 }}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    variant="contained"
                                                                                    onClick={() => handleAddComment(day.id)}
                                                                                    disabled={!commentText.trim()}
                                                                                >
                                                                                    Submit
                                                                                </Button>
                                                                            </Box>
                                                                        </Box>
                                                                    )}

                                                                    <List>
                                                                        {day.comments?.length > 0 ? (
                                                                            day.comments.map((comment, index) => (
                                                                                <React.Fragment key={comment.id}>
                                                                                    {index > 0 && <Divider component="li" sx={{ my: 1 }} />}
                                                                                    <ListItem sx={{ px: 0 }}>
                                                                                        <ListItemText
                                                                                            primary={
                                                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                                                    <Typography variant="subtitle2">
                                                                                                        {comment.user?.fullName}
                                                                                                    </Typography>
                                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                                        {format(new Date(comment.createdAt), 'dd.MM.yyyy HH:mm')}
                                                                                                    </Typography>
                                                                                                </Box>
                                                                                            }
                                                                                            secondary={
                                                                                                <Typography
                                                                                                    variant="body2"
                                                                                                    sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
                                                                                                >
                                                                                                    {comment.content}
                                                                                                </Typography>
                                                                                            }
                                                                                        />
                                                                                    </ListItem>
                                                                                </React.Fragment>
                                                                            ))
                                                                        ) : (
                                                                            <ListItem sx={{ px: 0 }}>
                                                                                <ListItemText
                                                                                    primary="No comments yet"
                                                                                    primaryTypographyProps={{ color: 'text.secondary' }}
                                                                                />
                                                                            </ListItem>
                                                                        )}
                                                                    </List>
                                                                </Paper>
                                                            </Box>
                                                        </Box>
                                                    </Collapse>
                                                </Paper>
                                            );
                                        })}
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body1" align="center" sx={{ py: 4 }}>
                                    This training plan has no days defined.
                                </Typography>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <WeightliftingPercentageCalculator />
                                </Box>
                                <Button onClick={() => setViewOpen(false)} color="primary">
                                    Close
                                </Button>
                            </Box>
                        </DialogActions>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the training plan "{planToDelete?.name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TrainingPlans;