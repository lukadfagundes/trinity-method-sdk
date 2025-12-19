# Trinity Method SDK - TODO List

## CLI Command Optimization

### ✅ COMPLETE: `update` Command

**File:** `src/cli/commands/update.ts`

**Status:** **COMPLETED** - Option A (Full Implementation) + Comprehensive Tests

**What Was Accomplished:**
- ✅ Complete 12-step update process with progress indicators
- ✅ Full agent update logic (18 agents across 5 subdirectories)
- ✅ Slash command updates (16 commands with categorization)
- ✅ Work order template updates (6 templates)
- ✅ SDK-managed knowledge base updates (5 files)
- ✅ User file preservation (ARCHITECTURE.md, To-do.md, ISSUES.md, Technical-Debt.md)
- ✅ Automatic rollback mechanism on failure
- ✅ 7-point verification system
- ✅ Functional dry-run preview mode
- ✅ Complete error handling with backup preservation
- ✅ ESM/CommonJS compatibility for both runtime and tests

**Test Coverage:**
- ✅ 15 integration tests (100% pass rate)
- ✅ Pre-flight checks, version detection, dry-run mode
- ✅ Backup/restore, structure verification, user file preservation
- ✅ Error handling with process.exit mocking
- ✅ Test infrastructure: helpers, mocks (ora, chalk, inquirer)
- ✅ Jest configuration with CommonJS support
- ✅ SDK path auto-detection for test and production environments

**Files Created:**
- `tests/helpers/test-helpers.ts` (161 lines)
- `tests/integration/cli/commands/update.test.ts` (270+ lines, 15 tests)
- `tests/__mocks__/ora.ts`, `chalk.ts`, `inquirer.ts`
- `src/cli/utils/get-sdk-path.ts` (path resolution helper)
- `jest.config.js`, `tsconfig.test.json`

**Completed:** 2025-12-18

---

## Slash Command Integration

### ✅ COMPLETE: Integrate EIN Agent into `/trinity-init` Command + CI/CD Templates

**File:** `src/templates/shared/claude-commands/trinity-init.md`

**Status:** **COMPLETED** - EIN integrated as conditional Phase 5 with template support

**What Was Accomplished:**
- ✅ Created EIN-ready GitHub Actions template with BAS 6-phase quality gates
  - `src/templates/ci/github-actions-trinity.yml.template`
  - All 6 BAS phases: Linting, Structure, Build, Testing, Coverage (≥80%), Best Practices
  - Triggers: push to main/dev, all pull requests
  - Node.js 20.x, Codecov integration, quality summary
- ✅ Updated pre-commit configuration template for EIN
  - `src/templates/linting/nodejs/.pre-commit-config.yaml.template`
  - ESLint with auto-fix, TypeScript type checking
  - Pre-commit framework hooks (trailing whitespace, YAML/JSON validation, detect private keys)
  - Jest for changed files
- ✅ Integrated EIN as Phase 5 in `/trinity-init` workflow
  - Conditional invocation: Only if `.github/workflows/trinity-ci.yml` or `.pre-commit-config.yaml` exists
  - Detection logic documented
  - EIN responsibilities defined
  - Installation instructions included
  - Fallback: User can invoke `/trinity-cicd` manually later
- ✅ Build successful - all templates compile correctly

**Implementation Details:**
- **Conditional Logic:** EIN only runs if CI/CD or pre-commit templates were deployed during `trinity deploy`
- **EIN Responsibilities:**
  1. Configure GitHub Actions with BAS 6-phase gates
  2. Set up pre-commit hooks with ESLint, TypeScript, and Jest
  3. Provide installation instructions to user
  4. Validate coverage threshold (≥80%)
- **Workflow:** TAN → ZEN → INO → JUNO → EIN (conditional)

**Files Modified/Created:**
- Created: `src/templates/ci/github-actions-trinity.yml.template` (201 lines)
- Updated: `src/templates/linting/nodejs/.pre-commit-config.yaml.template` (52 lines)
- Updated: `src/templates/shared/claude-commands/trinity-init.md` (added Phase 5 section)
- Optimized: `src/templates/agents/deployment/ein-cicd.md.template` (added missing step IDs)

