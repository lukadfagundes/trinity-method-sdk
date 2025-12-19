# Trinity Method SDK - TODO List

## ✅ 1. Overhaul trinity-orchestrate Slash Command - COMPLETE

**File:** `src/templates/shared/claude-commands/trinity-orchestrate.md.template`

**Status:** ✅ **COMPLETED** - Complete rewrite focused on AJ MAESTRO orchestration

**What Was Accomplished:**
- ✅ Complete template overhaul (955 lines, was 416)
- ✅ Removed duplicate workflow planning content (lines 37-415 deleted)
- ✅ Expanded work order/investigation orchestration (kept lines 1-35, expanded to full template)
- ✅ Added AJ MAESTRO's 5-step orchestration process
- ✅ Added JUNO automatic verification documentation
- ✅ Added session workflow context (session ≠ context window)
- ✅ Added general task orchestration (without @-file)
- ✅ Added 3 comprehensive real-world examples:
  1. Work order execution (WO-042 JWT refresh with full agent workflow)
  2. Investigation execution (INV-015 database performance, READ-ONLY)
  3. Quick task without work order (date validation bug fix)
- ✅ Added context window management explanation
- ✅ Added "When NOT to use" section
- ✅ Build verification: PASS ✅

**New Template Structure:**
1. **Overview** - Primary execution command during sessions
2. **Usage Patterns** - Three ways to use (WO, INV, general tasks)
3. **AJ MAESTRO's Orchestration Process** - 5 steps (Analysis, Selection, Coordination, JUNO, Report)
4. **Session Workflow Context** - Session lifecycle and context management
5. **Real-World Examples** - Full execution traces with agent dialogues
6. **When NOT to Use** - Clear boundaries
7. **Related Commands** - Session management, task creation, specialized planning
8. **Summary** - Key takeaways

**Key Improvements:**
- Focused exclusively on execution/orchestration
- Clear session workflow (start → orchestrate repeatedly → end)
- JUNO verification prominent (automatic after every task)
- Context window recovery with `/trinity-continue`
- Three usage patterns clearly explained

**Completed:** 2025-12-19
**Effort:** ~1.5 hours (exceeded estimate slightly due to comprehensive examples)

---

## 2. Add New Slash Command: trinity-audit

**File:** `src/templates/shared/claude-commands/trinity-audit.md.template` (NEW)

**Purpose:** Launch comprehensive project audit using JUNO agent

**Requirements:**
- [ ] Create new slash command template
- [ ] Define audit scope and types
- [ ] Integrate with JUNO agent template
- [ ] Specify audit report output format
- [ ] Add audit checklist and quality gates
- [ ] Document audit findings format
- [ ] Include remediation workflow

**Proposed Functionality:**

### Audit Types:
1. **Code Quality Audit**
   - Linting compliance
   - Code complexity metrics
   - Best practices adherence
   - Technical debt assessment

2. **Security Audit**
   - Dependency vulnerabilities
   - Code security patterns
   - OWASP compliance
   - Authentication/authorization review

3. **Testing Audit**
   - Test coverage analysis
   - Test quality assessment
   - Missing test scenarios
   - Test maintenance issues

4. **Documentation Audit**
   - Code documentation completeness
   - API documentation quality
   - README and guides review
   - Inline comment quality

5. **Trinity Method Compliance Audit**
   - Knowledge base completeness
   - Agent template accuracy
   - Workflow adherence
   - Quality gate compliance

**Output:**
- Audit report saved to `trinity/reports/AUDIT-{type}-{date}.md`
- Executive summary with severity ratings
- Detailed findings with evidence
- Remediation recommendations with priorities
- Follow-up work order suggestions

**Integration:**
- Links to existing JUNO agent template
- Can trigger from `/trinity-init` (Phase 4)
- Standalone invocation for periodic audits

**Priority:** MEDIUM
**Effort:** 2-3 hours
**Assigned To:** TBD
**Due Date:** TBD

---

## 3. Add New Slash Command: trinity-docs

**File:** `src/templates/shared/claude-commands/trinity-docs.md.template` (NEW)

**Purpose:** Generate and update project documentation using APO agent

**Requirements:**
- [ ] Create new slash command template
- [ ] Define documentation types
- [ ] Integrate with APO agent template
- [ ] Specify documentation standards
- [ ] Add templates for different doc types
- [ ] Include documentation quality checklist
- [ ] Document versioning strategy

**Proposed Functionality:**

### Documentation Types:
1. **API Documentation**
   - Auto-generate from code
   - OpenAPI/Swagger specs
   - Endpoint descriptions
   - Request/response examples
   - Authentication requirements

2. **Code Documentation**
   - JSDoc/TSDoc generation
   - Class and function documentation
   - Inline comment review
   - Usage examples

3. **Architecture Documentation**
   - System architecture diagrams (Mermaid)
   - Component relationships
   - Data flow documentation
   - Technology stack overview

4. **User Documentation**
   - README files
   - Getting started guides
   - Configuration guides
   - Troubleshooting guides

5. **Developer Documentation**
   - Contributing guidelines
   - Development setup
   - Testing guidelines
   - Deployment procedures

