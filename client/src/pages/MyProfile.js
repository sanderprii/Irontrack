import React, { useState, useEffect } from 'react';
import {
    Container,
    Drawer,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
    Badge,
} from '@mui/material';
import { Paper } from '@mui/material';

import Statistics from '../components/Statistics';
import PurchaseHistory from '../components/PurchaseHistory';
import ActivePlans from '../components/ActivePlans';
import ProfileEdit from '../components/ProfileEdit';
import ChangePassword from '../components/ChangePassword';
import ProfileView from '../components/ProfileView';
import CreditView from '../components/CreditView';
import UserContracts from '../components/UserContracts';
import Transactions from "../components/Transactions";
import VisitHistory from "../components/VisitHistory";
import TrainingPlans from '../components/TrainingPlans';
import FamilyMembers from '../components/FamilyMembers';

import { getUserProfile, updateUserProfile, changeUserPassword } from '../api/profileApi';
import { uploadProfilePicture } from '../api/logoApi';
import { getUserContracts } from '../api/contractApi';

const menuItems = [
    { id: 'my-profile', label: 'My Profile', component: ProfileView },
    { id: 'family-members', label: 'Children', component: FamilyMembers },
    { id: 'training-plans', label: 'Training Plans', component: TrainingPlans },
    { id: 'edit-profile', label: 'Edit Profile', component: ProfileEdit },
    { id: 'change-password', label: 'Change Password', component: ChangePassword },
    { id: 'statistics', label: 'Statistics', component: Statistics },
    { id: 'purchase-history', label: 'Purchase History', component: PurchaseHistory },
    { id: 'visit-history', label: 'Visit History', component: VisitHistory },
    { id: 'active-plans', label: 'Active Plans', component: ActivePlans },
    { id: 'credit', label: 'Credit', component: CreditView },
    { id: 'user-contracts', label: 'Contracts', component: UserContracts },
    { id: 'transactions', label: 'Transactions', component: Transactions },
];

export default function MyProfile() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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

    const renderActiveComponent = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (activeComponent === 'edit-profile') {
            return (
                <ProfileEdit
                    user={user}
                    onSave={handleSaveProfile}
                    onCancel={() => setActiveComponent('my-profile')}
                />
            );
        }

        if (activeComponent === 'change-password') {
            return (
                <ChangePassword
                    onChangePassword={handleChangePassword}
                    onCancel={() => setActiveComponent('my-profile')}
                />
            );
        }

        if (activeComponent === 'training-plans') {
            return (
                <TrainingPlans
                    userId="self"
                    role={user?.role || 'regular'}
                    userName={user?.email}
                    userFullName={user?.fullName}
                    affiliateId={user?.homeAffiliate}
                />
            );
        }

        // For all other components
        return (
            <ActiveComponent
                user={user}
                userId={user?.id}
                role={user?.role || 'regular'}
                userName={user?.email}
                userFullName={user?.fullName}
                affiliateId={user?.homeAffiliate}
                onUploadProfilePicture={handleUploadProfilePicture}
            />
        );
    };

    // Horisontaalse menüü Tab kuvamiseks, lisame punase indikaatori vajadusel
    const renderTabLabel = (item) => {
        if (item.id === 'user-contracts' && sentCount > 0) {
            return (
                <Badge badgeContent={sentCount} color="error">
                    {item.label}
                </Badge>
            );
        }
        return item.label;
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 2,
                px: { xs: 0, sm: 0, md: 4 },
                display: 'flex',
                backgroundColor: 'background.default',
                pt: 2,
            }}
        >
            {/* Horisontaalne mobiilimenüü */}
            <Paper
                sx={{
position: 'absolute',
                    top: 5,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    display: { xs: 'block', md: 'none' },
                    overflow: 'hidden',
                }}
                elevation={1}
            >
                <Box
                    sx={{
                        overflowX: 'auto',
                        display: 'flex',
                        width: '100%',
                        WebkitOverflowScrolling: 'touch', // Parem kerimine iOS-il
                        msOverflowStyle: 'none', // IE ja Edge jaoks
                        scrollbarWidth: 'none', // Firefox jaoks
                        '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari ja Opera jaoks
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            height: '100%',
                            width: '20px',
                            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))',
                            pointerEvents: 'none', // Et gradient ei takistaks klikke
                        },
                    }}
                >
                    <Tabs
                        value={activeComponent}
                        onChange={(event, newValue) => setActiveComponent(newValue)}
                        variant="scrollable"
                        scrollButtons={false}
                        TabIndicatorProps={{ style: { display: 'none' } }} // Peida indikaator
                        sx={{
                            minHeight: '36px', // 25% madalam kui tavaline (48px -> 36px)
                            width: '100%',
                            '& .MuiTabs-flexContainer': {
                                width: '100%',
                                display: 'flex',
                                '& > *': {
                                    flexGrow: 1, // Kõik tabid võrdselt laiaks kui ruumi on
                                },
                            },
                            '& .MuiTab-root': {
                                minHeight: '36px', // 25% madalam kui tavaline (48px -> 36px)
                                py: 0.75, // Vähendatud padding ülevalt ja alt
                                textTransform: 'none',
                            },
                        }}
                    >
                        {menuItems.map((item) => (
                            <Tab
                                key={item.id}
                                label={renderTabLabel(item)}
                                value={item.id}
                                sx={{
                                    whiteSpace: 'nowrap',
                                    minWidth: 'auto',
                                    fontWeight: activeComponent === item.id ? 'bold' : 'normal',
                                    fontSize: '0.85rem', // Väiksem font, et sobituks madalama kõrgusega
                                    px: 1, // Vähendatud külgmine padding
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Paper>

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
                                selected={activeComponent === item.id}
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

            {/* Sisu kuvamiseks peame lisama pikema marginaali, et jätta ruumi fikseeritud menüüle */}
            <Box
                sx={{
                    flexGrow: 1,
                    p: { xs: 0, sm: 0, md: 3 },
                    backgroundColor: 'background.default',

                }}
            >
                <Card sx={{ backgroundColor: 'background.paper', p: 0, pt: 2, pb: 2 }}>
                    <CardContent>
                        {renderActiveComponent()}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}