**EIN Optimization:**
- ✅ Fixed missing `id:` parameters in GitHub Actions workflow template (lines 92, 102, 127, 137, 147, 177)
- ✅ Added `id: lint`, `id: structure`, `id: build`, `id: tests`, `id: coverage`, `id: practices`
- ✅ Ensures Trinity Quality Summary step can reference `${{ steps.*.outcome }}`
- ✅ Build successful after optimization

**Post-Test-Run Fixes (2025-12-18):**
- ✅ **Fixed EIN Invocation in `/trinity-init`**
  - Issue: EIN was never called despite CI/CD files being deployed
  - Added mandatory file detection step with explicit Bash commands
  - Made instructions clearer: "Check for files THEN invoke EIN"
  - Updated EIN output format to be framework-agnostic
  - Added requirement to include EIN phase in JUNO audit report
- ✅ **Fixed Framework Misdetection**
  - Issue: Flutter project detected as Node.js due to package.json from Trinity SDK
  - Reordered detection logic: Check Flutter/Rust/Go BEFORE package.json
  - Prevents false positives when Trinity SDK creates package.json
  - New detection order: Flutter → Rust → Go → Node.js → Python
- ✅ **Renamed Workflows to Standard Conventions + Added CD Pipeline**
  - Issue: Workflow named `trinity-ci.yml` (non-standard), missing CD pipeline entirely
  - Renamed: `github-actions-trinity.yml.template` → `ci.yml.template`
  - Created: `cd.yml.template` (staging/production deployment with approval gates)
  - Updated all references across codebase (7+ files)
  - CI workflow: Quality gates for all commits/PRs
  - CD workflow: Automatic staging deployment, approval-gated production deployment
  - Updated deploy-ci.ts to deploy both ci.yml and cd.yml
  - Updated /trinity-init detection to check for both workflows
  - Updated EIN agent template with CD workflow documentation
- ✅ **Clarified EIN's Role: Review & Customize (Not Create from Scratch)**
  - Issue: EIN's responsibilities were unclear - should it create or review templates?
  - Added "Two Invocation Contexts" section to EIN agent template
  - Context 1: `/trinity-init` → Review & customize already-deployed templates
  - Context 2: Manual invocation → Create workflows from scratch
  - Updated /trinity-init to emphasize templates are ALREADY DEPLOYED
  - EIN now clearly reads, verifies, customizes, and validates existing files
  - Updated output format to show "Reviewed & Customized" status
  - Emphasized activation instructions (commit, push, setup environments)
- ✅ **Added `trinity/reports/` Directory to Deployment**
  - Issue: JUNO creates audit reports in trinity/reports/ but directory wasn't deployed
  - Added `trinity/reports/` to deploy.ts directory creation (line 342)
  - Updated directory count from 11 → 12
  - Updated templates/README.md deployment structure documentation
  - Prevents JUNO from needing to create directory during initialization
  - Verified: TAN and JUNO templates already expected this directory
- ✅ Build successful after all fixes

**Completed:** 2025-12-18

---

### ⚠️ TODO: Overhaul `/trinity-orchestrate` Slash Command

**File:** `.claude/commands/trinity-orchestrate.md`

**Current Status:** Promises automation but workflow is actually manual

**Issue:**
- Command describes vision rather than current capability
- Presents AJ MAESTRO orchestration as automated when it's conceptual
- Stop points not implemented as system feature
- Quality gates (BAS) referenced as automated but are manual checkpoints
- Users may expect automatic workflow execution

**What Needs to Change:**
1. **Reframe as Planning Guide** - Not automated execution
2. **Clarify Persona Adoption** - Claude sequentially adopts agent personas, not parallel AI systems
3. **Set Correct Expectations** - Manual workflow with user approval at each phase
4. **Document Scale-Based Workflows** - Small/Medium/Large with clear manual steps

**Recommended Approach:**

**From (Current):**
```markdown
AJ MAESTRO orchestrates the 11-agent team automatically...
```

