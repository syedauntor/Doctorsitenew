import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ClipboardList, Calendar, Users, Clock } from 'lucide-react';
import PSLayout from '../../components/PSLayout';
import { PATIENTS } from '../../data/patients';

export default function PSDashboardPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const result = query.trim()
    ? PATIENTS.find((p) =>
        p.patientId.toLowerCase().includes(query.toLowerCase()) ||
        p.phone.replace(/\*/g, '').includes(query.replace(/\*/g, '')) ||
        p.name.toLowerCase().includes(query.toLowerCase())
      ) ?? null
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const STATS = [
    { icon: Users, label: "Today's Patients", value: 12, color: 'bg-teal-50 text-teal-700' },
    { icon: ClipboardList, label: 'Queue Length', value: 15, color: 'bg-blue-50 text-blue-700' },
    { icon: Calendar, label: 'Appointments', value: 8, color: 'bg-orange-50 text-orange-700' },
    { icon: Clock, label: 'Serving Now', value: '#9', color: 'bg-green-50 text-green-700' },
  ];

  return (
    <PSLayout>
      <div className="p-5 space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patient Search</h2>
          <p className="text-sm text-gray-500 mt-0.5">Search by Patient ID, phone number, or name</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={query}
              onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
              placeholder="PI-26-00001 | 01712345678 | Karim Hossain…"
              className="w-full pl-10 pr-4 py-3 border-2 border-teal-200 rounded-2xl text-sm focus:outline-none focus:border-teal-500 bg-white shadow-sm"
            />
          </div>
          <button type="submit" className="px-5 py-3 bg-teal-600 text-white font-bold rounded-2xl text-sm hover:bg-teal-700 transition shadow-sm shadow-teal-200">
            Search
          </button>
        </form>

        {/* Search result */}
        {searched && query && (
          result ? (
            <div className="bg-white border-2 border-teal-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${result.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-teal-100 text-teal-600'}`}>
                    {result.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-base font-bold text-gray-900">{result.name}</span>
                      <span className="text-xs font-black px-2.5 py-1 bg-blue-600 text-white rounded-full">{result.patientId}</span>
                    </div>
                    <p className="text-sm text-gray-600">{result.age}y · {result.gender === 'M' ? 'Male' : 'Female'} · {result.bloodGroup}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{result.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">Last visit: {result.lastVisit} · {result.primaryDoctor}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  <button onClick={() => navigate('/ps/queue')}
                    className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition">
                    Add to Queue
                  </button>
                  <button onClick={() => navigate('/ps/appointments')}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                    View Appt
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-sm font-semibold text-gray-500 mb-3">No patient found with "{query}"</p>
              <button onClick={() => navigate('/ps/register')}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition">
                <UserPlus className="w-4 h-4" /> Register New Patient
              </button>
            </div>
          )
        )}

        {/* Stats row */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">Today's Overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent searches / quick access */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">Recent Patients</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {PATIENTS.slice(0, 5).map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition ${i < 4 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${p.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-teal-100 text-teal-600'}`}>
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">{p.patientId}</span>
                      <span className="text-xs text-gray-400">{p.phone}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/ps/queue')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-800 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition">
                  + Queue
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PSLayout>
  );
}
