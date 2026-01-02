---
description: Quantize model using dynamic, static, or QAT methods to reduce size and improve inference speed
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <method> [--calibration_data <path>]
---

# Model Quantization: $ARGUMENTS

Quantize model: **$ARGUMENTS**

## Agent
Uses **performance-engineer-agent** for model quantization.

## Parameters
- **method**: dynamic | static | qat (default: dynamic)
- **calibration_data**: Path to calibration data (for static)

## Quantization Methods

### Dynamic Quantization
- Quantize weights only
- Activations at runtime
- No calibration needed
- Quick to apply

### Static Quantization
- Quantize weights and activations
- Requires calibration data
- Better performance
- More accurate

### QAT (Quantization-Aware Training)
- Train with quantization simulation
- Best accuracy preservation
- Requires retraining
- Most effort

## Code Template
```python
from omgkit.optimization import ModelQuantizer

quantizer = ModelQuantizer()

# Static quantization
quantized_model = quantizer.quantize(
    model_path="models/best_model.pt",
    method="static",
    calibration_data="data/splits/val.parquet",
    calibration_samples=1000,
    dtype="int8"
)

# Evaluate quantized model
metrics = quantizer.evaluate(
    original_model="models/best_model.pt",
    quantized_model=quantized_model,
    test_data="data/splits/test.parquet"
)

print(f"Size reduction: {metrics['size_reduction']:.1%}")
print(f"Speedup: {metrics['speedup']:.2f}x")
print(f"Accuracy drop: {metrics['accuracy_drop']:.2%}")
```

## Output Formats
- INT8: 4x smaller, ~2-4x faster
- INT4: 8x smaller, experimental
- FP16: 2x smaller, minimal accuracy loss

## Comparison Metrics
- Model size reduction
- Inference speedup
- Memory usage reduction
- Accuracy degradation

## Progress
- [ ] Model loaded
- [ ] Calibration complete
- [ ] Quantization applied
- [ ] Quality validated
- [ ] Output saved

Optimize model for production deployment.
