import { useState } from 'react';
import {
  User, Stethoscope, Building2, Clock, Bell,
  CalendarOff, Settings, Plus, X, Save,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'professional', label: 'Professional', icon: Stethoscope },
  { id: 'chamber', label: 'Chamber Settings', icon: Building2 },
  { id: 'availability', label: 'Availability', icon: CalendarOff },
  { id: 'booking', label: 'Booking Settings', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button" onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${props.className ?? ''}`} />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <select {...rest} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none">
      {children}
    </select>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{children}</h3>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>;
}

function SaveButton() {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
      <Save className="w-4 h-4" /> Save Changes
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');

  // Personal state
  const [name, setName] = useState('Dr. Rahim Uddin');
  const [email, setEmail] = useState('dr.rahim@email.com');
  const [phone, setPhone] = useState('1712345678');
  const [bio, setBio] = useState('Experienced Cardiologist with over 12 years of practice.');

  // Availability
  const [unavailableDates, setUnavailableDates] = useState<string[]>(['2026-07-10', '2026-07-15']);
  const [holidayMode, setHolidayMode] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, boolean>>(
    Object.fromEntries(DAYS.map((d, i) => [d, i < 5]))
  );

  // Booking
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [maxPatients, setMaxPatients] = useState('20');
  const [apptGap, setApptGap] = useState('30');

  // Notifications
  const [sms, setSms] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [newApptAlert, setNewApptAlert] = useState(true);

  // Chamber
  const [chambers, setChambers] = useState([
    { id: 1, name: 'Dhanmondi Chamber', address: 'House 32, Road 7, Dhanmondi', city: 'Dhaka', phone: '02-8612345', newFee: '800', followFee: '500', online: true, onlineNewFee: '600', onlineFollowFee: '400' },
  ]);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[950px]">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your profile and preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          {/* Tab list */}
          <div className="sm:w-48 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5 sm:sticky sm:top-20">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-left leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* ── Personal Info ── */}
            {activeTab === 'personal' && (
              <>
                <SectionLabel>Personal Information</SectionLabel>
                <div className="flex items-center gap-5 mb-6">
                  <img src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150" alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow" />
                  <div>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">Change Photo</button>
                    <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><FieldLabel>Full Name</FieldLabel><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                  <div><FieldLabel>Email</FieldLabel><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><FieldLabel>Phone</FieldLabel><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                </div>
                <div>
                  <FieldLabel>Short Bio</FieldLabel>
                  <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Professional ── */}
            {activeTab === 'professional' && (
              <>
                <SectionLabel>Professional Information</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><FieldLabel>Medical Degree</FieldLabel><Input defaultValue="MBBS" /></div>
                  <div><FieldLabel>Additional Degrees</FieldLabel><Input defaultValue="MD (Cardiology)" /></div>
                  <div><FieldLabel>Specialty</FieldLabel>
                    <Select defaultValue="Cardiologist">
                      {['General Physician','Cardiologist','Pediatrician','Dermatologist','Neurologist','Orthopedic','Gynecologist','Eye Specialist','Psychiatrist','Dentist'].map((s) => <option key={s}>{s}</option>)}
                    </Select>
                  </div>
                  <div><FieldLabel>BMDC Registration No.</FieldLabel><Input defaultValue="A-12345" /></div>
                  <div><FieldLabel>Years of Experience</FieldLabel><Input type="number" defaultValue="12" /></div>
                  <div><FieldLabel>Current Hospital</FieldLabel><Input defaultValue="Green Life Medical Centre" /></div>
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Chamber ── */}
            {activeTab === 'chamber' && (
              <>
                <SectionLabel>Chamber Settings</SectionLabel>
                <div className="space-y-5">
                  {chambers.map((ch, i) => (
                    <div key={ch.id} className="border border-gray-200 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-800">Chamber {i + 1}</p>
                        {chambers.length > 1 && (
                          <button onClick={() => setChambers((prev) => prev.filter((c) => c.id !== ch.id))} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition">
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2"><FieldLabel>Chamber Name</FieldLabel><Input value={ch.name} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, name: e.target.value } : c))} /></div>
                        <div className="sm:col-span-2"><FieldLabel>Address</FieldLabel><Input value={ch.address} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, address: e.target.value } : c))} /></div>
                        <div><FieldLabel>City</FieldLabel>
                          <Select value={ch.city} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, city: e.target.value } : c))}>
                            {CITIES.map((city) => <option key={city}>{city}</option>)}
                          </Select>
                        </div>
                        <div><FieldLabel>Phone</FieldLabel><Input value={ch.phone} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, phone: e.target.value } : c))} /></div>
                        <div><FieldLabel>New Patient Fee (৳)</FieldLabel><Input type="number" value={ch.newFee} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, newFee: e.target.value } : c))} /></div>
                        <div><FieldLabel>Follow-up Fee (৳)</FieldLabel><Input type="number" value={ch.followFee} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, followFee: e.target.value } : c))} /></div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm font-semibold text-gray-700">Enable Online Consultation</span>
                        <Toggle checked={ch.online} onChange={() => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, online: !c.online } : c))} />
                      </div>
                      {ch.online && (
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <div><FieldLabel>Online New Patient Fee (৳)</FieldLabel><Input type="number" value={ch.onlineNewFee} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, onlineNewFee: e.target.value } : c))} /></div>
                          <div><FieldLabel>Online Follow-up Fee (৳)</FieldLabel><Input type="number" value={ch.onlineFollowFee} onChange={(e) => setChambers((prev) => prev.map((c) => c.id === ch.id ? { ...c, onlineFollowFee: e.target.value } : c))} /></div>
                        </div>
                      )}
                    </div>
                  ))}
                  {chambers.length < 3 && (
                    <button onClick={() => setChambers((prev) => [...prev, { id: Date.now(), name: '', address: '', city: 'Dhaka', phone: '', newFee: '', followFee: '', online: false, onlineNewFee: '', onlineFollowFee: '' }])}
                      className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Chamber
                    </button>
                  )}
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Availability ── */}
            {activeTab === 'availability' && (
              <>
                <SectionLabel>Availability Settings</SectionLabel>
                <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Holiday Mode</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pause all bookings temporarily</p>
                  </div>
                  <Toggle checked={holidayMode} onChange={() => setHolidayMode(!holidayMode)} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Weekly Schedule</p>
                  <div className="space-y-2">
                    {DAYS.map((day) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700">{day}</span>
                        <Toggle checked={weeklySchedule[day]} onChange={() => setWeeklySchedule((prev) => ({ ...prev, [day]: !prev[day] }))} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Mark Unavailable Dates</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unavailableDates.map((d) => (
                      <span key={d} className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-100">
                        {d}
                        <button onClick={() => setUnavailableDates((prev) => prev.filter((x) => x !== d))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input type="date" onChange={(e) => { if (e.target.value && !unavailableDates.includes(e.target.value)) { setUnavailableDates((prev) => [...prev, e.target.value]); e.target.value = ''; }}}
                    className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Booking ── */}
            {activeTab === 'booking' && (
              <>
                <SectionLabel>Booking Settings</SectionLabel>
                <div className="space-y-4">
                  {[
                    { label: 'Enable Online Booking', desc: 'Allow patients to book appointments online', val: onlineBooking, set: () => setOnlineBooking(!onlineBooking) },
                    { label: 'Auto-confirm Appointments', desc: 'Automatically confirm new bookings without manual review', val: autoConfirm, set: () => setAutoConfirm(!autoConfirm) },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <Toggle checked={val} onChange={set} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel>Max Patients Per Day</FieldLabel>
                      <Input type="number" value={maxPatients} onChange={(e) => setMaxPatients(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Appointment Gap (minutes)</FieldLabel>
                      <Input type="number" value={apptGap} onChange={(e) => setApptGap(e.target.value)} />
                    </div>
                  </div>
                </div>
                <SaveButton />
              </>
            )}

            {/* ── Notifications ── */}
            {activeTab === 'notifications' && (
              <>
                <SectionLabel>Notification Preferences</SectionLabel>
                <div className="space-y-3">
                  {[
                    { label: 'SMS Notifications', desc: 'Receive alerts via SMS', val: sms, set: () => setSms(!sms) },
                    { label: 'Email Notifications', desc: 'Receive alerts via email', val: emailNotif, set: () => setEmailNotif(!emailNotif) },
                    { label: 'New Appointment Alert', desc: 'Get notified when a new booking arrives', val: newApptAlert, set: () => setNewApptAlert(!newApptAlert) },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <Toggle checked={val} onChange={set} />
                    </div>
                  ))}
                </div>
                <SaveButton />
              </>
            )}
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
