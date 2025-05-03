// paymentController.js
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const {PrismaClient} = require('@prisma/client');
const {sendOrderConfirmation} = require("../utils/emailService");
const prisma = new PrismaClient();

const contractController = require('./contractController');
const {buyPlan} = require('./planController');

const NOTIFICATION_URL = process.env.NOTIFICATION_URL;

// Environment variables

const MERCHANT_NAME = process.env.MERCHANT_NAME;
const API_URL = process.env.API_URL;
const MONTONIO_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://stargate.montonio.com/api'
    : 'https://sandbox-stargate.montonio.com/api';

/**
 * Create a Montonio payment
 */

let affiliateSecretKey = '';
let affiliateAccessKey = '';
const createMontonioPayment = async (req, res) => {
    try {
        // Extract and validate payment data
        const {
            amount,
            orderId,
            description,
            userData,
            affiliateId,
            appliedCredit,
            contractId,
            planData,
            isFamilyMember,
            familyMemberId,
            sessionToken,
        } = req.body;
        const userEmail = userData?.email || '';
        const userPhone = userData?.phone || '';
        const userFullName = userData?.fullName || '';
        console.log("createMontonioPayment", req.body)
        // Ensure amount is a valid number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0.01) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a valid number greater than or equal to 0.01"
            });
        }

        const getSessionData = await prisma.session.findFirst({
            where: {
                userId: userData.id

            }
        })

        if (getSessionData) {
            await prisma.session.update({
                where: {
                    id: getSessionData.id
                },
                data: {
                    sessionId: sessionToken,
                    createdAt: new Date(),
                    expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
                }
            })
        } else {
            await prisma.session.create({
                data: {
                    userId: userData.id,
                    sessionId: sessionToken,
                    createdAt: new Date(),
                    expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365)
                }
            })
        }

        // Ensure orderId is provided
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        if (!affiliateId) {
            return res.status(400).json({
                success: false,
                message: "AffiliateId is required"
            });
        }

        const parsedAffiliateId = parseInt(affiliateId);
        if (isNaN(parsedAffiliateId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid affiliateId format - must be a number"
            });
        }

        const affiliateApiKeys = await prisma.affiliateApiKeys.findFirst({
            where: {
                affiliateId: parsedAffiliateId
            }
        });

        if (!affiliateApiKeys) {
            console.error(`API keys not found for affiliate ID ${parsedAffiliateId}`);
            return res.status(404).json({
                success: false,
                message: "Payment configuration not found for this affiliate"
            });
        }

        affiliateAccessKey = affiliateApiKeys.accessKey;
        affiliateSecretKey = affiliateApiKeys.secretKey;

        // Format amount to have exactly 2 decimal places
        const formattedAmount = parsedAmount.toFixed(2);

        // Create a fully qualified notification URL
        const notificationUrl = `${NOTIFICATION_URL}/api/payments/montonio-webhook`;

        // Loome unique merchantReference, mis sisaldab ka lepingu ID-d kui see on olemas
        const merchantReference = contractId
            ? `contract-${contractId}-${new Date().getTime()}`
            : new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

        // Create the payment data object
        const paymentData = {
            accessKey: affiliateAccessKey,
            merchantReference: merchantReference,
            returnUrl: `${process.env.FRONTEND_URL}/checkout`,
            notificationUrl: notificationUrl,
            currency: "EUR",
            grandTotal: parseFloat(formattedAmount),
            locale: "en",

            // Optional billing info if available
            billingAddress: {
                email: userEmail,
                phoneNumber: userPhone,
                firstName: userFullName,
            },

            lineItems: [
                {
                    name: description || `Plan purchase: ${MERCHANT_NAME}`,
                    quantity: 1,
                    finalPrice: parseFloat(formattedAmount),
                }
            ],

            // Payment method details
            payment: {
                method: "paymentInitiation",
                methodDisplay: "Make a bank payment",
                methodOptions: {
                    paymentDescription: description || `Plan purchase: ${MERCHANT_NAME}`,
                    preferredCountry: "EE",
                    preferredLocale: "en"
                },
                amount: parseFloat(formattedAmount),
                currency: "EUR"
            },

            // JWT expiration - 10 minutes from now
            exp: Math.floor(Date.now() / 1000) + 10 * 60
        };

        // Generate JWT token
        const token = jwt.sign(
            paymentData,
            affiliateSecretKey,
            {algorithm: 'HS256'}
        );

        // Send request to Montonio
        const response = await axios.post(`${MONTONIO_API_URL}/orders`, {
            data: token
        });


        // Kui tegemist on lepingumaksega (contractId on olemas), siis loome paymentMetadata kirje
        if (contractId) {
            try {
                // Loome transaktsiooni kirje
                const transaction = await prisma.transactions.create({
                    data: {
                        userId: userData.id,
                        affiliateId: parsedAffiliateId,
                        amount: parseFloat(formattedAmount) + (appliedCredit || 0),
                        invoiceNumber: merchantReference,
                        description: `Contract payment: ${description || 'Contract Payment'}`,
                        type: 'Montonio',
                        status: 'pending',
                        creditAmount: appliedCredit,
                        contractId: parseInt(contractId),

                    }
                });


                // Salvestame payment metadata
                await prisma.paymentMetadata.create({
                    data: {
                        transactionId: transaction.id,
                        montonioUuid: response.data.uuid,
                        contractId: parseInt(contractId),
                        affiliateId: parsedAffiliateId,
                        isPaymentHoliday: false,
                    }
                });


            } catch (dbError) {
                console.error("Error creating payment metadata:", dbError);
                // Isegi kui metadata kirjutamine ebaõnnestub, laseme maksel jätkuda
            }
        } else {
            // Kui tegemist ei ole lepingumaksega, siis loome lihtsalt transaktsiooni
            try {

                const finalAmount = parseFloat(formattedAmount) + (appliedCredit || 0);

                await prisma.transactions.create({
                    data: {
                        userId: userData.id,
                        affiliateId: parsedAffiliateId,
                        amount: finalAmount,
                        invoiceNumber: merchantReference,
                        description: `Plan purchase: ${planData.name || 'Plan Purchase'}`,
                        type: 'plan',
                        status: 'pending',
                        planId: planData.id,
                        isFamilyMember: isFamilyMember,
                        familyMemberId: familyMemberId,
                        creditAmount: appliedCredit,

                    }
                });
            } catch (dbError) {
                console.error("Error creating transaction:", dbError);
                return res.status(500).json({
                    success: false,
                    message: "Transaction creation failed",
                    error: dbError.message
                });
            }
        }

        // Return payment URL to redirect the customer
        return res.status(200).json({
            success: true,
            paymentUrl: response.data.paymentUrl,
            orderUuid: response.data.uuid
        });

    } catch (error) {
        console.error("Error creating Montonio payment:", error);

        // Log detailed error information
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }

        return res.status(500).json({
            success: false,
            message: "Payment creation failed",
            error: error.message
        });
    }
};

