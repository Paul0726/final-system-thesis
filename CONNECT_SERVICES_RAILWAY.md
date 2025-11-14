# 🔗 Paano I-Connect ang Web at Postgres sa Railway

## 🎯 STEP-BY-STEP: I-Link ang Database sa Web Service

---

## 📋 METHOD 1: Via Variables Tab (Recommended)

### **STEP 1: I-Copy ang DATABASE_URL from Postgres**

1. **Railway Dashboard** → I-click ang **Postgres service** (yung may elephant icon)
2. **I-click ang "Variables" tab**
3. **Hanapin ang "DATABASE_URL"**
4. **I-click ang eye icon** (👁️) para makita ang value
5. **I-copy ang buong DATABASE_URL**

---

### **STEP 2: I-Add sa Web Service**

1. **I-click ang "web" service** (yung may GitHub icon)
2. **I-click ang "Variables" tab**
3. **I-click ang "New Variable" button** (o "+ New")
4. **I-fill up:**
   - **Name:** `DATABASE_URL`
   - **Value:** I-paste ang DATABASE_URL na kinopya mo
5. **I-click ang "Add"**

---

### **STEP 3: I-Wait for Auto-Redeploy**

1. **Railway automatic na mag-redeploy** kapag may bagong variable
2. **Hintayin matapos** ang deployment (1-2 minutes)
3. **I-check ang Deploy Logs** - dapat walang error

---

## 📋 METHOD 2: Via Shared Variable (Alternative)

### **STEP 1: I-Share ang Variable**

1. **Railway Dashboard** → Postgres service
2. **I-click ang "Variables" tab**
3. **I-click ang "Shared Variable" button** (kung available)
4. **I-select ang DATABASE_URL**
5. **I-click ang "Share"**

### **STEP 2: I-Use sa Web Service**

1. **Web service** → Variables tab
2. **Dapat may DATABASE_URL na** (shared automatically)
3. **Railway automatic na mag-link**

---

## 📋 METHOD 3: Via Service Linking (If Available)

### **STEP 1: I-Check ang Service Settings**

1. **Web service** → Settings tab
2. **I-look for "Dependencies"** o "Service Links"
3. **I-click ang "Add Dependency"** o "Link Service"
4. **I-select ang Postgres service**
5. **Railway automatic na mag-link**

---

## ✅ VERIFICATION:

### **STEP 1: I-Check ang Variables**

1. **Web service** → Variables tab
2. **Dapat may DATABASE_URL na**
3. **I-verify kung tama ang value**

### **STEP 2: I-Check ang Deploy Logs**

1. **Web service** → Deploy Logs tab
2. **Dapat makita mo:**
   - "✅ Using PostgreSQL database"
   - "✅ Database connection successful"
   - "✅ Database tables initialized"
   - "💾 Database: PostgreSQL (Connected)"

**Hindi dapat:**
- "⚠️ DATABASE_URL not found"
- "Error initializing database"

---

## ⚠️ TROUBLESHOOTING:

### **Kung Hindi Mo Makita ang "New Variable" Button:**

1. **I-check kung nasa correct service ka** (web service, hindi Postgres)
2. **I-refresh ang page**
3. **I-check kung may permissions ka**

### **Kung May Error sa Deployment:**

1. **I-verify kung tama ang DATABASE_URL format**
2. **I-check kung walang extra spaces**
3. **I-try i-redeploy ulit**

---

## 📝 SUMMARY:

**Steps:**
1. ✅ Postgres service → Variables → Copy DATABASE_URL
2. ✅ Web service → Variables → Add DATABASE_URL
3. ✅ Hintayin ang auto-redeploy
4. ✅ I-verify sa Deploy Logs

---

**I-follow mo lang ang Method 1 para i-connect ang services!** 🔗

