// controllers/messageController.js

const { PrismaClient } = require("@prisma/client");
const AWS = require("aws-sdk");
require("dotenv").config();

// Initsialiseerime Prisma klient
const prisma = new PrismaClient();

// Amazon SES seadistus
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Loome SES teenuse objekti
const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// Lihtsustatud e-kirja saatmise funktsioon otse SES kaudu (ilma Nodemailer'ita)
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

// Express controller - HTTP päringu töötlemine
const sendMessage = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        // Ekstraktime andmed req.body objektist
        let {recipientType, groupName, senderId, recipientId, subject, body, affiliateEmail} = req.body;

        // Loome HTML sisu - UPDATED to directly include body HTML
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
                    where: {id: recipientId},
                });
                if (!recipientUser) {
                    return res
                        .status(404)
                        .json({error: "Recipient user not found in the database."});
                }
                recipientEmail = recipientUser.email;
            } else {
                recipientEmail = "test@example.com"; // Või viska viga
            }


            // Valmista SES e-kiri (ilma Nodemailer'ita)
            const params = {
                Source: "info@irontrack.ee", // Peab olema SES-is verifitseeritud
                Destination: {
                    ToAddresses: [recipientEmail] // Testimiseks - muuda hiljem: recipientEmail
                },
                ReplyToAddresses: [affiliateEmail],
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF-8"
                    },
                    Body: {
                        Text: {
                            Data: body.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
                            Charset: "UTF-8"
                        },
                        Html: {
                            Data: htmlContent,
                            Charset: "UTF-8"
                        }
                    }
                }
            };

            try {
                // Saada e-kiri otse Amazon SES kaudu
                await sendEmailViaSES(params);
            } catch (emailError) {
                console.error("E-kirja saatmine ebaõnnestus:", emailError);
                // Jätkame andmebaasi salvestamisega
            }
        }

        if (recipientType === 'group') {
            // 2. Otsi grupi liikmed
            const groupId = await prisma.messageGroup.findFirst({
                where: {groupName: groupName, affiliateId: senderId},
            });

            if (!groupId) {
                return res
                    .status(404)
                    .json({error: "Group not found in the database."});
            }

            // Määrame finalRecipientId grupi ID-ks
            finalRecipientId = groupId.id;

            const groupMembers = await prisma.userMessageGroup.findMany({
                where: {groupId: groupId.id},
                include: {user: true},
            });

            // 3. Saada kõigile grupi liikmetele kiri
            for (const member of groupMembers) {
                const params = {
                    Source: "info@irontrack.ee", // Peab olema SES-is verifitseeritud
                    Destination: {
                        ToAddresses: [member.user.email] // Testimiseks - muuda hiljem: member.user.email
                    },
                    ReplyToAddresses: [affiliateEmail],
                    Message: {
                        Subject: {
                            Data: subject,
                            Charset: "UTF-8"
                        },
                        Body: {
                            Text: {
                                Data: body.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
                                Charset: "UTF-8"
                            },
                            Html: {
                                Data: htmlContent,
                                Charset: "UTF-8"
                            }
                        }
                    }
                };

                try {
                    await sendEmailViaSES(params);
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
                where: {affiliateId: senderId},
                include: {user: true},
            });

            for (const member of affiliateMembers) {
                // TESTIMISEKS: Kasuta ainult kinnitatud e-posti aadresse
                const params = {
                    Source: "info@irontrack.ee", // Peab olema SES-is verifitseeritud
                    Destination: {
                        ToAddresses: [member.user.email] // Testimiseks - muuda hiljem: member.user.email
                    },
                    ReplyToAddresses: [affiliateEmail],
                    Message: {
                        Subject: {
                            Data: subject,
                            Charset: "UTF-8"
                        },
                        Body: {
                            Text: {
                                Data: body.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
                                Charset: "UTF-8"
                            },
                            Html: {
                                Data: htmlContent,
                                Charset: "UTF-8"
                            }
                        }
                    }
                };

                try {
                    await sendEmailViaSES(params);
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
        res.status(500).json({error: "Failed to send email"});
    }
};

// Ülejäänud funktsioonid jäävad samaks
const getAllMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany();

        for (const message of messages) {
            const user = await prisma.user.findUnique({
                where: {id: message.recipientId},
            });
            message.recipientFullName = user ? user.fullName : "All Members";
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({error: "Failed to fetch messages"});
    }
};

const getSentMessages = async (req, res) => {
    try {
        const user = parseInt(req.user?.id);
        const affiliate = req.query.affiliate

        const messages = await prisma.message.findMany({
            where: {affiliateId: parseInt(affiliate)},
            orderBy: {
                createdAt: 'desc',
            },
        });

        for (const message of messages) {
            if (message.recipientType === 'group') {
                const groupName = await prisma.messageGroup.findUnique({
                    where: {id: message.recipientId},
                });
                message.fullName = groupName ? groupName.groupName : "Unknown Group";
                continue;
            } else if (message.recipientType === 'user') {
                const user = await prisma.user.findUnique({
                    where: {id: message.recipientId},
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
        res.status(500).json({error: 'Failed to get sent messages'});
    }
};

const sendMessageToAffiliate = async (req, res) => {
    try {
        const {senderEmail, affiliateEmail, subject, body} = req.body;
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

        // TESTIMISEKS: Kasuta ainult kinnitatud e-posti aadresse
        const testingEmail = process.env.VERIFIED_EMAIL || "info@irontrack.ee";

        const params = {
            Source: "IronTrack <info@irontrack.ee>", // Peab olema SES-is verifitseeritud
            Destination: {
                ToAddresses: [testingEmail] // Testimiseks - muuda hiljem: affiliateEmail
            },
            ReplyToAddresses: [senderEmail],
            Message: {
                Subject: {
                    Data: subject,
                    Charset: "UTF-8"
                },
                Body: {
                    Text: {
                        Data: body.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
                        Charset: "UTF-8"
                    },
                    Html: {
                        Data: htmlContent,
                        Charset: "UTF-8"
                    }
                }
            }
        };

        try {
            await sendEmailViaSES(params);
        } catch (emailError) {
            console.error("E-kirja saatmine ebaõnnestus:", emailError);
            // Jätkame vastuse saatmisega
        }

        res.status(200).json({message: "Email sent successfully"});
    } catch (error) {
        console.error("Error sending email to affiliate:", error);
        res.status(500).json({error: "Failed to send email to affiliate"});
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getSentMessages,
    sendMessageToAffiliate,
};