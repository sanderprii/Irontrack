import React, { useState, useRef, useEffect } from "react";
import { Box, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // ⏰ Kellaaeg
import PersonIcon from "@mui/icons-material/Person"; // 👤 Treener
import GroupIcon from "@mui/icons-material/Group"; // 👥 Mahutavus
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // 🏆 Trophy icon for leaderboard
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ✅ Registreerimise märk
import LeaderboardModal from "./LeaderboardModal"; // Import LeaderboardModal

export default function ClassSchedule({ classes, attendeesCount, onClassClick, weeklyView }) {
    // ✅ Sorteerime klassid ajaliselt (varasemad eespool)
    const sortedClasses = [...classes].sort((a, b) => new Date(a.time) - new Date(b.time));

    // State for Leaderboard modal
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [selectedLeaderboardClass, setSelectedLeaderboardClass] = useState(null);

    // Ref for scrolling to next available class
    const classRefs = useRef({});
    const containerRef = useRef(null);

    // Handle opening the leaderboard
    const handleOpenLeaderboard = (e, cls) => {
        e.stopPropagation(); // Prevent the card click from opening the class modal
        setSelectedLeaderboardClass(cls);
        setLeaderboardOpen(true);
    };

    // Handle closing the leaderboard
    const handleCloseLeaderboard = () => {
        setLeaderboardOpen(false);
        setSelectedLeaderboardClass(null);
    };

    // Function to get background color based on training type
    const getBackgroundColor = (trainingType) => {
        switch(trainingType) {
            case "WOD":
                return "#f0faff"; // hele-sinine
            case "Weightlifting":
                return "#f0fff5"; // hele-roheline
            case "Cardio":
                return "#fff5f5"; // hele-punane
            case "Rowing":
                return "#f9f0ff"; // hele-lilla
            case "Gymnastics":
                return "#fff0f9"; // hele-roosa
            case "Open Gym":
                return "#f5f0e1"; // hele-pruun
            default:
                return "background.paper";
        }
    };

// Find the next available class and scroll to it
    useEffect(() => {
        if (sortedClasses.length === 0) return;

        const now = new Date();
        const nextAvailableClass = sortedClasses.find(cls => {
            const classTime = new Date(cls.time);
            return classTime > now;
        });

        if (nextAvailableClass && classRefs.current[nextAvailableClass.id]) {
            // Small delay to ensure the component is fully rendered
            setTimeout(() => {
                // Lihtsalt scrolli elemendi juurde ilma offset'ita esialgu
                classRefs.current[nextAvailableClass.id].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Proovi 'center' asemel 'start'
                    inline: 'nearest'
                });
            }, 50);
        }
    }, [sortedClasses]);

    return (
        <Box ref={containerRef} sx={{ width: "100%", pb: 0 }}>
            {sortedClasses.length === 0 ? (
                <Typography
                    variant={weeklyView ? "body2" : "h6"}
                    align="center"
                    sx={{ width: "100%", mt: 2 }}
                >
                    No trainings scheduled.
                </Typography>
            ) : (
                sortedClasses.map((cls) => {
                    const classTime = new Date(cls.time);
                    const now = new Date();
                    const isPastClass = now > classTime;

                    return (
                        <Card
                            key={cls.id}
                            ref={el => classRefs.current[cls.id] = el}
                            sx={{
                                cursor: "pointer",
                                ":hover": { boxShadow: isPastClass ? 2 : 6 },
                                bgcolor: getBackgroundColor(cls.trainingType),
                                width: "100%",
                                mb: 2,
                                p: weeklyView ? 1 : 2,
                                position: "relative",
                                // Möödunud klasside stiil
                                opacity: isPastClass ? 0.6 : 1,
                                filter: isPastClass ? 'grayscale(70%)' : 'none',
                                transition: 'all 0.3s ease',
                                // Highlight next available class
                                boxShadow: (!isPastClass && sortedClasses.find(c => new Date(c.time) > now) === cls)
                                    ? '0 4px 20px rgba(33, 150, 243, 0.3)'
                                    : 'initial',

                            }}
                            onClick={() => onClassClick(cls)}
                        >
                            {/* Register check mark icon */}
                            {cls.isRegistered && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 5,
                                        right: 5,
                                        zIndex: 1,
                                        color: "#4caf50", // roheline
                                        width: 32,
                                        height: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CheckCircleIcon />
                                </Box>
                            )}

                            <CardContent>
                                {weeklyView ? (
                                    // ✅ Päevavaade (KAHE VEERUGA)
                                    <Grid container spacing={2} alignItems="center">
                                        {/* Vasak veerg: Kellaaeg ja kestus */}
                                        <Grid item xs={3}>
                                            <Box display="flex" alignItems="center">
                                                <AccessTimeIcon sx={{ mr: 1 }} />
                                                <Typography>
                                                    {new Date(cls.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </Typography>
                                            </Box>
                                            <Typography color="textSecondary">{cls.duration} min</Typography>
                                        </Grid>

                                        {/* Parem veerg: Klass, Treener, Mahutavus */}
                                        <Grid item xs={9}>
                                            <Typography variant="h6">{cls.trainingName}</Typography>

                                            <Box display="flex" alignItems="center">
                                                <PersonIcon sx={{ mr: 1 }} />
                                                <Typography>{cls.trainer || "N/A"}</Typography>
                                            </Box>

                                            <Box display="flex" alignItems="center">
                                                <GroupIcon sx={{ mr: 1 }} />
                                                <Typography>
                                                    {cls.enrolledCount || 0} / {cls.memberCapacity} spots
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    // ✅ Nädalavaade (ÜHE VEERUGA)
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.65rem" }}>
                                            {cls.trainingName}
                                        </Typography>

                                        <Box display="flex" alignItems="center" sx={{ fontSize: "0.65rem", mt: 0.5 }}>
                                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="body2" sx={{ fontSize: "0.65rem"}}>
                                                {new Date(cls.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" sx={{ fontSize: "0.65rem", mt: 0.5 }}>
                                            <PersonIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                            <Typography variant="body2" sx={{ fontSize: "0.65rem"}}>{cls.trainer || "N/A"}</Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" sx={{ fontSize: "0.65rem", mt: 0.5 }}>
                                            <GroupIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                            <Typography variant="body2" sx={{ fontSize: "0.65rem"}}>
                                                {cls.enrolledCount || 0} / {cls.memberCapacity} spots
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    );
                })
            )}

            {/* Leaderboard Modal */}
            {selectedLeaderboardClass && (
                <LeaderboardModal
                    open={isLeaderboardOpen}
                    onClose={handleCloseLeaderboard}
                    classId={selectedLeaderboardClass.id}
                    cls={selectedLeaderboardClass}
                />
            )}
        </Box>
    );
}