/**
 * Handle Montonio webhook notifications
 */
// Part of paymentController.js - Handling payment holidays in webhook
// Part of paymentController.js - Updated to handle first payments
const handleMontonioWebhook = async (req, res) => {

    try {
        const {orderToken} = req.body;

        if (!orderToken) {
            console.log('No order token provided');
            return res.status(200).json({success: false, message: 'No order token provided'});
        }

        // Proovi kõigepealt dekodeerida ilma kinnitamiseta, et saada uuid
        let decodedToken;
        try {
            decodedToken = jwt.decode(orderToken);

            if (!decodedToken || !decodedToken.paymentLinkUuid) {
                console.log('Invalid token format or missing UUID');
                return res.status(200).json({success: false, message: 'Invalid token format'});
            }

            // Kasuta uuid-d
            const orderUuid = decodedToken.paymentLinkUuid;
            console.log(`Processing webhook for order UUID: ${orderUuid}`);

            // Lepingu maksete jaoks otsime paymentMetadata
            const paymentMetadata = await prisma.paymentMetadata.findFirst({
                where: {montonioUuid: orderUuid}
            });

            // Kui metadata puudub, ei pruugi see olla leping vaid tavalise paketi ost
            if (!paymentMetadata) {
                console.log(`No payment metadata found for UUID ${orderUuid}, processing as regular payment`);

                // Leia AffiliateApiKeys, kui võimalik
                // Vajalik token verifitseerimiseks
                const apiKeys = await prisma.affiliateApiKeys.findFirst();
                if (apiKeys) {
                    affiliateSecretKey = apiKeys.secretKey;
                    affiliateAccessKey = apiKeys.accessKey;
                } else {
                    console.log('No affiliate API keys found, cannot verify token');
                    return res.status(200).json({success: false, message: 'Cannot verify payment without API keys'});
                }

                try {
                    // Verifitseeri token
                    decodedToken = jwt.verify(orderToken, affiliateSecretKey);

                    // Töötleme tavalise makse, mille andmeid ei olegi paymentMetadata tabelis
                    const {paymentStatus, merchantReference} = decodedToken;
                    console.log(`Regular payment status: ${paymentStatus}, reference: ${merchantReference}`);

                    // Vastame edukalt - checkout.js hoolitseb tegeliku ostu eest
                    return res.status(200).json({
                        success: true,
                        message: `Successfully processed regular payment webhook`
                    });
                } catch (verifyError) {
                    console.error('Error verifying token:', verifyError);
                    return res.status(200).json({success: false, message: 'Error verifying token'});
                }
            }

            // Kui leidsime metadata, töötleme lepingumakse
            const {transactionId, contractId, affiliateId, isPaymentHoliday} = paymentMetadata;

            // Leia API võtmed affiliateId järgi
            const apiKeys = await prisma.affiliateApiKeys.findFirst({
                where: {affiliateId: affiliateId}
            });

            if (!apiKeys) {
                console.error(`API keys not found for affiliate ${affiliateId}`);
                return res.status(200).json({success: false, message: 'API keys not found'});
            }

            // Seadista globaalsed muutujad
            affiliateSecretKey = apiKeys.secretKey;
            affiliateAccessKey = apiKeys.accessKey;

            // Verifitseeri token kasutades leitud võtit
            try {
                decodedToken = jwt.verify(orderToken, affiliateSecretKey);
            } catch (verifyError) {
                console.error('Error verifying token with affiliate key:', verifyError);
                return res.status(200).json({success: false, message: 'Error verifying token with affiliate key'});
            }

            // Extract order information
            const {
                paymentStatus,
                merchantReference,
                grandTotal,
                currency
            } = decodedToken;

            // Uuenda vastavalt makse staatusele
            if (paymentStatus === 'PAID') {
                // 1. Uuenda tehingu olek
                try {
                    await prisma.transactions.update({
                        where: {id: transactionId},
                        data: {status: 'success'}
                    });

                } catch (updateError) {
                    console.error(`Error updating transaction: ${updateError.message}`);
                }


                // 2. Kui EI OLE payment holiday, siis uuenda userPlan
                // Leia lepinguga seotud leping ja kasutaja plaan
                const contract = await prisma.contract.findUnique({
                    where: {id: contractId},
                    include: {
                        userPlan: true
                    }
                });

                if (!contract) {
                    console.error(`Contract not found with ID ${contractId}`);
                    return res.status(200).json({success: true, message: 'Payment processed but contract not found'});
                }

                // UUENDATUD LOOGIKA: Käsitle isFirstPayment loogika
                if (contract.isFirstPayment) {
                    console.log(`Processing first payment for contract ${contractId}`);

                    const userPlan = contract.userPlan[0];

                    if (userPlan) {
                        // Arvuta lõppkuupäev, mis joondub paymentDay-ga
                        let endDate;
                        const startDate = new Date(contract.startDate || new Date());
                        const paymentDay = contract.paymentDay || 1;

                        // Leia järgmine makse kuupäev
                        const nextPaymentDate = new Date(startDate);

                        // Kui alguskuupäeva päev on suurem kui makse päev, siis järgmine makse on järgmisel kuul
                        if (startDate.getDate() > paymentDay) {
                            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                        }

                        // Määra päev
                        nextPaymentDate.setDate(paymentDay);

                        // Kui järgmine makse on vähem kui 10 päeva pärast, siis userPlan endDate on ülejärgmisel kuul
                        const daysDiff = Math.round((nextPaymentDate - startDate) / (1000 * 60 * 60 * 24));

                        if (daysDiff < 10) {
                            // Kui esimene makse katab järgmise kuu, liigume veel ühe kuu edasi
                            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                        }

                        // Uuenda kasutaja plaani
                        await prisma.userPlan.update({
                            where: {id: userPlan.id},
                            data: {
                                endDate: nextPaymentDate
                            }
                        });

                        // Märgi leping, et esimene makse on tehtud
                        await prisma.contract.update({
                            where: {id: contractId},
                            data: {
                                isFirstPayment: false
                            }
                        });

                        console.log(`Updated contract ${contractId} and userPlan ${userPlan.id} - first payment complete`);
                    } else {
                        console.error(`No UserPlan found for contract ${contractId} during first payment`);
                    }
                } else {
                    // Tavaline korduvmakse loogika
                    const userPlan = await prisma.userPlan.findFirst({
                        where: {contractId: contractId}
                    });

                    if (userPlan) {
                        // Arvuta uus lõppkuupäev (lisa üks kuu)
                        let newEndDate = new Date(userPlan.endDate);
                        newEndDate.setMonth(newEndDate.getMonth() + 1);

                        // Uuenda kasutaja plaani kehtivust
                        await prisma.userPlan.update({
                            where: {id: userPlan.id},
                            data: {endDate: newEndDate}
                        });

                        if (isPaymentHoliday) {
                            await prisma.userPlan.update({
                                where: {id: userPlan.id},
                                data: {paymentHoliday: true}
                            });
                        } else {
                            await prisma.userPlan.update({
                                where: {id: userPlan.id},
                                data: {paymentHoliday: false}
                            });
                        }

                        // Send email for regular contract payment
                        try {

                            const transactionData = await prisma.transactions.findUnique({
                                where: {id: transactionId}
                            });

                            // Get user data
                            const user = await prisma.user.findUnique({
                                where: {id: contract.userId}
                            });

                            // Get affiliate data
                            const affiliate = await prisma.affiliate.findUnique({
                                where: {id: contract.affiliateId}
                            });

                            // Create plan details for regular payment
                            const planDetails = {
                                name: `${contract.contractType}`,
                                price: contract.paymentAmount
                            };

                            // Build description based on payment holiday
                            const paymentDescription = isPaymentHoliday
                                ? "Payment Holiday Fee"
                                : `Regular contract payment for ${contract.contractType || 'Membership'}`;

                            // Send confirmation email
                            await sendOrderConfirmation(
                                user,
                                {
                                    invoiceNumber: transactionData.invoiceNumber,
                                    amount: contract.paymentAmount || grandTotal,
                                    appliedCredit: 0,
                                    isContractPayment: true,
                                    description: paymentDescription,
                                    affiliateName: affiliate.name
                                },
                                planDetails,
                                affiliate
                            );
                            console.log(`Regular contract payment confirmation email sent to ${user.email}`);
                        } catch (emailError) {
                            console.error("Failed to send regular payment confirmation email:", emailError);
                        }

                    } else {
                        console.error(`UserPlan not found for contract ${contractId}`);
                    }
                }
            } else if (paymentStatus === 'VOIDED' || paymentStatus === 'ABANDONED') {
                console.log(`Marking transaction ${transactionId} as cancelled`);

                // Märgi tehing tühistatuks
                try {
                    await prisma.transactions.update({
                        where: {id: transactionId},
                        data: {status: 'cancelled'}
                    });
                    console.log(`Updated transaction ${transactionId} status to cancelled`);
                } catch (updateError) {
                    console.error(`Error updating transaction: ${updateError.message}`);
                }
            }

        } catch (error) {
            console.error('Error processing webhook token:', error);
            // Always return 200 to prevent Montonio from retrying
            return res.status(200).json({success: false, message: 'Error processing token'});
        }

        // Always respond with 200 OK to acknowledge receipt of the webhook
        return res.status(200).json({
            success: true,
            message: `Successfully processed webhook`
        });
    } catch (error) {
        console.error('Error processing Montonio webhook:', error);
        // Still return a 200 status to prevent Montonio from retrying
        return res.status(200).json({
            success: false,
            message: 'Error processing webhook but acknowledged',
            error: error.message
        });
    }
};
/**
 * Handle return from Montonio payment page
 */
