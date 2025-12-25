
import React, { useRef, useState } from 'react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  onUrlUpload: (url: string) => void;
  onLoadRecent: () => void;
  hasRecent: boolean;
  error: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload, 
  onUrlUpload, 
  onLoadRecent, 
  hasRecent, 
  error 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlUpload(url.trim());
    }
  };

  return (
    <div className="p-8 sm:p-12">
      {hasRecent && (
        <div className="mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="p-2 bg-indigo-600 rounded-lg mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-indigo-900">Sẵn sàng bài tập gần đây</p>
              <p className="text-xs text-indigo-700">Tiếp tục làm bộ câu hỏi đã lưu.</p>
            </div>
          </div>
          <button 
            onClick={onLoadRecent}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
          >
            Vào làm ngay
          </button>
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Cách 1: Tải trực tiếp từ URL (GitHub)</h3>
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Dán link GitHub Raw của file .docx vào đây..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              Tải bài
            </button>
          </form>
          <p className="mt-2 text-xs text-gray-400">Gợi ý: Dùng link GitHub Raw để ứng dụng tự động tải mỗi khi bạn vào web.</p>
        </div>

        <div className="relative py-4 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Hoặc</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl p-10 transition-all hover:border-indigo-500 hover:bg-indigo-50/30 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="bg-gray-100 p-3 rounded-full group-hover:bg-indigo-100 transition-colors">
              <svg className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Cách 2: Tải file từ máy tính</h3>
          <p className="text-gray-500 text-sm mb-4">Chọn file .docx có gạch chân đáp án</p>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx"
            className="hidden"
          />
          <div className="inline-flex items-center px-5 py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 text-sm font-bold rounded-xl shadow-sm">
            Chọn file Word
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center justify-center space-x-2 text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
