const { PrismaClient } = require("@prisma/client");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
require("dotenv").config();

// Initsialiseerime Prisma kliendi
const prisma = new PrismaClient();

// MailerSend seadistus
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Loome saatja
const defaultSender = new Sender("noreply@irontrack.ee", "IronTrack");

// E-kirja saatmise funktsioon MailerSend kaudu
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

const sendMessage = async ({ recipientType, senderId, recipientId, subject, body, affiliateEmail }) => {
    try {
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
              <p style="white-space: pre-wrap;">${body}</p>
            </div>
            <div class="footer">
              <p>See on automaatne teade, palun ära vasta sellele.</p>
            </div>
          </div>
        </body>
      </html>
    `;

        if (recipientType === 'user') {
            // Otsi kasutaja email
            let recipientEmail = null;
            if (recipientId) {
                const recipientUser = await prisma.user.findUnique({
                    where: { id: recipientId },
                });
                if (!recipientUser) {
                    throw new Error("Recipient user not found in the database.");
                }
                recipientEmail = recipientUser.email;
            } else {
                throw new Error("Recipient ID is required.");
            }

            // Valmista MailerSend e-kiri
            const params = {
                from: defaultSender,
                recipients: [new Recipient(recipientEmail)],
                replyTo: new Sender(affiliateEmail, "Reply To"),
                subject: subject,
                html: htmlContent,
                text: body
            };

            // Saada e-kiri MailerSend kaudu
            await sendEmailViaMailerSend(params);
        }

        // Salvesta teade andmebaasi
        const savedMessage = await prisma.message.create({
            data: {
                recipientType,
                affiliateId: senderId,
                recipientId,
                subject,
                body,
            },
        });

        return { success: true, savedMessage };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {
    sendMessage
};