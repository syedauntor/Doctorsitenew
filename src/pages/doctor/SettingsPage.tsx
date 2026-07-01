import { useState } from 'react';
import {
  User, Stethoscope, Building2, Clock, Bell,
  CalendarOff, Settings, Plus, X, Save, Wifi,
  ChevronDown, AlertTriangle,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

// ─── Types ────────────────────────────────────────────────────────────────────

const TABS_LIST = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'professional', label: 'Professional', icon: Stethoscope },
  { id: 'chamber', label: 'Chamber Settings', icon: Building2 },
  { id: 'availability', label: 'Availability', icon: CalendarOff },
  { id: 'booking', label: 'Booking Settings', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const ALL_DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];

interface DaySchedule {
  day: string;
  active: boolean;
  open: string;
  close: string;
  maxPatients: string;
}

interface ChamberAvailability {
  chamberId: string;
  chamberName: string;
  isOnline: boolean;
  schedule: DaySchedule[];
  slotDuration: number;
  slotGap: number;
  unavailableDates: { date: string; reason: string }[];
  holidayMode: boolean;
  holidayFrom: string;
  holidayTo: string;
  holidayReason: string;
}

interface ChamberData {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  newFee: string;
  followFee: string;
  online: boolean;
  onlineNewFee: string;
  onlineFollowFee: string;
}

function defaultSchedule(): DaySchedule[] {
  return ALL_DAYS.map((day, i) => ({
    day,
    active: [0, 1, 3, 5].includes(i),
    open: i < 4 ? '10:00' : '16:00',
    close: i < 4 ? '14:00' : '20:00',
    maxPatients: '20',
  }));
}

