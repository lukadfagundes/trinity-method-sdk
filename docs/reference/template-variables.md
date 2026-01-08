# Template Variables Reference

**Trinity Version:** 2.0.8
**Last Updated:** 2026-01-02

Complete reference for Trinity Method template variables.

## Overview

Trinity Method uses simple `{{VARIABLE_NAME}}` syntax for template variable substitution during deployment. This document lists all available variables, their sources, example values, and where they're used.

## Variable Substitution System

### Syntax

```
{{VARIABLE_NAME}}
```

### Processing

Variables are replaced during `trinity deploy` using regex-based string substitution:

```javascript
// Example: Template processing
const template = '# {{PROJECT_NAME}} - {{FRAMEWORK}}';
const variables = {
  '{{PROJECT_NAME}}': 'my-app',
  '{{FRAMEWORK}}': 'Node.js',
};

// Result after substitution
const result = '# my-app - Node.js';
```

### Validation

Trinity validates that all variables are resolved before deployment. Any remaining `{{VAR}}` patterns cause deployment to fail.

---

## Core Variables

### `{{PROJECT_NAME}}`

**Description:** Project name used throughout Trinity deployment

**Source:**

1. Auto-detected from:
   - Node.js: `package.json` → `name` field
   - Python: `pyproject.toml` → `[project] name` or `setup.py` → `name`
   - Rust: `Cargo.toml` → `[package] name`
   - Flutter: `pubspec.yaml` → `name`
   - Go: `go.mod` → module name
2. User input during interactive deployment (if not detected)

**Example Values:**

- `my-app`
- `awesome-project`
- `user-authentication-service`

**Used In:**

- `.claude/agents/*` - Agent prompts reference project name
- `trinity/knowledge-base/Trinity.md` - Project-specific guide
- `trinity/knowledge-base/ARCHITECTURE.md` - Architecture documentation
- Linting configs - ESLint/Prettier/Black configs reference project
- CI/CD workflows - Workflow names include project name
- Documentation templates

**Template Example:**

```markdown
<!-- trinity/knowledge-base/Trinity.md.template -->

# Trinity Method - {{PROJECT_NAME}}

Welcome to the Trinity Method guide for {{PROJECT_NAME}}.
```

**After Substitution:**

```markdown
# Trinity Method - my-app

Welcome to the Trinity Method guide for my-app.
```

---

### `{{FRAMEWORK}}`

**Description:** Detected or selected framework

**Source:**

1. Auto-detected from manifest files (see `{{PROJECT_NAME}}`)
2. User selection during deployment

**Possible Values:**

- `Node.js`
- `Python`
- `Rust`
- `Flutter`
- `Go`

**Used In:**

- `trinity/knowledge-base/Trinity.md` - Framework-specific guidance
- `trinity/knowledge-base/TESTING-PRINCIPLES.md` - Framework testing patterns
- `trinity/knowledge-base/CODING-PRINCIPLES.md` - Framework best practices
- `CLAUDE.md` hierarchy - Framework context

**Template Example:**

```markdown
<!-- trinity/knowledge-base/Trinity.md.template -->

**Framework:** {{FRAMEWORK}}
**Tech Stack:** See ARCHITECTURE.md for {{FRAMEWORK}}-specific details
```

**After Substitution:**

```markdown
**Framework:** Node.js
**Tech Stack:** See ARCHITECTURE.md for Node.js-specific details
```

---

### `{{PACKAGE_MANAGER}}`

**Description:** Package manager for the detected framework

**Source:** Auto-detected based on framework and lock files

**Node.js Detection:**

- `package-lock.json` → `npm`
- `yarn.lock` → `yarn`
- `pnpm-lock.yaml` → `pnpm`
- Default → `npm`

**Other Frameworks:**

- Python → `pip`
- Rust → `cargo`
- Flutter → `flutter`
- Go → `go`

**Possible Values:**

- `npm`
- `yarn`
- `pnpm`
- `pip`
- `cargo`
- `flutter`
- `go`

**Used In:**

- `trinity/knowledge-base/Trinity.md` - Installation commands
- CI/CD workflows - Package installation steps
- Pre-commit configs - Dependency installation

**Template Example:**

