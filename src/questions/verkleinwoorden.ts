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
    },
    {question: 'Wat is het verkleinwoord van stoel?',
      answers: ['Stoeltje', 'Stoeletje', 'Stoelkje'],
      correct: 0
    },
    {question: 'Wat is het verkleinwoord van boom?',
      answers: ['Boomtje', 'Boompje', 'Boomje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van band?',
      answers: ['Bantje', 'Bandje', 'Bandtje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van stoel?',
      answers: ['Stoeltje', 'Stoeletje', 'Stoelkje'],
      correct: 0
    },
    {question: 'Wat is het verkleinwoord van glas?',
      answers: ['Glassie', 'Glasje', 'Glaasje'],
      correct: 2
    },
    {question: 'Wat is het verkleinwoord van school?',
      answers: ['Schoolje', 'Schooltje', 'Schooldje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van oor?',
      answers: ['oorje', 'oordje', 'oortje'],
      correct: 2
    },
    {question: 'Wat is het verkleinwoord van knot?',
      answers: ['Knodtje', 'Knotje', 'Knodje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van fles?',
      answers: ['flessje', 'flesje', 'flestje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van trui?',
      answers: ['Truitje', 'Truidje', 'Truije'],
      correct: 0
    },
    {question: 'Wat is het verkleinwoord van leerling?',
      answers: ['Leerlingtje', 'Leerlingetje', 'Leerlingje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van schaats?',
      answers: ['Schaatstje', 'Schaatsje', 'Schaadsje'],
      correct: 1
    },
    {question: 'Wat is het verkleinwoord van poort?',
      answers: ['Poordje', 'Pooretje', 'Poortje'],
      correct: 2
    },
    {question: 'Wat is het verkleinwoord van tekening?',
      answers: ['Tekeningetje', 'Tekeningsje', 'Tekeningtje'],
      correct: 0
    },
    {question: 'Wat is het verkleinwoord van sticker?',
      answers: ['Stickertje', 'Stickeretje', 'Stickerje'],
      correct: 0
    },

  ],

  hard: [
    {
      question: 'Wat is het verkleinwoord van koning?',
      answers: ['Koninkje', 'Koningtje', 'Koningentje'],
      correct: 1
    }
  ]
};
