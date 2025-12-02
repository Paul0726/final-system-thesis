# Debug Admin Login Issue

## Steps to Debug

1. **Open Browser Console (F12)**
   - Go to Admin Login page
   - Press F12
   - Click "Console" tab

2. **Request OTP**
   - Click "Send OTP"
   - Check console for `[ADMIN]` logs
   - Note the OTP from email

3. **Enter OTP and Verify**
   - Enter the OTP code
   - Click "Verify OTP"
   - Check console for error messages
   - Look for `[ADMIN]` logs showing the OTP being sent

4. **Check Railway Logs**
   - Go to Railway Dashboard
   - Click your service
   - Click "Deployments" → Latest → "Logs"
   - Look for:
     - `[ADMIN OTP]` - When sending OTP
     - `[OTP]` - OTP generation and storage
     - `[ADMIN OTP VERIFY]` - Verification attempt
     - `[OTP VERIFY]` - Detailed verification logs

5. **What to Look For:**
   - Email normalization mismatch
   - OTP store keys
   - OTP comparison details
   - Error messages

## Common Issues

### Issue 1: OTP Not Found
**Symptoms:** "OTP not found. Please request a new one."
**Possible Causes:**
- Email case mismatch
- Server restarted (OTP store cleared)
- OTP expired

**Solution:**
- Check logs for email normalization
- Request new OTP
- Make sure email matches exactly

### Issue 2: OTP Mismatch
**Symptoms:** "Invalid OTP. Please check the code and try again."
**Possible Causes:**
- Wrong OTP entered
- OTP has extra characters
- OTP format issue

**Solution:**
- Copy OTP exactly from email
- Make sure it's 6 digits only
- Check logs for stored vs received OTP

### Issue 3: OTP Expired
**Symptoms:** "OTP has expired. Please request a new one."
**Possible Causes:**
- Took more than 10 minutes
- Server time mismatch

**Solution:**
- Request new OTP
- Enter quickly after receiving

## Debugging Commands

If you have access to Railway CLI or server:
```bash
# Check OTP store (if accessible)
# This would require adding a debug endpoint
```

## Next Steps

1. Collect logs from browser console
2. Collect logs from Railway
3. Share the specific error message
4. Note the exact OTP you're entering
5. Check if email matches exactly

