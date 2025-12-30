---
name: Orchestrating with Kubernetes
description: The agent implements Kubernetes container orchestration with deployments, services, Helm charts, and production patterns. Use when deploying containerized applications, configuring autoscaling, managing secrets, or setting up ingress routing.
---

# Orchestrating with Kubernetes

## Quick Start

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
        - name: api
          image: ghcr.io/org/api:v1.0.0
          ports:
            - containerPort: 3000
          resources:
            requests: { cpu: "100m", memory: "256Mi" }
            limits: { cpu: "500m", memory: "512Mi" }
```

```bash
kubectl apply -f deployment.yaml
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Deployments | Declarative pod management with rollbacks | Define replicas, update strategy, pod template |
| Services | Internal/external load balancing | ClusterIP for internal, LoadBalancer for external |
| ConfigMaps/Secrets | Configuration and sensitive data | Mount as volumes or environment variables |
| Ingress | HTTP routing with TLS termination | Use nginx-ingress or cloud provider ingress |
| HPA | Horizontal Pod Autoscaler | Scale based on CPU, memory, or custom metrics |
| Helm | Package manager for K8s applications | Template and version deployments |

## Common Patterns

### Production Deployment with Probes

```yaml
spec:
  containers:
    - name: api
      image: ghcr.io/org/api:v1.0.0
      livenessProbe:
        httpGet: { path: /health/live, port: 3000 }
        initialDelaySeconds: 15
        periodSeconds: 20
      readinessProbe:
        httpGet: { path: /health/ready, port: 3000 }
        initialDelaySeconds: 5
        periodSeconds: 10
      env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef: { name: app-secrets, key: database-url }
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-server
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-server
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

### Ingress with TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
    - hosts: [api.example.com]
      secretName: api-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service: { name: api-server, port: { number: 80 } }
```

## Best Practices

| Do | Avoid |
|----|-------|
| Set resource requests and limits | Running containers as root |
| Implement liveness and readiness probes | Using `latest` tag in production |
| Use namespaces for environment isolation | Hardcoding config in container images |
| Configure Pod Disruption Budgets | Skipping network policies |
| Use Secrets for sensitive data | Exposing unnecessary ports |
| Implement pod anti-affinity rules | Using NodePort in production |
| Set up HPA for autoscaling | Ignoring pod security standards |
