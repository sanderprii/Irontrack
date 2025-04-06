import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    CardActions,
    Divider,
    Chip,
    Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlanFormModal from "../components/PlanFormModal";
import { getPlans, createPlan, updatePlan, deletePlan } from "../api/planApi";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AppTheme from "../shared-theme/AppTheme";

const StyledContainer = styled(Container)(({ theme }) => ({
    pt: { xs: 4, sm: 12 },
    pb: { xs: 8, sm: 16 },
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(3),
    textAlign: "center",
    transition: "0.3s",
    backgroundColor: theme.palette.background.paper,
    height: "100%",
    "&:hover": {
        boxShadow: theme.shadows[5],
        transform: "translateY(-4px)",
        cursor: "pointer",
    },
}));

const trainingTypeColors = {
    "All classes": "success",
    "WOD": "primary",
    "Weightlifting": "secondary",
    "Cardio": "error",
    "Rowing": "info",
    "Gymnastics": "warning",
    "Open Gym": "default"
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

export default function Plans() {
    const theme = useTheme();
    const [plans, setPlans] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await getPlans();

            // Ensure all plans have correct trainingType format
            if (Array.isArray(data)) {
                const processedPlans = data.map(plan => ({
                    ...plan,
                    trainingType: ensureTrainingTypeArray(plan.trainingType)
                }));
                setPlans(processedPlans);
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error("Error loading plans:", error);
            setPlans([]);
        }
    };

    const handleSave = async (planData) => {
        try {
            if (!planData) {
                await deletePlan(selectedPlan.id);
            } else if (selectedPlan) {
                await updatePlan(selectedPlan.id, planData);
            } else {
                await createPlan(planData);
            }
            setModalOpen(false);
            setSelectedPlan(null);
            fetchPlans();
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    };

    const getPlanDescription = (plan) => {
        if (plan.sessions === 9999) {
            return "Unlimited sessions";
        } else {
            return `${plan.sessions} sessions`;
        }
    };

    // When a plan is selected, ensure trainingType is an array
    const handleSelectPlan = (plan) => {
        const updatedPlan = {
            ...plan,
            trainingType: ensureTrainingTypeArray(plan.trainingType)
        };
        setSelectedPlan(updatedPlan);
        setModalOpen(true);
    };

    return (
        <AppTheme>
            <StyledContainer maxWidth={false}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography
                        component="h2"
                        variant="h4"
                        sx={{
                            color: "text.primary",
                            fontWeight: "bold",
                            mb: 2
                        }}
                    >
                        Training Plans
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "text.secondary",
                            maxWidth: "700px",
                            mx: "auto"
                        }}
                    >
                        Choose a plan that best suits your needs. You can upgrade or change your plan at any time.
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setModalOpen(true)}
                        startIcon={<AutoAwesomeIcon />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add New Plan
                    </Button>
                </Box>

                <Grid container spacing={3} sx={{ alignItems: "stretch", width: "100%" }}>
                    {(Array.isArray(plans) ? plans : []).map((plan) => (
                        <Grid item xs={12} sm={6} md={4} key={plan.id}>
                            <StyledCard
                                onClick={() => handleSelectPlan(plan)}
                                sx={plan.name === "Professional"
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
                                        {plan.name === "Professional" && <AutoAwesomeIcon color="warning" />}
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", mb: 2 }}>
                                        <Typography component="h3" variant="h2" fontWeight="bold">
                                            €{plan.price ? parseFloat(plan.price).toFixed(2) : "0.00"}
                                        </Typography>
                                        <Typography component="h3" variant="subtitle1" color="text.secondary">&nbsp; /month</Typography>
                                    </Box>

                                    <Divider sx={{ my: 2, opacity: 0.8, borderColor: "divider" }} />

                                    <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
                                        <CheckCircleRoundedIcon color="primary" />
                                        <Typography variant="body1">{plan.validityDays} days</Typography>
                                    </Box>

                                    <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
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
                                                ensureTrainingTypeArray(plan.trainingType).map((type, index) => (
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

                                    {plan.additionalData && (
                                        <Box sx={{ mt: "auto", mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {plan.additionalData}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        sx={{
                                            borderRadius: "20px",
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText
                                            }
                                        }}
                                    >
                                        Edit Plan
                                    </Button>
                                </CardActions>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>

                <PlanFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} plan={selectedPlan} />
            </StyledContainer>
        </AppTheme>
    );
}