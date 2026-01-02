---
description: Validate data quality with schema checks, null analysis, range validation, and distribution analysis
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <data_path> [--schema <schema>] [--rules <rules>]
---

# Data Validation: $ARGUMENTS

Validate data at: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for comprehensive data validation.

## Parameters
- **data_path**: Path to data file or directory
- **schema**: Path to schema definition (optional)
- **rules**: Path to validation rules (optional)

## Validation Types

### Schema Validation
- Column names match expected
- Data types correct
- Required columns present
- Nullable constraints

### Quality Validation
- Null percentage thresholds
- Unique constraints
- Value range validation
- Duplicate detection

### Statistical Validation
- Distribution drift detection
- Outlier identification
- Correlation analysis
- Cardinality checks

## Code Template
```python
from omgkit.data import DataValidator
import great_expectations as ge

validator = DataValidator()

expectations = validator.create_expectations([
    {"column": "user_id", "check": "not_null"},
    {"column": "user_id", "check": "unique"},
    {"column": "age", "check": "between", "min": 0, "max": 150},
    {"column": "email", "check": "regex", "pattern": r"^[\w\.-]+@[\w\.-]+\.\w+$"},
    {"column": "signup_date", "check": "date_format", "format": "%Y-%m-%d"}
])

results = validator.validate(
    data_path="data/raw/users.parquet",
    expectations=expectations
)

validator.generate_report(results, output="reports/validation_report.html")
```

## Output Report
- Total checks executed
- Passed/Failed/Warning counts
- Per-column statistics
- Recommended actions
- Data quality score

## Progress
- [ ] Data loaded
- [ ] Schema validated
- [ ] Quality checks run
- [ ] Statistics computed
- [ ] Report generated

Fail fast on critical violations, warn on soft issues.
