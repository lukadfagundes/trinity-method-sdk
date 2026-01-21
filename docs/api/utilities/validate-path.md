# Path Validation API Reference

**Module:** `src/cli/utils/validate-path.ts`
**Purpose:** Security validation to prevent directory traversal and symlink attacks
**Priority:** HIGH (Security-critical)

---

## Overview

The Path Validation module provides security-critical utilities for safely handling file paths in Trinity Method operations. It prevents common security vulnerabilities including path traversal attacks, symlink attacks, and null byte injection.

**Key Features:**

- Path traversal prevention (blocks `../` attempts)
- Absolute path rejection (enforces relative paths only)
- Symlink attack protection (detects and blocks symlinks)
- Null byte injection detection
- Recursive directory validation
- Cross-platform path normalization (Windows/Unix)
- Safe file copy operations with security checks

---

## Core Functions

### `validatePath(userPath: string, baseDir?: string): string`

Validates that a user-provided path is safe and within the project directory.

**Parameters:**

- `userPath` (string) - User-provided path (potentially malicious)
- `baseDir` (string, optional) - Base directory (default: `process.cwd()`)

**Returns:** `string` - Validated absolute path within baseDir

**Throws:** `Error` if:

- Path contains null bytes (`\0`)
- Path is absolute (Unix: `/path`, Windows: `C:\path`, UNC: `\\server\share`)
- Path attempts traversal (resolves outside baseDir)

**Security Checks Performed:**

1. **Null Byte Detection**
   - Checks for `\0` character in path
   - Prevents path injection attacks

2. **Path Normalization**
   - Uses `path.normalize()` for cross-platform compatibility
   - Handles both `\` (Windows) and `/` (Unix) separators

3. **Absolute Path Rejection**
   - Uses `path.isAbsolute()` to detect absolute paths
   - Only relative paths allowed (security policy)

4. **Path Traversal Detection**
   - Resolves path relative to `baseDir`
   - Computes relative path from `baseDir` to resolved path
   - If relative path starts with `..` → outside baseDir → BLOCKED

**Example Usage:**

```typescript
import { validatePath } from './utils/validate-path.js';

// ✅ Valid - relative path within project
const valid1 = validatePath('trinity/agents');
// Returns: "/project/trinity/agents"

const valid2 = validatePath('./src/utils');
// Returns: "/project/src/utils"

const valid3 = validatePath('nested/deep/path/file.md');
// Returns: "/project/nested/deep/path/file.md"

// ❌ Blocked - path traversal
try {
  validatePath('../../../etc/passwd');
} catch (error) {
  console.error(error.message);
  // "Path traversal detected: ../../../etc/passwd
  //  Path must be within project directory: /project
  //  Attempted to access: /etc/passwd"
}

// ❌ Blocked - absolute path (Unix)
try {
  validatePath('/etc/passwd');
} catch (error) {
  console.error(error.message);
  // "Absolute paths are not allowed: /etc/passwd
  //  Use relative paths within project directory."
}

// ❌ Blocked - absolute path (Windows)
try {
  validatePath('C:\\Windows\\System32');
} catch (error) {
  console.error(error.message);
  // "Absolute paths are not allowed: C:\Windows\System32
  //  Use relative paths within project directory."
}

// ❌ Blocked - null byte injection
try {
  validatePath('file\0.txt');
} catch (error) {
  console.error(error.message);
  // "Invalid path: null byte detected in "file\0.txt"
  //  Null bytes are not allowed in file paths."
}
```

**Path Traversal Detection Logic:**

```typescript
// Core security check
const resolved = path.resolve(baseDir, normalized);
const relative = path.relative(baseDir, resolved);

// If relative starts with ".." → outside baseDir
if (relative.startsWith('..') || path.isAbsolute(relative)) {
  throw new Error('Path traversal detected');
}
```

**Example:**

```typescript
// baseDir: /project
// userPath: ../../etc/passwd

