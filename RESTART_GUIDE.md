# 🔄 RESTART GUIDE - Ano ang Mangyayari Kapag Nag-Restart?

## 📋 IBA'T IBANG RESTART SCENARIOS:

---

## 🖥️ 1. RESTART NG COMPUTER MO

### **Ano ang Mangyayari:**

**❌ Local Dev Server:**
- **Mamatay ang dev server** (`npm run dev`)
- **Kailangan mo i-restart** pagkatapos mag-restart ng computer

**✅ Live Website (Railway):**
- **Hindi maaapektuhan!** 
- **Tuloy-tuloy pa rin ang website** sa Railway
- **Walang kailangan gawin**

### **Paano I-Restart ang Dev Server:**

1. **Pagkatapos mag-restart ng computer:**
   ```bash
   cd "C:\final system thesis"
   npm run dev
   ```

2. **O i-double click ang:** `start_dev.bat`

3. **Buksan ang browser:** `http://localhost:3001`

---

## 🔄 2. RESTART NG DEV SERVER (Local)

### **Kailan Kailangan:**
- Kapag nag-crash ang server
- Kapag may error
- Kapag gusto mo i-restart

### **Paano I-Restart:**

**Option 1: Stop at Start**
1. **I-press:** `Ctrl + C` sa terminal (para i-stop)
2. **I-run ulit:** `npm run dev`

**Option 2: Gamitin ang Batch File**
1. **I-double click:** `start_dev.bat`

**Option 3: I-close at i-bukas ulit ang terminal**
1. I-close ang terminal
2. Buksan ulit
3. I-run: `npm run dev`

---

## 🌐 3. RESTART NG RAILWAY DEPLOYMENT

### **Kailan Nangyayari:**
- **Automatic restart** kapag may new deployment
- **Manual restart** kung may problema
- **Railway auto-restart** kapag may error

### **Ano ang Mangyayari:**

**✅ Normal Restart:**
- **Website magiging unavailable** for 10-30 seconds
- **Automatic na magre-recover**
- **Walang data loss** (kung may database, pero sa demo natin, in-memory lang)

**⚠️ Important Note:**
- **In-memory data** (yung items) **mawawala** kapag nag-restart
- **Kasi hindi naka-save sa database**
- **Pero ang code changes mo, nandun pa rin**

### **Paano I-Manual Restart sa Railway:**

1. **Pumunta sa Railway:** https://railway.app
2. **I-click ang project mo**
3. **I-click ang "Deployments" tab**
4. **I-click ang latest deployment**
5. **I-click ang "Redeploy" button** (kung available)
6. **O kaya i-push ng bagong commit** para mag-auto-restart

---

## 🔧 4. RESTART NG COMPUTER + DEV SERVER

### **Complete Process:**

1. **I-restart ang computer**
2. **Pagkatapos mag-restart:**
   ```bash
   cd "C:\final system thesis"
   npm run dev
   ```
3. **Buksan ang browser:** `http://localhost:3001`
4. **Ready na ulit!**

---

## 📝 5. RESTART + DEPLOYMENT

### **Scenario:**
- Nag-restart ka ng computer
- Gusto mo i-deploy ang changes sa Railway

### **Process:**

1. **I-restart ang computer** (optional)
2. **I-run ang dev server** (para i-test locally):
   ```bash
   npm run dev
   ```
3. **I-test ang changes** sa `http://localhost:3001`
4. **Kung OK na, i-deploy:**
   ```bash
   git add .
   git commit -m "Update: Description"
   git push origin main
   ```
5. **Hintayin ang Railway deployment**

---

## ⚠️ IMPORTANT NOTES:

### **Local Dev Server:**
- ❌ **Mamatay** kapag nag-restart ng computer
- ✅ **Kailangan i-restart** manually
- ✅ **Walang data loss** (kasi in-memory lang)

### **Live Website (Railway):**
- ✅ **Hindi maaapektuhan** ng computer restart mo
- ✅ **Tuloy-tuloy pa rin** ang website
- ⚠️ **In-memory data mawawala** kapag nag-restart ang Railway server
- ✅ **Code changes nandun pa rin** (kasi naka-save sa GitHub)

---

## 🚀 QUICK REFERENCE:

### **After Computer Restart:**
```bash
cd "C:\final system thesis"
npm run dev
```

### **Restart Dev Server:**
```bash
# Press Ctrl + C to stop
npm run dev  # to start again
```

### **Restart Railway Deployment:**
- **Automatic:** Kapag nag-push ka ng bagong commit
- **Manual:** Sa Railway dashboard → Redeploy

---

## ✅ SUMMARY:

| Scenario | Action Needed | Data Loss? |
|----------|---------------|------------|
| **Computer Restart** | I-restart ang dev server | ❌ No (local) |
| **Dev Server Restart** | I-run ulit `npm run dev` | ❌ No |
| **Railway Restart** | Automatic (o manual redeploy) | ⚠️ Yes (in-memory data) |
| **Code Changes** | I-commit at i-push | ❌ No |

---

**Need help? I-check ang specific scenario mo!** 🔄





