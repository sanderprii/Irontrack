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
    Chip,
    Divider
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { searchUsersByName, getMemberPlans } from "../api/membersApi";
import { registerMemberForClass } from "../api/classesApi";

export default function AddAttendeeModal({
                                             open,
                                             onClose,
                                             classId,
                                             affiliateId,
                                             onSuccess,
                                                fetchAttendees
                                         }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [memberPlans, setMemberPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Search for users and family members when query changes
    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (searchQuery.length >= 3) {
                setLoading(true);
                try {
                    const results = await searchUsersByName(searchQuery);
                    setSearchResults(results || []);
                } catch (error) {
                    console.error("Error searching:", error);
                    setErrorMessage("Failed to search");
                } finally {
                    setLoading(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchQuery]);

    // Handle member selection (user or family member)
    const handleMemberSelect = async (member) => {
        setSelectedMember(member);
        setLoading(true);
        setErrorMessage("");

        try {
            // Get appropriate plans based on member type
            if (member.type === 'familyMember') {
                const plansData = await getMemberPlans(
                    member.parentUserId,
                    affiliateId,
                    'familyMember',
                    member.id
                );
                setMemberPlans(plansData.plans || []);
            } else {
                // Regular user
                const plansData = await getMemberPlans(member.id, affiliateId);
                setMemberPlans(plansData.plans || []);
            }

            // Reset plan selection
            setSelectedPlan(null);
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

    // Register member for class
    const handleRegister = async () => {
        if (!selectedMember) {
            setErrorMessage("Please select a member");
            return;
        }

        // For paid classes, require a plan selection
        const classInfo = {}; // You might want to pass class info to know if it's free
        const isFreeClass = classInfo.freeClass;

        if (!isFreeClass && !selectedPlan) {
            setErrorMessage("Please select a plan");
            return;
        }

        setLoading(true);
        try {
            await registerMemberForClass(
                classId,
                selectedPlan, // Could be null for free classes
                affiliateId,
                selectedMember // Contains all the info needed to identify user/family member
            );

            onSuccess();
            handleReset();
            fetchAttendees()
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
        setSelectedMember(null);
        setMemberPlans([]);
        setSelectedPlan(null);
        setErrorMessage("");
    };

    // Handle close
    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Helper to render the right icon based on member type
    const getMemberTypeIcon = (memberType) => {
        return memberType === 'familyMember'
            ? <FamilyRestroomIcon color="secondary" />
            : <PersonIcon color="primary" />;
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Member to Class</DialogTitle>
            <DialogContent>
                {/* Search Input */}
                <TextField
                    fullWidth
                    label="Search Members & Family Members"
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

                {/* Search Results - Now with indicators for users vs family members */}
                {!selectedMember && searchResults.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Search Results</Typography>
                        <List dense>
                            {searchResults.map((result) => (
                                <ListItem
                                    button
                                    key={`${result.type}-${result.id}`}
                                    onClick={() => handleMemberSelect(result)}
                                    sx={{
                                        border: '1px solid #eee',
                                        borderRadius: '4px',
                                        mb: 1,
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                >
                                    <Box display="flex" alignItems="center" width="100%">
                                        {getMemberTypeIcon(result.type)}
                                        <Box ml={2} flex={1}>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {result.fullName}
                                                        </Typography>
                                                        <Chip
                                                            label={result.type === 'familyMember' ? 'Family Member' : 'Member'}
                                                            size="small"
                                                            color={result.type === 'familyMember' ? 'secondary' : 'primary'}
                                                            variant="outlined"
                                                            sx={{ ml: 1 }}
                                                        />
                                                    </Box>
                                                }
                                                secondary={result.email || (result.type === 'familyMember' ? 'Family member' : '')}
                                            />
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Selected Member */}
                {selectedMember && (
                    <Box mt={2}>
                        <Typography variant="subtitle1">Selected {selectedMember.type === 'familyMember' ? 'Family Member' : 'Member'}</Typography>
                        <Box
                            p={2}
                            bgcolor="background.paper"
                            border={1}
                            borderColor="divider"
                            borderRadius={1}
                            display="flex"
                            alignItems="center"
                        >
                            {getMemberTypeIcon(selectedMember.type)}
                            <Box ml={2} flex={1}>
                                <Typography variant="h6">{selectedMember.fullName}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedMember.email}
                                    {selectedMember.type === 'familyMember' && ' (Family Member)'}
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => setSelectedMember(null)}
                            >
                                Change
                            </Button>
                        </Box>

                        {/* Member Plans */}
                        {memberPlans.length > 0 ? (
                            <Box mt={2}>
                                <Typography variant="subtitle1">Select Plan</Typography>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={selectedPlan}
                                        onChange={(e) => handlePlanSelect(e.target.value)}
                                    >
                                        {memberPlans.map((plan) => (
                                            <FormControlLabel
                                                key={plan.userPlanId}
                                                value={plan.userPlanId.toString()}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography variant="body1">{plan.planName}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Sessions left: {plan.sessionsLeft} | Valid until: {new Date(plan.endDate).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                }
                                                disabled={plan.sessionsLeft <= 0}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ) : (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                No active plans available for this {selectedMember.type === 'familyMember' ? 'family member' : 'member'}
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleRegister}
                    color="primary"
                    variant="contained"
                    disabled={!selectedMember || (!selectedPlan && memberPlans.length > 0) || loading}
                >
                    Register
                </Button>
            </DialogActions>
        </Dialog>
    );
}