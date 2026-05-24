import { Flame } from 'lucide-react';

export default function DailyScholar() {
  return (
    <section className="px-6 py-4">
      <div className="max-w-md mx-auto bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-gray-800" />
              <span className="text-xs font-bold text-gray-800 tracking-wider">
                DAILY SCHOLAR
              </span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-1">12 Days</h3>
            <p className="text-sm text-gray-800">Keep the reading momentum going!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
