# API Service Trinity Method Examples

Trinity Method optimizations for different types of API services and microservices architectures.

## Table of Contents
1. [RESTful API Services](#restful-api-services)
2. [GraphQL APIs](#graphql-apis)
3. [Microservices Architecture](#microservices-architecture)
4. [Real-time APIs](#real-time-apis)
5. [Investigation Templates](#investigation-templates)
6. [Performance Baselines](#performance-baselines)
7. [Testing Strategies](#testing-strategies)
8. [Crisis Recovery](#crisis-recovery)
9. [Quality Gates](#quality-gates)

---

## RESTful API Services

### Framework
- **Backend**: FastAPI + PostgreSQL
- **ORM**: SQLAlchemy 2.0 (async)
- **Validation**: Pydantic v2
- **Authentication**: JWT with refresh tokens
- **Documentation**: OpenAPI/Swagger auto-generated

### Trinity Method Debugging Pattern

#### FastAPI Endpoint with Trinity Logging
```python
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
app = FastAPI()

@app.post("/api/users", status_code=201)
async def create_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create user endpoint with Trinity debugging"""
    start_time = datetime.now()
    endpoint_name = "create_user"

    logger.info(f"[TRINITY ENDPOINT] {endpoint_name} started", extra={
        "endpoint": endpoint_name,
        "method": "POST",
        "data": user_data.dict(exclude={'password'}),
        "timestamp": start_time.isoformat()
    })

    try:
        # Check if user exists
        existing_user = await db.execute(
            select(User).where(User.email == user_data.email)
        )
        existing = existing_user.scalar_one_or_none()

        if existing:
            logger.warning(f"[TRINITY VALIDATION] User already exists", extra={
                "endpoint": endpoint_name,
                "email": user_data.email,
                "reason": "duplicate_email"
            })
            raise HTTPException(status_code=400, detail="User already exists")

        # Create user
        db_start = datetime.now()
        new_user = User(**user_data.dict())
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        db_duration = (datetime.now() - db_start).total_seconds() * 1000

        logger.info(f"[TRINITY DATABASE] User created", extra={
            "endpoint": endpoint_name,
            "operation": "insert",
            "table": "users",
            "duration_ms": db_duration
        })

        # Success
        total_duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.info(f"[TRINITY ENDPOINT] {endpoint_name} completed", extra={
            "endpoint": endpoint_name,
            "status": "success",
            "user_id": new_user.id,
            "duration_ms": total_duration
        })

        if total_duration > 200:
            logger.warning(f"[TRINITY PERFORMANCE] Slow endpoint", extra={
                "endpoint": endpoint_name,
                "duration_ms": total_duration,
                "threshold_ms": 200
            })

        return new_user

    except HTTPException:
        raise
    except Exception as e:
        duration = (datetime.now() - start_time).total_seconds() * 1000

        logger.error(f"[TRINITY ENDPOINT ERROR] {endpoint_name} failed", extra={
            "endpoint": endpoint_name,
            "error": str(e),
            "error_type": type(e).__name__,
            "duration_ms": duration
        }, exc_info=True)

        raise HTTPException(status_code=500, detail="Internal server error")
```

#### Middleware Debugging
```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import time

class TrinityLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        request_id = str(uuid.uuid4())

        logger.info(f"[TRINITY REQUEST]", extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client_ip": request.client.host,
            "user_agent": request.headers.get("user-agent"),
            "timestamp": datetime.now().isoformat()
        })

        # Process request
        response = await call_next(request)

        duration = (time.time() - start_time) * 1000

        logger.info(f"[TRINITY RESPONSE]", extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration
        })

        if duration > 1000:
            logger.warning(f"[TRINITY PERFORMANCE] Slow request", extra={
                "request_id": request_id,
                "path": request.url.path,
                "duration_ms": duration,
                "threshold_ms": 1000
            })

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration:.2f}ms"

        return response

app.add_middleware(TrinityLoggingMiddleware)
```

---

## GraphQL APIs

### Framework
- **Server**: Apollo Server 4 + TypeScript
- **Schema**: GraphQL Code Generator
- **Database**: MongoDB with Mongoose
- **Caching**: Redis for DataLoader
- **Authentication**: JWT in context

### Trinity Method Debugging Pattern

#### Resolver with Trinity Logging
```typescript
import { IResolvers } from '@graphql-tools/utils';
import { GraphQLError } from 'graphql';

const resolvers: IResolvers = {
  Query: {
    user: async (_parent, { id }, context) => {
      const resolverName = 'Query.user';
      const startTime = Date.now();

      console.log('[TRINITY RESOLVER]', {
        resolver: resolverName,
        operation: 'query',
        args: { id },
        userId: context.user?.id,
        timestamp: new Date().toISOString()
      });

      try {
        // Check cache first
        const cached = await context.redis.get(`user:${id}`);
        if (cached) {
          const duration = Date.now() - startTime;

          console.log('[TRINITY CACHE HIT]', {
            resolver: resolverName,
            key: `user:${id}`,
            duration: `${duration}ms`
          });

          return JSON.parse(cached);
        }

        // Database query
        const dbStart = Date.now();
        const user = await context.dataSources.users.findById(id);
        const dbDuration = Date.now() - dbStart;

        if (!user) {
          console.warn('[TRINITY RESOLVER]', {
            resolver: resolverName,
            warning: 'User not found',
            id
          });

          throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' }
          });
        }

        // Cache result
        await context.redis.setex(`user:${id}`, 300, JSON.stringify(user));

        const totalDuration = Date.now() - startTime;

        console.log('[TRINITY RESOLVER SUCCESS]', {
          resolver: resolverName,
          userId: user.id,
          dbDuration: `${dbDuration}ms`,
          totalDuration: `${totalDuration}ms`
        });

        if (totalDuration > 100) {
          console.warn('[TRINITY PERFORMANCE]', {
            resolver: resolverName,
            warning: 'Slow resolver',
            duration: `${totalDuration}ms`,
            threshold: '100ms'
          });
        }

        return user;

      } catch (error) {
        const duration = Date.now() - startTime;

        console.error('[TRINITY RESOLVER ERROR]', {
          resolver: resolverName,
          error: error.message,
          stack: error.stack,
          duration: `${duration}ms`
        });

        throw error;
      }
    }
  },

  User: {
    posts: async (parent, _args, context) => {
      const resolverName = 'User.posts';
      const startTime = Date.now();

      console.log('[TRINITY FIELD RESOLVER]', {
        resolver: resolverName,
        parentType: 'User',
        parentId: parent.id,
        timestamp: new Date().toISOString()
      });

      try {
        // Use DataLoader to prevent N+1
        const posts = await context.loaders.postsByUserId.load(parent.id);
        const duration = Date.now() - startTime;

        console.log('[TRINITY FIELD RESOLVER SUCCESS]', {
          resolver: resolverName,
          userId: parent.id,
          postsCount: posts.length,
          duration: `${duration}ms`
        });

        return posts;

      } catch (error) {
        console.error('[TRINITY FIELD RESOLVER ERROR]', {
          resolver: resolverName,
          parentId: parent.id,
          error: error.message
        });

        return [];
      }
    }
  }
};
```

#### Apollo Server Plugin for Trinity
```typescript
import { ApolloServerPlugin } from '@apollo/server';

export const trinityPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    const startTime = Date.now();
    let operationName: string;

    return {
      async didResolveOperation(requestContext) {
        operationName = requestContext.operationName || 'anonymous';

        console.log('[TRINITY GRAPHQL OPERATION]', {
          operationName,
          operationType: requestContext.operation.operation,
          variables: requestContext.request.variables,
          timestamp: new Date().toISOString()
        });
      },

      async willSendResponse(requestContext) {
        const duration = Date.now() - startTime;

        if (requestContext.errors) {
          console.error('[TRINITY GRAPHQL ERROR]', {
            operationName,
            errors: requestContext.errors.map(e => ({
              message: e.message,
              path: e.path,
              code: e.extensions?.code
            })),
            duration: `${duration}ms`
          });
        } else {
          console.log('[TRINITY GRAPHQL SUCCESS]', {
            operationName,
            duration: `${duration}ms`
          });

          if (duration > 500) {
            console.warn('[TRINITY PERFORMANCE]', {
              operationName,
              warning: 'Slow GraphQL operation',
              duration: `${duration}ms`,
              threshold: '500ms'
            });
          }
        }
      }
    };
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [trinityPlugin]
});
```

---

## Microservices Architecture

### Framework
- **Framework**: NestJS + TypeScript
- **Communication**: gRPC + RabbitMQ
- **Service Discovery**: Consul
- **Orchestration**: Docker + Kubernetes
- **Tracing**: OpenTelemetry + Jaeger

### Trinity Method Debugging Pattern

#### NestJS Service with Trinity Logging
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly serviceName = 'UserService';

  constructor(
    @Inject('USER_PACKAGE') private client: ClientGrpc,
    private readonly eventBus: EventBusService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const methodName = 'createUser';
    const startTime = Date.now();
    const traceId = uuidv4();

    this.logger.log(`[TRINITY SERVICE] ${methodName} started`, {
      service: this.serviceName,
      method: methodName,
      traceId,
      data: { ...createUserDto, password: '[REDACTED]' },
      timestamp: new Date().toISOString()
    });

    try {
      // Validate user data
      const validationStart = Date.now();
      await this.validateUserData(createUserDto);
      const validationDuration = Date.now() - validationStart;

      this.logger.debug(`[TRINITY VALIDATION]`, {
        service: this.serviceName,
        method: methodName,
        traceId,
        duration: `${validationDuration}ms`
      });

      // Call gRPC service
      const grpcStart = Date.now();
      const userServiceClient = this.client.getService<UserServiceClient>('UserService');
      const user = await firstValueFrom(
        userServiceClient.createUser(createUserDto)
      );
      const grpcDuration = Date.now() - grpcStart;

      this.logger.log(`[TRINITY GRPC CALL]`, {
        service: this.serviceName,
        method: methodName,
        traceId,
        grpcService: 'UserService',
        grpcMethod: 'createUser',
        duration: `${grpcDuration}ms`
      });

      // Publish event
      const eventStart = Date.now();
      await this.eventBus.publish(new UserCreatedEvent(user));
      const eventDuration = Date.now() - eventStart;

      this.logger.debug(`[TRINITY EVENT]`, {
        service: this.serviceName,
        method: methodName,
        traceId,
        event: 'UserCreatedEvent',
        duration: `${eventDuration}ms`
      });

      // Success
      const totalDuration = Date.now() - startTime;

      this.logger.log(`[TRINITY SERVICE SUCCESS]`, {
        service: this.serviceName,
        method: methodName,
        traceId,
        userId: user.id,
        totalDuration: `${totalDuration}ms`
      });

      if (totalDuration > 1000) {
        this.logger.warn(`[TRINITY PERFORMANCE]`, {
          service: this.serviceName,
          method: methodName,
          traceId,
          warning: 'Slow service method',
          duration: `${totalDuration}ms`,
          threshold: '1000ms'
        });
      }

      return user;

    } catch (error) {
      const duration = Date.now() - startTime;

      this.logger.error(`[TRINITY SERVICE ERROR]`, {
        service: this.serviceName,
        method: methodName,
        traceId,
        error: error.message,
        stack: error.stack,
        duration: `${duration}ms`
      });

      throw error;
    }
  }
}
```

#### Circuit Breaker with Trinity Logging
```typescript
import { Injectable } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private breakers = new Map<string, CircuitBreaker>();

  createBreaker<T>(
    name: string,
    fn: (...args: any[]) => Promise<T>,
    options?: CircuitBreaker.Options
  ): CircuitBreaker<any[], T> {
    const breaker = new CircuitBreaker(fn, {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      ...options
    });

    // Trinity logging for circuit breaker events
    breaker.on('open', () => {
      this.logger.error(`[TRINITY CIRCUIT BREAKER]`, {
        breaker: name,
        state: 'OPEN',
        message: 'Circuit breaker opened - too many failures',
        timestamp: new Date().toISOString()
      });
    });

    breaker.on('halfOpen', () => {
      this.logger.warn(`[TRINITY CIRCUIT BREAKER]`, {
        breaker: name,
        state: 'HALF_OPEN',
        message: 'Circuit breaker attempting recovery',
        timestamp: new Date().toISOString()
      });
    });

    breaker.on('close', () => {
      this.logger.log(`[TRINITY CIRCUIT BREAKER]`, {
        breaker: name,
        state: 'CLOSED',
        message: 'Circuit breaker closed - service recovered',
        timestamp: new Date().toISOString()
      });
    });

    breaker.on('failure', (error) => {
      this.logger.warn(`[TRINITY CIRCUIT BREAKER]`, {
        breaker: name,
        event: 'FAILURE',
        error: error.message,
        stats: breaker.stats
      });
    });

    breaker.on('success', () => {
      this.logger.debug(`[TRINITY CIRCUIT BREAKER]`, {
        breaker: name,
        event: 'SUCCESS',
        stats: breaker.stats
      });
    });

    this.breakers.set(name, breaker);
    return breaker;
  }
}
```

---

## Real-time APIs

### Framework
- **WebSocket**: Socket.io 4 + TypeScript
- **Message Queue**: Redis Pub/Sub
- **Session Store**: Redis
- **Authentication**: JWT in handshake
- **Scaling**: Socket.io Redis Adapter

### Trinity Method Debugging Pattern

#### Socket.io Server with Trinity Logging
```typescript
import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

class TrinitySocketServer {
  private io: Server;
  private readonly serviceName = 'SocketServer';

  constructor() {
    this.io = new Server({
      cors: { origin: '*' },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupRedisAdapter();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      const startTime = Date.now();

      console.log('[TRINITY SOCKET AUTH]', {
        service: this.serviceName,
        event: 'authentication',
        socketId: socket.id,
        clientIp: socket.handshake.address,
        timestamp: new Date().toISOString()
      });

      try {
        const user = this.verifyToken(token);
        socket.data.user = user;

        const duration = Date.now() - startTime;

        console.log('[TRINITY SOCKET AUTH SUCCESS]', {
          service: this.serviceName,
          socketId: socket.id,
          userId: user.id,
          duration: `${duration}ms`
        });

        next();
      } catch (error) {
        console.error('[TRINITY SOCKET AUTH ERROR]', {
          service: this.serviceName,
          socketId: socket.id,
          error: error.message
        });

        next(new Error('Authentication failed'));
      }
    });

    // Logging middleware
    this.io.use((socket, next) => {
      const originalEmit = socket.emit;

      socket.emit = function(event: string, ...args: any[]) {
        console.log('[TRINITY SOCKET EMIT]', {
          service: 'SocketServer',
          socketId: socket.id,
          userId: socket.data.user?.id,
          event,
          dataSize: JSON.stringify(args).length,
          timestamp: new Date().toISOString()
        });

        return originalEmit.apply(socket, [event, ...args]);
      };

      next();
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const connectionTime = Date.now();

      console.log('[TRINITY SOCKET CONNECTION]', {
        service: this.serviceName,
        event: 'connect',
        socketId: socket.id,
        userId: socket.data.user?.id,
        transport: socket.conn.transport.name,
        timestamp: new Date().toISOString()
      });

      // Join user room
      socket.join(`user:${socket.data.user.id}`);

      // Message handler
      socket.on('message', async (data) => {
        const startTime = Date.now();

        console.log('[TRINITY SOCKET MESSAGE]', {
          service: this.serviceName,
          event: 'message',
          socketId: socket.id,
          userId: socket.data.user.id,
          dataSize: JSON.stringify(data).length,
          timestamp: new Date().toISOString()
        });

        try {
          // Process message
          const result = await this.processMessage(socket.data.user, data);
          const duration = Date.now() - startTime;

          console.log('[TRINITY SOCKET MESSAGE SUCCESS]', {
            service: this.serviceName,
            socketId: socket.id,
            userId: socket.data.user.id,
            duration: `${duration}ms`
          });

          if (duration > 200) {
            console.warn('[TRINITY PERFORMANCE]', {
              service: this.serviceName,
              event: 'message',
              socketId: socket.id,
              warning: 'Slow message processing',
              duration: `${duration}ms`,
              threshold: '200ms'
            });
          }

          socket.emit('message:success', result);

        } catch (error) {
          const duration = Date.now() - startTime;

          console.error('[TRINITY SOCKET MESSAGE ERROR]', {
            service: this.serviceName,
            socketId: socket.id,
            userId: socket.data.user.id,
            error: error.message,
            duration: `${duration}ms`
          });

          socket.emit('message:error', { error: error.message });
        }
      });

      // Disconnect handler
      socket.on('disconnect', (reason) => {
        const sessionDuration = Date.now() - connectionTime;

        console.log('[TRINITY SOCKET DISCONNECT]', {
          service: this.serviceName,
          event: 'disconnect',
          socketId: socket.id,
          userId: socket.data.user?.id,
          reason,
          sessionDuration: `${sessionDuration}ms`,
          timestamp: new Date().toISOString()
        });
      });

      // Error handler
      socket.on('error', (error) => {
        console.error('[TRINITY SOCKET ERROR]', {
          service: this.serviceName,
          socketId: socket.id,
          userId: socket.data.user?.id,
          error: error.message,
          stack: error.stack
        });
      });
    });
  }

  private setupRedisAdapter() {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      this.io.adapter(createAdapter(pubClient, subClient));

      console.log('[TRINITY SOCKET ADAPTER]', {
        service: this.serviceName,
        adapter: 'redis',
        status: 'connected'
      });
    });
  }
}
```

---

## Investigation Templates

### API Performance Investigation
```markdown
# Investigation: API Performance Degradation

**Service:** [Service name]
**API Type:** [REST/GraphQL/gRPC/WebSocket]
**Date:** [YYYY-MM-DD]
**Investigator:** [Name]

## Problem Statement
[Describe the performance issue]
- Expected response time: [Xms]
- Actual response time: [Yms]
- Affected endpoints: [List]

## Investigation Steps

### 1. Metrics Collection
- [ ] Check application logs for slow queries
- [ ] Review APM dashboard (response times, error rates)
- [ ] Check database query performance
- [ ] Review external API call durations
- [ ] Check memory and CPU usage

**Findings:**
[Document what you found]

### 2. Endpoint Analysis
- [ ] Profile specific slow endpoints
- [ ] Check for N+1 query problems
- [ ] Review caching strategy
- [ ] Analyze middleware overhead
- [ ] Check for blocking operations

**Findings:**
[Document what you found]

### 3. Database Investigation
- [ ] Review slow query log
- [ ] Check for missing indexes
- [ ] Analyze query execution plans
- [ ] Review connection pool settings
- [ ] Check for table locks

**Findings:**
[Document what you found]

### 4. External Dependencies
- [ ] Check external API response times
- [ ] Review third-party service status
- [ ] Analyze network latency
- [ ] Check rate limiting issues

**Findings:**
[Document what you found]

## Root Cause
[Describe the root cause identified]

## Solution Implemented
[Describe the fix]

## Performance Impact
- Before: [Xms average response time]
- After: [Yms average response time]
- Improvement: [Z%]

## Prevention Measures
- [ ] Add monitoring alerts
- [ ] Implement caching
- [ ] Add database indexes
- [ ] Update documentation
```

### Microservices Communication Failure Investigation
```markdown
# Investigation: Service Communication Failure

**Services:** [Service A] → [Service B]
**Communication Type:** [gRPC/HTTP/Message Queue]
**Date:** [YYYY-MM-DD]
**Investigator:** [Name]

## Problem Statement
[Describe the communication failure]
- Error rate: [X%]
- Affected operations: [List]
- Impact: [User-facing/Internal]

## Investigation Steps

### 1. Network Analysis
- [ ] Check service discovery status
- [ ] Verify DNS resolution
- [ ] Test network connectivity
- [ ] Review firewall rules
- [ ] Check load balancer health

**Findings:**
[Document findings]

### 2. Service Health
- [ ] Check service A health endpoint
- [ ] Check service B health endpoint
- [ ] Review service logs
- [ ] Check circuit breaker status
- [ ] Verify service versions

**Findings:**
[Document findings]

### 3. Message Inspection
- [ ] Review request/response payloads
- [ ] Check message format compatibility
- [ ] Verify authentication tokens
- [ ] Review timeout settings
- [ ] Check retry logic

**Findings:**
[Document findings]

### 4. Distributed Tracing
- [ ] Review trace spans in Jaeger
- [ ] Identify bottleneck services
- [ ] Check for cascade failures
- [ ] Review error propagation

**Findings:**
[Document findings]

## Root Cause
[Identify the root cause]

## Solution Implemented
[Describe the fix]

## Impact Assessment
- Services affected: [Count]
- Downtime: [Duration]
- Requests failed: [Count]

## Prevention Measures
- [ ] Implement circuit breaker
- [ ] Add retry with exponential backoff
- [ ] Set up alerts
- [ ] Update service contract tests
```

---

## Performance Baselines

### RESTful API Targets
- **Response Time**: <200ms (p95), <100ms (p50)
- **Throughput**: 1000+ req/sec per instance
- **Error Rate**: <0.1%
- **Database Query Time**: <50ms average
- **CPU Usage**: <70% under normal load
- **Memory Usage**: <80% under normal load

### GraphQL API Targets
- **Query Resolution**: <500ms (p95), <200ms (p50)
- **Resolver Depth**: Max 5 levels
- **Query Complexity**: Max 1000 points
- **DataLoader Batch Size**: 10-100 items
- **Cache Hit Rate**: >70%

### Microservices Targets
- **Inter-service Latency**: <50ms (p95), <20ms (p50)
- **Message Queue Lag**: <100ms
- **Circuit Breaker Threshold**: 50% error rate
- **Service Discovery**: <10ms lookup
- **Container Startup**: <30 seconds

### Real-time API Targets
- **Connection Establishment**: <100ms
- **Message Latency**: <50ms
- **Concurrent Connections**: 10,000+ per instance
- **Message Throughput**: 10,000+ msg/sec
- **Reconnection Time**: <1 second

---

## Testing Strategies

### RESTful API Testing
```python
# Integration test with Trinity assertions
import pytest
from fastapi.testclient import TestClient

class TestUserAPI:
    def test_create_user_performance(self, client: TestClient):
        """Test user creation meets performance targets"""
        start_time = time.time()

        response = client.post("/api/users", json={
            "email": "test@example.com",
            "name": "Test User"
        })

        duration = (time.time() - start_time) * 1000

        # Trinity assertions
        assert response.status_code == 201
        assert duration < 200, f"Expected <200ms, got {duration}ms"
        assert "id" in response.json()

        print(f"[TRINITY TEST] create_user completed in {duration}ms")

    def test_concurrent_requests(self, client: TestClient):
        """Test API under concurrent load"""
        import concurrent.futures

        def make_request():
            return client.get("/api/users/1")

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(100)]
            results = [f.result() for f in futures]

        success_count = sum(1 for r in results if r.status_code == 200)
        assert success_count >= 95, "Expected 95%+ success rate under load"
```

### GraphQL API Testing
```typescript
// Apollo Server testing
import { ApolloServer } from '@apollo/server';

describe('GraphQL API', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    server = new ApolloServer({ typeDefs, resolvers });
  });

  it('should prevent N+1 query problems', async () => {
    const startTime = Date.now();

    const response = await server.executeOperation({
      query: `
        query {
          users {
            id
            posts {
              id
              title
            }
          }
        }
      `
    });

    const duration = Date.now() - startTime;

    expect(response.body.kind).toBe('single');
    expect(duration).toBeLessThan(500);

    console.log(`[TRINITY TEST] GraphQL query completed in ${duration}ms`);
  });

  it('should enforce query complexity limits', async () => {
    const response = await server.executeOperation({
      query: `
        query {
          users {
            posts {
              comments {
                author {
                  posts {
                    comments {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `
    });

    expect(response.body.kind).toBe('single');
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].message).toContain('complexity');
  });
});
```

### Microservices Testing
```typescript
// NestJS service integration test
import { Test } from '@nestjs/testing';
import { CircuitBreakerService } from './circuit-breaker.service';

