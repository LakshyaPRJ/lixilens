import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onNewScan?: () => void;
}

export default function Header({ onNewScan }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white">
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
  );
}
