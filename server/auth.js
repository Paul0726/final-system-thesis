const nodemailer = require('nodemailer');
require('dotenv').config();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = {};
const passwordResetOTPStore = {};

// Create transporter for Gmail
const gmailUser = process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD;

// Only create transporter if credentials are available
let transporter = null;
if (gmailPassword) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword
    }
  });

  // Verify transporter configuration on startup
  transporter.verify(function (error, success) {
    if (error) {
      console.error('[EMAIL] ⚠️ Transporter verification failed:', error.message);
      console.error('[EMAIL] ⚠️ Error code:', error.code);
      if (error.code === 'EAUTH') {
        console.error('[EMAIL] ⚠️ Authentication failed. Please check:');
        console.error('[EMAIL] ⚠️ 1. GMAIL_USER is set correctly in Railway environment variables');
        console.error('[EMAIL] ⚠️ 2. GMAIL_APP_PASSWORD is set correctly in Railway environment variables');
        console.error('[EMAIL] ⚠️ 3. Gmail App Password is valid (not the regular password)');
        console.error('[EMAIL] ⚠️ 4. 2-Step Verification is enabled on Gmail account');
      }
    } else {
      console.log('[EMAIL] ✅ Transporter is ready to send emails');
      console.log('[EMAIL] ✅ Gmail User:', gmailUser);
      console.log('[EMAIL] ✅ App Password configured: Yes');
    }
  });
} else {
  console.error('[EMAIL] ❌ ERROR: GMAIL_APP_PASSWORD or GMAIL_PASSWORD is not set!');
  console.error('[EMAIL] ❌ Email functionality will not work until credentials are configured.');
  console.error('[EMAIL] ❌ Please set GMAIL_APP_PASSWORD in Railway environment variables.');
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
const sendOTP = async (email) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.error('[OTP] ERROR: Email transporter is not configured!');
      console.error('[OTP] ERROR: GMAIL_APP_PASSWORD or GMAIL_PASSWORD is not set in Railway environment variables!');
      return { 
        success: false, 
        message: 'Email service is not configured. Please contact the administrator to set up Gmail credentials in Railway.' 
      };
    }
    
    // Check if Gmail credentials are configured
    const gmailUser = process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD;
    
    if (!gmailPassword) {
      console.error('[OTP] ERROR: GMAIL_APP_PASSWORD or GMAIL_PASSWORD is not set in environment variables!');
      return { 
        success: false, 
        message: 'Email service is not configured. Please contact the administrator to set up Gmail credentials in Railway.' 
      };
    }

    console.log(`[OTP] Attempting to send OTP to: ${email}`);
    console.log(`[OTP] Using Gmail user: ${gmailUser}`);
    console.log(`[OTP] App Password configured: ${gmailPassword ? 'Yes (hidden)' : 'No'}`);

    const otp = generateOTP();
    // Normalize email to lowercase for consistent storage
    const normalizedEmail = (email || '').trim().toLowerCase();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[normalizedEmail] = {
      otp: String(otp).trim(), // Ensure OTP is stored as trimmed string
      expiresAt: expiresAt
    };
    console.log(`[OTP] OTP generated and stored for normalized email: ${normalizedEmail}`);
    console.log(`[OTP] OTP value: ${otp} (stored as: "${otpStore[normalizedEmail].otp}")`);
    console.log(`[OTP] OTP length: ${otpStore[normalizedEmail].otp.length} characters`);
    console.log(`[OTP] OTP expires at: ${new Date(expiresAt).toISOString()}`);
    console.log(`[OTP] Current OTP store contents:`, JSON.stringify(Object.keys(otpStore)));

    // Determine if this is admin or user OTP
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    // Case-insensitive comparison for consistency (reuse normalizedEmail from above)
    const normalizedAdminEmail = (adminEmail || '').trim().toLowerCase();
    const isAdmin = normalizedEmail === normalizedAdminEmail;
    const subject = isAdmin 
      ? 'Admin Login OTP - BSIT Graduate Tracer System'
      : 'Login OTP - BSIT Graduate Tracer System';
    const title = isAdmin ? 'Admin Login OTP' : 'Login OTP';
    
    console.log(`[OTP] Sending email via transporter...`);
    const info = await transporter.sendMail({
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

    console.log(`[OTP] ✅ Email sent successfully! Message ID: ${info.messageId}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('[OTP] ❌ ERROR sending OTP:', error);
    console.error('[OTP] Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check GMAIL_APP_PASSWORD in Railway environment variables. Make sure 2-Step Verification is enabled and you\'re using an App Password, not your regular password.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Cannot connect to email server. Please check your internet connection and Gmail service status.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection timed out. Please try again later.';
    } else if (error.response) {
      errorMessage = `Email server error: ${error.response}`;
    } else if (error.message) {
      errorMessage = `Error: ${error.message}`;
    }
    
    console.error('[OTP] ❌ Returning error message:', errorMessage);
    return { success: false, message: errorMessage };
  }
};

// Verify OTP
const verifyOTP = (email, otp) => {
  // Normalize email to lowercase for consistent lookup
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedOTP = (otp || '').trim();
  
  console.log(`[OTP VERIFY] ========================================`);
  console.log(`[OTP VERIFY] Starting verification for email: ${email} (normalized: ${normalizedEmail})`);
  console.log(`[OTP VERIFY] OTP received: ${trimmedOTP} (length: ${trimmedOTP.length})`);
  console.log(`[OTP VERIFY] Current OTP store keys:`, Object.keys(otpStore));
  console.log(`[OTP VERIFY] OTP store contents:`, JSON.stringify(otpStore, null, 2));
  
  // Try to find OTP with normalized email
  let stored = otpStore[normalizedEmail];
  
  // If not found, try original email (for backward compatibility)
  if (!stored) {
    stored = otpStore[email];
    // If found with original email, migrate to normalized key
    if (stored) {
      console.log(`[OTP VERIFY] Found OTP with original email, migrating to normalized key`);
      otpStore[normalizedEmail] = stored;
      delete otpStore[email];
    }
  }
  
  if (!stored) {
    console.log(`[OTP VERIFY] OTP not found for email: ${email} (normalized: ${normalizedEmail})`);
    console.log(`[OTP VERIFY] Available OTP keys:`, Object.keys(otpStore));
    return { success: false, message: 'OTP not found. Please request a new one.' };
  }

  console.log(`[OTP VERIFY] OTP found. Stored OTP: ${stored.otp}, Expires at: ${new Date(stored.expiresAt).toISOString()}`);
  console.log(`[OTP VERIFY] Current time: ${new Date().toISOString()}`);

  if (Date.now() > stored.expiresAt) {
    console.log(`[OTP VERIFY] OTP has expired`);
    delete otpStore[normalizedEmail];
    if (otpStore[email]) delete otpStore[email];
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  // Compare OTP as strings, ensuring both are trimmed and normalized
  const storedOTP = String(stored.otp).trim();
  const receivedOTP = String(trimmedOTP).trim();
  
  // Remove any non-digit characters (in case user copied with spaces or formatting)
  const cleanedStoredOTP = storedOTP.replace(/\D/g, '');
  const cleanedReceivedOTP = receivedOTP.replace(/\D/g, '');
  
  console.log(`[OTP VERIFY] Comparing OTPs:`);
  console.log(`[OTP VERIFY]   Stored (raw): "${storedOTP}" (length: ${storedOTP.length})`);
  console.log(`[OTP VERIFY]   Stored (cleaned): "${cleanedStoredOTP}" (length: ${cleanedStoredOTP.length})`);
  console.log(`[OTP VERIFY]   Received (raw): "${receivedOTP}" (length: ${receivedOTP.length})`);
  console.log(`[OTP VERIFY]   Received (cleaned): "${cleanedReceivedOTP}" (length: ${cleanedReceivedOTP.length})`);
  console.log(`[OTP VERIFY]   Direct match: ${storedOTP === receivedOTP}`);
  console.log(`[OTP VERIFY]   Cleaned match: ${cleanedStoredOTP === cleanedReceivedOTP}`);
  
  // Try both direct and cleaned comparison
  const isMatch = (storedOTP === receivedOTP) || (cleanedStoredOTP === cleanedReceivedOTP && cleanedStoredOTP.length === 6);
  
  if (!isMatch) {
    console.log(`[OTP VERIFY] ❌ OTP mismatch. Expected: "${storedOTP}", Received: "${receivedOTP}"`);
    return { success: false, message: 'Invalid OTP. Please check the code and try again. Make sure to copy only the 6-digit number.' };
  }
  
  console.log(`[OTP VERIFY] ✅ OTP matches!`);

  // OTP verified, delete it
  delete otpStore[normalizedEmail];
  if (otpStore[email]) delete otpStore[email];
  console.log(`[OTP VERIFY] ✅ OTP verified successfully for: ${normalizedEmail}`);
  return { success: true, message: 'OTP verified successfully' };
};

// Send Technical Support Report to Admin
const sendTechnicalSupportReport = async (reportData) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    const priorityColors = {
      'Low': '#6b7280',
      'Medium': '#f59e0b',
      'High': '#ef4444',
      'Critical': '#dc2626'
    };
    const priorityColor = priorityColors[reportData.priority] || '#6b7280';

    const gmailUser = process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    
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

    const gmailUser = process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    
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

// Helper function to get OTP store keys (for debugging only)
const getOTPStoreKeys = () => {
  return Object.keys(otpStore);
};

module.exports = { sendOTP, verifyOTP, sendTechnicalSupportReport, sendPasswordResetOTP, verifyPasswordResetOTP, clearPasswordResetOTP, getOTPStoreKeys };




