import React, {useState, useEffect} from "react";
import {
    Container,
    Typography,
    TextField,
    List,
    ListItem,
    ListItemText,
    Grid,
    Card,
    CardContent,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Drawer,
    Tabs,
    Tab,
    Paper,
} from "@mui/material";
import {BottomNavigation, BottomNavigationAction} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    getMembers,
    getMemberInfo,
    searchUsers,
    getOwnerAffiliateId,
    addMember,
} from "../api/membersApi";
import ProfileView from "../components/ProfileView";
import Statistics from "../components/Statistics";
import PurchaseHistory from "../components/PurchaseHistory";
import ActivePlans from "../components/ActivePlans";
import CreditView from "../components/CreditView";
import UserContracts from "../components/UserContracts";
import Transactions from "../components/Transactions";
import VisitHistory from "../components/VisitHistory";
import TrainingPlans from '../components/TrainingPlans';

export default function Members() {
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [ownerAffiliateId, setOwnerAffiliateId] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);
    const [activeComponent, setActiveComponent] = useState("profile");
    const [isLoadingMember, setIsLoadingMember] = useState(false);

    // User role for components like TrainingPlans
    const [userRole, setUserRole] = useState('affiliate');

    const menuItems = [
        {id: "profile", label: "Profile", component: ProfileView},
        { id: 'training-plans', label: 'Training Plans', component: TrainingPlans },
        {id: "statistics", label: "Statistics", component: Statistics},
        {id: "purchase-history", label: "Purchase History", component: PurchaseHistory},
        {id: "visit-history", label: "Visit History", component: VisitHistory},
        {id: "active-plans", label: "Active Plans", component: ActivePlans},
        {id: "credit", label: "Credit", component: CreditView},
        {id: "contracts", label: "Contracts", component: UserContracts},
        {id: "transactions", label: "Transactions", component: Transactions},
    ];

    useEffect(() => {
        // Determine user role
        const userRoleFromStorage = localStorage.getItem("userRole");
        if (userRoleFromStorage) {
            setUserRole(userRoleFromStorage);
        }

        const affiliateIdLocalStorage = localStorage.getItem("affiliateId");

        if (affiliateIdLocalStorage) {
            setOwnerAffiliateId(parseInt(affiliateIdLocalStorage));
        } else {

            async function fetchOwnerAffiliateId() {
                try {
                    const response = await getOwnerAffiliateId();
                    if (response?.affiliateId) {
                        setOwnerAffiliateId(response.affiliateId);
                    } else {
                        console.error("❌ Failed to get owner's affiliateId.");
                    }
                } catch (error) {
                    console.error("❌ Error fetching affiliateId:", error);
                }
            }

            fetchOwnerAffiliateId();
        }
    }, []);

    useEffect(() => {
        if (ownerAffiliateId) {
            async function fetchMembers() {
                try {
                    const response = await getMembers(ownerAffiliateId);
                    setMembers(Array.isArray(response) ? response : []);
                } catch (error) {
                    console.error("❌ Error fetching members:", error);
                }
            }

            fetchMembers();
        }
    }, [ownerAffiliateId]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.length > 2) {
                const results = await searchUsers(searchQuery);
                setSearchResults(results || []);
            } else {
                setSearchResults([]);
            }
        };
        fetchSearchResults();
    }, [searchQuery]);

    const handleMemberClick = async (member) => {
        setIsLoadingMember(true);
        try {
            const userId = member.userId || (member.user && member.user.id) || member.id;
            const response = await getMemberInfo(userId, ownerAffiliateId);
            setSelectedMember(response || {});
            setActiveComponent("profile");
        } catch (error) {
            console.error("❌ Error fetching member info:", error);
        }
        setIsLoadingMember(false);
        setMenuOpen(false);
    };

    const handleMenuClick = (componentId) => {
        setActiveComponent(componentId);
        setMenuOpen(false);
    };

    const handleAddMember = async (userId) => {
        try {
            await addMember(userId, ownerAffiliateId);
            const response = await getMembers(ownerAffiliateId);
            setMembers(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("❌ Error adding member:", error);
        }
    };

    const ActiveComponent =
        menuItems.find((item) => item.id === activeComponent)?.component || ProfileView;

    return (
        <Container maxWidth={false} sx={{display: "flex", flexDirection: "column", p: 0}}>
            {/* Mobiilne menüüriba navbari all, lehe täislaiuses */}
            <Paper
                sx={{
                    display: {xs: "block", md: "none"},
                    position: "static",
                    top: 56, // Kohanda vastavalt oma navbari kõrgusele (nt 64px)
                    zIndex: 1100,
                    width: "100%",
                    left: 0,
                    right: 0,
                }}
            >
                <BottomNavigation
                    showLabels
                    sx={{
                        backgroundColor: "background.paper",
                        borderTop: "1px solid",
                        borderColor: "divider",
                        height: 40,
                    }}
                >
                    <BottomNavigationAction
                        label="Members"
                        icon={<ArrowDropDownIcon/>}
                        onClick={() => setMenuOpen(!menuOpen)}
                        sx={{
                            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    />
                </BottomNavigation>

                {menuOpen && (
                    <Box
                        sx={{
                            backgroundColor: "background.paper",
                            borderTop: "1px solid",
                            borderColor: "divider",
                            maxHeight: "500px",
                            overflowY: "auto",
                            p: 2,
                            width: "100%",
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            margin="normal"
                        />
                        {searchQuery.length > 2 && (
                            <List>
                                {searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            button
                                            onClick={() => handleMemberClick({...user, userId: user.id})}
                                        >
                                            <ListItemText primary={user.fullName || user.username}/>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2">No users found.</Typography>
                                )}
                            </List>
                        )}
                        <List>
                            {members.length > 0 ? (
                                members.map((member) => (
                                    <ListItem
                                        key={member.userId}
                                        button
                                        onClick={() => handleMemberClick({...member.user, userId: member.userId})}
                                    >
                                        <ListItemText primary={member.user.fullName}/>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2">No members found.</Typography>
                            )}
                        </List>
                    </Box>
                )}
            </Paper>

            {/* Horisontaalne mobiilimenüü komponentidele (nähtav ainult kui liige on valitud) */}
            {selectedMember && (
                <Paper
                    sx={{
                        display: { xs: "block", md: "none" },
                        position: "static",
                        zIndex: 1050,
                        width: "100%",
                        left: 0,
                        right: 0,
                        overflow: 'hidden',
                        marginTop: menuOpen ? 0 : 0, // Kohandame asukohta vastavalt sellele, kas members dropdown on avatud
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
            )}

            {/* Põhisisu: Desktopil vasakul Drawer, paremal komponendid */}
            <Box sx={{display: "flex", flexGrow: 1}}>
                {/* Vasak paneel: Liikmete nimekiri ja otsing (desktop vaade) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: {xs: "none", md: "block"},
                        width: 300,
                        flexShrink: 0,
                        position: "relative !important",
                    }}
                    PaperProps={{
                        sx: {position: "relative"},
                    }}
                >
                    <Box sx={{width: 300, p: 2}}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            Members
                        </Typography>
                        <TextField
                            fullWidth
                            label="Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            margin="normal"
                        />
                        {searchQuery.length > 2 && (
                            <List>
                                {searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <ListItem
                                            key={user.id}
                                            button
                                            onClick={() => handleMemberClick({...user, userId: user.id})}
                                        >
                                            <ListItemText primary={user.fullName || user.username}/>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2">No users found.</Typography>
                                )}
                            </List>
                        )}
                        <List>
                            {members.length > 0 ? (
                                members.map((member) => (
                                    <ListItem
                                        key={member.userId}
                                        button
                                        onClick={() => handleMemberClick({...member.user, userId: member.userId})}
                                    >
                                        <ListItemText primary={member.user.fullName}/>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2">No members found.</Typography>
                            )}
                        </List>
                    </Box>
                </Drawer>

                {/* Parempoolne paneel: valitud kasutaja profiil ja menüü vaated */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: {xs: 0, md: 3},
                        // Lisa väike ruumi ülaossa horisontaalse menüü jaoks mobiilivaates
                        mt: { xs: selectedMember ? 1 : 0, md: 0 }
                    }}
                >
                    {isLoadingMember ? (
                        <Box sx={{display: "flex", justifyContent: "center", my: 5}}>
                            <CircularProgress/>
                        </Box>
                    ) : selectedMember ? (
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    {/* Desktop vaates näitame vasakul külgmenüüd */}
                                    <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                                        <Box sx={{textAlign: "center"}}>
                                            <Avatar
                                                src={
                                                    selectedMember.logo ||
                                                    "https://via.placeholder.com/120"
                                                }
                                                sx={{width: 100, height: 100, margin: "auto"}}
                                            />
                                            <Typography variant="h6" sx={{mt: 2}}>
                                                {selectedMember.fullName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedMember.role || "Member"}
                                            </Typography>

                                            {!selectedMember.isMember && (
                                                <Button onClick={() => handleAddMember(selectedMember.id)}>
                                                    Add member
                                                </Button>
                                            )}
                                        </Box>
                                        <List>
                                            {menuItems.map((item) => (
                                                <ListItem
                                                    button
                                                    key={item.id}
                                                    selected={activeComponent === item.id}
                                                    onClick={() => handleMenuClick(item.id)}
                                                >
                                                    <ListItemText primary={item.label}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>

                                    {/* Mobiilis näitame ainult profiilipilti ja nime */}
                                    <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 1 }}>

                                        <Typography variant="h6" sx={{mt: 1}}>
                                            {selectedMember.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedMember.role || "Member"}
                                        </Typography>

                                        {!selectedMember.isMember && (
                                            <Button
                                                onClick={() => handleAddMember(selectedMember.id)}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            >
                                                Add member
                                            </Button>
                                        )}
                                    </Grid>

                                    {/* Komponendi sisu */}
                                    <Grid item xs={12} md={9}>
                                        <ActiveComponent
                                            user={selectedMember}
                                            userId={selectedMember.id}
                                            role={userRole}
                                            userName={selectedMember.email}
                                            userFullName={selectedMember.fullName}
                                            affiliateId={ownerAffiliateId}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography variant="h6">Select a member to view details.</Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
}