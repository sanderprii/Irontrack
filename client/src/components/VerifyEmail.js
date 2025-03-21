import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    Button,
    CssBaseline,
    Typography,
    Stack,
    Alert,
    Paper,
    CircularProgress
} from '@mui/material';
import { MarkEmailRead, ErrorOutline } from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { SitemarkIcon } from './components/CustomIcons';
import { AuthContext } from '../context/AuthContext';

const Card = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.5)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0, 0, 0, 0.7)'
            : '0 12px 40px rgba(0, 0, 0, 0.15)',
    }
}));

const VerifyContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '12px 0',
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'none',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
}));

const IconContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
}));

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken } = useContext(AuthContext);
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const verifyEmailToken = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');

                if (!token) {
                    setError('Invalid verification link. Please request a new one.');
                    setVerifying(false);
                    return;
                }

                const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccess(true);

                    // Store the token for auto-login
                    if (data.token) {
                        setToken(data.token);
                    }

                    // Redirect to dashboard after 3 seconds if logged in
                    setTimeout(() => {
                        navigate('/select-role');
                    }, 3000);
                } else {
                    setError(data.error || 'Email verification failed. Please try again.');
                }
            } catch (err) {
                console.error(err);
                setError('Server error. Please try again later.');
            } finally {
                setVerifying(false);
            }
        };

        verifyEmailToken();
    }, [location.search, API_URL, navigate, setToken]);

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <VerifyContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card elevation={6}>
                    <SitemarkIcon sx={{ fontSize: 48, alignSelf: 'center', mb: 2 }} />

                    {verifying ? (
                        <>
                            <IconContainer>
                                <CircularProgress size={60} />
                            </IconContainer>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.75rem, 8vw, 2rem)',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    mb: 1
                                }}
                            >
                                Verifying Your Email
                            </Typography>
                            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                Please wait while we confirm your account...
                            </Typography>
                        </>
                    ) : success ? (
                        <>
                            <IconContainer>
                                <MarkEmailRead sx={{ fontSize: 60, color: 'success.main' }} />
                            </IconContainer>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.75rem, 8vw, 2rem)',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    mb: 1
                                }}
                            >
                                Email Verified!
                            </Typography>
                            <Alert
                                severity="success"
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    animation: 'fadeIn 0.5s'
                                }}
                            >
                                Your account has been successfully verified. You'll be redirected to your dashboard shortly.
                            </Alert>
                            <StyledButton
                                onClick={handleBackToLogin}
                                fullWidth
                                variant="contained"
                            >
                                Continue to Dashboard
                            </StyledButton>
                        </>
                    ) : (
                        <>
                            <IconContainer>
                                <ErrorOutline sx={{ fontSize: 60, color: 'error.main' }} />
                            </IconContainer>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    width: '100%',
                                    fontSize: 'clamp(1.75rem, 8vw, 2rem)',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    mb: 1
                                }}
                            >
                                Verification Failed
                            </Typography>
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: '8px'
                                }}
                            >
                                {error || 'Something went wrong during verification. Please try again.'}
                            </Alert>
                            <StyledButton
                                onClick={handleBackToLogin}
                                fullWidth
                                variant="contained"
                            >
                                Back to Login
                            </StyledButton>
                        </>
                    )}
                </Card>
            </VerifyContainer>
        </AppTheme>
    );
};

export default VerifyEmail;