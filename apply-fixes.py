#!/usr/bin/env python3
"""Apply 4 surgical fixes to trinity-docs-update command"""

import re

template_path = "src/templates/.claude/commands/maintenance/trinity-docs-update.md.template"

with open(template_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix #1: Clarify APO-2 assignment criteria (line ~405)
content = content.replace(
    '**APO-2: Update Existing Business Logic Documentation**',
    '''**APO-2: Tightly-Coupled Business Logic (Create OR Update)**
- **CREATES new docs if none exist, UPDATES if docs exist**
- Decision criteria: COUPLING (not whether docs already exist)'''
)

content = content.replace(
    '  - YES → APO-2 updates existing documentation',
    '  - YES → APO-2 creates OR updates documentation (depending on if docs exist)'
)

# Fix #2: Add filesystem verification to JUNO (after Step 3.1)
step_31_marker = '### Step 3.1: Read APO Completion Reports'
step_32_marker = '### Step 3.2: Comprehensive Alignment Verification'

step_31a = '''
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

3. **Compare counts:**
   - Claimed: X files
   - Verified: Y files
   - If X ≠ Y → Create HIGH severity discrepancies
   - **Use VERIFIED count for alignment calculation (not claimed count)**

---

'''

if step_31a not in content:
    content = content.replace(step_32_marker, step_31a + step_32_marker)

# Fix #3: Add explicit file creation instructions to APO-2 Step 3
apo2_step3 = '''**For each component:**

1. **Read current documentation**
   - Use Read tool on docs file (e.g., `docs/api/refund-service.md`)

2. **Read component source code**'''

apo2_step3_new = '''**For each component:**

1. **Read current documentation**
   - Use Read tool on docs file (e.g., `docs/api/refund-service.md`)
   - If file does NOT exist, note that file must be CREATED

2. **Read component source code**'''

content = content.replace(apo2_step3, apo2_step3_new)

apo2_apply = '''4. **Apply updates**
   - Add missing methods
   - Fix incorrect signatures
   - Update behavior descriptions
   - Document error cases
   - Document dependencies and ties

5. **Update cross-references**'''

apo2_apply_new = '''4. **Apply updates**
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
   await write_file('docs/api/component.md', doc_content)
   const verify = await read_file('docs/api/component.md')

   // For EXISTING file:
   await edit_file('docs/api/component.md', old_text, new_text)
   const verify = await read_file('docs/api/component.md')
   ```

6. **Update cross-references**'''

content = content.replace(apo2_apply, apo2_apply_new)

# Fix #3: Add explicit file creation instructions to APO-3 Step 3
apo3_step3_marker = '#### APO-3 Step 3: Create Documentation for Each Component'
apo3_step4_marker = '#### APO-3 Step 4: Validate Documentation Against Code'

apo3_creation = '''

**For each component, create NEW documentation file:**

**Determine documentation location:**'''

apo3_creation_new = '''

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
const doc_content = generate_docs(component)

// CREATE file
await write_file(target_path, doc_content)

// VERIFY creation
const verify = await read_file(target_path)
if (!verify || verify.length < 100) {
  throw Error(`File creation failed: ${target_path}`)
}
```

**Determine documentation location:**'''

content = content.replace(apo3_creation, apo3_creation_new)

# Fix #4: Add continuation checkpoint (after Phase 2 Completion)
phase2_completion = '''### Phase 2 Completion

**All 3 APOs complete their work and generate completion reports.**'''

continuation = '''

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

---'''

content = content.replace(
    '''### Phase 2 Completion

**All 3 APOs complete their work and generate completion reports.**

**Update global state:**''',
    phase2_completion + continuation + '''

**Update global state:**'''
)

# Write the fixed content
with open(template_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ All 4 fixes applied successfully:")
print("  - Fix #1: APO-2 assignment criteria clarified")
print("  - Fix #2: Filesystem verification added to JUNO Step 3.1A")
print("  - Fix #3: File creation instructions added to APO-2 & APO-3")
print("  - Fix #4: Continuation protocol added to Phase 2")
