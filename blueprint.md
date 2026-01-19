# Trinity Documentation Update - Process Blueprint

**Command:** `/maintenance:trinity-docs-update`
**Purpose:** Update existing documentation to 100% alignment with codebase
**Architecture:** JUNO Audit → 3 Parallel APOs → JUNO Verification Loop (max 3 iterations)
**Version:** 2.0.9

---

## Critical Rules

### Rule 1: No Self-Serving Trinity Documentation

- Never document Trinity Method itself
- Focus only on user's codebase

### Rule 2: Continuous Execution Protocol

**Stop ONLY for:**

1. docs/ directory missing → ABORT
2. 3 iterations without 100% → ABORT
3. 100% alignment achieved → SUCCESS

**DO NOT stop for:**

- User review
- Approval gates
- Token constraints
- Time constraints

### Rule 3: Disregard Constraints

- Complete tasks regardless of token constraints
- Complete tasks regardless of time constraints
- No shortening or simplifying tasks

---

## Phase 0: Pre-Flight Check & State Initialization

### Step 0.1: Verify docs/ Directory Exists

- Check for docs/ directory
- If missing → ABORT with message to run `/maintenance:trinity-docs` first
- If exists → proceed

### Step 0.2: Initialize Global State Object

- Create state tracking object with:
  - Command name
  - Start timestamp
  - Current iteration (1-3)
  - Current phase
  - Alignment history
  - Reports generated
  - Files modified
  - Token usage tracking

---

## ITERATION LOOP START (Max 3 Iterations)

---

## Phase 1: JUNO Comprehensive Audit

**Agent:** JUNO (Quality Auditor)
**Output:** `trinity/reports/DOCS-UPDATE-AUDIT-iteration-{{ITERATION}}-{{DATE}}.md`

### Step 1.0: Pre-Flight Checklist (Command Integrity Verification)

- Confirm command context
- Verify not confused with `/maintenance:trinity-docs`
- Confirm docs/ directory exists
- Verify user's codebase focus (not Trinity Method)

### Step 1.1: Scan Existing Documentation

- Read ALL files in docs/ directory recursively
- Catalog existing documentation:
  - Architecture docs
  - Setup/configuration docs
  - API reference docs
  - Guide docs
  - Business logic component docs
- Note file locations, content summaries, last modified dates

### Step 1.2: Scan Codebase for Business Logic

- Identify ALL business logic components:
  - Services (backend/src/services/)
  - Controllers (if applicable)
  - Repositories/Models (data layer)
  - Middleware
  - Utilities with business logic
  - Frontend components (pages, components)
  - API routes/endpoints
  - Background jobs/workers
- For EACH component, note:
  - File path
  - Component name
  - Purpose/responsibility
  - Key functions/methods
  - Dependencies
  - Whether documented or not

### Step 1.2A: Scope Boundary Enforcement (MANDATORY)

- Framework code → EXCLUDE
- Third-party libraries → EXCLUDE
- node_modules/ → EXCLUDE
- Configuration files → EXCLUDE (unless business logic)
- Test files → DOCUMENT ONLY if no implementation doc exists
- Scripts → INCLUDE if business logic
- User's business logic → INCLUDE

### Step 1.3: Cross-Reference Documentation with Codebase

- For each existing documentation file:
  - Verify claims against source code
  - Check file paths are correct
  - Check function signatures match
  - Check architecture diagrams reflect reality
  - Check configuration examples are accurate
  - Note discrepancies (outdated info, wrong paths, etc.)

### Step 1.3A: Service Module Discovery and API Documentation Requirement (MANDATORY)

- Scan backend/src/services/ (or equivalent)
- For EACH service module found:
  - Check if API reference documentation exists
  - If NO docs exist → Flag as "missing business logic documentation"
  - If docs exist but outdated → Flag as "existing documentation needing update"
  - Services are ALWAYS business logic (cannot be framework code)
- Services are HIGH PRIORITY for documentation

### Step 1.3B: Frontend Module Discovery and Component Documentation (MANDATORY)

- Scan frontend directories (pages/, components/, app/, src/)
- For EACH component/page found:
  - Check if documentation exists
  - If NO docs exist → Flag as "missing business logic documentation"
  - If docs exist but outdated → Flag as "existing documentation needing update"
  - Frontend components are business logic (not framework)

### Step 1.4: Generate 3-Part Audit Report

**Part 1: Base Documentation Updates Needed**

- List documentation files that need updates
- Describe current state vs required state
- Specify what needs to be corrected

**Part 2: Existing Business Logic Requiring Updates**

- List business logic components with EXISTING docs that are outdated
- Explain dependency ties (why APO-2 vs APO-3)

