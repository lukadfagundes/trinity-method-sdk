# Templates Module

Comprehensive template system for Trinity Method SDK deployment.

## Overview

The templates module contains all template files used during Trinity Method deployment. Templates use a variable substitution system (`{{VARIABLE_NAME}}`) to customize content for each project.

**Total Templates**: 70+ files across 13 subdirectories
**Variable System**: 40+ predefined variables
**Frameworks Supported**: Node.js, React, Next.js, Python, Flutter, Rust

## Directory Structure

```
templates/
├── agents/                      # Agent configuration templates (19 agents)
│   ├── leadership/              # Leadership team (2 agents)
│   ├── deployment/              # Deployment specialists (4 agents)
│   ├── audit/                   # Quality auditor (1 agent)
│   ├── planning/                # Planning team (4 agents) - v2.0
│   └── aj-team/                 # Execution team (7 agents) - v2.0
├── ci/                          # CI/CD workflow templates (3 files)
├── claude/                      # Claude Code configurations
├── investigations/              # Investigation templates (5 types)
├── knowledge-base/              # Knowledge base templates (9 files)
├── linting/                     # Linting configuration templates
│   ├── nodejs/                  # Node.js/React linting
│   ├── python/                  # Python linting
│   ├── flutter/                 # Flutter/Dart linting
│   └── rust/                    # Rust linting
├── root/                        # Root project files (2 files)
├── shared/                      # Shared resources
│   └── claude-commands/         # Trinity slash commands (16 files)
├── source/                      # Source directory CLAUDE.md (6 files)
├── trinity/                     # Trinity-specific files
└── work-orders/                 # Work order templates (6 files)
```

---

## 1. agents/ Directory

Agent configuration templates for the Trinity Method v2.0 architecture.

### leadership/ (2 agents)

**aly-cto.md.template**
- **Agent**: ALY (Chief Technology Officer)
- **Role**: Strategic planning and work order creation
- **Purpose**: High-level project oversight and decision making
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR

**aj-maestro.md.template**
- **Agent**: AJ MAESTRO (AI-orchestrated Implementation Lead)
- **Role**: Coordinates 11-agent implementation team
- **Purpose**: v2.0 AI-powered orchestration
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

### deployment/ (4 agents)

**tan-structure.md.template**
- **Agent**: TAN (Trinity Architecture Navigator)
- **Role**: Structure specialist
- **Purpose**: Directory organization and architecture
- **Variables**: PROJECT_NAME, SOURCE_DIR, FRAMEWORK

**zen-knowledge.md.template**
- **Agent**: ZEN (Zentient)
- **Role**: Knowledge base specialist
- **Purpose**: Documentation and knowledge management
- **Variables**: PROJECT_NAME, FRAMEWORK, TODO_COUNT

**ino-context.md.template**
- **Agent**: INO (Investigator)
- **Role**: Context specialist
- **Purpose**: Codebase analysis and context building
- **Variables**: PROJECT_NAME, SOURCE_DIR, TOTAL_FILES

**ein-cicd.md.template**
- **Agent**: EIN (CI/CD Specialist)
- **Role**: CI/CD automation
- **Purpose**: Continuous integration and deployment
- **Variables**: PROJECT_NAME, FRAMEWORK, PACKAGE_MANAGER

### audit/ (1 agent)

**juno-auditor.md.template**
- **Agent**: JUNO (Quality Auditor)
- **Role**: Comprehensive quality assurance
- **Purpose**: Code quality, security, and best practices auditing
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR, TODO_COUNT

### planning/ (4 agents) - v2.0

**mon-requirements.md.template**
- **Agent**: MON (Requirements Analyst)
- **Role**: Requirements analysis
- **Purpose**: Analyze and document project requirements
- **Variables**: PROJECT_NAME, FRAMEWORK
- **New in**: v2.0

**ror-design.md.template**
- **Agent**: ROR (Design Architect)
- **Role**: Technical design
- **Purpose**: Create technical designs using Requirements Oriented Reasoning
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

**tra-planner.md.template**
- **Agent**: TRA (Implementation Planner)
- **Role**: Implementation planning
- **Purpose**: Create detailed implementation plans
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

**eus-decomposer.md.template**
- **Agent**: EUS (Task Decomposer)
- **Role**: Task decomposition
- **Purpose**: Break work into atomic tasks using Evidence Under Scrutiny
- **Variables**: PROJECT_NAME, FRAMEWORK
- **New in**: v2.0

