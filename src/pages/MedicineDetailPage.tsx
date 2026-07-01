import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Pill, ChevronRight, Bookmark, BookmarkCheck, Printer,
  AlertTriangle, Info, FlaskConical, Package, Thermometer,
  ChevronDown, ChevronUp, Stethoscope, ArrowLeft, Flag,
  Zap, Shield, Wine, Apple, ExternalLink,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { medicines, type Medicine } from '../data/medicines';

const CATEGORY_BADGE: Record<string, string> = {
  Tablet:    'bg-blue-100 text-blue-700',
  Capsule:   'bg-amber-100 text-amber-700',
  Syrup:     'bg-yellow-100 text-yellow-700',
  Injection: 'bg-red-100 text-red-700',
  Cream:     'bg-green-100 text-green-700',
  'Eye Drop':'bg-cyan-100 text-cyan-700',
  Inhaler:   'bg-orange-100 text-orange-700',
};

const TABS = ['Overview', 'Dosage', 'Side Effects', 'Interactions', 'Storage'] as const;
type Tab = typeof TABS[number];

// Placeholder image set per category (label + which icon variant to show)
const THUMB_LABELS = ['Front', 'Back', 'Strip', 'Close-up'] as const;

const ICON_COLOR_MAP: Record<string, string> = {
  Tablet:    '#2563EB',
  Capsule:   '#D97706',
  Syrup:     '#CA8A04',
  Injection: '#DC2626',
  Cream:     '#16A34A',
  'Eye Drop':'#0891B2',
  Inhaler:   '#EA580C',
};

function MedicineImageGallery({ category, name }: { category: string; name: string }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const color = ICON_COLOR_MAP[category] ?? '#6B7280';
  const bgLight = `${color}12`;

  return (
    <div className="mb-6">
      {/* Main image display */}
      <div
        className="w-full rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{ height: '300px', backgroundColor: '#F3F4F6' }}
      >
        {/* Category watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Pill className="w-64 h-64" style={{ color }} />
        </div>

        {/* Main visual */}
        <div className="flex flex-col items-center gap-4 z-10">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: bgLight, border: `2px solid ${color}22` }}
          >
            <Pill className="w-14 h-14" style={{ color }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-700">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{THUMB_LABELS[activeThumb]} view</p>
          </div>
        </div>

        {/* View label badge */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-xs font-semibold text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
          {THUMB_LABELS[activeThumb]}
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {THUMB_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveThumb(i)}
            className={`shrink-0 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-150 border-2 ${
              activeThumb === i
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            style={{ width: 80, height: 80 }}
            title={`${label} view`}
          >
            <Pill
              className="w-7 h-7"
              style={{ color: activeThumb === i ? '#2563EB' : color, opacity: activeThumb === i ? 1 : 0.5 }}
            />
            <span className={`text-[10px] font-semibold ${activeThumb === i ? 'text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Caption */}
      <p className="text-[11px] text-gray-400 italic text-center mt-2 leading-snug">
        Image for illustration only. Actual product may vary.
      </p>
    </div>
  );
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 py-3 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );
}

function OverviewTab({ medicine }: { medicine: Medicine }) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
          <Info className="w-4 h-4 text-blue-500" />
          Uses &amp; Indications
        </h3>
        <ul className="space-y-2">
          {medicine.uses.map((u) => (
            <li key={u} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              {u}
            </li>
          ))}
        </ul>
      </section>

      {medicine.howItWorks && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            How It Works
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4 border border-blue-100">
            {medicine.howItWorks}
          </p>
        </section>
      )}

      <CollapsibleSection title="Pharmacology">
        <p>
          <strong>{medicine.name}</strong> ({medicine.generic}) belongs to the class of medications commonly used for treatment involving its indicated uses. It operates through its primary mechanism of action on target receptors or enzymes, leading to therapeutic effects.
        </p>
      </CollapsibleSection>
    </div>
  );
}

function DosageTab({ medicine }: { medicine: Medicine }) {
  const rows = [
    { patient: 'Adult', dose: medicine.adultDose, frequency: '—', duration: 'As directed' },
    { patient: 'Child', dose: medicine.childDose, frequency: '—', duration: 'As directed' },
    { patient: 'Elderly', dose: medicine.elderlyDose ?? medicine.adultDose, frequency: '—', duration: 'As directed' },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
          <FlaskConical className="w-4 h-4 text-green-500" />
          Dosage Table
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Patient', 'Dose', 'Frequency', 'Duration'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.map((r) => (
                <tr key={r.patient} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-700">{r.patient}</td>
                  <td className="px-4 py-3 text-gray-600">{r.dose}</td>
                  <td className="px-4 py-3 text-gray-400">{r.frequency}</td>
                  <td className="px-4 py-3 text-gray-400">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-1">Maximum Dose Warning</p>
          <p className="text-sm text-red-700">{medicine.maxDose}</p>
        </div>
      </div>

      {medicine.administrationInstructions && (
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-2">Administration Instructions</h3>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed">
            {medicine.administrationInstructions}
          </p>
        </section>
      )}
    </div>
  );
}

