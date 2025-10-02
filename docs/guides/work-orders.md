# Trinity Method Work Orders Guide

## What is a Work Order?

A **Trinity Work Order** is a formalized task specification that uses the CC Work Order Execution Protocol. Work orders provide:

- **Structured task definition** with clear objectives
- **Investigation requirements** before implementation
- **Acceptance criteria** for completion verification
- **Traceability** through numbered system (WO-001, WO-002, etc.)
- **Consistency** across development sessions

## Work Order Structure

### Required Sections

```markdown
# Work Order: WO-XXX - [Task Title]

## Objective
[Clear, concise statement of what needs to be accomplished]

## Background
[Context and rationale for this work]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Investigation Required
1. **Investigation Point 1**
   - What to investigate
   - Why it matters
   - Expected findings

2. **Investigation Point 2**
   - Research needed
   - Analysis required
   - Documentation to review

## Implementation Steps
1. Step 1 - [Description]
2. Step 2 - [Description]
3. Step 3 - [Description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Tests pass
- [ ] Documentation updated

## Dependencies
- Work Order: WO-XXX (if applicable)
- External: [Any external dependencies]

## Notes
[Additional context, risks, considerations]
```

## Creating Work Orders

### Using the Slash Command (Recommended)

```bash
/trinity-workorder
```

This interactive command:
1. Prompts for task details
2. Generates proper WO-### number
3. Creates file in `trinity/work-orders/`
4. Enforces correct format
5. Updates tracking

### Manual Creation

If creating manually:

1. **Determine next WO number:**
   ```bash
   ls trinity/work-orders/ | grep "WO-" | tail -1
   # If last is WO-015, create WO-016
   ```

2. **Create file:**
   ```bash
   touch trinity/work-orders/WO-016-feature-name.md
   ```

3. **Use template structure** (shown above)

4. **Update To-do.md:**
   Add work order to `trinity/knowledge-base/To-do.md`

## Work Order Types

### Feature Work Orders

**Purpose:** New functionality implementation

**Example:**
```markdown
# Work Order: WO-023 - Add User Authentication

## Objective
Implement JWT-based user authentication system

## Investigation Required
1. **Security Best Practices**
   - Review OWASP authentication guidelines
   - Research JWT token expiration strategies
   - Analyze session management patterns

2. **Existing Infrastructure**
   - Check current database schema
   - Identify authentication libraries
   - Review API structure
```

### Bug Fix Work Orders

**Purpose:** Resolve identified issues

**Example:**
```markdown
# Work Order: WO-024 - Fix Memory Leak in Dashboard

## Objective
Eliminate memory leak causing dashboard performance degradation

## Investigation Required
1. **Reproduce Issue**
   - Identify exact reproduction steps
   - Measure memory growth rate
   - Capture performance profiles

2. **Root Cause Analysis**
   - Review component lifecycle
   - Check event listener cleanup
   - Analyze dependency updates
```

### Refactoring Work Orders

**Purpose:** Code quality improvements

**Example:**
```markdown
# Work Order: WO-025 - Refactor API Service Layer

## Objective
Consolidate duplicate API calls into reusable service layer

## Investigation Required
1. **Code Analysis**
   - Identify all API call locations
   - Map duplicate patterns
   - Analyze error handling approaches

2. **Design Patterns**
   - Research repository pattern
   - Review service abstraction strategies
   - Plan testing approach
```

### Documentation Work Orders

**Purpose:** Documentation creation/updates

**Example:**
```markdown
# Work Order: WO-026 - Create API Documentation

## Objective
Generate comprehensive API documentation using OpenAPI

## Investigation Required
1. **Documentation Tools**
   - Compare Swagger vs Redoc
   - Review auto-generation options
   - Research CI/CD integration

2. **API Coverage**
   - Audit all endpoints
   - Check parameter documentation
   - Verify response schemas
```

## Work Order Workflow

### 1. Creation Phase

```bash
# Create work order
/trinity-workorder

# Review and refine
# Edit trinity/work-orders/WO-XXX-name.md

# Commit to repository
git add trinity/work-orders/WO-XXX-name.md
git commit -m "Add WO-XXX: [Task title]"
```

### 2. Investigation Phase

```bash
# Start session
/trinity-start

# Reference work order
# "Execute work order WO-XXX"

# Conduct investigations
# Document findings in trinity/investigations/
```

### 3. Implementation Phase

```bash
# Follow implementation steps from WO
# Create debugging implementations
# Write tests
# Update documentation
```

### 4. Completion Phase

```bash
# Verify acceptance criteria
# Run test suite
# Update work order status
# Archive session
/trinity-end
```

## Best Practices

### Investigation-First Approach

**Always investigate before implementing:**

```markdown
## Investigation Required
1. **Understand Current State**
   - Review existing implementation
   - Identify patterns in use
   - Document current behavior

2. **Research Best Practices**
   - Industry standards
   - Framework-specific patterns
   - Performance considerations

3. **Plan Approach**
   - Design document
   - Test strategy
   - Rollback plan
```