### aj-team/ (7 agents) - v2.0

**kil-task-executor.md.template**
- **Agent**: KIL (Task Executor)
- **Role**: Execute atomic tasks
- **Purpose**: Primary implementation agent
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

**bas-quality-gate.md.template**
- **Agent**: BAS (Quality Gate)
- **Role**: Quality validation
- **Purpose**: Enforce quality standards before completion
- **Variables**: PROJECT_NAME, FRAMEWORK
- **New in**: v2.0

**dra-code-reviewer.md.template**
- **Agent**: DRA (Code Reviewer)
- **Role**: Code review specialist
- **Purpose**: Review code for quality and best practices
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

**apo-documentation-specialist.md.template**
- **Agent**: APO (Documentation Specialist)
- **Role**: Documentation expert
- **Purpose**: Create and maintain comprehensive documentation
- **Variables**: PROJECT_NAME, FRAMEWORK
- **New in**: v2.0

**bon-dependency-manager.md.template**
- **Agent**: BON (Dependency Manager)
- **Role**: Dependency management
- **Purpose**: Manage project dependencies and updates
- **Variables**: PROJECT_NAME, FRAMEWORK, PACKAGE_MANAGER
- **New in**: v2.0

**cap-configuration-specialist.md.template**
- **Agent**: CAP (Configuration Specialist)
- **Role**: Configuration management
- **Purpose**: Manage environment configs and settings
- **Variables**: PROJECT_NAME, FRAMEWORK
- **New in**: v2.0

**uro-refactoring-specialist.md.template**
- **Agent**: URO (Refactoring Specialist)
- **Role**: Code refactoring expert
- **Purpose**: Improve code quality through refactoring
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **New in**: v2.0

---

## 2. ci/ Directory

CI/CD workflow templates for automated testing and deployment.

**generic-ci.yml**
- **Purpose**: Generic CI/CD template (reference)
- **Target**: `trinity/templates/ci/generic-ci.yml`
- **Variables**: PROJECT_NAME, FRAMEWORK, PACKAGE_MANAGER
- **Features**: Test automation, build steps, deployment hooks

**github-actions.yml**
- **Purpose**: GitHub Actions workflow
- **Target**: `.github/workflows/trinity-ci.yml`
- **Variables**: PROJECT_NAME, FRAMEWORK, PACKAGE_MANAGER
- **Features**: Multi-OS testing, caching, artifact uploads
- **Triggers**: Push to main, pull requests

**gitlab-ci.yml**
- **Purpose**: GitLab CI pipeline
- **Target**: `.gitlab-ci.yml`
- **Variables**: PROJECT_NAME, FRAMEWORK, PACKAGE_MANAGER
- **Features**: Staged pipeline, Docker support, test coverage
- **Stages**: build, test, deploy

---

## 3. claude/ Directory

Claude Code integration files.

**EMPLOYEE-DIRECTORY.md.template**
- **Purpose**: Agent directory with descriptions
- **Target**: `.claude/EMPLOYEE-DIRECTORY.md`
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Content**: All 19 agents with roles, responsibilities, and invocation commands
- **Sections**: Leadership, Planning, Execution, Deployment, Audit teams

---

## 4. investigations/ Directory

Investigation templates for different investigation types.

**bug.md.template**
- **Type**: Bug investigation
- **Purpose**: Systematic bug analysis and resolution
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Sections**: Reproduction steps, root cause analysis, fix validation

**feature.md.template**
- **Type**: Feature investigation
- **Purpose**: Feature planning and design
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Sections**: Requirements, design, implementation plan, testing

**performance.md.template**
- **Type**: Performance investigation
- **Purpose**: Performance analysis and optimization
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Sections**: Profiling, bottleneck analysis, optimization plan

**security.md.template**
- **Type**: Security investigation
- **Purpose**: Security audit and vulnerability assessment
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Sections**: Threat modeling, vulnerability scan, remediation plan

**technical.md.template**
- **Type**: Technical investigation
- **Purpose**: General technical analysis
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Sections**: Problem definition, analysis, recommendations

---

## 5. knowledge-base/ Directory

Knowledge base templates for project documentation.

