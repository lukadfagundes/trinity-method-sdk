/**
 * Mock for inquirer - used in Jest tests
 */

interface Question {
  type?: string;
  name: string;
  default?: unknown;
}

export default {
  prompt: async (questions: Question[]): Promise<Record<string, unknown>> => {
    // Default to confirming all prompts in tests
    const answers: Record<string, unknown> = {};
    for (const question of questions) {
      if (question.type === 'confirm') {
        answers[question.name] = question.default !== undefined ? question.default : true;
      } else {
        answers[question.name] = question.default || '';
      }
    }
    return answers;
  },
};
