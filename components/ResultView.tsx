
import React, { useState } from 'react';
import { Question } from '../types';

interface ResultViewProps {
  questions: Question[];
  userAnswers: Record<string, number>;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ questions, userAnswers, onReset }) => {
  const [copied, setCopied] = useState(false);
  const correctCount = questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctAnswerIndex ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((correctCount / questions.length) * 100);

  const handleShare = () => {
    // Loại bỏ ảnh để link không quá dài (URL limit)
    const textOnlyQuestions = questions.map(({ imageUrl, ...rest }) => rest);
    const encoded = btoa(JSON.stringify(textOnlyQuestions));
    const shareUrl = `${window.location.origin}${window.location.pathname}?quiz=${encodeURIComponent(encoded)}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 mb-6 border-4 border-indigo-50 shadow-inner">
          <span className="text-4xl font-black">{scorePercentage}%</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài làm</h2>
        <p className="text-gray-500 text-lg">
          Bạn đúng <span className="text-indigo-600 font-bold">{correctCount}/{questions.length}</span> câu.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <button
          onClick={handleShare}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-sm
            ${copied ? 'bg-green-600 text-white' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Đã sao chép link!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Chia sẻ link cho người khác</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-10 custom-scrollbar">
        {questions.map((q, idx) => {
          const userAnswer = userAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswerIndex;
          
          return (
            <div 
              key={q.id} 
              className={`p-5 rounded-2xl border-l-4 transition-all
                ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">
                    Câu {idx + 1}: {q.text}
                  </h4>
                </div>
                {isCorrect ? (
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full ml-3 flex-shrink-0">ĐÚNG</span>
                ) : (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full ml-3 flex-shrink-0">SAI</span>
                )}
              </div>

              <div className="space-y-2 mt-4">
                {q.options.map((opt, oIdx) => {
                  const isCorrectOption = oIdx === q.correctAnswerIndex;
                  const isUserSelection = oIdx === userAnswer;
                  
                  return (
                    <div 
                      key={oIdx}
                      className={`text-xs p-2.5 rounded-lg flex items-center
                        ${isCorrectOption ? 'bg-white border border-green-200 text-green-800 font-semibold' : 
                          isUserSelection ? 'bg-white border border-red-200 text-red-800' : 
                          'text-gray-500 bg-white/50'}`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-[9px] font-black
                        ${isCorrectOption ? 'bg-green-500 text-white' : 
                          isUserSelection ? 'bg-red-500 text-white' : 
                          'bg-gray-100 text-gray-400'}`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
        <button
          onClick={onReset}
          className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Làm bài khác</span>
        </button>
      </div>
    </div>
  );
};

export default ResultView;
