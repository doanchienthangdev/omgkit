---
name: profiling-performance
description: Performs browser performance profiling with Lighthouse, Core Web Vitals, and DevTools analysis. Use when auditing page performance, optimizing Core Web Vitals, analyzing bundle sizes, or implementing performance budgets.
category: devops
triggers:
  - performance
  - lighthouse
  - core web vitals
  - bundle size
  - profiling
---

# Profiling Performance

## Quick Start

```typescript
// Run Lighthouse audit
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function audit(url: string) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const result = await lighthouse(url, { port: chrome.port, onlyCategories: ['performance'] });
  await chrome.kill();
  return result?.lhr;
}
```

```bash
# CLI audit
npx lighthouse https://example.com --output=json --output-path=./report.json
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Lighthouse Audits | Automated performance scoring | Run in CI/CD, track scores over time |
| Core Web Vitals | LCP, FID, CLS, INP metrics | Monitor with web-vitals library |
| Bundle Analysis | JavaScript bundle size inspection | Use webpack-bundle-analyzer or rollup-plugin-visualizer |
| Network Waterfall | Request timing and blocking analysis | Identify render-blocking resources |
| Memory Profiling | Heap snapshots and leak detection | Compare snapshots before/after operations |
| Performance Budgets | Automated regression prevention | Set thresholds in CI pipeline |

## Common Patterns

### Core Web Vitals Monitoring

```typescript
import { onLCP, onFID, onCLS, onINP } from 'web-vitals';

function sendToAnalytics(metric: { name: string; value: number; rating: string }) {
  analytics.track('web_vital', metric);
}

onLCP(sendToAnalytics);  // Target: < 2.5s
onFID(sendToAnalytics);  // Target: < 100ms
onCLS(sendToAnalytics);  // Target: < 0.1
onINP(sendToAnalytics);  // Target: < 200ms
```

### Performance Budget Check

```typescript
const BUDGET = {
  lcp: 2500, fid: 100, cls: 0.1, tti: 3800, tbt: 200,
  jsSize: 300 * 1024, cssSize: 50 * 1024, totalSize: 1000 * 1024,
};

function checkBudget(metrics: Record<string, number>) {
  const violations = Object.entries(BUDGET)
    .filter(([key, limit]) => metrics[key] > limit)
    .map(([key, limit]) => ({ metric: key, limit, actual: metrics[key] }));
  return { passed: violations.length === 0, violations };
}
```

### CI/CD Integration

```yaml
# .github/workflows/performance.yml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: http://localhost:3000
    budgetPath: ./performance-budget.json
    uploadArtifacts: true
```

## Best Practices

| Do | Avoid |
|----|-------|
| Test with throttled network and CPU | Testing only on fast connections |
| Monitor real user metrics (RUM) | Relying solely on synthetic tests |
| Set and enforce performance budgets | Optimizing without baseline data |
| Preload LCP images with fetchpriority | Ignoring mobile performance |
| Lazy load below-fold content | Loading all JS upfront |
| Use modern image formats (WebP, AVIF) | Ignoring third-party script impact |
| Profile before and after changes | Skipping cumulative layout shift fixes |