**ARCHITECTURE.md.template**
- **Purpose**: System architecture documentation
- **Target**: `trinity/knowledge-base/ARCHITECTURE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR, TOTAL_FILES, TODO_COUNT, DEPENDENCY_COUNT
- **Sections**: Tech stack, architecture overview, component details, data flow

**Trinity.md.template**
- **Purpose**: Trinity Method guidelines
- **Target**: `trinity/knowledge-base/Trinity.md`
- **Variables**: PROJECT_NAME, TRINITY_VERSION
- **Content**: Trinity principles, workflow, agent usage

**To-do.md.template**
- **Purpose**: Task tracking
- **Target**: `trinity/knowledge-base/To-do.md`
- **Variables**: PROJECT_NAME, CURRENT_DATE
- **Sections**: Current tasks, backlog, completed tasks

**ISSUES.md.template**
- **Purpose**: Issue tracking
- **Target**: `trinity/knowledge-base/ISSUES.md`
- **Variables**: PROJECT_NAME, CURRENT_DATE
- **Sections**: Open issues, resolved issues, blocked issues

**Technical-Debt.md.template**
- **Purpose**: Technical debt management
- **Target**: `trinity/knowledge-base/Technical-Debt.md`
- **Variables**: PROJECT_NAME, TODO_COUNT, FILES_500
- **Sections**: Debt inventory, priority items, refactoring plans

**CODING-PRINCIPLES.md.template** (v2.0)
- **Purpose**: Coding standards and best practices
- **Target**: `trinity/knowledge-base/CODING-PRINCIPLES.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, LANGUAGE
- **Content**: Code style, patterns, anti-patterns, naming conventions

**TESTING-PRINCIPLES.md.template** (v2.0)
- **Purpose**: Testing guidelines
- **Target**: `trinity/knowledge-base/TESTING-PRINCIPLES.md`
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Content**: Testing strategy, coverage goals, test types

**AI-DEVELOPMENT-GUIDE.md.template** (v2.0)
- **Purpose**: AI-assisted development guidelines
- **Target**: `trinity/knowledge-base/AI-DEVELOPMENT-GUIDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Content**: Agent usage, prompting best practices, workflow guidance

**DOCUMENTATION-CRITERIA.md.template** (v2.0)
- **Purpose**: Documentation standards
- **Target**: `trinity/knowledge-base/DOCUMENTATION-CRITERIA.md`
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Content**: Documentation requirements, templates, review criteria

---

## 6. linting/ Directory

Framework-specific linting configuration templates.

### nodejs/ (Node.js, React, Next.js)

**.eslintrc-typescript.json.template**
- **Purpose**: ESLint config for TypeScript
- **Target**: `.eslintrc.json`
- **Variables**: PROJECT_NAME
- **Plugins**: @typescript-eslint, react (if React)

**.eslintrc-esm.json.template**
- **Purpose**: ESLint config for ES Modules
- **Target**: `.eslintrc.json`
- **Variables**: PROJECT_NAME

**.eslintrc-commonjs.json.template**
- **Purpose**: ESLint config for CommonJS
- **Target**: `.eslintrc.json`
- **Variables**: PROJECT_NAME

**.prettierrc.json.template**
- **Purpose**: Prettier configuration
- **Target**: `.prettierrc.json`
- **Variables**: None (static config)

**.pre-commit-config.yaml.template**
- **Purpose**: Pre-commit hooks for Node.js
- **Target**: `.pre-commit-config.yaml`
- **Hooks**: eslint, prettier

### python/

**pyproject.toml.template**
- **Purpose**: Python project config (Black, isort)
- **Target**: `pyproject.toml`
- **Variables**: PROJECT_NAME
- **Tools**: black, isort

**.flake8.template**
- **Purpose**: Flake8 configuration
- **Target**: `.flake8`
- **Variables**: None (static config)

**.pre-commit-config.yaml.template**
- **Purpose**: Pre-commit hooks for Python
- **Target**: `.pre-commit-config.yaml`
- **Hooks**: black, flake8, isort

### flutter/

**analysis_options.yaml.template**
- **Purpose**: Dart analyzer configuration
- **Target**: `analysis_options.yaml`
- **Variables**: None (static config)

**.pre-commit-config.yaml.template**
- **Purpose**: Pre-commit hooks for Flutter
- **Target**: `.pre-commit-config.yaml`
- **Hooks**: dart analyze, dart format

### rust/

**clippy.toml.template**
- **Purpose**: Clippy linter configuration
- **Target**: `clippy.toml`
- **Variables**: None (static config)

**rustfmt.toml.template**
- **Purpose**: Rustfmt formatter configuration
- **Target**: `rustfmt.toml`
- **Variables**: None (static config)

**.pre-commit-config.yaml.template**
- **Purpose**: Pre-commit hooks for Rust
- **Target**: `.pre-commit-config.yaml`
- **Hooks**: cargo clippy, cargo fmt

---

## 7. root/ Directory

Root-level project files.

**TRINITY.md.template**
- **Purpose**: Root Trinity documentation
- **Target**: `TRINITY.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, TRINITY_VERSION
- **Content**: Trinity overview, quick start, agent commands

