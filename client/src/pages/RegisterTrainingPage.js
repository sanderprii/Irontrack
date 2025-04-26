import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Button,
    List,
    ListItem,
    ListItemText,
    Grid,
    Card,
    CardContent,
    CardActions,
    Divider,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Paper,
    Avatar,
    ListItemIcon,
    Fade,
    alpha,
    Link
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PersonIcon from "@mui/icons-material/Person";
import LanguageIcon from "@mui/icons-material/Language";
import DomainIcon from "@mui/icons-material/Domain";
import PaymentIcon from "@mui/icons-material/Payment";

import { styled } from "@mui/material/styles";
import {
    fetchAffiliates,
    fetchAffiliateInfo,
    addHomeAffiliate,
    removeHomeAffiliate,
    fetchPlans,
    checkHomeAffiliate
} from "../api/getClassesApi";

import { getUserProfile } from "../api/profileApi";
import { getUserPlansByAffiliate } from "../api/profileApi";
import { getFamilyMembers } from "../api/familyApi";
import AppTheme from "../shared-theme/AppTheme";

const StyledContainer = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4, 2),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
}));

// Improved styled card
const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    transition: "0.3s",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    "&:hover": {
        boxShadow: theme.shadows[5],
        transform: "translateY(-4px)",
    },
}));

// Training type styles
const trainingTypeColors = {
    "All classes": "success",
    "WOD": "primary",
    "Weightlifting": "secondary",
    "Cardio": "error",
    "Rowing": "info",
    "Gymnastics": "warning",
    "Open Gym": "default",
    "Other": "info"
};

const TrainingTypeChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    fontWeight: 500,
}));

// Function to ensure training types are always in array format
const ensureTrainingTypeArray = (trainingType) => {
    if (!trainingType) return [];

    if (Array.isArray(trainingType)) return trainingType;

    // If it's a string that looks like JSON, try to parse it
    if (typeof trainingType === 'string') {
        try {
            const parsed = JSON.parse(trainingType);
            return Array.isArray(parsed) ? parsed : [trainingType];
        } catch (e) {
            // If JSON.parse fails, return the original string as a single-element array
            return [trainingType];
        }
    }

    // All other cases - return as a single-element array
    return [trainingType];
};

// Enhanced Search Result Item
const SearchResultItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 0),
}));

const RegisterTrainingPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isHomeGym, setIsHomeGym] = useState(false);
    const [userPlans, setUserPlans] = useState([]);
    const [userData, setUserData] = useState(null);
    const [viewingPlans, setViewingPlans] = useState(false);

    // Family members state
    const [familyMembers, setFamilyMembers] = useState([]);
    const [showFamilyMemberDialog, setShowFamilyMemberDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState("self"); // Default to "self"

    const navigate = useNavigate();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch user data
                const profile = await getUserProfile();
                setUserData(profile);

                // Fetch family members
                const members = await getFamilyMembers();
                setFamilyMembers(members);

                // Check for home gym
                const userHomeAffiliate = await checkHomeAffiliate();
                if (userHomeAffiliate) {
                    setIsHomeGym(true);
                    const affiliateData = await fetchAffiliateInfo(userHomeAffiliate);
                    setSelectedAffiliate(affiliateData.affiliate);
                    loadAffiliatePlans(affiliateData.affiliate.id);
                }
            } catch (error) {
                console.error("❌ Error fetching initial data:", error);
            }
        };

        loadInitialData();
    }, []);

    // Get affiliate initials for avatar
    const getAffiliateInitials = (name) => {
        if (!name) return "??";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSearchChange = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            const results = await fetchAffiliates(e.target.value.trim());
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleAffiliateSelect = async (affiliate) => {
        const affiliateData = await fetchAffiliateInfo(affiliate.id);
        const affiliateInfo = affiliateData.affiliate;
        setSelectedAffiliate(affiliateInfo);

        setPlans([]);
        setSuggestions([]);
        setSearchQuery("");
    };

    const loadAffiliatePlans = async () => {
        if (!selectedAffiliate || !selectedAffiliate.id) {
            return;
        }

        try {
            const affiliatePlans = await fetchPlans(selectedAffiliate.ownerId);

            // Filter out inactive plans, then process the remaining ones
            const filteredPlans = affiliatePlans.filter(plan => plan.active);

            // Process plans to ensure trainingType is in the correct format
            const processedPlans = filteredPlans.map(plan => ({
                ...plan,
                trainingType: ensureTrainingTypeArray(plan.trainingType)
            }));

            setPlans(processedPlans);

            const getUserPlans = await getUserPlansByAffiliate(selectedAffiliate.id);
            setUserPlans(getUserPlans);

            // Set viewing plans to true to hide affiliate info
            setViewingPlans(true);
        } catch (error) {
            console.error("❌ Error loading plans:", error);
        }
    };

    // Function to go back to affiliate info view
    const handleBackToAffiliate = () => {
        setViewingPlans(false);
    };

    const handleAddHomeAffiliate = async () => {
        if (!selectedAffiliate || !selectedAffiliate.id) {
            return;
        }

        try {
            await addHomeAffiliate(selectedAffiliate.id);
            setIsHomeGym(true);
        } catch (error) {
            console.error("❌ Error adding home gym:", error);
        }
    };

    const handleRemoveHomeAffiliate = async () => {
        if (selectedAffiliate) {
            await removeHomeAffiliate(selectedAffiliate.id);
            setIsHomeGym(false);
        }
    };

    // Modified Buy Plan handler to check for family members
    const handleBuyPlan = (plan) => {
        if (familyMembers.length > 0) {
            // If user has family members, show the selection dialog
            setSelectedPlan(plan);
            setShowFamilyMemberDialog(true);
        } else {
            // If no family members, proceed directly to checkout
            proceedToCheckout(plan, false, null);
        }
    };

    // Handler for family member selection
    const handleFamilyMemberSelection = (event) => {
        setSelectedFamilyMember(event.target.value);
    };

    // Handler for confirming family member selection
    const handleDialogConfirm = () => {
        const isFamilyMember = selectedFamilyMember !== "self";
        const familyMemberId = isFamilyMember ? selectedFamilyMember : null;

        proceedToCheckout(selectedPlan, isFamilyMember, familyMemberId);
        setShowFamilyMemberDialog(false);
    };

    // Handler for canceling family member selection
    const handleDialogCancel = () => {
        setSelectedFamilyMember("self");
        setShowFamilyMemberDialog(false);
    };

    // Helper function to navigate to checkout
    const proceedToCheckout = (plan, isFamilyMember, familyMemberId) => {
        navigate("/checkout", {
            state: {
                affiliate: selectedAffiliate,
                plan: plan,
                contract: false,
                userData: userData,
                familyMember: isFamilyMember,
                familyMemberId: familyMemberId
            }
        });
    };

    // Helper function to get plan description
    const getPlanDescription = (plan) => {
        if (plan.sessions === 9999) {
            return "Unlimited sessions";
        } else {
            return `${plan.sessions} sessions`;
        }
    };

    function getValidUntil(planId, userPlans) {
        // Find all user purchased plans with matching planId
        const foundPlans = userPlans.filter((up) => up.planId === planId);
        if (foundPlans.length === 0) {
            return null; // user doesn't have this plan
        }

        const now = new Date();
        // Filter valid plans (endDate in future and sessionsLeft > 0)
        const validPlans = foundPlans.filter(plan => {
            const endDate = new Date(plan.endDate);
            return endDate > now && plan.sessionsLeft > 0;
        });

        if (validPlans.length === 0) {
            return null; // no valid plans
        }

        // Find the plan with the latest end date
        const latestPlan = validPlans.reduce((latest, current) => {
            const latestDate = new Date(latest.endDate);
            const currentDate = new Date(current.endDate);
            return currentDate > latestDate ? current : latest;
        }, validPlans[0]);

        // Return valid date in "DD.MM.YYYY" format
        return formatDateISOtoDDMMYYYY(latestPlan.endDate);
    }

    function formatDateISOtoDDMMYYYY(isoDateString) {
        if (!isoDateString) return null;
        const d = new Date(isoDateString);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
    }

    return (
        <AppTheme>
            <StyledContainer maxWidth="lg">
                <Typography variant="h4" sx={{ fontWeight: 600, mt: 0, mb: 1 }}>
                    Register for Training
                </Typography>

                {/* Improved Search Affiliate UI */}
                <Box sx={{ width: "100%", maxWidth: "600px", mb: 4 }}>
                    <Paper
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            '&:hover': {
                                boxShadow: 3
                            }
                        }}
                    >
                        <Box sx={{ p: 0.5, display: 'flex', alignItems: 'center' }}>
                            <SearchIcon sx={{ ml: 2, color: 'text.secondary' }} />
                            <Box
                                component="input"
                                placeholder="Search Affiliate..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                sx={{
                                    width: "100%",
                                    border: "none",
                                    p: 2,
                                    fontSize: "1rem",
                                    outline: "none",
                                    bgcolor: 'transparent'
                                }}
                            />
                        </Box>
                    </Paper>

                    {/* Enhanced Search Results */}
                    {suggestions.length > 0 && (
                        <Fade in={suggestions.length > 0}>
                            <Paper
                                elevation={3}
                                sx={{
                                    mt: 1,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    maxHeight: 350,
                                    overflowY: 'auto'
                                }}
                            >
                                <List sx={{ p: 1 }}>
                                    {suggestions.map((affiliate, index) => (
                                        <React.Fragment key={affiliate.id}>
                                            <SearchResultItem
                                                button
                                                onClick={() => handleAffiliateSelect(affiliate)}
                                            >
                                                <ListItemIcon>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            width: 40,
                                                            height: 40
                                                        }}
                                                    >
                                                        {getAffiliateInitials(affiliate.name)}
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                            {affiliate.name}
                                                        </Typography>
                                                    }
                                                />
                                                <FitnessCenterIcon color="action" sx={{ ml: 2 }} />
                                            </SearchResultItem>
                                            {index < suggestions.length - 1 && <Divider variant="inset" component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        </Fade>
                    )}
                </Box>

                {/* Affiliate Info - Redesigned */}
                {selectedAffiliate && !viewingPlans && (
                    <Card
                        sx={{
                            width: "100%",
                            maxWidth: "1000px",
                            borderRadius: 3,
                            boxShadow: 2,
                            overflow: 'visible'
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            {/* Main affiliate info with logo */}
                            <Box sx={{ textAlign: 'center', p: 3, pb: 1 }}>
                                <Avatar
                                    src={selectedAffiliate.logo || 'https://via.placeholder.com/120'}
                                    alt={selectedAffiliate.name}
                                    sx={{
                                        width: '120px',
                                        height: '120px',
                                        margin: 'auto',
                                        mb: 2,
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                                    {selectedAffiliate.name}
                                </Typography>
                                <Chip
                                    label={selectedAffiliate.trainingType || 'No training type'}
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 3 }}
                                />

                                {/* Action buttons moved below name */}
                                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={loadAffiliatePlans}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        View Plans
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() =>
                                            navigate("/classes", { state: { affiliate: selectedAffiliate } })
                                        }
                                        sx={{ borderRadius: 2 }}
                                    >
                                        View Classes
                                    </Button>

                                    {isHomeGym ? (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleRemoveHomeAffiliate}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Remove Home Gym
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={handleAddHomeAffiliate}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Add as Home Gym
                                        </Button>
                                    )}
                                </Box>

                                {/* Website and links */}
                                {(selectedAffiliate.website || selectedAffiliate.subdomain) && (
                                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 2 }}>
                                        {selectedAffiliate.website && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <LanguageIcon sx={{ color: "primary.main" }}/>
                                                <Link href={selectedAffiliate.website} target="_blank" underline="hover">
                                                    {selectedAffiliate.website}
                                                </Link>
                                            </Box>
                                        )}

                                        {selectedAffiliate.subdomain && (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <DomainIcon sx={{ color: "primary.main" }}/>
                                                <Link href={`https://${selectedAffiliate.subdomain}.irontrack.ee`} target="_blank" underline="hover">
                                                    {selectedAffiliate.subdomain}.irontrack.ee
                                                </Link>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Feedback link:</Typography>
                                    <Link href={`https://${selectedAffiliate.feedback}`} target="_blank" underline="hover">
                                        {selectedAffiliate.feedback}
                                    </Link>
                                </Box>

                                <Divider sx={{ mx: -3 }} />
                            </Box>

                            {/* Contact and Details Section */}
                            <Grid container spacing={3} sx={{ p: 3, pt: 2 }}>
                                {/* Contact Information */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon fontSize="small" />
                                        Contact Information
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {selectedAffiliate.email && (
                                            <Grid item xs={12}>
                                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <EmailIcon sx={{ color: "primary.main" }}/>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">Email</Typography>
                                                            <Typography variant="body1">
                                                                {selectedAffiliate.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}

                                        {selectedAffiliate.phone && (
                                            <Grid item xs={12}>
                                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <PhoneAndroidIcon sx={{ color: "primary.main" }}/>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                                                            <Typography variant="body1">
                                                                {selectedAffiliate.phone}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <LocationOnIcon sx={{ color: "primary.main" }}/>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Address</Typography>
                                                        <Typography variant="body1">
                                                            {selectedAffiliate.address}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Trainers Section */}
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <GroupsIcon fontSize="small" />
                                        Trainers
                                    </Typography>

                                    {selectedAffiliate.trainers && selectedAffiliate.trainers.length > 0 ? (
                                        <Grid container spacing={2}>
                                            {selectedAffiliate.trainers.map((trainerObj) => (
                                                <Grid item xs={12} sm={6} key={trainerObj.id}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 2,
                                                            bgcolor: 'background.default',
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                boxShadow: 1,
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                            <Avatar
                                                                src={trainerObj.trainer?.logo}
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    width: 40,
                                                                    height: 40
                                                                }}
                                                            >
                                                                {(trainerObj.trainer?.fullName || trainerObj.trainer?.username || "?").charAt(0)}
                                                            </Avatar>
                                                            <Typography variant="body1" fontWeight={500}>
                                                                {trainerObj.trainer?.fullName || trainerObj.trainer?.username || "Unknown Trainer"}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                                            <Typography color="text.secondary">No trainers assigned to this affiliate.</Typography>
                                        </Paper>
                                    )}
                                </Grid>

                                {/* Payment Holiday Fee */}
                                {selectedAffiliate.paymentHolidayFee && (
                                    <Grid item xs={12}>
                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <PaymentIcon sx={{ color: "primary.main" }}/>
                                                    <Typography variant="body1">Payment Holiday Fee:</Typography>
                                                </Box>
                                                <Chip
                                                    label={`${selectedAffiliate.paymentHolidayFee}€`}
                                                    color="success"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Improved Plans Section */}
                {plans.length > 0 && viewingPlans && (
                    <Box mt={4} sx={{ width: "100%", textAlign: "center" }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBackToAffiliate}
                                sx={{ borderRadius: 2, mr: 3 }}
                            >
                                Back to Affiliate
                            </Button>
                            <Typography
                                component="h2"
                                variant="h4"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: "bold",
                                }}
                            >
                                Available Plans
                            </Typography>
                        </Box>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.secondary",
                                maxWidth: "700px",
                                mx: "auto",
                                mb: 4
                            }}
                        >
                            Choose a plan that best suits your needs. You can purchase multiple plans if needed.
                        </Typography>

                        <Grid container spacing={3} sx={{ alignItems: "stretch", width: "100%" }}>
                            {plans.map((plan) => {
                                const validUntil = getValidUntil(plan.id, userPlans);
                                const isPremium = plan.name === "Professional" || plan.name.toLowerCase().includes("premium");

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={plan.id}>
                                        <StyledCard
                                            sx={isPremium
                                                ? {
                                                    border: "none",
                                                    boxShadow: "0 8px 12px hsla(220, 20%, 42%, 0.2)",
                                                    bgcolor: "background.paper",
                                                    p: 3,
                                                    borderLeft: "5px solid #FFB347",
                                                }
                                                : {}}
                                        >
                                            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                                <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                                                    <Typography component="h3" variant="h5" fontWeight="bold">
                                                        {plan.name}
                                                    </Typography>
                                                    {isPremium && <AutoAwesomeIcon color="warning" />}
                                                </Box>
                                                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", mb: 2 }}>
                                                    <Typography component="h3" variant="h2" fontWeight="bold">
                                                        €{plan.price ? parseFloat(plan.price).toFixed(2) : "0.00"}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />

                                                <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                                                    <CheckCircleRoundedIcon color="primary" />
                                                    <Typography variant="body1">{plan.validityDays} days</Typography>
                                                </Box>

                                                <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center", justifyContent: "center" }}>
                                                    <CheckCircleRoundedIcon color="primary" />
                                                    <Typography variant="body1">{getPlanDescription(plan)}</Typography>
                                                </Box>

                                                {/* Training Types Section */}
                                                <Box sx={{ mt: 2, mb: 3 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: "medium" }}>
                                                        <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: "middle" }} />
                                                        Included Training Types:
                                                    </Typography>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", minHeight: "70px" }}>
                                                        {plan.trainingType && plan.trainingType.length > 0 ? (
                                                            plan.trainingType.map((type, index) => (
                                                                <Tooltip title={type} key={index}>
                                                                    <TrainingTypeChip
                                                                        label={type}
                                                                        color={trainingTypeColors[type] || "default"}
                                                                        size="small"
                                                                    />
                                                                </Tooltip>
                                                            ))
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                No training types specified
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {validUntil && (
                                                    <Box sx={{ mt: 2, mb: 1 }}>
                                                        <Typography variant="body1" color="primary" sx={{ fontWeight: "medium" }}>
                                                            Already active until {validUntil}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"

                                                    onClick={() => handleBuyPlan(plan)}
                                                    sx={{
                                                        borderRadius: "20px",
                                                        py: 1,
                                                    }}
                                                >
                                                    Buy Plan
                                                </Button>
                                            </CardActions>
                                        </StyledCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {/* Family Member Selection Dialog */}
                <Dialog open={showFamilyMemberDialog} onClose={handleDialogCancel}>
                    <DialogTitle>Select Plan Recipient</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" gutterBottom sx={{ my: 2 }}>
                            Please select who this plan is for:
                        </Typography>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="family-member-select-label">Recipient</InputLabel>
                            <Select
                                labelId="family-member-select-label"
                                id="family-member-select"
                                value={selectedFamilyMember}
                                label="Recipient"
                                onChange={handleFamilyMemberSelection}
                            >
                                <MenuItem value="self">{userData?.fullName || "Yourself"}</MenuItem>
                                {familyMembers.map((member) => (
                                    <MenuItem key={member.id} value={member.id}>
                                        {member.fullName}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                Select for whom you're purchasing this plan.
                            </FormHelperText>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleDialogCancel} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleDialogConfirm} color="primary" variant="contained">
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </StyledContainer>
        </AppTheme>
    );
};

export default RegisterTrainingPage;