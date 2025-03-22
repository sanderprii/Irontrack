// src/pages/message.js
import React, {useState} from 'react';
import {
    Container,
    Drawer,
    Box,
    List,
    ListItem,
    ListItemText,
    Card,
    CardContent,
    CircularProgress,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import {useEffect} from 'react';
import {getAffiliate} from '../api/affiliateApi';

// Kolm alamkomponenti, mille teed eraldi failides:
import SendMessage from '../components/SendMessage';
import SentMessage from '../components/SentMessage';
import GroupsMessage from '../components/GroupsMessage';

const menuItems = [
    {id: 'send-message', label: 'Send Message (+)', component: SendMessage},
    {id: 'sent-messages', label: 'Sent Messages', component: SentMessage},
    {id: 'groups', label: 'Groups', component: GroupsMessage},
];

// Näide: kui tahad, et vaikimisi oleks "sent-messages" avatud
export default function MessagePage() {
    const [activeComponent, setActiveComponent] = useState('sent-messages');
    const [affiliate, setAffiliate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAffiliate = async () => {
            try {
                const data = await getAffiliate();
                setAffiliate(data);
            } catch (error) {
                console.error('Error fetching affiliate:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAffiliate();
    }, []);

    // Leiame array-st õige komponendi klassi
    const ActiveComponent =
        menuItems.find((item) => item.id === activeComponent)?.component || SentMessage;

    const handleMenuClick = (componentId) => {
        setActiveComponent(componentId);
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                px: {xs: 0, sm: 0, md: 4},
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
            }}
        >
            {/* Horisontaalne mobiilimenüü */}
            <Paper
                sx={{
                    position: 'static',
                    top: 45,
                    left: 0,
                    right: 0,
                    zIndex: 1300,
                    display: {xs: 'block', md: 'none'},
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

            <Box sx={{display: "flex", flexGrow: 1}}>
                {/* Desktopi küljeriba */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', md: 'block'},
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
                    <Box sx={{width: 220, p: 2}}>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem
                                    button
                                    key={item.id}
                                    onClick={() => handleMenuClick(item.id)}
                                    selected={activeComponent === item.id}
                                >
                                    <ListItemText primary={item.label}/>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Põhisisu */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: {xs: 0, sm: 0, md: 3},
                        backgroundColor: 'background.paper',
                        mt: { xs: 1, md: 0 }, // Lisa väike vahe üleval mobiilivaates
                    }}
                >
                    <Card sx={{backgroundColor: 'background.paper', p: 0, pt: 2, pb: 2}}>
                        {isLoading ? (
                            <Box sx={{display: 'flex', justifyContent: 'center', my: 5}}>
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <CardContent>
                                {/* Aktiivne alamkomponent saab affiliate propsina */}
                                <ActiveComponent
                                    affiliate={affiliate.affiliate.id}
                                    affiliateEmail={affiliate.affiliate.email}
                                />
                            </CardContent>
                        )}
                    </Card>
                </Box>
            </Box>
        </Container>
    );
}