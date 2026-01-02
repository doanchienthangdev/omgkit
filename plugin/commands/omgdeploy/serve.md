---
description: Deploy model serving endpoint on local, Kubernetes, AWS SageMaker, GCP Vertex, or Azure ML
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <platform> [--config <config>]
---

# Model Serving: $ARGUMENTS

Deploy serving: **$ARGUMENTS**

## Agent
Uses **deployment-agent** for model serving deployment.

## Parameters
- **platform**: local | kubernetes | aws_sagemaker | gcp_vertex | azure_ml
- **config**: Path to deployment configuration

## Deployment Platforms

### Local
- FastAPI server
- Development/testing
- Quick iteration
- localhost access

### Kubernetes
- Seldon Core / KServe
- Auto-scaling
- Canary deployments
- Production grade

### AWS SageMaker
- Managed endpoints
- Auto-scaling
- Multi-model serving
- A/B testing

### GCP Vertex AI
- Managed prediction
- Explanation support
- Batch prediction
- AutoML integration

### Azure ML
- Managed endpoints
- Blue-green deployment
- Container support
- Enterprise features

## Code Template
```python
from omgkit.deployment import ModelServer

server = ModelServer()

# Deploy to Kubernetes
endpoint = server.deploy(
    model_path="artifacts/churn_predictor.mar",
    platform="kubernetes",
    config={
        "replicas": 3,
        "resources": {
            "requests": {"cpu": "500m", "memory": "1Gi"},
            "limits": {"cpu": "2", "memory": "4Gi"}
        },
        "autoscaling": {
            "min_replicas": 2,
            "max_replicas": 10,
            "target_cpu_utilization": 70
        }
    },
    namespace="ml-serving"
)

print(f"Endpoint deployed: {endpoint.url}")
```

## Features
- Health checks
- Metrics collection
- Request logging
- Error handling
- Graceful shutdown

## Progress
- [ ] Config validated
- [ ] Platform connected
- [ ] Model deployed
- [ ] Health verified
- [ ] Endpoint active

Deploy scalable model serving infrastructure.
