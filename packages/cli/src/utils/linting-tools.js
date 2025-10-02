export const lintingTools = {
  'Node.js': [
    {
      id: 'eslint',
      name: 'ESLint',
      description: 'JavaScript/TypeScript linter',
      file: '.eslintrc.json',
      recommended: true,
      dependencies: ['eslint@^8.50.0'],
      scripts: {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
      },
    },
    {
      id: 'prettier',
      name: 'Prettier',
      description: 'Code formatter',
      file: '.prettierrc.json',
      recommended: true,
      dependencies: ['prettier@^3.0.0'],
      scripts: {
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"',
      },
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
      postInstall: 'pip install pre-commit && pre-commit install',
    },
    {
      id: 'typescript-eslint',
      name: 'TypeScript ESLint',
      description: 'TypeScript-specific linting',
      file: 'extends typescript in .eslintrc.json',
      recommended: false, // Only if TypeScript detected
      dependencies: [
        '@typescript-eslint/parser@^6.7.0',
        '@typescript-eslint/eslint-plugin@^6.7.0',
      ],
      requiresTypeScript: true,
    },
  ],

  'React': [
    {
      id: 'eslint',
      name: 'ESLint',
      description: 'JavaScript/TypeScript linter',
      file: '.eslintrc.json',
      recommended: true,
      dependencies: ['eslint@^8.50.0', 'eslint-plugin-react@^7.33.0'],
      scripts: {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
      },
    },
    {
      id: 'prettier',
      name: 'Prettier',
      description: 'Code formatter',
      file: '.prettierrc.json',
      recommended: true,
      dependencies: ['prettier@^3.0.0'],
      scripts: {
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"',
      },
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
      postInstall: 'pip install pre-commit && pre-commit install',
    },
    {
      id: 'typescript-eslint',
      name: 'TypeScript ESLint',
      description: 'TypeScript-specific linting',
      file: 'extends typescript in .eslintrc.json',
      recommended: false,
      dependencies: [
        '@typescript-eslint/parser@^6.7.0',
        '@typescript-eslint/eslint-plugin@^6.7.0',
      ],
      requiresTypeScript: true,
    },
  ],

  'Python': [
    {
      id: 'black',
      name: 'Black',
      description: 'Python code formatter',
      file: 'pyproject.toml',
      recommended: true,
      dependencies: ['black>=23.0.0'],
    },
    {
      id: 'flake8',
      name: 'Flake8',
      description: 'Python linter',
      file: '.flake8',
      recommended: true,
      dependencies: ['flake8>=6.0.0'],
    },
    {
      id: 'isort',
      name: 'isort',
      description: 'Import sorter',
      file: 'pyproject.toml',
      recommended: true,
      dependencies: ['isort>=5.12.0'],
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: ['pre-commit>=3.3.0'],
      postInstall: 'pre-commit install',
    },
  ],

  'Flutter': [
    {
      id: 'dartanalyzer',
      name: 'Dart Analyzer',
      description: 'Dart/Flutter linter',
      file: 'analysis_options.yaml',
      recommended: true,
      dependencies: [], // Built into Dart SDK
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
      postInstall: 'pip install pre-commit && pre-commit install',
    },
  ],

  'Rust': [
    {
      id: 'clippy',
      name: 'Clippy',
      description: 'Rust linter',
      file: 'clippy.toml',
      recommended: true,
      dependencies: [], // Built into Rust toolchain
    },
    {
      id: 'rustfmt',
      name: 'Rustfmt',
      description: 'Rust formatter',
      file: 'rustfmt.toml',
      recommended: true,
      dependencies: [], // Built into Rust toolchain
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
      postInstall: 'pip install pre-commit && pre-commit install',
    },
  ],
};

export function getToolsForFramework(framework, language) {
  // Special handling for TypeScript
  const tools = lintingTools[framework] || lintingTools['Node.js'] || [];

  if (language === 'TypeScript') {
    return tools.map((tool) => {
      if (tool.requiresTypeScript) {
        return { ...tool, recommended: true };
      }
      return tool;
    });
  }

  return tools.filter((tool) => !tool.requiresTypeScript);
}

export function getRecommendedTools(framework, language) {
  const tools = getToolsForFramework(framework, language);
  return tools.filter((tool) => tool.recommended);
}

export function getDependenciesForTools(selectedTools) {
  return selectedTools.flatMap((tool) => tool.dependencies || []);
}

export function getScriptsForTools(selectedTools) {
  const scripts = {};
  selectedTools.forEach((tool) => {
    if (tool.scripts) {
      Object.assign(scripts, tool.scripts);
    }
  });
  return scripts;
}

export function getPostInstallInstructions(selectedTools, framework) {
  const instructions = [];

  selectedTools.forEach((tool) => {
    if (tool.postInstall) {
      instructions.push({
        tool: tool.name,
        command: tool.postInstall,
      });
    }
  });

  return instructions;
}
