# Vue/Nuxt Trinity Method Example

## Project Profile

- **Frontend**: Vue 3 with Nuxt 3
- **State Management**: Pinia + composables
- **Styling**: Tailwind CSS + Nuxt UI
- **Backend**: Nuxt Server API + Nitro
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Nuxt Auth Utils + OAuth2
- **HTTP**: $fetch + useFetch composable
- **Testing**: Vitest + Vue Test Utils + Playwright
- **Build**: Vite + Nitro
- **Deployment**: Netlify / Vercel / Cloudflare
- **Type Safety**: TypeScript 5+

## Trinity Method Deployment

### Deployment Command

```bash
trinity deploy --name="MyNuxtApp"
```

Or use universal deployment:

```
Initialize Trinity Method for MyNuxtApp Vue 3/Nuxt 3 project. Analyze the Nuxt 3 application structure, identify Vue components and composables, detect Pinia stores and auto-imports, recognize Nuxt server routes and middleware, and generate Trinity Method documentation optimized for modern Vue/Nuxt development.
```

## Generated Trinity Method Documents

### Core Documents
- `CLAUDE.md` - Claude Code configuration and project memory
- `TRINITY.md` - Trinity Method overview for Nuxt

### Knowledge Base (trinity/knowledge-base/)
- `Trinity.md` - Main Trinity Method documentation
- `ARCHITECTURE.md` - Nuxt architecture analysis
- `To-do.md` - Current tasks and work orders
- `ISSUES.md` - Known issues database

### Investigations (trinity/investigations/)
Investigation reports following Vue/Nuxt patterns:
- Component reactivity debugging
- Pinia state debugging
- SSR hydration analysis
- Server route debugging

### Work Orders (trinity/work-orders/)
Example work orders for Nuxt development:
- Component implementation
- Composable creation
- Server API development
- Performance optimization

### Patterns (trinity/patterns/)
Discovered Vue/Nuxt patterns:
- Composable patterns
- Server route patterns
- Middleware patterns
- Plugin patterns

## Framework-Specific Adaptations

### Vue 3 Composable Debugging

**Composable with Trinity Debugging:**
```typescript
// trinity/patterns/composable-debugging.ts
// Vue composable with Trinity debugging

import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export function useUserData() {
  const composableName = 'useUserData';
  const startTime = Date.now();

  console.log('[TRINITY COMPOSABLE]', {
    composable: composableName,
    event: 'Setup',
    timestamp: new Date().toISOString()
  });

  // Reactive state
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const userCount = computed(() => {
    console.log('[TRINITY COMPUTED]', {
      composable: composableName,
      property: 'userCount',
      value: users.value.length
    });
    return users.value.length;
  });

  // Watch with debugging
  watch(users, (newUsers, oldUsers) => {
    console.log('[TRINITY WATCH]', {
      composable: composableName,
      property: 'users',
      oldCount: oldUsers?.length || 0,
      newCount: newUsers.length,
      timestamp: new Date().toISOString()
    });
  });

  watch(loading, (newValue) => {
    console.log('[TRINITY WATCH]', {
      composable: composableName,
      property: 'loading',
      value: newValue,
      timestamp: new Date().toISOString()
    });
  });

  // Async function with debugging
  async function fetchUsers() {
    const actionStart = Date.now();
    loading.value = true;

    console.log('[TRINITY ACTION]', {
      composable: composableName,
      action: 'fetchUsers',
      timestamp: new Date().toISOString()
    });

    try {
      const response = await $fetch<User[]>('/api/users');
      const duration = Date.now() - actionStart;

      users.value = response;
      loading.value = false;

      console.log('[TRINITY ACTION SUCCESS]', {
        composable: composableName,
        action: 'fetchUsers',
        count: response.length,
        duration: `${duration}ms`
      });

      if (duration > 500) {
        console.warn('[TRINITY PERFORMANCE]', {
          composable: composableName,
          action: 'fetchUsers',
          warning: 'Slow fetch',
          duration: `${duration}ms`
        });
      }
    } catch (err: any) {
      const duration = Date.now() - actionStart;

      error.value = err.message;
      loading.value = false;

      console.error('[TRINITY ACTION ERROR]', {
        composable: composableName,
        action: 'fetchUsers',
        error: err.message,
        duration: `${duration}ms`
      });
    }
  }

  // Lifecycle
  onMounted(() => {
    const mountDuration = Date.now() - startTime;

    console.log('[TRINITY LIFECYCLE]', {
      composable: composableName,
      event: 'Mounted',
      setupDuration: `${mountDuration}ms`
    });

    fetchUsers();
  });

  onUnmounted(() => {
    const lifetime = Date.now() - startTime;

    console.log('[TRINITY LIFECYCLE]', {
      composable: composableName,
      event: 'Unmounted',
      lifetime: `${lifetime}ms`
    });
  });

  return {
    users,
    loading,
    error,
    userCount,
    fetchUsers
  };
}
```

