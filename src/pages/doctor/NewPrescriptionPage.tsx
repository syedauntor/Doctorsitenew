import { useState } from 'react';
import { Plus, Trash2, Eye, Download, Search, User } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

interface MedicineRow { id: number; name: string; dosage: string; duration: string; instructions: string }

const PATIENTS = [
  { id: 1, name: 'Karim Hossain', age: 42, gender: 'Male', weight: '72 kg', bp: '130/85' },
  { id: 2, name: 'Fatema Begum', age: 35, gender: 'Female', weight: '58 kg', bp: '120/78' },
  { id: 3, name: 'Rafiq Ahmed', age: 58, gender: 'Male', weight: '80 kg', bp: '145/92' },
  { id: 4, name: 'Nasrin Akter', age: 29, gender: 'Female', weight: '54 kg', bp: '115/75' },
];

export default function NewPrescriptionPage() {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof PATIENTS[0] | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [preview, setPreview] = useState(false);
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { id: 1, name: '', dosage: '', duration: '', instructions: '' },
  ]);

  const filteredPatients = PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const addMedicineRow = () =>
    setMedicines((prev) => [...prev, { id: Date.now(), name: '', dosage: '', duration: '', instructions: '' }]);

  const removeMedicineRow = (id: number) =>
    setMedicines((prev) => prev.filter((m) => m.id !== id));

  const updateMedicine = (id: number, field: keyof MedicineRow, value: string) =>
    setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[900px] space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Write Prescription</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create a new prescription for your patient</p>
        </div>

        {/* Patient selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Patient Information</h3>
          {selectedPatient ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-1">
                  {[
                    { l: 'Name', v: selectedPatient.name },
                    { l: 'Age', v: `${selectedPatient.age} years` },
                    { l: 'Gender', v: selectedPatient.gender },
                    { l: 'Weight', v: selectedPatient.weight },
                    { l: 'BP', v: selectedPatient.bp },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">{l}</p>
                      <p className="text-sm font-semibold text-gray-800">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setSelectedPatient(null); setShowSearch(true); }}
                className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Change
              </button>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patient by name…"
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {showSearch && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {filteredPatients.length === 0 ? (
                    <div className="p-4 text-sm text-gray-400 text-center">No patients found</div>
                  ) : filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPatient(p); setShowSearch(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">{p.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.age}y · {p.gender} · {p.weight} · BP: {p.bp}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chief Complaint + Diagnosis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">Chief Complaint</label>
            <textarea
              rows={4}
              placeholder="Patient's main complaint…"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">Diagnosis</label>
            <textarea
              rows={4}
              placeholder="Clinical diagnosis…"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Medicines table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">Medicines</h3>
            <button
              onClick={addMedicineRow}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase w-[35%]">Medicine Name</th>
                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase w-[18%]">Dosage</th>
                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase w-[18%]">Duration</th>
                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Instructions</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {medicines.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2.5">
                      <input
                        type="text" placeholder="Search medicine…"
                        value={m.name}
                        onChange={(e) => updateMedicine(m.id, 'name', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text" placeholder="1+0+1"
                        value={m.dosage}
                        onChange={(e) => updateMedicine(m.id, 'dosage', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text" placeholder="7 days"
                        value={m.duration}
                        onChange={(e) => updateMedicine(m.id, 'duration', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text" placeholder="After meal"
                        value={m.instructions}
                        onChange={(e) => updateMedicine(m.id, 'instructions', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      {medicines.length > 1 && (
                        <button onClick={() => removeMedicineRow(m.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advice + Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">Advice / Instructions</label>
            <textarea
              rows={3}
              placeholder="Lifestyle advice, dietary instructions…"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-bold text-gray-800 mb-2">Follow-up Date</label>
            <input
              type="date"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4" /> {preview ? 'Close Preview' : 'Preview'}
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            <Download className="w-4 h-4" /> Save & Generate PDF
          </button>
        </div>

        {/* Preview pane */}
        {preview && (
          <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-4 flex items-start justify-between">
              <div>
                <p className="text-lg font-black text-gray-900">Dr. Rahim Uddin</p>
                <p className="text-sm text-gray-500">MBBS, MD (Cardiology) · BMDC A-12345</p>
                <p className="text-xs text-gray-400 mt-1">Green Life Medical Centre, Dhanmondi, Dhaka</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Date: 1 July 2026</p>
                {followUp && <p>Follow-up: {followUp}</p>}
              </div>
            </div>
            {selectedPatient && (
              <div className="mb-4 text-sm text-gray-700">
                <span className="font-semibold">Patient:</span> {selectedPatient.name} · {selectedPatient.age}y · {selectedPatient.gender} · {selectedPatient.weight} · BP: {selectedPatient.bp}
              </div>
            )}
            {complaint && <div className="mb-2"><span className="text-xs font-bold text-gray-500 uppercase">Complaint:</span> <span className="text-sm text-gray-700">{complaint}</span></div>}
            {diagnosis && <div className="mb-3"><span className="text-xs font-bold text-gray-500 uppercase">Diagnosis:</span> <span className="text-sm font-semibold text-gray-900">{diagnosis}</span></div>}
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Rx:</p>
              <div className="space-y-2">
                {medicines.filter((m) => m.name).map((m, i) => (
                  <div key={m.id} className="flex gap-4 text-sm">
                    <span className="font-bold text-gray-800">{i + 1}. {m.name}</span>
                    {m.dosage && <span className="text-gray-600">{m.dosage}</span>}
                    {m.duration && <span className="text-gray-500">× {m.duration}</span>}
                    {m.instructions && <span className="text-gray-400 italic">{m.instructions}</span>}
                  </div>
                ))}
              </div>
            </div>
            {advice && <div><span className="text-xs font-bold text-gray-500 uppercase">Advice:</span> <span className="text-sm text-gray-700">{advice}</span></div>}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
