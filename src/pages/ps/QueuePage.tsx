import { useState } from 'react';
import { Phone, SkipForward, Pause, Play, X, Search, Plus, CheckCircle } from 'lucide-react';
import PSLayout from '../../components/PSLayout';
import { PATIENTS } from '../../data/patients';

interface QueueEntry { serial: number; name: string; patientId: string; type: 'Appointment' | 'Walk-in'; status: 'waiting' | 'current' | 'done' | 'skipped' }

const INIT_QUEUE: QueueEntry[] = [
  { serial: 1, name: 'Karim Hossain',  patientId: 'PI-26-00001', type: 'Appointment', status: 'done' },
  { serial: 2, name: 'Fatema Begum',   patientId: 'PI-26-00002', type: 'Walk-in',    status: 'done' },
  { serial: 3, name: 'Rafiq Ahmed',    patientId: 'PI-25-00003', type: 'Appointment', status: 'done' },
  { serial: 4, name: 'Nasrin Akter',   patientId: 'PI-26-00004', type: 'Online',     status: 'done' } as QueueEntry,
  { serial: 5, name: 'Jahangir Alam',  patientId: 'PI-24-00005', type: 'Walk-in',    status: 'done' },
  { serial: 6, name: 'Roksana Islam',  patientId: 'PI-26-00006', type: 'Appointment', status: 'done' },
  { serial: 7, name: 'Mahbub Rahman',  patientId: 'PI-26-00007', type: 'Walk-in',    status: 'done' },
  { serial: 8, name: 'Sadia Khan',     patientId: 'PI-26-00008', type: 'Appointment', status: 'done' },
  { serial: 9, name: 'Tariq Rahman',   patientId: 'PI-25-00009', type: 'Walk-in',    status: 'current' },
  { serial: 10, name: 'Laila Haque',   patientId: 'PI-26-00010', type: 'Appointment', status: 'waiting' },
  { serial: 11, name: 'Arif Hossain',  patientId: 'PI-26-00011', type: 'Walk-in',    status: 'waiting' },
  { serial: 12, name: 'Piya Sen',      patientId: 'PI-26-00012', type: 'Appointment', status: 'waiting' },
];

