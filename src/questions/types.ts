// Makes the question files work bij exporting the interfaces
export interface Question {
  question: string;
  answers: string[];
  correct: number;
}

export interface PitstopQuestion {
  question: string;
  missing: string;
}

export interface QuizCategory {
  easy: Question[];
  normal: Question[];
  hard: Question[];
}

export interface PitstopQuiz {
  easy: PitstopQuestion[];
  normal: PitstopQuestion[];
  hard: PitstopQuestion[];
}
