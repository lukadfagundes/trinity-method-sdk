# ADR-003: ESLint Flat Config Adoption

**Status:** Accepted
**Date:** 2025-12-28
**Deciders:** Trinity Method SDK Core Team
**Technical Story:** Migrate from legacy ESLint configuration to modern flat config format

## Context

ESLint introduced a new "flat config" format in v8.21.0 (2022) and announced it would become the default in v9.0.0 (2024). The Trinity Method SDK needed to decide whether to:

1. Continue using legacy `.eslintrc.js` format
2. Migrate to new `eslint.config.js` flat config format

**Legacy ESLint Configuration (.eslintrc.js):**

```javascript
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
  },
};
```

**New Flat Config (eslint.config.js):**

```javascript
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

**Key Differences:**

- Flat config uses ES modules (`import`/`export`) instead of CommonJS
- Configuration is an array of config objects instead of a single object
- More explicit plugin and parser definitions
- Simplified configuration cascade
- Better TypeScript integration

**Requirements:**

- Node.js ≥ 16.9.0 (for ESLint flat config support)
- ESLint ≥ 8.21.0 (flat config introduced)
- Works with TypeScript 5.x
- Compatible with Prettier integration

## Decision Drivers

- **Future-Proofing** - Flat config is the future of ESLint (default in v9.0.0+)
- **Modern Standards** - Align with ESLint team's recommended approach
- **TypeScript Integration** - Better TypeScript support in flat config
- **Node.js Requirements** - SDK already requires Node.js ≥ 16.9.0
- **Configuration Clarity** - Flat config's array-based approach is more explicit
- **Ecosystem Compatibility** - Major plugins support flat config

## Considered Options

### Option 1: Adopt ESLint Flat Config

- Migrate to `eslint.config.js` format
- Use ES modules for configuration
- Require Node.js ≥ 16.9.0

**Pros:**

- **Future-proof** - Default format in ESLint v9.0.0+
- **Better TypeScript support** - Clearer parser and plugin configuration
- **Modern JavaScript** - Uses ES modules, aligning with modern Node.js
- **Explicit configuration** - Array-based configs make cascade obvious
- **Simplified extends** - No more confusing extends chains
- **Better IDE support** - Improved autocomplete and type checking

**Cons:**

- **Breaking change** - Legacy projects must migrate
- **Requires Node.js 16.9.0+** - Older Node.js versions incompatible
- **Learning curve** - Developers must learn new format
- **Plugin ecosystem** - Some older plugins may not support flat config yet

### Option 2: Stick with Legacy .eslintrc.js

- Continue using traditional ESLint configuration
- Compatible with older Node.js versions

**Pros:**

- **No migration needed** - Existing configs work as-is
- **Wider compatibility** - Works with Node.js 12+
- **Familiar** - Most developers know this format
- **Stable ecosystem** - All plugins support legacy format

**Cons:**

- **Deprecated** - Will be removed in future ESLint versions
- **Legacy approach** - Fighting against ESLint's direction
- **Technical debt** - Will require migration eventually
- **Worse TypeScript support** - Less explicit parser configuration
- **Confusing extends** - Complex extends chains hard to debug

### Option 3: Support Both Formats

- Provide both `.eslintrc.js` and `eslint.config.js` templates
- Let users choose format

**Pros:**

- **Maximum compatibility** - Works for all users
- **No forced migration** - Users decide when to upgrade

**Cons:**

- **Maintenance burden** - Must maintain two configuration systems
- **Confusion** - Users unsure which to use
- **Delayed inevitable** - Still need to migrate eventually
- **Testing complexity** - Must test both configurations

## Decision

**Chosen Option: Adopt ESLint Flat Config**

Trinity Method SDK will use the modern `eslint.config.js` flat config format exclusively.

**Rationale:**

1. **Future-Proof** - ESLint v9.0.0+ defaults to flat config. Adopting now prevents forced migration later.

2. **Node.js Requirement Alignment** - SDK already requires Node.js ≥ 16.9.0 for other features (ES modules, native fetch). Flat config has the same requirement, so no additional constraint.

3. **Better TypeScript Integration** - Flat config's explicit parser and plugin definitions work better with TypeScript:

   ```javascript
   // More explicit and type-safe
   languageOptions: {
     parser: tsparser,
     parserOptions: { ecmaVersion: 'latest' }
   }
   ```

4. **Modern Standards** - Aligns with ESLint team's vision and modern JavaScript practices (ES modules).

5. **Clearer Configuration** - Array-based configuration makes cascade and override behavior explicit:

   ```javascript
   export default [
     js.configs.recommended, // Base config
     {
       // TypeScript config
       files: ['**/*.ts'],
       // ...
     },
     {
       // Test overrides
       files: ['**/*.test.ts'],
       // ...
     },
   ];
   ```

6. **One-Time Migration** - Better to migrate now than maintain legacy format and migrate later under pressure.

## Implementation Details

### SDK ESLint Configuration

**Location:** `eslint.config.js` (root of SDK)

```javascript
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        node: true,
        es2022: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' in tests
    },
  },
];
```

### Deployed Template for Node.js Projects

**Location:** `src/templates/linting/node/eslint.config.js.template`

```javascript
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**'],
  },
];
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "eslint": "^9.39.2",
    "@eslint/js": "^9.39.2",
    "@typescript-eslint/eslint-plugin": "^8.18.2",
    "@typescript-eslint/parser": "^8.18.2"
  }
}
```

### Pre-commit Hook Integration

**.pre-commit-config.yaml:**

```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.39.2
    hooks:
      - id: eslint
        files: \.(ts|tsx)$
        types: [file]
        args: ['--fix']
