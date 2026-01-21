# Framework Detection API Reference

**Module:** `src/cli/utils/detect-stack.ts`
**Purpose:** Auto-detect project framework and technology stack
**Priority:** HIGH (Critical for multi-framework support)

---

## Overview

The Framework Detection module automatically identifies project type, language, framework, package manager, and source directories. It supports Node.js, Python, Rust, Flutter, and Go projects with monorepo detection capabilities.

**Key Features:**

- Multi-framework detection (5 languages supported)
- Monorepo source directory discovery (2-level and 3-level nesting)
- Package manager identification (npm, yarn, pnpm)
- Framework-specific configuration (Next.js, React, Vue, Angular, Express, Flask)
- Graceful fallback to generic defaults

---

## Core Function

### `detectStack(targetDir?: string): Promise<Stack>`

Main entry point for stack detection. Orchestrates all detection logic.

**Parameters:**

- `targetDir` (string, optional) - Target directory to analyze (default: `process.cwd()`)

**Returns:** `Promise<Stack>` - Detected stack configuration

```typescript
interface Stack {
  language: string; // e.g., "JavaScript/TypeScript", "Python", "Rust"
  framework: string; // e.g., "Next.js", "Flask", "Generic"
  sourceDir: string; // Primary source directory (e.g., "src")
  sourceDirs: string[]; // All discovered source directories (monorepo support)
  packageManager: string; // "npm", "yarn", or "pnpm"
}
```

**Detection Order:**

1. Flutter (pubspec.yaml) - **Checked FIRST to avoid false positives**
2. Rust (Cargo.toml)
3. Go (go.mod)
4. Node.js (package.json)
5. Python (requirements.txt, setup.py, pyproject.toml)

**Example Usage:**

```typescript
import { detectStack } from './utils/detect-stack.js';

// Detect current directory
const stack = await detectStack();
console.log(stack);
// Output: {
//   language: "JavaScript/TypeScript",
//   framework: "Next.js",
//   sourceDir: "src",
//   sourceDirs: ["src", "backend/src", "frontend/src"],
//   packageManager: "pnpm"
// }

// Detect specific directory
const projectStack = await detectStack('/path/to/project');
```

**Error Handling:**

- Returns generic defaults on detection failures
- Logs warnings for parsing errors (e.g., invalid package.json)
- Never throws errors - graceful degradation

---

## Framework-Specific Detectors

### `detectFlutter(targetDir: string): Promise<Partial<Stack> | null>`

Detects Flutter/Dart projects.

**Detection Method:** Checks for `pubspec.yaml` file

**Returns:**

```typescript
{
  language: "Dart",
  framework: "Flutter",
  sourceDir: "lib"
}
```

**Why Flutter First?**
Flutter projects may have `package.json` if using Trinity SDK, causing false Node.js detection. Flutter check runs first to prevent this.

---

### `detectRust(targetDir: string): Promise<Partial<Stack> | null>`

Detects Rust projects.

**Detection Method:** Checks for `Cargo.toml` file

**Returns:**

```typescript
{
  language: "Rust",
  framework: "Generic",
  sourceDir: "src"
}
```

---

### `detectGo(targetDir: string): Promise<Partial<Stack> | null>`

Detects Go projects.

**Detection Method:** Checks for `go.mod` file

**Returns:**

```typescript
{
  language: "Go",
  framework: "Generic",
  sourceDir: "."
}
```

**Note:** Go typically uses root directory as source, not subdirectory.

---

### `detectNodeJs(targetDir: string): Promise<Partial<Stack> | null>`

Detects Node.js/JavaScript/TypeScript projects with framework identification.

**Detection Method:** Checks for `package.json`, analyzes dependencies

**Framework Detection Logic:**

1. Check `dependencies` in package.json
2. Match against known frameworks (priority order):
   - Next.js (`next`)
   - React (`react`)
   - Vue (`vue`)
   - Angular (`@angular/core`)
   - Express (`express`)
3. Default to "Node.js" if no framework match

**Returns:**

```typescript
{
  language: "JavaScript/TypeScript",
  framework: "Next.js" | "React" | "Vue" | "Angular" | "Express" | "Node.js",
  sourceDir: "src/app" | "src", // Angular uses src/app, others use src
  packageManager: "npm" | "yarn" | "pnpm"
}
```

**Package Manager Detection:**

- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- Default → npm

**Example:**

```typescript
// package.json with Next.js
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0"
  }
}

// Detected as:
{
  language: "JavaScript/TypeScript",
  framework: "Next.js",  // Next.js takes priority over React
  sourceDir: "src",
  packageManager: "pnpm"
}
```

**Error Handling:**

- Invalid JSON: Logs error, returns `null`
- Missing dependencies: Falls back to "Node.js"

---

### `detectPython(targetDir: string): Promise<Partial<Stack> | null>`

