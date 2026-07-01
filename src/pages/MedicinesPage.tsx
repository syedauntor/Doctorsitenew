import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Mic, Bookmark, BookmarkCheck,
  AlertTriangle, FlaskConical,
  ArrowUpDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  medicines, MEDICINE_CATEGORIES, CATEGORY_COUNTS,
  MANUFACTURERS, POPULAR_TAGS, type Medicine,
} from '../data/medicines';
import MedicinePriceDisplay from '../components/MedicinePriceDisplay';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price Low–High' },
  { value: 'price-desc', label: 'Price High–Low' },
];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Tablet:    'bg-blue-100 text-blue-700',
  Capsule:   'bg-amber-100 text-amber-700',
  Syrup:     'bg-yellow-100 text-yellow-700',
  Injection: 'bg-red-100 text-red-700',
  Cream:     'bg-green-100 text-green-700',
  'Eye Drop':'bg-cyan-100 text-cyan-700',
  Inhaler:   'bg-orange-100 text-orange-700',
};

const PILL_ICON_COLORS: Record<string, string> = {
  Tablet:    'bg-blue-50 text-blue-500',
  Capsule:   'bg-amber-50 text-amber-500',
  Syrup:     'bg-yellow-50 text-yellow-600',
  Injection: 'bg-red-50 text-red-500',
  Cream:     'bg-green-50 text-green-600',
  'Eye Drop':'bg-cyan-50 text-cyan-600',
  Inhaler:   'bg-orange-50 text-orange-500',
};

function sortMedicines(list: Medicine[], sort: string): Medicine[] {
  return [...list].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'price-asc') return a.pricePerUnit - b.pricePerUnit;
    if (sort === 'price-desc') return b.pricePerUnit - a.pricePerUnit;
    return 0;
  });
}

function MedicineCard({
  medicine,
  saved,
  onSave,
}: {
  medicine: Medicine;
  saved: boolean;
  onSave: (e: React.MouseEvent) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/medicines/${medicine.slug}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative"
    >
      {/* Save button (top-right, stops propagation) */}
      <button
        onClick={onSave}
        className={`absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${
          saved
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600'
        }`}
        title={saved ? 'Remove from list' : 'Save to my list'}
      >
        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
      </button>

      <div className="p-5 pr-14">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${PILL_ICON_COLORS[medicine.category] ?? 'bg-gray-50 text-gray-500'}`}>
            <FlaskConical className="w-6 h-6" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 leading-snug">{medicine.name}</h3>
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_BADGE_COLORS[medicine.category]}`}>
                {medicine.category}
              </span>
            </div>

            <p className="text-sm text-blue-600 font-medium mt-0.5">{medicine.generic}</p>
            <p className="text-xs text-gray-400 mt-1">{medicine.countryFlag} {medicine.manufacturer}</p>
            <p className="text-xs text-gray-400 mt-0.5">{medicine.packSize}</p>

            <div className="mt-3">
              <MedicinePriceDisplay medicine={medicine} unitSize="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('name-asc');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = medicines.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q);
      const matchCat = category === 'All' || m.category === category;
      return matchSearch && matchCat;
    });
    return sortMedicines(list, sort);
  }, [search, category, sort]);

  function toggleSave(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-1.5">Medicine Information</h1>
          <p className="text-blue-200 text-sm mb-7">
            Search medicines, dosage, side effects and price in Bangladesh
          </p>

          <div className="flex gap-2 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by medicine name or generic name..."
                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {MEDICINE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-2 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex gap-7 items-start">

          {/* Results */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-5">
              Showing{' '}
              <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
              medicine{filtered.length !== 1 ? 's' : ''}
              {category !== 'All' && (
                <> in <span className="font-semibold text-blue-600">{category}</span></>
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length > 0 ? filtered.map((med) => (
                <MedicineCard
                  key={med.id}
                  medicine={med}
                  saved={savedIds.has(med.id)}
                  onSave={(e) => toggleSave(e, med.id)}
                />
              )) : (
                <div className="col-span-2 text-center py-24">
                  <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No medicines found</h3>
                  <p className="text-gray-400 text-sm mb-4">Try a different search term or category</p>
                  <button
                    onClick={() => { setSearch(''); setCategory('All'); }}
                    className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-5 w-72 shrink-0">

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 text-xs rounded-lg transition-colors font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
              <ul className="space-y-1">
                {Object.entries(CATEGORY_COUNTS).map(([name, count]) => (
                  <li key={name} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
                    <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{name}</span>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Top Manufacturers</h3>
              <div className="space-y-2">
                {MANUFACTURERS.map((m) => (
                  <div key={m} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-gray-50 cursor-pointer group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600">{m[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                <h3 className="text-xs font-bold text-yellow-800">Medical Disclaimer</h3>
              </div>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Always consult a qualified doctor or pharmacist before taking any medicine. Self-medication can be dangerous.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
