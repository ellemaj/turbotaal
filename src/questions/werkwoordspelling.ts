import {QuizCategory} from './types.js';

export const werkwoordspelling: QuizCategory = {
  easy: [
    {
      question: 'Wat is de verleden tijd van spelen?',
      answers: ['Speelde', 'Speelden', 'Speelte'],
      correct: 0
    }
  ],

  normal: [
    {
      question: 'Wat is de verleden tijd van beantwoorden?',
      answers: ['Beantwoorde', 'Beantwoordte', 'Beantwoordde'],
      correct: 2
    }
  ],

  hard: [
    {
      question: 'Wat is de verleden tijd van vermoeden?',
      answers: ['Vermoedte', 'Vermoedde', 'Vermoeddeed'],
      correct: 1
    }
  ]
};
