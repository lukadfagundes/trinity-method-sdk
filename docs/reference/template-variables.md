# Template Variables Reference

**Trinity Version:** 2.1.0
**Last Updated:** 2026-02-23

Complete reference for Trinity Method template variables.

## Overview

Trinity Method uses simple `{{VARIABLE_NAME}}` syntax for template variable substitution during deployment. This document lists all 13 available variables, their resolver functions, default values, and where they're used.

## Variable Substitution System

### Syntax

```
{{VARIABLE_NAME}}
```

### Processing

Variables are replaced during `trinity deploy` using the `VARIABLE_RESOLVERS` map in `src/cli/utils/template-processor.ts`. Each variable has a resolver function that accepts a variables record and returns a resolved string value.

```typescript
// VARIABLE_RESOLVERS maps placeholder names to resolution functions
const VARIABLE_RESOLVERS: Record<string, (vars: Record<string, string | number>) => string> = {
  PROJECT_NAME: (v) => toString(v.PROJECT_NAME || v.projectName) || 'Unknown Project',
  TECH_STACK: (v) => toString(v.TECH_STACK || v.techStack) || 'Unknown',
  FRAMEWORK: (v) => toString(v.FRAMEWORK || v.framework) || 'Generic',
  // ... 13 resolvers total
};
```

### Template Processing Function

```typescript
export function processTemplate(
  content: string,
  variables: Record<string, string | number>
): string {
  let processed = content;
  for (const [key, resolver] of Object.entries(VARIABLE_RESOLVERS)) {
    const value = resolver(variables);
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    processed = processed.replace(regex, value);
  }
  return processed;
}
```

**Note:** There is no unresolved variable validation. Any `{{VAR}}` patterns not matching a resolver key are left as-is in the output.

---

## Variable Reference Table

| Variable                   | Default Value              | Source                                                  | Description                             |
| -------------------------- | -------------------------- | ------------------------------------------------------- | --------------------------------------- |
| `{{PROJECT_NAME}}`         | `'Unknown Project'`        | `v.PROJECT_NAME \|\| v.projectName`                     | Project name                            |
| `{{TECH_STACK}}`           | `'Unknown'`                | `v.TECH_STACK \|\| v.techStack`                         | Combined language/framework string      |
| `{{FRAMEWORK}}`            | `'Generic'`                | `v.FRAMEWORK \|\| v.framework`                          | Detected or selected framework          |
| `{{SOURCE_DIR}}`           | `'src'`                    | `v.SOURCE_DIR \|\| v.sourceDir`                         | Primary source directory                |
| `{{DEPLOYMENT_TIMESTAMP}}` | `new Date().toISOString()` | `v.DEPLOYMENT_TIMESTAMP \|\| v.timestamp`               | ISO timestamp of deployment             |
| `{{LANGUAGE}}`             | `'Unknown'`                | `v.LANGUAGE \|\| v.language`                            | Programming language                    |
| `{{PACKAGE_MANAGER}}`      | `'npm'`                    | `v.PACKAGE_MANAGER \|\| v.packageManager`               | Package manager (npm/yarn/pnpm)         |
| `{{TRINITY_VERSION}}`      | `'2.1.0'`                  | `v.TRINITY_VERSION`                                     | Trinity SDK version                     |
| `{{TECHNOLOGY_STACK}}`     | `'Unknown'`                | `v.TECHNOLOGY_STACK \|\| v.TECH_STACK \|\| v.techStack` | Technology stack (alias for TECH_STACK) |
| `{{PRIMARY_FRAMEWORK}}`    | `'Generic'`                | `v.PRIMARY_FRAMEWORK \|\| v.FRAMEWORK \|\| v.framework` | Primary framework (alias for FRAMEWORK) |
| `{{CURRENT_DATE}}`         | `YYYY-MM-DD`               | `v.CURRENT_DATE`                                        | Deployment date in ISO date format      |
| `{{PROJECT_VAR_NAME}}`     | Derived from PROJECT_NAME  | `resolveProjectVarName()`                               | Lowercase alphanumeric project name     |
| `{{TRINITY_HOME}}`         | `process.cwd()`            | `v.TRINITY_HOME \|\| process.env.TRINITY_HOME`          | Trinity home directory path             |

**Total:** 13 variables

---

## Core Variables (Detailed)

### `{{PROJECT_NAME}}`

**Description:** Project name used throughout Trinity deployment

**Resolver:** `(v) => toString(v.PROJECT_NAME || v.projectName) || 'Unknown Project'`

**Default:** `'Unknown Project'`

**Source:**

1. Auto-detected from:
   - Node.js: `package.json` → `name` field
   - Python: `pyproject.toml` → `[project] name` or `setup.py` → `name`
   - Rust: `Cargo.toml` → `[package] name`
   - Flutter: `pubspec.yaml` → `name`
   - Go: `go.mod` → module name
