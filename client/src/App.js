import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// ✅ Impordi AppTheme
import AppTheme from './shared-theme/AppTheme';



// Impordi muud komponendid
import ResponsiveNavbar from './components/ResponsiveNavbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TrainingsPage from './pages/TrainingsPage';
import RecordsPage from './pages/RecordsPage';
import FindUsersPage from './pages/FindUsersPage';
import RegisterTrainingPage from './pages/RegisterTrainingPage';
import MyProfile from './pages/MyProfile';
import LoginForm from "./components/LoginForm";
import JoinUsForm from "./components/JoinUsForm";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import TrainingDiaryPage from "./pages/TrainingDiaryPage";
import AffiliateOwnerPage from "./pages/AffiliateOwnerPage";
import MyAffiliate from "./pages/MyAffiliate";
import Classes from "./pages/Classes";
import Members from "./pages/Members";
import Plans from "./pages/Plans";
import Messages from "./pages/Messages";
import Pricing from "./pages/Pricing";
import MarketingPage from "./pages/MarketingPage";
import Checkout from "./pages/Checkout";

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const hostname = window.location.hostname;

    // Check if we're on a subdomain
    const isSubdomain =
        ((hostname.includes('localhost') && hostname !== 'localhost' && hostname.includes('.')) ||
            (hostname !== 'irontrack.ee' && hostname !== 'www.irontrack.ee' && hostname.split('.').length > 2));

    // If we're on a subdomain, only show the marketing page
    if (isSubdomain) {
        return (
            <HelmetProvider>
                <AppTheme>
                    <CssBaseline />
                    <Box>
                        <Routes>
                            <Route path="/" element={<MarketingPage />} />
                            <Route path="/classes" element={<Classes />} />
                            {/* Lisa vajadusel teisi marsruute */}
                        </Routes>
                    </Box>
                </AppTheme>
            </HelmetProvider>
        );
    }

    return (
        <HelmetProvider>
        <AppTheme>  {/* ✅ Kasutame AppTheme kogu rakenduse ümber */}
            <CssBaseline />
            <ResponsiveNavbar />
            <Box
                sx={{
                    // Kui on mobiilivaade ja kasutaja on sisse logitud (st bottom nav on nähtav)
                    // jätame ekraani alla tühja ruumi
                    pb:'56px',
                }}
            >
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/trainings" element={<TrainingsPage />} />
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/find-users" element={<FindUsersPage />} />
                <Route path="/register-training" element={<RegisterTrainingPage />} />
                <Route path="/my-profile" element={<MyProfile token={token} />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<JoinUsForm />} />
                <Route path="/select-role" element={<RoleSelectionPage />} />
                <Route path="/training-diary" element={<TrainingDiaryPage />} />
                <Route path="/affiliate-owner" element={<AffiliateOwnerPage />} />
                <Route path="/my-affiliate" element={<MyAffiliate token={token} />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/members" element={<Members />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/Messages" element={<Messages />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/marketing" element={<MarketingPage />} />

                {/* ✅ Lisa MarketingPage uue marsruudina */}

            </Routes>
            </Box>
        </AppTheme>
        </HelmetProvider>
    );
}

export default App;