```

## Consequences

### Positive

- **Future-Proof** - Ready for ESLint v9.0.0+ with no migration needed
- **Better TypeScript** - Explicit parser configuration improves type checking
- **Clearer Configuration** - Array format makes config cascade obvious
- **Modern Codebase** - Aligns with modern JavaScript/Node.js practices
- **One Lint Config** - No need to support both formats
- **Better IDE Support** - Improved autocomplete and validation in VSCode

### Negative

- **Breaking Change for Users** - Projects on Node.js < 16.9.0 cannot use Trinity linting (mitigated: already require 16.9.0)
- **Learning Curve** - Developers familiar with `.eslintrc.js` must learn new format (mitigated: documentation provided)
- **Plugin Compatibility** - Some older ESLint plugins may not support flat config yet (mitigated: major plugins updated)

### Neutral

- **Migration Required** - Existing Trinity deployments need to migrate (acceptable: part of major version update)
- **Documentation Updates** - Must document flat config format (acceptable: improves docs quality)

## Migration Guide for Users

For projects already using Trinity with legacy ESLint config:

### Step 1: Update Node.js

```bash
node --version  # Ensure ≥ 16.9.0
```

### Step 2: Update ESLint

```bash
npm install -D eslint@^9.39.2 @eslint/js@^9.39.2
```

### Step 3: Replace .eslintrc.js with eslint.config.js

```bash
rm .eslintrc.js
# New config deployed by Trinity update
```

### Step 4: Verify

```bash
npm run lint
```

## Validation

Success metrics after implementation:

1. **ESLint Execution** - ✅ Linting runs successfully on all SDK files
2. **TypeScript Support** - ✅ TypeScript files linted with full type checking
3. **Pre-commit Integration** - ✅ ESLint runs in pre-commit hooks
4. **CI/CD Integration** - ✅ ESLint checks pass in GitHub Actions
5. **User Adoption** - ✅ No reported issues with flat config format
6. **Zero Warnings** - ✅ SDK codebase has 0 ESLint warnings/errors

## Related Decisions

- **ADR-001: CLI Architecture** - CLI uses TypeScript with strict linting
- **ADR-004: Test Strategy** - Tests also linted with ESLint

## References

- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [ESLint v9.0.0 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [TypeScript ESLint Flat Config Guide](https://typescript-eslint.io/getting-started/typed-linting)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- Implementation: `eslint.config.js`
- Template: `src/templates/linting/node/eslint.config.js.template`
