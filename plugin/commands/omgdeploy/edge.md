---
description: Deploy model to edge devices including TFLite Micro, Jetson, Raspberry Pi, and mobile platforms
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <target> [--model <path>] [--optimize]
---

# Edge Deployment: $ARGUMENTS

Deploy to edge: **$ARGUMENTS**

## Agent
Uses **deployment-agent** for edge deployment.

## Parameters
- **target**: tflite_micro | jetson | raspberry_pi | mobile_ios | mobile_android
- **model**: Path to model
- **optimize**: Apply target-specific optimization (default: true)

## Edge Targets

### TFLite Micro
- Microcontroller deployment
- <1MB Flash, <256KB RAM
- INT8 quantization required
- C++ runtime

### Jetson (Nano/Xavier/Orin)
- NVIDIA GPU accelerated
- TensorRT optimization
- FP16/INT8 support
- CUDA runtime

### Raspberry Pi
- ARM CPU deployment
- ONNX Runtime
- INT8 quantization
- Python/C++ runtime

### Mobile iOS
- CoreML format
- Neural Engine
- On-device inference
- Swift/Obj-C integration

### Mobile Android
- TFLite format
- NNAPI delegate
- GPU delegate
- Kotlin/Java integration

## Code Template
```python
from omgkit.deployment import EdgeDeployer

deployer = EdgeDeployer()

# Deploy to TFLite Micro (TinyML)
tflite_model = deployer.deploy(
    model_path="models/best_model.pt",
    target="tflite_micro",
    optimize=True,
    constraints={
        "max_flash_kb": 512,
        "max_ram_kb": 128,
        "target_latency_ms": 10
    },
    output_dir="edge/tflite_micro/"
)

# Deploy to Jetson
jetson_model = deployer.deploy(
    model_path="models/best_model.pt",
    target="jetson",
    optimize=True,
    tensorrt_precision="fp16",
    output_dir="edge/jetson/"
)
```

## Optimization Applied
- Quantization (INT8/FP16)
- Pruning
- Operator fusion
- Memory optimization

## Progress
- [ ] Target validated
- [ ] Model converted
- [ ] Optimization applied
- [ ] Size verified
- [ ] Package created

Deploy ML models to resource-constrained devices.
