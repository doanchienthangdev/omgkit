---
description: Package model for deployment in TorchServe, TF Serving, ONNX, TFLite, or Docker formats
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <format> [--model <path>]
---

# Model Packaging: $ARGUMENTS

Package model: **$ARGUMENTS**

## Agent
Uses **deployment-agent** for model packaging.

## Parameters
- **format**: torchserve | tensorflow_serving | onnx | tflite | docker
- **model**: Path to trained model

## Package Formats

### TorchServe
- .mar archive file
- Custom handler support
- Multi-model serving
- Batch inference

### TensorFlow Serving
- SavedModel format
- gRPC/REST endpoints
- Model versioning
- Warm-up support

### ONNX
- Cross-framework format
- Hardware agnostic
- Wide runtime support
- Optimization passes

### TFLite
- Mobile/embedded ready
- Quantization built-in
- Delegates support
- Minimal footprint

### Docker
- Containerized deployment
- All dependencies included
- Kubernetes ready
- Easy scaling

## Code Template
```python
from omgkit.deployment import ModelPackager

packager = ModelPackager()

# Package for TorchServe
package = packager.package(
    model_path="models/best_model.pt",
    format="torchserve",
    model_name="churn_predictor",
    version="1.0",
    handler="src/serving/handler.py",
    requirements=["torch", "numpy", "pandas"],
    output_dir="artifacts/"
)

# Package as Docker
docker_image = packager.package(
    model_path="models/best_model.pt",
    format="docker",
    base_image="pytorch/pytorch:2.0.0-cuda11.7-cudnn8-runtime",
    expose_port=8080,
    output_dir="docker/"
)
```

## Output Artifacts
- Packaged model file
- Dockerfile (if docker)
- Requirements file
- Handler script
- Config files

## Progress
- [ ] Model loaded
- [ ] Format validated
- [ ] Dependencies resolved
- [ ] Package created
- [ ] Artifacts saved

Create deployment-ready model packages.