2. User input during interactive deployment (if not detected)

**Used In:**

- `.claude/agents/*` - Agent prompts reference project name
- `.claude/trinity/knowledge-base/Trinity.md` - Project-specific guide
- `.claude/trinity/knowledge-base/ARCHITECTURE.md` - Architecture documentation
- CI/CD workflows - Workflow names include project name
- Documentation templates

**Template Example:**

```markdown
# Trinity Method - {{PROJECT_NAME}}

Welcome to the Trinity Method guide for {{PROJECT_NAME}}.
```

---

### `{{TECH_STACK}}`

**Description:** Combined language and framework string (e.g., "JavaScript/TypeScript / Next.js")

**Resolver:** `(v) => toString(v.TECH_STACK || v.techStack) || 'Unknown'`

**Default:** `'Unknown'`

**Source:** Generated by `extractVariables()` as `${stack.language} / ${stack.framework}`

**Used In:**

- `.claude/trinity/knowledge-base/ARCHITECTURE.md` - Tech stack documentation
- `CLAUDE.md` files - Project context

---

### `{{FRAMEWORK}}`

**Description:** Detected or selected framework

**Resolver:** `(v) => toString(v.FRAMEWORK || v.framework) || 'Generic'`

**Default:** `'Generic'`

**Possible Values:**

- `Node.js`, `Next.js`, `React`, `Vue`, `Angular`, `Express`
- `Python`, `Flask`
- `Rust`
- `Flutter`
- `Go`
- `Generic` (fallback)

**Used In:**

- `.claude/trinity/knowledge-base/Trinity.md` - Framework-specific guidance
- `.claude/trinity/knowledge-base/TESTING-PRINCIPLES.md` - Framework testing patterns
- `.claude/trinity/knowledge-base/CODING-PRINCIPLES.md` - Framework best practices
- `CLAUDE.md` hierarchy - Framework context

---

### `{{SOURCE_DIR}}`

**Description:** Primary source code directory

**Resolver:** `(v) => toString(v.SOURCE_DIR || v.sourceDir) || 'src'`

**Default:** `'src'`

**Possible Values:**

- `src` (Node.js, Rust default)
- `lib` (Flutter)
- `app` (Python)
- `src/app` (Angular)
- `.` (Go)

**Used In:**

- Agent prompts - Source directory references
- Knowledge base - Architecture documentation

---

### `{{DEPLOYMENT_TIMESTAMP}}`

**Description:** ISO timestamp of when Trinity was deployed

**Resolver:** `(v) => toString(v.DEPLOYMENT_TIMESTAMP || v.timestamp) || new Date().toISOString()`

**Default:** Current ISO timestamp (e.g., `2026-02-23T10:30:00.000Z`)

**Used In:**

- `CLAUDE.md` files - Deployment tracking
- Knowledge base - Deployment metadata

---

### `{{LANGUAGE}}`

**Description:** Programming language of the project

**Resolver:** `(v) => toString(v.LANGUAGE || v.language) || 'Unknown'`

**Default:** `'Unknown'`

**Possible Values:**

- `JavaScript/TypeScript`
- `Python`
- `Rust`
- `Dart`
- `Go`

**Used In:**

- Knowledge base - Language-specific documentation
- Agent prompts - Language context

---

### `{{PACKAGE_MANAGER}}`

**Description:** Package manager for the detected framework

**Resolver:** `(v) => toString(v.PACKAGE_MANAGER || v.packageManager) || 'npm'`

**Default:** `'npm'`

**Detection (Node.js):**

- `pnpm-lock.yaml` → `pnpm`
- `yarn.lock` → `yarn`
- Default → `npm`

**Used In:**

- `.claude/trinity/knowledge-base/Trinity.md` - Installation commands
- CI/CD workflows - Package installation steps

---

### `{{TRINITY_VERSION}}`

**Description:** Trinity Method SDK version

**Resolver:** `(v) => toString(v.TRINITY_VERSION) || '2.1.0'`

**Default:** `'2.1.0'`

**Used In:**

- `.claude/trinity/VERSION` - Version tracking file
- `.claude/trinity/knowledge-base/Trinity.md` - Version documentation
- `CLAUDE.md` files - Trinity version context

---

### `{{TECHNOLOGY_STACK}}`

**Description:** Technology stack (alias for TECH_STACK with additional fallback)

**Resolver:** `(v) => toString(v.TECHNOLOGY_STACK || v.TECH_STACK || v.techStack) || 'Unknown'`

**Default:** `'Unknown'`

**Note:** This is an alias that falls back to `TECH_STACK` if `TECHNOLOGY_STACK` is not explicitly set.

