# Knowledge Base Deployment API Reference

**Module:** `src/cli/commands/deploy/knowledge-base.ts`
**Purpose:** Deploy and enrich Trinity knowledge base templates with project metrics
**Priority:** MEDIUM (Documentation foundation)

---

## Overview

The Knowledge Base Deployment module deploys 9 Trinity knowledge base templates to `trinity/knowledge-base/` and enriches them with project-specific metrics and stack information.

**Key Features:**

- 9 knowledge base templates (methodology, principles, guides)
- Two-phase deployment (template deployment + enrichment)
- Project metrics integration
- Stack-specific customization
- Path validation for security

---

## Core Function

### `deployKnowledgeBase(templatesPath: string, variables: Record<string, string>, stack: Stack, metrics: CodebaseMetrics, spinner: Spinner): Promise<number>`

Deploys knowledge base templates and enriches with project data.

**Parameters:**

- `templatesPath` (string) - Path to SDK templates
- `variables` (Record<string, string>) - Template variables
- `stack` (Stack) - Detected technology stack
- `metrics` (CodebaseMetrics) - Codebase metrics (from JUNO)
- `spinner` (Spinner) - Status display

**Returns:** `Promise<number>` - Files deployed

---

## Knowledge Base Templates (9 files)

```typescript
const kbTemplates = [
  'ARCHITECTURE.md', // Project architecture documentation
  'Trinity.md', // Trinity Method methodology
  'To-do.md', // Task tracking
  'ISSUES.md', // Issue tracking
  'Technical-Debt.md', // Technical debt tracking
  'CODING-PRINCIPLES.md', // Coding standards
  'TESTING-PRINCIPLES.md', // Testing standards
  'AI-DEVELOPMENT-GUIDE.md', // AI-assisted development guide
  'DOCUMENTATION-CRITERIA.md', // Documentation standards
];
```

---

## Deployment Process

### Phase 1: Template Deployment

**Process:**

1. Iterate through 9 knowledge base templates
2. Read template from SDK
3. Process template variables
4. Validate destination path
5. Write to `trinity/knowledge-base/`

**Example:**

```typescript
const templatePath = path.join(templatesPath, 'trinity/knowledge-base', 'ARCHITECTURE.md.template');
const content = await fs.readFile(templatePath, 'utf8');
const processed = processTemplate(content, variables);
const destPath = validatePath('trinity/knowledge-base/ARCHITECTURE.md');
await fs.writeFile(destPath, processed);
```

---

### Phase 2: Enrichment (ARCHITECTURE.md)

**Purpose:** Replace placeholder metrics with actual project data

**Enriched Placeholders:**

- `{{PROJECT_NAME}}` → Project name
- `{{FRAMEWORK}}` → Detected framework
- `{{LANGUAGE}}` → Programming language
- `{{SOURCE_DIR}}` → Source directory
- `{{PACKAGE_MANAGER}}` → npm/yarn/pnpm
- `{{BACKEND_FRAMEWORK}}` → Backend framework
- `{{TODO_COUNT}}` → TODO comment count
- `{{FILE_COUNT}}` → Total file count
- `{{DEPENDENCY_COUNT}}` → Dependency count

**Enrichment Logic:**

```typescript
archContent = archContent
  .replace(/\{\{PROJECT_NAME\}\}/g, variables.PROJECT_NAME)
  .replace(/\{\{FRAMEWORK\}\}/g, stack.framework)
  .replace(/\{\{LANGUAGE\}\}/g, stack.language)
  .replace(/\{\{TODO_COUNT\}\}/g, String(metrics?.todoCount || 0))
  .replace(/\{\{FILE_COUNT\}\}/g, String(metrics?.totalFiles || 0));
```

---

## Deployed Directory Structure

```
trinity/knowledge-base/
├── ARCHITECTURE.md           # Project architecture (enriched)
├── Trinity.md                # Trinity Method guide
├── To-do.md                  # Task tracking
├── ISSUES.md                 # Issue tracking
├── Technical-Debt.md         # Technical debt
├── CODING-PRINCIPLES.md      # Coding standards
├── TESTING-PRINCIPLES.md     # Testing standards
├── AI-DEVELOPMENT-GUIDE.md   # AI development guide
└── DOCUMENTATION-CRITERIA.md # Documentation standards
```

---

## Error Handling

**Enrichment Failure:**

- Non-critical (try-catch block)
- Logs warning, continues deployment
- Fallback: Templates deployed without enrichment

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md)
- **Template Processor:** [docs/api/template-processor.md](template-processor.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
