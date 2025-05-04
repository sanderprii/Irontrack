import * as React from 'react';
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Chip,
  Tooltip,
  Paper,
  Box,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PropTypes from 'prop-types';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import DescriptionIcon from '@mui/icons-material/Description';

export default function Review({ totalPrice, planName, planPrice, appliedCredit, contract, isContractPayment, affiliateInfo }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Check if this is the first payment for a contract
  const isFirstPayment = contract?.isFirstPayment && contract?.firstPaymentAmount;

  // Get the payment amount based on whether it's a first payment or regular payment
  const effectivePrice = isFirstPayment ? contract.firstPaymentAmount : planPrice;

  // Calculate total amount after credit is applied
  const total = Math.max(effectivePrice - appliedCredit, 0);

  // Create explanation for first payment if needed
  const firstPaymentExplanation = isFirstPayment
      ? `First payment includes the period from ${new Date(contract.startDate).toLocaleDateString()} to the next payment day (${contract.paymentDay}).`
      : '';

  // Determine payment method text
  const paymentMethodText = appliedCredit > 0
      ? (appliedCredit >= effectivePrice ? 'Credit' : 'Credit + Montonio')
      : 'Montonio';

  return (
      <Card elevation={0} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, overflow: 'visible' }}>
          {/* Header with affiliate name and logo */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h5" fontWeight="600">
              {affiliateInfo.name}
            </Typography>
            <Avatar
                src={affiliateInfo.logo}
                sx={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'transparent',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
                variant="rounded"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Order summary */}
          <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderColor: 'divider'
              }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Order Summary
            </Typography>

            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {planName}
                      </Typography>
                    }
                />
                <Typography variant="body2" fontWeight={500}>
                  {planPrice}€
                </Typography>
              </ListItem>

              {isFirstPayment && (
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight={500}>
                              First Payment Adjustment
                            </Typography>
                            <Tooltip title={firstPaymentExplanation} arrow>
                              <HelpOutlineIcon
                                  fontSize="small"
                                  sx={{ ml: 1, fontSize: 16, color: 'text.secondary' }}
                              />
                            </Tooltip>
                          </Box>
                        }
                    />
                    <Typography
                        variant="body2"
                        fontWeight={500}
                        color={contract.firstPaymentAmount > planPrice ? "error.main" : "success.main"}
                    >
                      {contract.firstPaymentAmount > planPrice ? '+' : ''}{(contract.firstPaymentAmount - planPrice).toFixed(2)}€
                    </Typography>
                  </ListItem>
              )}

              {appliedCredit > 0 && (
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500} color="success.main">
                            Paid by credit
                          </Typography>
                        }
                    />
                    <Typography variant="body2" fontWeight={500} color="success.main">
                      -{appliedCredit}€
                    </Typography>
                  </ListItem>
              )}

              <Divider sx={{ my: 1 }} />

              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        Total
                      </Typography>
                    }
                />
                <Typography variant="subtitle1" fontWeight={700}>
                  {total}€
                </Typography>
              </ListItem>

              {isFirstPayment && (
                  <ListItem sx={{ px: 0, pt: 1 }}>
                    <Box sx={{
                      width: '100%',
                      p: 1.5,
                      bgcolor: 'primary.lighter',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Chip
                          label="First payment"
                          color="primary"
                          size="small"
                          sx={{ height: 24 }}
                      />
                      <Typography variant="caption" color="primary.dark">
                        Future payments will be {planPrice}€ per {contract?.paymentInterval || 'month'}
                      </Typography>
                    </Box>
                  </ListItem>
              )}
            </List>
          </Paper>

          {/* Payment details section */}
          <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderColor: 'divider'
              }}
          >
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Payment Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2">
                    Payment method: <Box component="span" fontWeight={500}>{paymentMethodText}</Box>
                  </Typography>
                </Box>
              </Grid>

              {isContractPayment && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">
                          Contract: <Box component="span" fontWeight={500}>{contract?.contractType || 'Membership Contract'}</Box>
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventRepeatIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2">
                          Payment schedule: <Box component="span" fontWeight={500}>{contract?.paymentDay || '1'} of each {contract?.paymentInterval || 'month'}</Box>
                        </Typography>
                      </Box>
                    </Grid>
                  </>
              )}

              {total === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: 'success.lighter',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: '500', color: 'success.dark' }}>
                        Fully paid with credit
                      </Typography>
                    </Box>
                  </Grid>
              )}
            </Grid>
          </Paper>
        </CardContent>
      </Card>
  );
}

Review.propTypes = {
  planName: PropTypes.string.isRequired,
  planPrice: PropTypes.number.isRequired,
  totalPrice: PropTypes.number,
  appliedCredit: PropTypes.number,
  contract: PropTypes.object,
  isContractPayment: PropTypes.bool,
  affiliateInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  }).isRequired
};

Review.defaultProps = {
  appliedCredit: 0,
  contract: null,
  isContractPayment: false
};