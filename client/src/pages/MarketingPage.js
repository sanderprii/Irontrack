import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';

const API_URL = process.env.REACT_APP_API_URL

const HeroSection = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(8, 0),
    marginBottom: theme.spacing(4),
}));

function MarketingPage() {
    const [affiliate, setAffiliate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAffiliateBySubdomain = async () => {
            try {
                const hostname = window.location.hostname;
                let subdomain;

                // Extract subdomain differently for localhost vs production
                if (hostname.includes('localhost')) {
                    subdomain = hostname.split('.')[0];
                } else {
                    subdomain = hostname.split('.')[0];
                }

                console.log('Detected subdomain:', subdomain);

                // This endpoint will detect the subdomain from the hostname
                const response = await fetch (`${API_URL}/affiliate-by-subdomain?subdomain=${subdomain}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // See samm on oluline!
                setAffiliate(data);
                console.log('Response:', data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching affiliate:', err);
                setError('Failed to load affiliate information');
                setLoading(false);
            }
        };

        fetchAffiliateBySubdomain();
    }, []);

    if (loading) return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <Typography>Loading...</Typography>
            </Box>
        </Container>
    );

    if (error) return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        </Container>
    );

    if (!affiliate) return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <Typography>Affiliate not found</Typography>
            </Box>
        </Container>
    );

    return (
        <Box>
            <Helmet>
                <title>{affiliate.name} | IronTrack</title>
                <meta name="description" content={`${affiliate.name} - ${affiliate.trainingType} in ${affiliate.address}`} />
            </Helmet>

            <HeroSection>
                <Container>
                    <Box sx={{ textAlign: 'center' }}>
                        {affiliate.logo && (
                            <Box sx={{ mb: 3 }}>
                                <img
                                    src={affiliate.logo}
                                    alt={`${affiliate.name} logo`}
                                    style={{ maxHeight: '120px' }}
                                />
                            </Box>
                        )}
                        <Typography variant="h2" component="h1" gutterBottom>
                            {affiliate.name}
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {affiliate.trainingType}
                        </Typography>
                    </Box>
                </Container>
            </HeroSection>

            <Container>
                <Grid container spacing={4}>
                    {/* About Section */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    About Us
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    We are a {affiliate.trainingType} facility located at {affiliate.address}.
                                </Typography>
                                {affiliate.email && (
                                    <Typography variant="body2">
                                        Email: {affiliate.email}
                                    </Typography>
                                )}
                                {affiliate.phone && (
                                    <Typography variant="body2">
                                        Phone: {affiliate.phone}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Classes Section */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Our Classes
                                </Typography>
                                {affiliate.ClassSchedule && affiliate.ClassSchedule.length > 0 ? (
                                    affiliate.ClassSchedule.slice(0, 5).map((class_) => (
                                        <Box key={class_.id} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1">{class_.trainingName}</Typography>
                                            <Typography variant="body2">
                                                {new Date(class_.time).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>No classes scheduled at the moment.</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Trainers Section */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Our Trainers
                                </Typography>
                                <Grid container spacing={2}>
                                    {affiliate.trainers && affiliate.trainers.length > 0 ? (
                                        affiliate.trainers.map((trainerRel) => (
                                            <Grid item xs={12} sm={6} md={4} key={trainerRel.trainer.id}>
                                                <Box>
                                                    <Typography variant="subtitle1">
                                                        {trainerRel.trainer.fullName}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography>No trainers listed at the moment.</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* CTA Section */}

            </Container>
        </Box>
    );
}

export default MarketingPage;