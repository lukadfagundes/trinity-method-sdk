# Python/FastAPI Trinity Method Example

## Project Profile

- **Backend**: FastAPI 0.104+
- **Database**: PostgreSQL with SQLAlchemy 2.0 (async)
- **Authentication**: JWT with python-jose + OAuth2
- **Validation**: Pydantic v2
- **Testing**: pytest + httpx + pytest-asyncio
- **Documentation**: OpenAPI/Swagger auto-generation
- **Task Queue**: Celery + Redis
- **Caching**: Redis
- **Deployment**: Docker + Kubernetes
- **Type Checking**: mypy
- **Code Quality**: Black, isort, Ruff

## Trinity Method Deployment

### Deployment Command

```bash
trinity deploy --name="MyFastAPI"
```

Or use universal deployment:

```
Initialize Trinity Method for MyFastAPI Python/FastAPI project. Analyze the FastAPI application structure, identify API endpoints and dependencies, detect SQLAlchemy 2.0 async models and database connections, recognize JWT OAuth2 authentication patterns, and generate Trinity Method documentation optimized for Python FastAPI async development.
```

## Generated Trinity Method Documents

### Core Documents
- `CLAUDE.md` - Claude Code configuration and project memory
- `TRINITY.md` - Trinity Method overview for FastAPI

### Knowledge Base (trinity/knowledge-base/)
- `Trinity.md` - Main Trinity Method documentation
- `ARCHITECTURE.md` - FastAPI architecture analysis
- `To-do.md` - Current tasks and work orders
- `ISSUES.md` - Known issues database

### Investigations (trinity/investigations/)
Investigation reports following FastAPI patterns:
- API endpoint performance analysis
- Database query optimization
- Authentication flow debugging
- Async operation debugging

### Work Orders (trinity/work-orders/)
Example work orders for FastAPI development:
- API endpoint implementation
- Database migration
- Performance optimization
- Security hardening

### Patterns (trinity/patterns/)
Discovered FastAPI patterns:
- Dependency injection patterns
- Middleware patterns
- Background task patterns
- Caching strategies

## Framework-Specific Adaptations

### FastAPI Dependency Injection Debugging

**Dependency with Trinity Logging:**
```python
# trinity/patterns/dependency-debugging.py
# FastAPI dependency injection with Trinity debugging

from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
import logging
from datetime import datetime

logger = logging.getLogger("trinity")

# Database session dependency
async def get_db() -> AsyncSession:
    """Database session dependency with Trinity debugging"""
    start_time = datetime.now()

    logger.info(f"[TRINITY DEPENDENCY] Getting database session at {start_time}")

    async with AsyncSessionLocal() as session:
        try:
            yield session
            duration = (datetime.now() - start_time).total_seconds() * 1000

            logger.info(f"[TRINITY DEPENDENCY] Database session closed, duration: {duration}ms")

            if duration > 1000:
                logger.warning(f"[TRINITY PERFORMANCE] Long-lived database session: {duration}ms")

        except Exception as e:
            logger.error(f"[TRINITY DEPENDENCY ERROR] Database session error: {str(e)}")
            raise

# Current user dependency
async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    """Get current user with Trinity debugging"""

    logger.info(f"[TRINITY AUTH] Validating token")

    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            logger.warning(f"[TRINITY AUTH] Invalid token: missing user_id")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")

        logger.info(f"[TRINITY AUTH] Token validated for user: {user_id}")

    except JWTError as e:
        logger.error(f"[TRINITY AUTH ERROR] JWT decode error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    # Get user from database
    start_time = datetime.now()
    user = await get_user_by_id(db, user_id)
    query_duration = (datetime.now() - start_time).total_seconds() * 1000

    logger.info(f"[TRINITY AUTH] User query duration: {query_duration}ms")

    if user is None:
        logger.warning(f"[TRINITY AUTH] User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    logger.info(f"[TRINITY AUTH] Authentication successful for user: {user_id}")
    return user
```

### API Endpoint Debugging Pattern

