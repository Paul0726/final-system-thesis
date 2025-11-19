# 📝 NEXT STEP: I-Add ang DNS Record

## 🎯 Nakita mo na ang DNS Record na kailangan mo:

**From Railway Modal:**
```
Type: CNAME
Name: @
Value: zqsz8m4v.up.railway.app
```

---

## 📋 STEP-BY-STEP:

### **STEP 1: Pumunta sa Domain Registrar mo**

**Kung saan mo binili ang domain `dwcsjgraduatetracer.com`:**

- **Namecheap:** https://www.namecheap.com
- **GoDaddy:** https://www.godaddy.com
- **Google Domains:** https://domains.google
- **O kahit anong domain registrar**

---

### **STEP 2: I-Login at Pumunta sa DNS Management**

1. **I-login sa domain registrar account mo**
2. **Hanapin ang "Domain List" o "My Domains"**
3. **I-click ang domain mo:** `dwcsjgraduatetracer.com`
4. **I-click ang "DNS Management" o "Advanced DNS" o "DNS Settings"**

---

### **STEP 3: I-Add ang CNAME Record**

**I-add ang record na ito:**

```
Type: CNAME
Name: @ (o blank/root)
Value: zqsz8m4v.up.railway.app
TTL: Automatic (o 3600)
```

---

### **STEP 4: Specific Instructions by Registrar**

#### **Para sa Namecheap:**

1. **I-click ang "Advanced DNS" tab**
2. **Scroll down sa "Host Records" section**
3. **I-click ang "Add New Record"**
4. **I-fill up:**
   - **Type:** CNAME Record
   - **Host:** @
   - **Value:** zqsz8m4v.up.railway.app
   - **TTL:** Automatic
5. **I-click ang "Save All Changes"**

#### **Para sa GoDaddy:**

1. **I-click ang "DNS" button**
2. **Scroll down sa "Records" section**
3. **I-click ang "Add" button**
4. **I-fill up:**
   - **Type:** CNAME
   - **Name:** @
   - **Value:** zqsz8m4v.up.railway.app
   - **TTL:** 1 Hour
5. **I-click ang "Save"**

#### **Para sa Google Domains:**

1. **I-click ang "DNS" sa left sidebar**
2. **Scroll down sa "Custom resource records"**
3. **I-click ang "Add"**
4. **I-fill up:**
   - **DNS name:** @
   - **Resource record type:** CNAME
   - **TTL:** 3600
   - **Data:** zqsz8m4v.up.railway.app
5. **I-click ang "Add"**

---

### **STEP 5: I-Verify at Hintayin**

1. **I-save ang DNS record**
2. **Bumalik sa Railway dashboard**
3. **I-check ang modal** - dapat mag-update ang status
4. **Hintayin ang DNS propagation:**
   - Usually: 5-30 minutes
   - Maximum: 72 hours (pero rare)
   - Status sa Railway mag-update kapag detected na

---

### **STEP 6: I-Check ang Status**

**Sa Railway dashboard:**
- **"Record not yet detected"** → Hintayin pa (normal lang)
- **"Record detected" o "Verified"** → Tapos na! ✅

**Pagkatapos:**
- I-test ang domain: `https://dwcsjgraduatetracer.com`
- Dapat gumagana na!

---

## ⚠️ IMPORTANT NOTES:

### **1. About "@" Name:**
- **@** = Root domain (dwcsjgraduatetracer.com)
- Sa ibang registrars, pwede "blank" o "root" o "dwcsjgraduatetracer.com"
- I-check ang format ng registrar mo

### **2. DNS Propagation:**
- **Normal time:** 5-30 minutes
- **Maximum:** 72 hours (rare)
- **Railway mag-update automatically** kapag detected na

### **3. Multiple Records:**
- Pwede mo i-add ang **www** subdomain din (optional):
  ```
  Type: CNAME
  Name: www
  Value: zqsz8m4v.up.railway.app
  ```

---

## 🆘 TROUBLESHOOTING:

### **"Record not yet detected" pa rin after 30 minutes**
- **Solution:** Normal lang yan, hintayin lang (up to 72 hours)
- I-verify kung tama ang DNS record na na-add mo
- I-check kung naka-save na sa domain registrar

### **Hindi makita ang "@" option sa registrar**
- **Solution:** Gamitin ang "blank" o "root" o iwanan lang blank
- O i-type ang full domain: `dwcsjgraduatetracer.com`

### **May existing CNAME record na**
- **Solution:** I-delete muna ang old record, tapos i-add ang bago
- O i-update ang existing record

---

## ✅ QUICK CHECKLIST:

- [ ] I-login sa domain registrar
- [ ] Pumunta sa DNS Management
- [ ] I-add ang CNAME record:
  - Type: CNAME
  - Name: @
  - Value: zqsz8m4v.up.railway.app
- [ ] I-save ang changes
- [ ] Bumalik sa Railway dashboard
- [ ] Hintayin ang DNS propagation (5-30 minutes)
- [ ] I-check kung "Record detected" na
- [ ] I-test ang domain: `https://dwcsjgraduatetracer.com`

---

## 📝 SUMMARY:

**Next Step:**
1. ✅ I-login sa domain registrar mo
2. ✅ Pumunta sa DNS Management
3. ✅ I-add ang CNAME record:
   - Name: @
   - Value: zqsz8m4v.up.railway.app
4. ✅ I-save
5. ✅ Hintayin ang propagation (5-30 minutes)
6. ✅ I-check sa Railway kung detected na

**That's it! After DNS propagation, pwede mo na gamitin ang custom domain!** 🎉

---

**Ano ang domain registrar mo? (Namecheap, GoDaddy, etc.) Pwede ko i-guide ka step-by-step!** 🚀








