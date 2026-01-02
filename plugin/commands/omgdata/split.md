---
description: Split data into train/validation/test sets with stratified, temporal, or group-based strategies
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--strategy <strategy>] [--ratios <ratios>]"
---

# Data Split: $ARGUMENTS

Split data: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for data splitting.

## Parameters
- **strategy**: random | stratified | temporal | group (default: stratified)
- **ratios**: Train/Val/Test ratios (default: "0.7,0.15,0.15")

## Splitting Strategies

### Random
- Simple random sampling
- Use case: IID data, no dependencies
- Fastest approach

### Stratified
- Maintains class distribution
- Use case: Classification with imbalanced classes
- Ensures representative splits

### Temporal
- Split by time (no future leakage)
- Use case: Time series, forecasting
- Respects temporal order

### Group
- Keep groups together (e.g., same user)
- Use case: User-level data
- Prevents data leakage

## Code Template
```python
from omgkit.data import DataSplitter

splitter = DataSplitter()

# Stratified split
train, val, test = splitter.split(
    data_path="data/processed/dataset.parquet",
    strategy="stratified",
    stratify_column="label",
    ratios=[0.7, 0.15, 0.15],
    random_state=42
)

# Temporal split (for time series)
train, val, test = splitter.split(
    data_path="data/processed/transactions.parquet",
    strategy="temporal",
    time_column="timestamp",
    train_end="2023-10-01",
    val_end="2023-11-01"
)

splitter.save_splits(
    train=train, val=val, test=test,
    output_dir="data/splits/"
)
```

## Validation
- No data leakage between splits
- Class distribution preserved
- Temporal order respected
- Group integrity maintained

## Progress
- [ ] Strategy selected
- [ ] Data loaded
- [ ] Split executed
- [ ] Validation passed
- [ ] Splits saved

Prevent data leakage for valid model evaluation.
