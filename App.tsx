
import React, { useState, useCallback, useEffect } from 'react';
import { QuizState, AppView, Question } from './types';
import { parseQuizContent } from './services/geminiService';
import FileUploader from './components/FileUploader';
import QuizInterface from './components/QuizInterface';
import ResultView from './components/ResultView';

declare const mammoth: any;

// ========================================================
// CHỖ ĐỂ BỎ FILE WORD CỦA BẠN:
// Thay link dưới đây bằng link GitHub Raw của file .docx bạn đã tải lên
// ========================================================
const DEFAULT_QUIZ_URL = "https://raw.githubusercontent.com/user/repo/main/quiz.docx"; 

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('upload');
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    userAnswers: {},
    isFinished: false,
    isLoading: false,
    error: null,
  });

  const processWordBuffer = async (arrayBuffer: ArrayBuffer) => {
    const images: string[] = [];
    const options = {
      styleMap: ["u => u"],
      convertImage: mammoth.images.inline((element: any) => {
        return element.read("base64").then((imageBuffer: any) => {
          const imageIndex = images.length;
          images.push(`data:${element.contentType};base64,${imageBuffer.base64}`);
          return { src: `[IMAGE_REF_${imageIndex}]` };
        });
      })
    };

    const result = await mammoth.convertToHtml({ arrayBuffer }, options);
    const html = result.value;
    const parsedResults = await parseQuizContent(html);
    
    return parsedResults.map((q: any) => ({
      ...q,
      imageUrl: q.imageRefId !== undefined ? images[parseInt(q.imageRefId)] : undefined
    }));
  };

  const handleUrlUpload = useCallback(async (url: string, isAutoLoad: boolean = false) => {
    setQuizState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Không thể tải file từ GitHub. Hãy kiểm tra lại link Raw.');
      
      const arrayBuffer = await response.arrayBuffer();
      const questionsWithImages = await processWordBuffer(arrayBuffer);
      
      setQuizState({
        questions: questionsWithImages,
        userAnswers: {},
        isFinished: false,
        isLoading: false,
        error: null,
      });
      setView('quiz');
    } catch (err: any) {
      // Nếu là tự động tải mà lỗi thì hiện màn hình upload để người dùng dán link khác
      setQuizState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: isAutoLoad ? null : 'Lỗi: ' + (err.message || 'Kiểm tra lại link.') 
      }));
      if (!isAutoLoad) setView('upload');
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('quiz');
    const directUrl = urlParams.get('url');

    if (directUrl) {
      handleUrlUpload(decodeURIComponent(directUrl));
    } else if (sharedData) {
      try {
        const decodedData = JSON.parse(atob(decodeURIComponent(sharedData)));
        setQuizState(prev => ({ ...prev, questions: decodedData }));
        setView('quiz');
      } catch (e) {}
    } else if (DEFAULT_QUIZ_URL && DEFAULT_QUIZ_URL !== "https://raw.githubusercontent.com/user/repo/main/quiz.docx") {
      // Tự động tải từ link mặc định nếu bạn đã thay đổi nó
      handleUrlUpload(DEFAULT_QUIZ_URL, true);
    }
  }, [handleUrlUpload]);

  const handleFileUpload = useCallback(async (file: File) => {
    setQuizState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const arrayBuffer = await file.arrayBuffer();
      const questionsWithImages = await processWordBuffer(arrayBuffer);
      
      setQuizState({
        questions: questionsWithImages,
        userAnswers: {},
        isFinished: false,
        isLoading: false,
        error: null,
      });
      setView('quiz');
    } catch (err: any) {
      setQuizState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || 'Đã xảy ra lỗi khi xử lý tệp.' 
      }));
    }
  }, []);

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [questionId]: optionIndex }
    }));
  };

  const handleFinish = () => {
    setQuizState(prev => ({ ...prev, isFinished: true }));
    setView('result');
  };

  const handleReset = () => {
    // Khi reset, nếu có link mặc định thì load lại bài đó
    if (DEFAULT_QUIZ_URL && DEFAULT_QUIZ_URL !== "https://raw.githubusercontent.com/user/repo/main/quiz.docx") {
      handleUrlUpload(DEFAULT_QUIZ_URL, true);
    } else {
      setView('upload');
      setQuizState({
        questions: [],
        userAnswers: {},
        isFinished: false,
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      <header className="w-full max-w-4xl mb-8 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-200 cursor-pointer" onClick={handleReset}>
           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
           </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Quiz Master AI</h1>
        <p className="mt-2 text-gray-500 text-center max-w-md">
          Làm bài trắc nghiệm trực tuyến từ file Word của bạn.
        </p>
      </header>

      <main className="w-full max-w-3xl bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 min-h-[400px] flex flex-col">
        {quizState.isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 font-medium animate-pulse">Đang chuẩn bị câu hỏi...</p>
          </div>
        ) : (
          <>
            {view === 'upload' && (
              <FileUploader 
                onUpload={handleFileUpload} 
                onUrlUpload={(url) => handleUrlUpload(url)}
                error={quizState.error} 
              />
            )}
            {view === 'quiz' && (
              <QuizInterface 
                questions={quizState.questions}
                userAnswers={quizState.userAnswers}
                onSelectAnswer={handleSelectAnswer}
                onFinish={handleFinish}
              />
            )}
            {view === 'result' && (
              <ResultView 
                questions={quizState.questions}
                userAnswers={quizState.userAnswers}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      <footer className="mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Quiz Master AI.
      </footer>
    </div>
  );
};

export default App;