```yaml
# .github/workflows/nodejs.yml.template
- name: Install dependencies
  run: {{PACKAGE_MANAGER}} install
```

**After Substitution:**

```yaml
- name: Install dependencies
  run: npm install
```

---

### `{{LINTING_TOOL}}`

**Description:** Selected linting tool(s) for the framework

**Source:** User selection during deployment

**Possible Values:**

- `ESLint` (Node.js)
- `ESLint + Prettier` (Node.js)
- `Black` (Python)
- `Black + Flake8 + isort` (Python)
- `Clippy` (Rust)
- `Clippy + Rustfmt` (Rust)
- `Dart Analyzer` (Flutter)
- `gofmt` (Go)

**Used In:**

- `trinity/knowledge-base/Trinity.md` - Linting setup instructions
- Pre-commit configs - Hook configuration
- CI/CD workflows - Linting step commands

**Template Example:**

````markdown
<!-- trinity/knowledge-base/Trinity.md.template -->

## Linting

This project uses {{LINTING_TOOL}} for code quality.

To run linting:

```bash
npm run lint  # or appropriate command for {{FRAMEWORK}}
```
````

````

**After Substitution:**
```markdown
## Linting

This project uses ESLint + Prettier for code quality.

To run linting:
```bash
npm run lint  # or appropriate command for Node.js
````

````

---

### `{{CI_PLATFORM}}`

**Description:** Selected CI/CD platform

**Source:** User selection during deployment

**Possible Values:**
- `GitHub Actions`
- `GitLab CI`
- `CircleCI`
- `Jenkins`
- `None` (if skipped)

**Used In:**
- `trinity/knowledge-base/Trinity.md` - CI/CD setup documentation
- CI/CD workflow files - Platform-specific configs

**Template Example:**
```markdown
<!-- trinity/knowledge-base/Trinity.md.template -->
## CI/CD

This project uses {{CI_PLATFORM}} for continuous integration.

Workflows are located in:
- GitHub Actions: `.github/workflows/`
- GitLab CI: `.gitlab-ci.yml`
````

**After Substitution:**

```markdown
## CI/CD

This project uses GitHub Actions for continuous integration.

Workflows are located in:

- GitHub Actions: `.github/workflows/`
- GitLab CI: `.gitlab-ci.yml`
```

---

### `{{CURRENT_DATE}}`

**Description:** Deployment date in ISO format

**Source:** System date at deployment time

**Format:** `YYYY-MM-DD`

**Example Values:**

- `2025-12-28`
- `2025-01-15`

**Used In:**

- `trinity/knowledge-base/Trinity.md` - Deployment timestamp
- `trinity/knowledge-base/ARCHITECTURE.md` - Documentation date
- `CLAUDE.md` files - Deployment tracking
- `trinity/VERSION` - Version file

**Template Example:**

```markdown
<!-- trinity/knowledge-base/Trinity.md.template -->

**Trinity Version:** {{VERSION}}
**Deployed:** {{CURRENT_DATE}}
```

**After Substitution:**

```markdown
**Trinity Version:** 2.0.8
**Deployed:** 2025-12-29
```

---

### `{{VERSION}}`

**Description:** Trinity Method SDK version

**Source:** SDK's `package.json` version field

**Format:** Semantic versioning (`MAJOR.MINOR.PATCH`)

**Example Values:**

- `2.0.0`
- `2.1.0`
- `2.0.1`

**Used In:**

- `trinity/VERSION` - Version tracking file
- `trinity/knowledge-base/Trinity.md` - Version documentation
- `CLAUDE.md` files - Trinity version context
- Agent prompts - Version awareness

**Template Example:**

```markdown
<!-- trinity/knowledge-base/Trinity.md.template -->

**Trinity Version:** {{VERSION}}
```

**After Substitution:**

```markdown
**Trinity Version:** 2.0.8
```

---

### `{{NODE_VERSION}}`

**Description:** Minimum required Node.js version

**Source:** Hardcoded in SDK (Node.js projects only)

**Value:** `16.9.0`

**Used In:**

- CI/CD workflows (Node.js) - Node.js version matrix
- `trinity/knowledge-base/Trinity.md` - Prerequisites

**Template Example:**

```yaml
# .github/workflows/nodejs.yml.template
strategy:
  matrix:
    node-version: [{ { NODE_VERSION } }, 18, 20]
