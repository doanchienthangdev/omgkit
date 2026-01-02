---
name: Model Development Workflow
description: End-to-end model development workflow from problem definition to trained model, including baseline establishment and iterative improvement.
category: ml-systems
complexity: medium
agents:
  - data-scientist-agent
  - research-scientist-agent
  - experiment-analyst-agent
---

# Model Development Workflow

Complete workflow for developing ML models from problem definition to trained model.

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│              MODEL DEVELOPMENT WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. PROBLEM      2. DATA          3. BASELINE               │
│     DEFINITION      EXPLORATION      MODELS                 │
│     ↓               ↓               ↓                       │
│  Define metrics  EDA & quality   Simple models              │
│  Success criteria Feature dist.  Benchmark                  │
│                                                              │
│  4. FEATURE      5. MODEL         6. VALIDATION             │
│     ENGINEERING     TRAINING        & SELECTION             │
│     ↓               ↓               ↓                       │
│  Transform data  Train models    Cross-validate             │
│  Create features Tune hyperparams Select best              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Steps

### Step 1: Problem Definition
**Agent**: data-scientist-agent

**Inputs**:
- Business requirements
- Available data sources
- Constraints (latency, cost, etc.)

**Actions**:
```bash
# Initialize project structure
/omgml:init <project_name> --template classification|regression|ranking

# Define success metrics
# Create experiment tracking
```

**Outputs**:
- Clear problem statement
- Success metrics defined
- Baseline criteria established

### Step 2: Data Exploration
**Agent**: data-scientist-agent

**Inputs**:
- Raw datasets
- Data dictionaries

**Actions**:
```bash
# Validate data quality
/omgdata:validate --schema schema.yaml --data data.csv

# Exploratory analysis
# - Distribution analysis
# - Missing value patterns
# - Correlation analysis
# - Target variable analysis
```

**Outputs**:
- Data quality report
- Feature distributions
- Initial insights
- Data cleaning requirements

### Step 3: Baseline Models
**Agent**: data-scientist-agent, experiment-analyst-agent

**Inputs**:
- Cleaned dataset
- Target variable

**Actions**:
```bash
# Train baseline models
/omgtrain:baseline --data data.csv --target target_column

# Establishes benchmarks with:
# - Dummy classifiers (majority, random, stratified)
# - Simple models (logistic regression, decision tree)
# - Basic feature set
```

**Outputs**:
- Baseline performance metrics
- Simple model benchmarks
- Performance floor established

### Step 4: Feature Engineering
**Agent**: data-scientist-agent

**Inputs**:
- Data exploration insights
- Domain knowledge
- Baseline results

**Actions**:
```bash
# Extract features
/omgfeature:extract --input data.csv --output features/

# Feature selection
/omgfeature:select --method mutual_info --k 50

# Store features
/omgfeature:store --name project_features
```

**Outputs**:
- Engineered features
- Feature importance rankings
- Feature store entries

### Step 5: Model Training
**Agent**: research-scientist-agent

**Inputs**:
- Engineered features
- Target variable
- Baseline performance

**Actions**:
```bash
# Train models
/omgtrain:train --config configs/experiment.yaml

# Hyperparameter tuning
/omgtrain:tune --model xgboost --trials 100

# Compare results
/omgtrain:compare --experiments exp1,exp2,exp3
```

**Outputs**:
- Trained models
- Experiment logs
- Performance metrics

### Step 6: Validation & Selection
**Agent**: experiment-analyst-agent

**Inputs**:
- All trained models
- Validation dataset
- Business requirements

**Actions**:
```bash
# Comprehensive evaluation
/omgtrain:evaluate --model best_model.pt --data test.csv

# Analysis includes:
# - Cross-validation scores
# - Holdout test performance
# - Error analysis
# - Fairness assessment
```

**Outputs**:
- Final model selection
- Performance report
- Model documentation
- Registered model in registry

## Checkpoints

| Phase | Checkpoint | Criteria |
|-------|------------|----------|
| 1 | Problem defined | Clear metrics, success criteria |
| 2 | Data validated | Quality checks pass, no blockers |
| 3 | Baseline established | Simple models trained and logged |
| 4 | Features ready | Feature set defined, stored |
| 5 | Models trained | Multiple experiments complete |
| 6 | Model selected | Best model meets criteria |

## Artifacts

- `configs/experiment.yaml` - Experiment configuration
- `features/` - Engineered features
- `models/` - Trained model artifacts
- `reports/` - Analysis reports
- `mlflow/` - Experiment tracking data

## Next Workflows

After completing model development:
- → **model-evaluation-workflow** for detailed evaluation
- → **model-optimization-workflow** for performance optimization
- → **model-deployment-workflow** for production deployment

## Quality Gates

- [ ] All steps completed successfully
- [ ] Metrics meet defined thresholds
- [ ] Documentation updated
- [ ] Artifacts versioned and stored
- [ ] Stakeholder approval obtained
