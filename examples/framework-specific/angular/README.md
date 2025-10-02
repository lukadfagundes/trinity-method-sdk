# Angular Trinity Method Example

## Project Profile

- **Frontend**: Angular 17+ (Standalone Components)
- **State Management**: NgRx + Signals
- **Styling**: Angular Material + Tailwind CSS
- **Backend**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Angular Guards + JWT + OAuth2
- **HTTP**: HttpClient with Interceptors
- **Testing**: Jasmine + Karma + Cypress + Spectator
- **Build**: Angular CLI + esbuild
- **Deployment**: Firebase Hosting / Vercel
- **Type Safety**: TypeScript 5+

## Trinity Method Deployment

### Deployment Command

```bash
trinity deploy --name="MyAngularApp"
```

Or use universal deployment:

```
Initialize Trinity Method for MyAngularApp Angular 17 project. Analyze the Angular application structure with standalone components, identify services and components, detect NgRx state management and Signals reactivity, recognize Angular Guards and authentication patterns, and generate Trinity Method documentation optimized for modern Angular development.
```

## Generated Trinity Method Documents

### Core Documents
- `CLAUDE.md` - Claude Code configuration and project memory
- `TRINITY.md` - Trinity Method overview for Angular

### Knowledge Base (trinity/knowledge-base/)
- `Trinity.md` - Main Trinity Method documentation
- `ARCHITECTURE.md` - Angular architecture analysis
- `To-do.md` - Current tasks and work orders
- `ISSUES.md` - Known issues database

### Investigations (trinity/investigations/)
Investigation reports following Angular patterns:
- Component lifecycle debugging
- NgRx state debugging
- Change detection analysis
- Performance profiling

### Work Orders (trinity/work-orders/)
Example work orders for Angular development:
- Component implementation
- Service creation
- State management setup
- Performance optimization

### Patterns (trinity/patterns/)
Discovered Angular patterns:
- Standalone component patterns
- Signal reactivity patterns
- RxJS operators patterns
- Dependency injection patterns

## Framework-Specific Adaptations

### Angular Component Debugging

