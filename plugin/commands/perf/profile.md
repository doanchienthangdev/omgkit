---
description: Profile application performance and identify bottlenecks
allowed-tools: Task, Read, Bash, Grep, Glob
argument-hint: <application or component>
---

# ⚡ Performance Profiling: $ARGUMENTS

Profile performance: **$ARGUMENTS**

## Agent
Uses **performance-engineer** agent for profiling.

## Profiling Types
- **CPU** - Hot paths, cycles
- **Memory** - Allocations, leaks
- **I/O** - Disk, network
- **Concurrency** - Thread contention
- **Database** - Query performance

## Tools
- Python: cProfile, py-spy, memory_profiler
- Node.js: clinic, 0x, heapdump
- JVM: async-profiler, JFR
- Go: pprof, trace
- General: perf, dtrace

## Workflow
1. **Baseline** - Establish metrics
2. **Profile** - Collect profiles
3. **Analyze** - Find bottlenecks
4. **Optimize** - Implement fixes
5. **Verify** - Confirm improvement

## Outputs
- Flame graphs
- Memory timeline
- Hot spot analysis
- Optimization recommendations
- Before/after comparison

## Progress
- [ ] Baseline established
- [ ] Profiles collected
- [ ] Bottlenecks identified
- [ ] Optimizations suggested
- [ ] Verification plan

Generate flame graphs for visualization.
