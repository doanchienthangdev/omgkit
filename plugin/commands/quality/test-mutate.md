---
name: /quality:test-mutate
description: Run mutation testing with Stryker to verify test quality by introducing code mutations
category: quality
tags:
  - testing
  - mutation
  - stryker
  - quality
---

# /quality:test-mutate

Run mutation testing to verify test suite quality.

## Usage

```bash
/quality:test-mutate
/quality:test-mutate --file src/core.js
/quality:test-mutate --threshold 75
```

## How It Works

1. **Mutate**: Stryker introduces small changes (mutations) to your code
2. **Test**: Runs your test suite against each mutation
3. **Score**: Calculates percentage of mutations caught

## Mutation Types

- **Arithmetic**: `+` to `-`, `*` to `/`
- **Comparison**: `>` to `>=`, `==` to `!=`
- **Logical**: `&&` to `||`, `!` removal
- **Return Values**: `true` to `false`, empty returns

## Options

| Option | Description | Default |
|--------|-------------|---------|
| --file | Target file to mutate | All src files |
| --threshold | Minimum mutation score | 75% |
| --concurrency | Parallel test runs | 4 |
| --timeout | Timeout per mutation | 60s |

## Interpreting Results

| Mutation Score | Quality Level | Action |
|----------------|---------------|--------|
| 80%+ | Excellent | Maintain |
| 60-80% | Good | Improve boundary tests |
| 40-60% | Fair | Add more assertions |
| Below 40% | Poor | Major test improvements needed |

## Output

- HTML report in `reports/mutation/`
- JSON summary for CI integration
- List of surviving mutations

## Related

- testing/mutation-testing
- testing/comprehensive-testing
- methodology/quality-gates
