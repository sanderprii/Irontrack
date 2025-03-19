const { PrismaClient } = require("@prisma/client");
const AWS = require("aws-sdk");
require("dotenv").config();

// Initsialiseerime Prisma kliendi
const prisma = new PrismaClient();

// Amazon SES seadistus
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Loome SES teenuse objekti
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// E-kirja saatmise funktsioon SES kaudu
const sendEmailViaSES = async (params) => {
    try {
        console.log("Saadan e-kirja SES kaudu:", params.Destination.ToAddresses);
        const data = await ses.sendEmail(params).promise();
        console.log("E-kiri edukalt saadetud:", data.MessageId);
        return data;
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

            // Valmista SES e-kiri
            const params = {
                Source: "noreply@irontrack.ee", // Peab olema SES-is verifitseeritud
                Destination: {
                    ToAddresses: [recipientEmail]
                },
                ReplyToAddresses: [affiliateEmail],
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF-8"
                    },
                    Body: {
                        Text: {
                            Data: body,
                            Charset: "UTF-8"
                        },
                        Html: {
                            Data: htmlContent,
                            Charset: "UTF-8"
                        }
                    }
                }
            };

            // Saada e-kiri Amazon SES kaudu
            await sendEmailViaSES(params);
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