import React, {useState, useEffect, useCallback} from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
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
    DialogActions
} from "@mui/material";
import ClassSchedule from "../components/ClassSchedule";
import TrainingModal from "../components/TrainingFormClasses";

import ClassDetailsModal from "../components/ClassModal"; // ✅ Lisatud klassi detailide modal
import { getClasses, deleteClass, createTraining, updateTraining, getClassAttendeesCount} from "../api/classesApi";
import { getAffiliate } from "../api/affiliateApi";
import ClassWodView from "../components/ClassWodView";

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
    const [selectedClass, setSelectedClass] = useState(null); // ✅ Hoitakse valitud klassi andmeid
    const [isTrainingModalOpen, setTrainingModalOpen] = useState(false);
    const [isWODModalOpen, setWODModalOpen] = useState(false);
    const [isClassModalOpen, setClassModalOpen] = useState(false); // ✅ Hoitakse klassi modali olekut
    const [currentDate, setCurrentDate] = useState(new Date());

    const [selectedDate, setSelectedDate] = useState(new Date());

    const todayIndex = new Date().getDay();
    const correctedIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Sun (0) -> 6, Mon (1) -> 0, ..., Sat (6) -> 5
    const [selectedDayIndex, setSelectedDayIndex] = useState(correctedIndex);

    const [attendeesCount, setAttendeesCount] = useState({});
    const [showWeekly, setShowWeekly] = useState(false);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [userRole, setUserRole] = useState(null);

    // Dialog states
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    useEffect(() => {
        const affiliateIdLocalStorage = localStorage.getItem("affiliateId");

        if (selectedAffiliate) {
            setAffiliateId(selectedAffiliate.id);
        } else if (affiliateIdLocalStorage) {
            setAffiliateId(parseInt(localStorage.getItem("affiliateId")));

        } else {
            const fetchAffiliate = async () => {
                try {
                    const response = await getAffiliate();
                    if (response && response.affiliate && response.affiliate.id) {
                        setAffiliateId(response.affiliate.id);
                        setAffiliateEmail(response.affiliate.email);
                    } else {
                        console.error("Affiliate ID not found in response:", response);
                    }
                } catch (error) {
                    console.error("Error fetching affiliate ID:", error);
                }
            };
            fetchAffiliate();
        }
    }, [selectedAffiliate]); // ✅ Lisatud `selectedAffiliate` sõltuvuseks


    useEffect(() => {
        const role = localStorage.getItem("role"); // ⬅️ Loe rolli LocalStoragest
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

    const fetchClasses = useCallback(async () => {

        if (!affiliateId) {
            console.warn("⚠️ Skipping fetchClasses: affiliateId is null");
            return;
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


    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const fetchAttendeesCount = useCallback(async () => {
        const counts = {};
        await Promise.all(
            classes.map(async (cls) => {
                try {
                    const count = await getClassAttendeesCount(cls.id);
                    counts[cls.id] = count || 0; // Kui API ei tagasta midagi, paneme 0
                } catch (error) {
                    console.error(`❌ Error fetching attendees for class ${cls.id}:`, error);
                    counts[cls.id] = 0; // Vigade korral määrame 0
                }
            })
        );
        setAttendeesCount(counts);
    }, [classes]);


    useEffect(() => {
        if (classes.length > 0) {
            fetchAttendeesCount();
        }
    }, [classes, fetchAttendeesCount]);

    let selectedDay = 0;

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

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
        setSelectedDayIndex(0);
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

    const getClassesForWeek = () => {
        return dayNames.map((_, index) => ({
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() || 7) + index + 1),
            classes: getClassesForSelectedDay(index),
        }));
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

    useEffect(() => {

    }, [theme]);

    return (
        <Container maxWidth={false}>
            <Box textAlign="center" my={4}>
                <Typography variant="h5" color="primary">Class Schedule</Typography>

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

            </Box>

            {/* ✅ Kuvab kas WOD vaate või klasside vaate */}
            {showWODView ? (
                <ClassWodView affiliateId={affiliateId} selectedAffiliateId={affiliateId} currentDate={currentDate} onClose={() => setShowWODView(false)} />
            ) : (
                <>
                    {/* ✅ Nädala ja päeva vahetus */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Button variant="contained" color="secondary" onClick={handlePrevWeek}>
                            Previous Week
                        </Button>
                        {!showWeekly && (
                            <Typography variant="h6">
                                {new Date(
                                    currentDate.getFullYear(),
                                    currentDate.getMonth(),
                                    currentDate.getDate() - (currentDate.getDay() || 7) + selectedDayIndex + 1
                                ).toLocaleDateString()}
                            </Typography>
                        )}
                        {!isMobile && (
                            <Button variant="contained" color="primary" onClick={handleToggleView}>
                                {showWeekly ? "As Day" : "Show Weekly"}
                            </Button>
                        )}

                        <Button variant="contained" color="secondary" onClick={handleNextWeek}>
                            Next Week
                        </Button>
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
                                        minWidth: { xs: "40px", sm: "80px" }, // ✅ Väiksematel ekraanidel vähendab suurust
                                        flexGrow: 1, // ✅ Jaotab ruumi võrdselt
                                        fontSize: { xs: "0.75rem", sm: "1rem" }, // ✅ Väiksem tekst kitsamal ekraanil
                                        padding: { xs: "4px", sm: "8px" }, // ✅ Kohandatud padding väiksematel ekraanidel
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

                                return (
                                    <Grid item xs={12} sm={6} md={1.7} lg={1.7} key={index}>
                                        <Box textAlign="center">
                                            <Typography variant="h6" sx={{ fontWeight: "bold", my: 1 }}>
                                                {day} - {dayDate.toLocaleDateString("en-GB")}
                                            </Typography>
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
            />

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
        </Container>
    );
}