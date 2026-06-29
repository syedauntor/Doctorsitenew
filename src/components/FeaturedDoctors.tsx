import { Link } from 'react-router-dom';
import DoctorCard from './DoctorCard';
import type { DoctorCardData } from './DoctorCard';

const doctors: DoctorCardData[] = [
  {
    id: 1,
    name: 'Dr. Fahmida Rahman',
    specialty: 'Cardiologist',
    degrees: 'MBBS, MD (Cardiology), FRCP',
    chamber: 'Apollo Hospital, Bashundhara, Dhaka',
    fee: 1200,
    rating: 4.9,
    reviews: 312,
    experience: 15,
    availableToday: true,
    verified: true,
    queue: 4,
    slug: 'dr-fahmida-rahman',
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 2,
    name: 'Dr. Mahbubur Hossain',
    specialty: 'Neurologist',
    degrees: 'MBBS, MD (Neurology), FCPS',
    chamber: 'Square Hospital, Panthapath, Dhaka',
    fee: 1500,
    rating: 4.8,
    reviews: 245,
    experience: 18,
    availableToday: true,
    verified: true,
    queue: 7,
    slug: 'dr-mahbubur-hossain',
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 3,
    name: 'Dr. Nasrin Sultana',
    specialty: 'Pediatrician',
    degrees: 'MBBS, DCH, MD (Pediatrics)',
    chamber: 'Dhaka Medical College Hospital',
    fee: 800,
    rating: 4.9,
    reviews: 503,
    experience: 12,
    availableToday: false,
    verified: true,
    queue: 0,
    image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 4,
    name: 'Dr. Rezaul Karim',
    specialty: 'Orthopedic',
    degrees: 'MBBS, MS (Orthopedics), FCPS',
    chamber: 'BIRDEM General Hospital, Dhaka',
    fee: 1000,
    rating: 4.7,
    reviews: 188,
    experience: 20,
    availableToday: true,
    verified: false,
    queue: 3,
    image: 'https://images.pexels.com/photos/4253089/pexels-photo-4253089.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 5,
    name: 'Dr. Tasneem Akter',
    specialty: 'Dermatologist',
    degrees: 'MBBS, DDV, MD (Dermatology)',
    chamber: 'United Hospital, Gulshan, Dhaka',
    fee: 900,
    rating: 4.8,
    reviews: 274,
    experience: 10,
    availableToday: true,
    verified: true,
    queue: 2,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 6,
    name: 'Dr. Imtiaz Ahmed',
    specialty: 'General Physician',
    degrees: 'MBBS, MD (Psychiatry), FCPS',
    chamber: 'National Institute of Mental Health',
    fee: 1100,
    rating: 4.6,
    reviews: 142,
    experience: 14,
    availableToday: true,
    verified: false,
    queue: 5,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 7,
    name: 'Dr. Shahida Parvin',
    specialty: 'Gynecologist',
    degrees: 'MBBS, FCPS (Gynecology & Obs.)',
    chamber: 'Popular Medical College Hospital',
    fee: 1300,
    rating: 4.9,
    reviews: 391,
    experience: 16,
    availableToday: true,
    verified: true,
    queue: 6,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 8,
    name: 'Dr. Faisal Haque',
    specialty: 'Eye Specialist',
    degrees: 'MBBS, DO (Ophthalmology), FCPS',
    chamber: 'National Eye Care Hospital, Dhaka',
    fee: 700,
    rating: 4.7,
    reviews: 163,
    experience: 11,
    availableToday: false,
    verified: true,
    queue: 0,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function FeaturedDoctors() {
  return (
    <section id="doctors" className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Our Specialists</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Doctors</h2>
            <p className="text-gray-500 mt-2 text-base">Experienced doctors ready to help you</p>
          </div>
          <Link
            to="/doctors"
            className="shrink-0 px-5 py-2.5 border border-blue-600 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-150"
          >
            View All Doctors
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

      </div>
    </section>
  );
}
