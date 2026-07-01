import { Stethoscope, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  'Quick Links': ['Find Doctors', 'Search Medicines', 'MCQ Practice', 'Q&A Forum'],
  'For Doctors': ['Join as Doctor', 'Doctor Dashboard', 'Manage Schedule', 'Patient Records'],
  'Support': ['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us'],
};

const footerHrefs: Record<string, string> = {
  'Join as Doctor': '/join-as-doctor',
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Emergent<span className="text-blue-400">Health</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Bangladesh's trusted medical platform. Find doctors, book appointments, and access quality healthcare from anywhere.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 shrink-0 text-blue-400" />
                Dhaka, Bangladesh
              </div>
              <div className="flex items-center gap-2.5 text-gray-400">
                <Phone className="w-4 h-4 shrink-0 text-blue-400" />
                +880 1700-000000
              </div>
              <div className="flex items-center gap-2.5 text-gray-400">
                <Mail className="w-4 h-4 shrink-0 text-blue-400" />
                support@emergenthealth.com.bd
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    {footerHrefs[link] ? (
                      <Link
                        to={footerHrefs[link]}
                        className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150"
                      >
                        {link}
                      </Link>
                    ) : (
                      <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-150">
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EmergentHealth. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-150"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
