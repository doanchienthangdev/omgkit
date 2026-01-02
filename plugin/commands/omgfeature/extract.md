---
description: Extract features from numerical, categorical, text, image, and temporal data with configurable pipelines
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <feature_type> [--config <config>]
---

# Feature Extraction: $ARGUMENTS

Extract features: **$ARGUMENTS**

## Agent
Uses **feature-engineer-agent** for feature extraction.

## Parameters
- **feature_type**: numerical | categorical | text | image | temporal | custom
- **config**: Path to feature extraction config

## Feature Operations

### Numerical
- Scaling (standard, minmax, robust)
- Log transform
- Polynomial features
- Binning/discretization
- Outlier handling

### Categorical
- One-hot encoding
- Label encoding
- Target encoding
- Frequency encoding
- Hash encoding

### Text
- TF-IDF vectors
- Word2Vec/FastText
- BERT embeddings
- Text statistics
- N-gram features

### Image
- CNN feature extraction
- Histogram features
- Edge detection
- Color features

### Temporal
- Datetime components
- Cyclical encoding (sin/cos)
- Lag features
- Rolling statistics
- Trend extraction

## Code Template
```python
from omgkit.features import FeatureExtractor

extractor = FeatureExtractor()

feature_pipeline = extractor.create_pipeline({
    "numerical": {
        "columns": ["age", "income", "tenure"],
        "operations": ["scaling", "log_transform"]
    },
    "categorical": {
        "columns": ["city", "occupation"],
        "operations": ["target_encoding"]
    },
    "text": {
        "columns": ["description"],
        "operations": ["tfidf", "text_statistics"]
    },
    "temporal": {
        "columns": ["signup_date", "last_login"],
        "operations": ["datetime_components", "cyclical_encoding"]
    }
})

features = extractor.extract(
    data_path="data/processed/users.parquet",
    pipeline=feature_pipeline,
    output_path="data/features/user_features.parquet"
)
```

## Progress
- [ ] Config loaded
- [ ] Pipeline created
- [ ] Features extracted
- [ ] Quality validated
- [ ] Output saved

Create reproducible feature engineering pipelines.
