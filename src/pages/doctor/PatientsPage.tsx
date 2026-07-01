import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Users, X, FileText, Eye,
  Download, StickyNote, Save, Clock, Plus,
  Printer, ChevronDown, ChevronUp, Activity,
  Pill, AlertCircle, Stethoscope, BarChart2,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceArea, ReferenceLine, Legend,
} from 'recharts';
import DoctorLayout from '../../components/DoctorLayout';
import { PATIENTS, type PatientData } from '../../data/patients';

// ── Helpers ──────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{children}</p>;
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'orange' | 'gray' }) {
  const map = { blue: 'bg-blue-50 text-blue-700 border-blue-200', red: 'bg-red-50 text-red-700 border-red-200', green: 'bg-green-50 text-green-700 border-green-200', orange: 'bg-orange-50 text-orange-700 border-orange-200', gray: 'bg-gray-100 text-gray-600 border-gray-200' };
  return <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${map[color]}`}>{children}</span>;
}

// ── Vitals Chart ─────────────────────────────────────────────────────────────

interface ChartDef {
  key: string; title: string; unit: string;
  lines: { key: string; name: string; color: string }[];
  zones?: { y1: number; y2: number; color: string; label: string }[];
  danger?: number; low?: number; high?: number;
}

const CHART_DEFS: ChartDef[] = [
  { key: 'bp', title: 'Blood Pressure', unit: 'mmHg', lines: [{ key: 'systolic', name: 'Systolic', color: '#2563EB' }, { key: 'diastolic', name: 'Diastolic', color: '#16A34A' }], zones: [{ y1: 90, y2: 120, color: '#d1fae5', label: 'Normal' }], danger: 140 },
  { key: 'sugar', title: 'Blood Sugar (FBS)', unit: 'mmol/L', lines: [{ key: 'value', name: 'Blood Sugar', color: '#2563EB' }], zones: [{ y1: 4.0, y2: 5.6, color: '#d1fae5', label: 'Normal' }, { y1: 5.6, y2: 7.0, color: '#fef9c3', label: 'Pre-DM' }], danger: 7.0 },
  { key: 'weight', title: 'Weight', unit: 'kg', lines: [{ key: 'value', name: 'Weight', color: '#7c3aed' }] },
  { key: 'hemoglobin', title: 'Hemoglobin', unit: 'g/dL', lines: [{ key: 'value', name: 'Hemoglobin', color: '#dc2626' }], zones: [{ y1: 12, y2: 17, color: '#d1fae5', label: 'Normal' }], low: 12 },
  { key: 'creatinine', title: 'Creatinine', unit: 'mg/dL', lines: [{ key: 'value', name: 'Creatinine', color: '#ea580c' }], zones: [{ y1: 0.7, y2: 1.3, color: '#d1fae5', label: 'Normal' }], high: 1.3 },
  { key: 'hba1c', title: 'HbA1c', unit: '%', lines: [{ key: 'value', name: 'HbA1c', color: '#9333ea' }], zones: [{ y1: 0, y2: 5.7, color: '#d1fae5', label: 'Normal' }, { y1: 5.7, y2: 6.5, color: '#fef9c3', label: 'Pre-DM' }], danger: 6.5 },
  { key: 'pulse', title: 'Pulse Rate', unit: 'bpm', lines: [{ key: 'value', name: 'Pulse', color: '#e11d48' }], zones: [{ y1: 60, y2: 100, color: '#d1fae5', label: 'Normal' }], low: 60, high: 100 },
];

function VitalChart({ chartDef, patient }: { chartDef: ChartDef; patient: PatientData }) {
  const vitals = patient.vitals as Record<string, unknown>;
  let data: Record<string, number | string>[] = [];

  if (chartDef.key === 'bp') {
    const bpData = vitals.bp as { systolic: { date: string; value: number }[]; diastolic: { date: string; value: number }[] };
    data = bpData.systolic.map((s, i) => ({ date: s.date, systolic: s.value, diastolic: bpData.diastolic[i]?.value ?? 0 }));
  } else {
    const raw = vitals[chartDef.key] as { date: string; value: number }[];
    data = raw.map((r) => ({ date: r.date, value: r.value }));
  }

  if (data.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center">
        <BarChart2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
        <p className="text-xs text-gray-400 font-semibold">No data for {chartDef.title}</p>
        <p className="text-[10px] text-gray-300 mt-1">Add a lab result to see the graph</p>
      </div>
    );
  }

  if (data.length === 1) {
    const val = chartDef.key === 'bp'
      ? `${data[0].systolic}/${data[0].diastolic} mmHg`
      : `${data[0].value} ${chartDef.unit}`;
    return (
      <div className="border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
        <Activity className="w-8 h-8 text-blue-400 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-gray-500">{chartDef.title} (single reading)</p>
          <p className="text-xl font-black text-gray-900">{val}</p>
          <p className="text-[10px] text-gray-400">{data[0].date as string}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold text-gray-700 mb-2">{chartDef.title} <span className="text-gray-400 font-normal">({chartDef.unit})</span></p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 11 }} />
          {chartDef.zones?.map((z) => (
            <ReferenceArea key={z.label} y1={z.y1} y2={z.y2} fill={z.color} fillOpacity={0.4} />
          ))}
          {chartDef.danger && <ReferenceLine y={chartDef.danger} stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'High', position: 'right', fontSize: 9, fill: '#ef4444' }} />}
          {chartDef.lines.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2.5} dot={{ r: 3, fill: l.color }} activeDot={{ r: 5 }} />
          ))}
          {chartDef.lines.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ patient }: { patient: PatientData }) {
  const [conditions, setConditions] = useState(patient.knownConditions);
  const [newCond, setNewCond] = useState('');
  const [notes, setNotes] = useState(patient.notes);
  const [notesSaved, setNotesSaved] = useState(false);

  return (
    <div className="space-y-5">
      {/* Chief complaints */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Recurring Complaints</p>
        {patient.visits.length === 0 ? (
          <p className="text-xs text-gray-400">No visit history</p>
        ) : (
          <div className="space-y-1">
            {patient.visits.slice(0, 4).map((v) => (
              <div key={v.id} className="flex items-start gap-2">
                <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{v.date}</span>
                <span className={`text-xs ${['Headache', 'Polyuria', 'Chest pain', 'Palpitation'].some((c) => v.complaint.toLowerCase().includes(c.toLowerCase())) ? 'font-semibold text-orange-600' : 'text-gray-600'}`}>{v.complaint}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Known conditions */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Known Conditions</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {conditions.length === 0 && <span className="text-xs text-gray-400">None recorded</span>}
          {conditions.map((c) => <Badge key={c} color="blue">{c}</Badge>)}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newCond} onChange={(e) => setNewCond(e.target.value)}
            placeholder="Add condition…"
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={() => { if (newCond.trim()) { setConditions([...conditions, newCond.trim()]); setNewCond(''); }}}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> Known Allergies</p>
        <div className="flex flex-wrap gap-1.5">
          {patient.allergies.length === 0 && <span className="text-xs text-gray-400">None recorded — NKDA</span>}
          {patient.allergies.map((a) => <Badge key={a} color="red">{a}</Badge>)}
        </div>
      </div>

      {/* Current meds */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1"><Pill className="w-3 h-3 text-blue-500" /> Current Medications</p>
        {patient.currentMeds.length === 0 ? (
          <p className="text-xs text-gray-400">No ongoing medications</p>
        ) : (
          <div className="space-y-1">
            {patient.currentMeds.map((m) => (
              <div key={m} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-xs text-gray-700">{m}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1"><StickyNote className="w-3 h-3" /> Private Notes — only you can see</p>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private notes…"
          className="w-full px-3.5 py-2.5 rounded-xl border border-yellow-200 bg-yellow-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <div className="flex items-center justify-between mt-1.5">
          <button onClick={() => { patient.notes = notes; setNotesSaved(true); setTimeout(() => setNotesSaved(false), 2000); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition">
            <Save className="w-3 h-3" /> Save
          </button>
          {notesSaved && <span className="text-xs text-green-600 font-semibold">Saved!</span>}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Vitals & Labs ────────────────────────────────────────────────────────

function VitalsTab({ patient }: { patient: PatientData }) {
  const [visible, setVisible] = useState<string[]>(CHART_DEFS.map((c) => c.key));
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ metric: 'sugar', value: '', date: '', lab: '' });

  const toggle = (key: string) => setVisible((v) => v.includes(key) ? v.filter((k) => k !== key) : [...v, key]);

  const bmi = patient.vitals.weight.length > 0 && patient.vitals.height
    ? (patient.vitals.weight[patient.vitals.weight.length - 1].value / ((patient.vitals.height / 100) ** 2)).toFixed(1)
    : null;
  const bmiStatus = bmi ? (Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Overweight' : 'Obese') : null;
  const bmiColor = bmiStatus === 'Normal' ? 'green' : bmiStatus === 'Overweight' ? 'orange' : 'red';

  return (
    <div className="space-y-4">
      {/* BMI */}
      {bmi && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 flex items-center gap-3">
          <Activity className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-semibold text-blue-700">BMI: <b>{bmi} kg/m²</b></span>
          <Badge color={bmiColor as 'green' | 'orange' | 'red'}>{bmiStatus}</Badge>
        </div>
      )}

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-1.5">
        {CHART_DEFS.map((c) => (
          <button key={c.key} onClick={() => toggle(c.key)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${visible.includes(c.key) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {c.title}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-4">
        {CHART_DEFS.filter((c) => visible.includes(c.key)).map((c) => (
          <div key={c.key} className="bg-gray-50 rounded-2xl p-4">
            <VitalChart chartDef={c} patient={patient} />
          </div>
        ))}
      </div>

      {/* Add manual result */}
      <button onClick={() => setAddOpen(!addOpen)}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition mt-1">
        <Plus className="w-3.5 h-3.5" /> Add Manual Lab Result
      </button>
      {addOpen && (
        <div className="border border-blue-200 bg-blue-50 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Metric</label>
              <select value={addForm.metric} onChange={(e) => setAddForm((f) => ({ ...f, metric: e.target.value }))}
                className="w-full text-xs border border-blue-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                {CHART_DEFS.map((c) => <option key={c.key} value={c.key}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Value ({CHART_DEFS.find((c) => c.key === addForm.metric)?.unit})</label>
              <input type="number" value={addForm.value} onChange={(e) => setAddForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full text-xs border border-blue-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Date</label>
              <input type="date" value={addForm.date} onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full text-xs border border-blue-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Lab Name (optional)</label>
              <input type="text" value={addForm.lab} onChange={(e) => setAddForm((f) => ({ ...f, lab: e.target.value }))}
                placeholder="e.g. Popular Lab"
                className="w-full text-xs border border-blue-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={() => setAddOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">
            Save Result
          </button>
        </div>
      )}
    </div>
  );
}

// ── Tab: Visits ───────────────────────────────────────────────────────────────

function VisitsTab({ patient }: { patient: PatientData }) {
  const [expanded, setExpanded] = useState<number | null>(patient.visits[0]?.id ?? null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{patient.visits.length} visits (newest first)</span>
        <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition">
          <Plus className="w-3 h-3" /> Add Visit Entry
        </button>
      </div>
      {patient.visits.map((v) => (
        <div key={v.id} className="border border-gray-200 rounded-2xl overflow-hidden">
          {/* Collapsed header */}
          <button
            onClick={() => setExpanded(expanded === v.id ? null : v.id)}
            className="w-full flex items-start justify-between gap-3 px-4 py-3.5 hover:bg-gray-50 transition text-left"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-bold text-gray-800">{v.date}</span>
                <span className="text-[10px] text-gray-400">· {v.doctor}</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{v.diagnosis}</p>
              <p className="text-xs text-gray-500 mt-0.5">{v.complaint}</p>
            </div>
            {expanded === v.id ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />}
          </button>

          {/* Expanded */}
          {expanded === v.id && (
            <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
              {v.fullComplaint && (
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Chief Complaint</p><p className="text-sm text-gray-700">{v.fullComplaint}</p></div>
              )}
              {v.history && (
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">History / Risk Factors</p><p className="text-sm text-gray-700">{v.history}</p></div>
              )}
              {(v.bp || v.pulse || v.temp || v.weight || v.spo2) && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">On Examination</p>
                  <div className="flex flex-wrap gap-3">
                    {v.bp && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>BP:</b> {v.bp} mmHg</span>}
                    {v.pulse && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>Pulse:</b> {v.pulse} bpm</span>}
                    {v.temp && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>Temp:</b> {v.temp}°F</span>}
                    {v.weight && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>Wt:</b> {v.weight} kg</span>}
                    {v.spo2 && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>SpO2:</b> {v.spo2}%</span>}
                    {v.edema !== undefined && <span className="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5"><b>Edema:</b> {v.edema ? 'Yes' : 'Absent'}</span>}
                  </div>
                </div>
              )}
              {v.investigations && v.investigations.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Investigations</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {v.investigations.map((inv) => <Badge key={inv} color="gray">{inv}</Badge>)}
                  </div>
                  {v.investigationResults && v.investigationResults.length > 0 && (
                    <div className="space-y-1">
                      {v.investigationResults.map((r) => (
                        <div key={r.name} className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-600">{r.name}:</span>
                          <span className="text-gray-800 font-bold">{r.value} {r.unit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {v.secondaryDiagnosis && (
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Secondary Diagnosis</p><p className="text-sm text-gray-700">{v.secondaryDiagnosis}</p></div>
              )}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                {v.rxCount > 0 && (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                    <FileText className="w-3 h-3" /> {v.rxCount} medicines · View Full Rx
                  </span>
                )}
                {v.followUp && <span className="flex items-center gap-1 text-gray-500"><Clock className="w-3 h-3" /> Follow-up: {v.followUp}</span>}
              </div>
              {v.advice && (
                <div><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Advice</p><p className="text-sm text-gray-600">{v.advice}</p></div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Prescriptions ────────────────────────────────────────────────────────

function PrescriptionsTab({ patient }: { patient: PatientData }) {
  return (
    <div className="space-y-3">
      {patient.visits.filter((v) => v.rxCount > 0).length === 0 ? (
        <div className="text-center py-10 text-xs text-gray-400">No prescriptions written for this patient</div>
      ) : (
        patient.visits.filter((v) => v.rxCount > 0).map((v) => (
          <div key={v.id} className="border border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-bold text-gray-900">{v.date}</p>
              <p className="text-xs text-gray-500 mt-0.5">{v.doctor}</p>
              <p className="text-xs text-gray-600 mt-0.5">{v.diagnosis}</p>
              <p className="text-xs text-gray-400 mt-0.5">{v.rxCount} medicines</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl hover:bg-blue-100 transition"><Eye className="w-3.5 h-3.5" /> View</button>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"><Printer className="w-3.5 h-3.5" /> Print</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-200 transition"><Download className="w-3.5 h-3.5" /> PDF</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────────────

function PatientDrawer({ patient, onClose, onRx }: { patient: PatientData; onClose: () => void; onRx: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'visits' | 'rx'>('overview');

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Stethoscope },
    { id: 'vitals',   label: 'Vitals & Labs', icon: Activity },
    { id: 'visits',   label: 'Visits', icon: ClipboardList },
    { id: 'rx',       label: 'Prescriptions', icon: FileText },
  ] as const;

  const lastBP = patient.vitals.bp.systolic.at(-1);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-50 flex flex-col"
        style={{ animation: 'slideInRight 0.25s ease-out' }}>
        {/* Header */}
        <div className="bg-blue-600 px-5 py-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${patient.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                {patient.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-white">{patient.name}</span>
                  <span className="text-xs font-black bg-white text-blue-600 px-2.5 py-0.5 rounded-full">{patient.patientId}</span>
                </div>
                <p className="text-sm text-blue-200 mt-0.5">{patient.age}y · {patient.gender === 'M' ? 'Male' : 'Female'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-blue-200 hover:bg-blue-500 hover:text-white transition"><X className="w-5 h-5" /></button>
          </div>
          {/* Quick info row */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-bold bg-blue-500 text-white px-2.5 py-1 rounded-full">{patient.bloodGroup}</span>
            <span className="text-xs font-semibold bg-blue-500 text-white px-2.5 py-1 rounded-full">{patient.regType}</span>
            {patient.allergies.length > 0 && (
              <span className="text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {patient.allergies.length} Allergy</span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 border-b border-gray-100 shrink-0">
          {[
            { label: 'Visits', value: patient.totalVisits },
            { label: 'First Visit', value: patient.firstVisit.split(' ').slice(0, 2).join(' ') },
            { label: 'Last Visit', value: patient.lastVisit.split(' ').slice(0, 2).join(' ') },
            { label: 'Last BP', value: lastBP ? `${lastBP.value}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-3 border-r border-gray-100 last:border-0">
              <p className="text-sm font-black text-gray-900">{value}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-bold whitespace-nowrap transition shrink-0 border-b-2 ${activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'overview' && <OverviewTab patient={patient} />}
          {activeTab === 'vitals' && <VitalsTab patient={patient} />}
          {activeTab === 'visits' && <VisitsTab patient={patient} />}
          {activeTab === 'rx' && <PrescriptionsTab patient={patient} />}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-2">
          <button onClick={onRx} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
            <FileText className="w-4 h-4" /> Write Prescription
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">Close</button>
        </div>
      </div>
    </>
  );
}

