// Täiendatud lahendus, mis arvestab erinevaid võimalusi logo olemusest

const { PrismaClient } = require("@prisma/client");
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
const path = require("path");
const fs = require("fs");
const axios = require("axios"); // Vajalik URL-ist piltide allalaadimiseks - peate selle installima
require("dotenv").config();

// Initialize Prisma client
const prisma = new PrismaClient();

// MailerSend configuration
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Create sender
const defaultSender = new Sender("noreply@irontrack.ee", "IronTrack");

// Set default logo path
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

        // Add logo as attachment if provided in params
        if (params.attachment) {
            emailParams.setAttachments([params.attachment]);
        }

        const response = await mailerSend.email.send(emailParams);

        return response;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};

/**
 * Hankib affiliate logo vastavalt affiliate.logo väärtusele
 * @param {Object} affiliate - Affiliate objekt
 * @returns {Promise<Object|null>} Logo objekt või null, kui logo ei leitud
 */
const getAffiliateLogo = async (affiliate) => {
    if (!affiliate || !affiliate.logo) return null;

    const logoId = 'logo';

    try {
        // VÕIMALUS 1: Logo on failinimi (kõige tõenäolisem)
        // Kontrolli erinevaid võimalikke asukohti
        const potentialPaths = [
            path.join(__dirname, "../uploads/affiliate-logos", affiliate.logo),
            path.join(__dirname, "../public/logos", affiliate.logo),
            path.join(__dirname, "../assets/logos", affiliate.logo),
            // Lisa siia täiendavaid teid vastavalt vajadusele
        ];

        for (const logoPath of potentialPaths) {
            if (fs.existsSync(logoPath)) {
                const logoFile = fs.readFileSync(logoPath);
                const base64Logo = logoFile.toString('base64');

                return {
                    content: base64Logo,
                    filename: affiliate.logo,
                    disposition: 'inline',
                    id: logoId
                };
            }
        }

        // VÕIMALUS 2: Logo on URL
        if (affiliate.logo.startsWith('http://') || affiliate.logo.startsWith('https://')) {
            try {
                const response = await axios.get(affiliate.logo, { responseType: 'arraybuffer' });
                const base64Logo = Buffer.from(response.data).toString('base64');

                return {
                    content: base64Logo,
                    filename: 'logo.png',
                    disposition: 'inline',
                    id: logoId
                };
            } catch (urlError) {
                console.error("Error downloading logo from URL:", urlError);
                return null;
            }
        }

        // VÕIMALUS 3: Logo on base64 kodeeritud sisu (vähem tõenäoline)
        if (affiliate.logo.startsWith('data:image/')) {
            // Extract base64 content from data URL
            const base64Content = affiliate.logo.split(',')[1];

            return {
                content: base64Content,
                filename: 'logo.png',
                disposition: 'inline',
                id: logoId
            };
        }

        console.log("Could not resolve affiliate logo:", affiliate.logo);
        return null;
    } catch (error) {
        console.error("Error processing affiliate logo:", error);
        return null;
    }
};

/**
 * Hankib vaikimisi logo, kui affiliate logot pole saadaval
 * @returns {Promise<Object|null>} Logo objekt või null, kui vaikimisi logo ei leitud
 */
const getDefaultLogo = async () => {
    try {
        if (fs.existsSync(logoPath)) {
            const defaultLogoFile = fs.readFileSync(logoPath);
            const base64Logo = defaultLogoFile.toString('base64');

            return {
                content: base64Logo,
                filename: 'logo2.png',
                disposition: 'inline',
                id: 'logo'
            };
        } else {
            console.log("Default logo file not found at:", logoPath);
            return null;
        }
    } catch (error) {
        console.error("Error getting default logo:", error);
        return null;
    }
};

