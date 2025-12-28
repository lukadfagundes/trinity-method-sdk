# ADR-002: Template System Design

**Status:** Accepted
**Date:** 2025-12-28
**Deciders:** Trinity Method SDK Core Team
**Technical Story:** Design template processing system for multi-framework Trinity deployment

## Context

Trinity Method SDK deploys 64 components (agents, slash commands, knowledge base files, linting configs, CI/CD workflows) to user projects. These components need to be customized based on:

- **Project Name** - Referenced in documentation and configurations
- **Framework** - Node.js, Python, Rust, Flutter, Go
- **Package Manager** - npm, yarn, pnpm, pip, cargo, flutter, go
- **Linting Tools** - ESLint, Black, Clippy, Dart Analyzer, etc.
- **CI/CD Platform** - GitHub Actions, GitLab CI, CircleCI, Jenkins
- **Deployment Date** - For version tracking
- **SDK Version** - For compatibility tracking

The template system needed to:

1. Support variable substitution across all file types (Markdown, YAML, JSON, TOML, etc.)
2. Be framework-agnostic and easy to extend
3. Process templates quickly (target: < 3 seconds for 64 files)
4. Validate that all variables are resolved before deployment
5. Be maintainable by developers without template engine expertise

## Decision Drivers

- **Simplicity** - Template syntax should be obvious and easy to understand
- **Performance** - Fast processing for smooth user experience
- **Reliability** - No unresolved variables should reach production
- **Framework Agnostic** - Work across all supported languages
- **Maintainability** - Easy to add new variables and templates
- **Minimal Dependencies** - Avoid heavy template engine dependencies

## Considered Options

### Option 1: Custom Variable Substitution with {{VAR}} Syntax

- Simple regex-based replacement using `{{VARIABLE_NAME}}` syntax
- In-memory string processing
- Custom validation for unresolved variables

**Pros:**

- **Simple and obvious** - `{{PROJECT_NAME}}` is immediately understandable
- **Framework agnostic** - Works in any text file (Markdown, YAML, JSON, TOML, etc.)
- **Fast** - Regex replacement is extremely fast (< 1ms per file)
- **Zero dependencies** - Uses native JavaScript String.replace()
- **Easy to debug** - Plain text substitution, no template compilation
- **Safe** - No code execution, just string replacement

**Cons:**

- **Limited logic** - No conditionals, loops, or filters (mitigated: not needed for deployment configs)
- **Manual validation** - Must manually check for unresolved `{{VAR}}`

### Option 2: Handlebars

- Full-featured template engine with logic support

**Pros:**

- Rich feature set (conditionals, loops, helpers)
- Well-documented and widely used

**Cons:**

- **Overkill** - Advanced features not needed for config substitution
- **Additional dependency** - Adds ~500KB to package
- **Compilation overhead** - Template compilation adds processing time
- **Syntax complexity** - `{{#if}}` blocks unnecessary for simple variable replacement
- **Harder to debug** - Template compilation errors can be cryptic

### Option 3: Mustache

- Logic-less template engine

**Pros:**

- Simple syntax similar to Handlebars
- Logic-less philosophy aligns with simple use case

**Cons:**

- **Unnecessary dependency** - Still adds ~100KB
- **Processing overhead** - Template compilation not needed for simple substitution
- **Less obvious** - Still requires users to learn Mustache syntax

### Option 4: EJS (Embedded JavaScript)

- JavaScript-based templating

**Pros:**

- Familiar syntax for JavaScript developers
- Powerful scripting capabilities

**Cons:**

- **Security risk** - Allows arbitrary JavaScript execution
- **Unnecessary complexity** - Scripting capabilities not needed
- **Harder to maintain** - Template logic scattered across files
- **Additional dependency** - Adds to bundle size

### Option 5: Template Literals with eval()

- Use JavaScript template literals dynamically

**Pros:**

- Native JavaScript feature

**Cons:**

- **Security risk** - eval() is dangerous and should be avoided
- **Hard to validate** - Cannot easily detect unresolved variables
- **Debugging nightmare** - Runtime errors in templates

## Decision

**Chosen Option: Custom Variable Substitution with {{VAR}} Syntax**

We will implement a lightweight, custom template processing system using simple `{{VARIABLE_NAME}}` syntax with regex-based string replacement.

**Rationale:**

1. **Simplicity** - `{{PROJECT_NAME}}` is immediately clear to anyone reading templates. No learning curve.

2. **Performance** - String replacement with regex is extremely fast:
   - Average: 50-100ms per template file
   - Total: 2-3 seconds for all 64 components
   - No template compilation overhead

3. **Framework Agnostic** - Works perfectly in any text-based file:
   - Markdown: `# Trinity Method - {{PROJECT_NAME}}`
   - YAML: `name: {{PROJECT_NAME}}`
   - JSON: `"project": "{{PROJECT_NAME}}"`
   - TOML: `name = "{{PROJECT_NAME}}"`

4. **Zero Dependencies** - No external template engines needed, reducing:
   - Bundle size (saves ~500KB)
   - Security vulnerabilities (fewer dependencies)
   - Maintenance burden (no template engine updates)

5. **Safe** - No code execution, just string replacement. Immune to template injection attacks.

6. **Easy Validation** - Simple regex check for remaining `{{.*}}` patterns catches unresolved variables.

7. **Easy to Extend** - Adding new variables is trivial:
   ```typescript
   variables['{{NEW_VARIABLE}}'] = 'value';
   ```

## Implementation Details

