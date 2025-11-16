const nodemailer = require('nodemailer');
require('dotenv').config();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = {};

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'johnpauld750@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
const sendOTP = async (email) => {
  try {
    const otp = generateOTP();
    otpStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    await transporter.sendMail({
      from: process.env.GMAIL_USER || 'johnpauld750@gmail.com',
      to: email,
      subject: 'Admin Login OTP - BSIT Graduate Tracer System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #059669; margin-bottom: 20px;">🔐 Admin Login OTP</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Your OTP for admin login is:
            </p>
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #059669; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This OTP will expire in 10 minutes. Do not share this code with anyone.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              If you did not request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `
    });

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

// Verify OTP
const verifyOTP = (email, otp) => {
  const stored = otpStore[email];
  
  if (!stored) {
    return { success: false, message: 'OTP not found. Please request a new one.' };
  }

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (stored.otp !== otp) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  // OTP verified, delete it
  delete otpStore[email];
  return { success: true, message: 'OTP verified successfully' };
};

module.exports = { sendOTP, verifyOTP };




