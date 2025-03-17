import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Paper,
    Chip,
    Grid,
    Link,
    IconButton,
    useMediaQuery,
    useTheme,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import BusinessIcon from '@mui/icons-material/Business';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';
import SEO from '../components/SEO';

const Help = () => {
    const { isLoggedIn, role } = useContext(AuthContext);
    const [tabValue, setTabValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHelp, setFilteredHelp] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Define all help content
    const helpContent = {
        gettingStarted: [
            {
                title: 'Creating an Account',
                content: (
                    <>
                        <Typography paragraph>
                            To get started with Irontrack, you need to create an account:
                        </Typography>
                        <ol>
                            <li>Click on the "Join Us" button on the homepage</li>
                            <li>Fill in your personal details</li>
                            <li>Check the Terms and Conditions checkbox</li>
                            <li>Click "Join Us" to create your account</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Note: If you're an affiliate owner, make sure to check the "Are you an Affiliate Owner?" option during registration.
                        </Typography>
                    </>
                ),
                tags: ['account', 'registration', 'signup', 'join'],
                roles: ['all']
            },
            {
                title: 'Logging In',
                content: (
                    <>
                        <Typography paragraph>
                            To log in to your Irontrack account:
                        </Typography>
                        <ol>
                            <li>Click the "Log In" button on the top-right corner of the homepage</li>
                            <li>Enter your email address and password</li>
                            <li>Click "Log In" to access your account</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            If you've forgotten your password, click the "Forgot Password" link on the login page.
                        </Typography>
                    </>
                ),
                tags: ['login', 'password', 'access'],
                roles: ['all']
            },
            {
                title: 'Selecting Your Role',
                content: (
                    <>
                        <Typography paragraph>
                            After logging in, you'll be prompted to select your role:
                        </Typography>
                        <ul>
                            <li><strong>Regular User:</strong> For gym members who want to register for classes and track their progress</li>
                            <li><strong>Trainer:</strong> For coaches who manage classes and members</li>
                            <li><strong>Affiliate Owner:</strong> For gym owners who manage all aspects of their facility</li>
                        </ul>
                        <Typography paragraph>
                            Your available roles depend on your account settings. Contact your gym administrator if you need a role that isn't available to you.
                        </Typography>
                    </>
                ),
                tags: ['role', 'profile', 'user type', 'permissions'],
                roles: ['all']
            },
        ],
        regularUsers: [
            {
                title: 'Registering for Classes',
                content: (
                    <>
                        <Typography paragraph>
                            To register for a training class:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Trainings" page from the main menu</li>
                            <li>Browse available classes by date</li>
                            <li>Click on a class to view details</li>
                            <li>Click the "Register" button</li>
                            <li>If needed, select a payment plan</li>
                            <li>Confirm your registration</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.warning.main }}>
                            Note: Some classes may require a valid plan or payment. Free classes are marked accordingly.
                        </Typography>
                    </>
                ),
                tags: ['class', 'registration', 'training', 'register', 'sign up'],
                roles: ['regular']
            },
            {
                title: 'Tracking Your Records',
                content: (
                    <>
                        <Typography paragraph>
                            Irontrack allows you to track your workout performance and records:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Records" section</li>
                            <li>View your historical performance data by workout type</li>
                            <li>Click on any record to see detailed information</li>
                            <li>Add new records by clicking "Add Record"</li>
                            <li>View charts and statistics of your progress over time</li>
                        </ol>
                        <Typography paragraph>
                            You can filter records by workout type (Cardio, Weightlifting, WOD) and see trend lines for your progress.
                        </Typography>
                    </>
                ),
                tags: ['records', 'performance', 'tracking', 'statistics', 'workout data'],
                roles: ['regular']
            },
            {
                title: 'Managing Your Profile',
                content: (
                    <>
                        <Typography paragraph>
                            To update your profile information:
                        </Typography>
                        <ol>
                            <li>Click on "My Profile" in the main menu</li>
                            <li>Edit your personal information</li>
                            <li>Upload a profile picture by clicking "Upload Profile Picture"</li>
                            <li>Update your emergency contact information</li>
                            <li>Save your changes</li>
                        </ol>
                        <Typography paragraph>
                            Keep your information up-to-date, especially your emergency contact information for safety purposes.
                        </Typography>
                    </>
                ),
                tags: ['profile', 'personal information', 'contact details', 'account settings'],
                roles: ['regular']
            },
            {
                title: 'Viewing Your Contracts',
                content: (
                    <>
                        <Typography paragraph>
                            To view and manage your contracts:
                        </Typography>
                        <ol>
                            <li>Navigate to "My Profile"</li>
                            <li>Select the "Contracts" tab</li>
                            <li>View all your active and past contracts</li>
                            <li>Click on a contract to see details</li>
                            <li>For contracts waiting acceptance, review terms and click "Accept Contract"</li>
                        </ol>
                        <Typography paragraph>
                            You can also request payment holidays for monthly contracts if you'll be away.
                        </Typography>
                    </>
                ),
                tags: ['contracts', 'agreements', 'terms', 'payment holidays'],
                roles: ['regular']
            },
            {
                title: 'Viewing Class Leaderboards',
                content: (
                    <>
                        <Typography paragraph>
                            After attending a class, you can view the leaderboard and add your score:
                        </Typography>
                        <ol>
                            <li>Go to the class details</li>
                            <li>Click the "Leaderboard" button</li>
                            <li>View scores from other participants</li>
                            <li>Click "Add Score" to enter your performance</li>
                            <li>Choose your score type (RX, Scaled, or Beginner)</li>
                            <li>Enter your score and save</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Leaderboards help you track your performance against others and monitor your progress.
                        </Typography>
                    </>
                ),
                tags: ['leaderboard', 'scores', 'competition', 'results'],
                roles: ['regular']
            },
        ],
        trainers: [
            {
                title: 'Managing Classes',
                content: (
                    <>
                        <Typography paragraph>
                            As a trainer, you can manage training classes:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Classes" section</li>
                            <li>View upcoming classes you're assigned to</li>
                            <li>Click on a class to see attendees and details</li>
                            <li>Check in members as they arrive using the check-in button</li>
                            <li>View and manage the waitlist for full classes</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            You can also mark attendees who didn't show up, which helps with tracking attendance patterns.
                        </Typography>
                    </>
                ),
                tags: ['classes', 'training', 'sessions', 'check-in', 'attendance'],
                roles: ['trainer', 'affiliate']
            },
            {
                title: 'Working with Members',
                content: (
                    <>
                        <Typography paragraph>
                            To manage your gym members:
                        </Typography>
                        <ol>
                            <li>Go to the "Members" section</li>
                            <li>View the list of all gym members</li>
                            <li>Search for specific members by name</li>
                            <li>Click on a member to view their profile</li>
                            <li>Add notes and flags for members with special requirements</li>
                        </ol>
                        <Typography paragraph>
                            Member flags use color coding:
                        </Typography>
                        <ul>
                            <li><Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>Red</Box> - Requires special attention/caution</li>
                            <li><Box component="span" sx={{ color: 'gold', fontWeight: 'bold' }}>Yellow</Box> - Has limited movements or modifications</li>
                            <li><Box component="span" sx={{ color: 'green', fontWeight: 'bold' }}>Green</Box> - Ready for advanced movements</li>
                        </ul>
                    </>
                ),
                tags: ['members', 'athletes', 'clients', 'notes', 'flags'],
                roles: ['trainer', 'affiliate']
            },
            {
                title: 'Creating WODs',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage Workouts of the Day (WODs):
                        </Typography>
                        <ol>
                            <li>Navigate to the "Classes" section</li>
                            <li>Click "Class WOD View"</li>
                            <li>Select a date for your WOD</li>
                            <li>Click "Add WOD"</li>
                            <li>Enter the WOD name, type, and description</li>
                            <li>Save your WOD</li>
                            <li>Click "Apply WOD" to add it to all training sessions on that day</li>
                        </ol>
                        <Typography paragraph>
                            You can also search and use previous WODs as templates to save time.
                        </Typography>
                    </>
                ),
                tags: ['wod', 'workout of the day', 'programming', 'training plan'],
                roles: ['trainer', 'affiliate']
            },
        ],
        affiliateOwners: [
            {
                title: 'Managing Your Affiliate',
                content: (
                    <>
                        <Typography paragraph>
                            As an affiliate owner, you can manage your gym's information:
                        </Typography>
                        <ol>
                            <li>Go to "My Affiliate" in the main menu</li>
                            <li>View and edit basic information (name, address, contact details)</li>
                            <li>Upload your gym's logo</li>
                            <li>Manage trainer assignments</li>
                            <li>Update bank details for payments</li>
                            <li>Set payment holiday fees</li>
                        </ol>
                        <Typography paragraph>
                            Keep your information accurate to ensure proper operations and payments.
                        </Typography>
                    </>
                ),
                tags: ['affiliate', 'gym', 'box', 'business', 'location'],
                roles: ['affiliate']
            },
            {
                title: 'Contract Management',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage membership contracts:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Contracts" section</li>
                            <li>Click "Add Contract" to create a new contract</li>
                            <li>Select a member from the search dropdown</li>
                            <li>Enter contract details (type, payment amount, interval, etc.)</li>
                            <li>Set the contract terms and click "Save Contract"</li>
                            <li>Click "Send" to send the contract to the member for approval</li>
                        </ol>
                        <Typography paragraph>
                            You can also create default contract templates by clicking "Add Default Contract".
                        </Typography>
                        <Typography paragraph>
                            To handle payment holidays:
                        </Typography>
                        <ol>
                            <li>Review payment holiday requests in the contract details</li>
                            <li>Approve or decline requests using the green and red buttons</li>
                            <li>Manage payment holiday fees</li>
                        </ol>
                    </>
                ),
                tags: ['contracts', 'memberships', 'agreements', 'payments', 'payment holidays'],
                roles: ['affiliate']
            },
            {
                title: 'Financial Management',
                content: (
                    <>
                        <Typography paragraph>
                            Monitor and manage your gym's finances:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Finance" section</li>
                            <li>View the Orders History tab for all purchase records</li>
                            <li>Check the Finance tab for revenue summaries and member statistics</li>
                            <li>Review the Transactions tab for payment details</li>
                            <li>Filter by date ranges and search for specific transactions</li>
                        </ol>
                        <Typography paragraph>
                            The Unpaid Users section shows members with pending payments, helping you follow up on them.
                        </Typography>
                    </>
                ),
                tags: ['finance', 'revenue', 'payments', 'orders', 'transactions'],
                roles: ['affiliate']
            },
            {
                title: 'Managing Subscription Plans',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage membership plans:
                        </Typography>
                        <ol>
                            <li>Go to the "Plans" section</li>
                            <li>View existing plans</li>
                            <li>Click "Add Plan" to create a new plan</li>
                            <li>Fill in the details (name, validity period, price, sessions)</li>
                            <li>Set unlimited sessions if applicable</li>
                            <li>Add any additional information</li>
                            <li>Save the plan</li>
                        </ol>
                        <Typography paragraph>
                            You can edit existing plans by clicking on them and updating the information.
                        </Typography>
                    </>
                ),
                tags: ['plans', 'subscriptions', 'pricing', 'memberships'],
                roles: ['affiliate']
            },
            {
                title: 'Credit System',
                content: (
                    <>
                        <Typography paragraph>
                            Manage credit for your members:
                        </Typography>
                        <ol>
                            <li>Navigate to a member's profile</li>
                            <li>Select the "Credit" tab</li>
                            <li>View current credit balance</li>
                            <li>Add credit by clicking "Add Credit"</li>
                            <li>Enter the amount and a description</li>
                            <li>Click "Apply" to add the credit</li>
                        </ol>
                        <Typography paragraph>
                            Members can use credit for purchasing plans or paying for classes.
                        </Typography>
                    </>
                ),
                tags: ['credit', 'balance', 'funds', 'payments'],
                roles: ['affiliate']
            },
        ],
        messaging: [
            {
                title: 'Sending Messages',
                content: (
                    <>
                        <Typography paragraph>
                            To send messages to members or groups:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Messages" section</li>
                            <li>Click on the "Send Message" tab</li>
                            <li>Choose recipient type (User, Group, or All Members)</li>
                            <li>Search for and select the recipient</li>
                            <li>Enter a subject and message body</li>
                            <li>Click "Send" to deliver your message</li>
                        </ol>
                        <Typography paragraph>
                            Messages are delivered to users' email addresses and also appear in their Messages section.
                        </Typography>
                    </>
                ),
                tags: ['messages', 'communication', 'email', 'inbox'],
                roles: ['affiliate', 'trainer']
            },
            {
                title: 'Managing Contact Groups',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage contact groups:
                        </Typography>
                        <ol>
                            <li>Go to the "Messages" section</li>
                            <li>Select the "Groups" tab</li>
                            <li>Click "Add Group" to create a new group</li>
                            <li>Enter a group name</li>
                            <li>Search for and add members to the group</li>
                            <li>Save the group</li>
                        </ol>
                        <Typography paragraph>
                            Groups help you send messages to specific sets of members more efficiently.
                        </Typography>
                    </>
                ),
                tags: ['groups', 'contacts', 'distribution lists', 'batch messaging'],
                roles: ['affiliate']
            },
            {
                title: 'Viewing Message History',
                content: (
                    <>
                        <Typography paragraph>
                            To view your sent messages:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Messages" section</li>
                            <li>Select the "Sent Messages" tab</li>
                            <li>View the list of all messages you've sent</li>
                            <li>Click on a message to expand and see its full content</li>
                        </ol>
                        <Typography paragraph>
                            This history helps you track your communication with members and groups.
                        </Typography>
                    </>
                ),
                tags: ['message history', 'sent items', 'communications log'],
                roles: ['affiliate', 'trainer']
            },
        ],
        troubleshooting: [
            {
                title: 'Common Login Issues',
                content: (
                    <>
                        <Typography paragraph>
                            If you're having trouble logging in:
                        </Typography>
                        <ol>
                            <li>Make sure you're using the correct email address</li>
                            <li>Check that Caps Lock is not enabled when entering your password</li>
                            <li>Try resetting your password using the "Forgot Password" link</li>
                            <li>Clear your browser cache and cookies</li>
                            <li>Try a different browser</li>
                        </ol>
                        <Typography paragraph>
                            If you still can't log in, contact your affiliate owner or our support team.
                        </Typography>
                    </>
                ),
                tags: ['login', 'password', 'access', 'authentication'],
                roles: ['all']
            },
            {
                title: 'Payment Problems',
                content: (
                    <>
                        <Typography paragraph>
                            If you encounter payment issues:
                        </Typography>
                        <ol>
                            <li>Check that your credit card information is up-to-date</li>
                            <li>Verify that you have sufficient funds</li>
                            <li>Check if your bank is blocking the transaction</li>
                            <li>Try a different payment method</li>
                        </ol>
                        <Typography paragraph>
                            For regular members: Contact your gym owner for assistance.
                        </Typography>
                        <Typography paragraph>
                            For affiliate owners: Check transaction logs in the Finance section and contact our support if issues persist.
                        </Typography>
                    </>
                ),
                tags: ['payment', 'transaction', 'credit card', 'bank', 'purchase'],
                roles: ['all']
            },
            {
                title: 'Technical Support',
                content: (
                    <>
                        <Typography paragraph>
                            For technical issues with the Irontrack platform:
                        </Typography>
                        <ol>
                            <li>Check this help section for guidance on your specific issue</li>
                            <li>Try refreshing the page or logging out and back in</li>
                            <li>Clear your browser cache and cookies</li>
                            <li>Contact our support team at <Link href="mailto:support@irontrack.ee">support@irontrack.ee</Link></li>
                        </ol>
                        <Typography paragraph>
                            When contacting support, please include:
                        </Typography>
                        <ul>
                            <li>Your username and email</li>
                            <li>Description of the issue</li>
                            <li>Steps to reproduce the problem</li>
                            <li>Screenshots if possible</li>
                            <li>Browser and device information</li>
                        </ul>
                    </>
                ),
                tags: ['support', 'help', 'technical issues', 'bugs', 'contact'],
                roles: ['all']
            },
        ]
    };

    // All content flattened for search
    const allHelpItems = [
        ...helpContent.gettingStarted,
        ...helpContent.regularUsers,
        ...helpContent.trainers,
        ...helpContent.affiliateOwners,
        ...helpContent.messaging,
        ...helpContent.troubleshooting
    ];

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle search
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query === '') {
            setFilteredHelp([]);
            return;
        }

        // Filter help items based on search query
        const filtered = allHelpItems.filter(item => {
            // Check if the search terms match the title or content
            const titleMatch = item.title.toLowerCase().includes(query);
            const contentMatch = typeof item.content === 'string'
                ? item.content.toLowerCase().includes(query)
                : false;
            const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(query));

            return titleMatch || contentMatch || tagsMatch;
        });

        setFilteredHelp(filtered);
    };

    // Filter content by role
    const getVisibleContent = (contentArray) => {
        if (!isLoggedIn) return contentArray.filter(item => item.roles.includes('all'));

        return contentArray.filter(item => {
            return item.roles.includes('all') ||
                item.roles.includes(role) ||
                (role === 'affiliate' && item.roles.includes('trainer')); // Affiliate owners can see trainer content
        });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <SEO
                title="Help & Documentation - Irontrack"
                description="Get help with using the Irontrack gym management platform. Find answers to common questions and learn how to use all features."
                keywords="help, documentation, support, FAQ, Irontrack, gym management"
            />

            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    <HelpOutlineIcon sx={{ mr: 1, fontSize: 32 }} />
                    Help Center
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Welcome to the Irontrack Help Center. Find answers to common questions and learn how to use all features of our platform.
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Search for help..."
                    variant="outlined"
                    sx={{ mb: 3, mt: 2 }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {searchQuery ? (
                // Search results
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Search Results for "{searchQuery}"
                    </Typography>

                    {filteredHelp.length === 0 ? (
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle1">
                                No results found for "{searchQuery}". Try different keywords or browse the help categories below.
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={() => setSearchQuery('')}
                            >
                                Clear Search
                            </Button>
                        </Paper>
                    ) : (
                        filteredHelp.map((item, index) => (
                            <Accordion key={index} sx={{ mb: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {item.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ mb: 2 }}>
                                        {item.content}
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {item.tags.map((tag, tagIndex) => (
                                            <Chip key={tagIndex} label={tag} size="small" />
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </Box>
            ) : (
                // Regular help content
                <Box>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons="auto"
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                minHeight: '72px',
                                display: 'flex',
                                flexDirection: 'column'
                            }
                        }}
                    >
                        <Tab
                            icon={<SchoolIcon />}
                            iconPosition="top"
                            label="Getting Started"
                        />
                        <Tab
                            icon={<AccountCircleIcon />}
                            iconPosition="top"
                            label="For Members"
                        />
                        <Tab
                            icon={<FitnessCenterIcon />}
                            iconPosition="top"
                            label="For Trainers"
                        />
                        <Tab
                            icon={<BusinessIcon />}
                            iconPosition="top"
                            label="For Affiliate Owners"
                        />
                        <Tab
                            icon={<MessageIcon />}
                            iconPosition="top"
                            label="Messaging"
                        />
                        <Tab
                            icon={<SettingsIcon />}
                            iconPosition="top"
                            label="Troubleshooting"
                        />
                    </Tabs>

                    <Box>
                        {/* Getting Started */}
                        {tabValue === 0 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    Getting Started with Irontrack
                                </Typography>

                                {getVisibleContent(helpContent.gettingStarted).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}


                            </Box>
                        )}

                        {/* For Members */}
                        {tabValue === 1 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    For Members
                                </Typography>

                                {getVisibleContent(helpContent.regularUsers).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}

                        {/* For Trainers */}
                        {tabValue === 2 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    For Trainers
                                </Typography>

                                {getVisibleContent(helpContent.trainers).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}

                        {/* For Affiliate Owners */}
                        {tabValue === 3 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    For Affiliate Owners
                                </Typography>

                                {getVisibleContent(helpContent.affiliateOwners).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}

                        {/* Messaging */}
                        {tabValue === 4 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    Messaging System
                                </Typography>

                                {getVisibleContent(helpContent.messaging).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}

                        {/* Troubleshooting */}
                        {tabValue === 5 && (
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                    Troubleshooting
                                </Typography>

                                {getVisibleContent(helpContent.troubleshooting).map((item, index) => (
                                    <Accordion key={index} sx={{ mb: 2 }}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {item.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {item.content}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

                                <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Still need help?
                                    </Typography>
                                    <Typography paragraph sx={{ mb: 3 }}>
                                        Contact our support team for personalized assistance.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        href="mailto:support@irontrack.ee"
                                        startIcon={<HelpOutlineIcon />}
                                    >
                                        Contact Support
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            {/* Quick Links Footer */}
            <Paper
                elevation={2}
                sx={{
                    mt: 6,
                    p: 3,
                    borderRadius: 2,
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: 'white'
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Quick Links
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setTabValue(0);
                                setSearchQuery('');
                            }}
                        >
                            Getting Started
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setSearchQuery('login');
                            }}
                        >
                            Login Help
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setSearchQuery('classes registration');
                            }}
                        >
                            Class Registration
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setSearchQuery('payment');
                            }}
                        >
                            Payment Issues
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setTabValue(5);
                                setSearchQuery('');
                            }}
                        >
                            Contact Support
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={2}>
                        <Button
                            variant="outlined"
                            fullWidth
                            sx={{
                                color: 'white',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                            onClick={() => {
                                setSearchQuery('contracts');
                            }}
                        >
                            Contracts
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Help;