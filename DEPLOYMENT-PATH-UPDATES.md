# Trinity Deploy CLI - Path Updates Required

**Date:** 2026-01-15
**Reason:** Restructured `src/templates/` to mirror deployed directory structure

---

## Summary of Changes

The `src/templates/` directory has been reorganized to match the deployed structure in user projects:

```
OLD Structure:                    NEW Structure:
src/templates/                    src/templates/
├── agents/                       ├── .claude/
├── claude/                       │   ├── agents/
├── shared/claude-commands/       │   └── commands/
├── knowledge-base/               ├── root/
├── work-orders/                  │   └── linting/
├── investigations/               ├── trinity/
├── documentation/                │   ├── knowledge-base/
├── linting/                      │   ├── templates/
├── ci/                           │   └── documentation/
├── root/                         ├── source/
├── source/                       └── ci/
└── trinity/
```

---

## Files Requiring Updates

### 1. `src/cli/commands/deploy/agents.ts`

**Current Path (Line 55):**

```typescript
const templatePath = path.join(templatesPath, 'agents', dir, `${agent}.template`);
```

**New Path:**

```typescript
const templatePath = path.join(templatesPath, '.claude/agents', dir, `${agent}.template`);
```

**Files Affected:** 18 agent templates

---

### 2. `src/cli/commands/deploy/claude-setup.ts`

#### Change 1: Employee Directory (Lines 41-44)

**Current Path:**

```typescript
const employeeDirectoryTemplate = path.join(
  templatesPath,
  'claude',
  'EMPLOYEE-DIRECTORY.md.template'
);
```

**New Path:**

```typescript
const employeeDirectoryTemplate = path.join(
  templatesPath,
  '.claude',
  'EMPLOYEE-DIRECTORY.md.template'
);
```

#### Change 2: Command Templates (Line 95)

**Current Path:**

```typescript
const commandsTemplatePath = path.join(templatesPath, 'shared/claude-commands');
```

**New Path:**

```typescript
const commandsTemplatePath = path.join(templatesPath, '.claude/commands');
```

**IMPORTANT:** Commands are now organized by category in subdirectories!

**Current Logic (Lines 98-109):**

```typescript
const commandFiles = await fs.readdir(commandsTemplatePath);

for (const file of commandFiles) {
  if (file.endsWith('.md.template') && commandCategories[file]) {
    const sourcePath = path.join(commandsTemplatePath, file);
    const category = commandCategories[file];
    const deployedName = file.replace('.template', '');
    const destPath = path.join(commandsDir, category, deployedName);
    await fs.copy(sourcePath, destPath);
    commandsDeployed++;
    filesDeployed++;
  }
}
```

**New Logic Required:**

```typescript
// Commands are already organized by category in source
const categories = [
  'session',
  'planning',
  'execution',
  'investigation',
  'infrastructure',
  'utility',
];

for (const category of categories) {
  const categoryPath = path.join(commandsTemplatePath, category);

  if (await fs.pathExists(categoryPath)) {
    const commandFiles = await fs.readdir(categoryPath);

    for (const file of commandFiles) {
      if (file.endsWith('.md.template')) {
        const sourcePath = path.join(categoryPath, file);
        const deployedName = file.replace('.template', '');
        const destPath = path.join(commandsDir, category, deployedName);
        await fs.copy(sourcePath, destPath);
        commandsDeployed++;
        filesDeployed++;
      }
    }
  }
}
```

**Files Affected:** 19 command templates

---

### 3. `src/cli/commands/deploy/knowledge-base.ts`

**Current Path (Line 45):**

```typescript
const templatePath = path.join(templatesPath, 'knowledge-base', `${template}.template`);
```

**New Path:**

```typescript
const templatePath = path.join(templatesPath, 'trinity/knowledge-base', `${template}.template`);
```

**Files Affected:** 9 knowledge base templates

---

### 4. `src/cli/commands/deploy/templates.ts`

#### Change 1: Work Order Templates (Line 41)

**Current Path:**

```typescript
const templatePath = path.join(templatesPath, 'work-orders', template);
```

**New Path:**

```typescript
const templatePath = path.join(templatesPath, 'trinity/templates/work-orders', template);
```

#### Change 2: Investigation Templates (Line 71)

**Current Path:**

```typescript
const templatePath = path.join(templatesPath, 'investigations', template);
```

**New Path:**

```typescript
const templatePath = path.join(templatesPath, 'trinity/templates/investigations', template);
```

#### Change 3: Documentation Templates (Line 95)

**Current Path:**

```typescript
const templatePath = path.join(templatesPath, 'documentation', template);
```

**New Path:**

```typescript
const templatePath = path.join(templatesPath, 'trinity/documentation', template);
```

**Files Affected:** 13 templates (6 work orders + 5 investigations + 2 documentation)

---

### 5. `src/cli/commands/deploy/linting.ts`

**Current Path (Need to check line numbers):**

```typescript
const lintingTemplatePath = path.join(templatesPath, 'linting', framework);
```

**New Path:**

```typescript
const lintingTemplatePath = path.join(templatesPath, 'root/linting', framework);
```

**Files Affected:** 13 linting templates across 4 frameworks

---

### 6. `src/cli/commands/deploy/root-files.ts`

**No changes required** - root files already in correct location:

- `src/templates/root/CLAUDE.md.template`
- `src/templates/root/TRINITY.md.template`

**Trinity CLAUDE.md** - Already correct:

- `src/templates/trinity/CLAUDE.md.template`

**Source CLAUDE.md files** - Already correct:

- `src/templates/source/*.CLAUDE.md.template`

---

### 7. `src/cli/commands/deploy/ci-cd.ts`

