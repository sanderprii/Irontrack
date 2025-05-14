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
        if (today.getDay() !== 3) {

            return { success: true, notifiedCount: 0, skipped: true };
        }

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(today.getDate() - 10);


        // Otsi kõik pending tehingud
        const pendingTransactions = await prisma.transactions.findMany({
            where: {
                status: 'pending',
                contractId: {
                    not: null
                },
                createdAt: {
                    lt: tenDaysAgo
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


        return { success: true, notifiedCount };
    } catch (error) {
        console.error('Error sending weekly payment reminders:', error);
        throw error;
    }
}

async function processContractPayments() {
    try {
        const today = new Date();

        // 1. Mark expired contracts as "ended" (unchanged)
        const expiredContracts = await prisma.contract.findMany({
            where: {
                active: true,
                validUntil: {
                    lt: today
                },
                status: {
                    not: 'ended'
                }
            }
        });

        if (expiredContracts.length > 0) {
            // Logic for marking contracts as ended (unchanged)
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

            await prisma.contractLogs.createMany({
                data: expiredContracts.map(contract => ({
                    contractId: contract.id,
                    userId: contract.userId,
                    affiliateId: contract.affiliateId,
                    action: 'contract ended - Contract period expired',
                }))
            });
        }

        // 2. & 3. Pending payments and weekly reminders (unchanged)
        const pendingPaymentsResult = await checkAndNotifyPendingPayments();

        let weeklyRemindersResult = { notifiedCount: 0 };
        if (today.getDay() === 3) {
            weeklyRemindersResult = await sendWeeklyPaymentReminders();
        }

        // 4. Process new payments
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const targetPaymentDay = futureDate.getDate();

        const currentMonth = futureDate.toLocaleString('en-US', {month: 'long'});

        // Find active contracts with payment day today
        let activeContracts = await prisma.contract.findMany({
            where: {
                active: true,
                paymentDay: targetPaymentDay,
                validUntil: {
                    gt: today
                },
                paymentAmount: {
                    not: null
                },
                startDate: {
                    lt: new Date(),
                },
                isFirstPayment: false,
                status: 'accepted'
            },
            include: {
                user: true,
                affiliate: true
            }
        });

        // Process each active contract
        for (const contract of activeContracts) {
            // Check if contract is near its end date (less than a month left)
            const isNearEnd = isContractNearEnd(contract, targetPaymentDay);

            // Create and send payment link, passing the isNearEnd flag
            await createAndSendPaymentLink(contract, currentMonth, true, isNearEnd);
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

function isContractNearEnd(contract, paymentDay) {
    if (!contract.validUntil) return false;

    // Create date for this payment
    const paymentDate = new Date();
    paymentDate.setDate(paymentDay);

    // If payment date would be after validUntil, contract is already expired
    if (paymentDate > contract.validUntil) return false;

    // Calculate days between payment and contract end
    const daysRemaining = Math.ceil((contract.validUntil - paymentDate) / (1000 * 60 * 60 * 24));

    // Return true if less than 30 days remaining
    return daysRemaining < 30;
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
async function updateUserPlanDueDate(contractId, isPaymentHoliday, proratedDays = null) {
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

        // Calculate new end date based on prorated days or full month
        let newEndDate = new Date(userPlan.endDate);

        if (proratedDays !== null) {
            // For prorated payments, only extend by the number of days paid for
            newEndDate.setDate(newEndDate.getDate() + proratedDays);
        } else {
            // For normal payments, extend by one month
            newEndDate.setMonth(newEndDate.getMonth() + 1);
        }

        // Update user plan validity
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


async function createAndSendPaymentLink(contract, currentMonth, isEarlyNotification = false, isNearEnd = false) {
    try {
        // Existing code for API keys
        const apiKeys = await prisma.affiliateApiKeys.findFirst({
            where: {
                affiliateId: contract.affiliateId
            }
        });

        if (!apiKeys) {
            console.error(`No API keys found for affiliate ID: ${contract.affiliateId}`);
            return false;
        }

        // Check for payment holiday (unchanged)
        const paymentHoliday = await prisma.paymentHoliday.findFirst({
            where: {
                contractId: contract.id,
                userId: contract.userId,
                affiliateId: contract.affiliateId,
                month: currentMonth,
                accepted: "approved"
            }
        });

        // Determine original payment amount
        let originalPaymentAmount;
        let isPaymentHoliday = false;

        if (paymentHoliday) {
            originalPaymentAmount = contract.affiliate.paymentHolidayFee || 0;
            isPaymentHoliday = true;
        } else {
            originalPaymentAmount = parseFloat(contract.paymentAmount);
        }

        // If contract is near end, prorate the payment amount
        let proratedDays = 0;
        if (isNearEnd && !isPaymentHoliday) {
            // Calculate days between payment date and contract end
            const paymentDate = new Date();
            paymentDate.setDate(contract.paymentDay);
console.log(`Payment date: ${paymentDate}`);
            proratedDays = Math.ceil((contract.validUntil - paymentDate) / (1000 * 60 * 60 * 24));

            // Prorate the payment amount based on days remaining
            originalPaymentAmount = (originalPaymentAmount * proratedDays / 30).toFixed(2);
            originalPaymentAmount = parseFloat(originalPaymentAmount);
        }
console.log(`Prorated days: ${proratedDays}`);
        // Check and apply user credit (unchanged)
        const {appliedCredit, remainingAmount} = await checkAndApplyUserCredit(
            contract.userId,
            contract.affiliateId,
            originalPaymentAmount
        );

        // Create description with prorated info if needed
        const baseDescription = isPaymentHoliday
            ? `Payment holiday fee for ${contract.affiliate.name} (${currentMonth})`
            : `Monthly payment for ${contract.affiliate.name}`;

        // Add prorated days info if applicable
        const proratedInfo = (isNearEnd && proratedDays > 0 && !isPaymentHoliday)
            ? ` (prorated for ${proratedDays} days)`
            : '';
console.log(`Prorated info: ${proratedInfo}`);
        // Add credit info
        const creditInfo = appliedCredit > 0
            ? `, applied credit: ${appliedCredit}€`
            : '';

        const description = `${baseDescription}${proratedInfo}${creditInfo}`;

        // Unique invoice number
        const invoiceNumber = `contract-${contract.id}-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`;

        // SCENARIO 1: Fully paid with credit
        if (remainingAmount <= 0) {
            try {
                // Register successful payment
                const transaction = await prisma.transactions.create({
                    data: {
                        amount: originalPaymentAmount,
                        invoiceNumber: invoiceNumber,
                        description: `${description} (fully paid with credit)`,
                        type: "credit",
                        status: "success",
                        contractId: contract.id,
                        userId: contract.userId,
                        affiliateId: contract.affiliateId,
                        creditAmount: appliedCredit,
                    }
                });

                // Update UserPlan end date, passing prorated days
                await updateUserPlanDueDate(contract.id, isPaymentHoliday, isNearEnd ? proratedDays : null);

                // Send email
                await sendCreditPaymentEmail(
                    contract,
                    originalPaymentAmount,
                    appliedCredit,
                    isPaymentHoliday,
                    currentMonth,
                    isEarlyNotification,
                    isNearEnd && proratedDays > 0 ? proratedDays : null
                );

                return true;
            } catch (error) {
                console.error(`Error processing credit payment for contract ${contract.id}:`, error);
                return false;
            }
        }

        // SCENARIO 2 & 3: Partial credit or full payment method (nearly unchanged)
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

        const token = jwt.sign(
            paymentData,
            apiKeys.secretKey,
            {algorithm: 'HS256', expiresIn: '1h'}
        );

        const response = await axios.post(`${MONTONIO_API_URL}/payment-links`, {
            data: token
        });

        // Record payment with prorated info
        const transaction = await recordPendingPayment(
            contract,
            response.data.uuid,
            isPaymentHoliday,
            originalPaymentAmount,
            appliedCredit,
            remainingAmount,
            response.data.url,
            isNearEnd && proratedDays > 0 ? proratedDays : null
        );

        // Send payment email with prorated info
        await sendPaymentEmail(
            contract,
            response.data.url,
            originalPaymentAmount,
            appliedCredit,
            remainingAmount,
            isPaymentHoliday,
            currentMonth,
            isEarlyNotification,
            isNearEnd && proratedDays > 0 ? proratedDays : null
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
    paymentUrl,
    proratedDays = null
) {
    try {
        // Payment type based on credit usage
        const paymentType = appliedCredit > 0 ? "mixed" : "montonio";

        // Credit info
        const creditInfo = appliedCredit > 0
            ? `, applied credit: ${appliedCredit}€`
            : '';

        // Prorated info
        const proratedInfo = proratedDays !== null
            ? ` (prorated for ${proratedDays} days)`
            : '';

        // Create transaction record
        const transaction = await prisma.transactions.create({
            data: {
                amount: remainingAmount,
                invoiceNumber: `contract-${contract.id}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
                description: isPaymentHoliday
                    ? `Payment holiday fee for contract #${contract.id}${creditInfo}`
                    : `Monthly payment for contract #${contract.id}${proratedInfo}${creditInfo}`,
                type: paymentType,
                status: "pending",
                contractId: contract.id,
                userId: contract.userId,
                affiliateId: contract.affiliateId,
                creditAmount: appliedCredit,
            }
        });

        // Record payment metadata with proratedDays
        await prisma.paymentMetadata.create({
            data: {
                transactionId: transaction.id,
                montonioUuid: montonioUuid,
                contractId: contract.id,
                affiliateId: contract.affiliateId,
                isPaymentHoliday: isPaymentHoliday,
                createdAt: new Date(),
                paymentUrl: paymentUrl,
                proratedDays: proratedDays,
            }
        });

        return transaction;
    } catch (error) {
        console.error('Error recording pending payment:', error);
        throw error;
    }
}

// Täielikult krediidiga tasutud makse e-maili saatmiseks
// Täielikult krediidiga tasutud makse e-maili saatmiseks
async function sendCreditPaymentEmail(
    contract,
    paymentAmount,
    appliedCredit,
    isPaymentHoliday,
    currentMonth,
    isEarlyNotification = false,
    proratedDays = null
) {
    try {
        const dueDate = new Date();
        dueDate.setDate(contract.paymentDay);
        const formattedDueDate = dueDate.toLocaleDateString();
        const invoiceNumber = `CONTRACT-${contract.id}-${new Date().getTime()}`;

        // Add prorated info to subject if applicable
        const proratedSubject = proratedDays !== null ? ` (Prorated)` : '';

        // Add "Early Payment Notification" to subject if applicable
        const emailSubject = `${isEarlyNotification ? "Early Payment Notification: " : ""}${
            isPaymentHoliday
                ? `Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth}`
                : `Monthly payment for ${contract.affiliate.name}${proratedSubject}`
        }`;

        // Add prorated info to email body if applicable
        const proratedInfo = proratedDays !== null
            ? `<p><strong>Note:</strong> This is a prorated payment for ${proratedDays} days until your contract end date.</p>`
            : '';

        // Create email body
        const emailBody = `
<div class="invoice-details">
  <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
  <p><strong>Customer:</strong> ${contract.user.fullName}</p>
  <p><strong>Email:</strong> ${contract.user.email}</p>
</div>

${isEarlyNotification ? `
<div style="background-color: #fff8e1; padding: 10px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
  <p><strong>Early Payment Notice:</strong> This is an advance notification for your payment due on ${formattedDueDate}.</p>
</div>
` : ''}

${proratedInfo}

<p>Dear ${contract.user.fullName},</p>

<p>${isPaymentHoliday ?
            `This is a payment holiday month for your subscription with ${contract.affiliate.name}.` :
            `Your monthly payment for ${contract.affiliate.name} was due.`
        }</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr>
      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eee; background-color: #f9f9f9;">Description</th>
      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #eee; background-color: #f9f9f9;">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">${isPaymentHoliday ?
            `Payment Holiday Fee for ${currentMonth}` :
            `${proratedDays !== null ? `Prorated Payment (${proratedDays} days)` : 'Monthly Payment'} for ${contract.contractType || 'Membership'}`
        }</td>
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">€${paymentAmount.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">Applied Credit</td>
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;">-€${appliedCredit.toFixed(2)}</td>
    </tr>
    <tr style="font-weight: bold; background-color: #f5f5f5;">
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;"><strong>Amount Due</strong></td>
      <td style="padding: 10px; text-align: left; border-bottom: 1px solid #eee;"><strong>€0.00</strong></td>
    </tr>
  </tbody>
</table>

<p><strong>Good news!</strong> This payment has been fully covered by your available credit (€${appliedCredit.toFixed(2)} used). No further action is required.</p>

<p>Thank you for being a valued member!</p>`;

        // Create plain text fallback with prorated info
        const proratedTextInfo = proratedDays !== null
            ? `NOTE: This is a prorated payment for ${proratedDays} days until your contract end date.\n\n`
            : '';

        const textContent = `
Dear ${contract.user.fullName},

${isEarlyNotification ? `EARLY PAYMENT NOTICE: This is an advance notification for your payment due on ${formattedDueDate}.\n\n` : ''}

${proratedTextInfo}

${isPaymentHoliday ?
            `This is a payment holiday month for your subscription with ${contract.affiliate.name}.\nA reduced fee of €${paymentAmount.toFixed(2)} was due for ${currentMonth}.` :
            `Your ${proratedDays !== null ? `prorated (${proratedDays} days)` : 'monthly'} payment of €${paymentAmount.toFixed(2)} for ${contract.affiliate.name} was due.`
        }

Good news! This payment has been fully covered by your available credit (€${appliedCredit.toFixed(2)} used). No further action is required.

Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString('et-EE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
Amount: €${paymentAmount.toFixed(2)}
Credit Applied: €${appliedCredit.toFixed(2)}
Balance Due: €0.00

Thank you for being a valued member!
`;

        await sendMessage({
            recipientType: 'user',
            senderId: contract.affiliateId,
            recipientId: contract.userId,
            subject: emailSubject,
            body: emailBody,
            text: textContent,
            affiliateEmail: contract.affiliate.email
        });

        return true;
    } catch (error) {
        console.error("Error sending credit payment email:", error);
        return false;
    }
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
    isEarlyNotification = false,
    proratedDays = null
) {
    const dueDate = new Date();
    dueDate.setDate(contract.paymentDay);
    const formattedDueDate = dueDate.toLocaleDateString('et-EE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Add prorated info to subject if applicable
    const proratedSubject = proratedDays !== null ? ` (Prorated)` : '';

    // Add "Early Payment Notification" to subject if applicable
    const emailSubject = `${isEarlyNotification ? "Early Payment Notification: " : ""}${
        isPaymentHoliday
            ? `Payment Holiday Fee for ${contract.affiliate.name} - ${currentMonth}`
            : `Monthly payment for ${contract.affiliate.name}${proratedSubject}`
    }`;

    // Add early payment info
    const earlyNotificationHtml = isEarlyNotification
        ? `<p>This is an early payment notification. Your payment is due on ${formattedDueDate}.</p>`
        : '';

    const earlyNotificationText = isEarlyNotification
        ? `This is an early payment notification. Your payment is due on ${formattedDueDate}.\n\n`
        : '';

    // Add prorated info
    const proratedInfo = proratedDays !== null
        ? `<p><strong>Note:</strong> This is a prorated payment for ${proratedDays} days until your contract end date.</p>`
        : '';

    const proratedTextInfo = proratedDays !== null
        ? `NOTE: This is a prorated payment for ${proratedDays} days until your contract end date.\n\n`
        : '';

    // Add credit application info
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

    // HTML email body with prorated info
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
        ${proratedInfo}
        <p>Your ${proratedDays !== null ? `prorated` : 'monthly'} payment of €${originalAmount} for ${contract.affiliate.name} is due.</p>
        ${creditHtml}
        
        <p>Please use the following link to complete your payment:</p>
        ${paymentButton}
        
        <p>Thank you!<br>
        IronTrack Team</p>
        `;

    // Plain text email with prorated info
    const emailTextBody = isPaymentHoliday
        ? `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}This is a payment holiday month for your subscription with ${contract.affiliate.name}.
    
    A reduced fee of €${originalAmount} is due for ${currentMonth}.${creditText}
    
    Please use the following link to complete your payment:
    ${paymentUrl}
    
    Thank you!
    IronTrack Team
    `
        : `
    Dear ${contract.user.fullName},
    
    ${earlyNotificationText}${proratedTextInfo}Your ${proratedDays !== null ? `prorated (${proratedDays} days)` : 'monthly'} payment of €${originalAmount} for ${contract.affiliate.name} is due.${creditText}
    
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
        body: emailHtmlBody,
        text: emailTextBody,
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