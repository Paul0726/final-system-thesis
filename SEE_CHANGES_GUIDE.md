# 👀 Paano Makita ang Changes sa Website

## 🎯 PARA SA LOCAL (Makikita mo agad sa computer mo)

### **STEP 1: Install Dependencies**

**Sa Command Prompt, i-run:**

```bash
cd "C:\final system thesis"
cd client
npm install
```

**Hintayin matapos ang installation** (1-2 minutes)

### **STEP 2: I-run ang Development Server**

**Bumalik sa root folder at i-run:**

```bash
cd "C:\final system thesis"
npm run dev
```

**O kaya i-run ang individual servers:**

**Terminal 1 (Backend):**
```bash
cd "C:\final system thesis"
npm run server
```

**Terminal 2 (Frontend) - sa bagong terminal:**
```bash
cd "C:\final system thesis"
cd client
npm start
```

### **STEP 3: Buksan ang Browser**

**Automatic na mag-open ang browser sa:**
- `http://localhost:3001`

**O kaya manually i-open:**
- Buksan ang browser
- I-type: `http://localhost:3001`

### **STEP 4: Makikita mo na ang Changes!**

- ✅ **Landing Page** - BSIT TRACER GRADUATE
- ✅ **Green Theme** - Green colors everywhere
- ✅ **Navigation** - Pwede mo i-click ang links

**I-try mo:**
- I-click ang "Take Survey" → Survey Page
- I-click ang "View Dashboard" → Dashboard Page
- I-click ang "Admin Panel" → Admin Page

---

## 🌐 PARA SA LIVE WEBSITE (Railway)

### **STEP 1: Install Dependencies (kung hindi pa)**

```bash
cd "C:\final system thesis"
cd client
npm install
```

### **STEP 2: I-commit at I-push ang Changes**

**Sa Command Prompt:**

```bash
cd "C:\final system thesis"
git add .
git commit -m "Update: BSIT TRACER GRADUATE with Landing, Survey, Dashboard, and Admin pages - Green theme"
git push origin main
```

### **STEP 3: Hintayin ang Railway Deployment**

1. **Pumunta sa Railway:** https://railway.app
2. **I-click ang project mo**
3. **I-click ang "Deployments" tab**
4. **Hintayin matapos** (2-5 minutes)
5. **Dapat may green checkmark** kapag successful

### **STEP 4: I-visit ang Live Website**

1. **Kunin ang Project URL** sa Railway
2. **I-open sa browser**
3. **Makikita mo na ang changes!** 🎉

---

## ⚡ QUICK START (Local)

**Para makita agad sa local:**

1. **I-run:**
   ```bash
   cd "C:\final system thesis\client"
   npm install
   ```

2. **I-run:**
   ```bash
   cd "C:\final system thesis"
   npm run dev
   ```

3. **Buksan:** `http://localhost:3001`

4. **Makikita mo na!** ⚡

---

## 🆘 TROUBLESHOOTING

### **"react-router-dom not found"**
- **Solution:** I-run mo ang `npm install` sa client folder
- O i-run: `cd client && npm install`

### **Port already in use**
- **Solution:** I-close ang other applications na gumagamit ng port 3000/3001
- O i-restart ang terminal

### **Changes hindi nag-appear**
- **Solution:** 
  1. I-hard refresh ang browser (Ctrl + Shift + R)
  2. O i-restart ang dev server (Ctrl + C → `npm run dev`)

### **"Cannot find module" errors**
- **Solution:** I-run mo ang `npm install` sa client folder
- Tapos i-run ulit ang `npm run dev`

---

## ✅ SUMMARY

**Para sa Local:**
1. ✅ `cd client && npm install`
2. ✅ `npm run dev`
3. ✅ Buksan ang `http://localhost:3001`
4. ✅ **Makikita mo na!** ⚡

**Para sa Live Website:**
1. ✅ `cd client && npm install`
2. ✅ `git add . && git commit -m "Update" && git push origin main`
3. ✅ Hintayin ang Railway deployment
4. ✅ I-visit ang live URL
5. ✅ **Makikita mo na!** 🎉

---

**Ready? I-run mo na ang commands!** 🚀










