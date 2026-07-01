import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';

export interface DobAgeValue {
  dob: string;       // ISO date string "YYYY-MM-DD", or ""
  ageManual: string; // manual age string, or ""
}

interface DobAgeInputProps {
  value: DobAgeValue;
  onChange: (v: DobAgeValue) => void;
  required?: boolean;
  size?: 'sm' | 'md';
}

function calcAge(dob: string): { years: number; months: number; days: number } | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  if (years < 0) return null;
  return { years, months, days };
}

export function formatAgeFromDob(dob: string): string {
  const a = calcAge(dob);
  if (!a) return '';
  if (a.years > 0) return `${a.years}y ${a.months}m ${a.days}d`;
  if (a.months > 0) return `${a.months}m ${a.days}d`;
  return `${a.days} days`;
}

export function formatAgeLong(dob: string): string {
  const a = calcAge(dob);
  if (!a) return '';
  const parts: string[] = [];
  if (a.years) parts.push(`${a.years} year${a.years !== 1 ? 's' : ''}`);
  if (a.months) parts.push(`${a.months} month${a.months !== 1 ? 's' : ''}`);
  if (a.days) parts.push(`${a.days} day${a.days !== 1 ? 's' : ''}`);
  return parts.join(' ') || '0 days';
}

export function getAgeYears(v: DobAgeValue): number {
  if (v.dob) return calcAge(v.dob)?.years ?? 0;
  return parseInt(v.ageManual) || 0;
}

export function formatAgeShort(v: DobAgeValue): string {
  if (v.dob) { const y = calcAge(v.dob)?.years; return y != null ? `${y}y` : ''; }
  if (v.ageManual) return `${v.ageManual}y (approx)`;
  return '';
}

export function formatAgePrescription(v: DobAgeValue): string {
  if (v.dob) return formatAgeLong(v.dob);
  if (v.ageManual) return `${v.ageManual} years (approx.)`;
  return '';
}

export default function DobAgeInput({ value, onChange, required, size = 'md' }: DobAgeInputProps) {
  const inputCls = size === 'sm'
    ? 'w-full px-3 py-2 border rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
    : 'w-full px-3.5 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  const computed = value.dob ? calcAge(value.dob) : null;
  const dobDisabled = !!value.ageManual;
  const ageDisabled = !!value.dob;

  return (
    <div className="space-y-3">
      {/* DOB row */}
      <div>
        <label className={`block font-semibold mb-1 ${size === 'sm' ? 'text-[11px]' : 'text-xs'} text-gray-600`}>
          Date of Birth{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          <CalendarDays className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`} />
          <input
            type="date"
            value={value.dob}
            disabled={dobDisabled}
            onChange={(e) => onChange({ dob: e.target.value, ageManual: '' })}
            className={`${inputCls} ${size === 'sm' ? 'pl-7' : 'pl-10'} ${dobDisabled ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-gray-200'}`}
          />
        </div>
        {/* Computed age */}
        {computed && (
          <p className={`mt-1 font-semibold text-green-700 flex items-center gap-1 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Age: {formatAgeLong(value.dob)}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className={`text-gray-400 font-semibold ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>— OR —</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Age manual row */}
      <div>
        <label className={`block font-semibold mb-1 ${size === 'sm' ? 'text-[11px]' : 'text-xs'} text-gray-600`}>
          Age only <span className={`font-normal ${size === 'sm' ? 'text-[10px]' : 'text-[11px]'} text-gray-400`}>(if DOB unknown)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="120"
            placeholder="47"
            value={value.ageManual}
            disabled={ageDisabled}
            onChange={(e) => onChange({ dob: '', ageManual: e.target.value })}
            className={`${inputCls} ${ageDisabled ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-gray-200'}`}
            style={{ maxWidth: size === 'sm' ? 72 : 88 }}
          />
          <span className={`text-gray-500 font-semibold shrink-0 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>years</span>
          {value.ageManual && !ageDisabled && (
            <span className={`text-amber-600 font-semibold ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>(approximate)</span>
          )}
        </div>
      </div>
    </div>
  );
}
