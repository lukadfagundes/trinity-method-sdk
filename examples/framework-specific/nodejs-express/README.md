# Node.js/Express Trinity Method Example

## Project Profile

- **Backend**: Node.js with Express 4.x
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: Passport.js with JWT
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **API Documentation**: Swagger/OpenAPI
- **Deployment**: Docker + AWS ECS

## Trinity Method Deployment

### Deployment Command

```bash
trinity deploy --name="ExpressAPI"
```

Or use universal deployment:

```
Initialize Trinity Method for ExpressAPI Node.js/Express project. Analyze the Express application structure, identify routes and middleware, detect MongoDB/Mongoose patterns, recognize Passport.js authentication, and generate Trinity Method documentation optimized for Node.js/Express REST API development.
```

## Generated Trinity Method Documents

### Core Documents
- `CLAUDE.md` - Claude Code configuration and project memory
- `TRINITY.md` - Trinity Method overview for this project

### Knowledge Base (trinity/knowledge-base/)
- `Trinity.md` - Main Trinity Method documentation
- `ARCHITECTURE.md` - Express app architecture analysis
- `To-do.md` - Current tasks and work orders
- `ISSUES.md` - Known issues database

### Investigations (trinity/investigations/)
Investigation reports following Express patterns:
- Middleware analysis
- Route optimization
- Database query performance
- Authentication flow debugging

### Work Orders (trinity/work-orders/)
Example work orders for Express development:
- API endpoint implementation
- Middleware refactoring
- Performance optimization
- Security hardening

### Patterns (trinity/patterns/)
Discovered Express patterns:
- Error handling middleware
- Request validation patterns
- Database transaction patterns
- Authentication middleware patterns

### Templates (trinity/templates/)
- Investigation template (Express-optimized)
- Work order template
- Session documentation template

### Sessions (trinity/sessions/)
Active development session tracking

### Archive (trinity/archive/)
Completed session archives

## Framework-Specific Adaptations

### Express Middleware Patterns

**Error Handling Middleware:**
```javascript
// trinity/patterns/error-handling-middleware.md
// Error handling pattern with debugging

const errorHandler = (err, req, res, next) => {
  // TRINITY: Log error for investigation
  console.error('[TRINITY ERROR]', {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    userId: req.user?.id
  });

  // Response based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  // Default server error
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error'
  });
};

module.exports = errorHandler;
```

**Request Logging Middleware:**
```javascript
// trinity/patterns/request-logging-middleware.md
// Request logging for investigation

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  console.log('[TRINITY REQUEST]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    query: req.query,
    body: process.env.NODE_ENV === 'development' ? req.body : '[REDACTED]',
    userId: req.user?.id,
    ip: req.ip
  });

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log('[TRINITY RESPONSE]', {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id
    });

    // Performance warning
    if (duration > 1000) {
      console.warn('[TRINITY PERFORMANCE]', {
        message: 'Slow request detected',
        path: req.path,
        duration: `${duration}ms`,
        threshold: '1000ms'
      });
    }
  });

  next();
};

module.exports = requestLogger;
```

### Mongoose/Database Patterns

**Database Query Debugging:**
```javascript
// trinity/patterns/mongoose-debugging.md
// Mongoose query debugging pattern

const mongoose = require('mongoose');

// Enable Mongoose debugging in development
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log('[TRINITY DB]', {
      timestamp: new Date().toISOString(),
      collection: collectionName,
      method: method,
      query: query,
      doc: doc
    });
  });
}

// Query performance monitoring
const monitorQuery = async (modelName, queryFn) => {
  const startTime = Date.now();

  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;

    console.log('[TRINITY DB QUERY]', {
      model: modelName,
      duration: `${duration}ms`,
      resultCount: Array.isArray(result) ? result.length : 1
    });

    if (duration > 100) {
      console.warn('[TRINITY DB SLOW QUERY]', {
        model: modelName,
        duration: `${duration}ms`,
        threshold: '100ms'
      });
    }

    return result;
  } catch (error) {
    console.error('[TRINITY DB ERROR]', {
      model: modelName,
      error: error.message
    });
    throw error;
  }
};

module.exports = { monitorQuery };
```