**Standalone Component with Trinity Debugging:**
```typescript
// trinity/patterns/component-debugging.ts
// Angular standalone component with Trinity debugging

import { Component, OnInit, OnDestroy, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-list">
      <h2>Users ({{ users().length }})</h2>
      <div *ngFor="let user of users()">{{ user.name }}</div>
    </div>
  `
})
export class UserListComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  // Signals for reactive state
  users = signal<User[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private componentName = 'UserListComponent';
  private mountTime = Date.now();
  private renderCount = 0;

  constructor() {
    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'Constructor',
      timestamp: new Date().toISOString()
    });

    // Track signal changes
    effect(() => {
      const userCount = this.users().length;
      console.log('[TRINITY SIGNAL]', {
        component: this.componentName,
        signal: 'users',
        count: userCount,
        timestamp: new Date().toISOString()
      });
    });

    effect(() => {
      const isLoading = this.loading();
      console.log('[TRINITY SIGNAL]', {
        component: this.componentName,
        signal: 'loading',
        value: isLoading,
        timestamp: new Date().toISOString()
      });
    });
  }

  ngOnInit(): void {
    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'OnInit',
      timeSinceConstruct: `${Date.now() - this.mountTime}ms`
    });

    this.loadUsers();
  }

  ngAfterViewInit(): void {
    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'AfterViewInit',
      timeSinceConstruct: `${Date.now() - this.mountTime}ms`
    });
  }

  ngDoCheck(): void {
    this.renderCount++;

    console.log('[TRINITY CHANGE DETECTION]', {
      component: this.componentName,
      renderCount: this.renderCount,
      timeSinceMount: `${Date.now() - this.mountTime}ms`
    });

    // Warn on excessive renders
    if (this.renderCount > 20) {
      console.warn('[TRINITY PERFORMANCE]', {
        component: this.componentName,
        warning: 'Excessive change detection cycles',
        count: this.renderCount
      });
    }
  }

  ngOnDestroy(): void {
    const lifetime = Date.now() - this.mountTime;

    console.log('[TRINITY LIFECYCLE]', {
      component: this.componentName,
      event: 'OnDestroy',
      lifetime: `${lifetime}ms`,
      totalRenders: this.renderCount
    });
  }

  private loadUsers(): void {
    const startTime = Date.now();
    this.loading.set(true);

    console.log('[TRINITY ACTION]', {
      component: this.componentName,
      action: 'loadUsers',
      timestamp: new Date().toISOString()
    });

    this.userService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          const duration = Date.now() - startTime;

          this.users.set(users);
          this.loading.set(false);

          console.log('[TRINITY ACTION SUCCESS]', {
            component: this.componentName,
            action: 'loadUsers',
            count: users.length,
            duration: `${duration}ms`
          });

          if (duration > 1000) {
            console.warn('[TRINITY PERFORMANCE]', {
              component: this.componentName,
              action: 'loadUsers',
              warning: 'Slow data load',
              duration: `${duration}ms`
            });
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          this.error.set(error.message);
          this.loading.set(false);

          console.error('[TRINITY ACTION ERROR]', {
            component: this.componentName,
            action: 'loadUsers',
            error: error.message,
            duration: `${duration}ms`
          });
        }
      });
  }
}
```

### Angular Service Debugging

**Service with Trinity Logging:**
```typescript
// trinity/patterns/service-debugging.ts
// Angular service with Trinity debugging

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';
  private serviceName = 'UserService';

  constructor() {
    console.log('[TRINITY SERVICE]', {
      service: this.serviceName,
      event: 'Initialized',
      timestamp: new Date().toISOString()
    });
  }

  getUsers(): Observable<User[]> {
    const startTime = Date.now();
    const requestId = Date.now().toString();

    console.log('[TRINITY HTTP]', {
      requestId,
      service: this.serviceName,
      method: 'GET',
      url: this.apiUrl,
      timestamp: new Date().toISOString()
    });

    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => {
        const duration = Date.now() - startTime;

        console.log('[TRINITY HTTP SUCCESS]', {
          requestId,
          service: this.serviceName,
          method: 'GET',
          url: this.apiUrl,
          count: users.length,
          duration: `${duration}ms`
        });

        if (duration > 500) {
          console.warn('[TRINITY HTTP SLOW]', {
            requestId,
            url: this.apiUrl,
            duration: `${duration}ms`,
            threshold: '500ms'
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const duration = Date.now() - startTime;

        console.error('[TRINITY HTTP ERROR]', {
          requestId,
          service: this.serviceName,
          method: 'GET',
          url: this.apiUrl,
          status: error.status,
          message: error.message,
          duration: `${duration}ms`
        });

        return throwError(() => error);
      }),
      finalize(() => {
        console.log('[TRINITY HTTP]', {
          requestId,
          event: 'Request completed',
          duration: `${Date.now() - startTime}ms`
        });
      })
    );
  }

  createUser(userData: CreateUserDto): Observable<User> {
    const startTime = Date.now();
    const requestId = Date.now().toString();

    console.log('[TRINITY HTTP]', {
      requestId,
      service: this.serviceName,
      method: 'POST',
      url: this.apiUrl,
      data: userData
    });

    return this.http.post<User>(this.apiUrl, userData).pipe(
      tap(user => {
        const duration = Date.now() - startTime;

        console.log('[TRINITY HTTP SUCCESS]', {
          requestId,
          service: this.serviceName,
          method: 'POST',
          userId: user.id,
          duration: `${duration}ms`
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('[TRINITY HTTP ERROR]', {
          requestId,
          service: this.serviceName,
          method: 'POST',
          status: error.status,
          error: error.error
        });

        return throwError(() => error);
      })
    );
  }
}
```

### HTTP Interceptor Debugging

**Logging Interceptor:**
```typescript
// trinity/patterns/http-interceptor-debugging.ts
// HTTP interceptor with Trinity debugging

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const trinityLoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  console.log('[TRINITY HTTP INTERCEPTOR]', {
    requestId,
    method: req.method,
    url: req.url,
    headers: req.headers.keys(),
    timestamp: new Date().toISOString()
  });

  return next(req).pipe(
    tap(event => {
      if (event.type === 4) { // HttpResponse
        const duration = Date.now() - startTime;

        console.log('[TRINITY HTTP RESPONSE]', {
          requestId,
          status: event.status,
          url: req.url,
          duration: `${duration}ms`
        });

        // Performance warning
        if (duration > 1000) {
          console.warn('[TRINITY HTTP SLOW]', {
            requestId,
            url: req.url,
            duration: `${duration}ms`,
            threshold: '1000ms'
          });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;

      console.error('[TRINITY HTTP ERROR]', {
        requestId,
        method: req.method,
        url: req.url,
        status: error.status,
        message: error.message,
        duration: `${duration}ms`
      });

      return throwError(() => error);
    }),
    finalize(() => {
      const duration = Date.now() - startTime;
      console.log('[TRINITY HTTP COMPLETE]', {
        requestId,
        duration: `${duration}ms`
      });
    })
  );
};

// Authentication interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[TRINITY AUTH INTERCEPTOR]', {
    url: req.url,
    hasToken: !!token,
    timestamp: new Date().toISOString()
  });

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('[TRINITY AUTH]', {
      action: 'Token added to request',
      url: req.url
    });
  } else {
    console.warn('[TRINITY AUTH]', {
      warning: 'No token available',
      url: req.url
    });
  }

  return next(req);
};
```

### NgRx State Management Debugging

**Store with Trinity Debugging:**
```typescript
// trinity/patterns/ngrx-debugging.ts
// NgRx store with Trinity debugging

