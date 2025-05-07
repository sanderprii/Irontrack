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

import PaymentForm from '../components/PaymentForm';
import Review from '../components/Review';


import AppTheme from '../shared-theme/AppTheme';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

import {getUserCredit, createMontonioPayment, checkPaymentStatus, handleBuyPlan} from "../api/planApi";
import { acceptContract } from "../api/contractApi";
// Sammude nimed
const steps = ['Payment details', 'Review your order'];

// Funktsioon, mis tagastab sammu sisu ja edastab lisaks krediidi andmed
function getStepContent(step, planData, affiliateInfo, affiliateCredit, appliedCredit, setAppliedCredit, contract, isContractPayment, setTermsAccepted) {
    switch (step) {
        case 0:
            return (
                <PaymentForm
                    affiliateCredit={affiliateCredit}
                    appliedCredit={appliedCredit}
                    setAppliedCredit={setAppliedCredit}
                    planPrice={contract?.isFirstPayment && contract?.firstPaymentAmount ? contract.firstPaymentAmount : (planData?.price || 0)}
                    affiliateInfo={affiliateInfo}
                    onTermsAcceptedChange={setTermsAccepted} // Pass the callback
                />
            );
        case 1:
            return (
                <Review
                    planName={planData?.name || ''}
                    planPrice={planData?.price || 0}
                    appliedCredit={appliedCredit}
                    contract={contract}
                    isContractPayment={isContractPayment}
                    affiliateInfo={affiliateInfo}
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
    const [termsAccepted, setTermsAccepted] = useState(false);

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

        }

        if (affiliate) {
            setAffiliateInfo(affiliate);

        }

        if (contractData) {
            setContract(contractData);

        }

        if (userData) {
            setUserData(userData);

        }
        if (familyMember) {
            setIsFamilyMember(true);

        }

        if (familyMemberId) {
            setFamilyMemberId(familyMemberId);

        }

        if (isContractPmt) {
            setIsContractPayment(true);

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
            // Check payment status (backend now handles buyPlan and acceptContract)
            checkPaymentStatus(orderToken)
                .then(response => {
                    if (response.paymentStatus === 'PAID') {




                        // Suuna kasutaja registreerima
                        navigate('/after-checkout');
                    } else {
                        console.error("Payment failed:", response);
                        setPaymentError('Payment failed or was cancelled');
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error("Error in payment status control:", error);
                    setPaymentError('Error in payment status');
                    setLoading(false);
                });
        }
    }, [searchParams, navigate]);

    // Funktsioon checkout andmete kustutamiseks
    const clearCheckoutData = () => {
        localStorage.removeItem('checkout_planData');
        localStorage.removeItem('checkout_affiliateInfo');
        localStorage.removeItem('checkout_contract');
        localStorage.removeItem('checkout_appliedCredit');
        localStorage.removeItem('checkout_userData');
        localStorage.removeItem('checkout_isContractPayment');
        localStorage.removeItem('checkout_familyMember');
        localStorage.removeItem('checkout_familyMemberId');
        localStorage.removeItem('checkout_token');
        localStorage.removeItem('checkout_role');
        localStorage.removeItem('checkout_pricingPlan');
        localStorage.removeItem('checkout_payment_in_progress');
    };

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

    // Uuendatud handlePlaceOrder ilma buyPlan ja acceptContract käskudeta
    // Inside the Checkout.jsx file, the handlePlaceOrder function needs to be modified

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);

            // Arvuta lõplik summa
            let finalAmount;
            const isContractPmt = isContractPayment || planData?.id === 'contract-payment';

            // Määra õige summa
            if (isContractPmt && contract) {
                if (contract.isFirstPayment && contract.firstPaymentAmount) {
                    finalAmount = Math.max(contract.firstPaymentAmount - appliedCredit, 0);
                } else {
                    finalAmount = Math.max((planData?.price || 0) - appliedCredit, 0);
                }
            } else {
                finalAmount = Math.max((planData?.price || 0) - appliedCredit, 0);
            }

            // Kui kogu summa on kaetud krediidiga, saada info backendile
            if (finalAmount === 0) {
                try {
                    // Genereerime unikaalse merchantReference
                    const creditMerchantReference = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

                    if (isContractPmt && contract) {
                        // Kui on tegemist lepingumaksega ja summa on 0, siis kutsume otse acceptContract
                        try {
                            const contractId = contract.id;
                            const acceptType = "checkbox";
                            const userId = userData?.id;
                            const affiliateId = affiliateInfo?.id;
                            // Leiame contract terms ID - tavaliselt 1, kuid võibolla vaja dünaamiliselt laadida
                            const contractTermsId = 1;

                            // Kutsu acceptContract API
                            const result = await acceptContract(contractId, {
                                userId,
                                affiliateId,
                                acceptType,
                                contractTermsId,
                                contractId,
                                appliedCredit,
                                invoiceNumber: creditMerchantReference,
                            });





                            // Kustutame checkout andmed
                            clearCheckoutData();

                            // Suuname registreerimislehele
                            navigate("/after-checkout");
                        } catch (contractError) {
                            console.error("Error accepting contract:", contractError);
                            setPaymentError('Error accepting contract');
                            setLoading(false);
                        }
                    } else {
                        // Kui pole lepingumakse, siis tavaline planData ost krediidiga
                        const data = {
                            planData: planData,
                            currentAppliedCredit: appliedCredit,
                            contract: contract,
                            currentMerchantReference: creditMerchantReference,
                            currentIsContractPayment: isContractPmt || false,
                            isFamilyMember: isFamilyMember || false,
                            familyMemberId: familyMemberId || null
                        };

                        // Kutsume API funktsiooni välja õigete parameetritega
                        const result = await handleBuyPlan(
                            planData,
                            affiliateInfo.id,
                            appliedCredit,
                            contract,
                            creditMerchantReference,
                            isContractPmt || false,
                            isFamilyMember || false,
                            familyMemberId || null
                        );



                        // Kustutame checkout andmed
                        clearCheckoutData();

                        // Suuname registreerimislehele
                        navigate("/after-checkout");
                    }
                } catch (error) {
                    console.error("Error with credit payment:", error);
                    setPaymentError('Payment with credit failed');
                    setLoading(false);
                }
            } else {
                // Kui on vaja kasutada Montoniot (jätame olemasoleva koodi siia)
                const returnUrl = window.location.href.split('?')[0]; // Eemaldame olemasolevad parameetrid

                // Loo vajalikud andmed vastavalt maksele
                const paymentPrice = isContractPmt && contract?.isFirstPayment && contract?.firstPaymentAmount
                    ? contract.firstPaymentAmount
                    : planData?.price;

                // Uuenda planData hinda kui tegemist on esimese lepingumaksega
                const adjustedPlanData = {...planData};
                if (isContractPmt && contract?.isFirstPayment && contract?.firstPaymentAmount) {
                    adjustedPlanData.price = contract.firstPaymentAmount;
                }

                const { id, fullName, email } = userData;
                const userDataForApi = { id, fullName, email };
                // Loo Montonio makse
                const paymentResponse = await createMontonioPayment(
                    adjustedPlanData,
                    affiliateInfo?.id,
                    appliedCredit,
                    contract,
                    returnUrl,
                    userDataForApi,
                    isFamilyMember,
                    familyMemberId,

                );



                if (paymentResponse.payment_url) {
                    // Viivitus, et andmed jõuaksid salvestuda
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // Suuna kasutaja maksele
                    window.location.href = paymentResponse.payment_url;

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    navigate('/after-checkout');
                } else {
                    throw new Error('Error payment response');
                }
            }
        } catch (error) {
            console.error(error);
            setPaymentError('Payment failed');
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
                    <Typography variant="h6" sx={{ml: 2}}>Töötleme makset...</Typography>
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
                    <Typography variant="h5" color="error" gutterBottom>Makse viga</Typography>
                    <Typography variant="body1">{paymentError}</Typography>
                    <Button
                        variant="contained"
                        sx={{mt: 3}}
                        onClick={() => {
                            setPaymentError(null);
                            setActiveStep(0);
                        }}
                    >
                        Proovi uuesti
                    </Button>
                </Box>
            </AppTheme>
        );
    }

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme/>
            <Box sx={{position: 'fixed', top: '0rem', right: '1rem'}}>
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
                        xs: 0,
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
                            firstPaymentPrice={contract?.firstPaymentAmount ? `${contract.firstPaymentAmount}€` : undefined}
                            isFirstPayment={!!contract?.isFirstPayment}
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



                    {/* Peamine sisu (stepper, vormid, nupud) */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            maxWidth: {sm: '100%', md: 600},
                            maxHeight: '720px',
                            gap: {xs: 1, md: 'none'},
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
                                <Typography variant="h5">Aitäh tellimuse eest!</Typography>
                                <Typography variant="body1" sx={{color: 'text.secondary'}}>
                                    Sinu makse on töötlemisel. Kohe suunatakse sind registreerimislehele.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{alignSelf: 'start', width: {xs: '100%', sm: 'auto'}}}
                                    onClick={() => navigate("/register-training")}
                                >
                                    Mine registreerima
                                </Button>
                            </Stack>
                        ) : (
                            <React.Fragment>
                                {getStepContent(
                                    activeStep,
                                    planData,
                                    affiliateInfo,
                                    affiliateCredit,
                                    appliedCredit,
                                    setAppliedCredit,
                                    contract,
                                    isContractPayment || planData?.id === 'contract-payment',
                                    setTermsAccepted
                                )}
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
                                        disabled={loading || (activeStep === 0 && !termsAccepted)}
                                    >
                                        {activeStep === steps.length - 1 ? (
                                            totalPrice === 0 ? 'Pay with credit' : 'Pay with Bank'
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