// normalized: "../../etc/passwd"
// resolved: /etc/passwd
// relative: "../../etc/passwd"
// relative.startsWith('..') → TRUE → BLOCKED ✅
```

---

### `validateNotSymlink(filePath: string): Promise<void>`

Validates that a path is not a symbolic link.

**Parameters:**

- `filePath` (string) - Path to validate (should be absolute path from `validatePath()`)

**Returns:** `Promise<void>` - Resolves if not a symlink

**Throws:** `Error` if path is a symbolic link

**Security Rationale:**

- Prevents symlink attacks where malicious symlinks point to sensitive files
- Ensures file operations act on actual files, not symlink references
- Protects against symlink race conditions (TOCTTOU attacks)

**Implementation:**

```typescript
const stats = await fs.lstat(filePath); // lstat doesn't follow symlinks
if (stats.isSymbolicLink()) {
  throw new Error('Symlink detected');
}
```

**Note:** Uses `lstat()` instead of `stat()` to get symlink information without following it.

**Example Usage:**

```typescript
import { validatePath, validateNotSymlink } from './utils/validate-path.js';

// ✅ Valid - regular file
const validPath = validatePath('trinity/agents/mon.md');
await validateNotSymlink(validPath);
// OK - no error

// ❌ Blocked - symlink
const symlinkPath = validatePath('link-to-passwd');
try {
  await validateNotSymlink(symlinkPath);
} catch (error) {
  console.error(error.message);
  // "Symlink detected: /project/link-to-passwd
  //  For security, symlinks are not allowed in Trinity operations.
  //  Please use the actual file or directory instead."
}
```

**ENOENT Handling:**

- If file doesn't exist (`ENOENT` error), function returns successfully
- Rationale: File will be created by caller, no security risk

**Error Differentiation:**

```typescript
if (error.code === 'ENOENT') {
  // File doesn't exist - OK
  return;
}
if (message.includes('Symlink detected')) {
  // Re-throw symlink error
  throw error;
}
// Other errors propagated to caller
throw error;
```

---

### `safeCopy(src: string, dest: string, baseDir?: string): Promise<void>`

Safely copies files or directories with comprehensive security validation.

**Parameters:**

- `src` (string) - Source path (relative to baseDir)
- `dest` (string) - Destination path (relative to baseDir)
- `baseDir` (string, optional) - Base directory (default: `process.cwd()`)

**Returns:** `Promise<void>` - Resolves when copy complete

**Throws:** `Error` if:

- Source or destination paths invalid (path traversal/absolute)
- Source doesn't exist
- Source is a symlink
- Source directory contains symlinks (recursive check)

**Security Features:**

1. **Path Validation** - Both source and destination validated via `validatePath()`
2. **Existence Check** - Source must exist before copy
3. **Symlink Detection** - Source validated with `validateNotSymlink()`
4. **Recursive Symlink Check** - If source is directory, all contents checked
5. **No Symlink Following** - Copy uses `dereference: false` option

**Example Usage:**

```typescript
import { safeCopy } from './utils/validate-path.js';

// ✅ Safe copy - file
await safeCopy('templates/agent.md', 'trinity/agents/new-agent.md');

// ✅ Safe copy - directory
await safeCopy('templates/agents/', 'trinity/agents/');

// ❌ Blocked - path traversal in destination
try {
  await safeCopy('file.txt', '../outside/file.txt');
} catch (error) {
  console.error(error.message);
  // "Path traversal detected: ../outside/file.txt"
}

// ❌ Blocked - symlink source
try {
  await safeCopy('symlink-to-file', 'dest.txt');
} catch (error) {
  console.error(error.message);
  // "Symlink detected: /project/symlink-to-file"
}

