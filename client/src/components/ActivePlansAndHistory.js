import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    ButtonGroup,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HistoryIcon from '@mui/icons-material/History';

// Import the two components
import ActivePlans from './ActivePlans';
import PurchaseHistory from './PurchaseHistory';

const UserPlansView = ({ userId, affiliateId }) => {
    // State to track which view is active
    const [activeView, setActiveView] = useState('active'); // 'active' or 'history'
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tab buttons */}
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    px: isMobile ? 0 : 2,
                    width: '100%'
                }}>
                    {isMobile ? (
                        // Full-width buttons for mobile
                        <Box sx={{ display: 'flex', width: '100%' }}>
                            <Button
                                startIcon={<DateRangeIcon />}
                                onClick={() => setActiveView('active')}
                                color={activeView === 'active' ? 'primary' : 'inherit'}
                                variant={activeView === 'active' ? 'contained' : 'outlined'}
                                sx={{
                                    flex: 1,
                                    fontWeight: activeView === 'active' ? 'bold' : 'normal',
                                    boxShadow: activeView === 'active' ? 3 : 0,
                                    borderRadius: '4px 0 0 4px',
                                    borderRight: activeView === 'active' ? 1 : 0
                                }}
                            >
                                Active
                            </Button>
                            <Button
                                startIcon={<HistoryIcon />}
                                onClick={() => setActiveView('history')}
                                color={activeView === 'history' ? 'primary' : 'inherit'}
                                variant={activeView === 'history' ? 'contained' : 'outlined'}
                                sx={{
                                    flex: 1,
                                    fontWeight: activeView === 'history' ? 'bold' : 'normal',
                                    boxShadow: activeView === 'history' ? 3 : 0,
                                    borderRadius: '0 4px 4px 0',
                                    borderLeft: activeView === 'history' ? 1 : 0
                                }}
                            >
                                History
                            </Button>
                        </Box>
                    ) : (
                        // Original ButtonGroup for desktop
                        <ButtonGroup variant="contained">
                            <Button
                                startIcon={<DateRangeIcon />}
                                onClick={() => setActiveView('active')}
                                color={activeView === 'active' ? 'primary' : 'inherit'}
                                variant={activeView === 'active' ? 'contained' : 'outlined'}
                                sx={{
                                    fontWeight: activeView === 'active' ? 'bold' : 'normal',
                                    boxShadow: activeView === 'active' ? 3 : 0
                                }}
                            >
                                Active
                            </Button>
                            <Button
                                startIcon={<HistoryIcon />}
                                onClick={() => setActiveView('history')}
                                color={activeView === 'history' ? 'primary' : 'inherit'}
                                variant={activeView === 'history' ? 'contained' : 'outlined'}
                                sx={{
                                    fontWeight: activeView === 'history' ? 'bold' : 'normal',
                                    boxShadow: activeView === 'history' ? 3 : 0
                                }}
                            >
                                History
                            </Button>
                        </ButtonGroup>
                    )}
                </Box>
                <Divider />
            </Box>

            {/* Content area */}
            <Box sx={{ mt: 3 }}>
                {activeView === 'active' ? (
                    <ActivePlans userId={userId} affiliateId={affiliateId} />
                ) : (
                    <PurchaseHistory userId={userId} affiliateId={affiliateId} />
                )}
            </Box>
        </Box>
    );
};

export default UserPlansView;