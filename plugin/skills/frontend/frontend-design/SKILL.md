---
name: designing-frontend-patterns
description: Claude designs scalable React component architectures using compound components, custom hooks, and state machines. Use when building reusable UI systems or complex component APIs.
---

# Designing Frontend Patterns

## Quick Start

```tsx
// Compound component pattern with context
const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({ children, value, onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, value, onValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;
```

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Compound Components | Shared state via context for flexible component APIs | `ref/compound-components.md` |
| Custom Hooks | Encapsulate reusable logic (useDebounce, useLocalStorage) | `ref/custom-hooks.md` |
| Render Props | Maximum flexibility for data fetching and rendering | `ref/render-props.md` |
| State Machines | Predictable state transitions for complex flows | `ref/state-machines.md` |
| HOCs | Cross-cutting concerns (auth, error boundaries) | `ref/higher-order-components.md` |
| Optimistic UI | Instant feedback with rollback on failure | `ref/optimistic-updates.md` |

## Common Patterns

### Custom Hook with Cleanup

```tsx
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(stored));
  }, [key, stored]);

  return [stored, setStored] as const;
}
```

### State Machine Pattern

```tsx
type FormState = 'idle' | 'validating' | 'submitting' | 'success' | 'error';
type FormEvent =
  | { type: 'SUBMIT'; data: FormData }
  | { type: 'SUCCESS'; response: any }
  | { type: 'ERROR'; error: string };

function useFormMachine() {
  const [state, setState] = useState<FormState>('idle');
  const [context, setContext] = useState({ data: null, error: null });

  const send = useCallback((event: FormEvent) => {
    switch (state) {
      case 'idle':
        if (event.type === 'SUBMIT') { setState('validating'); }
        break;
      case 'submitting':
        if (event.type === 'SUCCESS') { setState('success'); }
        if (event.type === 'ERROR') { setState('error'); setContext(c => ({ ...c, error: event.error })); }
        break;
    }
  }, [state]);

  return { state, context, send };
}
```

### Optimistic Update Hook

```tsx
export function useOptimistic<T>(initialData: T, reducer: (state: T, action: any) => T) {
  const [state, setState] = useState({ data: initialData, pending: false, error: null });
  const previousRef = useRef(initialData);

  const optimisticUpdate = useCallback(async (action: any, asyncOp: () => Promise<T>) => {
    previousRef.current = state.data;
    setState({ data: reducer(state.data, action), pending: true, error: null });

    try {
      const result = await asyncOp();
      setState({ data: result, pending: false, error: null });
    } catch (error) {
      setState({ data: previousRef.current, pending: false, error: error as Error });
    }
  }, [state.data, reducer]);

  return { ...state, optimisticUpdate };
}
```

## Best Practices

| Do | Avoid |
|----|-------|
| Use compound components for complex UI with shared state | Overusing HOCs (prefer hooks) |
| Create custom hooks to encapsulate reusable logic | Mutating state directly |
| Implement state machines for complex state transitions | Deeply nested component hierarchies |
| Use TypeScript for type-safe component APIs | Passing too many props (use context/composition) |
| Use forwardRef for component library primitives | Creating components with side effects in render |
| Keep components focused with single responsibility | Prop drilling for deeply nested data |