**Endpoint with Comprehensive Logging:**
```python
# trinity/patterns/endpoint-debugging.py
# FastAPI endpoint with Trinity debugging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import logging
import time
import uuid

logger = logging.getLogger("trinity")
router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get users with Trinity debugging"""

    request_id = str(uuid.uuid4())
    start_time = time.time()

    # Log request
    logger.info(f"[TRINITY API] {request_id} | GET /users | user={current_user.id}", extra={
        "request_id": request_id,
        "endpoint": "/users",
        "method": "GET",
        "user_id": current_user.id,
        "params": {"skip": skip, "limit": limit},
        "client_ip": request.client.host
    })

    try:
        # Validate parameters
        if skip < 0 or limit < 1 or limit > 100:
            logger.warning(f"[TRINITY API] {request_id} | Invalid parameters: skip={skip}, limit={limit}")
            raise HTTPException(status_code=400, detail="Invalid parameters")

        # Query database
        query_start = time.time()
        users = await get_users_paginated(db, skip=skip, limit=limit)
        query_duration = (time.time() - query_start) * 1000

        logger.info(f"[TRINITY DATABASE] {request_id} | Query duration: {query_duration:.2f}ms | Results: {len(users)}")

        # Performance warning
        if query_duration > 100:
            logger.warning(f"[TRINITY PERFORMANCE] {request_id} | Slow database query: {query_duration:.2f}ms")

        # Log success
        total_duration = (time.time() - start_time) * 1000
        logger.info(f"[TRINITY API] {request_id} | Success | {len(users)} users | {total_duration:.2f}ms")

        return users

    except HTTPException:
        raise
    except Exception as e:
        total_duration = (time.time() - start_time) * 1000
        logger.error(f"[TRINITY API ERROR] {request_id} | {type(e).__name__}: {str(e)} | {total_duration:.2f}ms",
                    exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(
    request: Request,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create user with Trinity debugging"""

    request_id = str(uuid.uuid4())
    start_time = time.time()

    logger.info(f"[TRINITY API] {request_id} | POST /users | user={current_user.id}", extra={
        "request_id": request_id,
        "endpoint": "/users",
        "method": "POST",
        "user_id": current_user.id,
        "data": user_data.dict(exclude={"password"}),  # Don't log passwords
        "client_ip": request.client.host
    })

    try:
        # Validation
        existing_user = await get_user_by_email(db, user_data.email)
        if existing_user:
            logger.warning(f"[TRINITY API] {request_id} | User already exists: {user_data.email}")
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create user
        db_start = time.time()
        new_user = await create_user_in_db(db, user_data)
        db_duration = (time.time() - db_start) * 1000

        logger.info(f"[TRINITY DATABASE] {request_id} | User created | {db_duration:.2f}ms | user_id={new_user.id}")

        # Log success
        total_duration = (time.time() - start_time) * 1000
        logger.info(f"[TRINITY API] {request_id} | Success | user_id={new_user.id} | {total_duration:.2f}ms")

        return new_user

    except HTTPException:
        raise
    except Exception as e:
        total_duration = (time.time() - start_time) * 1000
        logger.error(f"[TRINITY API ERROR] {request_id} | {type(e).__name__}: {str(e)} | {total_duration:.2f}ms",
                    exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
```

### Middleware Debugging Pattern

