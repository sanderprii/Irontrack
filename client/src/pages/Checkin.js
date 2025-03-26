import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Container, Typography, Button, Box, Grid, useMediaQuery } from "@mui/material";
import ClassSchedule from "../components/ClassSchedule";
import CheckInModal from "../components/CheckInModal";
import LeaderboardModal from "../components/LeaderboardModal";
import { getClasses, getClassAttendeesCount } from "../api/classesApi";
import { getAffiliate } from "../api/affiliateApi";

export default function CheckIn() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [affiliateId, setAffiliateId] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [isClassModalOpen, setClassModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const todayIndex = new Date().getDay();
    const correctedIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Sun (0) -> 6, Mon (1) -> 0, ..., Sat (6) -> 5
    const [selectedDayIndex, setSelectedDayIndex] = useState(correctedIndex);

    const [attendeesCount, setAttendeesCount] = useState({});
    const [showWeekly, setShowWeekly] = useState(false);
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const affiliateIdLocalStorage = localStorage.getItem("affiliateId");

        if (affiliateIdLocalStorage) {
            setAffiliateId(parseInt(affiliateIdLocalStorage));
        } else {
            const fetchAffiliate = async () => {
                try {
                    const response = await getAffiliate();
                    if (response && response.affiliate && response.affiliate.id) {
                        setAffiliateId(response.affiliate.id);
                    } else {
                        console.error("Affiliate ID not found in response:", response);
                    }
                } catch (error) {
                    console.error("Error fetching affiliate ID:", error);
                }
            };
            fetchAffiliate();
        }
    }, []);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

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
                    counts[cls.id] = count || 0;
                } catch (error) {
                    console.error(`❌ Error fetching attendees for class ${cls.id}:`, error);
                    counts[cls.id] = 0;
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

    const handleToggleView = () => {
        setShowWeekly((prev) => !prev);
    };

    const handleClassClick = (cls) => {
        setSelectedClass(cls);
        setClassModalOpen(true);
    };

    return (
        <Container maxWidth={false}>
            <Box textAlign="center" my={4}>
                <Typography variant="h5" color="primary">Check-In Dashboard</Typography>
            </Box>

            {/* Week navigation */}
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

            {/* Day selector */}
            {!showWeekly && (
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} p={1}
                     sx={{
                         overflowX: "auto",
                         whiteSpace: "nowrap",
                         flexWrap: "nowrap",
                     }}>
                    {dayNames.map((day, index) => (
                        <Button
                            key={index}
                            variant={selectedDayIndex === index ? "contained" : "outlined"}
                            color={selectedDayIndex === index ? "primary" : "default"}
                            onClick={() => handleDaySelect(index)}
                            sx={{
                                minWidth: { xs: "40px", sm: "80px" },
                                flexGrow: 1,
                                fontSize: { xs: "0.75rem", sm: "1rem" },
                                padding: { xs: "4px", sm: "8px" },
                            }}
                        >
                            {day}
                        </Button>
                    ))}
                </Box>
            )}

            {/* Weekly view */}
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
                    onClassClick={handleClassClick}
                    weeklyView
                />
            )}

            {/* Check-in Modal */}
            <CheckInModal
                open={isClassModalOpen}
                onClose={() => setClassModalOpen(false)}
                cls={selectedClass}
                refreshClasses={fetchClasses}
                attendeesCount={attendeesCount[selectedClass?.id]}
                affiliateId={affiliateId}
            />
        </Container>
    );
}