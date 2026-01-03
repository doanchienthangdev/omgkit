---
name: /quality:test-property
description: Generate and run property-based tests using Fast-Check for invariant verification
category: quality
tags:
  - testing
  - property-based
  - fast-check
  - invariants
---

# /quality:test-property

Generate and run property-based tests for comprehensive edge case coverage.

## Usage

```bash
/quality:test-property
/quality:test-property --file src/utils.js
/quality:test-property --numRuns 1000
```

## Properties Tested

### Roundtrip Properties
- Serialize/deserialize equality
- Encode/decode reversibility
- Parse/format consistency

### Invariant Properties
- Length preservation
- Type preservation
- Range constraints

### Mathematical Properties
- Commutativity
- Associativity
- Idempotence

## Options

| Option | Description | Default |
|--------|-------------|---------|
| --file | Target file to test | All files |
| --numRuns | Number of random inputs | 100 |
| --seed | Random seed for reproducibility | Random |
| --verbose | Show all tested inputs | false |

## Output

- Generated test cases
- Shrunk counterexamples on failure
- Coverage of input space
- Property success rates

## Related

- testing/property-testing
- testing/comprehensive-testing
- methodology/tdd