const sendMessage = async ({ recipientType, senderId, recipientId, subject, body, affiliateEmail, text }) => {
    try {
        // Create HTML content using the template and body content
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
      <img src="cid:logo" alt="Logo" />
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

        // Find and prepare logo
        let logoAttachment = null;

        // Try to get affiliate logo if senderId is provided
        if (senderId) {
            try {
                // Find the affiliate by ID
                const affiliate = await prisma.affiliate.findUnique({
                    where: { id: senderId },
                });

                // Try to get affiliate logo
                logoAttachment = await getAffiliateLogo(affiliate);
            } catch (error) {
                console.error("Error fetching affiliate data:", error);
            }
        }

        // If affiliate logo not found, use default logo
        if (!logoAttachment) {
            logoAttachment = await getDefaultLogo();
        }

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

            // Prepare email parameters
            const params = {
                from: defaultSender,
                recipients: [new Recipient(recipientEmail)],
                replyTo: new Sender(affiliateEmail, "Reply To"),
                subject: subject,
                html: htmlContent,
                text: text || body.replace(/<[^>]*>/g, '')
            };

            // Add logo attachment if available
            if (logoAttachment) {
                params.attachment = logoAttachment;
            }

            // Send email
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

const sendOrderConfirmation = async (userData, orderDetails, planDetails, affiliateDetails) => {
    try {

        const proratedDays = orderDetails.proratedDays;

        const planDescription = proratedDays
            ? `${planDetails.name} (Prorated for ${proratedDays} days)`
            : planDetails.name;


        // Safety checks
        if (!userData) {
            console.error("Missing user data for email");
            return { success: false, message: "Missing user data" };
        }

        if (!affiliateDetails) {
            console.error("Missing affiliate data for email");
            affiliateDetails = { name: "IronTrack", email: "noreply@irontrack.ee" };
        }

        if (!planDetails) {
            console.error("Missing plan details for email");
            planDetails = { name: "Subscription", price: orderDetails?.amount || 0 };
        }

        if (!orderDetails) {
            console.error("Missing order details for email");
            orderDetails = {
                invoiceNumber: "INV-" + new Date().getTime(),
                amount: 0,
                appliedCredit: 0,
                isContractPayment: false
            };
        }

        // Format price with 2 decimal places
        const formattedPrice = parseFloat(orderDetails.amount).toFixed(2);

        // Create HTML content for invoice-like email
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body, html {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    .email-container {
      max-width: 600px;
      margin: auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .logo-area {
      background-color: #ffffff;
      padding: 15px;
      text-align: center;
    }
    
    .logo-area img {
      height: 40px;
    }
    
    .header {
      background: linear-gradient(to right, #1a1a1a, #2d2d2d);
      color: white;
      padding: 20px;
      text-align: center;
      border-bottom: 3px solid #d4af37;
    }
    
    .content {
      padding: 30px 25px;
      background-color: white;
    }
    
    .invoice-details {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    .invoice-table th, .invoice-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .invoice-table th {
      background-color: #f9f9f9;
    }
    
    .total-row {
      font-weight: bold;
      background-color: #f5f5f5;
    }
    
    .footer {
      background-color: #1a1a1a;
      color: #999;
      padding: 15px;
      text-align: center;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo-area">
      <img src="cid:logo" alt="Logo" />
    </div>
    
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>
    
    <div class="content">
      <div class="invoice-details">
      <p><strong>From:</strong> ${affiliateDetails.name}</p>
        <p><strong>Invoice #:</strong> ${orderDetails.invoiceNumber}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${userData.fullName}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
      </div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${planDescription}</td>
            <td>1</td>
            <td>€${formattedPrice}</td>
            <td>€${formattedPrice}</td>
          </tr>
          ${orderDetails.appliedCredit > 0 ? `
          <tr>
            <td>Applied Credit</td>
            <td></td>
            <td>-€${parseFloat(orderDetails.appliedCredit).toFixed(2)}</td>
            <td>-€${parseFloat(orderDetails.appliedCredit).toFixed(2)}</td>
          </tr>` : ''}
          <tr class="total-row">
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>€${(parseFloat(formattedPrice) - parseFloat(orderDetails.appliedCredit || 0)).toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <p>Thank you for your purchase! Your plan is now active.</p>
      
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} ${affiliateDetails.name || 'IronTrack'}. All rights reserved.</p>
      <p>This is an automatic confirmation of your order.</p>
      <p>If you have any questions, please contact us at ${affiliateDetails.email || 'support@irontrack.ee'}.</p>
    </div>
  </div>
</body>
</html>`;

        // Simple text version as fallback
        const textContent = `
Order Confirmation
Invoice #: ${orderDetails.invoiceNumber}
Date: ${new Date().toLocaleDateString()}
Customer: ${userData.fullName}
Email: ${userData.email}

Item: ${planDetails.name}
Price: €${formattedPrice}
${orderDetails.appliedCredit > 0 ? `Applied Credit: -€${parseFloat(orderDetails.appliedCredit).toFixed(2)}` : ''}
Total: €${(parseFloat(formattedPrice) - parseFloat(orderDetails.appliedCredit || 0)).toFixed(2)}

Thank you for your purchase! Your plan is now active.


© ${new Date().getFullYear()} ${affiliateDetails.name || 'IronTrack'}. All rights reserved.
`;

        // Find and prepare logo
        let logoAttachment = null;

        // Try to get affiliate logo if affiliateDetails.id is provided
        if (affiliateDetails && affiliateDetails.id) {
            try {
                // Find the affiliate by ID (we may already have the data, but let's be sure)
                const affiliate = await prisma.affiliate.findUnique({
                    where: { id: affiliateDetails.id },
                });

                // Try to get affiliate logo
                logoAttachment = await getAffiliateLogo(affiliate);
            } catch (error) {
                console.error("Error fetching affiliate data:", error);
            }
        }

        // If affiliate logo not found, use default logo
        if (!logoAttachment) {
            logoAttachment = await getDefaultLogo();
        }

        // Find affiliate's email (for reply-to)
        const affiliateEmail = affiliateDetails.email || 'noreply@irontrack.ee';

        // Prepare email parameters
        const params = {
            from: defaultSender,
            recipients: [new Recipient(userData.email)],
            replyTo: new Sender(affiliateEmail, affiliateDetails.name || "IronTrack"),
            subject: `Your Order Confirmation - ${affiliateDetails.name}`,
            html: htmlContent,
            text: textContent
        };

        // Add logo attachment if available
        if (logoAttachment) {
            params.attachment = logoAttachment;
        }

        // Send email
        await sendEmailViaMailerSend(params);

        // Save message to database
        await prisma.message.create({
            data: {
                recipientType: 'user',
                affiliateId: affiliateDetails.id,
                recipientId: userData.id,
                subject: "Your Order Confirmation - IronTrack",
                body: htmlContent,
            },
        });

        return { success: true, message: "Order confirmation email sent" };
    } catch (error) {
        console.error("Error sending order confirmation email:", error);
        throw error;
    }
};

module.exports = {
    sendMessage,
    sendOrderConfirmation,
};