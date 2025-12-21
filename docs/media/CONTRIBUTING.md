# Contributing to Trinity Method SDK

Thank you for your interest in contributing to Trinity Method SDK!

## Current Status

Trinity Method SDK v1.0.0 is built for [Claude Code](https://claude.com/claude-code).

## Contributing Support for Other Agents

We welcome contributions to add support for other AI coding agents (Cursor, GitHub Copilot, Aider, etc.).

### Guidelines

1. **Agent-Specific Templates**: Create templates in `packages/cli/templates/[agent-name]/`
2. **Context Files**: Each agent needs its own context file format (e.g., cursor-rules.md, copilot-instructions.md)
3. **Agent Configuration**: Add agent config to deployment logic
4. **Documentation**: Update README with agent-specific instructions
5. **Testing**: Test full deployment for your agent

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/add-cursor-support`)
3. Implement your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- 2-space indentation
- camelCase for functions and variables
- Clear, descriptive naming
- ESLint compliant (when ESLint config is added)

### Questions?

Open an issue at: https://github.com/lukadfagundes/trinity-method-sdk/issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