**To (Proposed):**
```markdown
Claude will guide you through a multi-phase workflow, sequentially adopting different agent personas for each phase:
- Small (1-2 files): Direct implementation with KIL persona
- Medium (3-5 files): ROR design → KIL + BAS validation → DRA review
- Large (6+ files): Full MON → ROR → TRA → EUS → KIL workflow with manual checkpoints
```

**Key Changes:**
- Emphasize "planning guide" not "automation"
- Explain persona adoption model clearly
- Define manual checkpoints explicitly
- Provide workflow visualization (Mermaid diagram)
- Add examples of each scale workflow

**Implementation Tasks:**
- [ ] Rewrite command intro to set correct expectations
- [ ] Add persona adoption explanation
- [ ] Define manual checkpoints for Small/Medium/Large scales
- [ ] Add Mermaid workflow diagrams for each scale
- [ ] Provide example workflow walkthroughs
- [ ] Update slash-commands-analysis.md with new classification
- [ ] Test command with real task to verify clarity

**Priority:** MEDIUM
**Effort:** 2-3 hours
**Assigned To:** TBD
**Due Date:** TBD

---

## Slash Command Optimization

### ⚠️ TODO: Optimize Remaining Slash Commands (13 commands)

**Files:** `src/templates/shared/claude-commands/trinity-*.md`

**Current Status:** Commands need persona adoption clarification and improvements

**Commands to Optimize:**

#### Session Management (3 commands)
1. **`trinity-continue.md`** - Add empty state handling, example session summary, clarify ALY persona adoption
2. **`trinity-end.md`** - Add file movement validation, concrete knowledge base update examples, clarify ALY persona
3. **`trinity-start.md`** - Update to reference all 18 agents (currently lists 7), add routing decision tree, brief agent descriptions

#### Workflow Commands (6 commands - Clarify Persona Adoption)
4. **`trinity-agents.md`** - Add persona adoption explanation, improve output formatting, agent capability summary
5. **`trinity-decompose.md`** - Clarify Claude adopts EUS persona, add JSON schema validation, explain TRA handoff
6. **`trinity-design.md`** - Clarify Claude adopts ROR persona, complete JSON schema, explain parameter constraints
7. **`trinity-init.md`** - Clarify 4-agent persona adoption (TAN → ZEN → INO → JUNO), concrete step instructions, define JUNO audit criteria
8. **`trinity-plan.md`** - Clarify Claude adopts TRA persona, explain BAS gates are manual checkpoints, define ROR handoff format
9. **`trinity-requirements.md`** - Clarify Claude adopts MON persona, specific scale criteria (file count thresholds), risk assessment checklist

#### Investigation Commands (2 commands)
10. **`trinity-create-investigation.md`** - Clarify wizard flow, add file creation validation, provide example investigation structure
11. **`trinity-plan-investigation.md`** - Clarify AI-powered planning approach, add Mermaid diagram examples, define plan output format

#### Utility Commands (2 commands)
12. **`trinity-verify.md`** - Update agent count to 18 (currently says 7), add content quality verification, define clear success criteria
13. **`trinity-workorder.md`** - Add auto-numbering logic (scan directory for WO-XXX), file creation validation, provide example

**Key Pattern Across All Optimizations:**
- **Persona Adoption Clarity**: Change "MON analyzes..." to "Claude (as MON) will analyze..."
- **Set Correct Expectations**: Emphasize manual workflow, not automation
- **Provide Examples**: Add concrete examples of outputs, formats, and workflows
- **Validation**: Add file creation confirmation, path verification, content checks

**Implementation Tasks:**
- [ ] Session Management: trinity-continue, trinity-end, trinity-start
- [ ] Workflow: trinity-agents, trinity-decompose, trinity-design, trinity-init, trinity-plan, trinity-requirements
- [ ] Investigation: trinity-create-investigation, trinity-plan-investigation
- [ ] Utility: trinity-verify, trinity-workorder
- [ ] Test all updated commands for clarity
- [ ] Update slash-commands-analysis.md with optimization status

**Priority:** HIGH
**Effort:** 5-7 hours total (20-30 min per command)
**Assigned To:** TBD
**Due Date:** TBD

---

## Testing Infrastructure

