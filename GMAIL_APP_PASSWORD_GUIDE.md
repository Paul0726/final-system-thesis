# 📧 Paano Mag-Generate ng Gmail App Password

## ⚠️ IMPORTANTE
Kailangan mo ng Gmail App Password para magamit ang email functionality ng system (OTP sending, etc.)

---

## 📋 STEP-BY-STEP GUIDE

### **STEP 1: I-Enable ang 2-Step Verification**

1. **Buksan ang web browser** (Chrome, Firefox, Edge, etc.)

2. **Pumunta sa Google Account:**
   - I-type sa address bar: `https://myaccount.google.com`
   - O i-click ang link: https://myaccount.google.com
   - Press Enter

3. **Mag-login** sa Google account mo (`dwcsjtracersystem@gmail.com`)

4. **Pumunta sa Security Settings:**
   - I-click ang "Security" sa left sidebar
   - O i-click ang link: https://myaccount.google.com/security

5. **Hanapin ang "2-Step Verification":**
   - Scroll down sa "Signing in to Google" section
   - Hanapin ang "2-Step Verification"
   - I-click ang "2-Step Verification"

6. **I-enable ang 2-Step Verification:**
   - I-click ang "Get Started" button
   - Sundin ang instructions para i-setup
   - Piliin ang method (Phone number, Authenticator app, etc.)
   - I-complete ang setup

---

### **STEP 2: Mag-Generate ng App Password**

1. **Pumunta ulit sa Security Settings:**
   - https://myaccount.google.com/security

2. **Hanapin ang "App passwords":**
   - Scroll down sa "Signing in to Google" section
   - Hanapin ang "App passwords"
   - I-click ang "App passwords"
   
   **Note:** Kung hindi mo makita ang "App passwords", siguraduhin na naka-enable na ang 2-Step Verification

3. **Mag-login ulit** (kung hihingin)

4. **I-select ang App at Device:**
   - Sa dropdown, piliin ang "Mail"
   - Sa next dropdown, piliin ang "Other (Custom name)"
   - I-type ang name: `BSIT Graduate Tracer System`
   - I-click ang "Generate" button

5. **Kopyahin ang App Password:**
   - Makikita mo ang 16-character password (may spaces, parang: `abcd efgh ijkl mnop`)
   - **⚠️ IMPORTANTE:** Kopyahin ang password agad (hindi mo na makikita ulit!)
   - I-save sa notepad o safe place
   - I-click ang "Done"

---

### **STEP 3: I-Set sa Railway Environment Variables**

1. **Pumunta sa Railway Dashboard:**
   - https://railway.app
   - Mag-login

2. **Piliin ang Project mo**

3. **Pumunta sa Variables Tab:**
   - I-click ang "Variables" sa left sidebar
   - O Settings → Variables

4. **I-update/I-add ang Environment Variables:**

   **Variable 1: GMAIL_USER**
   - Name: `GMAIL_USER`
   - Value: `dwcsjtracersystem@gmail.com`
   - I-click ang "Add" o "Update"

   **Variable 2: GMAIL_APP_PASSWORD**
   - Name: `GMAIL_APP_PASSWORD`
   - Value: `yung-16-character-app-password-na-na-copy-mo` (walang spaces!)
   - Example: `abcdefghijklmnop` (kung ang app password ay `abcd efgh ijkl mnop`, tanggalin ang spaces)
   - I-click ang "Add" o "Update"

5. **I-save at hintayin ang redeploy:**
   - Pagkatapos mag-save, magre-redeploy ang Railway
   - Hintayin matapos (2-5 minutes)

---

## 🔍 TROUBLESHOOTING

### Problem: Hindi ko makita ang "App passwords" option

**Solution:**
1. Siguraduhin na naka-enable na ang 2-Step Verification
2. I-refresh ang page
3. I-try sa ibang browser
4. I-check kung personal account ang gamit (hindi business/workspace account)

---

### Problem: "App passwords" ay grayed out o disabled

**Solution:**
1. I-check kung naka-enable ang 2-Step Verification
2. I-try mag-logout at mag-login ulit
3. I-check kung may admin restrictions ang account

---

### Problem: Hindi nagse-send ang OTP emails

**Solution:**
1. I-verify na tama ang `GMAIL_USER` sa Railway
2. I-verify na tama ang `GMAIL_APP_PASSWORD` (walang spaces!)
3. I-check ang Railway logs para sa error messages
4. I-verify na naka-enable ang "Less secure app access" (kung available)
5. I-try mag-generate ng bagong App Password

---

## 📝 QUICK REFERENCE

**Gmail Account:** `dwcsjtracersystem@gmail.com`

**Railway Environment Variables:**
- `GMAIL_USER` = `dwcsjtracersystem@gmail.com`
- `GMAIL_APP_PASSWORD` = `16-character-password-without-spaces`

**App Password Format:**
- May 16 characters
- May spaces (pero tanggalin ang spaces kapag ilalagay sa Railway)
- Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

## ✅ CHECKLIST

- [ ] Naka-enable ang 2-Step Verification
- [ ] Na-generate ang App Password
- [ ] Na-copy ang App Password (walang spaces)
- [ ] Na-set ang `GMAIL_USER` sa Railway
- [ ] Na-set ang `GMAIL_APP_PASSWORD` sa Railway
- [ ] Na-redeploy ang application
- [ ] Na-test ang OTP sending (admin at user)

---

## 🎯 AFTER SETUP

Pagkatapos ma-set ang environment variables:

1. **I-test ang Admin Login:**
   - Pumunta sa Admin Page
   - I-enter ang email: `dwcsjtracersystem@gmail.com`
   - I-click ang "Send OTP"
   - Dapat makakatanggap ka ng OTP email

2. **I-test ang User Login:**
   - Pumunta sa User Login Page
   - Mag-register o mag-login
   - Dapat makakatanggap ka ng OTP email

3. **I-check ang Railway Logs:**
   - Kung may error, makikita mo sa Railway logs
   - I-check kung tama ang email configuration

---

**Need help?** I-check ang Railway deployment logs o i-verify ang environment variables.

