const { PrismaClient } = require("@prisma/client");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

            // Valmista SendGrid sõnum
            const msg = {
                to: recipientEmail,
                from: {
                    email: "noreply@irontrack.ee",
                    name: "IronTrack",
                },
                replyTo: affiliateEmail,
                subject: subject,
                text: body,
                html: htmlContent,
            };

            // Saada kiri SendGridi kaudu
            await sgMail.send(msg);
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