**Verify** - CI templates location (likely unchanged):

- `src/templates/ci/ci.yml.template`
- `src/templates/ci/cd.yml.template`

**No changes required** unless CI templates were moved.

---

## Implementation Checklist

- [ ] Update `agents.ts` - Change agents path from `agents/` to `.claude/agents/`
- [ ] Update `claude-setup.ts` - Change employee directory path from `claude/` to `.claude/`
- [ ] Update `claude-setup.ts` - Rewrite command deployment logic to read from categorized subdirectories
- [ ] Update `knowledge-base.ts` - Change path from `knowledge-base/` to `trinity/knowledge-base/`
- [ ] Update `templates.ts` - Change work orders path to `trinity/templates/work-orders/`
- [ ] Update `templates.ts` - Change investigations path to `trinity/templates/investigations/`
- [ ] Update `templates.ts` - Change documentation path to `trinity/documentation/`
- [ ] Update `linting.ts` - Change path from `linting/` to `root/linting/`
- [ ] Rebuild SDK with `npm run build`
- [ ] Test deployment on fresh project
- [ ] Verify all 66-80 files deploy correctly
- [ ] Update `DEPLOYMENT-ARCHITECTURE.md` to reflect new source structure

---

## Testing Procedure

After making updates:

```bash
# 1. Rebuild SDK
npm run build

# 2. Test on fresh directory
cd /tmp/test-deploy
npx trinity deploy --yes

# 3. Verify structure matches expected
tree .claude trinity

# 4. Count deployed files
find .claude trinity -type f | wc -l  # Should be 66-80

# 5. Verify no broken paths
grep -r "templates/agents" .  # Should find nothing (old path)
```

---

## Risk Assessment

**Low Risk:**

- Root files (no changes)
- Source CLAUDE.md files (no changes)
- CI/CD templates (likely no changes)

**Medium Risk:**

- Agent templates (path change from `agents/` to `.claude/agents/`)
- Knowledge base (path change to `trinity/knowledge-base/`)
- Linting (path change to `root/linting/`)
- Template files (path changes to `trinity/templates/` and `trinity/documentation/`)

**High Risk:**

- Claude commands deployment logic (requires rewrite from flat to categorized structure)

---

## Notes

1. **Command categorization** is now handled by source directory structure, not by lookup map
2. **Template validation** in deploy should check new paths
3. **Build process** (template copy) should preserve new directory structure
4. **Documentation templates** (28 files) are NOT deployed by `trinity deploy` - they remain in SDK for use by `trinity-docs` command

---

**Next Steps:**

1. Review this document
2. Make changes to each file listed above
3. Test deployment thoroughly
4. Update deployment architecture documentation
5. Commit changes as single atomic commit

---

## ADDENDUM: Documentation Templates Deployment

**Date:** 2026-01-16
**Update:** Added recursive deployment of all 28 documentation templates

### Change Made

Updated `src/cli/commands/deploy/templates.ts` to deploy **ALL** documentation templates (not just ROOT-README and SUBDIRECTORY-README).

**Old Behavior:**

- Only 2 documentation templates deployed: ROOT-README.md, SUBDIRECTORY-README.md
- Other 26 templates remained in SDK, accessed by trinity-docs command from node_modules

**New Behavior:**

- All 28 documentation templates deployed to `trinity/templates/documentation/`
- Includes all subdirectories: api-docs/, configuration/, discovery/, guides/, mermaid-diagrams/, processes/, reports/, validation/
- Templates are processed (variable substitution) and `.template` extension removed

### Files Deployed (28 templates)

```
trinity/templates/documentation/
├── ROOT-README.md
├── SUBDIRECTORY-README.md
├── api-docs/
│   └── README.md
├── configuration/
│   ├── documentation-structure.md
│   └── env-example-generator.md
├── discovery/
│   ├── framework-detection.md
│   ├── component-discovery.md
│   ├── api-endpoint-scanner.md
│   └── env-variable-extraction.md
├── guides/
│   ├── getting-started.md
│   ├── api-development.md
│   ├── deployment.md
│   └── contributing.md
├── mermaid-diagrams/
│   ├── mvc-flow.md
│   ├── database-er.md
│   ├── api-endpoint-map.md
│   └── component-hierarchy.md
├── processes/
│   ├── apo-workflow-common.md
│   ├── apo-diagram-specific.md
│   ├── apo-guide-specific.md
│   ├── apo-config-specific.md
│   ├── error-handling-protocol.md
│   └── fallback-mechanism.md
├── reports/
│   ├── juno-final-report.md
│   └── juno-internal-report.md
└── validation/
    ├── juno-quality-gates.md
    ├── documentation-verification-rules.md
    └── apo-self-validation.md
```

### Implementation

Added recursive `copyDocTemplates()` function that:

1. Reads all items in source directory
2. Creates subdirectories in destination
3. Processes `.md.template` files with variable substitution
4. Removes `.template` extension on deployment
5. Recursively processes all subdirectories

### Benefits

1. **Self-contained projects:** All documentation templates available locally
2. **Offline capable:** No dependency on SDK installation for trinity-docs command
3. **Customizable:** Users can modify templates per-project
4. **Version controlled:** Templates are part of project repo
5. **Faster execution:** No need to read from node_modules

### Total Deployment Count

**Previous:** 66-68 files deployed  
**New:** 94-96 files deployed (+28 documentation templates)

### Testing Required

- [ ] Deploy to fresh project
- [ ] Verify all 28 templates in `trinity/templates/documentation/`
- [ ] Verify subdirectory structure preserved
- [ ] Verify `.template` extensions removed
- [ ] Verify variable substitution works
- [ ] Test trinity-docs command reads from project templates (not SDK)
