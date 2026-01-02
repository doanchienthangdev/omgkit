---
description: Select most important features using filter, wrapper, embedded, or hybrid methods
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <method> [--n_features <n>]
---

# Feature Selection: $ARGUMENTS

Select features: **$ARGUMENTS**

## Agent
Uses **feature-engineer-agent** for feature selection.

## Parameters
- **method**: filter | wrapper | embedded | hybrid (default: hybrid)
- **n_features**: Number of features to select

## Selection Methods

### Filter Methods
- Mutual information
- Chi-square test
- ANOVA F-test
- Correlation analysis
- Variance threshold

### Wrapper Methods
- Recursive feature elimination (RFE)
- Forward selection
- Backward elimination
- Exhaustive search

### Embedded Methods
- LASSO importance (L1)
- Tree-based importance
- Permutation importance
- SHAP values

### Hybrid
- Combines multiple methods
- Voting/consensus approach
- Best of both worlds

## Code Template
```python
from omgkit.features import FeatureSelector

selector = FeatureSelector()

selected_features = selector.select(
    data_path="data/features/all_features.parquet",
    target_column="label",
    methods={
        "filter": ["mutual_information", "correlation"],
        "embedded": ["tree_importance"]
    },
    n_features=50,
    output_path="data/features/selected_features.parquet"
)

# Generate importance report
selector.report(output="reports/feature_importance.html")
```

## Output
- Selected feature list
- Feature importance scores
- Selection rationale
- Visualization plots
- HTML report

## Best Practices
- Start with filter methods (fast)
- Use embedded for final selection
- Validate on holdout set
- Consider domain knowledge

## Progress
- [ ] Features loaded
- [ ] Methods applied
- [ ] Selection complete
- [ ] Report generated
- [ ] Output saved

Reduce dimensionality while preserving predictive power.
