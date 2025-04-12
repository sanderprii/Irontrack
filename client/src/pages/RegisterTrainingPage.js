import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    TextField,
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
    FormHelperText
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

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
import { getFamilyMembers } from "../api/familyApi"; // Import the family API
import AppTheme from "../shared-theme/AppTheme";

const StyledContainer = styled(Container)(({ theme }) => ({
    pt: { xs: 1, sm: 12 },
    pb: { xs: 1, sm: 16 },
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
}));

// Improved styled card from Plans.js
const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    transition: "0.3s",
    "&:hover": {
        boxShadow: theme.shadows[5],
        transform: "translateY(-4px)",
    },
}));

// Training type styles from Plans.js
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

const RegisterTrainingPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [plans, setPlans] = useState([]);
    const [isHomeGym, setIsHomeGym] = useState(false);
    const [userPlans, setUserPlans] = useState([]);
    const [userData, setUserData] = useState(null);

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
            // Process plans to ensure trainingType is in the correct format
            const processedPlans = affiliatePlans.map(plan => ({
                ...plan,
                trainingType: ensureTrainingTypeArray(plan.trainingType)
            }));
            setPlans(processedPlans);

            const getUserPlans = await getUserPlansByAffiliate(selectedAffiliate.id);
            setUserPlans(getUserPlans);
        } catch (error) {
            console.error("❌ Error loading plans:", error);
        }
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
        // Leia kõik kasutaja ostetud plaanid vastava planId järgi
        const foundPlans = userPlans.filter((up) => up.planId === planId);
        if (foundPlans.length === 0) {
            return null; // kasutajal pole seda plaani ostetud
        }

        const now = new Date();
        // Filtreerime välja kehtivad plaanid (endDate tulevikus ja sessionsLeft > 0)
        const validPlans = foundPlans.filter(plan => {
            const endDate = new Date(plan.endDate);
            return endDate > now && plan.sessionsLeft > 0;
        });

        if (validPlans.length === 0) {
            return null; // ükski plaan pole kehtiv
        }

        // Leiame plaani, millel on kõige hilisem lõppkuupäev
        const latestPlan = validPlans.reduce((latest, current) => {
            const latestDate = new Date(latest.endDate);
            const currentDate = new Date(current.endDate);
            return currentDate > latestDate ? current : latest;
        }, validPlans[0]);

        // Tagastame kehtiva kuupäeva kujul "DD.MM.YYYY"
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
            <StyledContainer maxWidth={false}>
                <Typography variant="h4" gutterBottom>
                    Register for Training
                </Typography>

                {/* Search Affiliate */}
                <TextField
                    label="Search Affiliate"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    margin="normal"
                />
                <List>
                    {suggestions.map((affiliate) => (
                        <ListItem
                            key={affiliate.id}
                            button
                            onClick={() => handleAffiliateSelect(affiliate)}
                        >
                            <ListItemText primary={affiliate.name} />
                        </ListItem>
                    ))}
                </List>

                {/* Affiliate Info */}
                {selectedAffiliate && (
                    <Box
                        mt={1}
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            p: 3,
                            backgroundColor: (theme) => theme.palette.background.paper,
                            boxShadow: (theme) => theme.shadows[1],
                            maxWidth: '1000px',
                            width: "100%",
                        }}
                    >
                        {/* Pealkiri koos ikooniga */}
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                fontWeight: "bold",
                            }}
                        >
                            <BusinessIcon color="primary" />
                            Affiliate Information
                        </Typography>

                        {/* Nimi */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <BusinessIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong>Name:</strong> {selectedAffiliate.name}
                            </Typography>
                        </Box>

                        {/* Aadress */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <LocationOnIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong>Address:</strong> {selectedAffiliate.address}
                            </Typography>
                        </Box>

                        {/* Treeningu tüüp */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <FitnessCenterIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong>Training Type:</strong> {selectedAffiliate.trainingType}
                            </Typography>
                        </Box>

                        {/* Treenerid */}
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    fontWeight: "bold",
                                    mb: 1,
                                }}
                            >
                                <GroupsIcon color="action" />
                                Trainers
                            </Typography>

                            <List>
                                {selectedAffiliate.trainers.map((trainer) => (
                                    <ListItem key={trainer.id} sx={{ py: 0 }}>
                                        <ListItemText
                                            primary={trainer.fullName || trainer.username}
                                            primaryTypographyProps={{ variant: "subtitle1" }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {/* Nupud */}
                        <Box mt={3} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={loadAffiliatePlans}
                                sx={{ minWidth: "120px" }}
                            >
                                View Plans
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                    navigate("/classes", { state: { affiliate: selectedAffiliate } })
                                }
                                sx={{ minWidth: "120px" }}
                            >
                                View Classes
                            </Button>

                            {isHomeGym ? (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleRemoveHomeAffiliate}
                                    sx={{ minWidth: "120px" }}
                                >
                                    Remove Home Gym
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleAddHomeAffiliate}
                                    sx={{ minWidth: "120px" }}
                                >
                                    Add as Home Gym
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Improved Plans Section */}
                {plans.length > 0 && (
                    <Box mt={4} sx={{ width: "100%", textAlign: "center" }}>
                        <Typography
                            component="h2"
                            variant="h4"
                            sx={{
                                color: "text.primary",
                                fontWeight: "bold",
                                mb: 2
                            }}
                        >
                            Available Plans
                        </Typography>
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
                                                    disabled={Boolean(validUntil)}
                                                    onClick={() => handleBuyPlan(plan)}
                                                    sx={{
                                                        borderRadius: "20px",
                                                        py: 1,
                                                    }}
                                                >
                                                    {validUntil ? "Already Active" : "Buy Plan"}
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