import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, RefreshCw, Bell, BellOff, Phone, MessageSquare,
  Users, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight,
  Wifi,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { doctors } from '../data/doctors';

type QueueStatus = 'active' | 'paused' | 'closed';
type TokenStatus = 'waiting' | 'in-progress' | 'done' | 'cancelled';

interface QueueToken {
  serial: number;
  initial: string;
  status: TokenStatus;
  estimatedTime: string;
}

function generateQueue(serving: number, total: number): QueueToken[] {
  const names = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  return Array.from({ length: total }, (_, i) => {
    const serial = i + 1;
    const status: TokenStatus =
      serial < serving ? 'done' :
      serial === serving ? 'in-progress' :
      serial > serving + 12 ? 'cancelled' : 'waiting';
    const waitMins = Math.max(0, (serial - serving) * 7);
    return {
      serial,
      initial: names[i % names.length] + '**',
      status,
      estimatedTime: status === 'done' ? '—' : status === 'in-progress' ? 'Now' : `~${waitMins} min`,
    };
  });
}

const STATUS_BADGE: Record<QueueStatus, { label: string; cls: string }> = {
  active:  { label: 'Active',  cls: 'bg-green-100 text-green-700 border-green-200' },
  paused:  { label: 'Paused',  cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  closed:  { label: 'Closed',  cls: 'bg-red-100 text-red-600 border-red-200' },
};

const TOKEN_STATUS: Record<TokenStatus, { label: string; cls: string; dot: string }> = {
  'waiting':     { label: 'Waiting',     cls: 'text-gray-500',  dot: 'bg-gray-300' },
  'in-progress': { label: 'In Progress', cls: 'text-blue-600 font-semibold', dot: 'bg-blue-500' },
  'done':        { label: 'Done',        cls: 'text-gray-400',  dot: 'bg-gray-200' },
  'cancelled':   { label: 'Cancelled',   cls: 'text-red-400',   dot: 'bg-red-300' },
};

function CircularProgress({ value, max, size = 96 }: { value: number; max: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const fill = max > 0 ? (value / max) * circ : 0;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#22c55e" strokeWidth={8}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

export default function LiveQueuePage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  const doctor = doctors.find(
    (d) => String(d.id) === doctorId || d.profile?.slug === doctorId
  );

  const TOTAL_TOKENS = 45;
  const COMPLETED_BASE = 20;
  const MY_SERIAL = 25;
  const QUEUE_STATUS: QueueStatus = 'active';

  const [currentlyServing, setCurrentlyServing] = useState(COMPLETED_BASE);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [browserNotif, setBrowserNotif] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const completed = currentlyServing;
  const remaining = TOTAL_TOKENS - completed;
  const myPosition = Math.max(0, MY_SERIAL - currentlyServing);
  const estimatedWait = myPosition * 7;

  const tokens = generateQueue(currentlyServing, TOTAL_TOKENS);

  const doRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      doRefresh();
      setCurrentlyServing((n) => Math.min(n + 1, TOTAL_TOKENS));
    }, 30_000);
    return () => clearInterval(interval);
  }, [doRefresh]);

  const requestBrowserNotif = () => {
    if (!('Notification' in window)) return;
    Notification.requestPermission().then((p) => {
      if (p === 'granted') setBrowserNotif(true);
    });
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-700">Doctor not found</h2>
            <Link to="/doctors" className="mt-4 inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to doctors
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-BD', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const badge = STATUS_BADGE[QUEUE_STATUS];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-[800px] mx-auto space-y-5">

          {/* ── Back link ── */}
          <Link
            to={`/doctors/${doctor.profile?.slug ?? doctor.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctor Profile
          </Link>

          {/* ── Doctor Info Bar ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-xl object-cover object-top shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-[17px] font-bold text-gray-900">{doctor.name}</h1>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.cls}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-blue-600 text-sm font-semibold">{doctor.specialty}</p>
              <p className="text-gray-400 text-xs mt-0.5 truncate">{doctor.chamber}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400">Today</p>
              <p className="text-xs font-semibold text-gray-700">{today}</p>
            </div>
          </div>

          {/* ── Currently Serving + Your Position ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Currently Serving */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Currently Serving</p>
              <div className="relative flex items-center justify-center">
                <span className="text-[72px] font-black text-blue-600 leading-none animate-pulse tabular-nums">
                  {String(currentlyServing).padStart(2, '0')}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
                </span>
                Queue is live
              </div>
            </div>

            {/* Your Position */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Token</p>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <CircularProgress value={completed} max={TOTAL_TOKENS} size={96} />
                <span className="absolute text-[28px] font-black text-green-600 leading-none tabular-nums">
                  {MY_SERIAL}
                </span>
              </div>
              {myPosition > 0 ? (
                <>
                  <p className="mt-3 text-sm font-bold text-gray-800">You are <span className="text-green-600">#{myPosition}</span> in queue</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> ~{estimatedWait} minutes estimated wait
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm font-bold text-blue-600">Your turn is now!</p>
              )}
            </div>
          </div>

          {/* ── Progress Bar ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Queue Progress</h2>
              <span className="text-xs text-gray-400">Total tokens: {TOTAL_TOKENS}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                style={{ width: `${(completed / TOTAL_TOKENS) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {completed} completed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-orange-500 font-semibold">
                <Users className="w-3.5 h-3.5" />
                {remaining} remaining
              </div>
            </div>
          </div>

          {/* ── Queue List ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Queue List</h2>
              <span className="text-xs text-gray-400">{tokens.filter(t => t.status === 'waiting' || t.status === 'in-progress').length} active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Token</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Est. Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 max-h-80">
                  {tokens.slice(Math.max(0, currentlyServing - 3), currentlyServing + 10).map((token) => {
                    const isMe = token.serial === MY_SERIAL;
                    const isCurrent = token.serial === currentlyServing;
                    const s = TOKEN_STATUS[token.status];
                    return (
                      <tr
                        key={token.serial}
                        className={`transition-colors ${
                          isCurrent ? 'bg-blue-50 border-l-2 border-blue-500' :
                          isMe ? 'bg-green-50 border-l-2 border-green-500' :
                          'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                              isCurrent ? 'bg-blue-600 text-white' :
                              isMe ? 'bg-green-600 text-white' :
                              token.status === 'done' ? 'bg-gray-100 text-gray-400' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {token.serial}
                            </span>
                            {isMe && (
                              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-sm">{token.initial}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            <span className={`text-xs ${s.cls}`}>{s.label}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right text-xs font-semibold ${
                          token.status === 'in-progress' ? 'text-blue-600' :
                          token.status === 'done' ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {token.estimatedTime}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Auto Refresh Notice ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Auto-refresh every 30 seconds</p>
                <p className="text-xs text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
            <button
              onClick={doRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing…' : 'Refresh Now'}
            </button>
          </div>

          {/* ── Notification Opt-in ── */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 rounded-2xl border border-blue-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-sm font-bold text-blue-900">Get notified when your turn is near</h2>
            </div>
            <div className="space-y-3">
              {/* SMS toggle */}
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-blue-100">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">SMS Notification</p>
                    <p className="text-xs text-gray-400">Alert when 3 tokens ahead</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsEnabled((v) => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${smsEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${smsEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Browser notification */}
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-blue-100">
                <div className="flex items-center gap-3">
                  {browserNotif ? <Bell className="w-4 h-4 text-green-500" /> : <BellOff className="w-4 h-4 text-gray-400" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Browser Notification</p>
                    <p className="text-xs text-gray-400">Push alert in this browser</p>
                  </div>
                </div>
                <button
                  onClick={browserNotif ? () => setBrowserNotif(false) : requestBrowserNotif}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    browserNotif
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {browserNotif ? 'Enabled' : 'Enable'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Bottom Actions ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-700 mb-1">Actions</h2>

            {/* Contact chamber */}
            <a
              href={`tel:${doctor.profile?.chamberPhone ?? ''}`}
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Contact Chamber</p>
                  <p className="text-xs text-gray-400">{doctor.profile?.chamberPhone ?? doctor.chamber}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </a>

            {/* Back to profile */}
            <Link
              to={`/doctors/${doctor.profile?.slug ?? doctor.id}`}
              className="flex items-center justify-between w-full px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-gray-800">Back to Doctor Profile</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </Link>

            {/* Cancel appointment */}
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancel Appointment
              </button>
            ) : (
              <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
                <p className="text-sm font-semibold text-red-700 mb-3 text-center">Are you sure you want to cancel?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-white transition-colors"
                  >
                    Keep Appointment
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Spacer for footer */}
          <div className="h-2" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
