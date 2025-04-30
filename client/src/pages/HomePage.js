import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    Paper
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SEO from '../components/SEO';
import SavingsIcon from "@mui/icons-material/Savings";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import TimelineIcon from "@mui/icons-material/Timeline";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {motion} from "framer-motion";

import {getAllStatistics} from "../api/statisticsApi";
import CountUp from 'react-countup';

// Modernne hero taustapilt ja täiendavad pildid
const carouselImages = [
        {
            src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            webp: "/images/optimized/hero-1.webp"
        },
        {
            src: "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            webp: "/images/optimized/hero-2.webp"
        },
        {
            src: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            webp: "/images/optimized/hero-3.webp"
        },
    ]
;

// Images for PWA installation guides
const iOSImages = [
    "/pic/IOSimage0.png",
    "/pic/IOSimage1.png",
    "/pic/IOSimage2.png",
];


// Värvipalett
const colors = {
    primary: "#0072E5",
    secondary: "#333333",
    accent: "#FF5722",
    lightGray: "#F8F9FA",
    darkGray: "#212529",
    white: "#FFFFFF",
    statsBg: "rgba(0, 114, 229, 0.05)" // Helesinine statistika sektsioonile
};

// PWA Installation Tutorial Modal for iOS
const IOSInstallModal = ({open, handleClose}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            label: "Read all 3 steps first! - Open Safari",
            description: "This feature only works in Safari browser on iOS. Open your website in Safari.",
            image: iOSImages[0],
        },
        {
            label: "Tap Share Button",
            description: "Tap the share button at the bottom of your browser (box with arrow pointing up).",
            image: iOSImages[1],
        },
        {
            label: "Add to Home Screen",
            description: "Scroll down and tap 'Add to Home Screen'. Then tap 'Add' in the top right corner.",
            image: iOSImages[2],
        }
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
            fullScreen={isMobile}
        >
            <DialogTitle sx={{
                bgcolor: colors.primary,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
            }}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <AppleIcon/>
                    <Typography variant="h6" component="div">
                        Install IronTrack on iOS
                    </Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{p: 3, mt: 2}}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 4}}>
                    {steps.map((step) => (
                        <Step key={step.label}>
                            <StepLabel>{step.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{mt: 2, textAlign: 'center'}}>
                    <Typography variant="h6" gutterBottom>
                        {steps[activeStep].label}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{mb: 3}}>
                        {steps[activeStep].description}
                    </Typography>
                    <Box
                        component="img"
                        src={steps[activeStep].image}
                        alt={`iOS installation step ${activeStep + 1}`}
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '550px',
                            border: '1px solid #eee',
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            mb: 2
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{px: 3, py: 2, justifyContent: 'space-between'}}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>
                <Box>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            onClick={handleClose}
                            variant="contained"
                            color="primary"
                        >
                            Done
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            color="primary"
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};


// Modernne statistika komponent animeeritud numbritega
const StatCounter = React.memo(({ value, label, icon, delay = 0.2 }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card
            component={motion.div}
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay, duration: 0.5}}
            elevation={2}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0,114,229,0.2)',
                }
            }}
        >
            <CardContent sx={{p: 3, textAlign: 'center'}}>
                <Box
                    sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            bgcolor: alpha(colors.primary, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                <Typography
                    variant={isMobile ? "h3" : "h2"}
                    component="div"
                    sx={{
                        fontWeight: 700,
                        color: colors.primary,
                        mb: 1,
                        fontFamily: '"Montserrat", sans-serif',
                    }}
                >
                    <CountUp
                        end={value}
                        duration={2.5}
                        separator=","
                        delay={0.3}
                    />
                </Typography>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                    }}
                >
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
});