**Logging Middleware:**
```python
# trinity/patterns/middleware-debugging.py
# FastAPI middleware with Trinity debugging

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import time
import uuid

logger = logging.getLogger("trinity")

class TrinityLoggingMiddleware(BaseHTTPMiddleware):
    """Trinity Method logging middleware"""

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        start_time = time.time()

        # Log request
        logger.info(f"[TRINITY REQUEST] {request_id} | {request.method} {request.url.path}", extra={
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url),
            "client": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
        })

        # Process request
        try:
            response = await call_next(request)
            duration = (time.time() - start_time) * 1000

            # Log response
            logger.info(f"[TRINITY RESPONSE] {request_id} | {response.status_code} | {duration:.2f}ms", extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "duration_ms": duration
            })

            # Performance warning
            if duration > 1000:
                logger.warning(f"[TRINITY PERFORMANCE] {request_id} | Slow request: {duration:.2f}ms")

            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration:.2f}ms"

            return response

        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[TRINITY ERROR] {request_id} | {type(e).__name__}: {str(e)} | {duration:.2f}ms",
                        exc_info=True)
            raise

# Rate limiting middleware
class TrinityRateLimitMiddleware(BaseHTTPMiddleware):
    """Trinity Method rate limiting middleware"""

    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.requests = {}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()

        # Clean old entries
        self.requests = {
            ip: times for ip, times in self.requests.items()
            if times and times[-1] > current_time - self.period
        }

        # Check rate limit
        if client_ip in self.requests:
            self.requests[client_ip] = [
                t for t in self.requests[client_ip]
                if t > current_time - self.period
            ]

            if len(self.requests[client_ip]) >= self.calls:
                logger.warning(f"[TRINITY RATE LIMIT] Rate limit exceeded for {client_ip}")
                return Response(
                    content="Rate limit exceeded",
                    status_code=429,
                    headers={"Retry-After": str(self.period)}
                )
        else:
            self.requests[client_ip] = []

        self.requests[client_ip].append(current_time)

        logger.debug(f"[TRINITY RATE LIMIT] {client_ip}: {len(self.requests[client_ip])}/{self.calls} calls")

        return await call_next(request)
```

### SQLAlchemy 2.0 Async Debugging

**Repository Pattern with Debugging:**
```python
# trinity/patterns/repository-debugging.py
# SQLAlchemy repository with Trinity debugging

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import logging
import time

logger = logging.getLogger("trinity")

class UserRepository:
    """User repository with Trinity debugging"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> User | None:
        """Get user by ID with debugging"""

        start_time = time.time()

        logger.debug(f"[TRINITY REPO] Getting user by ID: {user_id}")

        try:
            result = await self.db.execute(
                select(User)
                .options(selectinload(User.posts))  # Eager load relationships
                .where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            duration = (time.time() - start_time) * 1000

            logger.info(f"[TRINITY REPO] get_by_id | user_id={user_id} | found={user is not None} | {duration:.2f}ms")

            if duration > 50:
                logger.warning(f"[TRINITY REPO SLOW] get_by_id took {duration:.2f}ms")

            return user

        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[TRINITY REPO ERROR] get_by_id | {type(e).__name__}: {str(e)} | {duration:.2f}ms",
                        exc_info=True)
            raise

    async def get_paginated(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get paginated users with debugging"""

        start_time = time.time()

        logger.debug(f"[TRINITY REPO] Getting paginated users: skip={skip}, limit={limit}")

        try:
            result = await self.db.execute(
                select(User)
                .offset(skip)
                .limit(limit)
                .order_by(User.created_at.desc())
            )
            users = result.scalars().all()

            duration = (time.time() - start_time) * 1000

            logger.info(f"[TRINITY REPO] get_paginated | skip={skip} limit={limit} | count={len(users)} | {duration:.2f}ms")

            # Performance warnings
            if duration > 100:
                logger.warning(f"[TRINITY REPO SLOW] get_paginated took {duration:.2f}ms")

            if len(users) == limit:
                logger.info(f"[TRINITY REPO] Result set may be truncated (returned {limit} items)")

            return users

        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[TRINITY REPO ERROR] get_paginated | {type(e).__name__}: {str(e)} | {duration:.2f}ms",
                        exc_info=True)
            raise

    async def create(self, user_data: UserCreate) -> User:
        """Create user with debugging"""

        start_time = time.time()

        logger.info(f"[TRINITY REPO] Creating user: {user_data.email}")

        try:
            user = User(**user_data.dict())
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)

            duration = (time.time() - start_time) * 1000

            logger.info(f"[TRINITY REPO] create | user_id={user.id} | email={user.email} | {duration:.2f}ms")

            return user

        except Exception as e:
            await self.db.rollback()
            duration = (time.time() - start_time) * 1000
            logger.error(f"[TRINITY REPO ERROR] create | {type(e).__name__}: {str(e)} | {duration:.2f}ms",
                        exc_info=True)
            raise

# Query monitoring
from sqlalchemy import event
from sqlalchemy.engine import Engine

@event.listens_for(Engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query start"""
    conn.info.setdefault('query_start_time', []).append(time.time())
    logger.debug(f"[TRINITY SQL] Starting query: {statement[:100]}...")

@event.listens_for(Engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log query end"""
    total = time.time() - conn.info['query_start_time'].pop()
    duration_ms = total * 1000

    logger.debug(f"[TRINITY SQL] Query completed in {duration_ms:.2f}ms")

    if duration_ms > 100:
        logger.warning(f"[TRINITY SQL SLOW] Slow query ({duration_ms:.2f}ms): {statement[:200]}")
```

