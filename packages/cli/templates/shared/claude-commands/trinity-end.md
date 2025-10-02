---
description: End session and archive work to trinity/archive/
---

End current Trinity Method session and prepare for commit.

**Context:** User is finished with current task and ready to commit, push, or move to next work.

**Process:**
1. **ALY (CTO)** archives session work:
   - Move completed work orders from trinity/work-orders/ to trinity/archive/work-orders/YYYY-MM-DD/
   - Move reports from trinity/reports/ to trinity/archive/reports/YYYY-MM-DD/
   - Move session files from trinity/sessions/ to trinity/archive/sessions/YYYY-MM-DD/
   - Create session summary document in archive

2. **ALY analyzes session events:**
   - Review all work completed during session
   - Identify patterns and learnings
   - Update trinity/knowledge-base/ARCHITECTURE.md with architectural changes
   - Update trinity/knowledge-base/ISSUES.md with new known issues
   - Update trinity/knowledge-base/To-do.md with next tasks
   - Update trinity/knowledge-base/Technical-Debt.md with new debt

3. **Clean workspace:**
   - Verify trinity/work-orders/ is empty
   - Verify trinity/reports/ is empty
   - Verify trinity/sessions/ is empty
   - Ready for next session

**Outcome:**
- All work properly archived with timestamp
- Trinity documents updated with session learnings
- Workspace clean and ready for git operations
- User can safely commit and push

**Note:** Run this before committing your work.
