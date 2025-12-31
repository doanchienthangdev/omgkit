---
description: Design and implement data pipeline with ETL/ELT patterns
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <pipeline description or data source>
---

# 🔄 Data Pipeline: $ARGUMENTS

Create data pipeline: **$ARGUMENTS**

## Agent
Uses **data-engineer** agent for pipeline implementation.

## Workflow
1. **Source Analysis** - Understand data sources
2. **Schema Design** - Define target schema
3. **Transform Logic** - Design transformations
4. **Quality Gates** - Add validation
5. **Orchestration** - Schedule and monitor

## Pipeline Components
- **Extract**: Source connectors
- **Transform**: Data transformations
- **Load**: Destination sinks
- **Monitor**: Metrics and alerts

## Technologies
- Apache Airflow / Dagster
- dbt for transformations
- Great Expectations for quality
- Prefect for orchestration

## Outputs
- Pipeline DAG definition
- Transformation SQL/code
- Data quality tests
- Monitoring dashboard config
- Documentation

## Progress
- [ ] Sources analyzed
- [ ] Schema designed
- [ ] Transforms implemented
- [ ] Quality gates added
- [ ] Pipeline deployed

Include data lineage documentation.
