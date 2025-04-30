import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Box,
    Alert,
    CircularProgress,
    DialogContentText,
    TextField
} from "@mui/material";
import { getClassLeaderboard } from "../api/leaderboardApi";
import { getUserProfile } from "../api/profileApi";

export default function LeaderboardModal({ open, onClose, classId, cls }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    // Confirmation dialog states
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [addingRecord, setAddingRecord] = useState(false);
    const [error, setError] = useState("");
    const [userScore, setUserScore] = useState(null);
    const [userFullName, setUserFullName] = useState("");
    const [comment, setComment] = useState(""); // New state for comment

    const API_URL = process.env.REACT_APP_API_URL;

    // Get user profile info when the component loads
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile && profile.fullName) {
                    setUserFullName(profile.fullName);
                } else {
                    // Fallback to localStorage if available
                    const storedName = localStorage.getItem('fullName');
                    if (storedName) setUserFullName(storedName);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // Fallback to localStorage
                const storedName = localStorage.getItem('fullName');
                if (storedName) setUserFullName(storedName);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (open && classId) {
            fetchLeaderboard();
        }
    }, [open, classId, userFullName]);

    const fetchLeaderboard = async () => {
        try {
            const response = await getClassLeaderboard(classId);
            setLeaderboard(response || []);

            // Find user's score by matching their full name
            if (userFullName && response && response.length > 0) {
                const score = response.find(entry =>
                    entry.fullName === userFullName
                );


                setUserScore(score || null);
            }
        } catch (error) {
            console.error("❌ Error fetching leaderboard:", error);
            setLeaderboard([]);
        }
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter) {
            setFilter(newFilter);
        }
    };

    // Show confirmation dialog
    const handleOpenConfirmation = () => {
        setError("");
        setComment(""); // Reset comment when opening dialog

        // Re-check if we have the user's score
        if (userFullName && leaderboard && leaderboard.length > 0) {
            const score = leaderboard.find(entry => entry.fullName === userFullName);
            setUserScore(score || null);

            if (!score) {
                setError("You don't have a score for this class yet. Please add a score first.");
            }
        } else if (!userScore) {
            setError("You don't have a score for this class yet. Please add a score first.");
        }

        setConfirmDialogOpen(true);
    };

    // Handle closing the dialog
    const handleCloseConfirmation = () => {
        setConfirmDialogOpen(false);
        setError("");
        setComment("");
    };

    // Handle saving the record with comment
    const handleConfirmAddRecord = async () => {
        try {
            // Double check that user has a score
            if (!userScore) {
                setError("You don't have a score for this class. Please add a score first.");
                return;
            }

            setAddingRecord(true);

            // Format the date from the class time
            const classDate = new Date(cls.time).toISOString().split('T')[0];

            // Create the record object with the user's existing score and comment
            const payload = {
                type: "WOD",
                name: cls.wodName ? cls.wodName.toUpperCase() : "WOD",
                date: classDate,
                score: userScore.score,
                comment: comment // Add the comment to the payload
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Failed to create record');
            }

            setConfirmDialogOpen(false);
            alert("Successfully added to your records!");
        } catch (err) {
            setError(err.message || "Error adding record");
        } finally {
            setAddingRecord(false);
        }
    };

    const filteredLeaderboard = (leaderboard || []).filter(entry =>
        filter === "all" || entry.scoreType?.toLowerCase() === filter
    );

    const role = localStorage.getItem('role');

    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={false} // Muuda "md" asemel "false"
                fullWidth
                PaperProps={{
                    sx: {
                        m: { xs: 0 },  // Mobiilis eemaldame ääred
                        width: { xs: '100%' },  // Mobiilis täislaius
                        maxWidth: { xs: '100%' },  // Mobiilis täislaius
                        borderRadius: { xs: 0 }  // Mobiilis eemaldame ümarad nurgad
                    }
                }}>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogContent>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="Filter results"
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="rx">Rx</ToggleButton>
                    <ToggleButton value="sc">Sc</ToggleButton>
                    <ToggleButton value="beg">Beg</ToggleButton>
                </ToggleButtonGroup>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Place</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>
                                    Score
                                    <Typography
                                        component="span"
                                        color="text.secondary"
                                        sx={{ ml: 1, fontSize: '0.9em' }}
                                    >
                                        (previous)
                                    </Typography>
                                </TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLeaderboard.length > 0 ? (
                                filteredLeaderboard.map((entry, index) => (
                                    <TableRow
                                        key={entry.id}
                                        // Highlight the current user's row
                                        sx={entry.fullName === userFullName ? {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)'
                                        } : {}}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{entry.fullName}</TableCell>
                                        <TableCell>
                                            <Box>
                                                {entry.score}
                                                {entry.previousScore && (
                                                    <Typography
                                                        component="span"
                                                        color="text.secondary"
                                                        sx={{ ml: 1, fontSize: '0.9em' }}
                                                    >
                                                        ({entry.previousScore})
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{entry.scoreType?.toUpperCase()}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No results available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                {/* Only show Add to Records button for WOD type classes */}
                {cls && cls.trainingType === "WOD" && role === "regular" && (
                    <Button
                        onClick={handleOpenConfirmation}
                        color="primary"
                    >
                        Add to Records
                    </Button>
                )}
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>

            {/* Confirmation Dialog with Comment Field */}
            <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmation}>
                <DialogTitle>Add to Records</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {userScore ? (
                        <>
                            <DialogContentText>
                                Do you want to add this WOD result to your records?
                            </DialogContentText>

                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>WOD:</strong> {cls?.wodName ? cls.wodName.toUpperCase() : "WOD"}</Typography>
                                <Typography><strong>Date:</strong> {new Date(cls?.time).toLocaleDateString()}</Typography>
                                <Typography><strong>Your Score:</strong> {userScore.score}</Typography>
                                <Typography><strong>Type:</strong> {userScore.scoreType?.toUpperCase()}</Typography>
                            </Box>

                            {/* New Comment Field */}
                            <TextField
                                label="Add Comment (Optional)"
                                multiline
                                rows={3}
                                fullWidth
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                margin="normal"
                                placeholder="Enter any notes about your performance..."
                                disabled={addingRecord}
                            />
                        </>
                    ) : (
                        <DialogContentText>
                            You haven't added a score for this class yet. Please add your score first before adding to records.
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseConfirmation}
                        color="inherit"
                        disabled={addingRecord}
                    >
                        Cancel
                    </Button>
                    {userScore && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirmAddRecord}
                            disabled={addingRecord || !userScore}
                        >
                            {addingRecord ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Saving...
                                </>
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}