// ❌ Blocked - source doesn't exist
try {
  await safeCopy('nonexistent.txt', 'dest.txt');
} catch (error) {
  console.error(error.message);
  // "Source path does not exist: nonexistent.txt
  //  Resolved to: /project/nonexistent.txt"
}
```

**Copy Options:**

```typescript
await fs.copy(validSrc, validDest, {
  dereference: false, // Don't follow symlinks (SECURITY)
  overwrite: true, // Allow overwriting existing files
});
```

**Why `dereference: false`?**

- If source is symlink, copy operation fails (safe)
- Prevents copying symlink targets outside project directory
- Ensures all copied files are actual files, not symlinks

---

## Internal Functions

### `validateDirectoryNoSymlinks(dirPath: string): Promise<void>`

Recursively validates that a directory contains no symlinks.

**Parameters:**

- `dirPath` (string) - Directory path to validate recursively

**Returns:** `Promise<void>` - Resolves if no symlinks found

**Throws:** `Error` if any symlink found in directory tree

**Purpose:** Ensures all files in directory tree are actual files before copying.

**Implementation:**

```typescript
async function validateDirectoryNoSymlinks(dirPath: string) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Check if entry is symlink
    const stats = await fs.lstat(fullPath);
    if (stats.isSymbolicLink()) {
      throw new Error('Symlink detected in directory');
    }

    // Recursively check subdirectories
    if (entry.isDirectory()) {
      await validateDirectoryNoSymlinks(fullPath);
    }
  }
}
```

**Example:**

```typescript
// Directory structure:
// templates/
// ├── agent.md
// ├── symlink-to-secret → /etc/passwd
// └── subdirectory/
//     └── file.txt

await validateDirectoryNoSymlinks('/project/templates');
// Throws: "Symlink detected in directory: /project/templates/symlink-to-secret"
```

---

## Security Threat Model

### Threat 1: Path Traversal Attack

**Attack Vector:**

```typescript
// Attacker provides malicious path
const maliciousPath = '../../../etc/passwd';
await fs.readFile(maliciousPath);
// Without validation, reads /etc/passwd
```

**Mitigation:**

```typescript
// With validatePath()
const safePath = validatePath(maliciousPath);
// Throws: "Path traversal detected"
```

**Protection Mechanism:**

- Resolves path relative to `baseDir`
- Computes relative path from `baseDir` to resolved path
- Blocks if relative path starts with `..`

---

### Threat 2: Symlink Attack

**Attack Vector:**

```typescript
// Attacker creates symlink to sensitive file
// ln -s /etc/passwd ./innocent-file.txt

// Without validation:
await fs.copy('innocent-file.txt', 'public/exposed.txt');
// Copies /etc/passwd to public directory!
```

**Mitigation:**

```typescript
// With safeCopy()
await safeCopy('innocent-file.txt', 'public/exposed.txt');
// Throws: "Symlink detected: /project/innocent-file.txt"
```

**Protection Mechanism:**

- Uses `lstat()` to detect symlinks without following them
- Rejects symlinks at source, destination, and within directories
- Copy operation uses `dereference: false` for additional safety

---

### Threat 3: Null Byte Injection

**Attack Vector:**

```typescript
// Attacker exploits null byte truncation (older systems)
const maliciousPath = 'safe-file.txt\0../../etc/passwd';
// Some systems truncate at \0, reading /etc/passwd
```

**Mitigation:**

```typescript
const safePath = validatePath(maliciousPath);
// Throws: "Invalid path: null byte detected"
```

**Protection Mechanism:**

- Explicit check for `\0` character
- Rejects any path containing null bytes

---

### Threat 4: Absolute Path Exploitation

**Attack Vector:**

```typescript
// Attacker provides absolute path to sensitive file
const absolutePath = '/etc/passwd';
await fs.readFile(absolutePath);
// Without validation, reads /etc/passwd
```

**Mitigation:**

```typescript
const safePath = validatePath(absolutePath);
// Throws: "Absolute paths are not allowed"
```

**Protection Mechanism:**

- Uses `path.isAbsolute()` to detect absolute paths
- Rejects Unix (`/path`), Windows (`C:\path`), and UNC (`\\server\share`) paths

---

## Integration with Trinity Commands

### Deploy Command Integration

```typescript
import { safeCopy } from '../utils/validate-path.js';

