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
} from "@mui/material";
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
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
                <Box sx={{flexGrow: 1, p: {xs: 0, md: 3}}}>
                    {isLoadingMember ? (
                        <Box sx={{display: "flex", justifyContent: "center", my: 5}}>
                            <CircularProgress/>
                        </Box>
                    ) : selectedMember ? (
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
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