import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, FileText, Star, ArrowRight,
  Play, PenLine, BellOff, Eye, ChevronRight,
  Clock, CheckCircle, XCircle, Phone, Video,
  UserPlus, RefreshCw, AlertCircle, Bell,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

// ── Dummy data ───────────────────────────────────────────────────────────────

const APPOINTMENTS = [
  { id: 1, serial: 1, name: 'Karim Hossain', age: 42, gender: 'M', type: 'Online', time: '10:00 AM', visit: 'New', status: 'Confirmed', chamber: null },
  { id: 2, serial: 2, name: 'Fatema Begum', age: 35, gender: 'F', type: 'In-Person', time: '10:30 AM', visit: 'Follow-up', status: 'Pending', chamber: 'Dhanmondi Chamber' },
  { id: 3, serial: 3, name: 'Rafiq Ahmed', age: 58, gender: 'M', type: 'In-Person', time: '11:00 AM', visit: 'New', status: 'Confirmed', chamber: 'Dhanmondi Chamber' },
  { id: 4, serial: 4, name: 'Nasrin Akter', age: 29, gender: 'F', type: 'Online', time: '11:30 AM', visit: 'Follow-up', status: 'Pending', chamber: null },
  { id: 5, serial: 5, name: 'Jahangir Alam', age: 65, gender: 'M', type: 'In-Person', time: '12:00 PM', visit: 'New', status: 'Completed', chamber: 'Gulshan Chamber' },
  { id: 6, serial: 6, name: 'Roksana Islam', age: 44, gender: 'F', type: 'In-Person', time: '03:00 PM', visit: 'Follow-up', status: 'Confirmed', chamber: 'Gulshan Chamber' },
];

const QUEUE = [
  { serial: 1, name: 'K***m H.', status: 'done' },
  { serial: 2, name: 'F***a B.', status: 'done' },
  { serial: 3, name: 'R***q A.', status: 'done' },
  { serial: 4, name: 'N***n A.', status: 'done' },
  { serial: 5, name: 'J***r A.', status: 'done' },
  { serial: 6, name: 'R***a I.', status: 'done' },
  { serial: 7, name: 'M***l H.', status: 'done' },
  { serial: 8, name: 'S***a K.', status: 'done' },
  { serial: 9, name: 'T***l R.', status: 'current' },
  { serial: 10, name: 'A***d M.', status: 'waiting' },
  { serial: 11, name: 'P***i S.', status: 'waiting' },
  { serial: 12, name: 'B***r T.', status: 'waiting' },
];

const RECENT_PATIENTS = [
  { name: 'Karim Hossain', age: 42, lastVisit: '30 Jun 2026', diagnosis: 'Hypertension' },
  { name: 'Fatema Begum', age: 35, lastVisit: '28 Jun 2026', diagnosis: 'GERD' },
  { name: 'Rafiq Ahmed', age: 58, lastVisit: '25 Jun 2026', diagnosis: 'Type 2 Diabetes' },
  { name: 'Nasrin Akter', age: 29, lastVisit: '22 Jun 2026', diagnosis: 'Anxiety Disorder' },
  { name: 'Jahangir Alam', age: 65, lastVisit: '20 Jun 2026', diagnosis: 'Coronary Artery Disease' },
];

