# CC Work Order Execution Protocol

## Overview

The **CC Work Order Execution Protocol** is a structured framework for executing tasks through formalized work orders. This protocol ensures consistency, traceability, and thoroughness in development work.

## Protocol Principles

### 1. Formalization
Every non-trivial task becomes a work order with:
- Unique identifier (WO-XXX)
- Clear objective
- Investigation requirements
- Acceptance criteria

### 2. Investigation-First
Work orders mandate investigation before implementation:
- Understand current state
- Research best practices
- Identify edge cases
- Plan approach

### 3. Documentation
Work orders create persistent knowledge:
- Investigation reports
- Implementation decisions
- Lessons learned
- Pattern extraction

### 4. Verification
Work orders include acceptance criteria:
- Measurable outcomes
- Test requirements
- Quality gates
- Documentation updates

## Work Order Lifecycle

### State 1: Created

**Actions:**
- Work order file created in `trinity/work-orders/`
- WO-XXX number assigned
- Template structure populated
- Added to To-do.md

**File location:**
```
trinity/work-orders/WO-XXX-task-name.md
```

**Status indicators:**
```markdown
Status: CREATED
Created: YYYY-MM-DD
Assigned to: [Agent/Developer]
Priority: [High/Medium/Low]
```

### State 2: In Investigation

**Actions:**
- Investigation phase initiated
- Research conducted
- Findings documented
- Edge cases identified

**Deliverables:**
```
trinity/investigations/YYYY-MM-DD-wo-xxx-topic.md
```

**Status update:**
```markdown
Status: INVESTIGATING
Started: YYYY-MM-DD
Investigation findings: See trinity/investigations/...
```

### State 3: In Implementation

**Actions:**
- Code implementation
- Debugging added
- Tests written
- Documentation updated

**Status update:**
```markdown
Status: IMPLEMENTING
Implementation started: YYYY-MM-DD
Progress: X% complete
```

### State 4: In Review

**Actions:**
- Acceptance criteria verification
- Code review
- Testing validation
- Quality gates passed

**Status update:**
```markdown
Status: IN_REVIEW
Review started: YYYY-MM-DD
Acceptance criteria: X/Y complete
```

### State 5: Complete

**Actions:**
- All acceptance criteria met
- Tests passing
- Documentation updated
- Knowledge captured

**Final status:**
```markdown
Status: COMPLETE
Completed: YYYY-MM-DD
Duration: X days
Lessons learned: [summary or link]
```

### State 6: Archived

**Actions:**
- Session archived to `trinity/archive/`
- Work order marked complete in To-do.md
- Patterns extracted to `trinity/patterns/`

## Work Order Format

### Required Sections

```markdown
# Work Order: WO-XXX - [Title]

## Metadata
- **Status**: [Created/Investigating/Implementing/In Review/Complete]
- **Created**: YYYY-MM-DD
- **Priority**: [High/Medium/Low]
- **Assigned to**: [Name/Role]
- **Estimated effort**: [Hours/Days]

## Objective
[Single clear statement of what needs to be accomplished]

## Background
[Context explaining why this work is needed]

## Requirements
- [ ] Requirement 1 (with rationale)
- [ ] Requirement 2 (with rationale)
- [ ] Requirement 3 (with rationale)

## Investigation Required
1. **Investigation Area 1**
   - Questions to answer
   - Research needed
   - Expected findings

2. **Investigation Area 2**
   - Analysis required
   - Data to collect
   - Decisions to make

## Implementation Steps
1. **Step 1**: [Description]
   - Technical approach
   - Dependencies
   - Risks

2. **Step 2**: [Description]
   - Technical approach
   - Dependencies
   - Risks

## Acceptance Criteria
- [ ] Functional: [Specific measurable outcome]
- [ ] Testing: [Coverage and test requirements]
- [ ] Performance: [Metrics and targets]
- [ ] Documentation: [What needs updating]
- [ ] Quality: [Code quality gates]

## Dependencies
- **Work Orders**: WO-XXX, WO-YYY
- **External**: [Libraries, services, approvals]
- **Technical**: [Infrastructure, tools, access]

## Risks & Mitigation
- **Risk 1**: [Description]
  - Impact: [High/Medium/Low]
  - Mitigation: [Strategy]

## Notes
[Additional context, links, references]

## Progress Log
### YYYY-MM-DD - [Update]
[Progress notes, decisions, blockers]

## Completion Summary
[Filled upon completion]
- Investigation findings: [link]
- Patterns discovered: [link]
- Lessons learned: [summary]
- Follow-up work orders: [list]
```

## Protocol Execution Rules

### Rule 1: All Tasks Are Work Orders

**Applies to:**
- ✅ New features
- ✅ Bug fixes
- ✅ Refactoring
- ✅ Documentation work
- ✅ Infrastructure changes

