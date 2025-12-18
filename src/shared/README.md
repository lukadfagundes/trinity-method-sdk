# Shared Module

This module contains shared TypeScript type definitions and interfaces used across the entire Trinity Method SDK.

## Overview

The shared module serves as the single source of truth for type definitions, preventing interface duplication and ensuring type consistency across all Trinity components.

## Purpose

1. **Type Consistency**: All modules import from this single location
2. **Avoid Duplication**: Eliminates duplicate interface definitions
3. **Type Safety**: Provides comprehensive TypeScript types
4. **Documentation**: Self-documenting interfaces with JSDoc comments

## Structure

```
shared/
├── README.md           # This file
└── types/
    ├── README.md       # Comprehensive type documentation
    └── index.ts        # 2,270 lines of type definitions
```

## Module Contents

### types/ Directory

Contains the complete Trinity Method type system (2,270 lines):

- **Investigation Types**: Core investigation interfaces and enums
- **CLAUDE.md Context Types**: Project context parsing
- **Cache Types**: Caching system interfaces
- **Learning Types**: ML pattern learning structures
- **Configuration Types**: Trinity configuration system
- **Performance Types**: Benchmarking and metrics
- **Validation Types**: Validation results and errors
- **Task Coordination Types**: Agent task management
- **Type Guards**: Runtime type checking functions
- **Utility Types**: Generic TypeScript helpers

See [types/README.md](./types/README.md) for detailed documentation.

## Usage

### Importing Types

```typescript
// Import specific types
import {
  InvestigationResult,
  Pattern,
  Finding,
  AgentStatus
} from '@trinity/shared/types';

// Import all types
import * as TrinityTypes from '@trinity/shared/types';
```

### Common Use Cases

#### 1. Investigation Results

```typescript
import { InvestigationResult, InvestigationType } from '@trinity/shared/types';

const investigation: InvestigationResult = {
  investigationId: 'inv-001',
  name: 'Security Audit',
  type: 'security-audit',
  status: 'completed',
  findings: [],
  metrics: {
    totalDuration: 120000,
    filesAnalyzed: 150,
    patternsDetected: 12
  }
};
```

#### 2. Pattern Detection

```typescript
import { Pattern, PatternCategory } from '@trinity/shared/types';

const pattern: Pattern = {
  id: 'pattern-001',
  name: 'SQL Injection Vulnerability',
  category: 'security',
  type: 'anti-pattern',
  occurrences: 3,
  confidence: 0.95,
  locations: [
    { filePath: 'src/api/users.ts', startLine: 45 }
  ]
};
```

#### 3. Agent Coordination

```typescript
import { InvestigationTask, AgentType, TaskStatus } from '@trinity/shared/types';

const task: InvestigationTask = {
  id: 'task-001',
  description: 'Analyze authentication flow',
  agentType: 'INO',
  priority: 'high',
  dependencies: [],
  status: 'pending',
  retryCount: 0,
  metadata: {
    investigationId: 'inv-001',
    canRetry: true,
    maxRetries: 3
  }
};
```

#### 4. Cache Operations

```typescript
import { CacheEntry, CacheOperationResult } from '@trinity/shared/types';

const entry: CacheEntry<string> = {
  key: 'analysis-result-001',
  value: 'Analysis complete',
  createdAt: Date.now(),
  lastAccessedAt: Date.now(),
  accessCount: 1,
  ttl: 86400000,
  expiresAt: Date.now() + 86400000
};

const result: CacheOperationResult<string> = {
  success: true,
  value: 'Analysis complete',
  hit: true,
  duration: 5
};
```

#### 5. Type Guards

```typescript
import {
  isInvestigationResult,
  isPattern,
  isCacheEntry,
  isClaudeMdContext
} from '@trinity/shared/types';

// Runtime type checking
const data: unknown = fetchData();

if (isInvestigationResult(data)) {
  console.log(data.investigationId); // Type-safe access
}

if (isPattern(data)) {
  console.log(data.confidence); // Type-safe access
}
```

## Type Categories

The shared types module organizes types into logical categories:

### 1. Investigation Core (Lines 15-838)
- `InvestigationResult` - Complete investigation results
- `InvestigationType` - Investigation categories
- `InvestigationStatus` - Execution status
- `InvestigationScope` - Scope definition
- `InvestigationPhase` - Execution phases
- `Task` - Phase tasks
- `Finding` - Investigation findings
- `Pattern` - Detected patterns
- `Issue` - Discovered issues
- `InvestigationMetrics` - Performance metrics

### 2. CLAUDE.md Context (Lines 840-1018)
- `ClaudeMdContext` - Parsed CLAUDE.md
- `ProjectOverview` - Project information
- `TrinityConfiguration` - Trinity config
- `HookConfiguration` - Hook system config
- `InvestigationPreferences` - User preferences
- `AgentRequirements` - Agent selection rules

### 3. Cache System (Lines 1020-1117)
- `CacheEntry` - Cache entry structure
- `CacheMetadata` - Entry metadata
- `CacheStats` - Cache statistics
- `CacheOperationResult` - Operation results

### 4. Learning System (Lines 1119-1371)
- `LearningData` - Agent learning data
- `LearnedPattern` - Pattern with performance data
- `StrategyPerformance` - Strategy tracking
- `InvestigationSummary` - Historical summary
- `LearningMetadata` - Learning metadata

