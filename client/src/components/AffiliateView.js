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
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AffiliateEdit from './AffiliateEdit';
import { uploadAffiliateLogo } from '../api/logoApi';
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function AffiliateView({ token, affiliate, trainers, onUpdateAffiliate }) {
    const [editing, setEditing] = useState(false);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);

    const handleSave = async (updatedAffiliate) => {
        await onUpdateAffiliate(updatedAffiliate);
        setEditing(false);
    };

    // Funktsioon logo üleslaadimiseks
    const handleLogoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const result = await uploadAffiliateLogo(file, affiliate.id, token);
            // Uuenda affiliate andmeid uue logoga
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
        <Grid container spacing={3}  >
            {/* Vasak veerg – affiliate info */}
            <Grid item xs={12} md={12}>
                <Card sx={{ bgcolor: 'background.paper' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={affiliate.logo || 'https://via.placeholder.com/120'}
                            // Kuvatakse originaalsuurusena, aga piirame maksimaalseks mõõtmeteks 200×200
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '200px',
                                maxHeight: '200px',
                                margin: 'auto',
                                backgroundColor: 'transparent',
                            }}
                            variant="square"
                        />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            {affiliate.name || 'No affiliate name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {affiliate.trainingType || 'No training type'}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button variant="contained" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button variant="outlined" component="label">
                                Upload Logo
                                <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
                    <CardContent>
                        <Typography variant="h6">Contact</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong></strong> {affiliate.email}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <PhoneAndroidIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong></strong> {affiliate.phone}
                            </Typography>
                        </Box>

                        {/* Aadress */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <LocationOnIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong></strong> {affiliate.address}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <LocationOnIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong></strong> {affiliate.subdomain}
                            </Typography>
                        </Box>

                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
                    <CardContent>
                        <Typography variant="h6">Trainers</Typography>
                        <List>
                            {trainers.length > 0 ? (
                                trainers.map((trainer) => (
                                    <ListItem key={trainer.trainerId}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <PersonIcon sx={{ color: "gray" }} />
                                            <Typography>
                                                <strong></strong> {trainer.fullName}
                                            </Typography>
                                        </Box>


                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No trainers assigned.</Typography>
                            )}
                        </List>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
                    <CardContent>
                        <Typography variant="h6">Bank Details</Typography>
                        <Typography>IBAN: {affiliate.iban || 'No IBAN'}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AccountBalanceIcon sx={{ color: "gray" }} />
                            <Typography>
                                <strong></strong> {affiliate.bankName}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
                    <CardContent>
                        <Typography variant="h6">Payment Holiday fee: {affiliate.paymentHolidayFee}€</Typography>

                    </CardContent>
                </Card>

            </Grid>


        </Grid>
    );
}
