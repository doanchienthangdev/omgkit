---
name: oauth
description: OAuth 2.0 and OpenID Connect implementation with authorization flows, token management, and security patterns
category: security
triggers:
  - oauth
  - oauth2
  - openid connect
  - oidc
  - social login
  - authorization
---

# OAuth

Enterprise-grade **OAuth 2.0 and OpenID Connect** implementation following industry best practices. This skill covers authorization flows, token management, provider integration, security patterns, and production-ready implementations used by top engineering teams.

## Purpose

Build secure authorization systems:

- Implement OAuth 2.0 authorization flows
- Configure OpenID Connect for identity
- Integrate social login providers
- Manage access and refresh tokens
- Implement PKCE for public clients
- Handle token refresh and revocation
- Secure API endpoints with OAuth

## Features

### 1. Authorization Code Flow with PKCE

```typescript
// lib/oauth/pkce.ts
import crypto from "crypto";

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export function generatePKCE(): PKCEPair {
  // Generate code verifier (43-128 characters)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  // Generate code challenge using SHA-256
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Generate state for CSRF protection
  const state = crypto.randomBytes(16).toString("hex");

  return { codeVerifier, codeChallenge, state };
}

// lib/oauth/client.ts
import { PKCEPair, generatePKCE } from "./pkce";

export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint?: string;
  scopes: string[];
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  idToken?: string;
  scope?: string;
}

export class OAuthClient {
  private config: OAuthConfig;
  private pkce: PKCEPair | null = null;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  generateAuthorizationUrl(options: {
    state?: string;
    nonce?: string;
    prompt?: "none" | "login" | "consent" | "select_account";
    loginHint?: string;
  } = {}): { url: string; pkce: PKCEPair } {
    this.pkce = generatePKCE();

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      state: options.state || this.pkce.state,
      code_challenge: this.pkce.codeChallenge,
      code_challenge_method: "S256",
    });

    if (options.nonce) params.set("nonce", options.nonce);
    if (options.prompt) params.set("prompt", options.prompt);
    if (options.loginHint) params.set("login_hint", options.loginHint);

    const url = `${this.config.authorizationEndpoint}?${params.toString()}`;

    return { url, pkce: this.pkce };
  }

  async exchangeCodeForTokens(
    code: string,
    codeVerifier: string
  ): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
      code_verifier: codeVerifier,
    });

    // Add client secret for confidential clients
    if (this.config.clientSecret) {
      body.set("client_secret", this.config.clientSecret);
    }

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new OAuthError(error.error, error.error_description);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      scope: data.scope,
    };
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.config.clientId,
    });

    if (this.config.clientSecret) {
      body.set("client_secret", this.config.clientSecret);
    }

    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new OAuthError(error.error, error.error_description);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token || refreshToken,
      idToken: data.id_token,
      scope: data.scope,
    };
  }

  async getUserInfo(accessToken: string): Promise<Record<string, unknown>> {
    if (!this.config.userInfoEndpoint) {
      throw new Error("UserInfo endpoint not configured");
    }

    const response = await fetch(this.config.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new OAuthError("invalid_token", "Failed to fetch user info");
    }

    return response.json();
  }
}

export class OAuthError extends Error {
  constructor(
    public code: string,
    public description?: string
  ) {
    super(description || code);
    this.name = "OAuthError";
  }
}
```

### 2. Provider Configuration

```typescript
// lib/oauth/providers/google.ts
import { OAuthConfig } from "../client";

export function createGoogleConfig(options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}): OAuthConfig {
  return {
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    redirectUri: options.redirectUri,
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
    scopes: options.scopes || ["openid", "email", "profile"],
  };
}

// lib/oauth/providers/github.ts
export function createGitHubConfig(options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}): OAuthConfig {
  return {
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    redirectUri: options.redirectUri,
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    userInfoEndpoint: "https://api.github.com/user",
    scopes: options.scopes || ["read:user", "user:email"],
  };
}

// lib/oauth/providers/microsoft.ts
export function createMicrosoftConfig(options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tenant?: string;
  scopes?: string[];
}): OAuthConfig {
  const tenant = options.tenant || "common";

  return {
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    redirectUri: options.redirectUri,
    authorizationEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    userInfoEndpoint: "https://graph.microsoft.com/oidc/userinfo",
    scopes: options.scopes || ["openid", "email", "profile", "User.Read"],
  };
}

// lib/oauth/providers/index.ts
import { createGoogleConfig } from "./google";
import { createGitHubConfig } from "./github";
import { createMicrosoftConfig } from "./microsoft";
import { OAuthClient } from "../client";

export type Provider = "google" | "github" | "microsoft";

export interface ProviderConfig {
  google?: {
    clientId: string;
    clientSecret: string;
  };
  github?: {
    clientId: string;
    clientSecret: string;
  };
  microsoft?: {
    clientId: string;
    clientSecret: string;
    tenant?: string;
  };
}

export function createOAuthClient(
  provider: Provider,
  config: ProviderConfig,
  redirectUri: string
): OAuthClient {
  switch (provider) {
    case "google":
      if (!config.google) throw new Error("Google config not provided");
      return new OAuthClient(
        createGoogleConfig({
          clientId: config.google.clientId,
          clientSecret: config.google.clientSecret,
          redirectUri,
        })
      );

    case "github":
      if (!config.github) throw new Error("GitHub config not provided");
      return new OAuthClient(
        createGitHubConfig({
          clientId: config.github.clientId,
          clientSecret: config.github.clientSecret,
          redirectUri,
        })
      );

    case "microsoft":
      if (!config.microsoft) throw new Error("Microsoft config not provided");
      return new OAuthClient(
        createMicrosoftConfig({
          clientId: config.microsoft.clientId,
          clientSecret: config.microsoft.clientSecret,
          redirectUri,
          tenant: config.microsoft.tenant,
        })
      );

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
```

