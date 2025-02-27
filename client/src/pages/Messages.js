// src/pages/message.js
import React, {useState} from 'react';
import {
    Container,
    Drawer,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Toolbar,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Kolm alamkomponenti, mille teed eraldi failides:
import SendMessage from '../components/SendMessage';
import SentMessage from '../components/SentMessage';
import GroupsMessage from '../components/GroupsMessage';
import {useEffect} from 'react';
import {getAffiliate} from '../api/affiliateApi';

const menuItems = [
    {id: 'send-message', label: 'Send Message (+)', component: SendMessage},
    {id: 'sent-messages', label: 'Sent Messages', component: SentMessage},
    {id: 'groups', label: 'Groups', component: GroupsMessage},
];

// Näide: kui tahad, et vaikimisi oleks “sent-messages” avatud
export default function MessagePage() {
    const [activeComponent, setActiveComponent] = useState('sent-messages');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [affiliate, setAffiliate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [menuOpen, setMenuOpen] = useState(false);

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
        setMenuOpen(false);
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

            {/* Mobile Menu Button */}


            <Paper
                sx={{
                    position: 'static',
                    top: 45,
                    left: 0,
                    right: 0,
                    zIndex: 1300,

                    display: {xs: 'block', md: 'none'},
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
                        icon={<ArrowDropDownIcon/>}
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

                                    <ListItemText primary={item.label}/>

                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
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
                                <ActiveComponent affiliate={affiliate.affiliate.id}
                                affiliateEmail={affiliate.affiliate.email}/>
                            </CardContent>
                        )}
                    </Card>
                </Box>
            </Box>
        </Container>

    );
}