### Background Tasks Debugging

**Celery Task with Debugging:**
```python
# trinity/patterns/background-task-debugging.py
# Celery background tasks with Trinity debugging

from celery import Celery, Task
import logging
import time
from functools import wraps

logger = logging.getLogger("trinity")

celery_app = Celery("tasks", broker="redis://localhost:6379")

class TrinityTask(Task):
    """Base task with Trinity debugging"""

    def __call__(self, *args, **kwargs):
        task_id = self.request.id
        start_time = time.time()

        logger.info(f"[TRINITY TASK] {task_id} | Starting task: {self.name}", extra={
            "task_id": task_id,
            "task_name": self.name,
            "args": args,
            "kwargs": kwargs
        })

        try:
            result = super().__call__(*args, **kwargs)
            duration = (time.time() - start_time) * 1000

            logger.info(f"[TRINITY TASK] {task_id} | Completed: {self.name} | {duration:.2f}ms", extra={
                "task_id": task_id,
                "task_name": self.name,
                "duration_ms": duration,
                "status": "success"
            })

            if duration > 5000:
                logger.warning(f"[TRINITY TASK SLOW] {task_id} | Task took {duration:.2f}ms")

            return result

        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[TRINITY TASK ERROR] {task_id} | {type(e).__name__}: {str(e)} | {duration:.2f}ms",
                        exc_info=True, extra={
                            "task_id": task_id,
                            "task_name": self.name,
                            "duration_ms": duration,
                            "status": "failed"
                        })
            raise

@celery_app.task(base=TrinityTask, bind=True)
def send_email_task(self, user_id: str, email_type: str):
    """Send email task with debugging"""

    logger.info(f"[TRINITY TASK] Sending email | user_id={user_id} | type={email_type}")

    try:
        # Email sending logic
        result = send_email(user_id, email_type)

        logger.info(f"[TRINITY TASK] Email sent successfully | user_id={user_id}")
        return result

    except Exception as e:
        logger.error(f"[TRINITY TASK ERROR] Email send failed | user_id={user_id} | error={str(e)}")
        raise
```

## Investigation Templates

### API Performance Investigation

```markdown
# FastAPI Performance Investigation

## Current Metrics

### Response Times
- Average: [X]ms (target: <100ms)
- p95: [X]ms (target: <200ms)
- p99: [X]ms (target: <500ms)
- Max: [X]ms

### Throughput
- Requests per second: [X] (target: >1000)
- Concurrent connections: [X]
- Error rate: [X]% (target: <0.1%)

## Investigation Steps

### 1. Endpoint Profiling
- [ ] Use cProfile for slow endpoints
- [ ] Identify bottleneck functions
- [ ] Check async/await usage
- [ ] Review dependency injection overhead

### 2. Database Analysis
- [ ] Profile database queries
- [ ] Check for N+1 queries
- [ ] Verify index usage
- [ ] Monitor connection pool

### 3. Middleware Impact
- [ ] Measure middleware overhead
- [ ] Check authentication performance
- [ ] Review logging impact
- [ ] Analyze CORS handling

### 4. Async Operations
- [ ] Verify async session usage
- [ ] Check for blocking operations
- [ ] Review task queue performance
- [ ] Monitor event loop

## Optimization Opportunities
1. [Specific optimization]
2. [Specific optimization]
3. [Specific optimization]
```