**Part 3: Missing Business Logic Requiring New Documentation**

- List business logic components with NO documentation
- Explain uniqueness to repository
- Explain modularity (why APO-3 vs APO-2)

### Step 1.5: APO Work Assignment

**Assign work to 3 parallel APOs:**

- APO-1: Base documentation files needing updates (Part 1)
- APO-2: Existing business logic docs needing updates (Part 2)
- APO-3: Missing business logic requiring new docs (Part 3)

### Step 1.6: Zero-Tolerance Policy Check

- Verify no fake components in assignment
- Verify no security violations
- Verify no stub/placeholder code

### Step 1.7: Save Audit Report

- Save to: `trinity/reports/DOCS-UPDATE-AUDIT-iteration-{{ITERATION}}-{{DATE}}.md`

---

## Phase 2: Parallel APO Execution

**3 APO agents execute in parallel** (if possible in implementation)

---

### APO-1: Base Documentation Updates

**Agent:** APO-1 (Documentation Specialist)
**Assignment:** Update architecture, setup, configuration, and guide documentation
**Mode:** UPDATE existing files
**Output:** `trinity/reports/APO-1-BASE-UPDATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

#### APO-1 Step 1: Read Assignment from JUNO Audit

- Extract list of files from Part 1 of audit report

#### APO-1 Step 2: Update Each Assigned File

- Read current file content
- Read source code to verify claims
- Update documentation to match reality
- Cross-reference all factual claims
- Update file paths, function names, architecture diagrams

#### APO-1 Step 3: Verify Updates

- Re-read updated documentation
- Re-check against source code
- Confirm 100% accuracy

#### APO-1 Step 4: Track Files Modified

- Maintain list of all files updated

#### APO-1 Step 5: Generate Completion Report

- List all files updated
- Describe changes made (before/after)
- List codebase cross-references validated
- Note issues encountered
- Report quality metrics
- Save to: `trinity/reports/APO-1-BASE-UPDATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

---

### APO-2: Update Existing Business Logic Documentation

**Agent:** APO-2 (Documentation Specialist)
**Assignment:** Update documentation for existing business logic with dependency ties
**Mode:** UPDATE existing files
**Output:** `trinity/reports/APO-2-BUSINESS-UPDATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

#### APO-2 Step 1: Read Assignment from JUNO Audit

- Extract list of components from Part 2 of audit report

#### APO-2 Step 2: Dependency Tie Analysis

- Verify components have tight coupling (reason for APO-2 vs APO-3)

#### APO-2 Step 3: Update Documentation for Each Component

- Read existing documentation
- Read component source code
- Update documentation to reflect current implementation
- Preserve dependency tie explanations

#### APO-2 Step 4: Validate Updates

- Cross-reference claims with source code
- Verify dependency ties still exist

#### APO-2 Step 5: Generate Completion Report

- List all components updated
- Describe changes made
- Report quality metrics
- Save to: `trinity/reports/APO-2-BUSINESS-UPDATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

---

### APO-3: Create New Business Logic Documentation

**Agent:** APO-3 (Documentation Specialist)
**Assignment:** Create NEW documentation for modular business logic components
**Mode:** CREATE new files
**Output:** `trinity/reports/APO-3-BUSINESS-CREATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

#### APO-3 Step 1: Read Assignment from JUNO Audit

- Extract list of components from Part 3 of audit report

#### APO-3 Step 2: Modularity Analysis

- Verify components are loosely coupled (reason for APO-3 vs APO-2)

#### APO-3 Step 3: Create Documentation for Each Component

**CRITICAL: Create ONE file per component**

- Forbidden: Bulk documentation, summary files
- Required: Individual file for each component

For each component:

1. Read source code
2. Create documentation file following template
3. Document: Overview, Purpose, Usage, API Reference, Configuration, Error Handling, Testing, Related Components

#### APO-3 Step 4: Validate Documentation Against Code

- Cross-reference all claims with source code
- Verify function signatures
- Verify examples are accurate

#### APO-3 Step 5: Generate Completion Report

- List all files created (one per component)
- Report quality metrics
- Save to: `trinity/reports/APO-3-BUSINESS-CREATE-COMPLETE-iteration-{{ITERATION}}-{{DATE}}.md`

---

## Phase 3: JUNO Verification Loop

**Agent:** JUNO (Quality Auditor)
**Output:** `trinity/reports/DOCS-UPDATE-VERIFICATION-iteration-{{ITERATION}}-{{DATE}}.md`

### Step 3.1: Read APO Completion Reports

- Read all 3 APO reports from current iteration

### Step 3.2: Comprehensive Alignment Verification

**Architecture-Level Verification (33.3% weight)**

- Verify architecture documentation reflects codebase reality
- Check: Project structure, component relationships, data flow, technology stack

**Module-Level Verification (33.3% weight)**

- Verify each business logic module has documentation
- Check: Services, controllers, middleware, utilities, frontend components

**Function-Level Verification (33.4% weight)**

- Verify function signatures documented correctly
- Check: Public APIs, method signatures, parameters, return types

### Step 3.3: Calculate Overall Alignment

```
overall_alignment = (architecture_level * 0.33) + (module_level * 0.33) + (function_level * 0.34)
```

Express as percentage (0-100%).

### Step 3.4: Identify All Discrepancies

- List remaining discrepancies found during verification
- Count total discrepancies

### Step 3.5: Generate Verification Report

- Report alignment percentages (all 3 levels + overall)
- List discrepancies found
- Save to: `trinity/reports/DOCS-UPDATE-VERIFICATION-iteration-{{ITERATION}}-{{DATE}}.md`

### Step 3.6: Decision Tree (STRICT ENFORCEMENT)

---

#### Decision 1: 100% Alignment Achieved (SUCCESS)

```
IF overall_alignment === 100%:
  → SUCCESS (Proceed to Phase 4)
  → stopCondition = "success"
