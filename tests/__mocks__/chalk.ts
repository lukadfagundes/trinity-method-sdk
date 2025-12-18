/**
 * Mock for chalk - used in Jest tests
 */

const passthrough = (text: string) => text;

const chalk = {
  blue: passthrough,
  green: passthrough,
  red: passthrough,
  yellow: passthrough,
  gray: passthrough,
  grey: passthrough,
  white: passthrough,
  cyan: passthrough,
  bold: passthrough,
  dim: passthrough
};

// Add nested properties
(chalk as any).blue.bold = passthrough;
(chalk as any).green.bold = passthrough;
(chalk as any).red.bold = passthrough;
(chalk as any).yellow.bold = passthrough;

export default chalk;
