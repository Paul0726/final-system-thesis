# 📊 Paano Makita ang Database sa Railway

## 🎯 STEP-BY-STEP: I-View ang Database sa Railway Dashboard

---

## 📋 STEP 1: I-Access ang Railway Dashboard

1. **Pumunta sa:** https://railway.app
2. **I-login** sa account mo
3. **I-click ang project mo** (dwcsjgraduatetracer)

---

## 📋 STEP 2: I-View ang Database Service

### **Option A: Sa Project Dashboard**

1. **Sa project dashboard**, makikita mo ang list ng services
2. **Hanapin ang "PostgreSQL" service** (o "Database" service)
3. **I-click ang PostgreSQL service**

### **Option B: Sa Services List**

1. **I-click ang "Services" tab** (kung available)
2. **Hanapin ang PostgreSQL service**
3. **I-click ang service**

---

## 📋 STEP 3: I-View ang Database Data

### **3.1: Via Railway Dashboard (Basic View)**

**Sa PostgreSQL service page:**
- **"Data" tab** - Makikita mo ang basic database info
- **"Metrics" tab** - Database performance metrics
- **"Variables" tab** - Database connection details

### **3.2: Via Query Tab (View Data)**

1. **I-click ang "Query" tab** (kung available)
2. **I-run ang SQL query:**
   ```sql
   SELECT * FROM surveys;
   ```
3. **Makikita mo ang lahat ng survey data!**

### **3.3: Via Connect Tab (External Tool)**

1. **I-click ang "Connect" tab**
2. **Kopyahin ang connection details**
3. **Gamitin ang external tool** (pgAdmin, DBeaver, etc.)

---

## 📋 STEP 4: I-View ang Database via Admin Page (Easiest)

**Pinakamadaling paraan:**

1. **I-visit ang website:** `https://dwcsjgraduatetracer.it.com/admin`
2. **Makikita mo ang lahat ng survey data** sa table format
3. **Complete view** ng lahat ng fields

---

## 🔍 ALTERNATIVE: I-View via SQL Query

### **Sa Railway Query Tab:**

**I-run ang queries:**

```sql
-- View all surveys
SELECT * FROM surveys ORDER BY created_at DESC;

-- Count total surveys
SELECT COUNT(*) as total FROM surveys;

-- View by employment status
SELECT is_employed, employment_nature, COUNT(*) 
FROM surveys 
GROUP BY is_employed, employment_nature;
```

---

## 📊 WHAT YOU CAN SEE:

### **Sa Railway Dashboard:**
- ✅ Database connection status
- ✅ Database metrics (usage, performance)
- ✅ Connection variables (DATABASE_URL)
- ✅ Query interface (kung available)

### **Sa Admin Page (Recommended):**
- ✅ Complete list ng lahat ng surveys
- ✅ All fields (name, email, employment, etc.)
- ✅ Search and filter functionality
- ✅ Easy to read table format

---

## 🎯 RECOMMENDED: Gamitin ang Admin Page

**Para makita ang database data:**

1. **I-visit:** `https://dwcsjgraduatetracer.it.com/admin`
2. **Makikita mo ang lahat ng survey responses**
3. **Complete view** ng database contents

**Mas madali at mas complete!**

---

## 📋 SUMMARY:

**Para makita ang database:**

1. ✅ **Railway Dashboard** → PostgreSQL service → Query tab
2. ✅ **Admin Page** → `/admin` → Complete data view (RECOMMENDED)
3. ✅ **External Tool** → Connect via pgAdmin/DBeaver

**Pinakamadali: Gamitin ang Admin Page!** 📊

---

**I-visit mo lang ang Admin Page para makita ang lahat ng database data!** 🚀





