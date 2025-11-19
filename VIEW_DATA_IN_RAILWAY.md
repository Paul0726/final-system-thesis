# 📊 Paano Makita ang Survey Responses sa Railway

## 🎯 STEP-BY-STEP: I-View ang Data sa Railway Database

---

## 📋 OPTION 1: Via Railway Database Tab (Easiest)

### **STEP 1: I-Access ang PostgreSQL Service**

1. **Railway Dashboard** → I-click ang **Postgres service** (sa sidebar)
2. **I-click ang "Database" tab** (sa top navigation)

### **STEP 2: I-View ang Data**

1. **Makikita mo ang "Postgres DB" interface**
2. **I-click ang "Query" button** o "Run Query"
3. **I-run ang SQL query:**
   ```sql
   SELECT * FROM surveys ORDER BY created_at DESC;
   ```
4. **Makikita mo ang lahat ng survey responses!**

---

## 📋 OPTION 2: Via Query Tab

### **STEP 1: I-Access ang PostgreSQL Service**

1. **Railway Dashboard** → I-click ang **Postgres service**
2. **I-click ang "Query" tab** (kung available)

### **STEP 2: I-Run ang SQL Queries**

**View All Surveys:**
```sql
SELECT * FROM surveys ORDER BY created_at DESC;
```

**View Specific Fields:**
```sql
SELECT name, email_address, school_year_graduated, is_employed, employment_nature 
FROM surveys 
ORDER BY created_at DESC;
```

**Count Total:**
```sql
SELECT COUNT(*) as total FROM surveys;
```

**View by Employment Status:**
```sql
SELECT is_employed, employment_nature, COUNT(*) 
FROM surveys 
GROUP BY is_employed, employment_nature;
```

---

## 📋 OPTION 3: Via Connect Tab (External Tool)

### **STEP 1: I-Get ang Connection Details**

1. **Railway Dashboard** → Postgres service
2. **I-click ang "Connect" tab**
3. **Kopyahin ang connection details:**
   - Connection String
   - Host
   - Port
   - Database Name
   - Username
   - Password

### **STEP 2: Gamitin ang External Tool**

**Option A: pgAdmin**
1. Download: https://www.pgadmin.org/
2. I-add ang connection
3. I-query ang database

**Option B: DBeaver**
1. Download: https://dbeaver.io/
2. I-add ang PostgreSQL connection
3. I-view ang data

**Option C: TablePlus**
1. Download: https://tableplus.com/
2. I-add ang PostgreSQL connection
3. I-view ang data

---

## 📋 OPTION 4: Via Admin Page (Easiest - Recommended)

**Pinakamadaling paraan:**

1. **I-visit:** `https://dwcsjgraduatetracer.it.com/admin`
2. **Makikita mo ang lahat ng survey responses** sa table format
3. **Complete view** ng lahat ng fields
4. **Search and filter** functionality

---

## 🎯 RECOMMENDED: Gamitin ang Database Tab

**Para makita ang data sa Railway:**

1. **Railway Dashboard** → Postgres service
2. **I-click ang "Database" tab**
3. **I-run ang query:**
   ```sql
   SELECT * FROM surveys ORDER BY created_at DESC;
   ```
4. **Makikita mo ang lahat ng data!**

---

## ✅ SUMMARY:

**Para makita ang survey responses:**

1. ✅ **Railway Database Tab** → Postgres → Database tab → Run query
2. ✅ **Admin Page** → `/admin` → Complete data view (RECOMMENDED)
3. ✅ **External Tool** → Connect via pgAdmin/DBeaver
4. ✅ **Query Tab** → Run SQL queries

**Pinakamadali: Gamitin ang Database Tab sa Railway!** 📊

---

**I-try mo i-click ang "Database" tab sa Postgres service!** 🚀








