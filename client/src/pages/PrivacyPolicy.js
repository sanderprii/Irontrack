import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SecurityIcon from "@mui/icons-material/Security";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import UpdateIcon from "@mui/icons-material/Update";
import { Link } from "react-router-dom";
import SEO from '../components/SEO';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    paddingBottom: theme.spacing(1),
}));

const SubHeading = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontWeight: "bold",
}));

export default function PrivacyPolicy() {
    const lastUpdated = "March 20, 2025";

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <SEO
                title="Privacy Policy - IronTrack"
                description="Learn how IronTrack handles your data and protects your privacy"
                keywords="privacy policy, data protection, GDPR, IronTrack, gym management"
            />

            <Box sx={{ mb: 5, textAlign: "center" }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Privacy Policy
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Last Updated: {lastUpdated}
                </Typography>
            </Box>

            <StyledPaper>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <PrivacyTipIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
                    <Typography variant="h5" component="h2">
                        Introduction
                    </Typography>
                </Box>

                <Typography paragraph>
                    Welcome to IronTrack ("we," "our," or "us"). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our gym management platform.
                </Typography>

                <Typography paragraph>
                    By using IronTrack, you consent to the data practices described in this policy. If you do not agree with the data practices described, you should not use our platform.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DataUsageIcon sx={{ mr: 2 }} />
                        Information We Collect
                    </Box>
                </SectionHeading>

                <SubHeading variant="h6" component="h3">
                    Personal Information
                </SubHeading>

                <Typography paragraph>
                    We collect personal information that you voluntarily provide when using our service, which may include:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Contact information (name, email address, phone number)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Profile information (profile picture, physical address, emergency contact)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Payment and billing information" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Fitness data (workout records, training history, class attendance)" />
                    </ListItem>
                </List>

                <SubHeading variant="h6" component="h3">
                    Automatically Collected Information
                </SubHeading>

                <Typography paragraph>
                    When you access our platform, we may automatically collect certain information, including:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Device information (browser type, operating system, IP address)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Usage information (pages visited, time spent on platform, features used)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Cookies and similar technologies" />
                    </ListItem>
                </List>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DataUsageIcon sx={{ mr: 2 }} />
                        How We Use Your Information
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We use the information we collect for various purposes, including:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Providing and maintaining our services" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Processing transactions and managing subscriptions" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Managing class registrations and attendance" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Sending administrative communications and service-related notifications" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Improving and personalizing user experience" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Monitoring usage patterns and analyzing trends" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Detecting and preventing fraud and security incidents" />
                    </ListItem>
                </List>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SecurityIcon sx={{ mr: 2 }} />
                        Data Sharing and Disclosure
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We may share your information in the following circumstances:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="With gym owners and trainers authorized to access member information" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="With service providers that help us deliver our services (payment processors, email service providers)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="When required by law or to protect our rights" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="In connection with a business transaction (merger, sale, or acquisition)" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    We do not sell your personal information to third parties.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SecurityIcon sx={{ mr: 2 }} />
                        Data Security
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Encryption of sensitive data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Secure password storage using industry-standard hashing algorithms" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Regular security assessments and updates" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Access controls and authentication mechanisms" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DataUsageIcon sx={{ mr: 2 }} />
                        Your Rights and Choices
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    Depending on your location, you may have certain rights regarding your personal information, including:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Access and obtain a copy of your data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Rectify or update inaccurate or incomplete information" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Request deletion of your data (subject to legal obligations)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Restrict or object to processing of your data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Data portability (receiving your data in a structured format)" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    To exercise these rights, please contact us using the information in the "Contact Us" section below.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <UpdateIcon sx={{ mr: 2 }} />
                        Data Retention
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When determining how long to retain information, we consider:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="The nature and sensitivity of the data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Our legal obligations" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Potential risks of unauthorized access or disclosure" />
                    </ListItem>
                </List>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DataUsageIcon sx={{ mr: 2 }} />
                        International Data Transfers
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    Your information may be transferred to and processed in countries other than your country of residence, which may have different data protection laws. We ensure that appropriate safeguards are in place to protect your information when transferred internationally.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <UpdateIcon sx={{ mr: 2 }} />
                        Changes to this Privacy Policy
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last Updated" date. Your continued use of IronTrack after such changes indicates your acceptance of the updated policy.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ContactMailIcon sx={{ mr: 2 }} />
                        Contact Us
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </Typography>

                <Box sx={{ pl: 3, mb: 3 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>IronTrack OÜ</Typography>
                    <Typography>Email: info@irontrack.ee</Typography>

                </Box>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/"
                        sx={{ minWidth: 200 }}
                    >
                        Return to Home
                    </Button>
                </Box>
            </StyledPaper>
        </Container>
    );
}