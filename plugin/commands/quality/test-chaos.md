---
name: /quality:test-chaos
description: Run chaos engineering tests including fault injection, failure simulation, and resilience verification
category: quality
tags:
  - testing
  - chaos
  - resilience
  - fault-injection
---

# /quality:test-chaos

Run chaos engineering tests for system resilience.

## Usage

```bash
/quality:test-chaos
/quality:test-chaos --fault network
/quality:test-chaos --blast-radius small
```

## Fault Types

### Network Faults
- Latency injection
- Connection timeouts
- Partial failures
- DNS resolution failures

### Service Faults
- Service unavailability
- Circuit breaker testing
- Fallback verification
- Retry behavior

### Resource Faults
- Memory pressure
- CPU saturation
- Disk full simulation
- Connection pool exhaustion

### Clock Faults
- Clock skew simulation
- Timezone issues
- Leap second handling

## Options

| Option | Description | Default |
|--------|-------------|---------|
| --fault | Fault type to inject | all |
| --blast-radius | Scope: small, medium, large | small |
| --probability | Fault injection rate | 10% |
| --duration | Test duration | 60s |
| --kill-switch | Auto-rollback on critical failure | true |

## Experiment Template

```yaml
experiment:
  name: "API Latency Injection"
  hypothesis: "System should handle 2s latency gracefully"
  steady-state:
    - metric: error_rate
      value: < 1%
    - metric: response_time_p95
      value: < 200ms
  method:
    - type: latency
      target: api-gateway
      delay: 2000ms
      probability: 0.3
  rollback:
    - type: restore
      target: api-gateway
```

## Safety Guidelines

1. **Start Small**: Begin with low probability, limited scope
2. **Monitor Everything**: Watch all metrics during experiments
3. **Kill Switch**: Always have rollback mechanism ready
4. **Game Days**: Schedule chaos tests, notify teams
5. **Progressive Expansion**: Gradually increase blast radius

## Output

- Resilience score
- Recovery time metrics
- Failure cascade analysis
- Recommended improvements

## Related

- testing/chaos-testing
- testing/comprehensive-testing
- devops/observability