**Exceptions:**
- ❌ Trivial fixes (<15 minutes)
- ❌ Emergency hotfixes (create WO after)
- ❌ Routine maintenance (bulk into single WO)

### Rule 2: Investigation Is Mandatory

**Every work order must include:**
```markdown
## Investigation Required
1. **Understand Current State**
   - What exists
   - How it works
   - What patterns are used

2. **Research Solutions**
   - Best practices
   - Framework patterns
   - Performance considerations

3. **Identify Edge Cases**
   - Input validation
   - Error scenarios
   - Performance edge cases
```

**Investigation output:**
- Report in `trinity/investigations/`
- Findings documented
- Approach decided

### Rule 3: Acceptance Criteria Before Implementation

**Criteria must be:**
- **Specific**: Exact outcome defined
- **Measurable**: Can verify completion
- **Achievable**: Within scope and time
- **Relevant**: Aligns with objective
- **Time-bound**: Clear completion point

**Example:**
```markdown
## Acceptance Criteria
✅ Good:
- [ ] API responds in <100ms for 95th percentile
- [ ] All 15 test cases pass including 5 edge cases
- [ ] Zero console errors in production build
- [ ] API documentation updated with 3 new endpoints

❌ Bad:
- [ ] API is fast
- [ ] Tests pass
- [ ] No errors
- [ ] Documentation updated
```

### Rule 4: Progress Tracking

**Update work order regularly:**
```markdown
## Progress Log

### 2025-10-01 - Investigation Complete
- Completed current state analysis
- Researched 3 solution approaches
- Identified 8 edge cases
- Decision: Using approach B for performance

### 2025-10-02 - Implementation 50%
- Core functionality complete
- 5/8 edge cases handled
- Tests written for main flow
- Blocker: Waiting on WO-125 completion

### 2025-10-03 - Implementation Complete
- All edge cases handled
- 15 tests passing (92% coverage)
- Documentation updated
- Ready for review
```

### Rule 5: Knowledge Capture

**Upon completion:**
```markdown
## Completion Summary

### Investigation Findings
- Link: trinity/investigations/2025-10-01-auth-system.md
- Key finding: JWT rotation needed for security
- Key finding: Session storage better than localStorage

### Patterns Discovered
- Link: trinity/patterns/jwt-refresh-pattern.md
- Pattern: Automatic token refresh
- Applicability: All auth flows

### Lessons Learned
- Lesson: Auth library has breaking changes in v9
- Lesson: Test fixtures need auth context
- Lesson: Logout cleanup critical for security

### Follow-up Work Orders
- WO-135: Implement logout cleanup (discovered gap)
- WO-136: Migrate to auth library v9 (compatibility)
```

## Work Order Numbering

### Numbering Scheme

```
WO-XXX-descriptive-name.md

Where:
- WO = Work Order prefix
- XXX = Sequential number (001, 002, etc.)
- descriptive-name = Kebab-case description
```

**Examples:**
```
WO-001-initial-deployment.md
WO-015-user-authentication.md
WO-042-performance-optimization.md
WO-100-payment-integration-epic.md
```

### Numbering Rules

1. **Sequential**: Numbers assigned in order
2. **No gaps**: Don't skip numbers
3. **No reuse**: Deleted WOs keep their number
4. **Prefixes for types** (optional):
   ```
   WO-XXX = Standard work order
   EPIC-XXX = Epic work order (parent of multiple WOs)
   SPIKE-XXX = Investigation-only work order
   ```

## Work Order Types

### Standard Work Order

**Purpose:** Regular development tasks

**Template:** Full format (shown above)

**Example:**
```markdown
# Work Order: WO-023 - Implement User Search

## Objective
Add search functionality to user management dashboard

## Investigation Required
1. Research search algorithms
2. Analyze database indexing
3. Identify performance requirements

[... rest of template ...]
```

### Epic Work Order

**Purpose:** Large initiatives spanning multiple WOs

**Template:**
```markdown
# Work Order: EPIC-001 - User Management System

## Objective
Complete user management functionality

## Child Work Orders
- [ ] WO-020: User data model
- [ ] WO-021: User CRUD API
- [ ] WO-022: User authentication
- [ ] WO-023: User search
- [ ] WO-024: User permissions

## Epic Acceptance Criteria
- [ ] All child WOs complete
- [ ] Integration tests pass
- [ ] System test passed
- [ ] Documentation complete

## Epic Status
Status: IN_PROGRESS
Completed: 2/5 child WOs
Progress: 40%
```

### Spike Work Order

**Purpose:** Pure investigation/research

