import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, FileText, Star, ArrowRight,
  Play, PenLine, BellOff, Eye, ChevronRight,
  Clock, CheckCircle, XCircle, Phone, Video,
  UserPlus, Bell, AlertCircle, TrendingUp, TrendingDown,
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

// Analytics data
const WEEK_CONFIRMED = [5, 8, 6, 9, 7, 10, 4];
const WEEK_COMPLETED = [4, 6, 5, 8, 6, 8, 3];
const WEEK_DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const DAILY_REVENUE_INPERSON = [3200, 4800, 2400, 5600, 4000, 6400, 3200, 4800, 5600, 4000, 6400, 5200, 3600, 4800, 5200, 4400, 6000, 4800, 5200, 4800, 6400, 5600, 4000, 5200, 4800, 3600, 4800, 5600, 4000, 4400];
const DAILY_REVENUE_ONLINE =   [1200, 1800, 800, 2400, 1600, 2000, 1200, 1800, 2000, 1600, 2400, 1600, 1200, 1800, 2000, 1600, 2000, 1600, 2000, 1800, 2400, 2000, 1600, 1800, 1600, 1200, 1800, 2000, 1600, 1600];

const RATING_BREAKDOWN = [
  { stars: 5, pct: 65, count: 203 },
  { stars: 4, pct: 25, count: 78 },
  { stars: 3, pct: 7,  count: 22 },
  { stars: 2, pct: 3,  count: 9 },
  { stars: 1, pct: 0,  count: 0 },
];

// ── Tiny SVG helpers ──────────────────────────────────────────────────────────

function WeekLineChart() {
  const W = 320; const H = 90; const padX = 24; const padY = 8;
  const maxVal = Math.max(...WEEK_CONFIRMED, ...WEEK_COMPLETED);
  const points = (data: number[]) =>
    data.map((v, i) => [
      padX + (i / (data.length - 1)) * (W - padX * 2),
      padY + (1 - v / maxVal) * (H - padY * 2),
    ] as [number, number]);

  const ptsC = points(WEEK_CONFIRMED);
  const ptsD = points(WEEK_COMPLETED);

  const lineD = (pts: [number, number][]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const areaD = (pts: [number, number][]) =>
    lineD(pts) + ` L${pts[pts.length - 1][0].toFixed(1)},${H - padY} L${pts[0][0].toFixed(1)},${H - padY} Z`;

  const [tooltip, setTooltip] = useState<{ x: number; y: number; conf: number; comp: number } | null>(null);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 90 }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((t) => {
          const y = padY + t * (H - padY * 2);
          return <line key={t} x1={padX} y1={y} x2={W - padX} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
        })}
        {/* Areas */}
        <path d={areaD(ptsC)} fill="url(#gradBlue)" />
        <path d={areaD(ptsD)} fill="url(#gradGreen)" />
        {/* Lines */}
        <path d={lineD(ptsC)} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={lineD(ptsD)} fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Hover targets + dots */}
        {WEEK_DAYS.map((_, i) => {
          const cx = ptsC[i][0]; const cy = ptsC[i][1];
          const dy = ptsD[i][1];
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3" fill="#2563EB" />
              <circle cx={cx} cy={dy} r="3" fill="#16A34A" />
              <rect
                x={cx - 12} y={0} width={24} height={H}
                fill="transparent" className="cursor-pointer"
                onMouseEnter={() => setTooltip({ x: cx, y: Math.min(cy, dy) - 12, conf: WEEK_CONFIRMED[i], comp: WEEK_COMPLETED[i] })}
              />
            </g>
          );
        })}
      </svg>
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute pointer-events-none bg-gray-900 text-white text-[10px] font-semibold rounded-lg px-2 py-1.5 shadow-xl whitespace-nowrap"
          style={{ left: Math.min(tooltip.x - 36, 210), top: Math.max(tooltip.y, 0), transform: 'translateY(-100%)' }}>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Confirmed: {tooltip.conf}</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Completed: {tooltip.comp}</div>
        </div>
      )}
      {/* X axis labels */}
      <div className="flex justify-between px-6 mt-1">
        {WEEK_DAYS.map((d) => <span key={d} className="text-[10px] text-gray-400 font-semibold">{d}</span>)}
      </div>
    </div>
  );
}