### Vue Component Debugging

**Component with Trinity Debugging:**
```vue
<!-- trinity/patterns/component-debugging.vue -->
<!-- Vue component with Trinity debugging -->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const componentName = 'UserList';
const mountTime = Date.now();
const renderCount = ref(0);

console.log('[TRINITY COMPONENT]', {
  component: componentName,
  event: 'Setup',
  timestamp: new Date().toISOString()
});

// Use composable
const { users, loading, error, fetchUsers } = useUserData();

// Track renders
watch(() => users.value, () => {
  renderCount.value++;

  console.log('[TRINITY RENDER]', {
    component: componentName,
    renderCount: renderCount.value,
    timeSinceMount: `${Date.now() - mountTime}ms`,
    userCount: users.value.length
  });

  // Warn on excessive renders
  if (renderCount.value > 20) {
    console.warn('[TRINITY PERFORMANCE]', {
      component: componentName,
      warning: 'Excessive re-renders',
      count: renderCount.value
    });
  }
}, { deep: true });

// Handle action
async function handleCreateUser() {
  const actionStart = Date.now();

  console.log('[TRINITY ACTION]', {
    component: componentName,
    action: 'createUser',
    timestamp: new Date().toISOString()
  });

  try {
    await createUser({ name: 'New User', email: 'new@example.com' });
    const duration = Date.now() - actionStart;

    console.log('[TRINITY ACTION SUCCESS]', {
      component: componentName,
      action: 'createUser',
      duration: `${duration}ms`
    });

    await fetchUsers();
  } catch (err: any) {
    const duration = Date.now() - actionStart;

    console.error('[TRINITY ACTION ERROR]', {
      component: componentName,
      action: 'createUser',
      error: err.message,
      duration: `${duration}ms`
    });
  }
}

onMounted(async () => {
  console.log('[TRINITY LIFECYCLE]', {
    component: componentName,
    event: 'Mounted',
    timeSinceSetup: `${Date.now() - mountTime}ms`
  });

  await nextTick();

  console.log('[TRINITY LIFECYCLE]', {
    component: componentName,
    event: 'DOM Updated',
    timeSinceMount: `${Date.now() - mountTime}ms`
  });
});

onBeforeUnmount(() => {
  const lifetime = Date.now() - mountTime;

  console.log('[TRINITY LIFECYCLE]', {
    component: componentName,
    event: 'BeforeUnmount',
    lifetime: `${lifetime}ms`,
    totalRenders: renderCount.value
  });
});
</script>

<template>
  <div class="user-list">
    <h2>Users ({{ users.length }})</h2>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>

    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-item">
        {{ user.name }}
      </div>
    </div>

    <button @click="handleCreateUser">Create User</button>
  </div>
</template>
```

### Nuxt Server API Debugging