---

### `{{PRIMARY_FRAMEWORK}}`

**Description:** Primary framework (alias for FRAMEWORK with additional fallback)

**Resolver:** `(v) => toString(v.PRIMARY_FRAMEWORK || v.FRAMEWORK || v.framework) || 'Generic'`

**Default:** `'Generic'`

**Note:** This is an alias that falls back to `FRAMEWORK` if `PRIMARY_FRAMEWORK` is not explicitly set.

---

### `{{CURRENT_DATE}}`

**Description:** Deployment date in ISO date format

**Resolver:** `(v) => toString(v.CURRENT_DATE) || new Date().toISOString().split('T')[0]`

**Default:** Current date in `YYYY-MM-DD` format

**Used In:**

- `.claude/trinity/knowledge-base/Trinity.md` - Deployment date
- `.claude/trinity/knowledge-base/ARCHITECTURE.md` - Documentation date
- `CLAUDE.md` files - Deployment tracking

---

### `{{PROJECT_VAR_NAME}}`

**Description:** Lowercase alphanumeric version of the project name, suitable for variable names

**Resolver:** `resolveProjectVarName()` - Uses `PROJECT_VAR_NAME` if set, otherwise derives from `PROJECT_NAME`/`projectName` by lowercasing and removing non-alphanumeric characters

**Default:** Derived from project name (e.g., `my-app` → `myapp`)

**Used In:**

- Template configurations requiring safe identifiers

---

### `{{TRINITY_HOME}}`

**Description:** Trinity home directory path

**Resolver:** `(v) => toString(v.TRINITY_HOME) || process.env.TRINITY_HOME || process.cwd()`

**Default:** `process.cwd()` (falls back to `TRINITY_HOME` environment variable)

**Used In:**

- Agent prompts - Path references
- Knowledge base - Directory documentation

---

## Variable Input Sources

### `extractVariables()` Function

The `extractVariables(stack, projectName)` function generates the initial variable record from detected stack info:

```typescript
export function extractVariables(stack: Stack, projectName: string): Record<string, string> {
  return {
    projectName: projectName || 'My Project',
    techStack: `${stack.language} / ${stack.framework}`,
    framework: stack.framework,
    sourceDir: stack.sourceDir,
    language: stack.language,
    packageManager: stack.packageManager || 'npm',
    timestamp: new Date().toISOString(),
  };
}
```

**Note:** The keys use camelCase (e.g., `projectName`), but resolvers accept both camelCase and UPPER_SNAKE_CASE variants (e.g., `v.PROJECT_NAME || v.projectName`).

---

## Metrics Placeholder Variables

In addition to the 13 core VARIABLE_RESOLVERS, the template processor provides **metrics placeholder variables** via `getPlaceholderMetrics()` and `formatMetrics()`. These are used in knowledge base templates for codebase metrics display:

### Code Quality Metrics

| Variable               | Description             | Source                        |
| ---------------------- | ----------------------- | ----------------------------- |
| `{{TODO_COUNT}}`       | Total TODO comments     | `metrics.todoCount`           |
| `{{TODO_COMMENTS}}`    | TODO comment count      | `metrics.todoComments`        |
| `{{FIXME_COUNT}}`      | FIXME comment count     | `metrics.fixmeComments`       |
| `{{HACK_COUNT}}`       | HACK comment count      | `metrics.hackComments`        |
| `{{CONSOLE_COUNT}}`    | Console statement count | `metrics.consoleStatements`   |
| `{{COMMENTED_BLOCKS}}` | Commented code blocks   | `metrics.commentedCodeBlocks` |

### File Complexity Metrics

| Variable          | Description           | Source                  |
| ----------------- | --------------------- | ----------------------- |
| `{{TOTAL_FILES}}` | Total files analyzed  | `metrics.totalFiles`    |
| `{{FILES_500}}`   | Files over 500 lines  | `metrics.filesOver500`  |
| `{{FILES_1000}}`  | Files over 1000 lines | `metrics.filesOver1000` |
| `{{FILES_3000}}`  | Files over 3000 lines | `metrics.filesOver3000` |
| `{{AVG_LENGTH}}`  | Average file length   | `metrics.avgFileLength` |

### Dependency Metrics

| Variable                   | Description                 | Source                       |
| -------------------------- | --------------------------- | ---------------------------- |
| `{{DEPENDENCY_COUNT}}`     | Production dependency count | `metrics.dependencyCount`    |
| `{{DEV_DEPENDENCY_COUNT}}` | Dev dependency count        | `metrics.devDependencyCount` |
| `{{FRAMEWORK_VERSION}}`    | Framework version           | `metrics.frameworkVersion`   |

### Git Metrics

