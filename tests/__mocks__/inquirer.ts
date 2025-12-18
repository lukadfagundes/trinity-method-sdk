/**
 * Mock for inquirer - used in Jest tests
 */

export default {
  prompt: async (questions: any[]) => {
    // Default to confirming all prompts in tests
    const answers: Record<string, any> = {};
    for (const question of questions) {
      if (question.type === 'confirm') {
        answers[question.name] = question.default !== undefined ? question.default : true;
      } else {
        answers[question.name] = question.default || '';
      }
    }
    return answers;
  }
};
