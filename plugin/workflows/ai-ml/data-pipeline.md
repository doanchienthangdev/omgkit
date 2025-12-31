---
description: Build production data pipelines for ML training and inference
triggers:
  - manual
  - ml:data
agents:
  - data-engineer
  - ml-engineer
---

# Data Pipeline Workflow

Create robust data pipelines for ML systems.

## Prerequisites
- [ ] Data sources identified
- [ ] Data requirements defined
- [ ] Storage infrastructure available

## Phase 1: Data Source Integration

### Step 1.1: Identify Data Sources
```yaml
agent: data-engineer
action: catalog
sources:
  - databases: PostgreSQL, MySQL, MongoDB
  - data_lakes: S3, GCS, ADLS
  - streaming: Kafka, Kinesis
  - apis: REST, GraphQL
  - files: CSV, Parquet, JSON
```

### Step 1.2: Create Data Connectors
```yaml
agent: data-engineer
action: implement
connectors:
  - Source connectors
  - Schema inference
  - Incremental extraction
  - Change data capture
tools:
  - Airbyte
  - Fivetran
  - Custom extractors
```

## Phase 2: Data Transformation

### Step 2.1: Design Transformation DAG
```yaml
agent: data-engineer
action: design
pipeline_tool:
  - Airflow
  - Prefect
  - Dagster
  - dbt
transformations:
  - Cleaning
  - Normalization
  - Feature engineering
  - Aggregations
```

### Step 2.2: Implement Transformations
```yaml
agent: data-engineer
action: implement
best_practices:
  - Idempotent operations
  - Incremental processing
  - Schema validation
  - Data lineage tracking
frameworks:
  - Spark
  - Pandas
  - dbt
  - Polars
```

## Phase 3: Data Quality

### Step 3.1: Define Quality Rules
```yaml
agent: data-engineer
action: define
quality_dimensions:
  - Completeness: No null required fields
  - Accuracy: Values in valid ranges
  - Consistency: Cross-field validation
  - Timeliness: Data freshness
  - Uniqueness: No duplicates
```

### Step 3.2: Implement Quality Checks
```yaml
agent: data-engineer
action: implement
tools:
  - Great Expectations
  - dbt tests
  - Soda
  - Custom validators
checks:
  - Schema validation
  - Statistical checks
  - Anomaly detection
  - Referential integrity
```

## Phase 4: Feature Store Integration

### Step 4.1: Define Features
```yaml
agent: ml-engineer
action: define
feature_types:
  - Batch features (offline)
  - Streaming features (online)
  - On-demand features
metadata:
  - Feature name
  - Data type
  - Description
  - Owner
  - Freshness SLA
```

### Step 4.2: Implement Feature Pipeline
```yaml
agent: data-engineer
action: implement
feature_store:
  - Feast
  - Tecton
  - Vertex AI Feature Store
capabilities:
  - Batch ingestion
  - Stream ingestion
  - Point-in-time correctness
  - Online serving
```

## Phase 5: Pipeline Orchestration

### Step 5.1: Configure Scheduling
```yaml
agent: data-engineer
action: configure
scheduling:
  batch_pipeline:
    schedule: "0 2 * * *"  # Daily at 2 AM
    depends_on: source_data_available
  streaming_pipeline:
    trigger: continuous
    checkpoint: s3://checkpoints/
```

### Step 5.2: Monitoring and Alerting
```yaml
agent: data-engineer
action: configure
monitoring:
  - Pipeline success/failure
  - Data quality metrics
  - Processing latency
  - Data freshness
alerts:
  - Pipeline failure
  - Quality threshold breach
  - SLA violation
```

## Outputs
- [ ] Data connectors
- [ ] Transformation DAG
- [ ] Quality checks
- [ ] Feature pipelines
- [ ] Monitoring dashboards

## Quality Gates
- All quality checks pass
- Pipeline runs successfully
- Data freshness within SLA
- No data loss
- Lineage tracked
