---
description: Analyze requirements using MON (Requirements Analyst)
---

# Trinity Requirements Analysis - MON

**Agent:** MON (Requirements Analyst)
**Role:** Scale determination, acceptance criteria, and requirements documentation

## What MON Does

1. **Scale Determination:**
   - Analyzes task complexity
   - Counts affected files
   - Determines workflow (Small/Medium/Large)

2. **Requirements Documentation:**
   - Captures functional requirements
   - Defines acceptance criteria (testable)
   - Identifies constraints and dependencies

3. **Acceptance Criteria Format:**
   ```
   ✅ Given [context]
   ✅ When [action]
   ✅ Then [expected outcome]
   ```

4. **Risk Assessment:**
   - Breaking changes?
   - Dependencies affected?
   - Performance implications?

## Output Format

MON produces structured JSON handoff:
```json
{
  "scale": "Small|Medium|Large",
  "fileCount": <number>,
  "requirements": ["req1", "req2"],
  "acceptanceCriteria": ["✅ criterion 1", "✅ criterion 2"],
  "risks": ["risk1", "risk2"],
  "dependencies": ["dep1", "dep2"]
}
```

## Enhanced Documentation (v2.0)

Trinity v2.0 includes comprehensive TSDoc for MON agent:
- **Trinity Principle:** Explanations of why requirements analysis matters
- **"Why This Exists":** Context for requirements analysis in investigation workflow
- **Practical Examples:** Real-world requirement analysis examples
- **Cross-References:** Links to quality standards and related components

**See:** `src/agents/SelfImprovingAgent.ts` (MON inherits enhanced documentation)

## Integration with Workflow Orchestration

MON's requirements analysis integrates with AJ MAESTRO workflow planning:

1. **Investigation Start:** User describes task or investigation
2. **MON Analysis:** Determines scale, documents requirements, identifies risks
3. **Workflow Generation:** `/trinity-orchestrate` uses MON's scale determination
4. **Phase 1 of Workflow:** Requirements analysis with acceptance criteria
5. **Handoff to ROR:** Requirements feed into technical design phase

**Example in LARGE-scale workflow:**
```
Phase 1: Requirements Analysis (STOP POINT 1)
├── Task 1 (MON): Analyze functional requirements [1.0h]
└── Task 2 (MON): Analyze non-functional requirements [1.0h] (parallel)

User approval required before Phase 2 (Design)
```

**See Also:** `/trinity-orchestrate` for visual workflow planning

## Quality Standards Reference

MON follows quality standards for requirements documentation:
- Clear acceptance criteria (testable with Given/When/Then)
- Risk identification and mitigation
- Dependency mapping
- Scale determination based on objective criteria

**See:** `docs/quality-standards.md` for complete requirements quality standards

## Usage

**Describe your task and MON will analyze requirements:**

What functionality needs to be implemented?

**For visual workflow with MON:**

Use `/trinity-orchestrate` to see MON's role in complete workflow plan