**CLAUDE.md.template**
- **Purpose**: Root Claude Code context
- **Target**: `CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: Project overview, architecture summary, key files

---

## 8. shared/claude-commands/ Directory

Trinity Method slash commands (16 files, categorized).

### Session Management (3 commands)

**trinity-start.md**
- **Command**: `/trinity-start`
- **Purpose**: Start Trinity workflow
- **Category**: session
- **Content**: Guide through first Trinity session

**trinity-continue.md**
- **Command**: `/trinity-continue`
- **Purpose**: Resume work after interruption
- **Category**: session
- **Content**: ALY reviews state and provides recommendations

**trinity-end.md**
- **Command**: `/trinity-end`
- **Purpose**: End session and archive work
- **Category**: session
- **Content**: Archive to trinity/archive/

### Planning (4 commands) - v2.0

**trinity-requirements.md**
- **Command**: `/trinity-requirements`
- **Purpose**: Analyze requirements (MON)
- **Category**: planning
- **Content**: Requirements analysis workflow

**trinity-design.md**
- **Command**: `/trinity-design`
- **Purpose**: Create technical design (ROR)
- **Category**: planning
- **Content**: ROR design process

**trinity-plan.md**
- **Command**: `/trinity-plan`
- **Purpose**: Create implementation plan (TRA)
- **Category**: planning
- **Content**: Implementation planning workflow

**trinity-decompose.md**
- **Command**: `/trinity-decompose`
- **Purpose**: Decompose into atomic tasks (EUS)
- **Category**: planning
- **Content**: Task decomposition using EUS

### Execution (1 command) - v2.0

**trinity-orchestrate.md**
- **Command**: `/trinity-orchestrate`
- **Purpose**: AI-orchestrated implementation (AJ MAESTRO)
- **Category**: execution
- **Content**: 11-agent orchestration workflow

### Investigation (3 commands)

**trinity-create-investigation.md**
- **Command**: `/trinity-create-investigation`
- **Purpose**: Launch Investigation Wizard
- **Category**: investigation
- **Content**: Create structured investigations

**trinity-plan-investigation.md**
- **Command**: `/trinity-plan-investigation`
- **Purpose**: Generate investigation plans
- **Category**: investigation
- **Content**: AI-powered investigation planning

**trinity-investigate-templates.md**
- **Command**: `/trinity-investigate-templates`
- **Purpose**: Investigation template reference
- **Category**: investigation
- **Content**: Available investigation templates

### Infrastructure (1 command)

**trinity-init.md**
- **Command**: `/trinity-init`
- **Purpose**: Complete Trinity integration
- **Category**: infrastructure
- **Content**: TAN, ZEN, INO, EIN (conditional), then JUNO audit

### Utility (3 commands)

**trinity-agents.md**
- **Command**: `/trinity-agents`
- **Purpose**: Display Trinity agent directory
- **Category**: utility
- **Content**: Agent information and invocation

**trinity-verify.md**
- **Command**: `/trinity-verify`
- **Purpose**: Verify Trinity installation
- **Category**: utility
- **Content**: Installation completeness check

**trinity-workorder.md**
- **Command**: `/trinity-workorder`
- **Purpose**: Create Trinity work orders
- **Category**: utility
- **Content**: Interactive work order creation

---

## 9. source/ Directory

Framework-specific CLAUDE.md templates for source directories.

**base-CLAUDE.md.template**
- **Framework**: Fallback for all frameworks
- **Target**: `{SOURCE_DIR}/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: Generic source directory context

**nodejs-CLAUDE.md.template**
- **Framework**: Node.js, Express
- **Target**: `{SOURCE_DIR}/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR, PACKAGE_MANAGER
- **Content**: Node.js-specific patterns, module system, async patterns

**react-CLAUDE.md.template**
- **Framework**: React, Next.js
- **Target**: `{SOURCE_DIR}/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: React patterns, component structure, hooks, state management

