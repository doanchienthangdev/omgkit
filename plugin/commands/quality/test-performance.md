---
name: /quality:test-performance
description: Run performance testing including benchmarks, load tests, and profiling for optimal application performance
category: quality
tags:
  - testing
  - performance
  - benchmarking
  - load-testing
---

# /quality:test-performance

Run performance tests and benchmarks.

## Usage

```bash
/quality:test-performance
/quality:test-performance --type benchmark
/quality:test-performance --type load
/quality:test-performance --sla 200ms
```

## Test Types

### Benchmark Tests
- Function execution timing
- Algorithm comparison
- Memory usage measurement
- Throughput calculation

### Load Tests
- Concurrent user simulation
- Ramp-up patterns
- Sustained load testing
- Spike testing

### Stress Tests
- Beyond-capacity testing
- Recovery verification
- Failure point identification
- Resource exhaustion

### Memory Tests
- Memory leak detection
- Allocation profiling
- GC behavior analysis
- Heap snapshot comparison

## Options

| Option | Description | Default |
|--------|-------------|---------|
| --type | Test type (benchmark, load, stress, memory) | benchmark |
| --sla | Response time SLA | 200ms |
| --concurrency | Concurrent users for load tests | 50 |
| --duration | Test duration | 60s |
| --warmup | Warmup iterations | 10 |

## SLA Thresholds

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| p50 Response | 50ms | 100ms | 200ms |
| p95 Response | 200ms | 500ms | 1000ms |
| p99 Response | 500ms | 1000ms | 2000ms |
| Error Rate | 0.1% | 1% | 5% |
| Throughput | 1000 rps | 500 rps | 100 rps |

## Output

- Performance metrics summary
- Percentile distributions
- Flamegraph visualizations
- Comparison with baseline

## Related

- testing/performance-testing
- testing/comprehensive-testing
- devops/observability
