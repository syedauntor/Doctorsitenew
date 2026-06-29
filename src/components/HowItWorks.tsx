import { Search, CalendarCheck, HeartPulse, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Search Doctor',
    desc: 'Search by name, specialty, or location to find the right specialist for your health needs.',
    color: 'bg-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Book Appointment',
    desc: 'Select a convenient time slot and book your appointment instantly — no phone calls needed.',
    color: 'bg-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    icon: HeartPulse,
    step: '03',
    title: 'Get Treatment',
    desc: 'Visit the doctor at the scheduled time or have an online consultation from your home.',
    color: 'bg-orange-500',
    light: 'bg-orange-50',
    text: 'text-orange-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            Getting quality healthcare in Bangladesh has never been easier. Follow these 3 simple steps.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200" style={{ left: '22%', right: '22%' }} />

          {steps.map(({ icon: Icon, step, title, desc, color, light, text }, i) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              {/* Step number badge */}
              <div className="relative mb-5">
                <div className={`w-20 h-20 ${light} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-9 h-9 ${text}`} />
                </div>
                <div className={`absolute -top-2 -right-2 w-7 h-7 ${color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>

              {i < steps.length - 1 && (
                <div className="md:hidden mt-6">
                  <ArrowRight className="w-5 h-5 text-gray-300 rotate-90 mx-auto" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#doctors"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-lg shadow-blue-200"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
