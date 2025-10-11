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
