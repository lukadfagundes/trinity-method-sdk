# Web Application Trinity Method Examples

Trinity Method optimizations for different types of web applications, from e-commerce to social platforms.

## Table of Contents
1. [E-commerce Web Applications](#e-commerce-web-applications)
2. [SaaS Web Applications](#saas-web-applications)
3. [Content Management Systems](#content-management-systems)
4. [Social Media Platforms](#social-media-platforms)
5. [Investigation Templates](#investigation-templates)
6. [Performance Baselines](#performance-baselines)
7. [Testing Strategies](#testing-strategies)
8. [Crisis Recovery](#crisis-recovery)
9. [Quality Gates](#quality-gates)

---

## E-commerce Web Applications

### Framework
- **Frontend**: React 18 + Next.js 14 (App Router)
- **Backend**: Node.js + Express + Stripe
- **Database**: PostgreSQL + Redis
- **State Management**: Zustand
- **Payment**: Stripe + PayPal
- **Search**: Elasticsearch

### Trinity Method Debugging Pattern

#### Shopping Cart Component with Trinity Logging
```typescript
'use client';

import { useCart } from '@/hooks/useCart';
import { useEffect } from 'react';

export default function ShoppingCart() {
  const componentName = 'ShoppingCart';
  const { items, addItem, removeItem, updateQuantity, totalPrice } = useCart();

  useEffect(() => {
    console.log('[TRINITY COMPONENT]', {
      component: componentName,
      event: 'Mount',
      itemCount: items.length,
      totalPrice: totalPrice,
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
      event: 'Cart Updated',
      itemCount: items.length,
      totalPrice: totalPrice,
      items: items.map(i => ({ id: i.id, quantity: i.quantity }))
    });
  }, [items, totalPrice]);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: componentName,
      action: 'updateQuantity',
      itemId,
      newQuantity: quantity,
      timestamp: new Date().toISOString()
    });

    try {
      updateQuantity(itemId, quantity);
      const duration = Date.now() - startTime;

      console.log('[TRINITY ACTION SUCCESS]', {
        component: componentName,
        action: 'updateQuantity',
        itemId,
        duration: `${duration}ms`
      });

      if (duration > 100) {
        console.warn('[TRINITY PERFORMANCE]', {
          component: componentName,
          action: 'updateQuantity',
          warning: 'Slow quantity update',
          duration: `${duration}ms`
        });
      }
    } catch (error) {
      console.error('[TRINITY ACTION ERROR]', {
        component: componentName,
        action: 'updateQuantity',
        error: error.message,
        itemId
      });
    }
  };

  return (
    <div className="shopping-cart">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={removeItem}
        />
      ))}
      <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
}
```

#### Stripe Payment with Trinity Debugging
```typescript
import { loadStripe } from '@stripe/stripe-js';

export async function processPayment(amount: number, paymentMethodId: string) {
  const actionName = 'processPayment';
  const startTime = Date.now();

  console.log('[TRINITY PAYMENT]', {
    action: actionName,
    amount,
    paymentMethodId,
    timestamp: new Date().toISOString()
  });

  try {
    // Create payment intent
    const intentStart = Date.now();
    const response = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, paymentMethodId })
    });

    const { clientSecret } = await response.json();
    const intentDuration = Date.now() - intentStart;

    console.log('[TRINITY PAYMENT API]', {
      action: actionName,
      step: 'create-intent',
      duration: `${intentDuration}ms`
    });

    // Confirm payment
    const confirmStart = Date.now();
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    const result = await stripe!.confirmCardPayment(clientSecret);
    const confirmDuration = Date.now() - confirmStart;

    console.log('[TRINITY PAYMENT STRIPE]', {
      action: actionName,
      step: 'confirm-payment',
      duration: `${confirmDuration}ms`
    });

    if (result.error) {
      console.error('[TRINITY PAYMENT ERROR]', {
        action: actionName,
        error: result.error.message,
        code: result.error.code
      });

      throw new Error(result.error.message);
    }

    const totalDuration = Date.now() - startTime;

    console.log('[TRINITY PAYMENT SUCCESS]', {
      action: actionName,
      paymentIntentId: result.paymentIntent.id,
      amount,
      totalDuration: `${totalDuration}ms`
    });

    if (totalDuration > 3000) {
      console.warn('[TRINITY PERFORMANCE]', {
        action: actionName,
        warning: 'Slow payment processing',
        duration: `${totalDuration}ms`,
        threshold: '3000ms'
      });
    }

    return result.paymentIntent;

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY PAYMENT ERROR]', {
      action: actionName,
      error: error.message,
      duration: `${duration}ms`
    });

    throw error;
  }
}
```

#### Product Search with Elasticsearch
```typescript
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: process.env.ELASTICSEARCH_URL });

export async function searchProducts(query: string, filters: any = {}) {
  const actionName = 'searchProducts';
  const startTime = Date.now();

  console.log('[TRINITY SEARCH]', {
    action: actionName,
    query,
    filters,
    timestamp: new Date().toISOString()
  });

  try {
    const searchStart = Date.now();

    const result = await client.search({
      index: 'products',
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['name^3', 'description', 'category'],
                  fuzziness: 'AUTO'
                }
              }
            ],
            filter: Object.entries(filters).map(([key, value]) => ({
              term: { [key]: value }
            }))
          }
        },
        highlight: {
          fields: {
            name: {},
            description: {}
          }
        }
      }
    });

    const searchDuration = Date.now() - searchStart;

    console.log('[TRINITY SEARCH SUCCESS]', {
      action: actionName,
      query,
      resultsCount: result.hits.hits.length,
      maxScore: result.hits.max_score,
      duration: `${searchDuration}ms`
    });

    if (searchDuration > 200) {
      console.warn('[TRINITY PERFORMANCE]', {
        action: actionName,
        warning: 'Slow search query',
        duration: `${searchDuration}ms`,
        threshold: '200ms'
      });
    }

    return result.hits.hits.map(hit => ({
      ...hit._source,
      id: hit._id,
      score: hit._score,
      highlights: hit.highlight
    }));

  } catch (error) {
    const duration = Date.now() - startTime;

    console.error('[TRINITY SEARCH ERROR]', {
      action: actionName,
      query,
      error: error.message,
      duration: `${duration}ms`
    });

    return [];
  }
}
```

---

## SaaS Web Applications

### Framework
- **Frontend**: Vue 3 + Nuxt 3
- **Backend**: Python + FastAPI
- **Database**: PostgreSQL (multi-tenant)
- **State Management**: Pinia
- **Billing**: Stripe Subscriptions
- **Feature Flags**: LaunchDarkly

### Trinity Method Debugging Pattern

#### Multi-Tenant Store with Trinity Logging
```typescript
import { defineStore } from 'pinia';

export const useTenantStore = defineStore('tenant', () => {
  const storeName = 'TenantStore';

  const currentTenant = ref<Tenant | null>(null);
  const subscription = ref<Subscription | null>(null);
  const features = ref<Record<string, boolean>>({});

  console.log('[TRINITY STORE]', {
    store: storeName,
    event: 'Initialize',
    timestamp: new Date().toISOString()
  });

  async function loadTenant(tenantId: string) {
    const actionName = 'loadTenant';
    const startTime = Date.now();

    console.log('[TRINITY STORE ACTION]', {
      store: storeName,
      action: actionName,
      tenantId,
      timestamp: new Date().toISOString()
    });

    try {
      // Load tenant data
      const tenantStart = Date.now();
      const tenantData = await $fetch<Tenant>(`/api/tenants/${tenantId}`);
      const tenantDuration = Date.now() - tenantStart;

      console.log('[TRINITY STORE API]', {
        store: storeName,
        action: actionName,
        endpoint: `/api/tenants/${tenantId}`,
        duration: `${tenantDuration}ms`
      });

      // Load subscription
      const subStart = Date.now();
      const subData = await $fetch<Subscription>(`/api/subscriptions/${tenantId}`);
      const subDuration = Date.now() - subStart;

      console.log('[TRINITY STORE API]', {
        store: storeName,
        action: actionName,
        endpoint: `/api/subscriptions/${tenantId}`,
        duration: `${subDuration}ms`
      });

      // Load feature flags
      const featureStart = Date.now();
      const featureData = await $fetch<Record<string, boolean>>(
        `/api/features/${tenantId}`
      );
      const featureDuration = Date.now() - featureStart;

      console.log('[TRINITY STORE API]', {
        store: storeName,
        action: actionName,
        endpoint: `/api/features/${tenantId}`,
        duration: `${featureDuration}ms`
      });

      // Update state
      currentTenant.value = tenantData;
      subscription.value = subData;
      features.value = featureData;

      const totalDuration = Date.now() - startTime;

      console.log('[TRINITY STORE ACTION SUCCESS]', {
        store: storeName,
        action: actionName,
        tenantId,
        subscriptionPlan: subData.plan,
        featureCount: Object.keys(featureData).length,
        totalDuration: `${totalDuration}ms`
      });

      if (totalDuration > 1000) {
        console.warn('[TRINITY PERFORMANCE]', {
          store: storeName,
          action: actionName,
          warning: 'Slow tenant loading',
          duration: `${totalDuration}ms`,
          threshold: '1000ms'
        });
      }

    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('[TRINITY STORE ACTION ERROR]', {
        store: storeName,
        action: actionName,
        tenantId,
        error: error.message,
        duration: `${duration}ms`
      });

      throw error;
    }
  }

  function hasFeature(featureName: string): boolean {
    const hasAccess = features.value[featureName] ?? false;

    console.log('[TRINITY FEATURE CHECK]', {
      store: storeName,
      feature: featureName,
      hasAccess,
      tenantId: currentTenant.value?.id,
      plan: subscription.value?.plan
    });

    return hasAccess;
  }

  return {
    currentTenant,
    subscription,
    features,
    loadTenant,
    hasFeature
  };
});
```

#### Subscription Management API
```python
from fastapi import FastAPI, HTTPException, Depends
from datetime import datetime
import stripe
import logging

logger = logging.getLogger(__name__)
app = FastAPI()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/api/subscriptions/upgrade")
async def upgrade_subscription(
    tenant_id: str,
    new_plan_id: str,
    tenant: Tenant = Depends(get_current_tenant)
):
    """Upgrade tenant subscription with Trinity debugging"""
    action_name = "upgrade_subscription"
    start_time = datetime.now()

    logger.info(f"[TRINITY API] {action_name} started", extra={
        "action": action_name,
        "tenant_id": tenant_id,
        "current_plan": tenant.subscription.plan_id,
        "new_plan": new_plan_id,
        "timestamp": start_time.isoformat()
    })

    try:
        # Validate plan upgrade
        validation_start = datetime.now()
        if not is_valid_upgrade(tenant.subscription.plan_id, new_plan_id):
            logger.warning(f"[TRINITY VALIDATION] Invalid plan upgrade", extra={
                "action": action_name,
                "tenant_id": tenant_id,
                "reason": "invalid_upgrade_path"
            })
            raise HTTPException(status_code=400, detail="Invalid upgrade path")

        validation_duration = (datetime.now() - validation_start).total_seconds() * 1000

        # Update Stripe subscription
        stripe_start = datetime.now()
        subscription = stripe.Subscription.modify(
            tenant.subscription.stripe_id,
            items=[{
                'id': tenant.subscription.stripe_item_id,
                'price': new_plan_id
            }],
            proration_behavior='create_prorations'
        )
        stripe_duration = (datetime.now() - stripe_start).total_seconds() * 1000

        logger.info(f"[TRINITY STRIPE] Subscription updated", extra={
            "action": action_name,
            "tenant_id": tenant_id,
            "stripe_subscription_id": subscription.id,
            "duration_ms": stripe_duration
        })

        # Update database
        db_start = datetime.now()
        await db.subscriptions.update(
            tenant_id=tenant_id,
            plan_id=new_plan_id,
            stripe_subscription_id=subscription.id
        )
        db_duration = (datetime.now() - db_start).total_seconds() * 1000

        logger.info(f"[TRINITY DATABASE] Subscription record updated", extra={
            "action": action_name,
            "tenant_id": tenant_id,
            "duration_ms": db_duration
        })

        # Refresh feature flags
        feature_start = datetime.now()
        await refresh_feature_flags(tenant_id, new_plan_id)
        feature_duration = (datetime.now() - feature_start).total_seconds() * 1000

        logger.info(f"[TRINITY FEATURES] Feature flags refreshed", extra={
            "action": action_name,
            "tenant_id": tenant_id,
            "duration_ms": feature_duration
        })

        total_duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.info(f"[TRINITY API SUCCESS] {action_name} completed", extra={
            "action": action_name,
            "tenant_id": tenant_id,
            "new_plan": new_plan_id,
            "total_duration_ms": total_duration
        })

        if total_duration > 2000:
            logger.warning(f"[TRINITY PERFORMANCE] Slow subscription upgrade", extra={
                "action": action_name,
                "duration_ms": total_duration,
                "threshold_ms": 2000
            })

        return {
            "subscription": subscription,
            "plan": new_plan_id,
            "prorated_amount": subscription.latest_invoice.amount_due / 100
        }

    except HTTPException:
        raise
    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.error(f"[TRINITY API ERROR] {action_name} failed", extra={
            "action": action_name,
            "tenant_id": tenant_id,
            "error": str(e),
            "error_type": type(e).__name__,
            "duration_ms": duration
        }, exc_info=True)

        raise HTTPException(status_code=500, detail="Subscription upgrade failed")
```

---

## Content Management Systems

### Framework
- **Frontend**: Angular 17 (Standalone Components)
- **Backend**: NestJS + TypeORM
- **Database**: PostgreSQL + S3 (media)
- **Editor**: TinyMCE / Slate.js
- **Search**: PostgreSQL Full-Text Search
- **CDN**: CloudFront

### Trinity Method Debugging Pattern

#### Content Editor Component
```typescript
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-editor">
      <div class="toolbar">
        <button (click)="saveContent()">Save</button>
        <button (click)="publishContent()">Publish</button>
      </div>
      <div class="editor" [innerHTML]="content()"></div>
      <div class="status">{{ status() }}</div>
    </div>
  `
})
export class ContentEditorComponent implements OnInit, OnDestroy {
  private componentName = 'ContentEditorComponent';

  content = signal<string>('');
  status = signal<string>('');
  autoSaveInterval: any;

  constructor(private contentService: ContentService) {
    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'Constructor',
      timestamp: new Date().toISOString()
    });
  }

  ngOnInit() {
    const startTime = Date.now();

    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'ngOnInit',
      timestamp: new Date().toISOString()
    });

    // Load content
    this.loadContent();

    // Setup auto-save
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, 30000); // Every 30 seconds

    const duration = Date.now() - startTime;

    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'ngOnInit Complete',
      duration: `${duration}ms`
    });
  }

  ngOnDestroy() {
    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'ngOnDestroy',
      timestamp: new Date().toISOString()
    });

    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  async saveContent() {
    const actionName = 'saveContent';
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: this.componentName,
      action: actionName,
      contentLength: this.content().length,
      timestamp: new Date().toISOString()
    });

    try {
      this.status.set('Saving...');

      const result = await this.contentService.save(this.content());
      const duration = Date.now() - startTime;

      console.log('[TRINITY ACTION SUCCESS]', {
        component: this.componentName,
        action: actionName,
        contentId: result.id,
        duration: `${duration}ms`
      });

      if (duration > 1000) {
        console.warn('[TRINITY PERFORMANCE]', {
          component: this.componentName,
          action: actionName,
          warning: 'Slow save operation',
          duration: `${duration}ms`,
          threshold: '1000ms'
        });
      }

      this.status.set('Saved');

    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('[TRINITY ACTION ERROR]', {
        component: this.componentName,
        action: actionName,
        error: error.message,
        duration: `${duration}ms`
      });

      this.status.set('Save failed');
    }
  }

  async publishContent() {
    const actionName = 'publishContent';
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: this.componentName,
      action: actionName,
      timestamp: new Date().toISOString()
    });

    try {
      // Validate content before publishing
      const validationStart = Date.now();
      const isValid = await this.contentService.validate(this.content());
      const validationDuration = Date.now() - validationStart;

      console.log('[TRINITY VALIDATION]', {
        component: this.componentName,
        action: actionName,
        isValid,
        duration: `${validationDuration}ms`
      });

      if (!isValid) {
        console.warn('[TRINITY VALIDATION]', {
          component: this.componentName,
          action: actionName,
          warning: 'Content validation failed'
        });

        this.status.set('Validation failed');
        return;
      }

      // Publish to CDN
      const publishStart = Date.now();
      await this.contentService.publish(this.content());
      const publishDuration = Date.now() - publishStart;

      console.log('[TRINITY CDN]', {
        component: this.componentName,
        action: actionName,
        duration: `${publishDuration}ms`
      });

      const totalDuration = Date.now() - startTime;

      console.log('[TRINITY ACTION SUCCESS]', {
        component: this.componentName,
        action: actionName,
        totalDuration: `${totalDuration}ms`
      });

      this.status.set('Published');

    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('[TRINITY ACTION ERROR]', {
        component: this.componentName,
        action: actionName,
        error: error.message,
        duration: `${duration}ms`
      });

      this.status.set('Publish failed');
    }
  }

  private async autoSave() {
    console.log('[TRINITY AUTO-SAVE]', {
      component: this.componentName,
      contentLength: this.content().length,
      timestamp: new Date().toISOString()
    });

    await this.saveContent();
  }

  private async loadContent() {
    const actionName = 'loadContent';
    const startTime = Date.now();

    console.log('[TRINITY ACTION]', {
      component: this.componentName,
      action: actionName,
      timestamp: new Date().toISOString()
    });

    try {
      const content = await this.contentService.load();
      const duration = Date.now() - startTime;

      this.content.set(content);

      console.log('[TRINITY ACTION SUCCESS]', {
        component: this.componentName,
        action: actionName,
        contentLength: content.length,
        duration: `${duration}ms`
      });

    } catch (error) {
      console.error('[TRINITY ACTION ERROR]', {
        component: this.componentName,
        action: actionName,
        error: error.message
      });
    }
  }
}
```

---

## Social Media Platforms

### Framework
- **Frontend**: React + TypeScript
- **Backend**: GraphQL + Apollo Federation
- **Database**: PostgreSQL + MongoDB
- **Real-time**: WebSocket + Redis Pub/Sub
- **Media**: S3 + CloudFront + Lambda (processing)
- **Feed Algorithm**: Redis Sorted Sets

### Trinity Method Debugging Pattern

#### Social Feed Component
```typescript
import { useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function SocialFeed() {
  const componentName = 'SocialFeed';
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('[TRINITY COMPONENT]', {
      component: componentName,
      event: 'Mount',
      timestamp: new Date().toISOString()
    });

    return () => {
      console.log('[TRINITY COMPONENT]', {
        component: componentName,
        event: 'Unmount',
        timestamp: new Date().toISOString()
      });

      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const startTime = Date.now();

      console.log('[TRINITY FEED]', {
        component: componentName,
        action: 'fetchPage',
        page: pageParam,
        timestamp: new Date().toISOString()
      });

      try {
        const response = await fetch(`/api/feed?page=${pageParam}`);
        const posts = await response.json();
        const duration = Date.now() - startTime;

        console.log('[TRINITY FEED SUCCESS]', {
          component: componentName,
          action: 'fetchPage',
          page: pageParam,
          postsCount: posts.length,
          duration: `${duration}ms`
        });

        if (duration > 1000) {
          console.warn('[TRINITY PERFORMANCE]', {
            component: componentName,
            action: 'fetchPage',
            warning: 'Slow feed loading',
            duration: `${duration}ms`,
            threshold: '1000ms'
          });
        }

        return posts;
      } catch (error) {
        const duration = Date.now() - startTime;

        console.error('[TRINITY FEED ERROR]', {
          component: componentName,
          action: 'fetchPage',
          page: pageParam,
          error: error.message,
          duration: `${duration}ms`
        });

        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length : undefined;
    }
  });

  // Intersection Observer for infinite scroll
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      console.log('[TRINITY SCROLL]', {
        component: componentName,
        event: 'intersection',
        isIntersecting: entry.isIntersecting,
        hasNextPage,
        isFetchingNextPage
      });

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log('[TRINITY SCROLL]', {
          component: componentName,
          action: 'loadMore',
          timestamp: new Date().toISOString()
        });

        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (lastPostRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: 0.1
      });

      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection]);

  const posts = data?.pages.flat() ?? [];

  return (
    <div className="social-feed">
      {posts.map((post, index) => (
        <Post
          key={post.id}
          post={post}
          ref={index === posts.length - 1 ? lastPostRef : null}
        />
      ))}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
```

#### Real-time Notification System
```typescript
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export function useNotifications() {
  const serviceName = 'NotificationService';
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const startTime = Date.now();

    console.log('[TRINITY WEBSOCKET]', {
      service: serviceName,
      event: 'connecting',
      timestamp: new Date().toISOString()
    });

    // Connect to WebSocket
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: {
        token: getAuthToken()
      }
    });

    socket.on('connect', () => {
      const duration = Date.now() - startTime;

      console.log('[TRINITY WEBSOCKET]', {
        service: serviceName,
        event: 'connected',
        socketId: socket.id,
        duration: `${duration}ms`
      });
    });

    socket.on('notification', (notification) => {
      console.log('[TRINITY NOTIFICATION]', {
        service: serviceName,
        type: notification.type,
        notificationId: notification.id,
        timestamp: new Date().toISOString()
      });

      // Show notification
      showToast(notification);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[TRINITY WEBSOCKET]', {
        service: serviceName,
        event: 'disconnected',
        reason,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('error', (error) => {
      console.error('[TRINITY WEBSOCKET ERROR]', {
        service: serviceName,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    });

    socketRef.current = socket;

    return () => {
      console.log('[TRINITY WEBSOCKET]', {
        service: serviceName,
        event: 'cleanup',
        timestamp: new Date().toISOString()
      });

      socket.disconnect();
    };
  }, []);

  return socketRef;
}
```

---

## Investigation Templates

### E-commerce Checkout Failure Investigation
```markdown
# Investigation: Checkout Process Failure

**Issue Type:** E-commerce Checkout
**Date:** [YYYY-MM-DD]
**Investigator:** [Name]

## Problem Statement
[Describe the checkout failure]
- Affected users: [Count or %]
- Payment gateway: [Stripe/PayPal/etc]
- Failure point: [Cart/Payment/Confirmation]
- Revenue impact: [Estimate]

## Investigation Steps

### 1. Payment Gateway Analysis
- [ ] Check Stripe/PayPal dashboard for errors
- [ ] Review payment intent creation logs
- [ ] Verify API credentials are valid
- [ ] Check for rate limiting
- [ ] Review webhook delivery status

**Findings:**
[Document findings]

### 2. Frontend Flow Analysis
- [ ] Review cart state management logs
- [ ] Check for JavaScript errors in checkout
- [ ] Verify form validation logic
- [ ] Test payment method selection
- [ ] Check for race conditions

**Findings:**
[Document findings]

### 3. Backend API Analysis
- [ ] Review /api/checkout endpoint logs
- [ ] Check database transaction logs
- [ ] Verify inventory deduction logic
- [ ] Review order creation process
- [ ] Check email notification sending

**Findings:**
[Document findings]

### 4. User Experience Analysis
- [ ] Review session recordings
- [ ] Check browser console errors
- [ ] Analyze network requests
- [ ] Test on affected browsers/devices
- [ ] Verify SSL certificate validity

**Findings:**
[Document findings]

## Root Cause
[Identify the root cause]

## Solution Implemented
[Describe the fix]

## Revenue Impact
- Lost revenue during outage: [$X]
- Affected orders: [Count]
- Average order value: [$X]

## Prevention Measures
- [ ] Add payment gateway health monitoring
- [ ] Implement checkout flow tests
- [ ] Add frontend error tracking
- [ ] Create payment retry logic
- [ ] Set up revenue alerts
```

### SaaS Tenant Isolation Failure Investigation
```markdown
# Investigation: Tenant Data Isolation Breach

**Severity:** CRITICAL
**Date:** [YYYY-MM-DD]
**Investigator:** [Name]

## Problem Statement
[Describe the isolation failure]
- Affected tenants: [IDs]
- Data exposed: [Type]
- Discovery method: [How found]
- Potential impact: [Assessment]

## Investigation Steps

### 1. Database Query Analysis
- [ ] Review query logs for tenant_id filters
- [ ] Check for missing WHERE clauses
- [ ] Audit all multi-tenant queries
- [ ] Verify row-level security policies
- [ ] Check connection pool isolation

**Findings:**
[Document findings]

### 2. Application Layer Analysis
- [ ] Review tenant context middleware
- [ ] Check session management
- [ ] Verify API authentication
- [ ] Audit request scoping
- [ ] Check cache key isolation

**Findings:**
[Document findings]

### 3. Data Exposure Assessment
- [ ] Identify what data was exposed
- [ ] Determine exposure duration
- [ ] List affected users
- [ ] Assess compliance impact (GDPR, SOC 2)
- [ ] Calculate breach severity

**Findings:**
[Document findings]

### 4. Security Audit
- [ ] Review access control lists
- [ ] Check authentication flows
- [ ] Verify authorization logic
- [ ] Audit tenant switching mechanisms
- [ ] Review admin access patterns

**Findings:**
[Document findings]

## Root Cause
[Identify the root cause]

## Immediate Actions Taken
[What was done immediately]

## Long-term Remediation
[Permanent fixes implemented]

## Compliance Notifications
- [ ] GDPR breach notification (if applicable)
- [ ] SOC 2 incident report
- [ ] Affected customer notification
- [ ] Legal team notification

## Prevention Measures
- [ ] Implement database-level RLS
- [ ] Add automated tenant isolation tests
- [ ] Create multi-tenant query linter
- [ ] Mandatory security code review
- [ ] Regular security audits
```

---

## Performance Baselines

### E-commerce Targets
- **Product Page Load**: <2 seconds (LCP)
- **Search Results**: <500ms
- **Cart Operations**: <200ms
- **Checkout Flow**: <3 seconds total
- **Payment Processing**: <3 seconds
- **Product Images**: <1 second (CDN)

### SaaS Application Targets
- **Dashboard Load**: <2 seconds
- **Feature Flag Check**: <10ms
- **Subscription Check**: <50ms
- **Tenant Switch**: <500ms
- **API Response**: <200ms (p95)
- **WebSocket Latency**: <100ms

### CMS Targets
- **Editor Load**: <1 second
- **Content Save**: <500ms
- **Publish to CDN**: <5 seconds
- **Media Upload**: <2 seconds/MB
- **Search**: <200ms
- **Preview Generation**: <3 seconds

### Social Platform Targets
- **Feed Load**: <1 second (initial)
- **Infinite Scroll**: <500ms per page
- **Real-time Updates**: <100ms latency
- **Media Processing**: <10 seconds
- **Notification Delivery**: <200ms
- **Post Creation**: <500ms

---

## Testing Strategies

### E-commerce Testing
```typescript
// Checkout flow test
describe('Checkout Flow', () => {
  it('should complete purchase within 5 seconds', async () => {
    const startTime = Date.now();

    await addToCart('product-123');
    await proceedToCheckout();
    await fillShippingInfo(shippingData);
    await fillPaymentInfo(paymentData);
    await submitOrder();

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(5000);

    console.log(`[TRINITY TEST] Checkout completed in ${duration}ms`);
  });

  it('should handle payment failures gracefully', async () => {
    const result = await processPayment({
      ...validPaymentData,
      card: '4000000000000002' // Declined card
    });

    expect(result.error).toBeDefined();
    expect(result.error.message).toContain('declined');

    console.log('[TRINITY TEST] Payment failure handled correctly');
  });
});
```

### SaaS Multi-tenancy Testing
```typescript
describe('Tenant Isolation', () => {
  it('should never leak data between tenants', async () => {
    const tenant1 = await createTestTenant();
    const tenant2 = await createTestTenant();

    const data1 = await fetchDataAs(tenant1);
    const data2 = await fetchDataAs(tenant2);

    expect(data1).not.toContainAnyFrom(data2);
    expect(data2).not.toContainAnyFrom(data1);

    console.log('[TRINITY TEST] Tenant isolation verified');
  });
});
```

---

## Crisis Recovery

### Scenario 1: Payment Gateway Outage
**Symptoms:**
- All payments failing
- Gateway returning 503 errors
- Revenue dropping to $0

**Trinity Recovery:**
1. Switch to backup payment processor
2. Queue failed payments for retry
3. Notify customers of temporary issues
4. Monitor gateway status page

### Scenario 2: Media CDN Failure
**Symptoms:**
- Product images not loading
- User avatars missing
- Media upload failures

**Trinity Recovery:**
1. Failover to backup CDN
2. Serve cached versions from edge
3. Temporarily disable new uploads
4. Notify users of reduced functionality

### Scenario 3: Feed Algorithm Crash
**Symptoms:**
- Empty feeds for all users
- Redis sorted set corruption
- Feed service errors

**Trinity Recovery:**
1. Fallback to chronological feed
2. Rebuild Redis sorted sets
3. Clear corrupted cache
4. Gradually restore algorithm

### Scenario 4: Subscription Billing Failure
**Symptoms:**
- Stripe webhooks failing
- Subscriptions not renewing
- Access not revoked for non-payment

**Trinity Recovery:**
1. Queue webhook events
2. Manual subscription status check
3. Reconcile with Stripe API
4. Restore webhook processing

---

## Quality Gates

### Pre-commit Hooks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: e2e-checkout-test
        name: E-commerce Checkout Test
        entry: npm run test:checkout
        language: system
        pass_filenames: false

      - id: tenant-isolation-test
        name: Tenant Isolation Test
        entry: npm run test:tenant-isolation
        language: system
        pass_filenames: false

      - id: performance-budget
        name: Performance Budget Check
        entry: npm run test:performance
        language: system
        pass_filenames: false
```

### CI/CD Performance Testing
```yaml
# .github/workflows/performance.yml
name: Web App Performance Tests

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --config=.lighthouserc.json

      - name: Check performance scores
        run: |
          if [ $(cat lighthouse-report.json | jq '.performance') < 90 ]; then
            echo "Performance score below 90"
            exit 1
          fi
```

---

**Trinity Method for Web Applications v1.0**

From e-commerce to social platforms, investigation-first development ensures reliable, performant web applications.
