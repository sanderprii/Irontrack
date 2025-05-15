import React, { useEffect, useState, useContext } from 'react';
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
    Paper,
    Chip,
    Grid,
    Link,
    useMediaQuery,
    useTheme,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MessageIcon from '@mui/icons-material/Message';
import BusinessIcon from '@mui/icons-material/Business';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
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
                            <li>Validate Email</li>
                            <li>Check the Terms and Conditions checkbox</li>
                            <li>Click "Join Us" to create your account</li>
                            <li>Check your email for a confirmation link</li>
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
                            If you've forgotten your password, click the "Forgot Password" link on the login page. You'll receive an email with instructions to reset your password.
                        </Typography>
                    </>
                ),
                tags: ['login', 'password', 'access', 'forgot password', 'reset password'],
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
                            <li><strong>Check-in:</strong> For front desk check-in operations at your gym</li>
                        </ul>
                        <Typography paragraph>
                            Your available roles depend on your account settings. Contact your gym administrator if you need a role that isn't available to you.
                        </Typography>
                    </>
                ),
                tags: ['role', 'profile', 'user type', 'permissions'],
                roles: ['all']
            },
            {
                title: 'Dashboard Navigation',
                content: (
                    <>
                        <Typography paragraph>
                            The Irontrack dashboard provides easy access to all features:
                        </Typography>
                        <ul>
                            <li><strong>Training Log:</strong> Create, Edit and View your trainings</li>
                            <li><strong>Profile:</strong> View and edit your personal information</li>
                            <li><strong>Trainings:</strong> Choose gym, buy plan and register for training</li>
                            <li><strong>Records:</strong> Track your personal records and achievements</li>
                        </ul>
                        <Typography paragraph>
                            The dashboard adapts to your selected role, showing relevant options and features for regular users, trainers, or affiliate owners.
                        </Typography>
                        <Typography paragraph>
                            On mobile devices, you'll find navigation options at the bottom of the screen for quick access to key features.
                        </Typography>
                    </>
                ),
                tags: ['dashboard', 'navigation', 'menu', 'features', 'layout', 'mobile navigation'],
                roles: ['all']
            },

        ],
        regularUsers: [
            {
                title: 'Managing Your Profile',
                content: (
                    <>
                        <Typography paragraph>
                            To update your profile information:
                        </Typography>
                        <ol>
                            <li>Click on "My Profile" in the main menu</li>
                            <li>You'll see your profile information displayed</li>
                            <li>Click "Edit Profile" to update your personal information</li>
                            <li>Upload a profile picture by clicking "Upload Profile Picture"</li>
                            <li>Update your emergency contact information</li>
                            <li>Save your changes</li>
                        </ol>
                        <Typography paragraph>
                            You can also change your password, view your statistics, purchase history, visit history, active plans, credit, and contracts through the tabs in your profile page.
                        </Typography>
                        <Typography paragraph>
                            Keep your information up-to-date, especially your emergency contact information for safety purposes.
                        </Typography>
                    </>
                ),
                tags: ['profile', 'personal information', 'contact details', 'account settings', 'upload photo', 'edit profile'],
                roles: ['regular']
            },
            {
                title: 'Registering for Classes',
                content: (
                    <>
                        <Typography paragraph>
                            To register for a training class:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Trainings" or "Register for training" page from the main menu</li>
                            <li>Find gym, click "View Classes".</li>
                            <li>Browse available classes by date using the week navigation or toggle to weekly view</li>
                            <li>Use the Day selector at the top to choose which day's classes to display</li>
                            <li>Click on a class to view details</li>
                            <li>In the class details modal, click the "Register" button</li>
                            <li>If needed, select a payment plan</li>
                        </ol>
                        <Typography paragraph>
                            Different class types have distinct background colors in the schedule, making it easy to identify the type of workout.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'warning.main', mt: 1 }}>
                            Note: Some classes may require a valid plan or payment. Free classes are marked accordingly.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Important: You can only register for classes that match the "Training Types" covered by your plan. For example, if your plan only includes "WOD" classes, you won't be able to register for "Weightlifting" classes.
                        </Typography>
                    </>
                ),
                tags: ['class', 'registration', 'training', 'register', 'sign up', 'classes', 'schedule'],
                roles: ['regular']
            },
            {
                title: 'Canceling Class Registration',
                content: (
                    <>
                        <Typography paragraph>
                            If you need to cancel your registration for a class:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Classes" page</li>
                            <li>Find and click on the class you're registered for</li>
                            <li>In the class details modal, click the "Cancel Registration" button</li>
                            <li>Confirm your cancellation when prompted</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ color: 'error.main', mt: 1 }}>
                            Note: Please cancel your registration if you cannot attend a class. This allows other members to take your spot, especially for classes with limited capacity.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            Some gyms may have cancellation policies with time restrictions. Check with your affiliate for specific rules.
                        </Typography>
                    </>
                ),
                tags: ['cancel', 'registration', 'class', 'withdraw', 'unregister'],
                roles: ['regular']
            },
            {
                title: 'Using the Waitlist Feature',
                content: (
                    <>
                        <Typography paragraph>
                            If a class is full, you can join the waitlist:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Classes" page</li>
                            <li>Click on the class that shows as full</li>
                            <li>In the class details modal, click the "Join Waitlist" button</li>
                            <li>If required, select an appropriate plan</li>
                            <li>Confirm joining the waitlist</li>
                        </ol>
                        <Typography paragraph>
                            If someone cancels their registration, people on the waitlist will automatically be registered in the order they joined the waitlist.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            You'll receive a notification if you're moved from the waitlist to the registered attendees.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            You can remove yourself from the waitlist at any time by clicking the "Remove from Waitlist" button in the class details.
                        </Typography>
                    </>
                ),
                tags: ['waitlist', 'full class', 'waiting', 'capacity', 'registration'],
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
                            <li>Navigate to the "Records" section in the main menu</li>
                            <li>Choose the record type: WOD, Weightlifting, or Cardio</li>
                            <li>View your historical performance data by record type</li>
                            <li>Click on any record to see detailed information</li>
                            <li>Add new records by clicking "Add Record"</li>
                            <li>For existing exercise names, select from the dropdown or enter a new one</li>
                            <li>Enter the date and performance details specific to your record type</li>
                            <li>Click "Save Record" to add it to your records</li>
                        </ol>
                        <Typography paragraph>
                            In the record details, you can view charts showing your progress over time. You can toggle between line and bar charts to visualize your data differently.
                        </Typography>
                        <Typography paragraph>
                            Progress indicators show how you're improving over time. Green arrows indicate improvement, while red arrows show a decrease in performance.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Tip: Use the Records feature to track your PRs (Personal Records) and monitor your progress over time. This helps you set realistic goals and celebrate achievements.
                        </Typography>
                    </>
                ),
                tags: ['records', 'performance', 'tracking', 'statistics', 'workout data', 'pr', 'personal records', 'charts', 'progress'],
                roles: ['regular']
            },
            {
                title: 'Your Training Diary',
                content: (
                    <>
                        <Typography paragraph>
                            To track your workouts in the Training Diary:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Trainings" page from the main menu</li>
                            <li>Click "Add New Training" to log a workout</li>
                            <li>Select the training type (WOD, Weightlifting, Cardio, Rowing, Gymnastics, or Other)</li>
                            <li>Enter the date of your training</li>
                            <li>For WODs, you can search existing WODs or create a custom one</li>
                            <li>Enter exercises, reps, sets, weights, or scores as needed</li>
                            <li>Click "Save Training" to add it to your diary</li>
                        </ol>
                        <Typography paragraph>
                            Your trainings will appear in the calendar below. Click on any training in the calendar to view or edit details.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            The Training Diary helps you maintain a complete history of your workouts, even for sessions you complete outside of scheduled classes.
                        </Typography>
                    </>
                ),
                tags: ['training diary', 'workouts', 'log', 'calendar', 'training history', 'exercise log'],
                roles: ['regular']
            },
            {
                title: 'Viewing Your Active Plans',
                content: (
                    <>
                        <Typography paragraph>
                            To view your active membership plans:
                        </Typography>
                        <ol>
                            <li>Go to "My Profile" in the main menu</li>
                            <li>Select the "Active Plans" tab</li>
                            <li>View all your active plans, including:</li>
                            <ul>
                                <li>Plan name and training type</li>
                                <li>Start and end dates</li>
                                <li>Price</li>
                                <li>Sessions left (or "Unlimited" for unlimited plans)</li>
                            </ul>
                            <li>Click on a plan row to expand and view more details</li>
                        </ol>
                        <Typography paragraph>
                            The system shows days left until expiration and highlights sessions left with color codes: green (many left), yellow (few left), or red (none left).
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Tip: Keep track of your plan expirations to ensure you renew before they expire and avoid interruptions in your training schedule.
                        </Typography>
                    </>
                ),
                tags: ['active plans', 'membership', 'sessions', 'expiration', 'subscriptions'],
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
                            <li>Go to the "Classes" page</li>
                            <li>Click on a class you've attended</li>
                            <li>In the class details, click the "Leaderboard" button</li>
                            <li>View scores from other participants</li>
                            <li>Click "Add Score" to enter your performance</li>
                            <li>Choose your score type (RX, Scaled, or Beginner)</li>
                            <li>Enter your score and save</li>
                        </ol>
                        <Typography paragraph>
                            You can filter the leaderboard to view all scores or only specific score types (RX, Scaled, or Beginner).
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Leaderboards help you track your performance against others and monitor your progress.
                        </Typography>
                    </>
                ),
                tags: ['leaderboard', 'scores', 'competition', 'results', 'performance'],
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
                            <li>Click on a contract to see details including:</li>
                            <ul>
                                <li>Contract type and status</li>
                                <li>Payment information</li>
                                <li>Valid dates</li>
                                <li>Payment holidays</li>
                            </ul>
                            <li>For contracts waiting acceptance, review terms and click "Accept Contract"</li>
                        </ol>
                        <Typography paragraph>
                            You can request payment holidays for monthly contracts if you'll be away. These requests need approval from your affiliate owner.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Payment holidays temporarily suspend payments while you're away, but also restrict your access to classes during that period.
                        </Typography>
                    </>
                ),
                tags: ['contracts', 'agreements', 'terms', 'payment holidays'],
                roles: ['regular']
            },
            {
                title: 'Purchasing a Plan',
                content: (
                    <>
                        <Typography paragraph>
                            To purchase a training plan:
                        </Typography>
                        <ol>
                            <li>Go to "Register Training" in the main menu</li>
                            <li>Search for your affiliate if not already selected</li>
                            <li>Click "View Plans" to see available plans</li>
                            <li>Choose a plan that suits your needs</li>
                            <li>Click "Buy Plan"</li>
                            <li>You'll be redirected to the checkout page</li>
                            <li>Review your purchase and payment details</li>
                            <li>Apply any available credit if desired</li>
                            <li>Complete your purchase</li>
                        </ol>
                        <Typography paragraph>
                            After purchasing, your plan will be immediately active and visible in your Active Plans section.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Pay attention to the "Training Types" included in each plan to ensure it covers the classes you want to attend. Some plans may be restricted to specific types of classes.
                        </Typography>
                    </>
                ),
                tags: ['purchase', 'plans', 'buy', 'checkout', 'payment'],
                roles: ['regular']
            },
            {
                title: 'Managing Your Credit',
                content: (
                    <>
                        <Typography paragraph>
                            To view and use your credit:
                        </Typography>
                        <ol>
                            <li>Go to "My Profile" in the main menu</li>
                            <li>Click on the "Credit" tab</li>
                            <li>View your current credit balance</li>
                            <li>See your credit history, including amounts and dates</li>
                            <li>When making purchases, you can apply available credit at checkout</li>
                        </ol>
                        <Typography paragraph>
                            Credit can be used for purchasing plans or paying for classes. Your affiliate owner can add credit to your account if needed.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            You can use partial credit for purchases. For example, if you have €20 credit and want to buy a €50 plan, you can apply the €20 credit and pay the remaining €30.
                        </Typography>
                    </>
                ),
                tags: ['credit', 'balance', 'funds', 'payment'],
                roles: ['regular']
            },
            {
                title: 'Setting Your Home Gym',
                content: (
                    <>
                        <Typography paragraph>
                            Setting a home gym makes accessing classes easier:
                        </Typography>
                        <ol>
                            <li>Go to "Register Training" in the main menu</li>
                            <li>Search for your preferred affiliate</li>
                            <li>Click "Add as Home Gym"</li>
                            <li>Now when you log in, you'll be automatically directed to your home gym's classes</li>
                            <li>You can change or remove your home gym at any time</li>
                        </ol>
                        <Typography paragraph>
                            Having a home gym set makes it faster to register for classes at your regular location.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Even with a home gym set, you can still view and register for classes at other affiliates if needed.
                        </Typography>
                    </>
                ),
                tags: ['home gym', 'default affiliate', 'preferred gym'],
                roles: ['regular']
            },
            {
                title: 'Understanding Training Types',
                content: (
                    <>
                        <Typography paragraph>
                            Irontrack supports various training types to categorize workouts:
                        </Typography>
                        <ul>
                            <li><strong>WOD (Workout of the Day):</strong> Daily programmed workouts, often with varied movements</li>
                            <li><strong>Weightlifting:</strong> Focused on Olympic weightlifting movements and strength training</li>
                            <li><strong>Cardio:</strong> Endurance-focused workouts</li>
                            <li><strong>Rowing:</strong> Specialized rowing sessions</li>
                            <li><strong>Gymnastics:</strong> Body weight and skill-focused movements</li>
                            <li><strong>Open Gym:</strong> Flexible training sessions where you work on your own</li>
                            <li><strong>Kids:</strong> Classes designed for children</li>
                            <li><strong>Basic:</strong> Basic training sessions for beginners</li>
                            <li><strong>Other:</strong> Any other training type not covered by the above categories</li>
                        </ul>
                        <Typography paragraph>
                            When purchasing plans, check which training types are included. Your plan must cover a specific training type for you to register for classes of that type.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Some plans include "All Classes" which gives you access to every training type offered by your gym.
                        </Typography>
                    </>
                ),
                tags: ['training types', 'workout types', 'class categories', 'wod', 'weightlifting', 'cardio'],
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
                            <li>Click "Add Training" to create a new class</li>
                            <li>Set the class details (date, time, capacity, type)</li>
                            <li>Click on a class to see attendees and details</li>
                            <li>Check in members as they arrive using the check-in button</li>
                            <li>View and manage the waitlist for full classes</li>
                        </ol>
                        <Typography paragraph>
                            To update or delete a class, click on it in the schedule and use the Edit or Delete buttons in the class details modal.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            You can also update or delete classes as needed, and mark attendees who didn't show up.
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
                            <li>View their active plans, visit history, and statistics</li>
                            <li>Add training plans for individual members</li>
                            <li>Add notes and flags for members with special requirements</li>
                        </ol>
                        <Typography paragraph>
                            From the member details page, you can access:
                        </Typography>
                        <ul>
                            <li>Profile information</li>
                            <li>Training plans</li>
                            <li>Statistics</li>
                            <li>Purchase history</li>
                            <li>Visit history</li>
                            <li>Active plans</li>
                            <li>Credit information</li>
                        </ul>
                        <Typography paragraph>
                            Member notes with color-coded flags (red, yellow, green) help you keep track of important information about each member.
                        </Typography>
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
                            <li>Click "Add WOD"</li>
                            <li>Select a date for your WOD</li>
                            <li>Enter the WOD name, type, and description</li>
                            <li>Specify exercises, reps, and other details</li>
                            <li>Save your WOD</li>
                            <li>Click "Apply WOD" to add it to all training sessions with training type "WOD" on that day</li>
                        </ol>
                        <Typography paragraph>
                            You can also search and use previous WODs as templates to save time. The WOD will be visible to all users, who open class.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            When you click "Apply WOD," it will be applied to all classes, with training type "WOD", saving you time from manually updating each class.
                        </Typography>
                    </>
                ),
                tags: ['wod', 'workout of the day', 'programming', 'training plan'],
                roles: ['trainer', 'affiliate']
            },
            {
                title: 'Using Check-In Mode',
                content: (
                    <>
                        <Typography paragraph>
                            To use Check-In mode for class attendance:
                        </Typography>
                        <ol>
                            <li>Log in and select the "Check-In" role</li>
                            <li>You'll see today's classes listed</li>
                            <li>Click on a class to open the check-in screen</li>
                            <li>As members arrive, search for them by name</li>
                            <li>Click the check-in button next to their name</li>
                            <li>The system will verify if they have an active plan with available sessions</li>
                            <li>For drop-ins or non-members, you can create a special check-in</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Check-in mode works well on tablets at the front desk. The system automatically reduces the session count from members' plans when they check in.
                        </Typography>
                        <Typography paragraph>
                            Members who are checked in will have a green check mark next to their name in the attendance list.
                        </Typography>
                    </>
                ),
                tags: ['check-in', 'attendance', 'front desk', 'class management'],
                roles: ['trainer', 'affiliate']
            },
            {
                title: 'Communicating with Members',
                content: (
                    <>
                        <Typography paragraph>
                            To communicate with your members:
                        </Typography>
                        <ol>
                            <li>Go to the "Messages" section</li>
                            <li>Click on "Send Message"</li>
                            <li>Choose recipient type (User, Group, or All Members)</li>
                            <li>Search for and select the recipient(s)</li>
                            <li>Compose your message with a subject and body</li>
                            <li>Click "Send" to deliver your message</li>
                        </ol>
                        <Typography paragraph>
                            Messages are delivered to users' email addresses and also appear in their Messages section. You can view your sent messages in the "Sent Messages" tab.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            You can easily send messages to all attendees of a class by going to the class details and clicking the "Send Message" button at the top of the attendees list.
                        </Typography>
                    </>
                ),
                tags: ['messages', 'communication', 'email', 'notifications'],
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
                            <li>Manage trainer assignments by searching and adding trainers</li>
                            <li>Add first training free classes. If classes are chosen, first time register for those classes will be free.</li>
                            <li>Set payment holiday fees</li>
                        </ol>
                        <Typography paragraph>
                            Keep your information accurate to ensure proper operations and payments. Your affiliate's public page will display this information to potential members.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            A professional logo and complete contact information help make a good first impression on potential new members.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Add your affiliate Terms and conditions:
                        </Typography>
                        <ol>
                            <li>Go to "My Affiliate" in the main menu</li>
                            <li>Click on "Terms and conditions"</li>
                            <li>Enter your terms and conditions text</li>
                            <li>Click "Save" to apply changes</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            User on their first registration will be asked to accept your terms and conditions. You can also edit or remove them at any time.
                        </Typography>
                    </>
                ),
                tags: ['affiliate', 'gym', 'box', 'business', 'location', 'settings'],
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
                            <li>Navigate to the "Contracts" section under "My Affiliate"</li>
                            <li>Click "Add Contract" to create a new contract</li>
                            <li>Select a member from the search dropdown</li>
                            <li>Enter contract details:</li>
                            <ul>
                                <li>Training types</li>
                                <li>Contract Name</li>
                                <li>Payment amount</li>
                                <li>Payment interval</li>
                                <li>Payment day</li>
                                <li>Contract starting date (user plan will be active on that day)</li>
                            </ul>
                            <li>Set the contract content and click "Save Contract"</li>
                            <li>Click "Send" to send the contract to the member for approval</li>
                        </ol>
                        <Typography paragraph>
                            You can also create default contract templates by clicking "Add Default Contract". These templates save time when creating multiple similar contracts.
                        </Typography>
                        <Typography paragraph>
                            To handle payment holidays:
                        </Typography>
                        <ol>
                            <li>Review payment holiday requests in the contract details</li>
                            <li>Approve or decline requests using the green and red buttons</li>
                            <li>Manage payment holiday fees in your affiliate settings</li>
                        </ol>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Payment holidays allow members to temporarily pause their membership while they're away, but they won't be able to attend classes during this period.
                        </Typography>
                    </>
                ),
                tags: ['contracts', 'memberships', 'agreements', 'payments', 'payment holidays'],
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
                            <li>Fill in the details:</li>
                            <ul>
                                <li>Plan name</li>
                                <li>Price</li>
                                <li>Validity period in days</li>
                                <li>Number of sessions (or set to 9999 for unlimited)</li>
                                <li>Training types included</li>
                                <li>Additional information</li>
                                <li>Active (By unchecking the box, the plan will not be displayed for users, but you can assign plan for user.)</li>
                            </ul>
                            <li>Save the plan</li>
                        </ol>
                        <Typography paragraph>
                            You can edit existing plans by clicking on them and updating the information.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Be sure to select all relevant training types for each plan. Members can only register for classes that match the training types included in their plan.
                        </Typography>
                    </>
                ),
                tags: ['plans', 'subscriptions', 'pricing', 'memberships'],
                roles: ['affiliate']
            },
            {
                title: 'Managing Members',
                content: (
                    <>
                        <Typography paragraph>
                            To manage your gym members:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Members" section</li>
                            <li>View all members associated with your affiliate</li>
                            <li>Search for specific members by name</li>
                            <li>Click on a member to view their complete profile</li>
                            <li>From the member profile, you can:</li>
                            <ul>
                                <li>View personal information</li>
                                <li>Assign training plans</li>
                                <li>View statistics and visit history</li>
                                <li>Manage active plans</li>
                                <li>Add credit</li>
                                <li>View contracts and transactions</li>
                                <li>Add contact notes</li>
                            </ul>
                        </ol>
                        <Typography paragraph>
                            If someone isn't already a member, you can add them by searching for their account and clicking "Add Member". You can also search potential users and add them to your affiliate.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Use the Notes feature with color-coded flags to keep track of important information about each member, such as medical conditions, specific goals, or preferences.
                        </Typography>
                    </>
                ),
                tags: ['members', 'users', 'management', 'profiles'],
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
                            <li>Navigate to the "Finance" section under "My Affiliate"</li>
                            <li>View the Orders History tab for all purchase records</li>
                            <li>Check the Finance tab for revenue summaries and member statistics</li>
                            <li>Review the Transactions tab for payment details</li>
                            <li>Filter by date ranges and search for specific transactions</li>
                            <li>Navigate to "Unpaid Users" to view members with pending payments</li>
                        </ol>
                        <Typography paragraph>
                            The Finance section provides important metrics such as:
                        </Typography>
                        <ul>
                            <li>Total revenue</li>
                            <li>Monthly comparison</li>
                            <li>New members</li>
                            <li>Active contracts</li>
                            <li>Payment due dates</li>
                        </ul>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Regularly reviewing your financial data helps you understand revenue patterns, identify growth opportunities, and plan for the future of your business.
                        </Typography>
                    </>
                ),
                tags: ['finance', 'revenue', 'payments', 'orders', 'transactions', 'money'],
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
                            <li>Navigate to a member's profile in the Members section</li>
                            <li>Select the "Credit" tab</li>
                            <li>View current credit balance</li>
                            <li>Add credit by clicking "Add Credit"</li>
                            <li>Enter the amount and a description</li>
                            <li>Click "Apply" to add the credit</li>
                            <li>View credit history to track all additions and usage</li>
                        </ol>
                        <Typography paragraph>
                            Members can use credit for purchasing plans or paying for classes. Credit can be given as a refund, promotion, or compensation.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            The credit system is useful for handling refunds, offering promotions, or rewarding loyal members. Members can apply their credit during checkout when purchasing plans.
                        </Typography>
                    </>
                ),
                tags: ['credit', 'balance', 'funds', 'payments', 'refunds'],
                roles: ['affiliate']
            },
            {
                title: 'Analytics Dashboard',
                content: (
                    <>
                        <Typography paragraph>
                            Monitor your gym's performance with the Analytics Dashboard:
                        </Typography>
                        <ol>
                            <li>Go to "My Affiliate" and select the "Analytics" tab</li>
                            <li>View key metrics including:</li>
                            <ul>
                                <li>Member growth over time</li>
                                <li>Class attendance statistics</li>
                                <li>Revenue trends</li>
                                <li>Popular class types</li>
                                <li>Peak usage times</li>
                            </ul>
                            <li>Filter data by date ranges</li>
                            <li>Export reports for further analysis</li>
                        </ol>
                        <Typography paragraph>
                            The analytics dashboard helps you make informed decisions about class scheduling, pricing, and marketing efforts by identifying trends and patterns.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Pay special attention to the "At Risk Members" section to identify members who might be considering leaving, allowing you to proactively reach out to them.
                        </Typography>
                    </>
                ),
                tags: ['analytics', 'statistics', 'reports', 'metrics', 'performance', 'trends'],
                roles: ['affiliate']
            },
            {
                title: 'Managing Classes & WODs',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage classes and WODs:
                        </Typography>
                        <ol>
                            <li>Navigate to the "Classes" section</li>
                            <li>Click "Add Training" to create a new class time slot</li>
                            <li>Set date, time, capacity, and assign a trainer</li>

                            <li>Click "Add WOD" to create the workout for the day</li>
                            <li>Name the WOD and add exercise details</li>
                            <li>You can apply the same WOD to multiple classes</li>
                            <li>Click on existing classes to edit details or view attendees</li>
                        </ol>
                        <Typography paragraph>
                            You can view classes in either daily or weekly view, and navigate between weeks easily. The class schedule is visible to all members and allows them to register for available slots.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Use the "Apply WOD" button after creating a workout to automatically add it to all classes with training type "WOD" for that day, saving time compared to updating each class individually.
                        </Typography>

                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Repeat weekly:
                        </Typography>
                        <ol>
                            <li>When creating a new training, set "Repeat Weekly" to "Yes"</li>
                            <li>Select the day of the week and time for the recurring class</li>
                            <li>Click "Save" to create the repeated weekly class</li>
                        </ol>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            To manage repeating classes:
                        </Typography>
                        <ul>
                            <li><strong>To stop repetition:</strong> Open the last occurrence you want to keep, click "Edit", set "Repeat Weekly" to "No", and save</li>
                            <li><strong>To remove a single occurrence:</strong> Simply delete that specific class. The weekly repetition will continue for future dates</li>
                            <li><strong>To modify all future occurrences:</strong> Open any class in the series, click "Edit", make your changes, set "Apply For All Future Trainings" to "Yes", and save</li>
                        </ul>
                    </>
                ),
                tags: ['classes', 'schedule', 'wod', 'workout', 'programming', 'training'],
                roles: ['affiliate']
            },
            {
                title: 'Assigning Plans to Users',
                content: (
                    <>
                        <Typography paragraph>
                            To assign a plan to a user directly:
                        </Typography>
                        <ol>
                            <li>Go to the member's profile in the "Members" section</li>
                            <li>Click on the "Active Plans" tab</li>
                            <li>Click "Add Plan" button</li>
                            <li>Select one of your affiliate plans from the dropdown</li>
                            <li>Click "Assign Plan"</li>
                            <li>The plan will be immediately activated for the user</li>
                        </ol>
                        <Typography paragraph>
                            This is useful for complementary plans, promotions, or when handling payments outside the system. The plan will immediately appear in the user's active plans.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            Note: You can also edit existing plans to extend end dates or add sessions if needed.
                        </Typography>
                    </>
                ),
                tags: ['assign plan', 'membership', 'complement', 'add plan'],
                roles: ['affiliate']
            },
            {
                title: 'Managing Contact Groups',
                content: (
                    <>
                        <Typography paragraph>
                            Create and manage contact groups for messaging:
                        </Typography>
                        <ol>
                            <li>Go to the "Messages" section</li>
                            <li>Select the "Groups" tab</li>
                            <li>Click "Add Group" to create a new group</li>
                            <li>Enter a group name</li>
                            <li>Search for and add members to the group</li>
                            <li>Save the group</li>
                            <li>Use these groups when sending messages to quickly reach specific sets of members</li>
                        </ol>
                        <Typography paragraph>
                            Groups help you organize your communication efficiently. Create groups based on training preferences, schedules, or any other criteria that makes sense for your gym.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Example groups might include "Competition Team," "Morning Classes," "Beginners," or "Weightlifting Enthusiasts."
                        </Typography>
                    </>
                ),
                tags: ['groups', 'contacts', 'distribution lists', 'batch messaging'],
                roles: ['affiliate']
            },
            {
                title: 'Using Analytics for Business Decisions',
                content: (
                    <>
                        <Typography paragraph>
                            The Analytics Dashboard provides valuable insights for your business:
                        </Typography>
                        <ul>
                            <li><strong>Membership Trends:</strong> Track growth over time and identify seasonal patterns</li>
                            <li><strong>Class Capacity:</strong> See which classes are consistently full or underutilized</li>
                            <li><strong>Revenue Analysis:</strong> Understand your income sources and payment patterns</li>
                            <li><strong>Activity Heatmap:</strong> Discover peak times for scheduling classes</li>
                            <li><strong>At-Risk Members:</strong> Identify members who have reduced their attendance</li>
                            <li><strong>Contract Expirations:</strong> Plan renewals and marketing campaigns</li>
                        </ul>
                        <Typography paragraph>
                            Use these insights to make data-driven decisions about:
                        </Typography>
                        <ul>
                            <li>Adjusting class schedules to match demand</li>
                            <li>Pricing strategies for different plans</li>
                            <li>Staff allocation during peak times</li>
                            <li>Targeted retention campaigns</li>
                            <li>Marketing efforts for underutilized services</li>
                        </ul>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Regularly review these analytics to stay proactive rather than reactive in your business management.
                        </Typography>
                    </>
                ),
                tags: ['analytics', 'business intelligence', 'decision making', 'planning', 'optimization'],
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
                            <li>Choose recipient type:</li>
                            <ul>
                                <li>User: Send to an individual member</li>
                                <li>Group: Send to a predefined group of members</li>
                                <li>All Members: Send to everyone in your affiliate</li>
                            </ul>
                            <li>Search for and select the recipient</li>
                            <li>Enter a subject and message body</li>
                            <li>Click "Send" to deliver your message</li>
                        </ol>
                        <Typography paragraph>
                            Messages are delivered to users' email addresses and also appear in their Messages section.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            You can also quickly send messages to all attendees of a class by going to the class details and clicking the "Send Message" button.
                        </Typography>
                    </>
                ),
                tags: ['messages', 'communication', 'email', 'inbox', 'notifications'],
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
                            Groups help you send messages to specific sets of members more efficiently. For example, you could create groups for:
                        </Typography>
                        <ul>
                            <li>Morning class attendees</li>
                            <li>Weightlifting enthusiasts</li>
                            <li>Competitors</li>
                            <li>New members</li>
                        </ul>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Organizing members into logical groups saves time and ensures your communications reach the right audience.
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
                            <li>Messages are sorted by date with the most recent at the top</li>
                        </ol>
                        <Typography paragraph>
                            This history helps you track your communication with members and groups. You can see when messages were sent and to whom.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            The message history can be helpful for verifying if important announcements were sent and ensuring consistent communication.
                        </Typography>
                    </>
                ),
                tags: ['message history', 'sent items', 'communications log'],
                roles: ['affiliate', 'trainer']
            },
            {
                title: 'Automated Notifications',
                content: (
                    <>
                        <Typography paragraph>
                            Irontrack sends automatic notifications to users for several events:
                        </Typography>
                        <ul>
                            <li><strong>Contract Notifications:</strong> When a new contract is sent for signature</li>
                            <li><strong>Plan Expiration:</strong> When a membership plan is about to expire</li>
                            <li><strong>Class Reminders:</strong> Before scheduled classes</li>
                            <li><strong>Payment Confirmations:</strong> After successful payments</li>
                            <li><strong>Waitlist Updates:</strong> When a spot becomes available in a class</li>
                        </ul>
                        <Typography paragraph>
                            These notifications are sent automatically by the system to improve user experience and ensure important information is communicated promptly.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Automated notifications help reduce administrative work while keeping members informed about important updates.
                        </Typography>
                    </>
                ),
                tags: ['notifications', 'automatic', 'reminders', 'emails', 'alerts'],
                roles: ['affiliate', 'trainer']
            },
            {
                title: 'Communication Best Practices',
                content: (
                    <>
                        <Typography paragraph>
                            Tips for effective communication with your members:
                        </Typography>
                        <ul>
                            <li><strong>Be Concise:</strong> Keep messages clear and to the point</li>
                            <li><strong>Use Descriptive Subjects:</strong> Help members quickly understand the message purpose</li>
                            <li><strong>Target Your Audience:</strong> Use groups to send relevant messages to specific members</li>
                            <li><strong>Maintain Consistency:</strong> Establish a regular communication schedule for updates</li>
                            <li><strong>Include Call to Action:</strong> Clearly state what you want members to do in response</li>
                        </ul>
                        <Typography paragraph>
                            Regular communication helps keep members engaged and informed about your gym's activities, events, and important announcements.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Consider creating a communication plan with regular updates, such as weekly programming previews or monthly newsletters.
                        </Typography>
                    </>
                ),
                tags: ['communication', 'best practices', 'effective messaging', 'engagement'],
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
                            If you've recently registered, verify that you've confirmed your email by checking your inbox and clicking the verification link.
                        </Typography>
                        <Typography paragraph>
                            If you still can't log in, contact your affiliate owner or our support team.
                        </Typography>
                    </>
                ),
                tags: ['login', 'password', 'access', 'authentication', 'email verification'],
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
                            <li>Verify that you have sufficient funds</li>
                            <li>Check if your bank is blocking the transaction</li>

                        </ol>
                        <Typography paragraph>
                            For regular members: Contact your gym owner for assistance.
                        </Typography>
                        <Typography paragraph>
                            For affiliate owners: Check transaction logs in the Finance section and contact our support if issues persist. If using Montonio for payments, also check your Montonio dashboard.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Using the credit system can be a good workaround for temporary payment issues. Affiliate owners can add credit to a member's account, which they can then use for purchases.
                        </Typography>
                    </>
                ),
                tags: ['payment', 'transaction', 'credit card', 'bank', 'purchase'],
                roles: ['all']
            },
            {
                title: 'Class Registration Issues',
                content: (
                    <>
                        <Typography paragraph>
                            If you can't register for a class:
                        </Typography>
                        <ol>
                            <li>Check if you have an active plan with available sessions</li>
                            <li>Verify that the class isn't already full (at capacity)</li>
                            <li>Ensure your plan covers the type of training for that class</li>
                            <li>Check if you're already registered for another class at the same time</li>
                            <li>Refresh the page and try again</li>
                        </ol>
                        <Typography paragraph>
                            If you have an unlimited plan but still can't register, check the plan's expiration date. For other issues, contact your affiliate owner for assistance.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Remember that each plan is linked to specific training types. For example, if your plan only covers "WOD" classes, you won't be able to register for "Weightlifting" classes.
                        </Typography>
                    </>
                ),
                tags: ['class registration', 'booking', 'sessions', 'plans'],
                roles: ['regular']
            },
            {
                title: 'Contract Management Issues',
                content: (
                    <>
                        <Typography paragraph>
                            For affiliate owners with contract issues:
                        </Typography>
                        <ol>
                            <li>If you can't send a contract, verify that it's in "draft" status</li>
                            <li>Ensure all required fields are completed in the contract</li>
                            <li>Check that the user email is correct</li>
                            <li>For contracts stuck in "Waiting for acceptance", you can delete and recreate them</li>
                            <li>If a contract is accepted but payments aren't processing, check your Montonio settings</li>
                        </ol>
                        <Typography paragraph>
                            For contract template issues, try creating a new template from scratch rather than editing an existing one. This can resolve formatting issues.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Keep contract terms clear and concise to increase the likelihood of quick acceptance by members.
                        </Typography>
                    </>
                ),
                tags: ['contracts', 'drafts', 'templates', 'acceptance', 'payments'],
                roles: ['affiliate']
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
                            <li>Contact our support team at <Link href="mailto:info@irontrack.ee">info@irontrack.ee</Link></li>
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
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Most technical issues can be resolved by clearing your browser cache and cookies, or by trying a different browser.
                        </Typography>
                    </>
                ),
                tags: ['support', 'help', 'technical issues', 'bugs', 'contact'],
                roles: ['all']
            },
            {
                title: 'Handling Session Count Issues',
                content: (
                    <>
                        <Typography paragraph>
                            If session counts for a member's plan are incorrect:
                        </Typography>
                        <ol>
                            <li>As an affiliate owner or trainer, go to the member's profile</li>
                            <li>Click on the "Active Plans" tab</li>
                            <li>Find the plan with the incorrect session count</li>
                            <li>Click the "Edit" button for that plan</li>
                            <li>Adjust the "Sessions Left" value to the correct number</li>
                            <li>Click "Save" to update the plan</li>
                        </ol>
                        <Typography paragraph>
                            This is useful when needing to correct errors or provide compensation sessions. The system logs all changes for audit purposes.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Consider adding a note explaining why the session count was adjusted to maintain transparency.
                        </Typography>
                    </>
                ),
                tags: ['sessions', 'count', 'plans', 'adjustment', 'correction'],
                roles: ['affiliate', 'trainer']
            },
            {
                title: 'Mobile App Troubleshooting',
                content: (
                    <>
                        <Typography paragraph>
                            If you're experiencing issues with the mobile version:
                        </Typography>
                        <ol>
                            <li>Ensure you're using the latest version of your mobile browser</li>
                            <li>Check your internet connection</li>
                            <li>Clear your browser cache and cookies</li>
                            <li>Try switching between WiFi and mobile data</li>
                            <li>If using iOS, try disabling content blockers</li>
                        </ol>
                        <Typography paragraph>
                            For affiliate owners and trainers: Some advanced features may work better on desktop or tablet devices due to screen size limitations.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            The responsive design should work well on most mobile devices, but for complex operations like analytics or extensive member management, a larger screen may provide a better experience.
                        </Typography>
                    </>
                ),
                tags: ['mobile', 'app', 'smartphone', 'tablet', 'responsive'],
                roles: ['all']
            },
            {
                title: 'Data Export Issues',
                content: (
                    <>
                        <Typography paragraph>
                            If you're having trouble exporting data:
                        </Typography>
                        <ol>
                            <li>Check that you have the necessary permissions for the data you're trying to export</li>
                            <li>Try exporting smaller date ranges if dealing with large amounts of data</li>
                            <li>Ensure you have a stable internet connection</li>
                            <li>If using filters, try simplifying your filter criteria</li>
                            <li>Try using a different browser</li>
                        </ol>
                        <Typography paragraph>
                            For large exports, the process may take some time. Be patient and avoid refreshing the page during export.
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', mt: 1 }}>
                            Regular data exports are recommended for backup purposes, especially for important financial and membership information.
                        </Typography>
                    </>
                ),
                tags: ['export', 'data', 'download', 'backup', 'reports'],
                roles: ['affiliate']
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
                                        href="mailto:info@irontrack.ee"
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