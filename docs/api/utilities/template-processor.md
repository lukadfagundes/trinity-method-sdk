# Template Processor API Reference

**Module:** `src/cli/utils/template-processor.ts`
**Purpose:** Variable substitution in Trinity Method templates
**Priority:** HIGH (Core template engine)

---

## Overview

The Template Processor handles variable substitution in Trinity Method templates using `{{VARIABLE_NAME}}` placeholder syntax. It processes project metadata, stack information, and codebase metrics for deployment and update operations.

**Key Features:**

- 13 core variable resolvers with fallback logic
- Stack information extraction (framework, language, source directory)
- Codebase metrics formatting (code quality, complexity, dependencies, Git stats)
- Agent-only placeholder preservation
- Type-safe variable handling (string/number conversion)

---

## Core Functions

### `processTemplate(content: string, variables: Record<string, string | number>): string`

Main template processing function. Replaces all `{{PLACEHOLDER}}` occurrences with actual values.

**Parameters:**

- `content` (string) - Template content with `{{PLACEHOLDER}}` syntax
- `variables` (Record<string, string | number>) - Variable values for substitution

**Returns:** `string` - Processed template with all placeholders replaced

**Processing Logic:**

1. Iterate through all VARIABLE_RESOLVERS
2. For each resolver, compute value using resolver function
3. Replace all `{{KEY}}` occurrences with computed value
4. Return fully processed content

**Example Usage:**

```typescript
import { processTemplate } from './utils/template-processor.js';

const template = `
# {{PROJECT_NAME}}

**Framework:** {{FRAMEWORK}}
**Language:** {{LANGUAGE}}
**Source Directory:** {{SOURCE_DIR}}
**Deployed:** {{DEPLOYMENT_TIMESTAMP}}
`;

const variables = {
  PROJECT_NAME: 'My App',
  FRAMEWORK: 'Next.js',
  LANGUAGE: 'JavaScript/TypeScript',
  SOURCE_DIR: 'src',
  DEPLOYMENT_TIMESTAMP: '2026-01-21T10:30:00Z',
};

const result = processTemplate(template, variables);
console.log(result);
// Output:
// # My App
//
// **Framework:** Next.js
// **Language:** JavaScript/TypeScript
// **Source Directory:** src
// **Deployed:** 2026-01-21T10:30:00Z
```

**Fallback Behavior:**

- If variable not found in input, resolver provides default value
- Missing values replaced with safe defaults (e.g., "Unknown", "Generic", "src")

---

### `extractVariables(stack: Stack, projectName: string): Record<string, string>`

Extracts variables from Stack object (returned by `detectStack()`).

**Parameters:**

- `stack` (Stack) - Detected stack information
- `projectName` (string) - User-provided project name

**Returns:** `Record<string, string>` - Variable map for template processing

```typescript
interface Stack {
  language: string;
  framework: string;
  sourceDir: string;
  sourceDirs: string[];
  packageManager: string;
}
```

**Extracted Variables:**

- `projectName` - Project name (fallback: "My Project")
- `techStack` - Combined language/framework (e.g., "JavaScript/TypeScript / Next.js")
- `framework` - Detected framework
- `sourceDir` - Primary source directory
- `language` - Programming language
- `packageManager` - npm/yarn/pnpm
- `timestamp` - ISO 8601 timestamp (deployment time)

**Example:**

```typescript
import { detectStack } from './detect-stack.js';
import { extractVariables } from './template-processor.js';

const stack = await detectStack();
const variables = extractVariables(stack, 'EcommerceApp');

console.log(variables);
// Output:
// {
//   projectName: "EcommerceApp",
//   techStack: "JavaScript/TypeScript / React",
//   framework: "React",
//   sourceDir: "src",
//   language: "JavaScript/TypeScript",
//   packageManager: "pnpm",
//   timestamp: "2026-01-21T10:30:00.123Z"
// }
```

---

