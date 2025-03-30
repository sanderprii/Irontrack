import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Divider
} from "@mui/material";
import { styled } from "@mui/system";
import {useNavigate} from "react-router-dom";

// MUI ikoonid
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PaymentIcon from "@mui/icons-material/Payment";
import DescriptionIcon from "@mui/icons-material/Description";

const iconBackgroundColor = "#E6F0FF";
const iconColor = "#0072E5"; // sinine ikoon

// Ümmargune ikooni-taust
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

// Funktsioon linnukese või X-i näitamiseks
const FeatureStatus = ({ available }) => {
    return available ? (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
        </Box>
    ) : (
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <CancelOutlinedIcon sx={{ color: "#f44336", mr: 1 }} />
        </Box>
    );
};

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <Box>
            {/** HERO / PEALMINE SEKTSIOON **/}
            <Box
                sx={{
                    minHeight: "50vh",
                    background: `url("https://images.unsplash.com/photo-1521805103424-d8f8430e8933?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") center center/cover no-repeat`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "#fff",
                    p: 2,
                }}
            >
                <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                    Our Flexible Pricing
                </Typography>
                <Typography variant="h5" sx={{ maxWidth: 600, mb: 4 }}>
                    Built for CrossFit affiliate owners and free for regular users.
                    Leverage Montonio's cost-effective payment links to keep more of your revenue.
                </Typography>
                <Button variant="contained" size="large" color="primary" onClick={() => navigate("/register")}>
                    Get Started Today
                </Button>
            </Box>

            <Typography
                variant="h3"
                align="center"
                sx={{
                    fontWeight: "bold",
                    my: 4,
                    color: "#0072E5",
                    borderBottom: "2px solid #0072E5",
                    pb: 2,
                    maxWidth: "80%",
                    mx: "auto"
                }}
            >
                Free for Regular Users
            </Typography>

            <Typography
                variant="h4"
                align="center"
                sx={{ fontWeight: "bold", mb: 2 }}
            >
                How it works?
            </Typography>
            <Typography variant="body1" align="center" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
                Create account as affiliate owner and start using Irontrack Premium package for free for 3 months. After that we will contact you and ask if you want to continue using our service. If you are regular user, you can use our service for free.
                <strong> If you want to use payments, then you need to create user  on Montonio! Contact us and we will help you through!</strong>

            </Typography>

            {/** PÕHISISU **/}
            <Container sx={{ py: 8 }}>
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: "bold", mb: 2 }}
                >
                    Simple Plans for Every Need
                </Typography>
                <Typography variant="body1" align="center" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
                    Whether you're an affiliate owner looking for a powerful gym management solution
                    or an athlete wanting to track your progress—our pricing is clear, transparent,
                    and helps you focus on what matters most: building a thriving community.
                </Typography>

                {/* New large text stating "Free for regular user" */}
                <Typography
                    variant="h3"
                    align="center"
                    sx={{
                        fontWeight: "bold",
                        my: 4,
                        color: "#0072E5",
                        borderBottom: "2px solid #0072E5",
                        pb: 2,
                        maxWidth: "80%",
                        mx: "auto"
                    }}
                >
                    Packages for affiliate owner
                </Typography>

                <Grid container spacing={4}>


                    {/** 2. Standard Package **/}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                textAlign: "center",
                                height: "100%",
                                background: "linear-gradient(to bottom right, #ffffff, #f5f9ff)",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: 6
                                }
                            }}
                        >

                            <IconCircle>
                                <DescriptionIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                Standard
                            </Typography>
                            <Typography variant="h4" sx={{ mb: 2, color: "#0072E5" }}>
                                €49.99
                                <Typography component="span" variant="body1" sx={{ color: "text.secondary" }}>
                                    /month
                                </Typography>
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 3, textAlign: "left", pl: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add Classes & WODs</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add and manage plans</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add credit to users</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Member Tracking</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add training plans to users</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CancelOutlinedIcon sx={{ color: "#f44336", mr: 1 }} />
                                    <Typography variant="body1">Payment Management</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CancelOutlinedIcon sx={{ color: "#f44336", mr: 1 }} />
                                    <Typography variant="body1">Email service</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CancelOutlinedIcon sx={{ color: "#f44336", mr: 1 }} />
                                    <Typography variant="body1">Contract Management</Typography>
                                </Box>

                            </Box>

                            <Button variant="contained" color="primary" size="large" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/register")}>
                                Get Started
                            </Button>
                        </Paper>
                    </Grid>

                    {/** 3. Premium Package **/}
                    <Grid item xs={12} md={4}>


                            <Paper
                                elevation={4}
                                sx={{
                                    p: 4,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    border: "2px solid",
                                    borderColor: "#0072E5",
                                    height: "100%",
                                    position: "relative",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 20,
                                        right: -8,
                                        backgroundColor: "#0072E5",
                                        color: "white",
                                        py: 0.5,
                                        px: 2,
                                        transform: "rotate(45deg)",
                                        transformOrigin: "top right",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                        TOP
                                    </Typography>
                                </Box>

                            <IconCircle sx={{ backgroundColor: "#E1F5FE" }}>
                                <StoreIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                                Premium
                            </Typography>
                            <Typography variant="h4" sx={{ mb: 2, color: "#0072E5" }}>
                                €99.99
                                <Typography component="span" variant="body1" sx={{ color: "text.secondary" }}>
                                    /month
                                </Typography>
                            </Typography>
                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 3, textAlign: "left", pl: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add Classes & WODs</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add and manage plans</Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add credit to users</Typography>
                                </Box>


                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Priority Support</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Payment Management</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Automated payment links for monthly memberships</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Member Tracking</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Add training plans to users</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Email service</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <CheckCircleOutlineIcon sx={{ color: "#4caf50", mr: 1 }} />
                                    <Typography variant="body1">Contract Management</Typography>
                                </Box>
                            </Box>

                            <Button variant="contained" color="primary" size="large" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/register")}>
                                Get Started
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Montonio Integration Information (moved from card to section below) */}
                <Box sx={{ mt: 8, mb: 4, p: 4, backgroundColor: "#f5f9ff", borderRadius: 2 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
                            <IconCircle>
                                <CreditCardIcon sx={{ fontSize: 32, color: iconColor }} />
                            </IconCircle>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                                Montonio Integration (Optional)
                            </Typography>


                            <Typography variant="body1">
                                Use Montonio's payment links for lower fees compared to Stripe. Choose Standard or Premium package on Montonio and save on every transaction. Seamlessly integrate
                                with your subscription plan for enhanced payment management. <strong>Montonio fees are not included on Irontrack package price! Standard Montonio package price: 11.99€ monthly fee, 10€ payment link fee (for contract payments) plus 0,15€ per bank payment. NB! Card payment have different pricing! </strong>
                            </Typography>

                        </Grid>
                        <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={() => (window.location.href = "https://montonio.com/et/hinnapaketid/")}
                                sx={{ width: "100%" }}
                            >
                                Explore Montonio
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/** MONTONIO DETAILNE SEKTSIOON **/}
            <Box sx={{ backgroundColor: "#f9f9f9", py: 8 }}>
                <Container>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }} align="center">
                        Montonio Payment Packages
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
                        Choose between Standard or Premium to fit your payment needs. Montonio's platform
                        provides detailed payment management, secure bank links, and monthly invoices
                        sent directly to your email.
                    </Typography>

                    {/** Siin võiksid tuua Montonio pakettide visuaali sarnaselt https://montonio.com/et/hinnapaketid/ **/}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={1}
                                sx={{ p: 4, borderRadius: 2, height: "100%" }}
                            >
                                <IconCircle>
                                    <CompareArrowsIcon sx={{ fontSize: 32, color: iconColor }} />
                                </IconCircle>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Standard Package
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    - Monthly fee of <strong>11.99€ per Month</strong><br/>
                                    - Payment link fee 10€ per month<br/>
                                    - Competitive rates <strong>0.15€</strong> per transaction<br/>
                                    - Simple bank links<br/>
                                    - Monthly invoice from Montonio<br/>
                                    - Manage all payments in Montonio dashboard
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => (window.location.href = "https://montonio.com/et/hinnapaketid/")}
                                >
                                    Learn More
                                </Button>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={1}
                                sx={{ p: 4, borderRadius: 2, height: "100%" }}
                            >
                                <IconCircle>
                                    <CompareArrowsIcon sx={{ fontSize: 32, color: iconColor }} />
                                </IconCircle>
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Premium Package
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    - Monthly fee of <strong>19.99€ per Month</strong><br/>
                                    - Payment link fee 10€ per month<br/>
                                    - Competitive rates <strong>0.05€</strong> per transaction<br/>
                                    - Payment link customization<br/>
                                    - Manage all payments in Montonio dashboard
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => (window.location.href = "https://montonio.com/et/hinnapaketid/")}
                                >
                                    Learn More
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 6 }} />

                    {/** Võrdluse SEKTSIOON - 200 makset, keskmine 80€ **/}
                    <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                        Real Savings Example
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        Many other solutions (e.g. Stripe) charge around <strong>1.4% + €0.25</strong> per transaction.
                        Let's compare:
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                    Other Providers
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    <strong>200 payments</strong> x average <strong>€80</strong> = €16,000 total
                                </Typography>
                                <Typography variant="body2">
                                    1.4% of €16,000 = <strong>€224</strong> <br/>
                                    + (200 x €0.25) = <strong>€50</strong> <br/>
                                    <strong>Total = €274</strong>
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    backgroundColor: "#eaffea",
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
                                    With Montonio
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    <strong>200 payments</strong> x average <strong>€80</strong> = €16,000 total
                                </Typography>
                                <Typography variant="body2">
                                    Approx. <strong>€40</strong> for the same volume by using Montonio Premium package + Payment links.
                                </Typography>
                                <Typography variant="body2">
                                    <strong>NB! Calculation is done with bank payments.</strong>
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Typography variant="body2" sx={{ mt: 4 }}>
                        By choosing our application integrated with Montonio, you save significantly
                        on transaction fees—allowing you to reinvest in your box and community.
                    </Typography>
                </Container>
            </Box>

            {/** Montonio info & CTA **/}
            <Container sx={{ py: 6 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }} align="center">
                    Getting Started with Montonio
                </Typography>
                <Typography variant="body1" align="center" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
                    Simply create an account on Montonio, choose Standard or Premium, then provide us
                    with your API keys. Montonio will handle monthly invoices, and you can manage
                    all transactions in their easy-to-use dashboard.
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                    <Button variant="contained" color="primary" size="large" onClick={() => (window.location.href = "https://montonio.com/et/hinnapaketid/")}>
                        Create Montonio Account
                    </Button>
                </Box>
            </Container>

            {/** FOOTER **/}
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