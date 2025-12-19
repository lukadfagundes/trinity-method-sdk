---
description: Verify Trinity Method installation completeness
---

Verify that Trinity Method is properly installed in this project.

Check for:
1. **Trinity Core Structure (12 directories):**
   - trinity/knowledge-base/
   - trinity/reports/
   - trinity/sessions/
   - trinity/investigations/
   - trinity/investigations/plans/
   - trinity/patterns/
   - trinity/work-orders/
   - trinity/templates/
   - trinity/archive/work-orders/
   - trinity/archive/investigations/
   - trinity/archive/reports/
   - trinity/archive/sessions/

2. **CLAUDE.md Context Files:**
   - Root CLAUDE.md (behavioral hierarchy)
   - trinity/CLAUDE.md (Trinity-specific context)

3. **Agent Organization (19 agents in 5 subdirectories):**
   - .claude/agents/leadership/ (3 agents: ALY, AJ MAESTRO, AJ CC)
   - .claude/agents/deployment/ (4 agents: TAN, ZEN, INO, EIN)
   - .claude/agents/audit/ (1 agent: JUNO)
   - .claude/agents/planning/ (4 agents: MON, ROR, TRA, EUS)
   - .claude/agents/aj-team/ (7 agents: KIL, BAS, DRA, APO, BON, CAP, URO)

4. **Slash Commands (16 commands):**
   - .claude/commands/ (all Trinity slash commands)

5. **Knowledge Base Files (9 files):**
   - ARCHITECTURE.md, Trinity.md, To-do.md, ISSUES.md, Technical-Debt.md
   - CODING-PRINCIPLES.md, TESTING-PRINCIPLES.md
   - AI-DEVELOPMENT-GUIDE.md, DOCUMENTATION-CRITERIA.md

6. **CI/CD Workflows (if deployed):**
   - .github/workflows/ci.yml (BAS 6-phase quality gates)
   - .github/workflows/cd.yml (Deployment pipeline)

Report:
- ✅ Installed components
- ❌ Missing components
- Deployment completeness percentage
- Next steps if incomplete
