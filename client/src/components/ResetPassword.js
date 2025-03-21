import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    Button,
    CssBaseline,
    FormControl,
    FormLabel,
    TextField,
    Typography,
    Stack,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { SitemarkIcon } from './components/CustomIcons';

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

const ResetContainer = styled(Stack)(({ theme }) => ({
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

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Extract token from URL params
        const params = new URLSearchParams(location.search);
        const resetToken = params.get('token');

        if (!resetToken) {
            setValidatingToken(false);
            setError('Invalid or missing reset token. Please request a new password reset link.');
            return;
        }

        setToken(resetToken);

        // Validate token on component mount
        const validateToken = async () => {
            try {
                // Option 1: Make a lightweight validation request
                const response = await fetch(`${API_URL}/auth/validate-reset-token?token=${resetToken}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setTokenValid(true);
                } else {
                    setError('Reset token is invalid or has expired. Please request a new password reset link.');
                }
            } catch (err) {
                console.error(err);
                setError('Server error. Please try again later.');
            } finally {
                setValidatingToken(false);
            }
        };

        // If you don't have a validation endpoint, you can skip this and validate on reset attempt
        // In that case, just set both validatingToken to false and tokenValid to true here
        setValidatingToken(false);
        setTokenValid(true);

        // validateToken(); // Uncomment if you implement the validation endpoint
    }, [location.search, API_URL]);

    const validateInputs = () => {
        let isValid = true;

        // Password validation (at least 6 characters)
        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!validateInputs()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    // Loading state
    if (validatingToken) {
        return (
            <AppTheme>
                <CssBaseline enableColorScheme />
                <ResetContainer direction="column" justifyContent="center" alignItems="center">
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Validating your reset token...
                    </Typography>
                </ResetContainer>
            </AppTheme>
        );
    }

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <ResetContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card elevation={6}>
                    <SitemarkIcon sx={{ fontSize: 48, alignSelf: 'center', mb: 2 }} />
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
                        Reset Your Password
                    </Typography>

                    <Typography variant="body1" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
                        Create a new password for your account
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                                borderRadius: '8px',
                                animation: 'fadeIn 0.5s'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success ? (
                        <>
                            <Alert
                                severity="success"
                                sx={{
                                    mb: 2,
                                    borderRadius: '8px',
                                    animation: 'fadeIn 0.5s'
                                }}
                                icon={<LockReset />}
                            >
                                Password reset successful! You'll be redirected to login in a few seconds.
                            </Alert>

                            <StyledButton
                                onClick={handleBackToLogin}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Back to Login
                            </StyledButton>
                        </>
                    ) : (
                        tokenValid ? (
                            <Box
                                component="form"
                                onSubmit={handleResetPassword}
                                noValidate
                                sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                            >
                                <StyledFormControl>
                                    <FormLabel htmlFor="password" sx={{ mb: 1, fontWeight: 500 }}>New Password</FormLabel>
                                    <TextField
                                        error={passwordError}
                                        helperText={passwordErrorMessage}
                                        id="password"
                                        name="password"
                                        placeholder="••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={passwordError ? 'error' : 'primary'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        sx={{
                                            borderRadius: '8px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                        InputProps={{
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
                                    />
                                </StyledFormControl>

                                <StyledFormControl>
                                    <FormLabel htmlFor="confirmPassword" sx={{ mb: 1, fontWeight: 500 }}>Confirm Password</FormLabel>
                                    <TextField
                                        error={confirmPasswordError}
                                        helperText={confirmPasswordErrorMessage}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••••"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={confirmPasswordError ? 'error' : 'primary'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        sx={{
                                            borderRadius: '8px',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            }
                                        }}
                                        InputProps={{
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
                                    />
                                </StyledFormControl>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                    <StyledButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                    </StyledButton>

                                    <StyledButton
                                        onClick={handleBackToLogin}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        Back to Login
                                    </StyledButton>
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: '8px'
                                    }}
                                >
                                    Invalid or expired reset token. Please request a new password reset link.
                                </Alert>

                                <StyledButton
                                    onClick={handleBackToLogin}
                                    fullWidth
                                    variant="contained"
                                >
                                    Back to Login
                                </StyledButton>
                            </>
                        )
                    )}
                </Card>
            </ResetContainer>
        </AppTheme>
    );
};

export default ResetPassword;