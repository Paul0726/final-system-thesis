# 🌐 Paano Mag-Setup ng Custom Domain (dwcsjgraduatetracer.com)

## 🎯 Goal: Palitan ang `dwcsjgraduatetracer.up.railway.app` → `dwcsjgraduatetracer.com`

---

## 📋 STEP-BY-STEP GUIDE:

### **STEP 1: Bumili ng Domain (Kung wala pa)**

1. **Pumunta sa domain registrar:**
   - Namecheap: https://www.namecheap.com
   - GoDaddy: https://www.godaddy.com
   - Google Domains: https://domains.google
   - O kahit anong domain registrar

2. **I-search at i-buy ang domain:**
   - Domain name: `dwcsjgraduatetracer.com`
   - I-check ang availability
   - I-purchase ang domain

---

### **STEP 2: I-Add ang Custom Domain sa Railway**

1. **Pumunta sa Railway Dashboard:**
   - Go to: https://railway.app
   - I-login ang account mo

2. **I-click ang Project mo:**
   - Piliin ang project na may `dwcsjgraduatetracer`

3. **I-click ang "Settings" tab:**
   - Sa left sidebar, i-click ang "Settings"

4. **Scroll down sa "Domains" section:**
   - Makikita mo ang "Domains" section

5. **I-click ang "Custom Domain" o "Add Domain":**
   - I-click ang button para mag-add ng custom domain

6. **I-enter ang domain name:**
   - I-type: `dwcsjgraduatetracer.com`
   - I-click ang "Add" o "Save"

7. **Kopyahin ang DNS Records:**
   - Railway magbibigay ng DNS records na kailangan mo
   - Usually may CNAME o A record
   - **I-copy ang lahat ng DNS records!**

---

### **STEP 3: I-Configure ang DNS sa Domain Registrar**

1. **Pumunta sa Domain Registrar Dashboard:**
   - I-login sa domain registrar mo (Namecheap, GoDaddy, etc.)

2. **I-click ang Domain Management:**
   - Hanapin ang "Domain Management" o "DNS Management"

3. **I-click ang "DNS Settings" o "Advanced DNS":**
   - Pumunta sa DNS settings ng domain mo

4. **I-add ang DNS Records na binigay ng Railway:**

   **Example DNS Records (Railway magbibigay ng actual values):**

   **Option A: CNAME Record (Recommended)**
   ```
   Type: CNAME
   Name: @ (o www)
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: 3600 (o Automatic)
   ```

   **Option B: A Record**
   ```
   Type: A
   Name: @
   Value: [IP Address from Railway]
   TTL: 3600
   ```

   **Para sa www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: 3600
   ```

5. **I-save ang DNS Records:**
   - I-click ang "Save" o "Add Record"
   - Hintayin ang DNS propagation (usually 5-30 minutes, pero pwede umabot ng 24 hours)

---

### **STEP 4: I-Verify sa Railway**

1. **Bumalik sa Railway Dashboard:**
   - I-check ang "Settings" → "Domains" section

2. **Hintayin ang Domain Verification:**
   - Railway mag-verify automatically kung tama ang DNS settings
   - Usually may status indicator (Pending, Verified, etc.)

3. **Kung may error:**
   - I-check kung tama ang DNS records
   - I-verify kung naka-save na ang DNS records sa domain registrar
   - Hintayin ang DNS propagation (mga 30 minutes)

---

### **STEP 5: I-Test ang Custom Domain**

1. **Hintayin ang DNS Propagation:**
   - Usually 5-30 minutes
   - Pwede umabot ng 24 hours (rare)

2. **I-test ang domain:**
   - Buksan ang browser
   - I-type: `https://dwcsjgraduatetracer.com`
   - Dapat makita mo na ang website mo!

3. **I-test ang www subdomain:**
   - I-type: `https://www.dwcsjgraduatetracer.com`
   - Dapat gumagana din!

---

## 🔧 DETAILED DNS CONFIGURATION:

### **Para sa Namecheap:**

1. **I-login sa Namecheap**
2. **I-click ang "Domain List"**
3. **I-click ang "Manage" sa tabi ng domain mo**
4. **I-click ang "Advanced DNS" tab**
5. **I-add ang records:**

   **For Root Domain (@):**
   ```
   Type: CNAME Record
   Host: @
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: Automatic
   ```

   **For www subdomain:**
   ```
   Type: CNAME Record
   Host: www
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: Automatic
   ```

6. **I-click ang "Save All Changes"**

---

### **Para sa GoDaddy:**

1. **I-login sa GoDaddy**
2. **I-click ang "My Products"**
3. **I-click ang "DNS" sa tabi ng domain mo**
4. **I-click ang "Add" para mag-add ng record**
5. **I-add ang records:**

   **For Root Domain:**
   ```
   Type: CNAME
   Name: @
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: 1 Hour
   ```

   **For www:**
   ```
   Type: CNAME
   Name: www
   Value: dwcsjgraduatetracer.up.railway.app
   TTL: 1 Hour
   ```

6. **I-click ang "Save"**

---

## ⚠️ IMPORTANT NOTES:

### **1. DNS Propagation Time:**
- **Minimum:** 5-30 minutes
- **Average:** 1-2 hours
- **Maximum:** 24-48 hours (rare)

### **2. SSL Certificate:**
- Railway **automatic na mag-provide ng SSL certificate**
- Dapat may HTTPS na agad (walang kailangan gawin)

### **3. Both Domains Will Work:**
- `dwcsjgraduatetracer.up.railway.app` - Railway domain (tuloy pa rin)
- `dwcsjgraduatetracer.com` - Custom domain (bagong domain)

### **4. www vs Non-www:**
- Pwede mo i-setup pareho
- Railway usually nagha-handle ng both automatically

---

## 🆘 TROUBLESHOOTING:

### **"Domain not verified" sa Railway**
- **Solution:** I-check kung tama ang DNS records
- I-verify kung naka-save na sa domain registrar
- Hintayin ang DNS propagation (30 minutes - 2 hours)

### **"DNS propagation in progress"**
- **Solution:** Normal lang yan, hintayin lang (5-30 minutes)

### **Website hindi naglo-load sa custom domain**
- **Solution 1:** I-check kung tama ang DNS records
- **Solution 2:** I-verify kung verified na sa Railway
- **Solution 3:** I-clear ang browser cache
- **Solution 4:** I-try sa ibang browser o device

### **"SSL Certificate Error"**
- **Solution:** Railway automatic na mag-provide ng SSL
- Hintayin lang (usually 5-10 minutes after domain verification)

---

## ✅ QUICK CHECKLIST:

- [ ] Bumili ng domain (kung wala pa)
- [ ] I-add ang custom domain sa Railway
- [ ] Kopyahin ang DNS records from Railway
- [ ] I-configure ang DNS sa domain registrar
- [ ] I-save ang DNS records
- [ ] Hintayin ang DNS propagation (5-30 minutes)
- [ ] I-verify sa Railway dashboard
- [ ] I-test ang custom domain sa browser

---

## 📝 SUMMARY:

**Para mag-setup ng custom domain:**

1. ✅ **I-add sa Railway** → Settings → Domains → Add Custom Domain
2. ✅ **I-configure ang DNS** → I-add ang DNS records sa domain registrar
3. ✅ **Hintayin ang propagation** → 5-30 minutes
4. ✅ **I-test** → Buksan ang `https://dwcsjgraduatetracer.com`

**That's it! Pwede mo na gamitin ang custom domain mo!** 🎉

---

**Need help? I-check ang Railway documentation o i-contact ang domain registrar support!** 🚀







