# Investigation Workflow

**Systematic Investigation Process with Trinity SDK**

---

## Overview

Investigation is **always the first step** in Trinity Method. This workflow guides you through systematic investigation using SDK agents.

---

## The 4-Step Investigation Process

### Step 1: Context Establishment

**Goal:** Define problem, current state, success criteria

**SDK Workflow:**
```typescript
User: "Please review .claude/agents/leadership/aly-cto.md to
       investigate [specific problem with context]"
    ↓
ALY: Determines investigation scope
    - Technical investigation needed?
    - Performance investigation needed?
    - UX investigation needed?
    ↓
Creates investigation document: trinity/investigations/YYYY-MM-DD-problem.md
```

**Manual Checklist:**
- [ ] Problem clearly defined
- [ ] Current state documented
- [ ] Success criteria identified
- [ ] Constraints noted

---

### Step 2: Evidence Collection

**Goal:** Gather data to support decisions

**SDK Agents:**
- **ZEN:** Technical analysis (code patterns, architecture, dependencies)
- **BAS:** Performance baselines (response times, bottlenecks)
- **MON:** Requirements (acceptance criteria, user needs)
- **JUNO:** Security assessment (if needed)

**Evidence Types:**
```yaml
Technical Evidence:
  - Current implementation
  - Dependencies
  - Code patterns
  - Security concerns

Performance Evidence:
  - Baseline measurements
  - Bottleneck identification
  - Resource utilization
  - Optimization opportunities

UX Evidence:
  - User workflows
  - Pain points
  - Acceptance criteria
  - Accessibility needs
```

---

### Step 3: Analysis & Synthesis

**Goal:** Understand root cause, evaluate solutions

**ALY Coordinates:**
1. Root cause identification (Why did this happen?)
2. Solution evaluation (What options exist?)
3. Risk assessment (What could go wrong?)
4. Impact analysis (What will change?)

**Deliverable:** Investigation document with:
- Root cause analysis
- Solution options (ranked)
- Recommendation with rationale
- Risk mitigation strategy

---

### Step 4: Decision Documentation

**Goal:** Document chosen approach with justification

**Investigation Document Includes:**
```markdown
## Decision

**Chosen Approach:** [Selected solution]

**Rationale:**
- Evidence supporting this choice
- Why alternatives weren't selected
- Expected outcomes
- Success metrics

**Implementation Plan:**
- High-level steps
- Estimated effort
- Dependencies
- Risks and mitigation

**Next Steps:**
- Move to Implementation Workflow
- Scale: [Small/Medium/Large]
```

---

## Complete Example

See [Investigation-First Complete Methodology](../methodology/investigation-first-complete.md#investigation-methodology) for detailed example.

---

## Related Workflows

- **Next:** [Implementation Workflow](./implementation-workflow.md) (after investigation approved)
- **See Also:** [Session Workflow](./session-workflow.md) (investigation within session)

---

**Investigate thoroughly. Decide with evidence. Implement with confidence.**
