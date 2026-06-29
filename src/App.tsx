import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import FeaturedDoctors from './components/FeaturedDoctors';
import HowItWorks from './components/HowItWorks';
import FeaturedMedicines from './components/FeaturedMedicines';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsBar />
        <FeaturedDoctors />
        <HowItWorks />
        <FeaturedMedicines />
      </main>
      <Footer />
    </div>
  );
}
