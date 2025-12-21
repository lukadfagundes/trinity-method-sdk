# ADR-003: ESLint 9 Flat Config Migration

**Status:** Accepted
**Date:** 2025-12-21
**Deciders:** Development Team
**Technical Story:** Migration from ESLint 8 .eslintrc to ESLint 9 flat config

---

## Context

ESLint 9 introduces a new "flat config" system that replaces the traditional `.eslintrc.*` configuration format.

**Background:**

- ESLint 8 uses `.eslintrc.json`, `.eslintrc.js`, etc.
- ESLint 9 uses `eslint.config.js` (flat config)
- Flat config is the future of ESLint configuration
- Old config format will be deprecated

**Requirements:**

- Lint TypeScript code
- Lint test files with Jest-specific rules
- Maintain code quality standards
- Future-proof configuration

---

## Decision

We will use **ESLint 9 with flat config** (`eslint.config.js`).

**Implementation:**

- ESLint 9.x with flat config system
- TypeScript ESLint for TypeScript support
- eslint-plugin-jest for test file linting
- Separate configurations for source and test files

**Configuration Structure:**

```javascript
export default [
  {
    files: ['src/**/*.ts'],
    plugins: { '@typescript-eslint': typescriptEslint },
    rules: {
      /* source rules */
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: { jest: jestPlugin },
    rules: {
      /* test rules */
    },
  },
];
```

---

## Consequences

### Positive Consequences

- **Future-proof:** Aligned with ESLint's future direction
- **Type-safe:** Configuration is JavaScript with full IDE support
- **Simpler:** Flatter structure, easier to understand
- **Better composition:** Easy to share and extend configurations
- **Performance:** Slightly faster than legacy config
- **Explicit:** No hidden inheritance or cascading

### Negative Consequences

- **Migration effort:** Required converting from .eslintrc format
- **Ecosystem maturity:** Some plugins still updating for flat config
- **Breaking change:** Different from ESLint 8 (learning curve)
- **Documentation:** Less Stack Overflow answers (newer format)

### Neutral Consequences

- **Configuration file:** Changed from .eslintrc.json to eslint.config.js
- **Plugin loading:** Must explicitly import plugins

---

## Alternatives Considered

### Alternative 1: Stick with ESLint 8 and .eslintrc

**Description:** Continue using ESLint 8 with traditional configuration

**Pros:**

- No migration needed
- More documentation available
- Familiar to all developers
- Ecosystem fully supports it

**Cons:**

- Will be deprecated in the future
- Technical debt accumulation
- Missing new ESLint 9 features
- Eventually forced migration anyway

**Why not chosen:** Delaying inevitable migration creates technical debt. Better to migrate now while codebase is small.

### Alternative 2: TypeScript ESLint config

**Description:** Use TypeScript for ESLint configuration

**Pros:**

- Full type safety in config
- IDE autocomplete
- Compile-time validation

**Cons:**

- Requires ts-node or similar
- Adds build complexity
- Overkill for configuration
- Not officially supported

**Why not chosen:** JavaScript config provides sufficient type safety through JSDoc and IDE support. TypeScript adds unnecessary complexity.

### Alternative 3: No linting

**Description:** Remove ESLint entirely

**Pros:**

- No configuration to maintain
- Faster builds
- One less tool

**Cons:**

- No code quality enforcement
- Inconsistent code style
- More bugs slip through
- Harder code reviews

**Why not chosen:** Linting is essential for code quality and consistency in a TypeScript project.

---

## Implementation Notes

**Migration Steps:**

1. Install ESLint 9 and @eslint/js
2. Install TypeScript ESLint parser and plugin
3. Install eslint-plugin-jest
4. Create eslint.config.js
5. Remove .eslintrc.json
6. Update npm scripts
7. Fix any new linting errors

**File Structure:**

```
eslint.config.js              # Main ESLint config
src/                          # Source files (linted)
tests/                        # Test files (linted with Jest rules)
```

**Example Config:**

```javascript
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: typescriptEslintParser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
```

**Rollback Strategy:**

- Keep ESLint 8 in package.json history
- .eslintrc.json is in git history if needed
- Can downgrade if critical issues found

**Validation:**

- All existing files pass linting
- New lint errors are caught
- IDE integration works
- Pre-commit hooks function correctly

---

## References

- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [TypeScript ESLint Flat Config](https://typescript-eslint.io/getting-started/)
- [eslint-plugin-jest Flat Config](https://github.com/jest-community/eslint-plugin-jest)
- [Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)

---

## Revision History

| Date       | Author | Change Description |
| ---------- | ------ | ------------------ |
| 2025-12-21 | APO    | Initial version    |
