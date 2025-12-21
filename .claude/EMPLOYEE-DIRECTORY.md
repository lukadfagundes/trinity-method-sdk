# Trinity Method - Employee Directory

**Project:** Trinity Method SDK
**Framework:** Node.js
**Trinity Version:** 1.0.0
**Last Updated:** 2025-12-21T00:12:26.627Z

---

## 👥 LEADERSHIP TEAM

### ALY (Chief Technology Officer)

**File:** [.claude/agents/leadership/aly-cto.md](.claude/agents/leadership/aly-cto.md)
**Role:** Strategic leadership, scale determination, and AJ MAESTRO coordination
**Specialization:** Trinity Method v2.0 architecture, scale-based workflows, stop point management

**When to Deploy:**

- All implementation requests (ALY determines scale)
- Complex architectural decisions
- Medium/Large scale projects (stop point reviews)
- Strategic refactoring initiatives

**To invoke ALY:**

- Reference: "Please review `.claude/agents/leadership/aly-cto.md` for strategic guidance"
- ALY determines scale (Small/Medium/Large) and coordinates AJ MAESTRO for implementation

---

### AJ MAESTRO (Implementation Orchestrator)

**File:** [.claude/agents/leadership/aj-maestro.md](.claude/agents/leadership/aj-maestro.md)
**Role:** Implementation coordination using 19-agent team (organized in 5 role-based subdirectories)
**Specialization:** Planning layer, execution layer, support layer coordination

**Agent Organization:**

- **Leadership:** ALY, AJ MAESTRO, AJ CC (3 agents)
- **Deployment:** TAN, ZEN, INO, EIN (4 agents)
- **Planning:** MON, ROR, TRA, EUS (4 agents)
- **Implementation:** KIL, BAS, DRA, APO, BON, CAP, URO (7 agents)
- **Audit:** JUNO (1 agent)

**When to Deploy:**

- All implementation tasks (Small/Medium/Large)
- Coordinating planning agents (MON, ROR, TRA, EUS)
- Managing execution agents (KIL, BAS, DRA)
- Orchestrating support agents (APO, BON, CAP, URO)

**To invoke AJ MAESTRO:**

- Reference: "Please review `.claude/agents/leadership/aj-maestro.md` to orchestrate implementation"
- AJ MAESTRO coordinates all specialized agents based on scale-determined workflow

---

### AJ CC (Code Coordinator)

**File:** [.claude/agents/leadership/aj-cc.md](.claude/agents/leadership/aj-cc.md)
**Role:** Code quality and implementation oversight
**Specialization:** Tactical implementation coordination

---

## 🚀 DEPLOYMENT TEAM (4 Specialists)

### TAN (Structure Specialist)

**File:** [.claude/agents/deployment/tan-structure.md](.claude/agents/deployment/tan-structure.md)
**Role:** Creates Trinity folder structure and technical debt baseline
**Specialization:** Directory structures, baseline metrics, file organization

**When to Deploy:**

- Creating new Trinity structures
- Initial technical debt baseline
- Structure verification

**To invoke TAN:**

- Reference: "Please review `.claude/agents/deployment/tan-structure.md` for structure tasks"
- TAN creates Trinity folder structures and establishes technical debt baselines

---

### ZEN (Knowledge Base Specialist)

**File:** [.claude/agents/deployment/zen-knowledge.md](.claude/agents/deployment/zen-knowledge.md)
**Role:** Maintains and enriches Trinity knowledge base documentation
**Specialization:** Documentation quality, semantic codebase analysis

**When to Deploy:**

- Completing ARCHITECTURE.md with semantic analysis
- Documentation updates and improvements
- Pattern documentation
- **Recommended after initial deployment to complete metrics**

**To invoke ZEN:**

- Reference: "Please review `.claude/agents/deployment/zen-knowledge.md` to complete ARCHITECTURE.md and Technical-Debt.md with full semantic analysis"
- ZEN maintains and enriches Trinity knowledge base documentation

---

### INO (Context Specialist)

**File:** [.claude/agents/deployment/ino-context.md](.claude/agents/deployment/ino-context.md)
**Role:** Creates and maintains CLAUDE.md context hierarchy
**Specialization:** Context file creation, behavioral requirements