**flutter-CLAUDE.md.template**
- **Framework**: Flutter
- **Target**: `lib/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: Flutter/Dart patterns, widget tree, state management

**python-CLAUDE.md.template**
- **Framework**: Python, Flask
- **Target**: `{SOURCE_DIR}/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: Python patterns, PEP 8, async/await, type hints

**rust-CLAUDE.md.template**
- **Framework**: Rust
- **Target**: `src/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Content**: Rust patterns, ownership, lifetimes, error handling

---

## 10. trinity/ Directory

Trinity-specific context file.

**CLAUDE.md.template**
- **Purpose**: Trinity directory context
- **Target**: `trinity/CLAUDE.md`
- **Variables**: PROJECT_NAME, FRAMEWORK, TRINITY_VERSION
- **Content**: Trinity structure, knowledge base, session management

---

## 11. work-orders/ Directory

Work order templates for different task types.

**INVESTIGATION-TEMPLATE.md**
- **Type**: Investigation work order
- **Purpose**: Research and analysis tasks
- **Variables**: PROJECT_NAME, CURRENT_DATE
- **Sections**: Objective, scope, approach, deliverables

**IMPLEMENTATION-TEMPLATE.md**
- **Type**: Implementation work order
- **Purpose**: Feature development tasks
- **Variables**: PROJECT_NAME, FRAMEWORK, SOURCE_DIR
- **Sections**: Requirements, design, implementation plan, testing

**ANALYSIS-TEMPLATE.md**
- **Type**: Analysis work order
- **Purpose**: Code analysis and review
- **Variables**: PROJECT_NAME, SOURCE_DIR
- **Sections**: Scope, methodology, findings, recommendations

**AUDIT-TEMPLATE.md**
- **Type**: Audit work order
- **Purpose**: Quality and compliance audits
- **Variables**: PROJECT_NAME, FRAMEWORK, TODO_COUNT
- **Sections**: Audit scope, criteria, findings, action items

**PATTERN-TEMPLATE.md**
- **Type**: Pattern work order
- **Purpose**: Pattern detection and analysis
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Sections**: Pattern definition, detection criteria, examples

**VERIFICATION-TEMPLATE.md**
- **Type**: Verification work order
- **Purpose**: Verification and validation tasks
- **Variables**: PROJECT_NAME, FRAMEWORK
- **Sections**: Success criteria, test plan, verification results

---

## Variable System

### Standard Variables (Always Available)

```typescript
{
  PROJECT_NAME: string;           // Project name
  TECH_STACK: string;             // Technology stack
  FRAMEWORK: string;              // Primary framework
  SOURCE_DIR: string;             // Primary source directory
  DEPLOYMENT_TIMESTAMP: string;   // ISO 8601 timestamp
  LANGUAGE: string;               // Primary language
  PACKAGE_MANAGER: string;        // Package manager
  TRINITY_VERSION: string;        // SDK version
  TECHNOLOGY_STACK: string;       // Tech stack (alias)
  PRIMARY_FRAMEWORK: string;      // Framework (alias)
  CURRENT_DATE: string;           // YYYY-MM-DD
  PROJECT_VAR_NAME: string;       // Sanitized project name
  TRINITY_HOME: string;           // Trinity home directory
}
```

### Metrics Variables (from codebase-metrics.ts)

#### Code Quality Metrics
```typescript
{
  TODO_COUNT: number | '{{TODO_COUNT}}';           // Total TODO/FIXME/HACK
  TODO_COMMENTS: number | '{{TODO_COMMENTS}}';     // TODO comments
  FIXME_COUNT: number | '{{FIXME_COUNT}}';         // FIXME comments
  HACK_COUNT: number | '{{HACK_COUNT}}';           // HACK comments
  CONSOLE_COUNT: number | '{{CONSOLE_COUNT}}';     // Console statements
  COMMENTED_BLOCKS: number | '{{COMMENTED_BLOCKS}}'; // Commented code
}
```

#### File Complexity Metrics
```typescript
{
  TOTAL_FILES: number | '{{TOTAL_FILES}}';         // Total source files
  FILES_500: number | '{{FILES_500}}';             // Files >500 lines
  FILES_1000: number | '{{FILES_1000}}';           // Files >1000 lines
  FILES_3000: number | '{{FILES_3000}}';           // Files >3000 lines
  AVG_LENGTH: number | '{{AVG_LENGTH}}';           // Avg file length
}
```

#### Dependency Metrics
```typescript
{
  DEPENDENCY_COUNT: number | '{{DEPENDENCY_COUNT}}';       // Production deps
  DEV_DEPENDENCY_COUNT: number | '{{DEV_DEPENDENCY_COUNT}}'; // Dev deps
  FRAMEWORK_VERSION: string | '{{FRAMEWORK_VERSION}}';     // Framework version
}
```

#### Git Metrics
```typescript
{
  COMMIT_COUNT: number | '{{COMMIT_COUNT}}';       // Total commits
  CONTRIBUTOR_COUNT: number | '{{CONTRIBUTOR_COUNT}}'; // Contributors
  LAST_COMMIT: string | '{{LAST_COMMIT}}';         // Last commit date
}
```

#### Agent-Only Metrics (Always Placeholders)
```typescript
{
  OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}';        // Test coverage
  UNIT_COVERAGE: '{{UNIT_COVERAGE}}';              // Unit test coverage
  DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}';        // Deprecated APIs
  ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}';      // Anti-patterns
  PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}';        // Performance issues
  SECURITY_COUNT: '{{SECURITY_COUNT}}';            // Security issues
  COMPONENT_1: '{{COMPONENT_1}}';                  // Architecture component
  RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}';        // Component responsibility
  BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}';      // Backend framework
  DATABASE_TYPE: '{{DATABASE_TYPE}}';              // Database type
  AUTH_TYPE: '{{AUTH_TYPE}}';                      // Auth mechanism
  STYLING_SOLUTION: '{{STYLING_SOLUTION}}';        // Styling approach
}
```

### Variable Substitution

Templates use `{{VARIABLE_NAME}}` syntax:

```markdown
# {{PROJECT_NAME}} Architecture

