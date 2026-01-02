---
description: Deploy model to cloud platforms with auto-scaling, monitoring, and production configurations
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <provider> [--config <config>]
---

# Cloud Deployment: $ARGUMENTS

Deploy to cloud: **$ARGUMENTS**

## Agent
Uses **deployment-agent** for cloud deployment.

## Parameters
- **provider**: aws | gcp | azure
- **config**: Path to deployment configuration

## Cloud Providers

### AWS
- SageMaker endpoints
- Lambda (serverless)
- ECS/EKS containers
- Elastic Inference

### GCP
- Vertex AI endpoints
- Cloud Run
- GKE containers
- TPU support

### Azure
- Azure ML endpoints
- Azure Functions
- AKS containers
- Cognitive Services

## Code Template
```python
from omgkit.deployment import CloudDeployer

deployer = CloudDeployer(provider="aws")

endpoint = deployer.deploy(
    model_path="models/best_model.pt",
    config={
        "instance_type": "ml.m5.xlarge",
        "instance_count": 2,
        "autoscaling": {
            "min_capacity": 1,
            "max_capacity": 10,
            "target_invocations": 1000
        },
        "monitoring": {
            "data_capture": True,
            "capture_percentage": 10
        }
    },
    endpoint_name="churn-predictor-prod"
)

# Test endpoint
response = deployer.invoke(
    endpoint_name="churn-predictor-prod",
    payload={"features": [1.0, 2.0, 3.0]}
)
```

## Features
- Auto-scaling policies
- Blue-green deployment
- A/B testing
- Monitoring & logging
- Cost optimization

## Infrastructure as Code
- Terraform templates
- CloudFormation
- Pulumi scripts
- CDK support

## Progress
- [ ] Credentials validated
- [ ] Resources provisioned
- [ ] Model deployed
- [ ] Health verified
- [ ] Monitoring active

Deploy production-grade ML endpoints to cloud.
