# 📚 Setup Guide - Paano i-setup ang Repository

## Step 1: Install Git (kung wala pa)

1. **Download Git:**
   - Pumunta sa: https://git-scm.com/download/win
   - Download at install ang Git for Windows

2. **Verify installation:**
   ```bash
   git --version
   ```

## Step 2: Initialize Git Repository

Buksan ang terminal/command prompt sa project folder at i-run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Thesis System with Railway deployment"
```

## Step 3: Create GitHub Repository

### Option A: Via GitHub Website

1. **Pumunta sa GitHub:**
   - Go to: https://github.com
   - Sign in (o mag-sign up kung wala pa)

2. **Create New Repository:**
   - Click ang "+" icon sa top right
   - Select "New repository"
   - Repository name: `final-system-thesis` (o kahit anong name)
   - Description: "Thesis System Web Application"
   - **HUWAG** i-check ang "Initialize with README" (may files na tayo)
   - Click "Create repository"

3. **Copy ang repository URL:**
   - Makikita mo ang URL na parang: `https://github.com/yourusername/final-system-thesis.git`

### Option B: Via GitHub CLI (kung installed)

```bash
gh repo create final-system-thesis --public --source=. --remote=origin --push
```

## Step 4: Connect Local Repository to GitHub

```bash
# Add remote repository (palitan ang URL ng actual GitHub repo URL mo)
git remote add origin https://github.com/YOUR_USERNAME/final-system-thesis.git

# Rename branch to main (kung needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** Hihingin ang GitHub username at password/token mo. Kung may 2FA enabled, kailangan ng Personal Access Token.

## Step 5: Create Personal Access Token (kung needed)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Railway Deployment`
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **COPY ANG TOKEN** (hindi mo na makikita ulit!)
7. Gamitin ang token bilang password kapag nag-push

## Step 6: Deploy to Railway

### Via Railway Dashboard:

1. **Go to Railway:**
   - Pumunta sa: https://railway.app
   - Sign up/Login (pwedeng gamitin ang GitHub account)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Piliin ang repository mo: `final-system-thesis`
   - Click "Deploy Now"

3. **Configure (kung needed):**
   - Railway auto-detect ang Node.js
   - Build Command: `npm run install-all && npm run build`
   - Start Command: `npm start`
   - Root Directory: `/` (root)

4. **Wait for Deployment:**
   - Railway mag-build at mag-deploy automatically
   - Makikita mo ang progress sa dashboard

5. **Get Public URL:**
   - Pagkatapos ng deployment, click ang project
   - Click "Settings" → "Generate Domain"
   - O kaya click ang "Deployments" tab
   - Makikita mo ang public URL (parang: `your-app.railway.app`)

## Quick Commands Summary

```bash
# 1. Initialize git
git init

# 2. Add files
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Add remote (palitan ang URL)
git remote add origin https://github.com/YOUR_USERNAME/final-system-thesis.git

# 5. Push to GitHub
git push -u origin main
```

## Troubleshooting

### "git is not recognized"
- Install Git: https://git-scm.com/download/win
- Restart terminal after installation

### "Authentication failed"
- Gumamit ng Personal Access Token instead of password
- O i-setup ang SSH keys

### "Repository not found"
- Check kung tama ang repository URL
- Check kung may access ka sa repository

### Railway deployment fails
- Check ang build logs sa Railway dashboard
- Make sure lahat ng dependencies naka-install
- Check kung tama ang build/start commands

---

**Need help?** Check ang logs sa Railway dashboard o i-review ang README.md








