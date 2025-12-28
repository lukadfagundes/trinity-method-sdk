# ADR-001: CLI Architecture

**Status:** Accepted
**Date:** 2025-12-28
**Deciders:** Trinity Method SDK Core Team
**Technical Story:** Design and implement the Trinity Method SDK command-line interface

## Context

Trinity Method SDK needed a robust, user-friendly CLI to enable developers to deploy and manage the Trinity Method in their projects. The CLI needed to support:

- Multiple commands (`deploy`, `update`, etc.)
- Interactive prompts for user configuration
- Framework detection across multiple languages
- Clear help documentation and error messages
- Extensibility for future commands
- TypeScript support for type safety

Key requirements:

1. **Interactive Configuration** - Users should be guided through deployment with prompts rather than complex command-line flags
2. **Framework Agnostic** - Must work across Node.js, Python, Rust, Flutter, Go projects
3. **Professional UX** - Spinners, colored output, clear success/error messages
4. **Type Safety** - Full TypeScript support for maintainability
5. **Extensibility** - Easy to add new commands as the SDK evolves

## Decision Drivers

- **Developer Experience** - CLI must be intuitive for developers of all skill levels
- **Maintainability** - Codebase should be easy to understand and extend
- **Industry Standards** - Use well-established libraries with active communities
- **TypeScript Integration** - First-class TypeScript support with type definitions
- **Interactive Capabilities** - Support for rich prompts (select, confirm, input)

## Considered Options

### Option 1: Commander.js + Inquirer.js

- **Commander.js** (v14.0.2) - Command-line framework for command parsing and structure
- **Inquirer.js** (v13.1.0) - Interactive command-line prompts
- **Chalk** (v5.3.0) - Terminal string styling
- **Ora** (v9.0.0) - Terminal spinners

**Pros:**

- Industry standard with massive adoption (Commander: 35M+ weekly downloads)
- Excellent TypeScript support with type definitions
- Inquirer provides rich interactive prompts (select, confirm, input, checkbox)
- Clean separation between command logic and user interaction
- Active maintenance and large community
- Easy to extend with new commands

**Cons:**

- Requires multiple libraries (Commander + Inquirer + styling)
- Slightly more boilerplate than all-in-one solutions

### Option 2: Oclif (by Salesforce)

- Comprehensive CLI framework with batteries included
- Built-in plugin system and command discovery

**Pros:**

- All-in-one solution with less configuration
- Built-in plugin architecture
- Auto-generated help documentation

**Cons:**

- Heavier framework with more abstraction
- Steeper learning curve for contributors
- Less flexible for custom interactive flows
- More opinionated structure

### Option 3: Yargs

- Argument parsing and command framework

**Pros:**

- Simple API for basic CLIs
- Good TypeScript support

**Cons:**

- Less sophisticated interactive capabilities
- More manual work for rich prompts
- Less elegant command structure for complex CLIs

### Option 4: CAC (Command And Conquer)

- Lightweight CLI framework

**Pros:**

- Very lightweight
- Simple API

**Cons:**

- Smaller community and ecosystem
- Limited interactive prompt support
- Less mature than Commander.js

## Decision

**Chosen Option: Commander.js + Inquirer.js**

We will use Commander.js for command structure and Inquirer.js for interactive prompts, supplemented by Chalk for styling and Ora for spinners.

**Rationale:**

1. **Industry Standard** - Commander.js is the most widely-used Node.js CLI framework (35M+ weekly downloads), ensuring long-term support and community resources

2. **Interactive Excellence** - Inquirer.js provides the best interactive prompt experience with rich question types (select, confirm, input, checkbox, password)

3. **TypeScript First-Class** - Both libraries have excellent TypeScript support with comprehensive type definitions

4. **Clean Architecture** - Clear separation of concerns:
   - Commander handles command structure and routing
   - Inquirer handles user interaction
   - Core logic remains framework-agnostic

5. **Extensibility** - Easy to add new commands by creating new command files in `src/cli/commands/`

6. **Professional UX** - Chalk and Ora provide polished terminal output with colors and spinners

## Implementation Details

### Directory Structure

```
src/cli/
├── index.ts              # CLI entry point
├── commands/
│   ├── deploy.ts         # Deploy command implementation
│   └── update.ts         # Update command implementation
└── utils/
    ├── promptUser.ts     # Inquirer prompt utilities
    ├── spinner.ts        # Ora spinner utilities
    └── logger.ts         # Chalk-based logging
```

### Command Definition Pattern

```typescript
import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';

export const deployCommand = new Command('deploy')
  .description('Deploy Trinity Method to your project')
  .action(async () => {
    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Select your framework:',
        choices: ['Node.js', 'Python', 'Rust', 'Flutter', 'Go'],
      },
    ]);

    // Deployment logic with spinner
    const spinner = ora('Deploying Trinity...').start();
    await deployTrinity(answers);
    spinner.succeed('Trinity deployed successfully!');
  });
```

### Help Output Example

```bash
$ trinity --help
Usage: trinity [options] [command]

Investigation-first development methodology deployment tool

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  deploy          Deploy Trinity Method to your project
  update          Update Trinity deployment to latest version
  help [command]  display help for command
```

## Consequences

### Positive

- **Excellent Developer Experience** - Users get guided through deployment with clear prompts and feedback
- **Maintainable Codebase** - Clear command structure makes it easy to add new commands
- **Type Safety** - Full TypeScript support prevents runtime errors
- **Professional Output** - Colored output, spinners, and clear messages create polished UX
- **Future-Proof** - Active maintenance and large communities ensure long-term viability
- **Easy Testing** - Command logic can be tested independently from CLI framework

### Negative

- **Multiple Dependencies** - Requires 4 main libraries (Commander, Inquirer, Chalk, Ora) vs. all-in-one solutions
- **Bundle Size** - Combined dependencies add ~2MB to distribution (acceptable for CLI tool)
- **Learning Curve** - Contributors need to learn Commander and Inquirer APIs (mitigated by excellent documentation)

### Neutral

- **Manual Command Registration** - Commands must be manually registered in CLI entry point (acceptable tradeoff for clarity)
- **ESM Migration** - Chalk v5 and Ora v9 are ESM-only (requires project to use ES modules, which aligns with modern Node.js)

## Validation

Success metrics after implementation:

1. **Deployment Success Rate** - 100% successful deployments in testing across all supported frameworks
2. **Average Deployment Time** - 2-3 seconds for complete Trinity deployment (64 components)
3. **User Feedback** - Positive feedback on CLI usability and clear prompts
4. **Test Coverage** - 405 tests including comprehensive CLI command testing
5. **Maintainability** - New commands added in < 1 hour of development time

## Related Decisions

- **ADR-002: Template System Design** - CLI drives template processing pipeline
- **ADR-004: Test Strategy** - CLI commands covered by integration tests

## References

- [Commander.js Documentation](https://github.com/tj/commander.js)
- [Inquirer.js Documentation](https://github.com/SBoudrias/Inquirer.js)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [Ora Documentation](https://github.com/sindresorhus/ora)
- [Node.js CLI Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)
