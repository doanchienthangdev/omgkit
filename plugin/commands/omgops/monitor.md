---
description: Setup ML monitoring and alerting for data quality, drift detection, and model performance
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--metrics <metrics>] [--alerts <alerts>]"
---

# ML Monitoring: $ARGUMENTS

Setup monitoring: **$ARGUMENTS**

## Agent
Uses **monitoring-agent** for comprehensive ML monitoring.

## Parameters
- **metrics**: List of metrics to monitor
- **alerts**: Alert configurations

## Monitoring Types

### Data Quality
- Null rate monitoring
- Schema violations
- Value distributions
- Anomaly detection

### Data Drift
- Feature drift
- Label drift
- Concept drift
- Statistical tests

### Model Performance
- Accuracy degradation
- Latency increase
- Error rate
- Throughput

### System Metrics
- Memory usage
- CPU utilization
- Request rate
- Response time

## Code Template
```python
from omgkit.mlops import MonitoringSetup

monitor = MonitoringSetup()

monitor.setup(
    model_endpoint="https://api.example.com/predict",
    metrics=[
        {"type": "null_rate", "column": "user_id", "threshold": 0.01},
        {"type": "feature_drift", "method": "ks_test", "threshold": 0.05},
        {"type": "concept_drift", "window": "7d"},
        {"type": "accuracy", "reference": 0.94, "threshold": 0.02},
        {"type": "latency_p99", "threshold_ms": 100},
        {"type": "memory_usage", "threshold_pct": 80},
        {"type": "error_rate", "threshold": 0.01}
    ],
    alerts=[
        {
            "name": "accuracy_drop",
            "condition": "accuracy < 0.90",
            "channel": "slack",
            "severity": "critical"
        },
        {
            "name": "high_latency",
            "condition": "latency_p99 > 200",
            "channel": "pagerduty",
            "severity": "warning"
        }
    ],
    dashboard="grafana"
)
```

## Alert Channels
- Slack
- PagerDuty
- Email
- Webhooks
- SMS

## Dashboard Features
- Real-time metrics
- Historical trends
- Anomaly highlighting
- Drill-down analysis

## Progress
- [ ] Metrics configured
- [ ] Alerts defined
- [ ] Dashboard created
- [ ] Integration tested
- [ ] Monitoring active

Ensure production ML system health and reliability.
