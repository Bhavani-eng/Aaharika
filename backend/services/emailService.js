const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[Email skipped - no config] To: ${to}, Subject: ${subject}`);
    return { success: true, skipped: true };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: 'panda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D97706;">Welcome to Aaharika!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining Aaharika as a <strong>${user.role}</strong>. Together we're reducing food waste and feeding those in need.</p>
        <p style="color: #2F855A;">From Excess to Access</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  return sendEmail({
    to: user.email,
    subject: 'Aaharika - Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D97706;">Password Reset</h1>
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      </div>
    `,
  });
};

const sendDonationNotificationEmail = async (user, donation) => {
  return sendEmail({
    to: user.email,
    subject: `New Donation Available: ${donation.foodName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D97706;">New Food Donation</h1>
        <p><strong>${donation.foodName}</strong> is now available.</p>
        <p>Quantity: ${donation.quantity} | Servings: ${donation.servings}</p>
        <p>Location: ${donation.pickupLocation?.address}</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendDonationNotificationEmail,
};
