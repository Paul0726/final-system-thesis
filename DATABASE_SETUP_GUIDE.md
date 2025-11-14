# 💾 Paano Mag-Setup ng Database para sa Permanent Storage

## 🎯 STEP-BY-STEP GUIDE: PostgreSQL Database sa Railway

---

## 📋 STEP 1: I-Add ang Database sa Railway

### **1.1: Pumunta sa Railway Dashboard**

1. **Go to:** https://railway.app
2. **I-login** sa account mo
3. **I-click ang project mo** (dwcsjgraduatetracer)

### **1.2: I-Add ang PostgreSQL Database**

1. **I-click ang "New" button** (sa top right)
2. **I-click ang "Database"**
3. **I-select ang "Add PostgreSQL"**
4. **Hintayin matapos** ang setup (1-2 minutes)

### **1.3: Kopyahin ang Database URL**

1. **I-click ang PostgreSQL service** (sa project dashboard)
2. **I-click ang "Variables" tab**
3. **Hanapin ang "DATABASE_URL"**
4. **I-copy ang value** (magiging automatic na ito)

---

## 📋 STEP 2: I-Configure ang Environment Variable

### **2.1: Sa Railway Dashboard**

1. **I-click ang main service** (yung web service, hindi database)
2. **I-click ang "Variables" tab**
3. **I-click ang "New Variable"**
4. **I-add:**
   - **Name:** `DATABASE_URL`
   - **Value:** I-paste ang DATABASE_URL from PostgreSQL service
5. **I-click ang "Add"**

**Note:** Railway automatic na mag-link ang DATABASE_URL, pero i-verify mo lang.

---

## 📋 STEP 3: I-Install Dependencies Locally

**Sa Command Prompt:**

```bash
cd "C:\final system thesis"
npm install
```

**Hintayin matapos** ang installation.

---

## 📋 STEP 4: I-Test Locally (Optional)

**Kung gusto mo i-test locally:**

1. **I-create ang `.env` file** sa root folder:
   ```
   DATABASE_URL=your_database_url_here
   ```

2. **I-run ang server:**
   ```bash
   npm run server
   ```

3. **I-check kung connected** - dapat may message na "Connected to PostgreSQL database"

---

## 📋 STEP 5: I-Deploy sa Railway

**I-commit at i-push ang changes:**

```bash
cd "C:\final system thesis"
git add .
git commit -m "Add: PostgreSQL database for permanent storage"
git push origin main
```

**Railway mag-auto-deploy** at mag-connect sa database automatically.

---

## ✅ VERIFICATION:

### **Para i-verify kung gumagana:**

1. **I-submit ng survey** sa website
2. **I-check ang Admin page** - dapat makita mo ang survey
3. **I-restart ang Railway service** (sa dashboard)
4. **I-check ulit ang Admin page** - dapat nandun pa rin ang data! ✅

---

## 🎯 WHAT CHANGED:

### **Before (In-Memory):**
- ❌ Data mawawala kapag nag-restart
- ❌ Temporary storage lang

### **After (PostgreSQL):**
- ✅ **Permanent storage** - data hindi mawawala
- ✅ **Persistent** - kahit mag-restart
- ✅ **Professional** - real database

---

## 📊 DATABASE STRUCTURE:

**Table: surveys**
- All survey fields
- Automatic timestamps (created_at, updated_at)
- JSON fields for trainings and ratings

---

## 🆘 TROUBLESHOOTING:

### **"Database connection error"**
- **Solution:** I-check kung tama ang DATABASE_URL
- I-verify kung naka-add na sa Variables

### **"Table does not exist"**
- **Solution:** Normal lang sa first run
- Automatic na mag-create ang table
- Hintayin lang (1-2 minutes)

### **Data hindi nag-appear**
- **Solution:** I-check kung connected ang database
- I-verify kung may DATABASE_URL sa Variables

---

## ✅ SUMMARY:

**Steps:**
1. ✅ I-add ang PostgreSQL sa Railway
2. ✅ I-verify ang DATABASE_URL (automatic)
3. ✅ I-install dependencies (`npm install`)
4. ✅ I-commit at i-push ang changes
5. ✅ Railway mag-auto-deploy
6. ✅ Done! Permanent storage na! 🎉

---

**Ready? I-follow mo lang ang steps sa taas!** 🚀

