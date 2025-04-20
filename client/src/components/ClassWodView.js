import React, { useState, useEffect } from "react";
import {
    Container, Box, Typography, Button, Grid, Card, CardContent, Divider,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { getWeekWODs, applyWODToTrainings } from "../api/wodApi";
import WODModal from "./WODModal";
import DOMPurify from 'dompurify'; // Added import for sanitizing HTML

export default function ClassWodView({ affiliateId, onClose }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekWODs, setWeekWODs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isWODModalOpen, setWODModalOpen] = useState(false);

    // New state variables for confirmation dialog
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [wodToApply, setWodToApply] = useState(null);

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    useEffect(() => {
        if (affiliateId) fetchWeekWODs();
    }, [affiliateId, currentDate]);

    const fetchWeekWODs = async () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() || 7) + 1);
        startOfWeek.setHours(0, 0, 0, 0);

        try {
            const response = await getWeekWODs(affiliateId, startOfWeek);
            setWeekWODs(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error fetching weekly WODs:", error);
            setWeekWODs([]);
        }
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handleOpenWODModal = (date) => {
        setSelectedDate(date);
        setWODModalOpen(true);
    };

    // Open confirmation dialog instead of directly applying WOD
    const handleOpenConfirmDialog = (date) => {
        setWodToApply(date);
        setConfirmDialogOpen(true);
    };

    // Close confirmation dialog
    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setWodToApply(null);
    };

    // Apply WOD after confirmation
    const handleConfirmApplyWOD = async () => {
        if (!wodToApply) return;

        try {
            await applyWODToTrainings(affiliateId, wodToApply);
            fetchWeekWODs();
            handleCloseConfirmDialog();
            // You could add a success message or notification here
        } catch (error) {
            console.error("Error applying WOD:", error);
            // You could add error handling here
        }
    };

    return (
        <Container>
            {/* Pealkiri ja nupud */}
            <Box textAlign="center" my={4}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    Weekly WODs
                </Typography>
                <Box display="flex" justifyContent="center" gap={2} my={2}>
                    <Button variant="contained" color="secondary" onClick={handlePrevWeek}>
                        Previous Week
                    </Button>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {new Date(currentDate).toLocaleDateString("en-GB")}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleNextWeek}>
                        Next Week
                    </Button>
                </Box>
            </Box>

            {/* WOD-de kuvamine päevade kaupa */}
            <Grid container spacing={3}>
                {dayNames.map((day, index) => {
                    const dayDate = new Date(currentDate);
                    dayDate.setDate(dayDate.getDate() - (dayDate.getDay() || 7) + 1 + index);

                    const wod = weekWODs.find(w => new Date(w.date).toDateString() === dayDate.toDateString());

                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ bgcolor: "background.paper", p: 2, borderRadius: "12px", boxShadow: 3 }}>
                                <CardContent>
                                    {/* Päeva nimi ja kuupäev */}
                                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "primary.main", textAlign: "center" }}>
                                        {day} - {dayDate.toLocaleDateString("en-GB")}
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* WOD Andmed - Updated to render HTML content */}
                                    {wod ? (
                                        <Box textAlign="center">
                                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
                                                {wod.wodName}
                                            </Typography>
                                            <Typography variant="subtitle2" sx={{ color: "secondary.main", mb: 1, fontStyle: "italic" }}>
                                                {wod.type}
                                            </Typography>
                                            {/* Updated to render HTML safely */}
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(wod.description, {
                                                        ALLOWED_TAGS: ['b', 'i', 'span'],
                                                        ALLOWED_ATTR: ['style'],
                                                    })
                                                }}
                                                style={{
                                                    color: "text.secondary",
                                                    whiteSpace: "pre-line",
                                                    fontSize: "14px",
                                                    lineHeight: "1.5",
                                                    textAlign: "center"
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary" textAlign="center">
                                            No WOD added
                                        </Typography>
                                    )}

                                    {/* Nupud */}
                                    <Box mt={3} display="flex" justifyContent="space-between">
                                        <Button size="small" variant="outlined" color="primary" onClick={() => handleOpenWODModal(dayDate)}>
                                            + Add WOD
                                        </Button>
                                        {wod && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenConfirmDialog(dayDate)}
                                            >
                                                Apply WOD
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* WOD lisamise modal */}
            <WODModal
                open={isWODModalOpen}
                onClose={() => setWODModalOpen(false)}
                selectedDate={selectedDate}
                selectedAffiliateId={affiliateId}
                refreshWODs={fetchWeekWODs}
            />

            {/* Confirmation Dialog for applying WOD */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
            >
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to apply this WOD to all trainings? This action will update all related training sessions.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmApplyWOD} color="secondary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}