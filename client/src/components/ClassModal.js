import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from "react-router-dom";
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
import CakeIcon from "@mui/icons-material/Cake";
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
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // 🏆 Trophy icon for leaderboard
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AffiliateTermsModal from './affiliateTermsModal';
import {acceptAffiliateTerms, isUserAcceptedAffiliateTerms} from '../api/affiliateApi';

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
    addClassToMyTrainings
} from "../api/classesApi";
import {getUserPlansByAffiliate, getUserProfile} from "../api/profileApi";
import {getMemberInfo} from "../api/membersApi";
import {getFamilyMembers} from "../api/familyApi";
import * as PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress"; // Import the family API function


export default function ClassModal({
                                       open,
                                       onClose,
                                       cls,
                                       onEdit,
                                       onDelete,
                                       refreshClasses,
                                       affiliateId,
                                       affiliateEmail,
                                       trainers = [],
                                       props
                                   }) {
    const navigate = useNavigate();
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
const [ isFirstTraining, setIsFirstTraining] = useState(false);
    // Uued waitlisti jaoks vajalikud state'id
    const [isInWaitlist, setIsInWaitlist] = useState(false);
    const [isClassFull, setIsClassFull] = useState(false);
    const [waitlistEntries, setWaitlistEntries] = useState([]);

    const [isSendMessageOpen, setSendMessageOpen] = useState(false);
    const [showCompetitionInfo, setShowCompetitionInfo] = useState(false);

    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
    const [waitlistRemoveConfirmOpen, setWaitlistRemoveConfirmOpen] = useState(false);
    const [deleteAttendeeConfirmOpen, setDeleteAttendeeConfirmOpen] = useState(false);
    const [attendeeToDelete, setAttendeeToDelete] = useState(null);
    const [deleteClassConfirmOpen, setDeleteClassConfirmOpen] = useState(false);
    const [isAddAttendeeModalOpen, setAddAttendeeModalOpen] = useState(false);

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success");

    const profileFetchedRef = useRef(false);

    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
    const [termsCheck, setTermsCheck] = useState(false);

    // Asenda mitu getUserProfile kutset ühe konsolideeritud useEffect-iga
    useEffect(() => {
        // Kui modal on avatud ja kasutaja on "regular"
        if (open && userRole === "regular" && !profileFetchedRef.current) {
            const fetchUserData = async () => {
                try {
                    // Märgi, et profiil on laaditud
                    profileFetchedRef.current = true;

                    // Lae profiil ainult üks kord
                    const profile = await getUserProfile();
                    setUserProfile(profile);

                    // Tee kõik vajalikud toimingud profilega
                    if (cls?.affiliateId) {
                        // Lae pereliikmed
                        const members = await getFamilyMembers();
                        setFamilyMembers(members || []);

                        // Lae kasutaja plaanid
                        await loadUserPlans(cls.affiliateId);
                    }

                    // Kontrolli ootejärjekorra staatust
                    if (cls?.id) {
                        // Kasuta profiili andmeid ootejärjekorras
                        const waitlist = await getWaitlist(cls.id);
                        const userId = profile.id;

                        if (waitlist && waitlist.length > 0) {
                            const userInWaitlist = waitlist.some(item => {
                                const itemUserId = typeof item.userId === 'string' ? parseInt(item.userId) : item.userId;
                                return itemUserId === userId;
                            });

                            setIsInWaitlist(userInWaitlist);
                        } else {
                            setIsInWaitlist(false);
                        }
                    }
                } catch (error) {
                    console.error("Error loading user data:", error);
                }
            };

            fetchUserData();
        }

        // Lähtesta ref kui modal suletakse
        if (!open) {
            profileFetchedRef.current = false;
        }
    }, [open, userRole, cls]);


    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

    // Toggle workout info full-screen
    const toggleWorkoutInfoFullScreen = () => {
        setWorkoutInfoFullScreen(!isWorkoutInfoFullScreen);
    };

    const checkTermsAcceptance = async () => {
        try {

            const accepted = await isUserAcceptedAffiliateTerms(cls.affiliateId);
            setTermsAccepted(accepted);
        } catch (error) {
            console.error("Error checking terms acceptance:", error);
            setTermsAccepted(false);
        } finally {

        }
    };

    // Kontrolli tingimuste staatust kui modal avatakse ja kasutaja on 'regular'
    useEffect(() => {
        if (open && userRole === "regular") {
            checkTermsAcceptance();
        }
    }, [open, userRole, userProfile]);

    // Kontrollime, kas klass on täis
    useEffect(() => {


        if (cls && typeof cls.enrolledCount !== 'undefined' && typeof cls.memberCapacity !== 'undefined') {
            setIsClassFull(cls.enrolledCount >= cls.memberCapacity);
        }

    }, [cls, isInWaitlist]);

    useEffect(() => {
        // Kui modal suletakse (open muutub false'iks), lähtesta showScoreForm
        if (!open) {
            setShowScoreForm(false);
        }
    }, [open]);

    // Kui modal avatakse ja meil on olemas klassi ID, toome klassi osalejad
    // ja uurime, kas kasutaja on nende hulgas.
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            if (!cls || !cls.id) return;
            fetchAttendees();

            if (userRole === "affiliate" || userRole === "trainer") {
                fetchWaitlistEntries();
            }
        }
    }, [cls, open, userRole]);

    useEffect(() => {
        if (cls && cls.id && userRole === "regular" && open) {
            fetchUserScore(cls.id);
        }
    }, [cls, userRole, open]);


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

    const toggleCompetitionInfo = (e) => {
        e.stopPropagation(); // Prevent click from triggering the fullscreen toggle
        setShowCompetitionInfo(!showCompetitionInfo);
    };

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
                showNotification("Please fill the score and scoreType!", "info");
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

            showNotification("Score saved successfully!", "success");
            setShowScoreForm(false);
            setHasScore(true);

        } catch (error) {
            console.error("Error saving score:", error);
            showNotification("Failed to save score", "error");
        }
    }

    const showNotification = (message, type = "info") => {
        setNotificationMessage(message);
        setNotificationType(type);
        setNotificationOpen(true);
    };

    const handleBuyPlans = () => {
        navigate("/register-training", {
            state: {
                affiliateId: cls.affiliateId,
                openPlans: true
            }
        });
    };

    // Filter plans based on expiration, training type and available sessions
    async function loadUserPlans(affiliateId) {
        try {
            const plans = await getUserPlansByAffiliate(affiliateId);

            // Set whether user has any plans at all
            setHasAnyPlans(plans && plans.length > 0);

            // Filter for expiration first
            const timeValidPlans = plans.filter(plan => {
                const planEndDate = new Date(plan.endDate).getTime();
                const classTime = new Date(cls.time).getTime();
                const purchaseTime = new Date(plan.purchasedAt).getTime();

                // Check if class time is after purchase time
                if (classTime < purchaseTime) {
                    return false; // Class is before the plan was purchased
                }

                let expiryTime = 0;
                if (plan.contractId !== null && plan.contractId > 0) { // Check that contractId > 0
                    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
                    expiryTime = planEndDate + sevenDaysInMs;
                } else {
                    expiryTime = planEndDate;
                }

                return classTime < expiryTime;
            });

            // Filter out:
            // 1. Plans with paymentHoliday set to true
            // 2. Plans with no sessions left (sessionsLeft === 0)
            const activePlans = timeValidPlans.filter(plan => {
                // Skip plans on payment holiday


                // Skip plans with no sessions left
                if (plan.sessionsLeft === 0) return false;

                // Include all other plans
                return true;
            });

            // [ülejäänud kood jääb samaks]
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

    async function handleAddClassToMyTrainings() {
        try {
            if (!cls || !cls.id) return;
            if (showCompetitionInfo) {
                const addCompetition = true

                await addClassToMyTrainings(cls.id, addCompetition);
            } else {
                const addCompetition = false
                await addClassToMyTrainings(cls.id, addCompetition);
            }

            showNotification("Class added to your trainings!", "success");
        } catch (error) {
            console.error("Error adding class to my trainings:", error);
            showNotification("Failed to add class to my trainings", "error");
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
        setIsFirstTraining(response.firstTraining);
    }

    const isClassTimePassed = () => {
        const classTime = new Date(cls.time);
        const currentTime = new Date();

        // Return true if current time is past the class time
        return currentTime > classTime;
    };

    const handleRegister = async () => {
        try {

            const isFreeOrFirstTraining = cls.freeClass || isFirstTraining;

            if (!isFreeOrFirstTraining) {
                if (!selectedPlanId) {
                    showNotification("Please select a plan first!", "info");
                    return;
                }

                // Check if selected plan is in filtered plans
                const selectedPlan = filteredPlans.find(plan => plan.id === selectedPlanId);
                if (!selectedPlan) {
                    showNotification("Please select a valid plan for this class type!", "info");
                    return;
                }
            }

            // Handle terms acceptance at registration time
            if (termsCheck && !termsAccepted) {
                setIsAcceptingTerms(true);
                try {
                    await acceptAffiliateTerms({
                        affiliateId: cls.affiliateId
                    });
                    setTermsAccepted(true);
                } catch (error) {
                    console.error("Failed to accept terms:", error);
                    showNotification("Failed to accept terms", "error");
                    setIsAcceptingTerms(false);
                    return;
                }
                setIsAcceptingTerms(false);
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
            showNotification(error.message || "Registration failed", "error");
        }
    };

    console.log("isFirstTraining", isFirstTraining);

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
            showNotification(error.message || "Cancellation failed", "error");
        }
    };

    // Updated: Add to waitlist with family member support
    const handleAddToWaitlist = async () => {
        try {
            // Require plan selection for paid classes
            if (!cls.freeClass) {
                if (!selectedPlanId) {
                    showNotification("Please select a plan first!", "info");
                    return;
                }

                // Verify that selected plan is in filtered plans
                const selectedPlan = filteredPlans.find(plan => plan.id === selectedPlanId);
                if (!selectedPlan) {
                    showNotification("Selected plan is not compatible with this class type!", "info");
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

            showNotification("You have been added to the waitlist!", "success");
        } catch (error) {
            console.error("Error adding to waitlist:", error);
            showNotification(error.message || "Failed to add to waitlist", "error");
        }
    };

    // Eemalda ootejärjekorrast
    const handleRemoveFromWaitlist = async () => {
        try {
            await deleteWaitlist(cls.id);

            // Force re-check waitlist status
            await checkWaitlistStatus();

            showNotification("You have been removed from the waitlist", "success");
        } catch (error) {
            console.error("Error removing from waitlist:", error);
            showNotification(error.message || "Failed to remove from waitlist", "error");
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
            showNotification("Failed to check in attendee", "error");
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
            showNotification("Failed to delete attendee", "error");
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

    const handleOpenTerms = () => {
        setTermsModalOpen(true);
    };

    const handleCloseTerms = () => {
        setTermsModalOpen(false);
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
                    <CloseIcon sx={{fontSize: 20}}/>
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
                            fontSize: {xs: "1rem", sm: "1.2rem"},
                            color: "#aaa"
                        }}
                    >
                        <strong>🕒 {new Date(cls.time).toLocaleString('et-EE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</strong>
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: {xs: "1rem", sm: "1.2rem"},
                            color: "#aaa"
                        }}
                    >
                        <strong>🏋️ {cls.trainer || "N/A"}</strong>
                    </Typography>
                </Box>

                {/* Secondary info (WOD name and type) */}
                <Box sx={{px: 3, pt: 2}}>
                    {cls.wodName && (
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "#ff9800",
                                mb: 1,
                                fontSize: {xs: "1.5rem", sm: "1.8rem", md: "2rem"},
                                lineHeight: 1.2
                            }}
                        >
                            🔥 {cls.wodName}
                        </Typography>
                    )}

                    {cls.wodType && cls.trainingType === "WOD" && cls.wodType !== "NONE" && (
                        <Typography
                            sx={{
                                color: "#64b5f6",
                                mb: 2,
                                fontStyle: "italic",
                                fontSize: {xs: "1.2rem", sm: "1.4rem", md: "1.6rem"},
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

            <DialogContent sx={{p: 1}}>
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
                                {new Date(cls.time).toLocaleString('et-EE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                            <Typography>
                                <strong>🏋️ Trainer:</strong> {cls.trainer || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>📍 Location:</strong> {cls.location || "N/A"}
                            </Typography>
                            <Typography>
                                <strong>👥 Capacity:</strong> {cls.enrolledCount} /{" "}
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

                    {cls.wodName || cls.wodType || cls.description ? (
                        <Grid item xs={12} md={6} sx={{display: {xs: 'none', sm: 'block'}}}>
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
                                    <FullscreenIcon fontSize="small"/>
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{fontWeight: "bold", marginBottom: 1}}
                                >
                                    Workout Info
                                </Typography>
                                {cls.wodName && (
                                    <Typography sx={{fontWeight: "bold", color: "text.primary"}}>
                                        <strong>🔥{cls.wodName}</strong>
                                    </Typography>
                                )}
                                {cls.wodType && cls.wodType !== "NONE" && (
                                    <Typography sx={{color: "secondary.main", mb: 1, fontStyle: "italic"}}>
                                        <strong>{cls.wodType}</strong>
                                    </Typography>
                                )}
                                {cls.description && (

                                    <>
                                        <Box sx={{pb: 2}}>
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
                                        </Box>
                                        {/* Competition info section (conditionally rendered) */}
                                        {showCompetitionInfo && cls.competitionInfo && (
                                            <Box sx={{
                                                mt: 2,
                                                pt: 2,
                                                pb: 2,
                                                borderTop: '1px dashed #aaa',
                                                color: 'text.primary'
                                            }}>
                                                <Typography sx={{fontWeight: "bold", mb: 1, color: "#ff9800"}}>
                                                    Competition Extra:
                                                </Typography>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(cls.competitionInfo, {
                                                            ALLOWED_TAGS: ['b', 'i', 'span'],
                                                            ALLOWED_ATTR: ['style'],
                                                        })
                                                    }}
                                                    style={{
                                                        whiteSpace: "pre-line"
                                                    }}
                                                />
                                            </Box>
                                        )}

                                        {/* Competition button (only shown if competitionInfo exists) */}
                                        {cls.competitionInfo && (
                                            <Button
                                                onClick={toggleCompetitionInfo}
                                                endIcon={showCompetitionInfo ? <KeyboardArrowUpIcon/> :
                                                    <KeyboardArrowDownIcon/>}
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    bottom: -18,
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    backgroundColor: '#f0f0f0',
                                                    color: '#666',
                                                    fontSize: '0.75rem',
                                                    padding: '2px 8px',
                                                    minWidth: 'auto',
                                                    '&:hover': {
                                                        backgroundColor: '#e0e0e0',
                                                    }
                                                }}
                                            >
                                                Competition
                                            </Button>
                                        )}

                                        {/* Add to trainings button (existing code) */}
                                        {userRole === "regular" && (
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Peata sündmuse levimine üles vanemnoodini
                                                    handleAddClassToMyTrainings();
                                                }}
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 8,
                                                    right: 8,
                                                    border: '1px solid',
                                                    borderColor: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                    }
                                                }}
                                            >
                                                <AddIcon/>
                                            </IconButton>
                                        )}
                                    </>
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
                            <Button
                                variant="contained"
                                color="error"
                                disabled={isClassOver()}
                                onClick={handleOpenCancelConfirm}
                                sx={{width: {xs: "100%", sm: "auto"}}}
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
                                sx={{width: {xs: "100%", sm: "auto"}}}
                            >
                                Remove from Waitlist
                            </Button>
                        ) : isClassFull ? (
                            // If class is full and user is not waitlisted
                            <>
                                {cls.freeClass || isFirstTraining ? (
                                    // For free classes, no plan selection needed
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isClassTimePassed()}
                                        onClick={handleAddToWaitlist}
                                    >
                                        Join Waitlist
                                    </Button>
                                ) : (
                                    // Show "Book For" select and plan selection for waitlist
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>


                                        {/* Book For selection - only shown if family members exist */}
                                        {familyMembers.length > 0 && (
                                            <FormControl sx={{minWidth: 200}}>
                                                <InputLabel id="book-for-select-label">Book For</InputLabel>
                                                <Select
                                                    labelId="book-for-select-label"
                                                    value={selectedBookFor}
                                                    label="Book For"
                                                    onChange={handleBookForChange}
                                                >
                                                    <MenuItem
                                                        value="self">{userProfile?.fullName || "Yourself"}</MenuItem>
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
                                                    disabled={isClassTimePassed()}
                                                    onClick={handleAddToWaitlist}
                                                >
                                                    Join Waitlist
                                                </Button>
                                            </Box>
                                        ) : hasAnyPlans ? (
                                            // Show message for plans that don't match training type
                                            <Typography color="error">
                                                No compatible plans found
                                                for {selectedBookFor === "self" ? "yourself" : "this family member"}.
                                            </Typography>
                                        ) : (
                                            // If no plans available at all
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>

                                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                    <Typography color="error">
                                                        You have no valid plans.
                                                    </Typography>
                                                    {!isClassTimePassed() && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={handleBuyPlans}
                                                            sx={{width: {xs: "100%", sm: "auto"}}}
                                                        >
                                                            Buy Plans
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </>
                        ) : (
                            // For registration with compatible plans check
                            <>

                                {userRole === "regular" && !isRegistered && !isInWaitlist && (
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        {!termsAccepted && (
                                            // Kui kasutaja pole veel nõustunud, näita checkboxi
                                            <Box>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={termsCheck}
                                                            onChange={(e) => setTermsCheck(e.target.checked)}
                                                            disabled={isAcceptingTerms}
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2">
                                                            I have read and agree to the {' '}
                                                            <Link
                                                                component="button"
                                                                variant="body2"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleOpenTerms();
                                                                }}
                                                            >
                                                                Terms and Conditions
                                                            </Link>
                                                        </Typography>
                                                    }
                                                />
                                                {isAcceptingTerms && (
                                                    <CircularProgress size={20} sx={{ ml: 2 }} />
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                )}


                                {cls.freeClass || isFirstTraining? (
                                    // Free classes don't need plan selection
                                    <Button
                                        variant="contained"
                                        color="success"
                                        disabled={isClassTimePassed() || (!termsCheck && !termsAccepted)}
                                        onClick={handleRegister}
                                    >
                                        Register
                                    </Button>
                                ) : (
                                    // Show "Book For" select and plan selection for registration
                                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                        {/* Book For selection - only shown if family members exist */}
                                        {familyMembers.length > 0 && (
                                            <FormControl sx={{minWidth: 200}}>
                                                <InputLabel id="book-for-select-label">Book For</InputLabel>
                                                <Select
                                                    labelId="book-for-select-label"
                                                    value={selectedBookFor}
                                                    label="Book For"
                                                    onChange={handleBookForChange}
                                                >
                                                    <MenuItem
                                                        value="self">{userProfile?.fullName || "Yourself"}</MenuItem>
                                                    {familyMembers.map((member) => (
                                                        <MenuItem key={member.id} value={member.id.toString()}>
                                                            {member.fullName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}

                                        {hasCompatiblePlans ? (
                                            // Change from horizontal to vertical layout on mobile
                                            <Box
                                                sx={{
                                                    display: {xs: "flex", sm: "flex"},
                                                    flexDirection: {xs: "column", sm: "row"},
                                                    alignItems: {xs: "stretch", sm: "center"},
                                                    gap: 2
                                                }}
                                            >
                                                <FormControl
                                                    sx={{
                                                        minWidth: 200,
                                                        width: {xs: "100%", sm: "auto"}
                                                    }}
                                                >
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
                                                    disabled={isClassTimePassed() || (!termsCheck && !termsAccepted)}
                                                    onClick={handleRegister}
                                                >
                                                    Register
                                                </Button>
                                            </Box>
                                        ) : hasAnyPlans ? (
                                            // User has plans but none are compatible with this class type
                                            <Typography color="error">
                                                No compatible plans found
                                                for {selectedBookFor === "self" ? "yourself" : "this family member"}.
                                            </Typography>
                                        ) : (

                                            // User has no plans at all
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>

                                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                    <Typography color="error">
                                                        You have no valid plans.
                                                    </Typography>
                                                    {!isClassTimePassed() && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            onClick={handleBuyPlans}
                                                            sx={{width: {xs: "100%", sm: "auto"}}}
                                                        >
                                                            Buy Plans
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
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
                                    startIcon={<PersonAddIcon/>}
                                    size="small"
                                    sx={{ml: 1}}
                                >

                                </Button>
                            )}
                            <Typography variant="h6" sx={{fontWeight: "bold"}}>
                                Attendees
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<SendIcon/>}
                                onClick={handleSendMessage}
                                disabled={attendees.length === 0}
                            >

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

                                                    {/* Birthday icon */}
                                                    {attendee.isBirthday && (
                                                        <CakeIcon
                                                            sx={{
                                                                color: "#FF69B4 !important",
                                                                animation: "pulse 1.5s infinite",
                                                                "@keyframes pulse": {
                                                                    "0%": {
                                                                        transform: "scale(1)"
                                                                    },
                                                                    "50%": {
                                                                        transform: "scale(1.2)"
                                                                    },
                                                                    "100%": {
                                                                        transform: "scale(1)"
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            // Show family member indicator if it's a family member registration
                                            secondary={
                                                <>
                                                    {attendee.isFamilyMember ? `Child. Parent: ${attendee.registrantName}` : null}
                                                    {attendee.firstTraining && (
                                                        <Typography variant="caption" color="text.secondary"
                                                                    display="block">
                                                            First Training
                                                        </Typography>
                                                    )}
                                                </>
                                            }
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
                                sx={{mr: 2, width: {xs: "100%", sm: "auto"}}}
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
                                    Reps/Time/Weight. For example: 147, 5:30, 50. Your name and score will be visible to
                                    others.
                                </Typography>

                                {/* Score field */}
                                <TextField
                                    label="Your Score"
                                    variant="outlined"
                                    value={scoreValue}
                                    onChange={(e) => setScoreValue(e.target.value)}
                                    fullWidth
                                    sx={{mb: 2, mt: 1}}
                                />

                                {/* SAVE + CANCEL buttons */}
                                <Box sx={{display: "flex", justifyContent: "flex-end"}}>


                                    <Button
                                        variant="outlined"

                                        onClick={() => setShowScoreForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveScore}
                                        sx={{ml: 2}}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
                {(cls.wodName || cls.wodType || cls.description) && (
                    <Box
                        sx={{
                            display: {xs: 'block', sm: 'none'},
                            mb: 2
                        }}
                    >
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
                                <FullscreenIcon fontSize="small"/>
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{fontWeight: "bold", marginBottom: 1}}
                            >
                                Workout Info
                            </Typography>
                            {cls.wodName && (
                                <Typography sx={{fontWeight: "bold", color: "text.primary"}}>
                                    <strong>🔥{cls.wodName}</strong>
                                </Typography>
                            )}
                            {cls.wodType && cls.wodType !== "NONE" && (
                                <Typography sx={{color: "secondary.main", mb: 1, fontStyle: "italic"}}>
                                    <strong>{cls.wodType}</strong>
                                </Typography>
                            )}
                            {cls.description && (
                                <>
                                    <Box sx={{pb: 2}}>
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
                                    </Box>
                                    {/* Competition info section (conditionally rendered) */}
                                    {showCompetitionInfo && cls.competitionInfo && (
                                        <Box sx={{
                                            mt: 2,
                                            pt: 2,
                                            pb: 2,
                                            borderTop: '1px dashed #aaa',
                                            color: 'text.primary'
                                        }}>
                                            <Typography sx={{fontWeight: "bold", mb: 1, color: "#ff9800"}}>
                                                Competition Extra:
                                            </Typography>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(cls.competitionInfo, {
                                                        ALLOWED_TAGS: ['b', 'i', 'span'],
                                                        ALLOWED_ATTR: ['style'],
                                                    })
                                                }}
                                                style={{
                                                    whiteSpace: "pre-line"
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Competition button (duplicate but needed for mobile view) */}
                                    {cls.competitionInfo && (
                                        <Button
                                            onClick={toggleCompetitionInfo}
                                            endIcon={showCompetitionInfo ? <KeyboardArrowUpIcon/> :
                                                <KeyboardArrowDownIcon/>}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                bottom: -18,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: '#f0f0f0',
                                                color: '#666',
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                minWidth: 'auto',
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0',
                                                }
                                            }}
                                        >
                                            Competition
                                        </Button>
                                    )}

                                    {/* Add to trainings button (duplicate but needed for mobile view) */}
                                    {userRole === "regular" && (
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddClassToMyTrainings();
                                            }}
                                            color="primary"
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                bottom: 8,
                                                right: 8,
                                                border: '1px solid',
                                                borderColor: 'primary.main',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                }
                                            }}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{justifyContent: "space-between", padding: "16px"}}>

                <IconButton
                    color="primary"
                    onClick={() => setLeaderboardOpen(true)}
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
                {/* CHANGED: Use confirmation dialog for class deletion */}
                {(userRole === 'affiliate' || userRole === 'trainer') && (
                    <>

                        <IconButton
                            onClick={handleOpenDeleteClassConfirm}
                            aria-label="delete"
                            sx={{
                                color: 'white',
                                bgcolor: '#d32f2f',
                                '&:hover': {bgcolor: '#b71c1c'}
                            }}
                        >
                            <DeleteIcon/>
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={() => onEdit(cls)}
                            aria-label="edit"
                        >
                            <EditIcon/>
                        </IconButton>
                    </>
                )}

                <Button onClick={onClose} color="inherit" variant="contained">
                    Close
                </Button>
            </DialogActions>

            {/* Full-screen workout info component */}
            {isWorkoutInfoFullScreen && <WorkoutInfoFullScreen/>}

            <LeaderboardModal
                open={isLeaderboardOpen}
                onClose={() => setLeaderboardOpen(false)}
                classId={cls.id}
                cls={cls}
                hasScore={hasScore}
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
                fetchAttendees={fetchAttendees}
            />

            <AffiliateTermsModal
                open={termsModalOpen}
                onClose={handleCloseTerms}
                affiliateId={cls?.affiliateId}
            />

            {/* Cancel Registration Confirmation Dialog */}
            <Dialog
                open={cancelConfirmOpen}
                onClose={handleCloseCancelConfirm}
            >
                <DialogTitle>Confirm Cancellation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel your registration for this class? You may lose your spot if the
                        class is in high demand.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelConfirm} variant="contained"
                            color="primary">
                        No, Keep My Spot
                    </Button>
                    <Button color="inherit" variant="outlined"  onClick={() => {
                        handleCancelRegistration();
                        handleCloseCancelConfirm();
                    }}>
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
                        Are you sure you want to remove yourself from the waitlist? You'll lose your current position if
                        you decide to join again later.
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

            {/* Notification Dialog */}
            <Dialog
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
            >
                <DialogTitle>
                    {notificationType === "success" && "Success"}
                    {notificationType === "error" && "Error"}
                    {notificationType === "info" && "Information"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {notificationMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNotificationOpen(false)} variant="contained"
                            color="primary" autoFocus>
                        OK
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
                        Are you sure you want to delete this class? This will remove all registrations and cannot be
                        undone.
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