import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, ChevronRight, ChevronLeft, Plus, X,
  Upload, User, Stethoscope, Building2, ClipboardCheck,
  BadgeCheck, Users, Calendar, FileText, Wifi,
  Phone, Mail, HeartPulse, Star, ArrowRight,
} from 'lucide-react';
import DobAgeInput, { type DobAgeValue, formatAgeLong } from '../components/DobAgeInput';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ─── Types ───────────────────────────────────────────────────────────────────

const SPECIALTIES = [
  'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist',
  'Neurologist', 'Orthopedic', 'Gynecologist', 'Eye Specialist',
  'Psychiatrist', 'Dentist', 'Others',
];

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface VisitingHour {
  day: string;
  active: boolean;
  from: string;
  to: string;
}

interface Chamber {
  name: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  newPatientFee: string;
  followUpFee: string;
  visitingHours: VisitingHour[];
}

interface OnlineConsultation {
  enabled: boolean;
  newPatientFee: string;
  followUpFee: string;
  availableSlots: string;
}

interface FormData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  profilePhotoPreview: string;
  gender: string;
  dob: string;
  dobAge: DobAgeValue;
  nid: string;
  // Step 2
  degree: string;
  additionalDegrees: string;
  specialty: string;
  bmdcNumber: string;
  bmdcCertificate: File | null;
  experience: string;
  hospital: string;
  concentrationTags: string[];
  bio: string;
  // Step 3
  chambers: Chamber[];
  onlineConsultation: OnlineConsultation;
}

function defaultChamber(): Chamber {
  return {
    name: '', address: '', area: '', city: '', phone: '',
    newPatientFee: '', followUpFee: '',
    visitingHours: DAYS.map((day, i) => ({
      day, active: i < 2, from: '10:00', to: '14:00',
    })),
  };
}

