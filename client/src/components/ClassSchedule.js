import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // ⏰ Kellaaeg
import PersonIcon from "@mui/icons-material/Person"; // 👤 Treener
import GroupIcon from "@mui/icons-material/Group"; // 👥 Mahutavus
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // 🏆 Trophy icon for leaderboard
import LeaderboardModal from "./LeaderboardModal"; // Import LeaderboardModal

export default function ClassSchedule({ classes, attendeesCount, onClassClick, weeklyView }) {
    // ✅ Sorteerime klassid ajaliselt (varasemad eespool)
    const sortedClasses = [...classes].sort((a, b) => new Date(a.time) - new Date(b.time));

    // State for Leaderboard modal
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [selectedLeaderboardClass, setSelectedLeaderboardClass] = useState(null);

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

    return (
        <Box sx={{ width: "100%", pb: 10 }}>
            {sortedClasses.length === 0 ? (
                <Typography
                    variant={weeklyView ? "body2" : "h6"}
                    align="center"
                    sx={{ width: "100%", mt: 2 }}
                >
                    No trainings scheduled.
                </Typography>
            ) : (
                sortedClasses.map((cls) => (
                    <Card
                        key={cls.id}
                        sx={{
                            cursor: "pointer",
                            ":hover": { boxShadow: 6 },
                            bgcolor: getBackgroundColor(cls.trainingType),
                            width: "100%",
                            mb: 2, // Lisame väikese vahe iga klassi vahele
                            p: weeklyView ? 1 : 2, // Weekly vaates väiksem padding
                            position: "relative", // For positioning the trophy icon
                        }}
                        onClick={() => onClassClick(cls)}
                    >
                        {/* Trophy icon for WOD classes */}
                        {cls.trainingType === "WOD" && (
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    zIndex: 1,
                                    color: "goldenrod",
                                    backgroundColor: "rgba(255,255,255,0.5)",
                                    '&:hover': {
                                        backgroundColor: "rgba(255,255,255,0.8)",
                                    },
                                    width: 32,
                                    height: 32,
                                }}
                                onClick={(e) => handleOpenLeaderboard(e, cls)}
                                size="small"
                            >
                                <EmojiEventsIcon fontSize="small" />
                            </IconButton>
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
                ))
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