| Variable                | Description         | Source                   |
| ----------------------- | ------------------- | ------------------------ |
| `{{COMMIT_COUNT}}`      | Total git commits   | `metrics.commitCount`    |
| `{{CONTRIBUTOR_COUNT}}` | Unique contributors | `metrics.contributors`   |
| `{{LAST_COMMIT}}`       | Last commit date    | `metrics.lastCommitDate` |

### Agent-Only Placeholders

These remain as `{{PLACEHOLDER}}` strings (not resolved to actual values) and are intended for agent runtime population:

| Variable                | Description                      |
| ----------------------- | -------------------------------- |
| `{{OVERALL_COVERAGE}}`  | Overall test coverage            |
| `{{UNIT_COVERAGE}}`     | Unit test coverage               |
| `{{DEPRECATED_COUNT}}`  | Deprecated API usage count       |
| `{{ANTIPATTERN_COUNT}}` | Anti-pattern count               |
| `{{PERF_ISSUE_COUNT}}`  | Performance issue count          |
| `{{SECURITY_COUNT}}`    | Security issue count             |
| `{{COMPONENT_1}}`       | Primary component name           |
| `{{RESPONSIBILITY_1}}`  | Primary component responsibility |
| `{{BACKEND_FRAMEWORK}}` | Backend framework name           |
| `{{DATABASE_TYPE}}`     | Database type                    |
| `{{AUTH_TYPE}}`         | Authentication type              |
| `{{STYLING_SOLUTION}}`  | Styling solution                 |

---

## Variable Usage by File Type

### Markdown Files

**Files:** `.claude/trinity/knowledge-base/*.md`, `.claude/agents/*.md`, `.claude/commands/*.md`

**Common Variables:**

- `{{PROJECT_NAME}}`
- `{{FRAMEWORK}}`
- `{{PACKAGE_MANAGER}}`
- `{{TRINITY_VERSION}}`
- `{{CURRENT_DATE}}`

**Example:**

```markdown
# Trinity Method - {{PROJECT_NAME}}

**Framework:** {{FRAMEWORK}}
**Package Manager:** {{PACKAGE_MANAGER}}
**Deployed:** {{CURRENT_DATE}}
**Version:** {{TRINITY_VERSION}}
```

---

### YAML Files (CI/CD Workflows)

**Files:** `.github/workflows/*.yml`, `.gitlab-ci.yml`

**Common Variables:**

- `{{PACKAGE_MANAGER}}`
- `{{PROJECT_NAME}}` (workflow names)

**Example:**

```yaml
name: {{PROJECT_NAME}} CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: {{PACKAGE_MANAGER}} install
      - run: {{PACKAGE_MANAGER}} test
```

---

### CLAUDE.md Files

**Common Variables:**

- `{{FRAMEWORK}}`
- `{{TECH_STACK}}`
- `{{SOURCE_DIR}}`
- `{{TRINITY_VERSION}}`
- `{{DEPLOYMENT_TIMESTAMP}}`

---

## Best Practices

### For Trinity SDK Developers

1. **Always Provide Defaults:** Every resolver function returns a default value
2. **Support Both Key Formats:** Resolvers accept both `UPPER_SNAKE_CASE` and `camelCase` variants
3. **Document New Variables:** Update this reference when adding variables to VARIABLE_RESOLVERS
4. **Use Descriptive Names:** `{{PROJECT_NAME}}` not `{{NAME}}`
5. **Consistent Casing:** Use `UPPER_SNAKE_CASE` for all template variable placeholders

### For Template Creators

1. **Test Substitution:** Verify templates with all frameworks
2. **Use Existing Variables:** Check this reference before requesting new variables
3. **Escape Literal Braces:** Use `\{\{` if you need literal `{{` in output
4. **Document Usage:** Comment where variables are used

---

## Troubleshooting

### Variable Not Replaced

**Problem:** `{{PROJECT_NAME}}` appears in deployed files

**Causes:**

1. Variable not in VARIABLE_RESOLVERS map
2. Template processing not applied to this file
3. File was not processed as a `.template` file

**Solution:**

```bash
# Check for unresolved variables
grep -r '{{' .claude/

# Redeploy if necessary
trinity deploy --force
```

### Wrong Variable Value

**Problem:** Variable has incorrect value (e.g., wrong project name)

**Solution:**

```bash
# Update package.json name field, then redeploy
trinity deploy --force
```

---

## Related Documentation

- [Deployment Guide](../guides/deployment-guide.md) - Customization guide
- [CLI Commands](cli-commands.md) - Deploy and update commands
- [Deploy Command API](../api/deploy/deploy-command.md) - Template processing details

---

**Trinity Method SDK v2.1.0** - Template Variables Reference