async function deployAgents(templatesPath: string) {
  const agentFiles = await fs.readdir(templatesPath);

  for (const agentFile of agentFiles) {
    // Safe copy with validation
    await safeCopy(
      path.join('templates/agents', agentFile),
      path.join('.claude/agents', agentFile)
    );
  }
}
```

---

### Update Command Integration

```typescript
import { validatePath, validateNotSymlink, safeCopy } from '../utils/validate-path.js';

async function updateKnowledgeBase() {
  // Validate knowledge base directory
  const kbDir = validatePath('trinity/knowledge-base');
  await validateNotSymlink(kbDir);

  // Safe backup
  await safeCopy('trinity/knowledge-base', 'trinity/backups/knowledge-base-2026-01-21');

  // Update files
  await safeCopy(
    'templates/knowledge-base/ARCHITECTURE.md',
    'trinity/knowledge-base/ARCHITECTURE.md'
  );
}
```

---

## Error Messages

### Path Traversal Error

```
Path traversal detected: ../../../etc/passwd
Path must be within project directory: /home/user/project
Attempted to access: /etc/passwd
```

### Absolute Path Error

```
Absolute paths are not allowed: /etc/passwd
Use relative paths within project directory.
```

### Symlink Error

```
Symlink detected: /home/user/project/link-to-secret
For security, symlinks are not allowed in Trinity operations.
Please use the actual file or directory instead.
```

### Symlink in Directory Error

```
Symlink detected in directory: /home/user/project/templates/malicious-link
For security, symlinks are not allowed in Trinity operations.
Please remove the symlink and use the actual file or directory instead.
```

### Null Byte Error

```
Invalid path: null byte detected in "file\0.txt"
Null bytes are not allowed in file paths.
```

### Source Not Found Error

```
Source path does not exist: nonexistent.txt
Resolved to: /home/user/project/nonexistent.txt
```

---

## Cross-Platform Considerations

### Path Separator Normalization

```typescript
// Windows input
validatePath('trinity\\agents\\mon.md');
// Normalized to: "trinity/agents/mon.md"

// Unix input
validatePath('trinity/agents/mon.md');
// Normalized to: "trinity/agents/mon.md"
```

**Implementation:** Uses `path.normalize()` which handles platform-specific separators.

---

### Absolute Path Detection

**Unix:**

- `/path/to/file` → Absolute
- `~/path/to/file` → Resolved by shell, not by Trinity

**Windows:**

- `C:\path\to\file` → Absolute
- `\path\to\file` → Absolute (drive-relative)
- `\\server\share\file` → Absolute (UNC path)

**All blocked by `path.isAbsolute()`**

---

## Performance Considerations

### `validatePath()` Performance

- **Synchronous operations:** `path.normalize()`, `path.isAbsolute()`, `path.resolve()`, `path.relative()`
- **No I/O operations:** Pure path computation
- **Typical performance:** <1ms per validation

### `validateNotSymlink()` Performance

- **Async I/O operation:** `fs.lstat()` (one syscall)
- **Typical performance:** 1-5ms per file

### `safeCopy()` Performance

- **Directory copy:** Recursive validation of all files
- **Example:** 1000-file directory with 10-level nesting → ~500ms validation
- **Trade-off:** Security vs. speed (security wins)

**Optimization Tips:**

- Cache validation results for repeated paths (not implemented)
- Validate once at command entry point, not per file operation

---

## Testing Recommendations

### Unit Tests

```typescript
describe('validatePath', () => {
  it('should allow relative paths', () => {
    expect(() => validatePath('trinity/agents')).not.toThrow();
  });

  it('should reject path traversal', () => {
    expect(() => validatePath('../../../etc/passwd')).toThrow('Path traversal detected');
  });

  it('should reject absolute paths', () => {
    expect(() => validatePath('/etc/passwd')).toThrow('Absolute paths are not allowed');
  });

  it('should reject null bytes', () => {
    expect(() => validatePath('file\0.txt')).toThrow('null byte detected');
  });

  it('should normalize path separators', () => {
    const result = validatePath('trinity\\agents');
    expect(result).toContain('trinity/agents');
  });
});

