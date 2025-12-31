---
description: Evaluate ML model performance with comprehensive metrics
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <model name or path>
---

# 📊 ML Evaluation: $ARGUMENTS

Evaluate model: **$ARGUMENTS**

## Agent
Uses **ml-engineer** agent for model evaluation.

## Evaluation Types
- **Offline** - Test set metrics
- **Online** - A/B testing
- **Shadow** - Production comparison
- **Bias** - Fairness analysis

## Metrics
- Classification: Accuracy, F1, AUC, Precision, Recall
- Regression: RMSE, MAE, R², MAPE
- Ranking: NDCG, MAP, MRR
- Custom: Business metrics

## Workflow
1. **Data Split** - Ensure proper splits
2. **Baseline** - Compare against baseline
3. **Metrics** - Compute all metrics
4. **Analysis** - Error analysis
5. **Report** - Generate evaluation report

## Outputs
- Confusion matrix
- ROC/PR curves
- Feature importance
- Error analysis
- Evaluation report

## Progress
- [ ] Test data prepared
- [ ] Baseline computed
- [ ] Metrics calculated
- [ ] Errors analyzed
- [ ] Report generated

Include model comparison if multiple models.
