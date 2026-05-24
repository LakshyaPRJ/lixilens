import { BookOpen, BookMarked } from 'lucide-react';
import { AnalysisResult } from '../services/geminiService';

interface VocabularyResultsProps {
  result: AnalysisResult | null;
  onNewScan?: () => void;
}

export default function VocabularyResults({ result, onNewScan }: VocabularyResultsProps) {
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analysis results available</p>
        </div>
      </div>
    );
  }

  const { words, extractedText } = result;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-600" strokeWidth={2.5} />
          <span className="text-2xl font-bold text-indigo-600">LixiLens</span>
        </div>
        <button 
          onClick={onNewScan}
          className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
        >
          New Scan
        </button>
      </header>

      <main className="px-6 py-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              SOURCE MATERIAL
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Extracted Text</h2>

            <div className="prose prose-sm text-gray-700 leading-relaxed space-y-4">
              <p className="whitespace-pre-wrap break-words">
                {extractedText}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                LEARNING ANALYSIS
              </h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                {words.length} KEY TERMS
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Vocabulary Guide</h3>
          </div>

          <div className="space-y-6">
            {words.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-indigo-600 mb-3">
                  {item.word}
                </h4>

                <div className="space-y-4">
                  <div>
                    {item.category && (
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">
                        {item.category}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.definition}
                    </p>
                  </div>

                  {item.contextual && (
                    <div className="border-l-4 border-indigo-200 pl-4 bg-indigo-50/50 py-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                        CONTEXTUAL MEANING
                      </p>
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        {item.contextual}
                      </p>
                    </div>
                  )}

                  {item.category === 'CRITICAL' && (
                    <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      CRITICAL
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2">
          <BookMarked className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-gray-900">LixiLens</span>
        </div>
        <div className="max-w-md mx-auto flex items-center justify-center gap-6 mt-2">
          <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Terms</a>
          <a href="#" className="text-xs text-gray-500 hover:text-indigo-600 transition-colors">Support</a>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          © 2024 LixiLens Intellectual Sanctuary
        </p>
      </footer>
    </div>
  );
}
