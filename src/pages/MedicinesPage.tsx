import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ChevronDown, ChevronUp, Bookmark, BookmarkCheck,
  Printer, AlertTriangle, Package, Pill, Stethoscope,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { medicines, type Medicine } from '../data/medicines';

// ── Types ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All', 'Tablet', 'Capsule', 'Syrup', 'Injection',
  'Cream', 'Eye Drop', 'Inhaler', 'Vitamin', 'Antibiotic',
];

const MANUFACTURERS_FILTER = [
  { label: 'Square Pharmaceuticals', count: 3 },
  { label: 'Beximco Pharma', count: 4 },
  { label: 'Incepta Pharma', count: 2 },
  { label: 'Renata Limited', count: 3 },
  { label: 'ACI Limited', count: 2 },
];

const PRICE_RANGES = [
  { label: 'Under ৳50', min: 0, max: 50 },
  { label: '৳50 – ৳200', min: 50, max: 200 },
  { label: '৳200 – ৳500', min: 200, max: 500 },
  { label: 'Above ৳500', min: 500, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price Low to High' },
  { value: 'popular', label: 'Most Searched' },
];

const POPULAR_TAGS = ['Napa', 'Seclo', 'Amlodipine', 'Metformin', 'Omeprazole'];

const CATEGORY_COLORS: Record<string, string> = {
  Tablet:    'bg-blue-100 text-blue-700',
  Capsule:   'bg-violet-100 text-violet-700',
  Syrup:     'bg-yellow-100 text-yellow-700',
  Injection: 'bg-red-100 text-red-700',
  Cream:     'bg-green-100 text-green-700',
  'Eye Drop':'bg-cyan-100 text-cyan-700',
  Inhaler:   'bg-orange-100 text-orange-700',
};

function matchesPriceRange(price: number, rangeLabel: string): boolean {
  const r = PRICE_RANGES.find((p) => p.label === rangeLabel);
  if (!r) return true;
  return price >= r.min && price < r.max;
}

// ── Dosage Table ──────────────────────────────────────────────────────────────

function DosageTable({ medicine }: { medicine: Medicine }) {
  const rows = [
    { type: 'Adult', dose: medicine.adultDose, note: '' },
    { type: 'Child', dose: medicine.childDose, note: '' },
    { type: 'Elderly', dose: medicine.adultDose, note: 'Use lower end; consult physician' },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Patient Type</th>
            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Dose</th>
            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Max Dose</th>
            <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className="px-4 py-3 font-semibold text-gray-800 text-xs">{row.type}</td>
              <td className="px-4 py-3 text-gray-600 text-xs">{row.dose}</td>
              <td className="px-4 py-3 text-gray-600 text-xs hidden sm:table-cell">{medicine.maxDose}</td>
              <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{row.note || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Medicine Card (accordion) ─────────────────────────────────────────────────

function MedicineCard({ medicine, saved, onSave }: {
  medicine: Medicine;
  saved: boolean;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${open ? 'border-blue-200 shadow-md' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}>
      {/* ── Collapsed row (always visible) ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4"
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-blue-100' : 'bg-blue-50'}`}>
            <Pill className={`w-5 h-5 ${open ? 'text-blue-600' : 'text-blue-400'}`} />
          </div>

          {/* Left: name + generic + badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 leading-snug">{medicine.name}</h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${CATEGORY_COLORS[medicine.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {medicine.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{medicine.generic}</p>
          </div>

          {/* Middle: manufacturer + pack */}
          <div className="hidden md:block text-right shrink-0 min-w-0 max-w-[180px]">
            <p className="text-xs font-medium text-gray-700 truncate">{medicine.countryFlag} {medicine.manufacturer}</p>
            <p className="text-xs text-gray-400 mt-0.5">{medicine.packSize}</p>
          </div>

          {/* Right: price + available */}
          <div className="text-right shrink-0 ml-2">
            <p className="text-xl font-bold text-blue-600 leading-none">৳{medicine.pricePerUnit}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">per unit</p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Available
            </span>
          </div>

          {/* Expand arrow */}
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ml-1 ${open ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {open && (
        <div className="px-5 pb-5 border-t border-blue-100 pt-5 space-y-5">
          {/* Row 1: Quick info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Pill className="w-3 h-3" /> Uses
              </p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                {medicine.uses.slice(0, 2).join('. ')}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Side Effects
              </p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                {medicine.sideEffects.slice(0, 2).join('. ')}
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-1.5">Contraindications</p>
              <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">
                {medicine.contraindications.slice(0, 2).join('. ')}
              </p>
            </div>
          </div>

          {/* Row 2: Dosage table */}
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2.5">Dosage & Administration</p>
            <DosageTable medicine={medicine} />
          </div>

          {/* Row 3: Storage */}
          <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5">
            <Package className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Storage</p>
              <p className="text-xs text-gray-600">{medicine.storage}</p>
            </div>
          </div>

          {/* Row 4: Available brands */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Available Brands</p>
            <div className="flex flex-wrap gap-2">
              {medicine.availableBrands.map((b) => (
                <span key={b} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:border-blue-300 hover:text-blue-700 cursor-pointer transition-colors">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Row 5: Actions */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); onSave(); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                saved
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {saved ? 'Saved' : 'Save to My List'}
            </button>

            <Link
              to="/doctors"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Consult a Doctor
            </Link>

            <button
              onClick={(e) => { e.stopPropagation(); window.print(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-gray-300 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function MedicinesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleManufacturer(m: string) {
    setManufacturers((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
    setPage(1);
  }

  function toggleSave(id: number) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = medicines.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.generic.toLowerCase().includes(q);
      const matchCat = category === 'All' || m.category === category;
      const matchMfr =
        manufacturers.length === 0 ||
        manufacturers.some((mfr) => m.manufacturer.toLowerCase().includes(mfr.toLowerCase().split(' ')[0]));
      const matchPrice = !priceRange || matchesPriceRange(m.pricePerUnit, priceRange);
      return matchSearch && matchCat && matchMfr && matchPrice;
    });

    if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.pricePerUnit - b.pricePerUnit);

    return list;
  }, [search, category, manufacturers, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filtered.length;

  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Manufacturer filter */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter by Manufacturer</h3>
        <div className="space-y-2">
          {MANUFACTURERS_FILTER.map(({ label, count }) => (
            <label key={label} className="flex items-center justify-between cursor-pointer group py-1">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={manufacturers.includes(label)}
                  onChange={() => toggleManufacturer(label)}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${manufacturers.includes(label) ? 'text-blue-700 font-semibold' : 'text-gray-700 group-hover:text-blue-600'}`}>
                  {label}
                </span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map(({ label }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input
                type="radio"
                name="price"
                checked={priceRange === label}
                onChange={() => { setPriceRange(label); setPage(1); }}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className={`text-sm transition-colors ${priceRange === label ? 'text-blue-700 font-semibold' : 'text-gray-700 group-hover:text-blue-600'}`}>
                {label}
              </span>
            </label>
          ))}
          {priceRange && (
            <button
              onClick={() => setPriceRange('')}
              className="text-xs text-red-500 hover:text-red-600 mt-1 font-medium"
            >
              Clear price filter
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Sort by</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((o) => (
            <label key={o.value} className="flex items-center gap-2.5 cursor-pointer group py-1">
              <input
                type="radio"
                name="sort"
                checked={sort === o.value}
                onChange={() => setSort(o.value)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <span className={`text-sm transition-colors ${sort === o.value ? 'text-blue-700 font-semibold' : 'text-gray-700 group-hover:text-blue-600'}`}>
                {o.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
          <h3 className="text-xs font-bold text-yellow-800">Medical Disclaimer</h3>
        </div>
        <p className="text-xs text-yellow-800 leading-relaxed mb-1.5">
          Always consult a registered doctor before taking any medication.
        </p>
        <p className="text-xs text-yellow-700 font-medium">
          এই তথ্য শুধুমাত্র সাধারণ জ্ঞানের জন্য
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Medicine Database Bangladesh</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Medicine Information Bangladesh</h1>
            <p className="text-blue-200 text-sm mb-8">
              Search medicines, check uses, dosage, side effects and price
            </p>

            {/* Search bar */}
            <div className="relative mb-4 shadow-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search medicine name or generic name..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
            </div>

            {/* Popular tags */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-blue-300 text-xs font-medium">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSearch(tag); setPage(1); }}
                  className="px-3 py-1 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-full border border-white/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">

        {/* Mobile filter toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm w-full justify-center"
        >
          {sidebarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {sidebarOpen ? 'Hide Filters' : 'Show Filters & Sort'}
          {(manufacturers.length > 0 || priceRange) && (
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden mb-6">
            <SidebarContent />
          </div>
        )}

        <div className="flex gap-7 items-start">
          {/* ── Results ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
                medicine{filtered.length !== 1 ? 's' : ''}
              </p>
              {(search || category !== 'All' || manufacturers.length > 0 || priceRange) && (
                <button
                  onClick={() => { setSearch(''); setCategory('All'); setManufacturers([]); setPriceRange(''); setPage(1); }}
                  className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {paginated.length > 0 ? (
              <>
                <div className="space-y-3">
                  {paginated.map((med) => (
                    <MedicineCard
                      key={med.id}
                      medicine={med}
                      saved={savedIds.has(med.id)}
                      onSave={() => toggleSave(med.id)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-8 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                    >
                      Load More Medicines
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No medicines found</h3>
                <p className="text-gray-400 text-sm mb-4">Try a different name or clear the filters</p>
                <button
                  onClick={() => { setSearch(''); setCategory('All'); setManufacturers([]); setPriceRange(''); }}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-72 shrink-0">
            <SidebarContent />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