### Authentication Patterns

**JWT Authentication Debugging:**
```javascript
// trinity/patterns/jwt-auth-debugging.md
// JWT authentication with debugging

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('[TRINITY AUTH]', {
    timestamp: new Date().toISOString(),
    path: req.path,
    hasToken: !!token,
    authHeader: authHeader ? 'Present' : 'Missing'
  });

  if (!token) {
    console.warn('[TRINITY AUTH FAIL]', {
      reason: 'No token provided',
      path: req.path,
      ip: req.ip
    });
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.warn('[TRINITY AUTH FAIL]', {
        reason: err.message,
        path: req.path,
        ip: req.ip
      });
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    console.log('[TRINITY AUTH SUCCESS]', {
      userId: user.id,
      path: req.path
    });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

### Route Debugging Pattern

**Controller with Debugging:**
```javascript
// trinity/patterns/controller-debugging.md
// Express controller with Trinity debugging

const User = require('../models/User');
const { monitorQuery } = require('../utils/monitoring');

// Get all users with debugging
exports.getUsers = async (req, res, next) => {
  console.log('[TRINITY CONTROLLER]', {
    action: 'getUsers',
    query: req.query,
    userId: req.user?.id
  });

  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // Build query
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    // Execute with monitoring
    const users = await monitorQuery('User', () =>
      User.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
    );

    const count = await User.countDocuments(query);

    console.log('[TRINITY CONTROLLER SUCCESS]', {
      action: 'getUsers',
      resultCount: users.length,
      totalCount: count,
      page: page,
      limit: limit
    });

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('[TRINITY CONTROLLER ERROR]', {
      action: 'getUsers',
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};
```

## Investigation Templates

### API Endpoint Investigation

```markdown
# API Endpoint Investigation: [Endpoint Name]

## Current State
- **Route**: [HTTP METHOD /path]
- **Controller**: [file:line]
- **Middleware**: [list]
- **Database queries**: [number and type]

## Requirements
- **Input**: [request parameters]
- **Output**: [response format]
- **Authentication**: [required/optional]
- **Rate limiting**: [requirements]

## Edge Cases
- [ ] Invalid input validation
- [ ] Missing required fields
- [ ] Database connection failure
- [ ] Authentication failure
- [ ] Rate limit exceeded
- [ ] Large payload handling

## Performance Targets
- Response time: <100ms (95th percentile)
- Database queries: ≤2 per request
- Payload size: <1MB
- Concurrent requests: 100+

## Implementation Plan
1. Route definition
2. Input validation
3. Business logic
4. Database operations
5. Response formatting
6. Error handling
```

### Database Performance Investigation

```markdown
# Database Investigation: [Query/Model]

## Current Performance
- Average query time: [Xms]
- Queries per request: [N]
- Index usage: [yes/no]

## Bottlenecks
- N+1 query issues: [locations]
- Missing indexes: [fields]
- Large dataset problems: [details]

## Optimization Opportunities
1. Add indexes on: [fields]
2. Implement pagination: [endpoints]
3. Use aggregation: [queries]
4. Cache results: [strategy]

## Testing Plan
- [ ] Benchmark current performance
- [ ] Implement optimization
- [ ] Re-benchmark
- [ ] Verify improvement
```

## Performance Baselines

### API Performance Targets

```javascript
const performanceTargets = {
  // Response time targets
  responseTime: {
    average: '<50ms',
    p95: '<100ms',
    p99: '<200ms',
    max: '<500ms'
  },

  // Database targets
  database: {
    queryTime: '<50ms',
    queriesPerRequest: '≤3',
    connectionPoolUsage: '<80%'
  },

  // Resource targets
  resources: {
    cpu: '<70%',
    memory: '<512MB per process',
    eventLoopLag: '<10ms'
  },

  // Throughput targets
  throughput: {
    requestsPerSecond: '>1000',
    concurrentConnections: '>500',
    errorRate: '<0.1%'
  }
};
```

## Testing Strategies

### Express Integration Testing

```javascript
// tests/integration/users.test.js
// Integration test with Trinity debugging

const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

describe('User API Integration Tests', () => {
  beforeEach(async () => {
    // TRINITY: Clear database before each test
    await User.deleteMany({});
    console.log('[TRINITY TEST] Database cleared');
  });

  describe('GET /api/users', () => {
    it('should return users with pagination', async () => {
      // TRINITY: Setup test data
      const testUsers = [
        { name: 'Alice', email: 'alice@test.com' },
        { name: 'Bob', email: 'bob@test.com' }
      ];
      await User.insertMany(testUsers);
      console.log('[TRINITY TEST] Test data inserted:', testUsers.length);

      // TRINITY: Execute request
      const startTime = Date.now();
      const response = await request(app)
        .get('/api/users')
        .query({ page: 1, limit: 10 })
        .expect(200);
      const duration = Date.now() - startTime;

      console.log('[TRINITY TEST] Response time:', duration, 'ms');

      // Assertions
      expect(response.body.users).toHaveLength(2);
      expect(response.body.currentPage).toBe(1);
      expect(duration).toBeLessThan(100); // Performance check
    });

    it('should handle search query', async () => {
      // Test implementation with debugging
    });

    it('should return 401 without auth token', async () => {
      // Test implementation with debugging
    });
  });
});
```

## Crisis Recovery Procedures

### Common Express Emergency Scenarios

```markdown
## 1. Memory Leak Detection

**Symptoms:**
- Memory usage continuously growing
- Process crashes with OOM
- Performance degradation over time

**Immediate Actions:**
1. Restart affected processes
2. Enable heap snapshot: `node --inspect app.js`
3. Monitor memory: `process.memoryUsage()`
4. Check for event listener leaks

**Investigation:**
- Use Chrome DevTools memory profiler
- Check for unclosed database connections
- Review middleware for memory retention
- Analyze request handlers for closures

## 2. High CPU Usage

**Symptoms:**
- CPU at 100%
- Slow response times
- Event loop blocked

**Immediate Actions:**
1. Profile with: `node --prof app.js`
2. Check for blocking operations
3. Review synchronous code
4. Scale horizontally if needed

## 3. Database Connection Pool Exhausted

**Symptoms:**
- "Too many connections" errors
- Slow database queries
- Connection timeouts

**Immediate Actions:**
1. Check pool size: `mongoose.connection.readyState`
2. Identify connection leaks
3. Increase pool size temporarily
4. Restart process if necessary

**Prevention:**
- Always close connections
- Use connection pooling
- Monitor active connections
- Set connection timeouts
```

## Quality Gates

### Express-Specific Quality Checks

```javascript
// Pre-commit quality gates
module.exports = {
  // Code quality
  linting: 'eslint --ext .js .',
  formatting: 'prettier --check .',

  // Testing
  unitTests: 'jest --coverage --coverageThreshold=\'{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}\'',
  integrationTests: 'jest --testPathPattern=integration',

  // Security
  securityAudit: 'npm audit --audit-level=moderate',
  dependencyCheck: 'npm outdated',

  // Performance
  loadTest: 'artillery quick --count 10 -n 20 http://localhost:3000/api/health',

  // API validation
  apiDocs: 'swagger-cli validate ./swagger.yaml'
};
```

## Deployment Notes

This example demonstrates Trinity Method patterns for:
- Express.js middleware debugging
- Mongoose query optimization
- JWT authentication monitoring
- API endpoint investigation
- Performance monitoring
- Error handling patterns
- Integration testing strategies
- Crisis recovery procedures

Use `/trinity-init` after deployment to activate all agents and begin development with full Trinity Method support.
