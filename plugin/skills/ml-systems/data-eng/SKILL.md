---
name: data-engineering
description: ML data engineering covering data pipelines, data quality, collection strategies, storage, and versioning for machine learning systems.
---

# Data Engineering for ML

Building robust data infrastructure for ML systems.

## Data Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ML DATA PIPELINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  COLLECTION  →  VALIDATION  →  PROCESSING  →  STORAGE       │
│     ↓              ↓              ↓              ↓          │
│  Sources      Schema Check    Transform      Data Lake      │
│  APIs         Quality Check   Normalize      Feature Store  │
│  DBs          Statistics      Encode         Model Registry │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Data Collection

```python
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class DataSource:
    name: str
    type: str  # database, api, file, stream
    connection: Dict

class DataCollector:
    def __init__(self, sources: List[DataSource]):
        self.sources = sources

    def collect(self, source_name: str) -> pd.DataFrame:
        source = next(s for s in self.sources if s.name == source_name)

        if source.type == "database":
            return pd.read_sql(source.connection["query"],
                             source.connection["conn"])
        elif source.type == "api":
            response = requests.get(source.connection["url"])
            return pd.DataFrame(response.json())
        elif source.type == "file":
            return pd.read_parquet(source.connection["path"])
```

## Data Quality

```python
import great_expectations as ge

def validate_data(df: pd.DataFrame, expectations_path: str) -> bool:
    ge_df = ge.from_pandas(df)

    # Schema validation
    assert ge_df.expect_column_to_exist("user_id").success
    assert ge_df.expect_column_values_to_not_be_null("user_id").success
    assert ge_df.expect_column_values_to_be_unique("user_id").success

    # Value validation
    assert ge_df.expect_column_values_to_be_between(
        "age", min_value=0, max_value=150
    ).success

    # Statistical validation
    assert ge_df.expect_column_mean_to_be_between(
        "purchase_amount", min_value=0, max_value=10000
    ).success

    return True
```

## Data Versioning

```python
# DVC for data versioning
# dvc init
# dvc add data/processed/

import dvc.api

# Load specific version
data_url = dvc.api.get_url(
    path='data/processed/train.parquet',
    repo='https://github.com/org/repo',
    rev='v1.2.0'
)

# Track changes
def version_data(data_path: str, message: str):
    import subprocess
    subprocess.run(["dvc", "add", data_path])
    subprocess.run(["git", "add", f"{data_path}.dvc"])
    subprocess.run(["git", "commit", "-m", message])
    subprocess.run(["dvc", "push"])
```

## Data Storage Patterns

| Pattern | Use Case | Technology |
|---------|----------|------------|
| Data Lake | Raw storage | S3, GCS, ADLS |
| Data Warehouse | Analytics | Snowflake, BigQuery |
| Feature Store | ML features | Feast, Tecton |
| Vector Store | Embeddings | Pinecone, Weaviate |

## Commands
- `/omgdata:collect` - Data collection
- `/omgdata:validate` - Data validation
- `/omgdata:version` - Version data

## Best Practices

1. Validate data at every stage
2. Version all data assets
3. Document data schemas
4. Monitor data quality metrics
5. Implement data lineage tracking
