const { PrismaClient } = require("@prisma/client");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initialize Prisma client
const prisma = new PrismaClient();

// MailerSend configuration
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Create sender
const defaultSender = new Sender("noreply@irontrack.ee", "IronTrack");

// Set logo path
const logoPath = path.join(__dirname, "../controllers/logo2.png");

// Email sending function via MailerSend
const sendEmailViaMailerSend = async (params) => {
    try {


        const emailParams = new EmailParams()
            .setFrom(params.from)
            .setTo(params.recipients)
            .setReplyTo(params.replyTo)
            .setSubject(params.subject)
            .setHtml(params.html)
            .setText(params.text);

        // Add logo as attachment if exists
        try {
            if (fs.existsSync(logoPath)) {
                const logoAttachment = fs.readFileSync(logoPath);
                const base64Logo = logoAttachment.toString('base64');

                // Use setAttachments for logo
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

const sendMessage = async ({ recipientType, senderId, recipientId, subject, body, affiliateEmail, text }) => {
    try {
        // Create HTML content using the template and body content (which is now HTML)
        const htmlContent = `
<!DOCTYPE html>
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
      <p>© ${new Date().getFullYear()} IronTrack. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
      
      <div class="social-links">
        <a href="#">FB</a>
        <a href="#">IG</a>
        <a href="#">LinkedIn</a>
      </div>
      
      <p>IronTrack - Sports Club Management Platform</p>
    </div>
  </div>
</body>
</html>`;

        if (recipientType === 'user') {
            // Find user's email
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

            // Prepare MailerSend email
            const params = {
                from: defaultSender,
                recipients: [new Recipient(recipientEmail)],
                replyTo: new Sender(affiliateEmail, "Reply To"),
                subject: subject,
                html: htmlContent,
                text: text || body.replace(/<[^>]*>/g, '') // Use provided text or strip HTML tags
            };

            // Send email via MailerSend
            await sendEmailViaMailerSend(params);
        }

        // Save message to database
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