**When to Deploy:**

- Updating project context documentation
- Defining AI agent behavioral requirements
- Context hierarchy maintenance

**To invoke INO:**

- Reference: "Please review `.claude/agents/deployment/ino-context.md` for context updates"
- INO creates and maintains CLAUDE.md context hierarchy and behavioral requirements

---

### Ein (CI/CD Specialist)

**File:** [.claude/agents/deployment/ein-cicd.md](.claude/agents/deployment/ein-cicd.md)
**Role:** Continuous Integration/Continuous Deployment automation and optimization
**Specialization:** GitHub Actions, GitLab CI, coverage providers, badge generation, workflow optimization

**When to Deploy:**

- Customizing CI/CD workflows beyond defaults
- Setting up coverage providers (Codecov/Coveralls)
- Injecting status badges into README
- Troubleshooting CI/CD pipeline failures
- Optimizing workflow execution time
- **Recommended after basic CI/CD deployment**

**To invoke Ein:**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to customize CI/CD for [specific needs]"
- Ein specializes in CI/CD automation, coverage providers, and workflow optimization

---

## 🔍 AUDIT TEAM

### JUNO (Quality Auditor)

**File:** [.claude/agents/audit/juno-auditor.md](.claude/agents/audit/juno-auditor.md)
**Role:** Comprehensive code quality and Trinity deployment audits (DRA compliance validation)
**Specialization:** Quality assurance, security audits, performance analysis, v2.0 deployment verification

**When to Deploy:**

- Trinity v2.0 deployment verification
- Code quality audits (DRA standards)
- Security vulnerability scans
- Performance bottleneck identification
- Large scale stop point #4 (final review)

**To invoke JUNO:**

- Reference: "Please review `.claude/agents/audit/juno-auditor.md` to audit Trinity Method deployment and code quality"
- JUNO performs comprehensive audits using DRA compliance standards (≥70% acceptance criteria)

---

## 🎯 PLANNING LAYER (4 Agents - MON, ROR, TRA, EUS)

### MON (Requirements Analyst)

**File:** [.claude/agents/planning/mon-requirements.md](.claude/agents/planning/mon-requirements.md)
**Role:** Requirements analysis, scale determination, acceptance criteria definition
**Specialization:** Given-When-Then criteria, risk assessment, testability

**When to Deploy:**

