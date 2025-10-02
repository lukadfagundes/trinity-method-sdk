# Investigation-First Development Methodology

## Core Principle

**Investigate before you implement.**

The Trinity Method's foundational principle is simple: every development task begins with structured investigation. This investigation-first approach transforms reactive coding into deliberate, informed development.

## Why Investigation-First?

### Traditional Approach Problems

```javascript
// Traditional: Jump straight to coding
function addFeature() {
  // Start typing code immediately
  // Hope it works
  // Debug when it breaks
  // Repeat until it works
}
```

**Problems:**
- ❌ Assumptions not validated
- ❌ Edge cases discovered during debugging
- ❌ Architecture decisions made ad-hoc
- ❌ Technical debt accumulates
- ❌ Knowledge lost between sessions

### Investigation-First Approach

```javascript
// Trinity Method: Investigate first
function addFeature() {
  // 1. INVESTIGATE: Understand current system
  // 2. INVESTIGATE: Research best practices
  // 3. INVESTIGATE: Identify edge cases
  // 4. PLAN: Design approach
  // 5. IMPLEMENT: With confidence and context
  // 6. VERIFY: Against investigation findings
}
```

**Benefits:**
- ✅ Informed decisions
- ✅ Edge cases handled proactively
- ✅ Architecture consistency
- ✅ Reduced technical debt
- ✅ Knowledge preserved

## The Investigation Process

### Phase 1: Understand Current State

**Ask these questions:**
```markdown
1. What exists today?
   - Current implementation
   - Related components
   - Dependencies

2. How does it work?
   - Data flow
   - Control flow
   - Error handling

3. What patterns are in use?
   - Architecture patterns
   - Code conventions
   - Testing approaches
```

**Document findings:**
```bash
trinity/investigations/YYYY-MM-DD-understand-current-auth.md
```

### Phase 2: Research Requirements

**Research areas:**
```markdown
1. User Requirements
   - What problem are we solving?
   - Who is affected?
   - Success metrics?

2. Technical Requirements
   - Performance expectations?
   - Security requirements?
   - Compatibility needs?

3. Business Requirements
   - Timeline constraints?
   - Resource limitations?
   - Compliance needs?
```

### Phase 3: Explore Solutions

**Investigate options:**
```markdown
1. Industry Best Practices
   - How do others solve this?
   - What are common pitfalls?
   - Proven patterns?

2. Framework-Specific Approaches
   - Does framework provide solution?
   - Community recommendations?
   - Performance considerations?

3. Project-Specific Constraints
   - What fits our architecture?
   - Team expertise level?
   - Maintenance implications?
```

### Phase 4: Identify Edge Cases

**Critical investigation step:**
```markdown
1. Input Validation
   - Empty inputs?
   - Invalid formats?
   - Boundary conditions?

2. Error Scenarios
   - Network failures?
   - Database errors?
   - Third-party failures?

3. Performance Edge Cases
   - Large datasets?
   - Concurrent users?
   - Resource limits?

4. Security Edge Cases
   - Injection attacks?
   - Authentication bypass?
   - Data exposure?
```

### Phase 5: Plan Approach

**Design with investigation insights:**
```markdown
1. Architecture Decision
   - Based on findings from Phase 1-4
   - Document rationale
   - Consider alternatives

2. Implementation Strategy
   - Step-by-step plan
   - Risk mitigation
   - Testing approach

3. Success Criteria
   - Measurable outcomes
   - Performance targets
   - Quality gates
```

## Investigation Templates

### Feature Investigation Template

```markdown
# Feature Investigation: [Feature Name]

## Current State Analysis

### Existing Implementation
- What exists: [description]
- How it works: [flow]
- Related components: [list]

### Patterns in Use
- Architecture: [pattern]
- Data management: [approach]
- Error handling: [strategy]

## Requirements Research

### User Requirements
- Problem: [description]
- Users affected: [who]
- Success metrics: [measures]

### Technical Requirements
- Performance: [targets]
- Security: [requirements]
- Compatibility: [needs]

## Solution Exploration

### Industry Best Practices
- Common approaches: [list]
- Pitfalls to avoid: [list]
- Recommended patterns: [list]

### Framework-Specific
- Built-in solutions: [options]
- Community recommendations: [links]
- Performance considerations: [notes]

## Edge Case Analysis

### Input Edge Cases
- [ ] Empty/null inputs
- [ ] Invalid formats
- [ ] Boundary values
- [ ] Unicode/special characters

### Error Scenarios
- [ ] Network failures
- [ ] Database errors
- [ ] Authentication failures
- [ ] Rate limiting

### Performance Edge Cases
- [ ] Large datasets (>10k items)
- [ ] Concurrent users (>100)
- [ ] Memory constraints
- [ ] Slow network conditions

### Security Edge Cases
- [ ] SQL injection
- [ ] XSS attacks
- [ ] CSRF vulnerabilities
- [ ] Authorization bypass

## Implementation Plan

### Approach
[Detailed implementation approach based on investigation]

### Steps
1. Step 1: [description]
2. Step 2: [description]
3. Step 3: [description]

### Risks & Mitigation
- Risk 1: [description] → Mitigation: [strategy]
- Risk 2: [description] → Mitigation: [strategy]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All edge cases handled
- [ ] Tests pass (>80% coverage)
- [ ] Performance targets met
```

