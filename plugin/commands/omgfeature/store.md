---
description: Feature store operations - register, materialize, and serve features for training and inference
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <action> [--feature_view <view>]
---

# Feature Store: $ARGUMENTS

Feature store operation: **$ARGUMENTS**

## Agent
Uses **feature-engineer-agent** for feature store management.

## Parameters
- **action**: register | materialize | serve | list
- **feature_view**: Feature view name

## Actions

### Register
- Define feature definitions
- Specify entities and joins
- Set TTL and freshness
- Configure data sources

### Materialize
- Compute features for training
- Populate online store
- Batch feature computation
- Incremental updates

### Serve
- Get features for inference
- Point-in-time correct retrieval
- Low-latency serving
- Batch retrieval

### List
- Show all feature views
- Display feature definitions
- Check freshness status

## Code Template
```python
from omgkit.features import FeatureStore
from feast import Entity, FeatureView, Field
from feast.types import Float32, Int64

store = FeatureStore(repo_path="feature_repo/")

# Define entity
user = Entity(name="user", join_keys=["user_id"])

# Define feature view
user_features = FeatureView(
    name="user_features",
    entities=[user],
    schema=[
        Field(name="total_purchases", dtype=Float32),
        Field(name="avg_order_value", dtype=Float32),
        Field(name="days_since_last_order", dtype=Int64),
    ],
    source=user_source,
    online=True,
    ttl=timedelta(days=1)
)

# Register
store.register([user, user_features])

# Materialize
store.materialize(
    start_date=datetime(2024, 1, 1),
    end_date=datetime.now()
)

# Serve features
features = store.get_online_features(
    features=["user_features:total_purchases", "user_features:avg_order_value"],
    entity_rows=[{"user_id": 123}]
).to_dict()
```

## Benefits
- Training-serving consistency
- Point-in-time correctness
- Feature reuse across models
- Feature discovery

## Progress
- [ ] Action validated
- [ ] Feature store connected
- [ ] Operation executed
- [ ] Cache updated
- [ ] Status verified

Ensure consistent features across training and serving.
