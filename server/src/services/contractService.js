const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { sendMessage } = require('../utils/emailService');

const prisma = new PrismaClient();

const NOTIFICATION_URL = process.env.NOTIFICATION_URL || 'https://api.irontrack.ee';

const MONTONIO_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://stargate.montonio.com/api'
    : 'https://sandbox-stargate.montonio.com/api';

async function processContractPayments() {
    try {
        const today = new Date();





        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const targetPaymentDay = futureDate.getDate();

        const currentMonth = futureDate.toLocaleString('en-US', { month: 'long' }); // Get current month as string (January, February, etc.)


        // Otsi lepingud, millel on maksepäev täna ja lõpptähtaeg tulevikus
        const activeContracts = await prisma.contract.findMany({
            where: {
                active: true,
                paymentDay: targetPaymentDay,
                validUntil: {
                    gt: today
                },
                paymentType: {
                    not: null
                },
                paymentAmount: {
                    not: null
                },
                status: 'accepted'

            },
            include: {
                user: true,
                affiliate: true
            }
        });



        // Käi läbi kõik lepingud ja loo neile makselingid
        for (const contract of activeContracts) {
            await createAndSendPaymentLink(contract, currentMonth, true);
        }

        return { success: true, processedCount: activeContracts.length };
    } catch (error) {
        console.error('Error processing contract payments:', error);
        throw error;
    }
}

async function createAndSendPaymentLink(contract, currentMonth, isEarlyNotification = false) {
    try {
        // Otsi affiliate API võtmed
        const apiKeys = await prisma.affiliateApiKeys.findFirst({
            where: {
                affiliateId: contract.affiliateId
            }
        });

        if (!apiKeys) {
            console.error(`No API keys found for affiliate ID: ${contract.affiliateId}`);
            return;
        }

        // Kontrolli, kas lepingul on payment holiday sellel kuul
        const paymentHoliday = await prisma.paymentHoliday.findFirst({
            where: {
                contractId: contract.id,
                userId: contract.userId,
                affiliateId: contract.affiliateId,
                month: currentMonth,
                accepted: "approved"
            }
        });

        // Määra makse summa vastavalt payment holiday olemasolule
        let paymentAmount;
        let isPaymentHoliday = false;

        if (paymentHoliday) {
            console.log(`Payment holiday found for contract ${contract.id} in ${currentMonth}`);
            // Kasuta payment holiday fee summat, kui see on olemas
            paymentAmount = contract.affiliate.paymentHolidayFee || 0;
            isPaymentHoliday = true;
        } else {
            // Kasuta tavapärast makse summat
            paymentAmount = parseFloat(contract.paymentAmount);
        }

        // Kontrolli, kas BACKEND_URL on olemas, kui ei, kasuta vaikeväärtust
        const backendUrl = process.env.BACKEND_URL || 'https://api.irontrack.ee';
        const notificationUrl = `${NOTIFICATION_URL}/api/payments/montonio-webhook`;

        const paymentDueDate = new Date();
        paymentDueDate.setDate(contract.paymentDay);
        const formattedDueDate = paymentDueDate.toLocaleDateString();

        // Loo kirjeldus vastavalt sellele, kas tegemist on payment holiday-ga või mitte
        const description = isPaymentHoliday
            ? `Payment holiday fee for ${contract.affiliate.name} (${currentMonth})`
            : `Monthly payment for ${contract.affiliate.name}`;

        // Makselingi loomiseks vajalikud andmed
        const paymentData = {
            accessKey: apiKeys.accessKey,
            merchantReference: `contract-${contract.id}-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`,
            description: description,
            currency: "EUR",
            amount: paymentAmount,
            locale: "et",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 päeva
            notificationUrl: notificationUrl,
            askAdditionalInfo: false
        };



        // Kui maksetasu on 0, siis jäta makse vahele
        if (paymentAmount <= 0) {
            console.log(`Skipping payment for contract ${contract.id} as payment amount is ${paymentAmount}`);
            return true;
        }

        // Genereeri JWT token
        const token = jwt.sign(
            paymentData,
            apiKeys.secretKey,
            { algorithm: 'HS256', expiresIn: '1h' }
        );

        // Saada päring Montonio API-le
        const response = await axios.post(`${MONTONIO_API_URL}/payment-links`, {
            data: token
        });



        // Registreeri makse andmebaasi kui ootel
        await recordPendingPayment(contract, response.data.uuid, isPaymentHoliday);

        // Saada makselink emailile
        await sendPaymentEmail(contract, response.data.url, paymentAmount, isPaymentHoliday, currentMonth, isEarlyNotification);

        return true;
    } catch (error) {
        console.error(`Error creating payment link for contract ID ${contract.id}:`, error);
        if (error.response && error.response.data) {
            console.error('API error details:', error.response.data); // Logi täpsem veateade
        }
        return false;
    }
}

