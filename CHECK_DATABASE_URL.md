# 🔍 Paano I-Check at I-Fix ang DATABASE_URL

## 🎯 QUICK CHECK:

### **STEP 1: I-Check ang DATABASE_URL sa PostgreSQL Service**

1. **Railway Dashboard** → PostgreSQL service
2. **I-click ang "Variables" tab**
3. **Hanapin ang DATABASE_URL**
4. **I-click ang eye icon** para makita ang value

**I-check kung:**
- ✅ May `postgresql://` sa start
- ✅ May hostname (hindi `postgres.railway.internal`)
- ✅ May port number
- ✅ May database name

---

### **STEP 2: I-Check ang DATABASE_URL sa Main Service**

1. **Main service** → Variables tab
2. **I-check ang DATABASE_URL value**
3. **Dapat same** sa PostgreSQL service

---

### **STEP 3: I-Use ang Public Connection String**

**Kung ang DATABASE_URL ay may `postgres.railway.internal`:**

1. **PostgreSQL service** → Connect tab
2. **I-look for "Connection String"** o "Public URL"
3. **I-copy ang public connection string**
4. **I-update ang DATABASE_URL** sa main service

---

## ⚠️ IMPORTANT:

**Railway Internal vs Public:**
- **Internal:** `postgres.railway.internal` - hindi accessible from web service
- **Public:** `host.railway.app` o similar - accessible from web service

**Kailangan:** Public connection string para sa web service.

---

## ✅ SOLUTION:

**I-update ang DATABASE_URL:**
1. I-copy ang public connection string from PostgreSQL service
2. I-update ang DATABASE_URL sa main service
3. I-save at hintayin ang redeploy

---

**I-check mo ang DATABASE_URL at i-update kung kailangan!** 🔧

