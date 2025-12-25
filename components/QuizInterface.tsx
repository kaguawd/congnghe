
import React, { useState } from 'react';
import { Question } from '../types';

interface QuizInterfaceProps {
  questions: Question[];
  userAnswers: Record<string, number>;
  onSelectAnswer: (id: string, index: number) => void;
  onFinish: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ 
  questions, 
  userAnswers, 
  onSelectAnswer, 
  onFinish 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-indigo-600">Câu hỏi {currentIndex + 1} / {totalQuestions}</span>
          <span className="text-sm text-gray-400">{Math.round(progress)}% hoàn thành</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-10 min-h-[160px]">
        {currentQuestion.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex justify-center">
            <img 
              src={currentQuestion.imageUrl} 
              alt="Question Visual" 
              className="max-h-64 object-contain"
            />
          </div>
        )}
        
        <h2 className="text-xl font-bold text-gray-800 leading-relaxed mb-6">
          {currentQuestion.text}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => onSelectAnswer(currentQuestion.id, idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center group
                ${userAnswers[currentQuestion.id] === idx 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' 
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-sm font-bold transition-colors
                ${userAnswers[currentQuestion.id] === idx 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-colors
            ${currentIndex === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          Quay lại
        </button>

        {isLastQuestion ? (
          <button
            onClick={onFinish}
            className={`px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 flex items-center space-x-2
              ${Object.keys(userAnswers).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={Object.keys(userAnswers).length === 0}
          >
            <span>Kết thúc bài làm</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl transition-all hover:bg-indigo-50 active:scale-95"
          >
            Tiếp theo
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
