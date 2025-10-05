## Configuration Management

The Trinity Method SDK includes a powerful configuration management system with multi-environment support, hot-reload, and validation.

## Overview

The configuration system provides:

1. **Multi-Environment Support** - Separate configs for development, staging, production
2. **Hot-Reload** - Configuration changes apply without restart (<100ms)
3. **JSON Schema Validation** - Prevents invalid configurations
4. **Environment Variables** - Override config values with TRINITY_* env vars
5. **Configuration Templates** - Pre-configured templates for each environment

## Quick Start

### Initialize Configuration

```bash
# Copy template for your environment
cp src/config/templates/development.json trinity/config/development.json

# Or use CLI to initialize
/trinity-config init --env development
```

### Load Configuration

```typescript
import { ConfigurationManager } from '@trinity-method/sdk/config';

// Initialize with default settings
const config = new ConfigurationManager();

// Or specify options
const config = new ConfigurationManager({
  environment: 'production',
  configPath: 'trinity/config/production.json',
  watchForChanges: true,
  validateOnLoad: true,
});

// Get configuration
const allConfig = config.getConfig();
const learningConfig = config.get('learning');
```

### Enable Hot-Reload

```typescript
import { ConfigurationManager, ConfigWatcher } from '@trinity-method/sdk/config';

const configManager = new ConfigurationManager();

const watcher = new ConfigWatcher(
  configManager,
  'trinity/config/development.json'
);

// Start watching
watcher.start();

// Configuration will automatically reload when file changes
// Stop watching when done
watcher.stop();
```

## Configuration Structure

### Full Configuration

```json
{
  "environment": "development",
  "learning": {
    "enabled": true,
    "confidenceThreshold": 0.6,
    "dataPath": "trinity/learning",
    "maxCacheSize": 1000
  },
  "cache": {
    "enabled": true,
    "l1MaxSize": 100,
    "l2MaxSizeMB": 50,
    "l3MaxSizeMB": 500,
    "ttl": 3600
  },
  "coordination": {
    "enabled": true,
    "maxConcurrentTasks": 4,
    "taskTimeout": 300000,
    "retryAttempts": 3
  },
  "analytics": {
    "enabled": true,
    "metricsPath": "trinity/analytics",
    "trackTokenUsage": true,
    "trackPerformance": true
  },
  "hooks": {
    "enabled": true,
    "enabledHooks": [],
    "hooksPath": "trinity/hooks"
  },
  "registry": {
    "enabled": true,
    "dbPath": "trinity/registry/investigations.db",
    "autoRegister": true
  },
  "benchmarking": {
    "enabled": true,
    "outputPath": "trinity/benchmarks"
  },
  "logging": {
    "level": "debug",
    "outputPath": "trinity/logs/trinity.log"
  }
}
```

### Configuration Sections

#### Learning

Controls the self-improving agent learning system.

```json
{
  "learning": {
    "enabled": true,
    "confidenceThreshold": 0.6,
    "dataPath": "trinity/learning",
    "maxCacheSize": 1000
  }
}
```

- **enabled**: Enable/disable learning system
- **confidenceThreshold**: Minimum confidence (0-1) for learned optimizations
- **dataPath**: Path to learning data storage
- **maxCacheSize**: Maximum number of cached learning entries

#### Cache

Multi-tier caching configuration.

```json
{
  "cache": {
    "enabled": true,
    "l1MaxSize": 100,
    "l2MaxSizeMB": 50,
    "l3MaxSizeMB": 500,
    "ttl": 3600
  }
}
```

- **enabled**: Enable/disable caching
- **l1MaxSize**: L1 (memory) cache max entries
- **l2MaxSizeMB**: L2 (file) cache max size in MB
- **l3MaxSizeMB**: L3 (database) cache max size in MB
- **ttl**: Time-to-live in seconds

#### Coordination

Task pool coordination settings.

```json
{
  "coordination": {
    "enabled": true,
    "maxConcurrentTasks": 4,
    "taskTimeout": 300000,
    "retryAttempts": 3
  }
}
```

- **enabled**: Enable/disable task coordination
- **maxConcurrentTasks**: Maximum concurrent tasks
- **taskTimeout**: Task timeout in milliseconds
- **retryAttempts**: Number of retry attempts on failure

#### Analytics

Performance analytics configuration.

```json
{
  "analytics": {
    "enabled": true,
    "metricsPath": "trinity/analytics",
    "trackTokenUsage": true,
    "trackPerformance": true
  }
}
```

- **enabled**: Enable/disable analytics
- **metricsPath**: Path to metrics data
- **trackTokenUsage**: Track token consumption
- **trackPerformance**: Track performance metrics

#### Hooks

Hook library configuration.

```json
{
  "hooks": {
    "enabled": true,
    "enabledHooks": ["pre-commit", "post-analysis"],
    "hooksPath": "trinity/hooks"
  }
}
```

