import { useState } from 'react';
import {
  UserCog, Plus, UserCheck, Clock, Send, Mail, Link2,
  Copy, Check, Trash2, Edit2, Shield, X, ChevronDown,
  Phone, MessageSquare, CheckCircle, XCircle, RefreshCw,
  Stethoscope,
} from 'lucide-react';
import DoctorLayout from '../../components/DoctorLayout';

// ── Mock data ─────────────────────────────────────────────────────────────────

const DOCTOR_ID = 'DOC-26-00001';

interface PSMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  initials: string;
  joinedDate: string;
  chambers: string[];
  permissions: {
    queue: boolean;
    appointments: boolean;
    prescriptions: boolean;
    registerPatients: boolean;
    history: boolean;
  };
  status: 'active' | 'deactivated';
}

interface PendingPS {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
}

interface InviteSent {
  id: number;
  name: string;
  contact: string;
  type: 'email' | 'link';
  sentDate: string;
  status: 'pending' | 'accepted' | 'expired';
}

const ACTIVE_MEMBERS: PSMember[] = [
  {
    id: 1, name: 'Ratan Kumar Das', email: 'ratan@clinic.com', phone: '01712345678',
    initials: 'RK', joinedDate: '10 Jun 2026',
    chambers: ['Apollo Hospital', 'Green Life'],
    permissions: { queue: true, appointments: true, prescriptions: true, registerPatients: true, history: false },
    status: 'active',
  },
  {
    id: 2, name: 'Shirin Akter', email: 'shirin@clinic.com', phone: '01898765432',
    initials: 'SA', joinedDate: '22 May 2026',
    chambers: ['Apollo Hospital'],
    permissions: { queue: true, appointments: true, prescriptions: false, registerPatients: true, history: false },
    status: 'active',
  },
];

const PENDING_MEMBERS: PendingPS[] = [
  { id: 1, name: 'Kamrul Hasan', email: 'kamrul@gmail.com', phone: '01755667788', registeredAt: '1 Jul 2026, 9:15 AM' },
  { id: 2, name: 'Lipi Begum', email: 'lipi.begum@yahoo.com', phone: '01633445566', registeredAt: '30 Jun 2026, 3:42 PM' },
];

const INVITES_SENT: InviteSent[] = [
  { id: 1, name: 'Nadia Islam', contact: 'nadia@email.com', type: 'email', sentDate: '28 Jun 2026', status: 'pending' },
  { id: 2, name: 'Invite Link', contact: 'via WhatsApp share', type: 'link', sentDate: '25 Jun 2026', status: 'accepted' },
  { id: 3, name: 'Mahmud Hossain', contact: 'mahmud@clinic.com', type: 'email', sentDate: '15 Jun 2026', status: 'expired' },
];

const CHAMBERS = ['Apollo Hospital', 'Green Life', 'Ibn Sina', 'Online Consultation'];

