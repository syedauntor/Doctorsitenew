import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle, Star, MapPin, Phone, Clock, Users, Calendar,
  GraduationCap, Briefcase, ExternalLink,
  Video, Building2, ArrowRight, Check, User, ThumbsUp, ShieldCheck,
  BookOpen, Award, MessageCircle, Share2, QrCode, Download,
  Link2, Facebook, Lock, UserCheck, Activity, Globe,
  ChevronDown, MessageSquare, ChevronRight,
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

const RESEARCH_PUBLICATIONS = [
  { title: 'Interventional Cardiology Outcomes in South Asian Patients', journal: 'Bangladesh Medical Journal', year: '2022', type: 'Research' },
  { title: 'Long-term Follow-up of Coronary Artery Bypass Patients', journal: 'Journal of Cardiology, BSMMU', year: '2020', type: 'Research' },
  { title: 'Hypertension Management Protocols in Primary Care', journal: 'Bangladesh Heart Journal', year: '2019', type: 'Review' },
  { title: 'Echocardiographic Assessment of Valvular Heart Disease', journal: 'SAARC Cardiac Journal', year: '2017', type: 'Original Article' },
];

const AWARDS = [
  { title: 'Best Cardiologist Award', org: 'Bangladesh Medical Association', year: '2023' },
  { title: 'Excellence in Patient Care', org: 'Apollo Hospitals Group', year: '2021' },
  { title: 'Research Grant – Cardiac Disease', org: 'BSMMU Research Fund', year: '2019' },
  { title: 'Fellowship Recognition', org: 'Royal College of Physicians, UK', year: '2014' },
];

const QA_LIST = [
  { q: 'Can stress alone cause a heart attack?', a: 'Yes, severe emotional or physical stress can trigger cardiac events, especially in patients with underlying coronary artery disease. Managing stress through lifestyle changes and, where necessary, medication is important.', date: '12 May 2024' },
  { q: 'How often should I get a cardiac checkup?', a: 'For adults over 40 or those with risk factors like hypertension, diabetes, or family history — annually. For younger healthy adults, every 2–3 years is generally sufficient.', date: '3 Apr 2024' },
  { q: 'Is an irregular heartbeat always dangerous?', a: 'Not always. Some arrhythmias are benign, but others require treatment. A Holter monitor test over 24–48 hours helps classify the type. Please consult a cardiologist for proper evaluation.', date: '18 Feb 2024' },
];

const TODAY_DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