### 3. Token Validation and JWT

```typescript
// lib/oauth/jwt.ts
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

export interface JWTClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  nonce?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}

export interface JWKSConfig {
  jwksUri: string;
  issuer: string;
  audience: string;
}

export class JWTValidator {
  private client: jwksClient.JwksClient;
  private issuer: string;
  private audience: string;

  constructor(config: JWKSConfig) {
    this.client = jwksClient({
      jwksUri: config.jwksUri,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600000, // 10 minutes
    });
    this.issuer = config.issuer;
    this.audience = config.audience;
  }

  private getKey(
    header: jwt.JwtHeader,
    callback: jwt.SigningKeyCallback
  ): void {
    this.client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }

  async validateIdToken(
    idToken: string,
    options: { nonce?: string } = {}
  ): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        idToken,
        (header, callback) => this.getKey(header, callback),
        {
          issuer: this.issuer,
          audience: this.audience,
          algorithms: ["RS256"],
        },
        (err, decoded) => {
          if (err) {
            reject(new Error(`Token validation failed: ${err.message}`));
            return;
          }

          const claims = decoded as JWTClaims;

          // Validate nonce if provided
          if (options.nonce && claims.nonce !== options.nonce) {
            reject(new Error("Nonce mismatch"));
            return;
          }

          resolve(claims);
        }
      );
    });
  }
}

// lib/oauth/token-store.ts
export interface StoredToken {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
  tokenType: string;
  scope?: string;
}

export interface TokenStore {
  save(userId: string, token: StoredToken): Promise<void>;
  get(userId: string): Promise<StoredToken | null>;
  delete(userId: string): Promise<void>;
}

// Redis implementation
import Redis from "ioredis";

export class RedisTokenStore implements TokenStore {
  private redis: Redis;
  private prefix: string;

  constructor(redis: Redis, prefix = "oauth:token:") {
    this.redis = redis;
    this.prefix = prefix;
  }

  async save(userId: string, token: StoredToken): Promise<void> {
    const key = `${this.prefix}${userId}`;
    const ttl = Math.floor((token.expiresAt - Date.now()) / 1000);

    await this.redis.setex(key, ttl, JSON.stringify(token));
  }

  async get(userId: string): Promise<StoredToken | null> {
    const key = `${this.prefix}${userId}`;
    const data = await this.redis.get(key);

    if (!data) return null;

    return JSON.parse(data);
  }

  async delete(userId: string): Promise<void> {
    const key = `${this.prefix}${userId}`;
    await this.redis.del(key);
  }
}
```

### 4. Express Integration

