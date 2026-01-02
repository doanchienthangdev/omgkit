---
name: model-deployment
description: Model deployment strategies including serving infrastructure, containerization, model packaging, versioning, and production deployment patterns.
---

# Model Deployment

Deploying ML models to production.

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ML DEPLOYMENT PATTERNS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  BATCH INFERENCE       REAL-TIME          STREAMING         │
│  ───────────────       ─────────          ─────────         │
│  Spark/Airflow         REST/gRPC          Kafka/Flink       │
│  High throughput       Low latency        Continuous        │
│  Scheduled runs        On-demand          Event-driven      │
│                                                              │
│  EMBEDDED              EDGE               SERVERLESS        │
│  ────────              ────               ──────────        │
│  Mobile SDK            IoT devices        AWS Lambda        │
│  On-device             Local inference    Auto-scaling      │
│  Offline capable       Bandwidth limited  Pay per request   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Model Serving Frameworks

### TorchServe
```python
# Handler for TorchServe
from ts.torch_handler.base_handler import BaseHandler
import torch

class ModelHandler(BaseHandler):
    def initialize(self, context):
        self.manifest = context.manifest
        model_dir = context.system_properties.get("model_dir")
        self.model = torch.jit.load(f"{model_dir}/model.pt")
        self.model.eval()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def preprocess(self, data):
        inputs = []
        for row in data:
            input_data = row.get("data") or row.get("body")
            inputs.append(torch.tensor(input_data))
        return torch.stack(inputs).to(self.device)

    def inference(self, data):
        with torch.no_grad():
            return self.model(data)

    def postprocess(self, inference_output):
        return inference_output.tolist()

# Package model
# torch-model-archiver --model-name model --version 1.0 \
#   --serialized-file model.pt --handler handler.py
```

### TensorFlow Serving
```python
import tensorflow as tf

# Save model in SavedModel format
tf.saved_model.save(model, "saved_model/1")

# Serve with Docker
# docker run -p 8501:8501 \
#   -v /path/to/saved_model:/models/model \
#   -e MODEL_NAME=model \
#   tensorflow/serving

# Client request
import requests
import json

data = {"instances": [[1.0, 2.0, 3.0]]}
response = requests.post(
    "http://localhost:8501/v1/models/model:predict",
    json=data
)
predictions = response.json()["predictions"]
```

### Triton Inference Server
```python
# Model repository structure
# models/
#   model_name/
#     config.pbtxt
#     1/
#       model.onnx

# config.pbtxt
"""
name: "my_model"
platform: "onnxruntime_onnx"
max_batch_size: 64
input [
  {
    name: "input"
    data_type: TYPE_FP32
    dims: [ -1, 784 ]
  }
]
output [
  {
    name: "output"
    data_type: TYPE_FP32
    dims: [ -1, 10 ]
  }
]
instance_group [
  { count: 2, kind: KIND_GPU }
]
dynamic_batching {
  preferred_batch_size: [ 16, 32 ]
  max_queue_delay_microseconds: 100
}
"""

# Python client
import tritonclient.grpc as grpcclient

client = grpcclient.InferenceServerClient("localhost:8001")
inputs = [grpcclient.InferInput("input", [1, 784], "FP32")]
inputs[0].set_data_from_numpy(input_data)
outputs = [grpcclient.InferRequestedOutput("output")]
result = client.infer("my_model", inputs, outputs=outputs)
```

## Containerization

### Docker for ML
```dockerfile
# Multi-stage build for production
FROM python:3.10-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.10-slim

# Non-root user for security
RUN useradd -m -u 1000 appuser
USER appuser

WORKDIR /app
COPY --from=builder /root/.local /home/appuser/.local
COPY --chown=appuser:appuser . .

ENV PATH=/home/appuser/.local/bin:$PATH
ENV MODEL_PATH=/app/models/model.pt

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-model
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model
  template:
    metadata:
      labels:
        app: ml-model
    spec:
      containers:
      - name: model
        image: ml-model:v1.0
        resources:
          requests:
            memory: "2Gi"
            cpu: "1"
            nvidia.com/gpu: 1
          limits:
            memory: "4Gi"
            cpu: "2"
            nvidia.com/gpu: 1
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: MODEL_VERSION
          value: "1.0"
---
apiVersion: v1
kind: Service
metadata:
  name: ml-model-service
spec:
  selector:
    app: ml-model
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ml-model-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ml-model
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## FastAPI Model Server

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import numpy as np

app = FastAPI(title="ML Model API", version="1.0")

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: int
    confidence: float
    model_version: str

# Load model on startup
@app.on_event("startup")
async def load_model():
    global model
    model = torch.jit.load("model.pt")
    model.eval()

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/ready")
async def ready():
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "ready"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        input_tensor = torch.tensor([request.features])
        with torch.no_grad():
            output = model(input_tensor)
            probs = torch.softmax(output, dim=1)
            prediction = output.argmax(dim=1).item()
            confidence = probs[0][prediction].item()

        return PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            model_version="1.0"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch_predict")
async def batch_predict(requests: list[PredictionRequest]):
    inputs = torch.tensor([r.features for r in requests])
    with torch.no_grad():
        outputs = model(inputs)
    return {"predictions": outputs.argmax(dim=1).tolist()}
```

## Model Versioning

```python
import mlflow

# Register model version
with mlflow.start_run():
    mlflow.sklearn.log_model(model, "model", registered_model_name="production_model")

# Transition to production
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="production_model",
    version=3,
    stage="Production"
)

# Load production model
model = mlflow.pyfunc.load_model("models:/production_model/Production")

# Canary deployment
def route_request(request, canary_percentage=10):
    import random
    if random.random() < canary_percentage / 100:
        return canary_model.predict(request)
    return production_model.predict(request)
```

## Commands
- `/omgdeploy:package` - Package model
- `/omgdeploy:serve` - Serve model
- `/omgdeploy:cloud` - Cloud deployment
- `/omgops:registry` - Model registry

## Best Practices

1. Use health and readiness probes
2. Implement graceful shutdown
3. Version models explicitly
4. Monitor inference latency
5. Use canary deployments for safety