### `formatMetrics(metrics?: CodebaseMetrics): Record<string, string | number>`

Formats codebase metrics for template substitution.

**Parameters:**

- `metrics` (CodebaseMetrics, optional) - Collected codebase metrics

**Returns:** `Record<string, string | number>` - Formatted metrics or placeholders

**Behavior:**

- **With metrics:** Returns actual numeric values
- **Without metrics:** Returns `{{PLACEHOLDER}}` strings (for agent processing)

**Metric Categories:**

#### 1. Code Quality (6 metrics)

```typescript
{
  TODO_COUNT: 42,           // Total TODO comments
  TODO_COMMENTS: 38,        // TODO-specific comments
  FIXME_COUNT: 5,           // FIXME comments
  HACK_COUNT: 2,            // HACK/workaround comments
  CONSOLE_COUNT: 15,        // console.log statements
  COMMENTED_BLOCKS: 3       // Commented-out code blocks
}
```

#### 2. File Complexity (5 metrics)

```typescript
{
  TOTAL_FILES: 127,         // Total source files analyzed
  FILES_500: 8,             // Files over 500 lines
  FILES_1000: 2,            // Files over 1000 lines
  FILES_3000: 0,            // Files over 3000 lines
  AVG_LENGTH: 243           // Average file length (rounded)
}
```

#### 3. Dependencies (4 metrics)

```typescript
{
  DEPENDENCY_COUNT: 42,          // Production dependencies
  DEV_DEPENDENCY_COUNT: 18,      // Development dependencies
  FRAMEWORK_VERSION: "14.2.3",   // Primary framework version
  PACKAGE_MANAGER: "pnpm"        // npm/yarn/pnpm
}
```

#### 4. Git Metrics (3 metrics)

```typescript
{
  COMMIT_COUNT: 342,                    // Total commits
  CONTRIBUTOR_COUNT: 5,                 // Unique contributors
  LAST_COMMIT: "2026-01-20T15:42:00Z"  // Last commit timestamp
}
```

#### 5. Agent-Only Placeholders (12 metrics)

```typescript
{
  OVERALL_COVERAGE: "{{OVERALL_COVERAGE}}",      // Test coverage %
  UNIT_COVERAGE: "{{UNIT_COVERAGE}}",            // Unit test coverage
  DEPRECATED_COUNT: "{{DEPRECATED_COUNT}}",      // Deprecated API usage
  ANTIPATTERN_COUNT: "{{ANTIPATTERN_COUNT}}",    // Code antipatterns
  PERF_ISSUE_COUNT: "{{PERF_ISSUE_COUNT}}",      // Performance issues
  SECURITY_COUNT: "{{SECURITY_COUNT}}",          // Security vulnerabilities
  COMPONENT_1: "{{COMPONENT_1}}",                // Top architecture component
  RESPONSIBILITY_1: "{{RESPONSIBILITY_1}}",      // Component responsibility
  BACKEND_FRAMEWORK: "{{BACKEND_FRAMEWORK}}",    // Backend framework
  DATABASE_TYPE: "{{DATABASE_TYPE}}",            // Database type
  AUTH_TYPE: "{{AUTH_TYPE}}",                    // Authentication method
  STYLING_SOLUTION: "{{STYLING_SOLUTION}}"       // CSS/styling framework
}
```

**Example:**

```typescript
import { formatMetrics } from './template-processor.js';

// Without metrics (deploy command)
const placeholders = formatMetrics();
console.log(placeholders.TODO_COUNT);
// Output: "{{TODO_COUNT}}" (string placeholder)

// With metrics (update command after JUNO analysis)
const actualMetrics = {
  todoCount: 42,
  fixmeComments: 5,
  totalFiles: 127,
  avgFileLength: 243.5,
  dependencyCount: 42,
};
const formatted = formatMetrics(actualMetrics);
console.log(formatted.TODO_COUNT);
// Output: 42 (numeric value)
```

