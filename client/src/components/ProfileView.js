import React from 'react';
import {Card, CardContent, Typography, Button, Avatar, Box, Divider, Stack} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';

export default function ProfileView({user, onEditProfile, onChangePassword, onUploadProfilePicture}) {

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUploadProfilePicture(file);
        }
    };

    const role = localStorage.getItem("role");

    return (
        <Card sx={{maxWidth: 600, mx: 'auto', boxShadow: 3, borderRadius: 3, backgroundColor: 'background.paper'}}>
            <CardContent sx={{textAlign: 'center', p: 3}}>
                {role === "regular" ? (
                    <>
                        <Avatar
                            src={user?.logo || "https://via.placeholder.com/120"}
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%', // Muudab profiilipildi ringiks
                                objectFit: 'cover',
                                margin: 'auto',
                            }}
                        />
                        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                            Upload Profile Picture
                            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1} sx={{ textAlign: 'left' }}>
                            {/* Nimi */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PersonIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <EmailIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PhoneAndroidIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>

                            {/* Aadress */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <LocationOnIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.address}
                                </Typography>
                            </Box>
                        </Stack>


                    </>
                ) : (
                    <>
                        <Avatar
                            src={user?.logo || "https://via.placeholder.com/120"}
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%', // Muudab profiilipildi ringiks
                                objectFit: 'cover',
                                margin: 'auto',
                            }}
                        />

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1} sx={{ textAlign: 'left' }}>
                            {/* Nimi */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PersonIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.fullName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <EmailIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.email}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <PhoneAndroidIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.phone}
                                </Typography>
                            </Box>
                            {/* Aadress */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <LocationOnIcon sx={{ color: "gray" }} />
                                <Typography>
                                    <strong></strong> {user.address}
                                </Typography>
                            </Box>
                        </Stack>


                    </>
                )}
        </CardContent>
</Card>
)
    ;
}
