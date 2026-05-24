import { useEffect, useState } from 'react';
import { BookOpen, FileText, Languages, Database, AlertCircle } from 'lucide-react';
import { analyzeBookPage, AnalysisResult } from '../services/geminiService';

interface AnalyzingPageProps {
  image: string | null;
  onComplete?: (result: AnalysisResult) => void;
  onCancel?: () => void;
}

export default function AnalyzingPage({ image, onComplete, onCancel }: AnalyzingPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyze = async () => {
      if (!image) {
        setError('No image provided for analysis');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Starting image analysis...');
        const result = await analyzeBookPage(image);
        console.log('Analysis complete:', result);
        onComplete?.(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
        console.error('Analysis error:', err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    analyze();
  }, [image, onComplete]);
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-indigo-600">LixiLens</span>
          </div>
          <button 
            onClick={onCancel}
            className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
          >
            New Scan
          </button>
        </header>

        <main className="px-6 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="relative mb-8 flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Analysis Failed
            </h1>
            <p className="text-gray-600 leading-relaxed mb-8">
              {error}
            </p>

            <button
              onClick={onCancel}
              className="px-6 py-3 text-white bg-indigo-600 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
          <span className="text-2xl font-bold text-indigo-600">LixiLens</span>
        </div>
        <button className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors">
          New Scan
        </button>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <div className="absolute -right-2 top-0 w-24 h-32 bg-gradient-to-l from-indigo-200 to-transparent rounded-full blur-xl opacity-60 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyzing your book page...
          </h1>
          <p className="text-gray-600 leading-relaxed mb-12">
            This may take a moment. We're identifying key vocabulary and extracting definitions to build your personalized study guide.
          </p>

          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    OCR STATUS
                  </p>
                  <p className="font-semibold text-gray-900">Recognizing Text</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Languages className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    PROCESSING
                  </p>
                  <p className="font-semibold text-gray-900">Contextual Sync</p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    STORAGE
                  </p>
                  <p className="font-semibold text-gray-900">Saving to Sanctuary</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <img
              src="https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Book preview"
              className="w-48 h-auto mx-auto rounded-xl shadow-lg opacity-50"
            />
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-gray-400 mt-auto">
        <div className="flex items-center justify-center gap-4 mb-3">
          <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>
        <p className="font-semibold text-gray-900 mb-1">LixiLens</p>
        <p>© 2024 LixiLens Intellectual Sanctuary</p>
      </footer>
    </div>
  );
}