### ⚠️ TODO: Implement Test Coverage for Remaining CLI Commands

**Current Status:** Update command tests completed (15 tests passing)

**Issue:**
- Previous tests were for deleted systems (analytics, benchmarks, cache, learning, coordination, agents, wizard)
- Only 1 of 2 remaining CLI commands has tests: `update` ✅
- Deploy command still needs test coverage

**What Needs Testing:**

#### 1. Deploy Command (`src/cli/commands/deploy.ts`)
**Critical Paths:**
- Directory structure creation (11 trinity dirs, 5 .claude dirs)
- Agent template deployment (18 agents to 5 subdirectories)
- Slash command deployment (16 commands to 6 categories)
- Knowledge base template processing with variable substitution
- Linting tool deployment (optional ESLint/Prettier configs)
- CI/CD template deployment (optional GitHub Actions/GitLab CI)
- Framework detection (React, Vue, Angular, etc.)
- Codebase metrics collection (file counts, complexity)
- .gitignore updates
- Version file creation

**Test Types Needed:**
- Unit tests: Framework detection, template processing, variable substitution
- Integration tests: Full deployment to temp directory, verify all files/folders created
- E2E tests: Deploy to real project structure, verify functionality

#### 2. Update Command (`src/cli/commands/update.ts`) ✅ **COMPLETED**
**Status:** Full test coverage implemented (15 integration tests passing)
- ✅ Version comparison logic tested
- ✅ Backup and restore of user files tested
- ✅ Template updates tested
- ✅ Agent updates tested
- ✅ Rollback on failure tested
- ✅ Pre-flight checks, dry-run mode, structure verification
- ✅ Edge cases: Missing directories, missing VERSION file, user file preservation

#### 3. Crisis Command - ❌ **DELETED**
**Status:** Command was removed from codebase - no tests needed

**Implementation Plan:**

### Phase 1: Test Infrastructure Setup (1-2 hours)
- [ ] Create `tests/` directory structure
  ```
  tests/
    unit/
      cli/
        commands/
        utils/
    integration/
      cli/
        commands/
    e2e/
      deployment/
    fixtures/
      projects/
    helpers/
  ```
- [ ] Set up Jest configuration (already in package.json)
- [ ] Create test helpers for temp directory management
- [ ] Create fixture projects for different frameworks

### Phase 2: Deploy Command Tests (3-4 hours)
- [ ] Unit tests for framework detection
- [ ] Unit tests for template processor
- [ ] Unit tests for codebase metrics
- [ ] Integration test: Full deployment to empty directory
- [ ] Integration test: Deployment with linting tools
- [ ] Integration test: Deployment with CI/CD templates
- [ ] E2E test: Deploy to React project, verify structure

### Phase 3: Update Command Tests ✅ **COMPLETED**
- ✅ Unit tests for version comparison
- ✅ Unit tests for backup/restore logic
- ✅ Integration test: Update from older version
- ✅ Integration test: User file preservation
- ✅ Test rollback on failure
- ✅ 15 integration tests with 100% pass rate

### Phase 4: Crisis Command Tests - ❌ **DELETED**
- N/A - Crisis command was removed from codebase

### Phase 5: CI/CD Integration (1 hour)
- [ ] Set up GitHub Actions workflow
- [ ] Configure test coverage reporting
- [ ] Add test status badge to README
- [ ] Set minimum coverage threshold (e.g., 80%)

**Test Coverage Goals:**
- **Unit Tests:** 90%+ coverage of utility functions and logic
- **Integration Tests:** 80%+ coverage of command workflows
- **E2E Tests:** Critical happy paths validated

**Testing Stack:**
- Jest (already configured)
- ts-jest (already installed)
- @types/jest (already installed)
- fs-extra for temp directory management
- Mock file system for faster unit tests

**Priority:** MEDIUM
**Effort:** 8-12 hours total
**Assigned To:** TBD
**Due Date:** TBD

**Notes:**
- Focus on deploy command first (highest complexity, most critical)
- Use temp directories for all integration tests to avoid polluting workspace
- Mock external dependencies (npm install, git commands) in unit tests
- Real execution in integration/e2e tests with cleanup