const PERMISSION_LABELS: { key: keyof PSMember['permissions']; label: string; desc: string }[] = [
  { key: 'queue', label: 'Queue Management', desc: 'Add/remove patients from live queue' },
  { key: 'appointments', label: 'Appointments', desc: 'View and manage appointments' },
  { key: 'prescriptions', label: 'Prescriptions', desc: 'View past prescriptions (read-only)' },
  { key: 'registerPatients', label: 'Register Patients', desc: 'Create new patient records' },
  { key: 'history', label: 'Patient History', desc: 'View full patient medical history' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PermBadge({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${on ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-400 line-through'}`}>
      {label}
    </span>
  );
}

function EditPermissionsModal({ member, onClose }: { member: PSMember; onClose: () => void }) {
  const [perms, setPerms] = useState({ ...member.permissions });
  const [chambers, setChambers] = useState([...member.chambers]);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof PSMember['permissions']) => setPerms((p) => ({ ...p, [key]: !p[key] }));
  const toggleChamber = (c: string) => setChambers((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Edit Permissions</h3>
              <p className="text-xs text-gray-500 mt-0.5">{member.name}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-400" /></button>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Assigned Chambers</p>
            <div className="flex flex-wrap gap-2">
              {CHAMBERS.map((c) => (
                <button key={c} onClick={() => toggleChamber(c)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${chambers.includes(c) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Permissions</p>
            <div className="space-y-2">
              {PERMISSION_LABELS.map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-[11px] text-gray-400">{desc}</p>
                  </div>
                  <button onClick={() => toggle(key)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${perms[key] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${perms[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={() => { setSaved(true); setTimeout(onClose, 800); }}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
              {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'email' | 'link'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chambers, setChambers] = useState<string[]>([]);
  const [perms, setPerms] = useState({ queue: true, appointments: true, prescriptions: false, registerPatients: true, history: false });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `https://emergenthealth.app/register/ps?docId=${DOCTOR_ID}&ref=invite`;

  const toggleChamber = (c: string) => setChambers((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]);
  const togglePerm = (key: keyof typeof perms) => setPerms((p) => ({ ...p, [key]: !p[key] }));

  const handleCopy = () => { navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 my-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Invite PS Member</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-400" /></button>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button onClick={() => setTab('email')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition ${tab === 'email' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              <Mail className="w-3.5 h-3.5" /> Email Invite
            </button>
            <button onClick={() => setTab('link')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition ${tab === 'link' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
              <Link2 className="w-3.5 h-3.5" /> Share Link
            </button>
          </div>

          {tab === 'email' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name (optional)</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nadia Islam"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@email.com"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Assign Chambers</p>
                <div className="flex flex-wrap gap-1.5">
                  {CHAMBERS.map((c) => (
                    <button key={c} onClick={() => toggleChamber(c)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${chambers.includes(c) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Initial Permissions</p>
                <div className="space-y-1.5">
                  {PERMISSION_LABELS.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{label}</span>
                      <button onClick={() => togglePerm(key)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${perms[key] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${perms[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {sent ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Invitation sent to {email}!
                </div>
              ) : (
                <button onClick={() => setSent(true)} disabled={!email}
                  className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Email Invitation
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-blue-700">Your Doctor ID is pre-filled in the link</span>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg px-3 py-2.5 text-xs font-mono text-gray-700 break-all">
                  {inviteLink}
                </div>
                <button onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
              </div>

              <a href={`https://wa.me/?text=Join%20my%20clinic%20team%3A%20${encodeURIComponent(inviteLink)}`}
                target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#20ba57] transition">
                <MessageSquare className="w-4 h-4" /> Share via WhatsApp
              </a>

              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 font-medium">This link expires in <b>7 days</b>. Anyone with this link can register as your PS.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Active Members Tab ────────────────────────────────────────────────────────

function ActiveMembersTab() {
  const [members, setMembers] = useState<PSMember[]>(ACTIVE_MEMBERS);
  const [editingMember, setEditingMember] = useState<PSMember | null>(null);

  const deactivate = (id: number) => setMembers((m) => m.map((x) => x.id === id ? { ...x, status: 'deactivated' } : x));
  const remove = (id: number) => setMembers((m) => m.filter((x) => x.id !== id));

  if (members.length === 0) {
    return (
      <div className="text-center py-16">
        <UserCog className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-base font-bold text-gray-400">No active PS members</p>
        <p className="text-sm text-gray-400 mt-1">Invite your staff to join the team</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((m) => (
        <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-black text-base flex items-center justify-center shrink-0">
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-gray-900">{m.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${m.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {m.status === 'active' ? 'Active' : 'Deactivated'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{m.email}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Joined {m.joinedDate}</p>

              <div className="mt-2 flex flex-wrap gap-1">
                {m.chambers.map((c) => (
                  <span key={c} className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                <PermBadge on={m.permissions.queue} label="Queue" />
                <PermBadge on={m.permissions.appointments} label="Appointments" />
                <PermBadge on={m.permissions.prescriptions} label="Prescriptions" />
                <PermBadge on={m.permissions.registerPatients} label="Register" />
                <PermBadge on={m.permissions.history} label="History" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button onClick={() => setEditingMember(m)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              {m.status === 'active' ? (
                <button onClick={() => deactivate(m.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition">
                  <Shield className="w-3 h-3" /> Deactivate
                </button>
              ) : (
                <button onClick={() => setMembers((ms) => ms.map((x) => x.id === m.id ? { ...x, status: 'active' } : x))}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition">
                  <CheckCircle className="w-3 h-3" /> Reactivate
                </button>
              )}
              <button onClick={() => remove(m.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      {editingMember && <EditPermissionsModal member={editingMember} onClose={() => setEditingMember(null)} />}
    </div>
  );
}

// ── Pending Approval Tab ──────────────────────────────────────────────────────

function PendingTab() {
  const [pending, setPending] = useState<PendingPS[]>(PENDING_MEMBERS);
  const [approved, setApproved] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const approve = (id: number) => { setApproved((a) => [...a, id]); setTimeout(() => setPending((p) => p.filter((x) => x.id !== id)), 1500); };
  const reject = (id: number) => { setRejected((r) => [...r, id]); setTimeout(() => setPending((p) => p.filter((x) => x.id !== id)), 1500); };

  if (pending.length === 0) {
    return (
      <div className="text-center py-16">
        <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-base font-bold text-gray-400">No pending approvals</p>
        <p className="text-sm text-gray-400 mt-1">PS staff who register with your Doctor ID will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-700 font-medium">{pending.length} request{pending.length !== 1 ? 's' : ''} waiting for your approval. Staff can only login after you approve.</p>
      </div>

      {pending.map((p) => (
        <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 font-black text-base flex items-center justify-center shrink-0">
              {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{p.name}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{p.phone}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{p.email}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] text-gray-400">Registered: {p.registeredAt}</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Used your Doctor ID</span>
              </div>
            </div>

            {approved.includes(p.id) ? (
              <div className="flex items-center gap-1.5 text-sm font-bold text-green-600"><CheckCircle className="w-4 h-4" /> Approved!</div>
            ) : rejected.includes(p.id) ? (
              <div className="flex items-center gap-1.5 text-sm font-bold text-red-500"><XCircle className="w-4 h-4" /> Rejected</div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => approve(p.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button onClick={() => reject(p.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 border border-red-200 transition">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Invitations Sent Tab ──────────────────────────────────────────────────────

function InvitationsSentTab() {
  const [invites, setInvites] = useState<InviteSent[]>(INVITES_SENT);

  const cancel = (id: number) => setInvites((inv) => inv.filter((x) => x.id !== id));

  const statusStyle: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-green-50 text-green-700 border-green-200',
    expired: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  if (invites.length === 0) {
    return (
      <div className="text-center py-16">
        <Send className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-base font-bold text-gray-400">No invitations sent yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((inv) => (
        <div key={inv.id} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 flex-wrap">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${inv.type === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {inv.type === 'email' ? <Mail className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{inv.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{inv.contact}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Sent {inv.sentDate}</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${statusStyle[inv.status]}`}>
            {inv.status}
          </span>
          <div className="flex gap-1.5">
            {inv.status === 'pending' && (
              <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <RefreshCw className="w-3 h-3" /> Resend
              </button>
            )}
            <button onClick={() => cancel(inv.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition">
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [tab, setTab] = useState<'active' | 'pending' | 'invitations'>('active');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const TABS = [
    { id: 'active', label: 'Active Members', count: ACTIVE_MEMBERS.length },
    { id: 'pending', label: 'Pending Approval', count: PENDING_MEMBERS.length, orange: true },
    { id: 'invitations', label: 'Invitations Sent', count: INVITES_SENT.length },
  ] as const;

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 max-w-[900px] space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="w-5 h-5 text-blue-600" /> My Team
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage your PS (Patient Staff) members and permissions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4" /> Invite PS Member
            </button>
          </div>
        </div>

        {/* Doctor ID notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-blue-800">Your Doctor ID: <span className="font-mono tracking-wide">{DOCTOR_ID}</span></p>
            <p className="text-xs text-blue-600 mt-0.5">Share this ID with your PS staff so they can self-register and link to your account</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map(({ id, label, count, orange }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition ${tab === id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${tab === id ? (orange ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600') : 'bg-gray-200 text-gray-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'active' && <ActiveMembersTab />}
        {tab === 'pending' && <PendingTab />}
        {tab === 'invitations' && <InvitationsSentTab />}
      </div>

      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
    </DoctorLayout>
  );
}
