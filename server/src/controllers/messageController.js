// controllers/messageController.js

const {PrismaClient} = require("@prisma/client");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Initsialiseerime Prisma klient
const prisma = new PrismaClient();

// Seadistame SendGrid API võtme
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMessage = async (req, res) => {
        try {
            let {recipientType, groupName, senderId, recipientId, subject, body} = req.body;

            const htmlContent = `
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      /* Näiteks inline CSS, mis on vajalik e-kirja kujundamiseks */
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


            let groupIds = 0;

            if (recipientType === 'user') {
                // 2. Otsi kasutaja email, kui recipientId on olemas
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
                    // Kui ei ole adressaati, pane test@... või viska viga
                    recipientEmail = "test@example.com";
                }

                // 3. Valmista SendGrid sõnum
                const msg = {
                    to: recipientEmail,
                    from: "noreply@sanderprii.me", // PEAB olema SendGridis verifitseeritud domeen/aadress
                    subject: subject,
                    text: body,
                    html: `<p style="white-space: pre-wrap;">${body}</p>`,
                };

                // 4. Saada kiri SendGridi kaudu
                await sgMail.send(msg);
            }

            if (recipientType === 'group') {
                // 2. Otsi grupi liikmed
                const groupId = await prisma.messageGroup.findFirst({
                    where: {groupName: groupName, affiliateId: senderId},
                })

                groupIds = groupId.id;
                const groupMembers = await prisma.userMessageGroup.findMany({
                    where: {groupId: groupId.id},
                    include: {user: true},
                });

                // 3. Saada kõigile grupi liikmetele kiri
                for (const member of groupMembers) {
                    const msg = {
                        to: member.user.email,
                        from: "noreply@sanderprii.me",
                        subject: subject,
                        text: body,
                        html: `<p style="white-space: pre-wrap;">${body}</p>`,
                    };
                    await sgMail.send(msg);
                }
            }


            if (recipientType === "allMembers") {
                const affiliateMembers = await prisma.members.findMany({
                    where: {affiliateId: senderId},
                    include: {user: true},
                });

                for (const member of affiliateMembers) {
                    const msg = {
                        to: member.user.email,
                        from: "noreply@sanderprii.me",

                        subject: subject,
                        text: body, // tekstiline versioon
                        html: htmlContent,
                    };
                    await sgMail.send(msg);
                }
            }

            if (recipientType === 'group') {
                recipientId = groupIds;
            }

            if (recipientType === "allMembers") {
                recipientId = 0;
            }

            // 1. Salvestame teate andmebaasi
            const savedMessage = await prisma.message.create({
                data: {
                    recipientType,
                    affiliateId: senderId,
                    recipientId,
                    subject,
                    body,
                },
            });

            res.status(200).json({
                message: "Email sent successfully",
                savedMessage,
            });
        } catch
            (error) {
            console.error("Error sending email:", error);
            res.status(500).json({error: "Failed to send email"});
        }
    }
;


const getAllMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany();

        // iga message.userId kohta leia user.fullName
        for (const message of messages) {
            const user = await prisma.user.findUnique({
                where: {id: message.recipientId},
            });
            message.recipientFullName = user.fullName;
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

        // Leia sõnumid, mis kuuluvad sellele affiliate’ile
        // Samuti include recipient user
        const messages = await prisma.message.findMany({
            where: {affiliateId: parseInt(affiliate)},

            orderBy: {
                createdAt: 'desc',
            },
        });

        // leia iga messages.recipientId kohta user.fullName ja lisa see iga message objekti sisse
        for (const message of messages) {
            if (message.recipientType === 'group') {
                const groupName = await prisma.messageGroup.findUnique({
                    where: {id: message.recipientId},
                });
                message.fullName = groupName.groupName;

                continue;

            } else if (message.recipientType === 'user') {
                const user = await prisma.user.findUnique({
                    where: {id: message.recipientId},
                });


                message.fullName = user.fullName;
            }
        }


        // Vormindame vastuse: lisame recipientFullName, jms
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

module.exports = {
    // eelnevalt defined sendMessage, getAllMessages, ...
    sendMessage,
    getAllMessages,
    getSentMessages, // <-- ekspordime
};
