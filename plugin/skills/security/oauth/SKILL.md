---
name: Implementing OAuth
description: Claude implements OAuth 2.0 and OpenID Connect authorization flows. Use when adding social login, integrating OAuth providers, managing tokens, or securing APIs with OAuth.
---

# Implementing OAuth

## Quick Start

```typescript
// lib/oauth/client.ts
import crypto from "crypto";

export function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("hex");
  return { codeVerifier, codeChallenge, state };
}

export function buildAuthUrl(config: OAuthConfig, pkce: PKCEPair) {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scopes.join(" "),
    state: pkce.state,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${config.authorizationEndpoint}?${params}`;
}
```

## Features

| Feature | Description | Reference |
|---------|-------------|-----------|
| Authorization Code + PKCE | Secure flow for public/confidential clients | [RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636) |
| Token Management | Access/refresh token handling and storage | [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) |
| OpenID Connect | Identity layer with ID tokens and claims | [OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html) |
| Provider Integration | Google, GitHub, Microsoft configurations | [OIDC Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html) |
| JWT Validation | ID token signature and claims verification | [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) |

## Common Patterns

### Token Exchange

```typescript
async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    idToken: data.id_token,
  };
}
```

### Provider Configuration

```typescript
// Google OAuth
const googleConfig = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
  scopes: ["openid", "email", "profile"],
};

// GitHub OAuth
const githubConfig = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  userInfoEndpoint: "https://api.github.com/user",
  scopes: ["read:user", "user:email"],
};
```

### Token Refresh Middleware

```typescript
async function ensureFreshToken(req: Request, res: Response, next: NextFunction) {
  const token = await tokenStore.get(req.session.userId);
  if (!token) return next();

  const timeUntilExpiry = token.expiresAt - Date.now();
  if (timeUntilExpiry > 5 * 60 * 1000) {
    req.accessToken = token.accessToken;
    return next();
  }

  // Refresh token
  const newTokens = await client.refreshTokens(token.refreshToken);
  await tokenStore.save(req.session.userId, {
    ...newTokens,
    expiresAt: Date.now() + newTokens.expiresIn * 1000,
  });
  req.accessToken = newTokens.accessToken;
  next();
}
```

## Best Practices

| Do | Avoid |
|----|-------|
| Always use PKCE for authorization code flow | Using implicit flow for new apps |
| Validate state parameter to prevent CSRF | Storing tokens in localStorage |
| Store tokens securely (encrypted, httpOnly) | Exposing client secrets in frontend |
| Implement token refresh before expiration | Ignoring token expiration |
| Validate ID token signatures with JWKS | Trusting unverified ID tokens |
| Use short-lived access tokens | Reusing authorization codes |

## References

- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OAuth 2.0 PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