const NOTIFICATIONS = [
  { icon: UserPlus, color: 'blue', title: 'New appointment request', desc: 'Arif Hossain for Jul 2, 10:00 AM', time: '5 min ago' },
  { icon: Bell, color: 'green', title: 'Appointment confirmed', desc: 'Sadia Islam confirmed her slot', time: '1 hr ago' },
  { icon: Star, color: 'yellow', title: 'New review received', desc: 'Patient left a 5-star review', time: '3 hr ago' },
  { icon: AlertCircle, color: 'red', title: 'Prescription needed', desc: 'Rafiq Ahmed — Rx not yet written', time: 'Yesterday' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: 'bg-blue-50 text-blue-700',
    Pending: 'bg-yellow-50 text-yellow-700',
    Completed: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-700',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [apptFilter, setApptFilter] = useState<string>('All');
  const [currentServing, setCurrentServing] = useState(9);
  const [queueStatus, setQueueStatus] = useState<'Active' | 'Paused' | 'Closed'>('Active');

  const filteredAppts = apptFilter === 'All'
    ? APPOINTMENTS
    : APPOINTMENTS.filter((a) => a.status === apptFilter);

  const callNext = () => {
    if (currentServing < QUEUE.length) setCurrentServing((n) => n + 1);
  };

  const queueBtnClass = {
    Active: 'bg-green-100 text-green-700',
    Paused: 'bg-yellow-100 text-yellow-700',
    Closed: 'bg-red-100 text-red-700',
  }[queueStatus];

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px]">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Good morning, Dr. Rahim!</h2>
            <p className="text-sm text-gray-500 mt-0.5">Tuesday, 1 July 2026 · Dhaka</p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Queue Active
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Calendar} label="Today's Appointments" value={12} sub="Confirmed: 8 · Pending: 4" color="bg-blue-50 text-blue-600" />
          <StatCard icon={Users} label="Total Patients" value="1,250" sub="+12 this week" color="bg-purple-50 text-purple-600" />
          <StatCard icon={FileText} label="Pending Prescriptions" value={3} sub="Write now" color="bg-orange-50 text-orange-600" />
          <StatCard icon={Star} label="Average Rating" value="4.8" sub="Based on 312 reviews" color="bg-yellow-50 text-yellow-600" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/doctor/queue')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm shadow-green-200"
          >
            <Play className="w-4 h-4" /> Start Queue
          </button>
          <button
            onClick={() => navigate('/doctor/prescriptions/new')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-200"
          >
            <PenLine className="w-4 h-4" /> Write Prescription
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition shadow-sm shadow-orange-100">
            <BellOff className="w-4 h-4" /> Set Unavailable
          </button>
          <button
            onClick={() => navigate('/doctors/dr-rahim-uddin')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4" /> View Profile
          </button>
        </div>

        {/* Today's schedule + Queue */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Today's Appointments</h3>
              <button
                onClick={() => navigate('/doctor/appointments')}
                className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800 transition"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1 px-5 py-3 border-b border-gray-100">
              {['All', 'Pending', 'Confirmed', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setApptFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    apptFilter === f ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {/* List */}
            <div className="divide-y divide-gray-50">
              {filteredAppts.map((apt) => (
                <div key={apt.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">
                    {apt.serial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.name}</p>
                        <p className="text-xs text-gray-400">{apt.age}y · {apt.gender === 'M' ? 'Male' : 'Female'} · {apt.visit}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.type === 'Online' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {apt.type === 'Online' ? '🌐 Online' : '🏥 In-Person'}
                        </span>
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.time}
                      </span>
                      {apt.chamber && (
                        <span className="text-xs text-gray-400">{apt.chamber}</span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {apt.status === 'Pending' && (
                        <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Confirm
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/doctor/prescriptions/new')}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1"
                      >
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
                      {apt.status !== 'Completed' && (
                        <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Queue Panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Live Queue</h3>
                <button
                  onClick={() => {
                    const states: Array<'Active' | 'Paused' | 'Closed'> = ['Active', 'Paused', 'Closed'];
                    const next = states[(states.indexOf(queueStatus) + 1) % 3];
                    setQueueStatus(next);
                  }}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition ${queueBtnClass}`}
                >
                  {queueStatus}
                </button>
              </div>
              {/* Current */}
              <div className="p-5 border-b border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Now Serving</p>
                <div className="text-5xl font-black text-blue-600 my-2">#{currentServing}</div>
                <p className="text-sm font-semibold text-gray-700">
                  {QUEUE[currentServing - 1]?.name ?? '—'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Next: {QUEUE[currentServing]?.name ?? 'No more'}</p>
              </div>
              {/* Queue list */}
              <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 px-4 py-2">
                {QUEUE.map((q) => (
                  <div key={q.serial} className={`flex items-center justify-between py-2 ${
                    q.status === 'current' ? 'text-blue-600' : q.status === 'done' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        q.status === 'current' ? 'bg-blue-100' : q.status === 'done' ? 'bg-gray-100' : 'bg-gray-50'
                      }`}>{q.serial}</span>
                      <span className="text-xs font-medium">{q.name}</span>
                    </div>
                    {q.status === 'current' && <span className="text-[10px] text-blue-600 font-bold">Serving</span>}
                    {q.status === 'done' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </div>
                ))}
              </div>
              {/* Stats + Call next */}
              <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>Total: <b className="text-gray-800">15</b></span>
                  <span>Done: <b className="text-green-600">8</b></span>
                  <span>Left: <b className="text-orange-500">7</b></span>
                </div>
                <button
                  onClick={callNext}
                  className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Call Next
                </button>
                <button className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition">
                  Skip
                </button>
              </div>
            </div>

            {/* Stats today quick */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Today's Stats</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Completed', value: 8, color: 'bg-green-500', pct: 53 },
                  { label: 'Remaining', value: 7, color: 'bg-blue-500', pct: 47 },
                ].map(({ label, value, color, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="text-gray-800">{value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patients + Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent patients table */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Recent Patients</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search patients…"
                  className="text-xs border border-gray-200 rounded-lg pl-3 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">Patient</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Age</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Last Visit</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">Diagnosis</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {RECENT_PATIENTS.map((p) => (
                    <tr key={p.name} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-blue-600">{p.name[0]}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600">{p.age}y</td>
                      <td className="px-3 py-3 text-xs text-gray-500 hidden sm:table-cell">{p.lastVisit}</td>
                      <td className="px-3 py-3 text-xs text-gray-500 hidden md:table-cell">{p.diagnosis}</td>
                      <td className="px-3 py-3">
                        <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                          History <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">4</span>
            </div>
            <div className="divide-y divide-gray-50">
              {NOTIFICATIONS.map((n, i) => {
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 text-blue-600',
                  green: 'bg-green-50 text-green-600',
                  yellow: 'bg-yellow-50 text-yellow-600',
                  red: 'bg-red-50 text-red-600',
                };
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorMap[n.color]}`}>
                      <n.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{n.desc}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{n.time}</span>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-1">
                View all notifications <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
