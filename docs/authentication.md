# Authentication Documentation

## Overview

Planova uses NextAuth.js v5 for authentication, providing secure user authentication with support for both credentials-based login and OAuth providers (GitHub).

## Features

- **Credentials Authentication**: Email and password-based login
- **OAuth Authentication**: GitHub OAuth integration
- **Session Management**: JWT-based sessions with 30-day expiration
- **Password Security**: Bcrypt hashing with 12 rounds
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access Control**: Support for USER and ADMIN roles

## User Roles

- **USER**: Standard user with access to basic features
- **ADMIN**: Administrator with full system access

## Authentication Flow

### Registration

1. User submits registration form with email, name, and password
2. System validates input (email format, password length, etc.)
3. Password is hashed using bcrypt (12 rounds)
4. User account is created in database
5. User is redirected to login page

### Login (Credentials)

1. User submits email and password
2. System retrieves user from database
3. Password is verified using bcrypt.compare
4. JWT token is generated with user ID and role
5. Session is created and user is redirected to dashboard

### Login (GitHub OAuth)

1. User clicks "Sign in with GitHub"
2. User is redirected to GitHub for authorization
3. GitHub redirects back with authorization code
4. System exchanges code for access token
5. User profile is retrieved from GitHub
6. User account is created/updated in database
7. Session is created and user is redirected to dashboard

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Usage

### Protecting Pages

Pages are automatically protected by middleware. The following routes require authentication:

- `/dashboard`
- `/projects`
- `/tasks`
- `/reports`
- `/users`

To add a new protected route, update `src/middleware.ts`:

```typescript
const protectedRoutes = [
  "/dashboard",
  "/projects",
  "/tasks",
  "/reports",
  "/users",
  "/your-new-route", // Add your route here
];
```

### Protecting API Routes

API routes are protected using the `auth()` function:

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Your protected logic here
  return NextResponse.json({ data: "Protected data" });
}
```

### Using Authentication Utilities

The `src/lib/auth-utils.ts` file provides helpful utility functions:

#### Get Current User

```typescript
import { getCurrentUser } from "@/lib/auth-utils";

const user = await getCurrentUser();
if (user) {
  console.log(user.email, user.name, user.role);
}
```

#### Require Authentication

```typescript
import { requireAuth } from "@/lib/auth-utils";

try {
  const session = await requireAuth();
  // User is authenticated
} catch (error) {
  // User is not authenticated
}
```

#### Require Specific Role

```typescript
import { requireRole } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

try {
  await requireRole(Role.ADMIN);
  // User is admin
} catch (error) {
  // User is not admin
}
```

#### Check Role

```typescript
import { hasRole, isAdmin } from "@/lib/auth-utils";
import { Role } from "@prisma/client";

const isUserAdmin = await isAdmin();
const hasUserRole = await hasRole(Role.USER);
```

#### Password Utilities

```typescript
import { hashPassword, verifyPassword } from "@/lib/auth-utils";

// Hash a password
const hashed = await hashPassword("mypassword");

// Verify a password
const isValid = await verifyPassword("mypassword", hashed);
```

### Client-Side Authentication

#### Using useSession Hook

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Not authenticated</div>;
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

#### Sign Out

```typescript
"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </button>
  );
}
```

## Adding New OAuth Providers

To add a new OAuth provider (e.g., Google):

1. Install the provider package (if needed)
2. Get OAuth credentials from the provider
3. Add environment variables:

```env
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

4. Update `src/lib/auth.ts`:

```typescript
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ... existing config
  providers: [
    Credentials({ /* ... */ }),
    GitHub({ /* ... */ }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
});
```

5. Add sign-in button to login page:

```typescript
<button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
  Sign in with Google
</button>
```

## Database Schema

The authentication system uses the following database models:

### User

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?   // Nullable for OAuth users
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Account (OAuth)

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Session

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Testing

### Test Users

The seed script creates the following test users:

- **Admin**: admin@planova.com / password123 (ADMIN role)
- **John**: john@planova.com / password123 (USER role)
- **Jane**: jane@planova.com / password123 (USER role)

### Running Seed Script

```bash
npx prisma db seed
```

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep NEXTAUTH_SECRET secure** - Never commit it to version control
3. **Use strong passwords** - Minimum 6 characters (consider increasing to 8+)
4. **Rotate secrets regularly** - Update NEXTAUTH_SECRET periodically
5. **Validate user input** - Always validate on both client and server
6. **Use rate limiting** - Implement rate limiting for login attempts
7. **Monitor failed login attempts** - Log and alert on suspicious activity
8. **Keep dependencies updated** - Regularly update NextAuth and other packages

## Troubleshooting

### "Invalid email or password" error

- Ensure the user exists in the database
- Verify the password is hashed correctly
- Check that bcrypt is comparing the correct values
- Run the seed script to reset test users

### Session not persisting

- Verify NEXTAUTH_SECRET is set
- Check that SessionProvider wraps your app
- Ensure cookies are enabled in browser

### OAuth redirect errors

- Verify callback URLs are configured correctly in OAuth provider
- Check that NEXTAUTH_URL matches your domain
- Ensure OAuth credentials are correct

### Middleware not protecting routes

- Check middleware matcher configuration
- Verify middleware.ts is in the correct location (src/)
- Ensure auth() function is being called correctly

## API Reference

### Auth Configuration (`src/lib/auth.ts`)

Main NextAuth configuration file with providers, callbacks, and session settings.

### Auth Utilities (`src/lib/auth-utils.ts`)

Helper functions for authentication and authorization:

- `getCurrentUser()` - Get current authenticated user
- `requireAuth()` - Require authentication (throws if not authenticated)
- `requireRole(role)` - Require specific role
- `hasRole(role)` - Check if user has role
- `isAdmin()` - Check if user is admin
- `hashPassword(password)` - Hash a password
- `verifyPassword(password, hash)` - Verify password
- `getCurrentUserId()` - Get current user ID
- `isResourceOwner(resourceOwnerId)` - Check resource ownership

### Middleware (`src/middleware.ts`)

Route protection middleware that redirects unauthenticated users to login.

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
