import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Users, X, FileText, Eye,
  Phone, Mail, ChevronRight, Download, StickyNote,
  Save, User, Clock, Plus,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Visit { date: string; diagnosis: string; prescription: boolean }
interface Patient {
  id: number; serial: number; name: string; age: number; gender: 'M' | 'F';
  phone: string; email: string; bloodGroup: string;
  lastVisit: string; totalVisits: number; lastDiagnosis: string;
  visits: Visit[]; notes: string;
}

const PATIENTS: Patient[] = [
  { id: 1, serial: 1, name: 'Karim Hossain', age: 42, gender: 'M', phone: '01712****561', email: 'k***@gmail.com', bloodGroup: 'B+', lastVisit: '30 Jun 2026', totalVisits: 8, lastDiagnosis: 'Hypertension', visits: [{ date: '30 Jun 2026', diagnosis: 'Hypertension — BP 138/88', prescription: true }, { date: '15 Jun 2026', diagnosis: 'Routine follow-up', prescription: true }, { date: '1 May 2026', diagnosis: 'Hypertension, Grade II', prescription: true }], notes: 'Patient is compliant with medication. Monitor BP monthly.' },
  { id: 2, serial: 2, name: 'Fatema Begum', age: 35, gender: 'F', phone: '01821****233', email: 'f***@yahoo.com', bloodGroup: 'A+', lastVisit: '28 Jun 2026', totalVisits: 5, lastDiagnosis: 'GERD', visits: [{ date: '28 Jun 2026', diagnosis: 'GERD — post-meal heartburn', prescription: true }, { date: '10 Jun 2026', diagnosis: 'GERD flare-up', prescription: true }], notes: '' },
  { id: 3, serial: 3, name: 'Rafiq Ahmed', age: 58, gender: 'M', phone: '01911****567', email: 'r***@gmail.com', bloodGroup: 'O+', lastVisit: '25 Jun 2026', totalVisits: 14, lastDiagnosis: 'Type 2 Diabetes', visits: [{ date: '25 Jun 2026', diagnosis: 'T2DM — HbA1c 7.8', prescription: true }, { date: '5 Jun 2026', diagnosis: 'T2DM follow-up', prescription: true }, { date: '1 Apr 2026', diagnosis: 'Diabetes + early nephropathy', prescription: true }], notes: 'Strict dietary advice given. Refer to endocrinology if HbA1c > 9.' },
  { id: 4, serial: 4, name: 'Nasrin Akter', age: 29, gender: 'F', phone: '01551****812', email: 'n***@gmail.com', bloodGroup: 'AB+', lastVisit: '22 Jun 2026', totalVisits: 3, lastDiagnosis: 'Anxiety Disorder', visits: [{ date: '22 Jun 2026', diagnosis: 'Anxiety — palpitations', prescription: true }, { date: '8 Jun 2026', diagnosis: 'Panic attack, first presentation', prescription: true }], notes: '' },
  { id: 5, serial: 5, name: 'Jahangir Alam', age: 65, gender: 'M', phone: '01651****190', email: 'j***@gmail.com', bloodGroup: 'O-', lastVisit: '20 Jun 2026', totalVisits: 22, lastDiagnosis: 'Coronary Artery Disease', visits: [{ date: '20 Jun 2026', diagnosis: 'CAD — stable angina', prescription: true }, { date: '1 Jun 2026', diagnosis: 'Post-PTCA follow-up', prescription: true }], notes: 'Post PTCA 2024. On dual antiplatelet.' },
  { id: 6, serial: 6, name: 'Roksana Islam', age: 44, gender: 'F', phone: '01761****341', email: 'r***@hotmail.com', bloodGroup: 'B-', lastVisit: '18 Jun 2026', totalVisits: 7, lastDiagnosis: 'Dyslipidemia', visits: [{ date: '18 Jun 2026', diagnosis: 'Dyslipidemia — LDL 145', prescription: true }], notes: '' },
  { id: 7, serial: 7, name: 'Mahbub Rahman', age: 51, gender: 'M', phone: '01781****723', email: 'm***@gmail.com', bloodGroup: 'A-', lastVisit: '16 Jun 2026', totalVisits: 4, lastDiagnosis: 'Arrhythmia', visits: [{ date: '16 Jun 2026', diagnosis: 'AF — rate control', prescription: true }], notes: '' },
  { id: 8, serial: 8, name: 'Sadia Khan', age: 33, gender: 'F', phone: '01931****456', email: 's***@gmail.com', bloodGroup: 'O+', lastVisit: '14 Jun 2026', totalVisits: 2, lastDiagnosis: 'Mitral Regurgitation', visits: [{ date: '14 Jun 2026', diagnosis: 'Mild MR on echo', prescription: false }], notes: 'Repeat echo in 6 months.' },
  { id: 9, serial: 9, name: 'Tariq Rahman', age: 47, gender: 'M', phone: '01611****918', email: 't***@gmail.com', bloodGroup: 'B+', lastVisit: '12 Jun 2026', totalVisits: 9, lastDiagnosis: 'Heart Failure', visits: [{ date: '12 Jun 2026', diagnosis: 'HFrEF — stable', prescription: true }], notes: 'On GDMT. Arrange echo every 6m.' },
  { id: 10, serial: 10, name: 'Laila Haque', age: 38, gender: 'F', phone: '01721****123', email: 'l***@gmail.com', bloodGroup: 'AB-', lastVisit: '10 Jun 2026', totalVisits: 1, lastDiagnosis: 'Palpitations', visits: [{ date: '10 Jun 2026', diagnosis: 'Benign palpitations — Holter normal', prescription: false }], notes: '' },
];

