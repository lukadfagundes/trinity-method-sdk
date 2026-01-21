# Error Handler API Reference

**Module:** `src/cli/utils/error-handler.ts`
**Purpose:** Centralized error handler with cleanup mechanisms
**Priority:** MEDIUM (Error management)

---

## Overview

The Error Handler provides centralized error handling with automatic cleanup task execution, graceful error display, and debug mode support.

---

## Core Class

### `ErrorHandler` (Singleton)

**Singleton Instance:** `errorHandler`

---

## Key Methods

### `registerCleanup(name: string, handler: () => Promise<void> | void): void`

Register cleanup task to run before process exit.

**Example:**

```typescript
errorHandler.registerCleanup('Remove temp directory', async () => {
  await fs.remove('.trinity-backup-temp');
});
```

---

### `handle(error: unknown): Promise<never>`

Handle error, run cleanup, display error, exit process.

**Process:**

1. Run all cleanup tasks
2. Display error (formatted for TrinityCLIError)
3. Show context (if debug mode)
4. Show stack trace (if debug mode)
5. Exit with appropriate exit code

**Example:**

```typescript
try {
  await deployComponents();
} catch (error) {
  await errorHandler.handle(error);
}
```

---

### `wrap<T, R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>`

Wrap async function with automatic error handling.

**Example:**

```typescript
const safeDeploy = errorHandler.wrap(async (options) => {
  await deploy(options);
});

await safeDeploy(options); // Errors handled automatically
```

---

### `clearCleanup(): void`

Clear all registered cleanup tasks.

**Use Case:** Testing or manual cleanup handling

---

## Debug Mode

**Activation:** Set `DEBUG=true` environment variable

**Features:**

- Display error context
- Show stack traces
- Verbose cleanup logging

**Example:**

```bash
DEBUG=true trinity deploy
```

---

## Cleanup Execution

**Order:** Registration order (FIFO)

**Failure Handling:** Individual cleanup failures logged, don't stop other tasks

**Example Cleanup:**

```
Cleaning up...
  ✓ Remove backup directory
  ✓ Restore original files
ℹ️  Failed to cleanup: Remove temp files
```

---

## Related Documentation

- **Error Classes:** [docs/api/error-classes.md](error-classes.md)
- **Error Utilities:** [docs/api/errors.md](errors.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
