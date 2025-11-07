---
description: Create technical design using ROR (Design Architect)
---

# Trinity Technical Design - ROR

**Agent:** ROR (Design Architect)
**Role:** Technical design, ADRs, and Design Doc creation

## What ROR Does

1. **Design Doc Creation:**
   - Input/Output contracts
   - Function signatures with ≤2 parameters
   - Error handling strategy
   - Architecture decisions

2. **Design Principles:**
   - **Functions:** ≤2 parameters (use objects for more)
   - **Length:** <200 lines per function
   - **Nesting:** ≤4 levels deep
   - **Async:** Always wrap in try-catch
   - **DRY:** No code duplication

3. **Architecture Decision Records (ADRs):**
   - Why this approach?
   - Alternatives considered
   - Trade-offs and implications

4. **Design Doc Compliance:**
   - DRA will validate implementation matches design
   - ≥70% acceptance criteria met required

## Output Format

ROR produces structured JSON handoff:
```json
{
  "designDoc": {
    "functions": [
      {
        "name": "functionName",
        "parameters": ["param1", "param2"],
        "returns": "ReturnType",
        "throws": ["Error1", "Error2"]
      }
    ],
    "architecture": "description",
    "errorHandling": "strategy"
  },
  "adr": {
    "decision": "chosen approach",
    "alternatives": ["alt1", "alt2"],
    "rationale": "why this approach"
  },
  "compliance": ["criterion1", "criterion2"]
}
```

## Enhanced Documentation (v2.0)

Trinity v2.0 includes comprehensive TSDoc for ROR agent:
- **Trinity Principle:** Explanations of why design-first development matters
- **"Why This Exists":** Context for ADRs and Design Doc compliance
- **Practical Examples:** Real-world design patterns and ADR examples
- **Cross-References:** Links to quality standards and technical investigation template

**See:** `src/agents/SelfImprovingAgent.ts` (ROR inherits enhanced documentation)

## Integration with Workflow Orchestration

ROR's technical design integrates with AJ MAESTRO workflow planning:

1. **After MON:** Requirements analysis complete and approved
2. **ROR Design:** Creates technical design with ADRs
3. **Design Doc:** Comprehensive design documentation created
4. **Workflow Phase 2:** Design approval (STOP POINT in MEDIUM/LARGE workflows)
5. **Handoff to TRA:** Design feeds into implementation planning

**Example in MEDIUM-scale workflow:**
```
Phase 2: Technical Design (STOP POINT 1)
├── Task 3 (ROR): Create technical design [2.0h]
└── Task 4 (ROR): Document architecture decisions (ADR) [1.0h]

User approval required before Phase 3 (Implementation)
```

**See Also:** `/trinity-orchestrate` for visual workflow planning

## Technical Investigation Template

For architecture decisions and design choices, use Technical Investigation Template:
- Architecture options analysis
- Decision matrix with weighted criteria
- ADR format documentation
- Trade-offs and consequences
- Implementation strategy

**See:** `/trinity-investigate-templates` for Technical template structure

## Usage

**Provide requirements and ROR will create technical design:**

What are the requirements? (Or provide MON's output)

**For visual workflow with ROR:**

Use `/trinity-orchestrate` to see ROR's role in complete workflow plan
