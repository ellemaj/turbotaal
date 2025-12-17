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
    },
    {
      question: 'Wat is de verleden tijd van huren?',
      answers: ['Huurde', 'Gehuurd', 'Gehuren'],
      correct: 0
    },
    {
      question: 'Wat is de verleden tijd van trappen?',
      answers: ['Trapde', 'Triep', 'Trapte'],
      correct: 2
    },
    {
      question: 'Wat is de verleden tijd van werken?',
      answers: ['Wierk', 'Werkte', 'Werkde'],
      correct: 1
    },
    {
      question: 'Wat is de verleden tijd van luiden?',
      answers: ['Luide', 'Luidde', 'Geluid'],
      correct: 1
    },
    {
      question: 'Wat is de verleden tijd van typen',
      answers: ['Typte', 'Type', 'Typerde'],
      correct: 0
    },
    {
      question: 'Wat is de verleden tijd van inpakken',
      answers: ['Pakte in', 'Inpakte', ''],
      correct: 0
    },


  ],

  hard: [
    {
      question: 'Wat is de verleden tijd van vermoeden?',
      answers: ['Vermoedte', 'Vermoedde', 'Vermoeddeed'],
      correct: 1
    }
  ]
};
