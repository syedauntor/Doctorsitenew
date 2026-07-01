import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, User, GraduationCap, FileText, CheckCircle, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import DobAgeInput, { type DobAgeValue, formatAgeLong } from '../components/DobAgeInput';

interface FormData {
  // Step 1: Personal
  fullName: string;
  dobAge: DobAgeValue;
  gender: string;
  phone: string;
  email: string;
  // Step 2: Professional
  specialization: string;
  bmdc: string;
  experience: string;
  degree: string;
  institution: string;
  // Step 3: Verification
  nid: string;
  photo: string;
  certificate: string;
}

const SPECIALIZATIONS = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic Surgeon', 'Pediatrician', 'Psychiatrist', 'Gynecologist',
  'Endocrinologist', 'Gastroenterologist', 'Ophthalmologist', 'ENT Specialist',
  'Urologist', 'Oncologist', 'Nephrologist', 'Pulmonologist',
];

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Professional', icon: GraduationCap },
  { id: 3, label: 'Verification', icon: FileText },
];

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, className, ...rest } = props;
  return (
    <input {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} ${className ?? ''}`} />
  );
}

const initialForm: FormData = {
  fullName: '', dobAge: { dob: '', ageManual: '' }, gender: 'M', phone: '', email: '',
  specialization: '', bmdc: '', experience: '', degree: '', institution: '',
  nid: '', photo: '', certificate: '',
};

export default function JoinAsDoctorPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateStep = (s: number): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.phone.trim() || form.phone.length < 11) e.phone = 'Valid phone number required';
      if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
      if (!form.dobAge.dob && !form.dobAge.ageManual) e.dobAge = 'Date of birth or age is required' as any;
    }
    if (s === 2) {
      if (!form.specialization) e.specialization = 'Specialization is required';
      if (!form.bmdc.trim()) e.bmdc = 'BMDC registration number is required';
      if (!form.experience.trim()) e.experience = 'Experience is required';
      if (!form.degree.trim()) e.degree = 'Degree is required';
    }
    if (s === 3) {
      if (!form.nid.trim()) e.nid = 'NID number is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const prev = () => setStep((s) => s - 1);
  const submit = () => { if (validateStep(3)) setSubmitted(true); };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 space-y-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Application Submitted!</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Thank you, <span className="font-semibold text-gray-800">{form.fullName}</span>. Your application is under review.
                We'll notify you at <span className="font-semibold text-blue-600">{form.email}</span> within 2–3 business days.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 text-left space-y-1">
              <p><span className="font-semibold">Specialization:</span> {form.specialization}</p>
              <p><span className="font-semibold">BMDC:</span> {form.bmdc}</p>
              {(form.dobAge.dob || form.dobAge.ageManual) && (
                <p><span className="font-semibold">Age:</span> {form.dobAge.dob ? formatAgeLong(form.dobAge.dob) : `${form.dobAge.ageManual} years (approx.)`}</p>
              )}
            </div>
            <button onClick={() => navigate('/')}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join as Doctor</h1>
          <p className="text-gray-500 mt-2">Fill out the form below to apply for a doctor account</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${active ? 'bg-blue-600 text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.id}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Full Name" required error={errors.fullName}>
                    <Input value={form.fullName} placeholder="Dr. Firstname Lastname" error={errors.fullName}
                      onChange={(e) => set('fullName', e.target.value)} />
                  </Field>
                </div>
                <Field label="Phone Number" required error={errors.phone}>
                  <Input value={form.phone} placeholder="017XXXXXXXX" error={errors.phone}
                    onChange={(e) => set('phone', e.target.value)} />
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <Input type="email" value={form.email} placeholder="doctor@email.com" error={errors.email}
                    onChange={(e) => set('email', e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <DobAgeInput
                    value={form.dobAge}
                    onChange={(v) => { setForm((f) => ({ ...f, dobAge: v })); setErrors((e) => ({ ...e, dobAge: undefined })); }}
                    required
                  />
                  {(errors as any).dobAge && <p className="text-xs text-red-500 mt-1">{(errors as any).dobAge}</p>}
                </div>
                <div>
                  <Field label="Gender" required>
                    <select value={form.gender} onChange={(e) => set('gender', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Professional Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Specialization" required error={errors.specialization}>
                    <select value={form.specialization} onChange={(e) => set('specialization', e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${errors.specialization ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="BMDC Registration No." required error={errors.bmdc}>
                  <Input value={form.bmdc} placeholder="A-XXXXX" error={errors.bmdc}
                    onChange={(e) => set('bmdc', e.target.value)} />
                </Field>
                <Field label="Years of Experience" required error={errors.experience}>
                  <Input type="number" min="0" max="60" value={form.experience} placeholder="10" error={errors.experience}
                    onChange={(e) => set('experience', e.target.value)} />
                </Field>
                <Field label="Highest Degree" required error={errors.degree}>
                  <Input value={form.degree} placeholder="MBBS, MD, FCPS…" error={errors.degree}
                    onChange={(e) => set('degree', e.target.value)} />
                </Field>
                <Field label="Institution" error={errors.institution}>
                  <Input value={form.institution} placeholder="University / Hospital"
                    onChange={(e) => set('institution', e.target.value)} />
                </Field>
              </div>
            </>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Identity Verification</h3>
              <div className="space-y-4">
                <Field label="National ID (NID) Number" required error={errors.nid}>
                  <Input value={form.nid} placeholder="10 or 17-digit NID" error={errors.nid}
                    onChange={(e) => set('nid', e.target.value)} />
                </Field>

                {[
                  { key: 'photo' as const, label: 'Profile Photo', hint: 'Passport-size professional photo (JPG/PNG)' },
                  { key: 'certificate' as const, label: 'Medical Certificate', hint: 'MBBS or highest degree certificate (PDF/JPG)' },
                ].map(({ key, label, hint }) => (
                  <Field key={key} label={label}>
                    <div className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${form[key] ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => set(key, form[key] ? '' : `${label} uploaded`)}>
                      {form[key] ? (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">{form[key]}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-600">Click to upload</p>
                          <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
                        </>
                      )}
                    </div>
                  </Field>
                ))}

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
                  All documents are reviewed confidentially. Your application will be approved within 2–3 business days after successful verification.
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={prev}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition">
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submit}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition shadow-sm shadow-green-100">
                <CheckCircle className="w-4 h-4" /> Submit Application
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}