function defaultChamberAvailability(id: string, name: string, isOnline = false): ChamberAvailability {
  return {
    chamberId: id, chamberName: name, isOnline,
    schedule: defaultSchedule(),
    slotDuration: 15, slotGap: 5,
    unavailableDates: [],
    holidayMode: false,
    holidayFrom: '', holidayTo: '', holidayReason: '',
  };
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${props.className ?? ''}`} />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <select {...rest}
      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none">
      {children}
    </select>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{children}</h3>;
}

function SaveButton({ label = 'Save Changes' }: { label?: string }) {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
      <Save className="w-4 h-4" /> {label}
    </button>
  );
}

// ─── Mini calendar ─────────────────────────────────────────────────────────────

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MiniCalendar({
  unavailableDates,
  onToggleDate,
}: {
  unavailableDates: { date: string; reason: string }[];
  onToggleDate: (date: string) => void;
}) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6); // July = index 6

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const unavailSet = new Set(unavailableDates.map((d) => d.date));

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">‹</button>
        <span className="text-sm font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isUnavail = unavailSet.has(dateStr);
          const isToday = d === 1 && month === 6 && year === 2026;
          return (
            <button
              key={d}
              onClick={() => onToggleDate(dateStr)}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition ${
                isUnavail ? 'bg-red-500 text-white hover:bg-red-600' :
                isToday ? 'bg-blue-600 text-white' :
                'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Per-Chamber Availability Panel ──────────────────────────────────────────

const REASON_OPTIONS = ['Holiday', 'Personal', 'Conference', 'Training', 'Other'];

function ChamberAvailabilityPanel({
  avail,
  onChange,
}: {
  avail: ChamberAvailability;
  onChange: (a: ChamberAvailability) => void;
}) {
  const [newDateReason, setNewDateReason] = useState('Holiday');

  const updateDay = (i: number, patch: Partial<DaySchedule>) => {
    const schedule = [...avail.schedule];
    schedule[i] = { ...schedule[i], ...patch };
    onChange({ ...avail, schedule });
  };

  const toggleDate = (date: string) => {
    const exists = avail.unavailableDates.find((d) => d.date === date);
    if (exists) {
      onChange({ ...avail, unavailableDates: avail.unavailableDates.filter((d) => d.date !== date) });
    } else {
      onChange({ ...avail, unavailableDates: [...avail.unavailableDates, { date, reason: newDateReason }] });
    }
  };

  // Auto-calc total slots per active day
  const calcSlots = (open: string, close: string): number => {
    if (!open || !close) return 0;
    const [oh, om] = open.split(':').map(Number);
    const [ch, cm] = close.split(':').map(Number);
    const totalMin = (ch * 60 + cm) - (oh * 60 + om);
    if (totalMin <= 0) return 0;
    return Math.floor(totalMin / (avail.slotDuration + avail.slotGap));
  };

  return (
    <div className="space-y-6">
      {/* Platform label for online */}
      {avail.isOnline && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
          <Wifi className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-blue-700">Platform: EmergentHealth Video Call</span>
        </div>
      )}

      {/* Weekly schedule table */}
      <div>
        <SectionLabel>Weekly Schedule</SectionLabel>
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase">Day</th>
                <th className="text-center px-3 py-3 text-xs font-bold text-gray-400 uppercase">Active</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Open</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Close</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Max Pts</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Slots</th>
              </tr>
            </thead>
            <tbody>
              {avail.schedule.map((row, i) => (
                <tr key={row.day}
                  className={`border-b border-gray-100 last:border-0 transition ${row.active ? 'bg-white' : 'bg-gray-50/60'}`}>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${row.active ? 'text-gray-800' : 'text-gray-400'}`}>
                      {row.day.slice(0, 3)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox" checked={row.active}
                      onChange={() => updateDay(i, { active: !row.active })}
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-3">
                    {row.active ? (
                      <input type="time" value={row.open}
                        onChange={(e) => updateDay(i, { open: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                      />
                    ) : <span className="text-gray-300 text-sm">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    {row.active ? (
                      <input type="time" value={row.close}
                        onChange={(e) => updateDay(i, { close: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
                      />
                    ) : <span className="text-gray-300 text-sm">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    {row.active ? (
                      <input type="number" min="1" max="100" value={row.maxPatients}
                        onChange={(e) => updateDay(i, { maxPatients: e.target.value })}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-16 text-center"
                      />
                    ) : <span className="text-gray-300 text-sm">—</span>}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    {row.active && row.open && row.close ? (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {calcSlots(row.open, row.close)} slots
                      </span>
                    ) : <span className="text-gray-300 text-sm">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot settings */}
      <div>
        <SectionLabel>Appointment Slot Settings</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Slot Duration</FieldLabel>
            <div className="flex gap-2 flex-wrap">
              {[10, 15, 20, 30].map((min) => (
                <button key={min} type="button"
                  onClick={() => onChange({ ...avail, slotDuration: min })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                    avail.slotDuration === min
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}>
                  {min} min
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>Gap Between Slots</FieldLabel>
            <div className="flex gap-2 flex-wrap">
              {[0, 5, 10].map((min) => (
                <button key={min} type="button"
                  onClick={() => onChange({ ...avail, slotGap: min })}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                    avail.slotGap === min
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}>
                  {min === 0 ? 'No gap' : `${min} min`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="text-xs text-blue-700 font-medium">
            Auto-calculated: {(() => {
              const active = avail.schedule.filter((s) => s.active && s.open && s.close);
              const total = active.reduce((sum, row) => sum + calcSlots(row.open, row.close), 0);
              return `${total} total slots/week across ${active.length} active days`;
            })()}
          </span>
        </div>
      </div>

      {/* Unavailable dates */}
      <div>
        <SectionLabel>Mark Unavailable Dates</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <FieldLabel>Reason for unavailability</FieldLabel>
              <select
                value={newDateReason}
                onChange={(e) => setNewDateReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {REASON_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-400">Click a date in the calendar to mark/unmark it as unavailable. The selected reason will be applied.</p>
            <MiniCalendar
              unavailableDates={avail.unavailableDates}
              onToggleDate={toggleDate}
            />
          </div>
          <div>
            <FieldLabel>Marked Dates</FieldLabel>
            {avail.unavailableDates.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center text-xs text-gray-400">
                No dates marked
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...avail.unavailableDates].sort((a, b) => a.date.localeCompare(b.date)).map(({ date, reason }) => (
                  <div key={date} className="flex items-center justify-between gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-bold text-red-700">{date}</p>
                      <p className="text-[10px] text-red-400">{reason}</p>
                    </div>
                    <button
                      onClick={() => toggleDate(date)}
                      className="p-1 rounded-lg text-red-300 hover:text-red-600 hover:bg-red-100 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Holiday mode */}
      <div>
        <SectionLabel>Holiday Mode</SectionLabel>
        <div className="border border-orange-200 rounded-2xl p-5 bg-orange-50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-800">Enable Holiday Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">Pause all bookings for a date range</p>
            </div>
            <Toggle checked={avail.holidayMode} onChange={() => onChange({ ...avail, holidayMode: !avail.holidayMode })} />
          </div>
          {avail.holidayMode && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>From</FieldLabel>
                  <input type="date" value={avail.holidayFrom}
                    onChange={(e) => onChange({ ...avail, holidayFrom: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <FieldLabel>To</FieldLabel>
                  <input type="date" value={avail.holidayTo}
                    onChange={(e) => onChange({ ...avail, holidayTo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Reason</FieldLabel>
                <textarea rows={2} value={avail.holidayReason}
                  onChange={(e) => onChange({ ...avail, holidayReason: e.target.value })}
                  placeholder="e.g. Attending medical conference in Singapore…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-orange-200 bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex items-start gap-2 bg-orange-100 border border-orange-200 rounded-xl px-3.5 py-2.5">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700 font-medium">
                  All appointments in this period will be notified automatically.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');

  // Personal
  const [name, setName] = useState('Dr. Rahim Uddin');
  const [email, setEmail] = useState('dr.rahim@email.com');
  const [phone, setPhone] = useState('1712345678');
  const [bio, setBio] = useState('Experienced Cardiologist with over 12 years of practice.');

  // Chambers
  const [chambers, setChambers] = useState<ChamberData[]>([
    { id: 'ch1', name: 'Dhanmondi Chamber', address: 'House 32, Road 7, Dhanmondi', city: 'Dhaka', phone: '02-8612345', newFee: '800', followFee: '500', online: true, onlineNewFee: '600', onlineFollowFee: '400' },
    { id: 'ch2', name: 'Popular Chamber', address: 'Shyamoli, Dhaka', city: 'Dhaka', phone: '02-9101234', newFee: '1000', followFee: '600', online: false, onlineNewFee: '', onlineFollowFee: '' },
  ]);

  // Per-chamber availability (including online)
  const buildInitialAvailability = (chs: ChamberData[]): ChamberAvailability[] => {
    const result = chs.map((c) => defaultChamberAvailability(c.id, c.name));
    const hasOnline = chs.some((c) => c.online);
    if (hasOnline) result.push(defaultChamberAvailability('online', 'Online', true));
    return result;
  };

  const [availabilities, setAvailabilities] = useState<ChamberAvailability[]>(() => buildInitialAvailability(chambers));
  const [activeAvailTab, setActiveAvailTab] = useState('ch1');

  const updateAvail = (updated: ChamberAvailability) => {
    setAvailabilities((prev) => prev.map((a) => a.chamberId === updated.chamberId ? updated : a));
  };

  const currentAvail = availabilities.find((a) => a.chamberId === activeAvailTab) ?? availabilities[0];

  // Sync chambers → availability tabs when chambers change
  const updateChambers = (updatedChambers: ChamberData[]) => {
    setChambers(updatedChambers);
    setAvailabilities((prev) => {
      const newAvail: ChamberAvailability[] = updatedChambers.map((c) => {
        const existing = prev.find((a) => a.chamberId === c.id);
        return existing ? { ...existing, chamberName: c.name } : defaultChamberAvailability(c.id, c.name);
      });
      const hasOnline = updatedChambers.some((c) => c.online);
      if (hasOnline) {
        const existing = prev.find((a) => a.chamberId === 'online');
        newAvail.push(existing ?? defaultChamberAvailability('online', 'Online', true));
      }
      return newAvail;
    });
  };

  // Booking
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [maxPatients, setMaxPatients] = useState('20');
  const [apptGap, setApptGap] = useState('30');

  // Notifications
  const [sms, setSms] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [newApptAlert, setNewApptAlert] = useState(true);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1000px]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Tab list */}
          <div className="sm:w-48 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5 sm:sticky sm:top-20">
              {TABS_LIST.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

            {/* ── Personal ── */}
            {activeTab === 'personal' && (
              <>
                <SectionLabel>Personal Information</SectionLabel>
                <div className="flex items-center gap-5 mb-2">
                  <img src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150"
                    alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow" />
                  <div>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">Change Photo</button>
                    <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><FieldLabel>Full Name</FieldLabel><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><FieldLabel>Email</FieldLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><FieldLabel>Phone</FieldLabel><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                </div>
                <div>
                  <FieldLabel>Short Bio</FieldLabel>
                  <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Professional ── */}
            {activeTab === 'professional' && (
              <>
                <SectionLabel>Professional Information</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><FieldLabel>Medical Degree</FieldLabel><Input defaultValue="MBBS" /></div>
                  <div><FieldLabel>Additional Degrees</FieldLabel><Input defaultValue="MD (Cardiology)" /></div>
                  <div>
                    <FieldLabel>Specialty</FieldLabel>
                    <Select defaultValue="Cardiologist">
                      {['General Physician','Cardiologist','Pediatrician','Dermatologist','Neurologist','Orthopedic','Gynecologist','Eye Specialist','Psychiatrist','Dentist'].map((s) => <option key={s}>{s}</option>)}
                    </Select>
                  </div>
                  <div><FieldLabel>BMDC Registration No.</FieldLabel><Input defaultValue="A-12345" /></div>
                  <div><FieldLabel>Years of Experience</FieldLabel><Input type="number" defaultValue="12" /></div>
                  <div><FieldLabel>Current Hospital</FieldLabel><Input defaultValue="Green Life Medical Centre" /></div>
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Chamber ── */}
            {activeTab === 'chamber' && (
              <>
                <SectionLabel>Chamber Settings</SectionLabel>
                <div className="space-y-5">
                  {chambers.map((ch, i) => (
                    <div key={ch.id} className="border border-gray-200 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-800">Chamber {i + 1}</p>
                        {chambers.length > 1 && (
                          <button onClick={() => updateChambers(chambers.filter((c) => c.id !== ch.id))}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition">
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <FieldLabel>Chamber Name</FieldLabel>
                          <Input value={ch.name} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, name: e.target.value } : c))} />
                        </div>
                        <div className="sm:col-span-2">
                          <FieldLabel>Address</FieldLabel>
                          <Input value={ch.address} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, address: e.target.value } : c))} />
                        </div>
                        <div>
                          <FieldLabel>City</FieldLabel>
                          <Select value={ch.city} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, city: e.target.value } : c))}>
                            {CITIES.map((city) => <option key={city}>{city}</option>)}
                          </Select>
                        </div>
                        <div>
                          <FieldLabel>Phone</FieldLabel>
                          <Input value={ch.phone} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, phone: e.target.value } : c))} />
                        </div>
                        <div>
                          <FieldLabel>New Patient Fee (৳)</FieldLabel>
                          <Input type="number" value={ch.newFee} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, newFee: e.target.value } : c))} />
                        </div>
                        <div>
                          <FieldLabel>Follow-up Fee (৳)</FieldLabel>
                          <Input type="number" value={ch.followFee} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, followFee: e.target.value } : c))} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-700">Enable Online Consultation</span>
                        <Toggle checked={ch.online} onChange={() => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, online: !c.online } : c))} />
                      </div>
                      {ch.online && (
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div>
                            <FieldLabel>Online New Patient Fee (৳)</FieldLabel>
                            <Input type="number" value={ch.onlineNewFee} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, onlineNewFee: e.target.value } : c))} />
                          </div>
                          <div>
                            <FieldLabel>Online Follow-up Fee (৳)</FieldLabel>
                            <Input type="number" value={ch.onlineFollowFee} onChange={(e) => updateChambers(chambers.map((c) => c.id === ch.id ? { ...c, onlineFollowFee: e.target.value } : c))} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {chambers.length < 3 && (
                    <button
                      onClick={() => updateChambers([...chambers, { id: `ch${Date.now()}`, name: '', address: '', city: 'Dhaka', phone: '', newFee: '', followFee: '', online: false, onlineNewFee: '', onlineFollowFee: '' }])}
                      className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Chamber
                    </button>
                  )}
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Availability ── */}
            {activeTab === 'availability' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-gray-900">Availability</h3>
                </div>

                {/* Chamber tabs */}
                <div className="flex gap-1.5 flex-wrap border-b border-gray-100 pb-3 mb-5">
                  {availabilities.map((a) => (
                    <button
                      key={a.chamberId}
                      onClick={() => setActiveAvailTab(a.chamberId)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        activeAvailTab === a.chamberId
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {a.isOnline ? <Wifi className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      {a.isOnline ? 'Online' : a.chamberName || `Chamber ${availabilities.indexOf(a) + 1}`}
                    </button>
                  ))}
                </div>

                {currentAvail && (
                  <ChamberAvailabilityPanel
                    key={currentAvail.chamberId}
                    avail={currentAvail}
                    onChange={updateAvail}
                  />
                )}

                <div className="pt-4 border-t border-gray-100 mt-2">
                  <SaveButton label={`Save ${currentAvail?.isOnline ? 'Online' : currentAvail?.chamberName ?? 'Chamber'} Schedule`} />
                </div>
              </>
            )}

            {/* ── Booking ── */}
            {activeTab === 'booking' && (
              <>
                <SectionLabel>Booking Settings</SectionLabel>
                <div className="space-y-4">
                  {[
                    { label: 'Enable Online Booking', desc: 'Allow patients to book appointments online', val: onlineBooking, set: () => setOnlineBooking(!onlineBooking) },
                    { label: 'Auto-confirm Appointments', desc: 'Automatically confirm new bookings without manual review', val: autoConfirm, set: () => setAutoConfirm(!autoConfirm) },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <Toggle checked={val} onChange={set} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div><FieldLabel>Max Patients Per Day</FieldLabel><Input type="number" value={maxPatients} onChange={(e) => setMaxPatients(e.target.value)} /></div>
                    <div><FieldLabel>Appointment Gap (minutes)</FieldLabel><Input type="number" value={apptGap} onChange={(e) => setApptGap(e.target.value)} /></div>
                  </div>
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Notifications ── */}
            {activeTab === 'notifications' && (
              <>
                <SectionLabel>Notification Preferences</SectionLabel>
                <div className="space-y-3">
                  {[
                    { label: 'SMS Notifications', desc: 'Receive alerts via SMS', val: sms, set: () => setSms(!sms) },
                    { label: 'Email Notifications', desc: 'Receive alerts via email', val: emailNotif, set: () => setEmailNotif(!emailNotif) },
                    { label: 'New Appointment Alert', desc: 'Get notified when a new booking arrives', val: newApptAlert, set: () => setNewApptAlert(!newApptAlert) },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <Toggle checked={val} onChange={set} />
                    </div>
                  ))}
                </div>
                <SaveButton />
              </>
            )}

          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