- **enabled**: Enable/disable hooks system
- **enabledHooks**: List of enabled hooks
- **hooksPath**: Path to hooks directory

#### Registry

Investigation registry settings.

```json
{
  "registry": {
    "enabled": true,
    "dbPath": "trinity/registry/investigations.db",
    "autoRegister": true
  }
}
```

- **enabled**: Enable/disable registry
- **dbPath**: Path to SQLite database
- **autoRegister**: Automatically register investigations

#### Benchmarking

Performance benchmarking configuration.

```json
{
  "benchmarking": {
    "enabled": true,
    "outputPath": "trinity/benchmarks"
  }
}
```

- **enabled**: Enable/disable benchmarking
- **outputPath**: Path to benchmark results

#### Logging

Logging configuration.

```json
{
  "logging": {
    "level": "debug",
    "outputPath": "trinity/logs/trinity.log"
  }
}
```

- **level**: Log level (debug, info, warn, error)
- **outputPath**: Path to log file (optional)

## Environment-Specific Configurations

### Development

Optimized for local development with verbose logging and debugging enabled.

```json
{
  "environment": "development",
  "learning": {
    "confidenceThreshold": 0.6
  },
  "cache": {
    "l1MaxSize": 100,
    "l2MaxSizeMB": 50,
    "l3MaxSizeMB": 500
  },
  "coordination": {
    "maxConcurrentTasks": 4
  },
  "logging": {
    "level": "debug"
  }
}
```

### Staging

Balanced configuration for pre-production testing.

```json
{
  "environment": "staging",
  "learning": {
    "confidenceThreshold": 0.7
  },
  "cache": {
    "l1MaxSize": 200,
    "l2MaxSizeMB": 100,
    "l3MaxSizeMB": 1000
  },
  "coordination": {
    "maxConcurrentTasks": 8
  },
  "logging": {
    "level": "info"
  }
}
```

### Production

Optimized for production with higher thresholds and minimal logging.

```json
{
  "environment": "production",
  "learning": {
    "confidenceThreshold": 0.8
  },
  "cache": {
    "l1MaxSize": 500,
    "l2MaxSizeMB": 200,
    "l3MaxSizeMB": 2000
  },
  "coordination": {
    "maxConcurrentTasks": 16
  },
  "logging": {
    "level": "warn"
  }
}
```

## Environment Variables

Override configuration values with environment variables:

### Available Variables

```bash
# Environment
TRINITY_ENV=production              # development | staging | production

# Learning
TRINITY_LEARNING_ENABLED=true
TRINITY_LEARNING_THRESHOLD=0.8

# Cache
TRINITY_CACHE_ENABLED=true
TRINITY_CACHE_L1_SIZE=500

# Coordination
TRINITY_COORDINATION_ENABLED=true
TRINITY_MAX_CONCURRENT_TASKS=16

# Analytics
TRINITY_ANALYTICS_ENABLED=true

# Logging
TRINITY_LOG_LEVEL=warn              # debug | info | warn | error
```

### Example Usage

```bash
# Override in CI/CD
export TRINITY_ENV=staging
export TRINITY_LOG_LEVEL=info
export TRINITY_MAX_CONCURRENT_TASKS=8

# Run application
npm start
```

## Hot-Reload

Configuration changes apply automatically without application restart.

### Enable Hot-Reload

```typescript
import { ConfigurationManager, ConfigWatcher } from '@trinity-method/sdk/config';

const configManager = new ConfigurationManager({
  watchForChanges: true,
});

const watcher = new ConfigWatcher(
  configManager,
  'trinity/config/development.json',
  { reloadDebounceMs: 100 }
);

watcher.start();
```

### Listen for Configuration Changes

```typescript
const unsubscribe = configManager.onChange((newConfig) => {
  console.log('Configuration updated:', newConfig);

  // Re-initialize components with new config
  reinitializeWithNewConfig(newConfig);
});

// Later, unsubscribe
unsubscribe();
```

### Hot-Reload Performance

- **Target**: <100ms reload time
- **Debounce**: 100ms (configurable)
- **Zero-downtime**: Application continues running during reload

## Validation

All configurations are validated against JSON schema before loading.

### Validate Configuration

```typescript
import { ConfigValidator } from '@trinity-method/sdk/config';

const validator = new ConfigValidator();

const result = validator.validate(config);

if (!result.valid) {
  console.error('Validation errors:');
  for (const error of result.errors) {
    console.error(`${error.field}: ${error.message}`);
  }
}
```

### Validation Rules

- **Required fields**: environment, learning.enabled, cache.enabled, etc.
- **Type checking**: Strings, numbers, booleans must match schema
- **Range validation**: Numbers within valid ranges (e.g., confidenceThreshold: 0-1)
- **Enum validation**: Environment must be development/staging/production

