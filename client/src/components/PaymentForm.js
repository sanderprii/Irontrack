import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

export default function PaymentForm({ affiliateCredit, appliedCredit, setAppliedCredit, planPrice }) {
    const [paymentMethod, setPaymentMethod] = useState(affiliateCredit > 0 ? 'credit' : 'montonio');
    const [creditInput, setCreditInput] = useState('0');
    const [errorMessage, setErrorMessage] = useState('');

    // Maksimaalse kasutatava krediidi arvutamine
    const maxApplicableCredit = Math.min(affiliateCredit, planPrice);

    // Uuenda sisestusvälja, kui appliedCredit muutub
    useEffect(() => {
        setCreditInput(appliedCredit.toString());
    }, [appliedCredit]);

    const handlePaymentMethodChange = (event) => {
        const method = event.target.value;
        setPaymentMethod(method);

        if (method === 'credit') {
            // Kui valitakse krediidiga maksmine, siis rakendame maksimaalse krediidi
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

        // Valideeri sisestus
        if (value === '') {
            setErrorMessage('');
            return;
        }

        const numValue = Number(value);
        if (isNaN(numValue)) {
            setErrorMessage('Palun sisesta number');
        } else if (numValue < 0) {
            setErrorMessage('Krediit ei saa olla negatiivne');
        } else if (numValue > affiliateCredit) {
            setErrorMessage(`Maksimaalne saadaolev krediit on ${affiliateCredit}€`);
        } else if (numValue > planPrice) {
            setErrorMessage(`Maksimaalne krediit saab olla ${planPrice}€`);
        } else {
            setErrorMessage('');
        }
    };

    // Rakenda sisestatud krediit kohe
    const applyCredit = () => {
        if (creditInput === '' || errorMessage) return;

        const numValue = Number(creditInput);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= maxApplicableCredit) {
            // Kasuta täpset väärtust
            setAppliedCredit(numValue);
        }
    };

    // Nupu lisamiseks maksimaalsele krediidile
    const applyMax = () => {
        const maxValue = Math.min(affiliateCredit, planPrice);
        setCreditInput(maxValue.toString());
        setAppliedCredit(maxValue);
        setErrorMessage('');
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>

            {affiliateCredit > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Your available credit: {affiliateCredit}€
                    </Typography>

                    <RadioGroup
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                    >
                        <FormControlLabel
                            value="credit"
                            control={<Radio />}
                            label={maxApplicableCredit >= planPrice ? "Pay fully with credit" : "Use credit partially"}
                        />

                        {maxApplicableCredit < planPrice && paymentMethod === 'credit' && (
                            <Box sx={{ ml: 4, mt: 1, mb: 2, width: '90%' }}>
                                <Typography gutterBottom>
                                    Apply credit: {appliedCredit}€
                                </Typography>
                                <Slider
                                    value={appliedCredit}
                                    onChange={handleCreditSliderChange}
                                    aria-labelledby="credit-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    min={0}
                                    max={maxApplicableCredit}
                                    disabled={paymentMethod !== 'credit'}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Remaining to pay: {(planPrice - appliedCredit).toFixed(2)}€
                                </Typography>
                            </Box>
                        )}

                        <FormControlLabel
                            value="montonio"
                            control={<Radio />}
                            label="Montonio Bank payment"
                        />

                        {paymentMethod === 'montonio' && affiliateCredit > 0 && (
                            <Box sx={{ ml: 4, mt: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
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
                                        sx={{ width: '150px' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={applyCredit}
                                        disabled={!!errorMessage || creditInput === '' || Number(creditInput) === appliedCredit+0.01}
                                    >
                                        Apply
                                    </Button>
                                    <Button
                                        variant="text"
                                        onClick={applyMax}
                                        size="small"
                                    >
                                        Max
                                    </Button>
                                </Box>

                                {appliedCredit > 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Credit applied: {appliedCredit}€ (Remaining to pay: {(planPrice - appliedCredit).toFixed(2)}€)
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </RadioGroup>
                </Box>
            )}

            {!affiliateCredit && (
                <Typography>
                    You'll be redirected to Montonio to complete your payment.
                </Typography>
            )}
        </React.Fragment>
    );
}

PaymentForm.propTypes = {
    affiliateCredit: PropTypes.number,
    appliedCredit: PropTypes.number,
    setAppliedCredit: PropTypes.func.isRequired,
    planPrice: PropTypes.number.isRequired,
};

PaymentForm.defaultProps = {
    affiliateCredit: 0,
    appliedCredit: 0,
};