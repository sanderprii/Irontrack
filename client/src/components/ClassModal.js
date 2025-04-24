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
    DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LeaderboardModal from "./LeaderboardModal";
import ProfileModal from "./ProfileModal";
import SendMessageModal from './SendMessageModal';
import SendIcon from '@mui/icons-material/Send';
import DOMPurify from 'dompurify'; // You'll need to install this package
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddAttendeeModal from "./AddAttendeeModal";

// Import API functions
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
import {getFamilyMembers} from "../api/familyApi"; // Import the family API function

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
                                       trainers = [],
                                       props
                                   }) {
    const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileOpen, setProfileOpen] = useState(false);

    // State for full-screen workout info
    const [isWorkoutInfoFullScreen, setWorkoutInfoFullScreen] = useState(false);

    // Registration and waitlist states
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [compatiblePlans, setCompatiblePlans] = useState([]);
    const [hasAnyPlans, setHasAnyPlans] = useState(false);
    const [hasCompatiblePlans, setHasCompatiblePlans] = useState(false);

    // Family member states
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedBookFor, setSelectedBookFor] = useState("self"); // "self" or familyMember.id
    const [userProfile, setUserProfile] = useState(null);
    const [filteredPlans, setFilteredPlans] = useState([]);

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

    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [waitlistRemoveConfirmOpen, setWaitlistRemoveConfirmOpen] = useState(false);
    const [deleteAttendeeConfirmOpen, setDeleteAttendeeConfirmOpen] = useState(false);
    const [attendeeToDelete, setAttendeeToDelete] = useState(null);
    const [deleteClassConfirmOpen, setDeleteClassConfirmOpen] = useState(false);
    const [isAddAttendeeModalOpen, setAddAttendeeModalOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

    // Toggle workout info full-screen
    const toggleWorkoutInfoFullScreen = () => {
        setWorkoutInfoFullScreen(!isWorkoutInfoFullScreen);
    };

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

    // Load user plans and family members when modal opens
    useEffect(() => {
        if (open && userRole === "regular" && cls?.affiliateId) {
            loadUserData();
        }
    }, [open, userRole, cls]);

    // Update filtered plans when selectedBookFor changes
    useEffect(() => {
        filterCompatiblePlans();
    }, [selectedBookFor, compatiblePlans]);

    // Load user profile and family members
    const loadUserData = async () => {
        try {
            // Load user profile
            const profile = await getUserProfile();
            setUserProfile(profile);

            // Load family members
            const members = await getFamilyMembers();
            setFamilyMembers(members || []);

            // Load user plans
            if (cls?.affiliateId) {
                await loadUserPlans(cls.affiliateId);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    // Filter compatible plans based on selected book-for person
    const filterCompatiblePlans = () => {
        if (!compatiblePlans || compatiblePlans.length === 0) {
            setFilteredPlans([]);
            return;
        }

        // Filter based on the selected family member
        const filtered = compatiblePlans.filter(plan => {
            // If "self" is selected, show plans without a familyMemberId
            if (selectedBookFor === "self") {
                return !plan.familyMemberId;
            }
            // Otherwise show plans for the selected family member
            else {
                return plan.familyMemberId === parseInt(selectedBookFor);
            }
        });

        setFilteredPlans(filtered);
        setHasCompatiblePlans(filtered.length > 0);

        // Set the first filtered plan as default selection if available
        if (filtered.length > 0) {
            setSelectedPlanId(filtered[0].id);
        } else {
            setSelectedPlanId(null);
        }
    };

    // Kontrollime, kas kasutaja on juba waitlistis
    async function checkWaitlistStatus() {
        try {
            if (!cls || !cls.id) return;

            const waitlist = await getWaitlist(cls.id);
            const user = await getUserProfile();
            const userId = user.id;

            if (waitlist && waitlist.length > 0) {
                // Use explicit type conversion to ensure correct comparison
                const userInWaitlist = waitlist.some(item => {
                    const itemUserId = typeof item.userId === 'string' ? parseInt(item.userId) : item.userId;
                    return itemUserId === userId;
                });

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

    // LAEME KASUTAJA SCORE, et teha kindlaks, kas on juba sisestatud
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

    // SALVESTA / UUENDA SKOOR
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

    // Filter plans based on expiration, training type and available sessions
    async function loadUserPlans(affiliateId) {
        try {
            const plans = await getUserPlansByAffiliate(affiliateId);

            // Set whether user has any plans at all
            setHasAnyPlans(plans && plans.length > 0);

            // Filter for expiration first
            const timeValidPlans = plans.filter(plan => {
                const planEndDate = new Date(plan.endDate).getTime();
                let expiryTime = 0;
                if (plan.contractId !== null) {
                    const fiveDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
                    expiryTime = planEndDate + fiveDaysInMs;
                } else {
                    expiryTime = planEndDate;
                }
                return new Date(cls.time).getTime() < expiryTime;
            });

            // Filter out:
            // 1. Plans with paymentHoliday set to true
            // 2. Plans with no sessions left (sessionsLeft === 0)
            const activePlans = timeValidPlans.filter(plan => {
                // Skip plans on payment holiday
                if (plan.paymentHoliday) return false;

                // Skip plans with no sessions left
                if (plan.sessionsLeft === 0) return false;

                // Include all other plans
                return true;
            });

            // Now filter for training type compatibility
            const trainingTypeCompatiblePlans = activePlans.filter(plan => {
                // Special case: If class has training type "Other", all plans are compatible
                if (cls.trainingType === "Other") {
                    return true;
                }

                try {
                    // Parse the trainingType string into an array
                    const trainingTypeArray = JSON.parse(plan.trainingType);

                    // Special case: If plan has "All classes" training type,
                    // it's compatible with any class
                    if (Array.isArray(trainingTypeArray) &&
                        trainingTypeArray.includes("All classes")) {
                        return true;
                    }

                    // Check if the parsed array includes the class training type
                    return Array.isArray(trainingTypeArray) &&
                        trainingTypeArray.includes(cls.trainingType);
                } catch (error) {
                    console.error("Error parsing trainingType:", error);
                    return false;
                }
            });

            // Store compatible plans
            setCompatiblePlans(trainingTypeCompatiblePlans);

            // Initial filtering will happen in the useEffect when selectedBookFor changes
        } catch (error) {
            console.error("Error loading user plans:", error);
            setCompatiblePlans([]);
            setHasAnyPlans(false);
            setHasCompatiblePlans(false);
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

    // Updated: Register with family member support
    const handleRegister = async () => {
        try {
            if (!cls.freeClass) {
                if (!selectedPlanId) {
                    alert("Please select a plan first!");
                    return;
                }

                // Check if selected plan is in filtered plans
                const selectedPlan = filteredPlans.find(plan => plan.id === selectedPlanId);
                if (!selectedPlan) {
                    alert("Please select a valid plan for this class type!");
                    return;
                }
            }

            // Determine if booking for a family member
            const isFamilyMember = selectedBookFor !== "self";
            const familyMemberId = isFamilyMember ? parseInt(selectedBookFor) : null;

            // Call register API with family member details
            await registerForClass(
                cls.id,
                selectedPlanId,
                cls.affiliateId,
                cls.freeClass,
                isFamilyMember,
                familyMemberId
            );

            // Refresh data
            await fetchAttendees();
            await refreshClasses();
        } catch (error) {
            console.error("Error registering for class:", error);
            alert(error.message || "Registration failed");
        }
    };

    // Tühista registreerimise funktsioon
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

    // Updated: Add to waitlist with family member support
    const handleAddToWaitlist = async () => {
        try {
            // Require plan selection for paid classes
            if (!cls.freeClass) {
                if (!selectedPlanId) {
                    alert("Please select a plan first!");
                    return;
                }

                // Verify that selected plan is in filtered plans
                const selectedPlan = filteredPlans.find(plan => plan.id === selectedPlanId);
                if (!selectedPlan) {
                    alert("Selected plan is not compatible with this class type!");
                    return;
                }
            }

            // Determine if booking for a family member
            const isFamilyMember = selectedBookFor !== "self";
            const familyMemberId = isFamilyMember ? parseInt(selectedBookFor) : null;

            // Call waitlist API with family member details
            await createWaitlist(
                cls.id,
                selectedPlanId,
                isFamilyMember,
                familyMemberId
            );

            // Force re-check waitlist status
            await checkWaitlistStatus();

            alert("You have been added to the waitlist!");
        } catch (error) {
            console.error("Error adding to waitlist:", error);
            alert(error.message || "Failed to add to waitlist");
        }
    };

    // Eemalda ootejärjekorrast
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

            await fetchAttendees();

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

    const handleOpenCancelConfirm = () => {
        setCancelConfirmOpen(true);
    };

    const handleCloseCancelConfirm = () => {
        setCancelConfirmOpen(false);
    };

    const handleOpenWaitlistRemoveConfirm = () => {
        setWaitlistRemoveConfirmOpen(true);
    };

    const handleCloseWaitlistRemoveConfirm = () => {
        setWaitlistRemoveConfirmOpen(false);
    };

    const handleOpenDeleteAttendeeConfirm = (userId) => {
        setAttendeeToDelete(userId);
        setDeleteAttendeeConfirmOpen(true);
    };

    const handleCloseDeleteAttendeeConfirm = () => {
        setDeleteAttendeeConfirmOpen(false);
        setAttendeeToDelete(null);
    };

    const handleOpenDeleteClassConfirm = () => {
        setDeleteClassConfirmOpen(true);
    };

    const handleCloseDeleteClassConfirm = () => {
        setDeleteClassConfirmOpen(false);
    };

    // Handle change of "Book For" selection
    const handleBookForChange = (event) => {
        setSelectedBookFor(event.target.value);
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

    // Add 1 hour buffer - class is considered "over" for registration purposes 1 hour before start
    const isClassOver = () => {
        const classTime = new Date(cls.time);
        const currentTime = new Date();

        // Add 1 hour buffer
        const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds

        // Class is "over" if it's less than 1 hour until class starts or already started
        return classTime.getTime() - currentTime.getTime() < oneHourInMs;
    };

    // Component for workout info in full-screen mode optimized for TV displays
    const WorkoutInfoFullScreen = () => (
        <Dialog
            open={isWorkoutInfoFullScreen}
            onClose={toggleWorkoutInfoFullScreen}
            maxWidth="xl"
            fullWidth
            fullScreen
        >
            <DialogContent
                sx={{
                    position: "relative",
                    backgroundColor: "#121212",
                    color: "white",
                    p: 0,
                    pt: 3,
                    m: 0,
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {/* Small close button */}
                <IconButton
                    onClick={toggleWorkoutInfoFullScreen}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "white",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        width: 36,
                        height: 36,
                        zIndex: 2000,
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.3)",
                        }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>

                {/* Time and trainer info at the top */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        py: 1,
                        px: 2,
                        mr: 4,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            color: "#aaa"
                        }}
                    >
                        <strong>🕒 {new Date(cls.time).toLocaleString()}</strong>
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                            color: "#aaa"
                        }}
                    >
                        <strong>🏋️ {cls.trainer || "N/A"}</strong>
                    </Typography>
                </Box>

                {/* Secondary info (WOD name and type) */}
                <Box sx={{ px: 3, pt: 2 }}>
                    {cls.wodName && (
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "#ff9800",
                                mb: 1,
                                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                                lineHeight: 1.2
                            }}
                        >
                            🔥 {cls.wodName}
                        </Typography>
                    )}

                    {cls.wodType && cls.trainingType === "WOD" && (
                        <Typography
                            sx={{
                                color: "#64b5f6",
                                mb: 2,
                                fontStyle: "italic",
                                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.6rem" },
                                fontWeight: "500",
                            }}
                        >
                            {cls.wodType}
                        </Typography>
                    )}
                </Box>

                {/* Description centered on the page - UPDATED to render HTML */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        px: 3,
                        overflow: "auto"
                    }}
                >
                    {cls.description && (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(cls.description, {
                                    ALLOWED_TAGS: ['b', 'i', 'span'],
                                    ALLOWED_ATTR: ['style'],
                                })
                            }}
                            style={{
                                color: "white",
                                whiteSpace: "pre-line",
                                fontSize: "2.8rem",
                                lineHeight: 1.6,
                                fontWeight: "500",
                                letterSpacing: "0.02em",
                                wordBreak: "break-word",
                                maxWidth: "100%"
                            }}
                        />
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );

    const handleOpenAddAttendeeModal = () => {
        setAddAttendeeModalOpen(true);
    };

    const handleCloseAddAttendeeModal = () => {
        setAddAttendeeModalOpen(false);
    };

    const handleAttendeeAdded = () => {
        // Refresh the attendees list
        refreshClasses();
    };

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
                            <Typography>
                                <strong>🏃 Training Type:</strong> {cls.trainingType || "N/A"}
                            </Typography>
                            {isClassFull && !isRegistered && !isInWaitlist && userRole === 'regular' && (
                                <Typography color="error" sx={{mt: 1, fontWeight: "bold"}}>
                                    This class is full. You can join the waitlist.
                                </Typography>
                            )}
                            {isInWaitlist && userRole === 'regular' && (
                                <Typography color="primary" sx={{mt: 1, fontWeight: "bold"}}>
                                    You are on the waitlist for this class.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    { cls.wodName || cls.wodType || cls.description ? (
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundColor: "#ccc",
                                    padding: 2,
                                    borderRadius: "8px",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "#bbb",
                                    }
                                }}
                                onClick={toggleWorkoutInfoFullScreen}
                            >
                                <Box sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    borderRadius: "50%",
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <FullscreenIcon fontSize="small" />
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{fontWeight: "bold", marginBottom: 1}}
                                >
                                    Workout Info
                                </Typography>
                                { cls.wodName && (
                                    <Typography sx={{fontWeight: "bold", color: "text.primary"}}>
                                        <strong>🔥{cls.wodName}</strong>
                                    </Typography>
                                )}
                                { cls.wodType  && (
                                    <Typography sx={{color: "secondary.main", mb: 1, fontStyle: "italic"}}>
                                        <strong>{cls.wodType}</strong>
                                    </Typography>
                                )}
                                { cls.description && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(cls.description, {
                                                ALLOWED_TAGS: ['b', 'i', 'span'],
                                                ALLOWED_ATTR: ['style'],
                                            })
                                        }}
                                        style={{
                                            color: "text.primary",
                                            whiteSpace: "pre-line"
                                        }}
                                    />
                                )}
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
                            // CHANGED: Use confirmation dialog
                            <Button
                                variant="contained"
                                color="error"
                                disabled={isClassOver()}
                                onClick={handleOpenCancelConfirm}
                            >
                                Cancel Registration
                            </Button>
                        ) : isInWaitlist ? (
                            // CHANGED: Use confirmation dialog
                            <Button
                                variant="contained"
                                color="warning"
                                disabled={isClassOver()}
                                onClick={handleOpenWaitlistRemoveConfirm}
                            >
                                Remove from Waitlist
                            </Button>
                        ) : isClassFull ? (
                            // If class is full and user is not waitlisted
                            <>
                                {cls.freeClass ? (
                                    // For free classes, no plan selection needed
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isClassOver()}
                                        onClick={handleAddToWaitlist}
                                    >
                                        Join Waitlist
                                    </Button>
                                ) : (
                                    // Show "Book For" select and plan selection for waitlist
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        {/* Book For selection - only shown if family members exist */}
                                        {familyMembers.length > 0 && (
                                            <FormControl sx={{ minWidth: 200 }}>
                                                <InputLabel id="book-for-select-label">Book For</InputLabel>
                                                <Select
                                                    labelId="book-for-select-label"
                                                    value={selectedBookFor}
                                                    label="Book For"
                                                    onChange={handleBookForChange}
                                                >
                                                    <MenuItem value="self">{userProfile?.fullName || "Yourself"}</MenuItem>
                                                    {familyMembers.map((member) => (
                                                        <MenuItem key={member.id} value={member.id.toString()}>
                                                            {member.fullName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}

                                        {hasCompatiblePlans ? (
                                            // Only show compatible plans for the waitlist
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FormControl sx={{minWidth: 200}}>
                                                    <InputLabel id="plan-select-label">Select Plan</InputLabel>
                                                    <Select
                                                        labelId="plan-select-label"
                                                        value={selectedPlanId || ""}
                                                        label="Select Plan"
                                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                                    >
                                                        {filteredPlans.map((plan) => (
                                                            <MenuItem key={plan.id} value={plan.id}>
                                                                {plan.planName} (Sessions left: {plan.sessionsLeft})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={isClassOver()}
                                                    onClick={handleAddToWaitlist}
                                                >
                                                    Join Waitlist
                                                </Button>
                                            </Box>
                                        ) : hasAnyPlans ? (
                                            // Show message for plans that don't match training type
                                            <Typography color="error">
                                                No compatible plans found for {selectedBookFor === "self" ? "yourself" : "this family member"}.
                                            </Typography>
                                        ) : (
                                            // If no plans available at all
                                            <Typography color="error">
                                                You have no valid plans.
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>
                        ) : (
                            // For registration with compatible plans check
                            <>
                                {cls.freeClass ? (
                                    // Free classes don't need plan selection
                                    <Button
                                        variant="contained"
                                        color="success"
                                        disabled={isClassOver()}
                                        onClick={handleRegister}
                                    >
                                        Register
                                    </Button>
                                ) : (
                                    // Show "Book For" select and plan selection for registration
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        {/* Book For selection - only shown if family members exist */}
                                        {familyMembers.length > 0 && (
                                            <FormControl sx={{ minWidth: 200 }}>
                                                <InputLabel id="book-for-select-label">Book For</InputLabel>
                                                <Select
                                                    labelId="book-for-select-label"
                                                    value={selectedBookFor}
                                                    label="Book For"
                                                    onChange={handleBookForChange}
                                                >
                                                    <MenuItem value="self">{userProfile?.fullName || "Yourself"}</MenuItem>
                                                    {familyMembers.map((member) => (
                                                        <MenuItem key={member.id} value={member.id.toString()}>
                                                            {member.fullName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}

                                        {hasCompatiblePlans ? (
                                            // Show only compatible plans in dropdown
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FormControl sx={{minWidth: 200}}>
                                                    <InputLabel id="plan-select-label">Select Plan</InputLabel>
                                                    <Select
                                                        labelId="plan-select-label"
                                                        value={selectedPlanId || ""}
                                                        label="Select Plan"
                                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                                    >
                                                        {filteredPlans.map((plan) => (
                                                            <MenuItem key={plan.id} value={plan.id}>
                                                                {plan.planName} (Sessions left: {plan.sessionsLeft})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled={isClassOver()}
                                                    onClick={handleRegister}
                                                >
                                                    Register
                                                </Button>
                                            </Box>
                                        ) : hasAnyPlans ? (
                                            // User has plans but none are compatible with this class type
                                            <Typography color="error">
                                                No compatible plans found for {selectedBookFor === "self" ? "yourself" : "this family member"}.
                                            </Typography>
                                        ) : (
                                            // User has no plans at all
                                            <Typography color="error">
                                                You have no valid plans.
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                )}

                {/* Osalejate sektsioon */}
                {(userRole === "affiliate" || userRole === "trainer") && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={1}>
                            {(userRole === "affiliate" || userRole === "trainer") && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenAddAttendeeModal}
                                    startIcon={<PersonAddIcon />}
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    Add Attendee
                                </Button>
                            )}
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
                                            // Show family member indicator if it's a family member registration
                                            secondary={attendee.isFamilyMember ? "Family Member" : null}
                                        />

                                        {/* Nupud (check-in & kustuta) */}
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

                                            {/* CHANGED: Use confirmation dialog for delete */}
                                            <IconButton
                                                onClick={() => handleOpenDeleteAttendeeConfirm(attendee.userId)}
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
                                                    {entry.familyMember && (
                                                        <>
                                                            <br/>
                                                            <Typography variant="caption">
                                                                Family Member Registration
                                                            </Typography>
                                                        </>
                                                    )}
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

                        {/* Score form */}
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

                                {/* RADIO GROUP scoreType */}
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

                                <Typography variant="caption">
                                    Reps/Time/Weight. For example: 147, 5:30, 50.
                                </Typography>

                                {/* Score field */}
                                <TextField
                                    label="Your Score"
                                    variant="outlined"
                                    value={scoreValue}
                                    onChange={(e) => setScoreValue(e.target.value)}
                                    fullWidth
                                    sx={{mb: 2}}
                                />

                                {/* SAVE + CANCEL buttons */}
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

                {/* CHANGED: Use confirmation dialog for class deletion */}
                {(userRole === 'affiliate' || userRole === 'trainer') && (
                    <>
                        <Button onClick={() => onEdit(cls)} color="primary" variant="contained">
                            Edit
                        </Button>
                        <Button onClick={handleOpenDeleteClassConfirm} color="error" variant="contained">
                            Delete
                        </Button>
                    </>
                )}

                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>

            {/* Full-screen workout info component */}
            {isWorkoutInfoFullScreen && <WorkoutInfoFullScreen />}

            <LeaderboardModal
                open={isLeaderboardOpen}
                onClose={() => setLeaderboardOpen(false)}
                classId={cls.id}
                cls={cls}
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

            <AddAttendeeModal
                open={isAddAttendeeModalOpen}
                onClose={handleCloseAddAttendeeModal}
                classId={cls?.id}
                affiliateId={affiliateId}
                onSuccess={handleAttendeeAdded}
            />

            {/* Cancel Registration Confirmation Dialog */}
            <Dialog
                open={cancelConfirmOpen}
                onClose={handleCloseCancelConfirm}
            >
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel your registration for this class? You may lose your spot if the class is in high demand.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelConfirm} color="primary">
                        No, Keep My Spot
                    </Button>
                    <Button onClick={() => {
                        handleCancelRegistration();
                        handleCloseCancelConfirm();
                    }} color="error">
                        Yes, Cancel Registration
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Remove from Waitlist Confirmation Dialog */}
            <Dialog
                open={waitlistRemoveConfirmOpen}
                onClose={handleCloseWaitlistRemoveConfirm}
            >
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove yourself from the waitlist? You'll lose your current position if you decide to join again later.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWaitlistRemoveConfirm} color="primary">
                        No, Stay on Waitlist
                    </Button>
                    <Button onClick={() => {
                        handleRemoveFromWaitlist();
                        handleCloseWaitlistRemoveConfirm();
                    }} color="warning">
                        Yes, Remove Me
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Attendee Confirmation Dialog */}
            <Dialog
                open={deleteAttendeeConfirmOpen}
                onClose={handleCloseDeleteAttendeeConfirm}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this attendee from the class? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteAttendeeConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        handleDelete(attendeeToDelete);
                        handleCloseDeleteAttendeeConfirm();
                    }} color="error">
                        Remove Attendee
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Class Confirmation Dialog */}
            <Dialog
                open={deleteClassConfirmOpen}
                onClose={handleCloseDeleteClassConfirm}
            >
                <DialogTitle>Confirm Class Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this class? This will remove all registrations and cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteClassConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        onDelete(cls.id);
                        handleCloseDeleteClassConfirm();
                    }} color="error">
                        Delete Class
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}