**Output Locations:**
- API docs: `docs/api/`
- Architecture: `docs/architecture/`
- User guides: `docs/guides/`
- Developer docs: `docs/development/`

**Features:**
- Interactive prompts for doc type selection
- Auto-detection of missing documentation
- Documentation completeness scoring
- Links to DOCUMENTATION-CRITERIA.md standards
- Validation against documentation quality checklist

**Integration:**
- Uses APO (Documentation Specialist) agent
- Can be invoked standalone or as part of workflow
- Integrates with BAS quality gates

**Priority:** MEDIUM
**Effort:** 2-3 hours
**Assigned To:** TBD
**Due Date:** TBD

---

## 4. Wrap Up Test Coverage for the Project

**Current Status:** Only `update` command has test coverage (15 tests, 100% pass rate)

**Remaining Test Needs:**

### Phase 1: Deploy Command Tests (HIGH PRIORITY)

**File:** `tests/integration/cli/commands/deploy.test.ts` (NEW)

**Critical Paths to Test:**
- [ ] Directory structure creation (14 trinity dirs, 5 .claude dirs)
- [ ] Agent template deployment (19 agents to 5 subdirectories)
- [ ] Slash command deployment (16 commands to 6 categories)
- [ ] Knowledge base template processing with variable substitution
- [ ] Linting tool deployment (optional ESLint/Prettier configs)
- [ ] CI/CD template deployment (optional ci.yml/cd.yml)
- [ ] Framework detection (React, Vue, Angular, Node.js, etc.)
- [ ] Codebase metrics collection (file counts, complexity)
- [ ] .gitignore updates
- [ ] Version file creation
- [ ] Investigation template deployment (5 templates)
- [ ] Work order template deployment (6 templates)

**Test Types:**

#### Unit Tests:
- [ ] Framework detection logic
- [ ] Template processing and variable substitution
- [ ] Codebase metrics calculation
- [ ] Path resolution utilities
- [ ] Placeholder replacement

#### Integration Tests:
- [ ] Full deployment to empty directory
- [ ] Deployment with linting tools
- [ ] Deployment with CI/CD templates
- [ ] Deployment to existing Trinity installation (update scenario)
- [ ] Verify all 14 directories created
- [ ] Verify all 19 agents deployed to correct subdirectories
- [ ] Verify all 16 slash commands categorized correctly
- [ ] Verify knowledge base files have correct variable substitution

#### E2E Tests:
- [ ] Deploy to React project, verify structure
- [ ] Deploy to Vue project, verify framework-specific configs
- [ ] Deploy to Node.js project, verify package.json integration

**Estimated Effort:** 4-6 hours

---

### Phase 2: CI/CD Integration (MEDIUM PRIORITY)

**File:** `.github/workflows/ci.yml` (update existing)

**Tasks:**
- [ ] Add test job to CI workflow
- [ ] Configure test coverage reporting (Codecov or similar)
- [ ] Add test status badge to README
- [ ] Set minimum coverage threshold (80%)
- [ ] Add test failure notifications
- [ ] Configure parallel test execution
- [ ] Add test performance monitoring

**Test Coverage Goals:**
- **Unit Tests:** 90%+ coverage of utility functions and logic
- **Integration Tests:** 80%+ coverage of command workflows
- **E2E Tests:** Critical happy paths validated

**Estimated Effort:** 1-2 hours

---

### Phase 3: Additional Command Tests (LOW PRIORITY)

**Optional Tests for Other Commands:**
- [ ] `trinity init` workflow tests (if CLI command exists)
- [ ] `trinity crisis` tests (DELETED - skip)
- [ ] Utility function tests in `src/cli/utils/`
- [ ] Template processing tests

**Estimated Effort:** 2-3 hours

---

### Testing Stack (Already Configured):
- ✅ Jest (configured in package.json)
- ✅ ts-jest (installed)
- ✅ @types/jest (installed)
- ✅ Test helpers created (`tests/helpers/test-helpers.ts`)
- ✅ Mocks created (ora, chalk, inquirer)
- ✅ CommonJS/ESM compatibility configured

**Priority:** HIGH (deploy command), MEDIUM (CI/CD), LOW (additional commands)
**Total Effort:** 7-11 hours
**Assigned To:** TBD
**Due Date:** TBD

**Notes:**
- Focus on deploy command first (highest complexity, most critical)
- Use temp directories for all integration tests to avoid polluting workspace
- Mock external dependencies (npm install, git commands) in unit tests
- Real execution in integration/e2e tests with cleanup
- Reuse test infrastructure from update command tests

---

## Summary

**Total TODO Items:** 4
**Priority Breakdown:**
- HIGH: 2 items (trinity-orchestrate overhaul, deploy command tests)
- MEDIUM: 2 items (trinity-audit, trinity-docs)

**Estimated Total Effort:** 13-19 hours
- Item 1: 30-45 minutes
- Item 2: 2-3 hours
- Item 3: 2-3 hours
- Item 4: 7-11 hours

**Completion Status:** 0/4 items complete (0%)

---

**Last Updated:** 2025-12-19