### Bug Investigation Template

```markdown
# Bug Investigation: [Bug Description]

## Bug Report

### Symptoms
- What's broken: [description]
- Error message: [exact text]
- When it occurs: [conditions]
- Impact: [severity]

### Reproduction Steps
1. Step 1
2. Step 2
3. Step 3
Result: [what happens]

## Investigation Process

### 1. Reproduce Bug
- [ ] Reproduced locally
- [ ] Identified minimal reproduction
- [ ] Documented exact steps
- [ ] Captured error details

### 2. Isolate Root Cause
- Component affected: [name]
- Code location: [file:line]
- Recent changes: [commits]
- Dependencies: [list]

### 3. Understand Impact
- Users affected: [count/percentage]
- Data affected: [scope]
- Workarounds available: [yes/no]
- Urgency: [high/medium/low]

## Root Cause Analysis

### What Happened
[Technical explanation of the bug]

### Why It Happened
[Root cause - code defect, logic error, edge case, etc.]

### Why It Wasn't Caught
- [ ] Missing test coverage
- [ ] Insufficient edge case handling
- [ ] Integration testing gap
- [ ] Manual testing oversight

## Fix Strategy

### Immediate Fix
[Quick fix to resolve symptoms]

### Permanent Solution
[Proper fix addressing root cause]

### Prevention
[Changes to prevent recurrence]

## Testing Plan
- [ ] Unit test for bug scenario
- [ ] Integration test for workflow
- [ ] Regression test suite
- [ ] Manual verification

## Rollout Plan
- [ ] Fix implemented
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Staged deployment
- [ ] Production deployment
- [ ] Monitoring in place
```

### Performance Investigation Template

```markdown
# Performance Investigation: [Component/Feature]

## Performance Issue

### Symptoms
- Slow operation: [what]
- Time taken: [actual]
- Expected time: [target]
- Impact: [users/processes affected]

## Baseline Measurements

### Current Performance
- Average: [Xms]
- 95th percentile: [Xms]
- 99th percentile: [Xms]
- Max: [Xms]

### Target Performance
- Average: [Xms]
- 95th percentile: [Xms]
- 99th percentile: [Xms]
- Max: [Xms]

## Investigation Steps

### 1. Profiling
- [ ] Browser/Node profiler run
- [ ] Network waterfall analysis
- [ ] Database query profiling
- [ ] Memory usage tracking

### 2. Bottleneck Identification
- CPU hotspots: [findings]
- Memory issues: [findings]
- Network delays: [findings]
- Database queries: [findings]

### 3. Code Analysis
- Inefficient algorithms: [list]
- Unnecessary re-renders: [components]
- N+1 queries: [locations]
- Memory leaks: [suspects]

## Optimization Opportunities

### High Impact
1. [Optimization] - Expected gain: [X%]
2. [Optimization] - Expected gain: [X%]

### Medium Impact
1. [Optimization] - Expected gain: [X%]

### Low Impact / High Risk
1. [Optimization] - Expected gain: [X%], Risk: [description]

## Implementation Plan

### Phase 1: Quick Wins
[Low-risk, high-impact optimizations]

### Phase 2: Structural Improvements
[Architecture changes, refactoring]

### Phase 3: Advanced Optimizations
[Complex changes, higher risk]

## Validation Plan
- [ ] Performance benchmarks created
- [ ] Optimization implemented
- [ ] Benchmarks re-run
- [ ] Improvement verified
- [ ] No regressions introduced
```

## Investigation Outputs

### Documentation

Every investigation produces:

1. **Investigation Report**
   - Location: `trinity/investigations/YYYY-MM-DD-topic.md`
   - Format: Structured markdown
   - Content: Findings, decisions, rationale

2. **Pattern Extraction**
   - Location: `trinity/patterns/pattern-name.md`
   - Content: Reusable solutions discovered
   - Application: Future similar problems

3. **Knowledge Base Update**
   - Location: `trinity/knowledge-base/`
   - Content: Architecture updates, lessons learned
   - Purpose: Long-term knowledge retention

### Code Artifacts

