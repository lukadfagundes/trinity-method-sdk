/**
 * Mock for chalk - used in Jest tests
 */

const passthrough = (text: string): string => text;

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
  dim: passthrough,
};

// Add nested properties
type ChalkInstance = typeof chalk & Record<string, unknown>;
(chalk as ChalkInstance).blue.bold = passthrough;
(chalk as ChalkInstance).green.bold = passthrough;
(chalk as ChalkInstance).red.bold = passthrough;
(chalk as ChalkInstance).yellow.bold = passthrough;

export default chalk;