---

## Variable Resolvers

### Core Resolver Functions

All resolvers follow the same pattern: Check multiple variable name variants, fallback to default.

#### `PROJECT_NAME`

**Variants:** `PROJECT_NAME`, `projectName`
**Default:** `"Unknown Project"`

```typescript
PROJECT_NAME: (v) => toString(v.PROJECT_NAME || v.projectName) || 'Unknown Project';
```

#### `FRAMEWORK`

**Variants:** `FRAMEWORK`, `framework`
**Default:** `"Generic"`

```typescript
FRAMEWORK: (v) => toString(v.FRAMEWORK || v.framework) || 'Generic';
```

#### `LANGUAGE`

**Variants:** `LANGUAGE`, `language`
**Default:** `"Unknown"`

```typescript
LANGUAGE: (v) => toString(v.LANGUAGE || v.language) || 'Unknown';
```

#### `SOURCE_DIR`

**Variants:** `SOURCE_DIR`, `sourceDir`
**Default:** `"src"`

```typescript
SOURCE_DIR: (v) => toString(v.SOURCE_DIR || v.sourceDir) || 'src';
```

#### `PACKAGE_MANAGER`

**Variants:** `PACKAGE_MANAGER`, `packageManager`
**Default:** `"npm"`

```typescript
PACKAGE_MANAGER: (v) => toString(v.PACKAGE_MANAGER || v.packageManager) || 'npm';
```

#### `DEPLOYMENT_TIMESTAMP`

**Variants:** `DEPLOYMENT_TIMESTAMP`, `timestamp`
**Default:** Current ISO timestamp

```typescript
DEPLOYMENT_TIMESTAMP: (v) =>
  toString(v.DEPLOYMENT_TIMESTAMP || v.timestamp) || new Date().toISOString();
```

#### `TRINITY_VERSION`

**Variant:** `TRINITY_VERSION` only
**Default:** `"2.1.0"`

```typescript
TRINITY_VERSION: (v) => toString(v.TRINITY_VERSION) || '2.1.0';
```

#### `TECH_STACK` / `TECHNOLOGY_STACK`

**Variants:** `TECH_STACK`, `techStack`
**Default:** `"Unknown"`

```typescript
TECH_STACK: (v) => toString(v.TECH_STACK || v.techStack) || 'Unknown';
TECHNOLOGY_STACK: (v) => toString(v.TECHNOLOGY_STACK || v.TECH_STACK || v.techStack) || 'Unknown';
```

#### `PRIMARY_FRAMEWORK`

**Variants:** `PRIMARY_FRAMEWORK`, `FRAMEWORK`, `framework`
**Default:** `"Generic"`

```typescript
PRIMARY_FRAMEWORK: (v) => toString(v.PRIMARY_FRAMEWORK || v.FRAMEWORK || v.framework) || 'Generic';
```

#### `CURRENT_DATE`

**Variant:** `CURRENT_DATE` only
**Default:** Current date (YYYY-MM-DD)

```typescript
CURRENT_DATE: (v) => toString(v.CURRENT_DATE) || new Date().toISOString().split('T')[0];
```

#### `PROJECT_VAR_NAME`

**Complex Resolver:** Converts project name to valid variable name

**Logic:**

1. Use `PROJECT_VAR_NAME` if provided
2. Otherwise, take `PROJECT_NAME` or `projectName`
3. Convert to lowercase
4. Remove all non-alphanumeric characters
5. Fallback to `"project"`

```typescript
PROJECT_VAR_NAME: (v) => resolveProjectVarName(v);

function resolveProjectVarName(variables) {
  return (
    toString(variables.PROJECT_VAR_NAME) ||
    String(variables.PROJECT_NAME || variables.projectName || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
  );
}
```

**Example:**

```typescript
resolveProjectVarName({ PROJECT_NAME: 'My Awesome App!' });
// Output: "myawesomeapp"

resolveProjectVarName({ PROJECT_NAME: 'E-Commerce 2.0' });
// Output: "ecommerce20"
```