**Template:**
```markdown
# Work Order: SPIKE-005 - Database Performance Analysis

## Objective
Investigate database performance issues and recommend solutions

## Investigation Required
1. Profile slow queries
2. Analyze index usage
3. Research optimization strategies

## Deliverables
- Performance investigation report
- Recommended optimizations
- Implementation work orders

## Acceptance Criteria
- [ ] Root causes identified
- [ ] Report in trinity/investigations/
- [ ] 3+ optimization recommendations
- [ ] Follow-up WOs created

[No implementation section - investigation only]
```

## Integration with Development Workflow

### Agile/Scrum Integration

**Sprint Planning:**
```markdown
1. Review work order backlog
2. Estimate WO effort
3. Assign WOs to sprint
4. Break large WOs if needed
```

**Daily Standup:**
```markdown
Yesterday: Completed investigation for WO-023
Today: Starting implementation for WO-023
Blockers: WO-023 blocked by WO-022 completion
```

**Sprint Review:**
```markdown
- Completed WOs: WO-020, WO-021, WO-022
- In-progress: WO-023 (80% complete)
- Blocked: WO-024 (waiting on WO-023)
```

### Git Integration

**Branch naming:**
```bash
git checkout -b wo-023-user-search
```

**Commit messages:**
```bash
git commit -m "WO-023: Implement user search API endpoint

- Add search endpoint with filtering
- Implement database query optimization
- Add 8 test cases covering edge cases

Work Order: trinity/work-orders/WO-023-user-search.md"
```

**Pull request:**
```markdown
## Work Order: WO-023 - User Search

### Objective
Implement user search functionality

### Changes
- New endpoint: GET /api/users/search
- Database indexes added
- 15 new tests (95% coverage)

### Acceptance Criteria Status
- [x] Search returns results in <100ms
- [x] All 15 tests pass
- [x] Zero console errors
- [x] API docs updated

### Investigation Report
trinity/investigations/2025-10-02-user-search-implementation.md

### Work Order
trinity/work-orders/WO-023-user-search.md
```

## Quality Metrics

### Work Order Health Metrics

```javascript
const workOrderMetrics = {
  // Completion metrics
  cycleTime: '2.5 days',           // Average WO completion time
  completionRate: '95%',           // % of WOs completed vs created

  // Quality metrics
  investigationCompliance: '100%', // % with investigation report
  acceptanceCriteriaMet: '98%',   // % meeting all criteria
  defectEscapeRate: '2%',         // % with post-completion bugs

  // Process metrics
  investigationTime: '25%',        // % of time on investigation
  implementationTime: '55%',       // % of time on implementation
  reviewTime: '20%'               // % of time on review/testing
};
```

### Protocol Compliance

**Monitor compliance:**
```markdown
## Monthly Work Order Audit

### Protocol Compliance
- Work orders created: 45
- With investigation reports: 45 (100%) ✅
- With acceptance criteria: 45 (100%) ✅
- Meeting criteria: 44 (98%) ✅
- With progress updates: 42 (93%) ⚠️
- With completion summary: 43 (96%) ✅

### Action Items
- [ ] Reminder for progress updates
- [ ] Template update for easier tracking
```

## Best Practices

### DO:

✅ **Create work orders for all non-trivial work**
✅ **Complete investigation before implementation**
✅ **Write specific, measurable acceptance criteria**
✅ **Update progress regularly**
✅ **Capture knowledge upon completion**
✅ **Reference WO numbers in commits/PRs**
✅ **Archive completed WOs**

### DON'T:

❌ **Skip investigation phase**
❌ **Start implementation before WO created**
❌ **Leave acceptance criteria vague**
❌ **Let WOs go stale without updates**
❌ **Delete completed WOs (archive instead)**
❌ **Create WOs too large (>1 week)**
❌ **Ignore work order dependencies**

## Troubleshooting

### Problem: Work orders taking too long

**Solution:**
```markdown
1. Check work order sizing
   - Target: 1-3 days
   - Split if >5 days

2. Review investigation time
   - Target: 20-30% of total
   - Time-box appropriately

3. Check dependencies
   - Blocked WOs?
   - Resolve blockers first
```

### Problem: Low investigation quality

**Solution:**
```markdown
1. Use investigation templates
   - Provides structure
   - Ensures completeness

2. Set investigation requirements
   - Minimum sections required
   - Review before implementation

3. Share good examples
   - Show quality investigations
   - Learn from patterns
```

### Problem: Acceptance criteria not met

**Solution:**
```markdown
1. Review criteria specificity
   - Are they measurable?
   - Are they achievable?

2. Check mid-work verification
   - Verify criteria during work
   - Don't wait until end

3. Update criteria if needed
   - Document changes
   - Justify adjustments
```

## See Also

- [Work Orders Guide](../guides/work-orders.md)
- [Investigation-First Methodology](investigation-first.md)
- [Getting Started](../getting-started.md)
- [Slash Commands](../guides/slash-commands.md)
