import * as React from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function Review({ totalPrice, planName, planPrice, appliedCredit, contract, isContractPayment }) {
  // Check if this is the first payment for a contract
  const isFirstPayment = contract?.isFirstPayment && contract?.firstPaymentAmount;

  // Get the payment amount based on whether it's a first payment or regular payment
  const effectivePrice = isFirstPayment ? contract.firstPaymentAmount : planPrice;

  // Arvuta uus kogusumma, millest lahutatakse rakendatud krediit
  const total = Math.max(effectivePrice - appliedCredit, 0);

  // Create explanation for first payment if needed
  const firstPaymentExplanation = isFirstPayment
      ? `First payment includes the period from ${new Date(contract.startDate).toLocaleDateString()} to the next payment day (${contract.paymentDay}).`
      : '';

  return (
      <Stack spacing={2}>
        <List disablePadding>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Products" secondary={planName} />
            <Typography variant="body2">{planPrice}€</Typography>
          </ListItem>

          {isFirstPayment && (
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText
                    primary={
                      <React.Fragment>
                        First Payment Adjustment
                        <Tooltip title={firstPaymentExplanation} arrow>
                          <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                        </Tooltip>
                      </React.Fragment>
                    }
                />
                <Typography variant="body2" color={contract.firstPaymentAmount > planPrice ? "error.main" : "success.main"}>
                  {contract.firstPaymentAmount > planPrice ? '+' : ''}{(contract.firstPaymentAmount - planPrice).toFixed(2)}€
                </Typography>
              </ListItem>
          )}

          {appliedCredit > 0 && (
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Paid by credit" />
                <Typography variant="body2" color="text.primary">
                  -{appliedCredit}€
                </Typography>
              </ListItem>
          )}

          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {total}€
            </Typography>
          </ListItem>

          {isFirstPayment && (
              <ListItem sx={{ px: 0 }}>
                <Chip
                    label="First payment amount"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                />
                <Typography variant="caption">
                  Future payments will be {planPrice}€ per {contract?.paymentInterval || 'month'}
                </Typography>
              </ListItem>
          )}
        </List>

        <Divider />

        <Stack direction="column" divider={<Divider flexItem />} spacing={2} sx={{ my: 2 }}>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Payment details
            </Typography>
            <Grid container>
              {isContractPayment && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Contract: {contract?.contractType || 'Membership Contract'}
                    </Typography>
                  </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="body2">
                  Payment method: {appliedCredit > 0 ? (appliedCredit >= effectivePrice ? 'Credit' : 'Credit + Montonio') : 'Montonio'}
                </Typography>
              </Grid>
              {isContractPayment && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Payment schedule: {contract?.paymentDay || '1'} of each {contract?.paymentInterval || 'month'}
                    </Typography>
                  </Grid>
              )}
            </Grid>
          </div>
        </Stack>
      </Stack>
  );
}

Review.propTypes = {
  planName: PropTypes.string.isRequired,
  planPrice: PropTypes.number.isRequired,
  totalPrice: PropTypes.number, // mitte enam kasutusel, kuna arvutame uuesti
  appliedCredit: PropTypes.number,
  contract: PropTypes.object,
  isContractPayment: PropTypes.bool
};

Review.defaultProps = {
  appliedCredit: 0,
  contract: null,
  isContractPayment: false
};