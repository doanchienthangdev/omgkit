---
description: Train ML model with experiment tracking and hyperparameter tuning
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <model type or training task>
---

# 🤖 ML Training: $ARGUMENTS

Train model: **$ARGUMENTS**

## Agent
Uses **ml-engineer** agent for model training.

## Workflow
1. **Data Prep** - Load and preprocess data
2. **Feature Engineering** - Create features
3. **Model Selection** - Choose architecture
4. **Training** - Train with tracking
5. **Tuning** - Hyperparameter optimization

## Experiment Tracking
- MLflow / Weights & Biases
- Parameters logged
- Metrics recorded
- Artifacts stored
- Model versioning

## Hyperparameter Tuning
- Grid search
- Random search
- Bayesian optimization
- Early stopping

## Outputs
- Trained model artifact
- Training metrics
- Learning curves
- Hyperparameter config
- Model card

## Progress
- [ ] Data prepared
- [ ] Features engineered
- [ ] Model trained
- [ ] Hyperparameters tuned
- [ ] Model registered

Log all experiments to tracking server.
