import React, { useState, useEffect } from 'react';
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
    IconButton,
    CircularProgress,
    Tooltip,
    Fade,
    Chip
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Phone,
    Home,
    Key,
    VerifiedUser,
    CheckCircle,
    Warning,
    Error,
    Verified
} from '@mui/icons-material';
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

const VerifyButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    fontWeight: 600,
    textTransform: 'none',
    minWidth: '100px',
    marginLeft: theme.spacing(1),
    height: '56px', // Match height with TextField
}));

const ValidationResultChip = styled(Chip)(({ theme, category }) => ({
    marginTop: theme.spacing(1),
    fontWeight: 500,
    backgroundColor: category === 'valid' || category === 'basic_valid'
        ? theme.palette.success.light
        : category === 'risky'
            ? theme.palette.warning.light
            : category === 'invalid'
                ? theme.palette.error.light
                : theme.palette.grey[300],
    color: category === 'valid' || category === 'basic_valid'
        ? theme.palette.success.contrastText
        : category === 'risky'
            ? theme.palette.warning.contrastText
            : category === 'invalid'
                ? theme.palette.error.contrastText
                : theme.palette.text.primary,
    '& .MuiChip-icon': {
        color: 'inherit'
    }
}));

export default function JoinUsForm() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
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

    // Email validation state
    const [isValidatingEmail, setIsValidatingEmail] = useState(false);
    const [emailValidationResult, setEmailValidationResult] = useState(null);
    const [showValidationResult, setShowValidationResult] = useState(false);
    const [emailsMatch, setEmailsMatch] = useState(true);

    // Validation error states
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [confirmEmailError, setConfirmEmailError] = useState(false);
    const [confirmEmailErrorMessage, setConfirmEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [fullNameError, setFullNameError] = useState(false);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');

    // API URL
    const API_URL = process.env.REACT_APP_API_URL;

    // Basic email format validation
    const validateBasicEmailFormat = (emailToValidate) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(emailToValidate);
    };

    // Email validation function
    const validateEmailAddress = async () => {
        // First check if email has basic valid format
        if (!email || !validateBasicEmailFormat(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address');
            return;
        }

        setIsValidatingEmail(true);
        setShowValidationResult(false);

        try {
            // Try API validation
            const response = await fetch(`${API_URL}/auth/validate-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            // Handle API errors like quota limits
            if (response.status === 402 || response.status === 429) {
                // Fallback to basic validation if API quota is exceeded
                setEmailValidationResult({
                    category: 'basic_valid',
                    details: 'Basic format validation passed',
                    valid: true
                });
                setEmailError(false);
                setEmailErrorMessage('');
            } else {
                const data = await response.json();
                setEmailValidationResult(data);

                // Update email error state based on validation result
                if (data.category === 'invalid') {
                    setEmailError(true);
                    setEmailErrorMessage(`Invalid email: ${data.details}`);
                } else if (data.category === 'risky') {
                    setEmailError(true);
                    setEmailErrorMessage(`Warning: ${data.details}`);
                } else if (data.category === 'valid' || data.category === 'basic_valid') {
                    setEmailError(false);
                    setEmailErrorMessage('');
                }
            }
        } catch (err) {
            console.error('Email validation error:', err);
            // Use basic validation as fallback on errors
            if (validateBasicEmailFormat(email)) {
                setEmailValidationResult({
                    category: 'basic_valid',
                    details: 'Basic format validation passed',
                    valid: true
                });
                setEmailError(false);
                setEmailErrorMessage('');
            } else {
                setEmailValidationResult({
                    category: 'invalid',
                    details: 'Invalid email format',
                    valid: false
                });
                setEmailError(true);
                setEmailErrorMessage('Invalid email format');
            }
        } finally {
            setIsValidatingEmail(false);
            setShowValidationResult(true);
        }
    };

    // Handle verify button click
    const handleVerifyEmail = (e) => {
        e.preventDefault();
        if (email) {
            validateEmailAddress();
        } else {
            setEmailError(true);
            setEmailErrorMessage('Please enter an email address');
        }
    };

    // Check if emails match and update relevant states
    const checkEmailsMatch = () => {
        if (confirmEmail) {
            if (email !== confirmEmail) {
                setConfirmEmailError(true);
                setConfirmEmailErrorMessage('Emails do not match');
                setEmailsMatch(false);
            } else {
                setConfirmEmailError(false);
                setConfirmEmailErrorMessage('');
                setEmailsMatch(true);
            }
        } else {
            // If confirmEmail is empty, we don't show an error yet
            setEmailsMatch(true);
        }
    };

    // Validate confirm email whenever either email or confirm email changes
    useEffect(() => {
        checkEmailsMatch();
    }, [email, confirmEmail]);

    // Reset validation results when email changes
    useEffect(() => {
        if (emailValidationResult) {
            setShowValidationResult(false);
            setEmailValidationResult(null);
        }
    }, [email]);

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

        // Basic Email validation
        if (!email || !validateBasicEmailFormat(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            // If we have a validation result that shows the email is invalid, keep the error
            if (emailValidationResult && emailValidationResult.category === 'invalid') {
                setEmailError(true);
                setEmailErrorMessage(`Invalid email: ${emailValidationResult.details}`);
                isValid = false;
            }
        }

        // Confirm email validation
        if (!confirmEmail || confirmEmail !== email) {
            setConfirmEmailError(true);
            setConfirmEmailErrorMessage('Emails do not match.');
            isValid = false;
        } else {
            setConfirmEmailError(false);
            setConfirmEmailErrorMessage('');
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

        // Additional check for email validation
        if (emailValidationResult && emailValidationResult.category === 'invalid') {
            setError(`This email cannot be used: ${emailValidationResult.details}`);
            setIsSubmitting(false);
            return;
        }

        // Show warning but allow to continue for 'risky' emails
        if (emailValidationResult && emailValidationResult.category === 'risky') {
            console.warn(`Proceeding with risky email: ${emailValidationResult.details}`);
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
                setConfirmEmail('');
                setPassword('');
                setConfirmPassword('');
                setAcceptedTerms(false);
                setIsAffiliateOwner(false);
                setEmailValidationResult(null);
                setShowValidationResult(false);

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

    // Helper function to get color for email validation
    const getEmailFieldColor = () => {
        if (emailError) return 'error';
        if (emailValidationResult && showValidationResult) {
            if (emailValidationResult.category === 'valid' || emailValidationResult.category === 'basic_valid')
                return 'success';
            if (emailValidationResult.category === 'risky')
                return 'warning';
        }
        return 'primary';
    };

    // Get validation icon based on result
    const getValidationIcon = () => {
        if (!emailValidationResult || !showValidationResult) return null;

        if (emailValidationResult.category === 'valid' || emailValidationResult.category === 'basic_valid') {
            return <CheckCircle />;
        } else if (emailValidationResult.category === 'risky') {
            return <Warning />;
        } else if (emailValidationResult.category === 'invalid') {
            return <Error />;
        }

        return null;
    };

    // Get validation message based on result
    const getValidationMessage = () => {
        if (!emailValidationResult || !showValidationResult) return '';

        if (emailValidationResult.category === 'valid') {
            return 'Email is valid and safe to use';
        } else if (emailValidationResult.category === 'basic_valid') {
            return 'Email format is valid';
        } else if (emailValidationResult.category === 'risky') {
            return emailValidationResult.details;
        } else if (emailValidationResult.category === 'invalid') {
            return emailValidationResult.details;
        }

        return '';
    };

    // Get tooltip message for verify button
    const getVerifyTooltipMessage = () => {
        if (!email) {
            return "Please enter an email address first";
        } else if (confirmEmail && !emailsMatch) {
            return "Emails must match before verification";
        } else if (isValidatingEmail) {
            return "Verifying email...";
        }
        return "";
    };

    // Should the verify button be disabled?
    const isVerifyButtonDisabled = () => {
        return isValidatingEmail || !email || (confirmEmail && !emailsMatch);
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
                                        Full Name (required)
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

                                {/* Email with Verify Button */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="email" sx={{ mb: 1, fontWeight: 500 }}>
                                        Email
                                    </FormLabel>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
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
                                            color={getEmailFieldColor()}
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
                                        <Tooltip
                                            title={getVerifyTooltipMessage()}
                                            arrow
                                            placement="top"
                                            disableHoverListener={!isVerifyButtonDisabled()}
                                        >
                                            <span> {/* Wrapper span is needed for disabled buttons in tooltips */}
                                                <VerifyButton
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleVerifyEmail}
                                                    disabled={isVerifyButtonDisabled()}
                                                    sx={{
                                                        mt: isMobile ? 1 : 0,
                                                        width: isMobile ? '100%' : 'auto',
                                                    }}
                                                >
                                                    {isValidatingEmail ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        <>
                                                            <Verified sx={{ mr: 1 }} />
                                                            Verify
                                                        </>
                                                    )}
                                                </VerifyButton>
                                            </span>
                                        </Tooltip>
                                    </Box>

                                    {/* Validation Result Chip */}
                                    <Fade in={showValidationResult && !!emailValidationResult}>
                                        <Box sx={{ mt: 1 }}>
                                            {emailValidationResult && showValidationResult && (
                                                <ValidationResultChip
                                                    icon={getValidationIcon()}
                                                    label={getValidationMessage()}
                                                    category={emailValidationResult.category}
                                                    variant="filled"
                                                />
                                            )}
                                        </Box>
                                    </Fade>
                                </StyledFormControl>

                                {/* Confirm Email */}
                                <StyledFormControl fullWidth>
                                    <FormLabel htmlFor="confirmEmail" sx={{ mb: 1, fontWeight: 500 }}>
                                        Confirm Email
                                    </FormLabel>
                                    <TextField
                                        error={confirmEmailError}
                                        helperText={confirmEmailErrorMessage}
                                        id="confirmEmail"
                                        type="email"
                                        name="confirmEmail"
                                        placeholder="john@smith.com"
                                        autoComplete="email"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={confirmEmailError ? 'error' : confirmEmail && !confirmEmailError ? 'success' : 'primary'}
                                        value={confirmEmail}
                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            ),
                                            endAdornment: confirmEmail && (
                                                <InputAdornment position="end">
                                                    {!confirmEmailError && confirmEmail ?
                                                        <VerifiedUser color="success" /> : null}
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
                                        Phone (required)
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
                                disabled={isSubmitting || !acceptedTerms || isValidatingEmail}
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