describe('UserService', () => {
  let service: UserService;
  let circuitBreaker: CircuitBreakerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, CircuitBreakerService]
    }).compile();

    service = module.get(UserService);
    circuitBreaker = module.get(CircuitBreakerService);
  });

  it('should handle service failures with circuit breaker', async () => {
    const breaker = circuitBreaker.createBreaker(
      'userService',
      async () => { throw new Error('Service unavailable'); }
    );

    // Trigger circuit breaker
    for (let i = 0; i < 10; i++) {
      try {
        await breaker.fire();
      } catch (e) {}
    }

    expect(breaker.opened).toBe(true);

    console.log('[TRINITY TEST] Circuit breaker opened after failures');
  });
});
```

---

## Crisis Recovery

### Scenario 1: Database Connection Pool Exhaustion
**Symptoms:**
- API timeouts increasing
- "Cannot acquire connection" errors
- Response times >5 seconds

**Trinity Recovery Procedure:**
1. Check current connections:
   ```sql
   SELECT count(*) FROM pg_stat_activity;
   ```

2. Identify long-running queries:
   ```sql
   SELECT pid, now() - query_start as duration, query
   FROM pg_stat_activity
   WHERE state = 'active'
   ORDER BY duration DESC;
   ```

3. Immediate actions:
   - Scale API instances horizontally
   - Increase connection pool size temporarily
   - Kill blocking queries if safe
   - Enable connection queueing

4. Long-term fix:
   - Implement connection pooling with PgBouncer
   - Add query timeout limits
   - Optimize slow queries
   - Implement read replicas

### Scenario 2: GraphQL Resolver Timeout Cascade
**Symptoms:**
- Multiple resolver timeouts
- Memory usage spiking
- Client applications hanging

**Trinity Recovery Procedure:**
1. Identify slow resolvers:
   ```typescript
   // Check Apollo Studio traces
   // Look for resolvers >1000ms
   ```

2. Immediate actions:
   - Reduce query complexity limits
   - Disable problematic resolvers temporarily
   - Clear Redis cache
   - Scale GraphQL gateway

3. Implement fixes:
   - Add DataLoader for N+1 prevention
   - Implement field-level caching
   - Set resolver timeouts
   - Add query cost analysis

### Scenario 3: Microservice Cascade Failure
**Symptoms:**
- Multiple services reporting errors
- Circuit breakers opening
- Distributed trace showing failures

**Trinity Recovery Procedure:**
1. Identify failing service:
   ```bash
   kubectl get pods --all-namespaces | grep -v Running
   kubectl logs <failing-pod>
   ```

2. Immediate containment:
   - Isolate failing service
   - Enable circuit breakers
   - Route traffic to healthy instances
   - Scale unaffected services

3. Recovery steps:
   - Restart failing service
   - Verify health checks pass
   - Gradually restore traffic
   - Monitor error rates

4. Post-recovery:
   - Review distributed traces
   - Update circuit breaker thresholds
   - Implement retry strategies
   - Add chaos engineering tests

### Scenario 4: WebSocket Connection Storm
**Symptoms:**
- New connections failing
- Memory exhaustion
- Server CPU at 100%

**Trinity Recovery Procedure:**
1. Check connection count:
   ```typescript
   const count = io.sockets.sockets.size;
   console.log(`Active connections: ${count}`);
   ```

2. Immediate actions:
   - Enable connection rate limiting
   - Increase server instances
   - Close idle connections
   - Implement connection backpressure

3. Mitigation:
   ```typescript
   io.use((socket, next) => {
     const activeConnections = io.sockets.sockets.size;
     if (activeConnections > MAX_CONNECTIONS) {
       return next(new Error('Server at capacity'));
     }
     next();
   });
   ```

4. Long-term solution:
   - Implement connection pooling
   - Add authentication rate limits
   - Use Redis adapter for scaling
   - Set up auto-scaling

---

## Quality Gates

### Pre-commit Checks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: api-performance-test
        name: API Performance Tests
        entry: npm run test:performance
        language: system
        pass_filenames: false

      - id: openapi-validation
        name: OpenAPI Schema Validation
        entry: npm run validate:openapi
        language: system
        pass_filenames: false

      - id: graphql-schema-check
        name: GraphQL Schema Validation
        entry: npm run validate:graphql
        language: system
        pass_filenames: false
```

### API Contract Testing
```typescript
// Contract test
import { OpenAPIValidator } from 'express-openapi-validator';

describe('API Contract', () => {
  it('should match OpenAPI specification', async () => {
    const validator = new OpenAPIValidator({
      apiSpec: './openapi.yaml'
    });

    await validator.install(app);

    const response = await request(app)
      .get('/api/users')
      .expect(200);

    // Validates against OpenAPI schema automatically
  });
});
```

### Performance Benchmarks (CI/CD)
```yaml
# .github/workflows/performance.yml
name: API Performance Tests

on: [pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run k6 load test
        run: |
          k6 run --vus 100 --duration 30s performance/api-test.js

      - name: Check performance thresholds
        run: |
          # Fail if p95 > 200ms
          if [ $(cat results.json | jq '.metrics.http_req_duration.p95') > 200 ]; then
            echo "Performance degradation detected"
            exit 1
          fi
```

---

**Trinity Method for API Services v1.0**

All API types benefit from investigation-first development, comprehensive debugging, and systematic crisis recovery procedures.