function DonutChart() {
  const total = 312; const newPct = 45; const followPct = 55;
  const cx = 60; const cy = 60; const r = 46; const ir = 28;
  const slices = [
    { pct: newPct, color: '#2563EB' },
    { pct: followPct, color: '#16A34A' },
  ];
  let cumulative = 0;
  const paths = slices.map(({ pct, color }) => {
    const angle = (pct / 100) * 360;
    const start = cumulative;
    cumulative += angle;
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((start + angle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad); const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);   const y2 = cy + r * Math.sin(endRad);
    const ix1 = cx + ir * Math.cos(startRad); const iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad);   const iy2 = cy + ir * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    return <path key={color} d={`M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large} 0 ${ix1},${iy1} Z`} fill={color} />;
  });
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="w-28 h-28">
          {paths}
          <text x={cx} y={cy - 5} textAnchor="middle" className="text-base" style={{ font: 'bold 16px sans-serif', fill: '#1e293b' }}>{total}</text>
          <text x={cx} y={cy + 11} textAnchor="middle" style={{ font: '10px sans-serif', fill: '#94a3b8' }}>patients</text>
        </svg>
      </div>
      <div className="space-y-3 min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
            <span className="text-xs font-semibold text-gray-600">New Patients</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">45%</span>
            <span className="text-xs text-gray-400">· {Math.round(total * 0.45)} pts</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
            <span className="text-xs font-semibold text-gray-600">Follow-up</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">55%</span>
            <span className="text-xs text-gray-400">· {Math.round(total * 0.55)} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ done, total, cancelled }: { done: number; total: number; cancelled: number }) {
  const remaining = total - done - cancelled;
  const pct = total > 0 ? done / total : 0;
  const r = 46; const cx = 60; const cy = 60;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);
  const estimatedFinish = '~2:30 PM';
  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2563EB" strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-gray-900">{done}/{total}</span>
          <span className="text-[10px] text-gray-400 font-semibold">done</span>
        </div>
      </div>
      <div className="space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs text-gray-600">Completed: <b className="text-gray-900">{done}</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          <span className="text-xs text-gray-600">Remaining: <b className="text-gray-900">{remaining}</b></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
          <span className="text-xs text-gray-600">Cancelled: <b className="text-gray-900">{cancelled}</b></span>
        </div>
        <div className="pt-1 border-t border-gray-100">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" /> Est. finish: <b className="text-gray-700">{estimatedFinish}</b>
          </span>
        </div>
      </div>
    </div>
  );
}