// Modernne funktsionaalsuse kaart
const FeatureCard = React.memo(({ icon, title, description, delay = 0.3 }) => {
    return (
        <Card
            component={motion.div}
            initial={{y: 30, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay, duration: 0.5}}
            elevation={2}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    '& .icon-container': {
                        bgcolor: colors.primary,
                        '& svg': {
                            color: colors.white,
                        }
                    }
                }
            }}
        >
            <CardContent sx={{p: 3}}>
                <Box
                    className="icon-container"
                    sx={{
                        width: 70,
                        height: 70,
                        borderRadius: "50%",
                        bgcolor: alpha(colors.primary, 0.1),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2.5,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {React.cloneElement(icon, {
                        sx: {
                            fontSize: 32,
                            color: colors.primary,
                            transition: 'all 0.3s ease',
                        }
                    })}
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        mb: 1.5,
                        fontFamily: '"Montserrat", sans-serif',
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{lineHeight: 1.6}}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
});

// SectionTitle komponent
const SectionTitle = ({title, subtitle, align = "center", delay = 0.2}) => {
    return (
        <Box
            component={motion.div}
            initial={{y: 20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{delay, duration: 0.5}}
            sx={{
                mb: 5,
                textAlign: align,
                position: 'relative'
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    mb: 1.5,
                    fontFamily: '"Montserrat", sans-serif',
                    position: 'relative',
                    display: align === "center" ? 'inline-block' : 'block'
                }}
            >
                {title}
                <Box
                    sx={{
                        position: 'absolute',
                        height: 4,
                        width: 60,
                        backgroundColor: colors.accent,
                        bottom: -10,
                        left: align === "center" ? '50%' : 0,
                        transform: align === "center" ? 'translateX(-50%)' : 'none',
                        borderRadius: 2
                    }}
                />
            </Typography>
            {subtitle && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: align === "center" ? 700 : 'unset',
                        mx: align === "center" ? "auto" : 0,
                        mt: 3,
                        lineHeight: 1.6
                    }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
};

export default function HomePage() {
    const [stats, setStats] = useState({
        users: 0,
        trainings: 0,
        records: 0
    });
    const [loading, setLoading] = useState(true);
    const [iOSModalOpen, setIOSModalOpen] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleOpenIOSModal = () => {
        setIOSModalOpen(true);
    };

    const handleCloseIOSModal = () => {
        setIOSModalOpen(false);
    };

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await getAllStatistics();
                setStats({
                    users: data.users || 0,
                    trainings: data.trainings || 0,
                    records: data.records || 0
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const settings = {

        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        fade: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',


    };

    // Styled AppButton component for iOS and Android
    const AppButton = ({icon, label, bgColor, onClick}) => (
        <Button
            variant="contained"
            startIcon={icon}
            onClick={onClick}
            sx={{
                py: 1.2,
                px: 3,
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: bgColor,
                textTransform: "none",
                boxShadow: `0 4px 10px ${alpha(bgColor, 0.3)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 15px ${alpha(bgColor, 0.5)}`,
                    bgcolor: alpha(bgColor, 0.9)
                }
            }}
        >
            {label}
        </Button>
    );

    return (
        <>
            <SEO
                title="Irontrack - Gym Management Platform"
                description="Platform for crossfit enthusiasts. Manage your gym with ease."
                keywords="crossfit, gym, management, platform, fitness"
                canonicalUrl="https://www.irontrack.ee/"
                ogImage="https://www.irontrack.ee/images/og-image.jpg"
            />
            <Box sx={{overflowX: 'hidden'}}>
                {/* PWA Installation Modals */}
                <IOSInstallModal
                    open={iOSModalOpen}
                    handleClose={handleCloseIOSModal}
                />


                {/* HERO KARUSSELL */}
                <Box sx={{position: "relative"}}>
                    <Slider {...settings}>
                        {carouselImages.map((imgSrc, i) => (
                            <div key={i}>
                                <Box
                                    sx={{
                                        minHeight: { xs: "50vh", md: "50vh" },
                                        position: "relative",
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${typeof imgSrc === 'string' ? imgSrc : imgSrc.src})`,
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            backgroundRepeat: "no-repeat",
                                            zIndex: -1,
                                        },
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        color: "#fff",
                                        p: {xs: 2, md: 4},
                                    }}
                                >
                                    {i === 0 && (
                                        <link
                                            rel="preload"
                                            href={imgSrc.webp || imgSrc.src}
                                            as="image"
                                            type={imgSrc.webp ? "image/webp" : "image/jpeg"}
                                        />
                                    )}
                                    <Container maxWidth="lg">
                                        <Box
                                            component={motion.div}
                                            initial={{y: 30, opacity: 0}}
                                            animate={{y: 0, opacity: 1}}
                                            transition={{duration: 0.8}}
                                            sx={{maxWidth: 900, mx: "auto"}}
                                        >

                                            <Typography
                                                variant={isMobile ? "h3" : "h1"}
                                                sx={{
                                                    fontWeight: 800,
                                                    mb: 3,
                                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                                    fontFamily: '"Montserrat", sans-serif',
                                                    lineHeight: 1.1
                                                }}
                                            >
                                                {i === 2 ? "Created by a CrossFit Enthusiast" : "Take Your CrossFit Box to the Next Level"}
                                            </Typography>

                                            <Typography
                                                variant={isMobile ? "body1" : "h6"}
                                                sx={{
                                                    mb: 4,
                                                    lineHeight: 1.6,
                                                    fontWeight: 400,
                                                    maxWidth: 800,
                                                    mx: "auto",
                                                    opacity: 0.9
                                                }}
                                            >
                                                {i === 2 ?
                                                    "Built from the ground up to empower affiliate owners and members alike – so you can focus on what truly matters: forging elite fitness and a thriving community." :
                                                    "Specifically designed for CrossFit owners and coaches, our platform simplifies member management, automates payments, and powers your community—so you can focus on what really matters: helping athletes reach their goals."}
                                            </Typography>

                                            <Box sx={{mt: 3}}>
                                                <Button
                                                    variant="contained"
                                                    size="large"
                                                    color="primary"
                                                    onClick={() => navigate("/register")}
                                                    sx={{
                                                        py: 1.5,
                                                        px: 4,
                                                        fontSize: "1rem",
                                                        fontWeight: 600,
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        boxShadow: "0 4px 14px rgba(0,114,229,0.4)",
                                                        transition: "all 0.3s",
                                                        "&:hover": {
                                                            transform: "translateY(-2px)",
                                                            boxShadow: "0 6px 20px rgba(0,114,229,0.6)",
                                                        }
                                                    }}
                                                >
                                                    Get Started Now
                                                </Button>
                                            </Box>

                                            {/* Installation App Buttons */}
                                            <Box
                                                sx={{
                                                    mt: 3,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 2,
                                                    flexWrap: 'wrap'
                                                }}
                                            >


                                                <Box
                                                    component={motion.div}
                                                    initial={{y: 10, opacity: 0}}
                                                    animate={{y: 0, opacity: 1}}
                                                    transition={{delay: 0.4, duration: 0.5}}
                                                >
                                                    <AppButton
                                                        icon={<AppleIcon/>}
                                                        label="iOS"
                                                        bgColor="#000000"
                                                        onClick={handleOpenIOSModal}
                                                    />
                                                </Box>

                                                <Box
                                                    component={motion.div}
                                                    initial={{y: 10, opacity: 0}}
                                                    animate={{y: 0, opacity: 1}}
                                                    transition={{delay: 0.5, duration: 0.5}}
                                                >
                                                    <AppButton
                                                        icon={<AndroidIcon/>}
                                                        label="Android"
                                                        bgColor="#3ddc84"
                                                        onClick={() => window.open('https://play.google.com/store/apps/details?id=com.irontrack.Irontrack', '_blank')}

                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Container>
                                </Box>
                            </div>
                        ))}
                    </Slider>

                    {/* Scroll down indicator */}
                    <Box
                        component={motion.div}
                        animate={{
                            y: [0, 10, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5
                        }}
                        sx={{
                            position: 'absolute',
                            bottom: 5,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            cursor: 'pointer',
                            zIndex: 10,
                            display: {xs: 'none', md: 'block'}
                        }}
                        onClick={() => {
                            window.scrollTo({
                                top: window.innerHeight,
                                behavior: 'smooth'
                            });
                        }}
                    >
                        <KeyboardArrowDownIcon
                            sx={{
                                color: 'white',
                                fontSize: 40,
                                opacity: 0.8,
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                            }}
                        />
                    </Box>
                </Box>

                {/* MEIE MISSIOON */}
                <Container sx={{py: {xs: 6, md: 8}}}>
                    <SectionTitle
                        title="Our Mission"
                        subtitle="We're a team of CrossFit enthusiasts dedicated to building tools that simplify everyday operations for gym owners and enhance the training experience for every athlete. From the workout floor to the management back-office, we understand the challenges you face and strive to solve them with innovative and user-friendly solutions."
                    />
                </Container>

                {/* STATISTIKA SEKTSIOON - MODERNNE */}
                <Box
                    sx={{
                        backgroundColor: colors.statsBg,
                        py: {xs: 5, md: 8},
                        px: 2,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Container maxWidth="lg">
                        <Box
                            component={motion.div}
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                        >
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                sx={{
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    mb: 5,
                                    fontFamily: '"Montserrat", sans-serif',
                                    position: 'relative'
                                }}
                            >
                                Our Impact in Numbers
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        height: 4,
                                        width: 60,
                                        backgroundColor: colors.accent,
                                        bottom: -12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        borderRadius: 2
                                    }}
                                />
                            </Typography>
                        </Box>

                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <StatCounter
                                    value={stats.users}
                                    label="Active Users"
                                    icon={<PeopleIcon sx={{fontSize: 30, color: colors.primary}}/>}
                                    delay={0.2}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <StatCounter
                                    value={stats.trainings}
                                    label="Trainings"
                                    icon={<FitnessCenterIcon sx={{fontSize: 30, color: colors.primary}}/>}
                                    delay={0.4}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <StatCounter
                                    value={stats.records}
                                    label="Records Broken"
                                    icon={<EmojiEventsIcon sx={{fontSize: 30, color: colors.primary}}/>}
                                    delay={0.6}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* AFFILIATE OWNER FEATURES */}
                <Container sx={{py: {xs: 6, md: 10}}}>
                    <SectionTitle
                        title="Built for Affiliate Owners"
                        subtitle="Your passion is guiding your athletes to success, not juggling spreadsheets. We equip you with the tools you need to run your box smoothly."
                        delay={0.2}
                    />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<AssignmentIcon/>}
                                title="Manage & Draft Contracts"
                                description="Easily create, edit, and organize membership contracts. Keep everything in one place without the fuss of endless paperwork."
                                delay={0.3}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<ClassIcon/>}
                                title="Add Classes & WODs"
                                description="Schedule your box's workouts, classes, and events with just a few clicks. Share the daily WOD and track attendance seamlessly."
                                delay={0.4}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<GroupIcon/>}
                                title="Member Management & Engagement"
                                description="Add, remove, and organize members effortlessly. Keep them engaged with automated communications and updates."
                                delay={0.5}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<EmailIcon/>}
                                title="Send Bulk Emails"
                                description="Quickly inform your entire membership about schedule changes, new events, or box news. No more chaotic email chains."
                                delay={0.6}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<PaymentIcon/>}
                                title="Handle Payments with Ease"
                                description="Automate your billing and track payments. Lower transaction fees save you money so you can reinvest in your community."
                                delay={0.7}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<SavingsIcon/>}
                                title="Save Money on Transactions"
                                description="We offer lower payment processing fees compared to other platforms. Keep more of your revenue and invest in growing your gym."
                                delay={0.8}
                            />
                        </Grid>
                    </Grid>
                </Container>

                {/* REGULAR USERS FEATURES */}
                <Box sx={{backgroundColor: colors.lightGray, py: {xs: 6, md: 10}}}>
                    <Container>
                        <SectionTitle
                            title="Perfect for Athletes & Regular Users"
                            subtitle="Our platform isn't just for owners—every athlete can get the most out of their membership, track progress, and sign up for classes with ease."
                            delay={0.2}
                        />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<PaymentIcon/>}
                                    title="Purchase Affiliate Plans"
                                    description="Browse and sign up for the membership plan that suits your goals. Enjoy a transparent and secure checkout process."
                                    delay={0.3}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<ClassIcon/>}
                                    title="Register for Classes"
                                    description="Book your spot in upcoming WODs or special events. Receive reminders, track your attendance, and never miss a session."
                                    delay={0.4}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FeatureCard
                                    icon={<TimelineIcon/>}
                                    title="Track Workouts & Stats"
                                    description="Log your PRs and workout results. Monitor your progress over time and celebrate every victory, big or small."
                                    delay={0.5}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* WHY CHOOSE OUR PLATFORM - Modernne sektsioon */}
                <Container sx={{py: {xs: 6, md: 10}}}>
                    <SectionTitle
                        title="Why Choose Our Platform?"
                        subtitle="Our comprehensive gym management solution helps CrossFit box owners save time, increase revenue, and deliver exceptional member experiences."
                        delay={0.2}
                    />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<PeopleIcon/>}
                                title="Manage Your Community Easily"
                                description="Our platform is built to help affiliate owners run their business smoothly. Engage your members, track attendance, and ensure a strong and active community."
                                delay={0.3}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<SavingsIcon/>}
                                title="Save Money on Transactions"
                                description="We offer lower payment processing fees compared to other platforms. Keep more of your revenue and invest in growing your gym."
                                delay={0.5}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <FeatureCard
                                icon={<DescriptionIcon/>}
                                title="Simple Contract Management"
                                description="Easily create, manage, and track contracts for your members. Our system ensures compliance and simplifies document handling."
                                delay={0.7}
                            />
                        </Grid>
                    </Grid>
                </Container>

                {/* CTA sektsioon - Modernne */}
                <Box
                    sx={{
                        backgroundColor: alpha(colors.primary, 0.03),
                        py: {xs: 6, md: 10},
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Container maxWidth="md">
                        <Box
                            component={motion.div}
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{duration: 0.5}}
                            sx={{
                                textAlign: "center",
                                position: 'relative',
                                zIndex: 1,
                                p: {xs: 3, md: 6},
                                borderRadius: 4,
                                backgroundColor: 'white',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                            }}
                        >
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontFamily: '"Montserrat", sans-serif',
                                }}
                            >
                                Ready to Level Up?
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    mb: 4,
                                    maxWidth: 600,
                                    mx: 'auto',
                                    fontSize: {xs: "1rem", md: "1.1rem"},
                                    lineHeight: 1.6
                                }}
                            >
                                Whether you're an affiliate owner or an ambitious athlete, we have all the tools you
                                need.
                                Join hundreds of gym owners who are streamlining their operations and creating better
                                experiences for their members.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => navigate("/register")}
                                sx={{
                                    py: 1.5,
                                    px: 5,
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    boxShadow: "0 4px 14px rgba(0,114,229,0.3)",
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 8px 25px rgba(0,114,229,0.5)",
                                    }
                                }}
                            >
                                Get Started Today
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* FOOTER */}
                <Box sx={{backgroundColor: colors.secondary, color: colors.white, py: 4}}>
                    <Container>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5}}>
                            <Typography variant="body2" align="center">
                                © {new Date().getFullYear()} Irontrack OÜ | All rights reserved.
                            </Typography>
                            <Typography variant="body2" align="center" sx={{opacity: 0.8}}>
                                Reg. nr: 17184398 | Email: info@irontrack.ee
                            </Typography>
                            <Box sx={{mt: 1}}>
                                <Typography
                                    variant="body2"
                                    component="span"
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                            color: alpha(colors.white, 0.8)
                                        }
                                    }}
                                    onClick={() => navigate("/privacy-policy")}
                                >
                                    Privacy Policy
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}