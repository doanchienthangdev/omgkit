---
name: better-auth
description: Better Auth library for TypeScript with email/password, OAuth, MFA, sessions, and security best practices
category: security
triggers:
  - better-auth
  - authentication
  - auth library
  - typescript auth
  - session management
---

# Better Auth

Enterprise-grade **TypeScript authentication library** following industry best practices. This skill covers email/password auth, social OAuth, multi-factor authentication, session management, role-based access control, and security patterns used by top engineering teams.

## Purpose

Build secure authentication systems:

- Implement email/password authentication
- Configure social OAuth providers
- Set up multi-factor authentication (MFA)
- Manage sessions securely
- Implement role-based access control
- Handle password reset flows
- Integrate with popular frameworks

## Features

### 1. Core Configuration

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins/two-factor";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    passwordValidation: {
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
  },

  // Email verification settings
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // Cookie settings
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    domain: process.env.COOKIE_DOMAIN,
  },

  // Rate limiting
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per window
    customRules: {
      signIn: { window: 300, max: 5 }, // 5 attempts per 5 minutes
      signUp: { window: 3600, max: 3 }, // 3 signups per hour
      forgotPassword: { window: 3600, max: 3 }, // 3 requests per hour
    },
  },

  // Account settings
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  // Social OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"],
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["read:user", "user:email"],
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      scope: ["identify", "email"],
    },
  },

  // Plugins
  plugins: [
    twoFactor({
      issuer: "MyApp",
      otpOptions: {
        digits: 6,
        period: 30,
      },
      backupCodes: {
        enabled: true,
        count: 10,
        length: 10,
      },
    }),
    admin({
      impersonationSessionDuration: 60 * 60, // 1 hour
    }),
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      memberRole: "member",
    }),
  ],

  // User fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      displayName: {
        type: "string",
        required: false,
      },
    },
  },

  // Advanced options
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.COOKIE_DOMAIN,
    },
  },

  // Trusted origins for CORS
  trustedOrigins: [
    process.env.FRONTEND_URL!,
    process.env.ADMIN_URL!,
  ].filter(Boolean),
});

export type Auth = typeof auth;
```

### 2. Client Setup

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    twoFactorClient(),
    organizationClient(),
  ],
});

// Type-safe hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  // OAuth
  signIn: { social: socialSignIn },
  // Two-factor
  twoFactor,
  // Organizations
  organization,
} = authClient;
```

### 3. Email/Password Authentication

```typescript
// components/auth/SignUpForm.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Redirect to verification page
      router.push("/verify-email");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          minLength={12}
          required
        />
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}

// components/auth/SignInForm.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        if (error.code === "TWO_FACTOR_REQUIRED") {
          setRequiresTwoFactor(true);
          return;
        }
        setError(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.twoFactor.verify({
        code: twoFactorCode,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (requiresTwoFactor) {
    return (
      <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
        <div>
          <label htmlFor="code">Two-Factor Code</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          onClick={() => setRequiresTwoFactor(false)}
          className="text-sm text-gray-500"
        >
          Use a different account
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <a href="/forgot-password" className="text-sm">
        Forgot password?
      </a>
    </form>
  );
}
```

### 4. Social OAuth Authentication

```typescript
// components/auth/SocialAuth.tsx
"use client";

import { authClient } from "@/lib/auth-client";

interface SocialAuthProps {
  mode: "signin" | "signup";
}

export function SocialAuth({ mode }: SocialAuthProps) {
  const handleGoogleAuth = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
    });
  };

  const handleGitHubAuth = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
    });
  };

  const handleDiscordAuth = async () => {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/error",
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center gap-2 btn-outline"
      >
        <GoogleIcon />
        {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
      </button>

      <button
        onClick={handleGitHubAuth}
        className="w-full flex items-center justify-center gap-2 btn-outline"
      >
        <GitHubIcon />
        {mode === "signin" ? "Sign in with GitHub" : "Sign up with GitHub"}
      </button>

      <button
        onClick={handleDiscordAuth}
        className="w-full flex items-center justify-center gap-2 btn-outline"
      >
        <DiscordIcon />
        {mode === "signin" ? "Sign in with Discord" : "Sign up with Discord"}
      </button>
    </div>
  );
}

// app/api/auth/callback/[provider]/route.ts
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  return auth.handler(request);
}
```

### 5. Two-Factor Authentication

