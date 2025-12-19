---
description: End session and archive work to trinity/archive/
---

End current Trinity Method session and prepare for commit.

**Context:** User is finished with current task and ready to commit, push, or move to next work.

**Process:**
1. **ALY (CTO)** archives session work:
   - Move completed work orders from trinity/work-orders/ to trinity/archive/work-orders/YYYY-MM-DD/
   - Move completed investigations from trinity/investigations/ to trinity/archive/investigations/YYYY-MM-DD/
   - Move reports from trinity/reports/ to trinity/archive/reports/YYYY-MM-DD/
   - Move session files from trinity/sessions/ to trinity/archive/sessions/YYYY-MM-DD/
   - Keep active/in-progress work orders and investigations (don't archive incomplete work)
   - Create session summary document in archive

2. **ALY analyzes session events:**
   - Review all work completed during session
   - Identify patterns and learnings
   - Update trinity/knowledge-base/ARCHITECTURE.md with architectural changes
   - Update trinity/knowledge-base/ISSUES.md with new known issues
   - Update trinity/knowledge-base/To-do.md with next tasks
   - Update trinity/knowledge-base/Technical-Debt.md with new debt

3. **Clean workspace:**
   - Verify trinity/work-orders/ contains only active work
   - Verify trinity/investigations/ contains only active investigations
   - Verify trinity/reports/ is empty
   - Verify trinity/sessions/ is empty
   - Ready for next session

4. **Git commit instructions:**
   After archiving, provide user with commit checklist:

   **For Trinity Method SDK project:**
   - Update version in package.json (semantic versioning)
   - Run `npm run build` to compile changes
   - Run `npm pack` to create tarball
   - Update CHANGELOG.md with changes
   - Git commit with descriptive message
   - Git push to repository

   **For client projects using Trinity:**
   - Review git status for modified files
   - Stage changes: `git add .`
   - Commit with message describing work completed
   - Push to repository: `git push`

**Outcome:**
- All completed work properly archived with timestamp
- Active/in-progress work remains in working directories
- Trinity documents updated with session learnings
- Workspace clean and ready for git operations
- User has clear instructions for version updates and commits

**Note:** Run this before committing your work.

---

## When to Use /trinity-end

### ✅ Use When:

1. **Work Session Complete**
   - All work orders closed
   - All commits pushed
   - Ready to stop working

2. **Major Milestone Reached**
   - Feature complete and merged
   - Sprint completed
   - Release deployed

3. **Context Cleanup Needed**
   - Long session (>4 hours)
   - Multiple work orders completed
   - Knowledge base needs updating

### ❌ Don't Use When:

1. **Mid-Task**
   - Work order still in progress
   - Uncommitted changes
   - Tests failing

2. **Just Pausing**
   - Taking a break (keep context)
   - Switching tasks temporarily
   - Waiting for review

**Instead Use**: `/trinity-continue` when resuming work

---

## Session Summary Example

```markdown
# Session Summary - 2025-12-18

**Duration**: 4 hours 30 minutes
**Work Orders Completed**: 2 (WO-042, WO-043)
**Commits**: 7 commits pushed to main

## Accomplishments

### WO-042: JWT Refresh Token Implementation ✅
- Implemented secure refresh token rotation
- Added HttpOnly cookie support
- 87% test coverage (exceeds 80% threshold)
- All BAS quality gates passed

**Files Changed**: 4 files (service, middleware, types, tests)
**Lines**: +234 additions, -12 deletions

### WO-043: User Profile Editing ✅
- Added profile update endpoint
- Validation for all fields
- Integration tests complete
- Documentation updated

**Files Changed**: 3 files (controller, service, tests)
**Lines**: +156 additions, -8 deletions

## Knowledge Base Updates

**ARCHITECTURE.md**:
- Added OAuth2 refresh token flow diagram
- Documented token rotation strategy

**ISSUES.md**:
- Closed: #42 (JWT refresh), #45 (profile editing)
- Added: #48 (rate limiting for refresh endpoint)

**Technical-Debt.md**:
- Added: Refactor auth service (split into 2 files)
- Resolved: Email validation duplication

## Metrics

- **Velocity**: 2 work orders / 4.5 hours = 0.44 WO/hour
- **Test Coverage**: Maintained 85% average
- **Build Status**: All builds passed
- **Code Quality**: Zero linting errors

## Next Session

**Planned Work Orders**:
- WO-048: Rate limiting implementation
- WO-049: Auth service refactoring

**Estimated Time**: 3-4 hours

---

**Session closed at**: 2025-12-18 18:30
**Knowledge base**: Updated
**All changes**: Committed and pushed
**Status**: ✅ Clean slate for next session
```

---

---

## Knowledge Base Update Checklist

Before ending session, update:

### Required Updates

- [ ] **ARCHITECTURE.md** - New patterns, decisions, diagrams
- [ ] **ISSUES.md** - Close resolved, add new issues found
- [ ] **To-do.md** - Remove completed, add new tasks
- [ ] **Technical-Debt.md** - Add new debt, remove paid down

### Optional Updates (if changed)

- [ ] **CODING-PRINCIPLES.md** - New code standards discovered
- [ ] **TESTING-PRINCIPLES.md** - New testing patterns
- [ ] **AI-DEVELOPMENT-GUIDE.md** - Workflow improvements
- [ ] **DOCUMENTATION-CRITERIA.md** - Doc standards refined

### Quality Check

- [ ] All files have meaningful content (not empty)
- [ ] Timestamps updated
- [ ] References between files are valid
- [ ] No TODO placeholders left

---
