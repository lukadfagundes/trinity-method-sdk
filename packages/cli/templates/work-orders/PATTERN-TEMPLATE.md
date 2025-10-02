# ORCHESTRATOR WORK ORDER #XXX
## Type: PATTERN
## [Pattern Extraction/Implementation Title]

---

## AUTHORIZATION

```
TRINITY COUNCIL APPROVAL:
☑ LUKA: APPROVED - [Pattern work justification]
☑ TRINITY: APPROVED - [Pattern approach validation]
☑ CC: PENDING - Awaiting your acknowledgment

STATUS: APPROVED FOR EXECUTION
```

---

## MISSION OBJECTIVE

[Clear statement about pattern work - either extracting patterns from issues or implementing pattern-based fixes]

**Pattern Goal:** [Extract patterns OR Apply pattern fixes]
**Impact Potential:** [Estimated issues resolved by this pattern work]

---

## PATTERN SCOPE

### For Pattern EXTRACTION:

#### Source Material
- Previous work orders: [#XXX, #XXX, #XXX]
- Issue categories: [Types of issues to analyze]
- Components: [Which parts of codebase]
- Time range: [Period to analyze]

#### Pattern Categories to Identify
1. **Code Patterns**
   - Repeated code structures
   - Common anti-patterns
   - Recurring bugs

2. **Architecture Patterns**
   - Design issues
   - Coupling problems
   - Scaling bottlenecks

3. **Process Patterns**
   - Development workflow issues
   - Testing gaps
   - Deployment problems

4. **Mobile-Specific Patterns**
   - Responsive design anti-patterns
   - Touch interaction issues
   - Viewport handling problems
   - Mobile performance bottlenecks

### For Pattern APPLICATION:

#### Pattern to Apply
**Pattern Name:** [Identified pattern]
**Pattern Source:** [Where this pattern was identified]
**Fix Template:**
```language
// Standard fix approach
[Code template or approach]
```

#### Target Files
```yaml
High_Confidence_Matches:
  - file: [path/file.ext]
    instances: [X]
    lines: [specific lines]

  - file: [path/file.ext]
    instances: [X]
    lines: [specific lines]

Probable_Matches:
  - file: [path/file.ext]
    instances: [X]
    review_needed: true
```

---

## PATTERN METHODOLOGY

### For EXTRACTION:

#### Step 1: Collection
- [ ] Gather all relevant issues/reports
- [ ] Categorize by component and type
- [ ] Create frequency analysis
- [ ] Include mobile-specific issue analysis

#### Step 2: Analysis
- [ ] Identify recurring elements
- [ ] Group similar issues
- [ ] Calculate occurrence rates
- [ ] Analyze mobile vs desktop pattern differences

#### Step 3: Pattern Definition
- [ ] Document pattern characteristics
- [ ] Create detection criteria
- [ ] Develop fix templates
- [ ] Include mobile-specific pattern templates

### For APPLICATION:

#### Step 1: Pattern Matching
- [ ] Scan codebase for pattern instances
- [ ] Verify matches against criteria
- [ ] Prioritize by confidence level
- [ ] Test patterns on mobile devices

#### Step 2: Batch Implementation
- [ ] Apply fixes to high-confidence matches
- [ ] Review and fix probable matches
- [ ] Test after each batch
- [ ] Verify mobile compatibility after fixes

#### Step 3: Validation
- [ ] Verify all fixes applied correctly
- [ ] Run tests for affected components
- [ ] Document any exceptions
- [ ] Confirm mobile compatibility maintained

---

## DELIVERABLE REQUIREMENTS

### Document Format
**Filename:** `PATTERN-[EXTRACTION/APPLICATION]-[TIMESTAMP].md`
**Location:** `${PROJECT_REPORTS}/` (Project-specific Reports folder)

### For Pattern EXTRACTION Report:
1. **Executive Summary** - Patterns found and their impact
2. **Pattern Catalog** - Detailed pattern descriptions
3. **Frequency Analysis** - How often each pattern occurs
4. **Mobile-Specific Patterns** - Mobile-unique pattern findings (if applicable)
5. **Impact Multipliers** - Issues resolved per pattern fix
6. **Fix Templates** - How to fix each pattern
7. **Priority Matrix** - Which patterns to fix first
8. **Implementation Plan** - How to apply fixes

### For Pattern APPLICATION Report:
1. **Executive Summary** - Fixes applied and results
2. **Application Statistics** - Files changed, instances fixed
3. **Confidence Levels** - High/medium/low confidence fixes
4. **Mobile Compatibility Verification** - Mobile testing results (if applicable)
5. **Exceptions** - Instances that couldn't be fixed
6. **Test Results** - Validation of fixes
7. **Remaining Work** - What still needs manual attention
8. **Metrics** - Before/after comparison

---

## SUCCESS CRITERIA

### For Pattern EXTRACTION:
- [ ] Minimum 3 significant patterns identified
- [ ] Impact multipliers calculated for each
- [ ] Fix templates created and validated
- [ ] Mobile patterns identified (if UI work)
- [ ] Priority recommendations provided
- [ ] Pattern library updated

### For Pattern APPLICATION:
- [ ] All high-confidence matches fixed
- [ ] Probable matches reviewed and fixed
- [ ] No regressions introduced
- [ ] Mobile compatibility verified (if UI patterns)
- [ ] Tests pass for affected code
- [ ] Exceptions documented

---

## ⚠️ CRITICAL RESTRICTIONS - GIT OPERATIONS FORBIDDEN

**PATTERN WORK MAY INVOLVE FILE MODIFICATIONS - BUT NO GIT OPERATIONS:**
ALL team members (CC, TRINITY, specialists) are PERMANENTLY FORBIDDEN from performing ANY git operations:

- [ ] **git add** - FORBIDDEN - Only LUKA has permission
- [ ] **git commit** - FORBIDDEN - Only LUKA has permission
- [ ] **git push** - FORBIDDEN - Only LUKA has permission
- [ ] **git pull** - FORBIDDEN - Only LUKA has permission
- [ ] **git merge** - FORBIDDEN - Only LUKA has permission
- [ ] **git checkout -b** - FORBIDDEN - Only LUKA has permission
- [ ] **git branch** - FORBIDDEN - Only LUKA has permission
- [ ] **git tag** - FORBIDDEN - Only LUKA has permission
- [ ] **git rebase** - FORBIDDEN - Only LUKA has permission
- [ ] **git reset** - FORBIDDEN - Only LUKA has permission
- [ ] **git revert** - FORBIDDEN - Only LUKA has permission
- [ ] **git stash** - FORBIDDEN - Only LUKA has permission
- [ ] **Any git operation that modifies repository state**

**PATTERN WORK PROTOCOL:**
1. Make all local file changes as specified
2. Test thoroughly in local environment
3. Report completion to LUKA with summary of changes
4. LUKA will handle ALL git operations (add, commit, push, etc.)

---

## PATTERN QUALITY REQUIREMENTS

### Valid Pattern Criteria
A pattern must have:
- Minimum frequency: [X occurrences]
- Clear identification: [Unambiguous detection]
- Consistent fix: [Same solution works for all instances]
- Measurable impact: [Quantifiable improvement]

### Pattern Documentation Standard
Each pattern needs:
```markdown
## Pattern: [Name]
**Frequency:** X instances across Y files
**Detection:** [How to identify]
**Root Cause:** [Why this occurs]
**Fix Template:** [Standard solution]
**Mobile Considerations:** [Mobile-specific variations if applicable]
**Impact:** Resolves ~X issues
**Risk:** [LOW/MEDIUM/HIGH]
**Automation:** [Possible/Partial/Manual]
```

---

## AUTOMATION POTENTIAL

### For Future Automation
Document patterns suitable for automation:
- Detection rules that could be scripted
- Fix approaches that could be automated
- Testing that could verify fixes

### Current Manual Requirements
Note what must remain manual:
- Context-dependent fixes
- Architectural decisions
- Complex refactoring

---

## CONTEXT FROM SESSION

**Pattern Sources:** [Which investigations revealed patterns]
**Previous Pattern Work:** [Build on Work Order #XXX if applicable]
**Known Patterns:** [Already documented patterns to consider]

---

## PRIORITY & EFFICIENCY

**Analysis Scope:** [COMPREHENSIVE/STANDARD/FOCUSED]
**Completeness Required:** 100% - Full analysis must be completed
**Efficiency Factor:** [1:X - one fix resolves X issues]
**Time Investment:** [Estimated hours]
**ROI:** [High/Medium/Low based on impact vs effort]

---

## SPECIAL CONSIDERATIONS

- Edge cases: [Unusual instances to watch for]
- False positives: [What might look like pattern but isn't]
- Dependencies: [Order of fixes if patterns are related]
- Mobile-specific considerations: [Mobile testing requirements]

---

**Remember:** Pattern work is about maximizing impact through systematic fixes. One pattern fix can resolve dozens of issues. Document patterns thoroughly for future reuse. Report all changes to LUKA for git operations.

*Trinity Method v7.2 - Pattern Work Order Template*
*Project-Isolated Architecture with Dynamic Paths*