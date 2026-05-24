import { Brain, Microscope, BookMarked, Scale, ChevronRight } from 'lucide-react';

const lexicons = [
  {
    id: 1,
    name: 'Philosophy',
    terms: 450,
    icon: Brain,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    name: 'Abstract Sciences',
    terms: 320,
    icon: Microscope,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 3,
    name: 'Classic Literature',
    terms: 890,
    icon: BookMarked,
    bgColor: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    id: 4,
    name: 'Legal Latin',
    terms: 215,
    icon: Scale,
    bgColor: 'bg-gray-100',
    iconColor: 'text-gray-700',
  },
];

export default function CuratedLexicons() {
  return (
    <section className="px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Curated Lexicons</h2>
          <button className="flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
            Explore all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {lexicons.map((lexicon) => {
            const Icon = lexicon.icon;
            return (
              <div
                key={lexicon.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:scale-105"
              >
                <div className={`w-12 h-12 ${lexicon.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${lexicon.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                  {lexicon.name}
                </h3>
                <p className="text-sm text-gray-500">{lexicon.terms} Terms</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
