---
name: responsive
description: Responsive design. Use for mobile-first, adaptive layouts.
---

# Responsive Design Skill

## Breakpoints
```css
/* Mobile first */
.element { /* Mobile styles */ }

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## Patterns

### Fluid Typography
```css
font-size: clamp(1rem, 2.5vw, 2rem);
```

### Responsive Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

### Container Queries
```css
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

## Best Practices
- Mobile-first approach
- Use relative units
- Test on real devices
- Consider touch targets (44px min)
