---
name: vue
description: Vue.js development. Use for Vue 3 projects, Composition API, Pinia.
---

# Vue.js Skill

## Composition API

### Component
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">{{ count }} ({{ doubled }})</button>
</template>
```

### Composable
```typescript
// composables/useUser.ts
export function useUser(id: Ref<string>) {
  const user = ref<User | null>(null);
  const loading = ref(true);

  watch(id, async (newId) => {
    loading.value = true;
    user.value = await fetchUser(newId);
    loading.value = false;
  }, { immediate: true });

  return { user, loading };
}
```

### Pinia Store
```typescript
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);

  async function login(email: string, password: string) {
    user.value = await api.login(email, password);
  }

  return { user, login };
});
```

## Best Practices
- Use Composition API
- Use `<script setup>`
- Create composables for logic
- Use Pinia for state