#### `TRINITY_HOME`

**Variants:** `TRINITY_HOME`, `process.env.TRINITY_HOME`
**Default:** `"C:/Users/lukaf/Desktop/Dev Work/trinity-method"`

```typescript
TRINITY_HOME: (v) =>
  toString(v.TRINITY_HOME) ||
  process.env.TRINITY_HOME ||
  'C:/Users/lukaf/Desktop/Dev Work/trinity-method';
```

**Note:** Used for Trinity SDK development/testing paths.

---

## Helper Functions

### `toString(value: string | number | undefined): string`

Safely converts any value to string.

**Parameters:**

- `value` (string | number | undefined) - Value to convert

**Returns:** `string` - Converted value or empty string

**Logic:**

```typescript
function toString(value: string | number | undefined): string {
  return value !== undefined ? String(value) : '';
}
```

**Examples:**

```typescript
toString(42); // "42"
toString('hello'); // "hello"
toString(undefined); // ""
toString(0); // "0"
toString(false); // "false"
```

---

## Metrics Processing

### Code Quality Metrics Formatting

```typescript
function formatCodeQualityMetrics(metrics: CodebaseMetrics) {
  return {
    TODO_COUNT: metrics.todoCount || 0,
    TODO_COMMENTS: metrics.todoComments || 0,
    FIXME_COUNT: metrics.fixmeComments || 0,
    HACK_COUNT: metrics.hackComments || 0,
    CONSOLE_COUNT: metrics.consoleStatements || 0,
    COMMENTED_BLOCKS: metrics.commentedCodeBlocks || 0,
  };
}
```

**Fallback:** All metrics default to `0` if undefined.

---

### File Complexity Metrics Formatting

```typescript
function formatFileComplexityMetrics(metrics: CodebaseMetrics) {
  return {
    TOTAL_FILES: metrics.totalFiles || 0,
    FILES_500: metrics.filesOver500 || 0,
    FILES_1000: metrics.filesOver1000 || 0,
    FILES_3000: metrics.filesOver3000 || 0,
    AVG_LENGTH: Math.round(metrics.avgFileLength || 0),
  };
}
```

**Note:** `AVG_LENGTH` is rounded to nearest integer.

---

### Dependency Metrics Formatting

```typescript
function formatDependencyMetrics(metrics: CodebaseMetrics) {
  return {
    DEPENDENCY_COUNT: metrics.dependencyCount || 0,
    DEV_DEPENDENCY_COUNT: metrics.devDependencyCount || 0,
    FRAMEWORK_VERSION: metrics.frameworkVersion || 'Unknown',
    PACKAGE_MANAGER: metrics.packageManager || 'Unknown',
  };
}
```

---

### Git Metrics Formatting

```typescript
function formatGitMetrics(metrics: CodebaseMetrics) {
  return {
    COMMIT_COUNT: metrics.commitCount || 0,
    CONTRIBUTOR_COUNT: metrics.contributors || 1,
    LAST_COMMIT: metrics.lastCommitDate || 'Unknown',
  };
}
```

**Note:** `CONTRIBUTOR_COUNT` defaults to `1` (assumes at least one contributor).

---

## Placeholder Preservation

### Agent-Only Placeholders

Certain metrics are **agent-only** and remain as `{{PLACEHOLDER}}` strings during deployment:

```typescript
function getAgentOnlyPlaceholders() {
  return {
    OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
    UNIT_COVERAGE: '{{UNIT_COVERAGE}}',
    DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}',
    ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}',
    PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}',
    SECURITY_COUNT: '{{SECURITY_COUNT}}',
    COMPONENT_1: '{{COMPONENT_1}}',
    RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}',
    BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}',
    DATABASE_TYPE: '{{DATABASE_TYPE}}',
    AUTH_TYPE: '{{AUTH_TYPE}}',
    STYLING_SOLUTION: '{{STYLING_SOLUTION}}',
  };
}
```

