import * as React from 'react';
import {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import {ThemeContext} from '../shared-theme/AppTheme';
import {Link, useNavigate, useLocation} from 'react-router-dom';

// MUI komponendid
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI ikoonid
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // 🌙 Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // ☀️ Light mode icon
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; // Trainings
import AssignmentIcon from '@mui/icons-material/Assignment';       // Records
import AddBoxIcon from '@mui/icons-material/AddBox';               // Register for Training
import PersonIcon from '@mui/icons-material/Person';               // My Profile
import StoreIcon from '@mui/icons-material/Store';                 // My Affiliate
import ClassIcon from '@mui/icons-material/Class';                 // Classes
import GroupIcon from '@mui/icons-material/Group';                 // Members
import EventNoteIcon from '@mui/icons-material/EventNote';         // Plans
import MailIcon from '@mui/icons-material/Mail';                   // Messages
import LogoutIcon from '@mui/icons-material/Logout';
import HelpIcon from '@mui/icons-material/Help';
// BottomNavigation
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,

    backdropFilter: 'blur(24px)',
    border: '1px solid',

    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],

}));

export default function AppAppBar() {
    const {isLoggedIn, role, logout} = useContext(AuthContext);
    const {mode, toggleTheme} = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Avatud/ suletud mobiilne Drawer menüü (hamburger)
    const [open, setOpen] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const pricingPlan = localStorage.getItem('pricingPlan');

    // Kontrollime, kas ekraani laius on väiksem kui "md"
    // et näidata kas ülemist menüüd (desktop) või alumist nav'i (mobiil).
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    // --------------------------------
    // ÜLEMINE NAV-BAR: Desktopi menüü
    // --------------------------------
    let leftLinks = [];
    let rightLinks = [];

    if (!isLoggedIn) {
        // Mitte sisse logitud kasutaja
        leftLinks = [
            {name: 'Home', to: '/'},
            {name: 'Pricing', to: '/pricing'},
            {name: 'About', to: '/about'},
            {name: 'Privacy Policy', to: '/privacy-policy'},
        ];
        rightLinks = [
            {name: 'Log In', to: '/login'},
            {name: 'Join Us', to: '/register'},
        ];
    } else {
        // Sisse logitud
        if (role === 'regular') {
            // Regulaarne kasutaja
            leftLinks = [
                {name: 'Trainings', to: '/trainings'},
                {name: 'Records', to: '/records'},
                {name: 'Register for Training', to: '/register-training'},
            ];
            rightLinks = [
                {name: 'My Profile', to: '/my-profile'},

            ];
        } else if (role === 'affiliate') {
            // Affiliate
            leftLinks = [
                {name: 'My Affiliate', to: '/my-affiliate'},
                {name: 'Classes', to: '/classes'},
                {name: 'Members', to: '/members'},
                {name: 'Plans', to: '/plans'},
                ...(pricingPlan === 'premium' ? [{name: 'Messages', to: '/messages'}] : [])
            ];


        } else if (role === 'trainer') {
            leftLinks = [
                {name: 'Classes', to: '/classes'},
                {name: 'Members', to: '/members'},
            ];

        }
    }

    // --------------------------------
    // ALUMINE NAV-BAR: Mobiilivaate menüü
    // --------------------------------
    // Defineerime rollipõhised nupud koos ikoonidega.
    // value: unikaalne string, mida saame kasutada 'BottomNavigation' value-kontrolliks.
    // to: link, kuhu suunata
    // label, icon, etc.
    let bottomNavItems = [];
    if (isLoggedIn && role === 'regular') {
        bottomNavItems = [
            {value: '/trainings', label: 'Trainings', icon: <FitnessCenterIcon/>},
            {value: '/records', label: 'Records', icon: <AssignmentIcon/>},
            {value: '/register-training', label: 'Register', icon: <AddBoxIcon/>},
            {value: '/my-profile', label: 'Profile', icon: <PersonIcon/>},
        ];
    } else if (isLoggedIn && role === 'affiliate') {
        bottomNavItems = [
            {value: '/my-affiliate', label: 'Affiliate', icon: <StoreIcon/>},
            {value: '/classes', label: 'Classes', icon: <ClassIcon/>},
            {value: '/members', label: 'Members', icon: <GroupIcon/>},
            {value: '/plans', label: 'Plans', icon: <EventNoteIcon/>},
            {value: '/messages', label: 'Messages', icon: <MailIcon/>},
        ];
    } else if (isLoggedIn && role === 'trainer') {
        bottomNavItems = [
            {value: '/classes', label: 'Classes', icon: <ClassIcon/>},
            {value: '/members', label: 'Members', icon: <GroupIcon/>},
        ];
    }

    // Leiame, milline tab on aktiivne vastavalt praegusele URL-ile (location.pathname).
    // Kui 'location.pathname' on täpne, valime sama bottomNavItem.value.
    // Lihtsuse mõttes võib kasutada: item.value === location.pathname ?
    // Kui aga teed nested route'e vms, siis peab sobivuse loogikat täiendama.
    const currentValue = bottomNavItems.find(item => location.pathname.startsWith(item.value))?.value || '';

    const handleBottomNavChange = (event, newValue) => {
        // Suuname React Routeri abil
        navigate(newValue);
    };

    // --------------------------------
    // JSX struktuur
    // --------------------------------


    return (
        <>
            {/* Ülemine AppBar - alati nähtav, kuid menüünupud on nähtavad ainult desktopis */}
            <AppBar position="static" enableColorOnDark
                    sx={{boxShadow: 0, backgroundColor: 'transparent', width: '100vw'}}>

                <StyledToolbar variant="dense" disableGutters
                               sx={{borderBottom: {xs: '2px solid #cccccc', md: 'none'}}}>

                    {/* NAVIGATION MOBILE VIEW */}
                    <Box sx={{
                        width: '100%',
                        display: {xs: 'flex', md: 'none'},
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>


                        {/* Keskel: Favicon pilt */}
                        <Box sx={{flexGrow: 1, display: 'flex', ml: 1}}>
                            <img
                                src="/favicon.png"
                                alt="App Logo"
                                style={{height: '40px', cursor: 'pointer'}}
                                onClick={() => navigate(role === 'regular' ? '/training-diary' : role === 'affiliate' ? '/affiliate-owner' : role === 'trainer' ? '/trainer' : '/')}
                            />
                        </Box>
                        {role === null && (
                            <Box sx={{display: {xs: 'flex', md: 'flex'}, gap: 1, ml: 2}}>


                                {leftLinks.map((link) =>
                                    link.action ? (
                                        <Button
                                            key={link.name}
                                            onClick={link.action}
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            {link.name}
                                        </Button>
                                    ) : (
                                        <Button
                                            key={link.name}
                                            component={Link}
                                            to={link.to}
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            {link.name}
                                        </Button>
                                    )
                                )}
                            </Box>
                        )}

                        {/* Paremal: Logout-nupp */}
                        <HelpIcon color="primary"


                                  onClick={() => navigate('/help')}/>
                        {isLoggedIn ? (
                            <IconButton color="primary" onClick={() => logout(navigate)} sx={{mr: 1}}>
                                <LogoutIcon/>
                            </IconButton>

                        ) : (
                            <IconButton color="primary" onClick={() => navigate('/login')} sx={{mr: 1}}>
                                <PersonIcon/>
                            </IconButton>

                        )}
                    </Box>

                    {/* Vasakul Logo */}
                    <Box sx={{display: {xs: 'none', md: 'flex'}, ml: 2, flexGrow: 1, alignItems: 'center', px: 0}}>
                        <img
                            src="/logo2.png"
                            alt="Irontrack Logo"
                            style={{height: '50px', cursor: 'pointer'}}
                            onClick={() => navigate(role === 'regular' ? '/training-diary' : role === 'affiliate' ? '/affiliate-owner' : role === 'trainer' ? '/trainer' : '/')}
                        />


                        {isLoggedIn && (
                            <IconButton
                                color="primary"
                                onClick={() => logout(navigate)}
                                sx={{
                                    mr: 1,
                                    display: {xs: 'flex', md: 'none'}
                                }}
                            >
                                <LogoutIcon/>
                            </IconButton>
                        )}

                    </Box>
                    {/* Desktop menüü (Left) */}
                    <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 1, ml: 2}}>


                        {leftLinks.map((link) =>
                            link.action ? (
                                <Button
                                    key={link.name}
                                    onClick={link.action}
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    {link.name}
                                </Button>
                            ) : (
                                <Button
                                    key={link.name}
                                    component={Link}
                                    to={link.to}
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    {link.name}
                                </Button>
                            )
                        )}
                    </Box>

                    {/* Desktop menüü (Right) - Log Out jt nupud */}

                    <Box sx={{display: {xs: 'none', md: 'flex'}, gap: 1, mr: 2}}>
                        <HelpIcon color="primary"
                                  sx={{margin: 1, pt: 1}}

                                  onClick={() => navigate('/help')}/>
                        {rightLinks.map((link) =>
                            link.action ? (
                                <Button
                                    key={link.name}
                                    onClick={link.action}
                                    color="primary"
                                    variant="text"
                                    size="small"
                                >
                                    {link.name}
                                </Button>
                            ) : (
                                <Button
                                    key={link.name}
                                    component={Link}
                                    to={link.to}
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                >
                                    {link.name}
                                </Button>
                            )
                        )}

                        {isLoggedIn && (
                            <IconButton
                                color="primary"
                                onClick={() => logout(navigate)}

                            >
                                <LogoutIcon/>
                            </IconButton>
                        )}
                    </Box>

                    {/* Mobiilne hamburger (Drawer) - näitame ainult siis, kui NOT isMobile?
                Või kui soovid säilitada vana menüü mobiilis, jätame siia.
                Hetkel peidame hoopis, kuna kasutame alumist nav'i.
                Kui soovid, võid taastada. */}
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>

                    </Box>
                </StyledToolbar>

            </AppBar>

            {/* Alumine nav (mobiilis), ainult siis kui kasutaja on sisse logitud.
          Kui eelistad näidata seda ka siis, kui kasutaja pole sisseloginud,
          võid tingimust muuta. */}
            {isLoggedIn && isMobile && bottomNavItems.length > 0 && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        borderTop: 1,
                        borderColor: 'divider',
                        zIndex: 1201, // pisut suurem kui AppBar (mui default 1100+)
                    }}
                >
                    <BottomNavigation
                        showLabels
                        value={currentValue}
                        onChange={handleBottomNavChange}
                        sx={{
                            // Stilistika, nt kui aktiivsel itemil tahad teist värvi ikooni
                            // ja top borderit vms, saad vastavaid MUI-teemasid override'ida
                            // või kasutada sx-stiili.
                            '& .Mui-selected': {
                                color: 'primary.main',
                                borderTop: '3px solid',
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        {bottomNavItems.map((item) => (
                            <BottomNavigationAction
                                key={item.value}
                                label={item.label}
                                icon={item.icon}
                                value={item.value}
                            />
                        ))}
                    </BottomNavigation>
                </Box>
            )}
        </>
    );
}
