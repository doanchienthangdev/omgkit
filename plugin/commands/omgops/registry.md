---
description: Model registry operations - register, list, promote, archive, and rollback model versions
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <action> [--model <model>] [--version <version>]
---

# Model Registry: $ARGUMENTS

Registry operation: **$ARGUMENTS**

## Agent
Uses **mlops-engineer-agent** for model registry management.

## Parameters
- **action**: register | list | promote | archive | rollback
- **model**: Model name
- **version**: Model version

## Registry Actions

### Register
- Add new model version
- Store metadata
- Link artifacts
- Tag for tracking

### List
- Show all versions
- Filter by stage
- Display metrics
- Show lineage

### Promote
- Move to next stage
- Staging → Production
- Update endpoints
- Notify stakeholders

### Archive
- Deprecate old versions
- Preserve artifacts
- Update documentation

### Rollback
- Revert to previous version
- Restore endpoint
- Emergency recovery

## Code Template
```python
from omgkit.mlops import ModelRegistry
import mlflow

registry = ModelRegistry(tracking_uri="http://mlflow.example.com")

# Register new model
registry.register(
    model_path="models/best_model.pt",
    model_name="churn_predictor",
    tags={
        "framework": "pytorch",
        "task": "classification",
        "team": "data-science"
    },
    metrics={
        "accuracy": 0.94,
        "f1": 0.89,
        "latency_ms": 15
    }
)

# Promote to production
registry.promote(
    model_name="churn_predictor",
    version="2.1.0",
    stage="Production"
)

# Rollback if needed
registry.rollback(
    model_name="churn_predictor",
    to_version="2.0.0"
)

# List all versions
versions = registry.list_versions("churn_predictor")
```

## Model Stages
- **None**: Development
- **Staging**: Testing
- **Production**: Live
- **Archived**: Deprecated

## Metadata Stored
- Training parameters
- Performance metrics
- Data version
- Code commit
- Environment specs

## Progress
- [ ] Action validated
- [ ] Registry connected
- [ ] Operation executed
- [ ] Endpoints updated
- [ ] Notifications sent

Centralize model lifecycle management.
