const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {sendMessage} = require('../utils/emailService');

const prisma = new PrismaClient();

const NOTIFICATION_URL = process.env.NOTIFICATION_URL || 'https://api.irontrack.ee';

const MONTONIO_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://stargate.montonio.com/api'
    : 'https://sandbox-stargate.montonio.com/api';
async function sendPaymentReminderEmail(
    contract,
    paymentUrl,
    amount,
    invoiceNumber,
    transactionDate,
    isPaymentHoliday = false,
    weeklyReminder = false
) {
    // Formateeri tehingu kuupäev
    const formattedDate = new Date(transactionDate).toLocaleDateString();
    const currentMonth = new Date(transactionDate).toLocaleString('en-US', {month: 'long'});

    // Eraldi pealkiri iganädalase meeldetuletuse jaoks
    const reminderPrefix = weeklyReminder ? "OVERDUE PAYMENT: " : "REMINDER: ";

    const emailSubject = isPaymentHoliday
        ? `${reminderPrefix}Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth}`
        : `${reminderPrefix}Monthly payment for ${contract.affiliate.name}`;

    // Erinevad teated vastavalt sellele, kas tegu on tavapärase või iganädalase meeldetuletusega
    const reminderMessage = weeklyReminder
        ? `<p>This is a <strong>weekly reminder</strong> that you have an <strong>overdue payment</strong> for ${contract.affiliate.name}.</p>
           <p>Your invoice #${invoiceNumber} from ${formattedDate} remains unpaid.</p>`
        : `<p>This is a reminder that you have an <strong>unpaid invoice</strong> for ${contract.affiliate.name} (Invoice #${invoiceNumber} from ${formattedDate}).</p>`;

    // HTML email body
    const emailHtmlBody = `
        <p>Dear ${contract.user.fullName},</p>
        
        ${reminderMessage}
        
        <p>The amount due is <strong>€${amount}</strong>.</p>
        
        <p>Please use the following link to complete your payment as soon as possible:</p>
        
        <div style="margin: 25px 0;">
            <a href="${paymentUrl}" style="display: inline-block; background-color: #d4af37; color: #1a1a1a; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Make Payment</a>
        </div>
        
        <p style="margin-bottom: 20px; color: #666; font-size: 14px;">If the button doesn't work, please copy and paste this link into your browser:<br>
        <a href="${paymentUrl}" style="color: #d4af37; word-break: break-all;">${paymentUrl}</a></p>
        
        <p>Thank you!<br>
        IronTrack Team</p>
    `;

    await sendMessage({
        recipientType: 'user',
        senderId: contract.affiliateId,
        recipientId: contract.userId,
        subject: emailSubject,
        body: emailHtmlBody,
        affiliateEmail: contract.affiliate.email
    });
}

