# OTP Troubleshooting Guide

## Problem: Walang nagse-send na OTP

Kung hindi nagse-send ang OTP, sundin ang mga steps na ito:

## Step 1: Check Railway Environment Variables

1. Pumunta sa Railway Dashboard: https://railway.app
2. Piliin ang project mo
3. Click ang **"Variables"** tab
4. I-verify na mayroon kang:

```
GMAIL_USER=dwcsjtracersystem@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:**
- `GMAIL_APP_PASSWORD` ay dapat ang 16-character App Password (walang spaces)
- Dapat naka-set ang pareho

## Step 2: Check Railway Logs

1. Sa Railway Dashboard, pumunta sa **"Deployments"** tab
2. Click ang latest deployment
3. Click **"View Logs"**
4. Hanapin ang mga messages na:
   - `[EMAIL] Transporter is ready to send emails` ✅ (OK)
   - `[EMAIL] Transporter verification failed` ❌ (May problema)
   - `[OTP] Attempting to send OTP to: ...`
   - `[OTP] ERROR sending OTP: ...`

## Step 3: Common Issues

### Issue 1: "Email authentication failed"
**Solution:** 
- I-verify na tama ang `GMAIL_APP_PASSWORD`
- Dapat App Password, hindi regular password
- I-remove ang spaces kung may spaces

### Issue 2: "GMAIL_APP_PASSWORD is not set"
**Solution:**
- I-add ang `GMAIL_APP_PASSWORD` sa Railway Variables
- I-redeploy ang application

### Issue 3: "Cannot connect to email server"
**Solution:**
- Check ang internet connection
- I-verify na hindi naka-block ang Gmail sa network

## Step 4: Test Email Configuration

Pagkatapos mag-set ng variables:

1. **Redeploy** ang application (automatic o manual)
2. **Check logs** para sa:
   ```
   [EMAIL] Transporter is ready to send emails
   [EMAIL] Gmail User: dwcsjtracersystem@gmail.com
   [EMAIL] App Password configured: Yes
   ```

3. **Subukan mag-login** at check ang logs para sa:
   ```
   [OTP] Attempting to send OTP to: your-email@gmail.com
   [OTP] Email sent successfully! Message ID: ...
   ```

## Step 5: Verify App Password

Kung hindi pa rin gumagana:

1. Pumunta sa: https://myaccount.google.com/apppasswords
2. I-verify na mayroon kang App Password na naka-generate
3. Kung wala, gumawa ng bago:
   - **Select app**: Mail
   - **Select device**: Other (Custom name) → "BSIT Tracer System"
   - **Generate**
   - **Copy** ang 16-character password
4. I-update sa Railway Variables:
   ```
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
   (walang spaces)

## Step 6: Check Spam Folder

Minsan napupunta sa Spam ang OTP emails. I-check ang Spam/Junk folder.

## Still Not Working?

Kung hindi pa rin gumagana pagkatapos ng lahat:

1. **Check Railway Logs** - Hanapin ang exact error message
2. **Verify Variables** - I-double check ang spelling at values
3. **Test App Password** - Gumawa ng bagong App Password
4. **Contact Support** - I-share ang error logs

## Quick Checklist

- [ ] `GMAIL_USER` naka-set sa Railway
- [ ] `GMAIL_APP_PASSWORD` naka-set sa Railway (16 characters, walang spaces)
- [ ] Naka-redeploy na ang application
- [ ] Logs show "Transporter is ready"
- [ ] Naka-check na ang Spam folder
- [ ] App Password ay valid at hindi expired

