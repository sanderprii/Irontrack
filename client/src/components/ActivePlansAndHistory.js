import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    ButtonGroup,
    Divider,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HistoryIcon from '@mui/icons-material/History';

// Import the two components
import ActivePlans from './ActivePlans';
import PurchaseHistory from './PurchaseHistory';

const UserPlansView = ({ userId, affiliateId }) => {
    // State to track which view is active
    const [activeView, setActiveView] = useState('active'); // 'active' or 'history'

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tab buttons */}
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
                    <Typography variant="h5">
                        {activeView === 'active' ? 'Plans Management' : 'Purchase History'}
                    </Typography>

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