// needed for drawer tab types
import { ClipboardList } from 'lucide-react';

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<PatientData | null>(null);

  const filtered = PATIENTS.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.patientId.toLowerCase().includes(q);
    const matchFilter =
      filter === 'All' ? true :
      filter === 'New' ? p.totalVisits === 1 :
      filter === 'Regular' ? p.totalVisits >= 5 :
      filter === 'This Month' ? p.lastVisit.includes('Jun 2026') || p.lastVisit.includes('Jul 2026') : true;
    return matchSearch && matchFilter;
  });

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1100px] space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Patients</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and view patient records</p>
          </div>
          <span className="text-xs font-black px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{PATIENTS.length}</span>
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, phone, or Patient ID…" value={search} onChange={(e) => setSearch(e.target.value)}
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
              {PATIENTS.length === 0 ? 'Your patients will appear here after the first appointment' : 'Try adjusting your search or filter'}
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
                  {filtered.map((p, i) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3.5 text-xs font-bold text-gray-400">{i + 1}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${p.gender === 'F' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{p.patientId}</span>
                              <span className="text-xs text-gray-400">{p.age}y · {p.gender === 'M' ? 'Male' : 'Female'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-gray-500 hidden sm:table-cell font-mono">{p.phone}</td>
                      <td className="px-3 py-3.5 text-xs text-gray-600 hidden md:table-cell">{p.lastVisit}</td>
                      <td className="px-3 py-3.5 hidden lg:table-cell text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.totalVisits >= 5 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.totalVisits}</span>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-gray-500 hidden xl:table-cell max-w-[160px] truncate">{p.lastDiagnosis}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(p)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                            <Eye className="w-3 h-3" /> History
                          </button>
                          <button onClick={() => navigate('/doctor/prescriptions/new')}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
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
      </div>

      {selected && (
        <PatientDrawer patient={selected} onClose={() => setSelected(null)} onRx={() => navigate('/doctor/prescriptions/new')} />
      )}

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </DoctorLayout>
  );
}
