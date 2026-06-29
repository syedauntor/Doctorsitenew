import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, MapPin, Star, Clock, Users,
  Calendar, CheckCircle, ChevronLeft, ChevronRight,
  Heart, Brain, Eye, Baby, Bone, Stethoscope, Syringe, Activity,
  Lightbulb, X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">

      {/* Photo */}
      <div className="relative h-[180px] overflow-hidden shrink-0 bg-gray-100">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

        {/* Verified badge — top left */}
        {doctor.verified ? (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
            <CheckCircle className="w-2.5 h-2.5" />
            Verified
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm text-gray-500 text-[10px] font-semibold px-2 py-1 rounded-full shadow">
            Unverified
          </div>
        )}

        {/* Heart / bookmark — top right */}
        <button
          onClick={() => setSaved((v) => !v)}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>

        {/* Availability — bottom left of photo gradient */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6">
          <Link
            to={`/doctors/${doctor.profile?.slug ?? doctor.id}`}
            className="block text-[15px] font-bold text-white leading-snug hover:text-blue-200 transition-colors drop-shadow"
          >
            {doctor.name}
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-blue-200 drop-shadow">{doctor.specialty}</p>
            {doctor.availableToday ? (
              <span className="flex items-center gap-1 bg-green-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="relative flex w-1.5 h-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-green-200" />
                </span>
                Today
              </span>
            ) : (
              <span className="bg-white/70 backdrop-blur-sm text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-2.5">

        <div className="space-y-1">
          <p className="text-[11px] text-gray-400 truncate leading-snug">{doctor.degrees}</p>
          <div className="flex items-start gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
            <span className="truncate">{doctor.chamber}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
              <span>{doctor.experience} yrs</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-700">{doctor.rating}</span>
              <span className="text-gray-400">({doctor.reviews})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">Fee</p>
            <p className="text-base font-extrabold text-gray-900 leading-none">৳ {doctor.fee.toLocaleString()}</p>
          </div>
          <div className="text-right">
            {doctor.availableToday && doctor.queue > 0 ? (
              <>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">Queue</p>
                <div className="flex items-center justify-end gap-1">
                  <Users className="w-3 h-3 text-orange-500" />
                  <span className="text-xs font-bold text-orange-500">{doctor.queue} waiting</span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                No queue
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1.5 mt-auto">
          <Link
            to={`/doctors/${doctor.profile?.slug ?? doctor.id}`}
            className="flex-1 py-2.5 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-1 shadow-sm shadow-blue-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book
          </Link>
          <button
            disabled={!doctor.availableToday}
            className="flex-1 py-2.5 min-h-[40px] border-2 border-green-500 text-green-600 text-xs font-bold rounded-lg hover:bg-green-50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <Users className="w-3.5 h-3.5" />
            Queue
          </button>
        </div>
      </div>
    </div>
  );
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {paginated.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
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
