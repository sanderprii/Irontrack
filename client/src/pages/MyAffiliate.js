// src/pages/MyAffiliate.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Toolbar,
    CircularProgress,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getAffiliate, updateAffiliate } from '../api/affiliateApi';
import AffiliateView from '../components/AffiliateView';
import FinanceView from '../components/FinanceView';
import AffiliateContracts from '../components/AffiliateContracts';
import UnpaidUsers from '../components/UnPaidUsers';
import { Paper } from '@mui/material';

const pricingPlan = localStorage.getItem('pricingPlan');

const menuItems = [
    { id: 'my-affiliate', label: 'My Affiliate', component: AffiliateView },
    { id: 'finance', label: 'Finance', component: FinanceView },
    ...(pricingPlan === 'premium' ? [
        { id: 'contracts', label: 'Contracts', component: AffiliateContracts },
        { id: 'unpaid-users', label: 'Unpaid Users', component: UnpaidUsers },
    ] : [])
];

export default function MyAffiliate() {
    const [affiliate, setAffiliate] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeComponent, setActiveComponent] = useState('my-affiliate');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        getAffiliate()
            .then((data) => {
                setAffiliate(data.affiliate || {});
                setTrainers(data.trainers || []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching affiliate:', error);
                setIsLoading(false);
            });
    }, []);

    const handleMenuClick = (componentId) => {
        setActiveComponent(componentId);
        setDrawerOpen(false);
    };

    const handleUpdateAffiliate = async (updatedAffiliate) => {
        const success = await updateAffiliate(updatedAffiliate);
        if (success) {
            setAffiliate(updatedAffiliate);
            setActiveComponent('my-affiliate');
        } else {
            alert('Failed to update affiliate');
        }
    };

    // Valib aktiivse komponendi menüüst
    const ActiveComponent =
        menuItems.find((item) => item.id === activeComponent)?.component || AffiliateView;

    return (
        <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
            {/* Horisontaalne mobiilimenüü */}
            <Paper
                sx={{
                    position: 'static',
                    top: 45,
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
                            minHeight: '36px', // 25% madalam kui enne (48px -> 36px)
                            width: '100%',
                            '& .MuiTabs-flexContainer': {
                                width: '100%',
                                display: 'flex',
                                '& > *': {
                                    flexGrow: 1, // Kõik tabid võrdselt laiaks kui ruumi on
                                },
                            },
                            '& .MuiTab-root': {
                                minHeight: '36px', // 25% madalam kui enne (48px -> 36px)
                                py: 0.75, // Vähendatud padding ülevalt ja alt
                                textTransform: 'none',
                            },
                        }}
                    >
                        {menuItems.map((item) => (
                            <Tab
                                key={item.id}
                                label={item.label}
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

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                {/* Sidebar Navigation desktop vaates */}
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
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Main Content */}
                <Box sx={{ flexGrow: 1, pt: 2 }}>
                    <Card>
                        <CardContent>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ActiveComponent
                                    affiliate={affiliate}
                                    trainers={trainers}
                                    affiliateId={affiliate.id}
                                    onUpdateAffiliate={handleUpdateAffiliate}
                                />
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}