- Large scale projects (stop point #1: requirements review)
- Complex requirements analysis
- Acceptance criteria definition

**To invoke MON:**

- Use `/trinity-requirements` slash command
- AJ MAESTRO invokes MON automatically for Medium/Large scale projects

---

### ROR (Design Architect)

**File:** [.claude/agents/planning/ror-design.md](.claude/agents/planning/ror-design.md)
**Role:** Technical design, ADRs, Design Doc creation
**Specialization:** Function signatures (≤2 params), error handling, DRA compliance

**When to Deploy:**

- Medium/Large scale projects (stop point #2: design approval)
- Architecture decisions
- Design Doc creation

**To invoke ROR:**

- Use `/trinity-design` slash command
- AJ MAESTRO invokes ROR automatically for Medium/Large scale projects

---

### TRA (Work Planner)

**File:** [.claude/agents/planning/tra-planner.md](.claude/agents/planning/tra-planner.md)
**Role:** Implementation sequencing, BAS quality gates, timeline estimation
**Specialization:** Task ordering, dependency resolution, 6-phase quality gates

**When to Deploy:**

- Large scale projects (stop point #3: plan approval)
- Complex task sequencing
- Timeline estimation

**To invoke TRA:**

- Use `/trinity-plan` slash command
- AJ MAESTRO invokes TRA automatically for all scale projects

---

### EUS (Task Decomposer)

**File:** [.claude/agents/planning/eus-decomposer.md](.claude/agents/planning/eus-decomposer.md)
**Role:** Atomic task breakdown, commit planning, TDD enforcement
**Specialization:** 1 task = 1 commit rule, RED-GREEN-REFACTOR, Conventional Commits

**When to Deploy:**

- All scale projects (atomic task breakdown)
- TDD cycle planning
- Commit message generation

**To invoke EUS:**

- Use `/trinity-decompose` slash command
- AJ MAESTRO invokes EUS automatically for all scale projects

---

## ⚙️ EXECUTION LAYER (3 Agents - KIL, BAS, DRA)

### KIL (Task Executor)

**File:** [.claude/agents/aj-team/kil-task-executor.md](.claude/agents/aj-team/kil-task-executor.md)
**Role:** TDD implementation, code execution, commit creation
**Specialization:** RED-GREEN-REFACTOR cycle, atomic commits, test-first development

**When to Deploy:**

- All implementation tasks (invoked by AJ MAESTRO)
- TDD cycle execution
- Code writing and testing

**To invoke KIL:**

- AJ MAESTRO invokes KIL automatically
- Direct invocation for specific TDD tasks

---

### BAS (Quality Gate)

**File:** [.claude/agents/aj-team/bas-quality-gate.md](.claude/agents/aj-team/bas-quality-gate.md)
**Role:** 6-phase quality gate enforcement
**Specialization:** Linting, building, testing, coverage (≥80%), best practices

**When to Deploy:**

- After every KIL commit (automatic)
- CI/CD pipeline integration
- Quality validation

**To invoke BAS:**

- AJ MAESTRO invokes BAS automatically after each commit
- Manual invocation for quality checks

**6 Phases:**

1. Linting (ESLint/Prettier auto-fix)
2. Structure validation
3. Build validation (TypeScript)
4. Testing (all tests pass)
5. Coverage check (≥80%)
6. Final review (best practices)

---

### DRA (Code Reviewer)

**File:** [.claude/agents/aj-team/dra-code-reviewer.md](.claude/agents/aj-team/dra-code-reviewer.md)
**Role:** Code review, Design Doc compliance validation
**Specialization:** ≥70% acceptance criteria, function complexity, error handling

**When to Deploy:**

- After implementation complete (stop points)
- Design Doc compliance check
- Final code review

**To invoke DRA:**

- AJ MAESTRO invokes DRA at stop points
- Manual invocation for code reviews

**DRA Standards:**

- Functions ≤2 parameters
- Function length <200 lines
- Nesting depth ≤4 levels
- Try-catch wraps async
- ≥70% acceptance criteria met

---

## 🛠️ SUPPORT LAYER (4 Agents - APO, BON, CAP, URO)

### APO (Documentation Specialist)

**File:** [.claude/agents/aj-team/apo-documentation-specialist.md](.claude/agents/aj-team/apo-documentation-specialist.md)
**Role:** API documentation, JSDoc generation, README maintenance
**Specialization:** OpenAPI specs, TSDoc, inline documentation

**When to Deploy:**

- API documentation updates
- JSDoc/TSDoc generation
- README maintenance

**To invoke APO:**

- AJ MAESTRO invokes APO for documentation tasks
- Manual invocation for doc updates

---

### BON (Dependency Manager)

**File:** [.claude/agents/aj-team/bon-dependency-manager.md](.claude/agents/aj-team/bon-dependency-manager.md)
**Role:** Dependency updates, security patches, version management
**Specialization:** npm/pip/cargo updates, vulnerability scanning, lockfile management

**When to Deploy:**

- Dependency updates
- Security patch application
- Version conflict resolution

**To invoke BON:**

- AJ MAESTRO invokes BON for dependency tasks
- Manual invocation for updates

---

### CAP (Configuration Specialist)

**File:** [.claude/agents/aj-team/cap-configuration-specialist.md](.claude/agents/aj-team/cap-configuration-specialist.md)
**Role:** Configuration file management, environment setup
**Specialization:** tsconfig.json, .env, CI/CD configs, linting configs

**When to Deploy:**

- Configuration updates
- Environment variable management
- Build configuration changes

**To invoke CAP:**

- AJ MAESTRO invokes CAP for config tasks
- Manual invocation for config updates

---

### URO (Refactoring Specialist)

**File:** [.claude/agents/aj-team/uro-refactoring-specialist.md](.claude/agents/aj-team/uro-refactoring-specialist.md)
**Role:** Code refactoring, technical debt reduction, DRY enforcement
**Specialization:** Extract functions, reduce complexity, eliminate duplication

**When to Deploy:**

- Code refactoring tasks
- Technical debt reduction
- Complexity reduction

**To invoke URO:**

- AJ MAESTRO invokes URO for refactoring tasks
- Manual invocation for code cleanup

---

## 📋 DEPLOYMENT WORKFLOWS

### Initial Project Setup (Recommended)

**1. Deploy Trinity Method:**

```bash
npx @trinity-method/cli deploy
```

**2. Complete knowledge base (optional but recommended):**

- Reference: "Please review `.claude/agents/deployment/zen-knowledge.md` to complete ARCHITECTURE.md and Technical-Debt.md with full codebase analysis"

**3. Verify deployment quality:**

- Reference: "Please review `.claude/agents/audit/juno-auditor.md` to audit Trinity Method deployment"

### Fast Deployment (Minimal)

**Deploy without metrics:**

```bash
npx @trinity-method/cli deploy --skip-audit
```

**Complete manually when needed:**

- Reference: "Please review `.claude/agents/deployment/zen-knowledge.md` for knowledge base completion"

### Starting a New Feature

**1. Investigation phase (Aly):**

- Reference: "Please review `.claude/agents/leadership/aly-cto.md` to investigate [feature name] and create work order"

**2. Implementation phase (AJ):**

- Reference: "Please review `.claude/agents/leadership/aj-cc.md` to implement work order WO-XXX-[feature-name]"

**3. Quality review (JUNO):**

- Reference: "Please review `.claude/agents/audit/juno-auditor.md` to review implementation of WO-XXX"

### Bug Investigation

**1. Investigate root cause (Aly):**

- Reference: "Please review `.claude/agents/leadership/aly-cto.md` to investigate bug: [description]"

**2. Implement fix (AJ):**

- Reference: "Please review `.claude/agents/leadership/aj-cc.md` to fix bug per investigation findings"

### Documentation Updates

**Update architecture docs (ZEN):**

- Reference: "Please review `.claude/agents/deployment/zen-knowledge.md` to update ARCHITECTURE.md with recent changes"

**Update context files (INO):**

- Reference: "Please review `.claude/agents/deployment/ino-context.md` to update CLAUDE.md hierarchy with new patterns"

### CI/CD Customization (After Basic Deployment)

**1. Deploy Trinity Method:**

```bash
npx @trinity-method/cli deploy --ci-deploy
```

**2. Customize CI/CD (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to set up Codecov coverage reporting and inject badges to README"

**3. Verify CI/CD setup (JUNO):**

- Reference: "Please review `.claude/agents/audit/juno-auditor.md` to audit CI/CD configuration and workflows"

### Coverage Provider Setup

**Codecov setup with badges (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to configure Codecov with badge injection to README and add CODECOV_TOKEN setup instructions"

**Switch to Coveralls (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to switch from Codecov to Coveralls coverage provider"

**Use both providers (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to configure both Codecov and Coveralls coverage reporting"

### Workflow Optimization

**Optimize for speed (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to optimize my CI/CD workflow to reduce execution time below 5 minutes"

**Add deployment automation (Ein):**

- Reference: "Please review `.claude/agents/deployment/ein-cicd.md` to add automated deployment to staging on merge to develop branch"

---

## 🎯 QUICK REFERENCE

### v2.0 Agents (18 Total)

| Need                     | Agent      | Layer      | Slash Command           |
| ------------------------ | ---------- | ---------- | ----------------------- |
| **Scale Determination**  | ALY        | Leadership | N/A (always first)      |
| **AI Orchestration**     | AJ MAESTRO | Leadership | `/trinity-orchestrate`  |
| **Requirements**         | MON        | Planning   | `/trinity-requirements` |
| **Technical Design**     | ROR        | Planning   | `/trinity-design`       |
| **Work Planning**        | TRA        | Planning   | `/trinity-plan`         |
| **Task Decomposition**   | EUS        | Planning   | `/trinity-decompose`    |
| **TDD Implementation**   | KIL        | Execution  | Auto (via MAESTRO)      |
| **Quality Gates**        | BAS        | Execution  | Auto (via MAESTRO)      |
| **Code Review**          | DRA        | Execution  | Auto (via MAESTRO)      |
| **API Documentation**    | APO        | Support    | Auto (via MAESTRO)      |
| **Dependencies**         | BON        | Support    | Auto (via MAESTRO)      |
| **Configuration**        | CAP        | Support    | Auto (via MAESTRO)      |
| **Refactoring**          | URO        | Support    | Auto (via MAESTRO)      |
| **Deployment Structure** | TAN        | Deployment | N/A (initial setup)     |
| **Knowledge Base**       | ZEN        | Deployment | N/A (doc updates)       |
| **Context Management**   | INO        | Deployment | N/A (CLAUDE.md)         |
| **CI/CD**                | Ein        | Deployment | N/A (CI/CD setup)       |
| **Quality Audits**       | JUNO       | Audit      | N/A (final review)      |

### v1.0 Legacy Agent

| Need                        | Agent            | Team       | Status             |
| --------------------------- | ---------------- | ---------- | ------------------ |
| Single-Agent Implementation | AJ (Claude Code) | Leadership | Deprecated in v2.0 |

---

## 📚 ADDITIONAL RESOURCES

### Trinity Method Documentation

- [Trinity Methodology](../trinity/knowledge-base/Trinity.md)
- [Project Architecture](../trinity/knowledge-base/ARCHITECTURE.md)
- [Current Tasks](../trinity/knowledge-base/To-do.md)
- [Known Issues](../trinity/knowledge-base/ISSUES.md)
- [Technical Debt](../trinity/knowledge-base/Technical-Debt.md)

### Work Order Templates

Located in `trinity/templates/work-orders/`:

- INVESTIGATION-TEMPLATE.md
- IMPLEMENTATION-TEMPLATE.md
- ANALYSIS-TEMPLATE.md
- AUDIT-TEMPLATE.md
- PATTERN-TEMPLATE.md
- VERIFICATION-TEMPLATE.md

### Investigation Templates

Located in `trinity/templates/investigations/`:

- bug.md - Bug investigation with Five Whys analysis
- feature.md - Feature analysis with epic breakdown
- technical.md - Technical investigation with ADR format
- performance.md - Performance baselines with p50/p95/p99
- security.md - Security investigation with CVSS 3.1 scoring

---

## 🧹 CODE QUALITY TOOLS

### Linting and Formatting

Trinity Method SDK can optionally configure linting tools during deployment.

**Available Tools:**

| Framework     | Tools Available                        |
| ------------- | -------------------------------------- |
| Node.js/React | ESLint, Prettier, Pre-commit hooks     |
| Python        | Black, Flake8, isort, Pre-commit hooks |
| Flutter       | Dart Analyzer, Pre-commit hooks        |
| Rust          | Clippy, Rustfmt, Pre-commit hooks      |

**To setup during deployment:**

```bash
npx @trinity-method/cli deploy
# Select "Recommended" or "Custom" when prompted
```

**After deployment:**

1. Install dependencies: `npm install` (or `pip install -r requirements-dev.txt`)
2. Setup hooks: `pip install pre-commit && pre-commit install`
3. Test: `npm run lint` (or equivalent for your framework)

**Pre-commit Hooks:**
Trinity uses Python's `pre-commit` framework for ALL project types (Node.js, Python, Rust, Flutter). This ensures consistent quality checks across all frameworks.

**First-time setup:**

```bash
# Install pre-commit (one-time global install)
pip install pre-commit

# In your project directory
pre-commit install
```

**How it works:**

- Runs linters/formatters before each git commit
- Prevents committing code that fails quality checks
- Configured via `.pre-commit-config.yaml`

---

## Related Documentation

**Trinity Method Context Files**:

- [../CLAUDE.md](../CLAUDE.md) - Project overview and global requirements
- [../trinity/CLAUDE.md](../trinity/CLAUDE.md) - Trinity Method enforcement and protocols
- [../src/CLAUDE.md](../src/CLAUDE.md) - Framework-specific implementation rules

**Knowledge Base**:

- [Investigation Protocols](../trinity/CLAUDE.md#investigation-protocols) - Investigation-first methodology
- [Quality Gates](../trinity/CLAUDE.md#quality-standards) - BAS 6-phase quality gates
- [Crisis Management](../trinity/CLAUDE.md#crisis-management) - Emergency escalation protocols

---

**Trinity Method 1.0.0**
**Deployed:** 2025-12-21T00:12:26.627Z