### 5. Configuration (Lines 1373-1530)
- `Configuration` - Complete Trinity config
- `CacheConfig` - Cache configuration
- `LearningConfig` - Learning configuration
- `InvestigationConfig` - Investigation config
- `AgentConfig` - Agent configuration
- `LoggingConfig` - Logging configuration
- `PerformanceConfig` - Performance config

### 6. Performance & Metrics (Lines 1532-1617)
- `PerformanceStats` - Statistical metrics
- `BenchmarkScenario` - Benchmark definition
- `BenchmarkResult` - Benchmark results

### 7. Validation (Lines 1619-1669)
- `ValidationResult` - Validation results
- `ValidationError` - Validation errors
- `ValidationWarning` - Validation warnings

### 8. Task Coordination (Lines 1843-2180)
- `InvestigationTask` - Task definition
- `TaskStatus` - Task execution status
- `AgentType` - Agent type enum
- `TaskPriority` - Task priority levels
- `TaskDependencyGraph` - Task DAG
- `AgentStatus` - Agent workload info

### 9. Type Guards (Lines 1671-1733)
- `isInvestigationResult()` - Type guard
- `isPattern()` - Type guard
- `isCacheEntry()` - Type guard
- `isClaudeMdContext()` - Type guard

### 10. Utility Types (Lines 1735-1768)
- `DeepPartial<T>` - Recursive partial
- `DeepRequired<T>` - Recursive required
- `KeysOfType<T, U>` - Extract keys by type
- `StrictOmit<T, K>` - Type-safe omit
- `StrictPick<T, K>` - Type-safe pick

### 11. Constants (Lines 1770-1840)
- `DEFAULT_CONFIG` - Default configuration
- `INVESTIGATION_TYPES` - Supported types
- `PATTERN_CATEGORIES` - Pattern categories

## Integration Points

### CLI Commands
```typescript
// deploy.ts
import { DeployOptions, DeploymentStats, CodebaseMetrics } from './types.js';
```

### Investigation System
```typescript
// Investigation creation
import {
  InvestigationResult,
  InvestigationType,
  InvestigationStatus
} from '@trinity/shared/types';
```

### Agent System
```typescript
// Agent coordination
import {
  AgentType,
  AgentStatus,
  InvestigationTask,
  TaskStatus
} from '@trinity/shared/types';
```

### Learning System
```typescript
// Pattern learning
import {
  LearningData,
  LearnedPattern,
  StrategyPerformance
} from '@trinity/shared/types';
```

### Cache System
```typescript
// Cache operations
import {
  CacheEntry,
  CacheStats,
  CacheOperationResult
} from '@trinity/shared/types';
```

## Version History

- **v2.0.0**: Task coordination types added (11-agent orchestration)
- **v1.5.0**: Investigation metadata expansion
- **v1.0.0**: Initial comprehensive type system

## Best Practices

### 1. Always Import from Shared
```typescript
// ✅ Good
import { Pattern } from '@trinity/shared/types';

// ❌ Bad - creates duplication
interface Pattern { ... }
```

### 2. Use Type Guards for Runtime Validation
```typescript
// ✅ Good - type-safe
if (isInvestigationResult(data)) {
  console.log(data.investigationId);
}

// ❌ Bad - no type safety
console.log((data as any).investigationId);
```

### 3. Leverage Utility Types
```typescript
// ✅ Good - reuse utility types
type PartialConfig = DeepPartial<Configuration>;

// ❌ Bad - manual recursion
type PartialConfig = {
  cache?: { enabled?: boolean; ... };
  ...
};
```

### 4. Use Constants for Enums
```typescript
// ✅ Good - use provided constants
import { INVESTIGATION_TYPES } from '@trinity/shared/types';
const validTypes = INVESTIGATION_TYPES;

// ❌ Bad - hardcode values
const validTypes = ['security-audit', 'performance-review', ...];
```

## Extending the Type System

### Adding New Types

1. Add to appropriate section in `types/index.ts`
2. Add JSDoc comments
3. Export the type
4. Update constants if needed
5. Add type guards if applicable
6. Document in `types/README.md`

Example:
```typescript
/**
 * New investigation metric
 */
export interface CustomMetric {
  /** Metric name */
  name: string;

  /** Metric value */
  value: number;

  /** Metric unit */
  unit: string;
}

// Add to exports
export { CustomMetric };

// Add type guard if needed
export function isCustomMetric(value: any): value is CustomMetric {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string' &&
    typeof value.value === 'number' &&
    typeof value.unit === 'string'
  );
}
```

## Troubleshooting

### Type Import Errors

**Problem**: Cannot find module '@trinity/shared/types'
```typescript
// Solution: Use relative import
import { Pattern } from '../shared/types/index.js';
```

**Problem**: Type guards not working
```typescript
// Solution: Ensure proper type narrowing
if (isPattern(data)) {
  // data is now Pattern type
  const confidence = data.confidence; // ✅ Works
}
```

**Problem**: Missing type exports
```typescript
// Solution: Check types/index.ts exports
export { YourType } from './definitions';
```

## Related Documentation

- [types/README.md](./types/README.md) - Detailed type documentation
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\commands\README.md](../cli/commands/README.md) - CLI command types
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\utils\README.md](../cli/utils/README.md) - Utility type usage
