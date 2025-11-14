# 📖 COMPLETE STEP-BY-STEP GUIDE - Saan at Paano Gawin

## 🎯 PART 1: INSTALL GIT (Kung wala pa)

### Step 1.1: I-download ang Git
1. **Buksan ang web browser** (Chrome, Edge, Firefox, etc.)
2. **I-type sa address bar:** `https://git-scm.com/download/win`
3. **Press Enter**
4. **Mag-download automatically** - hintayin matapos
5. **I-double click ang downloaded file** (parang `Git-2.x.x-64-bit.exe`)
6. **Follow installation wizard:**
   - Click "Next" sa lahat
   - Click "Install"
   - Hintayin matapos
   - Click "Finish"

### Step 1.2: I-verify kung naka-install
1. **Buksan ang Command Prompt o PowerShell:**
   - Press `Windows Key + R`
   - I-type: `cmd` o `powershell`
   - Press Enter
   
2. **I-type ang command:**
   ```
   git --version
   ```
   - Press Enter
   - Dapat makita mo: `git version 2.x.x` (kahit anong number)
   - **Kung may error:** I-restart ang computer, tapos subukan ulit

---

## 🎯 PART 2: I-SETUP ANG GIT REPOSITORY (Sa Computer Mo)

### Step 2.1: Buksan ang Terminal/Command Prompt sa Project Folder

**Option A: Via File Explorer (Pinakamadali)**
1. **Buksan ang File Explorer** (folder icon sa taskbar)
2. **Pumunta sa:** `C:\final system thesis`
3. **I-click ang address bar** (yung nasa taas na may path)
4. **I-type:** `cmd` o `powershell`
5. **Press Enter**
   - ✅ Dapat may lumabas na black/blue window (Command Prompt/PowerShell)
   - ✅ Dapat nasa folder mo na: `C:\final system thesis`

**Option B: Via Command Prompt**
1. Press `Windows Key + R`
2. I-type: `cmd`
3. Press Enter
4. I-type: `cd "C:\final system thesis"`
5. Press Enter

### Step 2.2: I-initialize ang Git Repository

**Sa Command Prompt/PowerShell window, i-type ang commands isa-isa:**

```bash
git init
```
- Press Enter
- Dapat makita mo: `Initialized empty Git repository in C:/final system thesis/.git`

```bash
git add .
```
- Press Enter
- Walang message, normal lang yan

```bash
git commit -m "Initial commit: Thesis System"
```
- Press Enter
- Dapat may message na parang: `[main (root-commit) xxxxx] Initial commit`

**✅ Tapos na ang Part 2!**

---

## 🎯 PART 3: GUMAWA NG GITHUB REPOSITORY (Sa Website)

### Step 3.1: Mag-sign up/Login sa GitHub

1. **Buksan ang web browser**
2. **I-type sa address bar:** `https://github.com`
3. **Press Enter**
4. **Kung wala ka pa account:**
   - Click "Sign up" (sa top right)
   - I-fill up ang form
   - I-verify ang email
5. **Kung may account ka na:**
   - Click "Sign in" (sa top right)
   - I-login

### Step 3.2: Gumawa ng Bagong Repository

1. **Sa GitHub website, hanapin ang "+" icon** (sa top right corner, katabi ng profile picture)
2. **I-click ang "+"**
3. **I-click ang "New repository"** (sa dropdown menu)

4. **I-fill up ang form:**
   - **Repository name:** `final-system-thesis` (o kahit anong name, walang spaces)
   - **Description:** `Thesis System Web Application` (optional)
   - **Public o Private:** Piliin mo (Public = makikita ng lahat, Private = ikaw lang)
   - **⚠️ IMPORTANTE:** HUWAG i-check ang "Add a README file"
   - **⚠️ IMPORTANTE:** HUWAG i-check ang "Add .gitignore"
   - **⚠️ IMPORTANTE:** HUWAG i-check ang "Choose a license"

5. **I-click ang green button na "Create repository"**

### Step 3.3: Kopyahin ang Repository URL

**Pagkatapos ma-create ang repository, makikita mo ang page na may instructions.**

1. **Hanapin ang section na "Quick setup"**
2. **May makikita kang URL na parang:**
   ```
   https://github.com/YOUR_USERNAME/final-system-thesis.git
   ```
3. **I-click ang copy icon** (yung parang dalawang papel na icon) sa tabi ng URL
   - O i-highlight ang URL, right-click, Copy
4. **I-save mo muna sa notepad** para hindi mo makalimutan

**✅ Tapos na ang Part 3!**

---

## 🎯 PART 4: I-CONNECT ANG LOCAL REPO SA GITHUB

### Step 4.1: Bumalik sa Command Prompt/PowerShell

1. **Bumalik sa Command Prompt window** (yung ginamit mo sa Part 2)
2. **Dapat nasa folder pa rin:** `C:\final system thesis`

### Step 4.2: I-add ang Remote Repository

**I-type ang command (PALITAN ang URL ng actual GitHub repo URL mo):**

```bash
git remote add origin https://github.com/YOUR_USERNAME/final-system-thesis.git
```
- **⚠️ PALITAN:** `YOUR_USERNAME` ng actual GitHub username mo
- **⚠️ PALITAN:** `final-system-thesis` kung iba ang name ng repo mo
- Press Enter
- Walang message, normal lang yan

