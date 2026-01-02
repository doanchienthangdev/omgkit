---
description: Profile model performance including latency, memory usage, compute requirements, and bottlenecks
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <model_path> [--input_shape <shape>]
---

# Model Profiling: $ARGUMENTS

Profile model: **$ARGUMENTS**

## Agent
Uses **performance-engineer-agent** for comprehensive profiling.

## Parameters
- **model_path**: Path to model
- **input_shape**: Input tensor shape for inference

## Profiling Dimensions

### Latency
- Cold start time
- Warm inference time
- P50/P90/P99 latencies
- Batch size scaling

### Memory
- Peak memory usage
- Memory per layer
- Activation memory
- Gradient memory (training)

### Compute
- FLOPs count
- MACs (multiply-accumulate)
- Parameter count
- Layer-wise breakdown

### Bottlenecks
- Slowest layers
- Memory-bound vs compute-bound
- Data loading overhead
- GPU utilization

## Code Template
```python
from omgkit.optimization import ModelProfiler

profiler = ModelProfiler()

# Comprehensive profiling
profile = profiler.profile(
    model_path="models/best_model.pt",
    input_shape=(1, 3, 224, 224),
    device="cuda",
    warmup_iterations=10,
    profile_iterations=100
)

# Print summary
print(f"Latency (P50): {profile.latency_p50:.2f}ms")
print(f"Latency (P99): {profile.latency_p99:.2f}ms")
print(f"Peak Memory: {profile.peak_memory_mb:.1f}MB")
print(f"FLOPs: {profile.flops / 1e9:.2f}G")
print(f"Parameters: {profile.params / 1e6:.2f}M")

# Detailed breakdown
profiler.layer_breakdown(profile)

# Generate report
profiler.report(profile, output="reports/profiling_report.html")
```

## Hardware Support
- CPU profiling
- CUDA profiling
- TensorRT profiling
- ONNX Runtime profiling

## Optimization Recommendations
- Identified bottlenecks
- Suggested optimizations
- Target hardware considerations
- Trade-off analysis

## Progress
- [ ] Model loaded
- [ ] Warmup complete
- [ ] Profiling executed
- [ ] Analysis complete
- [ ] Report generated

Identify performance bottlenecks and optimization opportunities.
