# Error Classes API Reference

**Module:** `src/cli/utils/error-classes.ts`
**Purpose:** Custom error types with codes and context for Trinity CLI
**Priority:** MEDIUM (Error handling foundation)

---

## Overview

Custom error classes provide domain-specific error types with error codes, exit codes, and contextual information for debugging and error handling.

---

## Base Error Class

### `TrinityCLIError`

Base class for all Trinity CLI errors.

**Constructor:**

```typescript
constructor(
  message: string,
  code: string,
  exitCode: number = 1,
  context?: Record<string, unknown>
)
```

**Properties:**

- `message` - Human-readable error message
- `code` - Error code (e.g., "DEPLOYMENT_ERROR")
- `exitCode` - Process exit code (default: 1)
- `context` - Additional debugging context

**Methods:**

- `format()` - Returns formatted error message: `"Error {code}: {message}"`

---

## Error Types

### `ValidationError`

User input validation errors.

**Code:** `VALIDATION_ERROR`
**Exit Code:** 1

**Example:**

```typescript
throw new ValidationError('Invalid project name', {
  providedName: 'Invalid@Name',
});
```

---

### `FilesystemError`

Filesystem operation errors.

**Code:** `FILESYSTEM_ERROR`
**Exit Code:** 1

**Example:**

```typescript
throw new FilesystemError('Failed to create directory', {
  path: '/invalid/path',
});
```

---

### `DeploymentError`

Trinity deployment errors.

**Code:** `DEPLOYMENT_ERROR`
**Exit Code:** 1

**Example:**

```typescript
throw new DeploymentError('Agent deployment failed', {
  agentCount: 15,
  expectedCount: 19,
});
```

---

### `UpdateError`

Trinity update errors.

**Code:** `UPDATE_ERROR`
**Exit Code:** 1

**Example:**

```typescript
throw new UpdateError('Update verification failed', {
  missingFiles: ['trinity/VERSION'],
});
```

---

### `ConfigurationError`

Configuration validation errors.

**Code:** `CONFIG_ERROR`
**Exit Code:** 1

**Example:**

```typescript
throw new ConfigurationError('Invalid configuration', {
  field: 'framework',
  value: 'Unknown',
});
```

---

## Related Documentation

- **Error Handler:** [docs/api/error-handler.md](error-handler.md)
- **Error Utilities:** [docs/api/errors.md](errors.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
