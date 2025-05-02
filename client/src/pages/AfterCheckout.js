import React from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Divider,
} from '@mui/material';
import {CheckCircleOutline, CheckCircleOutline as CheckIcon} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const AfterCheckout = () => {
    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: '#fff'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <CheckIcon
                        color="success"
                        sx={{ fontSize: 64, mb: 2 }}
                    />

                    <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                        Payment Successful!
                    </Typography>

                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Your plan is now active and you can start using all available features.
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        What's next?
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
                        {[
                            'View the class schedule and book your next training',
                            'Complete your profile information',
                            'Check out available classes'
                        ].map((text, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircleOutline sx={{ color: 'success.main', mr: 2 }} />
                                <Typography variant="body1">{text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    gap: 2
                }}>



                </Box>
            </Paper>
        </Container>
    );
};

export default AfterCheckout;