# Paano Makakuha ng Gmail App Password

## Quick Steps:

### Method 1: Direct Link (Pinakamadali) ⭐

1. **Pumunta dito directly:** 
   ```
   https://myaccount.google.com/apppasswords
   ```

2. Kung may lumabas na prompt, piliin:
   - **Select app**: Mail
   - **Select device**: Other (Custom name)
   - Type: "BSIT Tracer System"
   - Click **Generate**

3. **Copy ang 16-character password** (halimbawa: `abcd efgh ijkl mnop`)

### Method 2: Through 2-Step Verification Settings

1. Pumunta sa: https://myaccount.google.com/security
2. Hanapin ang **"2-Step Verification"** card (yung may "On since 21 Nov")
3. **Click ang "2-Step Verification"** mismo (hindi lang tingnan)
4. Sa loob ng 2-Step Verification page, scroll down
5. Hanapin ang **"App passwords"** section (sa ilalim)
6. Click **"App passwords"**
7. Piliin ang options at generate

## Kung Hindi Pa Rin Makita:

### Alternative: Gamitin ang Regular Password (Temporary)

Kung hindi mo makita ang App Passwords, pwede mong gamitin ang regular Gmail password:

1. Sa Railway Variables, i-set:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASSWORD=your-regular-gmail-password
   ```

**Note:** Mas secure ang App Password, pero pwede muna ang regular password para makapag-test.

### Bakit Hindi Makita ang App Passwords?

- **Dapat naka-enable ang 2-Step Verification** ✅ (Meron ka na nito - "On since 21 Nov")
- **Kailangan i-click ang "2-Step Verification" mismo** para makita ang App Passwords sa loob
- **Hindi visible sa main security page** - nasa loob ng 2-Step Verification settings

## Try This:

1. **Direct link:** https://myaccount.google.com/apppasswords
2. O kaya:
   - Pumunta sa: https://myaccount.google.com/security
   - Click ang **"2-Step Verification"** (yung card mismo, hindi lang tingnan)
   - Sa loob, hanapin ang **"App passwords"** sa ilalim

## Kung Work/School Gmail:

Kung work o school Gmail account ito, baka naka-disable ng admin ang App Passwords. Sa ganitong case:
- Gamitin ang regular password muna
- O kaya gumawa ng personal Gmail account para sa system

