---
name: Data Preparation Workflow
description: Comprehensive data preparation workflow including collection, validation, cleaning, labeling, augmentation, and versioning.
category: ml-systems
complexity: medium
agents:
  - data-scientist-agent
  - ml-engineer-agent
---

# Data Preparation Workflow

Complete workflow for preparing high-quality training data.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│               DATA PREPARATION WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. COLLECT       2. VALIDATE      3. CLEAN                 │
│     ↓                ↓                ↓                     │
│  Gather data     Schema checks    Handle missing            │
│  Multiple sources Quality gates   Remove outliers           │
│                                                              │
│  4. LABEL         5. AUGMENT       6. SPLIT & VERSION       │
│     ↓                ↓                ↓                     │
│  Manual/weak     Synthetic data   Train/val/test            │
│  Active learning Balance classes  DVC versioning            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Steps

### Step 1: Data Collection
**Agent**: ml-engineer-agent

**Inputs**:
- Data source configurations
- Collection requirements
- Schema definitions

**Actions**:
```bash
# Collect data from sources
/omgdata:collect --sources sources.yaml --output raw/

# Sources can include:
# - Databases (SQL, NoSQL)
# - APIs
# - File systems
# - Streaming sources
```

**Outputs**:
- Raw data files
- Collection metadata
- Source lineage

### Step 2: Data Validation
**Agent**: data-scientist-agent

**Inputs**:
- Raw collected data
- Schema definitions
- Quality expectations

**Actions**:
```bash
# Validate against schema
/omgdata:validate --schema schema.yaml --data raw/data.csv

# Validation checks:
# - Schema compliance
# - Data types
# - Value ranges
# - Null patterns
# - Referential integrity
```

**Quality Gates**:
```python
quality_gates = {
    "completeness": {"threshold": 0.95, "columns": ["id", "target"]},
    "uniqueness": {"threshold": 0.99, "column": "id"},
    "freshness": {"max_age_hours": 24},
    "schema_match": {"strict": True}
}
```

**Outputs**:
- Validation report
- Quality metrics
- Data anomalies list

### Step 3: Data Cleaning
**Agent**: data-scientist-agent

**Inputs**:
- Validated data
- Cleaning rules
- Business logic

**Actions**:
```python
# Cleaning operations
cleaning_steps = [
    # Handle missing values
    {"column": "age", "method": "median"},
    {"column": "category", "method": "mode"},
    {"column": "optional_field", "method": "drop_row", "threshold": 0.5},

    # Remove outliers
    {"column": "amount", "method": "iqr", "factor": 3},

    # Fix inconsistencies
    {"column": "status", "mapping": {"active": "Active", "ACTIVE": "Active"}},

    # Type corrections
    {"column": "date", "dtype": "datetime"},
]
```

**Outputs**:
- Cleaned dataset
- Cleaning log
- Removed records report

### Step 4: Data Labeling
**Agent**: data-scientist-agent

**Inputs**:
- Cleaned data (unlabeled or partially labeled)
- Labeling guidelines
- Label schema

**Actions**:
```bash
# Setup labeling workflow
/omgdata:label --strategy weak_supervision --output labeled/

# Labeling strategies:
# - Manual labeling (export to Label Studio)
# - Weak supervision (Snorkel labeling functions)
# - Active learning (uncertainty sampling)
# - Semi-supervised (pseudo-labels)
```

**Labeling Functions Example**:
```python
from snorkel.labeling import labeling_function

@labeling_function()
def lf_keyword_spam(x):
    spam_words = ["free", "winner", "click here"]
    return 1 if any(w in x.text.lower() for w in spam_words) else -1

@labeling_function()
def lf_short_text(x):
    return 1 if len(x.text) < 20 else -1
```

**Outputs**:
- Labeled dataset
- Label quality metrics
- Inter-annotator agreement

### Step 5: Data Augmentation
**Agent**: data-scientist-agent

**Inputs**:
- Labeled dataset
- Class distribution
- Augmentation requirements

**Actions**:
```bash
# Augment data
/omgdata:augment --strategy smote --ratio 1.0

# Augmentation techniques:
# - SMOTE for tabular (imbalanced classes)
# - Text augmentation (synonyms, back-translation)
# - Image augmentation (rotation, flip, color)
```

**Augmentation Config**:
```python
augmentation_config = {
    "tabular": {
        "method": "smote",
        "sampling_strategy": "minority",
        "k_neighbors": 5
    },
    "text": {
        "methods": ["synonym_replace", "random_insert"],
        "aug_percent": 0.3
    },
    "image": {
        "transforms": ["horizontal_flip", "rotation", "brightness"],
        "probability": 0.5
    }
}
```

**Outputs**:
- Augmented dataset
- Class balance report
- Augmentation metadata

### Step 6: Split & Version
**Agent**: ml-engineer-agent

**Inputs**:
- Final processed dataset
- Split strategy
- Version metadata

**Actions**:
```bash
# Split data
/omgdata:split --strategy stratified --train 0.7 --val 0.15 --test 0.15

# Version with DVC
/omgdata:version --message "v1.2 - Added augmentation, fixed labels"
```

**Split Strategies**:
```python
split_strategies = {
    "random": {"stratify": True, "seed": 42},
    "temporal": {"time_column": "date", "train_end": "2024-01-01"},
    "group": {"group_column": "user_id"},  # No data leakage
}
```

**Outputs**:
- Train/validation/test splits
- Version tagged in DVC
- Split statistics

## Checkpoints

| Phase | Checkpoint | Criteria |
|-------|------------|----------|
| 1 | Data collected | All sources ingested |
| 2 | Validation passed | Quality gates met |
| 3 | Data cleaned | No critical issues |
| 4 | Labels complete | Coverage >95% |
| 5 | Augmentation done | Classes balanced |
| 6 | Versioned | DVC commit created |

## Artifacts

- `raw/` - Raw collected data
- `processed/` - Cleaned and processed data
- `labeled/` - Labeled datasets
- `augmented/` - Augmented data
- `splits/` - Train/val/test splits
- `data.dvc` - DVC tracking file

## Next Workflows

After data preparation:
- → **model-development-workflow** for model training
- → **feature-engineering-workflow** for advanced features

## Quality Gates

- [ ] All steps completed successfully
- [ ] Metrics meet defined thresholds
- [ ] Documentation updated
- [ ] Artifacts versioned and stored
- [ ] Stakeholder approval obtained
