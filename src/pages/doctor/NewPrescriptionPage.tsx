import { useState } from 'react';
import { Plus, Trash2, Eye, Download, Search, Save, ChevronDown, X } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';
import { PATIENTS } from '../../data/patients';
import { formatAgeLong, formatAgeShort } from '../../components/DobAgeInput';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicineRow { id: number; name: string; dosage: string; duration: string; instructions: string }
interface Complaint { id: number; text: string; duration: string; unit: string }
interface TestResult { name: string; value: string; unit: string }

const QUICK_FOLLOWUP = [
  { label: '7 days', days: 7 }, { label: '14 days', days: 14 },
  { label: '1 month', days: 30 }, { label: '3 months', days: 90 },
];

const RISK_FACTORS = ['DM', 'HTN', 'IHD', 'CKD', 'Asthma', 'Thyroid', 'Smoking', 'Obesity'];

function addDays(days: number): string {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition text-left">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function FieldLabel({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-xs font-bold text-gray-600">{children}</label>
      {note && <p className="text-[10px] text-gray-400">{note}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input {...rest} className={`w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${className ?? ''}`} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewPrescriptionPage() {
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<typeof PATIENTS[0] | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [preview, setPreview] = useState(false);

  // Vitals
  const [bpSys, setBpSys] = useState('');
  const [bpDia, setBpDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [temp, setTemp] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [spo2, setSpo2] = useState('');
  const [sugar, setSugar] = useState('');
  const [sugarType, setSugarType] = useState('F');
  const [edema, setEdema] = useState(false);
  const [anaemia, setAnaemia] = useState(false);

  // Complaints
  const [complaints, setComplaints] = useState<Complaint[]>([{ id: 1, text: '', duration: '', unit: 'days' }]);
  const addComplaint = () => setComplaints((c) => [...c, { id: Date.now(), text: '', duration: '', unit: 'days' }]);
  const updateComplaint = (id: number, f: Partial<Complaint>) => setComplaints((c) => c.map((x) => x.id === id ? { ...x, ...f } : x));
  const removeComplaint = (id: number) => setComplaints((c) => c.filter((x) => x.id !== id));

  // History
  const [knownConditions, setKnownConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const toggleRF = (rf: string) => setRiskFactors((r) => r.includes(rf) ? r.filter((x) => x !== rf) : [...r, rf]);

  // Examination
  const [generalCondition, setGeneralCondition] = useState<'Good' | 'Fair' | 'Poor'>('Good');
  const [examFindings, setExamFindings] = useState('');

  // Investigations
  const [tests, setTests] = useState<string[]>([]);
  const [newTest, setNewTest] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const addTest = () => { if (newTest.trim()) { setTests((t) => [...t, newTest.trim()]); setNewTest(''); } };
  const addTestResult = () => setTestResults((r) => [...r, { name: '', value: '', unit: '' }]);
  const updateResult = (i: number, f: Partial<TestResult>) => setTestResults((r) => r.map((x, idx) => idx === i ? { ...x, ...f } : x));

  // Diagnosis
  const [primaryDx, setPrimaryDx] = useState('');
  const [secondaryDx, setSecondaryDx] = useState('');
  const [icdCode, setIcdCode] = useState('');

  // Medicines
  const [medicines, setMedicines] = useState<MedicineRow[]>([{ id: 1, name: '', dosage: '', duration: '', instructions: '' }]);
  const addMed = () => setMedicines((m) => [...m, { id: Date.now(), name: '', dosage: '', duration: '', instructions: '' }]);
  const removeMed = (id: number) => setMedicines((m) => m.filter((x) => x.id !== id));
  const updateMed = (id: number, f: keyof MedicineRow, v: string) => setMedicines((m) => m.map((x) => x.id === id ? { ...x, [f]: v } : x));

  // Advice
  const [advice, setAdvice] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const addInstruction = () => { if (newInstruction.trim()) { setInstructions((i) => [...i, newInstruction.trim()]); setNewInstruction(''); } };

  // Follow-up
  const [followUp, setFollowUp] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');

  const filteredPatients = PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.patientId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[900px] space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Write Prescription</h2>
          <p className="text-sm text-gray-500 mt-0.5">Complete patient visit record</p>
        </div>

        {/* Patient selection */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Patient</h3>
          {selectedPatient ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${selectedPatient.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selectedPatient.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">{selectedPatient.name}</span>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedPatient.patientId}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedPatient.dob ? formatAgeLong(selectedPatient.dob) : `${selectedPatient.age}y (approx)`}
                    {' · '}{selectedPatient.gender === 'M' ? 'Male' : 'Female'} · {selectedPatient.bloodGroup}
                  </p>
                  {selectedPatient.knownConditions.length > 0 && (
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">{selectedPatient.knownConditions.join(' · ')}</p>
                  )}
                </div>
              </div>
              <button onClick={() => { setSelectedPatient(null); setShowSearch(true); }} className="text-xs text-blue-600 font-semibold hover:text-blue-800">Change</button>
            </div>
          ) : (
            <div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search patient by name or Patient ID…" value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {showSearch && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-52 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="p-4 text-sm text-gray-400 text-center">No patients found</div>
                  ) : filteredPatients.map((p) => (
                    <button key={p.id} onClick={() => { setSelectedPatient(p); setShowSearch(false); setWeight(p.vitals.weight.at(-1)?.value.toString() ?? ''); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${p.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>{p.name[0]}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{p.patientId}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {p.dob ? formatAgeShort({ dob: p.dob, ageManual: '' }) : `${p.age}y (approx)`}
                          {' · '}{p.gender === 'M' ? 'Male' : 'Female'} · {p.bloodGroup}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* S1: Vitals */}
        <Section title="Section 1 — Patient Vitals (This Visit)">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <FieldLabel>Blood Pressure (mmHg)</FieldLabel>
              <div className="flex gap-2">
                <Input placeholder="Systolic" value={bpSys} onChange={(e) => setBpSys(e.target.value)} type="number" />
                <span className="text-gray-400 self-center">/</span>
                <Input placeholder="Diastolic" value={bpDia} onChange={(e) => setBpDia(e.target.value)} type="number" />
              </div>
            </div>
            <div><FieldLabel>Pulse (bpm)</FieldLabel><Input type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="80" /></div>
            <div><FieldLabel>Temp (°F)</FieldLabel><Input type="number" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="98.6" step="0.1" /></div>
            <div><FieldLabel>Weight (kg)</FieldLabel><Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" /></div>
            <div><FieldLabel note={!selectedPatient || selectedPatient.totalVisits > 1 ? 'First visit only' : undefined}>Height (cm)</FieldLabel>
              <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="165" />
            </div>
            <div><FieldLabel>SpO2 (%)</FieldLabel><Input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="98" /></div>
            <div>
              <FieldLabel>Blood Sugar (mmol/L)</FieldLabel>
              <div className="flex gap-2">
                <Input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)} placeholder="5.4" step="0.1" />
                <select value={sugarType} onChange={(e) => setSugarType(e.target.value)} className="border border-gray-200 rounded-xl px-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shrink-0">
                  <option value="F">F</option><option value="R">R</option><option value="PP">PP</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-6 mt-3">
            {[{ label: 'Edema', val: edema, set: () => setEdema(!edema) }, { label: 'Anaemia', val: anaemia, set: () => setAnaemia(!anaemia) }].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                <button type="button" onClick={set}
                  className={`w-10 h-5 rounded-full transition-colors ${val ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${val ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm font-semibold text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* S2: Chief Complaint */}
        <Section title="Section 2 — Chief Complaint">
          <div className="space-y-3">
            {selectedPatient && selectedPatient.visits.length > 0 && (
              <div className="bg-gray-50 rounded-xl px-3.5 py-2.5 mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Last Visit Complaint (reference)</p>
                <p className="text-xs text-gray-500 italic">{selectedPatient.visits[0].complaint}</p>
              </div>
            )}
            {complaints.map((c, i) => (
              <div key={c.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input placeholder={`Complaint ${i + 1}…`} value={c.text} onChange={(e) => updateComplaint(c.id, { text: e.target.value })} />
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Duration" value={c.duration} onChange={(e) => updateComplaint(c.id, { duration: e.target.value })} className="w-24" />
                    <select value={c.unit} onChange={(e) => updateComplaint(c.id, { unit: e.target.value })} className="border border-gray-200 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                      <option>days</option><option>weeks</option><option>months</option>
                    </select>
                  </div>
                </div>
                {complaints.length > 1 && (
                  <button onClick={() => removeComplaint(c.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition mt-1"><X className="w-3.5 h-3.5" /></button>
                )}
              </div>
            ))}
            <button onClick={addComplaint} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition">
              <Plus className="w-3.5 h-3.5" /> Add another complaint
            </button>
          </div>
        </Section>

        {/* S3: History */}
        <Section title="Section 3 — History">
          <div className="space-y-4">
            <div>
              <FieldLabel>Known Conditions</FieldLabel>
              {selectedPatient && selectedPatient.knownConditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedPatient.knownConditions.map((c) => (
                    <span key={c} className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">{c}</span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {knownConditions.map((c) => (
                  <span key={c} className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">{c}
                    <button onClick={() => setKnownConditions((kc) => kc.filter((x) => x !== c))} className="ml-1 opacity-60 hover:opacity-100"><X className="w-2.5 h-2.5 inline" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add condition…" value={newCondition} onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && newCondition.trim()) { setKnownConditions((kc) => [...kc, newCondition.trim()]); setNewCondition(''); } }} />
                <button onClick={() => { if (newCondition.trim()) { setKnownConditions((kc) => [...kc, newCondition.trim()]); setNewCondition(''); }}}
                  className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">Add</button>
              </div>
            </div>
            <div>
              <FieldLabel>Risk Factors</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {RISK_FACTORS.map((rf) => (
                  <label key={rf} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input type="checkbox" checked={riskFactors.includes(rf)} onChange={() => toggleRF(rf)} className="w-3.5 h-3.5 accent-blue-600 rounded" />
                    <span className="text-xs font-semibold text-gray-700">{rf}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* S4: Examination */}
        <Section title="Section 4 — On Examination">
          <div className="space-y-3">
            <div>
              <FieldLabel>General Condition</FieldLabel>
              <div className="flex gap-2">
                {(['Good', 'Fair', 'Poor'] as const).map((g) => (
                  <button key={g} type="button" onClick={() => setGeneralCondition(g)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${generalCondition === g ? g === 'Good' ? 'bg-green-600 border-green-600 text-white' : g === 'Fair' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            {(bpSys || pulse || temp || weight || spo2) && (
              <div className="bg-gray-50 rounded-xl px-3.5 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Auto-filled from vitals</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  {bpSys && bpDia && <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>BP:</b> {bpSys}/{bpDia} mmHg</span>}
                  {pulse && <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>Pulse:</b> {pulse} bpm</span>}
                  {temp && <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>Temp:</b> {temp}°F</span>}
                  {weight && <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>Wt:</b> {weight} kg</span>}
                  {spo2 && <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>SpO2:</b> {spo2}%</span>}
                  <span className="bg-white border border-gray-200 px-2 py-1 rounded-lg"><b>Edema:</b> {edema ? 'Present' : 'Absent'}</span>
                </div>
              </div>
            )}
            <div>
              <FieldLabel>Additional Findings</FieldLabel>
              <textarea rows={2} value={examFindings} onChange={(e) => setExamFindings(e.target.value)}
                placeholder="Any additional examination findings…"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </Section>

        {/* S5: Investigation */}
        <Section title="Section 5 — Investigations">
          <div className="space-y-3">
            <div>
              <FieldLabel>Tests Ordered</FieldLabel>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tests.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    {t}
                    <button onClick={() => setTests((ts) => ts.filter((x) => x !== t))} className="opacity-60 hover:opacity-100"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Test name (e.g. CBC, HbA1c)…" value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addTest(); }} />
                <button onClick={addTest} className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">Add</button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>Test Results (if available)</FieldLabel>
                <button onClick={addTestResult} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5 hover:text-blue-800"><Plus className="w-3 h-3" /> Add</button>
              </div>
              {testResults.map((r, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                  <Input placeholder="Test name" value={r.name} onChange={(e) => updateResult(i, { name: e.target.value })} />
                  <Input placeholder="Value" value={r.value} onChange={(e) => updateResult(i, { value: e.target.value })} />
                  <Input placeholder="Unit" value={r.unit} onChange={(e) => updateResult(i, { unit: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* S6: Diagnosis */}
        <Section title="Section 6 — Diagnosis">
          <div className="space-y-3">
            <div>
              <FieldLabel>Primary Diagnosis <span className="text-red-500">*</span></FieldLabel>
              <Input placeholder="Primary clinical diagnosis…" value={primaryDx} onChange={(e) => setPrimaryDx(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><FieldLabel>Secondary Diagnosis</FieldLabel><Input placeholder="Optional secondary diagnosis…" value={secondaryDx} onChange={(e) => setSecondaryDx(e.target.value)} /></div>
              <div><FieldLabel note="For advanced/referral use">ICD Code (optional)</FieldLabel><Input placeholder="e.g. I10 (Hypertension)" value={icdCode} onChange={(e) => setIcdCode(e.target.value)} /></div>
            </div>
          </div>
        </Section>

        {/* S7: Medicines */}
        <Section title="Section 7 — Medicines (Rx)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase">Medicine Name</th>
                  <th className="text-left px-2 py-3 text-xs font-bold text-gray-400 uppercase w-28">Dosage</th>
                  <th className="text-left px-2 py-3 text-xs font-bold text-gray-400 uppercase w-28">Duration</th>
                  <th className="text-left px-2 py-3 text-xs font-bold text-gray-400 uppercase">Instructions</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {medicines.map((m) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2"><Input placeholder="Medicine name…" value={m.name} onChange={(e) => updateMed(m.id, 'name', e.target.value)} /></td>
                    <td className="px-2 py-2"><Input placeholder="1+0+1" value={m.dosage} onChange={(e) => updateMed(m.id, 'dosage', e.target.value)} /></td>
                    <td className="px-2 py-2"><Input placeholder="7 days" value={m.duration} onChange={(e) => updateMed(m.id, 'duration', e.target.value)} /></td>
                    <td className="px-2 py-2"><Input placeholder="After meal" value={m.instructions} onChange={(e) => updateMed(m.id, 'instructions', e.target.value)} /></td>
                    <td className="px-2 py-2">{medicines.length > 1 && <button onClick={() => removeMed(m.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={addMed} className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition">
            <Plus className="w-3.5 h-3.5" /> Add Medicine
          </button>
        </Section>

        {/* S8: Advice */}
        <Section title="Section 8 — Advice & Instructions">
          <div className="space-y-3">
            <div>
              <FieldLabel>General Advice</FieldLabel>
              <textarea rows={3} value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Lifestyle, dietary, activity instructions…"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>Specific Instructions</FieldLabel>
              </div>
              <div className="space-y-1.5 mb-2">
                {instructions.map((ins, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-xs text-gray-700 flex-1">{ins}</span>
                    <button onClick={() => setInstructions((is) => is.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add specific instruction…" value={newInstruction} onChange={(e) => setNewInstruction(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addInstruction(); }} />
                <button onClick={addInstruction} className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition">Add</button>
              </div>
            </div>
          </div>
        </Section>

        {/* S9: Follow-up */}
        <Section title="Section 9 — Follow-up">
          <div className="space-y-3">
            <div>
              <FieldLabel>Follow-up Date</FieldLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {QUICK_FOLLOWUP.map(({ label, days }) => (
                  <button key={label} type="button" onClick={() => setFollowUp(addDays(days))}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition">
                    {label}
                  </button>
                ))}
                <button onClick={() => setFollowUp('')} className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-400 hover:border-gray-300 transition">Custom</button>
              </div>
              <Input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="max-w-xs" />
            </div>
            <div>
              <FieldLabel>Reason for Follow-up</FieldLabel>
              <Input placeholder="e.g. Review HbA1c, BP check…" value={followUpReason} onChange={(e) => setFollowUpReason(e.target.value)} />
            </div>
          </div>
        </Section>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition">
            <Eye className="w-4 h-4" /> {preview ? 'Close Preview' : 'Preview Prescription'}
          </button>
          <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            <Download className="w-4 h-4" /> Save & Generate PDF
          </button>
        </div>

        {/* Preview */}
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
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedPatient.patientId}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {selectedPatient.name} · {selectedPatient.dob ? formatAgeLong(selectedPatient.dob) : `${selectedPatient.age}y (approx.)`} · {selectedPatient.gender === 'M' ? 'Male' : 'Female'}
                </span>
                {bpSys && bpDia && <span className="text-xs text-gray-500">BP: {bpSys}/{bpDia}</span>}
                {pulse && <span className="text-xs text-gray-500">PR: {pulse}</span>}
                {weight && <span className="text-xs text-gray-500">Wt: {weight}kg</span>}
              </div>
            )}
            {complaints.filter((c) => c.text).length > 0 && (
              <div className="mb-2"><span className="text-xs font-bold text-gray-500 uppercase">Complaint(s):</span> <span className="text-sm text-gray-700">{complaints.filter((c) => c.text).map((c) => `${c.text}${c.duration ? ` (${c.duration} ${c.unit})` : ''}`).join(', ')}</span></div>
            )}
            {primaryDx && <div className="mb-3"><span className="text-xs font-bold text-gray-500 uppercase">Diagnosis:</span> <span className="text-sm font-bold text-gray-900">{primaryDx}{secondaryDx ? ` + ${secondaryDx}` : ''}</span></div>}
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
            {advice && <div className="mb-2"><span className="text-xs font-bold text-gray-500 uppercase">Advice:</span> <span className="text-sm text-gray-700">{advice}</span></div>}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
