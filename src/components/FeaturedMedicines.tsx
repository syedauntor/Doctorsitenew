import { useState } from 'react';
import { Search, Pill, Info, ShoppingCart, ChevronRight } from 'lucide-react';

const allMedicines = [
  { id: 1, name: 'Napa Extra', generic: 'Paracetamol + Caffeine', company: 'Beximco Pharma', type: 'Tablet', price: '৳ 12', category: 'Analgesic' },
  { id: 2, name: 'Seclo 20', generic: 'Omeprazole', company: 'Square Pharma', type: 'Capsule', price: '৳ 8', category: 'Antacid' },
  { id: 3, name: 'Amodis 400', generic: 'Metronidazole', company: 'ACI Limited', type: 'Tablet', price: '৳ 6', category: 'Antibiotic' },
  { id: 4, name: 'Maxpro 40', generic: 'Esomeprazole', company: 'Incepta', type: 'Capsule', price: '৳ 15', category: 'Antacid' },
  { id: 5, name: 'Cef-3', generic: 'Cefixime', company: 'Renata', type: 'Tablet', price: '৳ 22', category: 'Antibiotic' },
  { id: 6, name: 'Atova 10', generic: 'Atorvastatin', company: 'Beximco Pharma', type: 'Tablet', price: '৳ 10', category: 'Cardiac' },
  { id: 7, name: 'Fexo 120', generic: 'Fexofenadine', company: 'Square Pharma', type: 'Tablet', price: '৳ 18', category: 'Antihistamine' },
  { id: 8, name: 'Losectil 20', generic: 'Omeprazole', company: 'Drug Intl.', type: 'Capsule', price: '৳ 7', category: 'Antacid' },
];

const categoryColors: Record<string, string> = {
  Analgesic: 'bg-blue-50 text-blue-600',
  Antacid: 'bg-green-50 text-green-700',
  Antibiotic: 'bg-orange-50 text-orange-600',
  Cardiac: 'bg-red-50 text-red-600',
  Antihistamine: 'bg-purple-50 text-purple-600',
};

export default function FeaturedMedicines() {
  const [query, setQuery] = useState('');

  const filtered = allMedicines.filter(
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Pill className="w-5 h-5 text-green-600" />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[med.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {med.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900">{med.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-1">{med.generic}</p>
                <p className="text-xs text-gray-400">{med.company} &middot; {med.type}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">{med.price}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Details">
                      <Info className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      Buy
                    </button>
                  </div>
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
          <a
            href="#"
            className="inline-flex items-center gap-2 text-green-600 text-sm font-semibold hover:text-green-700 transition-colors"
          >
            Browse Full Medicine List
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