```typescript
// routes/auth.ts
import express from "express";
import { OAuthClient, OAuthError } from "../lib/oauth/client";
import { createOAuthClient, Provider } from "../lib/oauth/providers";
import { JWTValidator } from "../lib/oauth/jwt";
import { RedisTokenStore } from "../lib/oauth/token-store";

const router = express.Router();

const providerConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
};

// Initiate OAuth flow
router.get("/login/:provider", (req, res) => {
  const provider = req.params.provider as Provider;
  const redirectUri = `${process.env.BASE_URL}/auth/callback/${provider}`;

  try {
    const client = createOAuthClient(provider, providerConfig, redirectUri);
    const { url, pkce } = client.generateAuthorizationUrl();

    // Store PKCE and state in session
    req.session.oauth = {
      provider,
      state: pkce.state,
      codeVerifier: pkce.codeVerifier,
    };

    res.redirect(url);
  } catch (error) {
    res.status(400).json({ error: "Invalid provider" });
  }
});

// Handle OAuth callback
router.get("/callback/:provider", async (req, res) => {
  const { code, state, error, error_description } = req.query;

  // Handle OAuth errors
  if (error) {
    return res.redirect(
      `/login?error=${encodeURIComponent(error_description as string || error as string)}`
    );
  }

  // Validate state
  if (!req.session.oauth || req.session.oauth.state !== state) {
    return res.redirect("/login?error=invalid_state");
  }

  const { provider, codeVerifier } = req.session.oauth;
  const redirectUri = `${process.env.BASE_URL}/auth/callback/${provider}`;

  try {
    const client = createOAuthClient(
      provider as Provider,
      providerConfig,
      redirectUri
    );

    // Exchange code for tokens
    const tokens = await client.exchangeCodeForTokens(
      code as string,
      codeVerifier
    );

    // Get user info
    const userInfo = await client.getUserInfo(tokens.accessToken);

    // Find or create user
    const user = await findOrCreateUser({
      provider,
      providerId: userInfo.sub || userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    });

    // Store tokens
    const tokenStore = new RedisTokenStore(redis);
    await tokenStore.save(user.id, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      idToken: tokens.idToken,
      expiresAt: Date.now() + tokens.expiresIn * 1000,
      tokenType: tokens.tokenType,
      scope: tokens.scope,
    });

    // Create session
    req.session.userId = user.id;
    delete req.session.oauth;

    res.redirect("/dashboard");
  } catch (error) {
    console.error("OAuth callback error:", error);

    if (error instanceof OAuthError) {
      return res.redirect(`/login?error=${encodeURIComponent(error.description || error.code)}`);
    }

    res.redirect("/login?error=authentication_failed");
  }
});

// Logout
router.post("/logout", async (req, res) => {
  if (req.session.userId) {
    const tokenStore = new RedisTokenStore(redis);
    await tokenStore.delete(req.session.userId);
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

export default router;
```

### 5. Token Refresh Middleware

```typescript
// middleware/oauth.ts
import { Request, Response, NextFunction } from "express";
import { createOAuthClient, Provider } from "../lib/oauth/providers";
import { RedisTokenStore, StoredToken } from "../lib/oauth/token-store";

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export async function ensureFreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return next();
  }

  const tokenStore = new RedisTokenStore(redis);
  const storedToken = await tokenStore.get(req.session.userId);

  if (!storedToken) {
    return next();
  }

  // Check if token needs refresh
  const timeUntilExpiry = storedToken.expiresAt - Date.now();

  if (timeUntilExpiry > TOKEN_REFRESH_THRESHOLD) {
    req.accessToken = storedToken.accessToken;
    return next();
  }

  // Refresh token if we have a refresh token
  if (!storedToken.refreshToken) {
    // Token expired and no refresh token
    delete req.session.userId;
    return res.redirect("/login?error=session_expired");
  }

  try {
    const user = await getUserById(req.session.userId);
    const provider = user.oauthProvider as Provider;
    const redirectUri = `${process.env.BASE_URL}/auth/callback/${provider}`;

    const client = createOAuthClient(provider, providerConfig, redirectUri);
    const newTokens = await client.refreshTokens(storedToken.refreshToken);

    // Store new tokens
    await tokenStore.save(req.session.userId, {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken || storedToken.refreshToken,
      idToken: newTokens.idToken,
      expiresAt: Date.now() + newTokens.expiresIn * 1000,
      tokenType: newTokens.tokenType,
      scope: newTokens.scope,
    });

    req.accessToken = newTokens.accessToken;
    next();
  } catch (error) {
    console.error("Token refresh failed:", error);
    delete req.session.userId;
    await tokenStore.delete(req.session.userId);
    res.redirect("/login?error=session_expired");
  }
}

// middleware/requireAuth.ts
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    if (req.accepts("html")) {
      return res.redirect(`/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
    }
    return res.status(401).json({ error: "Authentication required" });
  }

  next();
}

// Combine middlewares
export const authMiddleware = [ensureFreshToken, requireAuth];
```

### 6. API Resource Protection

```typescript
// middleware/oauth-scope.ts
import { Request, Response, NextFunction } from "express";

export function requireScope(...requiredScopes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const tokenStore = new RedisTokenStore(redis);
    const storedToken = await tokenStore.get(req.session.userId);

    if (!storedToken || !storedToken.scope) {
      return res.status(403).json({
        error: "insufficient_scope",
        message: "Required scopes not granted",
        required_scopes: requiredScopes,
      });
    }

    const grantedScopes = storedToken.scope.split(" ");
    const hasAllScopes = requiredScopes.every((scope) =>
      grantedScopes.includes(scope)
    );

    if (!hasAllScopes) {
      return res.status(403).json({
        error: "insufficient_scope",
        message: "Required scopes not granted",
        required_scopes: requiredScopes,
        granted_scopes: grantedScopes,
      });
    }

    next();
  };
}

