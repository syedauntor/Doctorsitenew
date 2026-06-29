import { useState } from 'react';
import { Star, Clock, MapPin, Calendar, Users, CheckCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const doctors = [
  {
    id: 1,
    name: 'Dr. Fahmida Rahman',
    specialty: 'Cardiologist',
    degrees: 'MBBS, MD (Cardiology), FRCP',
    hospital: 'Apollo Hospital, Dhaka',
    fee: 1200,
    rating: 4.9,
    reviews: 312,
    experience: 15,
    available: true,
    verified: true,
    queue: 4,
    slug: 'dr-fahmida-rahman',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'Dr. Mahbubur Hossain',
    specialty: 'Neurologist',
    degrees: 'MBBS, MD (Neurology), FCPS',
    hospital: 'Square Hospital, Dhaka',
    fee: 1500,
    rating: 4.8,
    reviews: 245,
    experience: 18,
    available: true,
    verified: true,
    queue: 7,
    slug: 'dr-mahbubur-hossain',
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    name: 'Dr. Nasrin Sultana',
    specialty: 'Pediatrician',
    degrees: 'MBBS, DCH, MD (Pediatrics)',
    hospital: 'Dhaka Medical College',
    fee: 800,
    rating: 4.9,
    reviews: 503,
    experience: 12,
    available: false,
    verified: true,
    queue: 0,
    slug: '',
    image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 4,
    name: 'Dr. Rezaul Karim',
    specialty: 'Orthopedist',
    degrees: 'MBBS, MS (Orthopedics)',
    hospital: 'BIRDEM Hospital, Dhaka',
    fee: 1000,
    rating: 4.7,
    reviews: 188,
    experience: 20,
    available: true,
    verified: false,
    queue: 3,
    slug: '',
    image: 'https://images.pexels.com/photos/4253089/pexels-photo-4253089.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 5,
    name: 'Dr. Tasneem Akter',
    specialty: 'Dermatologist',
    degrees: 'MBBS, DDV',
    hospital: 'United Hospital, Dhaka',
    fee: 900,
    rating: 4.8,
    reviews: 274,
    experience: 10,
    available: true,
    verified: true,
    queue: 2,
    slug: '',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 6,
    name: 'Dr. Imtiaz Ahmed',
    specialty: 'Psychiatrist',
    degrees: 'MBBS, MD (Psychiatry)',
    hospital: 'National Institute, Dhaka',
    fee: 1100,
    rating: 4.6,
    reviews: 142,
    experience: 14,
    available: true,
    verified: false,
    queue: 5,
    slug: '',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 7,
    name: 'Dr. Shahida Parvin',
    specialty: 'Gynecologist',
    degrees: 'MBBS, FCPS (Gynecology)',
    hospital: 'Popular Hospital, Dhaka',
    fee: 1300,
    rating: 4.9,
    reviews: 391,
    experience: 16,
    available: true,
    verified: true,
    queue: 6,
    slug: '',
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 8,
    name: 'Dr. Faisal Haque',
    specialty: 'Eye Specialist',
    degrees: 'MBBS, DO (Ophthalmology)',
    hospital: 'Eye Care Hospital, Dhaka',
    fee: 700,
    rating: 4.7,
    reviews: 163,
    experience: 11,
    available: false,
    verified: true,
    queue: 0,
    slug: '',
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

function DoctorCard({ doctor }: { doctor: typeof doctors[0] }) {
  const [saved, setSaved] = useState(false);
  const href = `/doctors/${doctor.slug || doctor.id}`;

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

        {/* Name + specialty + availability over gradient */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-6">
          <Link
            to={href}
            className="block text-[15px] font-bold text-white leading-snug hover:text-blue-200 transition-colors drop-shadow"
          >
            {doctor.name}
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-blue-200 drop-shadow">{doctor.specialty}</p>
            {doctor.available ? (
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
            <span className="truncate">{doctor.hospital}</span>
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
            {doctor.available && doctor.queue > 0 ? (
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
            to={href}
            className="flex-1 py-2.5 min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-1 shadow-sm shadow-blue-200"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book
          </Link>
          <button
            disabled={!doctor.available}
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

export default function FeaturedDoctors() {
  return (
    <section id="doctors" className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Specialists</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Doctors</h2>
            <p className="text-gray-500 mt-2 text-base">Experienced doctors ready to help you</p>
          </div>
          <Link
            to="/doctors"
            className="shrink-0 px-5 py-2.5 border border-blue-600 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-150"
          >
            View All Doctors
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}
