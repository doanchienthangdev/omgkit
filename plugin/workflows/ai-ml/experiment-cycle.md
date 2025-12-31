---
description: Run ML experiments with proper tracking and reproducibility
triggers:
  - manual
  - ml:experiment
agents:
  - ml-engineer
  - data-scientist
---

# Experiment Cycle Workflow

Systematic ML experimentation with full reproducibility.

## Prerequisites
- [ ] Training data prepared
- [ ] Baseline model exists
- [ ] Experiment tracking configured

## Phase 1: Experiment Setup

### Step 1.1: Define Hypothesis
```yaml
agent: ml-engineer
action: define
hypothesis:
  - What are we testing?
  - Expected outcome
  - Success criteria
  - Metrics to track
```

### Step 1.2: Configure Experiment
```yaml
agent: ml-engineer
action: configure
tracking_platform:
  - MLflow
  - Weights & Biases
  - Neptune
  - Comet
configuration:
  - experiment_name
  - run_name
  - tags
  - description
```

## Phase 2: Data Preparation

### Step 2.1: Create Dataset Version
```yaml
agent: ml-engineer
action: version
tools:
  - DVC
  - Delta Lake
  - LakeFS
tracking:
  - Dataset hash
  - Row count
  - Feature statistics
  - Split ratios
```

### Step 2.2: Create Data Splits
```yaml
agent: ml-engineer
action: split
strategy:
  - train: 70%
  - validation: 15%
  - test: 15%
considerations:
  - Stratification
  - Time-based splits
  - Group-aware splits
  - No data leakage
```

## Phase 3: Training

### Step 3.1: Configure Training
```yaml
agent: ml-engineer
action: configure
hyperparameters:
  - Model architecture
  - Learning rate
  - Batch size
  - Regularization
  - Early stopping
tracking:
  - Log all hyperparameters
  - Log environment info
  - Log code version
```

### Step 3.2: Run Training
```yaml
agent: ml-engineer
action: train
logging:
  - Loss curves
  - Metrics per epoch
  - Resource usage
  - Training time
artifacts:
  - Model checkpoints
  - Training logs
  - Confusion matrices
```

### Step 3.3: Hyperparameter Tuning
```yaml
agent: ml-engineer
action: tune
methods:
  - Grid search
  - Random search
  - Bayesian optimization
  - Hyperband
tools:
  - Optuna
  - Ray Tune
  - W&B Sweeps
```

## Phase 4: Evaluation

### Step 4.1: Compute Metrics
```yaml
agent: ml-engineer
action: evaluate
metrics:
  classification:
    - Accuracy, Precision, Recall, F1
    - AUC-ROC, AUC-PR
    - Confusion matrix
  regression:
    - MSE, RMSE, MAE
    - R-squared
    - Residual analysis
  ranking:
    - NDCG, MRR, MAP
```

### Step 4.2: Error Analysis
```yaml
agent: ml-engineer
action: analyze
analysis:
  - Failure cases
  - Slice performance
  - Bias detection
  - Edge cases
tools:
  - What-If Tool
  - Fairlearn
  - Custom analysis
```

## Phase 5: Documentation

### Step 5.1: Log Results
```yaml
agent: ml-engineer
action: log
artifacts:
  - Final model
  - Evaluation metrics
  - Plots and visualizations
  - Error analysis report
```

### Step 5.2: Compare with Baseline
```yaml
agent: ml-engineer
action: compare
comparison:
  - Metric improvements
  - Statistical significance
  - Trade-offs (speed, size)
  - Resource usage
decision:
  - Promote to staging
  - Iterate further
  - Abandon approach
```

## Outputs
- [ ] Versioned dataset
- [ ] Trained model
- [ ] Experiment logs
- [ ] Evaluation report
- [ ] Comparison analysis

## Quality Gates
- Metrics improve over baseline
- No data leakage detected
- Model is reproducible
- Artifacts properly logged
- Decision documented
