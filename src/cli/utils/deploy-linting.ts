import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from './template-processor.js';
import { LintingTool, Stack } from '../types.js';

export async function deployLintingTool(
  tool: LintingTool,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, string | number>
): Promise<void> {
  const frameworkDir = getFrameworkDirectory(stack.framework);
  const templateDir = path.join(templatesPath, 'linting', frameworkDir);

  switch (tool.id) {
    case 'eslint':
      await deployESLint(tool, stack, templateDir, variables);
      break;
    case 'prettier':
      await deployPrettier(tool, templateDir, variables);
      break;
    case 'precommit':
      await deployPreCommit(tool, templateDir, variables);
      break;
    case 'typescript-eslint':
      await deployTypeScriptESLint(tool, stack, templateDir, variables);
      break;
    case 'black':
    case 'flake8':
    case 'isort':
      await deployPythonTool(tool, templateDir, variables);
      break;
    case 'dartanalyzer':
      await deployDartAnalyzer(tool, templateDir, variables);
      break;
    case 'clippy':
    case 'rustfmt':
      await deployRustTool(tool, templateDir, variables);
      break;
    default:
      console.warn(`Unknown linting tool: ${tool.id}`);
  }
}

function getFrameworkDirectory(framework: string): string {
  const frameworkMap: Record<string, string> = {
    'Node.js': 'nodejs',
    React: 'nodejs',
    'Next.js': 'nodejs',
    Python: 'python',
    Flutter: 'flutter',
    Rust: 'rust',
  };
  return frameworkMap[framework] || 'nodejs';
}

async function deployESLint(
  tool: LintingTool,
  stack: Stack,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  let templateFile: string;

  if (stack.language === 'TypeScript') {
    templateFile = '.eslintrc-typescript.json.template';
  } else if ('moduleType' in stack && (stack as { moduleType?: string }).moduleType === 'esm') {
    templateFile = '.eslintrc-esm.json.template';
  } else {
    templateFile = '.eslintrc-commonjs.json.template';
  }

  const templatePath = path.join(templateDir, templateFile);
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile('.eslintrc.json', processed);
}

async function deployPrettier(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, '.prettierrc.json.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile('.prettierrc.json', processed);
}

async function deployPreCommit(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, '.pre-commit-config.yaml.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile('.pre-commit-config.yaml', processed);
}

async function deployTypeScriptESLint(
  tool: LintingTool,
  stack: Stack,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  // Modify existing .eslintrc.json to add TypeScript support
  const eslintPath = '.eslintrc.json';
  if (await fs.pathExists(eslintPath)) {
    const config = await fs.readJson(eslintPath);
    config.extends = config.extends || [];
    if (!config.extends.includes('plugin:@typescript-eslint/recommended')) {
      config.extends.push('plugin:@typescript-eslint/recommended');
    }
    config.parser = '@typescript-eslint/parser';
    config.plugins = config.plugins || [];
    if (!config.plugins.includes('@typescript-eslint')) {
      config.plugins.push('@typescript-eslint');
    }
    await fs.writeJson(eslintPath, config, { spaces: 2 });
  }
}

async function deployPythonTool(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  if (tool.id === 'black' || tool.id === 'isort') {
    // Both go in pyproject.toml
    const templatePath = path.join(templateDir, 'pyproject.toml.template');
    const content = await fs.readFile(templatePath, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('pyproject.toml', processed);
  } else if (tool.id === 'flake8') {
    const templatePath = path.join(templateDir, '.flake8.template');
    const content = await fs.readFile(templatePath, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('.flake8', processed);
  }
}

async function deployDartAnalyzer(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, 'analysis_options.yaml.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile('analysis_options.yaml', processed);
}

async function deployRustTool(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const filename = tool.id === 'clippy' ? 'clippy.toml' : 'rustfmt.toml';
  const templatePath = path.join(templateDir, `${filename}.template`);
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);
  await fs.writeFile(filename, processed);
}
