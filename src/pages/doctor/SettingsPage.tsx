import { useState } from 'react';
import {
  User, Stethoscope, Building2, CalendarOff, Settings,
  Bell, ShieldCheck, Plus, X, Save, Wifi,
  AlertTriangle, BadgeCheck, Clock,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';
import DobAgeInput, { type DobAgeValue, formatAgeLong } from '../../components/DobAgeInput';

// ─── Types ────────────────────────────────────────────────────────────────────

const ALL_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TABS_LIST = [
  { id: 'personal',      label: 'Personal Info',   icon: User },
  { id: 'professional',  label: 'Professional',     icon: Stethoscope },
  { id: 'verification',  label: 'Verification',     icon: ShieldCheck },
  { id: 'availability',  label: 'Availability',     icon: CalendarOff },
  { id: 'booking',       label: 'Booking Settings', icon: Settings },
  { id: 'notifications', label: 'Notifications',    icon: Bell },
];

interface DaySchedule { day: string; active: boolean; open: string; close: string; maxPatients: string }
interface ChamberAvailability {
  chamberId: string; chamberName: string; isOnline: boolean;
  schedule: DaySchedule[]; slotDuration: number; slotGap: number;
  unavailableDates: { date: string; reason: string }[];
  holidayMode: boolean; holidayFrom: string; holidayTo: string; holidayReason: string;
}
interface Publication { id: number; title: string; journal: string; year: string; url: string }
interface Award { id: number; name: string; org: string; year: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function FieldLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-sm font-semibold text-gray-700">{children}</label>
      {note && <p className="text-[11px] text-gray-400 mt-0.5">{note}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">{children}</h3>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className ?? ''}`} />
  );
}

function SaveButton({ label = 'Save Changes' }: { label?: string }) {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
      <Save className="w-4 h-4" /> {label}
    </button>
  );
}

