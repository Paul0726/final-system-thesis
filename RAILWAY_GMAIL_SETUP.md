# Railway Gmail Setup Guide

## ⚠️ IMPORTANT: Gmail Credentials Configuration

The system requires Gmail credentials to send OTP emails. Follow these steps to configure it in Railway.

---

## 📋 STEP 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process
3. **Generate App Password**:
   - Go to Security → 2-Step Verification
   - Scroll down to "App passwords"
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Enter: "BSIT Tracer System"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

---

## 📋 STEP 2: Configure Railway Environment Variables

1. **Go to Railway Dashboard**: https://railway.app
2. **Select your project**
3. **Click on your service** (the web service)
4. **Click on "Variables" tab**
5. **Add the following environment variables**:

### Required Variables:

```
GMAIL_USER=dwcsjtracersystem@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password-here
```

**Important Notes:**
- Remove spaces from the app password (e.g., `abcdefghijklmnop` not `abcd efgh ijkl mnop`)
- Do NOT use your regular Gmail password
- The app password is 16 characters (no spaces)
- Make sure there are no extra spaces or quotes

### Optional (if different admin email):

```
ADMIN_EMAIL=your-admin-email@gmail.com
```

---

## 📋 STEP 3: Redeploy

After adding the environment variables:

1. **Railway will automatically redeploy** (or you can manually trigger a redeploy)
2. **Wait for deployment to complete** (2-5 minutes)
3. **Check the logs** to verify:
   - Look for: `[EMAIL] ✅ Transporter is ready to send emails`
   - If you see errors, check the variable names and values

---

## 🔍 STEP 4: Verify Configuration

1. **Check Railway Logs**:
   - Go to Railway Dashboard → Your Service → Deployments → Latest → Logs
   - Look for email-related logs
   - Should see: `[EMAIL] ✅ Transporter is ready to send emails`

2. **Test Admin Login**:
   - Go to your website → Admin Panel
   - Click "Send OTP"
   - Check your email for the OTP
   - If you receive it, configuration is correct!

---

## ❌ Common Issues

### Issue 1: "Missing credentials for PLAIN"
**Solution**: 
- Make sure `GMAIL_APP_PASSWORD` is set in Railway
- Check that there are no spaces in the password
- Verify the password is correct (16 characters)

### Issue 2: "Authentication failed"
**Solution**:
- Make sure 2-Step Verification is enabled on Gmail
- Use App Password, NOT regular password
- Regenerate the app password if needed

### Issue 3: "Email service is not configured"
**Solution**:
- Check Railway environment variables
- Make sure variable names are exactly: `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Redeploy after adding variables

---

## 📝 Quick Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] `GMAIL_USER` set in Railway
- [ ] `GMAIL_APP_PASSWORD` set in Railway (no spaces)
- [ ] Service redeployed
- [ ] Logs show "Transporter is ready"
- [ ] Test OTP email received

---

## 🆘 Still Having Issues?

1. **Check Railway Logs** for specific error messages
2. **Verify Environment Variables** are set correctly
3. **Regenerate App Password** if needed
4. **Contact Support** if problem persists

---

**Note**: The system will not work without proper Gmail credentials. Make sure to configure them before using the admin login feature.