```

**Stop Condition Met: SUCCESS - 100% alignment achieved**

Proceed to Phase 4.

---

#### Decision 2: Not 100% Aligned, Iterations Remaining

```
IF overall_alignment < 100% AND currentIteration < 3:
  → ITERATE (Repeat Phases 1-3)
  → currentIteration++
  → currentPhase = "audit"
  → Focus JUNO audit on identified discrepancies
```

**Continue to next iteration:**

1. Increment iteration counter
2. **IMMEDIATELY proceed to Phase 1 (NO USER APPROVAL REQUIRED)**
3. JUNO focuses on discrepancies found in previous iteration
4. APOs fix discrepancies
5. JUNO verifies again

**CRITICAL: Automatic Continuation Protocol**

Iteration transitions are AUTOMATIC and MANDATORY:

1. Update global state (increment iteration)
2. Generate brief transition message
3. **IMMEDIATELY begin Phase 1 for next iteration:**
   - DO NOT wait for user approval
   - DO NOT ask "Should I continue?"
   - DO NOT create a detailed summary and pause
   - DO NOT stop for anticipated workload/token concerns
   - ONLY stop if ACTUAL token/context limit hit (context window full)

4. **Token/Context Limit Handling:**
   - If ACTUAL token limit hit DURING iteration → Save checkpoint, resume when continued
   - If ACTUAL token limit hit BETWEEN iterations → Treat as mid-iteration, resume Phase 1 of next iteration
   - Never interpret iteration boundary as stopping point
   - "Anticipated high token usage" is NOT a valid stop reason
   - Continue execution until context window actually fills

**Forbidden Behaviors:**

- Stop and ask: "Iteration 1 complete. Should I proceed to Iteration 2?"
- Generate long summary and wait for feedback
- Pause between Phase 3 (verification) and Phase 1 (next audit)
- Treat iteration boundary as approval gate

**Required Behaviors:**

- Automatically proceed to next iteration
- Only pause if token limits hit mid-task
- Complete all iterations up to 100% or 3 iterations
- Generate ONE final report at Phase 4

**Loop back to Phase 1 for next iteration.**

---

#### Decision 3: Not 100% Aligned, Max Iterations Reached (INCOMPLETE)

```
IF overall_alignment < 100% AND currentIteration === 3:
  → ABORT (Max iterations without 100% alignment)
  → stopCondition = "max_iterations"
  → Generate final report
```

**Stop Condition Met: MAX ITERATIONS REACHED**

Proceed to Phase 4 with INCOMPLETE status.

---

## ITERATION LOOP END

---

## Phase 4: Completion & Cleanup

**Agent:** JUNO (Quality Auditor)
**Output:** `trinity/reports/DOCS-UPDATE-COMPLETE-{{DATE}}.md`

### Step 4.1: Generate Final Completion Report

- Final alignment percentage (100% if success, <100% if max iterations)
- Total iterations executed
- Journey overview (alignment progress per iteration)
- All work completed summary (APO-1, APO-2, APO-3 totals)
- All files modified list
- Quality metrics (4-tier scoring)
- Business logic inventory
- Discrepancy resolution tracking
- Performance metrics
- Lessons learned
- All reports generated list
- Save to: `trinity/reports/DOCS-UPDATE-COMPLETE-{{DATE}}.md`

### Step 4.2: Move All Reports to trinity/sessions/

```bash
mv trinity/reports/DOCS-UPDATE-AUDIT-iteration-*.md trinity/sessions/
mv trinity/reports/APO-1-BASE-UPDATE-COMPLETE-iteration-*.md trinity/sessions/
mv trinity/reports/APO-2-BUSINESS-UPDATE-COMPLETE-iteration-*.md trinity/sessions/
mv trinity/reports/APO-3-BUSINESS-CREATE-COMPLETE-iteration-*.md trinity/sessions/
mv trinity/reports/DOCS-UPDATE-VERIFICATION-iteration-*.md trinity/sessions/
mv trinity/reports/DOCS-UPDATE-COMPLETE-*.md trinity/sessions/
```

### Step 4.3: Report Completion to User

**If 100% alignment achieved:**

```
✅ SUCCESS: Documentation Update Complete

