/**
 * Mock for ora spinner - used in Jest tests
 */

export type Ora = {
  start: () => Ora;
  succeed: (text?: string) => Ora;
  fail: (text?: string) => Ora;
  warn: (text?: string) => Ora;
  info: (text?: string) => Ora;
  stop: () => Ora;
  text: string;
};

const mockSpinner: Ora = {
  start: () => mockSpinner,
  succeed: () => mockSpinner,
  fail: () => mockSpinner,
  warn: () => mockSpinner,
  info: () => mockSpinner,
  stop: () => mockSpinner,
  text: ''
};

export default function ora(_text?: string): Ora {
  return mockSpinner;
}