Detects Python projects with Flask framework detection.

**Detection Method:** Checks for Python project files:

- `requirements.txt`
- `setup.py`
- `pyproject.toml`

**Framework Detection:**

- Checks `requirements.txt` for "flask" (case-insensitive)
- Defaults to "Generic" if no Flask detected

**Returns:**

```typescript
{
  language: "Python",
  framework: "Flask" | "Generic",
  sourceDir: "app"
}
```

**Example:**

```python
# requirements.txt
Flask==2.3.0
requests==2.28.0

# Detected as:
{
  language: "Python",
  framework: "Flask",
  sourceDir: "app"
}
```

---

## Source Directory Discovery

### `detectSourceDirectories(targetDir: string): Promise<string[]>`

Discovers all source directories for monorepo support.

**Detection Levels:**

1. **Top-level directories** (18 common names):
   - `src`, `lib`, `app`, `backend`, `frontend`, `server`, `client`, `database`
   - `packages`, `apps`, `bot`

2. **2-level nested patterns** (e.g., `backend/src`, `frontend/lib`)
3. **3-level nested patterns** (e.g., `src/backend/src`, `frontend/app/lib`)

**Total Patterns Checked:** 44 combinations

**Returns:** `string[]` - Array of relative paths

**Example:**

```typescript
// Monorepo structure:
// project/
// ├── src/
// ├── backend/src/
// ├── frontend/
// │   └── src/
// └── packages/

const dirs = await detectSourceDirectories('/path/to/project');
console.log(dirs);
// Output: ["src", "backend/src", "frontend/src", "packages"]
```

**Deduplication:**

- Intermediate directories automatically added for 3-level patterns
- No duplicate paths in output

---

### `finalizeSourceDirs(result: Stack): void`

Ensures consistency between `sourceDir` and `sourceDirs`.

**Logic:**

1. If `sourceDirs` is empty → Set to `[sourceDir]`
2. If `sourceDirs` doesn't include `sourceDir` → Set `sourceDir` to `sourceDirs[0]`

**Purpose:** Guarantees `sourceDir` is always present in `sourceDirs` array.

---

## Helper Functions

### `exists(filePath: string): Promise<boolean>`

Checks if file or directory exists.

**Implementation:** Uses `fs.access()` with try-catch

**Returns:** `true` if exists, `false` otherwise

**Note:** Never throws errors - safe for existence checks.

---

## Detection Flow Diagram

```
detectStack()
    ↓
Initialize default Stack object
    ↓
Run detectors in order:
    ├→ detectFlutter()
    │   └→ pubspec.yaml exists? → Return Flutter stack
    ├→ detectRust()
    │   └→ Cargo.toml exists? → Return Rust stack
    ├→ detectGo()
    │   └→ go.mod exists? → Return Go stack
    ├→ detectNodeJs()
    │   ├→ package.json exists?
    │   ├→ Parse JSON
    │   ├→ detectNodeFramework() (check dependencies)
    │   ├→ detectPackageManager() (check lock files)
    │   └→ Return Node stack
    └→ detectPython()
        ├→ requirements.txt/setup.py/pyproject.toml exists?
        ├→ Check requirements.txt for Flask
        └→ Return Python stack
    ↓
Detect all source directories (monorepo)
    ↓
Finalize source directories (consistency check)
    ↓
Return Stack object
```

---

## Common Source Directory Patterns

### Top-Level Directories (11)

- `src` - Standard source code
- `lib` - Library code
- `app` - Application code
- `backend` - Backend services
- `frontend` - Frontend code
- `server` - Server code
- `client` - Client code
- `database` - Database code
- `packages` - Monorepo packages
- `apps` - Monorepo applications
- `bot` - Bot code

### 2-Level Patterns (18)

- `backend/src`, `backend/lib`, `backend/app`
- `frontend/src`, `frontend/lib`, `frontend/app`
- `server/src`, `server/lib`, `server/app`
- `client/src`, `client/lib`, `client/app`
- `bot/src`, `bot/lib`, `bot/app`
- `src/backend`, `src/frontend`, `src/database`, `src/server`, `src/client`, `src/bot`

### 3-Level Patterns (15)

- `src/backend/src`, `src/backend/lib`, `src/backend/app`
- `src/frontend/src`, `src/frontend/lib`, `src/frontend/app`
- `src/database/src`, `src/database/lib`
- `frontend/app/lib`, `frontend/app/src`
- `backend/app/lib`, `backend/app/src`
- `server/app/lib`, `server/app/src`
- `client/app/lib`, `client/app/src`

**Total:** 44 unique patterns

---

## Error Handling Strategy

### Graceful Degradation

```typescript
// Default fallback values (when detection fails)
{
  language: "Unknown",
  framework: "Generic",
  sourceDir: "src",
  sourceDirs: [],
  packageManager: "npm"
}
```

### Error Scenarios

