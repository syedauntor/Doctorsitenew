import { Link } from 'react-router-dom';
import DoctorCard from './DoctorCard';
import { doctors } from '../data/doctors';

const FEATURED_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FeaturedDoctors() {
  const featured = doctors
    .filter((d) => FEATURED_IDS.includes(d.id))
    .map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      degrees: d.degrees,
      chamber: d.chamber,
      fee: d.fee,
      rating: d.rating,
      reviews: d.reviews,
      experience: d.experience,
      availableToday: d.availableToday,
      bookingEnabled: d.bookingEnabled,
      queueActive: d.queueActive,
      verified: d.verified,
      image: d.image,
      queue: d.queue,
      slug: d.profile?.slug,
    }));

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

      </div>
    </section>
  );
}
