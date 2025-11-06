# TSDoc Standard - Trinity Method SDK

**Purpose:** Establish consistent documentation pattern that links code to methodology.

**Last Updated:** 2025-11-05

---

## Philosophy

Trinity Method code should be **self-documenting** through comprehensive TSDoc comments. Every major class, function, and module should explain not just "what" it does, but **"why" it exists** in the Trinity Method context.

### Goals

1. **Bridge Methodology and Implementation:** Link every code component to methodology documentation
2. **IDE Integration:** Provide rich context in IDE tooltips and intellisense
3. **Onboarding:** Help new developers understand Trinity Method principles while coding
4. **Discovery:** Make methodology docs discoverable from code

---

## Standard Pattern

All exported classes, interfaces, and major functions should follow this pattern:

```typescript
/**
 * [Component Name] - [Brief 1-sentence description]
 *
 * @see docs/[methodology-doc].md - [What this documentation provides]
 * @see docs/[related-doc].md - [Additional context]
 *
 * **Trinity Principle:** "[Specific Trinity Method principle this embodies]"
 * [2-3 sentences explaining how this component embodies the principle.
 * Focus on the philosophical "why" behind the technical "what".]
 *
 * **Why This Exists:**
 * [2-4 sentences explaining the problem this solves and how Trinity Method
 * approach differs from traditional approaches. Make the value proposition clear.
 * Answer: "What problem does this solve that traditional development doesn't?"]
 *
 * @example
 * ```typescript
 * // Practical usage example that developers can copy-paste
 * const instance = new Component();
 * await instance.doSomething();
 * ```
 *
 * @param paramName - [Parameter description]
 * @returns [Return value description]
 * @throws {ErrorType} [When this error is thrown]
 */
```

---

## Section Breakdown

### 1. Brief Description

**One sentence** that describes what the component does.

**Good:**
```typescript
/**
 * SelfImprovingAgent - Base class for all Trinity Method agents with learning capabilities
 */
```

**Bad:**
```typescript
/**
 * SelfImprovingAgent - A base class
 */
```

---

### 2. @see Links

**Link to 2-3 relevant methodology documents** that provide context.

**Rules:**
- Use relative paths from repository root
- Links must resolve to existing files
- Explain what each link provides

**Good:**
```typescript
/**
 * @see docs/methodology/investigation-first-complete.md - Core Trinity Method philosophy
 * @see docs/agents/agent-selection-guide.md - Agent architecture and coordination
 */
```

**Bad:**
```typescript
/**
 * @see methodology docs
 * @see /docs/something.md (absolute path - won't work in all IDEs)
 */
```

---

### 3. Trinity Principle

**State which Trinity Method principle** this component embodies, then explain how.

**The Fundamental Law:**
> "No updates without investigation. No changes without Trinity consensus. No shortcuts without consequences."

**The Three Pillars:**
1. **Investigation-First Development** - Understand before acting
2. **Evidence-Based Decisions** - Support decisions with data
3. **Systematic Quality Assurance** - Quality isn't optional

**The Three Trinities:**
- **Investigation Trinity:** Technical, Performance, Security investigations
- **Implementation Trinity:** Planning, Execution, Review
- **Knowledge Trinity:** Investigation, Implementation, Outcome knowledge

**Good:**
```typescript
/**
 * **Trinity Principle:** "Investigation-First Development"
 * Agents learn from every investigation, improving over time through
 * pattern recognition and knowledge sharing. This enforces systematic
 * investigation before implementation, preventing rushed coding.
 */
```

**Bad:**
```typescript
/**
 * **Trinity Principle:** This follows Trinity Method
 */
```

---

### 4. Why This Exists

**Explain the problem this solves** and how Trinity Method approach differs from traditional development.

**Framework for writing:**
1. What problem exists in traditional development?
2. How does this component solve that problem?
3. What makes the Trinity Method approach different/better?

**Good:**
```typescript
/**
 * **Why This Exists:**
 * Traditional development treats each task as isolated. Context is lost between
 * sessions, and mistakes repeat. This base class ensures all agents participate
 * in cross-session learning and knowledge preservation, building institutional
 * knowledge that improves over time rather than starting from scratch each time.
 */
```

**Bad:**
```typescript
/**
 * **Why This Exists:**
 * We needed a base class for agents.
 */
```

---

### 5. Example

**Provide practical, runnable code example** that developers can copy-paste.

**Rules:**
- Must compile successfully
- Should show common usage pattern
- Keep it concise (5-10 lines)
- Use realistic variable names

