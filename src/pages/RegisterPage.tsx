import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, Eye, EyeOff, User, Phone, ClipboardList, Clock, CheckCircle } from 'lucide-react';
import { doctors } from '../data/doctors';

const ROLES = [
  { id: 'patient', label: 'Patient', icon: User, desc: 'Book appointments, view prescriptions' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, desc: 'Manage patients, write prescriptions' },
  { id: 'ps', label: 'PS / Secretary', icon: ClipboardList, desc: 'Register patients, manage queue' },
] as const;

type Role = typeof ROLES[number]['id'];

const VALID_DOCTOR_IDS = doctors.map((d) => d.doctorId);

function getDoctorByDocId(id: string) {
  return doctors.find((d) => d.doctorId === id.toUpperCase());
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('patient');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // PS-specific
  const [doctorIdInput, setDoctorIdInput] = useState('');
  const [doctorIdError, setDoctorIdError] = useState('');
  const [psSubmitted, setPsSubmitted] = useState(false);
  const [linkedDoctor, setLinkedDoctor] = useState<(typeof doctors)[0] | null>(null);

  const [error, setError] = useState('');

  const validateDoctorId = (val: string) => {
    const doc = getDoctorByDocId(val.trim());
    if (!val.trim()) { setDoctorIdError('Doctor ID is required'); return false; }
    if (!doc) { setDoctorIdError('No doctor found with this ID. Ask your doctor for their Doctor ID.'); return false; }
    setDoctorIdError('');
    setLinkedDoctor(doc);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) { setError('Please fill in all fields.'); return; }
    if (role !== 'patient' && password !== confirmPw) { setError('Passwords do not match.'); return; }

    if (role === 'ps') {
      if (!validateDoctorId(doctorIdInput)) return;
      setPsSubmitted(true);
      return;
    }
    if (role === 'doctor') navigate('/join-as-doctor');
    else navigate('/doctor/dashboard');
  };

  // PS success screen
  if (psSubmitted && linkedDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center space-y-5">
            <Link to="/" className="flex items-center gap-2.5 justify-center mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Emergent<span className="text-blue-600">Health</span></span>
            </Link>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Registration Submitted!</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Your request has been sent to <span className="font-bold text-gray-800">{linkedDoctor.name}</span>.
                </p>
                <p className="text-sm text-gray-500 mt-1">You can log in after the doctor approves your request.</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-3 text-left">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Pending Approval</p>
                  <p className="text-xs text-amber-700 mt-0.5">The doctor will review your request and approve or reject it. You will be notified via email.</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl px-4 py-3 text-left space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Registration Details</p>
                <p className="text-sm font-semibold text-gray-800">{name}</p>
                <p className="text-xs text-gray-500">{email} · {phone}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Stethoscope className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-mono font-bold text-blue-700">{doctorIdInput.toUpperCase()}</span>
                  <span className="text-xs text-gray-500">→ {linkedDoctor.name}</span>
                </div>
              </div>

              <Link to="/login" className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-sm text-center">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPs = role === 'ps';
  const isDoctor = role === 'doctor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Emergent<span className="text-blue-600">Health</span></span>
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
              <p className="text-sm text-gray-500 mt-1">Join EmergentHealth today</p>
            </div>

            {/* Role selector */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">I am a</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ id, label, icon: Icon, desc }) => (
                  <button key={id} type="button" onClick={() => { setRole(id); setError(''); }}
                    className={`p-3 rounded-xl border-2 text-left transition ${role === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className={`w-4 h-4 mb-1.5 ${role === id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className={`text-xs font-bold ${role === id ? 'text-blue-700' : 'text-gray-700'}`}>{label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {isDoctor && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 font-medium">
                Doctor registration requires BMDC verification. Clicking "Continue" will take you to the full doctor registration form.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {(isPs) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPw}
                      onChange={(e) => { setConfirmPw(e.target.value); setError(''); }}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* PS Doctor ID field */}
              {isPs && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Doctor ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={doctorIdInput}
                      onChange={(e) => {
                        setDoctorIdInput(e.target.value.toUpperCase());
                        setDoctorIdError('');
                        const doc = getDoctorByDocId(e.target.value);
                        setLinkedDoctor(doc ?? null);
                      }}
                      placeholder="DOC-26-XXXXX"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${doctorIdError ? 'border-red-300 bg-red-50' : linkedDoctor ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                    />
                    {linkedDoctor && (
                      <CheckCircle className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                  {doctorIdError && <p className="text-[11px] text-red-500 mt-1">{doctorIdError}</p>}
                  {linkedDoctor && (
                    <p className="text-[11px] text-green-700 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Found: {linkedDoctor.name} ({linkedDoctor.specialty})
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1.5">Ask your doctor for their Doctor ID (format: DOC-26-XXXXX)</p>
                  <p className="text-[11px] text-blue-600 mt-0.5 font-medium">Try: DOC-26-00001 through DOC-26-00012</p>
                </div>
              )}

              <button type="submit"
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200 text-sm">
                {isDoctor ? 'Continue to Doctor Registration' : isPs ? 'Register as PS Member' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
