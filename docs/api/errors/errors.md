# Error Utilities API Reference

**Module:** `src/cli/utils/errors.ts`
**Purpose:** Type-safe error message extraction and display utilities
**Priority:** MEDIUM (Error display)

---

## Overview

Error utilities provide type-safe error handling with consistent formatting, colors, and emoji indicators for errors, warnings, and informational messages.

---

## Core Functions

### `getErrorMessage(error: unknown): string`

Safely extract error message from any type.

**Extraction Logic:**

1. If `Error` instance → return `error.message`
2. If `string` → return as-is
3. If object with `message` property → return `String(error.message)`
4. Otherwise → return `String(error)`

**Example:**

```typescript
try {
  await operation();
} catch (error) {
  const message = getErrorMessage(error);
  console.log(message); // Always returns string
}
```

---

### `getErrorStack(error: unknown): string | undefined`

Safely extract stack trace from error.

**Returns:** Stack trace string if `Error` instance, otherwise `undefined`

---

### `displayError(error: unknown, options?: ErrorDisplayOptions): void`

Display error with consistent formatting.

**Options:**

```typescript
interface ErrorDisplayOptions {
  severity?: ErrorSeverity; // ERROR, WARNING, INFO
  prefix?: string; // Optional prefix
  showStack?: boolean; // Show stack trace
}
```

**Severity Formatting:**

| Severity | Emoji | Color  |
| -------- | ----- | ------ |
| ERROR    | ❌    | Red    |
| WARNING  | ⚠️    | Yellow |
| INFO     | ℹ️    | Blue   |

**Example:**

```typescript
displayError('Deployment failed', {
  severity: ErrorSeverity.ERROR,
  prefix: 'Step 5',
  showStack: true,
});
// Output: ❌ Step 5 Deployment failed
```

---

### `displayWarning(message: string): void`

Display warning message (yellow with ⚠️).

**Example:**

```typescript
displayWarning('Template not found, using fallback');
// Output: ⚠️  Template not found, using fallback
```

---

### `displayInfo(message: string): void`

Display info message (blue with ℹ️).

**Example:**

```typescript
displayInfo('Use: trinity deploy to install');
// Output: ℹ️  Use: trinity deploy to install
```

---

## Helper Functions

### `isError(error: unknown): error is Error`

Type guard to check if value is `Error` instance.

**Example:**

```typescript
if (isError(error)) {
  console.log(error.message); // TypeScript knows it's Error
}
```

---

## Related Documentation

- **Error Classes:** [docs/api/error-classes.md](error-classes.md)
- **Error Handler:** [docs/api/error-handler.md](error-handler.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
