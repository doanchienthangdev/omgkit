---
description: Setup A/B testing between model versions with traffic splitting and statistical analysis
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--models <models>] [--traffic_split <split>]"
---

# A/B Testing: $ARGUMENTS

Setup A/B test: **$ARGUMENTS**

## Agent
Uses **deployment-agent** for A/B testing configuration.

## Parameters
- **models**: List of model versions to test
- **traffic_split**: Traffic distribution percentages

## A/B Test Components

### Traffic Splitting
- Percentage-based routing
- User-based stickiness
- Geographic routing
- Feature-based routing

### Metrics Collection
- Primary metrics (accuracy, latency)
- Business metrics (conversion, revenue)
- User experience metrics
- System metrics

### Statistical Analysis
- Significance testing
- Confidence intervals
- Sample size calculation
- Stopping rules

## Code Template
```python
from omgkit.deployment import ABTester

ab_tester = ABTester()

experiment = ab_tester.create_experiment(
    name="churn_model_v2_test",
    models={
        "control": "models/v1.0.0/model.pt",
        "treatment": "models/v2.0.0/model.pt"
    },
    traffic_split={
        "control": 0.8,
        "treatment": 0.2
    },
    metrics=["accuracy", "latency", "conversion_rate"],
    min_samples=10000,
    significance_level=0.05
)

# Monitor experiment
ab_tester.monitor(experiment)

# Analyze results
results = ab_tester.analyze(experiment)

if results.is_significant and results.treatment_better:
    ab_tester.promote("treatment")
```

## Experiment Types
- A/B (two variants)
- A/B/n (multiple variants)
- Multi-armed bandit
- Shadow mode

## Safety Features
- Automatic rollback
- Circuit breaker
- Error rate monitoring
- Latency guardrails

## Output Report
- Statistical significance
- Effect size
- Confidence intervals
- Recommendation

## Progress
- [ ] Experiment configured
- [ ] Traffic routing active
- [ ] Metrics collecting
- [ ] Analysis running
- [ ] Decision ready

Make data-driven model rollout decisions.
