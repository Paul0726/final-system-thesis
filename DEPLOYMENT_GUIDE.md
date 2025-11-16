# 🚀 DEPLOYMENT GUIDE

## **QUICK DEPLOYMENT (Using Batch File)**

1. **Double-click** `DEPLOY_NOW.bat`
2. Wait for the commands to complete
3. Check Railway dashboard for deployment status

---

## **MANUAL DEPLOYMENT (Step-by-Step)**

### **Option 1: Using Command Prompt (CMD)**

1. **Open Command Prompt** (not PowerShell)
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to project folder:**
   ```cmd
   cd "C:\final system thesis"
   ```

3. **Add all files:**
   ```cmd
   git add .
   ```

4. **Commit changes:**
   ```cmd
   git commit -m "Add new features: Alumni popup, Gmail OTP login, Ratings & Feedback, Enhanced Admin page"
   ```

5. **Push to GitHub:**
   ```cmd
   git push origin main
   ```

6. **Railway will automatically deploy!**
   - Go to Railway dashboard
   - Check deployment logs

---

### **Option 2: Using Git Bash**

1. **Open Git Bash**
2. **Navigate to project:**
   ```bash
   cd "/c/final system thesis"
   ```

3. **Run deployment commands:**
   ```bash
   git add .
   git commit -m "Add new features: Alumni popup, Gmail OTP login, Ratings & Feedback, Enhanced Admin page"
   git push origin main
   ```

---

## **IMPORTANT: Gmail OTP Setup**

After deployment, you need to set up Gmail App Password for OTP to work:

### **Step 1: Enable 2-Step Verification**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"

### **Step 2: Generate App Password**
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Name it "Railway OTP"
4. Click "Generate"
5. **Copy the 16-character password**

### **Step 3: Add to Railway Environment Variables**
1. Go to Railway dashboard
2. Select your web service
3. Go to **Variables** tab
4. Add these variables:
   - **Name:** `GMAIL_USER`
   - **Value:** `johnpauld750@gmail.com`
   
   - **Name:** `GMAIL_APP_PASSWORD`
   - **Value:** `<paste-your-16-character-app-password>`

5. Click **Add** for each variable
6. Railway will automatically redeploy

---

## **VERIFY DEPLOYMENT**

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on your service
   - Check "Deploy Logs"
   - Look for: "✅ Database tables initialized"

2. **Test the Website:**
   - Visit: `https://dwcsjgraduatetracer.it.com`
   - Test survey submission
   - Test admin login (OTP)

3. **Check Features:**
   - ✅ Alumni popup appears before survey
   - ✅ Ratings and feedback in survey
   - ✅ Admin login with OTP
   - ✅ Complete survey information in admin
   - ✅ Scrolling feedback on landing page

---

## **TROUBLESHOOTING**

### **If deployment fails:**
1. Check Railway logs for errors
2. Make sure all dependencies are in `package.json`
3. Verify database connection in Railway

### **If OTP doesn't work:**
1. Verify Gmail App Password is correct
2. Check Railway environment variables
3. Check Railway logs for email errors

### **If database errors:**
1. Verify PostgreSQL service is running in Railway
2. Check `DATABASE_URL` is set correctly
3. Check Railway logs for connection errors

---

## **SUCCESS! 🎉**

Once deployed, your system will have:
- ✅ Alumni verification popup
- ✅ Gmail OTP admin login
- ✅ Complete survey information display
- ✅ Ratings and feedback system
- ✅ Scrolling feedback on landing page
- ✅ Enhanced sorting and filtering




