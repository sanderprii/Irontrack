import React, {useEffect, useState} from "react";
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import LeaderboardModal from "./LeaderboardModal";
import ProfileModal from "./ProfileModal";
import SendMessageModal from './SendMessageModal';
import SendIcon from '@mui/icons-material/Send';

// ✅ impordi uued API-funktsioonid
import {
    getClassAttendees,
    checkInAttendee,
    deleteAttendee,
} from "../api/classesApi";
import {
    getUserClassScore,
    addClassScore,
    updateClassScore,
    registerForClass,
    cancelRegistration,
    checkUserEnrollment,
    getWaitlist,
    createWaitlist,
    deleteWaitlist,
} from "../api/classesApi";
import {getUserPlansByAffiliate, getUserProfile} from "../api/profileApi";
import {getMemberInfo} from "../api/membersApi";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export default function ClassModal({
                                       open,
                                       onClose,
                                       cls,
                                       onEdit,
                                       onDelete,
                                       refreshClasses,
                                       attendeesCount,
                                       affiliateId,
    affiliateEmail,
                                       props
                                   }) {
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(false);

    // 👉 Registreerimiseks ja waitlistile vajalikud state'id
    const [userPlans, setUserPlans] = useState([]); // Hoiustab kasutaja plaane
    const [selectedPlanId, setSelectedPlanId] = useState(null); // Kasutaja valitud plaani ID

    const [showScoreForm, setShowScoreForm] = useState(false);
    const [scoreType, setScoreType] = useState("rx");  // rx | sc | beg
    const [scoreValue, setScoreValue] = useState("");
    const [hasScore, setHasScore] = useState(false);

    // Aitame tuvastada, kas kasutaja on *juba* registreerunud sellesse klassi
    const [isRegistered, setIsRegistered] = useState(false);

    // Uued waitlisti jaoks vajalikud state'id
    const [isInWaitlist, setIsInWaitlist] = useState(false);
    const [isClassFull, setIsClassFull] = useState(false);
    const [waitlistEntries, setWaitlistEntries] = useState([]);

    const [isSendMessageOpen, setSendMessageOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

    // Kontrollime, kas klass on täis
    useEffect(() => {
        if (cls && typeof attendeesCount !== 'undefined' && typeof cls.memberCapacity !== 'undefined') {
            setIsClassFull(attendeesCount >= cls.memberCapacity);
        }
    }, [cls, attendeesCount, isInWaitlist]);

    // Kui modal avatakse ja meil on olemas klassi ID, toome klassi osalejad
    // ja uurime, kas kasutaja on nende hulgas.
    useEffect(() => {
        if (!cls || !cls.id) return;
        fetchAttendees();
        if (userRole === "regular") {
            checkWaitlistStatus();
        }
        if (userRole === "affiliate" || userRole === "trainer") {
            fetchWaitlistEntries();
        }
    }, [cls, open, userRole]);

    useEffect(() => {
        if (cls && cls.id && userRole === "regular" && open) {
            fetchUserScore(cls.id);
        }
    }, [cls, userRole, open]);

    // Kui kasutaja roll on "regular" ja modal avatakse, toome kasutaja plaanid
    useEffect(() => {
        if (open && userRole === "regular" && cls?.affiliateId) {
            loadUserPlans(cls.affiliateId);
        }
    }, [open, userRole, cls]);

    // Kontrollime, kas kasutaja on juba waitlistis
    async function checkWaitlistStatus() {
        try {
            if (!cls || !cls.id) return;

            const waitlist = await getWaitlist(cls.id);
            const user = await getUserProfile();
            const userId = user.id;

            console.log("Checking waitlist status:", {
                userId,
                waitlist,
                classId: cls.id
            });

            if (waitlist && waitlist.length > 0) {
                // Use explicit type conversion to ensure correct comparison
                const userInWaitlist = waitlist.some(item => {
                    const itemUserId = typeof item.userId === 'string' ? parseInt(item.userId) : item.userId;
                    return itemUserId === userId;
                });

                console.log("User in waitlist:", userInWaitlist);
                setIsInWaitlist(userInWaitlist);
            } else {
                setIsInWaitlist(false);
            }
        } catch (error) {
            console.error("Error checking waitlist status:", error);
            setIsInWaitlist(false);
        }
    }

    // Toome waitlisti sissekanded admini/treeneri vaates
    async function fetchWaitlistEntries() {
        try {
            if (!cls || !cls.id) return;

            const waitlist = await getWaitlist(cls.id);
            setWaitlistEntries(waitlist || []);
        } catch (error) {
            console.error("Error fetching waitlist entries:", error);
            setWaitlistEntries([]);
        }
    }

    // 3) LAEME KASUTAJA SCORE, et teha kindlaks, kas on juba sisestatud
    async function fetchUserScore(classId) {
        try {
            const result = await getUserClassScore(classId);
            // Oletame, et API tagastab { hasScore: true/false, scoreType: "...", score: "..." }
            if (result.hasScore) {
                setHasScore(true);
                setScoreType(result.scoreType || "rx");
                setScoreValue(result.score || "");
            } else {
                setHasScore(false);
                setScoreType("rx");
                setScoreValue("");
            }
        } catch (error) {
            console.error("Error fetching user score:", error);
        }
    }

    // 4) SALVESTA / UUENDA SKOOR
    async function handleSaveScore() {
        try {
            if (!scoreValue || !scoreType) {
                alert("Please fill the score and scoreType!");
                return;
            }

            if (!cls || !cls.id) {
                console.error("No classId found!");
                return;
            }

            // Kas loome uue kirje või uuendame?
            if (hasScore) {
                // Uuenda
                await updateClassScore(cls, scoreType, scoreValue);
            } else {
                // Lisa uus
                await addClassScore(cls, scoreType, scoreValue);
            }

            alert("Score saved successfully!");
            setShowScoreForm(false);
            setHasScore(true);

        } catch (error) {
            console.error("Error saving score:", error);
            alert("Failed to save score");
        }
    }

    async function loadUserPlans(affiliateId) {
        try {
            const plans = await getUserPlansByAffiliate(affiliateId);

            // Filtreeri välja plaanid, mille endDate + 5 päeva on möödas
            const filteredPlans = plans.filter(plan => {
                const planEndDate = new Date(plan.endDate).getTime();
                let expiryTime = 0;
                if (plan.contractId !== null) {
                    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000; // 5 päeva millisekundites
                    expiryTime = planEndDate + fiveDaysInMs;
                } else {
                    expiryTime = planEndDate;
                }
                return new Date(cls.time).getTime() < expiryTime;
            });

            setUserPlans(filteredPlans);

            if (filteredPlans.length > 0) {
                // Kui on vähemalt üks kehtiv plaan, pane esimene vaikimisi valituks
                setSelectedPlanId(filteredPlans[0].id);
            }
        } catch (error) {
            console.error("Error loading user plans:", error);
        }
    }

    async function fetchAttendees() {
        try {
            await checkIfCurrentUserIsRegistered();
            const data = await getClassAttendees(cls.id);
            setAttendees(data || []);

            // Pärast attendees uuendamist kontrolli uuesti waitlist staatust
            if (userRole === "regular") {
                await checkWaitlistStatus();
            }
        } catch (error) {
            console.error("Error fetching attendees:", error);
            setAttendees([]);
        }
    }

    async function checkIfCurrentUserIsRegistered() {
        const response = await checkUserEnrollment(cls.id);
        setIsRegistered(response.enrolled);
    }

    // ✅ Registreerimise funktsioon
    const handleRegister = async () => {
        try {
            if (!cls.freeClass) {
                if (!selectedPlanId) {
                    alert("Please select a plan first!");
                    return;
                }
            }
            await registerForClass(cls.id, selectedPlanId, cls.affiliateId, cls.freeClass);
            // Kui õnnestub, uuendame osalejate nimekirja
            await fetchAttendees();

            // Uuendame peal vaadet, kui vaja (attendeesCount, vms)
            await refreshClasses();
        } catch (error) {
            console.error("Error registering for class:", error);
            alert(error.message || "Registration failed");
        }
    };

    // ✅ Tühista registreerimise funktsioon
    const handleCancelRegistration = async () => {
        try {
            await cancelRegistration(cls.id, cls.freeClass);
            await fetchAttendees();
            if (userRole === "affiliate" || userRole === "trainer") {
                // Refresh waitlist after cancellation to reflect changes
                await fetchWaitlistEntries();
            }
            await refreshClasses();
        } catch (error) {
            console.error("Error canceling registration:", error);
            alert(error.message || "Cancellation failed");
        }
    };

    // ✅ Lisa ootejärjekorda
    const handleAddToWaitlist = async () => {
        try {
            // Require plan selection for paid classes
            if (!cls.freeClass) {
                if (!selectedPlanId) {
                    alert("Please select a plan first!");
                    return;
                }
            }

            await createWaitlist(cls.id, selectedPlanId);

            // Force re-check waitlist status
            await checkWaitlistStatus();

            alert("You have been added to the waitlist!");
        } catch (error) {
            console.error("Error adding to waitlist:", error);
            alert(error.message || "Failed to add to waitlist");
        }
    };

    // ✅ Eemalda ootejärjekorrast
    const handleRemoveFromWaitlist = async () => {
        try {
            await deleteWaitlist(cls.id);

            // Force re-check waitlist status
            await checkWaitlistStatus();

            alert("You have been removed from the waitlist");
        } catch (error) {
            console.error("Error removing from waitlist:", error);
            alert(error.message || "Failed to remove from waitlist");
        }
    };

    const handleCheckIn = async (userId) => {
        try {
            await checkInAttendee(cls.id, userId);
            setAttendees(prev =>
                prev.map(a => (a.userId === userId ? {...a, checkIn: true} : a))
            );
        } catch (error) {
            console.error("Error checking in attendee:", error);
            alert("Failed to check in attendee");
        }
    };

    const handleDelete = async (userId) => {
        try {
            await deleteAttendee(cls.id, cls.freeClass, userId);
            setAttendees(prev => prev.filter(a => a.userId !== userId));
            await refreshClasses();

            // Also check waitlist after deletion - someone might have been auto-registered
            if (userRole === "affiliate" || userRole === "trainer") {
                await fetchWaitlistEntries();
            }
        } catch (error) {
            console.error("Error deleting attendee:", error);
            alert("Failed to delete attendee");
        }
    };

    const handleOpenProfile = async (userId) => {
        try {
            const userData = await getMemberInfo(userId, affiliateId);
            setSelectedUser(userData);
            setProfileOpen(true);
        } catch (error) {
            console.error("❌ Error fetching user profile:", error);
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
                return "green"; // või nt "#999"
        }
    }

    const handleSendMessage = () => {
        setSendMessageOpen(true);
    };

    const isClassOver = new Date(cls.time) < new Date();

    const role = localStorage.getItem("role");

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={window.innerWidth < 600}>
            <DialogTitle
                sx={{textAlign: "center", fontSize: "1.8rem", fontWeight: "bold"}}
            >
                {cls.trainingName}
            </DialogTitle>

            <DialogContent>
                {/* Põhiinfo sektsioon */}
                <Grid container spacing={3} sx={{paddingY: 2}}>
                    {/* Vasak veerg */}
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
                            {isClassFull && !isRegistered && !isInWaitlist && role === 'regular' && (
                                <Typography color="error" sx={{mt: 1, fontWeight: "bold"}}>
                                    This class is full. You can join the waitlist.
                                </Typography>
                            )}
                            {isInWaitlist && role === 'regular' && (
                                <Typography color="primary" sx={{mt: 1, fontWeight: "bold"}}>
                                    You are on the waitlist for this class.
                                </Typography>
                            )}
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

                {/* Register / Cancel / Waitlist sektsioon ainult REGULAR kasutajale */}
                {userRole === "regular" && (
                    <Box mb={2}>
                        {isRegistered ? (
                            // ✅ Kui kasutaja on registreeritud, siis näitame Cancel-nuppu
                            <Button
                                variant="contained"
                                color="error"
                                disabled={isClassOver}
                                onClick={handleCancelRegistration}
                            >
                                Cancel Registration
                            </Button>
                        ) : isInWaitlist ? (
                            // ✅ Kui kasutaja on ootejärjekorras, näitame nuppu ootejärjekorrast eemaldamiseks
                            <Button
                                variant="contained"
                                color="warning"
                                disabled={isClassOver}
                                onClick={handleRemoveFromWaitlist}
                            >
                                Remove from Waitlist
                            </Button>
                        ) : isClassFull ? (
                            // ✅ Kui klass on täis ja kasutaja pole ootejärjekorras
                            <>
                                {cls.freeClass ? (
                                    // For free classes, no plan selection needed
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isClassOver}
                                        onClick={handleAddToWaitlist}
                                    >
                                        Join Waitlist
                                    </Button>
                                ) : userPlans && userPlans.length > 0 ? (
                                    // For paid classes with available plans
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <FormControl sx={{minWidth: 120}}>
                                            <InputLabel id="plan-select-label">Select Plan</InputLabel>
                                            <Select
                                                labelId="plan-select-label"
                                                value={selectedPlanId || ""}
                                                label="Select Plan"
                                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                            >
                                                {userPlans.map((plan) => (
                                                    <MenuItem key={plan.id} value={plan.id}>
                                                        {plan.planName} (Sessions left: {plan.sessionsLeft})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={isClassOver}
                                            onClick={handleAddToWaitlist}
                                        >
                                            Join Waitlist
                                        </Button>
                                    </Box>
                                ) : (
                                    // If no plans available
                                    <Typography color="red">
                                        You have no valid plans.{" "}
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => alert("Go to buy plans page!")}
                                        >
                                            Buy Plans
                                        </Button>
                                    </Typography>
                                )}
                            </>
                        ) : (
                            // ✅ Kui kasutaja EI OLE registreeritud ja klass pole täis
                            <>
                                {userPlans && userPlans.length > 0 && cls.canRegister === true && cls.freeClass === false ? (
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <FormControl sx={{minWidth: 120}}>
                                            <InputLabel id="plan-select-label">Select Plan</InputLabel>
                                            <Select
                                                labelId="plan-select-label"
                                                value={selectedPlanId || ""}
                                                label="Select Plan"
                                                onChange={(e) => setSelectedPlanId(e.target.value)}
                                            >
                                                {userPlans.map((plan) => (
                                                    <MenuItem key={plan.id} value={plan.id}>
                                                        {plan.planName} (Sessions left: {plan.sessionsLeft})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            disabled={isClassOver}
                                            onClick={handleRegister}
                                        >
                                            Register
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        {cls.canRegister === true && cls.freeClass === true ? (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                disabled={isClassOver}
                                                onClick={handleRegister}
                                            >
                                                Register
                                            </Button>
                                        ) : (
                                            // ✅ Kui plaane pole
                                            <Typography color="red">
                                                You have no valid plans.{" "}
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => alert("Go to buy plans page!")}
                                                >
                                                    Buy Plans
                                                </Button>
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                )}

                {/* Osalejate sektsioon */}
                {(userRole === "affiliate" || userRole === "trainer") && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                Attendees
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SendIcon />}
                                onClick={handleSendMessage}
                                disabled={attendees.length === 0}
                            >
                                Send Message
                            </Button>
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
                                                            cursor: "pointer",
                                                            color: "blue",
                                                            "&:hover": {textDecoration: "underline"},
                                                        }}
                                                        onClick={() => handleOpenProfile(attendee.userId)}
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

                                        {/* Nupud (check-in & kustuta) on nähtavad nt treenerile, adminile vms */}
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

                                            <IconButton
                                                onClick={() => handleDelete(attendee.userId)}
                                                sx={{
                                                    border: "2px solid red",
                                                    borderRadius: "8px",
                                                    padding: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <DeleteIcon sx={{color: "red"}}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No attendees</Typography>
                            )}
                        </List>

                        {/* Waitlist Section for admins and trainers */}
                        <Typography variant="h6" sx={{fontWeight: "bold", marginTop: 3, marginBottom: 1}}>
                            Waitlist ({waitlistEntries.length})
                        </Typography>
                        {waitlistEntries.length > 0 ? (
                            <List>
                                {waitlistEntries.map((entry, index) => (
                                    <ListItem
                                        key={entry.id}
                                        sx={{
                                            border: "2px solid #f0f0f0",
                                            borderRadius: "8px",
                                            padding: "12px",
                                            marginBottom: "8px",
                                            backgroundColor: "#f9f9f9"
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: "bold",
                                                            cursor: "pointer",
                                                            color: "blue",
                                                            "&:hover": {textDecoration: "underline"}
                                                        }}
                                                        onClick={() => handleOpenProfile(entry.userId)}
                                                    >
                                                        {entry.user.fullName}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="caption">
                                                        Added to waitlist: {new Date(entry.createdAt).toLocaleString()}
                                                    </Typography>
                                                    <br/>
                                                    <Typography variant="caption">
                                                        Plan: {entry.userPlan?.planName || "Free Class"}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography>No one is on the waitlist</Typography>
                        )}
                    </>
                )}

                {userRole === "regular" && (
                    <Box mb={2}>
                        {!showScoreForm && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setShowScoreForm(true)}
                                sx={{mr: 2}}
                            >
                                {hasScore ? "Edit Score" : "Add Score"}
                            </Button>
                        )}

                        {/* 6) Kui showScoreForm === true -> kuvame sisestusväljad */}
                        {showScoreForm && (
                            <Box
                                sx={{
                                    mb: 2,
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    p: 2,
                                }}
                            >
                                <Typography variant="h6" sx={{mb: 2}}>
                                    {hasScore ? "Edit Your Score" : "Add Your Score"}
                                </Typography>

                                {/* RADIO GROUP scoreType jaoks (rx, sc, beg) */}
                                <RadioGroup
                                    row
                                    value={scoreType}
                                    onChange={(e) => setScoreType(e.target.value)}
                                    sx={{mb: 2}}
                                >
                                    <FormControlLabel value="rx" control={<Radio/>} label="RX"/>
                                    <FormControlLabel value="sc" control={<Radio/>} label="Scaled"/>
                                    <FormControlLabel value="beg" control={<Radio/>} label="Beginner"/>
                                </RadioGroup>

                                {/* Tekstiväli skoori jaoks */}
                                <TextField
                                    label="Your Score"
                                    variant="outlined"
                                    value={scoreValue}
                                    onChange={(e) => setScoreValue(e.target.value)}
                                    fullWidth
                                    sx={{mb: 2}}
                                />

                                {/* SAVE + CANCEL nupud */}
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSaveScore}
                                        sx={{mr: 2}}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => setShowScoreForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{justifyContent: "space-between", padding: "16px"}}>
                <Button onClick={() => setLeaderboardOpen(true)} color="primary" variant="outlined">
                    Leaderboard
                </Button>

                {/* Ainult mitte-regular näevad Edit / Delete */}
                { (userRole === 'affiliate' || userRole === 'trainer') && (
                    <>
                        <Button onClick={() => onEdit(cls)} color="primary" variant="contained">
                            Edit
                        </Button>
                        <Button onClick={() => onDelete(cls.id)} color="error" variant="contained">
                            Delete
                        </Button>
                    </>
                )}

                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>

            <LeaderboardModal
                open={isLeaderboardOpen}
                onClose={() => setLeaderboardOpen(false)}
                classId={cls.id}
            />
            <ProfileModal
                open={isProfileOpen}
                onClose={() => setProfileOpen(false)}
                user={selectedUser}
            />

            <SendMessageModal
                open={isSendMessageOpen}
                onClose={() => setSendMessageOpen(false)}
                affiliate={affiliateId}
                affiliateEmail={affiliateEmail}
                preSelectedUsers={Array.isArray(attendees) ? attendees.map(attendee => ({
                    id: attendee.userId,
                    fullName: attendee.fullName
                })) : []}
            />

        </Dialog>
    );
}