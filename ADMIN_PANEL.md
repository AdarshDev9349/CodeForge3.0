# Admin Panel Documentation

## Overview
The CodeForge 3.0 Admin Panel is a secure, credential-based authentication system separate from the regular user authentication. It provides administrators with tools to manage and monitor the platform.

## Features

### 🔐 Security
- **Separate Authentication**: Independent from Supabase user authentication
- **Credential-based Login**: Username and password authentication
- **Session Management**: 24-hour session expiration
- **Protected Routes**: Middleware-based route protection
- **Encrypted Tokens**: Base64-encoded session tokens

### 📊 Dashboard Features
- **Team Statistics**: View total registered teams and members
- **Team Management**: Browse all registered teams with detailed information
- **Real-time Data**: Refresh data on demand
- **Responsive Design**: Works on all device sizes

## Access

### Admin Login
- **URL**: `http://localhost:3000/admin/login`
- **Default Credentials**:
  - Username: `admin`
  - Password: `Admin@123`

> ⚠️ **IMPORTANT**: Change these credentials in production!

### Admin Dashboard
- **URL**: `http://localhost:3000/admin/dashboard`
- Requires authentication to access

## Configuration

### Environment Variables
The admin credentials are stored in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
ADMIN_SECRET_KEY=your-secret-key-change-this-in-production
```

### Changing Admin Credentials

1. Open `.env.local`
2. Update the values:
   ```env
   ADMIN_USERNAME=your_new_username
   ADMIN_PASSWORD=your_secure_password
   ADMIN_SECRET_KEY=a-long-random-string-for-production
   ```
3. Restart the development server

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.js                    # Redirects to login
│   │   ├── login/
│   │   │   └── page.js                # Admin login page
│   │   └── dashboard/
│   │       └── page.js                # Admin dashboard
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.js           # Login API endpoint
│           ├── logout/
│           │   └── route.js           # Logout API endpoint
│           └── verify/
│               └── route.js           # Auth verification endpoint
├── lib/
│   ├── adminAuth.js                   # Client-side auth utilities
│   └── adminAuthServer.js             # Server-side auth utilities
└── middleware.js                      # Route protection middleware
```

### Authentication Utilities

The authentication logic is split into two files:

- **`adminAuth.js`**: Client-side utilities (localStorage management, token storage)
  - Use in client components (`'use client'`)
  - Functions: `getAdminToken()`, `setAdminToken()`, `removeAdminToken()`

- **`adminAuthServer.js`**: Server-side utilities (cookie management, credential verification)
  - Use in API routes and server components
  - Functions: `verifyAdminCredentials()`, `createAdminToken()`, `verifyAdminToken()`, `isAdminAuthenticated()`

## API Endpoints

### POST /api/admin/login
Authenticate admin user

**Request:**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "base64-encoded-token"
}
```

### POST /api/admin/logout
Logout admin user

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /api/admin/verify
Verify admin authentication status

**Response:**
```json
{
  "success": true,
  "authenticated": true
}
```

## Security Best Practices

### For Development
- Use the default credentials for testing
- Session expires after 24 hours

### For Production
1. **Change All Credentials**:
   ```env
   ADMIN_USERNAME=strong_unique_username
   ADMIN_PASSWORD=VeryStr0ng!P@ssw0rd#2024
   ADMIN_SECRET_KEY=random-64-character-string-here
   ```

2. **Generate Strong Secret Key**:
   ```bash
   # In Node.js
   require('crypto').randomBytes(32).toString('hex')
   ```

3. **Use HTTPS**: Ensure your production site uses HTTPS
4. **Enable Rate Limiting**: Add rate limiting to login endpoint
5. **Add 2FA** (Optional): Implement two-factor authentication
6. **Audit Logging**: Log all admin actions

## Session Management

- **Duration**: 24 hours
- **Storage**: 
  - Server-side: HTTP-only cookie
  - Client-side: LocalStorage for token persistence
- **Expiration**: Auto-logout after 24 hours

## Extending the Admin Panel

### Adding New Features

1. **Create API Endpoint**:
   ```javascript
   // src/app/api/admin/your-feature/route.js
   import { isAdminAuthenticated } from '@/lib/adminAuthServer';
   
   export async function GET() {
     const isAuth = await isAdminAuthenticated();
     if (!isAuth) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     // Your logic here
   }
   ```

2. **Add Dashboard Component**:
   ```javascript
   // Add to src/app/admin/dashboard/page.js
   const MyNewFeature = () => {
     // Your component logic
   };
   ```

### Adding New Admin Users (Future Enhancement)

Currently, the system supports a single admin user. To support multiple admins:

1. Create an `admins` table in Supabase
2. Update `adminAuthServer.js` to check against the database
3. Add admin user management to the dashboard

## Troubleshooting

### Cannot Login
- Verify credentials in `.env.local`
- Check that the server has been restarted after changing env variables
- Clear browser cookies and localStorage

### Session Expires Immediately
- Check system time (token validation uses timestamps)
- Verify `ADMIN_SECRET_KEY` matches between requests

### Dashboard Not Loading
- Check browser console for errors
- Verify middleware is not blocking the route
- Clear browser cache

### "next/headers" Import Error
- Ensure you're importing from `adminAuth.js` in client components
- Use `adminAuthServer.js` only in API routes and server components
- Client components should use `'use client'` directive

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the development server is running

---

**Last Updated**: February 28, 2026  
**Version**: 1.0.0
