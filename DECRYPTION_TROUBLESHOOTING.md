# Decryption Troubleshooting Guide

## Problem: Encrypted Data Not Showing in Admin Panel

Kung nakikita mo ang encrypted strings (halimbawa: `35f027ecc402db6bf694f6cfd5e7ae9a:32a04cc45d9f2c3fa504...`) sa Admin Panel sa halip na readable text, ito ay nangangahulugan na ang decryption ay hindi gumagana.

## Possible Causes:

### 1. Encryption Key Mismatch
- Ang data ay na-encrypt gamit ang ibang encryption key
- Ang `ENCRYPTION_KEY` sa Railway ay naiiba sa key na ginamit nung na-encrypt ang data

### 2. Data Format Issue
- Ang encrypted data ay corrupted o may maling format
- Ang IV (Initialization Vector) ay hindi tama

### 3. Decryption Function Error
- May error sa decryption process na hindi na-log

## Solutions:

### Step 1: Check Railway Logs

1. Pumunta sa Railway Dashboard
2. Click ang latest deployment
3. Click **"View Logs"**
4. Hanapin ang mga messages na:
   - `[DECRYPT] Failed to decrypt: ...`
   - `[DECRYPT] Encrypted text (first 100 chars): ...`
   - `[DECRYPT] Encryption key length: ...`

### Step 2: Verify Encryption Key

1. Sa Railway Dashboard, check ang **"Variables"** tab
2. I-verify na mayroon kang `ENCRYPTION_KEY` variable
3. Kung wala, i-add ito:
   ```
   ENCRYPTION_KEY=your-64-character-hex-key
   ```
   **Note:** Dapat 64 characters ang key (32 bytes in hex)

### Step 3: Check if Key is Consistent

Kung ang data ay na-encrypt bago mo i-set ang `ENCRYPTION_KEY` sa Railway:
- Ang old data ay encrypted gamit ang default key (`'a'.repeat(64)`)
- Ang new data ay encrypted gamit ang Railway `ENCRYPTION_KEY`
- Parehong key ang kailangan para ma-decrypt ang data

### Step 4: Re-encrypt Data (If Needed)

Kung ang encryption key ay nagbago at hindi mo na ma-decrypt ang old data:

**Option A: Use Default Key**
- I-remove ang `ENCRYPTION_KEY` sa Railway (gagamitin ang default)
- I-redeploy ang application

**Option B: Update All Data**
- I-update ang lahat ng encrypted fields sa database
- I-re-encrypt gamit ang bagong key

## Testing Decryption:

Pagkatapos mag-fix, subukan:
1. I-refresh ang Admin Panel
2. I-check kung naka-display na ang readable text
3. I-check ang Railway logs para sa decryption errors

## Important Notes:

⚠️ **Security:**
- Huwag i-commit ang `ENCRYPTION_KEY` sa git
- Gamitin ang Railway environment variables
- I-keep secure ang encryption key

✅ **After Fix:**
- Lahat ng sensitive data (address, mobile number, email) ay dapat readable sa Admin Panel
- Ang decryption errors ay dapat ma-log sa Railway logs