Investigation informs:

1. **Implementation Code**
   - Informed by investigation
   - Handles identified edge cases
   - Follows discovered patterns

2. **Debugging Implementation**
   - Based on investigation insights
   - Captures key metrics
   - Validates assumptions

3. **Test Cases**
   - Cover edge cases from investigation
   - Verify assumptions
   - Prevent regressions

## Investigation Quality

### Good Investigation Characteristics

✅ **Thorough:**
- All relevant areas explored
- Edge cases identified
- Alternatives considered

✅ **Documented:**
- Findings recorded
- Decisions justified
- Knowledge preserved

✅ **Actionable:**
- Clear next steps
- Implementation plan
- Success criteria defined

✅ **Efficient:**
- Time-boxed appropriately
- Focused on critical questions
- Avoids analysis paralysis

### Poor Investigation Warning Signs

❌ **Insufficient:**
- Assumptions not validated
- Edge cases overlooked
- Rushed to implementation

❌ **Undocumented:**
- Knowledge in head only
- No rationale captured
- Not reusable

❌ **Theoretical:**
- No practical plan
- Vague recommendations
- No clear path forward

❌ **Endless:**
- Analysis paralysis
- Diminishing returns
- No decision made

## Time-Boxing Investigations

### Investigation Time Guidelines

```javascript
const investigationTime = {
  // Small feature/bug
  simple: {
    investigation: '30 minutes',
    implementation: '2-4 hours',
    ratio: '1:4'  // 20% investigation
  },

  // Medium feature/refactor
  medium: {
    investigation: '2-4 hours',
    implementation: '1-2 days',
    ratio: '1:4'  // 25% investigation
  },

  // Large feature/architecture
  large: {
    investigation: '1-2 days',
    implementation: '1-2 weeks',
    ratio: '1:5'  // 20% investigation
  },

  // Complex system design
  complex: {
    investigation: '3-5 days',
    implementation: '2-4 weeks',
    ratio: '1:4'  // 25% investigation
  }
};
```

### When to Stop Investigating

**Stop investigating when:**
1. ✅ Core questions answered
2. ✅ Edge cases identified
3. ✅ Implementation plan clear
4. ✅ Risks understood
5. ✅ Success criteria defined

**Don't stop if:**
1. ❌ Critical unknowns remain
2. ❌ No clear approach identified
3. ❌ Edge cases still surfacing
4. ❌ Contradictory information

## Investigation-First Benefits

### Immediate Benefits

**Fewer bugs:**
- Edge cases handled upfront
- Assumptions validated early
- Risks identified before coding

**Faster development:**
- Clear direction from start
- Fewer false starts
- Reduced debugging time

**Better code quality:**
- Informed architecture decisions
- Consistent with existing patterns
- Proper error handling

### Long-Term Benefits

**Knowledge retention:**
- Documented investigations persist
- Patterns identified and reused
- Team learning accumulates

**Reduced technical debt:**
- Deliberate decisions vs ad-hoc
- Proper solutions vs quick fixes
- Maintainability considered upfront

**Team efficiency:**
- New members learn from investigations
- Reduced "why did we do this?" questions
- Consistent approach across team

## Common Objections

### "Investigation takes too much time"

**Response:**
- Investigation is 20-30% of total time
- Saves 2-3x in debugging later
- Prevents costly rewrites

**Example:**
```
Without investigation:
- Jump to code: 1 hour
- Debug issues: 4 hours
- Refactor for edge cases: 3 hours
Total: 8 hours

With investigation:
- Investigation: 2 hours
- Informed implementation: 4 hours
- Minor fixes: 1 hour
Total: 7 hours (12.5% faster)
```

### "We know how to solve this already"

**Response:**
- Quick investigation validates assumptions
- Even simple problems have edge cases
- Documentation still valuable

**Minimum investigation:**
```markdown
## Quick Investigation

### Assumptions
- Assumption 1: [validate]
- Assumption 2: [validate]

### Edge Cases
- [ ] Edge case 1
- [ ] Edge case 2

### Approach
[Confirm plan]

Time: 15 minutes
```

### "Requirements will change anyway"

**Response:**
- Investigation reveals what might change
- Flexible design from understanding
- Documentation guides changes

**Investigation output:**
```markdown
## Change Flexibility

### Likely Changes
- Change 1: [how to accommodate]
- Change 2: [how to accommodate]

### Design Decisions
- Decision 1: [allows for X change]
- Decision 2: [enables Y flexibility]
```

## See Also

- [Work Orders Guide](../guides/work-orders.md)
- [Investigation Templates](../../trinity/templates/)
- [Pattern Library](pattern-library.md)
- [CC Work Order Protocol](cc-work-order-protocol.md)
