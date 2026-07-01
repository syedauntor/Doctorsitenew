import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ClipboardList, Calendar, Printer,
  UserPlus, LogOut, ChevronRight, Menu, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'search',       label: 'Patient Search',   icon: Search,        path: '/ps/dashboard' },
  { id: 'queue',        label: "Today's Queue",     icon: ClipboardList, path: '/ps/queue' },
  { id: 'appointments', label: 'Appointments',      icon: Calendar,      path: '/ps/appointments' },
  { id: 'prescriptions',label: 'Prescriptions',     icon: Printer,       path: '/ps/prescriptions' },
  { id: 'register',     label: 'Register Patient',  icon: UserPlus,      path: '/ps/register' },
];

export default function PSLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-teal-700">
      {/* Header */}
      <div className="px-5 py-5 border-b border-teal-600">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">PS</span>
          </div>
          <span className="text-white font-black text-base tracking-tight">PS Portal</span>
        </div>
        <div className="bg-teal-800/60 rounded-xl px-3 py-2.5">
          <p className="text-[10px] text-teal-300 font-semibold uppercase tracking-wide">Managing</p>
          <p className="text-sm font-bold text-white mt-0.5">Dr. Rahim Uddin</p>
          <p className="text-xs text-teal-300 mt-0.5">Dhanmondi Chamber</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => {
          const active = pathname === path || (id === 'search' && pathname === '/ps/dashboard');
          return (
            <button key={id} onClick={() => { navigate(path); setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${active ? 'bg-white text-teal-700 shadow-sm' : 'text-teal-100 hover:bg-teal-600'}`}>
              <div className="flex items-center gap-2.5"><Icon className="w-4 h-4 shrink-0" />{label}</div>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </nav>

      {/* PS profile + logout */}
      <div className="px-4 py-4 border-t border-teal-600">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">RK</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Ratan Kumar</p>
            <p className="text-xs text-teal-300">Patient Secretary</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-teal-200 hover:bg-teal-600 text-xs font-semibold transition">
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 shrink-0 flex-col shadow-xl">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 left-0 w-64 h-full z-50 md:hidden shadow-2xl">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-teal-700 px-4 py-3 shadow-sm">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-lg text-white hover:bg-teal-600 transition">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white">PS Portal</span>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