### Database Query Investigation

```markdown
# SQLAlchemy Query Investigation

## Slow Query Analysis

### Query Details
- Query: [SQL statement]
- Duration: [X]ms
- Frequency: [X] calls/min
- Endpoint: [endpoint]

## Investigation Steps

### 1. Query Execution Plan
```sql
EXPLAIN ANALYZE [query];
```

### 2. Index Analysis
- [ ] Check existing indexes
- [ ] Identify missing indexes
- [ ] Review index usage
- [ ] Check for index bloat

### 3. Query Optimization
- [ ] Review JOIN operations
- [ ] Check WHERE clause efficiency
- [ ] Analyze subquery usage
- [ ] Review relationship loading strategy

### 4. Connection Pool
- [ ] Monitor pool size
- [ ] Check for connection leaks
- [ ] Review pool settings
- [ ] Analyze connection lifetime

## Proposed Solutions
1. [Solution with expected impact]
2. [Solution with expected impact]
```

## Performance Baselines

### FastAPI Performance Targets

```python
performance_targets = {
    # API response times
    "response_times": {
        "average": "<100ms",
        "p95": "<200ms",
        "p99": "<500ms",
        "max": "<2s"
    },

    # Throughput
    "throughput": {
        "rps": ">1000",  # Requests per second
        "concurrent": ">500",  # Concurrent connections
        "error_rate": "<0.1%"
    },

    # Database
    "database": {
        "query_time": "<50ms",
        "connection_pool": "<80%",
        "transaction_time": "<100ms"
    },

    # Resource usage
    "resources": {
        "cpu": "<70%",
        "memory": "<512MB",
        "async_tasks": "<100 pending"
    },

    # Background tasks
    "celery": {
        "task_latency": "<1s",
        "task_duration": "<5s average",
        "queue_size": "<1000"
    }
}
```

## Testing Strategies

### Pytest with Trinity Debugging

```python
# tests/test_users.py
# Trinity Method FastAPI testing

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger = logging.getLogger("trinity")

@pytest.fixture
async def client():
    """Test client fixture"""
    logger.info("[TRINITY TEST] Creating test client")

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

    logger.info("[TRINITY TEST] Test client closed")

@pytest.fixture
async def db_session():
    """Database session fixture"""
    logger.info("[TRINITY TEST] Creating test database session")

    async with AsyncSessionLocal() as session:
        yield session
        await session.rollback()

    logger.info("[TRINITY TEST] Test database session closed")

@pytest.mark.asyncio
async def test_get_users(client: AsyncClient, db_session: AsyncSession):
    """Test getting users list"""
    logger.info("[TRINITY TEST] Testing GET /users")

    # Create test data
    test_user = User(email="test@example.com", name="Test User")
    db_session.add(test_user)
    await db_session.commit()

    logger.info(f"[TRINITY TEST] Created test user: {test_user.id}")

    # Test endpoint
    response = await client.get("/users")

    assert response.status_code == 200
    assert len(response.json()) > 0

    logger.info(f"[TRINITY TEST] GET /users returned {len(response.json())} users")

@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    """Test creating user"""
    logger.info("[TRINITY TEST] Testing POST /users")

    user_data = {
        "email": "newuser@example.com",
        "name": "New User",
        "password": "securepassword123"
    }

    response = await client.post("/users", json=user_data)

    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]

    logger.info(f"[TRINITY TEST] Created user: {response.json()['id']}")

@pytest.mark.asyncio
async def test_user_authentication(client: AsyncClient):
    """Test user authentication flow"""
    logger.info("[TRINITY TEST] Testing authentication flow")

    # Create user
    user_data = {"email": "auth@example.com", "password": "password123"}
    await client.post("/users", json={**user_data, "name": "Auth User"})

    # Login
    login_response = await client.post("/auth/login", data=user_data)
    assert login_response.status_code == 200

    token = login_response.json()["access_token"]
    logger.info("[TRINITY TEST] Login successful, token received")

    # Access protected endpoint
    headers = {"Authorization": f"Bearer {token}"}
    profile_response = await client.get("/users/me", headers=headers)

    assert profile_response.status_code == 200
    assert profile_response.json()["email"] == user_data["email"]

    logger.info("[TRINITY TEST] Authentication flow test passed")
```