function SideEffectsTab({ medicine }: { medicine: Medicine }) {
  const common = medicine.sideEffectsCommon ?? [];
  const uncommon = medicine.sideEffectsUncommon ?? [];
  const rare = medicine.sideEffectsRare ?? [];

  return (
    <div className="space-y-5">
      {common.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            Common Side Effects
          </h3>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <ul className="space-y-1.5">
              {common.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {uncommon.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-orange-700 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            Uncommon Side Effects
          </h3>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <ul className="space-y-1.5">
              {uncommon.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-orange-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {rare.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Rare / Serious Side Effects
          </h3>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <ul className="space-y-1.5">
              {rare.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {common.length === 0 && uncommon.length === 0 && rare.length === 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <ul className="space-y-1.5">
            {medicine.sideEffects.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-orange-800">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Stethoscope className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">When to See a Doctor</p>
          <p className="text-sm text-blue-700">
            Seek immediate medical attention if you experience severe allergic reactions (rash, swelling, difficulty breathing), severe abdominal pain, or any unusual symptoms after taking this medicine.
          </p>
        </div>
      </div>
    </div>
  );
}

function InteractionsTab({ medicine }: { medicine: Medicine }) {
  return (
    <div className="space-y-5">
      {medicine.drugInteractions && medicine.drugInteractions.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <Shield className="w-4 h-4 text-red-500" />
            Drug Interactions
          </h3>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <ul className="space-y-2">
              {medicine.drugInteractions.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {medicine.foodInteractions && medicine.foodInteractions.length > 0 && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <Apple className="w-4 h-4 text-green-500" />
            Food Interactions
          </h3>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <ul className="space-y-2">
              {medicine.foodInteractions.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {medicine.alcoholWarning && (
        <section>
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
            <Wine className="w-4 h-4 text-orange-500" />
            Alcohol Warning
          </h3>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
            <p className="text-sm text-orange-800">{medicine.alcoholWarning}</p>
          </div>
        </section>
      )}

      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-2">Contraindications</h3>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <ul className="space-y-2">
            {medicine.contraindications.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StorageTab({ medicine }: { medicine: Medicine }) {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
          <Thermometer className="w-4 h-4 text-blue-500" />
          Storage Instructions
        </h3>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-800 leading-relaxed">{medicine.storage}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Light</p>
          <p className="text-sm text-gray-700">Protect from direct sunlight and UV radiation</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Humidity</p>
          <p className="text-sm text-gray-700">Keep in a dry place, away from moisture</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Expiry</p>
          <p className="text-sm text-gray-700">Check expiry date before use. Discard after expiry.</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Child Safety</p>
          <p className="text-sm text-gray-700">Keep all medicines out of reach of children</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
        <p className="text-sm text-yellow-800">
          <strong>Disposal:</strong> Do not flush medicines down the drain or throw in household rubbish. Ask your pharmacist how to dispose of medicines you no longer use.
        </p>
      </div>
    </div>
  );
}

function AvailableBrandsSection({ medicine, allMedicines }: { medicine: Medicine; allMedicines: Medicine[] }) {
  const sameGeneric = allMedicines.filter(
    (m) => m.generic === medicine.generic && m.id !== medicine.id
  );

  return (
    <section className="mt-8">
      <h3 className="text-base font-bold text-gray-800 mb-4">Other Brands with Same Generic</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Current brand */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold text-blue-800">{medicine.name}</p>
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">Current</span>
            </div>
            <p className="text-xs text-blue-600">{medicine.manufacturer}</p>
          </div>
          <p className="text-base font-bold text-blue-700">৳{medicine.pricePerUnit}</p>
        </div>

        {/* Other brands from availableBrands list */}
        {medicine.availableBrands.filter((b) => b !== medicine.name.split(' ')[0]).slice(0, 5).map((brand) => (
          <div key={brand} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-gray-200 hover:shadow-sm transition-all">
            <div>
              <p className="text-sm font-semibold text-gray-800">{brand}</p>
              <p className="text-xs text-gray-400">Same generic: {medicine.generic}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300" />
          </div>
        ))}

        {sameGeneric.map((m) => (
          <Link
            key={m.id}
            to={`/medicines/${m.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{m.name}</p>
              <p className="text-xs text-gray-400">{m.manufacturer}</p>
            </div>
            <p className="text-sm font-bold text-blue-600">৳{m.pricePerUnit}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function MedicineDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(false);

  const medicine = medicines.find((m) => m.slug === slug);

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 py-24">
          <Pill className="w-16 h-16 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700">Medicine not found</h2>
          <p className="text-gray-400 text-sm">The medicine you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/medicines')}
            className="mt-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse All Medicines
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = medicine.mrpPerUnit && medicine.mrpPerUnit > medicine.pricePerUnit;
  const discountPct = hasDiscount
    ? Math.round(((medicine.mrpPerUnit! - medicine.pricePerUnit) / medicine.mrpPerUnit!) * 100)
    : 0;

  const relatedMedicines = medicines.filter(
    (m) => m.category === medicine.category && m.id !== medicine.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/medicines" className="hover:text-blue-600 transition-colors">Medicines</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 font-medium truncate">{medicine.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <button
          onClick={() => navigate('/medicines')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Medicines
        </button>

        <div className="flex gap-7 items-start">

          {/* ── LEFT COLUMN (65%) ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Top Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {/* Image gallery — full width at top */}
              <MedicineImageGallery category={medicine.category} name={medicine.name} />

              {/* Medicine name + details below gallery */}
              <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{medicine.name}</h1>
                  <p className="text-base font-medium text-blue-600 mt-1">{medicine.generic}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${CATEGORY_BADGE[medicine.category]}`}>
                  {medicine.category}
                </span>
              </div>

              {/* Manufacturer */}
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-600">{medicine.countryFlag} {medicine.manufacturer}</span>
              </div>

              {/* Pack size */}
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-500">{medicine.packSize}</span>
              </div>

              {/* Price row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">৳{medicine.pricePerUnit}</span>
                  <span className="text-sm text-gray-400">/ unit</span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">৳{medicine.mrpPerUnit}</span>
                  )}
                  {hasDiscount && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Available
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'Overview' && <OverviewTab medicine={medicine} />}
                {activeTab === 'Dosage' && <DosageTab medicine={medicine} />}
                {activeTab === 'Side Effects' && <SideEffectsTab medicine={medicine} />}
                {activeTab === 'Interactions' && <InteractionsTab medicine={medicine} />}
                {activeTab === 'Storage' && <StorageTab medicine={medicine} />}
              </div>
            </div>

            {/* Available Brands */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <AvailableBrandsSection medicine={medicine} allMedicines={medicines} />
            </div>
          </div>

          {/* ── RIGHT COLUMN (35%) sticky ── */}
          <aside className="hidden lg:flex flex-col gap-4 w-80 shrink-0 sticky top-20">

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Quick Info</h3>
              <dl className="space-y-3">
                {[
                  { label: 'Generic Name', value: medicine.generic },
                  { label: 'Category', value: medicine.category },
                  { label: 'Manufacturer', value: medicine.manufacturer },
                  { label: 'Pack Size', value: medicine.packSize },
                  { label: 'Price / Unit', value: `৳${medicine.pricePerUnit}` },
                  {
                    label: 'Price / Pack',
                    value: `৳${(medicine.pricePerUnit * parseInt(medicine.packSize)).toFixed(0) !== 'NaN'
                      ? (() => {
                          const match = medicine.packSize.match(/^(\d+)/);
                          return match ? (medicine.pricePerUnit * parseInt(match[1])).toFixed(2) : '—';
                        })()
                      : '—'}`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-gray-400 shrink-0">{label}</dt>
                    <dd className="text-xs font-semibold text-gray-700 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Medical Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                <h3 className="text-xs font-bold text-yellow-800">Medical Disclaimer</h3>
              </div>
              <p className="text-xs text-yellow-800 leading-relaxed mb-1">
                Always consult a registered doctor before taking any medicine.
              </p>
              <p className="text-xs text-yellow-700 leading-relaxed">
                এই তথ্য শুধুমাত্র সাধারণ জ্ঞানের জন্য। চিকিৎসকের পরামর্শ ছাড়া ওষুধ গ্রহণ করবেন না।
              </p>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <button
                onClick={() => setSaved((v) => !v)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  saved
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved to My List' : 'Save to My List'}
              </button>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print Info
              </button>
              <button className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-1">
                Report an Error
              </button>
            </div>

            {/* Consult Doctor Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <Stethoscope className="w-8 h-8 mb-3 opacity-80" />
              <h3 className="font-bold mb-1.5">Have questions about this medicine?</h3>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                Get personalized advice from a qualified doctor in Bangladesh.
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="w-full py-2.5 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors"
              >
                Talk to a Doctor
              </button>
            </div>

            {/* Related Medicines */}
            {relatedMedicines.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Related Medicines</h3>
                <div className="space-y-3">
                  {relatedMedicines.map((m) => (
                    <Link
                      key={m.id}
                      to={`/medicines/${m.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.generic}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-blue-600">৳{m.pricePerUnit}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSaved((v) => !v)}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-colors ${
            saved ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-200'
          }`}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => navigate('/doctors')}
          className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <Stethoscope className="w-4 h-4" />
          Talk to a Doctor
        </button>
      </div>

      <div className="pb-20 lg:pb-0" />
      <Footer />
    </div>
  );
}
