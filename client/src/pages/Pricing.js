import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Divider,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    alpha
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// MUI ikoonid
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import SEO from "../components/SEO";

// Värvipalett
const colors = {
    primary: "#0072E5",
    secondary: "#333333",
    accent: "#FF5722",
    success: "#4caf50",
    error: "#f44336",
    lightGray: "#F8F9FA",
    darkGray: "#212529",
    white: "#FFFFFF",
    statsBg: "rgba(0, 114, 229, 0.05)" // Helesinine
};

// Ümmargune ikooni-taust
const IconCircle = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundColor: alpha(colors.primary, 0.1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
}));

// Funktsioon linnukese või X-i näitamiseks
const FeatureItem = ({ available, text, delay = 0 }) => {
    return (
        <Box
            component={motion.div}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay * 0.05 + 0.3, duration: 0.4 }}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 1.8,
                transition: "transform 0.2s ease",
                "&:hover": {
                    transform: "translateX(5px)"
                }
            }}
        >
            {available ? (
                <CheckCircleOutlineIcon sx={{ color: colors.success, mr: 1.5, mt: 0.2, flexShrink: 0 }} />
            ) : (
                <CancelOutlinedIcon sx={{ color: colors.error, mr: 1.5, mt: 0.2, flexShrink: 0 }} />
            )}
            <Typography
                variant="body1"
                sx={{
                    lineHeight: 1.4,
                    color: available ? "text.primary" : "text.secondary"
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

// PricingCard komponent
const PricingCard = ({
                         icon,
                         title,
                         price,
                         features,
                         recommended = false,
                         delay = 0.3
                     }) => {
    return (
        <Card
            component={motion.div}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            elevation={recommended ? 4 : 2}
            sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                position: 'relative',
                border: recommended ? `2px solid ${colors.primary}` : 'none',
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: recommended ? '0 15px 35px rgba(0,114,229,0.3)' : '0 12px 30px rgba(0,0,0,0.1)',
                }
            }}
        >
            {recommended && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 20,
                        right: -35,
                        backgroundColor: colors.primary,
                        color: "white",
                        py: 0.6,
                        px: 4,
                        transform: "rotate(45deg)",
                        transformOrigin: "top right",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 1
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "700" }}>
                        TOP
                    </Typography>
                </Box>
            )}

            <CardContent sx={{ p: 4, pt: recommended ? 5 : 4 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <IconCircle
                        sx={{
                            mx: "auto",
                            backgroundColor: recommended ? alpha(colors.primary, 0.15) : alpha(colors.primary, 0.1),
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: {
                                fontSize: 32,
                                color: colors.primary
                            }
                        })}
                    </IconCircle>

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
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            color: colors.primary,
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "center",
                            mb: 0.5,
                            fontFamily: '"Montserrat", sans-serif',
                        }}
                    >
                        {price}
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                ml: 1,
                                color: "text.secondary",
                                fontWeight: "normal"
                            }}
                        >
                            /month
                        </Typography>
                    </Typography>
                </Box>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ mb: 3 }}>
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={index}
                            available={feature.available}
                            text={feature.text}
                            delay={index}
                        />
                    ))}
                </Box>

                <Button
                    variant={recommended ? "contained" : "outlined"}
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                        mt: 2,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: recommended ? "0 4px 14px rgba(0,114,229,0.4)" : "none",
                        transition: "all 0.3s",
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: recommended ? "0 6px 20px rgba(0,114,229,0.6)" : "0 4px 12px rgba(0,0,0,0.1)",
                        }
                    }}
                    onClick={() => window.location.href = "/register"}
                >
                    Get Started
                </Button>
            </CardContent>
        </Card>
    );
};

