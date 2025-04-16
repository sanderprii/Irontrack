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
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PublicIcon from "@mui/icons-material/Public";
import PaymentIcon from "@mui/icons-material/Payment";
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
    const lastUpdated = "April 16, 2025";

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
                    Welcome to IronTrack ("we," "our," or "us"). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (the "Application").
                </Typography>

                <Typography paragraph>
                    Irontrack OÜ, registration code 17184398, email: info@irontrack.ee, is the data controller responsible for your personal data.
                </Typography>

                <Typography paragraph>
                    By using our Application, you consent to the data practices described in this policy. If you do not agree with the data practices described, you should not use our Application.
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
                        <ListItemText primary="Account information (username, password)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Profile information (profile picture if provided)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Training preferences and history" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Fitness activity data (class registrations, attendance)" />
                    </ListItem>
                </List>

                <SubHeading variant="h6" component="h3">
                    Payment Information
                </SubHeading>

                <Typography paragraph>
                    When you make purchases through our Application:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="All payment processing is handled through Montonio payment solution" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="We do not collect, store, or process your payment card details on our servers" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Montonio collects and processes the payment information necessary to complete transactions" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="We may receive and store certain transaction details (such as purchase date, amount, and confirmation of payment) to maintain records of your service purchases" />
                    </ListItem>
                </List>

                <SubHeading variant="h6" component="h3">
                    Automatically Collected Information
                </SubHeading>

                <Typography paragraph>
                    When you access our Application, we may automatically collect certain information, including:
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
                        <ListItemText primary="Usage information (features used, actions taken within the Application)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Log data (access times, pages viewed)" />
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
                        <ListItemText primary="Processing transactions through Montonio payment solution" />
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
                        <ListItemText primary="Monitoring usage patterns to enhance Application functionality" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Detecting and preventing fraud and security incidents" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Complying with legal obligations" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    We process your personal data only to the extent necessary to fulfill these purposes and to provide you with the best user experience.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PaymentIcon sx={{ mr: 2 }} />
                        Payment Processing
                    </Box>
                </SectionHeading>

                <SubHeading variant="h6" component="h3">
                    Montonio Payment Integration
                </SubHeading>

                <Typography paragraph>
                    Our Application uses Montonio for payment processing. When you make payments:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="You will be redirected to Montonio's secure payment environment" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Payment information is entered directly into Montonio's systems, not on our servers" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Montonio processes payments in accordance with industry-standard security protocols and compliance standards" />
                    </ListItem>
                </List>

                <SubHeading variant="h6" component="h3">
                    Transaction Information
                </SubHeading>

                <Typography paragraph>
                    For each transaction processed through Montonio, we receive and may store:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Transaction reference numbers" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Purchase amounts and currency" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Date and time of transaction" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Confirmation of successful or unsuccessful payment" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Service or package purchased" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    We do not receive or store your complete payment card details.
                </Typography>

                <SubHeading variant="h6" component="h3">
                    Relationship with Montonio
                </SubHeading>

                <Typography paragraph>
                    Montonio acts as a data processor with respect to your payment information. They process this data solely for the purpose of completing the transactions you authorize through our Application. Montonio's processing of your payment information is subject to their own Privacy Policy and Terms of Service.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SecurityIcon sx={{ mr: 2 }} />
                        Data Sharing and Disclosure
                    </Box>
                </SectionHeading>

                <SubHeading variant="h6" component="h3">
                    Service Providers
                </SubHeading>

                <Typography paragraph>
                    We may share your information with third-party service providers who perform services on our behalf, including:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Montonio for payment processing" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Cloud storage providers" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="IT and system administration services" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    These service providers have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </Typography>

                <SubHeading variant="h6" component="h3">
                    Gym Owners and Service Providers
                </SubHeading>

                <Typography paragraph>
                    Information related to your training activities may be shared with gym owners and service providers with whom you register for classes through our Application. This is necessary for the provision of the services you request.
                </Typography>

                <SubHeading variant="h6" component="h3">
                    Legal Requirements
                </SubHeading>

                <Typography paragraph>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                </Typography>

                <SubHeading variant="h6" component="h3">
                    Business Transfers
                </SubHeading>

                <Typography paragraph>
                    If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our Application of any change in ownership or uses of your personal information.
                </Typography>

                <SubHeading variant="h6" component="h3">
                    Third-Party Disclosure Limitations
                </SubHeading>

                <Typography paragraph>
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this Privacy Policy. We do not share your data with third parties for marketing purposes.
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
                        Your Rights Under GDPR
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    Under the General Data Protection Regulation (GDPR), if you are a resident of the European Economic Area (EEA), you have certain data protection rights. You have the right to:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Access your personal data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Rectify inaccurate or incomplete personal data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Erase your personal data ('right to be forgotten')" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Restrict processing of your personal data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Object to processing of your personal data" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Data portability (receive your data in a structured, machine-readable format)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Withdraw consent at any time where we relied on your consent to process your personal data" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    To exercise these rights, please contact us at info@irontrack.ee.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <UpdateIcon sx={{ mr: 2 }} />
                        Data Retention
                    </Box>
                </SectionHeading>

                <SubHeading variant="h6" component="h3">
                    General Data Retention
                </SubHeading>

                <Typography paragraph>
                    We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="The period needed to provide you with the services you have requested" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Whether there are legal obligations to which we are subject" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Whether retention is advisable considering our legal position (such as for statutes of limitations, litigation, or regulatory investigations)" />
                    </ListItem>
                </List>

                <SubHeading variant="h6" component="h3">
                    Payment Data Retention
                </SubHeading>

                <Typography paragraph>
                    For payment-related data:
                </Typography>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Transaction records are retained for a period of 7 years to comply with accounting and tax regulations" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="After this period, transaction data is either deleted or anonymized" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <ArrowRightIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="We do not store your complete payment card details at any time" />
                    </ListItem>
                </List>

                <Typography paragraph>
                    After you have terminated your use of our services, we may store your information in an aggregated and anonymized format.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ChildCareIcon sx={{ mr: 2 }} />
                        Children's Privacy
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    Our Application is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately at info@irontrack.ee, and we will take steps to remove such information.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PublicIcon sx={{ mr: 2 }} />
                        International Data Transfers
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    Your information may be transferred to and processed in countries other than your country of residence, which may have different data protection laws. We ensure that appropriate safeguards are in place to protect your information when transferred internationally, in compliance with applicable data protection laws.
                </Typography>

                <SectionHeading variant="h5" component="h2">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <UpdateIcon sx={{ mr: 2 }} />
                        Changes to this Privacy Policy
                    </Box>
                </SectionHeading>

                <Typography paragraph>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our Application and updating the "Last Updated" date. Your continued use of the Application after such changes indicates your acceptance of the updated policy.
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
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Irontrack OÜ</Typography>
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