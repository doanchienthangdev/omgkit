---
description: Display comprehensive ML project status including data, model, deployment, and pipeline health
allowed-tools: Task, Read, Bash, Grep, Glob
argument-hint: "[--detailed]"
---

# ML Project Status: $ARGUMENTS

Show ML project status: **$ARGUMENTS**

## Agent
Uses **orchestrator-agent** for comprehensive status collection.

## Parameters
- **--detailed**: Show extended information for each component

## Status Components

### Data Status
- Training set size and last update
- Validation/Test set sizes
- Data version (DVC)
- Data quality metrics

### Model Status
- Current model version
- Model architecture
- Performance metrics (accuracy, F1, etc.)
- Last training timestamp

### Deployment Status
- Production model version
- Staging model version
- Endpoint health
- Request latency

### Pipeline Status
- Last pipeline run
- Success/failure rate
- Next scheduled run
- Active experiments

## Example Output
```
ML Project Status
═══════════════════════════════════════════════════

Project: customer-churn-prediction
Type: Classification (Binary)
Created: 2024-01-15

DATA STATUS
├── Training: 50,000 samples (updated: 2h ago)
├── Validation: 10,000 samples
├── Test: 10,000 samples
└── Data Version: v1.2.3

MODEL STATUS
├── Current: XGBoost v2.1.0
├── Accuracy: 94.2%
├── F1-Score: 0.89
└── Last trained: 1d ago

DEPLOYMENT STATUS
├── Production: v2.0.0 (deployed 3d ago)
├── Staging: v2.1.0 (testing)
└── Endpoint: https://api.example.com/predict

PIPELINE STATUS
├── Last run: 2h ago ✅
├── Success rate: 98.5%
└── Next scheduled: in 22h
```

## Progress
- [ ] Data status collected
- [ ] Model status collected
- [ ] Deployment status collected
- [ ] Pipeline status collected
- [ ] Report generated

Provide actionable insights for project health.