export default function PSQueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>(INIT_QUEUE);
  const [paused, setPaused] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [addMode, setAddMode] = useState(false);

  const currentEntry = queue.find((q) => q.status === 'current');
  const currentIdx = queue.findIndex((q) => q.status === 'current');
  const doneCount = queue.filter((q) => q.status === 'done').length;
  const waitingCount = queue.filter((q) => q.status === 'waiting').length;

  const callNext = () => {
    setQueue((q) => {
      const nextWaiting = q.findIndex((e) => e.status === 'waiting');
      if (nextWaiting === -1) return q;
      return q.map((e, i) => {
        if (e.status === 'current') return { ...e, status: 'done' };
        if (i === nextWaiting) return { ...e, status: 'current' };
        return e;
      });
    });
  };

  const skipCurrent = () => {
    setQueue((q) => {
      const nextWaiting = q.findIndex((e) => e.status === 'waiting');
      return q.map((e, i) => {
        if (e.status === 'current') return { ...e, status: 'skipped' };
        if (i === nextWaiting) return { ...e, status: 'current' };
        return e;
      });
    });
  };

  const addToQueue = (name: string, pid: string) => {
    const nextSerial = queue.length + 1;
    setQueue((q) => [...q, { serial: nextSerial, name, patientId: pid, type: 'Walk-in', status: 'waiting' }]);
    setAddMode(false);
    setSearchQ('');
  };

  const removeEntry = (serial: number) => setQueue((q) => q.filter((e) => e.serial !== serial));

  const filteredPatients = PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.patientId.toLowerCase().includes(searchQ.toLowerCase())
  );

  const statusColor = (s: QueueEntry['status']) => {
    if (s === 'done') return 'text-gray-400';
    if (s === 'current') return 'text-teal-700 font-bold';
    if (s === 'skipped') return 'text-orange-500';
    return 'text-gray-700';
  };

  const statusBg = (s: QueueEntry['status']) => {
    if (s === 'done') return 'bg-gray-100';
    if (s === 'current') return 'bg-teal-500 text-white';
    if (s === 'skipped') return 'bg-orange-100 text-orange-600';
    return 'bg-gray-50';
  };

  return (
    <PSLayout>
      <div className="p-5 max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Queue</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage live patient queue</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${paused ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
            {paused ? 'Paused' : 'Active'}
          </span>
        </div>

        {/* Current token */}
        <div className="bg-teal-700 rounded-2xl p-5 text-center text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-200 mb-2">Now Serving</p>
          <div className="text-7xl font-black mb-2">#{currentEntry?.serial ?? '–'}</div>
          <p className="text-lg font-bold">{currentEntry?.name ?? '—'}</p>
          <p className="text-sm text-teal-300 mt-0.5">{currentEntry?.patientId}</p>
          <p className="text-xs text-teal-200 mt-1">Next: {queue.find((q) => q.status === 'waiting')?.name ?? 'No more patients'}</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={callNext} className="flex items-center justify-center gap-2 py-3 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition shadow-sm">
            <Phone className="w-4 h-4" /> Call Next
          </button>
          <button onClick={skipCurrent} className="flex items-center justify-center gap-2 py-3 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition shadow-sm">
            <SkipForward className="w-4 h-4" /> Skip
          </button>
          <button onClick={() => setPaused(!paused)} className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition">
            {paused ? <><Play className="w-4 h-4" /> Resume</> : <><Pause className="w-4 h-4" /> Pause</>}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Total', value: queue.length, color: 'text-gray-900' }, { label: 'Done', value: doneCount, color: 'text-green-600' }, { label: 'Waiting', value: waitingCount, color: 'text-teal-600' }].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-3.5 text-center shadow-sm">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Add to queue */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700">Queue List</h3>
            <button onClick={() => setAddMode(!addMode)}
              className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-800 transition">
              <Plus className="w-3.5 h-3.5" /> Add Walk-in
            </button>
          </div>

          {addMode && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-3 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder="Search patient by name or ID…"
                  className="w-full pl-9 pr-3 py-2.5 border border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
              </div>
              {searchQ && (
                <div className="bg-white border border-teal-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  {filteredPatients.slice(0, 6).map((p) => (
                    <button key={p.id} onClick={() => addToQueue(p.name, p.patientId)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-teal-50 transition border-b border-gray-50 last:border-0">
                      <div>
                        <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded ml-2">{p.patientId}</span>
                      </div>
                      <span className="text-xs text-teal-600 font-bold">Add</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Queue table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase w-12">#</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Patient</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Type</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="w-10" />
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((entry) => (
                  <tr key={entry.serial} className={`${entry.status === 'current' ? 'bg-teal-50' : 'hover:bg-gray-50'} transition`}>
                    <td className="px-4 py-3">
                      <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${statusBg(entry.status)}`}>{entry.serial}</span>
                    </td>
                    <td className="px-3 py-3">
                      <p className={`text-sm ${statusColor(entry.status)}`}>{entry.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{entry.patientId}</p>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${entry.type === 'Walk-in' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>{entry.type}</span>
                    </td>
                    <td className="px-3 py-3">
                      {entry.status === 'done' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {entry.status === 'current' && <span className="text-xs font-bold text-teal-600 animate-pulse">Serving</span>}
                      {entry.status === 'waiting' && <span className="text-xs text-gray-400">Waiting</span>}
                      {entry.status === 'skipped' && <span className="text-xs text-orange-500 font-semibold">Skipped</span>}
                    </td>
                    <td className="px-2 py-3">
                      {entry.status === 'waiting' && (
                        <button onClick={() => removeEntry(entry.serial)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PSLayout>
  );
}
