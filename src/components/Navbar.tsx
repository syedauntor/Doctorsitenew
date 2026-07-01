import { useState } from 'react';
import { Menu, X, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Doctors', to: '/doctors' },
  { label: 'Medicines', to: '/medicines' },
  { label: 'MCQ', to: '/#mcq' },
  { label: 'Q&A', to: '/#qa' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 leading-none">
              Emergent<span className="text-blue-600">Health</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/join-as-doctor"
              className="px-3.5 py-2 text-sm font-semibold text-green-700 border border-green-500 rounded-lg hover:bg-green-50 transition-colors duration-150 whitespace-nowrap"
            >
              Join as Doctor
            </Link>
            <a
              href="#login"
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-150"
            >
              Login
            </a>
            <a
              href="#register"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-150"
            >
              Register
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2">
            <Link
              to="/join-as-doctor"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2.5 text-sm font-semibold text-green-700 border border-green-500 rounded-lg hover:bg-green-50 transition-colors"
            >
              Join as Doctor
            </Link>
            <a
              href="#login"
              className="block text-center px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </a>
            <a
              href="#register"
              className="block text-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
