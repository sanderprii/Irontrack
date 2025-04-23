import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Divider
} from "@mui/material";
import { searchUsersByName, getMemberInfo, getFamilyMembers } from "../api/membersApi";
import { registerMemberForClass } from "../api/classesApi";

export default function AddAttendeeModal({
                                             open,
                                             onClose,
                                             classId,
                                             affiliateId,
                                             onSuccess
                                         }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPlans, setUserPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Family member states
    const [familyMembers, setFamilyMembers] = useState([]);
    const [isFamilyMember, setIsFamilyMember] = useState(false);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Search for users when query changes
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.length >= 3) {
                setLoading(true);
                try {
                    const results = await searchUsersByName(searchQuery);
                    setSearchResults(results || []);
                } catch (error) {
                    console.error("Error searching users:", error);
                    setErrorMessage("Failed to search users");
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    // Handle user selection
    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        setLoading(true);

        try {
            const [memberInfo, familyMembersData] = await Promise.all([
                getMemberInfo(user.id, affiliateId),
                getFamilyMembers(user.id)
            ]);

            setUserPlans(memberInfo.plans || []);
            setFamilyMembers(familyMembersData || []);

            // Reset selections when changing users
            setSelectedPlan(null);
            setIsFamilyMember(false);
            setSelectedFamilyMember(null);
            setErrorMessage("");
        } catch (error) {
            console.error("Error loading member info:", error);
            setErrorMessage("Failed to load member data");
        } finally {
            setLoading(false);
        }
    };

    // Handle plan selection
    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    // Handle family member toggle
    const handleFamilyMemberToggle = (event) => {
        setIsFamilyMember(event.target.checked);
        if (!event.target.checked) {
            setSelectedFamilyMember(null);
        }
    };

    // Handle family member selection
    const handleFamilyMemberSelect = (memberId) => {
        setSelectedFamilyMember(memberId);
    };

    // Register member for class
    const handleRegister = async () => {
        if (!selectedUser || !selectedPlan) {
            setErrorMessage("Please select both a member and a plan");
            return;
        }

        if (isFamilyMember && !selectedFamilyMember) {
            setErrorMessage("Please select a family member");
            return;
        }

        setLoading(true);
        try {
            await registerMemberForClass(
                classId,
                selectedPlan,
                affiliateId,
                selectedUser.id,
                isFamilyMember,
                selectedFamilyMember
            );
            onSuccess();
            handleReset();
            onClose();
        } catch (error) {
            console.error("Error registering member:", error);
            setErrorMessage(error.message || "Failed to register member for class");
        } finally {
            setLoading(false);
        }
    };

    // Reset form state
    const handleReset = () => {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedUser(null);
        setUserPlans([]);
        setSelectedPlan(null);
        setErrorMessage("");
        setFamilyMembers([]);
        setIsFamilyMember(false);
        setSelectedFamilyMember(null);
    };

    // Handle close
    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Member to Class</DialogTitle>
            <DialogContent>
                {/* Search Input */}
                <TextField
                    fullWidth
                    label="Search Members"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    margin="normal"
                    helperText="Type at least 3 characters to search"
                />

                {/* Error message */}
                {errorMessage && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Loading indicator */}
                {loading && (
                    <Box display="flex" justifyContent="center" my={2}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {/* Search Results */}
                {!selectedUser && searchResults.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Search Results</Typography>
                        <List dense>
                            {searchResults.map((user) => (
                                <ListItem
                                    button
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                >
                                    <ListItemText
                                        primary={user.fullName}
                                        secondary={user.email}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Selected User */}
                {selectedUser && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Selected Member</Typography>
                        <Box
                            p={2}
                            bgcolor="background.paper"
                            border={1}
                            borderColor="divider"
                            borderRadius={1}
                        >
                            <Typography variant="h6">{selectedUser.fullName}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {selectedUser.email}
                            </Typography>
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => setSelectedUser(null)}
                                sx={{ mt: 1 }}
                            >
                                Change Member
                            </Button>
                        </Box>



                        {/* Member Plans */}
                        {userPlans.length > 0 ? (
                            <Box mt={2}>
                                <Typography variant="subtitle1">Select Plan</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={selectedPlan}
                                        onChange={(e) => handlePlanSelect(e.target.value)}
                                    >
                                        {userPlans.map((plan) => (
                                            <FormControlLabel
                                                key={plan.userPlanId}
                                                value={plan.userPlanId.toString()}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body1">{plan.planName}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Valid until: {new Date(plan.endDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                No active plans available for this member
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleRegister}
                    color="primary"
                    variant="contained"
                    disabled={!selectedUser || !selectedPlan || (isFamilyMember && !selectedFamilyMember) || loading}
                >
                    Register
                </Button>
            </DialogActions>
        </Dialog>
    );
}