import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Star, Users,
  ChevronLeft, ChevronRight,
  Heart, Brain, Eye, Baby, Bone, Stethoscope, Syringe, Activity,
  Lightbulb, X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import { doctors, SPECIALTIES, type Doctor } from '../data/doctors';

const AVAILABILITY_OPTIONS = ['All', 'Today', 'This Week'] as const;
const PAGE_SIZE = 12;

const specialtyIcons: Record<string, React.ElementType> = {
  'General Physician': Stethoscope,
  Cardiologist: Heart,
  Pediatrician: Baby,
  Dermatologist: Activity,
  Neurologist: Brain,
  Orthopedic: Bone,
  Gynecologist: Syringe,
  'Eye Specialist': Eye,
};

const specialtyCounts = SPECIALTIES.filter((s) => s !== 'All').map((s) => ({
  name: s,
  count: doctors.filter((d) => d.specialty === s).length,
  Icon: specialtyIcons[s] ?? Stethoscope,
}));

function toCardData(d: Doctor) {
  return {
    id: d.id,
    name: d.name,
    specialty: d.specialty,
    degrees: d.degrees,
    chamber: d.chamber,
    fee: d.fee,
    rating: d.rating,
    reviews: d.reviews,
    experience: d.experience,
    availableToday: d.availableToday,
    bookingEnabled: d.bookingEnabled,
    queueActive: d.queueActive,
    verified: !!d.verified,
    image: d.image,
    queue: d.queue,
    slug: d.profile?.slug,
  };
}

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState<string>('All');
  const [availability, setAvailability] = useState<string>('All');
  const [maxFee, setMaxFee] = useState(2000);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()) ||
        d.degrees.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialty === 'All' || d.specialty === specialty;
      const matchesAvailability =
        availability === 'All' || (availability === 'Today' && d.availableToday) || availability === 'This Week';
      const matchesFee = d.fee <= maxFee;
      return matchesSearch && matchesSpecialty && matchesAvailability && matchesFee;
    });
  }, [search, specialty, availability, maxFee]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSpecialtyChange(s: string) {
    setSpecialty(s);
    setPage(1);
  }

  function resetFilters() {
    setSearch('');
    setSpecialty('All');
    setAvailability('All');
    setMaxFee(2000);
    setPage(1);
  }

  const hasActiveFilters = search || specialty !== 'All' || availability !== 'All' || maxFee < 2000;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Page header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-1">Find a Doctor</h1>
          <p className="text-blue-200 text-sm">
            {doctors.length} verified doctors available across Bangladesh
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, specialty, or degree..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {/* Desktop filters */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <select
                value={specialty}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={availability}
                onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                className="pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a === 'All' ? 'Any Time' : a}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Max fee:</span>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={100}
                  value={maxFee}
                  onChange={(e) => { setMaxFee(Number(e.target.value)); setPage(1); }}
                  className="w-28 accent-blue-600"
                />
                <span className="text-xs font-semibold text-blue-600 w-16 text-right whitespace-nowrap">
                  ৳ {maxFee.toLocaleString()}
                </span>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
            </button>
          </div>

          {/* Mobile filters expanded */}
          {filtersOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3">
              <select
                value={specialty}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={availability}
                onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a === 'All' ? 'Any Time' : a}</option>
                ))}
              </select>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Max Fee</span>
                  <span className="font-semibold text-blue-600">৳ {maxFee.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={100}
                  value={maxFee}
                  onChange={(e) => { setMaxFee(Number(e.target.value)); setPage(1); }}
                  className="w-full accent-blue-600"
                />
              </div>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-sm text-red-500 font-medium text-left">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex gap-8 items-start">
          {/* Doctor grid — 75% */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' matching filters'}
              </p>
            </div>

            {paginated.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginated.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={toCardData(doctor)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                          p === currentPage
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24">
                <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No doctors found</h3>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar — 25% */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-5">
            {/* Top Specialties */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Top Specialties</h3>
              <ul className="space-y-1">
                {specialtyCounts.map(({ name, count, Icon }) => (
                  <li key={name}>
                    <button
                      onClick={() => handleSpecialtyChange(name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        specialty === name
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${specialty === name ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-4 h-4 ${specialty === name ? 'text-blue-600' : 'text-gray-500'}`} />
                      </div>
                      <span className="flex-1 text-left">{name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${specialty === name ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">Search Tips</h3>
              </div>
              <ul className="space-y-2 text-xs text-blue-800 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  Search by doctor name, specialty, or degree to find the right match.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  Filter by "Available Today" to see doctors you can visit immediately.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  Use the fee slider to set your budget before filtering.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  Look for the green "Live Queue" badge — those doctors are seeing patients right now.
                </li>
              </ul>
            </div>

            {/* CTA banner */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white">
              <h3 className="text-sm font-bold mb-1">Are you a Doctor?</h3>
              <p className="text-xs text-green-100 mb-4 leading-relaxed">
                Join thousands of verified doctors on EmergentHealth and reach more patients.
              </p>
              <button className="w-full py-2.5 bg-white text-green-700 text-xs font-bold rounded-xl hover:bg-green-50 transition-colors">
                Register as Doctor
              </button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
