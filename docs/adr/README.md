# Architectural Decision Records (ADRs)

This directory contains Architectural Decision Records (ADRs) for the Trinity Method SDK project.

---

## What are ADRs?

ADRs document significant architectural decisions made during the project's development. They capture:

- **Context:** Why the decision was needed
- **Decision:** What was decided
- **Consequences:** Impact of the decision (positive, negative, and neutral)
- **Alternatives:** Other options considered and why they weren't chosen

---

## When to Create an ADR

Create an ADR for decisions that:

- Affect the project's architecture or structure
- Have long-term impact on development
- Involve significant trade-offs
- Are difficult or costly to reverse
- Require team alignment

**Examples:**

- Choice of framework or library
- Database schema design
- API design patterns
- Build and deployment strategies
- Security architecture decisions

---

## ADR Format

ADRs follow this naming convention:

```
ADR-XXX-short-title.md
```

**Examples:**

- `ADR-001-cli-architecture.md`
- `ADR-002-template-system-design.md`
- `ADR-003-eslint-flat-config.md`

---

## How to Create an ADR

1. **Copy the template:**

   ```bash
   cp docs/adr/template.md docs/adr/ADR-XXX-your-decision.md
   ```

2. **Fill in the sections:**
   - Context: Why is this decision needed?
   - Decision: What are we doing?
   - Consequences: What are the impacts?
   - Alternatives: What else did we consider?

3. **Get review:**
   - Share with team for feedback
   - Address comments and concerns

4. **Update status:**
   - Start with "Proposed"
   - Change to "Accepted" when implemented
   - Can be "Rejected", "Deprecated", or "Superseded" later

---

## ADR Lifecycle

```
Proposed → Accepted → [Deprecated/Superseded]
    ↓
 Rejected
```

**Statuses:**

- **Proposed:** Under consideration, not yet implemented
- **Accepted:** Decision made and implemented
- **Rejected:** Considered but not chosen
- **Deprecated:** No longer relevant or recommended
- **Superseded:** Replaced by a newer ADR

---

## Index of ADRs

| Number                                       | Title                           | Status   | Date       |
| -------------------------------------------- | ------------------------------- | -------- | ---------- |
| [ADR-001](ADR-001-cli-architecture.md)       | CLI Architecture (Commander.js) | Accepted | 2025-12-21 |
| [ADR-002](ADR-002-template-system-design.md) | Template System Design          | Accepted | 2025-12-21 |
| [ADR-003](ADR-003-eslint-flat-config.md)     | ESLint 9 Flat Config Migration  | Accepted | 2025-12-21 |
| [ADR-004](ADR-004-test-strategy.md)          | Test Strategy (Jest + ts-jest)  | Accepted | 2025-12-21 |

---

## Best Practices

### Writing ADRs

- **Be concise:** ADRs should be readable in 5-10 minutes
- **Be specific:** Include concrete examples and code snippets
- **Be honest:** Document trade-offs and limitations
- **Be timely:** Write ADRs when the decision is made, not later

### Updating ADRs

- **Never modify past decisions:** Add new ADRs to supersede old ones
- **Link related ADRs:** Reference previous decisions
- **Update the index:** Keep the table above current

### Reviewing ADRs

- **Focus on trade-offs:** Ensure consequences are thoroughly explored
- **Check alternatives:** Verify other options were considered
- **Validate context:** Ensure the problem is clearly stated

---

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR template](https://github.com/joelparkerhenderson/architecture-decision-record)
- [ThoughtWorks ADR Tools](https://github.com/npryce/adr-tools)

---

For questions about ADRs, see [CONTRIBUTING.md](../../CONTRIBUTING.md#documentation) or open a GitHub Discussion.
