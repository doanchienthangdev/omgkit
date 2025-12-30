---
name: guardrails-safety
description: Protecting AI applications - input/output guards, toxicity detection, PII protection, injection defense, constitutional AI. Use when securing AI systems, preventing misuse, or ensuring compliance.
---

# Guardrails & Safety Skill

Protecting AI applications from misuse.

## Input Guardrails

```python
class InputGuard:
    def __init__(self):
        self.toxicity = load_toxicity_model()
        self.pii = PIIDetector()
        self.injection = InjectionDetector()

    def check(self, text):
        result = {"allowed": True, "issues": []}

        # Toxicity
        if self.toxicity.predict(text) > 0.7:
            result["allowed"] = False
            result["issues"].append("toxic")

        # PII
        pii = self.pii.detect(text)
        if pii:
            result["issues"].append(f"pii: {pii}")
            text = self.pii.redact(text)

        # Injection
        if self.injection.detect(text):
            result["allowed"] = False
            result["issues"].append("injection")

        result["sanitized"] = text
        return result
```

## Output Guardrails

```python
class OutputGuard:
    def check(self, output, context=None):
        result = {"allowed": True, "issues": []}

        # Factuality
        if context:
            if self.fact_checker.check(output, context) < 0.7:
                result["issues"].append("hallucination")

        # Toxicity
        if self.toxicity.predict(output) > 0.5:
            result["allowed"] = False
            result["issues"].append("toxic")

        # Citations
        invalid = self.citation_validator.check(output)
        if invalid:
            result["issues"].append(f"bad_citations: {len(invalid)}")

        return result
```

## Injection Detection

```python
class InjectionDetector:
    PATTERNS = [
        r"ignore (previous|all) instructions",
        r"forget (your|all) (instructions|rules)",
        r"you are now",
        r"new persona",
        r"act as",
        r"pretend to be",
        r"disregard",
    ]

    def detect(self, text):
        text_lower = text.lower()
        for pattern in self.PATTERNS:
            if re.search(pattern, text_lower):
                return True
        return False
```

## Constitutional AI

```python
class ConstitutionalFilter:
    def __init__(self, principles):
        self.principles = principles
        self.critic = load_model("critic")
        self.reviser = load_model("reviser")

    def filter(self, response):
        for principle in self.principles:
            critique = self.critic.generate(f"""
            Does this violate: "{principle}"?
            Response: {response}
            """)

            if "violates" in critique.lower():
                response = self.reviser.generate(f"""
                Rewrite to comply with: "{principle}"
                Original: {response}
                Critique: {critique}
                """)

        return response

PRINCIPLES = [
    "Do not provide harmful instructions",
    "Do not reveal personal information",
    "Acknowledge uncertainty",
    "Do not fabricate facts",
]
```

## PII Protection

```python
class PIIDetector:
    PATTERNS = {
        "email": r"\b[\w.-]+@[\w.-]+\.\w+\b",
        "phone": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",
        "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
        "credit_card": r"\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b",
    }

    def detect(self, text):
        found = {}
        for name, pattern in self.PATTERNS.items():
            matches = re.findall(pattern, text)
            if matches:
                found[name] = matches
        return found

    def redact(self, text):
        for name, pattern in self.PATTERNS.items():
            text = re.sub(pattern, f"[{name.upper()}]", text)
        return text
```

## Best Practices

1. Defense in depth (multiple layers)
2. Log all blocked content
3. Regular adversarial testing
4. Update patterns continuously
5. Fail closed (block if uncertain)