async function recordPendingPayment(contract, montonioUuid, isPaymentHoliday) {
    try {


        // Loo uus kanne transactions tabelisse
        const transaction = await prisma.transactions.create({
            data: {
                amount: isPaymentHoliday ? contract.affiliate.paymentHolidayFee : contract.paymentAmount,
                invoiceNumber: new Date().toISOString().slice(0, 10).replace(/-/g, '') + Math.floor(Math.random() * 100000).toString().padStart(5, '0'),
                description: isPaymentHoliday
                    ? `Payment holiday fee for contract #${contract.id}`
                    : `Monthly payment for contract #${contract.id}`,
                type: "montonio",
                status: "pending", // märgi alguses kui ootel
                user: {
                    connect: {
                        id: contract.userId
                    }
                },
                affiliate: {
                    connect: {
                        id: contract.affiliateId
                    }
                }
            }
        });

        // Veendu, et tabel on olemas
        try {
            await prisma.$executeRaw`
                CREATE TABLE IF NOT EXISTS paymentMetadata (
                                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                               transactionId INTEGER NOT NULL,
                                                               montonioUuid TEXT NOT NULL,
                                                               contractId INTEGER NOT NULL,
                                                               affiliateId INTEGER NOT NULL,
                                                               isPaymentHoliday BOOLEAN NOT NULL DEFAULT FALSE,
                                                               createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                               UNIQUE(montonioUuid, contractId)
                )
            `;
        } catch (err) {
            console.error('Error ensuring paymentMetadata table exists:', err);
        }

        // Salvesta metaandmed
        try {
            await prisma.$executeRaw`
                INSERT INTO paymentMetadata (transactionId, montonioUuid, contractId, affiliateId, isPaymentHoliday, createdAt)
                VALUES (${transaction.id}, ${montonioUuid}, ${contract.id}, ${contract.affiliateId}, ${isPaymentHoliday}, ${new Date()})
            `;

         } catch (err) {
            console.error('Error inserting payment metadata:', err);
        }

        return transaction;
    } catch (error) {
        console.error('Error recording pending payment:', error);
        throw error;
    }
}

// Update the sendPaymentEmail function to mention early notification
async function sendPaymentEmail(contract, paymentUrl, paymentAmount, isPaymentHoliday, currentMonth, isEarlyNotification = false) {
    const dueDate = new Date();
    // Set to the payment day in the current month
    dueDate.setDate(contract.paymentDay);
    const formattedDueDate = dueDate.toLocaleDateString();

    // Add "Early Payment Notification" to subject if applicable
    const emailSubject = `${isEarlyNotification ? "Early Payment Notification: " : ""}${
        isPaymentHoliday
            ? `Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth}`
            : `Monthly payment for ${contract.affiliate.name}`
    }`;

    // Add early payment information to the email body
    const earlyNotificationText = isEarlyNotification
        ? `This is an early payment notification. Your payment is due on ${formattedDueDate}.\n\n`
        : '';

    const emailBody = isPaymentHoliday
        ? `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}This is a payment holiday month for your subscription with ${contract.affiliate.name}.
    
    A reduced fee of €${paymentAmount} is due for ${currentMonth}.
    
    Please use the following link to complete your payment:
    ${paymentUrl}
    
    The payment link is valid for 7 days.
    
    Thank you!
    IronTrack Team
  `
        : `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}Your monthly payment of €${paymentAmount} for ${contract.affiliate.name} is due.
    
    Please use the following link to complete your payment:
    ${paymentUrl}
    
    The payment link is valid for 7 days.
    
    Thank you!
    IronTrack Team
  `;

    await sendMessage({
        recipientType: 'user',
        senderId: contract.affiliateId,
        recipientId: contract.userId,
        subject: emailSubject,
        body: emailBody,
        affiliateEmail: contract.affiliate.email
    });


}

module.exports = {
    processContractPayments
};