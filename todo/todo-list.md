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

### ✅ COMPLETE: Overhaul `/trinity-orchestrate` Slash Command

**File:** `src/templates/shared/claude-commands/trinity-orchestrate.md`

**Status:** **COMPLETED** - Complete rewrite as planning guide

**What Was Accomplished:**
- ✅ Reframed as "Trinity Workflow Planning Guide" (not automation)
- ✅ Explained persona adoption model clearly
- ✅ Defined manual checkpoints for Small/Medium/Large workflows
- ✅ Removed all references to deleted CLI commands (trinity orchestrate, trinity crisis, trinity learning-status)
- ✅ Removed all references to deleted source files (src/coordination/, src/agents/)
- ✅ Added comprehensive workflow examples for each scale
- ✅ Added decision tree for workflow selection
- ✅ Clarified BAS gates are manual checkpoints (can be automated with EIN)
- ✅ Updated agent count (references 19 agents correctly)
- ✅ Provided 3 detailed usage examples (Small, Medium, Large tasks)

**New Content Structure:**
1. **How Trinity Workflows Work** - Persona adoption explanation
2. **Small Tasks** - 2 phases, 0 stop points, 1-4 hours
3. **Medium Tasks** - 5 phases, 2 stop points, 4-8 hours (detailed workflow)
4. **Large Tasks** - 7 phases, 4 stop points, >8 hours (comprehensive workflow)
5. **BAS Quality Gates** - All 6 phases explained
6. **Trinity Agents Quick Reference** - Organized by layer
7. **Decision Tree** - File count-based workflow selection
8. **Example Usage** - 3 complete examples

**Key Changes Made:**
- Changed "AJ MAESTRO orchestrates automatically" → "Claude adopts agent personas sequentially"
- Changed "Automated workflow execution" → "Manual workflow with user approval at stop points"
- Removed CLI command examples → Replaced with slash command references
- Removed "11-agent team" → Corrected to 19 agents organized by role
- Added explicit stop point indicators (📋 STOP POINT)
- Clarified BAS as manual checkpoints (not automated)

**Completed:** 2025-12-18

---

## Slash Command Optimization

### ✅ COMPLETE: Slash Command Accuracy Fixes (9 commands)

**Files:** `src/templates/shared/claude-commands/trinity-*.md`

**Status:** **COMPLETED** - All broken references removed, agent counts updated, persona adoption clarified

**Commands Fixed:**

#### Phase 1: Removed Broken References (5 commands) ✅
1. **`trinity-init.md`** ✅
   - Removed all `/trinity-crisis` references (4 instances)
   - Removed all `/trinity-learning-status` references (4 instances)
   - Removed `trinity crisis --health` CLI reference
   - Removed `trinity orchestrate` CLI reference
   - Removed `trinity learning-status --dashboard` CLI reference
   - Updated "Related Commands" section with accurate slash commands
   - Updated "Post-Init Next Steps" with current SDK capabilities

2. **`trinity-requirements.md`** ✅
   - Removed `src/agents/SelfImprovingAgent.ts` reference
   - Removed deleted source file references
   - Added "MON Agent Capabilities" section (replaced "Enhanced Documentation v2.0")
   - Clarified persona adoption: "Claude (as MON) will analyze requirements"
   - Updated workflow integration section (removed AJ MAESTRO automation references)
   - Clarified Trinity quality standards (removed reference to deleted docs)

3. **`trinity-decompose.md`** ✅
   - Removed `src/agents/SelfImprovingAgent.ts` reference
   - Removed `src/coordination/AJMaestro.ts` reference
   - Added "EUS Agent Capabilities" section
   - Clarified persona adoption: "Claude (as EUS) will decompose..."
   - Updated workflow integration (removed AJ MAESTRO coordination references)
   - Clarified scale-based task decomposition

