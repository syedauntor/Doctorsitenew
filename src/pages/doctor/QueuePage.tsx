import { useState } from 'react';
import {
  Phone, CheckCircle, Pause, X, RefreshCw,
  UserPlus, GripVertical, Trash2, Clock,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

interface QueueEntry { id: number; serial: number; name: string; phone: string; status: 'waiting' | 'current' | 'done' | 'skipped' }

const INITIAL_QUEUE: QueueEntry[] = [
  { id: 1, serial: 1, name: 'Karim H.', phone: '+880 171***4561', status: 'done' },
  { id: 2, serial: 2, name: 'Fatema B.', phone: '+880 182***2233', status: 'done' },
  { id: 3, serial: 3, name: 'Rafiq A.', phone: '+880 191***5567', status: 'done' },
  { id: 4, serial: 4, name: 'Nasrin A.', phone: '+880 155***8812', status: 'done' },
  { id: 5, serial: 5, name: 'Jahangir A.', phone: '+880 165***1190', status: 'done' },
  { id: 6, serial: 6, name: 'Roksana I.', phone: '+880 176***3341', status: 'done' },
  { id: 7, serial: 7, name: 'Mahbub A.', phone: '+880 178***7723', status: 'done' },
  { id: 8, serial: 8, name: 'Sadia K.', phone: '+880 193***4456', status: 'done' },
  { id: 9, serial: 9, name: 'Tariq R.', phone: '+880 161***9918', status: 'current' },
  { id: 10, serial: 10, name: 'Arif M.', phone: '+880 177***3302', status: 'waiting' },
  { id: 11, serial: 11, name: 'Polly S.', phone: '+880 188***5541', status: 'waiting' },
  { id: 12, serial: 12, name: 'Babar T.', phone: '+880 159***6673', status: 'waiting' },
  { id: 13, serial: 13, name: 'Ripon K.', phone: '', status: 'waiting' },
  { id: 14, serial: 14, name: 'Laila H.', phone: '+880 172***1123', status: 'waiting' },
  { id: 15, serial: 15, name: 'Omar F.', phone: '+880 185***4490', status: 'waiting' },
];

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>(INITIAL_QUEUE);
  const [queueState, setQueueState] = useState<'Active' | 'Paused' | 'Closed'>('Active');
  const [timePerPatient, setTimePerPatient] = useState(10);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const currentEntry = queue.find((q) => q.status === 'current');
  const doneCount = queue.filter((q) => q.status === 'done').length;
  const waitingCount = queue.filter((q) => q.status === 'waiting').length;
  const currentSerial = currentEntry?.serial ?? 0;
  const nextEntry = queue.find((q) => q.status === 'waiting');

  const callNext = () => {
    setQueue((prev) => {
      const next = prev.find((q) => q.status === 'waiting');
      if (!next) return prev;
      return prev.map((q) =>
        q.id === currentEntry?.id ? { ...q, status: 'done' as const } :
        q.id === next.id ? { ...q, status: 'current' as const } : q
      );
    });
  };

  const skipCurrent = () => {
    setQueue((prev) => {
      const next = prev.find((q) => q.status === 'waiting');
      if (!next) return prev;
      return prev.map((q) =>
        q.id === currentEntry?.id ? { ...q, status: 'skipped' as const } :
        q.id === next.id ? { ...q, status: 'current' as const } : q
      );
    });
  };

  const removeFromQueue = (id: number) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const addWalkIn = () => {
    if (!newName.trim()) return;
    const nextSerial = Math.max(...queue.map((q) => q.serial), 0) + 1;
    setQueue((prev) => [...prev, {
      id: Date.now(), serial: nextSerial,
      name: newName.trim(), phone: newPhone.trim(), status: 'waiting',
    }]);
    setNewName('');
    setNewPhone('');
  };

  const resetQueue = () => {
    setQueue(INITIAL_QUEUE.map((q) => ({ ...q, status: q.serial === 9 ? 'current' : q.serial < 9 ? 'done' : 'waiting' })));
  };

  const estimatedWait = waitingCount * timePerPatient;

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1100px] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Live Queue</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage today's patient queue</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              queueState === 'Active' ? 'bg-green-100 text-green-700' :
              queueState === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{queueState}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: controls + add walk-in */}
          <div className="space-y-4">
            {/* Big serving display */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Currently Serving</p>
              <div className="text-7xl font-black text-blue-600 my-3">#{currentSerial}</div>
              <p className="text-sm font-bold text-gray-800">{currentEntry?.name ?? '—'}</p>
              {currentEntry?.phone && <p className="text-xs text-gray-400 mt-0.5">{currentEntry.phone}</p>}
              <div className="mt-3 text-xs text-gray-500">
                Next: <span className="font-semibold text-gray-800">{nextEntry?.name ?? 'None'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
              <button
                onClick={callNext}
                disabled={!nextEntry || queueState !== 'Active'}
                className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-4 h-4" /> Call Next
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setQueueState(queueState === 'Paused' ? 'Active' : 'Paused')}
                  className="py-2.5 rounded-xl bg-yellow-50 text-yellow-700 text-xs font-bold hover:bg-yellow-100 transition flex items-center justify-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5" />
                  {queueState === 'Paused' ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={() => setQueueState('Closed')}
                  className="py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={skipCurrent}
                  className="py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition"
                >
                  Skip
                </button>
                <button
                  onClick={resetQueue}
                  className="py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-black text-gray-900">{queue.length}</p>
                  <p className="text-[10px] font-semibold text-gray-400">Total</p>
                </div>
                <div>
                  <p className="text-lg font-black text-green-600">{doneCount}</p>
                  <p className="text-[10px] font-semibold text-gray-400">Done</p>
                </div>
                <div>
                  <p className="text-lg font-black text-blue-600">{waitingCount}</p>
                  <p className="text-[10px] font-semibold text-gray-400">Waiting</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: queue.length ? `${(doneCount / queue.length) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Time setting */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-600">Avg. time / patient</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTimePerPatient((t) => Math.max(5, t - 5))} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition">-</button>
                  <span className="text-sm font-bold text-gray-800 w-12 text-center">{timePerPatient} min</span>
                  <button onClick={() => setTimePerPatient((t) => t + 5)} className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 transition">+</button>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Est. wait for next: <b className="text-gray-600 ml-0.5">~{estimatedWait} min</b>
              </p>
            </div>

            {/* Add walk-in */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-500" /> Add Walk-in Patient
              </p>
              <div className="space-y-2">
                <input
                  type="text" placeholder="Patient name *"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text" placeholder="Phone (optional)"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addWalkIn}
                  className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
                >
                  + Add to Queue
                </button>
              </div>
            </div>
          </div>

          {/* Right: full queue list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Full Queue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Drag to reorder waiting patients</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {queue.map((q) => (
                <div key={q.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition ${
                  q.status === 'current' ? 'bg-blue-50' : ''
                }`}>
                  {q.status === 'waiting' && (
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
                  )}
                  {q.status !== 'waiting' && <div className="w-4 shrink-0" />}

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    q.status === 'done' ? 'bg-green-50 text-green-600' :
                    q.status === 'current' ? 'bg-blue-600 text-white' :
                    q.status === 'skipped' ? 'bg-gray-100 text-gray-400 line-through' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {q.status === 'done' ? <CheckCircle className="w-4 h-4" /> : q.serial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${
                      q.status === 'done' ? 'text-gray-400 line-through' :
                      q.status === 'current' ? 'text-blue-700' :
                      q.status === 'skipped' ? 'text-gray-300 line-through' :
                      'text-gray-800'
                    }`}>{q.name}</p>
                    {q.phone && <p className="text-xs text-gray-400">{q.phone}</p>}
                  </div>

                  {q.status === 'current' && (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">Serving</span>
                  )}
                  {q.status === 'done' && (
                    <span className="text-[10px] font-semibold text-green-600">Done</span>
                  )}
                  {q.status === 'skipped' && (
                    <span className="text-[10px] font-semibold text-gray-400">Skipped</span>
                  )}
                  {q.status === 'waiting' && (
                    <button
                      onClick={() => removeFromQueue(q.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
