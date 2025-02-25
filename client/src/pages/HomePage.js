import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Paper
} from "@mui/material";

import { useNavigate} from "react-router-dom";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SavingsIcon from "@mui/icons-material/Savings";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";




const carouselImages = [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// Mingi stiilne sinine värv taustaringi jaoks
const iconBackgroundColor = "#E6F0FF";
const iconColor = "#0072E5"; // sinine ikoon

export default function HomePage() {
    // React Slick seaded (lihtne näide)

    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <Box>
            {/* HERO KARUSSELL */}
            <Box sx={{ position: "relative" }}>
                <Slider {...settings}>
                    {carouselImages.map((imgSrc, i) => (
                        <div key={i}>
                            <Box
                                sx={{
                                    minHeight: "80vh",
                                    background: `url(${imgSrc}) center center / cover no-repeat`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    color: "#fff",
                                    p: 2,
                                }}
                            >
                                <Box maxWidth="md">
                                    <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                                        Take Your CrossFit Box to the Next Level
                                    </Typography>
                                    <Typography variant="h5" sx={{ mb: 4, lineHeight: 1.4 }}>
                                        Specifically designed for CrossFit owners and coaches, our platform
                                        simplifies member management, automates payments, and powers your
                                        community—so you can focus on what really matters: helping athletes
                                        reach their goals.
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            justifyContent: "center",
                                            flexWrap: "wrap"
                                        }}
                                    >
                                        <Button variant="contained" size="large" color="primary" onClick={() => navigate("/register")}>
                                            Get Started Now
                                        </Button>
                                        <Button variant="outlined" size="large" sx={{ color: "#fff", borderColor: "#fff" }} onClick={() => navigate("/about")}>
                                            Learn More
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                        </div>
                    ))}
                </Slider>
            </Box>

            <Box>
                {/* WHY CHOOSE OUR PLATFORM - kolm olulist eelist */}
                <Container sx={{ py: 8 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ fontWeight: "bold", mb: 6 }}
                    >
                        Why Choose Our Platform?
                    </Typography>

                    <Grid container spacing={4}>
                        {/* 1. Affiliate Owneri elu lihtsustamine */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    p: 3,
                                    height: "100%",
                                    textAlign: "left",
                                }}
                            >
                                {/* Ümmargune taust ikoonile */}
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        backgroundColor: iconBackgroundColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    <PeopleIcon sx={{ fontSize: 32, color: iconColor }} />
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Manage Your Community Easily
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Our platform is built to help affiliate owners run their business smoothly.
                                    Engage your members, track attendance, and ensure a strong and active community.
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* 2. Hoia raha kokku – madalad maksetasud */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    p: 3,
                                    height: "100%",
                                    textAlign: "left",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        backgroundColor: iconBackgroundColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    <SavingsIcon sx={{ fontSize: 32, color: iconColor }} />
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Save Money on Transactions
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    We offer lower payment processing fees compared to other platforms.
                                    Keep more of your revenue and invest in growing your gym.
                                </Typography>
                            </Paper>
                        </Grid>

                        {/* 3. Lepingute haldamine */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={1}
                                sx={{
                                    borderRadius: 2,
                                    p: 3,
                                    height: "100%",
                                    textAlign: "left",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        backgroundColor: iconBackgroundColor,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                    }}
                                >
                                    <DescriptionIcon sx={{ fontSize: 32, color: iconColor }} />
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Simple Contract Management
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Easily create, manage, and track contracts for your members.
                                    Our system ensures compliance and simplifies document handling.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA sektsioon */}
            <Container sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                    Ready to Get Started?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Sign up today and see how easy gym management can be.
                </Typography>
                <Button variant="contained" size="large" color="primary" onClick={() => navigate("/register")}>
                    Create My Account
                </Button>
            </Container>

            {/* FOOTER */}
            <Box sx={{ backgroundColor: "#333", color: "#fff", py: 3 }}>
                <Container>
                    <Typography variant="body2" align="center">
                        © {new Date().getFullYear()} Irontrack OÜ | All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
