import {QuizCategory} from './types.js';

// In the file where you're gonna process the questions&answers, set the following at the top:
// import {verkleinwoorden} from '../questions/verkleinwoorden';
export const verkleinwoorden: QuizCategory = {
  easy: [
    {
      question: 'Wat is het verkleinwoord van boom?',
      answers: ['Boompje', 'Boomtje', 'Boomje'],
      correct: 0
    }
  ],

  normal: [
    {
      question: 'Wat is het verkleinwoord van tas?',
      answers: ['Tassie', 'Tastje', 'Tasje'],
      correct: 2
    }
  ],

  hard: [
    {
      question: 'Wat is het verkleinwoord van koning?',
      answers: ['Koninkje', 'Koningtje', 'Koningentje'],
      correct: 1
    }
  ]
};
