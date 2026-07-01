import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Pill, ChevronRight } from 'lucide-react';
import { medicines } from '../data/medicines';

const FEATURED_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

const categoryColors: Record<string, string> = {
  Tablet:    'bg-blue-50 text-blue-700',
  Capsule:   'bg-amber-50 text-amber-700',
  Syrup:     'bg-yellow-50 text-yellow-700',
  Injection: 'bg-red-50 text-red-700',
  Cream:     'bg-green-50 text-green-700',
  'Eye Drop':'bg-cyan-50 text-cyan-700',
  Inhaler:   'bg-orange-50 text-orange-700',
};

const pillColorMap: Record<string, string> = {
  Tablet:    'bg-blue-100 text-blue-600',
  Capsule:   'bg-amber-100 text-amber-600',
  Syrup:     'bg-yellow-100 text-yellow-600',
  Injection: 'bg-red-100 text-red-600',
  Cream:     'bg-green-100 text-green-600',
  'Eye Drop':'bg-cyan-100 text-cyan-600',
  Inhaler:   'bg-orange-100 text-orange-600',
};

export default function FeaturedMedicines() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const featured = medicines.filter((m) => FEATURED_IDS.includes(m.id));

  const filtered = featured.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.generic.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section id="medicines" className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-green-600 text-sm font-semibold uppercase tracking-wider mb-2">Medicine Database</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Medicines</h2>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            Search from thousands of branded and generic medicines available in Bangladesh.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicine by brand or generic name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((med) => (
              <div
                key={med.id}
                onClick={() => navigate(`/medicines/${med.slug}`)}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pillColorMap[med.category] ?? 'bg-gray-100 text-gray-500'}`}>
                    <Pill className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${categoryColors[med.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {med.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-snug">{med.name}</h3>
                <p className="text-xs text-blue-600 mt-0.5 font-medium">{med.generic}</p>
                <p className="text-xs text-gray-400 mt-1">{med.manufacturer}</p>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1">
                  <span className="text-base font-bold text-gray-900">৳{med.pricePerUnit}</span>
                  <span className="text-xs text-gray-400">/ unit</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No medicines found for "{query}"</p>
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/medicines')}
            className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            Browse Full Medicine List
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
