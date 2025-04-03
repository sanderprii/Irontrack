// src/components/PeriodSelector.js
import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, Typography } from '@mui/material';

const PeriodSelector = ({ period, onPeriodChange, periodsToShow = 'all' }) => {
    // Define available period options based on the type of analytics
    const getPeriodOptions = () => {
        // Default all periods
        const allPeriods = [
            { value: 'ALL_TIME', label: 'All Time' },
            { value: 'THIS_YEAR', label: 'This Year' },
            { value: 'LAST_YEAR', label: 'Last Year' },
            { value: 'THIS_MONTH', label: 'This Month' },
            { value: 'LAST_MONTH', label: 'Last Month' },
            { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
            { value: 'LAST_90_DAYS', label: 'Last 90 Days' }
        ];

        // Financial periods (for financial metrics)
        const financialPeriods = [
            { value: 'THIS_YEAR', label: 'This Year' },
            { value: 'LAST_YEAR', label: 'Last Year' },
            { value: 'THIS_MONTH', label: 'This Month' },
            { value: 'LAST_MONTH', label: 'Last Month' },
            { value: 'LAST_6_MONTHS', label: 'Last 6 Months' }
        ];

        // Periods for client behavior
        const behaviorPeriods = [
            { value: 'LAST_30_DAYS', label: 'Last 30 Days' },
            { value: 'LAST_90_DAYS', label: 'Last 90 Days' },
            { value: 'THIS_MONTH', label: 'This Month' },
            { value: 'LAST_MONTH', label: 'Last Month' }
        ];

        // Periods for contract expiration
        const expirationPeriods = [
            { value: 'NEXT_30_DAYS', label: 'Next 30 Days' },
            { value: 'NEXT_90_DAYS', label: 'Next 90 Days' },
            { value: 'THIS_MONTH', label: 'This Month' },
            { value: 'NEXT_MONTH', label: 'Next Month' }
        ];

        // Historical periods for trend analysis
        const historicalPeriods = [
            { value: 'ALL_TIME', label: 'All Time' },
            { value: 'THIS_YEAR', label: 'This Year' },
            { value: 'LAST_YEAR', label: 'Last Year' },
            { value: 'LAST_6_MONTHS', label: 'Last 6 Months' }
        ];

        switch (periodsToShow) {
            case 'financial':
                return financialPeriods;
            case 'behavior':
                return behaviorPeriods;
            case 'expiration':
                return expirationPeriods;
            case 'historical':
                return historicalPeriods;
            case 'all':
            default:
                return allPeriods;
        }
    };

    const periodOptions = getPeriodOptions();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mr: 2 }}>
                Period:
            </Typography>
            <ToggleButtonGroup
                value={period}
                exclusive
                onChange={(e, newPeriod) => {
                    if (newPeriod !== null) {
                        onPeriodChange(newPeriod);
                    }
                }}
                size="small"
            >
                {periodOptions.map((option) => (
                    <ToggleButton key={option.value} value={option.value}>
                        {option.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};

export default PeriodSelector;