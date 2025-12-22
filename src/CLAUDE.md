# CLAUDE.md - Node.js Technology-Specific Rules

## Trinity Method SDK - Node.js Implementation

**Framework:** Node.js
**Language:** JavaScript/TypeScript
**Source Directory:** src
**Runtime:** Node.js

---

## Technology Stack Behavioral Modifications

### Node.js Specific Requirements

- **Async/Await Patterns**: All asynchronous operations must use async/await syntax for better error handling
- **Event Loop Optimization**: Monitor and prevent blocking operations
- **Memory Management**: Implement garbage collection awareness and monitor heap usage
- **Process Management**: Handle graceful shutdowns and restarts
- **Module System**: Use ES6 modules where possible, CommonJS for compatibility

### Framework-Specific Adaptations

- **Event-Driven Architecture**: Leverage Node.js event system
- **Stream Processing**: Use streams for large data processing
- **Cluster Mode**: Implement clustering for production deployments
- **Worker Threads**: Use worker threads for CPU-intensive tasks
- **Child Processes**: Spawn child processes when needed

---

## Technology Debugging Standards

### Node.js Debugging Framework

```javascript
// Standard debugging format for Node.js applications
const createDebugLogger = (moduleName) => {
  return {
    entry: (functionName, params) => {
      console.log(`[ENTRY] ${moduleName}.${functionName}`, {
        params: params,
        timestamp: new Date().toISOString(),
        module: moduleName,
        stack: 'Node.js',
        pid: process.pid,
        memory: process.memoryUsage(),
      });
    },
    exit: (functionName, result, startTime) => {
      console.log(`[EXIT] ${moduleName}.${functionName}`, {
        result: result,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
      });
    },
    error: (functionName, error, context) => {
      console.error(`[ERROR] ${moduleName}.${functionName}`, {
        error: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
        module: moduleName,
        pid: process.pid,
      });
    },
  };
};

// Usage example
const logger = createDebugLogger('UserService');

async function processUser(userId) {
  const startTime = Date.now();
  logger.entry('processUser', { userId });

  try {
    // Implementation...
    const result = await performOperation(userId);

    logger.exit('processUser', result, startTime);
    return result;
  } catch (error) {
    logger.error('processUser', error, { userId });
    throw error;
  }
}
```

### Event Emitter Debugging

```javascript
// Debug event emitters
const EventEmitter = require('events');

class DebuggedEmitter extends EventEmitter {
  emit(eventName, ...args) {
    console.log(`[EVENT] ${eventName}`, {
      args: args,
      timestamp: new Date().toISOString(),
      listeners: this.listenerCount(eventName),
    });
    return super.emit(eventName, ...args);
  }
}
```

---

## Performance Optimization Rules

### Node.js Performance Monitoring

```javascript
// Performance monitoring utilities
class PerformanceMonitor {
  static measureAsync(name, asyncFunction) {
    return async (...args) => {
      const startTime = process.hrtime.bigint();
      const startMemory = process.memoryUsage();

      try {
        const result = await asyncFunction(...args);

        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage();

        console.log(`[PERF] ${name}`, {
          duration: Number(endTime - startTime) / 1000000, // Convert to ms
          memoryDelta: {
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            heapTotal: endMemory.heapTotal - startMemory.heapTotal,
            rss: endMemory.rss - startMemory.rss,
          },
          timestamp: new Date().toISOString(),
        });

        return result;
      } catch (error) {
        console.error(`[PERF-ERROR] ${name}`, {
          error: error.message,
          duration: Number(process.hrtime.bigint() - startTime) / 1000000,
        });
        throw error;
      }
    };
  }

  static measureSync(name, syncFunction) {
    return (...args) => {
      const startTime = process.hrtime.bigint();

      try {
        const result = syncFunction(...args);
        const endTime = process.hrtime.bigint();

        console.log(`[PERF-SYNC] ${name}`, {
          duration: Number(endTime - startTime) / 1000000,
        });

        return result;
      } catch (error) {
        console.error(`[PERF-SYNC-ERROR] ${name}`, {
          error: error.message,
        });
        throw error;
      }
    };
  }
}

// Usage
const monitoredFunction = PerformanceMonitor.measureAsync('databaseQuery', originalQueryFunction);
```

### Memory Leak Detection

```javascript
// Monitor for memory leaks
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('[MEMORY]', {
    heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
    heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
    rss: (usage.rss / 1024 / 1024).toFixed(2) + ' MB',
    external: (usage.external / 1024 / 1024).toFixed(2) + ' MB',
    timestamp: new Date().toISOString(),
  });
}, 60000); // Every minute
```

---

## Security Best Practices

### Input Validation

```javascript
// Input sanitization and validation
const validator = require('validator');

function validateUserInput(input) {
  // String sanitization
  if (typeof input === 'string') {
    input = validator.escape(input);
    input = validator.trim(input);
  }

  // SQL injection prevention
  // XSS prevention
  // Command injection prevention

  return input;
}
```

### Environment Variables

