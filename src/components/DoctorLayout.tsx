import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Radio, FileText,
  MessageSquare, Star, BarChart2, Settings, Building2,
  CreditCard, LogOut, Menu, X, Stethoscope, ChevronDown,
  BadgeCheck, UserCog,
} from 'lucide-react';

const DOCTOR_ID = 'DOC-26-00001';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/doctor/dashboard' },
  { icon: Calendar, label: 'Appointments', to: '/doctor/appointments' },
  { icon: Users, label: 'My Patients', to: '/doctor/patients' },
  { icon: Radio, label: 'Live Queue', to: '/doctor/queue' },
  { icon: FileText, label: 'Prescriptions', to: '/doctor/prescriptions/new' },
  { icon: UserCog, label: 'My Team', to: '/doctor/team', badge: 2 },
  { icon: MessageSquare, label: 'Q&A', to: '/doctor/qa' },
  { icon: Star, label: 'Reviews', to: '/doctor/reviews' },
  { icon: BarChart2, label: 'Analytics', to: '/doctor/analytics' },
  { icon: Settings, label: 'Profile Settings', to: '/doctor/settings' },
  { icon: Building2, label: 'Chamber Settings', to: '/doctor/chambers' },
  { icon: CreditCard, label: 'Earnings', to: '/doctor/earnings', soon: true },
];

const MOBILE_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/doctor/dashboard' },
  { icon: Calendar, label: 'Appointments', to: '/doctor/appointments' },
  { icon: Radio, label: 'Queue', to: '/doctor/queue' },
  { icon: FileText, label: 'Prescriptions', to: '/doctor/prescriptions/new' },
  { icon: Settings, label: 'Settings', to: '/doctor/settings' },
];

interface Props {
  children: React.ReactNode;
}

export default function DoctorLayout({ children }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [online, setOnline] = useState(true);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              Emergent<span className="text-blue-600">Health</span>
            </span>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor profile */}
        <div className="px-5 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Doctor"
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
              />
              <span className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${online ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-sm font-bold text-gray-900 truncate">Dr. Rahim Uddin</p>
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>
              <p className="text-xs text-gray-500 truncate">Cardiologist</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full font-mono tracking-wide">
                  <Stethoscope className="w-2.5 h-2.5" />
                  {DOCTOR_ID}
                </span>
              </div>
              <button
                onClick={() => setOnline(!online)}
                className={`mt-1 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full transition ${
                  online ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
                {online ? 'Online' : 'Offline'}
              </button>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {NAV_ITEMS.map(({ icon: Icon, label, to, soon, badge }) => {
            const active = pathname === to || (to !== '/doctor/dashboard' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={soon ? '#' : to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${soon ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </div>
                {soon && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded-full">Soon</span>
                )}
                {badge && !soon && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>{badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5 pt-3 border-t border-gray-100 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-gray-800 hidden sm:block">Doctor Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Queue Active
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150"
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex">
        {MOBILE_NAV.map(({ icon: Icon, label, to }) => {
          const active = pathname === to || (to !== '/doctor/dashboard' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-[10px] font-semibold transition ${
                active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