**Server Route with Trinity Debugging:**
```typescript
// trinity/patterns/server-route-debugging.ts
// Nuxt server route with Trinity debugging

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  const method = event.method;
  const path = event.path;

  console.log('[TRINITY SERVER]', {
    requestId,
    method,
    path,
    headers: getHeaders(event),
    timestamp: new Date().toISOString()
  });

  try {
    // Parse body if POST/PUT
    let body = null;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await readBody(event);

      console.log('[TRINITY SERVER]', {
        requestId,
        event: 'Body parsed',
        bodySize: JSON.stringify(body).length
      });
    }

    // Parse query
    const query = getQuery(event);
    if (Object.keys(query).length > 0) {
      console.log('[TRINITY SERVER]', {
        requestId,
        event: 'Query parsed',
        query
      });
    }

    // Authentication check
    const session = await requireUserSession(event);

    console.log('[TRINITY SERVER AUTH]', {
      requestId,
      userId: session.user.id,
      authenticated: true
    });

    // Business logic
    const dbStart = Date.now();
    const users = await db.select().from(usersTable);
    const dbDuration = Date.now() - dbStart;

    console.log('[TRINITY SERVER DB]', {
      requestId,
      operation: 'select users',
      count: users.length,
      duration: `${dbDuration}ms`
    });

    if (dbDuration > 100) {
      console.warn('[TRINITY SERVER SLOW DB]', {
        requestId,
        duration: `${dbDuration}ms`,
        threshold: '100ms'
      });
    }

    // Success response
    const totalDuration = Date.now() - startTime;

    console.log('[TRINITY SERVER SUCCESS]', {
      requestId,
      status: 200,
      duration: `${totalDuration}ms`,
      resultCount: users.length
    });

    if (totalDuration > 500) {
      console.warn('[TRINITY SERVER SLOW]', {
        requestId,
        path,
        duration: `${totalDuration}ms`,
        threshold: '500ms'
      });
    }

    return {
      users,
      meta: {
        requestId,
        duration: totalDuration
      }
    };

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;

    console.error('[TRINITY SERVER ERROR]', {
      requestId,
      method,
      path,
      error: error.message,
      stack: error.stack,
      duration: `${totalDuration}ms`
    });

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message
    });
  }
});
```

### Nuxt Middleware Debugging

**Middleware with Trinity Debugging:**
```typescript
// trinity/patterns/middleware-debugging.ts
// Nuxt middleware with Trinity debugging

export default defineNuxtRouteMiddleware((to, from) => {
  const middlewareName = 'auth';
  const startTime = Date.now();

  console.log('[TRINITY MIDDLEWARE]', {
    middleware: middlewareName,
    from: from.path,
    to: to.path,
    timestamp: new Date().toISOString()
  });

  // Check authentication
  const { status, data } = useAuth();

  if (status.value !== 'authenticated') {
    const duration = Date.now() - startTime;

    console.warn('[TRINITY MIDDLEWARE]', {
      middleware: middlewareName,
      result: 'REDIRECT',
      reason: 'Not authenticated',
      from: from.path,
      to: '/login',
      duration: `${duration}ms`
    });

    return navigateTo('/login');
  }

  // Check permissions
  const requiredRole = to.meta.role as string | undefined;
  if (requiredRole && !data.value?.user?.roles?.includes(requiredRole)) {
    const duration = Date.now() - startTime;

    console.warn('[TRINITY MIDDLEWARE]', {
      middleware: middlewareName,
      result: 'REDIRECT',
      reason: 'Insufficient permissions',
      requiredRole,
      userRoles: data.value?.user?.roles,
      to: '/unauthorized',
      duration: `${duration}ms`
    });

    return navigateTo('/unauthorized');
  }

  const duration = Date.now() - startTime;

  console.log('[TRINITY MIDDLEWARE]', {
    middleware: middlewareName,
    result: 'ALLOWED',
    user: data.value?.user?.id,
    duration: `${duration}ms`
  });
});
```

### Pinia Store Debugging