function TagsInput({
  tags, onAdd, onRemove, placeholder, color = 'blue',
}: {
  tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void;
  placeholder?: string; color?: 'blue' | 'purple';
}) {
  const [val, setVal] = useState('');
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && val.trim()) {
      e.preventDefault();
      if (!tags.includes(val.trim())) onAdd(val.trim());
      setVal('');
    }
  };
  return (
    <div className="border border-gray-200 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 min-h-[44px] bg-white">
      {tags.map((t) => (
        <span key={t} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[color]}`}>
          {t}
          <button type="button" onClick={() => onRemove(t)} className="ml-0.5 opacity-60 hover:opacity-100">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text" value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent placeholder-gray-400"
      />
    </div>
  );
}

// ─── Availability helpers ─────────────────────────────────────────────────────

function defaultSchedule(): DaySchedule[] {
  return ALL_DAYS.map((day, i) => ({
    day, active: [0, 1, 3, 5].includes(i),
    open: i < 4 ? '10:00' : '16:00', close: i < 4 ? '14:00' : '20:00', maxPatients: '20',
  }));
}
function defaultChamberAvail(id: string, name: string, isOnline = false): ChamberAvailability {
  return { chamberId: id, chamberName: name, isOnline, schedule: defaultSchedule(), slotDuration: 15, slotGap: 5, unavailableDates: [], holidayMode: false, holidayFrom: '', holidayTo: '', holidayReason: '' };
}

const REASON_OPTIONS = ['Holiday', 'Personal', 'Conference', 'Training', 'Other'];

function MiniCalendar({ unavailableDates, onToggleDate }: { unavailableDates: { date: string; reason: string }[]; onToggleDate: (d: string) => void }) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const unavailSet = new Set(unavailableDates.map((d) => d.date));
  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };
  return (
    <div className="border border-gray-200 rounded-2xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">‹</button>
        <span className="text-sm font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isUnavail = unavailSet.has(dateStr);
          const isToday = d === 1 && month === 6 && year === 2026;
          return (
            <button key={d} onClick={() => onToggleDate(dateStr)}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition ${isUnavail ? 'bg-red-500 text-white hover:bg-red-600' : isToday ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChamberAvailabilityPanel({ avail, onChange }: { avail: ChamberAvailability; onChange: (a: ChamberAvailability) => void }) {
  const [newDateReason, setNewDateReason] = useState('Holiday');
  const updateDay = (i: number, patch: Partial<DaySchedule>) => {
    const schedule = [...avail.schedule]; schedule[i] = { ...schedule[i], ...patch };
    onChange({ ...avail, schedule });
  };
  const toggleDate = (date: string) => {
    const exists = avail.unavailableDates.find((d) => d.date === date);
    onChange({ ...avail, unavailableDates: exists ? avail.unavailableDates.filter((d) => d.date !== date) : [...avail.unavailableDates, { date, reason: newDateReason }] });
  };
  const calcSlots = (open: string, close: string): number => {
    const [oh, om] = open.split(':').map(Number); const [ch, cm] = close.split(':').map(Number);
    const total = (ch * 60 + cm) - (oh * 60 + om);
    return total <= 0 ? 0 : Math.floor(total / (avail.slotDuration + avail.slotGap));
  };
  return (
    <div className="space-y-6">
      {avail.isOnline && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
          <Wifi className="w-4 h-4 text-blue-500" /><span className="text-xs font-semibold text-blue-700">Platform: EmergentHealth Video Call</span>
        </div>
      )}
      <div>
        <SectionLabel>Weekly Schedule</SectionLabel>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">Day</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-gray-400 uppercase">Active</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Open</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Close</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Max Pts</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Slots</th>
            </tr></thead>
            <tbody>{avail.schedule.map((row, i) => (
              <tr key={row.day} className={`border-b border-gray-100 last:border-0 ${row.active ? 'bg-white' : 'bg-gray-50/60'}`}>
                <td className="px-4 py-3"><span className={`text-sm font-semibold ${row.active ? 'text-gray-800' : 'text-gray-400'}`}>{row.day.slice(0, 3)}</span></td>
                <td className="px-3 py-3 text-center"><input type="checkbox" checked={row.active} onChange={() => updateDay(i, { active: !row.active })} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" /></td>
                <td className="px-3 py-3">{row.active ? <input type="time" value={row.open} onChange={(e) => updateDay(i, { open: e.target.value })} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24" /> : <span className="text-gray-300">—</span>}</td>
                <td className="px-3 py-3">{row.active ? <input type="time" value={row.close} onChange={(e) => updateDay(i, { close: e.target.value })} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24" /> : <span className="text-gray-300">—</span>}</td>
                <td className="px-3 py-3">{row.active ? <input type="number" min="1" max="100" value={row.maxPatients} onChange={(e) => updateDay(i, { maxPatients: e.target.value })} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-16 text-center" /> : <span className="text-gray-300">—</span>}</td>
                <td className="px-3 py-3 hidden sm:table-cell">{row.active && row.open && row.close ? <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{calcSlots(row.open, row.close)} slots</span> : <span className="text-gray-300">—</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div>
        <SectionLabel>Appointment Slot Settings</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Slot Duration</FieldLabel>
            <div className="flex gap-2 flex-wrap">{[10,15,20,30].map((min) => <button key={min} type="button" onClick={() => onChange({ ...avail, slotDuration: min })} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${avail.slotDuration === min ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>{min} min</button>)}</div>
          </div>
          <div>
            <FieldLabel>Gap Between Slots</FieldLabel>
            <div className="flex gap-2 flex-wrap">{[0,5,10].map((min) => <button key={min} type="button" onClick={() => onChange({ ...avail, slotGap: min })} className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${avail.slotGap === min ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>{min === 0 ? 'No gap' : `${min} min`}</button>)}</div>
          </div>
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="text-xs text-blue-700 font-medium">
            {(() => { const active = avail.schedule.filter((s) => s.active && s.open && s.close); const total = active.reduce((sum, row) => sum + calcSlots(row.open, row.close), 0); return `${total} total slots/week across ${active.length} active days`; })()}
          </span>
        </div>
      </div>
      <div>
        <SectionLabel>Mark Unavailable Dates</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <FieldLabel>Reason for unavailability</FieldLabel>
              <select value={newDateReason} onChange={(e) => setNewDateReason(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">{REASON_OPTIONS.map((r) => <option key={r}>{r}</option>)}</select>
            </div>
            <p className="text-xs text-gray-400">Click a date to mark/unmark as unavailable.</p>
            <MiniCalendar unavailableDates={avail.unavailableDates} onToggleDate={toggleDate} />
          </div>
          <div>
            <FieldLabel>Marked Dates</FieldLabel>
            {avail.unavailableDates.length === 0 ? <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400">No dates marked</div> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">{[...avail.unavailableDates].sort((a, b) => a.date.localeCompare(b.date)).map(({ date, reason }) => (
                <div key={date} className="flex items-center justify-between gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  <div><p className="text-xs font-bold text-red-700">{date}</p><p className="text-[10px] text-red-400">{reason}</p></div>
                  <button onClick={() => toggleDate(date)} className="p-1 rounded-lg text-red-300 hover:text-red-600 hover:bg-red-100 transition"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <SectionLabel>Holiday Mode</SectionLabel>
        <div className="border border-orange-200 rounded-2xl p-5 bg-orange-50 space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-bold text-gray-800">Enable Holiday Mode</p><p className="text-xs text-gray-500 mt-0.5">Pause all bookings for a date range</p></div>
            <Toggle checked={avail.holidayMode} onChange={() => onChange({ ...avail, holidayMode: !avail.holidayMode })} />
          </div>
          {avail.holidayMode && (<>
            <div className="grid grid-cols-2 gap-3">
              <div><FieldLabel>From</FieldLabel><input type="date" value={avail.holidayFrom} onChange={(e) => onChange({ ...avail, holidayFrom: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><FieldLabel>To</FieldLabel><input type="date" value={avail.holidayTo} onChange={(e) => onChange({ ...avail, holidayTo: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            </div>
            <div><FieldLabel>Reason</FieldLabel><textarea rows={2} value={avail.holidayReason} onChange={(e) => onChange({ ...avail, holidayReason: e.target.value })} placeholder="e.g. Attending medical conference…" className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <div className="flex items-start gap-2 bg-orange-100 border border-orange-200 rounded-xl px-3.5 py-2.5"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /><p className="text-xs text-orange-700 font-medium">All appointments in this period will be notified automatically.</p></div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');

  // ── Personal
  const [name, setName] = useState('Dr. Rahim Uddin');
  const [email, setEmail] = useState('dr.rahim@email.com');
  const [phone, setPhone] = useState('1712345678');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dobAge, setDobAge] = useState<DobAgeValue>({ dob: '1982-05-15', ageManual: '' });
  const [bio, setBio] = useState('Experienced Cardiologist with over 12 years of practice.');
  const [longBio, setLongBio] = useState('Dr. Rahim Uddin is a distinguished Cardiologist with over 12 years of experience in the management of complex cardiovascular conditions. He completed his MBBS from Dhaka Medical College and his MD in Cardiology from NICVD. He has trained at leading cardiac centres in India and the UK. He is known for his patient-centred approach and evidence-based practice. He currently practices at Green Life Medical Centre, Dhanmondi.');
  const [languages, setLanguages] = useState(['Bangla', 'English']);

  // ── Professional
  const [specialty, setSpecialty] = useState('Cardiologist');
  const [concentration, setConcentration] = useState(['Interventional Cardiology', 'Heart Failure', 'Echocardiography']);
  const [publications, setPublications] = useState<Publication[]>([
    { id: 1, title: 'Outcomes of PTCA in Bangladeshi Patients', journal: 'Bangladesh Heart Journal', year: '2022', url: '' },
  ]);
  const [awards, setAwards] = useState<Award[]>([
    { id: 1, name: 'Best Young Cardiologist Award', org: 'Bangladesh Cardiac Society', year: '2020' },
  ]);

  // ── Availability (chamber list comes from ChambersPage; we mirror basic data here for scheduling)
  const chamberList = [
    { id: 'ch1', name: 'Dhanmondi Chamber', online: true },
    { id: 'ch2', name: 'Popular Chamber', online: false },
  ];
  const buildAvail = () => {
    const result = chamberList.map((c) => defaultChamberAvail(c.id, c.name));
    if (chamberList.some((c) => c.online)) result.push(defaultChamberAvail('online', 'Online', true));
    return result;
  };
  const [availabilities, setAvailabilities] = useState<ChamberAvailability[]>(buildAvail);
  const [activeAvailTab, setActiveAvailTab] = useState('ch1');
  const currentAvail = availabilities.find((a) => a.chamberId === activeAvailTab) ?? availabilities[0];

  // ── Booking
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [maxPatientsGlobal, setMaxPatientsGlobal] = useState('20');
  const [apptGap, setApptGap] = useState('30');

  // ── Notifications
  const [sms, setSms] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [newApptAlert, setNewApptAlert] = useState(true);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1050px]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Tab sidebar */}
          <div className="sm:w-52 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5 sm:sticky sm:top-20">
              {TABS_LIST.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 min-w-0">

            {/* ══════════════ PERSONAL INFO ══════════════ */}
            {activeTab === 'personal' && (<>
              <SectionLabel>Personal Information</SectionLabel>
              <div className="flex items-center gap-5">
                <img src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150" alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow" />
                <div>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">Change Photo</button>
                  <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 5MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><FieldLabel>Full Name</FieldLabel><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div><FieldLabel>Email</FieldLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><FieldLabel>Phone</FieldLabel><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="sm:col-span-2">
                  <FieldLabel>Date of Birth / Age</FieldLabel>
                  <DobAgeInput value={dobAge} onChange={(v) => setDobAge(v)} />
                  {dobAge.dob && <p className="text-xs text-green-700 font-semibold mt-1">Age: {formatAgeLong(dobAge.dob)}</p>}
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Doctor ID</FieldLabel>
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-lg font-black font-mono text-blue-900 tracking-wider">DOC-26-00001</p>
                      <p className="text-xs text-blue-500 mt-0.5">Read-only — assigned by the system upon registration</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Gender</FieldLabel>
                <div className="flex gap-4">
                  {(['Male', 'Female'] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} className="accent-blue-600 w-4 h-4" />
                      <span className="text-sm font-semibold text-gray-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel note="Press Enter or comma to add">Languages Spoken</FieldLabel>
                <TagsInput tags={languages} onAdd={(t) => setLanguages([...languages, t])} onRemove={(t) => setLanguages(languages.filter((l) => l !== t))} placeholder="e.g. Bangla, English…" />
              </div>
              <div>
                <FieldLabel note="Shown on doctor cards and search results">Short Bio</FieldLabel>
                <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-[11px] text-gray-400 text-right mt-1">{bio.length}/200</p>
              </div>
              <div>
                <FieldLabel note="Shown on your full doctor profile page">Full Profile Bio</FieldLabel>
                <textarea rows={6} value={longBio} onChange={(e) => setLongBio(e.target.value.slice(0, 1000))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-[11px] text-gray-400 text-right mt-1">{longBio.length}/1000</p>
              </div>
              <SaveButton />
            </>)}

            {/* ══════════════ PROFESSIONAL ══════════════ */}
            {activeTab === 'professional' && (<>
              <SectionLabel>Professional Information</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><FieldLabel>Medical Degree</FieldLabel><Input defaultValue="MBBS" /></div>
                <div><FieldLabel>Additional Degrees</FieldLabel><Input defaultValue="MD (Cardiology)" /></div>
                <div>
                  <FieldLabel>Specialty</FieldLabel>
                  <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    {['General Physician','Cardiologist','Pediatrician','Dermatologist','Neurologist','Orthopedic','Gynecologist','Eye Specialist','Psychiatrist','Dentist'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel note="Contact admin to update BMDC number">BMDC Registration No.</FieldLabel>
                  <Input defaultValue="A-12345" readOnly className="bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
                <div><FieldLabel>Years of Experience</FieldLabel><Input type="number" defaultValue="12" /></div>
                <div><FieldLabel>Current Hospital</FieldLabel><Input defaultValue="Green Life Medical Centre" /></div>
              </div>
              <div>
                <FieldLabel note="Press Enter or comma to add">Field of Concentration</FieldLabel>
                <TagsInput tags={concentration} onAdd={(t) => setConcentration([...concentration, t])} onRemove={(t) => setConcentration(concentration.filter((c) => c !== t))} placeholder="e.g. Stroke, Epilepsy…" color="purple" />
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Research & Publications</SectionLabel>
                  {publications.length < 10 && (
                    <button onClick={() => setPublications([...publications, { id: Date.now(), title: '', journal: '', year: '', url: '' }])}
                      className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>
                {publications.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs text-gray-400">No publications added</div>
                ) : (
                  <div className="space-y-3">
                    {publications.map((pub, i) => (
                      <div key={pub.id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">Publication {i + 1}</span>
                          <button onClick={() => setPublications(publications.filter((p) => p.id !== pub.id))} className="text-gray-300 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2"><FieldLabel>Title</FieldLabel><Input value={pub.title} onChange={(e) => setPublications(publications.map((p) => p.id === pub.id ? { ...p, title: e.target.value } : p))} placeholder="Publication title" /></div>
                          <div><FieldLabel>Journal</FieldLabel><Input value={pub.journal} onChange={(e) => setPublications(publications.map((p) => p.id === pub.id ? { ...p, journal: e.target.value } : p))} placeholder="Journal name" /></div>
                          <div><FieldLabel>Year</FieldLabel><Input type="number" value={pub.year} onChange={(e) => setPublications(publications.map((p) => p.id === pub.id ? { ...p, year: e.target.value } : p))} placeholder="2024" /></div>
                          <div className="sm:col-span-2"><FieldLabel>Link / URL (optional)</FieldLabel><Input type="url" value={pub.url} onChange={(e) => setPublications(publications.map((p) => p.id === pub.id ? { ...p, url: e.target.value } : p))} placeholder="https://…" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <SectionLabel>Awards & Recognition</SectionLabel>
                  {awards.length < 10 && (
                    <button onClick={() => setAwards([...awards, { id: Date.now(), name: '', org: '', year: '' }])}
                      className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  )}
                </div>
                {awards.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs text-gray-400">No awards added</div>
                ) : (
                  <div className="space-y-3">
                    {awards.map((aw, i) => (
                      <div key={aw.id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-400">Award {i + 1}</span>
                          <button onClick={() => setAwards(awards.filter((a) => a.id !== aw.id))} className="text-gray-300 hover:text-red-500 transition"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2"><FieldLabel>Award Name</FieldLabel><Input value={aw.name} onChange={(e) => setAwards(awards.map((a) => a.id === aw.id ? { ...a, name: e.target.value } : a))} placeholder="Award name" /></div>
                          <div><FieldLabel>Year</FieldLabel><Input type="number" value={aw.year} onChange={(e) => setAwards(awards.map((a) => a.id === aw.id ? { ...a, year: e.target.value } : a))} placeholder="2024" /></div>
                          <div className="sm:col-span-3"><FieldLabel>Organization</FieldLabel><Input value={aw.org} onChange={(e) => setAwards(awards.map((a) => a.id === aw.id ? { ...a, org: e.target.value } : a))} placeholder="Awarding organization" /></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <SaveButton />
            </>)}

            {/* ══════════════ VERIFICATION ══════════════ */}
            {activeTab === 'verification' && (<>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Verification Status</h3>
              </div>
              <p className="text-xs text-gray-400 mb-5">Verification is controlled by the admin team. Contact admin for any issues.</p>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-800">Overall Profile Status</p>
                  <span className="text-sm font-black text-blue-600">3 of 4 complete</span>
                </div>
                <div className="h-2.5 bg-blue-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-gray-500">Complete all verifications to unlock full profile visibility.</p>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">BMDC Verification</p>
                      <p className="text-xs text-gray-500 mt-0.5">Submitted: BMDC #A-12345</p>
                      <p className="text-xs text-gray-400 mt-0.5">Verified on: 15 Jan 2024</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Identity Verification</p>
                      <p className="text-xs text-gray-500 mt-0.5">NID: ****5678 (submitted)</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-800 mb-3">Chamber Verification</p>
                  <p className="text-xs text-gray-400 mb-3">Admin visits chamber to verify. This may take 3–5 business days.</p>
                  <div className="space-y-2.5">
                    {[{ name: 'Dhanmondi Chamber', status: 'Verified' }, { name: 'Popular Chamber', status: 'Pending' }].map(({ name, status }) => (
                      <div key={name} className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5">
                        <span className="text-sm text-gray-700 font-medium">{name}</span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          {status === 'Verified' ? <BadgeCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />} {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">Profile Photo Review</p>
                      <p className="text-xs text-gray-500 mt-0.5">Photo must be professional and clear</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      <Clock className="w-3.5 h-3.5" /> Pending Review
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">Need help with verification?</p>
                <a href="mailto:admin@emergentHealth.com" className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-200 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 transition">
                  Contact Admin
                </a>
              </div>
            </>)}

            {/* ══════════════ AVAILABILITY ══════════════ */}
            {activeTab === 'availability' && (<>
              <h3 className="text-base font-bold text-gray-900 mb-4">Availability</h3>
              <div className="flex gap-1.5 flex-wrap border-b border-gray-100 pb-3 mb-5">
                {availabilities.map((a) => (
                  <button key={a.chamberId} onClick={() => setActiveAvailTab(a.chamberId)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${activeAvailTab === a.chamberId ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {a.isOnline ? <Wifi className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                    {a.isOnline ? 'Online' : a.chamberName || `Chamber ${availabilities.indexOf(a) + 1}`}
                  </button>
                ))}
              </div>
              {currentAvail && <ChamberAvailabilityPanel key={currentAvail.chamberId} avail={currentAvail} onChange={(u) => setAvailabilities((prev) => prev.map((a) => a.chamberId === u.chamberId ? u : a))} />}
              <div className="pt-4 border-t border-gray-100 mt-2">
                <SaveButton label={`Save ${currentAvail?.isOnline ? 'Online' : currentAvail?.chamberName ?? 'Chamber'} Schedule`} />
              </div>
            </>)}

            {/* ══════════════ BOOKING ══════════════ */}
            {activeTab === 'booking' && (<>
              <SectionLabel>Booking Settings</SectionLabel>
              <div className="space-y-4">
                {[
                  { label: 'Enable Online Booking', desc: 'Allow patients to book appointments online', val: onlineBooking, set: () => setOnlineBooking(!onlineBooking) },
                  { label: 'Auto-confirm Appointments', desc: 'Automatically confirm new bookings without manual review', val: autoConfirm, set: () => setAutoConfirm(!autoConfirm) },
                ].map(({ label, desc, val, set }) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div><p className="text-sm font-bold text-gray-800">{label}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
                    <Toggle checked={val} onChange={set} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div><FieldLabel>Max Patients Per Day</FieldLabel><Input type="number" value={maxPatientsGlobal} onChange={(e) => setMaxPatientsGlobal(e.target.value)} /></div>
                  <div><FieldLabel>Appointment Gap (minutes)</FieldLabel><Input type="number" value={apptGap} onChange={(e) => setApptGap(e.target.value)} /></div>
                </div>
              </div>
              <SaveButton />
            </>)}

            {/* ══════════════ NOTIFICATIONS ══════════════ */}
            {activeTab === 'notifications' && (<>
              <SectionLabel>Notification Preferences</SectionLabel>
              <div className="space-y-3">
                {[
                  { label: 'SMS Notifications', desc: 'Receive alerts via SMS', val: sms, set: () => setSms(!sms) },
                  { label: 'Email Notifications', desc: 'Receive alerts via email', val: emailNotif, set: () => setEmailNotif(!emailNotif) },
                  { label: 'New Appointment Alert', desc: 'Get notified when a new booking arrives', val: newApptAlert, set: () => setNewApptAlert(!newApptAlert) },
                ].map(({ label, desc, val, set }) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div><p className="text-sm font-bold text-gray-800">{label}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
                    <Toggle checked={val} onChange={set} />
                  </div>
                ))}
              </div>
              <SaveButton />
            </>)}

          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
