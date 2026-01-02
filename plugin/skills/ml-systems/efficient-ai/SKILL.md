---
name: efficient-ai
description: Efficient AI techniques including model compression, quantization, pruning, knowledge distillation, and hardware-aware optimization for production systems.
---

# Efficient AI

Techniques for building resource-efficient ML systems.

## Model Compression Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 MODEL COMPRESSION TECHNIQUES                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  QUANTIZATION         PRUNING            DISTILLATION       │
│  ─────────────        ──────────         ────────────       │
│  FP32 → INT8          Remove weights     Teacher→Student    │
│  2-4x smaller         50-90% sparse      10-100x smaller    │
│  1.5-3x faster        2-4x faster        Same accuracy      │
│                                                              │
│  ARCHITECTURE         LOW-RANK           NEURAL ARCH        │
│  ─────────────        ──────────         ────────────       │
│  MobileNet            Matrix decomp      AutoML search      │
│  EfficientNet         LoRA adapters      Hardware-aware     │
│  Depth-separable      Rank reduction     Latency targets    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Quantization

### Post-Training Quantization
```python
import torch
from torch.quantization import quantize_dynamic, quantize_static

# Dynamic quantization (weights only)
model_dynamic = quantize_dynamic(
    model,
    {torch.nn.Linear, torch.nn.LSTM},
    dtype=torch.qint8
)

# Static quantization (weights + activations)
model.qconfig = torch.quantization.get_default_qconfig('fbgemm')
model_prepared = torch.quantization.prepare(model)

# Calibrate with representative data
with torch.no_grad():
    for batch in calibration_loader:
        model_prepared(batch)

model_static = torch.quantization.convert(model_prepared)
```

### Quantization-Aware Training
```python
import torch.quantization as quant

class QuantizedModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.quant = quant.QuantStub()
        self.dequant = quant.DeQuantStub()
        self.layers = nn.Sequential(
            nn.Linear(784, 256),
            nn.ReLU(),
            nn.Linear(256, 10)
        )

    def forward(self, x):
        x = self.quant(x)
        x = self.layers(x)
        x = self.dequant(x)
        return x

# Enable QAT
model.qconfig = quant.get_default_qat_qconfig('fbgemm')
model = quant.prepare_qat(model)

# Train normally
for epoch in range(epochs):
    train(model, train_loader)

# Convert to quantized
model = quant.convert(model)
```

## Pruning

### Magnitude Pruning
```python
import torch.nn.utils.prune as prune

# Unstructured pruning (individual weights)
prune.l1_unstructured(model.layer1, name='weight', amount=0.3)

# Structured pruning (entire channels)
prune.ln_structured(
    model.conv1, name='weight', amount=0.5,
    n=2, dim=0  # Prune 50% of output channels
)

# Global pruning (across layers)
parameters_to_prune = [
    (model.layer1, 'weight'),
    (model.layer2, 'weight'),
]
prune.global_unstructured(
    parameters_to_prune,
    pruning_method=prune.L1Unstructured,
    amount=0.4
)

# Make pruning permanent
for module, name in parameters_to_prune:
    prune.remove(module, name)
```

### Iterative Pruning with Fine-tuning
```python
def iterative_pruning(model, train_loader, target_sparsity=0.9):
    current_sparsity = 0
    sparsity_schedule = [0.5, 0.75, 0.9]

    for target in sparsity_schedule:
        # Prune
        for name, module in model.named_modules():
            if isinstance(module, nn.Linear):
                prune.l1_unstructured(module, 'weight', amount=target)

        # Fine-tune
        for epoch in range(fine_tune_epochs):
            train_epoch(model, train_loader)

        # Measure sparsity
        total_zeros = sum((p == 0).sum().item() for p in model.parameters())
        total_params = sum(p.numel() for p in model.parameters())
        current_sparsity = total_zeros / total_params
        print(f"Sparsity: {current_sparsity:.2%}")

    return model
```

## Knowledge Distillation

```python
class DistillationLoss(nn.Module):
    def __init__(self, temperature=4.0, alpha=0.5):
        super().__init__()
        self.temperature = temperature
        self.alpha = alpha
        self.ce_loss = nn.CrossEntropyLoss()
        self.kl_loss = nn.KLDivLoss(reduction='batchmean')

    def forward(self, student_logits, teacher_logits, labels):
        # Hard label loss
        hard_loss = self.ce_loss(student_logits, labels)

        # Soft label loss (distillation)
        soft_student = F.log_softmax(student_logits / self.temperature, dim=1)
        soft_teacher = F.softmax(teacher_logits / self.temperature, dim=1)
        soft_loss = self.kl_loss(soft_student, soft_teacher) * (self.temperature ** 2)

        return self.alpha * hard_loss + (1 - self.alpha) * soft_loss

# Training loop
teacher.eval()
for batch in train_loader:
    x, y = batch
    with torch.no_grad():
        teacher_logits = teacher(x)
    student_logits = student(x)
    loss = distill_loss(student_logits, teacher_logits, y)
    loss.backward()
    optimizer.step()
```

