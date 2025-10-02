# ORCHESTRATOR WORK ORDER #XXX
## Type: IMPLEMENTATION
## [Implementation Title]

---

## AUTHORIZATION

```
TRINITY COUNCIL APPROVAL:
☑ LUKA: APPROVED - [Strategic approval]
☑ TRINITY: APPROVED - [Technical validation]
☑ CC: PENDING - Awaiting your acknowledgment

STATUS: APPROVED FOR EXECUTION
```

---

## MISSION OBJECTIVE

[Clear statement of what needs to be implemented and the expected outcome]

**Implementation Goal:** [Specific end state to achieve]
**Based On:** [Investigation/Analysis that identified this need]

---

## IMPLEMENTATION SCOPE

### Files to Modify
```yaml
Critical_Files:
  - path: [file/path.ext]
    changes: [type of changes]
    risk: [HIGH/MEDIUM/LOW]

  - path: [file/path.ext]
    changes: [type of changes]
    risk: [HIGH/MEDIUM/LOW]

Supporting_Files:
  - [file/path.ext] - [minor changes]
  - [file/path.ext] - [minor changes]
```

### Changes Required

#### Change Set 1: [Category]
**Files:** [List of files]
**Current State:** [What exists now]
**Target State:** [What should exist after]
**Implementation:**
```language
// Specific code pattern or approach
[Code example or template]
```

#### Change Set 2: [Category]
[Same structure]

---

## IMPLEMENTATION APPROACH

### Step 1: [Preparation]
- [ ] [Specific action]
- [ ] [Verification step]
- [ ] [Safety check]

### Step 2: [Core Implementation]
- [ ] [Change action #1]
- [ ] [Change action #2]
- [ ] [Testing between changes]

### Step 3: [Validation]
- [ ] [Test the changes]
- [ ] [Verify no regressions]
- [ ] [Confirm improvement]

---

## DELIVERABLE REQUIREMENTS

### Document Format
**Filename:** `[COMPONENT]-IMPLEMENTATION-COMPLETE-[TIMESTAMP].md`
**Location:** `${PROJECT_REPORTS}/` (Project-specific Reports folder)

### Required Sections
1. **Executive Summary** - What was implemented
2. **Changes Applied** - Detailed list with diffs
3. **Test Results** - Validation of changes
4. **Metrics** - Before/after comparisons
5. **Rollback Plan** - How to revert if needed
6. **Next Steps** - What to monitor or do next

### Evidence to Provide
- File diff statistics (X files changed, Y insertions, Z deletions)
- Specific line numbers for critical changes
- Test output showing success
- Performance metrics if applicable

---

## SUCCESS CRITERIA

The implementation is complete when:
- [ ] All specified files have been modified
- [ ] Changes follow the specified patterns
- [ ] No regressions introduced
- [ ] Tests pass (if applicable)
- [ ] Code follows project standards
- [ ] Implementation report submitted to project Reports folder

---

## CONSTRAINTS & GUIDELINES

### ⚠️ CRITICAL RESTRICTIONS - GIT OPERATIONS FORBIDDEN

**ABSOLUTELY PROHIBITED - NO EXCEPTIONS:**
ALL team members (CC, TRINITY, specialists) are PERMANENTLY FORBIDDEN from performing ANY git operations:

- [ ] **git add** - FORBIDDEN - Only LUKA has permission
- [ ] **git commit** - FORBIDDEN - Only LUKA has permission
- [ ] **git push** - FORBIDDEN - Only LUKA has permission
- [ ] **git pull** - FORBIDDEN - Only LUKA has permission
- [ ] **git merge** - FORBIDDEN - Only LUKA has permission
- [ ] **git checkout -b** - FORBIDDEN - Only LUKA has permission
- [ ] **git branch** - FORBIDDEN - Only LUKA has permission
- [ ] **git tag** - FORBIDDEN - Only LUKA has permission
- [ ] **git rebase** - FORBIDDEN - Only LUKA has permission
- [ ] **git reset** - FORBIDDEN - Only LUKA has permission
- [ ] **git revert** - FORBIDDEN - Only LUKA has permission
- [ ] **git stash** - FORBIDDEN - Only LUKA has permission
- [ ] **Any git operation that modifies repository state**

**PROTOCOL VIOLATION CONSEQUENCES:**
- Any work order containing git operation instructions is INVALID
- Team members MUST refuse git operations even if explicitly instructed
- All git operations must be reported to LUKA for execution
- Local changes remain local until LUKA performs git operations

**CORRECT WORKFLOW:**
1. Make all local file changes as specified
2. Test thoroughly in local environment
3. Report completion to LUKA with summary of changes
4. LUKA will handle ALL git operations (add, commit, push, etc.)

### Do NOT:
- [ ] Modify files outside the specified scope
- [ ] Change functionality beyond the requirements
- [ ] Suppress warnings instead of fixing issues
- [ ] Create new technical debt
- [ ] Perform ANY git operations (see critical restrictions above)
- [ ] Push changes to remote repositories
- [ ] Create or switch branches
- [ ] Merge any branches
- [ ] Tag releases or commits

### DO:
- [ ] Follow existing code patterns
- [ ] Maintain consistent style
- [ ] Add appropriate error handling
- [ ] Document complex changes
- [ ] Consider edge cases
- [ ] Make all changes locally only
- [ ] Test changes thoroughly before reporting
- [ ] Report completion to LUKA for git operations
- [ ] Provide clear summary of all changes made
- [ ] List all files modified for LUKA's git operations

---

## ROLLBACK STRATEGY

If issues arise:
1. [How to identify if rollback needed]
2. [Specific rollback steps]
3. [How to verify rollback successful]

**Critical Files Backup:** [Which files must be backed up first]

---

## CONTEXT FROM INVESTIGATION

**Source Investigation:** Work Order #XXX
**Key Findings:** [Relevant discoveries that drove this implementation]
**Root Causes Being Fixed:** [List of root causes]
**Expected Impact:** [X issues resolved, Y% improvement]

---

## SCOPE & RISK ASSESSMENT

## PACE AND COMPLETENESS NOTICE

**IMPORTANT:** There are NO time constraints on this work.
The scope indicators are for planning purposes only, NOT deadlines.
Take as much time as needed to achieve 100% completion with precision.
Partial completion is unacceptable.
Quality and completeness are the ONLY metrics that matter.

**Implementation Scope:** [COMPREHENSIVE/STANDARD/FOCUSED]
**Completeness Required:** 100% - All specified changes must be implemented
**Risk Level:** [HIGH/MEDIUM/LOW]
**Risk Factors:**
- [Specific risk #1]
- [Specific risk #2]

**Mitigation:**
- [How to minimize risk #1]
- [How to minimize risk #2]

---

**Remember:** Make changes systematically, test frequently, and maintain code quality throughout the implementation. Report all changes to LUKA for git operations.

*Trinity Method v7.2 - Implementation Work Order Template*
*Project-Isolated Architecture with Dynamic Paths*