require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendPasswordResetEmail(to, resetToken) {
  const resetLink = `http://localhost:8080/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetLink}`
  };

  await transporter.sendMail(mailOptions);
  console.log('📧 Email sent to', to);
}

module.exports = { sendPasswordResetEmail };
