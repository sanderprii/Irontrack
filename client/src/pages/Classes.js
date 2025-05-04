import React, {useState, useEffect, useCallback} from "react";
import {useLocation} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress
} from "@mui/material";
import {Snackbar, Alert} from '@mui/material';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TodayIcon from "@mui/icons-material/Today";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Trophy icon for day leaderboard
import ClassSchedule from "../components/ClassSchedule";
import TrainingModal from "../components/TrainingFormClasses";
import LeaderboardModal from "../components/LeaderboardModal";
import {getClassesForDay, assignTrainerToClasses} from "../api/classesApi";
import TrainerAssignmentModal from "../components/TrainerAssignmentModal";

import ClassDetailsModal from "../components/ClassModal";
import {getClasses, deleteClass, createTraining, updateTraining, getClassAttendeesCount} from "../api/classesApi";
import {getAffiliate} from "../api/affiliateApi";
import ClassWodView from "../components/ClassWodView";
import {getClassLeaderboard} from "../api/leaderboardApi";
import {getUserProfile} from "../api/profileApi";


export default function Classes() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [showWODView, setShowWODView] = useState(false);
    const location = useLocation();
    const selectedAffiliate = location.state?.affiliate || null;
    const [affiliateId, setAffiliateId] = useState(null);
    const [affiliateEmail, setAffiliateEmail] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isTrainingModalOpen, setTrainingModalOpen] = useState(false);
    const [isWODModalOpen, setWODModalOpen] = useState(false);
    const [isClassModalOpen, setClassModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [trainers, setTrainers] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const todayIndex = new Date().getDay();
    const correctedIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Sun (0) -> 6, Mon (1) -> 0, ..., Sat (6) -> 5
    const [selectedDayIndex, setSelectedDayIndex] = useState(correctedIndex);

    const [attendeesCount, setAttendeesCount] = useState({});
    const [showWeekly, setShowWeekly] = useState(false);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [userRole, setUserRole] = useState(null);

    // Day leaderboard state
    const [isDayLeaderboardOpen, setDayLeaderboardOpen] = useState(false);
    const [dayLeaderboardFilter, setDayLeaderboardFilter] = useState("all");
    const [dayLeaderboardData, setDayLeaderboardData] = useState([]);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
    const [userFullName, setUserFullName] = useState("");

    // Dialog states
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // Add near other state declarations
    const [isTrainerAssignmentOpen, setTrainerAssignmentOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedAssignmentDate, setSelectedAssignmentDate] = useState(new Date());
    const [dayClasses, setDayClasses] = useState([]);
    const [selectedClassIds, setSelectedClassIds] = useState([]);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationSeverity, setNotificationSeverity] = useState('info'); // 'success', 'info', 'warning', 'error'

    // Fix affiliateId issue
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile && profile.fullName) {
                    setUserFullName(profile.fullName);
                } else {
                    const storedName = localStorage.getItem('fullName');
                    if (storedName) setUserFullName(storedName);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                const storedName = localStorage.getItem('fullName');
                if (storedName) setUserFullName(storedName);
            }
        };

        fetchUserProfile();
    }, []);

    // Set up affiliateId in a more reliable way
    useEffect(() => {
        // Set up affiliateId from various sources
        if (selectedAffiliate && selectedAffiliate.id) {

            setAffiliateId(selectedAffiliate.id);

            if (selectedAffiliate.trainers) {
                setTrainers(selectedAffiliate.trainers);
            }

            return; // Exit early if we have a selectedAffiliate
        }

        const storedId = localStorage.getItem("affiliateId");
        if (storedId) {

            setAffiliateId(parseInt(storedId));
            return; // Exit early if we found it in localStorage
        }

        // Only fetch from API if we don't have affiliateId from other sources

        const fetchAffiliate = async () => {
            try {
                const response = await getAffiliate();


                if (response && response.affiliate && response.affiliate.id) {

                    setAffiliateId(response.affiliate.id);
                    setAffiliateEmail(response.affiliate.email);

                    if (response.trainers && Array.isArray(response.trainers)) {
                        setTrainers(response.trainers);
                    }

                } else if (response && response.id) {

                    setAffiliateId(response.id);
                    if (response.email) setAffiliateEmail(response.email);
                } else {
                    console.error("Could not find a valid affiliateId in the response:", response);
                }
            } catch (error) {
                console.error("Error fetching affiliate:", error);
            }
        };

        fetchAffiliate();
    }, [selectedAffiliate]);

    // Set userRole
    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
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

    // Modified fetchClasses to not warn about null affiliateId
    const fetchClasses = useCallback(async () => {
        if (!affiliateId) {
            return; // Just return silently without a warning
        }

        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        try {
            const response = await getClasses(affiliateId, startOfWeek);
            setClasses(response || []);

        } catch (error) {
            console.error("❌ Fetch error:", error);
            setClasses([]);
        }
    }, [affiliateId, currentDate]);

    // Dedicated effect to call fetchClasses when affiliateId changes
    useEffect(() => {
        if (affiliateId) {
            fetchClasses();
        }
    }, [affiliateId, fetchClasses]);


    // Get classes for selected day
    const getClassesForSelectedDay = (dayIndex) => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1 + dayIndex);

        return classes.filter((cls) => {
            const classDate = new Date(cls.time);
            return (
                classDate.getFullYear() === startOfWeek.getFullYear() &&
                classDate.getMonth() === startOfWeek.getMonth() &&
                classDate.getDate() === startOfWeek.getDate()
            );
        });
    };

    const showNotification = (message, severity = 'info') => {
        setNotificationMessage(message);
        setNotificationSeverity(severity);
        setNotificationOpen(true);
    };

    // Fetch leaderboard data for all WOD classes on the selected day
    const fetchDayLeaderboard = async () => {
        try {
            setLoadingLeaderboard(true);

            // Get all WOD classes for the selected day
            const dayClasses = getClassesForSelectedDay(selectedDayIndex);
            const wodClasses = dayClasses.filter(cls => cls.trainingType === "WOD");

            if (wodClasses.length === 0) {
                showErrorMessage("No WOD classes found for this day");
                setLoadingLeaderboard(false);
                return;
            }

            // Fetch leaderboard data for each WOD class
            const leaderboardPromises = wodClasses.map(cls => getClassLeaderboard(cls.id));
            const leaderboardResults = await Promise.all(leaderboardPromises);

            // Combine all leaderboard results and add the class name to each entry
            const combinedLeaderboard = [];
            leaderboardResults.forEach((results, index) => {
                if (Array.isArray(results) && results.length > 0) {
                    const classData = wodClasses[index];
                    const classLeaderboard = results.map(entry => ({
                        ...entry,
                        className: classData.trainingName,
                        wodName: classData.wodName || "WOD",
                        classTime: new Date(classData.time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        classId: classData.id
                    }));
                    combinedLeaderboard.push(...classLeaderboard);
                }
            });

            setDayLeaderboardData(combinedLeaderboard);
            setLoadingLeaderboard(false);

            // If we have data, open the leaderboard modal
            if (combinedLeaderboard.length > 0) {
                setDayLeaderboardOpen(true);
            } else {
                showNotification("No leaderboard entries found for WOD classes today");
            }

        } catch (error) {
            console.error("Error fetching day leaderboard:", error);
            showErrorMessage("Error loading leaderboard data");
            setLoadingLeaderboard(false);
        }
    };

    // Open day leaderboard
    const handleOpenDayLeaderboard = () => {
        fetchDayLeaderboard();
    };

    // Handle leaderboard filter change
    const handleDayLeaderboardFilterChange = (event, newFilter) => {
        if (newFilter) {
            setDayLeaderboardFilter(newFilter);
        }
    };

    // Filter the day leaderboard data
    const filteredDayLeaderboard = dayLeaderboardData.filter(entry =>
        dayLeaderboardFilter === "all" || entry.scoreType?.toLowerCase() === dayLeaderboardFilter
    );

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
        setSelectedDayIndex(0);
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentDate(today);

        // Set the selected day to today
        const todayIndex = today.getDay();
        const correctedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
        setSelectedDayIndex(correctedIndex);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
        setSelectedDayIndex(0);
    };

    const handleDaySelect = (index) => {
        setSelectedDayIndex(index);
    };

    const handleAddTraining = () => {
        setSelectedTraining(null);
        setTrainingModalOpen(true);
    };

    const handleToggleView = () => {
        setShowWeekly((prev) => !prev);
    };

    // ✅ Funktsioon treeningu salvestamiseks
    const handleSaveTraining = async (trainingData) => {
        if (!affiliateId) {
            console.error("❌ Cannot save training: affiliateId is null");
            showErrorMessage("Cannot save training: missing affiliate ID");
            return;
        }

        if (!trainingData || typeof trainingData !== "object") {
            console.error("❌ Invalid training data:", trainingData);
            showErrorMessage("Invalid training data provided");
            return;
        }

        try {
            if (trainingData.id) {
                await updateTraining(trainingData.id, trainingData); // ✅ Teeme update
                showSuccessMessage("Training updated successfully!");

                if (selectedClass && selectedClass.id === trainingData.id) {
                    setSelectedClass(trainingData);
                }

            } else {
                await createTraining(affiliateId, trainingData); // ✅ Loome uue klassi
                showSuccessMessage("New training created successfully!");
            }

            setTrainingModalOpen(false);
            fetchClasses(); // ✅ Uuenda klasside nimekirja
        } catch (error) {
            console.error("❌ Error saving training:", error);
            showErrorMessage("Error saving training: " + (error.message || "Unknown error"));
        }
    };

    const handleEditTraining = (training) => {
        setSelectedTraining(training);
        setTrainingModalOpen(true);
    };

    // Open delete confirmation dialog
    const handleOpenDeleteConfirm = (classId) => {
        setClassToDelete(classId);
        setConfirmDialogOpen(true);
    };

    // Delete class after confirmation
    const handleConfirmDeleteClass = async () => {
        if (!classToDelete) return;

        try {
            await deleteClass(classToDelete);
            fetchClasses();
            setClassModalOpen(false);
            showSuccessMessage("Class deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting class:", error);
            showErrorMessage("Error deleting class: " + (error.message || "Unknown error"));
        }
        setConfirmDialogOpen(false);
        setClassToDelete(null);
    };

    // Handle the delete button click
    const handleDeleteClass = (classId) => {
        handleOpenDeleteConfirm(classId);
    };

    const handleEditClass = (cls) => {
        setSelectedTraining(cls);
        setTrainingModalOpen(true);
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setClassModalOpen(true);
    };

    // Check if there are any WOD classes for the selected day
    const hasWodClasses = getClassesForSelectedDay(selectedDayIndex).some(cls => cls.trainingType === "WOD");

    // Format date for display
    const getFormattedDate = () => {
        const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - (currentDate.getDay() || 7) + selectedDayIndex + 1
        );

        // Format as DD.MM.YYYY
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const handleOpenTrainerAssignment = () => {
        const today = new Date();
        setSelectedTrainer(null);
        setSelectedClassIds([]);
        setSelectedAssignmentDate(today);
        setTrainerAssignmentOpen(true);

        fetchClassesForDay(today);
    };

    const fetchClassesForDay = async (date) => {
        if (!affiliateId) return;

        const formattedDate = date.toISOString().split('T')[0];

        try {
            const response = await getClassesForDay(affiliateId, formattedDate);
            setDayClasses(response || []);
        } catch (error) {
            console.error("❌ Error fetching classes for day:", error);
            showErrorMessage("Error loading classes for selected day");
            setDayClasses([]);
        }
    };

    const handleDateChange = (date) => {
        setSelectedAssignmentDate(date);
        setSelectedClassIds([]);
        fetchClassesForDay(date);
    };

    const handleTrainerChange = (trainerId) => {
        // Leia õige treener ID järgi
        const trainer = trainers.find(t =>
            (t.trainerId === parseInt(trainerId)) ||
            (t.id === parseInt(trainerId))
        );
        setSelectedTrainer(trainer);
    };

    const handleClassCheckboxChange = (classId) => {
        setSelectedClassIds(prev => {
            if (prev.includes(classId)) {
                return prev.filter(id => id !== classId);
            } else {
                return [...prev, classId];
            }
        });
    };

    const handleAssignTrainer = async () => {
        if (!selectedTrainer) {
            showErrorMessage("Please select a trainer");
            return;
        }

        if (selectedClassIds.length === 0) {
            showErrorMessage("Please select at least one class");
            return;
        }

        // Leia korrektne treeneri nimi
        let trainerName = "";
        if (typeof selectedTrainer === 'string') {
            trainerName = selectedTrainer;
        } else if (selectedTrainer.fullName) {
            trainerName = selectedTrainer.fullName;
        } else if (selectedTrainer.trainer && selectedTrainer.trainer.fullName) {
            trainerName = selectedTrainer.trainer.fullName;
        } else {

            showErrorMessage("Could not determine trainer name");
            return;
        }

        try {


            const response = await assignTrainerToClasses(selectedClassIds, trainerName);


            setTrainerAssignmentOpen(false);
            fetchClasses(); // Värskendame klassid pärast määramist
            showSuccessMessage("Trainer assigned successfully!");
        } catch (error) {
            console.error("❌ Error assigning trainer:", error);
            showErrorMessage("Error assigning trainer to classes: " + (error.message || "Unknown error"));
        }
    };

    return (
        <Container maxWidth={false}>
            <Box textAlign="center" my={4}>

                {selectedAffiliate?.name &&
                    <Typography variant="h4" color="primary">{selectedAffiliate.name}</Typography>}
                <Typography variant="h5" color="primary">Class Schedule
                    {/* Day Leaderboard Trophy Icon - only show if there are WOD classes that day */}
                    {hasWodClasses && (
                        <IconButton
                            color="primary"
                            onClick={handleOpenDayLeaderboard}
                            sx={{
                                ml: 1,
                                color: "goldenrod",
                                "&:hover": {
                                    backgroundColor: "rgba(218,165,32,0.1)"
                                }
                            }}
                        >
                            <EmojiEventsIcon/>
                        </IconButton>
                    )}
                </Typography>


                {/* ✅ Ainult "owner" ja "trainer" rollid näevad nuppe */}
                {(userRole === "affiliate" || userRole === "trainer") && (
                    showWODView ? (
                        <Button sx={{m: 1}} variant="contained" color="secondary" onClick={() => setShowWODView(false)}>
                            Show Classes
                        </Button>
                    ) : (
                        <Button sx={{m: 1}} variant="contained" color="primary" onClick={() => setShowWODView(true)}>
                            Add WOD
                        </Button>
                    )

                )}

                {(userRole === "affiliate" || userRole === "trainer") && (
                    <Button sx={{m: 1}} variant="contained" color="primary" onClick={handleAddTraining}>
                        Add Training
                    </Button>
                )}
                {userRole === "affiliate" && (
                    <Button sx={{m: 1}} variant="contained" color="primary" onClick={handleOpenTrainerAssignment}>
                        Add Trainers
                    </Button>
                )}

            </Box>

            {/* ✅ Kuvab kas WOD vaate või klasside vaate */}
            {showWODView ? (
                <ClassWodView affiliateId={affiliateId} selectedAffiliateId={affiliateId} currentDate={currentDate}
                              onClose={() => setShowWODView(false)}/>
            ) : (
                <>
                    {/* ✅ Nädala ja päeva vahetus */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <IconButton
                            color="primary"
                            onClick={handlePrevWeek}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                        >
                            <ArrowBackIosNewIcon />
                        </IconButton>

                        {!showWeekly && (
                            <Box display="flex" alignItems="center">
                                <Typography variant="h6" sx={{ mr: 1 }}>
                                    {getFormattedDate()}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<TodayIcon />}
                                    onClick={handleToday}
                                >
                                    Today
                                </Button>
                            </Box>
                        )}

                        {!isMobile && (
                            <Button variant="contained" color="primary" onClick={handleToggleView}>
                                {showWeekly ? "As Day" : "Show Weekly"}
                            </Button>
                        )}

                        <IconButton
                            color="primary"
                            onClick={handleNextWeek}
                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>

                    {/* ✅ Kui showWeekly = false -> päeva kaupa */}
                    {!showWeekly && (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1} p={1}
                             sx={{
                                 overflowX: "auto",  // ✅ Lisab horisontaalse kerimise, kui väga kitsaks läheb
                                 whiteSpace: "nowrap", // ✅ Väldib mitmerealist paigutust
                                 flexWrap: "nowrap", // ✅ Hoiab kõik nupud ühel real
                             }}>
                            {dayNames.map((day, index) => (
                                <Button
                                    key={index}
                                    variant={selectedDayIndex === index ? "contained" : "outlined"}
                                    color={selectedDayIndex === index ? "primary" : "default"}
                                    onClick={() => handleDaySelect(index)}
                                    sx={{
                                        minWidth: {xs: "40px", sm: "80px"}, // ✅ Väiksematel ekraanidel vähendab suurust
                                        flexGrow: 1, // ✅ Jaotab ruumi võrdselt
                                        fontSize: {xs: "0.75rem", sm: "1rem"}, // ✅ Väiksem tekst kitsamal ekraanil
                                        padding: {xs: "4px", sm: "8px"}, // ✅ Kohandatud padding väiksematel ekraanidel
                                    }}
                                >
                                    {day}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* ✅ Kui showWeekly = true -> nädalane vaade */}
                    {showWeekly ? (
                        <Grid container spacing={2}>
                            {dayNames.map((day, index) => {
                                const dailyClasses = getClassesForSelectedDay(index);
                                const dayDate = new Date(currentDate);
                                dayDate.setDate(dayDate.getDate() - (dayDate.getDay() || 7) + 1 + index);
                                const hasWodClassesForDay = dailyClasses.some(cls => cls.trainingType === "WOD");

                                return (
                                    <Grid item xs={12} sm={6} md={1.7} lg={1.7} key={index}>
                                        <Box textAlign="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <Typography variant="h6" sx={{fontWeight: "bold", my: 1}}>
                                                    {day} - {dayDate.toLocaleDateString("en-GB")}
                                                </Typography>

                                                {/* Day Leaderboard Trophy Icon for weekly view */}
                                                {hasWodClassesForDay && (
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => {
                                                            setSelectedDayIndex(index);
                                                            handleOpenDayLeaderboard();
                                                        }}
                                                        size="small"
                                                        sx={{
                                                            ml: 0.5,
                                                            color: "goldenrod",
                                                            "&:hover": {
                                                                backgroundColor: "rgba(218,165,32,0.1)"
                                                            }
                                                        }}
                                                    >
                                                        <EmojiEventsIcon fontSize="small"/>
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <ClassSchedule
                                                classes={dailyClasses}
                                                attendeesCount={attendeesCount}
                                                onEdit={handleEditTraining}
                                                onClassClick={handleClassClick}
                                            />
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <ClassSchedule
                            classes={getClassesForSelectedDay(selectedDayIndex)}
                            attendeesCount={attendeesCount}
                            onEdit={handleEditTraining}
                            onClassClick={handleClassClick}
                            weeklyView
                        />
                    )}
                </>
            )}
            <TrainingModal
                open={isTrainingModalOpen}
                onClose={() => setTrainingModalOpen(false)}
                onSave={handleSaveTraining}
                selectedClass={selectedTraining}
                trainers={trainers}
            />

            <ClassDetailsModal
                open={isClassModalOpen}
                onClose={() => setClassModalOpen(false)}
                cls={selectedClass}
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
                refreshClasses={fetchClasses}
                attendeesCount={attendeesCount[selectedClass?.id]}
                affiliateId={affiliateId}
                affiliateEmail={affiliateEmail}
                trainers={trainers}
            />

            <TrainerAssignmentModal
                open={isTrainerAssignmentOpen}
                onClose={() => setTrainerAssignmentOpen(false)}
                trainers={trainers}
                dayClasses={dayClasses}
                selectedTrainer={selectedTrainer}
                selectedDate={selectedAssignmentDate}
                selectedClassIds={selectedClassIds}
                onTrainerChange={handleTrainerChange}
                onDateChange={handleDateChange}
                onClassCheckboxChange={handleClassCheckboxChange}
                onAssign={handleAssignTrainer}
            />

            {/* Day Leaderboard Modal */}
            <Dialog
                open={isDayLeaderboardOpen}
                onClose={() => setDayLeaderboardOpen(false)}
                maxWidth={false} // Muuda "md" asemel "false"
                fullWidth
                PaperProps={{
                    sx: {
                        m: {xs: 0},  // Mobiilis eemaldame ääred
                        width: {xs: '100%'},  // Mobiilis täislaius
                        maxWidth: {xs: '100%'},  // Mobiilis täislaius
                        borderRadius: {xs: 0}  // Mobiilis eemaldame ümarad nurgad
                    }
                }}
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <EmojiEventsIcon sx={{color: "goldenrod", mr: 1}}/>
                        <Typography variant="h6">
                            Daily WOD Leaderboard - {getFormattedDate()}
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {/* Filter buttons */}
                    <ToggleButtonGroup
                        value={dayLeaderboardFilter}
                        exclusive
                        onChange={handleDayLeaderboardFilterChange}
                        aria-label="Filter results"
                        size="small"
                        sx={{mb: 2}}
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="rx">Rx</ToggleButton>
                        <ToggleButton value="sc">Sc</ToggleButton>
                        <ToggleButton value="beg">Beg</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Show loading indicator or data table */}
                    {loadingLeaderboard ? (
                        <Box display="flex" justifyContent="center" my={3}>
                            <CircularProgress/>
                        </Box>
                    ) : filteredDayLeaderboard.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Class</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            Score
                                            <Typography
                                                component="span"
                                                color="text.secondary"
                                                sx={{ml: 1, fontSize: '0.9em'}}
                                            >
                                                (previous)
                                            </Typography>
                                        </TableCell>
                                        <TableCell>Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredDayLeaderboard.map((entry, index) => (
                                        <TableRow
                                            key={`${entry.id}-${index}`}
                                            // Highlight the current user's row
                                            sx={entry.fullName === userFullName ? {
                                                backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                            } : {}}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                                    {entry.classTime} - {entry.className}
                                                </Typography>
                                                {entry.wodName && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {entry.wodName}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{entry.fullName}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    {entry.score}
                                                    {entry.previousScore && (
                                                        <Typography
                                                            component="span"
                                                            color="text.secondary"
                                                            sx={{ml: 1, fontSize: '0.9em'}}
                                                        >
                                                            ({entry.previousScore})
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{entry.scoreType?.toUpperCase()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography align="center">
                            No results available for the selected filter.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDayLeaderboardOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this class? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDeleteClass} color="error">
                        Delete
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
            <Snackbar
                open={notificationOpen}
                autoHideDuration={6000}
                onClose={() => setNotificationOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setNotificationOpen(false)}
                    severity={notificationSeverity}
                    sx={{width: '100%'}}
                >
                    {notificationMessage}
                </Alert>
            </Snackbar>
        </Container>


    );

}