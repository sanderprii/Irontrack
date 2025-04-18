import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    TextField,
    Typography,
    Stack,
    Divider,
    Alert,
    Paper,
    Grid,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Phone, Home, Key } from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';

import ContractTermsModal from './ContractTermsModal';

const Card = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.5)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0, 0, 0, 0.7)'
            : '0 12px 40px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.up('md')]: {
        maxWidth: '900px',
    },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100vh',
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    marginBottom: theme.spacing(2),
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

export default function JoinUsForm() {
    const navigate = useNavigate();
    const theme = useTheme();

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsModalOpen, setTermsModalOpen] = useState(false);
    const [termsId, setTermsId] = useState('');
    const [isAffiliateOwner, setIsAffiliateOwner] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation error states
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [fullNameError, setFullNameError] = useState(false);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');

    // API URL
    const API_URL = process.env.REACT_APP_API_URL;

    const validateInputs = () => {
        let isValid = true;

        // Full Name validation
        if (!fullName.trim()) {
            setFullNameError(true);
            setFullNameErrorMessage('Full name is required.');
            isValid = false;
        } else {
            setFullNameError(false);
            setFullNameErrorMessage('');
        }

        // Email validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // Password validation (min 6 characters)
        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        // Confirm password validation
        if (!confirmPassword || confirmPassword !== password) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        // Terms acceptance validation
        if (!acceptedTerms) {
            setError('You must accept the terms and conditions');
            isValid = false;
        } else {
            setError('');
        }

        return isValid;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!validateInputs()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    phone,
                    address,
                    email,
                    password,
                    affiliateOwner: isAffiliateOwner,
                    isAcceptedTerms: acceptedTerms
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(
                    'Registration successful! Please check your email to verify your account before logging in.'
                );

                // Clear form
                setFullName('');
                setPhone('');
                setAddress('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAcceptedTerms(false);
                setIsAffiliateOwner(false);

                // Automatically redirect to login after 5 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                setError(data.error || 'Something went wrong with registration.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error, please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openTerms = () => {
        setTermsId('register');
        setTermsModalOpen(true);
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1100 }} />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card elevation={6}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>

                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                                fontWeight: 700,
                            }}
                        >
                            Join Us
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Create an account to get started with IronTrack
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: '8px',
                                animation: 'fadeIn 0.5s'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: '8px',
                                animation: 'fadeIn 0.5s'
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleRegister}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Grid container spacing={3}>
                            {/* Left column */}
                            <Grid item xs={12} md={6}>
                                {/* Full Name */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="fullName" sx={{ mb: 1, fontWeight: 500 }}>
                                        Full Name
                                    </FormLabel>
                                    <TextField
                                        error={fullNameError}
                                        helperText={fullNameErrorMessage}
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Smith"
                                        autoComplete="name"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={fullNameError ? 'error' : 'primary'}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>

                                {/* Email */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="email" sx={{ mb: 1, fontWeight: 500 }}>
                                        Email
                                    </FormLabel>
                                    <TextField
                                        error={emailError}
                                        helperText={emailErrorMessage}
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="john@smith.com"
                                        autoComplete="email"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={emailError ? 'error' : 'primary'}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>

                                {/* Phone (optional) */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="phone" sx={{ mb: 1, fontWeight: 500 }}>
                                        Phone (optional)
                                    </FormLabel>
                                    <TextField
                                        id="phone"
                                        name="phone"
                                        placeholder="+123456789"
                                        autoComplete="tel"
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Phone />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>
                            </Grid>

                            {/* Right column */}
                            <Grid item xs={12} md={6}>
                                {/* Password */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="password" sx={{ mb: 1, fontWeight: 500 }}>
                                        Password
                                    </FormLabel>
                                    <TextField
                                        error={passwordError}
                                        helperText={passwordErrorMessage}
                                        name="password"
                                        placeholder="••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={passwordError ? 'error' : 'primary'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Key />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>

                                {/* Confirm Password */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="confirmPassword" sx={{ mb: 1, fontWeight: 500 }}>
                                        Confirm Password
                                    </FormLabel>
                                    <TextField
                                        error={confirmPasswordError}
                                        helperText={confirmPasswordErrorMessage}
                                        name="confirmPassword"
                                        placeholder="••••••"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={confirmPasswordError ? 'error' : 'primary'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Key />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>

                                {/* Address (optional) */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="address" sx={{ mb: 1, fontWeight: 500 }}>
                                        Address (optional)
                                    </FormLabel>
                                    <TextField
                                        id="address"
                                        name="address"
                                        placeholder="Your address"
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Home />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                    />
                                </StyledFormControl>
                            </Grid>
                        </Grid>

                        {/* Full width elements */}
                        <Box sx={{ mt: 2 }}>
                            {/* Affiliate Owner Checkbox */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAffiliateOwner}
                                        onChange={(e) => setIsAffiliateOwner(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Are you an Affiliate Owner?"
                                sx={{ mb: 1 }}
                            />

                            {/* Terms and Conditions */}
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{
                                    mb: 3,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'flex-start', sm: 'center' }
                                }}
                            >
                                <Box display="flex" alignItems="center">
                                    <Checkbox
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography>
                                        I have read and understand Terms and Conditions
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openTerms();
                                    }}
                                    size="small"
                                    sx={{
                                        ml: { xs: 0, sm: 2 },
                                        mt: { xs: 1, sm: 0 },
                                        borderRadius: '8px',
                                        textTransform: 'none'
                                    }}
                                >
                                    Open Terms
                                </Button>
                            </Box>

                            <StyledButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isSubmitting || !acceptedTerms}
                                sx={{ mb: 3 }}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </StyledButton>
                        </Box>

                        <Divider sx={{ mb: 3 }}>or</Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'none' }}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Card>
                <ContractTermsModal
                    open={termsModalOpen}
                    onClose={() => setTermsModalOpen(false)}
                    termsId={termsId}
                />
            </SignUpContainer>
        </AppTheme>
    );
}