### Common Validation Errors

```
❌ /learning/confidenceThreshold: must be >= 0 and <= 1
❌ /cache/l1MaxSize: must be >= 0
❌ /coordination/maxConcurrentTasks: must be >= 1
❌ /environment: must be equal to one of the allowed values
❌ /logging/level: must be equal to one of the allowed values
```

## Programmatic Usage

### Get Configuration Values

```typescript
const config = new ConfigurationManager();

// Get entire config
const allConfig = config.getConfig();

// Get specific section
const learningConfig = config.get('learning');
const cacheConfig = config.get('cache');

// Access values
console.log(`Learning enabled: ${learningConfig.enabled}`);
console.log(`Cache L1 size: ${cacheConfig.l1MaxSize}`);
```

### Update Configuration (In-Memory)

```typescript
// Update in-memory (does not persist to disk)
configManager.updateInMemory({
  learning: {
    ...configManager.get('learning'),
    enabled: false,
  },
});
```

### Reload Configuration

```typescript
// Reload from disk
await configManager.reload();

// Reload with validation
await configManager.reload(true);

// Reload without validation (faster)
await configManager.reload(false);
```

### Get Current Environment

```typescript
const env = configManager.getEnvironment();
console.log(`Running in ${env} environment`);
```

## CLI Commands

### Show Configuration

```bash
/trinity-config show

# Show specific section
/trinity-config show --section learning
/trinity-config show --section cache
```

### Validate Configuration

```bash
/trinity-config validate
```

### Initialize from Template

```bash
/trinity-config init --env development
/trinity-config init --env staging
/trinity-config init --env production
```

### Watch for Changes

```bash
/trinity-config watch
```

### Show Current Environment

```bash
/trinity-config env
```

## Best Practices

### 1. Use Environment-Specific Files

Keep separate configuration files for each environment:

```
trinity/config/
├── development.json
├── staging.json
└── production.json
```

### 2. Never Commit Secrets

Use environment variables for sensitive data:

```json
{
  "apiKey": "${API_KEY}",
  "databaseUrl": "${DATABASE_URL}"
}
```

### 3. Validate Before Deployment

Always validate configuration before deploying:

```bash
/trinity-config validate
```

### 4. Use Hot-Reload in Development

Enable hot-reload for faster development:

```typescript
const config = new ConfigurationManager({
  watchForChanges: true,
});
```

### 5. Monitor Configuration Changes

Log configuration changes for debugging:

```typescript
configManager.onChange((config) => {
  console.log('Configuration reloaded:', new Date().toISOString());
});
```

## Troubleshooting

### Configuration Not Loading

**Problem:** Configuration file not found

**Solution:**
```bash
# Ensure file exists
ls trinity/config/development.json

# Or initialize from template
/trinity-config init --env development
```

### Validation Errors

**Problem:** Configuration fails validation

**Solution:**
```bash
# Check validation errors
/trinity-config validate

# Fix errors in configuration file
# Common issues:
# - Wrong data types (string instead of number)
# - Values out of range (confidenceThreshold must be 0-1)
# - Missing required fields
```

### Hot-Reload Not Working

**Problem:** Changes not applying automatically

**Solution:**
```typescript
// Ensure watcher is started
watcher.start();

// Check file permissions
// Ensure configuration file is writable
// Check for file watcher errors in logs
```

### Environment Variable Not Applied

**Problem:** TRINITY_* env var not overriding config

**Solution:**
```bash
# Ensure variable is set before application starts
export TRINITY_LEARNING_ENABLED=true

# Verify it's set
echo $TRINITY_LEARNING_ENABLED

# Check variable name matches supported variables
# See "Environment Variables" section above
```

## Advanced Usage

### Custom Configuration Path

```typescript
const config = new ConfigurationManager({
  configPath: '/custom/path/to/config.json',
});
```

### Programmatic Environment Detection

```typescript
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = new ConfigurationManager({
  environment: env,
});
```

### Multiple Configuration Listeners

```typescript
// Listener 1: Re-initialize cache
configManager.onChange((config) => {
  cacheManager.reinitialize(config.cache);
});

// Listener 2: Update analytics
configManager.onChange((config) => {
  analyticsManager.updateSettings(config.analytics);
});

// Listener 3: Adjust logging
configManager.onChange((config) => {
  logger.setLevel(config.logging.level);
});
```

### Configuration Backup

```typescript
const currentConfig = configManager.getConfig();
const backup = JSON.stringify(currentConfig, null, 2);

fs.writeFileSync('config-backup.json', backup);
```

## API Reference

See [API Documentation](../api-reference.md) for complete API details.

---

**Need Help?**

- [GitHub Issues](https://github.com/trinity-method/trinity-method-sdk/issues)
- [Documentation](https://docs.trinity-method.dev)
- [Community](https://discord.gg/trinity-method)