**Store with Trinity Debugging:**
```typescript
// trinity/patterns/pinia-store-debugging.ts
// Pinia store with Trinity debugging

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('users', () => {
  const storeName = 'userStore';

  console.log('[TRINITY STORE]', {
    store: storeName,
    event: 'Initialized',
    timestamp: new Date().toISOString()
  });

  // State
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const userCount = computed(() => {
    console.log('[TRINITY STORE GETTER]', {
      store: storeName,
      getter: 'userCount',
      value: users.value.length
    });
    return users.value.length;
  });

  const activeUsers = computed(() => {
    const active = users.value.filter(u => u.active);

    console.log('[TRINITY STORE GETTER]', {
      store: storeName,
      getter: 'activeUsers',
      total: users.value.length,
      active: active.length
    });

    return active;
  });

  // Actions
  async function fetchUsers() {
    const actionStart = Date.now();
    loading.value = true;

    console.log('[TRINITY STORE ACTION]', {
      store: storeName,
      action: 'fetchUsers',
      timestamp: new Date().toISOString()
    });

    try {
      const response = await $fetch<User[]>('/api/users');
      const duration = Date.now() - actionStart;

      users.value = response;
      loading.value = false;

      console.log('[TRINITY STORE ACTION SUCCESS]', {
        store: storeName,
        action: 'fetchUsers',
        count: response.length,
        duration: `${duration}ms`
      });

      if (duration > 500) {
        console.warn('[TRINITY STORE SLOW ACTION]', {
          store: storeName,
          action: 'fetchUsers',
          duration: `${duration}ms`,
          threshold: '500ms'
        });
      }
    } catch (err: any) {
      const duration = Date.now() - actionStart;

      error.value = err.message;
      loading.value = false;

      console.error('[TRINITY STORE ACTION ERROR]', {
        store: storeName,
        action: 'fetchUsers',
        error: err.message,
        duration: `${duration}ms`
      });

      throw err;
    }
  }

  async function createUser(userData: CreateUserDto) {
    const actionStart = Date.now();

    console.log('[TRINITY STORE ACTION]', {
      store: storeName,
      action: 'createUser',
      data: userData
    });

    try {
      const newUser = await $fetch<User>('/api/users', {
        method: 'POST',
        body: userData
      });

      const duration = Date.now() - actionStart;

      users.value.push(newUser);

      console.log('[TRINITY STORE ACTION SUCCESS]', {
        store: storeName,
        action: 'createUser',
        userId: newUser.id,
        duration: `${duration}ms`
      });

      return newUser;
    } catch (err: any) {
      const duration = Date.now() - actionStart;

      console.error('[TRINITY STORE ACTION ERROR]', {
        store: storeName,
        action: 'createUser',
        error: err.message,
        duration: `${duration}ms`
      });

      throw err;
    }
  }

  // Subscribe to changes
  if (process.client) {
    watch(users, (newUsers, oldUsers) => {
      console.log('[TRINITY STORE MUTATION]', {
        store: storeName,
        state: 'users',
        oldCount: oldUsers?.length || 0,
        newCount: newUsers.length,
        timestamp: new Date().toISOString()
      });
    });
  }

  return {
    users,
    loading,
    error,
    userCount,
    activeUsers,
    fetchUsers,
    createUser
  };
});
```

### Nuxt Plugin Debugging

**Plugin with Trinity Debugging:**
```typescript
// trinity/patterns/plugin-debugging.ts
// Nuxt plugin with Trinity debugging

export default defineNuxtPlugin((nuxtApp) => {
  const pluginName = 'trinityLogger';
  const startTime = Date.now();

  console.log('[TRINITY PLUGIN]', {
    plugin: pluginName,
    event: 'Initializing',
    timestamp: new Date().toISOString()
  });

  // Hook into app lifecycle
  nuxtApp.hook('app:created', () => {
    console.log('[TRINITY PLUGIN HOOK]', {
      plugin: pluginName,
      hook: 'app:created'
    });
  });

  nuxtApp.hook('page:start', () => {
    console.log('[TRINITY PLUGIN HOOK]', {
      plugin: pluginName,
      hook: 'page:start',
      timestamp: new Date().toISOString()
    });
  });

  nuxtApp.hook('page:finish', () => {
    console.log('[TRINITY PLUGIN HOOK]', {
      plugin: pluginName,
      hook: 'page:finish',
      timestamp: new Date().toISOString()
    });
  });

  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('[TRINITY PLUGIN ERROR]', {
      plugin: pluginName,
      hook: 'vue:error',
      error: error.message,
      component: instance?.$options.name,
      info
    });
  });

  const initDuration = Date.now() - startTime;

  console.log('[TRINITY PLUGIN]', {
    plugin: pluginName,
    event: 'Initialized',
    duration: `${initDuration}ms`
  });

  return {
    provide: {
      trinityLog: (message: string, data?: any) => {
        console.log('[TRINITY APP]', {
          message,
          data,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
});
```

