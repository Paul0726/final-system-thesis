# Paano I-set ang Gmail sa Railway

## Step 1: Copy ang App Password

1. **Copy ang 16-character App Password** na binigay ng Google
   - Halimbawa: `abcd efgh ijkl mnop`
   - O kaya: `abcdefghijklmnop` (walang spaces)

## Step 2: Pumunta sa Railway Dashboard

1. Pumunta sa: https://railway.app
2. Mag-login
3. Piliin ang project mo (BSIT Graduate Tracer System)

## Step 3: I-set ang Environment Variables

1. Sa project page, click ang **"Variables"** tab (sa taas)
2. I-add o i-update ang mga sumusunod:

### Required Variables:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:**
- `GMAIL_USER` = Ang Gmail address mo (yung ginamit mo para gumawa ng App Password)
- `GMAIL_APP_PASSWORD` = Ang 16-character App Password (i-remove ang spaces kung may spaces)

### Optional Variable (kung iba ang admin email):

```
ADMIN_EMAIL=your-admin-email@gmail.com
```

**Note:** Kung hindi mo i-set ang `ADMIN_EMAIL`, gagamitin ang `GMAIL_USER` bilang admin email.

## Step 4: Paano Mag-add ng Variable

1. Click **"New Variable"** button
2. **Name**: `GMAIL_USER`
3. **Value**: `your-email@gmail.com` (palitan ng actual email mo)
4. Click **"Add"**
5. Ulitin para sa `GMAIL_APP_PASSWORD`

## Step 5: Hintayin ang Redeploy

- Automatic na magre-redeploy ang Railway pagkatapos mag-set ng variables
- Hintayin lang (usually 2-5 minutes)

## Example:

Kung ang email mo ay `tracer.system@gmail.com` at App Password ay `abcd efgh ijkl mnop`:

```
GMAIL_USER=tracer.system@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Note:** I-remove ang spaces sa App Password kapag inilagay sa Railway.

## After Setup:

✅ Lahat ng OTPs ay magse-send mula sa bagong Gmail account
✅ Lahat ng notifications ay magse-send mula sa bagong Gmail account
✅ Admin login ay gagamitin ang bagong admin email (kung naka-set ang ADMIN_EMAIL)

## Testing:

Pagkatapos mag-set, subukan:
1. Mag-send ng OTP sa admin email
2. Check kung natanggap mo ang email
3. Kung natanggap, successful na!