import { createAction, createReducer, createSelector, on, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

// Actions
export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

// State
export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null
};

// Reducer with debugging
export const usersReducer = createReducer(
  initialState,
  on(loadUsers, (state) => {
    console.log('[TRINITY NGRX REDUCER]', {
      action: 'loadUsers',
      previousState: state,
      timestamp: new Date().toISOString()
    });

    return {
      ...state,
      loading: true,
      error: null
    };
  }),
  on(loadUsersSuccess, (state, { users }) => {
    console.log('[TRINITY NGRX REDUCER]', {
      action: 'loadUsersSuccess',
      userCount: users.length,
      previousState: state,
      timestamp: new Date().toISOString()
    });

    return {
      ...state,
      users,
      loading: false
    };
  }),
  on(loadUsersFailure, (state, { error }) => {
    console.error('[TRINITY NGRX REDUCER]', {
      action: 'loadUsersFailure',
      error,
      previousState: state,
      timestamp: new Date().toISOString()
    });

    return {
      ...state,
      loading: false,
      error
    };
  })
);

// Effects with debugging
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUsers),
      tap(() => {
        console.log('[TRINITY NGRX EFFECT]', {
          effect: 'loadUsers$',
          action: 'loadUsers',
          timestamp: new Date().toISOString()
        });
      }),
      switchMap(() => {
        const startTime = Date.now();

        return this.userService.getUsers().pipe(
          map(users => {
            const duration = Date.now() - startTime;

            console.log('[TRINITY NGRX EFFECT SUCCESS]', {
              effect: 'loadUsers$',
              userCount: users.length,
              duration: `${duration}ms`
            });

            return loadUsersSuccess({ users });
          }),
          catchError(error => {
            const duration = Date.now() - startTime;

            console.error('[TRINITY NGRX EFFECT ERROR]', {
              effect: 'loadUsers$',
              error: error.message,
              duration: `${duration}ms`
            });

            return of(loadUsersFailure({ error: error.message }));
          })
        );
      })
    );
  });
}

// Selectors with debugging
export const selectUsersState = (state: AppState) => {
  console.log('[TRINITY NGRX SELECTOR]', {
    selector: 'selectUsersState',
    state: state.users
  });
  return state.users;
};

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => {
    console.log('[TRINITY NGRX SELECTOR]', {
      selector: 'selectAllUsers',
      count: state.users.length
    });
    return state.users;
  }
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);
```

### Angular Guards Debugging

**Auth Guard with Trinity Debugging:**
```typescript
// trinity/patterns/guard-debugging.ts
// Angular guard with Trinity debugging

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[TRINITY GUARD]', {
    guard: 'authGuard',
    route: state.url,
    timestamp: new Date().toISOString()
  });

  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    console.log('[TRINITY GUARD]', {
      guard: 'authGuard',
      result: 'ALLOWED',
      route: state.url,
      user: authService.getCurrentUser()
    });

    return true;
  }

  console.warn('[TRINITY GUARD]', {
    guard: 'authGuard',
    result: 'DENIED',
    route: state.url,
    reason: 'Not authenticated',
    redirectTo: '/login'
  });

  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

