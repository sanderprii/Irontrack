import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  TextField,
  Slider,
  Button,
  Paper,
  Divider,
  Avatar,
  Card,
  CardContent,
  Stack,
  Chip,
  Grid,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Checkbox from '@mui/material/Checkbox';

import Link from '@mui/material/Link';
import AffiliateTermsModal from './affiliateTermsModal';
import { acceptAffiliateTerms, isUserAcceptedAffiliateTerms } from '../api/affiliateApi';

export default function PaymentForm({ affiliateCredit, appliedCredit, setAppliedCredit, planPrice, affiliateInfo, onTermsAcceptedChange }) {
  const [paymentMethod, setPaymentMethod] = useState(affiliateCredit > 0 ? 'credit' : 'montonio');
  const [creditInput, setCreditInput] = useState('0');
  const [errorMessage, setErrorMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
  const [termsChecking, setTermsChecking] = useState(true); // Loading state for initial terms check

  // Calculate maximum applicable credit
  const maxApplicableCredit = Math.min(affiliateCredit, planPrice);

  // Check if user has already accepted the terms when component loads
  useEffect(() => {
    if (affiliateInfo?.id) {
      checkTermsAcceptance();
    }
  }, [affiliateInfo?.id]);

  useEffect(() => {
    if (typeof onTermsAcceptedChange === 'function') {
      onTermsAcceptedChange(termsAccepted);
    }
  }, [termsAccepted, onTermsAcceptedChange]);

  // Check if user has already accepted terms
  const checkTermsAcceptance = async () => {
    try {
      setTermsChecking(true);
      const accepted = await isUserAcceptedAffiliateTerms(affiliateInfo.id);
      setTermsAccepted(accepted);
    } catch (error) {
      console.error("Error checking terms acceptance:", error);
      setTermsAccepted(false);
    } finally {
      setTermsChecking(false);
    }
  };

  // Update input field when appliedCredit changes
  useEffect(() => {
    setCreditInput(appliedCredit.toString());
  }, [appliedCredit]);

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);

    if (method === 'credit') {
      // When credit payment is selected, apply maximum credit
      setAppliedCredit(maxApplicableCredit);
      setCreditInput(maxApplicableCredit.toString());
    }
  };

  const handleCreditSliderChange = (event, newValue) => {
    setAppliedCredit(newValue);
    setCreditInput(newValue.toString());
  };

  const handleCreditInputChange = (event) => {
    const value = event.target.value;
    setCreditInput(value);

    // Validate input
    if (value === '') {
      setErrorMessage('');
      return;
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
      setErrorMessage('Please enter a number');
    } else if (numValue < 0) {
      setErrorMessage('Credit cannot be negative');
    } else if (numValue > affiliateCredit) {
      setErrorMessage(`Maximum available credit is ${affiliateCredit}€`);
    } else if (numValue > planPrice) {
      setErrorMessage(`Maximum credit can be ${planPrice}€`);
    } else {
      setErrorMessage('');
    }
  };

  // Apply entered credit immediately
  const applyCredit = () => {
    if (creditInput === '' || errorMessage) return;

    const numValue = Number(creditInput);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxApplicableCredit) {
      // Use exact value
      setAppliedCredit(numValue);
    }
  };

  // Button to apply maximum credit
  const applyMax = () => {
    const maxValue = Math.min(affiliateCredit, planPrice);
    setCreditInput(maxValue.toString());
    setAppliedCredit(maxValue);
    setErrorMessage('');
  };

  const handleOpenTerms = () => {
    setTermsModalOpen(true);
  };

  const handleCloseTerms = () => {
    setTermsModalOpen(false);
  };

  // Handle terms acceptance checkbox
  const handleTermsAcceptance = async (event) => {
    const checked = event.target.checked;

    if (checked) {
      // Immediately update the UI
      setTermsAccepted(true);
      setIsAcceptingTerms(true);

      try {
        // Make the API call to accept terms
        await acceptAffiliateTerms({
          affiliateId: affiliateInfo.id
        });


      } catch (error) {
        console.error("Failed to accept terms:", error);
        // Even if API fails, we'll keep the checkbox checked
        // since the user's intent was to accept, and we'll retry on Next
      } finally {
        setIsAcceptingTerms(false);
      }
    } else {
      // Don't allow unchecking once terms are accepted
      // This matches the requirement that the checkbox becomes inactive once checked
      event.preventDefault();
    }
  };
  return (
      <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            maxHeight: 'none',
            overflow: 'visible'
          }}
      >
        <CardContent
            sx={{
              p: { xs: 2, sm: 3 },
              pt: 0,
              overflow: 'visible'
            }}
        >
          {/* Header with affiliate name and logo */}
          <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2
              }}
          >
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

          {/* Payment summary */}
          <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderColor: 'divider',
                overflow: 'visible'
              }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Summary
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  Regular monthly payment
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="body2" fontWeight="500">
                  {planPrice}€
                </Typography>
              </Grid>

              {appliedCredit > 0 && (
                  <>
                    <Grid item xs={8}>
                      <Typography variant="body2" color="success.main">
                        Credit applied
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="500" color="success.main">
                        -{appliedCredit}€
                      </Typography>
                    </Grid>
                  </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={8}>
                <Typography variant="subtitle1" fontWeight="600">
                  Total
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {(planPrice - appliedCredit).toFixed(2)}€
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: '500' }}>
            Payment method
          </Typography>

          {affiliateCredit > 0 && (
              <Box sx={{ mb: 3, overflow: 'visible' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'primary.lighter',
                  color: 'primary.dark'
                }}>
                  <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    Your available credit: <Box component="span" sx={{ fontWeight: '600' }}>{affiliateCredit}€</Box>
                  </Typography>
                </Box>

                <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    sx={{ overflow: 'visible' }}
                >
                  {/* Credit payment option */}
                  <Paper
                      variant="outlined"
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        p: 2,
                        borderColor: paymentMethod === 'credit' ? 'primary.main' : 'divider',
                        borderWidth: paymentMethod === 'credit' ? 2 : 1,
                        bgcolor: paymentMethod === 'credit' ? 'primary.lighter' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        overflow: 'visible',
                        position: 'relative',
                        zIndex: 1
                      }}
                      onClick={() => setPaymentMethod('credit')}
                  >
                    <FormControlLabel
                        value="credit"
                        control={
                          <Radio
                              sx={{
                                '&.Mui-checked': {
                                  color: 'primary.main',
                                },
                              }}
                          />
                        }
                        label={
                          <Stack
                              direction={isMobile ? "column" : "row"}
                              spacing={1}
                              alignItems={isMobile ? "flex-start" : "center"}
                          >
                            <CreditCardIcon sx={{ color: paymentMethod === 'credit' ? 'primary.main' : 'action.active' }} />
                            <Typography sx={{ fontWeight: '500' }}>
                              {maxApplicableCredit >= planPrice ? "Pay fully with credit" : "Use credit partially"}
                            </Typography>
                            <Chip
                                size="small"
                                label="Best value"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 24 }}
                            />
                          </Stack>
                        }
                        sx={{ m: 0, width: '100%' }}
                    />

                    {maxApplicableCredit < planPrice && paymentMethod === 'credit' && (
                        <Box sx={{ ml: 4, mt: 2, width: '90%', overflow: 'visible' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">
                              Apply credit:
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {appliedCredit}€
                            </Typography>
                          </Box>
                          <Slider
                              value={appliedCredit}
                              onChange={handleCreditSliderChange}
                              aria-labelledby="credit-slider"
                              valueLabelDisplay="auto"
                              step={1}
                              min={0}
                              max={maxApplicableCredit}
                              disabled={paymentMethod !== 'credit'}
                              sx={{
                                '& .MuiSlider-thumb': {
                                  width: 20,
                                  height: 20,
                                },
                              }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Remaining to pay: {(planPrice - appliedCredit).toFixed(2)}€
                          </Typography>
                        </Box>
                    )}
                  </Paper>

                  {/* Bank payment option */}
                  <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        p: 2,
                        borderColor: paymentMethod === 'montonio' ? 'primary.main' : 'divider',
                        borderWidth: paymentMethod === 'montonio' ? 2 : 1,
                        bgcolor: paymentMethod === 'montonio' ? 'primary.lighter' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        overflow: 'visible',
                        position: 'relative',
                        zIndex: 0
                      }}
                      onClick={() => setPaymentMethod('montonio')}
                  >
                    <FormControlLabel
                        value="montonio"
                        control={
                          <Radio
                              sx={{
                                '&.Mui-checked': {
                                  color: 'primary.main',
                                },
                              }}
                          />
                        }
                        label={
                          <Stack
                              direction={isMobile ? "column" : "row"}
                              spacing={1}
                              alignItems={isMobile ? "flex-start" : "center"}
                          >
                            <AccountBalanceIcon sx={{ color: paymentMethod === 'montonio' ? 'primary.main' : 'action.active' }} />
                            <Typography sx={{ fontWeight: '500' }}>
                              Montonio Bank payment
                            </Typography>
                          </Stack>
                        }
                        sx={{ m: 0, width: '100%' }}
                    />

                    {affiliateCredit > 0 && paymentMethod === 'montonio' && (
                        <Box sx={{
                          ml: 4,
                          mt: 2,
                          mb: 1,
                          overflow: 'visible'
                        }}>
                          <Box sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'flex-end',
                            gap: 2,
                            mb: 1
                          }}>
                            <TextField
                                label="Apply credit"
                                value={creditInput}
                                onChange={handleCreditInputChange}
                                error={!!errorMessage}
                                helperText={errorMessage || `Available: ${affiliateCredit}€`}
                                size="small"
                                type="number"
                                inputProps={{
                                  min: 0,
                                  max: maxApplicableCredit,
                                  step: "any"
                                }}
                                sx={{ width: isMobile ? '100%' : '150px' }}
                            />
                            <Box sx={{
                              display: 'flex',
                              gap: 1,
                              width: isMobile ? '100%' : 'auto'
                            }}>
                              <Button
                                  variant="contained"
                                  onClick={applyCredit}
                                  disabled={!!errorMessage || creditInput === '' || Number(creditInput) === appliedCredit}
                                  size="small"
                                  sx={{
                                    fontWeight: '500',
                                    flex: isMobile ? 1 : 'none'
                                  }}
                              >
                                Apply
                              </Button>
                              <Button
                                  variant="outlined"
                                  onClick={applyMax}
                                  size="small"
                                  sx={{
                                    fontWeight: '500',
                                    flex: isMobile ? 1 : 'none'
                                  }}
                              >
                                Max
                              </Button>
                            </Box>
                          </Box>

                          {appliedCredit > 0 && (
                              <Box sx={{
                                p: 1.5,
                                bgcolor: 'success.lighter',
                                color: 'success.dark',
                                borderRadius: 1,
                                mt: 2
                              }}>
                                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                                  Credit applied: {appliedCredit}€ (Remaining to pay: {(planPrice - appliedCredit).toFixed(2)}€)
                                </Typography>
                              </Box>
                          )}
                        </Box>
                    )}
                  </Paper>
                </RadioGroup>
              </Box>
          )}

          {!affiliateCredit && (
              <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    overflow: 'visible'
                  }}
              >
                <AccountBalanceIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography>
                  You'll be redirected to Montonio to complete your payment.
                </Typography>
              </Paper>
          )}
          {termsChecking ? (
              <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
          ) : !termsAccepted ? (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Divider sx={{ mb: 3 }} />

                <FormControlLabel
                    control={
                      <Checkbox
                          checked={termsAccepted}
                          onChange={handleTermsAcceptance}
                          disabled={isAcceptingTerms || termsAccepted}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I have read and agree to the{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenTerms();
                            }}
                        >
                          Terms and Conditions
                        </Link>
                      </Typography>
                    }
                />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                  You must accept the {affiliateInfo.name} terms and conditions to proceed with your purchase.
                </Typography>
              </Box>
          ) : (
              <Box sx={{ mt: 4, mb: 2 }}>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'success.lighter',
                  color: 'success.dark'
                }}>
                  <CheckCircleOutlineIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: '500' }}>
                    You have accepted the {affiliateInfo.name} terms and conditions
                  </Typography>
                </Box>
              </Box>
          )}

          {/* Terms Modal */}
          <AffiliateTermsModal
              open={termsModalOpen}
              onClose={handleCloseTerms}
              affiliateId={affiliateInfo.id}
          />
        </CardContent>
      </Card>
  );
}

PaymentForm.propTypes = {
  affiliateCredit: PropTypes.number,
  appliedCredit: PropTypes.number,
  setAppliedCredit: PropTypes.func.isRequired,
  planPrice: PropTypes.number.isRequired,
  affiliateInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  }).isRequired,
  onTermsAcceptedChange: PropTypes.func
};

PaymentForm.defaultProps = {
  affiliateCredit: 0,
  appliedCredit: 0,

};