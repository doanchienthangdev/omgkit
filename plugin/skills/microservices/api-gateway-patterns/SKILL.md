# API Gateway Patterns

Advanced API gateway implementation with Kong, Traefik, rate limiting, authentication, and request transformation.

## Overview

API gateways serve as the single entry point for client requests, handling cross-cutting concerns like authentication, rate limiting, and routing.

## Key Patterns

### Request Routing
- **Path-based Routing**: Route by URL path
- **Header-based Routing**: Route by headers
- **Method-based Routing**: Route by HTTP method
- **Version Routing**: API versioning strategies

### Security
- **Authentication**: JWT, OAuth2, API keys
- **Authorization**: Role-based, scope-based
- **Rate Limiting**: Protect backend services
- **IP Filtering**: Allow/deny lists

### Traffic Management
- **Load Balancing**: Distribute requests
- **Circuit Breaking**: Fail gracefully
- **Retries**: Handle transient failures
- **Timeouts**: Prevent hanging requests

### Request/Response Transformation
- **Header Manipulation**: Add/remove/modify headers
- **Body Transformation**: JSON/XML conversion
- **URL Rewriting**: Modify request paths
- **Response Aggregation**: Combine multiple responses

## Kong Configuration

### Service and Route
```yaml
# Kong declarative config
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service:8080
    routes:
      - name: user-route
        paths:
          - /api/users
        strip_path: true

  - name: order-service
    url: http://order-service:8080
    routes:
      - name: order-route
        paths:
          - /api/orders
        strip_path: true
```

### Rate Limiting Plugin
```yaml
plugins:
  - name: rate-limiting
    service: user-service
    config:
      minute: 100
      hour: 1000
      policy: local
      fault_tolerant: true
      hide_client_headers: false
```

### JWT Authentication
```yaml
plugins:
  - name: jwt
    service: user-service
    config:
      uri_param_names:
        - jwt
      header_names:
        - Authorization
      claims_to_verify:
        - exp
```

### Request Transformation
```yaml
plugins:
  - name: request-transformer
    service: user-service
    config:
      add:
        headers:
          - X-Request-ID:$(uuid)
          - X-Forwarded-Service:user-service
      remove:
        headers:
          - X-Internal-Header
```

## Traefik Configuration

### Dynamic Routing
```yaml
# Traefik IngressRoute
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: api-route
spec:
  entryPoints:
    - web
  routes:
    - match: PathPrefix(`/api/users`)
      kind: Rule
      services:
        - name: user-service
          port: 8080
      middlewares:
        - name: rate-limit
        - name: auth
```

### Middleware Chain
```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: rate-limit
spec:
  rateLimit:
    average: 100
    burst: 50
    period: 1m

---
apiVersion: traefik.containo.us/v1alpha1
kind: Middleware
metadata:
  name: auth
spec:
  forwardAuth:
    address: http://auth-service:8080/verify
    trustForwardHeader: true
```

## Best Practices

1. **Centralize Cross-Cutting Concerns**: Auth, logging, rate limiting
2. **Version APIs**: Use path or header versioning
3. **Health Check Endpoints**: Bypass auth for health checks
4. **Correlation IDs**: Add unique IDs for tracing
5. **Graceful Degradation**: Return cached responses when backend fails

## Rate Limiting Strategies

### Token Bucket
```
- Bucket fills at constant rate
- Requests consume tokens
- Allows bursts up to bucket size
- Good for: APIs with occasional spikes
```

### Sliding Window
```
- Count requests in rolling time window
- Smoother than fixed window
- More memory intensive
- Good for: Consistent rate enforcement
```

### Leaky Bucket
```
- Fixed output rate
- Queue excess requests
- Smooths traffic completely
- Good for: Protecting slow backends
```

## Anti-Patterns

- Gateway as business logic layer
- Single point of failure without HA
- Not monitoring gateway performance
- Over-aggressive rate limiting
- Exposing internal service details

## When to Use

- Multiple clients (web, mobile, third-party)
- Need for consistent authentication
- API monetization with rate limits
- Backend service protection

## When NOT to Use

- Single backend service
- Internal service-to-service communication
- When latency is extremely critical