// Role-based guard
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('[TRINITY GUARD]', {
      guard: 'roleGuard',
      requiredRole,
      route: state.url,
      timestamp: new Date().toISOString()
    });

    const user = authService.getCurrentUser();

    if (!user) {
      console.warn('[TRINITY GUARD]', {
        guard: 'roleGuard',
        result: 'DENIED',
        reason: 'No user',
        redirectTo: '/login'
      });

      router.navigate(['/login']);
      return false;
    }

    const hasRole = user.roles.includes(requiredRole);

    if (hasRole) {
      console.log('[TRINITY GUARD]', {
        guard: 'roleGuard',
        result: 'ALLOWED',
        route: state.url,
        user: user.id,
        role: requiredRole
      });

      return true;
    }

    console.warn('[TRINITY GUARD]', {
      guard: 'roleGuard',
      result: 'DENIED',
      route: state.url,
      user: user.id,
      requiredRole,
      userRoles: user.roles,
      redirectTo: '/unauthorized'
    });

    router.navigate(['/unauthorized']);
    return false;
  };
};
```

## Investigation Templates

### Angular Performance Investigation

```markdown
# Angular Performance Investigation

## Current Metrics

### Change Detection
- Change detection cycles: [X] per second
- Zone.js overhead: [X]ms
- Average CD duration: [X]ms

### Component Rendering
- Component count: [X]
- Average render time: [X]ms
- Re-renders per interaction: [X]

### Bundle Size
- Initial bundle: [X]KB (target: <500KB)
- Lazy-loaded routes: [X] routes
- Total bundle: [X]KB

## Investigation Steps

### 1. Change Detection Analysis
- [ ] Profile with Angular DevTools
- [ ] Check OnPush usage
- [ ] Review zone.js triggers
- [ ] Analyze expression complexity

### 2. Component Performance
- [ ] Profile component tree
- [ ] Check for unnecessary re-renders
- [ ] Review lifecycle hooks
- [ ] Analyze pipe usage

### 3. Bundle Optimization
- [ ] Run bundle analyzer
- [ ] Check lazy loading strategy
- [ ] Review third-party dependencies
- [ ] Analyze tree-shaking

### 4. Runtime Performance
- [ ] Profile with Chrome DevTools
- [ ] Check memory leaks
- [ ] Review RxJS subscriptions
- [ ] Monitor HTTP requests

## Optimization Opportunities
1. [Specific optimization]
2. [Specific optimization]
3. [Specific optimization]
```

### NgRx State Investigation

```markdown
# NgRx State Investigation

## Current State Analysis

### Store Structure
- Feature states: [count]
- Total state size: [X]KB
- Selector count: [X]
- Effect count: [X]

## Investigation Steps

### 1. State Performance
- [ ] Profile selector execution
- [ ] Check memoization
- [ ] Review state shape
- [ ] Analyze normalization

### 2. Action Patterns
- [ ] Review action frequency
- [ ] Check action payload size
- [ ] Analyze action chains
- [ ] Review effect error handling

### 3. DevTools Analysis
- [ ] Enable time-travel debugging
- [ ] Review action history
- [ ] Analyze state snapshots
- [ ] Check for action storms

## Optimization Opportunities
1. [Specific optimization]
2. [Specific optimization]
```

## Performance Baselines

### Angular Performance Targets

```typescript
const performanceTargets = {
  // Change detection
  changeDetection: {
    cyclesPerSecond: '<60',
    averageDuration: '<10ms',
    maxDuration: '<50ms'
  },

  // Component rendering
  components: {
    initialRender: '<100ms',
    reRender: '<16ms', // 60fps
    treeDepth: '<10 levels'
  },

  // Bundle size
  bundle: {
    initial: '<500KB gzipped',
    perRoute: '<200KB gzipped',
    total: '<2MB gzipped'
  },

  // Runtime
  runtime: {
    memoryUsage: '<50MB',
    httpLatency: '<200ms',
    subscriptionLeaks: '0'
  },

  // Build performance
  build: {
    devBuild: '<5s',
    prodBuild: '<30s',
    aot: 'enabled'
  }
};
```

## Testing Strategies

### Jasmine/Karma Unit Testing

```typescript
// user-list.component.spec.ts
// Trinity Method Angular testing

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    console.log('[TRINITY TEST] Setting up UserListComponent test');

    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    console.log('[TRINITY TEST] Testing component creation');
    expect(component).toBeTruthy();
  });

  it('should load users on init', (done) => {
    console.log('[TRINITY TEST] Testing user loading');

    const mockUsers: User[] = [
      { id: '1', name: 'User 1', email: 'user1@test.com' },
      { id: '2', name: 'User 2', email: 'user2@test.com' }
    ];

    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.users()).toEqual(mockUsers);
      expect(component.loading()).toBe(false);
      console.log('[TRINITY TEST] User loading test passed');
      done();
    });
  });

  it('should handle loading error', (done) => {
    console.log('[TRINITY TEST] Testing error handling');

    const errorMessage = 'Load failed';
    userService.getUsers.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.error()).toBe(errorMessage);
      expect(component.loading()).toBe(false);
      console.log('[TRINITY TEST] Error handling test passed');
      done();
    });
  });
});
```

### Cypress E2E Testing

```typescript
// user-list.cy.ts
// Trinity Method E2E testing