Final Alignment: 100% ✅
Iterations: {{TOTAL_ITERATIONS}}
Files Updated: {{FILES_UPDATED}}
New Files Created: {{NEW_FILES_CREATED}}
Business Logic Documented: {{BUSINESS_LOGIC_COUNT}}

Your documentation now perfectly reflects your codebase at all levels:
- Architecture-level: 100% aligned ✅
- Module-level: 100% aligned ✅
- Function-level: 100% aligned ✅

Reports archived to: trinity/sessions/

To view final report:
  trinity/sessions/DOCS-UPDATE-COMPLETE-{{DATE}}.md
```

**If max iterations reached without 100% alignment:**

```
⚠️ INCOMPLETE: Documentation Update Reached Max Iterations

Final Alignment: {{FINAL_ALIGNMENT}}% (Target: 100%)
Iterations: 3 (max)
Gap: {{100 - FINAL_ALIGNMENT}}%

What was completed:
- Architecture-level: {{ARCH_LEVEL}}% aligned
- Module-level: {{MODULE_LEVEL}}% aligned
- Function-level: {{FUNCTION_LEVEL}}% aligned

Files Updated: {{FILES_UPDATED}}
New Files Created: {{NEW_FILES_CREATED}}

Remaining discrepancies: {{DISCREPANCY_COUNT}}

Reports archived to: trinity/sessions/

To view detailed report:
  trinity/sessions/DOCS-UPDATE-COMPLETE-{{DATE}}.md
```

### Step 4.4: Update Global State (Final)

- Set currentPhase = "complete"
- Set stopCondition = "success" or "max_iterations"
- Record endTime timestamp
- Finalize alignment history

---

## Flow Summary

```
START
  ↓
Phase 0: Pre-Flight Check & State Init
  ↓
┌─────────────────────────────────────┐
│   ITERATION LOOP (Max 3 Times)     │
│                                     │
│  Phase 1: JUNO Audit                │
│    ↓                                │
│  Phase 2: APO-1, APO-2, APO-3       │
│    ↓                                │
│  Phase 3: JUNO Verification         │
│    ↓                                │
│  Decision Tree:                     │
│    • 100% aligned? → Exit to Phase 4│
│    • <100%, iter<3? → Loop to Phase 1│
│    • <100%, iter=3? → Exit to Phase 4│
│                                     │
└─────────────────────────────────────┘
  ↓
Phase 4: Completion & Cleanup
  ↓
END
```

---

## Critical Stop Points (ONLY 3)

1. **docs/ directory missing** → ABORT immediately
2. **3 iterations without 100%** → ABORT with detailed report
3. **100% alignment achieved** → SUCCESS, generate final report

**NO OTHER STOP POINTS ALLOWED**

---

## Key Metrics

- **Alignment Target:** 100%
- **Max Iterations:** 3
- **Weight Distribution:** Architecture (33.3%), Module (33.3%), Function (33.4%)
- **Agents Used:** JUNO (auditor), APO-1/2/3 (documentation specialists)

---

## File Outputs

**Per Iteration:**

- `trinity/reports/DOCS-UPDATE-AUDIT-iteration-N-DATE.md`
- `trinity/reports/APO-1-BASE-UPDATE-COMPLETE-iteration-N-DATE.md`
- `trinity/reports/APO-2-BUSINESS-UPDATE-COMPLETE-iteration-N-DATE.md` (if work assigned)
- `trinity/reports/APO-3-BUSINESS-CREATE-COMPLETE-iteration-N-DATE.md` (if work assigned)
- `trinity/reports/DOCS-UPDATE-VERIFICATION-iteration-N-DATE.md`

**Final:**

- `trinity/reports/DOCS-UPDATE-COMPLETE-DATE.md`

**All moved to:** `trinity/sessions/` at Phase 4 completion

---

**Blueprint Version:** 1.0
**Template Version:** 2.0.9 (Commit: 6fb5575)
**Created:** 2026-01-18