```typescript
// components/auth/TwoFactorSetup.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import QRCode from "qrcode.react";

export function TwoFactorSetup() {
  const [step, setStep] = useState<"start" | "verify" | "backup" | "complete">(
    "start"
  );
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    try {
      const { data, error } = await authClient.twoFactor.enable();

      if (error) {
        setError(error.message);
        return;
      }

      setTotpUri(data.totpURI);
      setStep("verify");
    } catch (err) {
      setError("Failed to enable 2FA");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await authClient.twoFactor.verifySetup({
        code: verificationCode,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setBackupCodes(data.backupCodes);
      setStep("backup");
    } catch (err) {
      setError("Failed to verify code");
    }
  };

  const handleComplete = () => {
    setStep("complete");
  };

  if (step === "start") {
    return (
      <div className="space-y-4">
        <h2>Enable Two-Factor Authentication</h2>
        <p>Add an extra layer of security to your account.</p>
        <button onClick={handleEnable}>Enable 2FA</button>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="space-y-4">
        <h2>Scan QR Code</h2>
        <p>Scan this QR code with your authenticator app:</p>

        {totpUri && (
          <div className="flex justify-center">
            <QRCode value={totpUri} size={200} />
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <button type="submit">Verify</button>
        </form>
      </div>
    );
  }

  if (step === "backup") {
    return (
      <div className="space-y-4">
        <h2>Save Backup Codes</h2>
        <p>
          Save these backup codes in a secure place. You can use them to access
          your account if you lose your authenticator device.
        </p>

        <div className="grid grid-cols-2 gap-2 font-mono bg-gray-100 p-4 rounded">
          {backupCodes.map((code, index) => (
            <div key={index} className="text-center">
              {code}
            </div>
          ))}
        </div>

        <button onClick={handleComplete}>I've saved my backup codes</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2>Two-Factor Authentication Enabled</h2>
      <p>Your account is now protected with 2FA.</p>
    </div>
  );
}

// components/auth/TwoFactorDisable.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function TwoFactorDisable() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.twoFactor.disable({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Refresh page or update state
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleDisable} className="space-y-4">
      <h2>Disable Two-Factor Authentication</h2>
      <p className="text-yellow-600">
        Warning: This will make your account less secure.
      </p>

      <div>
        <label htmlFor="password">Confirm Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading} className="btn-danger">
        {loading ? "Disabling..." : "Disable 2FA"}
      </button>
    </form>
  );
}
```

### 6. Session Management

```typescript
// middleware.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Redirect authenticated users away from auth pages
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect private routes
  if (!publicRoutes.includes(pathname) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

// hooks/useAuth.ts
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const router = useRouter();
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const signOut = useCallback(async () => {
    await authClient.signOut();
    router.push("/login");
  }, [router]);

  const refreshSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
    signOut,
    refreshSession,
  };
}

// components/auth/SessionInfo.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export function SessionInfo() {
  const { session, user, signOut } = useAuth();

  if (!session || !user) return null;

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Session Information</h3>
      <dl className="space-y-2">
        <div>
          <dt className="text-sm text-gray-500">User</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Session created</dt>
          <dd>
            {formatDistanceToNow(new Date(session.createdAt), {
              addSuffix: true,
            })}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Expires</dt>
          <dd>
            {formatDistanceToNow(new Date(session.expiresAt), {
              addSuffix: true,
            })}
          </dd>
        </div>
      </dl>
      <button onClick={signOut} className="mt-4 btn-danger">
        Sign Out
      </button>
    </div>
  );
}
```

### 7. Password Reset Flow

```typescript
// components/auth/ForgotPassword.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <h2>Check your email</h2>
        <p>
          We've sent a password reset link to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}

// components/auth/ResetPassword.tsx
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/login?message=password-reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>Reset Password</h2>

      <div>
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={12}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
```

## Use Cases

### Next.js API Route Handler

```typescript
// app/api/[...auth]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

### Server Component Auth Check

```typescript
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
    </div>
  );
}
```

## Best Practices

### Do's

- Require email verification for new accounts
- Implement rate limiting on auth endpoints
- Use secure, httpOnly cookies
- Enable two-factor authentication option
- Hash passwords with strong algorithms
- Validate password strength on signup
- Set appropriate session expiration
- Log authentication events
- Use HTTPS in production
- Implement account lockout policies

### Don'ts

- Don't store plain-text passwords
- Don't use predictable session tokens
- Don't expose detailed error messages
- Don't allow unlimited login attempts
- Don't skip CSRF protection
- Don't use weak password policies
- Don't store sensitive data in JWT
- Don't ignore session fixation
- Don't disable security headers
- Don't trust client-side validation alone

## References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Plugins](https://www.better-auth.com/docs/plugins)
- [OWASP Authentication Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [OAuth 2.0 Best Practices](https://oauth.net/2/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