type InfoTab = 'research' | 'awards' | 'qa';

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
  const [searchParams] = useSearchParams();
  const doctor = doctors.find((d) => d.profile?.slug === slug || String(d.id) === slug);

  const [consultType, setConsultType] = useState<'online' | 'offline'>('offline');
  const [patientType, setPatientType] = useState<'new' | 'followup'>('new');
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingDone, setBookingDone] = useState(false);
  const [activeTab, setActiveTab] = useState<InfoTab>('research');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [openChamber, setOpenChamber] = useState<number | null>(0);

  const days = getNextDays(DAYS_AHEAD);

  useEffect(() => {
    window.scrollTo(0, 0);
    // If ?booking=1 is in URL and booking is enabled, scroll to booking
    if (searchParams.get('booking') === '1' && doctor?.bookingEnabled) {
      setTimeout(() => {
        document.getElementById('booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [slug]);

  if (!doctor || !doctor.profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24 px-4">
          <h2 className="text-2xl font-bold text-gray-800">Doctor Not Found</h2>
          <p className="text-gray-500 text-center">The doctor profile you are looking for does not exist.</p>
          <Link to="/doctors" className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors min-h-[44px] flex items-center">
            Back to Doctors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const p = doctor.profile;
  const chambers = p.chambers ?? [{
    name: p.chamberName,
    address: p.chamberAddress,
    phone: p.chamberPhone,
    newPatientFee: p.offlineFee,
    followUpFee: Math.round(p.offlineFee * 0.75),
    visitingHours: p.visitingHours,
  }];

  const baseFee = consultType === 'online' ? p.onlineFee : p.offlineFee;
  const fee = patientType === 'followup' ? Math.round(baseFee * 0.75) : baseFee;

  const queueTotal = doctor.queue + 3;
  const yourPosition = doctor.queue;
  const waitMinutes = yourPosition * 12;
  const queueProgress = Math.round(((queueTotal - yourPosition) / queueTotal) * 100);

  // Next available day calculation
  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIdx = dayOrder.indexOf(TODAY_DAY_NAME);
  const openDays = p.visitingHours.filter((h) => !h.closed).map((h) => h.day);
  const nextAvailableDay = (() => {
    for (let i = 1; i <= 7; i++) {
      const nextDay = dayOrder[(todayIdx + i) % 7];
      if (openDays.includes(nextDay)) return nextDay;
    }
    return null;
  })();

  function handleBook() {
    if (!selectedSlot || !patientName || !patientPhone) return;
    setBookingDone(true);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const tabs: { id: InfoTab; label: string; icon: React.ElementType }[] = [
    { id: 'research', label: 'Research & Publications', icon: BookOpen },
    { id: 'awards', label: 'Awards & Recognition', icon: Award },
    { id: 'qa', label: 'Answered Q&A', icon: MessageCircle },
  ];

  // ── BOOKING CARD (shown when bookingEnabled = true) ──────────────────────
  const bookingCard = doctor.bookingEnabled ? (
    <div id="booking-card" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {!bookingDone ? (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Appointment
            </h3>
            <p className="text-blue-200 text-xs mt-0.5">
              Fee: ৳ {fee.toLocaleString()}
              {patientType === 'followup' && (
                <span className="ml-1.5 bg-blue-500/50 px-1.5 py-0.5 rounded text-blue-100">25% off</span>
              )}
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* Visit type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Visit Type</p>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                {([['new', 'New Patient'], ['followup', 'Follow-up']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setPatientType(val)}
                    className={`py-2.5 min-h-[44px] text-sm font-semibold rounded-lg transition-all duration-150 ${
                      patientType === val ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Consult type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Consultation Mode</p>
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                {(['offline', 'online'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setConsultType(type)}
                    className={`py-2.5 min-h-[44px] text-sm font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 ${
                      consultType === type ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type === 'online' ? <Video className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                    {type === 'online' ? 'Online' : 'In-Person'}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee summary */}
            <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-blue-500 font-medium">Consultation Fee</p>
                <p className="text-lg font-bold text-blue-700">৳ {fee.toLocaleString()}</p>
              </div>
              {patientType === 'followup' && (
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">৳ {baseFee.toLocaleString()}</p>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Save 25%</span>
                </div>
              )}
            </div>

            {/* Date picker */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                    className={`flex flex-col items-center px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold shrink-0 transition-all duration-150 border min-w-[58px] ${
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slot) => {
                        const booked = BOOKED_SLOTS.has(slot);
                        const selected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            disabled={booked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2.5 min-h-[44px] text-xs font-semibold rounded-lg transition-all duration-150 border ${
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
                  className="w-full pl-10 pr-3 py-3 min-h-[44px] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 min-h-[44px] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedSlot || !patientName || !patientPhone}
              className="w-full py-3.5 min-h-[44px] bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100 shadow-lg shadow-blue-200"
            >
              Book Now — ৳ {fee.toLocaleString()}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-gray-400">No payment required upfront</p>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
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
            className="w-full py-3 min-h-[44px] border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Book Another
          </button>
        </div>
      )}
    </div>
  ) : null;

  // ── CONTACT CARD (shown when bookingEnabled = false) ─────────────────────
  const contactCard = !doctor.bookingEnabled ? (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Contact for Appointment
        </h3>
        <p className="text-blue-200 text-xs mt-0.5">Online booking unavailable — contact directly</p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Phone numbers */}
        {chambers.map((ch, i) => (
          <div key={i} className="space-y-2">
            {i > 0 && <div className="border-t border-gray-100 pt-2" />}
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{ch.name}</p>
            <a
              href={`tel:${ch.phone}`}
              className="flex items-center gap-3 px-4 py-3 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{ch.phone}</span>
            </a>
          </div>
        ))}

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${chambers[0].phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I would like to book an appointment with ${doctor.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 min-h-[44px] bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.374 0 0 5.373 0 12c0 2.126.554 4.118 1.525 5.847L.051 23.481a.75.75 0 0 0 .921.921l5.635-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.73-.52-5.27-1.43l-.38-.23-3.34.875.89-3.26-.25-.39A9.957 9.957 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          WhatsApp
        </a>

        {/* Visit in person note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Visit in person:</strong> Walk-in patients accepted during visiting hours. Please call ahead to confirm availability.
          </p>
        </div>

        {/* Chamber address + Maps link */}
        <div className="space-y-2">
          {chambers.map((ch, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">{ch.name}</p>
              <p className="text-xs text-gray-700 leading-relaxed">{ch.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(ch.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                View on Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  // ── VISITING HOURS CARD (shown when bookingEnabled = false) ───────────────
  const visitingHoursCard = !doctor.bookingEnabled ? (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
        <h3 className="text-sm font-bold text-gray-900">Visiting Hours</h3>
      </div>
      <div className="p-4 space-y-1.5">
        {p.visitingHours.map(({ day, time, closed }) => {
          const isToday = day === TODAY_DAY_NAME;
          return (
            <div
              key={day}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs border transition-colors ${
                isToday
                  ? 'bg-green-50 border-green-200'
                  : closed
                  ? 'bg-gray-50 border-gray-100'
                  : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isToday ? 'text-green-700' : closed ? 'text-gray-400' : 'text-gray-700'}`}>
                  {day}
                </span>
                {isToday && (
                  <span className="text-[10px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                    Today
                  </span>
                )}
              </div>
              <span className={`font-semibold ${isToday ? 'text-green-700' : closed ? 'text-red-400' : 'text-gray-600'}`}>
                {closed ? 'Closed' : time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  // ── QUEUE WIDGET (shown only when availableToday = true AND queueActive = true) ──
  const queueWidget = (doctor.availableToday && doctor.queueActive) ? (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Users className="w-4 h-4" />
          Live Queue
        </h3>
        <p className="text-green-200 text-xs mt-0.5">Real-time status</p>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 mb-1">Current Token</p>
            <p className="text-4xl sm:text-5xl font-black text-gray-900 leading-none">{queueTotal - yourPosition}</p>
            <p className="text-xs text-gray-400 mt-1">being seen</p>
          </div>
          <div className="w-px h-14 bg-gray-100 shrink-0" />
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 mb-1">Your Position</p>
            <p className="text-4xl sm:text-5xl font-black text-blue-600 leading-none">{yourPosition}</p>
            <p className="text-xs text-gray-400 mt-1">in queue</p>
          </div>
          <div className="w-px h-14 bg-gray-100 shrink-0" />
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400 mb-1">Est. Wait</p>
            <p className="text-3xl sm:text-4xl font-black text-orange-500 leading-none">{waitMinutes}</p>
            <p className="text-xs text-gray-400 mt-1">minutes</p>
          </div>
        </div>

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

        <button className="mt-4 w-full py-3 min-h-[44px] bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          Join Live Queue
        </button>
      </div>
    </div>
  ) : null;

  // ── SHARE CARD ─────────────────────────────────────────────────────────────
  const shareCard = (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
        <h3 className="text-white font-bold text-base flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share Profile
        </h3>
        <p className="text-blue-200 text-xs mt-0.5">Help others find this doctor</p>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors group"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Link2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
            {linkCopied ? 'Link Copied!' : 'Copy Profile Link'}
          </span>
          {linkCopied && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out ${doctor.name}'s profile`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl hover:bg-green-100 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.374 0 0 5.373 0 12c0 2.126.554 4.118 1.525 5.847L.051 23.481a.75.75 0 0 0 .921.921l5.635-1.474A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.73-.52-5.27-1.43l-.38-.23-3.34.875.89-3.26-.25-.39A9.957 9.957 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
        </div>

        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
        </button>

        {showQR && (
          <div className="flex flex-col items-center gap-2 pt-1">
            <div className="w-36 h-36 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1">
              <QrCode className="w-10 h-10 text-gray-400" />
              <p className="text-[10px] text-gray-400 text-center">QR code for<br />{doctor.name}</p>
            </div>
            <p className="text-[10px] text-gray-400">Scan to open this profile</p>
          </div>
        )}

        <button className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-red-500" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Download Profile PDF</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <Link to="/" className="hover:text-blue-600 transition-colors shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link to="/doctors" className="hover:text-blue-600 transition-colors shrink-0">Doctors</Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-800 font-medium truncate">{doctor.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* 1. Doctor Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 border-l-4 overflow-hidden shadow-sm" style={{ borderLeftColor: '#2563EB' }}>

              <div className="flex flex-col sm:flex-row">

                {/* Photo + bio panel */}
                <div className="sm:w-[240px] shrink-0 flex flex-col border-b sm:border-b-0 sm:border-r border-gray-100 self-start">
                  <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-gray-100">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {doctor.verified && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">About</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{p.bio}</p>
                  </div>
                </div>

                {/* Name + badges + stats */}
                <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col gap-4">

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-[1.45rem] font-extrabold text-gray-900 leading-tight tracking-tight">{doctor.name}</h1>
                      </div>
                      <p className="text-blue-600 font-semibold text-[14px] mt-0.5">{doctor.specialty}</p>
                      <p className="text-gray-400 text-[12px] font-medium mt-0.5">{doctor.degrees}</p>
                    </div>

                    {/* Availability badge — smart */}
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {doctor.availableToday ? (
                        <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full">
                          <span className="relative flex w-2 h-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
                          </span>
                          Available Today
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-gray-400 rounded-full shrink-0" />
                            Not Available Today
                          </span>
                          {nextAvailableDay && (
                            <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              Next: {nextAvailableDay}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Verification badges */}
                  <div className="flex flex-col gap-2">
                    {doctor.bmdcVerified && (
                      <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                        <ShieldCheck className="w-3 h-3 text-green-600" />
                        BMDC Verified #12345
                      </div>
                    )}
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
                      {[
                        { key: 'identity', label: 'Identity', active: doctor.identityVerified, Icon: UserCheck, activeClass: 'bg-blue-50 border-blue-200 text-blue-700', iconClass: 'text-blue-600' },
                        { key: 'chamber', label: 'Chamber', active: doctor.chamberVerified, Icon: Building2, activeClass: 'bg-green-50 border-green-200 text-green-700', iconClass: 'text-green-600' },
                        { key: 'bmdc', label: 'BMDC', active: doctor.bmdcVerified, Icon: ShieldCheck, activeClass: 'bg-green-50 border-green-200 text-green-700', iconClass: 'text-green-600' },
                      ].map(({ key, label, active, Icon, activeClass, iconClass }) => (
                        <div key={key} className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 ${active ? activeClass : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                          {active ? <Icon className={`w-3.5 h-3.5 shrink-0 ${iconClass}`} /> : <Lock className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
                          <div>
                            <p className="text-[9px] font-medium opacity-60 leading-none">{active ? 'Verified' : 'Not verified'}</p>
                            <p className="text-[11px] font-bold leading-tight">{label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specializations */}
                  {p.specializations.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Specializes in</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.specializations.map((s) => (
                          <span key={s} className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                    {[
                      { icon: <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />, value: String(doctor.rating), label: `${doctor.reviews} Reviews` },
                      { icon: <Users className="w-5 h-5 text-blue-500" />, value: p.totalPatients.toLocaleString(), label: 'Patients Seen' },
                      { icon: <Briefcase className="w-5 h-5 text-blue-600" />, value: `${doctor.experience} yrs`, label: 'Experience' },
                      { icon: <Activity className="w-5 h-5 text-green-500" />, value: doctor.lastActive ?? 'Today', label: 'Last Active' },
                    ].map(({ icon, value, label }, i) => (
                      <div key={i} className={`flex flex-col items-center justify-center gap-1 py-3 px-2 ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-gray-200' : ''} ${i === 1 ? 'border-l border-gray-200' : ''}`}>
                        {icon}
                        <span className="text-[17px] font-extrabold text-gray-900 leading-none">{value}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fee cards */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    <div className="flex-1 rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                          <Video className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">Online</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-[11px]">New Patient</span>
                          <span className="text-white font-bold text-sm">৳ {p.onlineFee.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-[11px]">Follow-up</span>
                          <span className="text-white font-bold text-sm">৳ {Math.round(p.onlineFee * 0.75).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">Chamber</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-[11px]">New Patient</span>
                          <span className="text-white font-bold text-sm">৳ {p.offlineFee.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-[11px]">Follow-up</span>
                          <span className="text-white font-bold text-sm">৳ {Math.round(p.offlineFee * 0.75).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom info row */}
              <div className="border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">Hours</p>
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {p.visitingHours.find(h => !h.closed)?.time?.split('–')[0]?.trim() ?? 'See schedule'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">Location</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{p.chamberName.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">Languages</p>
                    <p className="text-xs font-bold text-gray-800">Bangla, English</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none mb-0.5">Contact</p>
                    <p className="text-xs font-bold text-gray-800 truncate">{p.chamberPhone}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Mobile sidebar cards */}
            <div className="lg:hidden space-y-5">
              {bookingCard}
              {contactCard}
              {visitingHoursCard}
              {queueWidget}
            </div>

            {/* 2. About Doctor */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-7">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">About Doctor</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{p.bio}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-blue-600 shrink-0" />
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Education</h3>
                </div>
                <div className="relative pl-5 border-l-2 border-blue-100 space-y-5">
                  {p.education.map((edu, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.4rem] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-bold text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <span className="inline-block mt-1.5 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-green-600 shrink-0" />
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
            </div>

            {/* 3. Chambers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
                <h2 className="text-sm font-bold text-gray-900">
                  Chambers
                  <span className="ml-2 text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {chambers.length}
                  </span>
                </h2>
              </div>

              {chambers.map((chamber, idx) => {
                const isOpen = openChamber === idx;
                return (
                  <div key={idx} className={idx > 0 ? 'border-t border-gray-100' : ''}>
                    <button
                      onClick={() => setOpenChamber(isOpen ? null : idx)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{chamber.name}</p>
                        <p className="text-xs text-gray-400 truncate">{chamber.address.split(',').slice(-2).join(',').trim()}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-green-600 hidden sm:block">৳ {chamber.newPatientFee.toLocaleString()}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 space-y-4 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex gap-3 pt-4">
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Address</p>
                            <p className="text-sm font-semibold text-gray-800">{chamber.address}</p>
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(chamber.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-blue-600 font-medium hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View on Google Maps
                            </a>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Contact</p>
                            <p className="text-sm font-semibold text-gray-800">{chamber.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">New Patient</p>
                            <p className="text-base font-extrabold text-green-600">৳ {chamber.newPatientFee.toLocaleString()}</p>
                          </div>
                          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Follow-up</p>
                            <p className="text-base font-extrabold text-blue-600">৳ {chamber.followUpFee.toLocaleString()}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Visiting Hours</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {chamber.visitingHours.map(({ day, time, closed }) => (
                              <div
                                key={day}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border ${closed ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}
                              >
                                <span className={`font-semibold ${closed ? 'text-red-400' : 'text-gray-700'}`}>{day}</span>
                                <span className={`font-medium ${closed ? 'text-red-400' : 'text-green-700'}`}>{closed ? 'Closed' : time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 4. Tabbed Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors min-h-[44px] ${
                      activeTab === id
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'research' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 mb-4">{RESEARCH_PUBLICATIONS.length} publications</p>
                    {RESEARCH_PUBLICATIONS.map((pub, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50/40 transition-colors group">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">{pub.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{pub.journal}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{pub.type}</span>
                            <span className="text-[10px] text-gray-400">{pub.year}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'awards' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-400 mb-4">{AWARDS.length} awards & recognitions</p>
                    {AWARDS.map((award, i) => (
                      <div key={i} className="flex gap-3 sm:gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Award className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{award.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{award.org}</p>
                          <span className="inline-block mt-1.5 text-[10px] font-semibold text-yellow-700 bg-yellow-50 border border-yellow-100 px-2 py-0.5 rounded-full">{award.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-5">
                    <p className="text-xs text-gray-400 mb-4">{QA_LIST.length} answered questions</p>
                    {QA_LIST.map((item, i) => (
                      <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="bg-blue-50 px-4 py-3 flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-[10px] font-bold">Q</span>
                          </div>
                          <p className="text-sm font-semibold text-blue-900 leading-snug">{item.q}</p>
                        </div>
                        <div className="px-4 py-3 flex items-start gap-3 bg-white">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-green-700 text-[10px] font-bold">A</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
                            <p className="text-[10px] text-gray-400 mt-2">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Patient Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Patient Reviews</h2>
                <div className="flex items-center gap-2">
                  <StarRow rating={doctor.rating} size="lg" />
                  <span className="text-xl font-bold text-gray-900">{doctor.rating}</span>
                  <span className="text-sm text-gray-400 hidden sm:inline">/ 5</span>
                </div>
              </div>
              <div className="space-y-4">
                {p.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <img src={review.avatar} alt={review.patient} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900">{review.patient}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <StarRow rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    <button className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors min-h-[44px]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile share card */}
            <div className="lg:hidden">
              {shareCard}
            </div>

          </div>

          {/* ── RIGHT COLUMN — desktop sticky ── */}
          <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col gap-5 sticky top-24">
            {/* booking=true: Show booking card */}
            {bookingCard}
            {/* booking=false: Show contact card + visiting hours */}
            {contactCard}
            {visitingHoursCard}
            {/* Queue: only if availableToday AND queueActive */}
            {queueWidget}
            {shareCard}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