**Framework**: {{FRAMEWORK}}
**Language**: {{LANGUAGE}}
**Source Directory**: {{SOURCE_DIR}}

## Metrics

- Total Files: {{TOTAL_FILES}}
- TODO Comments: {{TODO_COUNT}}
- Dependencies: {{DEPENDENCY_COUNT}}
```

After processing with `processTemplate()`:

```markdown
# My App Architecture

**Framework**: React
**Language**: JavaScript/TypeScript
**Source Directory**: src

## Metrics

- Total Files: 150
- TODO Comments: 12
- Dependencies: 45
```

---

## Template Processing Flow

```
1. Load template file
    ↓
2. Read template content
    ↓
3. Prepare variable map
    ↓
    - Standard variables (PROJECT_NAME, FRAMEWORK, etc.)
    - Metrics variables (if collected)
    - Framework-specific variables
    ↓
4. Process template with processTemplate()
    ↓
    - Replace {{VARIABLE}} with actual values
    - Leave {{PLACEHOLDER}} for agent-only metrics
    ↓
5. Write processed content to target location
```

Example:

```typescript
// 1. Load template
const templatePath = 'templates/knowledge-base/ARCHITECTURE.md.template';
const content = await fs.readFile(templatePath, 'utf8');

// 2. Prepare variables
const variables = {
  PROJECT_NAME: 'My App',
  FRAMEWORK: 'React',
  SOURCE_DIR: 'src',
  TOTAL_FILES: 150,
  TODO_COUNT: 12,
  DEPENDENCY_COUNT: 45
};

// 3. Process template
const processed = processTemplate(content, variables);

