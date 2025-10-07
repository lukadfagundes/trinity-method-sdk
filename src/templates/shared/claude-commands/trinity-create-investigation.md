---
description: Launch the Investigation Wizard to create structured investigations
---

Launch the Trinity Method Investigation Wizard to create a structured investigation interactively.

**Investigation Wizard Flow:**

**Step 1: Investigation Type**
Ask user to select:
- Bug Investigation
- Feature Analysis
- Performance Investigation
- Security Audit
- Technical Debt Assessment
- Architecture Review
- Custom Investigation

**Step 2: Investigation Details**
Gather:
- Investigation title
- Problem statement
- Affected components/files
- Priority (Low/Medium/High/Critical)
- Estimated complexity

**Step 3: Objectives**
Define investigation objectives (numbered list):
- What questions need answering?
- What hypotheses to test?
- What outcomes are expected?

**Step 4: Scope**
Determine investigation scope:
- Files to analyze
- Time constraints
- Resource limits
- Out-of-scope items

**Step 5: Success Criteria**
Define completion criteria:
- What constitutes a successful investigation?
- Required deliverables
- Acceptance criteria

**Step 6: Template Selection**
Offer templates based on investigation type:
- Standard templates (from src/investigation/templates/)
- Custom templates (from user's template library)
- Generate new template

**Step 7: Review & Create**
Show investigation summary and confirm creation.

**Output:**
Create investigation file at:
`trinity/investigations/INV-XXX-{title}.md`

**Post-Creation:**
Ask if user wants to:
- Start investigation immediately
- Generate investigation plan (/trinity-plan-investigation)
- Assign to specific agent
- Schedule for later

**CRITICAL: Investigation Protocol**
⚠️ **INVESTIGATIONS ARE READ-ONLY OPERATIONS**

When executing an investigation:
- **NO file modifications allowed**
- **NO code implementations**
- **NO fixes applied**
- **ONLY analyze, document, and report findings**

Investigation deliverables:
- Findings document (what was discovered)
- Root cause analysis
- Recommendations (what SHOULD be done)
- Impact assessment

**Implementation happens SEPARATELY** only after user explicitly requests it based on investigation findings.