describe('User List E2E', () => {
  beforeEach(() => {
    console.log('[TRINITY E2E] Starting user list test');
    cy.visit('/users');
  });

  it('should display user list', () => {
    console.log('[TRINITY E2E] Testing user list display');

    cy.intercept('GET', '/api/users', {
      fixture: 'users.json'
    }).as('getUsers');

    cy.wait('@getUsers');

    cy.get('.user-list').should('be.visible');
    cy.get('.user-list .user-item').should('have.length.greaterThan', 0);

    console.log('[TRINITY E2E] User list display test passed');
  });

  it('should handle user creation', () => {
    console.log('[TRINITY E2E] Testing user creation');

    cy.get('[data-test="create-user-btn"]').click();
    cy.get('[data-test="user-name"]').type('New User');
    cy.get('[data-test="user-email"]').type('newuser@test.com');
    cy.get('[data-test="submit-btn"]').click();

    cy.contains('User created successfully').should('be.visible');

    console.log('[TRINITY E2E] User creation test passed');
  });
});
```

## Crisis Recovery Procedures

### Common Angular Emergency Scenarios

```markdown
## 1. Change Detection Performance Issues

**Symptoms:**
- Slow UI responsiveness
- High CPU usage
- Janky animations

**Immediate Actions:**
```typescript
// Enable OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Profile with Angular DevTools
ng.profiler.timeChangeDetection()
```

**Investigation:**
- Check for zone.js pollution
- Review pipe usage
- Analyze component tree
- Check for expression complexity

**Prevention:**
- Use OnPush strategy
- Implement trackBy for *ngFor
- Avoid function calls in templates
- Use signals for reactive state

## 2. Memory Leaks

**Symptoms:**
- Increasing memory usage
- Slow performance over time
- Browser crashes

**Immediate Actions:**
```typescript
// Use takeUntilDestroyed
private destroyRef = inject(DestroyRef);

this.service.getData()
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(/*...*/);

// Profile with Chrome DevTools
// Take heap snapshot
// Compare snapshots over time
```

**Investigation:**
- Check subscription cleanup
- Review event listener management
- Analyze component lifecycle
- Check for circular references

## 3. NgRx Action Storms

**Symptoms:**
- Excessive actions dispatched
- UI freezing
- State inconsistencies

**Immediate Actions:**
- Enable NgRx DevTools
- Review action history
- Check effect chains
- Analyze selector execution

**Prevention:**
- Debounce user actions
- Use proper action grouping
- Implement effect error handling
- Review selector memoization

## 4. Build Failures

**Symptoms:**
- Production build fails
- Type errors
- Template errors

**Immediate Actions:**
```bash
# Clear caches
rm -rf node_modules .angular
npm install

# Check for type errors
ng build --configuration production

# Enable verbose output
ng build --verbose
```

**Investigation:**
- Check Angular/TypeScript versions
- Review template syntax
- Analyze AOT compilation errors
- Check dependency compatibility
```

## Quality Gates

### Angular-Specific Quality Checks

```typescript
// Pre-commit quality gates
const qualityGates = {
  // Linting
  linting: 'ng lint',

  // Type checking
  typeCheck: 'tsc --noEmit',

  // Testing
  unitTests: 'ng test --watch=false --code-coverage --browsers=ChromeHeadless',
  e2eTests: 'ng e2e',

  // Coverage thresholds
  coverage: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  },

  // Build verification
  buildCheck: 'ng build --configuration production',

  // Bundle analysis
  bundleAnalyzer: 'ng build --stats-json && webpack-bundle-analyzer dist/stats.json',

  // Accessibility
  a11y: 'ng test --include="**/*.a11y.spec.ts"'
};
```

## Deployment Notes

This example demonstrates Trinity Method patterns for:
- Angular 17 standalone components debugging
- Signal-based reactivity monitoring
- NgRx state management debugging
- HTTP interceptor logging
- Angular Guards authentication
- Change detection profiling
- Jasmine/Karma testing strategies
- Cypress E2E testing
- Production crisis recovery

Use `/trinity-init` after deployment to activate all agents and begin Angular development with full Trinity Method support.
