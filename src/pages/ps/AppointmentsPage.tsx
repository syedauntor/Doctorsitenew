import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Clock, Video, Building2 } from 'lucide-react';
import PSLayout from '../../components/PSLayout';

interface Appointment { id: number; serial: number; name: string; patientId: string; age: number; gender: string; time: string; type: string; visit: string; status: string; chamber: string }

const APPOINTMENTS: Appointment[] = [
  { id: 1, serial: 1, name: 'Karim Hossain', patientId: 'PI-26-00001', age: 42, gender: 'M', time: '10:00 AM', type: 'Online', visit: 'Follow-up', status: 'Confirmed', chamber: 'Online' },
  { id: 2, serial: 2, name: 'Fatema Begum', patientId: 'PI-26-00002', age: 35, gender: 'F', time: '10:30 AM', type: 'In-Person', visit: 'Follow-up', status: 'Pending', chamber: 'Dhanmondi Chamber' },
  { id: 3, serial: 3, name: 'Rafiq Ahmed', patientId: 'PI-25-00003', age: 58, gender: 'M', time: '11:00 AM', type: 'In-Person', visit: 'Follow-up', status: 'Confirmed', chamber: 'Dhanmondi Chamber' },
  { id: 4, serial: 4, name: 'Nasrin Akter', patientId: 'PI-26-00004', age: 29, gender: 'F', time: '11:30 AM', type: 'Online', visit: 'New', status: 'Pending', chamber: 'Online' },
  { id: 5, serial: 5, name: 'Jahangir Alam', patientId: 'PI-24-00005', age: 65, gender: 'M', time: '12:00 PM', type: 'In-Person', visit: 'Follow-up', status: 'Completed', chamber: 'Dhanmondi Chamber' },
  { id: 6, serial: 6, name: 'Roksana Islam', patientId: 'PI-26-00006', age: 44, gender: 'F', time: '03:00 PM', type: 'In-Person', visit: 'Follow-up', status: 'Confirmed', chamber: 'Popular Chamber' },
  { id: 7, serial: 7, name: 'Mahbub Rahman', patientId: 'PI-26-00007', age: 51, gender: 'M', time: '03:30 PM', type: 'In-Person', visit: 'Follow-up', status: 'Pending', chamber: 'Popular Chamber' },
  { id: 8, serial: 8, name: 'Sadia Khan', patientId: 'PI-26-00008', age: 33, gender: 'F', time: '04:00 PM', type: 'Online', visit: 'New', status: 'Pending', chamber: 'Online' },
];

export default function PSAppointmentsPage() {
  const navigate = useNavigate();
  const [appts, setAppts] = useState(APPOINTMENTS);
  const [filter, setFilter] = useState('All');

  const confirm = (id: number) => setAppts((a) => a.map((x) => x.id === id ? { ...x, status: 'Confirmed' } : x));
  const cancel = (id: number) => setAppts((a) => a.map((x) => x.id === id ? { ...x, status: 'Cancelled' } : x));

  const filtered = filter === 'All' ? appts : appts.filter((a) => a.status === filter);

  const statusColor: Record<string, string> = {
    Confirmed: 'bg-blue-50 text-blue-700',
    Pending: 'bg-yellow-50 text-yellow-700',
    Completed: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <PSLayout>
      <div className="p-5 max-w-3xl space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
          <p className="text-sm text-gray-500 mt-0.5">Tuesday, 1 July 2026 · {appts.length} appointments</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${filter === f ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
              {f} {f === 'All' ? '' : `(${appts.filter((a) => a.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Appointment cards */}
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 text-sm font-bold flex items-center justify-center shrink-0">{apt.serial}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-gray-900">{apt.name}</span>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{apt.patientId}</span>
                    </div>
                    <p className="text-xs text-gray-500">{apt.age}y · {apt.gender === 'M' ? 'Male' : 'Female'} · {apt.visit}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="w-3 h-3" />{apt.time}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        {apt.type === 'Online' ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                        {apt.chamber}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColor[apt.status] ?? 'bg-gray-100 text-gray-500'}`}>{apt.status}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-50">
                {apt.status === 'Pending' && <>
                  <button onClick={() => confirm(apt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-100 transition">
                    <CheckCircle className="w-3.5 h-3.5" /> Confirm
                  </button>
                  <button onClick={() => cancel(apt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition">
                    <XCircle className="w-3.5 h-3.5" /> Cancel
                  </button>
                </>}
                {(apt.status === 'Confirmed' || apt.status === 'Pending') && (
                  <button onClick={() => navigate('/ps/queue')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg hover:bg-teal-100 transition">
                    <ArrowRight className="w-3.5 h-3.5" /> Patient Arrived → Add to Queue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PSLayout>
  );
}
