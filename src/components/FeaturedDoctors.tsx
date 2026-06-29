import { Star, Clock, MapPin, Calendar, Users } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: 'Dr. Fahmida Rahman',
    specialty: 'Cardiologist',
    hospital: 'Apollo Hospital, Dhaka',
    fee: '৳ 1,200',
    rating: 4.9,
    reviews: 312,
    experience: '15 yrs',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    queue: 4,
  },
  {
    id: 2,
    name: 'Dr. Mahbubur Hossain',
    specialty: 'Neurologist',
    hospital: 'Square Hospital, Dhaka',
    fee: '৳ 1,500',
    rating: 4.8,
    reviews: 245,
    experience: '18 yrs',
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    queue: 7,
  },
  {
    id: 3,
    name: 'Dr. Nasrin Sultana',
    specialty: 'Pediatrician',
    hospital: 'Dhaka Medical College',
    fee: '৳ 800',
    rating: 4.9,
    reviews: 503,
    experience: '12 yrs',
    image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: false,
    queue: 0,
  },
  {
    id: 4,
    name: 'Dr. Rezaul Karim',
    specialty: 'Orthopedist',
    hospital: 'BIRDEM Hospital, Dhaka',
    fee: '৳ 1,000',
    rating: 4.7,
    reviews: 188,
    experience: '20 yrs',
    image: 'https://images.pexels.com/photos/4253089/pexels-photo-4253089.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    queue: 3,
  },
  {
    id: 5,
    name: 'Dr. Tasneem Akter',
    specialty: 'Dermatologist',
    hospital: 'United Hospital, Dhaka',
    fee: '৳ 900',
    rating: 4.8,
    reviews: 274,
    experience: '10 yrs',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    queue: 2,
  },
  {
    id: 6,
    name: 'Dr. Imtiaz Ahmed',
    specialty: 'Psychiatrist',
    hospital: 'National Institute, Dhaka',
    fee: '৳ 1,100',
    rating: 4.6,
    reviews: 142,
    experience: '14 yrs',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    available: true,
    queue: 5,
  },
];

function DoctorCard({ doctor }: { doctor: typeof doctors[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              doctor.available
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            {doctor.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-gray-800">{doctor.rating}</span>
          <span className="text-xs text-gray-400">({doctor.reviews})</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-0.5">{doctor.name}</h3>
        <p className="text-blue-600 text-sm font-medium mb-3">{doctor.specialty}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {doctor.hospital}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {doctor.experience} Experience
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Consultation Fee</p>
            <p className="text-lg font-bold text-gray-900">{doctor.fee}</p>
          </div>
          {doctor.available && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Live Queue</p>
              <div className="flex items-center gap-1 justify-end">
                <Users className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-sm font-bold text-orange-500">{doctor.queue} waiting</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Book Appointment
          </button>
          <button className="flex-none px-3.5 py-2.5 border border-blue-200 text-blue-600 text-xs font-semibold rounded-xl hover:bg-blue-50 active:scale-95 transition-all duration-150 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Queue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedDoctors() {
  return (
    <section id="doctors" className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Specialists</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Doctors</h2>
            <p className="text-gray-500 mt-2 text-base">Experienced doctors ready to help you</p>
          </div>
          <a
            href="#"
            className="shrink-0 px-5 py-2.5 border border-blue-600 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-150"
          >
            View All Doctors
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}
