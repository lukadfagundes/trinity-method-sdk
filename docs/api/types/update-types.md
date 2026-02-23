# Update Types API Reference

**Module:** `src/cli/commands/update/types.ts`
**Purpose:** Update command shared type definitions
**Priority:** MEDIUM (Internal types)

---

## Overview

This module defines the `UpdateStats` interface used to track statistics during the update process.

---

## Types

### `UpdateStats`

Statistics tracked during the update process.

```typescript
export interface UpdateStats {
  agentsUpdated: number; // Number of agent files updated
  templatesUpdated: number; // Number of template files updated
  knowledgeBaseUpdated: number; // Number of knowledge base files updated
  commandsUpdated: number; // Number of command files updated
  filesUpdated: number; // Total files updated (sum of above)
}
```

**Used By:** Update orchestrator to track and report update statistics. Each update sub-function increments its respective counter. `filesUpdated` is computed as the sum of all other counters.

---

## Related Documentation

- [CLI Types](cli-types.md) - Base type definitions (includes `UpdateOptions`)
- [Update Command API](../update/update-command.md) - Update orchestration

---

**Last Updated:** 2026-02-23
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