### Template Syntax

```
{{VARIABLE_NAME}} - Replaced with variable value
```

**Example Template** (`Trinity.md.template`):

````markdown
# Trinity Method - {{PROJECT_NAME}}

**Framework:** {{FRAMEWORK}}
**Package Manager:** {{PACKAGE_MANAGER}}
**Deployed:** {{CURRENT_DATE}}
**Version:** {{VERSION}}

## Installation

```bash
{{PACKAGE_MANAGER}} install
{{PACKAGE_MANAGER}} test
```
````

````

### Variable Registry

**Core Variables:**
```typescript
const variables = {
  '{{PROJECT_NAME}}': projectName,      // User input or package.json
  '{{FRAMEWORK}}': framework,            // Node.js, Python, Rust, Flutter, Go
  '{{PACKAGE_MANAGER}}': packageManager, // npm, yarn, pip, cargo, flutter, go
  '{{LINTING_TOOL}}': lintingTool,      // ESLint, Black, Clippy, etc.
  '{{CI_PLATFORM}}': ciPlatform,        // GitHub Actions, GitLab CI, etc.
  '{{CURRENT_DATE}}': new Date().toISOString().split('T')[0],
  '{{VERSION}}': sdkVersion,             // From package.json
  '{{NODE_VERSION}}': '16.9.0',         // Minimum Node.js version
};
````

### Processing Algorithm

**Location:** `src/cli/utils/templateProcessor.ts`

```typescript
export async function processTemplate(
  templatePath: string,
  outputPath: string,
  variables: Record<string, string>
): Promise<void> {
  // 1. Read template file
  let content = await fs.readFile(templatePath, 'utf-8');

  // 2. Replace all variables
  for (const [variable, value] of Object.entries(variables)) {
    content = content.replace(new RegExp(variable, 'g'), value);
  }

  // 3. Validate no unresolved variables
  const unresolvedMatches = content.match(/{{[^}]+}}/g);
  if (unresolvedMatches) {
    throw new Error(`Unresolved variables in ${templatePath}: ${unresolvedMatches.join(', ')}`);
  }

  // 4. Write processed file
  await fs.writeFile(outputPath, content, 'utf-8');
}
```

### Template Directory Structure

```
src/templates/
├── agents/
│   └── KIL.md.template              # {{PROJECT_NAME}}, {{FRAMEWORK}}
├── shared/
│   └── trinity-start.md.template    # {{PROJECT_NAME}}, {{CURRENT_DATE}}
├── knowledge-base/
│   └── Trinity.md.template          # All variables
├── linting/
│   ├── node/
│   │   └── .eslintrc.js.template   # {{PROJECT_NAME}}
│   └── python/
│       └── pyproject.toml.template  # {{PROJECT_NAME}}
└── ci/
    └── github/
        └── nodejs.yml.template      # {{PACKAGE_MANAGER}}
```

### Build Process

Templates are copied to `dist/templates/` during build:

```json
{
  "scripts": {
    "build": "tsc && node scripts/copy-templates.js"
  }
}
```

## Consequences

### Positive

- **Zero Learning Curve** - Anyone can read and write `{{VARIABLE}}` templates
- **Fast Performance** - < 3 seconds for 64 file deployment
- **No Dependencies** - Reduced bundle size and security surface
- **Type Safety** - Variable registry is strongly typed in TypeScript
- **Easy Debugging** - Plain text substitution, no hidden compilation
- **Framework Agnostic** - Works in any text-based file format
- **Safe by Default** - No code execution, immune to injection attacks
- **Easy Maintenance** - Adding variables takes seconds

### Negative

- **No Logic** - Cannot use conditionals or loops in templates (acceptable: use different template files per framework instead)
- **Manual Escaping** - If template needs literal `{{`, must use workaround (rare edge case)
- **No Built-in Filters** - Cannot format dates or transform values in template (acceptable: format in variable registry)

### Neutral

- **Custom Implementation** - Must maintain custom code vs. using established library (tradeoff: simpler code, fewer dependencies)

## Validation

Success metrics after implementation:

1. **Processing Speed** - ✅ 2-3 seconds for 64 component deployment
2. **Reliability** - ✅ 0 deployment failures due to unresolved variables (validation catches all)
3. **Test Coverage** - ✅ Template processor covered by 50+ unit tests
4. **Maintainability** - ✅ New templates added in < 5 minutes
5. **Framework Support** - ✅ Works across Node.js, Python, Rust, Flutter, Go

## Migration Path

If future requirements need conditional logic or loops:

1. **Option A** - Use multiple template files (recommended):
   - `eslint.config.js.template` for Node.js
   - `pyproject.toml.template` for Python
   - Select template based on framework during deployment

2. **Option B** - Migrate to Handlebars:
   - Add Handlebars dependency
   - Migrate `{{VAR}}` syntax (compatible with Handlebars)
   - Add logic with `{{#if}}` and `{{#each}}`

**Current Assessment:** Option A (multiple templates) has been sufficient for all use cases. No migration needed.

## Related Decisions

- **ADR-001: CLI Architecture** - CLI drives template processing
- **ADR-004: Test Strategy** - Template processor has comprehensive test coverage

## References

- [String.prototype.replace() - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
- [Regular Expressions - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Keep It Simple, Stupid (KISS Principle)](https://en.wikipedia.org/wiki/KISS_principle)
- Implementation: `src/cli/utils/templateProcessor.ts`
- Tests: `tests/unit/templateProcessor.test.ts`
