import { useState } from 'react';
import { Building2, Plus, X, Wifi, Save } from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Rangpur', 'Barisal', 'Mymensingh'];

interface ChamberData {
  id: string; name: string; address: string; city: string; phone: string;
  newFee: string; followFee: string; online: boolean; onlineNewFee: string; onlineFollowFee: string;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}>
      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5"><label className="text-sm font-semibold text-gray-700">{children}</label></div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${className ?? ''}`} />
  );
}

export default function ChambersPage() {
  const [chambers, setChambers] = useState<ChamberData[]>([
    { id: 'ch1', name: 'Dhanmondi Chamber', address: 'House 32, Road 7, Dhanmondi', city: 'Dhaka', phone: '02-8612345', newFee: '800', followFee: '500', online: true, onlineNewFee: '600', onlineFollowFee: '400' },
    { id: 'ch2', name: 'Popular Chamber', address: 'Shyamoli, Dhaka', city: 'Dhaka', phone: '02-9101234', newFee: '1000', followFee: '600', online: false, onlineNewFee: '', onlineFollowFee: '' },
  ]);
  const [saved, setSaved] = useState(false);

  const update = (id: string, patch: Partial<ChamberData>) =>
    setChambers((cs) => cs.map((c) => c.id === id ? { ...c, ...patch } : c));

  const remove = (id: string) => setChambers((cs) => cs.filter((c) => c.id !== id));

  const add = () =>
    setChambers((cs) => [...cs, { id: `ch${Date.now()}`, name: '', address: '', city: 'Dhaka', phone: '', newFee: '', followFee: '', online: false, onlineNewFee: '', onlineFollowFee: '' }]);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[820px] space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" /> Chamber Settings
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage your consultation chambers and fees</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-green-600 font-semibold">Saved!</span>}
            <button onClick={save}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-100">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {chambers.map((ch, i) => (
            <div key={ch.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-base font-bold text-gray-800">
                    {ch.name || `Chamber ${i + 1}`}
                  </p>
                </div>
                {chambers.length > 1 && (
                  <button onClick={() => remove(ch.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition">
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <FieldLabel>Chamber Name</FieldLabel>
                  <Input value={ch.name} placeholder="e.g. Dhanmondi Chamber"
                    onChange={(e) => update(ch.id, { name: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Address</FieldLabel>
                  <Input value={ch.address} placeholder="Full address"
                    onChange={(e) => update(ch.id, { address: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <select value={ch.city} onChange={(e) => update(ch.id, { city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    {CITIES.map((city) => <option key={city}>{city}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel>Chamber Phone</FieldLabel>
                  <Input value={ch.phone} placeholder="02-XXXXXXX"
                    onChange={(e) => update(ch.id, { phone: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>New Patient Fee (৳)</FieldLabel>
                  <Input type="number" value={ch.newFee} placeholder="800"
                    onChange={(e) => update(ch.id, { newFee: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>Follow-up Fee (৳)</FieldLabel>
                  <Input type="number" value={ch.followFee} placeholder="500"
                    onChange={(e) => update(ch.id, { followFee: e.target.value })} />
                </div>
              </div>

              {/* Online toggle */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-blue-500" /> Enable Online Consultation
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Allow patients to book video consultations</p>
                  </div>
                  <Toggle checked={ch.online} onChange={() => update(ch.id, { online: !ch.online })} />
                </div>
                {ch.online && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <FieldLabel>Online New Patient Fee (৳)</FieldLabel>
                      <Input type="number" value={ch.onlineNewFee} placeholder="600"
                        onChange={(e) => update(ch.id, { onlineNewFee: e.target.value })} />
                    </div>
                    <div>
                      <FieldLabel>Online Follow-up Fee (৳)</FieldLabel>
                      <Input type="number" value={ch.onlineFollowFee} placeholder="400"
                        onChange={(e) => update(ch.id, { onlineFollowFee: e.target.value })} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {chambers.length < 3 && (
            <button onClick={add}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 bg-white">
              <Plus className="w-4 h-4" /> Add Chamber
            </button>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
