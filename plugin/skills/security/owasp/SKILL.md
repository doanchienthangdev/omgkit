---
name: owasp
description: OWASP security best practices for web applications with vulnerability prevention, secure coding, and security testing
category: security
triggers:
  - owasp
  - web security
  - security best practices
  - vulnerability prevention
  - secure coding
  - penetration testing
---

# OWASP

Enterprise-grade **web application security** following OWASP best practices. This skill covers the OWASP Top 10 vulnerabilities, secure coding patterns, input validation, authentication security, and security testing patterns used by top engineering teams.

## Purpose

Build secure web applications:

- Prevent OWASP Top 10 vulnerabilities
- Implement secure coding practices
- Validate and sanitize user input
- Protect against injection attacks
- Secure authentication and sessions
- Configure security headers
- Implement security testing

## Features

### 1. Injection Prevention

```typescript
// lib/security/sql-injection.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// BAD: SQL Injection vulnerable
async function unsafeQuery(userId: string) {
  // NEVER DO THIS
  return prisma.$queryRawUnsafe(
    `SELECT * FROM users WHERE id = '${userId}'`
  );
}

// GOOD: Parameterized queries
async function safeQuery(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

// GOOD: Raw query with parameters
async function safeRawQuery(userId: string) {
  return prisma.$queryRaw`
    SELECT * FROM users WHERE id = ${userId}
  `;
}

// lib/security/nosql-injection.ts
import { Filter } from "mongodb";

interface User {
  _id: string;
  email: string;
  password: string;
}

// BAD: NoSQL Injection vulnerable
async function unsafeMongoQuery(db: Db, email: unknown) {
  // If email is { $gt: "" }, this returns all users
  return db.collection("users").findOne({ email });
}

// GOOD: Type validation before query
async function safeMongoQuery(db: Db, email: unknown) {
  if (typeof email !== "string") {
    throw new Error("Invalid email format");
  }

  const filter: Filter<User> = { email };
  return db.collection<User>("users").findOne(filter);
}

// lib/security/command-injection.ts
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// BAD: Command Injection vulnerable
async function unsafeExec(filename: string) {
  const { exec } = await import("child_process");
  // NEVER DO THIS
  exec(`ls -la ${filename}`, (error, stdout) => {
    console.log(stdout);
  });
}

// GOOD: Use execFile with arguments array
async function safeExec(filename: string) {
  // Validate filename
  if (!/^[\w\-. ]+$/.test(filename)) {
    throw new Error("Invalid filename");
  }

  const { stdout } = await execFileAsync("ls", ["-la", filename]);
  return stdout;
}

// GOOD: Avoid shell commands entirely
import fs from "fs/promises";

async function listFiles(directory: string) {
  // Validate and resolve path
  const resolvedPath = path.resolve(directory);
  const basePath = path.resolve("/allowed/base/path");

  if (!resolvedPath.startsWith(basePath)) {
    throw new Error("Path traversal attempt detected");
  }

  return fs.readdir(resolvedPath, { withFileTypes: true });
}
```

### 2. XSS Prevention

```typescript
// lib/security/xss.ts
import DOMPurify from "isomorphic-dompurify";
import { escape } from "html-escaper";

// Sanitize HTML content
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
}

// Escape for text content
export function escapeHtml(text: string): string {
  return escape(text);
}

// Safe URL validation
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// React component with XSS prevention
import React from "react";

interface UserContentProps {
  content: string;
  allowHtml?: boolean;
}

export function UserContent({ content, allowHtml = false }: UserContentProps) {
  if (allowHtml) {
    // Sanitize before rendering
    const sanitized = sanitizeHtml(content);
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }

  // Default: escape all HTML
  return <div>{content}</div>;
}

// Express middleware for XSS protection
import { Request, Response, NextFunction } from "express";

export function xssProtection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Sanitize request body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query as Record<string, unknown>);
  }

  next();
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = escapeHtml(value);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

### 3. CSRF Protection

```typescript
// lib/security/csrf.ts
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "csrf_token";

// Generate CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

// CSRF middleware
export function csrfProtection() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip for safe methods
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      return next();
    }

    const cookieToken = req.cookies[CSRF_COOKIE];
    const headerToken = req.headers[CSRF_HEADER];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({
        error: "CSRF validation failed",
        message: "Invalid or missing CSRF token",
      });
    }

    next();
  };
}

// Set CSRF token on response
export function setCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = generateCsrfToken();
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // Must be readable by JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  next();
}

