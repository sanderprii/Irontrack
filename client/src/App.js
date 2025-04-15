import React, {useState, useContext, useCallback, useEffect} from 'react';
import {HelmetProvider} from 'react-helmet-async';
import {Routes, Route, Navigate} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// ✅ Impordi AppTheme
import AppTheme from './shared-theme/AppTheme';
import {AuthContext} from './context/AuthContext';
import { Helmet } from 'react-helmet-async';
import './App.css';

// Impordi muud komponendid
import ResponsiveNavbar from './components/ResponsiveNavbar';
import HomePage from './pages/HomePage';

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
import Trainer from "./pages/Trainer";
import Help from "./pages/Help";
import PrivacyApp from "./pages/Privacy-app"
import PrivacyPolicy from "./pages/PrivacyPolicy";
import VerifyEmail from './components/VerifyEmail';
import ResetPassword from './components/ResetPassword';
import Checkin from './pages/Checkin';
import Admin from './pages/Admin';
import PullToRefresh from './components/PullToRefresh';

const HomeRedirect = () => {
    const {isLoggedIn} = useContext(AuthContext);// Assuming you have an auth context with these values
    const userRole = localStorage.getItem("role");
    // Redirect to training diary if logged in as regular user
    if (isLoggedIn && userRole === 'regular') {
        return <Navigate to="/training-diary" replace/>;
    } else if (isLoggedIn && userRole === 'affiliate') {
        return <Navigate to="/affiliate-owner" replace/>;
    }

    // Otherwise, show the normal homepage
    return <HomePage/>;
};

function App() {
    const [isPWA, setIsPWA] = useState(false);
    const [showRefreshMessage, setShowRefreshMessage] = useState(false);

    useEffect(() => {
        // Kontrollime, kas rakendus töötab PWA režiimis
        const checkIfPWA = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
            const isIosPWA = window.navigator.standalone === true;
            return isStandalone || isFullscreen || isIosPWA;
        };

        setIsPWA(checkIfPWA());

        // Kuulame display-mode muutusi
        const mediaQueryList = window.matchMedia('(display-mode: standalone)');
        const handleChange = (e) => {
            setIsPWA(e.matches || checkIfPWA());
        };

        // Lisame kuulari
        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener('change', handleChange);
        } else if (mediaQueryList.addListener) { // vanemate brauserite tugi
            mediaQueryList.addListener(handleChange);
        }

        // Puhastame kuulari
        return () => {
            if (mediaQueryList.removeEventListener) {
                mediaQueryList.removeEventListener('change', handleChange);
            } else if (mediaQueryList.removeListener) {
                mediaQueryList.removeListener(handleChange);
            }
        };
    }, []);

    // Funktsioon, mis värskendab rakenduse andmeid
    const handleRefresh = useCallback(async () => {
        try {
            console.log("Värskendamine algas...");

            // Näitame teadet
            setShowRefreshMessage(true);

            // Ootame natuke, et kasutaja näeks efekti
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Värskendame lehe
            window.location.reload();

            return { success: true };
        } catch (error) {
            console.error("Värskendamine ebaõnnestus:", error);
            throw error;
        }
    }, []);

    // Sulgeme teate
    const handleCloseMessage = () => {
        setShowRefreshMessage(false);
    };

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
                    <CssBaseline/>
                    <Box>
                        <Routes>
                            <Route path="/" element={<MarketingPage/>}/>
                            <Route path="/classes" element={<Classes/>}/>
                            <Route path="/checkin" element={<Checkin/>}/>
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
                <CssBaseline/>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    {/* PWA-spetsiifiline meta tag */}
                    {isPWA && (
                        <meta name="apple-mobile-web-app-capable" content="yes" />
                    )}
                </Helmet>
                <ResponsiveNavbar/>
                {/* Mähime kogu rakenduse sisu PullToRefresh komponendiga */}
                <PullToRefresh onRefresh={handleRefresh}>
                    <Box
                        sx={{
                            // Kui on mobiilivaade ja kasutaja on sisse logitud (st bottom nav on nähtav)
                            // jätame ekraani alla tühja ruumi
                            pb: '56px',
                            width: '100%',
                            height: isPWA ? '100%' : 'auto',
                            minHeight: 'calc(100vh - 56px)', // Lahuta bottom nav kõrgus
                            overflowX: 'hidden',
                            // PWA režiimis on vaja eraldi juurdepääsu Y-kerimisele
                            overflowY: isPWA ? 'auto' : 'visible'
                        }}
                    >
                        <Routes>
                            <Route path="/" element={<HomeRedirect/>}/>

                            <Route path="/trainings" element={<TrainingsPage/>}/>
                            <Route path="/records" element={<RecordsPage/>}/>
                            <Route path="/find-users" element={<FindUsersPage/>}/>
                            <Route path="/register-training" element={<RegisterTrainingPage/>}/>
                            <Route path="/my-profile" element={<MyProfile/>}/>
                            <Route path="/login" element={<LoginForm/>}/>
                            <Route path="/register" element={<JoinUsForm/>}/>
                            <Route path="/select-role" element={<RoleSelectionPage/>}/>
                            <Route path="/training-diary" element={<TrainingDiaryPage/>}/>
                            <Route path="/affiliate-owner" element={<AffiliateOwnerPage/>}/>
                            <Route path="/my-affiliate" element={<MyAffiliate/>}/>
                            <Route path="/classes" element={<Classes/>}/>
                            <Route path="/members" element={<Members/>}/>
                            <Route path="/plans" element={<Plans/>}/>
                            <Route path="/Messages" element={<Messages/>}/>
                            <Route path="/checkout" element={<Checkout/>}/>
                            <Route path="/pricing" element={<Pricing/>}/>
                            <Route path="/marketing" element={<MarketingPage/>}/>
                            <Route path="/trainer" element={<Trainer/>}/>
                            <Route path="/help" element={<Help/>}/>
                            <Route path="/privacy-app" element={<PrivacyApp/>}/>
                            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                            <Route path="/verify-email" element={<VerifyEmail/>}/>
                            <Route path="/reset-password" element={<ResetPassword/>}/>
                            <Route path="/checkin" element={<Checkin/>}/>
                            <Route path="/admin" element={<Admin/>}/>
                        </Routes>
                    </Box>
                </PullToRefresh>

                {/* Teade värskendamise kohta */}
                <Snackbar
                    open={showRefreshMessage}
                    autoHideDuration={2000}
                    onClose={handleCloseMessage}
                    message="Värskendamine..."
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                />
            </AppTheme>
        </HelmetProvider>
    );
}

export default App;