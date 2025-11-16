# 🔧 Fix: Database Host Error - ENOTFOUND postgres.railway.internal

## 🎯 PROBLEMA:

**Error:**
- "Error initializing database: getaddrinfo ENOTFOUND postgres.railway.internal"

**Ibig sabihin:** Hindi accessible ang internal Railway hostname.

---

## 📋 SOLUTION:

### **STEP 1: I-Check ang DATABASE_URL Format**

1. **Railway Dashboard** → PostgreSQL service → Variables tab
2. **I-check ang DATABASE_URL**
3. **Dapat may format:**
   ```
   postgresql://postgres:password@host:port/railway
   ```

### **STEP 2: I-Use ang Public Connection String**

**Kung ang DATABASE_URL ay gumagamit ng `postgres.railway.internal`:**
1. **I-click ang PostgreSQL service**
2. **I-click ang "Connect" tab**
3. **I-copy ang "Connection String"** (public connection)
4. **I-update ang DATABASE_URL** sa main service

### **STEP 3: I-Update ang DATABASE_URL**

1. **Main service** → Variables tab
2. **I-click ang DATABASE_URL variable**
3. **I-edit** (i-click ang edit icon)
4. **I-replace ang value** with public connection string
5. **I-save**

---

## ⚠️ ALTERNATIVE: I-Check kung May Public URL

**Kung walang public connection string:**

1. **I-check ang PostgreSQL service** → Connect tab
2. **I-look for "Public Networking"** o "Public URL"
3. **I-enable kung available**
4. **I-copy ang public connection string**

---

## ✅ VERIFICATION:

**Pagkatapos ng update:**

1. **Railway mag-auto-redeploy**
2. **I-check ang Deploy Logs**
3. **Dapat walang error na**
4. **Dapat may:**
   - "✅ Database connection successful"
   - "✅ Database tables initialized"

---

## 📝 SUMMARY:

**Steps:**
1. ✅ I-check ang DATABASE_URL format
2. ✅ I-use ang public connection string
3. ✅ I-update ang DATABASE_URL
4. ✅ I-verify sa logs

---

**I-check mo ang DATABASE_URL at i-update kung kailangan!** 🔧





