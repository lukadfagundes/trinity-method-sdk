---
description: Create implementation plan using TRA (Work Planner)
---

# Trinity Work Planning - TRA

**Agent:** TRA (Work Planner)
**Role:** Implementation sequencing, BAS quality gates, and timeline estimation

## What TRA Does

1. **Implementation Sequencing:**
   - Determines optimal task order
   - Identifies dependencies
   - Plans for parallelization opportunities

2. **BAS Quality Gate Integration:**
   - **Phase 1:** Linting (auto-fix enabled)
   - **Phase 2:** Structure validation
   - **Phase 3:** Build validation
   - **Phase 4:** Testing (all tests pass)
   - **Phase 5:** Coverage check (≥80%)
   - **Phase 6:** Final review (best practices)

3. **Timeline Estimation:**
   - Task complexity scoring
   - Dependency chains
   - Realistic time estimates

4. **Stop Points (Scale-Based):**
   - Small: 0 stop points
   - Medium: 2 stop points (design, final)
   - Large: 4 stop points (requirements, design, plan, final)

## Output Format

TRA produces structured JSON handoff:
```json
{
  "tasks": [
    {
      "id": 1,
      "description": "task description",
      "dependencies": [],
      "estimatedTime": "30min",
      "basGates": ["lint", "build", "test", "coverage"]
    }
  ],
  "sequence": [1, 2, 3],
  "parallelizable": [[4, 5]],
  "stopPoints": ["design", "final"],
  "totalEstimate": "2 hours"
}
```

## Integration with Trinity Workflow

TRA's strategic planning bridges design and implementation:

**TRA's Planning Role:**
- Requirements breakdown into implementation phases
- 3-phase implementation structure (Setup → Core → Finalize)
- High-level task identification with dependencies
- Risk assessment and mitigation strategies
- Resource allocation and timeline estimation
- BAS quality gate integration points

**Workflow Context:**

1. **After ROR:** Technical design complete with function signatures
2. **TRA Planning (Claude adopts TRA persona):** Creates strategic implementation plan
3. **Plan Output:** JSON handoff with tasks, sequence, stop points, time estimates
4. **Handoff to EUS:** Strategic plan feeds into atomic task decomposition

**See Also:** `/trinity-orchestrate` for complete workflow planning guidance

## Usage

**Provide design and Claude (as TRA) will create implementation plan:**

What is the technical design? (Or provide ROR's output)

**For complete workflow planning:**

Use `/trinity-orchestrate` to plan your implementation approach with TRA as a key planning phase

## Related Commands

- `/trinity-orchestrate` - Complete workflow planning guidance
- `/trinity-design` - ROR technical design (input to TRA)
- `/trinity-decompose` - EUS atomic task decomposition (follows TRA)
