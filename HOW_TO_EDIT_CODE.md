# ✏️ Paano Mag-Edit ng Code - Step by Step

## 🎯 GUSTO MO MAG-EDIT NG CODE? Eto ang Guide!

---

## 📝 STEP 1: Buksan ang Files

### **Frontend Files (UI/Design):**
- `client/src/App.js` - Main React component (logic, features)
- `client/src/App.css` - Styling, colors, design
- `client/src/index.css` - Global styles

### **Backend Files (API/Server):**
- `server/index.js` - API endpoints, server logic

---

## 🎨 STEP 2: Mag-Edit ng Frontend

### **Example 1: Mag-Change ng Title**

**File:** `client/src/App.js`

**Hanapin:**
```javascript
<h1>🎓 Thesis Management System</h1>
```

**I-edit to:**
```javascript
<h1>🎓 My Custom Thesis System</h1>
```

**I-save:** Ctrl + S

**Result:** Makikita mo agad ang bagong title! ⚡

---

### **Example 2: Mag-Change ng Colors**

**File:** `client/src/App.css`

**Hanapin:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**I-edit to:**
```css
background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
```

**I-save:** Ctrl + S

**Result:** Makikita mo agad ang bagong color! ⚡

---

### **Example 3: Mag-Add ng Bagong Feature**

**File:** `client/src/App.js`

**I-add ng bagong button:**
```javascript
<button onClick={() => alert('Hello!')}>
  Click Me!
</button>
```

**I-save:** Ctrl + S

**Result:** Makikita mo agad ang bagong button! ⚡

---

## 🔧 STEP 3: Mag-Edit ng Backend

### **Example: Mag-Add ng Bagong API Endpoint**

**File:** `server/index.js`

**I-add ng bagong route:**
```javascript
app.get('/api/test', (req, res) => {
  res.json({ message: 'This is a test endpoint!' });
});
```

**I-save:** Ctrl + S

**Result:** Makikita mo agad sa API! ⚡

---

## ⚡ STEP 4: Makita ang Changes

### **Local Development (Instant):**

1. **I-edit ang file**
2. **I-save** (Ctrl + S)
3. **Automatic reload** - makikita mo agad sa `http://localhost:3001` ⚡

**Walang kailangan gawin - automatic!**

---

### **Live Website (Railway):**

1. **I-edit ang file**
2. **I-save** (Ctrl + S)
3. **I-commit at i-push:**
   ```bash
   git add .
   git commit -m "Update: Description ng changes"
   git push origin main
   ```
4. **Hintayin ang Railway deployment** (2-5 minutes)
5. **I-visit ang live website** - makikita mo ang changes! ✅

---

## 🎯 COMMON EDITS:

### **1. Mag-Change ng Text/Content**

**File:** `client/src/App.js`

**Example:**
```javascript
// Before
<p>Organize and manage your thesis work efficiently</p>

// After
<p>My Custom Description Here</p>
```

---

### **2. Mag-Change ng Colors**

**File:** `client/src/App.css`

**Example:**
```css
/* Before */
color: #667eea;

/* After */
color: #ff6b6b;
```

---

### **3. Mag-Add ng Bagong Section**

**File:** `client/src/App.js`

**I-add sa return statement:**
```javascript
<div className="new-section">
  <h2>New Section</h2>
  <p>This is a new section!</p>
</div>
```

---

### **4. Mag-Change ng Button Text**

**File:** `client/src/App.js`

**Example:**
```javascript
// Before
<button>Submit</button>

// After
<button>Save Changes</button>
```

---

## 💡 TIPS:

### **1. Gamitin ang Code Editor**
- **VS Code** (recommended)
- **Notepad++**
- **Sublime Text**

### **2. I-Enable ang Auto-Save**
- Sa VS Code: File → Auto Save
- Para automatic na magre-reload

### **3. Split Screen**
- **Left:** Code editor
- **Right:** Browser (`http://localhost:3001`)
- Para makita mo agad ang changes

### **4. I-Check ang Browser Console**
- Press **F12** para buksan ang DevTools
- Makikita mo ang errors (kung may error)

---

## 🆘 TROUBLESHOOTING:

### **Changes Hindi Nag-Appear**

**Solution 1: I-check kung na-save**
- I-check kung may asterisk (*) sa file name
- I-save ulit (Ctrl + S)

**Solution 2: I-restart ang dev server**
- Press Ctrl + C
- I-run ulit: `npm run dev`

**Solution 3: I-hard refresh ang browser**
- Press Ctrl + Shift + R
- O Ctrl + F5

---

## ✅ QUICK WORKFLOW:

### **Para sa Local (Instant Changes):**

1. **I-edit ang file**
2. **I-save** (Ctrl + S)
3. **Makikita mo agad!** ⚡

### **Para sa Live Website:**

1. **I-edit ang file**
2. **I-save** (Ctrl + S)
3. **I-commit at i-push:**
   ```bash
   git add .
   git commit -m "Update: Changes"
   git push origin main
   ```
4. **Hintayin ang deployment**
5. **Makikita mo sa live website!** ✅

---

## 🎯 SUMMARY:

**Para mag-edit ng code:**

1. ✅ **Buksan ang file** (App.js, App.css, etc.)
2. ✅ **I-edit ang code**
3. ✅ **I-save** (Ctrl + S)
4. ✅ **Makikita mo agad** (local) o after deployment (live)

**Simple lang! I-edit mo lang ang files, i-save, tapos makikita mo na!** 🚀

---

**Ready to edit? Buksan mo na ang files at mag-edit ka na!** ✏️