function RevenueBarChart() {
  const H = 80; const padX = 8; const padY = 6;
  const W = 380;
  const maxVal = Math.max(...DAILY_REVENUE_INPERSON.map((v, i) => v + DAILY_REVENUE_ONLINE[i]));
  const n = DAILY_REVENUE_INPERSON.length;
  const slotW = (W - padX * 2) / n;
  const barW = Math.max(slotW * 0.55, 4);
  const totalInperson = DAILY_REVENUE_INPERSON.reduce((a, b) => a + b, 0);
  const totalOnline = DAILY_REVENUE_ONLINE.reduce((a, b) => a + b, 0);
  const grand = totalInperson + totalOnline;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} onMouseLeave={() => setHoverIdx(null)}>
          {/* Grid */}
          {[0.33, 0.66, 1].map((t) => {
            const y = padY + (1 - t) * (H - padY * 2);
            return <line key={t} x1={padX} y1={y} x2={W - padX} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
          })}
          {DAILY_REVENUE_INPERSON.map((ip, i) => {
            const ol = DAILY_REVENUE_ONLINE[i];
            const ipH = ((ip / maxVal) * (H - padY * 2));
            const olH = ((ol / maxVal) * (H - padY * 2));
            const x = padX + i * slotW + (slotW - barW) / 2;
            const isHover = hoverIdx === i;
            return (
              <g key={i}
                onMouseEnter={() => setHoverIdx(i)}
                className="cursor-pointer"
              >
                {/* In-person bar */}
                <rect x={x} y={H - padY - ipH} width={barW} height={ipH}
                  rx="1.5"
                  fill={isHover ? '#1d4ed8' : '#2563EB'}
                  style={{ transition: 'fill 0.1s' }}
                />
                {/* Online bar stacked */}
                <rect x={x} y={H - padY - ipH - olH} width={barW} height={olH}
                  rx="1.5"
                  fill={isHover ? '#15803d' : '#16A34A'}
                  style={{ transition: 'fill 0.1s' }}
                />
              </g>
            );
          })}
        </svg>
        {/* Tooltip */}
        {hoverIdx !== null && (
          <div className="absolute pointer-events-none bg-gray-900 text-white text-[10px] font-semibold rounded-lg px-2 py-1.5 shadow-xl whitespace-nowrap z-10"
            style={{ left: Math.min(8 + hoverIdx * ((380 - 16) / 30), 300), top: '0px', transform: 'translateY(-110%)' }}>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-400 inline-block" /> ৳{(DAILY_REVENUE_INPERSON[hoverIdx] / 1000).toFixed(1)}k</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-green-400 inline-block" /> ৳{(DAILY_REVENUE_ONLINE[hoverIdx] / 1000).toFixed(1)}k</div>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mt-2">
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-blue-600 inline-block" /><span className="text-[10px] text-gray-500 font-semibold">In-person</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-green-600 inline-block" /><span className="text-[10px] text-gray-500 font-semibold">Online</span></div>
        </div>
        <span className="text-[10px] text-gray-400 font-semibold">Jul 1–30</span>
      </div>
      <div className="mt-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
        <p className="text-[11px] text-gray-400 font-medium">Payment integration coming soon</p>
      </div>
    </div>
  );
}

