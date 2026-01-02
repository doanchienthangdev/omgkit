---
description: Collect data from multiple sources including databases, APIs, files, and streaming systems
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <source_type> [--config <config_file>]
---

# Data Collection: $ARGUMENTS

Collect data from: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for data collection operations.

## Parameters
- **source_type**: database | api | files | streaming | scraping
- **config**: Path to collection configuration file

## Supported Sources

### Database
- PostgreSQL, MySQL, MongoDB
- Connection pooling
- Query optimization
- Batch extraction

### API
- REST/GraphQL endpoints
- Authentication handling
- Rate limiting
- Pagination support

### Files
- CSV, Parquet, JSON, Excel
- S3, GCS, Azure Blob
- Local filesystem
- Compressed archives

### Streaming
- Kafka consumers
- Kinesis streams
- Real-time ingestion

## Code Template
```python
from omgkit.data import DataCollector

collector = DataCollector(config="config/data_config.yaml")

data = collector.collect(
    sources=[
        {"type": "database", "connection": "postgres://..."},
        {"type": "api", "endpoint": "https://api.example.com/data"},
        {"type": "files", "path": "data/raw/*.csv"}
    ],
    validation_schema="schemas/raw_data_schema.json"
)

collector.save(
    data=data,
    output_path="data/raw/collected_data.parquet",
    metadata=True
)
```

## Actions
1. Read collection configuration
2. Connect to data sources
3. Validate schemas during collection
4. Apply data transformations
5. Save to raw data directory
6. Update data manifest

## Progress
- [ ] Config loaded
- [ ] Sources connected
- [ ] Data collected
- [ ] Schema validated
- [ ] Data saved
- [ ] Manifest updated

Track all data lineage for reproducibility.