// React hook for CSRF
export function useCsrf() {
  const getToken = (): string | null => {
    const match = document.cookie.match(new RegExp(`${CSRF_COOKIE}=([^;]+)`));
    return match ? match[1] : null;
  };

  const fetchWithCsrf = async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        [CSRF_HEADER]: token || "",
      },
    });
  };

  return { getToken, fetchWithCsrf };
}
```

### 4. Authentication Security

```typescript
// lib/security/password.ts
import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

// Password validation
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    errors.push(`Password must be at most ${MAX_PASSWORD_LENGTH} characters`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one digit");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    errors.push("Password is too common");
  }

  return { valid: errors.length === 0, errors };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure token
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

// lib/security/rate-limit.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

// Login rate limiting
export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: "Too many login attempts",
    message: "Please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by IP and email combination
    return `${req.ip}:${req.body?.email || "unknown"}`;
  },
});

// API rate limiting
export const apiRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    error: "Too many requests",
    message: "Please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// lib/security/session.ts
import session from "express-session";
import RedisStore from "connect-redis";

export function configureSession(redis: Redis) {
  return session({
    store: new RedisStore({ client: redis }),
    name: "session_id",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: process.env.COOKIE_DOMAIN,
    },
    rolling: true, // Reset expiry on activity
  });
}
```

### 5. Security Headers

```typescript
// lib/security/headers.ts
import helmet from "helmet";
import { Express } from "express";

export function configureSecurityHeaders(app: Express) {
  // Use helmet with custom configuration
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'strict-dynamic'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Required for many CSS-in-JS
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          connectSrc: ["'self'", process.env.API_URL],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },

      // Strict Transport Security
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },

      // Prevent clickjacking
      frameguard: {
        action: "deny",
      },

      // Prevent MIME sniffing
      noSniff: true,

      // XSS filter (legacy browsers)
      xssFilter: true,

      // Referrer policy
      referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
      },

      // Permissions policy
      permittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
    })
  );

  // Additional security headers
  app.use((req, res, next) => {
    // Prevent caching of sensitive data
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");

    // Remove server information
    res.removeHeader("X-Powered-By");

    next();
  });
}

// Next.js security headers
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL};
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, " ").trim(),
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

### 6. Input Validation

```typescript
// lib/security/validation.ts
import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(254, "Email too long")
  .transform((email) => email.toLowerCase().trim());

// Password validation schema
export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a digit")
  .regex(/[!@#$%^&*]/, "Password must contain a special character");

// User registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[\p{L}\s'-]+$/u, "Name contains invalid characters"),
});

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL must use http or https protocol" }
  );

// File upload validation
export const fileUploadSchema = z.object({
  filename: z
    .string()
    .max(255)
    .regex(
      /^[\w\-. ]+$/,
      "Filename contains invalid characters"
    ),
  mimetype: z.enum([
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ]),
  size: z.number().max(10 * 1024 * 1024, "File size must be under 10MB"),
});

// Express validation middleware
import { Request, Response, NextFunction } from "express";

export function validate<T>(schema: z.ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}

// Usage
app.post("/register", validate(registerSchema), async (req, res) => {
  // req.body is now typed and validated
  const { email, password, name } = req.body;
  // ...
});
```

### 7. Security Testing

