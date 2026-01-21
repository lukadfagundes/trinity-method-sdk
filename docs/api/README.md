# API Documentation

API reference documentation for Trinity Method SDK.

## API Overview

The Trinity Method SDK provides a comprehensive CLI and template system for deploying investigation-first development methodology to your projects.

## TypeDoc API Reference

The complete API reference is available as TypeDoc-generated HTML documentation in the parent directory:

**[View Full API Documentation](../index.html)** - TypeDoc generated reference

### Key Modules

- **CLI Commands** - `src/cli/commands/` implementation
  - `deploy` - Trinity deployment orchestration
  - `update` - SDK update management

- **Utilities** - `src/cli/utils/` helpers
  - Template processing and variable substitution
  - Stack detection (framework, package manager)
  - Path validation and security
  - Error handling and cleanup

- **Templates** - `src/templates/` system
  - Agent templates (19 agents)
  - Command templates (20 slash commands)
  - Framework-specific templates

## API Documentation Structure

This directory contains markdown-based API documentation for SDK modules and utilities. Documentation is organized into subdirectories by functional area:

### [Deploy Command](deploy/) (17 files)

Main deployment orchestration and configuration:

- [deploy-command.md](deploy/deploy-command.md) - Main deployment orchestration
- [deploy-configuration.md](deploy/deploy-configuration.md) - Interactive configuration prompts
- [deploy-pre-flight.md](deploy/deploy-pre-flight.md) - Pre-deployment validation
- [deploy-summary.md](deploy/deploy-summary.md) - Deployment results display
- [deploy-directories.md](deploy/deploy-directories.md) - Directory structure creation
- [deploy-gitignore.md](deploy/deploy-gitignore.md) - .gitignore management
- [deploy-agents.md](deploy/deploy-agents.md) - Agent template deployment
- [deploy-knowledge-base.md](deploy/deploy-knowledge-base.md) - Knowledge base deployment
- [deploy-root-files.md](deploy/deploy-root-files.md) - CLAUDE.md hierarchy deployment
- [deploy-templates.md](deploy/deploy-templates.md) - Work order/investigation templates
- [deploy-claude-setup.md](deploy/deploy-claude-setup.md) - Claude Code configuration
- [deploy-linting.md](deploy/deploy-linting.md) - Linting configuration deployment
- [deploy-linting-utils.md](deploy/deploy-linting-utils.md) - Linting configuration generation
- [deploy-ci-cd.md](deploy/deploy-ci-cd.md) - CI/CD workflow deployment
- [deploy-ci-utils.md](deploy/deploy-ci-utils.md) - CI/CD workflow generation
- [deploy-metrics.md](deploy/deploy-metrics.md) - Codebase metrics collection
- [deploy-sdk-install.md](deploy/deploy-sdk-install.md) - SDK installation to package.json

### [Update Command](update/) (11 files)

SDK update management and verification:

- [update-command.md](update/update-command.md) - Main update orchestration
- [update-backup.md](update/update-backup.md) - Backup creation and restoration
- [update-version.md](update/update-version.md) - Version management
- [update-verification.md](update/update-verification.md) - Update verification
- [update-pre-flight.md](update/update-pre-flight.md) - Pre-update validation
- [update-agents.md](update/update-agents.md) - Agent template updates
- [update-commands.md](update/update-commands.md) - Slash command updates
- [update-knowledge-base.md](update/update-knowledge-base.md) - Knowledge base updates
- [update-templates.md](update/update-templates.md) - Template updates
- [update-summary.md](update/update-summary.md) - Update results display
- [update-utils.md](update/update-utils.md) - Update utility functions

### [Utilities](utilities/) (6 files)

Core utility functions and helpers:

- [detect-stack.md](utilities/detect-stack.md) - Framework detection (Node.js, Python, Rust, Flutter, Go)
- [template-processor.md](utilities/template-processor.md) - Template variable substitution engine
- [validate-path.md](utilities/validate-path.md) - Path validation and security checks
- [get-sdk-path.md](utilities/get-sdk-path.md) - SDK path resolution
- [inject-dependencies.md](utilities/inject-dependencies.md) - Dependency injection
- [linting-tools.md](utilities/linting-tools.md) - Linting tool metadata

### [Error Handling](errors/) (3 files)

Error management and display:

- [error-classes.md](errors/error-classes.md) - Custom error types
- [error-handler.md](errors/error-handler.md) - Centralized error handling
- [errors.md](errors/errors.md) - Error display utilities

### [Metrics](metrics/) (5 files)

Codebase analysis and metrics collection:

- [metrics-code-quality.md](metrics/metrics-code-quality.md) - Code quality analysis
- [metrics-dependency-parser.md](metrics/metrics-dependency-parser.md) - Dependency parsing
- [metrics-file-complexity.md](metrics/metrics-file-complexity.md) - File complexity analysis
- [metrics-framework-detector.md](metrics/metrics-framework-detector.md) - Framework detection
- [metrics-git.md](metrics/metrics-git.md) - Git repository metrics

### TypeDoc API Reference

For complete type definitions and inline documentation, see the TypeDoc-generated HTML reference:

**[View Full API Documentation](../index.html)** - TypeDoc generated reference

## Contributing API Documentation

To document a new API:

1. Create a markdown file describing the API endpoint or module
2. Include:
   - Purpose and use case
   - Parameters and return values
   - Code examples
   - Error handling
3. Update this README with a link

---

See [../README.md](../README.md) for complete documentation index.
