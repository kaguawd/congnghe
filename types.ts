
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  imageUrl?: string; // Base64 or URL of the associated image
}

export interface QuizState {
  questions: Question[];
  userAnswers: Record<string, number>;
  isFinished: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AppView = 'upload' | 'quiz' | 'result';