const initialForm: FormData = {
  fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  profilePhoto: null, profilePhotoPreview: '', gender: '', dob: '', dobAge: { dob: '', ageManual: '' }, nid: '',
  degree: '', additionalDegrees: '', specialty: '', bmdcNumber: '',
  bmdcCertificate: null, experience: '', hospital: '',
  concentrationTags: [], bio: '',
  chambers: [defaultChamber()],
  onlineConsultation: { enabled: false, newPatientFee: '', followUpFee: '', availableSlots: '' },
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${props.className ?? ''}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${props.className ?? ''}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none ${rest.className ?? ''}`}
    >
      {children}
    </select>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handlePhotoFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setForm({ ...form, profilePhoto: file, profilePhotoPreview: url });
  }, [form, setForm]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handlePhotoFile(file);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Full Name</FieldLabel>
          <Input
            type="text" placeholder="Dr. Rahim Uddin"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Email Address</FieldLabel>
          <Input
            type="email" placeholder="doctor@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Phone Number</FieldLabel>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">+880</span>
            <Input
              type="tel" placeholder="1XXXXXXXXX"
              className="pl-14"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div>
          <FieldLabel required>National ID Number</FieldLabel>
          <Input
            type="text" placeholder="17-digit NID"
            value={form.nid}
            onChange={(e) => setForm({ ...form, nid: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Password</FieldLabel>
          <Input
            type="password" placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Confirm Password</FieldLabel>
          <Input
            type="password" placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel required>Date of Birth / Age</FieldLabel>
          <DobAgeInput
            value={form.dobAge}
            onChange={(v) => setForm({ ...form, dobAge: v, dob: v.dob })}
            required
          />
        </div>
        <div>
          <FieldLabel required>Gender</FieldLabel>
          <div className="flex gap-4 mt-1">
            {['Male', 'Female'].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio" name="gender" value={g}
                  checked={form.gender === g}
                  onChange={() => setForm({ ...form, gender: g })}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">{g}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div>
        <FieldLabel>Profile Photo</FieldLabel>
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => photoInputRef.current?.click()}
        >
          <input
            ref={photoInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }}
          />
          {form.profilePhotoPreview ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={form.profilePhotoPreview} alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <p className="text-xs text-gray-500">{form.profilePhoto?.name}</p>
              <span className="text-xs text-blue-600 font-medium">Click to change</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-1">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-400">Upload a professional photo · JPG, PNG up to 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const certInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !form.concentrationTags.includes(val)) {
      setForm({ ...form, concentrationTags: [...form.concentrationTags, val] });
    }
    setTagInput('');
  };

  const removeTag = (tag: string) =>
    setForm({ ...form, concentrationTags: form.concentrationTags.filter((t) => t !== tag) });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Medical Degree</FieldLabel>
          <Input
            type="text" placeholder="MBBS, BDS…"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Additional Degrees</FieldLabel>
          <Input
            type="text" placeholder="MD, FCPS, MRCP…"
            value={form.additionalDegrees}
            onChange={(e) => setForm({ ...form, additionalDegrees: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Specialty</FieldLabel>
          <Select
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          >
            <option value="">Select specialty…</option>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel required>BMDC Registration Number</FieldLabel>
          <Input
            type="text" placeholder="A-12345"
            value={form.bmdcNumber}
            onChange={(e) => setForm({ ...form, bmdcNumber: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>Years of Experience</FieldLabel>
          <Input
            type="number" min="0" placeholder="e.g. 8"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Current Hospital / Institution</FieldLabel>
          <Input
            type="text" placeholder="Dhaka Medical College Hospital"
            value={form.hospital}
            onChange={(e) => setForm({ ...form, hospital: e.target.value })}
          />
        </div>
      </div>

      {/* BMDC Certificate upload */}
      <div>
        <FieldLabel required>BMDC Certificate</FieldLabel>
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-blue-300 hover:bg-gray-50 transition"
          onClick={() => certInputRef.current?.click()}
        >
          <input
            ref={certInputRef} type="file" accept=".pdf,image/*" className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setForm({ ...form, bmdcCertificate: f });
            }}
          />
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            {form.bmdcCertificate ? (
              <>
                <p className="text-sm font-semibold text-gray-800">{form.bmdcCertificate.name}</p>
                <p className="text-xs text-green-600">Uploaded · Click to change</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700">Upload your BMDC certificate</p>
                <p className="text-xs text-gray-400">PDF or Image · Max 10MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <FieldLabel>Fields of Concentration</FieldLabel>
        <div className="flex gap-2">
          <Input
            type="text" placeholder="Type and press Enter…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shrink-0"
          >
            Add
          </button>
        </div>
        {form.concentrationTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {form.concentrationTags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel>Short Bio</FieldLabel>
          <span className={`text-xs font-medium ${form.bio.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
            {form.bio.length}/500
          </span>
        </div>
        <Textarea
          rows={4}
          maxLength={500}
          placeholder="A brief introduction about your practice, expertise and patient approach…"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </div>
    </div>
  );
}