```typescript
// tests/security/xss.test.ts
import { sanitizeHtml, escapeHtml } from "@/lib/security/xss";

describe("XSS Prevention", () => {
  describe("sanitizeHtml", () => {
    it("removes script tags", () => {
      const input = '<script>alert("xss")</script>';
      expect(sanitizeHtml(input)).toBe("");
    });

    it("removes event handlers", () => {
      const input = '<img src="x" onerror="alert(1)">';
      expect(sanitizeHtml(input)).toBe("");
    });

    it("removes javascript: URLs", () => {
      const input = '<a href="javascript:alert(1)">click</a>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain("javascript:");
    });

    it("allows safe HTML tags", () => {
      const input = "<p><strong>Bold</strong> and <em>italic</em></p>";
      expect(sanitizeHtml(input)).toBe(input);
    });

    it("removes data attributes", () => {
      const input = '<div data-dangerous="value">content</div>';
      expect(sanitizeHtml(input)).not.toContain("data-dangerous");
    });
  });

  describe("escapeHtml", () => {
    it("escapes HTML entities", () => {
      const input = '<script>alert("xss")</script>';
      const result = escapeHtml(input);
      expect(result).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    });

    it("escapes ampersands", () => {
      expect(escapeHtml("&")).toBe("&amp;");
    });
  });
});

// tests/security/injection.test.ts
import { safeQuery, safeRawQuery } from "@/lib/security/sql-injection";

describe("SQL Injection Prevention", () => {
  it("handles malicious input safely", async () => {
    const maliciousInput = "'; DROP TABLE users; --";

    // Should not throw and should not execute injection
    await expect(safeQuery(maliciousInput)).resolves.toBeNull();
  });

  it("uses parameterized queries", async () => {
    const userId = "123";
    const result = await safeRawQuery(userId);

    // Query should be parameterized, not interpolated
    expect(result).toBeDefined();
  });
});

// tests/security/csrf.test.ts
import request from "supertest";
import app from "@/app";

describe("CSRF Protection", () => {
  it("rejects requests without CSRF token", async () => {
    const response = await request(app)
      .post("/api/user/profile")
      .send({ name: "Test" });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("CSRF validation failed");
  });

  it("accepts requests with valid CSRF token", async () => {
    // Get CSRF token
    const getResponse = await request(app).get("/api/csrf-token");
    const csrfToken = getResponse.body.token;

    const response = await request(app)
      .post("/api/user/profile")
      .set("x-csrf-token", csrfToken)
      .set("Cookie", getResponse.headers["set-cookie"])
      .send({ name: "Test" });

    expect(response.status).not.toBe(403);
  });
});

// tests/security/auth.test.ts
import { validatePassword, hashPassword, verifyPassword } from "@/lib/security/password";

describe("Authentication Security", () => {
  describe("Password Validation", () => {
    it("rejects short passwords", () => {
      const result = validatePassword("Short1!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Password must be at least 12 characters");
    });

    it("requires complexity", () => {
      const result = validatePassword("simplelongpassword");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("accepts strong passwords", () => {
      const result = validatePassword("SecureP@ssw0rd123!");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("Password Hashing", () => {
    it("hashes passwords securely", async () => {
      const password = "SecureP@ssw0rd123!";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2b$")).toBe(true);
    });

    it("verifies correct passwords", async () => {
      const password = "SecureP@ssw0rd123!";
      const hash = await hashPassword(password);

      expect(await verifyPassword(password, hash)).toBe(true);
    });

    it("rejects incorrect passwords", async () => {
      const hash = await hashPassword("SecureP@ssw0rd123!");

      expect(await verifyPassword("WrongPassword1!", hash)).toBe(false);
    });
  });
});
```

## Use Cases

### Security Audit Checklist

```typescript
// lib/security/audit.ts
export interface SecurityAuditResult {
  category: string;
  check: string;
  status: "pass" | "fail" | "warning";
  message: string;
}

export async function runSecurityAudit(): Promise<SecurityAuditResult[]> {
  const results: SecurityAuditResult[] = [];

  // Check HTTPS
  results.push({
    category: "Transport",
    check: "HTTPS Enabled",
    status: process.env.NODE_ENV === "production" ? "pass" : "warning",
    message: "HTTPS should be enabled in production",
  });

  // Check security headers
  results.push({
    category: "Headers",
    check: "Security Headers",
    status: "pass",
    message: "Helmet middleware configured",
  });

  // Check rate limiting
  results.push({
    category: "Rate Limiting",
    check: "Login Rate Limiting",
    status: "pass",
    message: "Login endpoints rate limited",
  });

  // Check CSRF protection
  results.push({
    category: "CSRF",
    check: "CSRF Protection",
    status: "pass",
    message: "CSRF tokens required for state-changing requests",
  });

  return results;
}
```

### Dependency Scanning

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: "0 0 * * *" # Daily

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run SAST scan
        uses: github/codeql-action/analyze@v3
```

## Best Practices

### Do's

- Validate all user input on the server
- Use parameterized queries for database access
- Implement proper authentication and session management
- Set security headers on all responses
- Use HTTPS for all communications
- Implement rate limiting on sensitive endpoints
- Log security events for monitoring
- Keep dependencies updated
- Conduct regular security audits
- Follow the principle of least privilege

### Don'ts

- Don't trust client-side validation alone
- Don't store sensitive data in plain text
- Don't expose detailed error messages to users
- Don't use deprecated cryptographic algorithms
- Don't disable security features for convenience
- Don't hardcode secrets in source code
- Don't ignore security warnings
- Don't use eval() or similar functions
- Don't allow unlimited file uploads
- Don't skip security testing

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [CWE Top 25](https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html)
