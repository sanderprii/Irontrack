import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Divider,
    Button
} from "@mui/material";
import { styled } from "@mui/system";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ClassIcon from "@mui/icons-material/Class";
import TimelineIcon from "@mui/icons-material/Timeline";

// Hero sektsiooni pildi stiil
const HeroSection = styled("div")(({ theme }) => ({
    minHeight: "50vh",
    background: `url("https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center/cover no-repeat`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
    padding: theme.spacing(4),
}));

// Sama värvilahendus nagu HomePage'is
const iconBackgroundColor = "#E6F0FF";
const iconColor = "#0072E5"; // sinine ikoon

// Ümmargune ikooni-tausta stiil
const IconCircle = styled("div")(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: iconBackgroundColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
}));

export default function AboutPage() {
    return (
        <Box>
            {/* HERO - peamine bannergraafika */}
            <HeroSection>
                <Box maxWidth="md">
                    <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                        Created by a CrossFit Enthusiast
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                        Built from the ground up to empower affiliate owners and members alike
                        – so you can focus on what truly matters: forging elite fitness and a
                        thriving community.
                    </Typography>
                    <Button variant="contained" color="secondary" size="large">
                        Join Our Community
                    </Button>
                </Box>
            </HeroSection>

            {/* ABOUT TEXT & STORY */}
            <Container sx={{ py: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }} align="center">
                    Our Mission
                </Typography>
                <Typography variant="body1" align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                    We’re a team of CrossFit enthusiasts dedicated to building tools that simplify
                    everyday operations for gym owners and enhance the training experience for every athlete.
                    From the workout floor to the management back-office, we understand the challenges you face
                    and strive to solve them with innovative and user-friendly solutions.
                </Typography>
                <Divider sx={{ mb: 6 }} />

                {/* AFFILIATE OWNER FEATURES */}
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }} align="center">
                    Built for Affiliate Owners
                </Typography>
                <Typography variant="body1" align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                    Your passion is guiding your athletes to success, not juggling spreadsheets.
                    We equip you with the tools you need to run your box smoothly.
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                            <IconCircle>
                                <AssignmentIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Manage & Draft Contracts
                            </Typography>
                            <Typography variant="body2">
                                Easily create, edit, and organize membership contracts.
                                Keep everything in one place without the fuss of endless paperwork.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                            <IconCircle>
                                <ClassIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Add Classes & WODs
                            </Typography>
                            <Typography variant="body2">
                                Schedule your box’s workouts, classes, and events with just a few clicks.
                                Share the daily WOD and track attendance seamlessly.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                            <IconCircle>
                                <GroupIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Member Management & Engagement
                            </Typography>
                            <Typography variant="body2">
                                Add, remove, and organize members effortlessly.
                                Keep them engaged with automated communications and updates.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                            <IconCircle>
                                <EmailIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Send Bulk Emails
                            </Typography>
                            <Typography variant="body2">
                                Quickly inform your entire membership about schedule changes, new events,
                                or box news. No more chaotic email chains.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                            <IconCircle>
                                <PaymentIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Handle Payments with Ease
                            </Typography>
                            <Typography variant="body2">
                                Automate your billing and track payments. Lower transaction fees save
                                you money so you can reinvest in your community.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* REGULAR USERS FEATURES */}
            <Box sx={{ backgroundColor: "#f9f9f9", py: 6 }}>
                <Container>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }} align="center">
                        Perfect for Athletes & Regular Users
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                        Our platform isn’t just for owners—every athlete can get the most out of
                        their membership, track progress, and sign up for classes with ease.
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                                <IconCircle>
                                    <PaymentIcon sx={{ fontSize: 32, color: iconColor }} />
                                </IconCircle>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Purchase Affiliate Plans
                                </Typography>
                                <Typography variant="body2">
                                    Browse and sign up for the membership plan that suits your goals.
                                    Enjoy a transparent and secure checkout process.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                                <IconCircle>
                                    <ClassIcon sx={{ fontSize: 32, color: iconColor }} />
                                </IconCircle>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Register for Classes
                                </Typography>
                                <Typography variant="body2">
                                    Book your spot in upcoming WODs or special events.
                                    Receive reminders, track your attendance, and never miss a session.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                                <IconCircle>
                                    <TimelineIcon sx={{ fontSize: 32, color: iconColor }} />
                                </IconCircle>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                    Track Workouts & Stats
                                </Typography>
                                <Typography variant="body2">
                                    Log your PRs and workout results. Monitor your progress over time and
                                    celebrate every victory, big or small.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA - Lõpuline üleskutse */}
            <Container sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                    Ready to Level Up?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
                    Whether you’re an affiliate owner or an ambitious athlete, we have all the tools you need.
                    Join us and experience the difference a dedicated CrossFit platform can make.
                </Typography>
                <Button variant="contained" size="large" color="primary">
                    Get Started Today
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
