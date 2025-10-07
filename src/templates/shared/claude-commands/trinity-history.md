---
description: View Trinity session history and archived investigations
---

Display Trinity Method session history and archived investigations.

**History Sources:**
- Active investigations (trinity/investigations/)
- Archived sessions (trinity/archive/)
- Investigation registry (src/investigation/InvestigationRegistry.ts)

**Display Options:**

1. **Recent Sessions**
   - Last 10 sessions with dates
   - Session duration
   - Agents involved
   - Outcomes

2. **Investigation Archive**
   - All completed investigations
   - Filter by: type, agent, date, status
   - Success/failure rates
   - Lessons learned

3. **Timeline View**
   - Chronological investigation history
   - Major milestones
   - Pattern evolution

**For Each Investigation:**
```
INV-042 | Performance Investigation | 2025-10-05
Status: Completed
Duration: 3h 24m
Agents: Aly, AJ, JUNO
Outcome: Identified N+1 query issue, implemented caching
Files Modified: 7
Success: ✅
```

**Interactive Options:**
Ask user:
- View specific investigation details
- Re-open archived investigation
- Export history to JSON/Markdown
- Search investigations by keyword
- Generate investigation summary report
- Compare investigations (side-by-side)

**Filters:**
- Date range
- Investigation type
- Agent
- Status (completed/abandoned/in-progress)
- Success/failure
- Tags/labels

**Statistics:**
- Total investigations: X
- Success rate: Y%
- Average duration: Z hours
- Most active agent
- Most common investigation types
