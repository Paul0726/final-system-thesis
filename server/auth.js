const nodemailer = require('nodemailer');
require('dotenv').config();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = {};
const passwordResetOTPStore = {};

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

    // Determine if this is admin or user OTP
    const isAdmin = email === 'johnpauld750@gmail.com';
    const subject = isAdmin 
      ? 'Admin Login OTP - BSIT Graduate Tracer System'
      : 'Login OTP - BSIT Graduate Tracer System';
    const title = isAdmin ? 'Admin Login OTP' : 'Login OTP';
    
    const gmailUser = process.env.GMAIL_USER || 'johnpauld750@gmail.com';
    
    await transporter.sendMail({
      from: `"BSIT Graduate Tracer System" <${gmailUser}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://raw.githubusercontent.com/Paul0726/final-system-thesis/main/client/public/seal.png" alt="School Seal" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px;" />
              <h2 style="color: #11823b; margin: 0; font-size: 24px;">BSIT Graduate Tracer System</h2>
            </div>
            <h2 style="color: #11823b; margin-bottom: 20px; border-bottom: 2px solid #dce3c7; padding-bottom: 10px;">${title}</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Your OTP for login is:
            </p>
            <div style="background-color: #dce3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #11823b; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This OTP will expire in 10 minutes. Do not share this code with anyone.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              If you did not request this OTP, please ignore this email.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is an automated email from BSIT Graduate Tracer System.
              </p>
            </div>
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

// Send Technical Support Report to Admin
const sendTechnicalSupportReport = async (reportData) => {
  try {
    const adminEmail = process.env.GMAIL_USER || 'johnpauld750@gmail.com';
    const priorityColors = {
      'Low': '#6b7280',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Critical': '#dc2626'
    };
    const priorityColor = priorityColors[reportData.priority] || '#6b7280';

    const gmailUser = process.env.GMAIL_USER || 'johnpauld750@gmail.com';
    
    await transporter.sendMail({
      from: `"BSIT Graduate Tracer System" <${gmailUser}>`,
      to: adminEmail,
      subject: `[${reportData.priority}] Technical Support Report: ${reportData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 700px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://raw.githubusercontent.com/Paul0726/final-system-thesis/main/client/public/seal.png" alt="School Seal" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px;" />
              <h2 style="color: #11823b; margin: 0; font-size: 24px;">BSIT Graduate Tracer System</h2>
            </div>
            <h2 style="color: #11823b; margin-bottom: 20px; border-bottom: 3px solid #11823b; padding-bottom: 10px;">
              Technical Support Report
            </h2>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; color: #374151; font-size: 14px;">
                <strong>Priority:</strong> 
                <span style="background-color: ${priorityColor}; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-left: 8px;">
                  ${reportData.priority}
                </span>
              </p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #11823b; font-size: 16px; margin-bottom: 8px;">Reporter Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 150px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0; color: #374151;">${reportData.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0; color: #374151;">${reportData.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Issue Type:</strong></td>
                  <td style="padding: 8px 0; color: #374151;">${reportData.issueType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;"><strong>Subject:</strong></td>
                  <td style="padding: 8px 0; color: #374151;">${reportData.subject}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #11823b; font-size: 16px; margin-bottom: 8px;">Description</h3>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #11823b;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${reportData.description}</p>
              </div>
            </div>

            <div style="background-color: #dce3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #374151; font-size: 14px;">
                <strong>Reported at:</strong> ${new Date().toLocaleString('en-US', { 
                  timeZone: 'Asia/Manila',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This is an automated email from the BSIT Graduate Tracer System Technical Support.
              </p>
            </div>
          </div>
        </div>
      `
    });

    return { success: true, message: 'Technical support report sent successfully' };
  } catch (error) {
    console.error('Error sending technical support report:', error);
    return { success: false, message: 'Failed to send technical support report' };
  }
};

// Send OTP for password reset
const sendPasswordResetOTP = async (email) => {
  try {
    const otp = generateOTP();
    passwordResetOTPStore[email] = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };

    const gmailUser = process.env.GMAIL_USER || 'johnpauld750@gmail.com';
    
    await transporter.sendMail({
      from: `"BSIT Graduate Tracer System" <${gmailUser}>`,
      to: email,
      subject: 'Password Reset OTP - BSIT Graduate Tracer System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://raw.githubusercontent.com/Paul0726/final-system-thesis/main/client/public/seal.png" alt="School Seal" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px;" />
              <h2 style="color: #11823b; margin: 0; font-size: 24px;">BSIT Graduate Tracer System</h2>
            </div>
            <h2 style="color: #11823b; margin-bottom: 20px; border-bottom: 2px solid #dce3c7; padding-bottom: 10px;">Password Reset OTP</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              You requested to reset your password. Your OTP code is:
            </p>
            <div style="background-color: #dce3c7; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #11823b; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              This OTP will expire in 10 minutes. Do not share this code with anyone.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              If you did not request a password reset, please ignore this email and your password will remain unchanged.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is an automated email from BSIT Graduate Tracer System.
              </p>
            </div>
          </div>
        </div>
      `
    });

    return { success: true, message: 'Password reset OTP sent successfully' };
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    return { success: false, message: 'Failed to send password reset OTP' };
  }
};

// Verify password reset OTP
const verifyPasswordResetOTP = (email, otp) => {
  const stored = passwordResetOTPStore[email];
  
  if (!stored) {
    return { success: false, message: 'OTP not found. Please request a new one.' };
  }

  if (Date.now() > stored.expiresAt) {
    delete passwordResetOTPStore[email];
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (stored.otp !== otp) {
    return { success: false, message: 'Invalid OTP. Please try again.' };
  }

  // OTP verified, but don't delete it yet - keep it for password reset
  return { success: true, message: 'OTP verified successfully' };
};

// Clear password reset OTP after successful password reset
const clearPasswordResetOTP = (email) => {
  delete passwordResetOTPStore[email];
};

module.exports = { sendOTP, verifyOTP, sendTechnicalSupportReport, sendPasswordResetOTP, verifyPasswordResetOTP, clearPasswordResetOTP };




