import {QuizCategory} from './types.js';

export const spelling: QuizCategory = {
  easy: [
    {
      question: 'Welke spelling is correct?',
      answers: ['Appart', 'Apart', 'Apard'],
      correct: 1
    }
  ],

  normal: [
    {
      question: 'Welke spelling is correct?',
      answers: ['Intressant', 'Intresant', 'Interessant'],
      correct: 2
    }
  ],

  hard: [
    {
      question: 'Welke spelling is juist?',
      answers: ['Discussiëren', 'Discussieëren', 'Discusiëren'],
      correct: 0
    }
  ]
};
