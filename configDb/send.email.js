const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    console.log(email, subject, message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_APP_PASSWORD,
      }
    });
    const info = await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject,
      text: message,
    });
    console.log("Email sent successfully",info.response);
    return true;
  } catch (error) {
    console.log("error:", error.message);
    return false;
  }
};

module.exports = { sendEmail };
