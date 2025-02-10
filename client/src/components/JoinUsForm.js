import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    Link,
    TextField,
    Typography,
    Stack,
    Divider,
    Alert
} from '@mui/material';
import MuiCard from '@mui/material/Card';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,

        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function JoinUsForm() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Kontrollboole ja errormessage'id
    const [isAffiliateOwner, setIsAffiliateOwner] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Email
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    // Parool
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    // Kinnituse parool
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');

    // FullName
    const [fullNameError, setFullNameError] = useState(false);
    const [fullNameErrorMessage, setFullNameErrorMessage] = useState('');

    // API URL
    const API_URL = process.env.REACT_APP_API_URL;

    const validateInputs = () => {
        let isValid = true;

        // FullName (nõutud)
        if (!fullName.trim()) {
            setFullNameError(true);
            setFullNameErrorMessage('Full name is required.');
            isValid = false;
        } else {
            setFullNameError(false);
            setFullNameErrorMessage('');
        }

        // Email (nõutud + vormindus)
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        // Parool (nõutud, min 6 tähte)
        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        // Kinnita parool (nõutud + peab kattuma `password`)
        if (!confirmPassword || confirmPassword !== password) {
            setConfirmPasswordError(true);
            setConfirmPasswordErrorMessage('Passwords do not match.');
            isValid = false;
        } else {
            setConfirmPasswordError(false);
            setConfirmPasswordErrorMessage('');
        }

        return isValid;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateInputs()) {
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
                    affiliateOwner: isAffiliateOwner
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Registration successful!');
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.error || 'Something went wrong with registration.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error, please try again later.');
        }
    };

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card
                    variant="outlined"
                    sx={{
                        backgroundColor: 'background.paper',
                        boxShadow: '0px 4px 10px rgba(255, 179, 71, 0.5)',
                        flex: 1,
                        overflow: 'auto',
                    }}
                >
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Join Us
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}

                    <Box
                        component="form"
                        onSubmit={handleRegister}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* Full Name */}
                        <FormControl>
                            <FormLabel htmlFor="fullName">Full Name</FormLabel>
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
                            />
                        </FormControl>

                        {/* Phone (vabatahtlik) */}
                        <FormControl>
                            <FormLabel htmlFor="phone">Phone (optional)</FormLabel>
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
                            />
                        </FormControl>

                        {/* Address (vabatahtlik) */}
                        <FormControl>
                            <FormLabel htmlFor="address">Address (optional)</FormLabel>
                            <TextField
                                id="address"
                                name="address"
                                placeholder="Your address"
                                fullWidth
                                variant="outlined"
                                color="primary"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </FormControl>

                        {/* Email (nõutud) */}
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
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
                            />
                        </FormControl>

                        {/* Password (nõutud) */}
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        {/* Confirm Password (nõutud) */}
                        <FormControl>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                            <TextField
                                error={confirmPasswordError}
                                helperText={confirmPasswordErrorMessage}
                                name="confirmPassword"
                                placeholder="••••••"
                                type="password"
                                id="confirmPassword"
                                required
                                fullWidth
                                variant="outlined"
                                color={confirmPasswordError ? 'error' : 'primary'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </FormControl>

                        {/* Kasuta Affiliates */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAffiliateOwner}
                                    onChange={(e) => setIsAffiliateOwner(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Are you an Affiliate Owner?"
                        />

                        <Button type="submit" fullWidth variant="contained">
                            Join Us
                        </Button>
                    </Box>

                    <Divider>or</Divider>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign up with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => alert('Sign up with Facebook')}
                            startIcon={<FacebookIcon />}
                        >
                            Sign up with Facebook
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link href="/login" variant="body2">
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
