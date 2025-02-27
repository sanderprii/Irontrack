import * as React from 'react';
import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import AddressForm from '../components/AddressForm';
import Info from '../components/Info';
import InfoMobile from '../components/InfoMobile';
import PaymentForm from '../components/PaymentForm';
import Review from '../components/Review';
import SitemarkIcon from '../components/SitemarkIcon';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

import {buyPlan, getUserCredit, createMontonioPayment, checkPaymentStatus} from "../api/planApi";
import {sendMessage} from "../api/messageApi";

// Sammude nimed
const steps = ['Payment details', 'Review your order'];

// Funktsioon, mis tagastab sammu sisu ja edastab lisaks krediidi andmed
function getStepContent(step, planData, affiliateInfo, affiliateCredit, appliedCredit, setAppliedCredit) {
    switch (step) {
        case 0:
            return (
                <PaymentForm
                    affiliateCredit={affiliateCredit}
                    appliedCredit={appliedCredit}
                    setAppliedCredit={setAppliedCredit}
                    planPrice={planData?.price || 0}
                />
            );
        case 1:
            return (
                <Review
                    planName={planData?.name || ''}
                    planPrice={planData?.price || 0}
                    appliedCredit={appliedCredit}
                />
            );
        default:
            throw new Error('Unknown step');
    }
}