// routes/api.ts
import { authMiddleware } from "../middleware/oauth";
import { requireScope } from "../middleware/oauth-scope";

const router = express.Router();

// Protected route - requires authentication
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await getUserById(req.session.userId);
  res.json(user);
});

// Protected route - requires specific scope
router.get(
  "/emails",
  authMiddleware,
  requireScope("email", "read:user"),
  async (req, res) => {
    const emails = await getUserEmails(req.session.userId, req.accessToken);
    res.json(emails);
  }
);

// Protected route - requires admin scope
router.get(
  "/admin/users",
  authMiddleware,
  requireScope("admin:read"),
  async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
  }
);
```

### 7. OpenID Connect Discovery

```typescript
// lib/oauth/oidc-discovery.ts
export interface OIDCConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  scopes_supported: string[];
  response_types_supported: string[];
  grant_types_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  claims_supported: string[];
}

export async function discoverOIDCConfiguration(
  issuer: string
): Promise<OIDCConfiguration> {
  const wellKnownUrl = `${issuer}/.well-known/openid-configuration`;

  const response = await fetch(wellKnownUrl);

  if (!response.ok) {
    throw new Error(`Failed to discover OIDC configuration: ${response.status}`);
  }

  return response.json();
}

// Usage
async function configureFromDiscovery(issuer: string) {
  const config = await discoverOIDCConfiguration(issuer);

  return new OAuthClient({
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    redirectUri: process.env.REDIRECT_URI!,
    authorizationEndpoint: config.authorization_endpoint,
    tokenEndpoint: config.token_endpoint,
    userInfoEndpoint: config.userinfo_endpoint,
    scopes: ["openid", "email", "profile"],
  });
}

// Common OIDC issuers
const OIDC_ISSUERS = {
  google: "https://accounts.google.com",
  microsoft: "https://login.microsoftonline.com/common/v2.0",
  okta: "https://your-org.okta.com",
  auth0: "https://your-tenant.auth0.com",
};
```

## Use Cases

### React Integration

```typescript
// hooks/useOAuth.ts
import { useState, useCallback } from "react";

export function useOAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (provider: string) => {
    setLoading(true);
    setError(null);
    window.location.href = `/auth/login/${provider}`;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (err) {
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, logout, loading, error };
}

// components/LoginButtons.tsx
export function LoginButtons() {
  const { login, loading } = useOAuth();

  return (
    <div className="space-y-2">
      <button onClick={() => login("google")} disabled={loading}>
        Continue with Google
      </button>
      <button onClick={() => login("github")} disabled={loading}>
        Continue with GitHub
      </button>
      <button onClick={() => login("microsoft")} disabled={loading}>
        Continue with Microsoft
      </button>
    </div>
  );
}
```

### State Management with Cookies

```typescript
// lib/oauth/state.ts
import { serialize, parse } from "cookie";
import crypto from "crypto";

const STATE_COOKIE_NAME = "oauth_state";
const STATE_MAX_AGE = 60 * 10; // 10 minutes

export function setStateCookie(res: Response, state: string, codeVerifier: string) {
  const data = JSON.stringify({ state, codeVerifier });
  const encrypted = encrypt(data);

  const cookie = serialize(STATE_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getStateCookie(req: Request): { state: string; codeVerifier: string } | null {
  const cookies = parse(req.headers.cookie || "");
  const encrypted = cookies[STATE_COOKIE_NAME];

  if (!encrypted) return null;

  try {
    const decrypted = decrypt(encrypted);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

export function clearStateCookie(res: Response) {
  const cookie = serialize(STATE_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}
```

## Best Practices

### Do's

- Always use PKCE for authorization code flow
- Validate state parameter to prevent CSRF
- Store tokens securely (encrypted, httpOnly cookies)
- Implement token refresh before expiration
- Use HTTPS for all OAuth endpoints
- Validate ID token signatures with JWKS
- Check token audience and issuer claims
- Implement proper error handling
- Log authentication events for auditing
- Use short-lived access tokens

### Don'ts

- Don't use implicit flow for new applications
- Don't store tokens in localStorage
- Don't expose client secrets in frontend code
- Don't skip state validation
- Don't ignore token expiration
- Don't use long-lived access tokens
- Don't trust unverified ID tokens
- Don't log sensitive token data
- Don't reuse authorization codes
- Don't skip nonce validation for OIDC

## References

- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OAuth 2.0 PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [OIDC Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)