const handlePaymentReturn = async (req, res) => {
    try {
        const {'order-token': orderToken} = req.query;

        if (!orderToken) {
            return res.status(400).json({success: false, message: 'No order token provided'});
        }

        // Verify the token
        const decodedToken = jwt.verify(orderToken, affiliateSecretKey);

        // Extract and validate payment information
        const {paymentStatus, merchantReference, uuid} = decodedToken;

        // Extract the orderId from the merchantReference
        const orderIdMatch = merchantReference.match(/order-(\d+)-\d+/);
        const orderId = orderIdMatch ? orderIdMatch[1] : null;

        if (!orderId) {
            return res.status(400).json({success: false, message: 'Invalid merchant reference format'});
        }

        // Return the payment status and order information
        return res.status(200).json({
            success: true,
            paymentStatus,
            orderId,
            montonioOrderId: uuid
        });

    } catch (error) {
        console.error('Error handling payment return:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing payment return',
            error: error.message
        });
    }
};

const checkPaymentStatus = async (req, res) => {
    const {token} = req.query;

    try {
        // Verify token with your secret key
        const decoded = jwt.verify(token, affiliateSecretKey);

        // First update the database - using updateMany instead of update
        await prisma.transactions.updateMany({
            where: {
                invoiceNumber: decoded.merchantReference
            },
            data: {
                status: 'success'
            }

        });

        const transaction = await prisma.transactions.findFirst({
            where: {invoiceNumber: decoded.merchantReference},
        });


        if (transaction.planId > 0) {
            const selectedPlan = await prisma.plan.findUnique({
                where: {
                    id: transaction.planId
                }
            });

            console.log("transaction", transaction)
            const planData = selectedPlan
            const userId = parseInt(transaction.userId)
            const affiliateId = transaction.affiliateId;
            const currentAppliedCredit = transaction.creditAmount;
            const contract = null;

            const isFamilyMember = transaction.isFamilyMember;
            const familyMemberId = transaction.familyMemberId
            let merchantReference = decoded.merchantReference;

            try {
                const result = await buyPlan(
                    planData,
                    currentAppliedCredit,
                    affiliateId,
                    userId,
                    contract,
                    isFamilyMember,
                    familyMemberId,
                    merchantReference
                );
                console.log("Plan purchase successful:", result);
            } catch (error) {
                console.error("Failed to buy plan:", error.message);
            }


        } else if (transaction.contractId > 0) {
            const contract = await prisma.contract.findUnique({
                where: {
                    id: transaction.contractId
                }
            });

            if (contract) {
                await prisma.contract.update({
                    where: {
                        id: contract.id
                    },
                    data: {
                        isFirstPayment: false,
                        status: 'accepted',
                        acceptedAt: new Date(),
                    }
                });

                const contractId = contract.id;
                const acceptType = "checkbox";
                const userId = parseInt(transaction.userId);
                const affiliateId = transaction.affiliateId;
                const contractTermsId = 1;

                try {
                    contractController.acceptContractInternal(
                        contractId,
                        userId,
                        affiliateId,
                        contractTermsId,
                        acceptType
                    );
                    console.log("Contract accepted successfully", userId);
                } catch (error) {
                    console.error("Failed to accept contract:", error.message);
                }

            }


        }

        const sessionToken = await prisma.session.findFirst({
            where: {
                userId: parseInt(transaction.userId)
            }
        });
console.log("sessionToken", sessionToken);
        // Only send response after database operation completes
        res.json({
            success: true,
            paymentStatus: decoded.paymentStatus,
            merchantReference: decoded.merchantReference,
            sessionToken: sessionToken.sessionId
            // Add any other fields you need
        });
    } catch (error) {
        // This catches errors from both JWT verification and database operations
        res.status(400).json({
            success: false,
            message: 'Invalid token or database error',
            error: error.message
        });
    }
};


module.exports = {
    createMontonioPayment,
    handleMontonioWebhook,
    handlePaymentReturn,
    checkPaymentStatus
};