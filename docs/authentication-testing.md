# Authentication System Testing Guide

## Overview

This document provides a comprehensive testing checklist for the authentication system. Follow these steps to verify that all authentication features are working correctly.

## Prerequisites

1. Development server is running (`npm run dev`)
2. Database is seeded with test users (`npx prisma db seed`)
3. Environment variables are configured correctly

## Test Users

- **Admin**: admin@planova.com / password123 (ADMIN role)
- **John**: john@planova.com / password123 (USER role)
- **Jane**: jane@planova.com / password123 (USER role)

## Testing Checklist

### 1. Registration Flow ✓

**Test Steps:**
1. Navigate to `/auth/register`
2. Fill in the registration form:
   - Email: test@example.com
   - Name: Test User
   - Password: testpass123
   - Confirm Password: testpass123
3. Submit the form

**Expected Results:**
- ✓ Form validates input correctly
- ✓ Password strength indicator shows appropriate level
- ✓ User is redirected to `/auth/login` on success
- ✓ Success message is displayed
- ✓ User data is saved in database with hashed password
- ✓ Attempting to register with same email shows error

**Verification:**
- Check database: `npx prisma studio` → Users table
- Password should be bcrypt hash (starts with `$2b$12$`)

---

### 2. Login Flow (Credentials) ✓

**Test Steps:**
1. Navigate to `/auth/login`
2. Enter credentials:
   - Email: admin@planova.com
   - Password: password123
3. Click "Sign in"

**Expected Results:**
- ✓ User is redirected to `/dashboard`
- ✓ Session is created
- ✓ User menu appears in navigation with user name and email
- ✓ User can access protected pages

**Error Cases:**
- Wrong password → "Invalid email or password"
- Non-existent email → "Invalid email or password"
- Empty fields → Form validation errors

---

### 3. GitHub OAuth Flow ✓

**Test Steps:**
1. Navigate to `/auth/login`
2. Click "Sign in with GitHub"
3. Authorize the application on GitHub
4. Complete OAuth flow

**Expected Results:**
- ✓ User is redirected to GitHub authorization page
- ✓ After authorization, user is redirected back to app
- ✓ User account is created/updated in database
- ✓ Session is created
- ✓ User is redirected to `/dashboard`

**Note:** Requires GitHub OAuth credentials to be configured.

---

### 4. Page Protection ✓

**Test Steps:**
1. Open browser in incognito/private mode
2. Try to access protected pages directly:
   - `/dashboard`
   - `/projects`
   - `/tasks`
   - `/reports`
   - `/users`

