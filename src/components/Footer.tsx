import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-6 py-8 bg-white border-t border-gray-100 mt-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-gray-900" />
          <span className="font-bold text-gray-900">LixiLens Intellectual Sanctuary</span>
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            Terms
          </a>
          <a href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
            Support
          </a>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 LIXILENS INTELLECTUAL SANCTUARY
        </p>
      </div>
    </footer>
  );
}
