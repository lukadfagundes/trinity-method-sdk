# Trinity Docs Update - Manual Change Instructions

**Date:** 2026-01-16
**File:** `src/templates/.claude/commands/maintenance/trinity-docs-update.md.template`
**Purpose:** Surgical fixes to achieve 100% documentation coverage with 100% accuracy

---

## Overview

This document provides exact line-by-line instructions for applying 4 surgical fixes to the trinity-docs-update command. Each fix targets a specific issue identified in the test results analysis.

**Total Changes:** ~60 lines across 4 locations
**Approach:** Surgical precision (not bloat)

---

## Fix #1: Clarify APO-2 Assignment Criteria

**Issue:** JUNO misinterprets APO-2's role as "only for components with existing docs"
**Evidence:** Test 4 gave APO-2 ZERO assignments because "no existing docs found"
**Impact:** Fixes assignment confusion, ensures APO-2 creates docs when needed

### Location: Lines 405-409

**Current Text:**

```markdown
**APO-2: Update Existing Business Logic Documentation**

- Components with DIRECT TIES to other systems
- Decision logic: "Is this component directly tied to X system?"
  - YES → APO-2 updates existing documentation
  - NO → Check if modular (APO-3)
```

**Replace With:**

```markdown
**APO-2: Tightly-Coupled Business Logic (Create OR Update)**

- **CREATES new docs if none exist, UPDATES if docs exist**
- Decision criteria: COUPLING (not whether docs already exist)
- Components with DIRECT TIES to other systems
- Decision logic: "Is this component directly tied to X system?"
  - YES → APO-2 creates OR updates documentation (depending on if docs exist)
  - NO → Check if modular (APO-3)
```

**Change Summary:**

- Line 405: Change title from "Update Existing" to "Tightly-Coupled Business Logic (Create OR Update)"
- Add 2 new lines after title explaining CREATE vs UPDATE capability
- Line 408: Change "updates existing documentation" to "creates OR updates documentation (depending on if docs exist)"

---

## Fix #2: Add Filesystem Verification to JUNO

**Issue:** JUNO trusts APO reports without verifying files physically exist
**Evidence:** Test 1 reported 100% success but filesystem showed 60% missing
**Impact:** Prevents false 100% reporting, catches phantom files

### Location: Insert NEW section between line 1018 and 1020

**Current Text (Line 1018-1020):**

```markdown
---

### Step 3.2: Comprehensive Alignment Verification
```

**Insert Between These Lines:**

````markdown
---

### Step 3.1A: Verify Filesystem Reality

**CRITICAL: Do not trust APO reports - verify files physically exist.**

**For each file claimed in APO reports:**

1. **Extract claimed files from reports:**
   - APO-1 claimed files: Read "Files Modified" section from APO-1 report
   - APO-2 claimed files: Read "Components Updated" section, extract target paths
   - APO-3 claimed files: Read "New Files Created" section from APO-3 report

2. **Verify filesystem:**
   ```bash
   verified_count=0
   for file in claimed_files; do
     if [ -f "$file" ] && [ -s "$file" ]; then  # exists and not empty
       echo "✅ $file EXISTS"
       verified_count=$((verified_count + 1))
     else
       echo "❌ $file MISSING or EMPTY"
       # Create CRITICAL discrepancy
     fi
   done
   ```
````

3. **Compare counts:**
   - Claimed: X files
   - Verified: Y files
   - If X ≠ Y → Create HIGH severity discrepancies
   - **Use VERIFIED count for alignment calculation (not claimed count)**

---

### Step 3.2: Comprehensive Alignment Verification

````

**Change Summary:**
- Insert entire Step 3.1A section (23 lines) between existing Step 3.1 and Step 3.2
- This creates a verification gate that checks filesystem before trusting reports

---

## Fix #3A: Add Explicit File Creation Instructions to APO-2

**Issue:** APO-2 instructions don't explicitly say "use Write tool to create file"
**Evidence:** Test 3 regression showed APOs describing docs instead of creating them
**Impact:** Enforces physical file creation with verification

### Location: Lines 704-710

**Current Text:**
```markdown
4. **Apply updates**
   - Add missing methods
   - Fix incorrect signatures
   - Update behavior descriptions
   - Document error cases
   - Document dependencies and ties

5. **Update cross-references**
````

**Replace With:**

````markdown
4. **Apply updates**
   - Add missing methods
   - Fix incorrect signatures
   - Update behavior descriptions
   - Document error cases
   - Document dependencies and ties

5. **Create or update file (MANDATORY):**
   - If file exists: Use Edit tool to modify existing file
   - If file does NOT exist: Use Write tool to create new file
   - After Write/Edit: Use Read tool to verify changes applied

   Example:

   ```typescript
   // For NEW file:
   await write_file('docs/api/component.md', doc_content);
   const verify = await read_file('docs/api/component.md');

   // For EXISTING file:
   await edit_file('docs/api/component.md', old_text, new_text);
   const verify = await read_file('docs/api/component.md');
   ```
````

6. **Update cross-references**

````

**Change Summary:**
- Keep step 4 exactly the same
- Insert new step 5 with explicit Write/Edit tool instructions (14 lines)
- Renumber old step 5 to step 6

---

## Fix #3B: Add Explicit File Creation Instructions to APO-3

**Issue:** APO-3 instructions don't enforce physical file creation
**Evidence:** Same as Fix #3A - APOs might describe instead of create
**Impact:** Enforces file creation with verification workflow

### Location: Lines 827-829

**Current Text:**
```markdown
#### APO-3 Step 3: Create Documentation for Each Component

