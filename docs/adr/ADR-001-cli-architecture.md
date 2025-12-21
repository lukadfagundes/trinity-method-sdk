# ADR-001: CLI Architecture using Commander.js

**Status:** Accepted
**Date:** 2025-12-21
**Deciders:** Development Team
**Technical Story:** Initial CLI implementation for Trinity Method SDK

---

## Context

The Trinity Method SDK needs a command-line interface to deploy Trinity Method files to user projects. The CLI must:

- Be easy to use for developers of all skill levels
- Support multiple commands (deploy, update, verify)
- Provide clear help documentation
- Handle command-line arguments and options
- Be maintainable and extensible

**Requirements:**

- Node.js-based CLI tool
- TypeScript for type safety
- Support for both global and local installation
- Helpful error messages

---

## Decision

We will use **Commander.js** as our CLI framework.

**Implementation:**

- Commander.js v12.x for command parsing
- TypeScript for implementation
- Bin entry point: `dist/cli/index.js`
- Command structure: `trinity <command> [options]`

**Key Commands:**

- `trinity deploy` - Deploy Trinity Method to project
- `trinity update` - Update existing deployment
- `trinity --version` - Show version information
- `trinity --help` - Show help documentation

---

## Consequences

### Positive Consequences

- **Battle-tested:** Commander.js is widely used and well-maintained
- **Type-safe:** Excellent TypeScript support with full type definitions
- **Developer experience:** Clear, intuitive API for adding commands
- **Help generation:** Automatic help text generation from command definitions
- **Extensibility:** Easy to add new commands as SDK grows
- **Zero dependencies:** Commander.js has minimal dependencies

### Negative Consequences

- **Learning curve:** Team must learn Commander.js API (minimal impact)
- **Framework lock-in:** Switching to another CLI framework would require refactoring
- **Bundle size:** Adds ~100KB to distribution (acceptable trade-off)

### Neutral Consequences

- **Standard patterns:** Follows common CLI conventions familiar to developers
- **Documentation:** Well-documented framework with extensive examples

---

## Alternatives Considered

### Alternative 1: Yargs

**Description:** Another popular CLI framework with different API design

**Pros:**

- Very flexible configuration
- Rich plugin ecosystem
- Strong TypeScript support

**Cons:**

- More complex API than Commander.js
- Larger bundle size (~200KB)
- More dependencies to maintain

**Why not chosen:** Commander.js provides simpler API with better type safety and smaller footprint

### Alternative 2: Custom CLI Parser

**Description:** Build CLI parsing from scratch using Node.js process.argv

**Pros:**

- No external dependencies
- Complete control over implementation
- Smallest possible bundle size

**Cons:**

- Must implement help generation manually
- Must implement argument parsing from scratch
- Must handle edge cases and validation
- Significant development time
- Harder to maintain

**Why not chosen:** Reinventing the wheel when battle-tested solutions exist. Development time better spent on core functionality.

### Alternative 3: Oclif

**Description:** Comprehensive CLI framework by Heroku/Salesforce

**Pros:**

- Very powerful and feature-rich
- Plugin architecture
- Auto-generated documentation

**Cons:**

- Much larger footprint (~1MB+)
- Overkill for our needs
- Steeper learning curve
- Many features we don't need

**Why not chosen:** Too heavy for our use case. We need simplicity over power.

---

## Implementation Notes

**File Structure:**

```
src/cli/
├── index.ts                 # Main CLI entry point
├── commands/
│   ├── deploy/
│   │   └── index.ts         # Deploy command implementation
│   └── update/
│       └── index.ts         # Update command implementation
└── utils/                   # Shared utilities
```

**Example Command Definition:**

```typescript
import { Command } from 'commander';

const program = new Command();

program
  .name('trinity')
  .description('Trinity Method SDK - Investigation-first development')
  .version('1.0.0');

program
  .command('deploy')
  .description('Deploy Trinity Method to your project')
  .option('--force', 'Force redeploy')
  .action(async (options) => {
    await deploy(options);
  });

program.parse();
```

**Migration Path:**

- Commander.js is the initial implementation
- Can migrate to another framework if needs change
- Command structure remains stable regardless of framework

**Validation:**

- CLI works across Windows, macOS, Linux
- Help text is clear and useful
- Error messages are helpful
- Commands are intuitive

---

## References

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Node.js CLI Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)
- [TypeScript Commander.js Types](https://www.npmjs.com/package/@types/commander)

---

## Revision History

| Date       | Author | Change Description |
| ---------- | ------ | ------------------ |
| 2025-12-21 | APO    | Initial version    |
