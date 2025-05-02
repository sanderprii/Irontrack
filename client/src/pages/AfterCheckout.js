import React from 'react';
import { Container, Typography } from '@mui/material';


// Rename this component to AfterCheckout instead of RegisterPage
const AfterCheckout = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Payment was successful! Your plan is now active.
            </Typography>

        </Container>
    );
};

// Export with the correct name
export default AfterCheckout;