## Investigation Templates

### Nuxt SSR Investigation

```markdown
# Nuxt SSR/Hydration Investigation

## Symptoms
- Hydration mismatch errors
- Flash of unstyled content
- Different client/server rendering

## Investigation Steps

### 1. Identify Hydration Issues
- [ ] Check browser console for hydration errors
- [ ] Identify affected components
- [ ] Review client-only code
- [ ] Check window/document usage

### 2. Server vs Client Differences
- [ ] Compare SSR HTML with client HTML
- [ ] Check for random values or timestamps
- [ ] Review localStorage/sessionStorage usage
- [ ] Verify API call consistency

### 3. Debugging Commands
```bash
# Enable Nuxt debug mode
NUXT_DEBUG=1 npm run dev

# Check SSR output
curl http://localhost:3000 > server.html

# Compare with client rendering
```

### 4. Common Causes
- [ ] Browser-only APIs in setup()
- [ ] Date/time rendering differences
- [ ] Random value generation
- [ ] localStorage in SSR context
- [ ] window object usage

## Solutions
1. Use ClientOnly component
2. Move client code to onMounted
3. Use import.meta.client guard
4. Implement isomorphic logic
```

### Nuxt Performance Investigation

```markdown
# Nuxt Performance Investigation

## Current Metrics

### Server-Side
- SSR time: [X]ms (target: <200ms)
- Server route time: [X]ms (target: <100ms)
- Database queries: [X] per request

### Client-Side
- Hydration time: [X]ms (target: <300ms)
- Time to Interactive: [X]ms (target: <2s)
- Bundle size: [X]KB (target: <500KB)

## Investigation Steps

### 1. SSR Performance
- [ ] Profile server routes
- [ ] Check database query count
- [ ] Review API call patterns
- [ ] Analyze payload size

### 2. Client Performance
- [ ] Analyze bundle size
- [ ] Check code splitting
- [ ] Review lazy loading
- [ ] Profile component rendering

### 3. Nitro Optimization
- [ ] Review route caching
- [ ] Check prerendering
- [ ] Analyze middleware overhead
- [ ] Review server imports

## Optimization Opportunities
1. [Specific optimization]
2. [Specific optimization]
```

## Performance Baselines

### Nuxt Performance Targets

```typescript
const performanceTargets = {
  // Server-side
  ssr: {
    renderTime: '<200ms',
    serverRouteTime: '<100ms',
    databaseQueries: '<5 per request',
    payloadSize: '<100KB'
  },

  // Client-side
  client: {
    hydrationTime: '<300ms',
    timeToInteractive: '<2s',
    bundleSize: '<500KB gzipped',
    chunkSize: '<200KB gzipped'
  },

  // Build
  build: {
    devServerStart: '<3s',
    prodBuild: '<30s',
    prerender: 'enabled for static pages'
  },

  // Runtime
  runtime: {
    memoryUsage: '<100MB',
    apiLatency: '<200ms',
    composableOverhead: '<5ms'
  }
};
```

## Testing Strategies

### Vitest Component Testing

```typescript
// user-list.spec.ts
// Trinity Method Nuxt testing

import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UserList from '~/components/UserList.vue';

describe('UserList Component', () => {
  beforeEach(() => {
    console.log('[TRINITY TEST] Setting up UserList test');
  });

  it('should render users', async () => {
    console.log('[TRINITY TEST] Testing user list rendering');

    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@test.com' },
      { id: '2', name: 'User 2', email: 'user2@test.com' }
    ];

    const wrapper = mount(UserList, {
      props: {
        users: mockUsers
      }
    });

    expect(wrapper.findAll('.user-item')).toHaveLength(2);
    expect(wrapper.text()).toContain('User 1');

    console.log('[TRINITY TEST] Render test passed');
  });

  it('should handle user creation', async () => {
    console.log('[TRINITY TEST] Testing user creation');

    const createUser = vi.fn();
    const wrapper = mount(UserList, {
      props: {
        users: [],
        onCreate: createUser
      }
    });

    await wrapper.find('[data-test="create-btn"]').trigger('click');

    expect(createUser).toHaveBeenCalled();

    console.log('[TRINITY TEST] User creation test passed');
  });
});
```

