# 🔗 Paano I-Link Manually ang Database sa Railway

## 🎯 STEP-BY-STEP: Manual Database Linking

---

## 📋 STEP 1: I-Copy ang DATABASE_URL

### **1.1: Pumunta sa PostgreSQL Service**

1. **Railway Dashboard** → I-click ang **PostgreSQL service**
2. **I-click ang "Variables" tab**
3. **Hanapin ang "DATABASE_URL"**
4. **I-click ang eye icon** (para makita ang value)
5. **I-copy ang DATABASE_URL** (buong value)

**Format ng DATABASE_URL:**
```
postgresql://user:password@host:port/database
```

---

## 📋 STEP 2: I-Add ang DATABASE_URL sa Main Service

### **2.1: Pumunta sa Main Service**

1. **Bumalik sa project dashboard**
2. **I-click ang main service** (yung web service, hindi database)
3. **I-click ang "Variables" tab**

### **2.2: I-Add ang Variable**

1. **I-click ang "New Variable" button**
2. **I-fill up:**
   - **Name:** `DATABASE_URL`
   - **Value:** I-paste ang DATABASE_URL na kinopya mo
3. **I-click ang "Add"**

---

## 📋 STEP 3: I-Verify ang Connection

### **3.1: I-Check ang Variables**

1. **Dapat makita mo na ang DATABASE_URL** sa Variables list
2. **I-verify kung tama ang value**

### **3.2: I-Redeploy ang Service**

1. **Railway automatic na mag-redeploy** kapag may bagong variable
2. **O i-click ang "Redeploy" button** (kung available)
3. **Hintayin matapos** ang deployment

---

## 📋 STEP 4: I-Check ang Deploy Logs

### **4.1: I-View ang Logs**

1. **I-click ang "Deploy Logs" tab**
2. **I-check kung may error**
3. **Dapat may message:**
   - "✅ Using PostgreSQL database"
   - "✅ Database tables initialized"

### **4.2: I-Check kung May Error**

**Kung may error:**
- I-verify kung tama ang DATABASE_URL
- I-check kung naka-copy ng buo ang value
- I-try i-redeploy ulit

---

## ⚠️ TROUBLESHOOTING:

### **Kung Hindi Mo Makita ang DATABASE_URL sa PostgreSQL Service:**

1. **I-check kung naka-setup na ang database**
2. **I-refresh ang page**
3. **I-check kung nasa correct service ka**

### **Kung May Error sa Deployment:**

1. **I-verify kung tama ang DATABASE_URL format**
2. **I-check kung walang extra spaces**
3. **I-try i-redeploy ulit**

### **Kung Hindi Gumagana:**

1. **I-delete ang DATABASE_URL variable**
2. **I-add ulit** (i-copy ulit from PostgreSQL service)
3. **I-redeploy**

---

## ✅ VERIFICATION:

**Para i-verify kung linked na:**

1. **I-check ang Variables** - dapat may DATABASE_URL
2. **I-check ang Deploy Logs** - dapat walang error
3. **I-test ang system:**
   - I-submit ng survey
   - I-check ang Admin page
   - I-restart ang server
   - I-check ulit - dapat nandun pa rin ang data

---

## 📝 SUMMARY:

**Steps:**
1. ✅ PostgreSQL service → Variables → Copy DATABASE_URL
2. ✅ Main service → Variables → Add DATABASE_URL
3. ✅ I-verify ang connection
4. ✅ I-check ang Deploy Logs
5. ✅ I-test ang system

---

**I-follow mo lang ang steps sa taas para i-link manually ang database!** 🔗




