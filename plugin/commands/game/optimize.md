---
description: Optimize game performance for target platforms and frame rates
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <game component or platform>
---

# 🎮 Game Optimization: $ARGUMENTS

Optimize performance: **$ARGUMENTS**

## Agent
Uses **game-designer** agent for optimization.

## Optimization Areas
- **Rendering** - Draw calls, batching
- **Memory** - Asset loading, pooling
- **CPU** - Game logic, physics
- **GPU** - Shaders, effects
- **Loading** - Streaming, async

## Platform Targets
- PC (60/144 FPS)
- Console (30/60 FPS)
- Mobile (30/60 FPS)
- VR (72/90/120 FPS)

## Profiling Tools
- Unity Profiler / Frame Debugger
- Unreal Insights
- RenderDoc
- PIX / Nsight
- Platform-specific tools

## Techniques
- LOD systems
- Occlusion culling
- Texture atlasing
- Object pooling
- Async loading

## Workflow
1. **Profile** - Identify bottlenecks
2. **Analyze** - Root cause analysis
3. **Optimize** - Apply techniques
4. **Measure** - Verify improvements
5. **Document** - Performance budgets

## Outputs
- Performance report
- Optimization recommendations
- Before/after metrics
- Performance budgets
- Platform guidelines

## Progress
- [ ] Baseline captured
- [ ] Bottlenecks identified
- [ ] Optimizations applied
- [ ] Improvements verified
- [ ] Budgets documented

Target consistent frame times, not just average FPS.
