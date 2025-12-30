---
name: Implementing Better Auth
description: Claude implements enterprise TypeScript authentication with Better Auth. Use when building auth systems, adding OAuth providers, enabling MFA, or managing sessions in TypeScript/Next.js projects.
---

# Implementing Better Auth

## Quick Start

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, requireEmailVerification: true },
  session: { expiresIn: 60 * 60 * 24 * 7 },
  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
  },
});
```

## Features

| Feature | Description | Reference |
|---------|-------------|-----------|
| Email/Password Auth | Secure registration, login, password validation | [Auth Guide](https://www.better-auth.com/docs/authentication/email-password) |
| Social OAuth | Google, GitHub, Discord provider integration | [Social Providers](https://www.better-auth.com/docs/authentication/social-providers) |
| Two-Factor Auth | TOTP-based MFA with backup codes | [2FA Plugin](https://www.better-auth.com/docs/plugins/two-factor) |
| Session Management | Secure cookie-based sessions with refresh | [Sessions](https://www.better-auth.com/docs/concepts/sessions) |
| Rate Limiting | Configurable limits per endpoint | [Rate Limiting](https://www.better-auth.com/docs/concepts/rate-limit) |
| Organizations | Multi-tenant support with roles | [Organizations Plugin](https://www.better-auth.com/docs/plugins/organization) |

## Common Patterns

### Client Setup with Plugins

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import { twoFactorClient, organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [twoFactorClient(), organizationClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### Protected Routes Middleware

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

### Two-Factor Authentication Flow

```typescript
// Handle 2FA during sign-in
const { data, error } = await authClient.signIn.email({ email, password });

if (error?.code === "TWO_FACTOR_REQUIRED") {
  // Show 2FA input
  const { data: verified } = await authClient.twoFactor.verify({ code: totpCode });
}

// Enable 2FA for user
const { data } = await authClient.twoFactor.enable();
// data.totpURI contains QR code data
// data.backupCodes contains recovery codes
```

## Best Practices

| Do | Avoid |
|----|-------|
| Require email verification for new accounts | Storing plain-text passwords |
| Enable rate limiting on auth endpoints | Exposing detailed error messages |
| Use httpOnly, secure cookies | Using predictable session tokens |
| Set strong password requirements (12+ chars) | Allowing unlimited login attempts |
| Implement proper session expiration | Storing sensitive data in JWT |
| Log authentication events for auditing | Skipping CSRF protection |

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Plugins](https://www.better-auth.com/docs/plugins)
- [OWASP Authentication Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