export default function Checkout(props) {
    const [activeStep, setActiveStep] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Kasuta olekus vaikimisi tühja objekti
    const [affiliateInfo, setAffiliateInfo] = useState({});
    const [planData, setPlanData] = useState({});
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState(null);
    // Krediidi olekud
    const [appliedCredit, setAppliedCredit] = useState(0);
    const [affiliateCredit, setAffiliateCredit] = useState(0);
    const [userData, setUserData] = useState(null);
    const [merchantReference, setMerchantReference] = useState(null);

    // Lae andmed localStorage'ist esimesel renderil
    useEffect(() => {
        // Proovi kõigepealt saada andmed location.state'ist
        const plan = location.state?.plan;
        const affiliate = location.state?.affiliate;
        const contractData = location.state?.contract;
        const userData = location.state?.userData;


        if (plan) {
            setPlanData(plan);
            // Salvesta localStorage'i kui on uued andmed
            localStorage.setItem('checkout_planData', JSON.stringify(plan));
        }

        if (affiliate) {
            setAffiliateInfo(affiliate);
            localStorage.setItem('checkout_affiliateInfo', JSON.stringify(affiliate));
        }

        if (contractData) {
            setContract(contractData);
            localStorage.setItem('checkout_contract', JSON.stringify(contractData));
        }

        if (userData) {
            setUserData(userData);
        }

        // Kui location.state pole saadaval, proovi localStorage'ist
        if (!plan) {
            const savedPlanData = localStorage.getItem('checkout_planData');
            if (savedPlanData) {
                try {
                    const parsedPlanData = JSON.parse(savedPlanData);
                    setPlanData(parsedPlanData);
                } catch (error) {
                    console.error('Error parsing saved plan data', error);
                }
            }
        }

        if (!affiliate) {
            const savedAffiliateInfo = localStorage.getItem('checkout_affiliateInfo');
            if (savedAffiliateInfo) {
                try {
                    const parsedAffiliateInfo = JSON.parse(savedAffiliateInfo);
                    setAffiliateInfo(parsedAffiliateInfo);
                } catch (error) {
                    console.error('Error parsing saved affiliate info', error);
                }
            }
        }

        if (!contractData) {
            const savedContract = localStorage.getItem('checkout_contract');
            if (savedContract) {
                try {
                    const parsedContract = JSON.parse(savedContract);
                    setContract(parsedContract);
                } catch (error) {
                    console.error('Error parsing saved contract', error);
                }
            }
        }

        // Lae salvestatud rakendatud krediit
        const savedAppliedCredit = localStorage.getItem('checkout_appliedCredit');
        if (savedAppliedCredit) {
            try {
                setAppliedCredit(parseFloat(savedAppliedCredit));
            } catch (error) {
                console.error('Error parsing saved applied credit', error);
            }
        }
    }, [location.state]);

    // Lisa useEffect Montonio tagasisuunamise käsitlemiseks
    useEffect(() => {
        // Get token from URL - Montonio uses 'order-token'
        const orderToken = searchParams.get('order-token');

        if (orderToken) {
            setLoading(true);

            // Proovi kõigepealt laadida LocalStorage andmed uuesti
            const savedPlanData = localStorage.getItem('checkout_planData');
            const savedAppliedCredit = localStorage.getItem('checkout_appliedCredit');
            const savedAffiliateInfo = localStorage.getItem('checkout_affiliateInfo');
            const savedContract = localStorage.getItem('checkout_contract');
            let parsedPlanData = null;
            let parsedAppliedCredit = 0;
            let parsedAffiliateInfo = null;
            let parsedContract = null;

            if (savedPlanData) {
                try {
                    parsedPlanData = JSON.parse(savedPlanData);
                    console.log("Loaded plan data from localStorage:", parsedPlanData);
                    if (parsedPlanData && parsedPlanData.id) {
                        setPlanData(parsedPlanData);
                    }
                } catch (error) {
                    console.error('Error parsing saved plan data', error);
                }
            }

            if (savedAppliedCredit) {
                try {
                    parsedAppliedCredit = parseFloat(savedAppliedCredit);
                    console.log("Loaded applied credit from localStorage:", parsedAppliedCredit);
                    setAppliedCredit(parsedAppliedCredit);
                } catch (error) {
                    console.error('Error parsing saved applied credit', error);
                }
            }

            if (savedAffiliateInfo) {
                try {
                    parsedAffiliateInfo = JSON.parse(savedAffiliateInfo);
                    console.log("Loaded affiliate info from localStorage:", parsedAffiliateInfo);
                    if (parsedAffiliateInfo && parsedAffiliateInfo.id) {
                        setAffiliateInfo(parsedAffiliateInfo);
                    }
                } catch (error) {
                    console.error('Error parsing saved affiliate info', error);
                }
            }

            if (savedContract) {
                try {
                    parsedContract = JSON.parse(savedContract);
                    console.log("Loaded contract from localStorage:", parsedContract);
                    if (parsedContract) {
                        setContract(parsedContract);
                    }
                } catch (error) {
                    console.error('Error parsing saved contract', error);
                }
            }

            setTimeout(() => {
                // Check payment status
                checkPaymentStatus(orderToken)
                    .then(response => {
                        console.log('Payment status response:', response);
                        if (response.paymentStatus === 'PAID') {
                            setPaymentSuccess(true);
                            setActiveStep(steps.length); // Move to last step

                            // Siin kontrolli, kas kõik vajalikud andmed on olemas
                            // Kasuta parsedPlanData-t kui planData on tühi
                            const currentPlanData = planData.id ? planData : parsedPlanData;
                            const currentAffiliateId = planData.affiliateId || parsedAffiliateInfo?.id;
                            const currentAppliedCredit = appliedCredit || parsedAppliedCredit;
                            const currentContract = contract || parsedContract;
                            setMerchantReference(response.merchantReference);

                            const currentMerchantReference = response.merchantReference || merchantReference;
                            setTimeout(() => {
                                // Kutsu buyPlan ainult siis, kui vajalikud andmed on olemas
                                if (currentPlanData?.id) {
                                    buyPlan(currentPlanData, currentAffiliateId, currentAppliedCredit, currentContract, currentMerchantReference)
                                        .then(response => {
                                            setInvoiceNumber(response.invoiceNumber);

                                            // Pärast edukat ostu kustuta salvestatud andmed
                                            localStorage.removeItem('checkout_planData');
                                            localStorage.removeItem('checkout_affiliateInfo');
                                            localStorage.removeItem('checkout_contract');
                                            localStorage.removeItem('checkout_appliedCredit');
                                        })
                                        .catch(error => {
                                            console.error("Error finalizing plan purchase:", error);
                                        });
                                }
                            }, 3000);


                        } else {
                            setPaymentError('Payment failed or was cancelled');
                        }
                    })
                    .catch(error => {
                        console.error("Error checking payment status:", error);
                        setPaymentError('Error checking payment status');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }, 3000);
        }
    }, [searchParams]);

    // Lae affiliaadi krediidi info
    useEffect(() => {
        if (affiliateInfo?.id) {
            getUserCredit(affiliateInfo.id)
                .then((data) => {
                    if (data && data.credit) {
                        setAffiliateCredit(data.credit);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user credit:", error);
                });
        }
    }, [affiliateInfo?.id]);

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);

            // Salvesta oleku andmed localStorage'i enne makset
            localStorage.setItem('checkout_planData', JSON.stringify(planData));
            localStorage.setItem('checkout_affiliateInfo', JSON.stringify(affiliateInfo));
            localStorage.setItem('checkout_contract', JSON.stringify(contract));
            localStorage.setItem('checkout_appliedCredit', appliedCredit.toString());

            // Calculate final amount
            const finalAmount = Math.max((planData?.price || 0) - appliedCredit, 0);

            if (finalAmount === 0) {
                // If amount is covered by credit, process the order immediately
                const response = await buyPlan(planData, affiliateInfo?.id, appliedCredit, contract);
                setPaymentSuccess(true);
                setActiveStep(activeStep + 1);
            } else {
                // Otherwise create a Montonio payment
                const returnUrl = window.location.href.split('?')[0]; // Remove existing query parameters

                const paymentResponse = await createMontonioPayment(
                    planData,
                    affiliateInfo?.id,
                    appliedCredit,
                    contract,
                    returnUrl,
                    userData,
                );

                if (paymentResponse.is_fully_credited) {
                    // If amount is fully covered by credit (server confirmed)
                    setPaymentSuccess(true);
                    setActiveStep(activeStep + 1);
                } else if (paymentResponse.payment_url) {
                    // Redirect user to Montonio payment page
                    window.location.href = paymentResponse.payment_url;
                    return; // Exit the function as we're redirecting
                } else {
                    throw new Error('Invalid payment response');
                }
            }
        } catch (error) {
            console.error(error);
            setPaymentError('Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            handlePlaceOrder();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    // Arvutame uue kogusumma, millest lahutatakse rakendatud krediit
    const totalPrice = Math.max((planData?.price || 0) - appliedCredit, 0);

    // Debugging info
    console.log('Current state:', {
        planData,
        affiliateInfo,
        contract,
        appliedCredit,
        userData,
    });

    // Lisa laadimise ja vigade käsitlemise renderdus
    if (loading) {
        return (
            <AppTheme {...props}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress/>
                    <Typography variant="h6" sx={{ml: 2}}>Processing payment...</Typography>
                </Box>
            </AppTheme>
        );
    }

    if (paymentError) {
        return (
            <AppTheme {...props}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    p: 3
                }}>
                    <Typography variant="h5" color="error" gutterBottom>Payment Error</Typography>
                    <Typography variant="body1">{paymentError}</Typography>
                    <Button
                        variant="contained"
                        sx={{mt: 3}}
                        onClick={() => {
                            setPaymentError(null);
                            setActiveStep(0);
                        }}
                    >
                        Try Again
                    </Button>
                </Box>
            </AppTheme>
        );
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <Box sx={{position: 'fixed', top: '1rem', right: '1rem'}}>
                <ColorModeIconDropdown/>
            </Box>

            <Grid
                container
                sx={{
                    height: {
                        xs: '100%',
                        sm: 'calc(100dvh - var(--template-frame-height, 0px))',
                    },
                    mt: {
                        xs: 4,
                        sm: 0,
                    },
                }}
            >
                {/* Vasak paneel (desktopil) */}
                <Grid
                    xs={12}
                    sm={5}
                    lg={4}
                    sx={{
                        display: {xs: 'none', md: 'flex'},
                        flexDirection: 'column',
                        backgroundColor: 'background.paper',
                        borderRight: {sm: 'none', md: '1px solid'},
                        borderColor: {sm: 'none', md: 'divider'},
                        alignItems: 'start',
                        pt: 16,
                        px: 10,
                        gap: 4,
                    }}
                >
                    <SitemarkIcon/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: 500,
                        }}
                    >
                        <Info
                            planName={planData?.name || ''}
                            planPrice={planData?.price || 0}
                            appliedCredit={appliedCredit}
                        />
                    </Box>
                </Grid>

                {/* Parem paneel (peamine sisu) */}
                <Grid
                    xs={12}
                    md={7}
                    lg={8}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '100%',
                        width: '100%',
                        backgroundColor: {xs: 'transparent', sm: 'background.default'},
                        alignItems: 'start',
                        pt: {xs: 0, sm: 16},
                        px: {xs: 2, sm: 10},
                        gap: {xs: 4, md: 8},
                    }}
                >
                    {/* Ülemine rida (desktop-stepper) */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: {sm: 'space-between', md: 'flex-end'},
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: {sm: '100%', md: 600},
                        }}
                    >
                        <Box
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexGrow: 1,
                            }}
                        >
                            <Stepper activeStep={activeStep} sx={{width: '100%', height: 40}}>
                                {steps.map((label) => (
                                    <Step key={label} sx={{':first-child': {pl: 0}, ':last-child': {pr: 0}}}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Box>

                    {/* Mobiilne kaart, mis näitab hinda ja InfoMobile komponendi */}
                    <Card sx={{display: {xs: 'flex', md: 'none'}, width: '100%'}}>
                        <CardContent
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected products
                                </Typography>
                                <Typography variant="body1">
                                    {totalPrice}€
                                </Typography>
                            </div>
                            <InfoMobile totalPrice={`${totalPrice}€`}/>
                        </CardContent>
                    </Card>

                    {/* Peamine sisu (stepper, vormid, nupud) */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: {sm: '100%', md: 600},
                            maxHeight: '720px',
                            gap: {xs: 5, md: 'none'},
                        }}
                    >
                        <Stepper activeStep={activeStep} alternativeLabel sx={{display: {sm: 'flex', md: 'none'}}}>
                            {steps.map((label) => (
                                <Step
                                    key={label}
                                    sx={{
                                        ':first-child': {pl: 0},
                                        ':last-child': {pr: 0},
                                        '& .MuiStepConnector-root': {top: {xs: 6, sm: 12}},
                                    }}
                                >
                                    <StepLabel sx={{'.MuiStepLabel-labelContainer': {maxWidth: '70px'}}}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === steps.length ? (
                            <Stack spacing={2}>
                                <Typography variant="h1">📦</Typography>
                                <Typography variant="h5">Thank you for your order!</Typography>
                                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                                    Your order number is <strong>{invoiceNumber}</strong>. We have emailed your order
                                    confirmation and your plan is active.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{alignSelf: 'start', width: {xs: '100%', sm: 'auto'}}}
                                    onClick={() => navigate("/training-diary")}
                                >
                                    Go to my dashboard
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep, planData, affiliateInfo, affiliateCredit, appliedCredit, setAppliedCredit)}
                                {/* Navigeerimisnupud */}
                                <Box
                                    sx={[
                                        {
                                            display: 'flex',
                                            flexDirection: {xs: 'column-reverse', sm: 'row'},
                                            alignItems: 'end',
                                            flexGrow: 1,
                                            gap: 1,
                                            pb: {xs: 12, sm: 0},
                                            mt: {xs: 2, sm: 0},
                                            mb: '60px',
                                        },
                                        activeStep !== 0
                                            ? {justifyContent: 'space-between'}
                                            : {justifyContent: 'flex-end'},
                                    ]}
                                >
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon/>}
                                            onClick={handleBack}
                                            variant="text"
                                            sx={{display: {xs: 'none', sm: 'flex'}}}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {activeStep !== 0 && (
                                        <Button
                                            startIcon={<ChevronLeftRoundedIcon/>}
                                            onClick={handleBack}
                                            variant="outlined"
                                            fullWidth
                                            sx={{display: {xs: 'flex', sm: 'none'}}}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        endIcon={<ChevronRightRoundedIcon/>}
                                        onClick={handleNext}
                                        sx={{width: {xs: '100%', sm: 'fit-content'}}}
                                        disabled={loading}
                                    >
                                        {activeStep === steps.length - 1 ? (
                                            totalPrice === 0 ? 'Complete with Credit' : 'Pay with Montonio'
                                        ) : 'Next'}
                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AppTheme>
    );
}