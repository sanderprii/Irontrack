// controllers/messageController.js

const { PrismaClient } = require("@prisma/client");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initsialiseerime Prisma klient
const prisma = new PrismaClient();

// MailerSend seadistus
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Loome saatja
const defaultSender = new Sender("info@irontrack.ee", "IronTrack");

// Logo faili sisselugemine attachmendina
const logoPath = path.join(__dirname, "logo2.png");

// E-kirja mall
const createEmailTemplate = (subject, body) => {
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* General style */
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    /* Email container */
    .email-container {
      max-width: 600px;
      margin: auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Logo area */
    .logo-area {
      background-color: #ffffff;
      padding: 15px;
      text-align: center;
    }
    
    .logo-area img {
      height: 40px;
    }
    
    /* Header */
    .header {
      background: linear-gradient(to right, #1a1a1a, #2d2d2d);
      color: white;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #d4af37; /* Golden line */
    }
    
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    /* Content */
    .content {
      padding: 30px 25px;
      background-color: white;
      color: #333;
    }
    
    /* CTA button */
    .cta-button {
      display: inline-block;
      margin: 20px 0;
      padding: 12px 25px;
      background-color: #d4af37; /* Golden/yellow color */
      color: #1a1a1a;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      text-align: center;
    }
    
    /* Footer */
    .footer {
      background-color: #1a1a1a;
      color: #999;
      padding: 15px;
      text-align: center;
      font-size: 12px;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    .social-links {
      margin: 10px 0;
    }
    
    .social-links a {
      color: #d4af37;
      margin: 0 10px;
      text-decoration: none;
    }
    
    /* Mobile optimization */
    @media screen and (max-width: 600px) {
      .header h1 {
        font-size: 20px;
      }
      
      .content {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Logo area -->
    <div class="logo-area">
      <img src="cid:logo" alt="IronTrack Logo" />
    </div>
    
    <!-- Header -->
    <div class="header">
      <h1>${subject}</h1>
    </div>
    
    <!-- Content -->
    <div class="content">
      ${body}
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>© ${currentYear} IronTrack. All rights reserved.</p>
      
      
      
      
      <p>IronTrack - Sports Club Management Platform</p>
    </div>
  </div>
</body>
</html>`;
};

// Lihtsustatud e-kirja saatmise funktsioon MailerSend kaudu
const sendEmailViaMailerSend = async (params) => {
    try {


        // Create EmailParams object
        const emailParams = new EmailParams()
            .setFrom(params.from)
            .setTo(params.recipients)
            .setReplyTo(params.replyTo)
            .setSubject(params.subject)
            .setHtml(params.html)
            .setText(params.text);

        // Try to add logo attachment if exists
        try {
            if (fs.existsSync(logoPath)) {
                const logoAttachment = fs.readFileSync(logoPath);
                const base64Logo = logoAttachment.toString('base64');

                // Use the correct method based on MailerSend library
                // For newer versions, use setAttachments
                emailParams.setAttachments([
                    {
                        content: base64Logo,
                        filename: 'logo2.png',
                        disposition: 'inline',
                        id: 'logo'
                    }
                ]);

            } else {
                console.log("Logo file not found at:", logoPath);
            }
        } catch (logoError) {
            console.error("Error adding logo:", logoError);
            // Continue sending the email without logo
        }

        const response = await mailerSend.email.send(emailParams);

        return response;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};

// Express controller - HTTP request processing
const sendMessage = async (req, res) => {
    try {


        // Extract data from req.body object
        let { recipientType, groupName, senderId, recipientId, subject, body, affiliateEmail } = req.body;

        // Create HTML content using new template
        const htmlContent = createEmailTemplate(subject, body);

        // Default value for recipientId
        let finalRecipientId = recipientId;

        if (recipientType === 'user') {
            // Find user email
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
                recipientEmail = "test@example.com"; // Or throw an error
            }

            // Prepare MailerSend email
            const params = {
                from: defaultSender,
                recipients: [new Recipient(recipientEmail)],
                replyTo: new Sender(affiliateEmail, "Reply To"),
                subject: subject,
                html: htmlContent,
                text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
            };

            try {
                // Send email via MailerSend
                await sendEmailViaMailerSend(params);
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
                // Continue with database saving
            }
        }

        if (recipientType === 'group') {
            // 2. Find group members
            const groupId = await prisma.messageGroup.findFirst({
                where: { groupName: groupName, affiliateId: senderId },
            });

            if (!groupId) {
                return res
                    .status(404)
                    .json({ error: "Group not found in the database." });
            }

            // Set finalRecipientId to group ID
            finalRecipientId = groupId.id;

            const groupMembers = await prisma.userMessageGroup.findMany({
                where: { groupId: groupId.id },
                include: { user: true },
            });

            // 3. Send email to all group members
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
                    console.error("Failed to send email to group member:", emailError);
                    // Continue with remaining members
                }
            }
        }

        if (recipientType === "allMembers") {
            // Set finalRecipientId to 0 for allMembers type
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
                    console.error("Failed to send email to member:", emailError);
                    // Continue with remaining members
                }
            }
        }



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

// Täienda samamoodi sendMessageToAffiliate funktsioon
const sendMessageToAffiliate = async (req, res) => {
    try {
        const { senderEmail, affiliateEmail, subject, body } = req.body;

        // Use new HTML template
        const htmlContent = createEmailTemplate(subject, body);

        // Testing email
        const testingEmail = process.env.VERIFIED_EMAIL || "info@irontrack.ee";

        const params = {
            from: defaultSender,
            recipients: [new Recipient(testingEmail)], // For testing - change later to: affiliateEmail
            replyTo: new Sender(senderEmail, "Reply To"),
            subject: subject,
            html: htmlContent,
            text: body.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
        };

        try {
            await sendEmailViaMailerSend(params);
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // Continue with response
        }

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email to affiliate:", error);
        res.status(500).json({ error: "Failed to send email to affiliate" });
    }
};

// Ülejäänud funktsioonid jäävad samaks
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
        const affiliate = req.query.affiliate;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';

        const skip = (page - 1) * limit;

        // Baas WHERE tingimus
        const whereCondition = {
            affiliateId: parseInt(affiliate),
        };

        // 1. Kõigepealt toome kõik kirjad (ilma limitita), et teha korralik otsing
        const allMessages = await prisma.message.findMany({
            where: whereCondition,
            orderBy: {
                createdAt: 'desc',
            },
        });

        // 2. Lisame saajate täisnimed ja puhastame HTML
        const enrichedMessages = await Promise.all(allMessages.map(async (message) => {
            let recipientFullName = '';
            let groupName = null;

            if (message.recipientType === 'group') {
                const group = await prisma.messageGroup.findUnique({
                    where: { id: message.recipientId },
                });
                recipientFullName = group ? group.groupName : "Tundmatu grupp";
                groupName = recipientFullName;
            } else if (message.recipientType === 'user') {
                const user = await prisma.user.findUnique({
                    where: { id: message.recipientId },
                });
                recipientFullName = user ? user.fullName : "Tundmatu kasutaja";
            } else if (message.recipientType === 'allMembers') {
                recipientFullName = "Kõik liikmed";
            }

            // Puhastame HTML
            let processedBody = message.body
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p><p>/gi, '\n\n')
                .replace(/<div><\/div>/gi, '\n')
                .replace(/<\/div><div>/gi, '\n');
            processedBody = processedBody.replace(/<[^>]*>/g, '');

            return {
                id: message.id,
                subject: message.subject,
                body: processedBody,
                createdAt: message.createdAt,
                recipientId: message.recipientId,
                recipientFullName,
                recipientType: message.recipientType,
                groupName
            };
        }));

        // 3. Filtreerimine otsingutermini järgi
        const filteredMessages = search
            ? enrichedMessages.filter(msg =>
                (msg.recipientFullName && msg.recipientFullName.toLowerCase().includes(search.toLowerCase())) ||
                (msg.subject && msg.subject.toLowerCase().includes(search.toLowerCase())) ||
                (msg.body && msg.body.toLowerCase().includes(search.toLowerCase()))
            )
            : enrichedMessages;

        // 4. Leheküljestamine
        const totalCount = filteredMessages.length;
        const totalPages = Math.ceil(totalCount / limit);

        // 5. Valime ainult praegusele lehele kuuluvad kirjad
        const startIndex = (page - 1) * limit;
        const paginatedMessages = filteredMessages.slice(startIndex, startIndex + limit);

        res.json({
            messages: paginatedMessages,
            pagination: {
                total: totalCount,
                page,
                limit,
                pages: totalPages
            }
        });
    } catch (error) {
        console.error('Error in getSentMessages:', error);
        res.status(500).json({ error: 'Failed to get sent messages' });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getSentMessages,
    sendMessageToAffiliate,
};