```javascript
// Secure environment variable handling
require('dotenv').config();

const config = {
  dbPassword: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY,
  secret: process.env.SESSION_SECRET,
};

// Never log sensitive environment variables
console.log('[CONFIG] Loaded configuration (sensitive values hidden)');
```

---

## Testing Requirements

### Jest Testing Patterns

```javascript
// Jest testing for Node.js
describe('UserService', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should create user successfully', async () => {
    const userData = { username: 'test', email: 'test@example.com' };
    const result = await userService.createUser(userData);

    expect(result).toBeDefined();
    expect(result.username).toBe('test');
  });

  it('should handle errors gracefully', async () => {
    await expect(userService.createUser(null)).rejects.toThrow('Invalid user data');
  });
});
```

### Integration Testing

```javascript
// Integration test example
const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  it('GET /api/users should return users', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

---

## Framework Best Practices

### Express.js Patterns (if applicable)

```javascript
// Express middleware pattern
const express = require('express');
const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log('[HTTP]', {
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[HTTP-ERROR]', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});
```

### Database Integration Patterns

```javascript
// Database operation logging
const dbLogger = createDebugLogger('Database');

class DatabaseManager {
  static async query(model, operation, params) {
    const startTime = Date.now();
    dbLogger.entry('query', {
      model: model.name,
      operation: operation,
      params: params,
    });

    try {
      const result = await model[operation](params);

      dbLogger.exit(
        'query',
        {
          rowCount: Array.isArray(result) ? result.length : 1,
          success: true,
        },
        startTime
      );

      return result;
    } catch (error) {
      dbLogger.error('query', error, {
        model: model.name,
        operation: operation,
      });
      throw error;
    }
  }
}
```

---

## Error Handling Patterns

### Comprehensive Error Handling

```javascript
// Custom error classes
class ApplicationError extends Error {
  constructor(message, statusCode = 500, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message, context) {
    super(message, 400, context);
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, context) {
    super(message, 500, context);
  }
}

// Error handling function
async function safeOperation(operation, context) {
  try {
    return await operation();
  } catch (error) {
    console.error(`[ERROR] ${context}`, {
      error: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
    });

    if (error.code === 'ECONNREFUSED') {
      throw new DatabaseError('Database connection failed', { context });
    }

    throw error;
  }
}
```

### Global Error Handlers

```javascript
// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT-EXCEPTION]', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Graceful shutdown
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED-REJECTION]', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString(),
  });
});

process.on('SIGINT', () => {
  console.log('[SHUTDOWN] Received SIGINT, shutting down gracefully');
  // Cleanup logic
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] Received SIGTERM, shutting down gracefully');
  // Cleanup logic
  process.exit(0);
});
```

---

## Technology-Specific Command References

### Development Commands

```bash
# Node.js Development
node src/index.js           # Start application
node --inspect src/index.js # Start with debugger
npm start                               # Start with package.json script
npm run dev                             # Development mode with hot reload

# Package Management
npm install                             # Install dependencies
npm install --production                # Production dependencies only
npm audit                               # Security audit
npm update                              # Update dependencies
```

### Testing Commands

```bash
# Testing
npm test                                # Run test suite
npm run test:watch                      # Watch mode
npm run test:coverage                   # Generate coverage report
node --inspect-brk node_modules/.bin/jest # Debug tests
```

### Deployment Commands

```bash
# Production Deployment
NODE_ENV=production node src/index.js
pm2 start src/index.js --name Trinity Method SDK
pm2 logs Trinity Method SDK
pm2 restart Trinity Method SDK
```

---

## Component-Level Customizations

### Module Organization

```
src/
├── controllers/       # Request handlers
├── services/         # Business logic
├── models/           # Data models
├── middleware/       # Express middleware
├── utils/            # Utility functions
├── config/           # Configuration
└── tests/            # Test files
```

### Configuration Management

```javascript
// config/index.js
const config = {
  development: {
    port: 3000,
    database: {
      host: 'localhost',
      port: 5432,
    },
  },
  production: {
    port: process.env.PORT || 8080,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

---

## Reference to Parent Context

This file extends the Trinity Method protocols defined in `../trinity/CLAUDE.md` and global requirements from `../CLAUDE.md`. Node.js implementations must comply with:

- Trinity Method investigation requirements ([../trinity/CLAUDE.md](../trinity/CLAUDE.md))
- Global performance baselines ([../trinity/knowledge-base/ARCHITECTURE.md](../trinity/knowledge-base/ARCHITECTURE.md#performance-baseline))
- Quality gate standards (BAS 6-phase) ([../trinity/CLAUDE.md](../trinity/CLAUDE.md#quality-standards))
- Crisis management protocols ([../trinity/CLAUDE.md](../trinity/CLAUDE.md#crisis-management))

All Node.js code must implement the debugging frameworks, error handling patterns, and performance monitoring specified in this document.

---

**Technology Context**: Node.js Implementation
**Parent References**:

- `../CLAUDE.md` - Global project requirements
- `../trinity/CLAUDE.md` - Trinity Method enforcement

**Last Updated**: 2025-12-20
**Trinity Version**: 2.0.0
