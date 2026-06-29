import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Calendar, CheckCircle, Heart } from 'lucide-react';

export interface DoctorCardData {
  id: number;
  name: string;
  specialty: string;
  degrees: string;
  chamber: string;
  fee: number;
  rating: number;
  reviews: number;
  experience: number;
  availableToday: boolean;
  verified: boolean;
  image: string;
  queue: number;
  slug?: string;
}

export default function DoctorCard({ doctor }: { doctor: DoctorCardData }) {
  const [saved, setSaved] = useState(false);
  const href = `/doctors/${doctor.slug ?? doctor.id}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">

      {/* ── Photo ── */}
      <div className="relative h-[220px] overflow-hidden shrink-0 bg-gray-100">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Verified — top left */}
        {doctor.verified ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-md">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-gray-500 text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow">
            Unverified
          </div>
        )}

        {/* Heart — top right only */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved((v) => !v); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm shadow hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>

        {/* Availability — bottom left on gradient */}
        <div className="absolute bottom-3 left-3">
          {doctor.availableToday ? (
            <div className="flex items-center gap-1.5 bg-green-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full shadow-md">
              <span className="relative flex w-2 h-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-green-200" />
              </span>
              Available Today
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm text-white/90 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border border-white/30">
              Not Available
            </div>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col flex-1 gap-3">

        {/* Name + specialty + degrees */}
        <div>
          <Link
            to={href}
            className="block text-[17px] font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors"
          >
            {doctor.name}
          </Link>
          <p className="text-blue-600 text-[14px] font-semibold mt-0.5">{doctor.specialty}</p>
          <p className="text-[13px] text-gray-400 truncate mt-0.5">{doctor.degrees}</p>
        </div>

        {/* Location + experience + rating */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-1.5 text-[13px] text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span className="truncate">{doctor.chamber}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px]">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
            <span className="font-bold text-gray-800">{doctor.rating}</span>
            <span className="text-gray-400">({doctor.reviews} reviews)</span>
          </div>
        </div>

        {/* Fee + queue */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">Consultation Fee</p>
            <p className="text-[18px] font-extrabold text-gray-900 leading-none">৳ {doctor.fee.toLocaleString()}</p>
          </div>
          <div className="text-right">
            {doctor.availableToday ? (
              <>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">Live Queue</p>
                <div className="flex items-center justify-end gap-1">
                  <Users className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-sm font-bold text-orange-500">
                    {doctor.queue > 0 ? `${doctor.queue} waiting` : 'No queue'}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-[11px] text-gray-400 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
                Not available
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link
            to={href}
            className="w-full py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Link>
          <button
            disabled={!doctor.availableToday}
            className="w-full py-3 min-h-[44px] border-2 border-green-500 text-green-600 text-sm font-bold rounded-xl hover:bg-green-50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <Users className="w-4 h-4" />
            Live Queue
          </button>
        </div>

      </div>
    </div>
  );
}
