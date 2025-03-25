const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");
require("dotenv").config();

// Initialize MailerSend with API key from environment variables
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Create default sender (same as your app uses)
const defaultSender = new Sender("info@irontrack.ee", "IronTrack Tests");

/**
 * Sends a test failure report via email
 * @param {string} testName - Name of the failed test
 * @param {Error} error - Error object caught during the test
 * @param {Object} testDetails - Additional details about the test environment, request/response, etc.
 * @returns {Promise<boolean>} - Returns true if email was sent successfully
 */
const sendTestFailureReport = async (testName, error, testDetails = {}) => {
    try {
        // Create the error message content
        const errorStack = error?.stack || "No stack trace available";
        const errorMessage = error?.message || "Unknown error";

        // Format the email content with HTML
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px;">
        <h1 style="color: #d32f2f; background-color: #ffebee; padding: 15px; border-radius: 5px;">
          Test Failure Report: ${testName}
        </h1>
        
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #d32f2f;">
          <h2>Error Message:</h2>
          <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${errorMessage}</pre>
          
          <h2>Stack Trace:</h2>
          <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap; overflow-x: auto;">${errorStack}</pre>
        </div>
        
        <div style="margin: 20px 0;">
          <h2>Test Details:</h2>
          <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap;">${JSON.stringify(testDetails, null, 2)}</pre>
        </div>
        
        <div style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
          <p>This is an automated message from the IronTrack test suite.</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      </div>
    `;

        const textContent = `
TEST FAILURE REPORT: ${testName}

ERROR MESSAGE:
${errorMessage}

STACK TRACE:
${errorStack}

TEST DETAILS:
${JSON.stringify(testDetails, null, 2)}

This is an automated message from the IronTrack test suite.
Time: ${new Date().toISOString()}
    `;

        // Create email params
        const emailParams = new EmailParams()
            .setFrom(defaultSender)
            .setTo([new Recipient("prii.sander@gmail.com")])
            .setSubject(`[IronTrack Test Failure] ${testName}`)
            .setHtml(htmlContent)
            .setText(textContent);

        // Send the email
        const response = await mailerSend.email.send(emailParams);
        console.log("Test failure report email sent successfully:", response);
        return true;
    } catch (error) {
        console.error("Failed to send test failure report email:", error);
        return false;
    }
};

module.exports = {
    sendTestFailureReport,
};