4. **`trinity-design.md`** ✅
   - Removed `src/agents/SelfImprovingAgent.ts` reference
   - Added "ROR Agent Capabilities" section
   - Clarified persona adoption: "Claude (as ROR) will create technical design"
   - Updated workflow integration (Medium-scale example)
   - Clarified Design Doc compliance validation

5. **`trinity-plan.md`** ✅
   - Removed `src/coordination/AJMaestro.ts` and `src/coordination/types.ts` references
   - Removed "Plan vs. Workflow" section (referenced deleted automation)
   - Added "Integration with Trinity Workflow" section
   - Clarified persona adoption: "Claude (as TRA) will create implementation plan"
   - Updated TRA's planning role description
   - Clarified handoff to EUS

#### Phase 2: Updated Agent Information (3 commands) ✅
6. **`trinity-verify.md`** ✅
   - Updated from "7 agents" → "19 agents in 5 subdirectories"
   - Added complete Trinity core structure (12 directories)
   - Added agent organization by subdirectory:
     - leadership/ (3 agents: ALY, AJ MAESTRO, AJ CC)
     - deployment/ (4 agents: TAN, ZEN, INO, EIN)
     - audit/ (1 agent: JUNO)
     - planning/ (4 agents: MON, ROR, TRA, EUS)
     - aj-team/ (7 agents: KIL, BAS, DRA, APO, BON, CAP, URO)
   - Added slash commands verification (16 commands)
   - Added knowledge base files verification (9 files)
   - Added CI/CD workflows verification (ci.yml, cd.yml)

7. **`trinity-agents.md`** ✅
   - Updated from "7 agents" → "19 specialized agents"
   - Added persona adoption explanation at top
   - Organized agents by 5 subdirectories with full descriptions
   - Added all 19 agents with roles and capabilities
   - Updated usage instructions
   - Added example of how to ask about specific agents

8. **`trinity-start.md`** ✅
   - Updated from listing 7 agents → Complete 19-agent reference
   - Added persona adoption explanation
   - Added comprehensive workflow selection process (4 steps)
   - Added scale determination (Small/Medium/Large)
   - Added routing to appropriate workflow
   - Added work order creation guidance
   - Added complete agent quick reference organized by role:
     - Leadership (3), Deployment (4), Planning (4), Implementation (7), Audit (1)
   - Added routing decision tree

#### Phase 3: Complete Rewrite (1 command) ✅
9. **`trinity-orchestrate.md`** ✅
   - Complete rewrite (384 lines)
   - See detailed accomplishments above

**Files Modified:** 9 slash command templates
**Lines Changed:** ~1,500+ lines across all files
**References Removed:**
- Deleted CLI commands: trinity orchestrate, trinity crisis, trinity learning-status
- Deleted source files: src/coordination/*, src/agents/*
- Deleted slash commands: /trinity-crisis, /trinity-learning-status
- Incorrect agent counts: "7 agents", "11-agent team"

**Build Status:** ✅ Successful after all changes

**Completed:** 2025-12-18

---

### ⚠️ TODO: Remaining Slash Command Optimizations (6 commands)

**Files:** `src/templates/shared/claude-commands/trinity-*.md`

**Current Status:** Commands are accurate but could benefit from minor enhancements

**Commands for Future Enhancement:**

#### Session Management (2 commands)
1. **`trinity-continue.md`** - Add empty state handling, example session summary
2. **`trinity-end.md`** - Add file movement validation, concrete knowledge base update examples

#### Investigation Commands (2 commands)
3. **`trinity-create-investigation.md`** - Add file creation validation, provide example investigation structure
4. **`trinity-plan-investigation.md`** - Add Mermaid diagram examples, define plan output format

#### Utility Commands (2 commands)
5. **`trinity-workorder.md`** - Add auto-numbering logic (scan directory for WO-XXX), file creation validation
6. **`trinity-investigate-templates.md`** - Add more concrete examples

**Note:** These are enhancements, not fixes. All commands are currently accurate.

**Priority:** LOW
**Effort:** 2-3 hours total
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
