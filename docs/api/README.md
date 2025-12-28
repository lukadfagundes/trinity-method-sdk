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

## API Documentation Files

_This directory is reserved for markdown-based API documentation._

Current API docs are in TypeDoc HTML format (see [../index.html](../index.html))

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