// 4. Write to target
await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', processed);
```

---

## Deployment Targets

### Directory Structure Created

```
project-root/
├── TRINITY.md                          # root/TRINITY.md.template
├── CLAUDE.md                           # root/CLAUDE.md.template
├── .eslintrc.json                      # linting/nodejs/.eslintrc-*.json.template
├── .prettierrc.json                    # linting/nodejs/.prettierrc.json.template
├── .pre-commit-config.yaml             # linting/{framework}/.pre-commit-config.yaml.template
├── trinity/
│   ├── VERSION                         # Version file (not from template)
│   ├── CLAUDE.md                       # trinity/CLAUDE.md.template
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md             # knowledge-base/ARCHITECTURE.md.template
│   │   ├── Trinity.md                  # knowledge-base/Trinity.md.template
│   │   ├── To-do.md                    # knowledge-base/To-do.md.template
│   │   ├── ISSUES.md                   # knowledge-base/ISSUES.md.template
│   │   ├── Technical-Debt.md           # knowledge-base/Technical-Debt.md.template
│   │   ├── CODING-PRINCIPLES.md        # knowledge-base/CODING-PRINCIPLES.md.template
│   │   ├── TESTING-PRINCIPLES.md       # knowledge-base/TESTING-PRINCIPLES.md.template
│   │   ├── AI-DEVELOPMENT-GUIDE.md     # knowledge-base/AI-DEVELOPMENT-GUIDE.md.template
│   │   └── DOCUMENTATION-CRITERIA.md   # knowledge-base/DOCUMENTATION-CRITERIA.md.template
│   ├── reports/                        # JUNO audit reports (directory only)
│   └── templates/
│       ├── INVESTIGATION-TEMPLATE.md   # work-orders/INVESTIGATION-TEMPLATE.md
│       ├── IMPLEMENTATION-TEMPLATE.md  # work-orders/IMPLEMENTATION-TEMPLATE.md
│       ├── ANALYSIS-TEMPLATE.md        # work-orders/ANALYSIS-TEMPLATE.md
│       ├── AUDIT-TEMPLATE.md           # work-orders/AUDIT-TEMPLATE.md
│       ├── PATTERN-TEMPLATE.md         # work-orders/PATTERN-TEMPLATE.md
│       ├── VERIFICATION-TEMPLATE.md    # work-orders/VERIFICATION-TEMPLATE.md
│       └── ci/
│           └── generic-ci.yml          # ci/generic-ci.yml
├── .claude/
│   ├── EMPLOYEE-DIRECTORY.md           # claude/EMPLOYEE-DIRECTORY.md.template
│   ├── agents/
│   │   ├── leadership/
│   │   │   ├── aly-cto.md              # agents/leadership/aly-cto.md.template
│   │   │   └── aj-maestro.md           # agents/leadership/aj-maestro.md.template
│   │   ├── deployment/
│   │   │   ├── tan-structure.md        # agents/deployment/tan-structure.md.template
│   │   │   ├── zen-knowledge.md        # agents/deployment/zen-knowledge.md.template
│   │   │   ├── ino-context.md          # agents/deployment/ino-context.md.template
│   │   │   └── ein-cicd.md             # agents/deployment/ein-cicd.md.template
│   │   ├── audit/
│   │   │   └── juno-auditor.md         # agents/audit/juno-auditor.md.template
│   │   ├── planning/
│   │   │   ├── mon-requirements.md     # agents/planning/mon-requirements.md.template
│   │   │   ├── ror-design.md           # agents/planning/ror-design.md.template
│   │   │   ├── tra-planner.md          # agents/planning/tra-planner.md.template
│   │   │   └── eus-decomposer.md       # agents/planning/eus-decomposer.md.template
│   │   └── aj-team/
│   │       ├── kil-task-executor.md    # agents/aj-team/kil-task-executor.md.template
│   │       ├── bas-quality-gate.md     # agents/aj-team/bas-quality-gate.md.template
│   │       ├── dra-code-reviewer.md    # agents/aj-team/dra-code-reviewer.md.template
│   │       ├── apo-documentation-specialist.md
│   │       ├── bon-dependency-manager.md
│   │       ├── cap-configuration-specialist.md
│   │       └── uro-refactoring-specialist.md
│   └── commands/
│       ├── session/
│       │   ├── trinity-start.md
│       │   ├── trinity-continue.md
│       │   └── trinity-end.md
│       ├── planning/
│       │   ├── trinity-requirements.md
│       │   ├── trinity-design.md
│       │   ├── trinity-decompose.md
│       │   └── trinity-plan.md
│       ├── execution/
│       │   └── trinity-orchestrate.md
│       ├── investigation/
│       │   ├── trinity-create-investigation.md
│       │   ├── trinity-plan-investigation.md
│       │   └── trinity-investigate-templates.md
│       ├── infrastructure/
│       │   └── trinity-init.md
│       └── utility/
│           ├── trinity-agents.md
│           ├── trinity-verify.md
│           └── trinity-workorder.md
├── src/CLAUDE.md                       # source/react-CLAUDE.md.template (or framework-specific)
└── .github/workflows/                  # (Optional) CI/CD
    └── trinity-ci.yml                  # ci/github-actions.yml
