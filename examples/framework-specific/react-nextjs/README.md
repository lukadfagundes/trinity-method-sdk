# React + Next.js Trinity Method Examples

Comprehensive Trinity Method debugging patterns for React 18 and Next.js 14 with the App Router.

## Table of Contents
1. [Framework Overview](#framework-overview)
2. [Server Components](#server-components)
3. [Client Components](#client-components)
4. [Server Actions](#server-actions)
5. [API Routes](#api-routes)
6. [State Management](#state-management)
7. [Data Fetching](#data-fetching)
8. [Performance Optimization](#performance-optimization)
9. [Investigation Templates](#investigation-templates)
10. [Testing Strategies](#testing-strategies)
11. [Crisis Recovery](#crisis-recovery)

---

## Framework Overview

### Technology Stack
- **React**: 18.2+ (Server Components, Suspense, Transitions)
- **Next.js**: 14+ (App Router, Server Actions, Route Handlers)
- **State Management**: Zustand (recommended) or Context API
- **Data Fetching**: Native fetch with caching, TanStack Query
- **Styling**: Tailwind CSS, CSS Modules, or styled-components
- **Database**: Prisma ORM with PostgreSQL
- **Deployment**: Vercel (recommended) or self-hosted

### Key Concepts
- **Server Components (RSC)**: Default in App Router, run on server
- **Client Components**: Marked with `'use client'`, run in browser
- **Server Actions**: Server-side mutations with `'use server'`
- **Streaming**: Progressive rendering with Suspense
- **Caching**: Automatic fetch caching, request memoization

---

## Server Components

### Basic Server Component with Trinity Logging

```typescript
// app/dashboard/page.tsx
import { getUserData, getRecentActivity } from '@/lib/api';

export default async function DashboardPage() {
  const componentName = 'DashboardPage';
  const startTime = Date.now();

  console.log('[TRINITY SERVER COMPONENT]', {
    component: componentName,
    event: 'Render Start',
    timestamp: new Date().toISOString(),
    route: '/dashboard'
  });

  try {
    // Parallel data fetching
    const dataStart = Date.now();
    const [userData, activity] = await Promise.all([
      getUserData(),
      getRecentActivity()
    ]);
    const dataDuration = Date.now() - dataStart;

    console.log('[TRINITY DATA FETCH]', {
      component: componentName,
      sources: ['getUserData', 'getRecentActivity'],
      duration: `${dataDuration}ms`,
      userDataSize: JSON.stringify(userData).length,
      activityCount: activity.length
    });

    if (dataDuration > 1000) {
      console.warn('[TRINITY PERFORMANCE]', {
        component: componentName,
        warning: 'Slow data fetching',
        duration: `${dataDuration}ms`,
        threshold: '1000ms'
      });
    }

    const renderDuration = Date.now() - startTime;

    console.log('[TRINITY SERVER COMPONENT]', {
      component: componentName,
      event: 'Render Complete',
      totalDuration: `${renderDuration}ms`
    });

    return (
      <div className="dashboard">
        <UserProfile user={userData} />
        <ActivityFeed activities={activity} />
      </div>
    );

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY SERVER COMPONENT ERROR]', {
      component: componentName,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });

    throw error; // Let error boundary handle it
  }
}
```

### Server Component with Streaming

```typescript
// app/products/page.tsx
import { Suspense } from 'react';
import { getProducts, getFeaturedProducts } from '@/lib/api';

async function ProductList() {
  const componentName = 'ProductList';
  const startTime = Date.now();

  console.log('[TRINITY ASYNC COMPONENT]', {
    component: componentName,
    event: 'Fetch Start',
    timestamp: new Date().toISOString()
  });

  const products = await getProducts();
  const duration = Date.now() - startTime;

  console.log('[TRINITY ASYNC COMPONENT]', {
    component: componentName,
    event: 'Fetch Complete',
    productsCount: products.length,
    duration: `${duration}ms`
  });

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function FeaturedProducts() {
  const componentName = 'FeaturedProducts';
  const startTime = Date.now();

  console.log('[TRINITY ASYNC COMPONENT]', {
    component: componentName,
    event: 'Fetch Start',
    timestamp: new Date().toISOString()
  });

  const featured = await getFeaturedProducts();
  const duration = Date.now() - startTime;

  console.log('[TRINITY ASYNC COMPONENT]', {
    component: componentName,
    event: 'Fetch Complete',
    featuredCount: featured.length,
    duration: `${duration}ms`
  });

  return (
    <div className="featured-carousel">
      {featured.map(product => (
        <FeaturedCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  console.log('[TRINITY SERVER COMPONENT]', {
    component: 'ProductsPage',
    event: 'Initial Render',
    streaming: true,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="products-page">
      <h1>Products</h1>

      {/* Featured products load immediately */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />
      </Suspense>

      {/* Product list streams in after */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  );
}
```

---

## Client Components

### Interactive Component with Trinity Logging

```typescript
'use client';

import { useState, useEffect, useTransition } from 'react';

export default function ProductFilter({ products }) {
  const componentName = 'ProductFilter';
  const [filter, setFilter] = useState('all');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.log('[TRINITY COMPONENT]', {
      component: componentName,
      event: 'Mount',
      productsCount: products.length,
      timestamp: new Date().toISOString()
    });

    return () => {
      console.log('[TRINITY COMPONENT]', {
        component: componentName,
        event: 'Unmount',
        timestamp: new Date().toISOString()
      });
    };
  }, []);

  useEffect(() => {
    console.log('[TRINITY STATE]', {
      component: componentName,
      event: 'Filter Changed',
      oldFilter: filter,
      newFilter: filter,
      isPending,
      timestamp: new Date().toISOString()
    });
  }, [filter]);

  const handleFilterChange = (newFilter: string) => {
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: componentName,
      action: 'changeFilter',
      from: filter,
      to: newFilter,
      timestamp: new Date().toISOString()
    });

    startTransition(() => {
      setFilter(newFilter);
      const duration = Date.now() - startTime;

      console.log('[TRINITY ACTION SUCCESS]', {
        component: componentName,
        action: 'changeFilter',
        duration: `${duration}ms`,
        isPending
      });

      if (duration > 100) {
        console.warn('[TRINITY PERFORMANCE]', {
          component: componentName,
          action: 'changeFilter',
          warning: 'Slow state transition',
          duration: `${duration}ms`,
          threshold: '100ms'
        });
      }
    });
  };

  const filteredProducts = products.filter(p =>
    filter === 'all' ? true : p.category === filter
  );

  return (
    <div className="product-filter">
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('all')}>All</button>
        <button onClick={() => handleFilterChange('electronics')}>Electronics</button>
        <button onClick={() => handleFilterChange('clothing')}>Clothing</button>
      </div>

      <div className={isPending ? 'opacity-50' : ''}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Form Component with Validation

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

type FormData = z.infer<typeof formSchema>;

export default function SignupForm() {
  const componentName = 'SignupForm';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    const actionName = 'submitSignup';
    const startTime = Date.now();
    setIsSubmitting(true);

    console.log('[TRINITY FORM]', {
      component: componentName,
      action: actionName,
      data: { ...data, password: '[REDACTED]' },
      timestamp: new Date().toISOString()
    });

    try {
      // Validate
      const validationStart = Date.now();
      const validated = formSchema.parse(data);
      const validationDuration = Date.now() - validationStart;

      console.log('[TRINITY VALIDATION]', {
        component: componentName,
        action: actionName,
        duration: `${validationDuration}ms`,
        isValid: true
      });

      // Submit to API
      const apiStart = Date.now();
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated)
      });

      const result = await response.json();
      const apiDuration = Date.now() - apiStart;

      console.log('[TRINITY API CALL]', {
        component: componentName,
        action: actionName,
        endpoint: '/api/auth/signup',
        status: response.status,
        duration: `${apiDuration}ms`
      });

      if (!response.ok) {
        console.error('[TRINITY API ERROR]', {
          component: componentName,
          action: actionName,
          status: response.status,
          error: result.error
        });

        throw new Error(result.error || 'Signup failed');
      }

      const totalDuration = Date.now() - startTime;

      console.log('[TRINITY FORM SUCCESS]', {
        component: componentName,
        action: actionName,
        userId: result.userId,
        totalDuration: `${totalDuration}ms`
      });

      if (totalDuration > 2000) {
        console.warn('[TRINITY PERFORMANCE]', {
          component: componentName,
          action: actionName,
          warning: 'Slow form submission',
          duration: `${totalDuration}ms`,
          threshold: '2000ms'
        });
      }

      // Redirect or show success
      window.location.href = '/dashboard';

    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('[TRINITY FORM ERROR]', {
        component: componentName,
        action: actionName,
        error: error.message,
        duration: `${duration}ms`
      });

      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
      <div>
        <label htmlFor="name">Name</label>
        <input {...register('name')} id="name" />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input {...register('email')} id="email" type="email" />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input {...register('password')} id="password" type="password" />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign up'}
      </button>
    </form>
  );
}
```

---

## Server Actions

### Form Submission with Server Action

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function createPost(formData: FormData) {
  const actionName = 'createPost';
  const startTime = Date.now();

  console.log('[TRINITY SERVER ACTION]', {
    action: actionName,
    timestamp: new Date().toISOString()
  });

  try {
    // Extract and validate form data
    const validationStart = Date.now();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || title.length < 3) {
      console.warn('[TRINITY VALIDATION]', {
        action: actionName,
        field: 'title',
        error: 'Title must be at least 3 characters'
      });

      return { error: 'Title must be at least 3 characters' };
    }

    if (!content || content.length < 10) {
      console.warn('[TRINITY VALIDATION]', {
        action: actionName,
        field: 'content',
        error: 'Content must be at least 10 characters'
      });

      return { error: 'Content must be at least 10 characters' };
    }

    const validationDuration = Date.now() - validationStart;

    console.log('[TRINITY VALIDATION]', {
      action: actionName,
      duration: `${validationDuration}ms`,
      isValid: true
    });

    // Create post in database
    const dbStart = Date.now();
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 'user-123' // Get from session
      }
    });
    const dbDuration = Date.now() - dbStart;

    console.log('[TRINITY DATABASE]', {
      action: actionName,
      operation: 'create',
      table: 'posts',
      postId: post.id,
      duration: `${dbDuration}ms`
    });

    // Revalidate the posts page
    const revalidateStart = Date.now();
    revalidatePath('/posts');
    const revalidateDuration = Date.now() - revalidateStart;

    console.log('[TRINITY REVALIDATE]', {
      action: actionName,
      path: '/posts',
      duration: `${revalidateDuration}ms`
    });

    const totalDuration = Date.now() - startTime;

    console.log('[TRINITY SERVER ACTION SUCCESS]', {
      action: actionName,
      postId: post.id,
      totalDuration: `${totalDuration}ms`
    });

    if (totalDuration > 1000) {
      console.warn('[TRINITY PERFORMANCE]', {
        action: actionName,
        warning: 'Slow server action',
        duration: `${totalDuration}ms`,
        threshold: '1000ms'
      });
    }

    return { success: true, post };

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY SERVER ACTION ERROR]', {
      action: actionName,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });

    return { error: 'Failed to create post' };
  }
}
```

### Client Component Using Server Action

```typescript
'use client';

import { useFormStatus } from 'react-dom';
import { createPost } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export default function CreatePostForm() {
  const componentName = 'CreatePostForm';

  const handleSubmit = async (formData: FormData) => {
    const startTime = Date.now();

    console.log('[TRINITY CLIENT ACTION]', {
      component: componentName,
      action: 'createPost',
      timestamp: new Date().toISOString()
    });

    const result = await createPost(formData);
    const duration = Date.now() - startTime;

    if (result.error) {
      console.error('[TRINITY CLIENT ACTION ERROR]', {
        component: componentName,
        action: 'createPost',
        error: result.error,
        duration: `${duration}ms`
      });

      alert(result.error);
    } else {
      console.log('[TRINITY CLIENT ACTION SUCCESS]', {
        component: componentName,
        action: 'createPost',
        postId: result.post.id,
        duration: `${duration}ms`
      });

      // Form is automatically reset by Next.js
    }
  };

  return (
    <form action={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input name="title" id="title" required />
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea name="content" id="content" required />
      </div>

      <SubmitButton />
    </form>
  );
}
```

---

## API Routes

### Route Handler with Trinity Logging

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const routeName = 'GET /api/users';
  const startTime = Date.now();

  console.log('[TRINITY API ROUTE]', {
    route: routeName,
    method: 'GET',
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log('[TRINITY QUERY PARAMS]', {
      route: routeName,
      page,
      limit,
      skip
    });

    // Fetch users from database
    const dbStart = Date.now();
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);
    const dbDuration = Date.now() - dbStart;

    console.log('[TRINITY DATABASE]', {
      route: routeName,
      operation: 'findMany',
      table: 'users',
      count: users.length,
      total,
      duration: `${dbDuration}ms`
    });

    const totalDuration = Date.now() - startTime;

    console.log('[TRINITY API ROUTE SUCCESS]', {
      route: routeName,
      usersCount: users.length,
      totalRecords: total,
      totalDuration: `${totalDuration}ms`
    });

    if (totalDuration > 500) {
      console.warn('[TRINITY PERFORMANCE]', {
        route: routeName,
        warning: 'Slow API route',
        duration: `${totalDuration}ms`,
        threshold: '500ms'
      });
    }

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY API ROUTE ERROR]', {
      route: routeName,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const routeName = 'POST /api/users';
  const startTime = Date.now();

  console.log('[TRINITY API ROUTE]', {
    route: routeName,
    method: 'POST',
    timestamp: new Date().toISOString()
  });

  try {
    // Parse request body
    const bodyStart = Date.now();
    const body = await request.json();
    const bodyDuration = Date.now() - bodyStart;

    console.log('[TRINITY REQUEST BODY]', {
      route: routeName,
      data: { ...body, password: body.password ? '[REDACTED]' : undefined },
      parseDuration: `${bodyDuration}ms`
    });

    // Validate
    const validationStart = Date.now();
    if (!body.email || !body.name) {
      console.warn('[TRINITY VALIDATION]', {
        route: routeName,
        error: 'Missing required fields'
      });

      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }
    const validationDuration = Date.now() - validationStart;

    // Create user
    const dbStart = Date.now();
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name
      }
    });
    const dbDuration = Date.now() - dbStart;

    console.log('[TRINITY DATABASE]', {
      route: routeName,
      operation: 'create',
      table: 'users',
      userId: user.id,
      duration: `${dbDuration}ms`
    });

    const totalDuration = Date.now() - startTime;

    console.log('[TRINITY API ROUTE SUCCESS]', {
      route: routeName,
      userId: user.id,
      totalDuration: `${totalDuration}ms`
    });

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY API ROUTE ERROR]', {
      route: routeName,
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`
    });

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

## State Management

### Zustand Store with Trinity Logging

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) => {
          const startTime = Date.now();

          console.log('[TRINITY STORE]', {
            store: 'CartStore',
            action: 'addItem',
            itemId: item.id,
            timestamp: new Date().toISOString()
          });

          set((state) => {
            const existingItem = state.items.find(i => i.id === item.id);

            if (existingItem) {
              console.log('[TRINITY STORE]', {
                store: 'CartStore',
                action: 'addItem',
                result: 'quantity_increased',
                itemId: item.id,
                newQuantity: existingItem.quantity + 1
              });

              return {
                items: state.items.map(i =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
              };
            }

            console.log('[TRINITY STORE]', {
              store: 'CartStore',
              action: 'addItem',
              result: 'item_added',
              itemId: item.id
            });

            return {
              items: [...state.items, { ...item, quantity: 1 }]
            };
          });

          const duration = Date.now() - startTime;

          console.log('[TRINITY STORE SUCCESS]', {
            store: 'CartStore',
            action: 'addItem',
            duration: `${duration}ms`,
            totalItems: get().items.length
          });
        },

        removeItem: (id) => {
          const startTime = Date.now();

          console.log('[TRINITY STORE]', {
            store: 'CartStore',
            action: 'removeItem',
            itemId: id,
            timestamp: new Date().toISOString()
          });

          set((state) => ({
            items: state.items.filter(item => item.id !== id)
          }));

          const duration = Date.now() - startTime;

          console.log('[TRINITY STORE SUCCESS]', {
            store: 'CartStore',
            action: 'removeItem',
            itemId: id,
            duration: `${duration}ms`,
            remainingItems: get().items.length
          });
        },

        updateQuantity: (id, quantity) => {
          const startTime = Date.now();

          console.log('[TRINITY STORE]', {
            store: 'CartStore',
            action: 'updateQuantity',
            itemId: id,
            newQuantity: quantity,
            timestamp: new Date().toISOString()
          });

          if (quantity <= 0) {
            console.log('[TRINITY STORE]', {
              store: 'CartStore',
              action: 'updateQuantity',
              result: 'removing_item',
              reason: 'quantity_zero'
            });

            get().removeItem(id);
            return;
          }

          set((state) => ({
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          }));

          const duration = Date.now() - startTime;

          console.log('[TRINITY STORE SUCCESS]', {
            store: 'CartStore',
            action: 'updateQuantity',
            itemId: id,
            quantity,
            duration: `${duration}ms`
          });
        },

        clearCart: () => {
          const startTime = Date.now();
          const itemCount = get().items.length;

          console.log('[TRINITY STORE]', {
            store: 'CartStore',
            action: 'clearCart',
            itemsCleared: itemCount,
            timestamp: new Date().toISOString()
          });

          set({ items: [] });

          const duration = Date.now() - startTime;

          console.log('[TRINITY STORE SUCCESS]', {
            store: 'CartStore',
            action: 'clearCart',
            duration: `${duration}ms`
          });
        },

        totalPrice: () => {
          return get().items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        }
      }),
      {
        name: 'cart-storage'
      }
    )
  )
);
```

### Using the Store in a Component

```typescript
'use client';

