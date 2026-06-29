import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ChevronRight,
  Pill, Syringe, FlaskConical, Droplets,
  Tablets, Apple, Shield,
} from 'lucide-react';

const QUICK_CATEGORIES = [
  { label: 'Tablet', icon: Pill, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Capsule', icon: Tablets, color: 'bg-violet-50 text-violet-600 border-violet-100' },
  { label: 'Syrup', icon: FlaskConical, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  { label: 'Injection', icon: Syringe, color: 'bg-red-50 text-red-600 border-red-100' },
  { label: 'Vitamin', icon: Apple, color: 'bg-green-50 text-green-600 border-green-100' },
  { label: 'Antibiotic', icon: Shield, color: 'bg-orange-50 text-orange-600 border-orange-100' },
];

const POPULAR_TAGS = ['Napa', 'Seclo', 'Amlodipine', 'Metformin', 'Omeprazole', 'Ciprofloxacin'];

export default function FeaturedMedicines() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSearch(q: string) {
    if (q.trim()) {
      navigate(`/medicines?q=${encodeURIComponent(q.trim())}`);
    } else {
      navigate('/medicines');
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch(query);
  }

  return (
    <section id="medicines" className="bg-white py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Medicine Database</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Medicine Information</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Search from thousands of medicines — check uses, dosage, side effects and price in Bangladesh.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2 shadow-lg rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search medicine name or generic name..."
                className="w-full pl-11 pr-4 py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              onClick={() => handleSearch(query)}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>

          {/* Popular tags */}
          <div className="flex items-center gap-2 flex-wrap mt-3 justify-center">
            <span className="text-xs text-gray-400 font-medium">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSearch(tag)}
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 text-xs font-medium rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category quick-access grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-3xl mx-auto mb-10">
          {QUICK_CATEGORIES.map(({ label, icon: Icon, color }) => (
            <Link
              key={label}
              to={`/medicines?cat=${encodeURIComponent(label)}`}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold">{label}</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/medicines"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-2xl transition-colors shadow-md hover:shadow-lg"
          >
            Search All Medicines
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
