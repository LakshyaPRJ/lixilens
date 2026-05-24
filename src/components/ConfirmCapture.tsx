import { BookOpen, Sparkles, X } from 'lucide-react';

interface ConfirmCaptureProps {
  image: string | null;
  onCancel: () => void;
  onAnalyze: () => void;
}

export default function ConfirmCapture({ image, onCancel, onAnalyze }: ConfirmCaptureProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white">
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

      <main className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-3">
            Confirm Capture
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ensure the text is clear and well-lit for the best analysis.
          </p>

          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Captured page"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-8 w-20 h-20 border-t-4 border-l-4 border-gray-300 rounded-tl-2xl"></div>
                  <div className="absolute top-8 right-8 w-20 h-20 border-t-4 border-r-4 border-gray-300 rounded-tr-2xl"></div>
                  <div className="absolute bottom-8 left-8 w-20 h-20 border-b-4 border-l-4 border-gray-300 rounded-bl-2xl"></div>
                  <div className="absolute bottom-8 right-8 w-20 h-20 border-b-4 border-r-4 border-gray-300 rounded-br-2xl"></div>
                </div>
              </>
            ) : (
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No image selected</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onAnalyze}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white bg-indigo-600 rounded-full font-semibold hover:bg-indigo-700 transition-all hover:scale-105 mb-4"
          >
            <Sparkles className="w-5 h-5" />
            Analyze Page
          </button>

          <button
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>

          <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-400 rounded-xl p-5">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">SCHOLAR TIP</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  LixiLens performs best with high-contrast text. Avoid shadows falling across the page for more accurate word extraction.
                </p>
              </div>
            </div>
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
