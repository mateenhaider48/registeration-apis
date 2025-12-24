// sendEmail.js

const { Resend } = require("resend");

// Initialize with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, message) => {
  console.log("Resend email called with:", email, subject, message);

  try {
    // Use Resend's free default test sender for development
    const { data, error } = await resend.emails.send({
  from: "YourApp Support <test@resend.dev>", // professional sender name
  to: email,
  subject: subject,
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #1a73e8;">${subject}</h2>
      <p>Hi,</p>
      <p>${message}</p>
      
      <div style="margin: 20px 0; padding: 10px 20px; background-color: #f2f2f2; display: inline-block; border-radius: 5px; font-weight: bold; font-size: 18px;">
        ${message.includes('code') ? message.split('code')[1] : ''}
      </div>
      
      <p>If you did not request this, please ignore this email.</p>
      
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} YourApp. All rights reserved.<br>
        Contact us at <a href="mailto:support@yourapp.com">support@yourapp.com</a>
      </p>
    </div>
  `,
});


    if (error) {
      console.error("Resend API error:", error);
      return false;
    }

    console.log("Email sent via Resend, id:", data.id);
    return true;
  } catch (err) {
    console.error("Resend exception:", err);
    return false;
  }
};

module.exports = { sendEmail };
