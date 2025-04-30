import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAffiliate } from '../api/affiliateApi'; // Import the getAffiliate function

const Trainer = () => {
    const [trainerAffiliates, setTrainerAffiliates] = useState([]);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Check localStorage first for saved affiliate
        const savedAffiliateId = localStorage.getItem("affiliateId");
        const savedAffiliateName = localStorage.getItem("affiliateName");

        if (savedAffiliateId && savedAffiliateName) {
            // If we have saved affiliate info, try to get full details
            const fetchSavedAffiliate = async () => {
                try {
                    const affiliateData = await getAffiliate(savedAffiliateId);
                    setSelectedAffiliate(affiliateData);
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching saved affiliate:", err);
                    // If we can't fetch details, fallback to fetching all affiliates
                    fetchTrainerAffiliates();
                }
            };

            fetchSavedAffiliate();
        } else {
            // No saved affiliate, fetch all affiliates
            fetchTrainerAffiliates();
        }
    }, []);

    // Function to fetch trainer affiliates
    const fetchTrainerAffiliates = async () => {
        try {
            const response = await fetch(`${API_URL}/trainer/affiliates`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch trainer affiliates');
            }

            const data = await response.json();
            setTrainerAffiliates(data);

            // If user is a trainer at only one affiliate, automatically call getAffiliate
            if (data.length === 1) {
                try {
                    const affiliateData = await getAffiliate(data[0].id);

                    // Debug - log the structure


                    // Make sure we have id and name properties
                    if (!affiliateData.id || !affiliateData.name) {
                        console.error("Affiliate data missing id or name:", affiliateData);

                        // Extend the affiliateData with properties from the list item if needed
                        const enhancedData = {
                            ...affiliateData,
                            id: affiliateData.id || data[0].id,
                            name: affiliateData.name || data[0].name
                        };

                        // Use the enhanced data
                        saveAffiliateToStorage(enhancedData);
                    } else {
                        // Use the data as is
                        saveAffiliateToStorage(affiliateData);
                    }
                } catch (err) {
                    console.error("Error fetching affiliate:", err);
                    setError("Failed to load affiliate data");
                }
            }
        } catch (err) {
            console.error("Error fetching trainer affiliates:", err);
            setError("Failed to load trainer data");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to save affiliate data to localStorage
    const saveAffiliateToStorage = (affiliate) => {
        if (!affiliate) return;



        // Save to localStorage for persistence
        localStorage.setItem("affiliateId", affiliate.id);
        localStorage.setItem("affiliateName", affiliate.name);

        // Optional: Save the full affiliate object
        localStorage.setItem("selectedAffiliate", JSON.stringify(affiliate));

        // Update component state
        setSelectedAffiliate(affiliate);
    };

    // Function to handle affiliate selection with localStorage saving
    const setAffiliate = (affiliate) => {
        saveAffiliateToStorage(affiliate);
    };

    // Navigate to another page with affiliate state
    const navigateWithAffiliate = (path) => {
        navigate(path, { state: { affiliate: selectedAffiliate } });
    };

    if (loading && trainerAffiliates.length === 0) {
        return (
            <Container maxWidth={false} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth={false} sx={{ mt: 4 }}>
                <Typography color="error" variant="h6">{error}</Typography>
            </Container>
        );
    }

    // If there are multiple affiliates and none selected yet, show selection buttons
    if (trainerAffiliates.length > 1 && !selectedAffiliate) {
        return (
            <Container maxWidth={false} sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Select Affiliate
                </Typography>
                <Grid container spacing={2}>
                    {trainerAffiliates.map((affiliate) => (
                        <Grid item xs={12} sm={6} md={4} key={affiliate.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                                onClick={() => setAffiliate(affiliate)}
                            >
                                <Typography variant="h6">{affiliate.name}</Typography>
                                {affiliate.address && (
                                    <Typography variant="body2" color="text.secondary">
                                        {affiliate.address}
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    // Render trainer dashboard with selected affiliate
    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Trainer Dashboard
            </Typography>
            {selectedAffiliate && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h5" gutterBottom>{selectedAffiliate.name}</Typography>
                    {selectedAffiliate.address && (
                        <Typography variant="body1">{selectedAffiliate.address}</Typography>
                    )}
                    {selectedAffiliate.trainingType && (
                        <Typography variant="body1">
                            Training type: {selectedAffiliate.trainingType}
                        </Typography>
                    )}


                </Paper>
            )}
        </Container>
    );
};

export default Trainer;