### Clear Acceptance Criteria

**Make criteria measurable and specific:**

✅ **Good:**
```markdown
## Acceptance Criteria
- [ ] Authentication completes in <100ms
- [ ] All 15 test cases pass
- [ ] Security audit shows no vulnerabilities
- [ ] API documentation updated with auth endpoints
- [ ] Error handling covers 5 failure scenarios
```

❌ **Bad:**
```markdown
## Acceptance Criteria
- [ ] Authentication works
- [ ] Tests pass
- [ ] Documentation updated
```

### Dependency Management

**Track dependencies explicitly:**

```markdown
## Dependencies
- **Work Orders:**
  - WO-015 (User model refactor) - MUST COMPLETE FIRST
  - WO-018 (API versioning) - BLOCKING

- **External:**
  - JWT library update to v9.0
  - Database migration approval
  - Security team review
```

### Sizing Work Orders

**Keep work orders focused and achievable:**

- ✅ **1-3 days of work** (ideal)
- ⚠️ **4-5 days of work** (acceptable, consider splitting)
- ❌ **>1 week of work** (too large, must split)

**Split large work orders:**
```markdown
WO-030: User Management System (TOO LARGE)

Split into:
WO-030: User Model and Database Schema
WO-031: User Registration API
WO-032: User Authentication System
WO-033: User Profile Management
WO-034: User Permissions Framework
```

## Work Order Templates

### Quick Feature Template

```markdown
# Work Order: WO-XXX - [Feature Name]

## Objective
Implement [feature] to [achieve goal]

## Investigation Required
1. Research [topic]
2. Analyze [existing code]
3. Design [approach]

## Implementation Steps
1. Create [component]
2. Implement [logic]
3. Add tests
4. Update docs

## Acceptance Criteria
- [ ] Feature works as specified
- [ ] Tests pass (>80% coverage)
- [ ] Documentation updated
- [ ] No console errors
```

### Quick Bug Fix Template

```markdown
# Work Order: WO-XXX - Fix [Bug]

## Objective
Resolve [bug] causing [problem]

## Investigation Required
1. Reproduce bug
2. Identify root cause
3. Plan fix approach

## Implementation Steps
1. Fix root cause
2. Add regression test
3. Verify fix

## Acceptance Criteria
- [ ] Bug no longer reproduces
- [ ] Regression test added
- [ ] Related bugs checked
```

## Advanced Work Order Patterns

### Epic Work Orders

For large initiatives, create an "epic" WO that references child WOs:

```markdown
# Work Order: WO-100 - Payment System Integration [EPIC]

## Objective
Complete integration with Stripe payment processing

## Child Work Orders
- [ ] WO-101: Payment model design
- [ ] WO-102: Stripe API integration
- [ ] WO-103: Payment UI components
- [ ] WO-104: Webhook handling
- [ ] WO-105: Payment testing suite
- [ ] WO-106: Payment documentation

## Epic Acceptance Criteria
- [ ] All child WOs complete
- [ ] Integration tests pass
- [ ] Security audit passed
- [ ] Production deployment successful
```

### Investigative Work Orders

For research-heavy tasks:

```markdown
# Work Order: WO-120 - Performance Investigation

## Objective
Identify and document causes of slow dashboard performance

## Investigation Required
1. **Performance Profiling**
   - Chrome DevTools analysis
   - Lighthouse audits
   - React Profiler analysis

2. **Code Analysis**
   - Component render tracking
   - Network request analysis
   - Bundle size analysis

## Deliverables
- Performance investigation report
- Recommended optimizations
- Follow-up work orders for fixes

## Acceptance Criteria
- [ ] Root causes identified
- [ ] Report in trinity/investigations/
- [ ] Optimization WOs created
```

## Work Order Metrics

### Tracking Success

Monitor these metrics:

```javascript
const workOrderMetrics = {
  // Completion metrics
  averageCompletionTime: '2.3 days',
  completionRate: '95%',

  // Quality metrics
  defectEscapeRate: '<5%',
  acceptanceCriteriaSuccess: '100%',

  // Process metrics
  investigationTimeRatio: '30%',  // 30% of time on investigation
  implementationTimeRatio: '50%', // 50% on implementation
  testingTimeRatio: '20%'        // 20% on testing
};
```

### Continuous Improvement

Review work orders regularly:

```markdown
## Monthly Work Order Retrospective

### What Went Well
- Work orders with good investigation saved time
- Clear acceptance criteria reduced rework
- Dependency tracking prevented blockers

### What Needs Improvement
- Some WOs too large (>5 days)
- Investigation phase rushed on WO-XXX
- Acceptance criteria too vague on WO-YYY

### Action Items
- [ ] Create WO sizing guideline
- [ ] Add investigation time estimates
- [ ] Template update for better acceptance criteria
```

## See Also

- [Slash Commands Guide](slash-commands.md)
- [Investigation Templates](../../trinity/templates/investigation-template.md)
- [Getting Started](../getting-started.md)
- [CC Work Order Execution Protocol](../methodology/cc-work-order-protocol.md)