## Efficient Architectures

### Depth-Separable Convolutions
```python
class DepthSeparableConv(nn.Module):
    def __init__(self, in_channels, out_channels, kernel_size=3):
        super().__init__()
        self.depthwise = nn.Conv2d(
            in_channels, in_channels, kernel_size,
            padding=kernel_size//2, groups=in_channels
        )
        self.pointwise = nn.Conv2d(in_channels, out_channels, 1)

    def forward(self, x):
        x = self.depthwise(x)
        x = self.pointwise(x)
        return x

# Compare params: Regular 3x3 conv with C_in=64, C_out=128
# Regular: 64 * 128 * 3 * 3 = 73,728 params
# DepthSep: 64 * 3 * 3 + 64 * 128 = 576 + 8,192 = 8,768 params (8.4x fewer)
```

### MobileNet Inverted Residual Block
```python
class InvertedResidual(nn.Module):
    def __init__(self, in_ch, out_ch, stride, expand_ratio):
        super().__init__()
        hidden_dim = in_ch * expand_ratio
        self.use_residual = stride == 1 and in_ch == out_ch

        self.conv = nn.Sequential(
            # Expand
            nn.Conv2d(in_ch, hidden_dim, 1, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU6(inplace=True),
            # Depthwise
            nn.Conv2d(hidden_dim, hidden_dim, 3, stride, 1, groups=hidden_dim, bias=False),
            nn.BatchNorm2d(hidden_dim),
            nn.ReLU6(inplace=True),
            # Project
            nn.Conv2d(hidden_dim, out_ch, 1, bias=False),
            nn.BatchNorm2d(out_ch),
        )

    def forward(self, x):
        if self.use_residual:
            return x + self.conv(x)
        return self.conv(x)
```

## Low-Rank Factorization

```python
import torch.nn.utils.parametrize as parametrize

class LowRankLinear(nn.Module):
    def __init__(self, in_features, out_features, rank):
        super().__init__()
        self.A = nn.Linear(in_features, rank, bias=False)
        self.B = nn.Linear(rank, out_features, bias=True)

    def forward(self, x):
        return self.B(self.A(x))

# LoRA-style adaptation
class LoRALayer(nn.Module):
    def __init__(self, original_layer, rank=8, alpha=16):
        super().__init__()
        self.original = original_layer
        self.lora_A = nn.Linear(original_layer.in_features, rank, bias=False)
        self.lora_B = nn.Linear(rank, original_layer.out_features, bias=False)
        self.scaling = alpha / rank

        nn.init.kaiming_uniform_(self.lora_A.weight)
        nn.init.zeros_(self.lora_B.weight)

    def forward(self, x):
        return self.original(x) + self.scaling * self.lora_B(self.lora_A(x))
```

## Efficiency Metrics

```python
def measure_efficiency(model, input_shape, device='cuda'):
    import time

    model = model.to(device)
    model.eval()

    # Model size
    param_size = sum(p.numel() * p.element_size() for p in model.parameters())
    buffer_size = sum(b.numel() * b.element_size() for b in model.buffers())
    size_mb = (param_size + buffer_size) / 1024 / 1024

    # FLOPs (using thop)
    from thop import profile
    dummy_input = torch.randn(1, *input_shape).to(device)
    flops, params = profile(model, inputs=(dummy_input,))

    # Latency
    warmup = 10
    iterations = 100

    for _ in range(warmup):
        model(dummy_input)

    torch.cuda.synchronize()
    start = time.time()
    for _ in range(iterations):
        model(dummy_input)
    torch.cuda.synchronize()
    latency_ms = (time.time() - start) / iterations * 1000

    return {
        "size_mb": size_mb,
        "params": params,
        "flops": flops,
        "latency_ms": latency_ms,
        "throughput": 1000 / latency_ms
    }
```

## Commands
- `/omgoptim:quantize` - Apply quantization
- `/omgoptim:prune` - Apply pruning
- `/omgoptim:distill` - Knowledge distillation
- `/omgoptim:profile` - Profile efficiency

## Best Practices

1. Start with the largest model that works
2. Quantize first (usually free accuracy)
3. Prune iteratively with fine-tuning
4. Use distillation for maximum compression
5. Profile on target hardware
