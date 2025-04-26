import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

interface InfoProps {
    planName: string;
    planPrice: number;
    appliedCredit: number;
    firstPaymentPrice?: string;
    isFirstPayment?: boolean;
}

export default function Info({
                                 planName,
                                 planPrice,
                                 appliedCredit,
                                 firstPaymentPrice,
                                 isFirstPayment = false
                             }: InfoProps) {
    // Calculate the total price with applied credit
    const calculatedTotalPrice = Math.max(planPrice - appliedCredit, 0);


    const formattedRegularPrice = `${calculatedTotalPrice}€`;

    return (
        <React.Fragment>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total
            </Typography>


            <Box>
                <Typography variant="h4" gutterBottom>
                    {firstPaymentPrice}
                </Typography>
                <Chip
                    label="First payment"
                    color="primary"
                    size="small"
                    sx={{ mb: 2 }}
                />
            </Box>

            <Typography variant="h4" gutterBottom>
                {formattedRegularPrice}
            </Typography>


            <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        sx={{ mr: 2 }}
                        primary={planName}
                        secondary={`Regular monthly payment`}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {`${planPrice}€`}
                    </Typography>
                </ListItem>

                {appliedCredit > 0 && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            sx={{ mr: 2 }}
                            primary="Credit applied"
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                            {`-${appliedCredit}€`}
                        </Typography>
                    </ListItem>
                )}

                {isFirstPayment && firstPaymentPrice && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText
                            sx={{ mr: 2 }}
                            primary="First payment adjustment"
                            secondary="Proportional to contract start date"
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                            {firstPaymentPrice}
                        </Typography>
                    </ListItem>
                )}
            </List>

            {isFirstPayment && firstPaymentPrice && (
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Your first payment is calculated proportionally based on the days between your contract start date and the next regular payment date.
                </Typography>
            )}
        </React.Fragment>
    );
}