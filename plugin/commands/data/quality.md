---
description: Analyze and implement data quality checks and validation
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <dataset or table name>
---

# ✅ Data Quality: $ARGUMENTS

Analyze data quality for: **$ARGUMENTS**

## Agent
Uses **data-engineer** agent for quality implementation.

## Quality Dimensions
- **Completeness** - Missing values
- **Accuracy** - Correct values
- **Consistency** - Cross-field rules
- **Timeliness** - Freshness
- **Uniqueness** - No duplicates
- **Validity** - Format/range

## Workflow
1. **Profile** - Statistical analysis
2. **Define Rules** - Quality expectations
3. **Implement Checks** - Validation code
4. **Alerting** - Failure notifications
5. **Remediation** - Fix strategies

## Technologies
- Great Expectations
- dbt tests
- Soda Core
- Custom validators

## Outputs
- Data profile report
- Quality rule definitions
- Validation code/tests
- Alert configurations
- Quality dashboard

## Progress
- [ ] Data profiled
- [ ] Rules defined
- [ ] Checks implemented
- [ ] Alerts configured
- [ ] Dashboard created

Generate Great Expectations suite.
