---
name: react
description: React development. Use for React components, hooks, state management.
---

# React Skill

## Patterns

### Functional Component
```tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### Hooks
```tsx
// useState
const [count, setCount] = useState(0);

// useEffect
useEffect(() => {
  fetchData();
  return () => cleanup();
}, [dependency]);

// useCallback
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// useMemo
const computed = useMemo(() => expensiveCalc(data), [data]);
```

### Custom Hook
```tsx
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false));
  }, [id]);

  return { user, loading };
}
```

## Best Practices
- Use functional components
- Keep components small
- Lift state up when needed
- Use custom hooks for logic
- Memoize expensive operations
