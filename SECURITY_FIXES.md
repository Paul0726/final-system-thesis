# Security Fixes - Data Encryption and Authentication

## Problem Identified
The system had a critical security vulnerability where **all survey data was publicly accessible** without authentication. Anyone could access the `/api/surveys` endpoint and retrieve all personal information including:
- Names
- Email addresses
- Phone numbers
- Dates of birth
- Addresses
- Employment information
- And other sensitive personal data

## Security Fixes Implemented

### 1. Authentication Middleware
- Created `authenticateAdmin` middleware to verify admin tokens
- Protects all sensitive admin endpoints
- Checks for token in multiple locations (Authorization header, query params, custom header)

### 2. Protected Endpoints
The following endpoints now require admin authentication:
- `GET /api/surveys` - Get all surveys (was publicly accessible)
- `GET /api/surveys/:id` - Get single survey
- `DELETE /api/surveys/:id` - Delete survey
- `GET /api/technical-support/reports` - Get support reports
- `GET /api/technical-support/reports/count` - Get unread count
- `PUT /api/technical-support/reports/:id/read` - Mark report as read
- `DELETE /api/technical-support/reports/:id` - Delete report

### 3. Data Encryption
Sensitive fields are now encrypted before storing in the database:
- `permanent_address` - Permanent address
- `mobile_number` - Phone number
- `email_address` - Email address
- `date_of_birth` - Date of birth
- `current_location` - Current location

**Encryption Details:**
- Algorithm: AES-256-CBC
- Encryption key: Set via `ENCRYPTION_KEY` environment variable
- Format: `IV:encrypted_data` (IV is randomly generated for each encryption)

### 4. Frontend Updates
- Updated `AdminPage.js` to send authentication tokens in all admin requests
- Created `adminAxios` instance with automatic token injection
- Added error handling for unauthorized access (401 errors)

### 5. Backward Compatibility
- Encryption functions handle both encrypted and unencrypted data
- Existing unencrypted data can still be read
- New data is automatically encrypted when saved
- Email lookup works with both encrypted and unencrypted emails

## Environment Variables Required

Add this to your `.env` file or Railway environment variables:

```env
ENCRYPTION_KEY=your-64-character-hex-key-here
```

**Important:** Generate a secure random key:
```bash
# Generate a secure 32-byte (64 hex characters) key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Migration Notes

### Existing Data
- Existing unencrypted data will continue to work
- New submissions will be encrypted
- When existing records are updated, they will be encrypted

### To Encrypt Existing Data (Optional)
If you want to encrypt all existing data, you can create a migration script:

```javascript
// This would need to be run manually or as a one-time script
const surveys = await pool.query('SELECT * FROM surveys');
for (const survey of surveys.rows) {
  await pool.query(`
    UPDATE surveys SET
      permanent_address = $1,
      mobile_number = $2,
      email_address = $3,
      date_of_birth = $4,
      current_location = $5
    WHERE id = $6
  `, [
    encrypt(survey.permanent_address),
    encrypt(survey.mobile_number),
    encrypt(survey.email_address),
    encrypt(survey.date_of_birth),
    encrypt(survey.current_location),
    survey.id
  ]);
}
```

## Testing

1. **Test Unauthorized Access:**
   ```bash
   curl http://localhost:3000/api/surveys
   # Should return 401 Unauthorized
   ```

2. **Test Authorized Access:**
   ```bash
   curl -H "x-admin-token: admin-token" http://localhost:3000/api/surveys
   # Should return survey data (if authenticated)
   ```

3. **Test Encryption:**
   - Submit a new survey
   - Check database - sensitive fields should be encrypted (contain colons)
   - Retrieve survey - data should be automatically decrypted

## Security Best Practices

1. **Always use HTTPS in production** - Data encryption protects data at rest, HTTPS protects data in transit
2. **Keep ENCRYPTION_KEY secure** - Never commit it to version control
3. **Rotate encryption keys periodically** - If compromised, generate new key and re-encrypt data
4. **Monitor access logs** - Watch for unauthorized access attempts
5. **Use strong admin passwords** - The OTP system is secure, but ensure email account is protected

## What Changed

### Before:
- ❌ `/api/surveys` was publicly accessible
- ❌ No data encryption
- ❌ Anyone could view all personal information
- ❌ No authentication checks on sensitive endpoints

### After:
- ✅ All admin endpoints require authentication
- ✅ Sensitive data is encrypted in database
- ✅ Only authenticated admins can access survey data
- ✅ Users can only access their own survey data
- ✅ Automatic encryption/decryption transparent to application

## Next Steps

1. Set `ENCRYPTION_KEY` environment variable in Railway
2. Deploy the updated code
3. Test that admin login still works
4. Verify that unauthorized users cannot access `/api/surveys`
5. (Optional) Run migration to encrypt existing data

## Support

If you encounter any issues:
1. Check server logs for encryption/decryption errors
2. Verify `ENCRYPTION_KEY` is set correctly
3. Ensure admin token is being sent in requests
4. Check that database connection is working

