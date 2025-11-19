# ⚡ QUICK SETUP: Custom Domain

## 🎯 Para sa `dwcsjgraduatetracer.com`:

### **STEP 1: Railway Dashboard**
1. Go to: https://railway.app
2. Click your project
3. Settings → Domains
4. Click "Add Custom Domain"
5. Enter: `dwcsjgraduatetracer.com`
6. **Copy the DNS records!**

### **STEP 2: Domain Registrar (Namecheap/GoDaddy/etc.)**
1. Login to your domain registrar
2. Go to DNS Management
3. Add CNAME record:
   ```
   Type: CNAME
   Name: @
   Value: dwcsjgraduatetracer.up.railway.app
   ```
4. Add www subdomain (optional):
   ```
   Type: CNAME
   Name: www
   Value: dwcsjgraduatetracer.up.railway.app
   ```
5. Save changes

### **STEP 3: Wait & Test**
1. Wait 5-30 minutes (DNS propagation)
2. Check Railway dashboard (should show "Verified")
3. Test: `https://dwcsjgraduatetracer.com`

---

**Done! Your custom domain is ready!** 🎉








