import React, { useState, useEffect } from "react";
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
    Chip,
    CircularProgress,
    Drawer,
    IconButton,
    Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
    getMembers,
    getMemberInfo,
    searchUsers,
    getOwnerAffiliateId,
} from "../api/membersApi";
import ProfileView from "../components/ProfileView";
import Statistics from "../components/Statistics";
import PurchaseHistory from "../components/PurchaseHistory";
import ActivePlans from "../components/ActivePlans";
import CreditView from "../components/CreditView";

export default function Members() {
    // Vasaku paneeli olek: liikmete nimekiri, otsing jne.
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [ownerAffiliateId, setOwnerAffiliateId] = useState(null);

    // Paremal kuvatava valitud kasutaja info ja aktiivne vaade
    const [selectedMember, setSelectedMember] = useState(null);
    const [activeComponent, setActiveComponent] = useState("profile");
    const [isLoadingMember, setIsLoadingMember] = useState(false);

    // Mobiilivaate jaoks Drawer olek
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Menüü valikud valitud kasutaja profiilivaate jaoks
    const menuItems = [
        { id: "profile", label: "Profile", component: ProfileView },
        { id: "statistics", label: "Statistics", component: Statistics },
        { id: "purchase-history", label: "Purchase History", component: PurchaseHistory },
        { id: "active-plans", label: "Active Plans", component: ActivePlans },
        { id: "credit", label: "Credit", component: CreditView },
    ];

    // Laadime esmalt omaniku affiliateId väärtuse
    useEffect(() => {
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
    }, []);

    // Kui omaniku affiliateId on saadaval, laadime liikmete nimekirja
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

    // Otsingufunktsionaalsus: kui otsingusõne on pikem kui 2 tähte, laadime otsingutulemused
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

    // Kui klõpsata liikmele, laadime tema detailandmed ning lähtestame aktiivse vaate "Profile"
    const handleMemberClick = async (member) => {
        setIsLoadingMember(true);
        try {
            // Kasuta member.userId, kui see on olemas; muidu member.user.id, kui struktuur on selline:
            // member: { userId, user: { id, fullName, ... } }
            const userId = member.userId || (member.user && member.user.id) || member.id;
            const response = await getMemberInfo(userId);

            setSelectedMember(response || {});
            setActiveComponent("profile");
        } catch (error) {
            console.error("❌ Error fetching member info:", error);
        }
        setIsLoadingMember(false);
        setDrawerOpen(false); // Sulge mobiilivaate Drawer
    };

    // Menüü klõpsu käitlemine – aktiveerib vastava komponendi
    const handleMenuClick = (componentId) => {
        setActiveComponent(componentId);
    };

    // Valime aktiivse komponendi menüü valikute hulgast; vaikimisi ProfileView
    const ActiveComponent =
        menuItems.find((item) => item.id === activeComponent)?.component ||
        ProfileView;

    return (
        <Container maxWidth={false} sx={{ mt: 4, display: "flex" }}>
            {/* Vasak paneel: Liikmete nimekiri ja otsing (desktop vaade) */}
            <Box
                sx={{
                    width: { xs: 300, md: 300 },
                    borderRight: "1px solid #ccc",
                    p: 2,
                    display: { xs: "none", md: "block" },
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
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
                                    onClick={() =>
                                        handleMemberClick({ ...user, userId: user.id })
                                    }
                                >
                                    <ListItemText primary={user.fullName || user.username} />
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
                                onClick={() =>
                                    // Edastame member objekti, kus kasutaja andmed on member.user ja ID on member.userId
                                    handleMemberClick({ ...member.user, userId: member.userId })
                                }
                            >
                                <ListItemText primary={member.user.fullName} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2">No members found.</Typography>
                    )}
                </List>
            </Box>

            {/* Mobiilivaate jaoks: nupp ja Drawer, mis kuvab liikmete nimekirja ja otsingu */}
            <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                    top: 64,
                    left: 16,
                    zIndex: 1300,
                }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{ width: 300, p: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
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
                                        onClick={() =>
                                            handleMemberClick({ ...user, userId: user.id })
                                        }
                                    >
                                        <ListItemText primary={user.fullName || user.username} />
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
                                    onClick={() =>
                                        handleMemberClick({ ...member.user, userId: member.userId })
                                    }
                                >
                                    <ListItemText primary={member.user.fullName} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2">No members found.</Typography>
                        )}
                    </List>
                </Box>
            </Drawer>

            {/* Parempoolne paneel: valitud kasutaja profiil ja menüü vaated */}
            <Box sx={{ flexGrow: 1, p: { xs: 0, md: 3 }}}>
                {isLoadingMember ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : selectedMember ? (
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                {/* Vasak külgriba: kasutaja info ja menüü */}
                                <Grid item xs={12} md={3}>
                                    <Box sx={{ textAlign: "center" }}>
                                        <Avatar
                                            src={
                                                selectedMember.logo ||
                                                "https://via.placeholder.com/120"
                                            }
                                            sx={{ width: 100, height: 100, margin: "auto" }}
                                        />
                                        <Typography variant="h6" sx={{ mt: 2 }}>
                                            {selectedMember.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedMember.role || "Member"}
                                        </Typography>
                                    </Box>
                                    <List>
                                        {menuItems.map((item) => (
                                            <ListItem
                                                button
                                                key={item.id}
                                                selected={activeComponent === item.id}
                                                onClick={() => handleMenuClick(item.id)}
                                            >
                                                <ListItemText primary={item.label} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>

                                {/* Põhiosa: aktiivne vaade */}
                                <Grid item xs={12} md={9}>
                                    <ActiveComponent
                                        user={selectedMember}
                                        userId={selectedMember.id}
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
        </Container>
    );
}