function RatingBar({ stars, pct, count }: { stars: number; pct: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-gray-500 w-3 shrink-0">{stars}</span>
      <Star className="w-3 h-3 text-yellow-400 shrink-0 fill-yellow-400" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 font-semibold w-5 text-right shrink-0">{pct}%</span>
      <span className="text-[10px] text-gray-300 w-8 text-right shrink-0">{count}</span>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
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

  const totalRevenue = DAILY_REVENUE_INPERSON.reduce((a, b) => a + b, 0) + DAILY_REVENUE_ONLINE.reduce((a, b) => a + b, 0);

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
          <button onClick={() => navigate('/doctor/queue')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm shadow-green-200">
            <Play className="w-4 h-4" /> Start Queue
          </button>
          <button onClick={() => navigate('/doctor/prescriptions/new')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            <PenLine className="w-4 h-4" /> Write Prescription
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition shadow-sm shadow-orange-100">
            <BellOff className="w-4 h-4" /> Set Unavailable
          </button>
          <button onClick={() => navigate('/doctors/dr-rahim-uddin')}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition">
            <Eye className="w-4 h-4" /> View Profile
          </button>
        </div>

        {/* ── ANALYTICS ROW 1 ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 — Appointments line chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-900">Appointments This Week</h3>
              <button onClick={() => navigate('/doctor/analytics')} className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition">Analytics</button>
            </div>
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-blue-600 inline-block" />
                <span className="text-[10px] text-gray-500 font-semibold">Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded bg-green-600 inline-block" />
                <span className="text-[10px] text-gray-500 font-semibold">Completed</span>
              </div>
            </div>
            <WeekLineChart />
            <div className="mt-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-bold text-green-600">+12% vs last week</span>
            </div>
          </div>

          {/* Card 2 — Patient type donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Patient Type</h3>
              <span className="text-xs text-gray-400 font-semibold">All time</span>
            </div>
            <DonutChart />
          </div>

          {/* Card 3 — Today's progress ring */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Today's Progress</h3>
              <span className="text-xs text-gray-400 font-semibold">1 Jul 2026</span>
            </div>
            <ProgressRing done={8} total={12} cancelled={1} />
          </div>
        </div>

        {/* ── ANALYTICS ROW 2 ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 4 — Revenue bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">This Month's Earnings</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-gray-900">৳{(totalRevenue / 1000).toFixed(1)}k</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <TrendingUp className="w-3.5 h-3.5" /> +8% vs last month
                  </span>
                </div>
              </div>
            </div>
            <RevenueBarChart />
          </div>

          {/* Card 5 — Rating overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Patient Ratings</h3>
              <button onClick={() => navigate('/doctor/settings')} className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition">View all</button>
            </div>
            <div className="flex items-start gap-6">
              {/* Big rating */}
              <div className="text-center shrink-0">
                <div className="text-4xl font-black text-gray-900">4.8</div>
                <div className="flex justify-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-300 fill-yellow-300'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 font-semibold">312 reviews</p>
              </div>
              {/* Breakdown bars */}
              <div className="flex-1 space-y-1.5">
                {RATING_BREAKDOWN.map((r) => (
                  <RatingBar key={r.stars} stars={r.stars} pct={r.pct} count={r.count} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's schedule + Queue */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Appointments */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Today's Appointments</h3>
              <button onClick={() => navigate('/doctor/appointments')} className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-800 transition">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-1 px-5 py-3 border-b border-gray-100">
              {['All', 'Pending', 'Confirmed', 'Completed'].map((f) => (
                <button key={f} onClick={() => setApptFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${apptFilter === f ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="divide-y divide-gray-50">
              {filteredAppts.map((apt) => (
                <div key={apt.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">{apt.serial}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.name}</p>
                        <p className="text-xs text-gray-400">{apt.age}y · {apt.gender === 'M' ? 'Male' : 'Female'} · {apt.visit}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${apt.type === 'Online' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                          {apt.type === 'Online' ? '🌐 Online' : '🏥 In-Person'}
                        </span>
                        <StatusBadge status={apt.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                      {apt.chamber && <span className="text-xs text-gray-400">{apt.chamber}</span>}
                    </div>
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {apt.status === 'Pending' && (
                        <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Confirm
                        </button>
                      )}
                      <button onClick={() => navigate('/doctor/prescriptions/new')} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Write Rx
                      </button>
                      {apt.type === 'Online' && (
                        <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition flex items-center gap-1">
                          <Video className="w-3 h-3" /> Start Call
                        </button>
                      )}
                      {apt.status !== 'Completed' && (
                        <button className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Mark Done</button>
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
                <button onClick={() => { const s: Array<'Active'|'Paused'|'Closed'> = ['Active','Paused','Closed']; setQueueStatus(s[(s.indexOf(queueStatus)+1)%3]); }}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition ${queueBtnClass}`}>{queueStatus}</button>
              </div>
              <div className="p-5 border-b border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Now Serving</p>
                <div className="text-5xl font-black text-blue-600 my-2">#{currentServing}</div>
                <p className="text-sm font-semibold text-gray-700">{QUEUE[currentServing - 1]?.name ?? '—'}</p>
                <p className="text-xs text-gray-400 mt-0.5">Next: {QUEUE[currentServing]?.name ?? 'No more'}</p>
              </div>
              <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 px-4 py-2">
                {QUEUE.map((q) => (
                  <div key={q.serial} className={`flex items-center justify-between py-2 ${q.status === 'current' ? 'text-blue-600' : q.status === 'done' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${q.status === 'current' ? 'bg-blue-100' : q.status === 'done' ? 'bg-gray-100' : 'bg-gray-50'}`}>{q.serial}</span>
                      <span className="text-xs font-medium">{q.name}</span>
                    </div>
                    {q.status === 'current' && <span className="text-[10px] text-blue-600 font-bold">Serving</span>}
                    {q.status === 'done' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>Total: <b className="text-gray-800">15</b></span>
                  <span>Done: <b className="text-green-600">8</b></span>
                  <span>Left: <b className="text-orange-500">7</b></span>
                </div>
                <button onClick={callNext} className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Next
                </button>
                <button className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition">Skip</button>
              </div>
            </div>

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
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Recent Patients</h3>
              <div className="relative">
                <input type="text" placeholder="Search patients…" className="text-xs border border-gray-200 rounded-lg pl-3 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 w-36" />
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">4</span>
            </div>
            <div className="divide-y divide-gray-50">
              {NOTIFICATIONS.map((n, i) => {
                const colorMap: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', red: 'bg-red-50 text-red-600' };
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
