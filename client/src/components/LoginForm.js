import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    InputAdornment,
    Paper
} from '@mui/material';
import { Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';


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

const LoginContainer = styled(Stack)(({ theme }) => ({
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

const ForgotPasswordLink = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    textAlign: 'right',
    cursor: 'pointer',
    color: theme.palette.primary.main,
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const LoginForm = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    // Login form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    // Forgot password dialog state
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetEmailError, setResetEmailError] = useState(false);
    const [resetEmailErrorMessage, setResetEmailErrorMessage] = useState('');
    const [resetRequestSuccess, setResetRequestSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;

    const validateInputs = () => {
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!validateInputs()) {
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);

                if (data.pricingPlan) {
                    localStorage.setItem('pricingPlan', data.pricingPlan);
                }

                navigate('/select-role');
            } else {
                if (data.emailConfirmed === false) {
                    setError('Please verify your email before logging in. Check your inbox for a verification link.');
                } else {
                    setError(data.error || 'Something went wrong during login.');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Server error, please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPasswordOpen = () => {
        setForgotPasswordOpen(true);
        setResetEmail(email); // Pre-fill with login email if available
        setResetRequestSuccess(false);
    };

    const handleForgotPasswordClose = () => {
        setForgotPasswordOpen(false);
        setResetEmail('');
        setResetEmailError(false);
        setResetEmailErrorMessage('');
    };

    const validateResetEmail = () => {
        if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
            setResetEmailError(true);
            setResetEmailErrorMessage('Please enter a valid email address.');
            return false;
        }
        setResetEmailError(false);
        setResetEmailErrorMessage('');
        return true;
    };

    const handleRequestPasswordReset = async () => {
        if (!validateResetEmail()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/auth/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resetEmail }),
            });

            if (response.ok) {
                setResetRequestSuccess(true);
            } else {
                const data = await response.json();
                setResetEmailError(true);
                setResetEmailErrorMessage(data.error || 'Failed to send reset email.');
            }
        } catch (err) {
            console.error(err);
            setResetEmailError(true);
            setResetEmailErrorMessage('Server error, please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <LoginContainer direction="column" justifyContent="space-between">
                <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                <Card elevation={6}>

                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(2rem, 10vw, 2.15rem)',
                            fontWeight: 700,
                            textAlign: 'center',
                            mb: 3
                        }}
                    >
                        Welcome Back
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

                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
                    >
                        <StyledFormControl>
                            <FormLabel htmlFor="email" sx={{ mb: 1, fontWeight: 500 }}>Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                        </StyledFormControl>

                        <StyledFormControl>
                            <FormLabel htmlFor="password" sx={{ mb: 1, fontWeight: 500 }}>Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
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

                        <ForgotPasswordLink variant="body2" onClick={handleForgotPasswordOpen}>
                            Forgot password?
                        </ForgotPasswordLink>

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Log In'}
                        </StyledButton>
                    </Box>

                    <Divider sx={{ my: 3 }}>or</Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography sx={{ textAlign: 'center' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </LoginContainer>

            {/* Forgot Password Dialog */}
            <Dialog
                open={forgotPasswordOpen}
                onClose={handleForgotPasswordClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        p: 2
                    }
                }}
            >
                <DialogTitle sx={{ position: 'relative', textAlign: 'center', pb: 0 }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleForgotPasswordClose}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" component="div" fontWeight={700}>
                        Reset Password
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    {resetRequestSuccess ? (
                        <Alert
                            severity="success"
                            sx={{
                                mt: 2,
                                borderRadius: '8px',
                                animation: 'fadeIn 0.5s'
                            }}
                        >
                            Password reset link sent! Please check your email inbox.
                        </Alert>
                    ) : (
                        <>
                            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </Typography>

                            <TextField
                                error={resetEmailError}
                                helperText={resetEmailErrorMessage}
                                id="reset-email"
                                type="email"
                                label="Email"
                                placeholder="your@email.com"
                                fullWidth
                                variant="outlined"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                        </>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 0, justifyContent: resetRequestSuccess ? 'center' : 'space-between' }}>
                    {resetRequestSuccess ? (
                        <Button
                            onClick={handleForgotPasswordClose}
                            variant="contained"
                            sx={{
                                borderRadius: '8px',
                                padding: '10px 24px',
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Close
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={handleForgotPasswordClose}
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    padding: '10px 24px',
                                    textTransform: 'none',
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRequestPasswordReset}
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '10px 24px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </AppTheme>
    );
};

export default LoginForm;