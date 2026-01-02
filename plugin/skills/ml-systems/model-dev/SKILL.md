---
name: model-development
description: Model development practices including model selection, training pipelines, hyperparameter tuning, evaluation, and model selection strategies.
---

# Model Development

Building and training ML models effectively.

## Model Selection

```python
from sklearn.model_selection import cross_val_score

models = {
    "logistic": LogisticRegression(),
    "random_forest": RandomForestClassifier(),
    "xgboost": XGBClassifier(),
    "lightgbm": LGBMClassifier(),
    "catboost": CatBoostClassifier(verbose=False)
}

results = {}
for name, model in models.items():
    scores = cross_val_score(model, X, y, cv=5, scoring="f1_macro")
    results[name] = {
        "mean": scores.mean(),
        "std": scores.std()
    }
    print(f"{name}: {scores.mean():.3f} (+/- {scores.std():.3f})")
```

## Training Pipeline

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

class TrainingPipeline:
    def __init__(self, model, optimizer, criterion, device):
        self.model = model.to(device)
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device

    def train_epoch(self, dataloader):
        self.model.train()
        total_loss = 0
        for batch in dataloader:
            x, y = batch[0].to(self.device), batch[1].to(self.device)
            self.optimizer.zero_grad()
            output = self.model(x)
            loss = self.criterion(output, y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
            self.optimizer.step()
            total_loss += loss.item()
        return total_loss / len(dataloader)

    def evaluate(self, dataloader):
        self.model.eval()
        predictions, targets = [], []
        with torch.no_grad():
            for batch in dataloader:
                x, y = batch[0].to(self.device), batch[1].to(self.device)
                output = self.model(x)
                predictions.extend(output.argmax(dim=1).cpu().numpy())
                targets.extend(y.cpu().numpy())
        return accuracy_score(targets, predictions)
```

## Hyperparameter Tuning

```python
import optuna

def objective(trial):
    params = {
        "learning_rate": trial.suggest_float("learning_rate", 1e-5, 1e-1, log=True),
        "max_depth": trial.suggest_int("max_depth", 3, 10),
        "n_estimators": trial.suggest_int("n_estimators", 50, 500),
        "min_child_weight": trial.suggest_int("min_child_weight", 1, 10)
    }

    model = XGBClassifier(**params, use_label_encoder=False, eval_metric="logloss")
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring="f1_macro")

    return scores.mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=100)

print(f"Best params: {study.best_params}")
print(f"Best F1: {study.best_value:.3f}")
```

## Model Evaluation

```python
from sklearn.metrics import classification_report, confusion_matrix

def comprehensive_evaluation(model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # Classification metrics
    print(classification_report(y_test, y_pred))

    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:\n{cm}")

    # ROC-AUC
    roc_auc = roc_auc_score(y_test, y_prob)
    print(f"ROC-AUC: {roc_auc:.3f}")

    # Precision-Recall AUC
    pr_auc = average_precision_score(y_test, y_prob)
    print(f"PR-AUC: {pr_auc:.3f}")

    return {
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
        "confusion_matrix": cm,
        "roc_auc": roc_auc,
        "pr_auc": pr_auc
    }
```

## Model Registry

```python
import mlflow.sklearn

# Register model
with mlflow.start_run():
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="churn_predictor"
    )

# Load registered model
model = mlflow.pyfunc.load_model(
    model_uri="models:/churn_predictor/Production"
)
```

## Commands
- `/omgtrain:train` - Train model
- `/omgtrain:tune` - Hyperparameter tuning
- `/omgtrain:evaluate` - Evaluate model

## Best Practices

1. Use cross-validation
2. Tune hyperparameters systematically
3. Evaluate on multiple metrics
4. Check for overfitting
5. Register successful models
