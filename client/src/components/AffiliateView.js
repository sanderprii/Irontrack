// src/components/AffiliateView.js
import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Box,
    List,
    ListItem,
    Divider,
    Chip,
    Paper,
    Link,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LanguageIcon from '@mui/icons-material/Language';
import DomainIcon from '@mui/icons-material/Domain';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PaymentIcon from '@mui/icons-material/Payment';

import AffiliateEdit from './AffiliateEdit';
import { uploadAffiliateLogo } from '../api/logoApi';

export default function AffiliateView({ token, affiliate, trainers, onUpdateAffiliate }) {
    const [editing, setEditing] = useState(false);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);

    const handleSave = async (updatedAffiliate) => {
        await onUpdateAffiliate(updatedAffiliate);
        setEditing(false);

    };

    // Function for uploading logo
    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const result = await uploadAffiliateLogo(file, affiliate.id, token);
            // Update affiliate data with new logo
            onUpdateAffiliate(result.affiliate);
        } catch (error) {
            alert(error.message);
        }
    };

    if (editing) {
        return (
            <AffiliateEdit
                affiliate={affiliate}
                trainers={trainers}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                {/* Main info card with logo */}
                <Card sx={{ bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        <Avatar
                            src={affiliate.logo || 'https://via.placeholder.com/120'}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '300px',
                                maxHeight: '300px',
                                margin: 'auto',
                                backgroundColor: 'transparent',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            variant="square"
                        />
                        <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
                            {affiliate.name || 'No affiliate name'}
                        </Typography>
                        <Chip
                            label={affiliate.trainingType || 'No training type'}
                            color="primary"
                            size="small"
                            sx={{ mt: 1 }}
                        />

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                                sx={{ borderRadius: 2 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<FileUploadIcon />}
                                sx={{ borderRadius: 2 }}
                            >
                                Upload Logo
                                <input type="file" accept="image/*" hidden onChange={handleLogoChange}/>
                            </Button>
                        </Box>

                        {/* Website and subdomain information moved below the buttons */}
                        <Box sx={{ mt: 3, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <LanguageIcon sx={{ color: "primary.main" }}/>
                                <Link href={affiliate.website} target="_blank" underline="hover">
                                    {affiliate.website || 'No website provided'}
                                </Link>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <DomainIcon sx={{ color: "primary.main" }}/>
                                <Link href={`https://${affiliate.subdomain}.irontrack.ee`} target="_blank" underline="hover">
                                    {affiliate.subdomain}.irontrack.ee
                                </Link>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="body2" color="text.secondary">Feedback link:</Typography>
                                <Link href={`https://${affiliate.feedback}`} target="_blank" underline="hover">
                                    {affiliate.feedback}
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Contact information card - improved */}
                <Card sx={{ mt: 3, bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            Contact Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <EmailIcon sx={{ color: "primary.main" }}/>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Email</Typography>
                                            <Typography variant="body1">
                                                {affiliate.email || 'No email provided'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <PhoneAndroidIcon sx={{ color: "primary.main" }}/>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                                            <Typography variant="body1">
                                                {affiliate.phone || 'No phone provided'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <LocationOnIcon sx={{ color: "primary.main" }}/>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Address</Typography>
                                            <Typography variant="body1">
                                                {affiliate.address || 'No address provided'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Trainers card - improved */}
                <Card sx={{ mt: 3, bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon fontSize="small" />
                            Trainers
                        </Typography>

                        {trainers.length > 0 ? (
                            <Grid container spacing={2}>
                                {trainers.map((trainer) => (
                                    <Grid item xs={12} sm={6} md={4} key={trainer.trainerId}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                bgcolor: 'background.default',
                                                borderRadius: 2,
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    boxShadow: 1,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 40,
                                                        height: 40
                                                    }}
                                                >
                                                    {trainer.fullName.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {trainer.fullName}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
                                <Typography color="text.secondary">No trainers assigned to this affiliate.</Typography>
                            </Paper>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Holiday fee card */}
                <Card sx={{ mt: 3, bgcolor: 'background.paper', boxShadow: 2, borderRadius: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaymentIcon fontSize="small" />
                            Payment Information
                        </Typography>

                        <Paper elevation={0} sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="body1">Holiday fee:</Typography>
                                <Chip
                                    label={`${affiliate.paymentHolidayFee}€` || ""}
                                    color="success"
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </Paper>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}