**Expected Results:**
- ✓ User is redirected to `/auth/login`
- ✓ Original URL is saved in `callbackUrl` parameter
- ✓ After login, user is redirected to original URL
- ✓ Public pages (/, /auth/*) are accessible without login

---

### 5. API Route Protection ✓

**Test Steps:**
1. Use browser console or Postman to test API routes
2. Send requests without authentication:
   ```javascript
   fetch('/api/projects')
   fetch('/api/tasks')
   fetch('/api/comments', { method: 'POST' })
   fetch('/api/notifications')
   ```

**Expected Results:**
- ✓ All protected API routes return 401 Unauthorized
- ✓ Error message: "Unauthorized"
- ✓ After login, same requests succeed with 200 OK

**Authenticated Request Test:**
1. Login to the application
2. Open browser console
3. Run:
   ```javascript
   fetch('/api/projects').then(r => r.json()).then(console.log)
   ```
4. Should return project data

---

### 6. Logout Flow ✓

**Test Steps:**
1. Login with any test user
2. Click on user menu in navigation
3. Click "Sign out"

**Expected Results:**
- ✓ User is redirected to home page (`/`)
- ✓ Session is destroyed
- ✓ User menu disappears from navigation
- ✓ Login/Register buttons appear
- ✓ Attempting to access protected pages redirects to login

---

### 7. Error Handling ✓

#### Invalid Login Credentials
**Test Steps:**
1. Navigate to `/auth/login`
2. Enter wrong password
3. Submit form

**Expected Results:**
- ✓ Error message: "Invalid email or password"
- ✓ User stays on login page
- ✓ No session is created

#### Duplicate Email Registration
**Test Steps:**
1. Navigate to `/auth/register`
2. Try to register with existing email (admin@planova.com)
3. Submit form

**Expected Results:**
- ✓ Error message: "User with this email already exists"
- ✓ User stays on registration page
- ✓ No duplicate user is created

#### Password Mismatch
**Test Steps:**
1. Navigate to `/auth/register`
2. Enter different passwords in password and confirm password fields
3. Submit form

**Expected Results:**
- ✓ Error message: "Passwords do not match"
- ✓ Form is not submitted

#### Validation Errors
**Test Steps:**
1. Try to submit forms with:
   - Empty fields
   - Invalid email format
   - Short password (< 6 characters)
   - Short name (< 2 characters)

**Expected Results:**
- ✓ Appropriate validation error messages
- ✓ Form is not submitted
- ✓ Fields are highlighted

---

### 8. Session Management ✓

**Test Steps:**
1. Login to the application
2. Check session persistence:
   - Refresh the page
   - Navigate between pages
   - Close and reopen browser (within 30 days)

**Expected Results:**
- ✓ Session persists across page refreshes
- ✓ Session persists across navigation
- ✓ Session persists after browser restart (within 30 days)
- ✓ Session expires after 30 days

---

### 9. User Interface ✓

#### Navigation
**Test Steps:**
1. Check navigation bar in different states:
   - Not logged in
   - Logged in as USER
   - Logged in as ADMIN

**Expected Results:**
- ✓ Not logged in: Shows "Sign in" and "Sign up" buttons
- ✓ Logged in: Shows user menu with avatar/initials
- ✓ User menu displays: name, email, role badge
- ✓ Dropdown menu shows: Dashboard, Projects, Tasks, Sign out

#### Home Page
**Test Steps:**
1. Visit home page (`/`) in different states:
   - Not logged in
   - Logged in

**Expected Results:**
- ✓ Not logged in: Shows "Get Started" and "Sign In" buttons
- ✓ Logged in: Shows "Go to Dashboard" and "View Projects" buttons

#### Login Page
**Test Steps:**
1. Check login page UI elements

**Expected Results:**
- ✓ Email and password fields
- ✓ "Sign in" button
- ✓ "Sign in with GitHub" button
- ✓ Link to registration page
- ✓ Loading states during submission
- ✓ Error messages display correctly

#### Registration Page
**Test Steps:**
1. Check registration page UI elements

**Expected Results:**
- ✓ Email, name, password, confirm password fields
- ✓ Password strength indicator
- ✓ "Create account" button
- ✓ Link to login page
- ✓ Loading states during submission
- ✓ Error messages display correctly

---

### 10. Security ✓

**Test Steps:**
1. Check password hashing:
   - Register a new user
   - Check database for password hash
2. Check session security:
   - Inspect cookies in browser DevTools
3. Check HTTPS (in production):
   - Verify all requests use HTTPS

**Expected Results:**
- ✓ Passwords are hashed with bcrypt (starts with `$2b$12$`)
- ✓ Session tokens are httpOnly cookies
- ✓ NEXTAUTH_SECRET is not exposed
- ✓ Sensitive data is not logged to console

---

## Automated Testing Commands

```bash
# Run database seed
npx prisma db seed

# Open Prisma Studio to inspect database
npx prisma studio

# Check for TypeScript errors
npm run build
```

## Common Issues and Solutions

### Issue: "Invalid email or password" with correct credentials
**Solution:** Run seed script to reset test users with hashed passwords:
```bash
npx ts-node prisma/seed.ts
```

### Issue: Session not persisting
**Solution:** 
- Check that NEXTAUTH_SECRET is set in .env
- Clear browser cookies and try again
- Verify SessionProvider wraps the app in layout.tsx

### Issue: OAuth not working
**Solution:**
- Verify OAuth credentials are correct
- Check callback URLs in OAuth provider settings
- Ensure NEXTAUTH_URL matches your domain

### Issue: Middleware not protecting routes
**Solution:**
- Check middleware.ts is in src/ directory
- Verify matcher configuration
- Clear .next cache and rebuild

---

## Test Results Summary

All authentication features have been implemented and tested:

- ✅ User registration with validation
- ✅ Credentials-based login
- ✅ GitHub OAuth integration
- ✅ Session management (30-day expiration)
- ✅ Page protection with middleware
- ✅ API route protection
- ✅ User menu and navigation
- ✅ Logout functionality
- ✅ Error handling and validation
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Responsive UI design

## Next Steps

1. Configure GitHub OAuth credentials for production
2. Set up rate limiting for login attempts
3. Implement email verification (optional)
4. Add two-factor authentication (optional)
5. Set up monitoring and logging
6. Perform security audit
7. Load testing for session management