| Scenario               | Behavior                                            |
| ---------------------- | --------------------------------------------------- |
| Invalid package.json   | Log error, return `null`, continue to next detector |
| Missing files          | Return `null`, continue to next detector            |
| Permission errors      | Log warning, return generic defaults                |
| Unreadable directories | Skip directory, continue scanning                   |

### Logging

**Warning Messages:**

```typescript
displayWarning(`Error detecting stack: ${errorMessage}`);
displayError(`Error parsing package.json: ${errorMessage}`);
```

**Never Throws:**
All detection functions catch and handle errors internally. `detectStack()` always returns a valid `Stack` object.

---

## Integration with Deploy Command

```typescript
// Used in deploy command
import { detectStack } from '../utils/detect-stack.js';

async function deploy(options: DeployOptions) {
  const stack = await detectStack(options.targetDir);

  console.log(`Detected: ${stack.framework} (${stack.language})`);
  console.log(`Source directories: ${stack.sourceDirs.join(', ')}`);
  console.log(`Package manager: ${stack.packageManager}`);

  // Use stack info for template processing
  const variables = {
    FRAMEWORK: stack.framework,
    SOURCE_DIR: stack.sourceDir,
    LANGUAGE: stack.language,
  };
}
```

---

## Performance Considerations

**File System Operations:**

- Total checks: ~50 file existence checks (worst case)
- Optimized: Stops at first match (detector array pattern)
- Async: All file operations use `fs.promises` for non-blocking I/O

**Caching:**

- No built-in caching (detection runs once per command invocation)
- Consider caching in caller if multiple detections needed

**Typical Performance:**

- Node.js project: ~20ms
- Monorepo with 10+ source dirs: ~100ms
- Empty directory: ~15ms (fast fallback)

---

## Security Considerations

### Path Traversal Prevention

- All paths resolved relative to `targetDir`
- No user input paths used directly
- File existence checks use `fs.access()` (safe, no content read)

### Symlink Handling

- `fs.access()` follows symlinks by default
- No symlink-specific vulnerabilities (read-only operations)

### JSON Parsing Safety

```typescript
try {
  const pkg = JSON.parse(pkgContent);
  // Safe: No eval or code execution
} catch (parseError) {
  // Error logged, no sensitive data exposed
  return null;
}
```

---

## Testing Recommendations

### Unit Tests

```typescript
describe('detectStack', () => {
  it('should detect Next.js project', async () => {
    const stack = await detectStack('/path/to/nextjs-project');
    expect(stack.framework).toBe('Next.js');
    expect(stack.language).toBe('JavaScript/TypeScript');
  });

  it('should detect Flutter before Node.js', async () => {
    // Project with both pubspec.yaml and package.json
    const stack = await detectStack('/path/to/flutter-with-trinity');
    expect(stack.framework).toBe('Flutter');
  });

  it('should handle monorepo source directories', async () => {
    const stack = await detectStack('/path/to/monorepo');
    expect(stack.sourceDirs.length).toBeGreaterThan(1);
  });

  it('should fallback to generic defaults gracefully', async () => {
    const stack = await detectStack('/empty-directory');
    expect(stack.language).toBe('Unknown');
    expect(stack.framework).toBe('Generic');
  });
});
```

### Integration Tests

```typescript
it('should integrate with deploy command', async () => {
  const stack = await detectStack();
  const variables = extractVariables(stack, 'TestProject');

  expect(variables.FRAMEWORK).toBeDefined();
  expect(variables.SOURCE_DIR).toBeDefined();
});
```

---

## Known Limitations

1. **Framework Detection Limited:**
   - Only detects popular frameworks (Next.js, React, Vue, Angular, Express, Flask)
   - Custom frameworks not recognized (falls back to generic)

2. **Dependency-Based Detection:**
   - Relies on `dependencies` in package.json (not `devDependencies`)
   - Projects without dependencies may be misidentified

3. **Monorepo Complexity:**
   - Only detects predefined patterns (44 combinations)
   - Custom directory structures not discovered

4. **Python Framework Detection:**
   - Only Flask detected (Django, FastAPI not supported yet)
   - Requires `requirements.txt` (doesn't check `pyproject.toml` dependencies)

---

## Future Enhancements

### Planned Improvements

- [ ] Django and FastAPI detection
- [ ] .NET/C# project detection
- [ ] Ruby/Rails detection
- [ ] Custom pattern configuration (user-defined source directories)
- [ ] Cache detection results (session-level caching)
- [ ] Detect multiple frameworks in monorepo (per-directory detection)

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Uses stack detection
- **Template Processor:** [docs/api/template-processor.md](template-processor.md) - Uses stack variables
- **Configuration Module:** [docs/api/deploy-configuration.md](deploy-configuration.md) - Framework-specific prompts

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.0.0
**Module Stability:** Stable (production-ready)
