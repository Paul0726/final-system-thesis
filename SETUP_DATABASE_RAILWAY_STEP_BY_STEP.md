# 💾 Step-by-Step: Mag-Setup ng Database sa Railway

## 🎯 COMPLETE GUIDE: I-Add ang PostgreSQL Database

---

## 📋 STEP 1: I-Access ang Railway Dashboard

1. **Pumunta sa:** https://railway.app
2. **I-login** sa account mo
3. **I-click ang project mo** (dwcsjgraduatetracer)

---

## 📋 STEP 2: I-Add ang PostgreSQL Database

### **2.1: I-Click ang "New" Button**

1. **Sa project dashboard**, hanapin ang **"New" button**
   - Pwede sa top right corner
   - O sa services list (kung may existing services)
2. **I-click ang "New"**

### **2.2: I-Select ang Database**

1. **Makikita mo ang dropdown menu** o list ng options:
   - **"Database"** o **"Add Database"**
   - **"PostgreSQL"**
   - **"MySQL"**
   - etc.
2. **I-click ang "Database"** o **"Add Database"**
3. **I-select ang "PostgreSQL"**

### **2.3: Hintayin ang Setup**

1. **Railway mag-setup automatically** ng PostgreSQL database
2. **Hintayin matapos** (1-2 minutes)
3. **Makikita mo na ang PostgreSQL service** sa services list

---

## 📋 STEP 3: I-Verify ang Database Connection

### **3.1: I-Check ang PostgreSQL Service**

1. **Sa project dashboard**, makikita mo na ang **PostgreSQL service**
2. **I-click ang PostgreSQL service**

### **3.2: I-Check ang Variables**

1. **I-click ang "Variables" tab**
2. **Hanapin ang "DATABASE_URL"**
3. **Railway automatic na mag-set** ng DATABASE_URL
4. **I-copy ang DATABASE_URL** (kung kailangan)

### **3.3: I-Check ang Main Service**

1. **Bumalik sa main service** (yung web service)
2. **I-click ang "Variables" tab**
3. **Dapat may DATABASE_URL na** (automatic na mag-link)
4. **Railway automatic na mag-link** ang database sa main service

---

## 📋 STEP 4: I-Verify ang Deployment

### **4.1: I-Check ang Deploy Logs**

1. **I-click ang main service** (web service)
2. **I-click ang "Deploy Logs" tab**
3. **I-check kung may error**
4. **Dapat may message:**
   - "✅ Using PostgreSQL database"
   - "✅ Database tables initialized"

### **4.2: I-Test ang System**

1. **I-visit:** `https://dwcsjgraduatetracer.it.com`
2. **I-submit ng survey**
3. **I-check ang Admin page**
4. **Dapat makita mo na ang data**

---

## 📋 STEP 5: I-Verify ang Database

### **5.1: Via Admin Page**

1. **I-visit:** `https://dwcsjgraduatetracer.it.com/admin`
2. **Makikita mo ang lahat ng survey data**
3. **I-submit ng survey**
4. **I-restart ang Railway service** (sa dashboard)
5. **I-check ulit ang Admin page**
6. **Dapat nandun pa rin ang data!** ✅

### **5.2: Via Railway Query Tab (Optional)**

1. **I-click ang PostgreSQL service**
2. **I-click ang "Query" tab** (kung available)
3. **I-run:** `SELECT * FROM surveys;`
4. **Makikita mo ang lahat ng data**

---

## ⚠️ TROUBLESHOOTING:

### **Kung Hindi Mo Makita ang "New" Button:**

1. **I-check kung nasa correct project ka**
2. **I-refresh ang page**
3. **I-check kung may permissions ka** sa project

### **Kung Hindi Mo Makita ang "Database" Option:**

1. **I-check kung available** ang database feature sa Railway plan mo
2. **Free tier** usually may database access
3. **I-contact ang Railway support** kung may issue

### **Kung May Error sa Deployment:**

1. **I-check ang Deploy Logs**
2. **I-verify kung may DATABASE_URL** sa Variables
3. **I-check kung connected** ang database

---

## ✅ VERIFICATION CHECKLIST:

- [ ] PostgreSQL service added sa Railway
- [ ] DATABASE_URL automatically set
- [ ] Main service linked sa database
- [ ] Deployment successful (no errors)
- [ ] Survey submission working
- [ ] Data visible sa Admin page
- [ ] Data persists after server restart

---

## 🎯 WHAT HAPPENS AFTER SETUP:

### **Before (In-Memory):**
- ❌ Data mawawala kapag nag-restart
- ❌ Temporary storage

### **After (PostgreSQL):**
- ✅ **Permanent storage** - data hindi mawawala
- ✅ **Cloud-hosted** - naka-host sa Railway
- ✅ **Automatic backups** - Railway nagha-handle
- ✅ **Professional** - ready for production

---

## 📝 SUMMARY:

**Steps:**
1. ✅ Railway Dashboard → New → Database → PostgreSQL
2. ✅ Hintayin ang setup (1-2 minutes)
3. ✅ I-verify ang DATABASE_URL (automatic)
4. ✅ I-check ang deployment logs
5. ✅ I-test ang system
6. ✅ Done! Permanent storage na! 🎉

---

**Ready? I-follow mo lang ang steps sa taas!** 🚀








