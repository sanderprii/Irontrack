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
import Info from '../components/Info';
import InfoMobile from '../components/InfoMobile';
import PaymentForm from '../components/PaymentForm';
import Review from '../components/Review';
import SitemarkIcon from '../components/SitemarkIcon';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

import {buyPlan, getUserCredit, createMontonioPayment, checkPaymentStatus} from "../api/planApi";
import {acceptContract} from "../api/contractApi";

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
    const [isContractPayment, setIsContractPayment] = useState(false);
    const [isFamilyMember, setIsFamilyMember] = useState(false);
    const [familyMemberId, setFamilyMemberId] = useState(null);

    // Lae andmed localStorage'ist esimesel renderil
    useEffect(() => {
        // Proovi kõigepealt saada andmed location.state'ist
        const plan = location.state?.plan;
        const affiliate = location.state?.affiliate;
        const contractData = location.state?.contract;
        const userData = location.state?.userData;
        const isContractPmt = location.state?.isContractPayment;
        const familyMember = location.state?.familyMember;
        const familyMemberId = location.state?.familyMemberId;

        if (plan) {
            setPlanData(plan);
            // Kontrollime, kas tegemist on lepingumaksega
            if (plan.id === 'contract-payment') {
                setIsContractPayment(true);
            }
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
            localStorage.setItem('checkout_userData', JSON.stringify(userData));
        }
        if (familyMember) {
            setIsFamilyMember(true);
            localStorage.setItem('checkout_familyMember', JSON.stringify(familyMember));
        }

        if (familyMemberId) {
            setFamilyMemberId(familyMemberId);
            localStorage.setItem('checkout_familyMemberId', JSON.stringify(familyMemberId));
        }

        if (isContractPmt) {
            setIsContractPayment(true);
            localStorage.setItem('checkout_isContractPayment', 'true');
        }

        // Kui location.state pole saadaval, proovi localStorage'ist
        if (!plan) {
            const savedPlanData = localStorage.getItem('checkout_planData');
            if (savedPlanData) {
                try {
                    const parsedPlanData = JSON.parse(savedPlanData);
                    setPlanData(parsedPlanData);
                    // Kontrollime, kas tegemist on lepingumaksega
                    if (parsedPlanData.id === 'contract-payment') {
                        setIsContractPayment(true);
                    }
                } catch (error) {
                    console.error('Error parsing saved plan data', error);
                }
            }
        }

        // Laadi ülejäänud andmed localStorage'ist
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

        if (!userData) {
            const savedUserData = localStorage.getItem('checkout_userData');
            if (savedUserData) {
                try {
                    const parsedUserData = JSON.parse(savedUserData);
                    setUserData(parsedUserData);
                } catch (error) {
                    console.error('Error parsing saved user data', error);
                }
            }
        }

        if (!familyMember) {
            const savedFamilyMember = localStorage.getItem('checkout_familyMember');
            if (savedFamilyMember) {
                try {
                    const parsedFamilyMember = JSON.parse(savedFamilyMember);
                    setIsFamilyMember(parsedFamilyMember);
                } catch (error) {
                    console.error('Error parsing saved family member', error);
                }
            }
        }

        if (!familyMemberId) {
            const savedFamilyMemberId = localStorage.getItem('checkout_familyMemberId');
            if (savedFamilyMemberId) {
                try {
                    const parsedFamilyMemberId = JSON.parse(savedFamilyMemberId);
                    setFamilyMemberId(parsedFamilyMemberId);
                } catch (error) {
                    console.error('Error parsing saved family member ID', error);
                }
            }
        }

        if (!isContractPmt) {
            const savedIsContractPayment = localStorage.getItem('checkout_isContractPayment');
            if (savedIsContractPayment === 'true') {
                setIsContractPayment(true);
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

            // Laadi andmed localStorage'ist
            const savedPlanData = localStorage.getItem('checkout_planData');
            const savedAppliedCredit = localStorage.getItem('checkout_appliedCredit');
            const savedAffiliateInfo = localStorage.getItem('checkout_affiliateInfo');
            const savedContract = localStorage.getItem('checkout_contract');
            const savedUserData = localStorage.getItem('checkout_userData');
            const savedIsContractPayment = localStorage.getItem('checkout_isContractPayment') === 'true';
            const savedFamilyMember = localStorage.getItem('checkout_familyMember');
            const savedFamilyMemberId = localStorage.getItem('checkout_familyMemberId');


            let parsedPlanData = null;
            let parsedAppliedCredit = 0;
            let parsedAffiliateInfo = null;
            let parsedContract = null;
            let parsedUserData = null;
            let parsedIsContractPayment = false;
            let parsedFamilyMember = null;
            let parsedFamilyMemberId = null;

            // Parse saved data
            if (savedPlanData) {
                try {
                    parsedPlanData = JSON.parse(savedPlanData);

                    if (parsedPlanData) {
                        setPlanData(parsedPlanData);
                        if (parsedPlanData.id === 'contract-payment') {
                            setIsContractPayment(true);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing saved plan data', error);
                }
            }

            if (savedAppliedCredit) {
                try {
                    parsedAppliedCredit = parseFloat(savedAppliedCredit);
                    setAppliedCredit(parsedAppliedCredit);
                } catch (error) {
                    console.error('Error parsing saved applied credit', error);
                }
            }

            if (savedAffiliateInfo) {
                try {
                    parsedAffiliateInfo = JSON.parse(savedAffiliateInfo);
                    if (parsedAffiliateInfo) {
                        setAffiliateInfo(parsedAffiliateInfo);
                    }
                } catch (error) {
                    console.error('Error parsing saved affiliate info', error);
                }
            }

            if (savedContract) {
                try {
                    parsedContract = JSON.parse(savedContract);
                    if (parsedContract) {
                        setContract(parsedContract);
                    }
                } catch (error) {
                    console.error('Error parsing saved contract', error);
                }
            }

            if (savedUserData) {
                try {
                    parsedUserData = JSON.parse(savedUserData);
                    if (parsedUserData) {
                        setUserData(parsedUserData);
                    }
                } catch (error) {
                    console.error('Error parsing saved user data', error);
                }
            }

            if (savedFamilyMember) {
                try {
                    parsedFamilyMember = JSON.parse(savedFamilyMember);
                    if (parsedFamilyMember) {
                        setIsFamilyMember(parsedFamilyMember);
                    }
                } catch (error) {
                    console.error('Error parsing saved family member', error);
                }
            }

            if (savedFamilyMemberId) {
                try {
                    parsedFamilyMemberId = JSON.parse(savedFamilyMemberId);
                    if (parsedFamilyMemberId) {
                        setFamilyMemberId(parsedFamilyMemberId);
                    }
                } catch (error) {
                    console.error('Error parsing saved family member ID', error);
                }
            }

            setTimeout(() => {
                // Check payment status
                checkPaymentStatus(orderToken)
                    .then(response => {

                        if (response.paymentStatus === 'PAID') {
                            setPaymentSuccess(true);
                            setActiveStep(steps.length); // Move to last step
                            setMerchantReference(response.merchantReference);

                            // Määra vajalikud muutujad
                            const currentPlanData = planData.id ? planData : parsedPlanData;
                            const currentAffiliateId = planData.affiliateId || parsedAffiliateInfo?.id;
                            const currentAppliedCredit = appliedCredit || parsedAppliedCredit;
                            const currentContract = contract || parsedContract;
                            const currentUserData = userData || parsedUserData;
                            const currentIsContractPayment = isContractPayment || savedIsContractPayment || (currentPlanData?.id === 'contract-payment');
                            const currentMerchantReference = response.merchantReference || merchantReference;
                            const currentFamilyMember = isFamilyMember || parsedFamilyMember;
                            const currentFamilyMemberId = familyMemberId || parsedFamilyMemberId;

                            setTimeout(() => {
                                // Kui tegemist on lepingumaksega
                                if (currentIsContractPayment && currentContract?.id) {


                                    // Aktsepteeri leping ilma buyPlan-i kutsumata
                                    acceptContract(currentContract.id, {
                                        userId: currentUserData.id,
                                        affiliateId: currentAffiliateId,
                                        acceptType: 'checkout',
                                        contractTermsId: 1, // Vaikimisi 1
                                        paymentCompleted: true
                                    })
                                        .then(() => {

                                            setInvoiceNumber(currentMerchantReference || "N/A");
                                        })
                                        .catch(error => {
                                            console.error("Error accepting contract after payment:", error);
                                            setPaymentError("Payment was successful but contract could not be accepted. Please contact support.");
                                        })
                                        .finally(() => {
                                            // Kustuta localStorage andmed
                                            localStorage.removeItem('checkout_planData');
                                            localStorage.removeItem('checkout_affiliateInfo');
                                            localStorage.removeItem('checkout_contract');
                                            localStorage.removeItem('checkout_appliedCredit');
                                            localStorage.removeItem('checkout_userData');
                                            localStorage.removeItem('checkout_isContractPayment');
                                            localStorage.removeItem('checkout_familyMember');
                                            localStorage.removeItem('checkout_familyMemberId');
                                        });
                                }
                                // Kui tegemist ei ole lepingumaksega, siis tee tavaline buyPlan
                                else if (currentPlanData?.id && currentPlanData?.id !== 'contract-payment') {
                                    console.log("familyMemberId", currentFamilyMemberId);
                                    console.log("currentFamilyMember", currentFamilyMember);
                                    buyPlan(currentPlanData, currentAffiliateId, currentAppliedCredit, currentContract, currentMerchantReference, currentIsContractPayment, currentFamilyMember, currentFamilyMemberId)
                                        .then(response => {
                                            setInvoiceNumber(response.invoiceNumber);

                                            // Kustuta localStorage andmed
                                            localStorage.removeItem('checkout_planData');
                                            localStorage.removeItem('checkout_affiliateInfo');
                                            localStorage.removeItem('checkout_contract');
                                            localStorage.removeItem('checkout_appliedCredit');
                                            localStorage.removeItem('checkout_userData');
                                            localStorage.removeItem('checkout_isContractPayment');
                                            localStorage.removeItem('checkout_familyMember');
                                            localStorage.removeItem('checkout_familyMemberId');

                                        })
                                        .catch(error => {
                                            console.error("Error finalizing plan purchase:", error);
                                            setPaymentError("Payment was successful but plan purchase could not be completed. Please contact support.");
                                        });
                                } else {
                                    console.warn("No valid plan or contract data found after payment.");
                                    setPaymentError("Payment was successful but we couldn't process your order. Please contact support.");
                                }
                            }, 1000);
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
            }, 2000);
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
            if (userData) {
                localStorage.setItem('checkout_userData', JSON.stringify(userData));
            }
            if (isContractPayment || planData?.id === 'contract-payment') {
                localStorage.setItem('checkout_isContractPayment', 'true');
            }

            // Arvuta lõplik summa
            const finalAmount = Math.max((planData?.price || 0) - appliedCredit, 0);
            const isContractPmt = isContractPayment || planData?.id === 'contract-payment';

            // Kui kogu summa on kaetud krediidiga
            if (finalAmount === 0) {
                if (isContractPmt && contract?.id) {
                    // Lepingumakse puhul kutsu ainult acceptContract
                    await acceptContract(contract.id, {
                        userId: userData.id,
                        affiliateId: affiliateInfo?.id,
                        acceptType: 'checkout',
                        contractTermsId: 1,
                        paymentCompleted: true,

                    });

                    setPaymentSuccess(true);
                    setActiveStep(activeStep + 1);
                    setInvoiceNumber("Credit-" + new Date().getTime());
                } else {
                    // Tavalise paketi ostu puhul kutsu buyPlan
                    console.log("familyMemberId", familyMemberId);
                    console.log("isFamilyMember", isFamilyMember);
                    const response = await buyPlan(planData, affiliateInfo?.id, appliedCredit, contract, null, null, isFamilyMember, familyMemberId);
                    setPaymentSuccess(true);
                    setActiveStep(activeStep + 1);
                    setInvoiceNumber(response.invoiceNumber);
                    localStorage.removeItem('checkout_planData');
                    localStorage.removeItem('checkout_affiliateInfo');
                    localStorage.removeItem('checkout_contract');
                    localStorage.removeItem('checkout_appliedCredit');
                    localStorage.removeItem('checkout_userData');
                    localStorage.removeItem('checkout_isContractPayment');
                    localStorage.removeItem('checkout_familyMember');
                    localStorage.removeItem('checkout_familyMemberId');
                }
            } else {
                // Kui maksta on vaja Montonio kaudu
                const returnUrl = window.location.href.split('?')[0]; // Remove existing query parameters

                // Loo Montonio makse
                const paymentResponse = await createMontonioPayment(
                    planData,
                    affiliateInfo?.id,
                    appliedCredit,
                    contract,
                    returnUrl,
                    userData,
                );

                if (paymentResponse.payment_url) {
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
                                    Your order number is <strong>{invoiceNumber}</strong>.
                                    {isContractPayment || planData?.id === 'contract-payment'
                                        ? " Your contract has been accepted and is now active."
                                        : " We have emailed your order confirmation and your plan is active."}
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