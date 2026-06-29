import { useState } from 'react';
import { Search, ArrowRight, Pill } from 'lucide-react';

const specialties = ['Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedist', 'Pediatrician', 'Psychiatrist'];

export default function Hero() {
  const [query, setQuery] = useState('');

  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/40 backdrop-blur-sm border border-blue-400/30 text-blue-100 text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Bangladesh's #1 Medical Platform
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Find Doctors,{' '}
            <span className="text-green-400">Book Appointments</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
            Connect with the best specialist doctors across Bangladesh. Get expert care, anytime, anywhere.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2 mb-6">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctors by name or specialty..."
                className="flex-1 py-2.5 text-gray-800 placeholder-gray-400 text-sm bg-transparent outline-none"
              />
            </div>
            <button className="shrink-0 px-5 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center gap-2">
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Popular specialties */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-blue-200 text-xs font-medium self-center mr-1">Popular:</span>
            {specialties.map((s) => (
              <button
                key={s}
                className="px-3.5 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium rounded-full hover:bg-white/25 transition-colors duration-150"
              >
                {s}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#doctors"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
            >
              <Search className="w-4 h-4" />
              Find Doctor
            </a>
            <a
              href="#medicines"
              className="w-full sm:w-auto px-7 py-3.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
            >
              <Pill className="w-4 h-4" />
              Search Medicine
            </a>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
