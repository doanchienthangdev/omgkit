---
description: Run performance benchmarks and generate reports
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <component or endpoint>
---

# 📈 Performance Benchmark: $ARGUMENTS

Benchmark: **$ARGUMENTS**

## Agent
Uses **performance-engineer** agent for benchmarking.

## Benchmark Types
- **Microbenchmarks** - Function/method level
- **Load Testing** - Concurrent users
- **Stress Testing** - Breaking point
- **Soak Testing** - Long duration
- **Spike Testing** - Traffic bursts

## Tools
- k6 / Artillery - HTTP load testing
- wrk / ab - Simple benchmarks
- pytest-benchmark - Python
- JMH - Java microbenchmarks

## Metrics
- **Throughput** - Requests/second
- **Latency** - p50, p95, p99
- **Error Rate** - Failure percentage
- **Resource Usage** - CPU, memory

## Workflow
1. **Design** - Define scenarios
2. **Baseline** - Current performance
3. **Execute** - Run benchmarks
4. **Analyze** - Process results
5. **Report** - Generate report

## Outputs
- Benchmark results (JSON/CSV)
- Latency histograms
- Throughput graphs
- Resource utilization
- Comparison report

## Progress
- [ ] Scenarios defined
- [ ] Baseline recorded
- [ ] Benchmarks executed
- [ ] Results analyzed
- [ ] Report generated

Include reproducible benchmark scripts.