```

---

## Adding New Templates

### 1. Create Template File

```bash
# Navigate to appropriate directory
cd src/templates/knowledge-base

# Create template with .template extension
touch NEW-DOCUMENT.md.template
```

### 2. Add Template Variables

```markdown
# {{PROJECT_NAME}} New Document

**Framework**: {{FRAMEWORK}}
**Created**: {{CURRENT_DATE}}

## Overview

This is a new template for {{PROJECT_NAME}}.

### Metrics

- Total Files: {{TOTAL_FILES}}
- TODO Count: {{TODO_COUNT}}
```

### 3. Update Deployment Logic

```typescript
// In deploy.ts
const newDocTemplate = path.join(templatesPath, 'knowledge-base', 'NEW-DOCUMENT.md.template');
if (await fs.pathExists(newDocTemplate)) {
  const content = await fs.readFile(newDocTemplate, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile('trinity/knowledge-base/NEW-DOCUMENT.md', processed);
  deploymentStats.files++;
}
```

### 4. Test Template

```bash
# Run deployment
npx trinity deploy --force

# Verify file created
cat trinity/knowledge-base/NEW-DOCUMENT.md
```

---

## Best Practices

### 1. Use Descriptive Variable Names

```markdown
<!-- ✅ Good -->
**Project**: {{PROJECT_NAME}}
**Framework**: {{FRAMEWORK}}

<!-- ❌ Bad -->
**Project**: {{NAME}}
**Framework**: {{FW}}
```

### 2. Provide Fallback Content

```markdown
<!-- ✅ Good - works with or without metrics -->
- Total Files: {{TOTAL_FILES}}
- TODO Count: {{TODO_COUNT}}

<!-- ❌ Bad - breaks if metrics unavailable -->
- Technical Debt: {{TODO_COUNT}} / {{TOTAL_FILES}} = {{DEBT_RATIO}}%
```

### 3. Use Placeholders for Agent-Only Metrics

```markdown
<!-- ✅ Good - agent fills this later -->
**Test Coverage**: {{OVERALL_COVERAGE}}

<!-- ❌ Bad - will show as 0 or undefined -->
**Test Coverage**: {{TOTAL_COVERAGE}}
```

### 4. Keep Templates Framework-Agnostic When Possible

```markdown
<!-- ✅ Good - works for all frameworks -->
**Framework**: {{FRAMEWORK}}
**Source Directory**: {{SOURCE_DIR}}

<!-- ❌ Bad - React-specific -->
**Framework**: React
**Source Directory**: src
```

### 5. Document Template Purpose

```markdown
<!--
Template: knowledge-base/ARCHITECTURE.md.template
Purpose: System architecture documentation
Variables: PROJECT_NAME, FRAMEWORK, SOURCE_DIR, TOTAL_FILES, TODO_COUNT, DEPENDENCY_COUNT
Target: trinity/knowledge-base/ARCHITECTURE.md
-->

# {{PROJECT_NAME}} Architecture
```

---

## Troubleshooting

### Template Not Found

**Problem**: Template file not found during deployment

```typescript
// Solution: Check file path and extension
const templatePath = path.join(templatesPath, 'knowledge-base', 'ARCHITECTURE.md.template');
console.log('Template path:', templatePath);
console.log('Exists:', await fs.pathExists(templatePath));
```

### Variables Not Replaced

**Problem**: Variables show as `{{VARIABLE}}` in output

```typescript
// Solution: Ensure variable is in variables map
const variables = {
  PROJECT_NAME: projectName,
  FRAMEWORK: stack.framework,
  // Add missing variable
  CUSTOM_VAR: 'value'
};
```

### Wrong Template Selected

**Problem**: Wrong framework template deployed

```typescript
// Solution: Check framework mapping
const frameworkMap: Record<string, string> = {
  'Node.js': 'nodejs-CLAUDE.md.template',
  'React': 'react-CLAUDE.md.template',
  'Flutter': 'flutter-CLAUDE.md.template'
};

const templateName = frameworkMap[stack.framework] || 'base-CLAUDE.md.template';
```

---

## Related Documentation

- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\commands\README.md](../cli/commands/README.md) - Commands using templates
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\utils\README.md](../cli/utils/README.md) - Template processing utilities
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\shared\types\README.md](../shared/types/README.md) - Type definitions