**Good:**
```typescript
/**
 * @example
 * ```typescript
 * const learningData = new LearningDataStore();
 * const agent = new MonAgent(learningData, tracker, strategy, bus);
 * const result = await agent.executeInvestigation(context);
 * await agent.learnFromInvestigation(result);
 * ```
 */
```

**Bad:**
```typescript
/**
 * @example
 * ```typescript
 * new MyClass(); // Use this class
 * ```
 */
```

---

## Examples by Component Type

### Agent Classes

```typescript
/**
 * MON (Requirements Analyst) - Extracts and validates requirements from user input
 *
 * @see docs/methodology/investigation-workflow.md - Investigation process
 * @see docs/agents/agent-selection-guide.md - Agent coordination patterns
 *
 * **Trinity Principle:** "Investigation-First Development"
 * MON ensures requirements are thoroughly investigated before design begins.
 * By analyzing user needs systematically, MON prevents misunderstandings
 * that would require costly rework later.
 *
 * **Why This Exists:**
 * Traditional development often jumps directly to design without clear requirements,
 * leading to scope creep and missed expectations. MON enforces requirements analysis
 * as a mandatory first step, ensuring all stakeholders have shared understanding
 * before implementation begins.
 *
 * @example
 * ```typescript
 * const mon = new MonAgent(learningData, tracker, strategy, bus);
 * const requirements = await mon.analyzeRequirements(userInput);
 * console.log(`Extracted ${requirements.functionalReqs.length} requirements`);
 * ```
 */
export class MonAgent extends SelfImprovingAgent {
  // Implementation
}
```

---

### Cache System Classes

```typescript
/**
 * AdvancedCacheManager - 3-tier caching system for investigation results
 *
 * @see docs/best-practices.md#caching-strategies - Performance optimization
 * @see docs/methodology/investigation-first-complete.md - Investigation philosophy
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Caching investigation results enables data-driven decision making by providing
 * instant access to historical findings. The 3-tier design balances speed
 * (L1 in-memory) with persistence (L3 SQLite).
 *
 * **Why This Exists:**
 * Investigations take time. Re-running identical investigations wastes resources.
 * This cache system stores investigation results across sessions, enabling
 * instant retrieval of similar findings and progressive learning over time.
 *
 * @example
 * ```typescript
 * const cache = new AdvancedCacheManager();
 * const key = cache.generateKey(query, 'MON', 'requirements');
 * const cached = await cache.get<Requirements>(key);
 * if (!cached) {
 *   const result = await runInvestigation();
 *   await cache.set(key, result, 3600); // Cache for 1 hour
 * }
 * ```
 */
export class AdvancedCacheManager {
  // Implementation
}
```

---

### Learning System Classes

```typescript
/**
 * LearningDataStore - Persistent storage for learned patterns and strategies
 *
 * @see docs/learning/knowledge-preservation.md - Learning system philosophy
 * @see docs/methodology/investigation-first-complete.md - How learning integrates
 *
 * **Trinity Principle:** "Knowledge Preservation"
 * Captures patterns from every investigation and persists them across sessions.
 * Uses Jaccard similarity to find relevant patterns when agents encounter
 * similar problems, enabling continuous improvement.
 *
 * **Why This Exists:**
 * Traditional development loses knowledge when developers leave or forget.
 * This store persists learned patterns to disk, ensuring institutional knowledge
 * survives across sessions, team changes, and project boundaries. Agents get
 * smarter over time instead of starting from zero each time.
 *
 * @example
 * ```typescript
 * const store = new LearningDataStore();
 * await store.savePattern({
 *   agentId: 'MON',
 *   description: 'Users often request features without acceptance criteria',
 *   confidence: 0.85,
 *   successCount: 12
 * });
 * const similar = await store.findSimilarPatterns(query, 0.7);
 * ```
 */
export class LearningDataStore {
  // Implementation
}
```

---

### CLI Commands

```typescript
/**
 * Orchestrate command - Coordinate multi-agent workflows based on task scale
 *
 * @see docs/workflows/implementation-workflow.md - Workflow structure
 * @see docs/agents/agent-selection-guide.md - Agent coordination
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * Scale-based workflows ensure appropriate oversight. Small tasks get quick
 * execution, large tasks get comprehensive review with multiple stop points.
 *
 * **Why This Exists:**
 * One-size-fits-all workflows are inefficient. Tiny tasks don't need design
 * reviews; massive features need comprehensive planning. This command adapts
 * the workflow to task complexity, optimizing for both speed and quality.
 *
 * @example
 * ```bash
 * # Terminal usage
 * trinity orchestrate
 *
 * # Small scale: Direct to implementation
 * # Medium scale: Design review + implementation
 * # Large scale: Requirements + Design + Plan + Implementation
 * ```
 */
export async function orchestrate(options: OrchestrationOptions): Promise<void> {
  // Implementation
}
```

