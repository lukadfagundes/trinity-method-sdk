# ADR-002: Template System Design

**Status:** Accepted
**Date:** 2025-12-21
**Deciders:** Development Team
**Technical Story:** Trinity Method file deployment system

---

## Context

The Trinity Method SDK must deploy numerous files to user projects:

- Agent prompts (19 agents)
- Slash commands (10+ commands)
- Knowledge base documents
- Configuration files (CLAUDE.md, etc.)
- Work order templates

**Challenges:**

- Files need placeholder replacement (project name, date, etc.)
- Must preserve file structure and permissions
- Need to handle both text and binary files
- Must work across different operating systems
- Should be easy to add new templates

---

## Decision

We will use a **file-based template system** with string replacement for placeholders.

**Implementation:**

- Templates stored in `src/templates/`
- Copied to `dist/templates/` during build
- Simple string replacement using JavaScript `.replace()`
- No template engine dependency

**Placeholder Format:**

```
{{PROJECT_NAME}}
{{FRAMEWORK}}
{{TIMESTAMP}}
{{VERSION}}
```

**Copy Process:**

1. Read template file
2. Replace placeholders with actual values
3. Write to destination directory
4. Preserve file permissions

---

## Consequences

### Positive Consequences

- **Simplicity:** No template engine to learn or maintain
- **Performance:** String replacement is fast
- **Transparency:** Easy to see what will be generated
- **No dependencies:** Reduces bundle size and security surface
- **Easy maintenance:** Adding new templates is straightforward
- **IDE support:** Templates are just files with placeholders

### Negative Consequences

- **Limited logic:** Cannot do conditionals or loops in templates
- **Manual escaping:** Must handle special characters manually
- **No type safety:** Placeholder names are strings (can typo)

### Neutral Consequences

- **File organization:** Templates mirror destination structure
- **Build step:** Requires copying templates during build

---

## Alternatives Considered

### Alternative 1: Handlebars

**Description:** Popular template engine with logic capabilities

**Pros:**

- Support for conditionals and loops
- Helper functions
- Well-documented
- Wide adoption

**Cons:**

- Adds dependency (~100KB)
- Overkill for simple placeholders
- Learning curve for template syntax
- Security considerations (if user input in templates)

**Why not chosen:** Our templates are simple and don't need logic. String replacement is sufficient and has zero dependencies.

### Alternative 2: EJS

**Description:** Embedded JavaScript templates

**Pros:**

- JavaScript in templates
- Familiar syntax
- Powerful

**Cons:**

- Security risk if not careful
- Adds dependency
- Can lead to complex templates
- Harder to maintain

**Why not chosen:** Too powerful for our needs. We want simple, safe templates.

### Alternative 3: Template Literals

**Description:** Use JavaScript template literals directly

**Pros:**

- Native JavaScript feature
- No dependencies
- Full JavaScript power

**Cons:**

- Templates are code, not files
- Hard to edit without rebuilding
- Less transparent for users
- Can't preview easily

**Why not chosen:** We want templates to be files that users can inspect and understand before deployment.

---

## Implementation Notes

**Template Directory Structure:**

```
src/templates/
├── claude/
│   ├── agents/              # 19 agent prompt files
│   └── commands/            # Slash command files
├── trinity/
│   ├── knowledge-base/      # Documentation templates
│   └── work-orders/         # Work order templates
└── root/
    ├── CLAUDE.md           # Root context file
    └── source-CLAUDE.md    # Source-specific context
```

**Replacement Implementation:**

```typescript
function replaceTemplateVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  return result;
}
```

**Migration Path:**

- Current system works for v1.0
- Can add template engine later if needed
- Placeholder format can remain compatible

**Validation:**

- All templates deploy correctly
- Placeholders are replaced
- File structure is preserved
- Works across operating systems

---

## References

- [Template pattern documentation](https://refactoring.guru/design-patterns/template-method)
- [fs-extra documentation](https://github.com/jprichardson/node-fs-extra)

---

## Revision History

| Date       | Author | Change Description |
| ---------- | ------ | ------------------ |
| 2025-12-21 | APO    | Initial version    |