// InfoCard komponent
const InfoCard = ({ icon, title, description, buttonText, buttonLink, delay = 0.3 }) => {
    return (
        <Paper
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            elevation={1}
            sx={{
                p: 4,
                borderRadius: 4,
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                }
            }}
        >
            <IconCircle>
                {React.cloneElement(icon, {
                    sx: {
                        fontSize: 32,
                        color: colors.primary
                    }
                })}
            </IconCircle>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                    fontFamily: '"Montserrat", sans-serif',
                }}
            >
                {title}
            </Typography>
            <Box
                dangerouslySetInnerHTML={{ __html: description }}
                sx={{
                    mb: 2,
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    typography: 'body2',
                    '& strong': {
                        fontWeight: 700,
                    }
                }}
            />
            {buttonText && (
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: '0 4px 12px rgba(0,114,229,0.15)',
                        }
                    }}
                    onClick={() => window.location.href = buttonLink}
                >
                    {buttonText}
                </Button>
            )}
        </Paper>
    );
};

// ComparisonCard komponent
const ComparisonCard = ({ title, content, isHighlighted = false, delay = 0.3 }) => {
    return (
        <Paper
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            elevation={2}
            sx={{
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                backgroundColor: isHighlighted ? alpha(colors.success, 0.1) : colors.white,
                border: isHighlighted ? `1px solid ${alpha(colors.success, 0.3)}` : 'none',
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: isHighlighted ? '0 8px 25px rgba(76,175,80,0.15)' : '0 8px 25px rgba(0,0,0,0.08)',
                }
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: isHighlighted ? colors.success : "inherit",
                    fontFamily: '"Montserrat", sans-serif',
                }}
            >
                {title}
            </Typography>
            <Box
                dangerouslySetInnerHTML={{ __html: content }}
                sx={{
                    '& strong': {
                        fontWeight: 700,
                    }
                }}
            />
        </Paper>
    );
};