**Purpose:** These placeholders are filled later by Trinity agents (JUNO, ATLAS, etc.) during investigations.

---

## Integration with Deploy/Update Commands

### Deploy Command Integration

```typescript
import { detectStack } from '../utils/detect-stack.js';
import { extractVariables, processTemplate } from '../utils/template-processor.js';

async function deploy(options) {
  const stack = await detectStack();
  const variables = extractVariables(stack, options.projectName);

  // Process CLAUDE.md template
  const claudeTemplate = await fs.readFile('templates/CLAUDE.md', 'utf8');
  const claudeContent = processTemplate(claudeTemplate, variables);
  await fs.writeFile('CLAUDE.md', claudeContent);

  // Process knowledge base templates
  const architectureTemplate = await fs.readFile('templates/ARCHITECTURE.md', 'utf8');
  const architectureContent = processTemplate(architectureTemplate, variables);
  await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', architectureContent);
}
```

---

### Update Command Integration

```typescript
import { formatMetrics, processTemplate } from '../utils/template-processor.js';
import { collectMetrics } from '../commands/update/metrics.js';

async function update(options) {
  // Collect codebase metrics (JUNO integration)
  const metrics = await collectMetrics();
  const formattedMetrics = formatMetrics(metrics);

  // Update ARCHITECTURE.md with real metrics
  const template = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
  const updated = processTemplate(template, formattedMetrics);
  await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', updated);
}
```

---

## Template Examples

### Example 1: Project Root CLAUDE.md

```markdown
# {{PROJECT_NAME}} - Claude Code Memory

**Framework:** {{FRAMEWORK}}
**Tech Stack:** {{TECHNOLOGY_STACK}}
**Source Directory:** {{SOURCE_DIR}}
**Trinity Version:** {{TRINITY_VERSION}}
**Deployed:** {{DEPLOYMENT_TIMESTAMP}}
```

**After Processing (Deploy):**

```markdown
# EcommerceApp - Claude Code Memory

**Framework:** Next.js
**Tech Stack:** JavaScript/TypeScript / Next.js
**Source Directory:** src
**Trinity Version:** 2.1.0
**Deployed:** 2026-01-21T10:30:00.123Z
```

---

### Example 2: ARCHITECTURE.md with Metrics

```markdown
## Codebase Metrics

### Code Quality

- TODO Comments: {{TODO_COUNT}}
- FIXME Comments: {{FIXME_COUNT}}
- HACK Comments: {{HACK_COUNT}}
- Console Statements: {{CONSOLE_COUNT}}

### File Complexity

- Total Files: {{TOTAL_FILES}}
- Average Length: {{AVG_LENGTH}} lines
- Files over 500 lines: {{FILES_500}}
- Files over 1000 lines: {{FILES_1000}}
```

**After Deploy (No Metrics):**

```markdown
## Codebase Metrics

### Code Quality

- TODO Comments: {{TODO_COUNT}}
- FIXME Comments: {{FIXME_COUNT}}
- HACK Comments: {{HACK_COUNT}}
- Console Statements: {{CONSOLE_COUNT}}

### File Complexity

- Total Files: {{TOTAL_FILES}}
- Average Length: {{AVG_LENGTH}} lines
- Files over 500 lines: {{FILES_500}}
- Files over 1000 lines: {{FILES_1000}}
```

**After Update (With Metrics from JUNO):**

```markdown
## Codebase Metrics

### Code Quality

- TODO Comments: 42
- FIXME Comments: 5
- HACK Comments: 2
- Console Statements: 15

### File Complexity

- Total Files: 127
- Average Length: 243 lines
- Files over 500 lines: 8
- Files over 1000 lines: 2
```

---

## Performance Considerations

**Regex Compilation:**

