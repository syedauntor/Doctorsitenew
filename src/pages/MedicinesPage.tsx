import { useState, useMemo } from 'react';
import {
  Search, Mic, ChevronDown, ChevronUp, Bookmark, BookmarkCheck,
  X, Printer, AlertTriangle, Info, FlaskConical, Package,
  ArrowUpDown, CheckSquare, Square,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  medicines, MEDICINE_CATEGORIES, CATEGORY_COUNTS,
  MANUFACTURERS, POPULAR_TAGS, type Medicine,
} from '../data/medicines';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price Low–High' },
  { value: 'price-desc', label: 'Price High–Low' },
];

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Tablet:    'bg-blue-100 text-blue-700',
  Capsule:   'bg-purple-100 text-purple-700',
  Syrup:     'bg-yellow-100 text-yellow-700',
  Injection: 'bg-red-100 text-red-700',
  Cream:     'bg-green-100 text-green-700',
  'Eye Drop':'bg-cyan-100 text-cyan-700',
  Inhaler:   'bg-orange-100 text-orange-700',
};

function sortMedicines(list: Medicine[], sort: string): Medicine[] {
  return [...list].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'price-asc') return a.pricePerUnit - b.pricePerUnit;
    if (sort === 'price-desc') return b.pricePerUnit - a.pricePerUnit;
    return 0;
  });
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function MedicineModal({ medicine, onClose }: { medicine: Medicine; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-gray-900">{medicine.name}</h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_BADGE_COLORS[medicine.category]}`}>
                {medicine.category}
              </span>
            </div>
            <p className="text-sm text-gray-500">{medicine.generic}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Meta row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Price/Unit</p>
              <p className="text-lg font-bold text-blue-600">৳{medicine.pricePerUnit}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Pack Size</p>
              <p className="text-sm font-semibold text-gray-800">{medicine.packSize}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Manufacturer</p>
              <p className="text-sm font-semibold text-gray-800">{medicine.countryFlag} {medicine.manufacturer}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Generic</p>
              <p className="text-sm font-semibold text-gray-800">{medicine.generic}</p>
            </div>
          </div>

          {/* Uses */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <Info className="w-4 h-4 text-blue-500" />
              Uses & Indications
            </h3>
            <ul className="space-y-1.5">
              {medicine.uses.map((u) => (
                <li key={u} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  {u}
                </li>
              ))}
            </ul>
          </section>

          {/* Dosage */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <FlaskConical className="w-4 h-4 text-green-500" />
              Dosage & Administration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Adult Dose</p>
                <p className="text-sm text-gray-700">{medicine.adultDose}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">Child Dose</p>
                <p className="text-sm text-gray-700">{medicine.childDose}</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-1">Maximum Dose</p>
                <p className="text-sm text-gray-700">{medicine.maxDose}</p>
              </div>
            </div>
          </section>

          {/* Side effects */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Side Effects
            </h3>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <ul className="space-y-1.5">
                {medicine.sideEffects.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-orange-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Contraindications */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
              <X className="w-4 h-4 text-red-500" />
              Contraindications
            </h3>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <ul className="space-y-1.5">
                {medicine.contraindications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Storage */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
              <Package className="w-4 h-4 text-gray-500" />
              Storage
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">{medicine.storage}</p>
          </section>

          {/* Available brands */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-3">Available Brands</h3>
            <div className="flex flex-wrap gap-2">
              {medicine.availableBrands.map((b) => (
                <span key={b} className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {b}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Medicine Card ─────────────────────────────────────────────────────────────

function MedicineCard({
  medicine,
  saved,
  onSave,
  compared,
  onCompare,
  compareDisabled,
  onViewDetails,
}: {
  medicine: Medicine;
  saved: boolean;
  onSave: () => void;
  compared: boolean;
  onCompare: () => void;
  compareDisabled: boolean;
  onViewDetails: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6 text-blue-500" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">{medicine.name}</h3>
                <p className="text-sm text-gray-400 mt-0.5">{medicine.generic}</p>
              </div>
              <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_BADGE_COLORS[medicine.category]}`}>
                {medicine.category}
              </span>
            </div>

            {/* Manufacturer + price row */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <span className="text-xs text-gray-500">
                {medicine.countryFlag} {medicine.manufacturer}
              </span>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">৳{medicine.pricePerUnit}</span>
                <span className="text-xs text-gray-400 ml-1">/ unit</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-1">{medicine.packSize}</p>
          </div>
        </div>

        {/* Expandable section */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
            {/* Uses */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Uses & Indications</p>
              <ul className="space-y-1">
                {medicine.uses.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dosage */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Dosage & Administration</p>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-green-50 rounded-lg p-2.5">
                  <span className="text-[10px] font-bold text-green-600 uppercase">Adult:</span>
                  <span className="text-xs text-gray-700 ml-1">{medicine.adultDose}</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2.5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Child:</span>
                  <span className="text-xs text-gray-700 ml-1">{medicine.childDose}</span>
                </div>
                <div className="bg-purple-50 rounded-lg p-2.5">
                  <span className="text-[10px] font-bold text-purple-600 uppercase">Max:</span>
                  <span className="text-xs text-gray-700 ml-1">{medicine.maxDose}</span>
                </div>
              </div>
            </div>

            {/* Side effects */}
            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Side Effects
              </p>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                <ul className="space-y-1">
                  {medicine.sideEffects.map((s) => (
                    <li key={s} className="text-xs text-orange-800 flex items-start gap-1.5">
                      <span className="mt-1 shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contraindications */}
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                Contraindications
              </p>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <ul className="space-y-1">
                  {medicine.contraindications.map((c) => (
                    <li key={c} className="text-xs text-red-800 flex items-start gap-1.5">
                      <span className="mt-1 shrink-0">•</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Storage</p>
              <p className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5">{medicine.storage}</p>
            </div>

            {/* Available brands */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Available Brands</p>
              <div className="flex flex-wrap gap-1.5">
                {medicine.availableBrands.map((b) => (
                  <span key={b} className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-medium rounded-full">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Show details</>
          )}
        </button>
      </div>

      {/* Card footer actions */}
      <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-gray-50 pt-3">
        <button
          onClick={onSave}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
            saved
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          {saved ? 'Saved' : 'Save to My List'}
        </button>

        <button
          onClick={onCompare}
          disabled={compareDisabled && !compared}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            compared
              ? 'bg-green-600 text-white border-green-600'
              : 'text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {compared ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          Compare
        </button>

        <button
          onClick={onViewDetails}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          View Full Details
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MedicinesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('name-asc');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [modalMedicine, setModalMedicine] = useState<Medicine | null>(null);

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

  function toggleSave(id: number) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleCompare(id: number) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-1.5">Medicine Information</h1>
          <p className="text-blue-200 text-sm mb-7">
            Search medicines, dosage, side effects and price in Bangladesh
          </p>

          {/* Search bar */}
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

      {/* ── Filter Row ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            {/* Category tabs */}
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

            {/* Sort */}
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

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex gap-7 items-start">

          {/* ── Left: Results ── */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 mb-5">
              Showing{' '}
              <span className="font-semibold text-gray-900">{filtered.length}</span>{' '}
              medicine{filtered.length !== 1 ? 's' : ''}
              {category !== 'All' && (
                <> in <span className="font-semibold text-blue-600">{category}</span></>
              )}
            </p>

            <div className="space-y-4">
              {filtered.length > 0 ? filtered.map((med) => (
                <MedicineCard
                  key={med.id}
                  medicine={med}
                  saved={savedIds.has(med.id)}
                  onSave={() => toggleSave(med.id)}
                  compared={compareIds.includes(med.id)}
                  onCompare={() => toggleCompare(med.id)}
                  compareDisabled={compareIds.length >= 3}
                  onViewDetails={() => setModalMedicine(med)}
                />
              )) : (
                <div className="text-center py-24">
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

          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-5 w-72 shrink-0">

            {/* Popular searches */}
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

            {/* Categories with count */}
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

            {/* Top manufacturers */}
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

            {/* Disclaimer */}
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

      {/* ── Compare Bar ── */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-gray-700">Compare ({compareIds.length}/3):</span>
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {compareIds.map((id) => {
                const med = medicines.find((m) => m.id === id);
                if (!med) return null;
                return (
                  <div key={id} className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {med.name}
                    <button onClick={() => toggleCompare(id)} className="hover:text-blue-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareIds([])}
                className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                disabled={compareIds.length < 2}
                className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {modalMedicine && (
        <MedicineModal medicine={modalMedicine} onClose={() => setModalMedicine(null)} />
      )}

      <Footer />
    </div>
  );
}