---

## Methodology Documentation Reference

### Core Methodology
- `docs/methodology/investigation-first-complete.md` - Complete methodology
- `docs/methodology/trinity-framework.md` - Trinity framework (3 trinities)
- `docs/methodology/universal-principles.md` - Framework-agnostic principles
- `docs/methodology/workflow-comparison.md` - Trinity vs Traditional

### Workflows
- `docs/workflows/investigation-workflow.md` - 4-step investigation
- `docs/workflows/implementation-workflow.md` - Scale-based TDD
- `docs/workflows/session-workflow.md` - Session lifecycle
- `docs/workflows/audit-workflow.md` - DRA + JUNO audits
- `docs/workflows/deploy-workflow.md` - SDK deployment

### Best Practices
- `docs/best-practices.md` - Coding and testing best practices
- `docs/quality-standards.md` - BAS quality enforcement
- `docs/crisis-management.md` - Crisis recovery protocols
- `docs/hooks-guide.md` - Automation philosophy

### Learning System
- `docs/learning/knowledge-preservation.md` - Learning philosophy

### Agents
- `docs/agents/agent-selection-guide.md` - All 18 agents documented

### Commands
- `docs/commands/README.md` - All slash commands

---

## Validation

### Pre-commit Checks

**Link Validation:**
```bash
# Validate all @see links resolve
node scripts/validate-tsdoc-links.js
```

**Documentation Coverage:**
```bash
# Check all exported classes have TSDoc
npm run doc-coverage
```

### ESLint Integration

**Required Rules:**
- `jsdoc/require-jsdoc` - Enforce TSDoc on exports
- `jsdoc/require-description` - Enforce description
- `jsdoc/require-example` - Enforce examples
- `jsdoc/check-examples` - Validate example syntax

---

## Migration Strategy

### Phase 1: Agents (18 files)
Start with `SelfImprovingAgent.ts` as template, then enhance all agent classes.

### Phase 2: Systems (10 files)
Cache system (6 files) + Learning system (4 files)

### Phase 3: Commands (10+ files)
All CLI commands in `src/cli/commands/`

### Phase 4: Utilities
Remaining exported classes and functions

---

## Common Mistakes to Avoid

### ❌ Too Generic
```typescript
/**
 * Does stuff with agents
 */
```

### ✅ Specific and Contextual
```typescript
/**
 * KIL (Task Executor) - Implements tasks using RED-GREEN-REFACTOR TDD cycle
 *
 * @see docs/workflows/implementation-workflow.md - TDD workflow
 */
```

---

### ❌ Missing Trinity Context
```typescript
/**
 * A cache manager for caching things
 */
```

### ✅ Trinity Method Philosophy
```typescript
/**
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Caching investigation results enables data-driven decision making...
 */
```

---

### ❌ No Practical Example
```typescript
/**
 * @example
 * ```typescript
 * // Use this class
 * ```
 */
```

### ✅ Runnable, Practical Example
```typescript
/**
 * @example
 * ```typescript
 * const cache = new AdvancedCacheManager();
 * const result = await cache.get<Data>(key);
 * if (!result) {
 *   const data = await fetchData();
 *   await cache.set(key, data, 3600);
 * }
 * ```
 */
```

---

## Questions?

**Where to add TSDoc?**
- All exported classes
- All exported functions
- All exported interfaces (if not obvious)
- Major internal functions (optional but encouraged)

**How long should it be?**
- Brief description: 1 sentence
- Trinity Principle: 2-3 sentences
- Why This Exists: 2-4 sentences
- Example: 5-10 lines of code
- Total: ~15-20 lines of documentation

**What if there's no obvious Trinity Principle?**
- Utility functions: Focus on "Why This Exists"
- Link to relevant methodology docs
- Explain how it supports Trinity Method workflows

---

## Enforcement

**This standard is enforced through:**
1. ESLint rules (jsdoc plugin)
2. Pre-commit hooks (link validation)
3. DRA code reviews (quality check)
4. Documentation coverage reports (CI/CD)

**All new code must follow this standard before merge.**

---

**Version:** 1.0
**Last Updated:** 2025-11-05
**Author:** Trinity Method SDK Team