describe('validateNotSymlink', () => {
  it('should allow regular files', async () => {
    await expect(validateNotSymlink('/project/file.txt')).resolves.toBeUndefined();
  });

  it('should reject symlinks', async () => {
    await expect(validateNotSymlink('/project/symlink')).rejects.toThrow('Symlink detected');
  });

  it('should allow nonexistent files', async () => {
    await expect(validateNotSymlink('/project/nonexistent.txt')).resolves.toBeUndefined();
  });
});

describe('safeCopy', () => {
  it('should copy regular files', async () => {
    await expect(safeCopy('src.txt', 'dest.txt')).resolves.toBeUndefined();
  });

  it('should reject path traversal in destination', async () => {
    await expect(safeCopy('src.txt', '../outside/dest.txt')).rejects.toThrow('Path traversal');
  });

  it('should reject symlink source', async () => {
    await expect(safeCopy('symlink', 'dest.txt')).rejects.toThrow('Symlink detected');
  });

  it('should reject nonexistent source', async () => {
    await expect(safeCopy('nonexistent.txt', 'dest.txt')).rejects.toThrow('does not exist');
  });
});
```

---

## Known Limitations

1. **No UNC Path Normalization:**
   - Windows UNC paths (`\\server\share`) detected as absolute but not normalized
   - Edge case: UNC paths with `..` may bypass validation

2. **No URL Validation:**
   - `file://` URLs not explicitly blocked
   - `path.isAbsolute('file:///etc/passwd')` returns `false` (vulnerability)

3. **No Hard Link Detection:**
   - Only symlinks detected, not hard links
   - Hard links can bypass symlink checks

4. **Performance on Large Directories:**
   - Recursive validation scales with file count
   - 10,000-file directory → ~5 seconds validation

---

## Future Enhancements

### Planned Improvements

- [ ] Add hard link detection (`fs.stat().nlink > 1`)
- [ ] Add URL scheme validation (`file://`, `http://`, etc.)
- [ ] Add UNC path normalization for Windows
- [ ] Add path validation caching (session-level)
- [ ] Add allowlist for trusted symlinks (configuration)
- [ ] Add parallel directory validation (performance)

---

## Security Best Practices

### ✅ DO:

- Always call `validatePath()` on user-provided paths
- Use `safeCopy()` instead of `fs.copy()` for user-controlled sources
- Validate paths at command entry point (early validation)
- Use `validateNotSymlink()` before reading sensitive files
- Log security violations for audit trail

### ❌ DON'T:

- Trust user-provided paths without validation
- Use `fs.copy()` with user-controlled sources
- Follow symlinks in security-sensitive operations
- Use `stat()` instead of `lstat()` for symlink checks
- Skip validation for "trusted" inputs

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Uses safeCopy() for template deployment
- **Update Command:** [docs/api/update-command.md](update-command.md) - Uses validation for backup/restore
- **Agent Deployment:** [docs/api/deploy-agents.md](deploy-agents.md) - Validates agent file paths

---

## References

- **OWASP Path Traversal:** https://owasp.org/www-community/attacks/Path_Traversal
- **CWE-22:** Path Traversal Vulnerability
- **CWE-61:** UNIX Symbolic Link Following
- **Node.js Path Module:** https://nodejs.org/api/path.html
- **fs-extra Security:** https://github.com/jprichardson/node-fs-extra

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Security Status:** Production-ready (security-critical)