import { useCartStore } from '@/stores/cartStore';
import { useEffect } from 'react';

export default function Cart() {
  const componentName = 'Cart';
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  useEffect(() => {
    console.log('[TRINITY COMPONENT]', {
      component: componentName,
      event: 'Mount',
      itemsCount: items.length,
      totalPrice,
      timestamp: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    console.log('[TRINITY STATE]', {
      component: componentName,
      event: 'Cart Updated',
      itemsCount: items.length,
      totalPrice,
      timestamp: new Date().toISOString()
    });
  }, [items, totalPrice]);

  return (
    <div className="cart">
      <h2>Shopping Cart ({items.length} items)</h2>

      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>${item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      <div className="cart-total">
        <strong>Total: ${totalPrice.toFixed(2)}</strong>
      </div>
    </div>
  );
}
```

---

## Data Fetching

### Server Component Data Fetching

```typescript
// app/posts/page.tsx
import { prisma } from '@/lib/prisma';

async function getPosts() {
  const functionName = 'getPosts';
  const startTime = Date.now();

  console.log('[TRINITY DATA FETCH]', {
    function: functionName,
    source: 'database',
    timestamp: new Date().toISOString()
  });

  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const duration = Date.now() - startTime;

    console.log('[TRINITY DATA FETCH SUCCESS]', {
      function: functionName,
      postsCount: posts.length,
      duration: `${duration}ms`
    });

    if (duration > 500) {
      console.warn('[TRINITY PERFORMANCE]', {
        function: functionName,
        warning: 'Slow database query',
        duration: `${duration}ms`,
        threshold: '500ms'
      });
    }

    return posts;

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY DATA FETCH ERROR]', {
      function: functionName,
      error: error.message,
      duration: `${duration}ms`
    });

    throw error;
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="posts">
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
```

### Client Component with TanStack Query

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const functionName = 'fetchPosts';
  const startTime = Date.now();

  console.log('[TRINITY API CALL]', {
    function: functionName,
    endpoint: '/api/posts',
    timestamp: new Date().toISOString()
  });

  const response = await fetch('/api/posts');
  const data = await response.json();
  const duration = Date.now() - startTime;

  console.log('[TRINITY API CALL SUCCESS]', {
    function: functionName,
    endpoint: '/api/posts',
    postsCount: data.length,
    duration: `${duration}ms`
  });

  return data;
}

export default function PostsList() {
  const componentName = 'PostsList';

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      console.log('[TRINITY QUERY]', {
        component: componentName,
        queryKey: 'posts',
        event: 'success',
        count: data.length
      });
    },
    onError: (error) => {
      console.error('[TRINITY QUERY ERROR]', {
        component: componentName,
        queryKey: 'posts',
        error: error.message
      });
    }
  });

  if (isLoading) {
    console.log('[TRINITY QUERY]', {
      component: componentName,
      queryKey: 'posts',
      state: 'loading'
    });

    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## Performance Optimization

### Image Optimization with Trinity Logging

```typescript
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  const componentName = 'OptimizedImage';
  const [loadTime, setLoadTime] = useState<number | null>(null);

  const handleLoadStart = () => {
    const startTime = Date.now();

    console.log('[TRINITY IMAGE]', {
      component: componentName,
      event: 'Load Start',
      src,
      timestamp: new Date().toISOString()
    });

    return startTime;
  };

  const handleLoadComplete = (startTime: number) => {
    const duration = Date.now() - startTime;
    setLoadTime(duration);

    console.log('[TRINITY IMAGE]', {
      component: componentName,
      event: 'Load Complete',
      src,
      duration: `${duration}ms`
    });

    if (duration > 1000) {
      console.warn('[TRINITY PERFORMANCE]', {
        component: componentName,
        event: 'Slow Image Load',
        src,
        duration: `${duration}ms`,
        threshold: '1000ms'
      });
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      priority
      onLoadingComplete={() => {
        const startTime = performance.now();
        handleLoadComplete(startTime);
      }}
    />
  );
}
```

### Lazy Loading with Suspense

```typescript
// app/dashboard/page.tsx
import { lazy, Suspense } from 'react';

const Analytics = lazy(() => {
  const startTime = Date.now();

  console.log('[TRINITY LAZY LOAD]', {
    component: 'Analytics',
    event: 'Import Start',
    timestamp: new Date().toISOString()
  });

  return import('@/components/Analytics').then((module) => {
    const duration = Date.now() - startTime;

    console.log('[TRINITY LAZY LOAD]', {
      component: 'Analytics',
      event: 'Import Complete',
      duration: `${duration}ms`
    });

    return module;
  });
});

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

---

## Investigation Templates

### Hydration Mismatch Investigation

```markdown
# Investigation: Hydration Mismatch Error

**Component:** [Component name]
**Error:** Text content does not match server-rendered HTML
**Date:** [YYYY-MM-DD]

## Problem Statement
Hydration mismatch between server and client rendering
- Browser shows: [actual content]
- Expected: [server-rendered content]

## Investigation Steps

### 1. Identify Mismatch Source
- [ ] Check for Date.now() or random values
- [ ] Look for browser-only APIs (window, localStorage)
- [ ] Review conditional rendering based on client state
- [ ] Check for useEffect running before hydration

**Finding:**
[Document what causes the mismatch]

### 2. Server vs Client Rendering
- [ ] Log component props on server
- [ ] Log component props on client
- [ ] Compare rendered output
- [ ] Check for dynamic imports

**Finding:**
[Document differences]

### 3. Solution Options
- [ ] Use 'use client' directive if client-only
- [ ] Use suppressHydrationWarning for known mismatches
- [ ] Move dynamic content to useEffect
- [ ] Use two-pass rendering pattern

## Root Cause
[Describe the root cause]

## Solution Implemented
[Describe the fix]

## Prevention
- [ ] Add hydration tests
- [ ] Document client-only patterns
- [ ] Update component guidelines
```

### Performance Investigation

```markdown
# Investigation: Slow Page Load Performance

**Page:** [Page route]
**Metric:** LCP [X]s (Target: <2.5s)
**Date:** [YYYY-MM-DD]

## Problem Statement
Page loads slower than Web Vitals targets
- Current LCP: [X]s
- Current FCP: [X]s
- Current TTI: [X]s

## Investigation Steps

### 1. Lighthouse Audit
- [ ] Run Lighthouse in production mode
- [ ] Check performance score
- [ ] Review opportunities
- [ ] Analyze diagnostics

**Findings:**
[Document Lighthouse results]

### 2. Bundle Analysis
- [ ] Run next build with bundle analyzer
- [ ] Check bundle size
- [ ] Identify large dependencies
- [ ] Look for duplicate packages

**Findings:**
[Document bundle issues]

### 3. Server Component Usage
- [ ] Review which components are 'use client'
- [ ] Check if data fetching happens on server
- [ ] Verify streaming is working
- [ ] Check for waterfalls

**Findings:**
[Document server/client split]

### 4. Image Optimization
- [ ] Check if using next/image
- [ ] Verify image formats (WebP, AVIF)
- [ ] Check image sizes
- [ ] Review priority loading

**Findings:**
[Document image issues]

## Root Cause
[Identify the bottleneck]

## Solution Implemented
[Describe optimizations]

## Performance Impact
- Before: LCP [X]s
- After: LCP [Y]s
- Improvement: [Z%]
```

---

## Testing Strategies

### Component Testing with Jest

```typescript
// __tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image: '/test-image.jpg'
  };

  it('should render product information', () => {
    const startTime = Date.now();

    console.log('[TRINITY TEST]', {
      test: 'ProductCard render',
      event: 'Start',
      timestamp: new Date().toISOString()
    });

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();

    const duration = Date.now() - startTime;

    console.log('[TRINITY TEST SUCCESS]', {
      test: 'ProductCard render',
      duration: `${duration}ms`
    });
  });

  it('should call addToCart when button clicked', () => {
    const mockAddToCart = jest.fn();
    const startTime = Date.now();

    console.log('[TRINITY TEST]', {
      test: 'ProductCard addToCart',
      event: 'Start',
      timestamp: new Date().toISOString()
    });

    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);

    const duration = Date.now() - startTime;

    console.log('[TRINITY TEST SUCCESS]', {
      test: 'ProductCard addToCart',
      duration: `${duration}ms`,
      callCount: mockAddToCart.mock.calls.length
    });
  });
});
```

### E2E Testing with Playwright

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should complete purchase successfully', async ({ page }) => {
    const testName = 'Checkout flow';
    const startTime = Date.now();

    console.log('[TRINITY E2E TEST]', {
      test: testName,
      event: 'Start',
      timestamp: new Date().toISOString()
    });

    // Navigate to product page
    await page.goto('/products/1');
    await expect(page.locator('h1')).toContainText('Product Name');

    // Add to cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.cart-count')).toHaveText('1');

    console.log('[TRINITY E2E TEST]', {
      test: testName,
      step: 'Product added to cart',
      duration: `${Date.now() - startTime}ms`
    });

    // Go to cart
    await page.click('a:has-text("Cart")');
    await expect(page).toHaveURL('/cart');

    // Proceed to checkout
    await page.click('button:has-text("Checkout")');
    await expect(page).toHaveURL('/checkout');

    // Fill shipping info
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="address"]', '123 Test St');

    console.log('[TRINITY E2E TEST]', {
      test: testName,
      step: 'Shipping info filled',
      duration: `${Date.now() - startTime}ms`
    });

    // Submit order
    await page.click('button:has-text("Place Order")');
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.locator('.success-message')).toBeVisible();

    const duration = Date.now() - startTime;

    console.log('[TRINITY E2E TEST SUCCESS]', {
      test: testName,
      totalDuration: `${duration}ms`
    });

    if (duration > 10000) {
      console.warn('[TRINITY PERFORMANCE]', {
        test: testName,
        warning: 'Slow E2E test',
        duration: `${duration}ms`,
        threshold: '10000ms'
      });
    }
  });
});
```

---

## Crisis Recovery

### Scenario 1: Build Failure After Dependency Update

**Symptoms:**
- Next.js build fails with module errors
- TypeScript compilation errors
- Missing dependencies

**Trinity Recovery:**
1. Check error logs:
   ```bash
   npm run build 2>&1 | tee build-error.log
   ```

2. Rollback dependencies:
   ```bash
   git checkout HEAD~1 package.json package-lock.json
   npm install
   ```

3. Test build:
   ```bash
   npm run build
   ```

4. If successful, update dependencies one at a time
5. Document problematic package versions

### Scenario 2: Hydration Errors in Production

**Symptoms:**
- Console errors about hydration mismatch
- Content flashing/changing after load
- Warnings in browser console

**Trinity Recovery:**
1. Identify affected components:
   ```typescript
   // Add to suspected components
   <div suppressHydrationWarning>
     {/* Temporarily suppress */}
   </div>
   ```

2. Check for:
   - Date/time rendering
   - Browser-only APIs
   - Random values
   - localStorage access

3. Fix properly:
   ```typescript
   'use client';

   export default function Component() {
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
       setMounted(true);
     }, []);

     if (!mounted) return null;

     return <div>{/* Client-only content */}</div>;
   }
   ```

### Scenario 3: Memory Leak in Client Component

**Symptoms:**
- Browser tab consuming excessive memory
- Page becomes slow over time
- Memory usage continuously increasing

**Trinity Recovery:**
1. Identify leaking component using React DevTools Profiler

2. Check for:
   - Missing cleanup in useEffect
   - Event listeners not removed
   - Timers/intervals not cleared
   - Large state objects

3. Fix pattern:
   ```typescript
   useEffect(() => {
     const interval = setInterval(() => {
       // Do something
     }, 1000);

     // ALWAYS cleanup
     return () => clearInterval(interval);
   }, []);
   ```

### Scenario 4: Vercel Deployment Timeout

**Symptoms:**
- Build exceeds time limit
- Deployment fails at build step
- Function execution timeouts

**Trinity Recovery:**
1. Check build logs for slow operations
2. Optimize build:
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       optimizeCss: true
     },
     swcMinify: true
   };
   ```

3. Enable incremental builds
4. Split large pages/components
5. Review and remove unused dependencies

---

**Trinity Method for React + Next.js v1.0**

Investigation-first development with Server Components, streaming, and modern React patterns.