**For each component, create NEW documentation file:**

**Determine documentation location:**
````

**Replace With:**

````markdown
#### APO-3 Step 3: Create Documentation for Each Component

**For each component, create NEW documentation file using Write tool:**

**CRITICAL: You must physically CREATE files, not just describe them in reports.**

**File creation workflow:**

1. Read component source code and analyze
2. Generate documentation content
3. **Use Write tool to create file at target path**
4. **Use Read tool to verify file exists and has content (>100 bytes)**
5. Only mark as complete if verification passes

Example:

```typescript
// Generate content
const doc_content = generate_docs(component);

// CREATE file
await write_file(target_path, doc_content);

// VERIFY creation
const verify = await read_file(target_path);
if (!verify || verify.length < 100) {
  throw Error(`File creation failed: ${target_path}`);
}
```
````

**Determine documentation location:**

````

**Change Summary:**
- Line 827: Keep title same
- Line 829: Change "create NEW documentation file:" to "create NEW documentation file using Write tool:"
- Insert CRITICAL warning and workflow (17 lines) before "Determine documentation location"

---

## Fix #4: Add Continuation Protocol

**Issue:** Command stops at context limits instead of continuing
**Evidence:** Test 4 stopped at 4.65% and never resumed
**Impact:** Enables automatic continuation through context limits

### Location: Lines 979-994

**Current Text:**
```markdown
### Phase 2 Completion

**All 3 APOs complete their work and generate completion reports.**

**Update global state:**
```json
{
  "currentPhase": "verification",
  "reportsGenerated": [
    "DOCS-UPDATE-AUDIT-iteration-1-2026-01-16.md",
    "APO-1-BASE-UPDATE-COMPLETE-iteration-1-2026-01-16.md",
    "APO-2-BUSINESS-UPDATE-COMPLETE-iteration-1-2026-01-16.md",
    "APO-3-BUSINESS-CREATE-COMPLETE-iteration-1-2026-01-16.md"
  ]
}
````

**Proceed to Phase 3.**

````

**Replace With:**
```markdown
### Phase 2 Completion

**All 3 APOs complete their work and generate completion reports.**

---

### Phase 2 Continuation Protocol

**If context/token limits reached during Phase 2:**

1. **Save progress state:**
   - Record which APOs completed
   - Record which APOs are pending
   - Save to checkpoint report

2. **When resumed:**
   - Read checkpoint report
   - Identify pending APOs from state
   - Resume execution for pending APOs
   - Continue to Phase 3 when all complete

3. **DO NOT:**
   - Stop for user review mid-phase
   - Ask user for permission to continue
   - Wait for confirmation

**Automatic continuation is mandatory per Rule 2.**

---

**Proceed to Phase 3.**

---

**Update global state:**
```json
{
  "currentPhase": "verification",
  "reportsGenerated": [
    "DOCS-UPDATE-AUDIT-iteration-1-2026-01-16.md",
    "APO-1-BASE-UPDATE-COMPLETE-iteration-1-2026-01-16.md",
    "APO-2-BUSINESS-UPDATE-COMPLETE-iteration-1-2026-01-16.md",
    "APO-3-BUSINESS-CREATE-COMPLETE-iteration-1-2026-01-16.md"
  ]
}
````

```

**Change Summary:**
- Keep "Phase 2 Completion" title and first line
- Insert "Phase 2 Continuation Protocol" section (18 lines) before "Proceed to Phase 3"
- Move "Update global state" after "Proceed to Phase 3"

---

## Implementation Checklist

- [ ] Fix #1: Lines 405-409 - Clarify APO-2 handles CREATE or UPDATE
- [ ] Fix #2: Insert after line 1018 - Add filesystem verification step
- [ ] Fix #3A: Lines 704-710 - Add Write/Edit instructions to APO-2
- [ ] Fix #3B: Lines 827-829 - Add creation workflow to APO-3
- [ ] Fix #4: Lines 979-994 - Add continuation protocol

---

## Expected Outcome

### Before Fixes (Test 1):
```

Result: 40.5% coverage, false 100% report
APO-2: Created backend docs ✅
APO-3: Skipped frontend ❌
JUNO: Trusted reports, reported 100% ❌

```

### After Fixes (Test 5 Target):
```

Expected: 100% coverage, accurate report
APO-2: Creates backend AND tightly-coupled frontend docs ✅
APO-3: Creates modular component docs ✅
JUNO: Verifies filesystem, reports REAL percentage ✅
Command: Continues through context limits ✅

```

---

## Notes

- All changes are additive or clarifying (no deletions of working logic)
- Total added lines: ~60 (vs previous bloat of 1,425 lines)
- Each fix is independent - can be applied in any order
- After applying all fixes, run `npm run build` to verify template syntax
- Test with: Run trinity-docs-update on Rinoa test project

---

**Ready for manual application.**
```