**Example:**
Kung username mo ay `juan123` at repo name ay `final-system-thesis`:
```bash
git remote add origin https://github.com/juan123/final-system-thesis.git
```

### Step 4.3: I-rename ang Branch

```bash
git branch -M main
```
- Press Enter
- Walang message, normal lang yan

### Step 4.4: I-push sa GitHub

```bash
git push -u origin main
```
- Press Enter
- **Hihingin ang username at password mo:**
  - **Username:** I-type ang GitHub username mo
  - **Password:** I-type ang GitHub password mo (o Personal Access Token kung may 2FA)

**⚠️ KUNG MAY ERROR SA PASSWORD:**
- Kailangan mo ng Personal Access Token (tingnan ang Part 5)

**✅ Tapos na ang Part 4!**

---

## 🎯 PART 5: GUMAWA NG PERSONAL ACCESS TOKEN (Kung kailangan)

### Step 5.1: Pumunta sa GitHub Settings

1. **Sa GitHub website, i-click ang profile picture** (top right)
2. **I-click ang "Settings"** (sa dropdown menu)

### Step 5.2: Gumawa ng Token

1. **Sa left sidebar, scroll down**
2. **I-click ang "Developer settings"** (sa pinakababa)
3. **I-click ang "Personal access tokens"**
4. **I-click ang "Tokens (classic)"**
5. **I-click ang "Generate new token"**
6. **I-click ang "Generate new token (classic)"**

### Step 5.3: I-configure ang Token

1. **Note:** I-type: `Railway Deployment` (o kahit anong name)
2. **Expiration:** Piliin mo (30 days, 60 days, o No expiration)
3. **Select scopes:** I-check ang `repo` (full control of private repositories)
4. **I-click ang "Generate token"** (sa pinakababa)

### Step 5.4: Kopyahin ang Token

1. **⚠️ IMPORTANTE:** Kopyahin ang token agad (hindi mo na makikita ulit!)
2. **I-save sa notepad** para hindi mo makalimutan
3. **Gamitin ang token bilang password** kapag nag-push (Part 4.4)

**✅ Tapos na ang Part 5!**

---

## 🎯 PART 6: I-DEPLOY SA RAILWAY

### Step 6.1: Mag-sign up/Login sa Railway

1. **Buksan ang web browser**
2. **I-type sa address bar:** `https://railway.app`
3. **Press Enter**
4. **I-click ang "Login" o "Start a New Project"**
5. **I-click ang "Login with GitHub"** (pinakamadali)
6. **I-authorize ang Railway** (i-click ang "Authorize railway")

### Step 6.2: Gumawa ng Bagong Project

1. **Sa Railway dashboard, i-click ang "New Project"** (green button)
2. **I-click ang "Deploy from GitHub repo"**
3. **Kung first time, i-authorize ang Railway** (i-click ang "Configure GitHub App")
4. **Piliin ang repository:** `final-system-thesis` (o yung name ng repo mo)
5. **I-click ang repository name**

### Step 6.3: Hintayin ang Deployment

1. **Railway mag-start ng deployment automatically**
2. **Makikita mo ang build logs** (parang terminal output)
3. **Hintayin matapos** (usually 2-5 minutes)
4. **Dapat may green checkmark** kapag successful

### Step 6.4: Kunin ang Public URL

1. **I-click ang project** (yung name ng project mo)
2. **I-click ang "Settings" tab** (sa top)
3. **Scroll down sa "Domains" section**
4. **I-click ang "Generate Domain"** (kung wala pa)
5. **O kaya i-click ang "Deployments" tab**
6. **I-click ang latest deployment**
7. **Makikita mo ang "Domains" section** - yan ang public URL mo!

**Example URL:** `your-app-name.railway.app`

### Step 6.5: I-test ang Website

1. **I-copy ang URL**
2. **I-paste sa browser**
3. **Press Enter**
4. **Dapat makita mo ang Thesis System website!** 🎉

**✅ TAPOS NA! Naka-deploy na ang website mo sa Railway!**

---

## 🆘 TROUBLESHOOTING

### "git is not recognized"
- **Solution:** I-install ang Git (Part 1)
- I-restart ang computer pagkatapos

### "fatal: not a git repository"
- **Solution:** Dapat nasa tamang folder ka (`C:\final system thesis`)
- I-run: `cd "C:\final system thesis"`

### "Authentication failed" sa git push
- **Solution:** Gumamit ng Personal Access Token (Part 5)
- Gamitin ang token bilang password

### "Repository not found"
- **Solution:** Check kung tama ang repository URL
- I-verify sa GitHub kung existing ang repository

### Railway deployment fails
- **Solution:** 
  1. I-click ang deployment sa Railway
  2. I-check ang "Logs" tab
  3. Hanapin ang error message
  4. Usually, kailangan i-check ang build commands

---

## 📝 SUMMARY NG LAHAT NG COMMANDS

**Sa Command Prompt (isa-isa, press Enter after each):**

```bash
cd "C:\final system thesis"
git init
git add .
git commit -m "Initial commit: Thesis System"
git remote add origin https://github.com/YOUR_USERNAME/final-system-thesis.git
git branch -M main
git push -u origin main
```

**⚠️ PALITAN:** `YOUR_USERNAME` at `final-system-thesis` ng actual values mo!

---

**Need more help?** I-check ang logs o i-review ang steps ulit. Good luck! 🚀

