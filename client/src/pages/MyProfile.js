import React, { useState, useEffect } from 'react';
import {
    Container,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Toolbar,
    CircularProgress,
    Box,
    Card,
    CardContent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Statistics from '../components/Statistics';
import PurchaseHistory from '../components/PurchaseHistory';
import ActivePlans from '../components/ActivePlans';
import ProfileEdit from '../components/ProfileEdit';
import ChangePassword from '../components/ChangePassword';
import ProfileView from '../components/ProfileView';
import CreditView from '../components/CreditView';
import UserContracts from '../components/UserContracts'; // <-- Importime komponendi
import Transactions from "../components/Transactions";
import VisitHistory from "../components/VisitHistory";

import { getUserProfile, updateUserProfile, changeUserPassword } from '../api/profileApi';
import { uploadProfilePicture } from '../api/logoApi';
import { getUserContracts } from '../api/contractApi';

const menuItems = [
    { id: 'my-profile', label: 'My Profile', component: ProfileView },
    { id: 'edit-profile', label: 'Edit Profile', component: ProfileEdit },
    { id: 'change-password', label: 'Change Password', component: ChangePassword },
    { id: 'statistics', label: 'Statistics', component: Statistics },
    { id: 'purchase-history', label: 'Purchase History', component: PurchaseHistory },
    { id: 'visit-history', label: 'Visit History', component: VisitHistory },

    { id: 'active-plans', label: 'Active Plans', component: ActivePlans },

    { id: 'credit', label: 'Credit', component: CreditView },
    // UUS menüüelement
    { id: 'user-contracts', label: 'Contracts', component: UserContracts },
    { id: 'transactions', label: 'Transactions', component: Transactions },
];

export default function MyProfile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('my-profile');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Kasutame punase märgendina kuvatavat arvu, kui status = 'sent'
    const [sentCount, setSentCount] = useState(0);

    useEffect(() => {

            getUserProfile()
                .then((data) => {
                    setUser(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user profile:', error);
                    setIsLoading(false);
                });

    }, []);

    // Kui kasutaja info on laetud, toome tema lepingud (GET /contracts/user/:userId)
    useEffect(() => {
        if (user?.id) {
            loadUserContracts(user.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadUserContracts = async (userId) => {
        try {
            const data = await getUserContracts(userId);
            if (Array.isArray(data)) {
                const sent = data.filter((c) => c.status === 'Waiting for acceptance').length;
                setSentCount(sent);
            }
        } catch (err) {
            console.error('Error loading user contracts:', err);
        }
    };

    const handleMenuClick = (componentId) => {
        setActiveComponent(componentId);
        setDrawerOpen(false);
        setMenuOpen(false);
    };

    const handleUploadProfilePicture = async (file) => {
        try {
            const updatedUser = await uploadProfilePicture(file, user.id);
            setUser(updatedUser);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleSaveProfile = async (updatedUser) => {
        const success = await updateUserProfile(updatedUser);
        if (success) {
            setUser(updatedUser);
            setActiveComponent('my-profile');
        } else {
            alert('Failed to update profile');
        }
    };

    const handleChangePassword = async (passwordData) => {
        const success = await changeUserPassword(passwordData);
        if (success) {
            alert('Password changed successfully!');
            setActiveComponent('my-profile');
        } else {
            alert('Failed to change password.');
        }
    };

    // Leiame aktiivse komponendi menüüelementide seast
    const ActiveComponent =
        menuItems.find((item) => item.id === activeComponent)?.component || ProfileView;

    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 4,
                px: { xs: 0, sm: 0, md: 4 },
                display: 'flex',
                backgroundColor: 'background.default',
                pt: 2,
            }}
        >
            {/* Sidebar Navigation - desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: 240,
                    flexShrink: 0,
                    position: 'relative !important',
                }}
                PaperProps={{
                    sx: {
                        position: 'relative',
                    },
                }}
            >
                <Box sx={{ width: 220, p: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                <ListItemText
                                    primary={
                                        item.id === 'user-contracts' && sentCount > 0
                                            ? `${item.label} (${sentCount})`
                                            : item.label
                                    }
                                    sx={{
                                        color:
                                            item.id === 'user-contracts' && sentCount > 0
                                                ? 'red'
                                                : 'inherit',
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Mobiilne menüüriba allapoole suunatud noolega */}
            <Paper
                sx={{
                    position: 'fixed',
                    top: 45,
                    left: 0,
                    right: 0,
                    zIndex: 1300,

                    display: { xs: 'block', md: 'none' },
                }}
            >
                <BottomNavigation
                    showLabels
                    value={activeComponent}
                    onChange={(event, newValue) => {
                        setActiveComponent(newValue);
                        setMenuOpen(false);
                    }}
                    sx={{
                        backgroundColor: 'background.paper',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        height: 40,
                    }}
                >
                    <BottomNavigationAction
                        label="Menu"
                        icon={<ArrowDropDownIcon />}
                        onClick={() => setMenuOpen(!menuOpen)}
                        sx={{
                            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                        }}
                    />
                </BottomNavigation>

                {menuOpen && (
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            maxHeight: '500px',
                            overflowY: 'auto',
                        }}
                    >
                        <List>
                            {menuItems.map((item) => (
                                <ListItem
                                    button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id)}
                                >
                                    <ListItemText
                                        primary={
                                            item.id === 'user-contracts' && sentCount > 0
                                                ? `${item.label} (${sentCount})`
                                                : item.label
                                        }
                                        sx={{
                                            color:
                                                item.id === 'user-contracts' && sentCount > 0
                                                    ? 'red'
                                                    : 'inherit',
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Paper>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' } }}
            >
                <Toolbar />
                <Box sx={{ width: 240, p: 2 }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                            >
                                <ListItemText
                                    primary={
                                        item.id === 'user-contracts' && sentCount > 0
                                            ? `${item.label} (${sentCount})`
                                            : item.label
                                    }
                                    sx={{
                                        color:
                                            item.id === 'user-contracts' && sentCount > 0
                                                ? 'red'
                                                : 'inherit',
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, sm: 0, md: 3 },
                    backgroundColor: 'background.default',
                }}
            >
                <Card sx={{ backgroundColor: 'background.paper', p: 0, pt: 2, pb: 2 }}>
                    <CardContent>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : activeComponent === 'edit-profile' ? (
                            <ProfileEdit
                                user={user}
                                onSave={handleSaveProfile}
                                onCancel={() => setActiveComponent('my-profile')}
                            />
                        ) : activeComponent === 'change-password' ? (
                            <ChangePassword
                                onChangePassword={handleChangePassword}
                                onCancel={() => setActiveComponent('my-profile')}
                            />
                        ) : (
                            <ActiveComponent

                                user={user}
                                userId={user?.id}
                                onUploadProfilePicture={handleUploadProfilePicture}
                            />
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
