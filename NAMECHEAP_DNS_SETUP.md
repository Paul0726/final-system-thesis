# 🔧 Namecheap DNS Setup para sa Railway

## 🎯 Step-by-Step: I-Configure ang DNS sa Namecheap

---

## 📋 STEP 1: I-Login sa Namecheap

1. **Pumunta sa:** https://www.namecheap.com
2. **I-click ang "Sign In"** (top right)
3. **I-login** sa account mo

---

## 📋 STEP 2: Pumunta sa Domain List

1. **I-click ang "Account"** (top right)
2. **I-click ang "Domain List"** (sa dropdown)
3. **O diretso:** https://ap.www.namecheap.com/domains/list/

---

## 📋 STEP 3: I-Open ang DNS Settings

1. **Hanapin ang domain mo:** `dwcsjgraduatetracer.com`
2. **I-click ang "Manage"** button (sa tabi ng domain)
3. **I-click ang "Advanced DNS" tab** (sa top)

---

## 📋 STEP 4: I-Add ang CNAME Record

### **4.1: I-Scroll down sa "Host Records" Section**

Makikita mo ang table na may columns: Type, Host, Value, TTL

### **4.2: I-Add ang CNAME Record**

1. **I-click ang "Add New Record" button**
2. **I-select ang "CNAME Record"** sa dropdown
3. **I-fill up:**
   - **Type:** CNAME Record (selected na)
   - **Host:** `@` (para sa root domain)
   - **Value:** `zqsz8m4v.up.railway.app` (yung value from Railway)
   - **TTL:** Automatic (o 30 min)
4. **I-click ang "Save All Changes"** (green button sa baba)

### **4.3: (Optional) I-Add ang www Subdomain**

1. **I-click ulit ang "Add New Record"**
2. **I-select ang "CNAME Record"**
3. **I-fill up:**
   - **Type:** CNAME Record
   - **Host:** `www`
   - **Value:** `zqsz8m4v.up.railway.app`
   - **TTL:** Automatic
4. **I-click ang "Save All Changes"**

---

## 📋 STEP 5: I-Verify ang Records

**Dapat may ganito ka na:**

```
Type          Host    Value                          TTL
CNAME Record  @       zqsz8m4v.up.railway.app       Automatic
CNAME Record  www     zqsz8m4v.up.railway.app       Automatic (optional)
```

---

## 📋 STEP 6: Bumalik sa Railway

1. **Bumalik sa Railway dashboard:** https://railway.app
2. **I-click ang project mo**
3. **I-click ang "Settings" → "Domains"**
4. **I-check ang status:**
   - **"Record not yet detected"** → Normal lang, hintayin (5-30 minutes)
   - **"Record detected" o "Verified"** → Tapos na! ✅

---

## ⏱️ STEP 7: Hintayin ang DNS Propagation

- **Normal time:** 5-30 minutes
- **Maximum:** 72 hours (rare)
- **Railway mag-update automatically** kapag detected na

---

## ✅ STEP 8: I-Test ang Domain

**Pagkatapos ng propagation:**

1. **Buksan ang browser**
2. **I-type:** `https://dwcsjgraduatetracer.com`
3. **Dapat makita mo na ang website mo!** 🎉

---

## 🖼️ VISUAL GUIDE:

### **Namecheap Advanced DNS Page:**

```
┌─────────────────────────────────────────┐
│ Advanced DNS                            │
├─────────────────────────────────────────┤
│ Host Records                            │
│                                         │
│ Type          Host    Value      TTL    │
│ ─────────────────────────────────────── │
│ CNAME Record  @       [VALUE]   Auto   │ ← I-add mo ito
│ CNAME Record  www     [VALUE]   Auto   │ ← Optional
│                                         │
│ [+ Add New Record]                      │
│                                         │
│ [Save All Changes] ← I-click mo ito    │
└─────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANT NOTES:

### **1. About "@" Host:**
- **@** = Root domain (dwcsjgraduatetracer.com)
- Sa Namecheap, i-type lang ang `@`

### **2. About Value:**
- **Value:** `zqsz8m4v.up.railway.app`
- I-copy mo lang yung value from Railway modal

### **3. TTL:**
- **Automatic** = Recommended
- O pwede "30 min" o "1 hour"

### **4. Existing Records:**
- **Kung may existing CNAME record na:**
  - I-delete muna ang old record
  - Tapos i-add ang bago
- **O i-update ang existing record**

---

## 🆘 TROUBLESHOOTING:

### **"Record not yet detected" pa rin after 30 minutes**
- **Solution:** Normal lang yan, hintayin lang (up to 72 hours)
- I-verify kung tama ang DNS record
- I-check kung naka-save na (may "Save All Changes" button)

### **Hindi makita ang "@" option**
- **Solution:** I-type lang ang `@` sa Host field
- O iwanan blank (depende sa Namecheap interface)

### **May error sa pag-save**
- **Solution:** I-check kung tama ang format
- I-verify kung may existing record na (i-delete muna)

---

## ✅ QUICK CHECKLIST:

- [ ] I-login sa Namecheap
- [ ] Domain List → Manage → Advanced DNS
- [ ] I-click "Add New Record"
- [ ] Type: CNAME Record
- [ ] Host: @
- [ ] Value: zqsz8m4v.up.railway.app
- [ ] TTL: Automatic
- [ ] I-click "Save All Changes"
- [ ] (Optional) I-add ang www subdomain
- [ ] Bumalik sa Railway dashboard
- [ ] Hintayin ang DNS propagation (5-30 minutes)
- [ ] I-check kung "Record detected" na
- [ ] I-test ang domain: https://dwcsjgraduatetracer.com

---

## 📝 SUMMARY:

**Next Steps:**
1. ✅ I-login sa Namecheap
2. ✅ Domain List → Manage → Advanced DNS
3. ✅ I-add ang CNAME record:
   - Host: @
   - Value: zqsz8m4v.up.railway.app
4. ✅ I-click "Save All Changes"
5. ✅ Hintayin ang propagation (5-30 minutes)
6. ✅ I-test ang domain

**That's it! After DNS propagation, pwede mo na gamitin ang custom domain!** 🎉

---

**Ready? I-follow mo lang ang steps sa taas!** 🚀