```

**After Substitution:**

```yaml
strategy:
  matrix:
    node-version: [16.9.0, 18, 20]
```

**Note:** This variable is only used for Node.js projects. Other frameworks have their own version detection mechanisms.

---

## Variable Usage by File Type

### Markdown Files

**Files:** `trinity/knowledge-base/*.md`, `.claude/agents/*.md`, `.claude/commands/*.md`

**Common Variables:**

- `{{PROJECT_NAME}}`
- `{{FRAMEWORK}}`
- `{{PACKAGE_MANAGER}}`
- `{{VERSION}}`
- `{{CURRENT_DATE}}`

**Example:**

```markdown
# Trinity Method - {{PROJECT_NAME}}

**Framework:** {{FRAMEWORK}}
**Package Manager:** {{PACKAGE_MANAGER}}
**Deployed:** {{CURRENT_DATE}}
**Version:** {{VERSION}}
```

---

### YAML Files (CI/CD Workflows)

**Files:** `.github/workflows/*.yml`, `.gitlab-ci.yml`, `.circleci/config.yml`

**Common Variables:**

- `{{PACKAGE_MANAGER}}`
- `{{NODE_VERSION}}` (Node.js only)
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

### Pre-Commit Config

**File:** `.pre-commit-config.yaml`

**Common Variables:**

- `{{PROJECT_NAME}}` (hook IDs)
- Framework-specific linting tool references

**Example:**

```yaml
# .pre-commit-config.yaml.template
repos:
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.0.0
    hooks:
      - id: eslint
        name: ESLint ({{PROJECT_NAME}})
        files: \.(js|jsx|ts|tsx)$
```

---

### Linting Configs

**Files:** `eslint.config.js`, `pyproject.toml`, `clippy.toml`, etc.

**Common Variables:**

- `{{PROJECT_NAME}}` (config names, comments)

**Example:**

```javascript
// eslint.config.js.template
// ESLint configuration for {{PROJECT_NAME}}
// Framework: {{FRAMEWORK}}
// Generated by Trinity Method SDK v{{VERSION}}

import js from '@eslint/js';

export default [
  js.configs.recommended,
  // ... config
];
```

---

## Variable Validation

### Unresolved Variables

If any `{{VAR}}` remains after substitution, deployment fails:

```
❌ Deployment Error

Unresolved variables detected in:
- trinity/knowledge-base/Trinity.md: {{UNKNOWN_VAR}}

Please ensure all template variables have values.
```

### Missing Required Variables

Required variables:

- `{{PROJECT_NAME}}` - Must be detected or provided
- `{{FRAMEWORK}}` - Must be detected or selected
- `{{PACKAGE_MANAGER}}` - Auto-detected from framework
- `{{VERSION}}` - Always available from SDK
- `{{CURRENT_DATE}}` - Always available from system

Optional variables (framework-specific):

- `{{NODE_VERSION}}` - Only for Node.js
- `{{LINTING_TOOL}}` - Can be "None" if skipped
- `{{CI_PLATFORM}}` - Can be "None" if skipped

---

## Variable Registry Implementation

**Location:** `src/cli/utils/templateProcessor.ts`

**Variable Registry:**

```typescript
const variables: Record<string, string> = {
  '{{PROJECT_NAME}}': projectName, // From package.json or user input
  '{{FRAMEWORK}}': framework, // Detected or selected
  '{{PACKAGE_MANAGER}}': packageManager, // Detected from lock files
  '{{LINTING_TOOL}}': lintingTool, // User selected
  '{{CI_PLATFORM}}': ciPlatform, // User selected
  '{{CURRENT_DATE}}': new Date().toISOString().split('T')[0],
  '{{VERSION}}': sdkVersion, // From SDK package.json
  '{{NODE_VERSION}}': '16.9.0', // Hardcoded minimum
};
```

**Processing:**

```typescript
// For each template file
let content = await fs.readFile(templatePath, 'utf-8');

// Replace all variables
for (const [variable, value] of Object.entries(variables)) {
  content = content.replace(new RegExp(variable, 'g'), value);
}

// Validate no unresolved variables
const unresolvedMatches = content.match(/{{[^}]+}}/g);
if (unresolvedMatches) {
  throw new Error(`Unresolved variables: ${unresolvedMatches.join(', ')}`);
}

// Write processed file
await fs.writeFile(outputPath, content, 'utf-8');
```

---

## Best Practices

### For Trinity SDK Developers

1. **Always Provide Defaults:** Ensure all variables have fallback values
2. **Validate Before Deployment:** Check all variables resolved
3. **Document New Variables:** Update this reference when adding variables
4. **Use Descriptive Names:** `{{PROJECT_NAME}}` not `{{NAME}}`
5. **Consistent Casing:** Use `UPPER_SNAKE_CASE` for all variables

### For Template Creators

1. **Test Substitution:** Verify templates with all frameworks
2. **Handle Optional Variables:** Check if variable might be "None"
3. **Escape Literal Braces:** Use `\{\{` if you need literal `{{` in output
4. **Document Usage:** Comment where variables are used
5. **Validate Output:** Ensure substituted content makes sense

---

## Troubleshooting

### Variable Not Replaced

**Problem:** `{{PROJECT_NAME}}` appears in deployed files

**Causes:**

1. Variable not in registry
2. Template processing failed
3. File was not processed as template

**Solution:**

```bash
# Check trinity/VERSION to confirm deployment succeeded
cat trinity/VERSION

# Check for unresolved variables
grep -r '{{' trinity/ .claude/

# Redeploy if necessary
rm -rf .claude/ trinity/
trinity deploy
```

### Wrong Variable Value

**Problem:** Variable has incorrect value (e.g., wrong project name)

**Causes:**

1. Auto-detection picked wrong source
2. package.json has incorrect name
3. User provided wrong input

**Solution:**

```bash
# Update package.json (Node.js example)
# Change "name": "wrong-name" to "name": "correct-name"
code package.json

# Redeploy
rm -rf .claude/ trinity/
trinity deploy
```

### Custom Variable Needed

**Problem:** Need custom variable like `{{COMPANY_NAME}}`

**Solution (v2.0 workaround):**

```bash
# Deploy normally
trinity deploy

# Manually replace custom variables
find trinity -type f -name "*.md" -exec sed -i 's/{{COMPANY_NAME}}/Acme Corp/g' {} +
find .claude -type f -name "*.md" -exec sed -i 's/{{COMPANY_NAME}}/Acme Corp/g' {} +
```

---

## Variable Reference Table

| Variable              | Source                    | Example             | Used In                   | Required              |
| --------------------- | ------------------------- | ------------------- | ------------------------- | --------------------- |
| `{{PROJECT_NAME}}`    | package.json / user input | `my-app`            | All templates             | ✅ Yes                |
| `{{FRAMEWORK}}`       | Auto-detect / user select | `Node.js`           | Knowledge base, CLAUDE.md | ✅ Yes                |
| `{{PACKAGE_MANAGER}}` | Lock files / framework    | `npm`               | Trinity.md, CI/CD         | ✅ Yes                |
| `{{LINTING_TOOL}}`    | User selection            | `ESLint + Prettier` | Trinity.md, pre-commit    | ❌ No (can be "None") |
| `{{CI_PLATFORM}}`     | User selection            | `GitHub Actions`    | Trinity.md                | ❌ No (can be "None") |
| `{{CURRENT_DATE}}`    | System date               | `2025-12-29`        | Trinity.md, VERSION       | ✅ Yes                |
| `{{VERSION}}`         | SDK package.json          | `2.0.8`             | Trinity.md, VERSION       | ✅ Yes                |
| `{{NODE_VERSION}}`    | Hardcoded                 | `16.9.0`            | CI/CD (Node.js only)      | ❌ No (Node.js only)  |

---

## Additional Resources

- [Template Processing Pipeline](../images/template-processing-pipeline.md) - Visual diagram
- [ADR-002: Template System Design](../architecture/adr/ADR-002-template-system-design.md) - Design rationale
- [Deployment Guide](../guides/deployment-guide.md) - Customization guide
- [CLI Commands](cli-commands.md) - Deploy and update commands

---

**Trinity Method SDK v2.0.8** - Template Variables Reference