// ─── Patient Detail Drawer ─────────────────────────────────────────────────────

function PatientDrawer({
  patient, onClose, onNavigateRx,
}: {
  patient: Patient; onClose: () => void; onNavigateRx: (p: Patient) => void;
}) {
  const [notes, setNotes] = useState(patient.notes);
  const [notesSaved, setNotesSaved] = useState(false);

  const saveNotes = () => {
    patient.notes = notes;
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-[slideInRight_0.25s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-blue-600">{patient.name[0]}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{patient.name}</p>
              <p className="text-xs text-gray-500">{patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'} · {patient.bloodGroup}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Contact */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contact</p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{patient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{patient.email}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Visits', value: patient.totalVisits },
              { label: 'Blood Group', value: patient.bloodGroup },
              { label: 'Last Visit', value: patient.lastVisit.split(' ').slice(0, 2).join(' ') },
            ].map(({ label, value }) => (
              <div key={label} className="bg-blue-50 rounded-2xl p-3 text-center">
                <p className="text-base font-black text-blue-700">{value}</p>
                <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Visit history */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Visit History</p>
            <div className="space-y-2">
              {patient.visits.map((v, i) => (
                <div key={i} className="flex items-start gap-3 border border-gray-200 rounded-xl px-3.5 py-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{v.date}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{v.diagnosis}</p>
                  </div>
                  {v.prescription && (
                    <button className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition">
                      <Download className="w-3 h-3" /> Rx
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Doctor notes */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5" /> Doctor Notes
              <span className="text-[10px] text-gray-300 font-normal normal-case">(Private — only you can see)</span>
            </p>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add private notes about this patient…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50 border-yellow-200" />
            <div className="flex items-center justify-between mt-2">
              <button onClick={saveNotes}
                className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition">
                <Save className="w-3.5 h-3.5" /> Save Note
              </button>
              {notesSaved && <span className="text-xs text-green-600 font-semibold">Saved!</span>}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-2">
          <button onClick={() => onNavigateRx(patient)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
            <FileText className="w-4 h-4" /> Write Prescription
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = PATIENTS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.phone.includes(q);
    const matchFilter =
      filter === 'All' ? true :
      filter === 'New' ? p.totalVisits === 1 :
      filter === 'Regular' ? p.totalVisits >= 5 :
      filter === 'This Month' ? p.lastVisit.includes('Jun 2026') || p.lastVisit.includes('Jul 2026') :
      true;
    return matchSearch && matchFilter;
  });

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1100px] space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
              <p className="text-sm text-gray-500 mt-0.5">Manage and view patient records</p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{PATIENTS.length}</span>
          </div>
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name or phone…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1"><Filter className="w-3 h-3" />Filter:</span>
            {['All', 'New', 'Regular', 'This Month'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-base font-bold text-gray-400">No patients found</p>
            <p className="text-sm text-gray-400 mt-1">
              {PATIENTS.length === 0
                ? 'Your patients will appear here after the first appointment'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase w-8">#</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Patient</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden sm:table-cell">Phone</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">Last Visit</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden lg:table-cell">Visits</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase hidden xl:table-cell">Last Diagnosis</th>
                    <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition group">
                      <td className="px-4 py-3.5 text-xs font-bold text-gray-400">{p.serial}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${p.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.age}y · {p.gender === 'M' ? 'Male' : 'Female'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-gray-500 hidden sm:table-cell font-mono">{p.phone}</td>
                      <td className="px-3 py-3.5 text-xs text-gray-600 hidden md:table-cell">{p.lastVisit}</td>
                      <td className="px-3 py-3.5 hidden lg:table-cell text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.totalVisits >= 5 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {p.totalVisits}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-gray-500 hidden xl:table-cell max-w-[160px] truncate">{p.lastDiagnosis}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedPatient(p)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                          >
                            <Eye className="w-3 h-3" /> History
                          </button>
                          <button
                            onClick={() => navigate('/doctor/prescriptions/new')}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                          >
                            <FileText className="w-3 h-3" /> Write Rx
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patient drawer */}
        {selectedPatient && (
          <PatientDrawer
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
            onNavigateRx={() => navigate('/doctor/prescriptions/new')}
          />
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </DoctorLayout>
  );
}
