import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Check, ArrowRight, Phone } from 'lucide-react';
import PSLayout from '../../components/PSLayout';
import DobAgeInput, { type DobAgeValue, formatAgeShort, formatAgePrescription, getAgeYears } from '../../components/DobAgeInput';
import { getNextPatientId } from '../../data/patients';

export default function PSRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '',
    dobAge: { dob: '', ageManual: '' } as DobAgeValue,
    gender: 'M', bloodGroup: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || form.phone.length < 11) e.phone = 'Valid phone number required';
    if (!form.dobAge.dob && !form.dobAge.ageManual) e.age = 'Date of birth or age is required';
    if (form.dobAge.ageManual && (Number(form.dobAge.ageManual) < 1 || Number(form.dobAge.ageManual) > 120)) e.age = 'Valid age required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const id = getNextPatientId();
    setGeneratedId(id);
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ name: '', phone: '', dobAge: { dob: '', ageManual: '' }, gender: 'M', bloodGroup: '' });
    setSubmitted(false);
    setGeneratedId('');
    setErrors({});
  };

  const ageDisplay = formatAgeShort(form.dobAge);
  const ageFull = formatAgePrescription(form.dobAge);
  const ageYears = getAgeYears(form.dobAge);

  const tf = (key: 'name' | 'phone' | 'bloodGroup', label: string, props: Partial<React.InputHTMLAttributes<HTMLInputElement>> = {}) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}{props.required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input {...props} value={form[key]} onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })); }}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${errors[key] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`} />
      {errors[key] && <p className="text-[11px] text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  if (submitted) {
    return (
      <PSLayout>
        <div className="p-5 max-w-lg">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-800 mb-1">Patient Registered!</p>
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-lg mt-1">
                {generatedId}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-left space-y-1">
              <p className="text-sm font-semibold text-gray-800">{form.name}</p>
              <p className="text-xs text-gray-500">{ageFull || `${ageYears}y`} · {form.gender === 'M' ? 'Male' : 'Female'}{form.bloodGroup ? ` · ${form.bloodGroup}` : ''}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{form.phone}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => navigate('/ps/queue')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition">
                <ArrowRight className="w-4 h-4" /> Add to Queue
              </button>
              <button onClick={reset}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                Register Another
              </button>
            </div>
          </div>
        </div>
      </PSLayout>
    );
  }

  return (
    <PSLayout>
      <div className="p-5 max-w-lg space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Register New Patient</h2>
          <p className="text-sm text-gray-500 mt-0.5">A Patient ID (PI-YY-NNNNN) will be auto-generated</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          {tf('name', 'Full Name', { required: true, placeholder: 'Patient full name' })}
          {tf('phone', 'Phone Number', { required: true, placeholder: '017XXXXXXXX' })}
          {errors.phone && <p className="text-[11px] text-red-500 -mt-3">{errors.phone}</p>}

          {/* DOB / Age */}
          <div>
            <DobAgeInput
              value={form.dobAge}
              onChange={(v) => { setForm((f) => ({ ...f, dobAge: v })); setErrors((e) => ({ ...e, age: '' })); }}
              required
            />
            {errors.age && <p className="text-[11px] text-red-500 mt-1">{errors.age}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
              <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none">
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
            {tf('bloodGroup', 'Blood Group', { placeholder: 'O+, A+… (optional)' })}
          </div>

          {/* Preview */}
          {(form.dobAge.dob || form.dobAge.ageManual) && ageDisplay && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-blue-700 font-semibold">
              Age will appear as: <b>{ageDisplay}</b>
              {form.dobAge.dob && <span className="ml-2 text-blue-500 font-normal">(full: {ageFull})</span>}
            </div>
          )}

          <div className="bg-teal-50 border border-teal-100 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-600 shrink-0" />
            <p className="text-xs text-teal-700 font-medium">Patient ID will be auto-generated: <span className="font-black">PI-26-XXXXX</span></p>
          </div>

          <button type="submit"
            className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition shadow-sm shadow-teal-200 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> Register Patient
          </button>
        </form>
      </div>
    </PSLayout>
  );
}
