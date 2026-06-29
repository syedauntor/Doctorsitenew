import { Users, UserCheck, CalendarCheck, Star } from 'lucide-react';

const stats = [
  { icon: UserCheck, label: 'Total Doctors', value: '8,500+', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, label: 'Total Patients', value: '2,40,000+', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: CalendarCheck, label: 'Total Appointments', value: '15,00,000+', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Star, label: 'Avg. Rating', value: '4.8 / 5', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

export default function StatsBar() {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