### Playwright E2E Testing

```typescript
// user-list.e2e.ts
// Trinity Method E2E testing

import { test, expect } from '@playwright/test';

test.describe('User List E2E', () => {
  test.beforeEach(async ({ page }) => {
    console.log('[TRINITY E2E] Starting user list test');
    await page.goto('/users');
  });

  test('should display user list', async ({ page }) => {
    console.log('[TRINITY E2E] Testing user list display');

    await expect(page.locator('.user-list')).toBeVisible();
    await expect(page.locator('.user-item')).toHaveCount(2);

    console.log('[TRINITY E2E] User list display test passed');
  });

  test('should handle user creation', async ({ page }) => {
    console.log('[TRINITY E2E] Testing user creation');

    await page.click('[data-test="create-user-btn"]');
    await page.fill('[data-test="user-name"]', 'New User');
    await page.fill('[data-test="user-email"]', 'new@test.com');
    await page.click('[data-test="submit-btn"]');

    await expect(page.locator('text=User created')).toBeVisible();

    console.log('[TRINITY E2E] User creation test passed');
  });
});
```

## Crisis Recovery Procedures

### Common Nuxt Emergency Scenarios

```markdown
## 1. SSR Hydration Errors

**Symptoms:**
- Hydration mismatch warnings
- Content flickering
- Client/server mismatch

**Immediate Actions:**
```typescript
// Wrap client-only code
<ClientOnly>
  <BrowserOnlyComponent />
</ClientOnly>

// Or use import.meta.client
if (import.meta.client) {
  // Client-only code
}
```

**Prevention:**
- Avoid window/document in setup()
- Use onMounted for client-only code
- Implement isomorphic solutions
- Test SSR thoroughly

## 2. Nitro Server Crashes

**Symptoms:**
- 500 server errors
- Server route failures
- Database connection errors

**Immediate Actions:**
```bash
# Check server logs
npx nuxi dev --debug

# Restart server
pm2 restart nuxt-app

# Check database connection
psql -h localhost -U user -d database
```

**Investigation:**
- Review error logs
- Check database connection pool
- Verify environment variables
- Test server routes independently

## 3. Memory Leaks

**Symptoms:**
- Increasing memory usage
- Slow performance
- Server crashes

**Immediate Actions:**
```bash
# Profile memory
node --inspect node_modules/nuxi/bin/nuxi.mjs dev

# Monitor memory
watch -n 1 'ps aux | grep node'
```

**Investigation:**
- Check for unclosed watchers
- Review composable cleanup
- Analyze server route handlers
- Monitor database connections

## 4. Build Failures

**Symptoms:**
- Production build errors
- Type errors
- Module resolution failures

**Immediate Actions:**
```bash
# Clear cache
rm -rf .nuxt .output node_modules
npm install

# Debug build
npx nuxi build --debug

# Check logs
npx nuxi analyze
```

**Investigation:**
- Review TypeScript errors
- Check module imports
- Verify Nuxt config
- Test incremental builds
```

## Quality Gates

### Nuxt-Specific Quality Checks

```typescript
// Pre-commit quality gates
const qualityGates = {
  // Type checking
  typeCheck: 'nuxi typecheck',

  // Linting
  linting: 'eslint .',

  // Testing
  unitTests: 'vitest run --coverage',
  e2eTests: 'playwright test',

  // Coverage
  coverage: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  },

  // Build verification
  buildCheck: 'nuxi build',

  // Bundle analysis
  bundleAnalysis: 'nuxi analyze'
};
```

## Deployment Notes

This example demonstrates Trinity Method patterns for:
- Vue 3 Composition API debugging
- Nuxt 3 server routes monitoring
- Pinia store debugging
- SSR/hydration debugging
- Middleware authentication tracking
- Composable performance monitoring
- Vitest testing strategies
- Playwright E2E testing
- Production crisis recovery

Use `/trinity-init` after deployment to activate all agents and begin Nuxt development with full Trinity Method support.
