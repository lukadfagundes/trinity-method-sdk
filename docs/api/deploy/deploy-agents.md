# Agent Deployment API Reference

**Module:** `src/cli/commands/deploy/agents.ts`
**Purpose:** Deploy 19 Trinity agent templates to `.claude/agents/` directory
**Priority:** MEDIUM (Agent orchestration)

---

## Overview

The Agent Deployment module deploys Trinity Method's 19 specialized agents to the `.claude/agents/` directory with proper subdirectory organization. It processes agent templates with variable substitution and validates paths for security.

**Key Features:**

- 19 agent templates across 5 specialized teams
- Hierarchical directory structure (leadership, deployment, audit, planning, aj-team)
- Template variable substitution
- Path validation for security
- Deployment tracking and reporting

---

## Core Function

### `deployAgents(templatesPath: string, variables: Record<string, string>, spinner: Spinner): Promise<number>`

Deploys all Trinity agent configurations to `.claude/agents/`.

**Parameters:**

- `templatesPath` (string) - Path to templates directory (e.g., SDK templates)
- `variables` (Record<string, string>) - Template variables for substitution
- `spinner` (Spinner) - Spinner instance for status display

**Returns:** `Promise<number>` - Number of agents deployed

**Agent Structure:**

```typescript
const agentDirs = [
  { dir: 'leadership', agents: ['aly-cto.md', 'aj-maestro.md'] },
  {
    dir: 'deployment',
    agents: ['tan-structure.md', 'zen-knowledge.md', 'ino-context.md', 'ein-cicd.md'],
  },
  { dir: 'audit', agents: ['juno-auditor.md'] },
  {
    dir: 'planning',
    agents: ['mon-requirements.md', 'ror-design.md', 'tra-planner.md', 'eus-decomposer.md'],
  },
  {
    dir: 'aj-team',
    agents: [
      'kil-task-executor.md',
      'bas-quality-gate.md',
      'dra-code-reviewer.md',
      'apo-documentation-specialist.md',
      'bon-dependency-manager.md',
      'cap-configuration-specialist.md',
      'uro-refactoring-specialist.md',
    ],
  },
];
```

**Total Agents:** 19

---

## Agent Organization

### Leadership Team (2 agents)

**Directory:** `.claude/agents/leadership/`

**Agents:**

- `aly-cto.md` - Chief Technology Officer
- `aj-maestro.md` - Engineering Manager (project orchestrator)

**Purpose:** High-level project orchestration and technical leadership

---

### Deployment Team (4 agents)

**Directory:** `.claude/agents/deployment/`

**Agents:**

- `tan-structure.md` - Directory structure creator
- `zen-knowledge.md` - Knowledge base deployer
- `ino-context.md` - Context hierarchy manager
- `ein-cicd.md` - CI/CD integration specialist

**Purpose:** Trinity Method deployment and infrastructure setup

---

### Audit Team (1 agent)

**Directory:** `.claude/agents/audit/`

**Agents:**

- `juno-auditor.md` - Codebase auditor and metrics collector

**Purpose:** Codebase analysis, metrics collection, technical debt identification

---

### Planning Team (4 agents)

**Directory:** `.claude/agents/planning/`

**Agents:**

- `mon-requirements.md` - Requirements analyst
- `ror-design.md` - Architecture designer
- `tra-planner.md` - Task planner
- `eus-decomposer.md` - Task decomposer

**Purpose:** Requirements analysis, architecture design, task planning

---

### AJ's Implementation Team (7 agents)

**Directory:** `.claude/agents/aj-team/`

**Agents:**

- `kil-task-executor.md` - Task executor (implementation)
- `bas-quality-gate.md` - Quality gate enforcer (BAS 6-phase)
- `dra-code-reviewer.md` - Code reviewer
- `apo-documentation-specialist.md` - Documentation writer
- `bon-dependency-manager.md` - Dependency manager
- `cap-configuration-specialist.md` - Configuration specialist
- `uro-refactoring-specialist.md` - Refactoring specialist

**Purpose:** Code implementation, quality assurance, documentation, refactoring

---

## Deployment Process

### Step 1: Iterate Agent Directories

```typescript
for (const { dir, agents } of agentDirs) {
  for (const agent of agents) {
    // Process each agent
  }
}
```

### Step 2: Locate Template

```typescript
const templatePath = path.join(templatesPath, '.claude/agents', dir, `${agent}.template`);
```

**Template Path Example:**

```
{SDK}/templates/.claude/agents/leadership/aly-cto.md.template
```

### Step 3: Read and Process Template

```typescript
if (await fs.pathExists(templatePath)) {
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
}
```

**Variable Substitution:**

