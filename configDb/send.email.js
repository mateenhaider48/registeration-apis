const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, message) => {

  try {
    
    const { data, error } = await resend.emails.send({
  from: "YourApp Support <test@resend.dev>", 
  to: email,
  subject: subject,
  html:`<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto;">
  <h2 style="color: #1a73e8; margin-bottom: 20px;">${subject}</h2>

  <p>Hi,</p>

  <p>${message}</p>

  ${message.toLowerCase().includes('code') ? `
    <div style="margin: 20px 0; padding: 15px 20px; background-color: #f2f2f2; display: inline-block; border-radius: 5px; font-weight: bold; font-size: 18px; letter-spacing: 1px;">
      ${message.split(/code/i)[1]?.trim() || ''}
    </div>
  ` : ''}

  <p>If you did not request this, please ignore this email.</p>

  <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

  <p style="font-size: 12px; color: #999; line-height: 1.4;">
    &copy; ${new Date().getFullYear()} YourApp. All rights reserved.<br>
    Contact us at <a href="mailto:support@yourapp.com" style="color: #1a73e8; text-decoration: none;">support@yourapp.com</a>
  </p>
</div>`,
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
