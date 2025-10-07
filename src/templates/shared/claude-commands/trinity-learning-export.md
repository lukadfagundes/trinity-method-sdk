---
description: Export learned patterns and insights from the learning system
---

Export learned patterns and insights from the Trinity Method learning system.

**Export Sources:**
- KnowledgeSharingBus (src/learning/KnowledgeSharingBus.ts)
- LearningDataStore (src/learning/LearningDataStore.ts)
- Pattern library (learned patterns)
- Investigation insights

**Export Options:**

1. **Export Format**
   Ask user to select:
   - JSON (machine-readable, full data)
   - Markdown (human-readable, documentation)
   - CSV (metrics and statistics)
   - Trinity Package (portable, importable)

2. **Export Scope**
   - All patterns
   - High-confidence patterns only (>80%)
   - Patterns by date range
   - Patterns by category
   - Patterns by agent
   - Custom filter

3. **Export Content**
   - Pattern definitions
   - Application success rates
   - Learning metadata
   - Related investigations
   - Performance metrics
   - Recommended usage contexts

**Export Structure (JSON):**
```json
{
  "export_date": "2025-10-06",
  "trinity_version": "1.0.0",
  "patterns": [
    {
      "id": "pattern-001",
      "name": "Cache-First Data Fetching",
      "confidence": 0.92,
      "applications": 47,
      "success_rate": 0.89,
      "learned_from": "INV-023",
      "description": "...",
      "code_template": "..."
    }
  ],
  "statistics": { ... }
}
```

**Process:**

1. Ask user for export options (format, scope, content)

2. Gather patterns from learning system

3. Apply filters and transformations

4. Generate export file

5. Save to: `trinity/exports/learning-export-{date}.{format}`

6. Display summary:
   - Patterns exported: X
   - File size: Y MB
   - Export location
   - Import instructions

**Use Cases:**
- Share patterns across projects
- Backup learning data
- Generate pattern documentation
- Team knowledge sharing
- Pattern analysis
