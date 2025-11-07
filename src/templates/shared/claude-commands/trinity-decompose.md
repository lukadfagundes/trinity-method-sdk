---
description: Decompose work into atomic tasks using EUS (Task Decomposer)
---

# Trinity Task Decomposition - EUS

**Agent:** EUS (Task Decomposer)
**Role:** Break work into atomic tasks following "1 task = 1 commit" rule

## What EUS Does

1. **Atomic Task Breakdown:**
   - Each task = 1 commit
   - Maximum 2 hours per task
   - Single responsibility per task
   - Clear success criteria

2. **Task Independence:**
   - Minimal cross-dependencies
   - Can be tested in isolation
   - Clear input/output boundaries

3. **Commit Message Planning:**
   - Conventional commits format
   - `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
   - Descriptive and concise

4. **TDD Enforcement:**
   - RED: Write failing test
   - GREEN: Minimal code to pass
   - REFACTOR: Clean up
   - Each cycle = 1 commit

## Output Format

EUS produces structured JSON handoff:
```json
{
  "atomicTasks": [
    {
      "id": 1,
      "description": "Implement validation logic",
      "commitMessage": "feat(validator): add input validation",
      "estimatedTime": "45min",
      "testStrategy": "Unit tests for edge cases",
      "successCriteria": "All validation tests pass",
      "dependencies": []
    }
  ],
  "tddCycles": [
    {
      "test": "test description",
      "implementation": "impl description",
      "refactor": "refactor description"
    }
  ]
}
```

## Enhanced Documentation (v2.0)

Trinity v2.0 includes comprehensive TSDoc for EUS agent:
- **Trinity Principle:** Explanations of why atomic task decomposition matters
- **"Why This Exists":** Context for "1 task = 1 commit" rule and TDD enforcement
- **Practical Examples:** Real-world task decomposition examples
- **Cross-References:** Links to TRA work planning and workflow orchestration

**See:** `src/agents/SelfImprovingAgent.ts` (EUS inherits enhanced documentation)

## Integration with Workflow Orchestration

EUS's task decomposition integrates with AJ MAESTRO workflow planning:

1. **After TRA:** Strategic plan created with high-level tasks
2. **EUS Decomposition:** Breaks tasks into atomic units (1 commit each)
3. **Workflow Execution:** AJ MAESTRO coordinates KIL to execute atomic tasks
4. **TDD Cycles:** Each task follows RED-GREEN-REFACTOR cycle
5. **BAS Quality Gates:** Validate after each atomic task commit

**Example in workflow:**
```
Phase 3: Implementation
├── Task 5 (EUS): Decompose into atomic tasks [0.5h]
│   Output: 12 atomic tasks (45min each)
│   Each task = 1 TDD cycle = 1 commit
│
└── Task 6 (KIL): Implement feature functionality [4.8h]
    ├── Atomic Task 1: Add validation logic → BAS gates
    ├── Atomic Task 2: Create service layer → BAS gates
    ├── Atomic Task 3: Implement error handling → BAS gates
    └── ... (12 tasks total)
```

**See Also:** `/trinity-orchestrate` for visual workflow with task decomposition

## Workflow Task Decomposition

AJ MAESTRO's workflow generator uses EUS-style decomposition:
- **SMALL workflows:** 2-4 atomic tasks
- **MEDIUM workflows:** 6-10 atomic tasks
- **LARGE workflows:** 12-20 atomic tasks

Each atomic task in workflow:
- Maximum 2 hours duration
- Single responsibility
- Clear success criteria
- BAS quality gate validation

**See:** `src/coordination/AJMaestro.ts` for workflow task decomposition logic

## Usage

**Provide implementation plan and EUS will decompose into atomic tasks:**

What is the implementation plan? (Or provide TRA's output)

**For visual workflow with EUS:**

Use `/trinity-orchestrate` to see EUS decomposition in complete workflow plan
