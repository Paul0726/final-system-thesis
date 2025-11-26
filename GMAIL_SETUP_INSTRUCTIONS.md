# Paano Palitan ang Gmail Account sa System

## Quick Guide

### 1. Gumawa ng Gmail App Password

1. Pumunta sa: https://myaccount.google.com/security
2. I-enable ang **2-Step Verification** (kung wala pa)
3. Pumunta sa **App passwords**: https://myaccount.google.com/apppasswords
4. Piliin:
   - **Select app**: Mail
   - **Select device**: Other (Custom name) → Type: "BSIT Tracer System"
5. Click **Generate**
6. **Copy ang 16-character password** (halimbawa: `abcd efgh ijkl mnop`)

### 2. I-set sa Railway Environment Variables

1. Pumunta sa Railway Dashboard
2. Piliin ang project
3. Click **Variables** tab
4. I-add o i-update ang mga sumusunod:

```
GMAIL_USER=your-new-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=your-admin-email@gmail.com
```

**Explanation:**
- `GMAIL_USER` = Gmail address na gagamitin para mag-send ng emails (OTPs, notifications)
- `GMAIL_APP_PASSWORD` = 16-character App Password (walang spaces)
- `ADMIN_EMAIL` = Email address na pwedeng mag-login bilang admin (optional, kung iba sa GMAIL_USER)

### 3. Redeploy

Pagkatapos mag-set ng variables, automatic na magre-redeploy ang Railway. O kaya manual redeploy.

## Example

Kung gusto mong:
- **Gmail sender**: `tracer.system@gmail.com`
- **Admin email**: `admin@dwcsj.edu.ph`

I-set mo sa Railway:
```
GMAIL_USER=tracer.system@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=admin@dwcsj.edu.ph
```

## Important Notes

⚠️ **Security:**
- Gamitin ang **App Password**, hindi ang regular password
- Huwag i-commit ang `.env` file
- I-keep secure ang App Password

✅ **After Setup:**
- Lahat ng OTPs ay magse-send mula sa bagong Gmail account
- Lahat ng notifications ay magse-send mula sa bagong Gmail account
- Admin login ay gagamitin ang bagong admin email