// SectionTitle komponent
const SectionTitle = ({ title, subtitle, align = "center", delay = 0.2 }) => {
    return (
        <Box
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
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

// LargeBanner komponent
const LargeBanner = ({ text, color = colors.primary, delay = 0.3 }) => {
    return (
        <Box
            component={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            sx={{
                backgroundColor: alpha(color, 0.05),
                borderRadius: 4,
                p: 2,
                my: 5,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "6px",
                    backgroundColor: color,
                },
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "700",
                    color: color,
                    fontFamily: '"Montserrat", sans-serif',
                    my: 1,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

export default function Pricing() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Pakettide funktsioonid
    const standardFeatures = [
        { available: true, text: "Add Classes & WODs" },
        { available: true, text: "Add and manage plans" },
        { available: true, text: "Add credit to users" },
        { available: true, text: "Member Tracking" },
        { available: true, text: "Add training plans to users" },
        { available: false, text: "Payment Management" },
        { available: false, text: "Email service" },
        { available: false, text: "Contract Management" },
    ];

    const premiumFeatures = [
        { available: true, text: "Add Classes & WODs" },
        { available: true, text: "Add and manage plans" },
        { available: true, text: "Add credit to users" },
        { available: true, text: "Priority Support" },
        { available: true, text: "Payment Management" },
        { available: true, text: "Automated payment links for monthly memberships" },
        { available: true, text: "Member Tracking" },
        { available: true, text: "Add training plans to users" },
        { available: true, text: "Email service" },
        { available: true, text: "Contract Management" },
    ];

    return (
        <>
            <SEO
                title="Irontrack - Pricing Plans"
                description="Flexible pricing plans for CrossFit gyms and athletes."
                keywords="crossfit pricing, gym management pricing, fitness platform cost"
                canonicalUrl="https://www.irontrack.ee/pricing"
            />
            <Box sx={{ overflowX: "hidden" }}>
                {/** HERO / PEALMINE SEKTSIOON **/}
                <Box
                    sx={{
                        minHeight: { xs: "60vh", md: "70vh" },
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        color: "#fff",
                        p: { xs: 2, md: 4 },
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), 
                                         url("https://images.unsplash.com/photo-1521805103424-d8f8430e8933?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            zIndex: -1,
                        },
                    }}
                >
                    <Container maxWidth="md">
                        <Box
                            component={motion.div}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Typography
                                variant={isMobile ? "h3" : "h2"}
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                    fontFamily: '"Montserrat", sans-serif',
                                }}
                            >
                                Our Flexible Pricing
                            </Typography>

                            <Typography
                                variant={isMobile ? "body1" : "h5"}
                                sx={{
                                    maxWidth: 700,
                                    mx: "auto",
                                    mb: 4,
                                    lineHeight: 1.6,
                                    fontWeight: 400,
                                    opacity: 0.9
                                }}
                            >
                                Built for CrossFit affiliate owners and free for regular users.
                                Leverage Montonio's cost-effective payment links to keep more of your revenue.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
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
                                onClick={() => navigate("/register")}
                            >
                                Get Started Today
                            </Button>
                        </Box>
                    </Container>
                </Box>

                <Container sx={{ py: { xs: 5, md: 8 } }}>
                    <LargeBanner text="Free for Regular Users" color={colors.primary} delay={0.2} />

                    <SectionTitle
                        title="How it works?"
                        subtitle="Create account as affiliate owner and start using Irontrack Premium package for free for 3 months. After that we will contact you and ask if you want to continue using our service. If you are regular user, you can use our service for free. If you want to use payments, then you need to create user on Montonio! Contact us and we will help you through!"
                    />

                    <SectionTitle
                        title="Simple Plans for Every Need"
                        subtitle="Whether you're an affiliate owner looking for a powerful gym management solution or an athlete wanting to track your progress—our pricing is clear, transparent, and helps you focus on what matters most: building a thriving community."
                    />

                    <LargeBanner text="Packages for affiliate owner" color={colors.primary} delay={0.4} />

                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                            <PricingCard
                                icon={<DescriptionIcon />}
                                title="Standard"
                                price="€49.99"
                                features={standardFeatures}
                                delay={0.3}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                            <PricingCard
                                icon={<StoreIcon />}
                                title="Premium"
                                price="€99.99"
                                features={premiumFeatures}
                                recommended={true}
                                delay={0.5}
                            />
                        </Grid>
                    </Grid>

                    {/* Montonio Integration Information */}
                    <Box
                        component={motion.div}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        sx={{
                            mt: 8,
                            mb: 4,
                            p: 4,
                            backgroundColor: alpha(colors.primary, 0.05),
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={2} sx={{ textAlign: "center" }}>
                                <IconCircle sx={{ mx: "auto", width: 70, height: 70 }}>
                                    <CreditCardIcon sx={{ fontSize: 36, color: colors.primary }} />
                                </IconCircle>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                        fontFamily: '"Montserrat", sans-serif',
                                    }}
                                >
                                    Montonio Integration (Optional)
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{ lineHeight: 1.6 }}
                                >
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
                                    sx={{
                                        width: "100%",
                                        py: 1.2,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        }
                                    }}
                                >
                                    Explore Montonio
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>

                {/** MONTONIO DETAILNE SEKTSIOON **/}
                <Box sx={{ backgroundColor: colors.lightGray, py: { xs: 6, md: 8 } }}>
                    <Container>
                        <SectionTitle
                            title="Montonio Payment Packages"
                            subtitle="Choose between Standard or Premium to fit your payment needs. Montonio's platform provides detailed payment management, secure bank links, and monthly invoices sent directly to your email."
                        />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <InfoCard
                                    icon={<CompareArrowsIcon />}
                                    title="Standard Package"
                                    description={`
                                        - Monthly fee of <strong>11.99€ per Month</strong><br>
                                        - Payment link fee 10€ per month<br>
                                        - Competitive rates <strong>0.15€</strong> per transaction<br>
                                        - Simple bank links<br>
                                        - Monthly invoice from Montonio<br>
                                        - Manage all payments in Montonio dashboard
                                    `}
                                    buttonText="Learn More"
                                    buttonLink="https://montonio.com/et/hinnapaketid/"
                                    delay={0.3}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <InfoCard
                                    icon={<CompareArrowsIcon />}
                                    title="Premium Package"
                                    description={`
                                        - Monthly fee of <strong>19.99€ per Month</strong><br>
                                        - Payment link fee 10€ per month<br>
                                        - Competitive rates <strong>0.05€</strong> per transaction<br>
                                        - Payment link customization<br>
                                        - Manage all payments in Montonio dashboard
                                    `}
                                    buttonText="Learn More"
                                    buttonLink="https://montonio.com/et/hinnapaketid/"
                                    delay={0.5}
                                />
                            </Grid>
                        </Grid>

                        <Divider
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            sx={{
                                my: 6,
                                "&::before, &::after": {
                                    borderColor: alpha(colors.primary, 0.2),
                                }
                            }}
                        />

                        {/** Võrdluse SEKTSIOON - 200 makset, keskmine 80€ **/}
                        <SectionTitle
                            title="Real Savings Example"
                            subtitle="Many other solutions (e.g. Stripe) charge around 1.4% + €0.25 per transaction. Let's compare:"
                            align="left"
                            delay={0.4}
                        />

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <ComparisonCard
                                    title="Other Providers"
                                    content={`
                                        <p style="margin-bottom: 16px;"><strong>200 payments</strong> x average <strong>€80</strong> = €16,000 total</p>
                                        <p>1.4% of €16,000 = <strong>€224</strong> <br/>
                                        + (200 x €0.25) = <strong>€50</strong> <br/>
                                        <strong>Total = €274</strong></p>
                                    `}
                                    delay={0.5}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <ComparisonCard
                                    title="With Montonio"
                                    content={`
                                        <p style="margin-bottom: 16px;"><strong>200 payments</strong> x average <strong>€80</strong> = €16,000 total</p>
                                        <p style="margin-bottom: 16px;">Approx. <strong>€40</strong> for the same volume by using Montonio Premium package + Payment links.</p>
                                        <p><strong>NB! Calculation is done with bank payments.</strong></p>
                                    `}
                                    isHighlighted={true}
                                    delay={0.6}
                                />
                            </Grid>
                        </Grid>

                        <Typography
                            variant="body2"
                            component={motion.p}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            sx={{
                                mt: 4,
                                color: 'text.secondary',
                                textAlign: 'center'
                            }}
                        >
                            By choosing our application integrated with Montonio, you save significantly
                            on transaction fees—allowing you to reinvest in your box and community.
                        </Typography>
                    </Container>
                </Box>

                {/** Montonio info & CTA **/}
                <Container sx={{ py: { xs: 5, md: 8 } }}>
                    <Box
                        component={motion.div}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        sx={{
                            textAlign: "center",
                            position: 'relative',
                            zIndex: 1,
                            p: { xs: 3, md: 6 },
                            borderRadius: 4,
                            backgroundColor: alpha(colors.primary, 0.02),
                            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                        }}
                    >
                        <SectionTitle
                            title="Getting Started with Montonio"
                            subtitle="Simply create an account on Montonio, choose Standard or Premium, then provide us with your API keys. Montonio will handle monthly invoices, and you can manage all transactions in their easy-to-use dashboard."
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
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
                            onClick={() => (window.location.href = "https://montonio.com/et/hinnapaketid/")}
                        >
                            Create Montonio Account
                        </Button>
                    </Box>
                </Container>

                {/** FOOTER **/}
                <Box sx={{ backgroundColor: colors.secondary, color: colors.white, py: 3 }}>
                    <Container>
                        <Typography variant="body2" align="center">
                            © {new Date().getFullYear()} Irontrack OÜ | All rights reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </>
    );
}