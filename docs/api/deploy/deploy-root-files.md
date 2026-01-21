# Root Files Deployment API Reference

**Module:** `src/cli/commands/deploy/root-files.ts`
**Purpose:** Deploy CLAUDE.md hierarchy and root configuration files
**Priority:** MEDIUM (Context hierarchy)

---

## Overview

The Root Files Deployment module creates the Trinity Method CLAUDE.md context hierarchy across the project (root, trinity, source directories, tests) and deploys root configuration files.

**Key Features:**

- CLAUDE.md hierarchy (4-5 levels)
- Framework-specific source templates
- Test framework detection
- VERSION file creation
- TRINITY.md root file

---

## Core Function

### `deployRootFiles(templatesPath: string, variables: Record<string, string>, stack: Stack, pkgVersion: string, spinner: Spinner): Promise<number>`

Deploys root files and complete CLAUDE.md hierarchy.

**Parameters:**

- `templatesPath` (string) - SDK templates path
- `variables` (Record<string, string>) - Template variables
- `stack` (Stack) - Technology stack
- `pkgVersion` (string) - Trinity SDK version
- `spinner` (Spinner) - Status display

**Returns:** `Promise<number>` - Files deployed

---

## Deployed Files

### 1. Root Files (3 files)

**TRINITY.md**

- Location: Project root
- Purpose: Trinity Method project overview
- Template: `root/TRINITY.md.template`

**CLAUDE.md**

- Location: Project root
- Purpose: Global project context (top-level)
- Template: `root/CLAUDE.md.template`

**trinity/VERSION**

- Location: `trinity/VERSION`
- Purpose: Trinity SDK version tracking
- Content: SDK version string (e.g., "2.1.0")

---

### 2. Trinity CLAUDE.md (1 file)

**trinity/CLAUDE.md**

- Location: `trinity/CLAUDE.md`
- Purpose: Trinity Method enforcement context
- Template: `trinity/CLAUDE.md.template`

---

### 3. Source Directory CLAUDE.md (1-N files)

**{sourceDir}/CLAUDE.md**

- Location: Each detected source directory
- Purpose: Framework-specific development context
- Templates: Framework-specific (7 variants)

**Framework Template Mapping:**

```typescript
const frameworkMap = {
  'Node.js': 'nodejs-CLAUDE.md.template',
  Flutter: 'flutter-CLAUDE.md.template',
  React: 'react-CLAUDE.md.template',
  'Next.js': 'react-CLAUDE.md.template',
  Python: 'python-CLAUDE.md.template',
  Rust: 'rust-CLAUDE.md.template',
  Unknown: 'base-CLAUDE.md.template',
};
```

**Fallback:** Uses `base-CLAUDE.md.template` if framework template not found

---

### 4. Tests CLAUDE.md (1 file, conditional)

**tests/CLAUDE.md**

- Location: `tests/CLAUDE.md` (if `tests/` exists)
- Purpose: Testing context and standards
- Template: `source/tests-CLAUDE.md.template`
- Test Framework Detection: Jest, Vitest, Mocha, Pytest

---

## CLAUDE.md Hierarchy

```
Project/
├── CLAUDE.md                    # Global context (top-level)
├── TRINITY.md                   # Trinity Method overview
├── trinity/
│   ├── VERSION                  # SDK version
│   └── CLAUDE.md                # Trinity enforcement
├── src/                         # Source directories (framework-specific)
│   └── CLAUDE.md
├── backend/src/
│   └── CLAUDE.md
└── tests/
    └── CLAUDE.md                # Testing context
```

**Context Loading Order:**

1. Root CLAUDE.md (global project context)
2. trinity/CLAUDE.md (Trinity Method enforcement)
3. {sourceDir}/CLAUDE.md (framework-specific rules)
4. tests/CLAUDE.md (testing standards)

---

## Test Framework Detection

**Function:** `detectTestFramework()`

**Detection Logic:**

1. Read `package.json`
2. Check dependencies + devDependencies
3. Match against known frameworks

**Supported Frameworks:**

- Jest (`jest`)
- Vitest (`vitest`)
- Mocha (`mocha`)
- Pytest (`pytest`)

**Default:** "Generic" (if no framework detected)

---

## Deployment Flow

```
deployRootFiles()
    ↓
[1] Deploy Root Files
    ├→ TRINITY.md
    ├→ CLAUDE.md
    └→ trinity/VERSION
    ↓
[2] Deploy trinity/CLAUDE.md
    ↓
[3] Deploy Source CLAUDE.md (per source directory)
    ├→ Detect framework template
    ├→ Process with SOURCE_DIR variable
    └→ Write to {sourceDir}/CLAUDE.md
    ↓
[4] Deploy tests/CLAUDE.md (if tests/ exists)
    ├→ Detect test framework
    ├→ Process with TEST_FRAMEWORK variable
    └→ Write to tests/CLAUDE.md
```

---

## Error Handling

**Missing Framework Template:**

- Fallback to `base-CLAUDE.md.template`
- Display warning
- Continue deployment

**Missing tests/ Directory:**

- Skip tests/CLAUDE.md deployment
- No error (conditional deployment)

**Missing Source Directory:**

- Skip specific source directory
- Display warning
- Continue with other directories

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md)
- **Template Processor:** [docs/api/template-processor.md](template-processor.md)
- **Framework Detection:** [docs/api/detect-stack.md](detect-stack.md)

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
