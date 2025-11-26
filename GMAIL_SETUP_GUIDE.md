# Gmail Setup Guide - Paano Palitan ang Gmail Account

## Overview
Ang system ay gumagamit ng Gmail account para sa:
1. **Admin Login** - Email address ng admin
2. **OTP Sending** - Gmail account na magse-send ng OTPs
3. **Notifications** - Gmail account na magse-send ng notifications sa respondents
4. **Technical Support Reports** - Gmail account na tatanggap ng technical support reports

## Paano Palitan ang Gmail Account

### Step 1: Gumawa ng Gmail App Password

1. Pumunta sa [Google Account Settings](https://myaccount.google.com/)
2. Pumunta sa **Security** section
3. I-enable ang **2-Step Verification** (kung hindi pa enabled)
4. Pumunta sa **App passwords** (sa ilalim ng 2-Step Verification)
5. Click **Select app** → piliin **Mail**
6. Click **Select device** → piliin **Other (Custom name)**
7. Mag-type ng name (halimbawa: "BSIT Tracer System")
8. Click **Generate**
9. **Copy ang 16-character password** (ito ang App Password mo)

### Step 2: I-set ang Environment Variables sa Railway

1. Pumunta sa Railway Dashboard
2. Piliin ang project
3. Pumunta sa **Variables** tab
4. I-add o i-update ang mga sumusunod:

```
GMAIL_USER=your-new-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

**Important:** 
- `GMAIL_USER` = Ang Gmail address na gagamitin para mag-send
- `GMAIL_APP_PASSWORD` = Ang 16-character App Password na ginawa mo

### Step 3: Palitan ang Admin Email

Para palitan ang admin email (yung email na pwedeng mag-login bilang admin):

1. Pumunta sa Railway Dashboard → Variables
2. I-add ang:
```
ADMIN_EMAIL=your-admin-email@gmail.com
```

3. I-update ang code sa `server/index.js` para gamitin ang environment variable

### Step 4: Redeploy

Pagkatapos mag-set ng environment variables:
1. Maghintay ng automatic redeploy, O
2. Manual redeploy sa Railway dashboard

## Current Configuration

**Current Admin Email:** `johnpauld750@gmail.com` (hardcoded)
**Current Gmail Sender:** `johnpauld750@gmail.com` (from environment variable o default)

## Environment Variables na Kailangan

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=your-admin-email@gmail.com (optional, para sa admin login)
```

## Troubleshooting

### Hindi makapag-send ng email?
- Check kung tama ang App Password
- Check kung enabled ang 2-Step Verification
- Check kung tama ang Gmail address
- Check Railway logs para sa error messages

### Hindi makapag-login bilang admin?
- Check kung tama ang admin email
- Check kung naka-set ang ADMIN_EMAIL environment variable

## Security Notes

⚠️ **IMPORTANT:**
- Huwag i-commit ang `.env` file sa Git
- Gamitin lang ang App Password, hindi ang regular password
- I-keep secure ang App Password
- I-enable ang 2-Step Verification sa Gmail account