// Funktsioon, mis kontrollib pending maksetega lepinguid ja saadab meeldetuletusi
async function checkAndNotifyPendingPayments() {
    try {
        const today = new Date();

        // Otsi lepinguid, millel on maksepäev täna
        const contractsWithPaymentDueToday = await prisma.contract.findMany({
            where: {
                active: true,
                paymentDay: today.getDate(),
                validUntil: {
                    gt: today
                },
                status: 'accepted'
            },
            include: {
                user: true,
                affiliate: true
            }
        });

        let notifiedCount = 0;

        for (const contract of contractsWithPaymentDueToday) {
            // Otsi kõik "pending" staatusega tehingud antud lepingu jaoks
            const pendingTransactions = await prisma.transactions.findMany({
                where: {
                    contractId: contract.id,
                    status: 'pending'
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            for (const pendingTransaction of pendingTransactions) {
                // Leia makseandmed
                const paymentData = await prisma.paymentMetadata.findFirst({
                    where: {
                        transactionId: pendingTransaction.id
                    }
                });

                if (paymentData && paymentData.paymentUrl) {
                    // Saada meeldetuletuse email makselingiga
                    await sendPaymentReminderEmail(
                        contract,
                        paymentData.paymentUrl,
                        pendingTransaction.amount,
                        pendingTransaction.invoiceNumber,
                        pendingTransaction.createdAt,
                        paymentData.isPaymentHoliday,
                        false // See ei ole iganädalane meeldetuletus
                    );

                    notifiedCount++;
                }
            }
        }

        return { success: true, notifiedCount };
    } catch (error) {
        console.error('Error checking pending payments:', error);
        throw error;
    }
}

// Uus funktsioon: Iganädalane meeldetuletus kõigile maksmata arvetele (esmaspäeviti)
async function sendWeeklyPaymentReminders() {
    try {
        const today = new Date();

        // Kontrolli, kas täna on esmaspäev (0 = pühapäev, 1 = esmaspäev, jne)
        if (today.getDay() !== 1) {
            console.log('Today is not Monday. Weekly reminders are sent only on Mondays.');
            return { success: true, notifiedCount: 0, skipped: true };
        }

        // Otsi kõik pending tehingud
        const pendingTransactions = await prisma.transactions.findMany({
            where: {
                status: 'pending',
                contractId: {
                    not: null
                }
            },
            include: {
                user: true,
            }
        });

        let notifiedCount = 0;

        for (const transaction of pendingTransactions) {
            // Kontrollime, kas leping on veel aktiivne
            const contract = await prisma.contract.findFirst({
                where: {
                    id: transaction.contractId,
                    active: true,
                },
                include: {
                    user: true,
                    affiliate: true
                }
            });

            if (!contract) {
                continue; // Leping pole aktiivne, jätkame järgmisega
            }

            // Leia makseandmed
            const paymentData = await prisma.paymentMetadata.findFirst({
                where: {
                    transactionId: transaction.id
                }
            });

            if (paymentData && paymentData.paymentUrl) {
                // Saada iganädalane meeldetuletus makselingiga
                await sendPaymentReminderEmail(
                    contract,
                    paymentData.paymentUrl,
                    transaction.amount,
                    transaction.invoiceNumber,
                    transaction.createdAt,
                    paymentData.isPaymentHoliday,
                    true // See on iganädalane meeldetuletus
                );

                notifiedCount++;
            }
        }

        console.log(`Sent weekly reminders for ${notifiedCount} pending transactions`);
        return { success: true, notifiedCount };
    } catch (error) {
        console.error('Error sending weekly payment reminders:', error);
        throw error;
    }
}

async function processContractPayments() {
    try {
        const today = new Date();

        // 1. Esmalt märgime lõppenud lepingud "ended" staatusesse
        const expiredContracts = await prisma.contract.findMany({
            where: {
                active: true,
                validUntil: {
                    lt: today // Lõpptähtaeg on möödas
                },
                status: {
                    not: 'ended' // Pole veel lõppenuks märgitud
                }
            }
        });

        if (expiredContracts.length > 0) {
            // Märgi lepingud lõppenuks
            await prisma.contract.updateMany({
                where: {
                    id: {
                        in: expiredContracts.map(contract => contract.id)
                    }
                },
                data: {
                    status: 'ended',
                    active: false
                }
            });

            // Salvesta logi andmebaasi
            await prisma.contractLogs.createMany({
                data: expiredContracts.map(contract => ({
                    contractId: contract.id,
                    userId: contract.userId,
                    affiliateId: contract.affiliateId,
                    action: 'contract ended - Contract period expired',
                }))
            });

            console.log(`Marked ${expiredContracts.length} expired contracts as ended`);
        }

        // 2. Kontrolli ja saada meeldetuletused tasumata maksetele
        const pendingPaymentsResult = await checkAndNotifyPendingPayments();
        console.log(`Sent payment reminders for ${pendingPaymentsResult.notifiedCount} pending transactions with due date today`);

        // 3. Kontrolli, kas täna on esmaspäev ja saada iganädalased meeldetuletused kõigile pending tehingutele
        let weeklyRemindersResult = { notifiedCount: 0 };
        if (today.getDay() === 1) { // 1 = esmaspäev
            weeklyRemindersResult = await sendWeeklyPaymentReminders();
            console.log(`Sent weekly payment reminders for ${weeklyRemindersResult.notifiedCount} pending transactions`);
        }

        // 4. Jätkame tavapärase maksetöötlusega
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const targetPaymentDay = futureDate.getDate();

        const currentMonth = futureDate.toLocaleString('en-US', {month: 'long'});

        // Otsi lepingud, millel on maksepäev täna ja lõpptähtaeg tulevikus
        let activeContracts = await prisma.contract.findMany({
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

        // Käi läbi kõik aktiivsed lepingud ja saada makselingid
        for (const contract of activeContracts) {
            await createAndSendPaymentLink(contract, currentMonth, true);
        }

        return {
            success: true,
            processedCount: activeContracts.length,
            expiredContractsCount: expiredContracts.length,
            pendingPaymentsNotified: pendingPaymentsResult.notifiedCount,
            weeklyRemindersNotified: weeklyRemindersResult.notifiedCount
        };
    } catch (error) {
        console.error('Error processing contract payments:', error);
        throw error;
    }
}

// Kasutaja krediidi kontrollimiseks ja rakendamiseks
async function checkAndApplyUserCredit(userId, affiliateId, paymentAmount) {
    try {
        // Otsi kasutaja krediit antud affiliate jaoks
        const userCredit = await prisma.credit.findUnique({
            where: {
                userId_affiliateId: {
                    userId: userId,
                    affiliateId: affiliateId
                }
            }
        });

        // Kui krediiti pole, tagasta 0
        if (!userCredit || userCredit.credit <= 0) {
            return {appliedCredit: 0, remainingAmount: paymentAmount};
        }

        // Arvuta, kui palju krediiti saab rakendada
        const availableCredit = parseFloat(userCredit.credit);
        const paymentAmountFloat = parseFloat(paymentAmount);

        let appliedCredit = 0;
        let remainingAmount = paymentAmountFloat;

        // Kui krediit katab kogu makse
        if (availableCredit >= paymentAmountFloat) {
            appliedCredit = paymentAmountFloat;
            remainingAmount = 0;

            // Vähenda kasutaja krediiti
            await prisma.credit.update({
                where: {
                    userId_affiliateId: {
                        userId: userId,
                        affiliateId: affiliateId
                    }
                },
                data: {
                    credit: {
                        decrement: paymentAmountFloat
                    }
                }
            });
        }
        // Kui krediit katab osa maksest
        else {
            appliedCredit = availableCredit;
            remainingAmount = paymentAmountFloat - availableCredit;

            // Vähenda kasutaja krediiti (nulli)
            await prisma.credit.update({
                where: {
                    userId_affiliateId: {
                        userId: userId,
                        affiliateId: affiliateId
                    }
                },
                data: {
                    credit: 0
                }
            });
        }


        return {appliedCredit, remainingAmount};
    } catch (error) {
        console.error('Error checking user credit:', error);
        return {appliedCredit: 0, remainingAmount: paymentAmount};
    }
}

// Update UserPlan lõppkuupäeva funktsioon
async function updateUserPlanDueDate(contractId, isPaymentHoliday) {
    try {
        if (isPaymentHoliday) {


            const userPlan = await prisma.userPlan.findFirst({
                where: {contractId: parseInt(contractId)}
            });

            if (!userPlan) {
                return false;
            }

            await prisma.userPlan.update({
                where: {id: userPlan.id},
                data: {paymentHoliday: true}
            });




        } else {

            const userPlan = await prisma.userPlan.findFirst({
                where: {contractId: parseInt(contractId)},

            });

            if (!userPlan) {
                return false;
            }

            await prisma.userPlan.update({
                where: {id: userPlan.id},
                data: {paymentHoliday: false}
            });


        }

        const userPlan = await prisma.userPlan.findFirst({
            where: {contractId: contractId}
        });

        if (!userPlan) {

            return false;
        }

        // Arvuta uus lõppkuupäev (lisa üks kuu)
        let newEndDate = new Date(userPlan.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        // Uuenda kasutaja plaani kehtivust
        await prisma.userPlan.update({
            where: {id: userPlan.id},
            data: {endDate: newEndDate}
        });


        return true;
    } catch (error) {
        console.error(`Error updating UserPlan for contract ${contractId}:`, error);
        return false;
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
            return false;
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
        let originalPaymentAmount;
        let isPaymentHoliday = false;

        if (paymentHoliday) {

            // Kasuta payment holiday fee summat, kui see on olemas
            originalPaymentAmount = contract.affiliate.paymentHolidayFee || 0;
            isPaymentHoliday = true;
        } else {
            // Kasuta tavapärast makse summat
            originalPaymentAmount = parseFloat(contract.paymentAmount);
        }

        // Kontrolli ja rakenda kasutaja krediiti
        const {appliedCredit, remainingAmount} = await checkAndApplyUserCredit(
            contract.userId,
            contract.affiliateId,
            originalPaymentAmount
        );

        // Loo kirjeldus
        const baseDescription = isPaymentHoliday
            ? `Payment holiday fee for ${contract.affiliate.name} (${currentMonth})`
            : `Monthly payment for ${contract.affiliate.name}`;

        // Lisa info rakendatud krediidi kohta
        const creditInfo = appliedCredit > 0
            ? `, applied credit: ${appliedCredit}€`
            : '';

        const description = `${baseDescription}${creditInfo}`;

        // Unikaalne arvenumber
        const invoiceNumber = `contract-${contract.id}-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;

        // STSENAARIUM 1: Täielikult krediidiga tasumine
        if (remainingAmount <= 0) {


            try {
                // Registreeri edukas makse
                const transaction = await prisma.transactions.create({
                    data: {
                        amount: originalPaymentAmount,
                        invoiceNumber: invoiceNumber,
                        description: `${description} (fully paid with credit)`,
                        type: "credit",
                        status: "success",
                        contractId: contract.id,
                        userId: contract.userId,
                        affiliateId: contract.affiliateId
                    }
                });



                // Uuenda UserPlan lõppkuupäeva
                await updateUserPlanDueDate(contract.id, isPaymentHoliday);

                // Saada email, et makse on krediidiga kaetud
                await sendCreditPaymentEmail(contract, originalPaymentAmount, appliedCredit, isPaymentHoliday, currentMonth, isEarlyNotification);

                return true;
            } catch (error) {
                console.error(`Error processing credit payment for contract ${contract.id}:`, error);
                return false;
            }
        }

        // STSENAARIUM 2 & 3: Osaline krediiditasu või täielik maksemeetod

        // Makselingi loomiseks vajalikud andmed
        const paymentData = {
            accessKey: apiKeys.accessKey,
            merchantReference: invoiceNumber,
            description: description,
            currency: "EUR",
            amount: remainingAmount,
            locale: "et",
            expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
            notificationUrl: `${NOTIFICATION_URL}/api/payments/montonio-webhook`,
            askAdditionalInfo: false
        };

        // Genereeri JWT token
        const token = jwt.sign(
            paymentData,
            apiKeys.secretKey,
            {algorithm: 'HS256', expiresIn: '1h'}
        );

        // Saada päring Montonio API-le
        const response = await axios.post(`${MONTONIO_API_URL}/payment-links`, {
            data: token
        });

        // Registreeri makse andmebaasi kui ootel
        const transaction = await recordPendingPayment(
            contract,
            response.data.uuid,
            isPaymentHoliday,
            originalPaymentAmount,
            appliedCredit,
            remainingAmount,
            response.data.url
        );

        // Saada makselink emailile
        await sendPaymentEmail(
            contract,
            response.data.url,
            originalPaymentAmount,
            appliedCredit,
            remainingAmount,
            isPaymentHoliday,
            currentMonth,
            isEarlyNotification
        );

        return true;
    } catch (error) {
        console.error(`Error creating payment link for contract ID ${contract.id}:`, error);
        if (error.response && error.response.data) {
            console.error('API error details:', error.response.data);
        }
        return false;
    }
}

async function recordPendingPayment(
    contract,
    montonioUuid,
    isPaymentHoliday,
    originalAmount,
    appliedCredit = 0,
    remainingAmount,
    paymentUrl
) {
    try {
        // Määra tüüp vastavalt krediidi kasutusele
        const paymentType = appliedCredit > 0 ? "mixed" : "montonio";

        // Krediidi info kirjelduses
        const creditInfo = appliedCredit > 0
            ? `, applied credit: ${appliedCredit}€`
            : '';

        // Create a new transaction record
        const transaction = await prisma.transactions.create({
            data: {
                amount: remainingAmount,
                invoiceNumber: `contract-${contract.id}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
                description: isPaymentHoliday
                    ? `Payment holiday fee for contract #${contract.id}${creditInfo}`
                    : `Monthly payment for contract #${contract.id}${creditInfo}`,
                type: paymentType,
                status: "pending",
                contractId: contract.id,
                userId: contract.userId,
                affiliateId: contract.affiliateId,

            }
        });

        // Record payment metadata
        await prisma.paymentMetadata.create({
            data: {
                transactionId: transaction.id,
                montonioUuid: montonioUuid,
                contractId: contract.id,
                affiliateId: contract.affiliateId,
                isPaymentHoliday: isPaymentHoliday,
                createdAt: new Date(),
                paymentUrl: paymentUrl,
            }
        });


        return transaction;
    } catch (error) {
        console.error('Error recording pending payment:', error);
        throw error;
    }
}

// Täielikult krediidiga tasutud makse e-maili saatmiseks
async function sendCreditPaymentEmail(contract, paymentAmount, appliedCredit, isPaymentHoliday, currentMonth, isEarlyNotification = false) {
    const dueDate = new Date();
    dueDate.setDate(contract.paymentDay);
    const formattedDueDate = dueDate.toLocaleDateString();

    // Add "Early Payment Notification" to subject if applicable
    const emailSubject = `${isEarlyNotification ? "Early Payment Notification: " : ""}${
        isPaymentHoliday
            ? `Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth} (Paid with Credit)`
            : `Monthly payment for ${contract.affiliate.name} (Paid with Credit)`
    }`;

    // Add early payment information to the email body
    const earlyNotificationText = isEarlyNotification
        ? `This is an early payment notification for your payment due on ${formattedDueDate}.\n\n`
        : '';

    const emailBody = isPaymentHoliday
        ? `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}This is a payment holiday month for your subscription with ${contract.affiliate.name}.
    
    A reduced fee of €${paymentAmount} was due for ${currentMonth}.
    
    Good news! This payment has been fully covered by your available credit (€${appliedCredit} used). No further action is required.
    
    Thank you!
    IronTrack Team
  `
        : `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}Your monthly payment of €${paymentAmount} for ${contract.affiliate.name} was due.
    
    Good news! This payment has been fully covered by your available credit (€${appliedCredit} used). No further action is required.
    
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

// Makselingiga emaili saatmine
async function sendPaymentEmail(
    contract,
    paymentUrl,
    originalAmount,
    appliedCredit = 0,
    remainingAmount,
    isPaymentHoliday,
    currentMonth,
    isEarlyNotification = false
) {
    const dueDate = new Date();
    dueDate.setDate(contract.paymentDay);
    const formattedDueDate = dueDate.toLocaleDateString();

    // Add "Early Payment Notification" to subject if applicable
    const emailSubject = `${isEarlyNotification ? "Early Payment Notification: " : ""}${
        isPaymentHoliday
            ? `Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth}`
            : `Monthly payment for ${contract.affiliate.name}`
    }`;

    // Add early payment information to the email body
    const earlyNotificationHtml = isEarlyNotification
        ? `<p>This is an early payment notification. Your payment is due on ${formattedDueDate}.</p>`
        : '';

    const earlyNotificationText = isEarlyNotification
        ? `This is an early payment notification. Your payment is due on ${formattedDueDate}.\n\n`
        : '';

    // Add credit application information
    const creditHtml = appliedCredit > 0
        ? `
        <p>Your available credit of €${appliedCredit} has been applied to this payment, reducing the amount due.</p>
        <table style="width: 100%; max-width: 400px; margin: 15px 0; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0;">Original amount:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">€${originalAmount}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;">Credit applied:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">€${appliedCredit}</td>
            </tr>
            <tr style="border-top: 1px solid #ddd;">
                <td style="padding: 8px 0;">Remaining to pay:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">€${remainingAmount}</td>
            </tr>
        </table>
        `
        : '';

    const creditText = appliedCredit > 0
        ? `\nYour available credit of €${appliedCredit} has been applied to this payment, reducing the amount due.\n\nOriginal amount: €${originalAmount}\nCredit applied: €${appliedCredit}\nRemaining to pay: €${remainingAmount}\n\n`
        : '';

    // Create payment button
    const paymentButton = `
    <div style="margin: 25px 0;">
        <a href="${paymentUrl}" style="display: inline-block; background-color: #d4af37; color: #1a1a1a; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 4px; text-align: center;">Make Payment</a>
    </div>
    <p style="margin-bottom: 20px; color: #666; font-size: 14px;">If the button doesn't work, please copy and paste this link into your browser:<br>
    <a href="${paymentUrl}" style="color: #d4af37; word-break: break-all;">${paymentUrl}</a></p>
    `;

    // HTML email body
    const emailHtmlBody = isPaymentHoliday
        ? `
        <p>Dear ${contract.user.fullName},</p>
        
        ${earlyNotificationHtml}
        <p>This is a payment holiday month for your subscription with ${contract.affiliate.name}.</p>
        
        <p>A reduced fee of €${originalAmount} is due for ${currentMonth}.</p>
        ${creditHtml}
        
        <p>Please use the following link to complete your payment:</p>
        ${paymentButton}
        
        <p>Thank you!<br>
        IronTrack Team</p>
        `
        : `
        <p>Dear ${contract.user.fullName},</p>
        
        ${earlyNotificationHtml}
        <p>Your monthly payment of €${originalAmount} for ${contract.affiliate.name} is due.</p>
        ${creditHtml}
        
        <p>Please use the following link to complete your payment:</p>
        ${paymentButton}
        
        <p>Thank you!<br>
        IronTrack Team</p>
        `;

    // Plain text email body (fallback)
    const emailTextBody = isPaymentHoliday
        ? `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}This is a payment holiday month for your subscription with ${contract.affiliate.name}.
    
    A reduced fee of €${originalAmount} is due for ${currentMonth}.${creditText}
    
    Please use the following link to complete your payment:
    ${paymentUrl}
    
    The payment link is valid for 36 days.
    
    Thank you!
    IronTrack Team
    `
        : `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}Your monthly payment of €${originalAmount} for ${contract.affiliate.name} is due.${creditText}
    
    Please use the following link to complete your payment:
    ${paymentUrl}
    
    
    Thank you!
    IronTrack Team
    `;

    await sendMessage({
        recipientType: 'user',
        senderId: contract.affiliateId,
        recipientId: contract.userId,
        subject: emailSubject,
        body: emailHtmlBody, // Using HTML version for body
        affiliateEmail: contract.affiliate.email
    });
}

// Handle Montonio webhook in paymentController.js
// This function should be updated to handle credit application scenario
const handleMontonioWebhook = async (req, res) => {
    try {
        const {orderToken} = req.body;

        if (!orderToken) {

            return res.status(200).json({success: false, message: 'No order token provided'});
        }

        // Decode the token to get UUID
        let decodedToken;
        try {
            decodedToken = jwt.decode(orderToken);

            if (!decodedToken || !decodedToken.paymentLinkUuid) {

                return res.status(200).json({success: false, message: 'Invalid token format'});
            }

            const orderUuid = decodedToken.paymentLinkUuid;


            // Find payment metadata
            const paymentMetadata = await prisma.paymentMetadata.findFirst({
                where: {montonioUuid: orderUuid}
            });

            if (!paymentMetadata) {

                return res.status(200).json({
                    success: true,
                    message: `Processing as regular payment - no contract metadata found`
                });
            }

            // Get payment details from metadata
            const {transactionId, contractId, affiliateId, isPaymentHoliday} = paymentMetadata;

            // Find API keys for token verification
            const apiKeys = await prisma.affiliateApiKeys.findFirst({
                where: {affiliateId: affiliateId}
            });

            if (!apiKeys) {
                console.error(`API keys not found for affiliate ${affiliateId}`);
                return res.status(200).json({success: false, message: 'API keys not found'});
            }

            // Verify token with affiliate secret key
            try {
                decodedToken = jwt.verify(orderToken, apiKeys.secretKey);
            } catch (verifyError) {
                console.error('Error verifying token with affiliate key:', verifyError);
                return res.status(200).json({
                    success: false,
                    message: 'Error verifying token with affiliate key'
                });
            }

            // Extract payment status
            const {paymentStatus} = decodedToken;

            // Process based on payment status
            if (paymentStatus === 'PAID') {


                // 1. Update transaction status
                await prisma.transactions.update({
                    where: {id: transactionId},
                    data: {status: 'success'}
                });

                // 2. Update user plan end date if payment successful
                await updateUserPlanDueDate(contractId, isPaymentHoliday);

                return res.status(200).json({
                    success: true,
                    message: `Payment processed successfully for contract ${contractId}`
                });
            } else if (paymentStatus === 'VOIDED' || paymentStatus === 'ABANDONED') {


                // Mark transaction as cancelled
                await prisma.transactions.update({
                    where: {id: transactionId},
                    data: {status: 'cancelled'}
                });

                return res.status(200).json({
                    success: true,
                    message: `Payment ${paymentStatus.toLowerCase()} for contract ${contractId}`
                });
            } else {

                return res.status(200).json({
                    success: true,
                    message: `Received payment status: ${paymentStatus}`
                });
            }
        } catch (error) {
            console.error('Error processing webhook token:', error);
            return res.status(200).json({
                success: false,
                message: 'Error processing token'
            });
        }
    } catch (error) {
        console.error('Error processing Montonio webhook:', error);
        return res.status(200).json({
            success: false,
            message: 'Error processing webhook but acknowledged',
            error: error.message
        });
    }
};

module.exports = {
    processContractPayments,
    handleMontonioWebhook,
    checkAndNotifyPendingPayments,
    sendPaymentReminderEmail,
    checkAndApplyUserCredit,
    updateUserPlanDueDate,
    createAndSendPaymentLink,
    sendPaymentEmail,
    sendCreditPaymentEmail,
    recordPendingPayment

};