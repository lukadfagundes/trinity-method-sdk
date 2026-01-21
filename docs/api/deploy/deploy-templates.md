# Templates Deployment API Reference

**Module:** `src/cli/commands/deploy/templates.ts`
**Purpose:** Deploy work order, investigation, and documentation templates
**Priority:** MEDIUM (Template library)

---

## Overview

The Templates Deployment module deploys Trinity Method's template library to `trinity/templates/`, including work orders, investigations, and comprehensive documentation templates.

**Key Features:**

- 6 work order templates
- 5 investigation templates
- 28 documentation templates (with subdirectories)
- Recursive template deployment
- Template variable substitution

---

## Core Function

### `deployTemplates(templatesPath: string, variables: Record<string, string>, spinner: Spinner): Promise<number>`

Deploys all Trinity template categories.

**Parameters:**

- `templatesPath` (string) - SDK templates path
- `variables` (Record<string, string>) - Template variables
- `spinner` (Spinner) - Status display

**Returns:** `Promise<number>` - Templates deployed

---

## Template Categories

### 1. Work Order Templates (6 templates)

**Location:** `trinity/templates/work-orders/`

**Templates:**

```typescript
[
  'INVESTIGATION-TEMPLATE.md',
  'IMPLEMENTATION-TEMPLATE.md',
  'ANALYSIS-TEMPLATE.md',
  'AUDIT-TEMPLATE.md',
  'PATTERN-TEMPLATE.md',
  'VERIFICATION-TEMPLATE.md',
];
```

**Purpose:** Structured workflows for different work types

---

### 2. Investigation Templates (5 templates)

**Location:** `trinity/templates/investigations/`

**Templates:**

```typescript
[
  'bug.md', // Bug investigation
  'feature.md', // Feature investigation
  'performance.md', // Performance investigation
  'security.md', // Security investigation
  'technical.md', // Technical investigation
];
```

**Purpose:** Specialized investigation workflows

---

### 3. Documentation Templates (28 templates)

**Location:** `trinity/templates/documentation/`

**Structure:** Hierarchical with subdirectories

**Deployment:** Recursive copy with `.template` extension removal

**Process:**

```typescript
async function copyDocTemplates(sourcePath, destPath) {
  for each item in directory:
    if directory:
      create subdirectory
      recurse into subdirectory
    else if file ends with '.md.template':
      process template
      remove .template extension
      write to destination
}
```

---

## Deployed Directory Structure

```
trinity/templates/
├── work-orders/
│   ├── INVESTIGATION-TEMPLATE.md
│   ├── IMPLEMENTATION-TEMPLATE.md
│   ├── ANALYSIS-TEMPLATE.md
│   ├── AUDIT-TEMPLATE.md
│   ├── PATTERN-TEMPLATE.md
│   └── VERIFICATION-TEMPLATE.md
│
├── investigations/
│   ├── bug.md
│   ├── feature.md
│   ├── performance.md
│   ├── security.md
│   └── technical.md
│
└── documentation/
    ├── (28 templates across subdirectories)
    └── ...
```

---

## Deployment Process

### Phase 1: Work Order Templates

1. Create `trinity/templates/work-orders/`
2. Deploy 6 work order templates
3. Process variables, remove `.template` extension
4. Report: "{count} templates"

---

### Phase 2: Investigation Templates

1. Create `trinity/templates/investigations/`
2. Deploy 5 investigation templates
3. Process variables, remove `.template` extension
4. Report: "{count} templates"

---

### Phase 3: Documentation Templates

1. Create `trinity/templates/documentation/`
2. Recursively scan source directory
3. For each `.md.template`:
   - Process template variables
   - Remove `.template` extension
   - Write to destination (maintaining directory structure)
4. Report: "{count} templates"

---

## Template Extension Handling

**Source:** `TEMPLATE-NAME.md.template`
**Deployed:** `TEMPLATE-NAME.md`

**Removal Logic:**

```typescript
const deployedName = template.replace('.template', '');
```

---

## Error Handling

**Missing Template:**

- Skip silently
- Continue with other templates

**Directory Creation:**

- Ensure directories exist before deployment
- Use `fs.ensureDir()` for safety

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md)
- **Template Processor:** [docs/api/template-processor.md](template-processor.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