- `{{PROJECT_NAME}}` → Project name
- `{{FRAMEWORK}}` → Detected framework
- `{{SOURCE_DIR}}` → Source directory
- etc.

### Step 4: Validate and Write

```typescript
const destPath = validatePath(`.claude/agents/${dir}/${agent}`);
await fs.writeFile(destPath, processed);
agentsDeployed++;
```

**Security:** Uses `validatePath()` to prevent path traversal

---

## Example Usage

```typescript
import { deployAgents } from './deploy/agents.js';
import ora from 'ora';

const spinner = ora();
const variables = {
  PROJECT_NAME: 'EcommerceApp',
  FRAMEWORK: 'Next.js',
  SOURCE_DIR: 'src',
  LANGUAGE: 'JavaScript/TypeScript',
};

const deployed = await deployAgents('/path/to/sdk/templates', variables, spinner);
console.log(`Deployed ${deployed} agents`);
// Output: "Deployed 19 agents"
```

**Spinner Messages:**

```
⠙ Deploying Claude Code agents...
✓ Agents deployed (19 agents)
```

---

## Deployed Directory Structure

```
.claude/
└── agents/
    ├── leadership/
    │   ├── aly-cto.md
    │   └── aj-maestro.md
    ├── deployment/
    │   ├── tan-structure.md
    │   ├── zen-knowledge.md
    │   ├── ino-context.md
    │   └── ein-cicd.md
    ├── audit/
    │   └── juno-auditor.md
    ├── planning/
    │   ├── mon-requirements.md
    │   ├── ror-design.md
    │   ├── tra-planner.md
    │   └── eus-decomposer.md
    └── aj-team/
        ├── kil-task-executor.md
        ├── bas-quality-gate.md
        ├── dra-code-reviewer.md
        ├── apo-documentation-specialist.md
        ├── bon-dependency-manager.md
        ├── cap-configuration-specialist.md
        └── uro-refactoring-specialist.md
```

---

## Integration with Deploy Command

```typescript
import { deployAgents } from './deploy/agents.js';

async function deploy(options) {
  const stack = await detectStack();
  const variables = extractVariables(stack, options.projectName);
  const templatesPath = await getTemplatesPath();

  // Step X: Deploy agents
  const agentsDeployed = await deployAgents(templatesPath, variables, spinner);

  stats.agentsDeployed = agentsDeployed;
}
```

---

## Error Handling

### Template Not Found

**Behavior:** Silently skips missing templates

```typescript
if (await fs.pathExists(templatePath)) {
  // Deploy agent
} else {
  // Skip silently (no error thrown)
}
```

**Rationale:** Allows partial template sets (e.g., SDK without all agents)

**Result:** `agentsDeployed` count reflects actually deployed agents

---

### Path Validation Failure

**Cause:** Malicious template path (e.g., path traversal)

**Error:**

```typescript
const destPath = validatePath(`.claude/agents/${dir}/${agent}`);
// Throws: "Path traversal detected"
```

**Result:** Deployment aborted, error propagated to caller

---

## Performance Considerations

**Typical Performance:**

- 19 agents × (read template + process + write)
- ~100ms total (SSD)

**Optimization:** Sequential processing (could be parallelized)

---

## Security Considerations

**Path Validation:**

- All destination paths validated via `validatePath()`
- Prevents writing outside `.claude/agents/`

**Template Source Trust:**

- Templates from SDK installation (trusted source)
- No user-provided template paths

---

## Testing Recommendations

```typescript
describe('deployAgents', () => {
  it('should deploy all 19 agents', async () => {
    const deployed = await deployAgents(templatesPath, variables, ora());
    expect(deployed).toBe(19);
  });

  it('should create proper directory structure', async () => {
    await deployAgents(templatesPath, variables, ora());
    expect(fs.existsSync('.claude/agents/leadership/aly-cto.md')).toBe(true);
    expect(fs.existsSync('.claude/agents/aj-team/kil-task-executor.md')).toBe(true);
  });

  it('should process template variables', async () => {
    const variables = { PROJECT_NAME: 'TestApp' };
    await deployAgents(templatesPath, variables, ora());
    const content = fs.readFileSync('.claude/agents/leadership/aj-maestro.md', 'utf8');
    expect(content).toContain('TestApp');
  });
});
```

---

## Related Documentation

- **Deploy Command:** [docs/api/deploy-command.md](deploy-command.md) - Main deployment orchestration
- **Template Processor:** [docs/api/template-processor.md](template-processor.md) - Variable substitution
- **Path Validation:** [docs/api/validate-path.md](validate-path.md) - Security validation

---

**Last Updated:** 2026-01-21
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
