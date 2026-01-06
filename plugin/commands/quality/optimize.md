---
description: Performance optimization with test verification
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <file> [--no-test] [--test-level LEVEL] [--benchmark]
related_skills:
  - methodology/test-enforcement
related_commands:
  - /quality:refactor
  - /quality:verify-done
testing:
  default: true
  configurable: true
---

# ⚡ Optimize: $ARGUMENTS

Optimize performance of: **$ARGUMENTS**

## Areas
- Algorithm efficiency
- Database queries
- Memory usage
- Bundle size
- Caching

## Testing Options

This command respects project testing configuration from `.omgkit/workflow.yaml`.

### Default Behavior

- **Testing**: Enabled by default (verify functionality after optimization)
- **Enforcement Level**: Read from `testing.enforcement.level` (default: standard)
- **Performance Tests**: Encouraged to add benchmark tests

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--no-test` | Skip test verification | `/quality:optimize "db.ts" --no-test` |
| `--test-level <level>` | Override enforcement level | `/quality:optimize "core/" --test-level strict` |
| `--benchmark` | Include performance benchmarks | `/quality:optimize "api/" --benchmark` |

### Enforcement Levels

| Level | Test Failure After Optimization |
|-------|--------------------------------|
| `soft` | Warning |
| `standard` | Block |
| `strict` | Block |

## Process
1. Profile current performance
2. **Run existing tests** (baseline)
3. Identify bottlenecks
4. Apply optimizations
5. **Verify tests still pass**
6. Measure improvement
7. Document changes

## Configuration

Configure via `.omgkit/workflow.yaml`:

```yaml
testing:
  enabled: true
  enforcement:
    level: standard
```

## Examples

```bash
# Default: with test verification
/quality:optimize "src/services/search.ts"

# With performance benchmarks
/quality:optimize "src/db/queries.ts" --benchmark

# Skip tests for infrastructure optimization
/quality:optimize "webpack.config.js" --no-test

# Strict mode for critical paths
/quality:optimize "src/core/engine.ts" --test-level strict
```
