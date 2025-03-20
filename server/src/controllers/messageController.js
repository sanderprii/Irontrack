// controllers/messageController.js

const { PrismaClient } = require("@prisma/client");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
require("dotenv").config();

// Initsialiseerime Prisma klient
const prisma = new PrismaClient();

// MailerSend seadistus
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Loome saatja
const defaultSender = new Sender("info@irontrack.ee", "IronTrack");

// Lihtsustatud e-kirja saatmise funktsioon MailerSend kaudu
const sendEmailViaMailerSend = async (params) => {
    try {
        console.log("Saadan e-kirja MailerSend kaudu:", params.recipients);

        const emailParams = new EmailParams()
            .setFrom(params.from)
            .setTo(params.recipients)
            .setReplyTo(params.replyTo)
            .setSubject(params.subject)
            .setHtml(params.html)
            .setText(params.text);

        const response = await mailerSend.email.send(emailParams);
        console.log("E-kiri edukalt saadetud:", response);
        return response;
    } catch (error) {
        console.error("E-kirja saatmine ebaõnnestus:", error);
        throw error;
    }
};

// Express controller - HTTP päringu töötlemine
const sendMessage = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        // Ekstraktime andmed req.body objektist
        let { recipientType, groupName, senderId, recipientId, subject, body, affiliateEmail } = req.body;

        // Loome HTML sisu
        const htmlContent = `
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      .email-container {
        max-width: 600px;
        margin: auto;
        font-family: Arial, sans-serif;
      }
      .header {
        background: #4CAF50;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
        justify-content: center;
        align-items: center;
      }
      .footer {
        background: #f4f4f4;
        color: #555;
        padding: 10px;
        text-align: center;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>${subject}</h1>
      </div>
      <div class="content">
        ${body}
      </div>
      <div class="footer">
        <p>See on automaatne teade, palun ära vasta sellele.</p>
      </div>
    </div>
  </body>
</html>
`;

        // Vaikimisi väärtus recipientId-le
        let finalRecipientId = recipientId;

        if (recipientType === 'user') {
            // Otsi kasutaja email
            let recipientEmail = null;
            if (recipientId) {
                const recipientUser = await prisma.user.findUnique({
                    where: { id: recipientId },
                });
                if (!recipientUser) {
                    return res
                        .status(404)
                        .json({ error: "Recipient user not found in the database." });
                }
                recipientEmail = recipientUser.email;
            } else {
                recipientEmail = "test@example.com"; // Või viska viga
            }

            // Valmista MailerSend e-kiri
            const params = {
                from: defaultSender,
                recipients: [new Recipient(recipientEmail)],
                replyTo: new Sender(affiliateEmail, "Reply To"),
                subject: subject,
                html: htmlContent,
                text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
            };

            try {
                // Saada e-kiri MailerSend kaudu
                await sendEmailViaMailerSend(params);
            } catch (emailError) {
                console.error("E-kirja saatmine ebaõnnestus:", emailError);
                // Jätkame andmebaasi salvestamisega
            }
        }

        if (recipientType === 'group') {
            // 2. Otsi grupi liikmed
            const groupId = await prisma.messageGroup.findFirst({
                where: { groupName: groupName, affiliateId: senderId },
            });

            if (!groupId) {
                return res
                    .status(404)
                    .json({ error: "Group not found in the database." });
            }

            // Määrame finalRecipientId grupi ID-ks
            finalRecipientId = groupId.id;

            const groupMembers = await prisma.userMessageGroup.findMany({
                where: { groupId: groupId.id },
                include: { user: true },
            });

            // 3. Saada kõigile grupi liikmetele kiri
            for (const member of groupMembers) {
                const params = {
                    from: defaultSender,
                    recipients: [new Recipient(member.user.email)],
                    replyTo: new Sender(affiliateEmail, "Reply To"),
                    subject: subject,
                    html: htmlContent,
                    text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
                };

                try {
                    await sendEmailViaMailerSend(params);
                } catch (emailError) {
                    console.error("E-kirja saatmine grupiliikmele ebaõnnestus:", emailError);
                    // Jätka ülejäänud liikmetega
                }
            }
        }

        if (recipientType === "allMembers") {
            // Määrame finalRecipientId väärtuseks 0 allMembers tüübi jaoks
            finalRecipientId = 0;

            const affiliateMembers = await prisma.members.findMany({
                where: { affiliateId: senderId },
                include: { user: true },
            });

            for (const member of affiliateMembers) {
                const params = {
                    from: defaultSender,
                    recipients: [new Recipient(member.user.email)],
                    replyTo: new Sender(affiliateEmail, "Reply To"),
                    subject: subject,
                    html: htmlContent,
                    text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
                };

                try {
                    await sendEmailViaMailerSend(params);
                } catch (emailError) {
                    console.error("E-kirja saatmine liikmele ebaõnnestus:", emailError);
                    // Jätka ülejäänud liikmetega
                }
            }
        }

        // Salvesta teade andmebaasi - ainult üks kord
        console.log("Salvestan andmebaasi:", {
            recipientType,
            affiliateId: senderId,
            recipientId: finalRecipientId,
            subject,
            body
        });

        const savedMessage = await prisma.message.create({
            data: {
                recipientType,
                affiliateId: senderId,
                recipientId: finalRecipientId,
                subject,
                body,
            },
        });

        res.status(200).json({
            message: "Email sent successfully",
            savedMessage,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

// Ülejäänud funktsioonid
const getAllMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany();

        for (const message of messages) {
            const user = await prisma.user.findUnique({
                where: { id: message.recipientId },
            });
            message.recipientFullName = user ? user.fullName : "All Members";
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

const getSentMessages = async (req, res) => {
    try {
        const user = parseInt(req.user?.id);
        const affiliate = req.query.affiliate

        const messages = await prisma.message.findMany({
            where: { affiliateId: parseInt(affiliate) },
            orderBy: {
                createdAt: 'desc',
            },
        });

        for (const message of messages) {
            if (message.recipientType === 'group') {
                const groupName = await prisma.messageGroup.findUnique({
                    where: { id: message.recipientId },
                });
                message.fullName = groupName ? groupName.groupName : "Unknown Group";
                continue;
            } else if (message.recipientType === 'user') {
                const user = await prisma.user.findUnique({
                    where: { id: message.recipientId },
                });
                message.fullName = user ? user.fullName : "Unknown User";
            } else if (message.recipientType === 'allMembers') {
                message.fullName = "All Members";
            }
        }

        const result = messages.map((msg) => {
            return {
                id: msg.id,
                subject: msg.subject,
                body: msg.body,
                createdAt: msg.createdAt,
                recipientId: msg.recipientId,
                recipientFullName: msg.fullName,
                recipientType: msg.recipientType,
                body: msg.body,
            };
        });

        res.json(result);
    } catch (error) {
        console.error('Error in getSentMessages:', error);
        res.status(500).json({ error: 'Failed to get sent messages' });
    }
};

const sendMessageToAffiliate = async (req, res) => {
    try {
        const { senderEmail, affiliateEmail, subject, body } = req.body;
        const htmlContent = `
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      .email-container {
        max-width: 600px;
        margin: auto;
        font-family: Arial, sans-serif;
      }
      .header {
        background: #4CAF50;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
        justify-content: center;
        align-items: center;
      }
      .footer {
        background: #f4f4f4;
        color: #555;
        padding: 10px;
        text-align: center;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>${subject}</h1>
      </div>
      <div class="content">
        ${body}
      </div>
      <div class="footer">
        <p>See on automaatne teade, palun ära vasta sellele.</p>
      </div>
    </div>
  </body>
</html>
`;

        // Saaja email testimiseks
        const testingEmail = process.env.VERIFIED_EMAIL || "info@irontrack.ee";

        const params = {
            from: defaultSender,
            recipients: [new Recipient(testingEmail)], // Testimiseks - muuda hiljem: affiliateEmail
            replyTo: new Sender(senderEmail, "Reply To"),
            subject: subject,
            html: htmlContent,
            text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
        };

        try {
            await sendEmailViaMailerSend(params);
        } catch (emailError) {
            console.error("E-kirja saatmine ebaõnnestus:", emailError);
            // Jätkame vastuse saatmisega
        }

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email to affiliate:", error);
        res.status(500).json({ error: "Failed to send email to affiliate" });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getSentMessages,
    sendMessageToAffiliate,
};