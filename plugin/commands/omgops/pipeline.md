---
description: Create CI/CD pipeline for ML using GitHub Actions, GitLab CI, Jenkins, Kubeflow, or Airflow
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <platform> [--template <template>]
---

# ML Pipeline: $ARGUMENTS

Create pipeline: **$ARGUMENTS**

## Agent
Uses **mlops-engineer-agent** for pipeline creation.

## Parameters
- **platform**: github_actions | gitlab_ci | jenkins | kubeflow | airflow
- **template**: training | deployment | full (default: full)

## Pipeline Types

### Training Pipeline
- Data validation
- Feature engineering
- Model training
- Model evaluation
- Model registration

### Deployment Pipeline
- Model validation
- Canary deployment
- Integration tests
- Production promotion

### Full Pipeline
- Complete CI/CD
- End-to-end automation
- Monitoring integration

## Code Template
```python
from omgkit.mlops import PipelineBuilder

builder = PipelineBuilder(platform="github_actions")

pipeline = builder.create_pipeline(
    name="ml-training-pipeline",
    stages=[
        {
            "name": "data_validation",
            "script": "scripts/validate_data.py",
            "triggers": ["data_push"]
        },
        {
            "name": "training",
            "script": "scripts/train.py",
            "resources": {"gpu": True, "memory": "16Gi"},
            "triggers": ["data_validation_success"]
        },
        {
            "name": "evaluation",
            "script": "scripts/evaluate.py",
            "triggers": ["training_success"]
        },
        {
            "name": "deployment",
            "script": "scripts/deploy.py",
            "triggers": ["evaluation_pass"],
            "conditions": ["accuracy > 0.9"]
        }
    ]
)

pipeline.save(".github/workflows/ml-pipeline.yml")
```

## Platform Features

### GitHub Actions
- Matrix builds
- Self-hosted runners
- Secrets management
- Artifact caching

### Kubeflow
- Kubernetes native
- GPU scheduling
- Experiment tracking
- Pipeline versioning

### Airflow
- DAG scheduling
- XCom data passing
- Sensor triggers
- Backfill support

## Progress
- [ ] Platform configured
- [ ] Stages defined
- [ ] Triggers set
- [ ] Pipeline generated
- [ ] Tests added

Automate ML workflows with CI/CD best practices.
