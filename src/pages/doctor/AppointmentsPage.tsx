import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Video, FileText, Clock, Filter, LayoutList,
  CalendarDays, RefreshCw,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

const ALL_APPOINTMENTS = [
  { id: 1, serial: 1, name: 'Karim Hossain', age: 42, gender: 'M', type: 'Online', date: '2026-07-01', time: '10:00 AM', visit: 'New', status: 'Confirmed', chamber: 'Online' },
  { id: 2, serial: 2, name: 'Fatema Begum', age: 35, gender: 'F', type: 'In-Person', date: '2026-07-01', time: '10:30 AM', visit: 'Follow-up', status: 'Pending', chamber: 'Dhanmondi Chamber' },
  { id: 3, serial: 3, name: 'Rafiq Ahmed', age: 58, gender: 'M', type: 'In-Person', date: '2026-07-01', time: '11:00 AM', visit: 'New', status: 'Confirmed', chamber: 'Dhanmondi Chamber' },
  { id: 4, serial: 4, name: 'Nasrin Akter', age: 29, gender: 'F', type: 'Online', date: '2026-07-01', time: '11:30 AM', visit: 'Follow-up', status: 'Pending', chamber: 'Online' },
  { id: 5, serial: 5, name: 'Jahangir Alam', age: 65, gender: 'M', type: 'In-Person', date: '2026-07-01', time: '12:00 PM', visit: 'New', status: 'Completed', chamber: 'Gulshan Chamber' },
  { id: 6, serial: 6, name: 'Roksana Islam', age: 44, gender: 'F', type: 'In-Person', date: '2026-07-02', time: '03:00 PM', visit: 'Follow-up', status: 'Confirmed', chamber: 'Gulshan Chamber' },
  { id: 7, serial: 1, name: 'Mahbub Alam', age: 51, gender: 'M', type: 'In-Person', date: '2026-07-02', time: '10:00 AM', visit: 'New', status: 'Pending', chamber: 'Dhanmondi Chamber' },
  { id: 8, serial: 2, name: 'Sadia Islam', age: 33, gender: 'F', type: 'Online', date: '2026-07-03', time: '05:00 PM', visit: 'Follow-up', status: 'Confirmed', chamber: 'Online' },
];

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-blue-50 text-blue-700',
  Pending: 'bg-yellow-50 text-yellow-700',
  Completed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700',
};

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState<number[]>([]);
  const [currentMonth] = useState(new Date(2026, 6, 1));

  const filtered = ALL_APPOINTMENTS.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (typeFilter === 'Online only' && a.type !== 'Online') return false;
    if (typeFilter === 'In-person only' && a.type !== 'In-Person') return false;
    return true;
  });

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  // Calendar helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const apptCountByDay: Record<number, number> = {};
  ALL_APPOINTMENTS.forEach((a) => {
    const d = new Date(a.date).getDate();
    apptCountByDay[d] = (apptCountByDay[d] || 0) + 1;
  });

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 space-y-5 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
            <p className="text-sm text-gray-500 mt-0.5">{filtered.length} appointments found</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-lg transition ${view === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-gray-200 hidden sm:block" />
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Online only', 'In-person only'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  typeFilter === t ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xs font-semibold text-blue-700">{selected.length} selected</span>
            <button className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition">
              Confirm All
            </button>
            <button className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition">
              Cancel Selected
            </button>
            <button onClick={() => setSelected([])} className="text-xs text-gray-400 ml-auto hover:text-gray-600 transition">Clear</button>
          </div>
        )}

        {view === 'calendar' ? (
          /* Calendar view */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
              <h3 className="text-base font-bold text-gray-900">{monthName}</h3>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const count = apptCountByDay[day] || 0;
                const isToday = day === 1;
                return (
                  <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer transition ${
                    isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-50'
                  }`}>
                    <span className={isToday ? 'text-white' : 'text-gray-700 font-medium'}>{day}</span>
                    {count > 0 && (
                      <span className={`text-[9px] font-bold mt-0.5 ${isToday ? 'text-blue-200' : 'text-blue-500'}`}>{count}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List view */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">No appointments found</div>
            ) : filtered.map((apt) => (
              <div key={apt.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition ${selected.includes(apt.id) ? 'bg-blue-50' : ''}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(apt.id)}
                  onChange={() => toggleSelect(apt.id)}
                  className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer shrink-0"
                />
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">
                  {apt.serial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{apt.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{apt.age}y · {apt.gender === 'M' ? 'Male' : 'Female'} · {apt.visit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${apt.type === 'Online' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {apt.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[apt.status]}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.date} · {apt.time}</span>
                    <span>{apt.chamber}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {apt.status === 'Pending' && (
                      <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Confirm
                      </button>
                    )}
                    <button onClick={() => navigate('/doctor/prescriptions/new')} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Write Rx
                    </button>
                    {apt.type === 'Online' && (
                      <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1">
                        <Video className="w-3 h-3" /> Start Call
                      </button>
                    )}
                    {apt.status !== 'Completed' && (
                      <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                        Mark Done
                      </button>
                    )}
                    <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
