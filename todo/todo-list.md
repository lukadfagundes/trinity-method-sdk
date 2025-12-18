# Trinity Method SDK - TODO List

## CLI Command Optimization

### ⚠️ OPTIMIZE: `update` Command

**File:** `src/cli/commands/update.ts`

**Current Status:** 60% functional - Incomplete implementation

**Issues:**
1. Agent update code is incomplete (cuts off at line 100)
2. No rollback mechanism on failure
3. Limited error handling
4. Incomplete backup/restore logic

**What It Currently Does:**
- ✅ Checks if Trinity is deployed
- ✅ Reads current version from `trinity/VERSION`
- ✅ Compares with SDK package.json version
- ✅ Backs up user files (ARCHITECTURE.md, To-do.md, ISSUES.md)
- ✅ Updates templates and Trinity.md
- ❌ Agent update logic incomplete (stops at line 100)
- ❌ No verification after update
- ❌ No rollback if update fails

**Two Options for Resolution:**

### Option A: Finish Implementation (Recommended if updates are critical)

**Effort:** 1-2 days

**Tasks:**
1. Complete agent update logic (line 100+)
   - Copy all agent files from SDK templates
   - Preserve user customizations (if any)
   - Update .claude/agents/ directory

2. Add rollback mechanism
   - If any update step fails, restore from backup
   - Clean rollback on Ctrl+C

3. Add verification
   - Validate updated files exist
   - Check folder structure integrity
   - Verify version was updated

4. Improve error handling
   - Better error messages
   - Handle file permission issues
   - Handle concurrent update attempts

5. Add dry-run mode validation
   - Actually preview changes (currently broken)

**Implementation Checklist:**
- [ ] Complete agent update code (lines 100+)
- [ ] Add file integrity verification
- [ ] Implement rollback on failure
- [ ] Test update with real project
- [ ] Add progress indicators
- [ ] Handle edge cases (partial updates, conflicts)

---

### Option B: Simplify to Message (Recommended for MVP)

**Effort:** 1 hour

**Approach:**
Replace entire update command with simple message:

```typescript
export async function update(options: UpdateOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🔄 Trinity Method SDK - Update\n'));

  // Check if Trinity exists
  const trinityExists = await fs.pathExists('trinity');
  if (!trinityExists) {
    console.error(chalk.red('❌ Trinity Method not deployed in this project'));
    console.error(chalk.blue('   Use: trinity deploy to install\n'));
    process.exit(1);
  }

  console.log(chalk.yellow('To update Trinity Method:'));
  console.log(chalk.gray('  1. Backup your custom knowledge base files'));
  console.log(chalk.gray('     (trinity/knowledge-base/ARCHITECTURE.md, ISSUES.md, etc.)'));
  console.log(chalk.gray('  2. Run: ') + chalk.cyan('trinity deploy --force'));
  console.log(chalk.gray('  3. Restore your custom files\n'));

  console.log(chalk.blue('💡 This ensures a clean update with latest SDK changes\n'));
}
```

**Benefits:**
- No complex update logic to maintain
- Users get clean deployment
- Forces users to backup custom work
- Simpler mental model

**Tradeoff:**
- Manual backup/restore required
- More steps for user

---

## Recommendation

**Choose Option B (Simplify)** unless you have specific requirements for automated updates.

**Rationale:**
- Update command is rarely used (most users stay on deployed version)
- `deploy --force` already does 95% of update work
- Less code to maintain = fewer bugs
- Users should be deliberate about updates anyway

---

## Related Files to Check

After choosing an option, verify no other code references the update command's expected behavior:

- [ ] Check README.md for update instructions
- [ ] Check documentation files in `docs/`
- [ ] Search for "trinity update" in all .md files
- [ ] Update package.json scripts if any reference update

---

**Priority:** MEDIUM
**Decision Required:** Choose Option A or B
**Assigned To:** TBD
**Due Date:** TBD

---

## Slash Command Integration

### ⚠️ TODO: Integrate EIN Agent into `/trinity-init` Command

**File:** `.claude/commands/trinity-init.md`

**Current Status:** EIN (CI/CD Specialist) agent exists but is not called by any slash command

**Issue:**
- EIN agent (`deployment/ein-cicd.md`) is 1 of 18 agents but has no slash command integration
- `/trinity-init` currently uses TAN → ZEN → INO → JUNO workflow
- EIN is completely skipped despite being a deployment specialist

**What EIN Should Do:**
- Configure CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
- Set up pre-commit hooks for code quality
- Configure automated testing workflows
- Deploy coverage reporting integration
- Set up automated deployment pipelines

**Recommended Integration Point:**
Add EIN as Phase 5 (after JUNO audit):

```
1. TAN - Verify structure
2. ZEN - Populate knowledge base
3. INO - Establish context
4. JUNO - Audit deployment
5. EIN - Configure CI/CD (NEW)
```

**Implementation Tasks:**
- [ ] Review EIN agent persona file (`.claude/agents/deployment/ein-cicd.md`)
- [ ] Add EIN phase to `/trinity-init` command workflow
- [ ] Define specific EIN responsibilities for init workflow
- [ ] Update slash-commands-analysis.md with EIN integration
- [ ] Test `/trinity-init` with EIN included

**Priority:** LOW
**Effort:** 1-2 hours
**Assigned To:** TBD
**Due Date:** TBD

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
