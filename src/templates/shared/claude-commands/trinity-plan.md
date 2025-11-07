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

## Visual Workflow Planning

For interactive workflow planning with visual tree display, use `/trinity-orchestrate`.

AJ MAESTRO generates complete workflow plans with:
- Scale-based phase structures (SMALL/MEDIUM/LARGE)
- Task breakdown with dependencies
- Time estimates and parallelization analysis
- Agent assignments for each task
- Stop points for user approval
- Visual tree structure with color coding

### Plan vs. Workflow

**TRA's Plan (Strategic):**
- Requirements breakdown
- 3-phase implementation structure
- High-level task identification
- Risk assessment
- Resource allocation
- Timeline estimation

**AJ MAESTRO's Workflow (Tactical):**
- Detailed task decomposition
- Dependency resolution
- Parallelization opportunities
- Agent-specific assignments
- Time-boxed estimates
- Visual progress tracking

**Use TRA for strategic planning, AJ MAESTRO for workflow execution visualization.**

**See Also:** `/trinity-orchestrate` for interactive workflow planning with visual tree display

## Usage

**Provide design and TRA will create implementation plan:**

What is the technical design? (Or provide ROR's output)

**For visual workflow generation:**

Use `/trinity-orchestrate` to:
1. Generate visual workflow plan
2. See task dependencies as tree structure
3. View time estimates with parallelization
4. Get interactive approval workflow

## Related Commands

- `/trinity-orchestrate` - Visual workflow planning with AJ MAESTRO
- `/trinity-design` - ROR technical design (input to TRA)
- `/trinity-decompose` - EUS atomic task decomposition

## Source Files

- `src/coordination/AJMaestro.ts` - Workflow plan generator
- `src/coordination/types.ts` - Workflow type definitions