function ChamberForm({ chamber, onChange }: { chamber: Chamber; onChange: (c: Chamber) => void }) {
  const toggleDay = (i: number) => {
    const hours = [...chamber.visitingHours];
    hours[i] = { ...hours[i], active: !hours[i].active };
    onChange({ ...chamber, visitingHours: hours });
  };

  const updateHour = (i: number, field: 'from' | 'to', val: string) => {
    const hours = [...chamber.visitingHours];
    hours[i] = { ...hours[i], [field]: val };
    onChange({ ...chamber, visitingHours: hours });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <FieldLabel required>Chamber / Hospital Name</FieldLabel>
          <Input
            type="text" placeholder="Green Life Medical Centre"
            value={chamber.name}
            onChange={(e) => onChange({ ...chamber, name: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel required>Full Address</FieldLabel>
          <Textarea
            rows={2} placeholder="House 32, Road 7, Dhanmondi…"
            value={chamber.address}
            onChange={(e) => onChange({ ...chamber, address: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel>Area / Thana</FieldLabel>
          <Input
            type="text" placeholder="Dhanmondi"
            value={chamber.area}
            onChange={(e) => onChange({ ...chamber, area: e.target.value })}
          />
        </div>
        <div>
          <FieldLabel required>City</FieldLabel>
          <Select
            value={chamber.city}
            onChange={(e) => onChange({ ...chamber, city: e.target.value })}
          >
            <option value="">Select city…</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel>Chamber Phone</FieldLabel>
          <Input
            type="text" placeholder="02-XXXXXXXX"
            value={chamber.phone}
            onChange={(e) => onChange({ ...chamber, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Consultation fees */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Consultation Fees (৳)</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>New Patient</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
              <Input
                type="number" placeholder="800"
                className="pl-7"
                value={chamber.newPatientFee}
                onChange={(e) => onChange({ ...chamber, newPatientFee: e.target.value })}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Follow-up</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
              <Input
                type="number" placeholder="500"
                className="pl-7"
                value={chamber.followUpFee}
                onChange={(e) => onChange({ ...chamber, followUpFee: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visiting hours table */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Visiting Hours</p>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Day</th>
                <th className="text-center px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Active</th>
                <th className="text-left px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">From</th>
                <th className="text-left px-3 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wide">To</th>
              </tr>
            </thead>
            <tbody>
              {chamber.visitingHours.map((h, i) => (
                <tr key={h.day} className={`border-b border-gray-100 last:border-0 ${h.active ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-2.5">
                    <span className={`text-sm font-medium ${h.active ? 'text-gray-800' : 'text-gray-400'}`}>
                      {h.day.slice(0, 3)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <input
                      type="checkbox" checked={h.active}
                      onChange={() => toggleDay(i)}
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    {h.active ? (
                      <input
                        type="time" value={h.from}
                        onChange={(e) => updateHour(i, 'from', e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {h.active ? (
                      <input
                        type="time" value={h.to}
                        onChange={(e) => updateHour(i, 'to', e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                      />
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Step3({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const updateChamber = (i: number, c: Chamber) => {
    const chambers = [...form.chambers];
    chambers[i] = c;
    setForm({ ...form, chambers });
  };

  const addChamber = () => {
    if (form.chambers.length < 3) {
      setForm({ ...form, chambers: [...form.chambers, defaultChamber()] });
    }
  };

  const removeChamber = (i: number) => {
    setForm({ ...form, chambers: form.chambers.filter((_, idx) => idx !== i) });
  };

  const oc = form.onlineConsultation;
  const setOc = (patch: Partial<OnlineConsultation>) =>
    setForm({ ...form, onlineConsultation: { ...oc, ...patch } });

  return (
    <div className="space-y-6">
      {form.chambers.map((chamber, i) => (
        <div key={i} className="bg-gray-50/60 border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Chamber {i + 1}
            </h3>
            {i > 0 && (
              <button
                type="button" onClick={() => removeChamber(i)}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>
          <ChamberForm chamber={chamber} onChange={(c) => updateChamber(i, c)} />
        </div>
      ))}

      {form.chambers.length < 3 && (
        <button
          type="button" onClick={addChamber}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Another Chamber
        </button>
      )}

      {/* Online Consultation */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-800">Online Consultation</h3>
          </div>
          <button
            type="button"
            onClick={() => setOc({ enabled: !oc.enabled })}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
              oc.enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-1 ${
                oc.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {oc.enabled && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Online New Patient Fee</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
                  <Input
                    type="number" placeholder="600"
                    className="pl-7 bg-white"
                    value={oc.newPatientFee}
                    onChange={(e) => setOc({ newPatientFee: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Online Follow-up Fee</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">৳</span>
                  <Input
                    type="number" placeholder="400"
                    className="pl-7 bg-white"
                    value={oc.followUpFee}
                    onChange={(e) => setOc({ followUpFee: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel>Available Time Slots</FieldLabel>
              <Input
                type="text" placeholder="e.g. 8:00 PM – 10:00 PM (daily)"
                className="bg-white"
                value={oc.availableSlots}
                onChange={(e) => setOc({ availableSlots: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewCard({ title, icon, onEdit, children }: {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">{icon}</span>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        </div>
        <button
          type="button" onClick={onEdit}
          className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition"
        >
          Edit
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-1">
      <dt className="text-xs text-gray-400 w-36 shrink-0">{label}</dt>
      <dd className="text-xs font-semibold text-gray-700">{value}</dd>
    </div>
  );
}

function Step4({ form, setStep }: { form: FormData; setStep: (s: number) => void }) {
  return (
    <div className="space-y-4">
      {/* Personal */}
      <ReviewCard title="Personal Information" icon={<User className="w-4 h-4" />} onEdit={() => setStep(0)}>
        <div className="flex items-center gap-4 mb-4">
          {form.profilePhotoPreview ? (
            <img src={form.profilePhotoPreview} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-7 h-7 text-blue-400" />
            </div>
          )}
          <div>
            <p className="text-base font-bold text-gray-900">{form.fullName || '—'}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>
        </div>
        <dl>
          <ReviewRow label="Phone" value={form.phone ? `+880 ${form.phone}` : undefined} />
          <ReviewRow label="Gender" value={form.gender} />
          <ReviewRow label="Date of Birth" value={form.dob} />
          <ReviewRow label="NID" value={form.nid} />
        </dl>
      </ReviewCard>

      {/* Professional */}
      <ReviewCard title="Professional Information" icon={<Stethoscope className="w-4 h-4" />} onEdit={() => setStep(1)}>
        <dl>
          <ReviewRow label="Degree" value={[form.degree, form.additionalDegrees].filter(Boolean).join(', ')} />
          <ReviewRow label="Specialty" value={form.specialty} />
          <ReviewRow label="BMDC No." value={form.bmdcNumber} />
          <ReviewRow label="Experience" value={form.experience ? `${form.experience} years` : undefined} />
          <ReviewRow label="Hospital" value={form.hospital} />
          <ReviewRow label="Certificate" value={form.bmdcCertificate?.name} />
        </dl>
        {form.concentrationTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {form.concentrationTags.map((t) => (
              <span key={t} className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full border border-blue-100">{t}</span>
            ))}
          </div>
        )}
        {form.bio && (
          <p className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3 line-clamp-3">{form.bio}</p>
        )}
      </ReviewCard>

      {/* Chamber(s) */}
      <ReviewCard title="Chamber Information" icon={<Building2 className="w-4 h-4" />} onEdit={() => setStep(2)}>
        <div className="space-y-4">
          {form.chambers.map((c, i) => (
            <div key={i} className={i > 0 ? 'border-t border-gray-100 pt-4' : ''}>
              <p className="text-xs font-bold text-gray-700 mb-2">Chamber {i + 1}{c.name ? `: ${c.name}` : ''}</p>
              <dl>
                <ReviewRow label="Address" value={[c.address, c.area, c.city].filter(Boolean).join(', ')} />
                <ReviewRow label="Phone" value={c.phone} />
                <ReviewRow label="New Patient Fee" value={c.newPatientFee ? `৳${c.newPatientFee}` : undefined} />
                <ReviewRow label="Follow-up Fee" value={c.followUpFee ? `৳${c.followUpFee}` : undefined} />
              </dl>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.visitingHours.filter((h) => h.active).map((h) => (
                  <span key={h.day} className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full border border-green-100">
                    {h.day.slice(0, 3)} {h.from}–{h.to}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {form.onlineConsultation.enabled && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-1">
                <Wifi className="w-3 h-3" /> Online Consultation Enabled
              </p>
              <dl>
                <ReviewRow label="New Patient" value={form.onlineConsultation.newPatientFee ? `৳${form.onlineConsultation.newPatientFee}` : undefined} />
                <ReviewRow label="Follow-up" value={form.onlineConsultation.followUpFee ? `৳${form.onlineConsultation.followUpFee}` : undefined} />
                <ReviewRow label="Slots" value={form.onlineConsultation.availableSlots} />
              </dl>
            </div>
          )}
        </div>
      </ReviewCard>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Personal Info', 'Professional', 'Chamber', 'Review'];

const BENEFITS = [
  { icon: User, label: 'Free doctor profile' },
  { icon: BadgeCheck, label: 'Verified badge after review' },
  { icon: Calendar, label: 'Appointment management' },
  { icon: FileText, label: 'Online prescription' },
  { icon: HeartPulse, label: 'Live queue system' },
  { icon: Star, label: 'Patient reviews' },
];

function countFilledFields(form: FormData, step: number): number {
  if (step === 0) return [form.fullName, form.email, form.phone, form.password, form.gender, form.dob, form.nid].filter(Boolean).length;
  if (step === 1) return [form.degree, form.specialty, form.bmdcNumber, form.experience].filter(Boolean).length;
  if (step === 2) return form.chambers.filter((c) => c.name && c.city).length;
  return 0;
}

function Sidebar({ step, form }: { step: number; form: FormData }) {
  return (
    <div className="space-y-4">
      {/* Progress card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Your Progress</h3>
        <div className="space-y-2.5">
          {STEP_LABELS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            const filled = countFilledFields(form, i);
            return (
              <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${active ? 'bg-blue-50' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${active ? 'text-blue-700' : done ? 'text-green-700' : 'text-gray-400'}`}>
                    {label}
                  </p>
                  {active && filled > 0 && (
                    <p className="text-[10px] text-blue-500">{filled} fields filled</p>
                  )}
                  {done && (
                    <p className="text-[10px] text-green-500">Complete</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Why Join Us?</h3>
        <div className="space-y-2.5">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-xs font-bold text-blue-800 mb-3">Need Help?</p>
        <div className="space-y-2">
          <a href="tel:+8801700000000" className="flex items-center gap-2 text-xs text-blue-700 hover:text-blue-900 transition">
            <Phone className="w-3.5 h-3.5" />
            +880 1700-000000
          </a>
          <a href="mailto:support@emergentHealth.com" className="flex items-center gap-2 text-xs text-blue-700 hover:text-blue-900 transition break-all">
            <Mail className="w-3.5 h-3.5" />
            support@emergentHealth.com
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile benefits banner ───────────────────────────────────────────────────

function MobileBenefitsBanner() {
  return (
    <div className="lg:hidden bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex flex-wrap gap-x-4 gap-y-2">
      {BENEFITS.slice(0, 4).map(({ label }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-blue-700 font-medium">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          {label}
        </span>
      ))}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                done ? 'bg-green-500 border-green-500 text-white' :
                active ? 'bg-blue-600 border-blue-600 text-white' :
                'bg-white border-gray-200 text-gray-400'
              }`}>
                {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-[11px] font-semibold mt-1.5 whitespace-nowrap ${
                active ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-1 mb-4 sm:mb-6 transition-colors ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping opacity-50" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-500 mb-2 text-base">
            Your application is under review. We will verify your BMDC registration and contact you within <strong>48 hours</strong>.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-sm font-mono px-4 py-2 rounded-full mt-2 mb-8">
            Reference: <span className="font-bold text-gray-900">#DOC-2024-001</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Go to Homepage <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Check Application Status
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JoinAsDoctorPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <SuccessScreen />;

  const STEP_TITLES = [
    'Personal Information',
    'Professional Information',
    'Chamber Information',
    'Review & Submit',
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };
  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Doctor</h1>
            <p className="text-gray-500 text-base max-w-md">
              Register your profile and reach thousands of patients across Bangladesh
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              {[
                { icon: BadgeCheck, label: 'Free Registration', color: 'bg-green-50 text-green-700 border-green-100' },
                { icon: Users, label: 'Verified Badge', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { icon: HeartPulse, label: 'Reach More Patients', color: 'bg-purple-50 text-purple-700 border-purple-100' },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${color}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex gap-7 items-start">

          {/* Form column */}
          <div className="flex-1 min-w-0">
            <MobileBenefitsBanner />

            {/* Step indicator */}
            <StepIndicator step={step} />

            {/* Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">{STEP_TITLES[step]}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of 4</p>
              </div>
              <div className="p-6">
                {step === 0 && <Step1 form={form} setForm={setForm} />}
                {step === 1 && <Step2 form={form} setForm={setForm} />}
                {step === 2 && <Step3 form={form} setForm={setForm} />}
                {step === 3 && <Step4 form={form} setStep={setStep} />}

                {/* Declaration (step 4 only) */}
                {step === 3 && (
                  <label className="flex items-start gap-3 mt-6 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded accent-blue-600 cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I confirm that all information provided is accurate and I am a registered medical
                      practitioner in Bangladesh. I agree to the{' '}
                      <span className="text-blue-600 font-semibold">Terms of Service</span> and{' '}
                      <span className="text-blue-600 font-semibold">Privacy Policy</span>.
                    </span>
                  </label>
                )}
              </div>

              {/* Navigation */}
              <div className="px-6 pb-6 flex gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!agreed}
                    onClick={() => setSubmitted(true)}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 ${
                      agreed
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20">
            <Sidebar step={step} form={form} />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
