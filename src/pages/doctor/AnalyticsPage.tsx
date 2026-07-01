import { useState } from 'react';
import { TrendingUp, Users, Star, Activity } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

// ── Inline SVG chart helpers ──────────────────────────────────────────────────

function LineChart({ data, color, height = 120 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 500;
  const h = height;
  const pad = 8;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / range) * (h - pad * 2),
  ]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const fill = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
    + ` L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#grad-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} />
      ))}
    </svg>
  );
}

function DonutChart({ slices }: { slices: { value: number; color: string; label: string }[] }) {
  const total = slices.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const cx = 60; const cy = 60; const r = 48; const ir = 30;

  const paths = slices.map(({ value, color }) => {
    const angle = (value / total) * 360;
    const start = cumulative;
    cumulative += angle;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((start + angle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const ix1 = cx + ir * Math.cos(startRad);
    const iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad);
    const iy2 = cy + ir * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    return { path: `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large} 0 ${ix1},${iy1} Z`, color };
  });

  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0">
      {paths.map((p, i) => (
        <path key={i} d={p.path} fill={p.color} />
      ))}
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DAILY_APPTS = [8, 12, 7, 15, 10, 14, 9, 11, 13, 6, 12, 16, 10, 8, 14];
const RATING_TREND = [4.2, 4.4, 4.3, 4.6, 4.5, 4.7, 4.8, 4.8, 4.7, 4.9, 4.8, 4.8, 4.9, 5.0, 4.8];
const DAYS_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];

const PATIENT_SLICES = [
  { value: 55, color: '#3b82f6', label: 'New Patients' },
  { value: 45, color: '#22c55e', label: 'Follow-up' },
];
const CHANNEL_SLICES = [
  { value: 65, color: '#8b5cf6', label: 'In-Person' },
  { value: 35, color: '#06b6d4', label: 'Online' },
];

const TOP_DIAGNOSES = [
  { name: 'Hypertension', count: 48 },
  { name: 'Type 2 Diabetes', count: 37 },
  { name: 'GERD', count: 29 },
  { name: 'Anxiety', count: 22 },
  { name: 'Ischemic Heart Disease', count: 18 },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');

  const total = DAILY_APPTS.reduce((a, b) => a + b, 0);
  const avg = (total / DAILY_APPTS.length).toFixed(1);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[1100px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-500 mt-0.5">Insights about your practice</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {['7d', '30d', '90d', '1y'].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${range === r ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Activity, label: 'Total Appointments', value: total, color: 'bg-blue-50 text-blue-600', sub: `Avg ${avg}/day` },
            { icon: Users, label: 'Total Patients', value: '1,250', color: 'bg-purple-50 text-purple-600', sub: '+48 this month' },
            { icon: Star, label: 'Avg. Rating', value: '4.8', color: 'bg-yellow-50 text-yellow-600', sub: 'Based on 312 reviews' },
            { icon: TrendingUp, label: 'Revenue (est.)', value: '৳1.2L', color: 'bg-green-50 text-green-600', sub: 'This period' },
          ].map(({ icon: Icon, label, value, color, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Line charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Appointments per Day</h3>
            <p className="text-xs text-gray-400 mb-4">Last 15 days</p>
            <LineChart data={DAILY_APPTS} color="#3b82f6" height={120} />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              {DAYS_LABELS.filter((_, i) => i % 3 === 0).map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Rating Trend</h3>
            <p className="text-xs text-gray-400 mb-4">Patient satisfaction over time</p>
            <LineChart data={RATING_TREND} color="#f59e0b" height={120} />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              {DAYS_LABELS.filter((_, i) => i % 3 === 0).map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
        </div>

        {/* Donut charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Patient type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Patient Types</h3>
            <div className="flex items-center gap-5">
              <DonutChart slices={PATIENT_SLICES} />
              <div className="space-y-3">
                {PATIENT_SLICES.map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{label}</p>
                      <p className="text-base font-black text-gray-900">{value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Consultation Channel</h3>
            <div className="flex items-center gap-5">
              <DonutChart slices={CHANNEL_SLICES} />
              <div className="space-y-3">
                {CHANNEL_SLICES.map(({ label, value, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{label}</p>
                      <p className="text-base font-black text-gray-900">{value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Insights</h3>
            <div className="space-y-3">
              {[
                { label: 'Busiest Day', value: 'Thursday' },
                { label: 'Avg. Consultation Time', value: '12 min' },
                { label: 'Repeat Visit Rate', value: '45%' },
                { label: 'No-show Rate', value: '6%' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-sm font-bold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top diagnoses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Most Common Diagnoses</h3>
          <div className="space-y-3">
            {TOP_DIAGNOSES.map(({ name, count }, i) => {
              const pct = (count / TOP_DIAGNOSES[0].count) * 100;
              return (
                <div key={name} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{i + 1}</span>
                  <span className="text-sm font-semibold text-gray-700 w-44 shrink-0">{name}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-600 w-6 shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
