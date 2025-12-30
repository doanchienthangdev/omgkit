---
name: Applying OWASP Security
description: Claude applies OWASP security best practices to web applications. Use when preventing vulnerabilities, implementing input validation, securing authentication, configuring security headers, or conducting security reviews.
---

# Applying OWASP Security

## Quick Start

```typescript
// lib/security/validation.ts
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

// Input validation
export const userSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(12).max(128),
  name: z.string().min(2).max(100).regex(/^[\p{L}\s'-]+$/u),
});

// HTML sanitization
export const sanitizeHtml = (dirty: string) =>
  DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p"] });
```

## Features

| Feature | Description | Reference |
|---------|-------------|-----------|
| Injection Prevention | SQL, NoSQL, command injection protection | [OWASP Injection](https://owasp.org/Top10/A03_2021-Injection/) |
| XSS Prevention | Output encoding and HTML sanitization | [OWASP XSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| CSRF Protection | Token-based cross-site request forgery defense | [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) |
| Authentication Security | Password hashing, rate limiting, session management | [OWASP Auth](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| Security Headers | CSP, HSTS, X-Frame-Options configuration | [OWASP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) |
| Input Validation | Schema validation and sanitization | [OWASP Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) |

## Common Patterns

### Parameterized Queries (SQL Injection Prevention)

```typescript
// BAD - SQL injection vulnerable
const result = await db.$queryRawUnsafe(`SELECT * FROM users WHERE id = '${userId}'`);

// GOOD - Parameterized query
const result = await db.user.findUnique({ where: { id: userId } });
const result = await db.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
```

### CSRF Protection Middleware

```typescript
import crypto from "crypto";

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const cookieToken = req.cookies["csrf_token"];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: "CSRF validation failed" });
  }
  next();
}
```

### Security Headers Configuration

```typescript
import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'strict-dynamic'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: "deny" },
}));
```

### Password Security

```typescript
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 12) errors.push("Must be at least 12 characters");
  if (!/[a-z]/.test(password)) errors.push("Must contain lowercase");
  if (!/[A-Z]/.test(password)) errors.push("Must contain uppercase");
  if (!/\d/.test(password)) errors.push("Must contain digit");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Must contain special character");
  return errors;
}
```

## Best Practices

| Do | Avoid |
|----|-------|
| Validate all input on the server side | Trusting client-side validation alone |
| Use parameterized queries for all DB access | String concatenation in queries |
| Set security headers on all responses | Disabling security features for convenience |
| Implement rate limiting on sensitive endpoints | Allowing unlimited attempts |
| Hash passwords with bcrypt (12+ rounds) | Using weak/deprecated crypto algorithms |
| Log security events for monitoring | Exposing detailed error messages to users |
| Keep dependencies updated | Ignoring security warnings |
| Use HTTPS for all communications | Hardcoding secrets in source code |

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
