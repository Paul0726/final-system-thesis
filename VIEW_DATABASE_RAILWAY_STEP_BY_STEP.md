# 📊 Paano Makita ang Database sa Railway - Step by Step

## 🎯 COMPLETE GUIDE: I-View ang Database sa Railway

---

## 📋 STEP 1: I-Access ang Railway Dashboard

1. **Pumunta sa:** https://railway.app
2. **I-login** sa account mo
3. **I-click ang project mo** (dwcsjgraduatetracer)

---

## 📋 STEP 2: I-View ang PostgreSQL Service

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

### **3.1: Via Query Tab (View Data)**

1. **I-click ang "Query" tab** (sa top navigation)
2. **I-run ang SQL query:**
   ```sql
   SELECT * FROM surveys;
   ```
3. **Makikita mo ang lahat ng survey data!**

### **3.2: Via Data Tab (Basic Info)**

1. **I-click ang "Data" tab**
2. **Makikita mo ang basic database info**
3. **Database size, connections, etc.**

### **3.3: Via Connect Tab (External Tool)**

1. **I-click ang "Connect" tab**
2. **Kopyahin ang connection details:**
   - Connection String
   - Host
   - Port
   - Database Name
   - Username
   - Password
3. **Gamitin ang external tool** (pgAdmin, DBeaver, etc.)

---

## 📋 STEP 4: Useful SQL Queries

### **View All Surveys:**
```sql
SELECT * FROM surveys ORDER BY created_at DESC;
```

### **Count Total Surveys:**
```sql
SELECT COUNT(*) as total FROM surveys;
```

### **View by Employment Status:**
```sql
SELECT is_employed, employment_nature, COUNT(*) 
FROM surveys 
GROUP BY is_employed, employment_nature;
```

### **View Recent Surveys:**
```sql
SELECT name, email_address, school_year_graduated, created_at 
FROM surveys 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## 📋 STEP 5: Via Admin Page (Easiest - Recommended)

**Pinakamadaling paraan para makita ang database:**

1. **I-visit ang website:** `https://dwcsjgraduatetracer.it.com/admin`
2. **Makikita mo ang lahat ng survey data** sa table format
3. **Complete view** ng lahat ng fields
4. **Search and filter** functionality

**Mas madali at mas complete!**

---

## 🎯 QUICK ACCESS:

### **Para Makita ang Database Data:**

**Option 1: Admin Page (Recommended)**
- URL: `https://dwcsjgraduatetracer.it.com/admin`
- Complete data view
- Search and filter
- Easy to use

**Option 2: Railway Query Tab**
- Railway Dashboard → PostgreSQL → Query tab
- Run SQL queries
- Direct database access

**Option 3: External Tool**
- Railway Dashboard → PostgreSQL → Connect tab
- Use pgAdmin, DBeaver, etc.
- Advanced features

---

## 📊 WHAT YOU CAN SEE:

### **Sa Railway Dashboard:**
- ✅ Database connection status
- ✅ Database metrics (usage, performance)
- ✅ Connection variables (DATABASE_URL)
- ✅ Query interface (kung available)

### **Sa Admin Page:**
- ✅ Complete list ng lahat ng surveys
- ✅ All fields (name, email, employment, etc.)
- ✅ Search and filter functionality
- ✅ Easy to read table format

---

## ✅ SUMMARY:

**Para makita ang database:**

1. ✅ **Admin Page** → `/admin` → Complete data view (RECOMMENDED)
2. ✅ **Railway Dashboard** → PostgreSQL → Query tab → Run SQL queries
3. ✅ **External Tool** → Connect via pgAdmin/DBeaver

**Pinakamadali: Gamitin ang Admin Page!** 📊

---

**I-visit mo lang ang Admin Page para makita ang lahat ng database data!** 🚀




