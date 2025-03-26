import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Grid,
    Box,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import LeaderboardModal from "./LeaderboardModal";
// Import API functions
import {
    getClassAttendees,
    checkInAttendee,
} from "../api/classesApi";

export default function CheckInModal({
                                         open,
                                         onClose,
                                         cls,
                                         refreshClasses,
                                         attendeesCount,
                                         affiliateId,
                                     }) {
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

    // Fetch attendees when modal opens and we have a class ID
    useEffect(() => {
        if (!cls || !cls.id) return;
        fetchAttendees();
    }, [cls, open]);

    async function fetchAttendees() {
        try {
            const data = await getClassAttendees(cls.id);
            setAttendees(data || []);
        } catch (error) {
            console.error("Error fetching attendees:", error);
            setAttendees([]);
        }
    }

    const handleCheckIn = async (userId) => {
        try {
            await checkInAttendee(cls.id, userId);
            setAttendees(prev =>
                prev.map(a => (a.userId === userId ? {...a, checkIn: true} : a))
            );
            await refreshClasses();
        } catch (error) {
            console.error("Error checking in attendee:", error);
            alert("Failed to check in attendee");
        }
    };



    if (!cls) return null;

    function getFlagColor(flag) {
        switch (flag) {
            case "red":
                return "#ff0000";
            case "yellow":
                return "gold";
            default:
                return "green";
        }
    }

    const isClassOver = new Date(cls.time) < new Date();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={window.innerWidth < 600}>
            <DialogTitle
                sx={{textAlign: "center", fontSize: "1.8rem", fontWeight: "bold"}}
            >
                {cls.trainingName}
            </DialogTitle>

            <DialogContent>
                {/* Class Info Section */}
                <Grid container spacing={3} sx={{paddingY: 2}}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                backgroundColor: "background.paper",
                                padding: 2,
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{fontWeight: "bold", marginBottom: 1}}
                            >
                                Class Details
                            </Typography>
                            <Typography>
                                <strong>🕒 Time:</strong>{" "}
                                {new Date(cls.time).toLocaleString()}
                            </Typography>
                            <Typography>
                                <strong>🏋️ Trainer:</strong> {cls.trainer || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>📍 Location:</strong> {cls.location || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>👥 Capacity:</strong> {attendeesCount} /{" "}
                                {cls.memberCapacity}
                            </Typography>
                        </Box>
                    </Grid>
                    {cls.trainingType === 'WOD' || cls.trainingType === 'Weightlifting' ? (
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundColor: "#ccc",
                                    padding: 2,
                                    borderRadius: "8px",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{fontWeight: "bold", marginBottom: 1}}
                                >
                                    Workout Info
                                </Typography>
                                <Typography sx={{fontWeight: "bold", color: "text.primary"}}>
                                    <strong>🔥{cls.wodName || "None"}</strong>
                                </Typography>
                                <Typography sx={{color: "secondary.main", mb: 1, fontStyle: "italic"}}>
                                    <strong>{cls.wodType || "None"}</strong>
                                </Typography>
                                <Typography sx={{color: "text.primary", whiteSpace: "pre-line"}}>
                                    <strong></strong>{" "}
                                    {cls.description || "No description available"}
                                </Typography>
                            </Box>
                        </Grid>
                    ) : (
                        ""
                    )}
                </Grid>

                <Divider sx={{marginY: 2}}/>

                {/* Attendees Section */}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Attendees ({attendees.length})
                    </Typography>
                </Box>
                <List>
                    {attendees?.length > 0 ? (
                        attendees.map((attendee) => (
                            <ListItem
                                key={attendee.userId}
                                sx={{
                                    border: "2px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "8px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {/* Full Name */}
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                {attendee.fullName}
                                            </Typography>

                                            {attendee.userNotes?.map((note, index) =>
                                                note.flag ? (
                                                    <FlagIcon
                                                        key={index}
                                                        style={{fill: getFlagColor(note.flag)}}
                                                    />
                                                ) : null
                                            )}
                                        </Box>
                                    }
                                />

                                {/* Check-in button */}
                                <ListItemSecondaryAction
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleCheckIn(attendee.userId)}
                                        disabled={attendee.checkIn}
                                        sx={{
                                            backgroundColor: attendee.checkIn ? "green" : "#ddd",
                                            color: attendee.checkIn ? "white" : "black",
                                            borderRadius: "50%",
                                            "&:hover": {
                                                backgroundColor: attendee.checkIn ? "darkgreen" : "#bbb",
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "green",
                                                color: "white",
                                            },
                                        }}
                                    >
                                        <CheckCircleIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    ) : (
                        <Typography>No attendees</Typography>
                    )}
                </List>
            </DialogContent>

            <DialogActions sx={{justifyContent: "space-between", padding: "16px"}}>
                <Button onClick={() => setLeaderboardOpen(true)} color="primary" variant="outlined">
                    Leaderboard
                </Button>

                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>

            <LeaderboardModal
                open={isLeaderboardOpen}
                onClose={() => setLeaderboardOpen(false)}
                classId={cls.id}
            />
        </Dialog>
    );
}