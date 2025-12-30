---
name: oauth
description: OAuth 2.0 / OIDC. Use for third-party authentication, social login.
---

# OAuth Skill

## Authorization Code Flow
```
1. Redirect to provider
   /authorize?client_id=X&redirect_uri=Y&scope=Z&response_type=code

2. User authorizes

3. Callback with code
   /callback?code=ABC

4. Exchange code for token
   POST /token
   { code, client_id, client_secret, redirect_uri }

5. Use access token
   Authorization: Bearer <token>
```

## Implementation
```typescript
// Redirect to OAuth provider
app.get('/auth/google', (req, res) => {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('redirect_uri', REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  res.redirect(url.toString());
});

// Handle callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const tokens = await exchangeCodeForTokens(code);
  // Create session
});
```

## Best Practices
- Use PKCE for public clients
- Validate state parameter
- Use short-lived tokens
- Store tokens securely
