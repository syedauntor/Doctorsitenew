import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle, Star, MapPin, Phone, Clock, Users, Calendar,
  GraduationCap, Briefcase, Tag, ChevronLeft, ExternalLink,
  Video, Building2, ArrowRight, Check, User, ThumbsUp, ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { doctors } from '../data/doctors';

const DAYS_AHEAD = 7;

function getNextDays(n: number): { label: string; full: string; date: Date }[] {
  const days = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      full: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      date: d,
    });
  }
  return days;
}

const TIME_SLOTS = {
  Morning: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '1:00 PM', '2:00 PM', '2:30 PM', '3:00 PM'],
  Evening: ['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'],
};

const BOOKED_SLOTS = new Set(['10:00 AM', '2:30 PM', '5:00 PM', '9:30 AM']);

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sz} ${i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function DoctorProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const doctor = doctors.find((d) => d.profile?.slug === slug || String(d.id) === slug);

  const [consultType, setConsultType] = useState<'online' | 'offline'>('offline');
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  const days = getNextDays(DAYS_AHEAD);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!doctor || !doctor.profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Not Found</h2>
          <p className="text-gray-500">The doctor profile you are looking for does not exist.</p>
          <Link to="/doctors" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            Back to Doctors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const p = doctor.profile;
  const fee = consultType === 'online' ? p.onlineFee : p.offlineFee;

  // Simulate live queue
  const queueTotal = doctor.queue + 3;
  const yourPosition = doctor.queue;
  const waitMinutes = yourPosition * 12;
  const queueProgress = Math.round(((queueTotal - yourPosition) / queueTotal) * 100);

  function handleBook() {
    if (!selectedSlot || !patientName || !patientPhone) return;
    setBookingDone(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/doctors" className="hover:text-blue-600 transition-colors">Doctors</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{doctor.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── LEFT COLUMN (65%) ── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* 1. Doctor Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover object-top border-4 border-white shadow-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                      <p className="text-blue-600 font-semibold text-base">{doctor.specialty}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{doctor.degrees}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-400 font-medium">BMDC Reg. No.</span>
                        <span className="text-xs text-gray-600 font-semibold">BMDC-12345</span>
                      </div>
                    </div>
                    {doctor.availableToday && (
                      <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Available Today
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{p.bio}</p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <StarRow rating={doctor.rating} />
                      <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                      <span className="text-sm text-gray-400">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-800">{p.totalPatients.toLocaleString()}</span> total patients
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-800">{doctor.experience} yrs</span> experience
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                      <Video className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-blue-500">Online Fee</p>
                        <p className="text-base font-bold text-blue-700">৳ {p.onlineFee.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-400">Chamber Fee</p>
                        <p className="text-base font-bold text-gray-800">৳ {p.offlineFee.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Chamber Information */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Chamber Information</h2>
              <div className="grid sm:grid-cols-2 gap-5 mb-6">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Chamber Name</p>
                    <p className="text-sm font-semibold text-gray-800">{p.chamberName}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{p.chamberPhone}</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:col-span-2">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-0.5">Address</p>
                    <p className="text-sm font-semibold text-gray-800">{p.chamberAddress}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(p.chamberAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-blue-600 font-medium hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Visiting hours table */}
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Visiting Hours</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {p.visitingHours.map(({ day, time, closed }) => (
                  <div
                    key={day}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm ${
                      closed ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span className={`font-semibold ${closed ? 'text-red-400' : 'text-gray-700'}`}>{day}</span>
                    <span className={`text-xs font-medium ${closed ? 'text-red-400' : 'text-green-700'}`}>
                      {closed ? 'Closed' : time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. About Doctor */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-7">
              <h2 className="text-lg font-bold text-gray-900">About Doctor</h2>

              {/* Education */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Education</h3>
                </div>
                <div className="relative pl-5 border-l-2 border-blue-100 space-y-5">
                  {p.education.map((edu, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <span className="inline-block mt-1.5 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          {edu.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Experience</h3>
                </div>
                <ul className="space-y-2.5">
                  {p.experienceList.map((exp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-700">{exp}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specializations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Specializations</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.specializations.map((s) => (
                    <span key={s} className="px-3.5 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Patient Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Patient Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRow rating={doctor.rating} size="lg" />
                  <span className="text-xl font-bold text-gray-900">{doctor.rating}</span>
                  <span className="text-sm text-gray-400">/ 5</span>
                </div>
              </div>
              <div className="space-y-4">
                {p.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={review.avatar}
                        alt={review.patient}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900">{review.patient}</p>
                          <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <StarRow rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (35%) ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-5 lg:sticky lg:top-24">

            {/* 1. Book Appointment Card */}
            {!bookingDone ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </h3>
                  <p className="text-blue-200 text-xs mt-0.5">Fee: ৳ {fee.toLocaleString()}</p>
                </div>

                <div className="p-5 space-y-5">
                  {/* Consult type toggle */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Consultation Type</p>
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                      {(['offline', 'online'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setConsultType(type)}
                          className={`py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
                            consultType === type
                              ? 'bg-white shadow text-blue-700'
                              : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {type === 'online' ? <Video className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                          {type === 'online' ? 'Online' : 'In-Person'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date picker */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Date</p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {days.map((day, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all duration-150 border ${
                            selectedDay === i
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <span>{day.label}</span>
                          <span className={`text-[10px] font-normal mt-0.5 ${selectedDay === i ? 'text-blue-200' : 'text-gray-400'}`}>{day.full}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Time Slot</p>
                    <div className="space-y-3">
                      {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                        <div key={period}>
                          <p className="text-xs text-gray-400 mb-1.5">{period}</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            {slots.map((slot) => {
                              const booked = BOOKED_SLOTS.has(slot);
                              const selected = selectedSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  disabled={booked}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 border ${
                                    booked
                                      ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through'
                                      : selected
                                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patient details */}
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Details</p>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Patient full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Book Now */}
                  <button
                    onClick={handleBook}
                    disabled={!selectedSlot || !patientName || !patientPhone}
                    className="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100 shadow-lg shadow-blue-200"
                  >
                    Book Now — ৳ {fee.toLocaleString()}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-gray-400">No payment required upfront</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Appointment Booked!</h3>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-gray-800">{days[selectedDay].label}, {days[selectedDay].full}</span> at{' '}
                  <span className="font-semibold text-blue-600">{selectedSlot}</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">with <span className="font-semibold text-gray-800">{doctor.name}</span></p>
                <div className="bg-gray-50 rounded-xl p-3 text-left mb-4">
                  <p className="text-xs text-gray-400">Patient</p>
                  <p className="text-sm font-semibold text-gray-800">{patientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{patientPhone}</p>
                </div>
                <button
                  onClick={() => { setBookingDone(false); setSelectedSlot(null); setPatientName(''); setPatientPhone(''); }}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Book Another
                </button>
              </div>
            )}

            {/* 2. Live Queue Widget */}
            {doctor.availableToday && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Live Queue
                  </h3>
                  <p className="text-green-200 text-xs mt-0.5">Real-time status</p>
                </div>

                <div className="p-5">
                  {/* Big queue number */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Current Token</p>
                      <p className="text-5xl font-black text-gray-900 leading-none">{queueTotal - yourPosition}</p>
                      <p className="text-xs text-gray-400 mt-1">being seen</p>
                    </div>
                    <div className="w-px h-16 bg-gray-100" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Your Position</p>
                      <p className="text-5xl font-black text-blue-600 leading-none">{yourPosition}</p>
                      <p className="text-xs text-gray-400 mt-1">in queue</p>
                    </div>
                    <div className="w-px h-16 bg-gray-100" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">Est. Wait</p>
                      <p className="text-3xl font-black text-orange-500 leading-none">{waitMinutes}</p>
                      <p className="text-xs text-gray-400 mt-1">minutes</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Queue Progress</span>
                      <span>{queueProgress}% done</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${queueProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Waiting', count: yourPosition, color: 'bg-orange-50 text-orange-600 border-orange-100' },
                      { label: 'In Progress', count: 1, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                      { label: 'Done', count: queueTotal - yourPosition - 1, color: 'bg-green-50 text-green-700 border-green-100' },
                    ].map(({ label, count, color }) => (
                      <div key={label} className={`text-center p-2.5 rounded-xl border ${color}`}>
                        <p className="text-lg font-bold">{count}</p>
                        <p className="text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Join Live Queue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