## Crisis Recovery Procedures

### Common FastAPI Emergency Scenarios

```markdown
## 1. Database Connection Pool Exhaustion

**Symptoms:**
- "QueuePool limit exceeded" errors
- Slow API responses
- Connection timeout errors

**Immediate Actions:**
```python
# Check pool status
from sqlalchemy import inspect
inspector = inspect(engine)
pool_status = engine.pool.status()
print(f"Pool size: {pool_status}")

# Increase pool size temporarily
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,  # Increase from default 10
    max_overflow=40  # Increase from default 10
)
```

**Investigation:**
- Check for connection leaks
- Review async session lifecycle
- Monitor connection count per endpoint
- Analyze slow queries holding connections

**Prevention:**
- Always use async context managers
- Set connection pool timeouts
- Monitor pool usage metrics
- Implement connection health checks

## 2. High Memory Usage / Memory Leak

**Symptoms:**
- Increasing memory consumption
- OOM errors
- Slow garbage collection

**Immediate Actions:**
```bash
# Check memory usage
ps aux | grep uvicorn
# or
docker stats [container]

# Profile memory
pip install memory-profiler
python -m memory_profiler app/main.py
```

**Investigation:**
- Check for circular references
- Review SQLAlchemy relationship loading
- Analyze request/response caching
- Monitor async task accumulation

**Prevention:**
- Use selectinload() for relationships
- Implement response streaming for large data
- Clear SQLAlchemy session regularly
- Monitor with prometheus/grafana

## 3. Slow API Responses

**Symptoms:**
- Response times > 1s
- Timeout errors
- Client-side timeouts

**Immediate Actions:**
```python
# Enable query logging
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Profile endpoint
import cProfile
pr = cProfile.Profile()
pr.enable()
# ... endpoint logic ...
pr.disable()
pr.print_stats(sort='cumtime')
```

**Investigation:**
- Profile slow endpoints
- Check database query times
- Review N+1 query problems
- Analyze middleware overhead
- Check external API calls

## 4. Authentication Service Failure

**Symptoms:**
- 401/403 errors
- Token validation failures
- JWT decode errors

**Immediate Actions:**
- Check JWT secret configuration
- Verify token expiration settings
- Review OAuth2 flow
- Check Redis connectivity (if using token storage)

**Investigation:**
- Validate JWT secret rotation
- Check token blacklist
- Review permission checks
- Monitor auth endpoint performance
```

## Quality Gates

### FastAPI-Specific Quality Checks

```python
# Pre-commit quality gates
quality_gates = {
    # Code formatting
    "black": "black . --check",
    "isort": "isort . --check-only",

    # Linting
    "ruff": "ruff check .",
    "flake8": "flake8 .",

    # Type checking
    "mypy": "mypy app --strict",

    # Testing
    "pytest": "pytest --cov=app --cov-report=term --cov-fail-under=80",
    "pytest_asyncio": "pytest --asyncio-mode=auto",

    # Security
    "bandit": "bandit -r app -ll",
    "safety": "safety check",

    # API validation
    "openapi": "python -c 'from app.main import app; app.openapi()'",

    # Performance
    "load_test": "locust -f tests/load_test.py --headless -u 100 -r 10 --run-time 60s"
}
```

## Deployment Notes

This example demonstrates Trinity Method patterns for:
- FastAPI dependency injection debugging
- SQLAlchemy 2.0 async repository pattern
- Middleware logging and monitoring
- Background task debugging with Celery
- API endpoint performance tracking
- JWT authentication debugging
- Database query optimization
- Pytest async testing strategies
- Production crisis recovery

Use `/trinity-init` after deployment to activate all agents and begin FastAPI development with full Trinity Method support.