- Regex compiled once per variable (`new RegExp`)
- Global flag ensures all occurrences replaced

**String Replacement:**

- Sequential processing (not parallel)
- Typical performance: <5ms for 50KB template with 20 placeholders

**Optimization Tips:**

- Cache processed templates if reused multiple times
- Pre-compute variables object before processing multiple templates

---

## Security Considerations

### Safe String Conversion

- All values converted through `toString()` helper
- No `eval()` or code execution
- Undefined values safely handled (empty string)

### Injection Prevention

- Placeholders use regex with exact matching (`{{KEY}}`)
- No arbitrary code execution in resolver functions
- Variable names validated (alphanumeric only for `PROJECT_VAR_NAME`)

### Environment Variables

- `TRINITY_HOME` reads from environment
- Hardcoded fallback for safety (SDK development path)
- No sensitive data in templates

---

## Testing Recommendations

### Unit Tests

```typescript
describe('processTemplate', () => {
  it('should replace single placeholder', () => {
    const template = 'Project: {{PROJECT_NAME}}';
    const result = processTemplate(template, { PROJECT_NAME: 'TestApp' });
    expect(result).toBe('Project: TestApp');
  });

  it('should replace multiple occurrences', () => {
    const template = '{{FRAMEWORK}} uses {{FRAMEWORK}}';
    const result = processTemplate(template, { FRAMEWORK: 'React' });
    expect(result).toBe('React uses React');
  });

  it('should use fallback for missing variable', () => {
    const template = 'Framework: {{FRAMEWORK}}';
    const result = processTemplate(template, {});
    expect(result).toBe('Framework: Generic');
  });
});

describe('extractVariables', () => {
  it('should extract all stack variables', () => {
    const stack = {
      language: 'JavaScript/TypeScript',
      framework: 'Next.js',
      sourceDir: 'src',
      sourceDirs: ['src'],
      packageManager: 'pnpm',
    };
    const vars = extractVariables(stack, 'MyApp');
    expect(vars.projectName).toBe('MyApp');
    expect(vars.framework).toBe('Next.js');
    expect(vars.techStack).toBe('JavaScript/TypeScript / Next.js');
  });
});

describe('formatMetrics', () => {
  it('should return placeholders without metrics', () => {
    const result = formatMetrics();
    expect(result.TODO_COUNT).toBe('{{TODO_COUNT}}');
  });

  it('should return actual values with metrics', () => {
    const metrics = { todoCount: 42, fixmeComments: 5 };
    const result = formatMetrics(metrics);
    expect(result.TODO_COUNT).toBe(42);
    expect(result.FIXME_COUNT).toBe(5);
  });
});
```

---

## Known Limitations

1. **No Nested Placeholders:**
   - `{{{{PROJECT_NAME}}}}` not supported
   - Placeholders must be top-level

2. **No Conditional Logic:**
   - No `{{#if}}` or `{{#each}}` syntax
   - Simple key-value substitution only

3. **No Custom Resolvers:**
   - Resolvers hardcoded in `VARIABLE_RESOLVERS`
   - Cannot add custom resolvers at runtime

4. **No Escape Sequences:**
   - Cannot escape `{{` or `}}` in templates
   - Literal braces require workarounds

---

## Future Enhancements

### Planned Improvements

- [ ] Add conditional placeholder support (`{{#if CONDITION}}`)
- [ ] Support nested object access (`{{stack.framework}}`)
- [ ] Add escape sequences for literal `{{` / `}}`
- [ ] Plugin system for custom resolvers
- [ ] Template validation (warn on unknown placeholders)
- [ ] Performance profiling for large templates

---

## Related Documentation

- **Framework Detection:** [docs/api/detect-stack.md](detect-stack.md) - Provides Stack object
- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Main template consumer
- **Update Command:** [docs/api/update-command.md](update-command.md) - Uses metrics formatting
- **Metrics Collection:** (Future) - Provides CodebaseMetrics object

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
