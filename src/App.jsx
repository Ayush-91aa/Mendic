import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TrustBanner from './components/TrustBanner';
import BrandCarousel from './components/BrandCarousel';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import SEOSection from './components/SEOSection';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

function AppContent() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenBooking={() => setBookingOpen(true)} />
      <main>
        <HeroSection onOpenBooking={() => setBookingOpen(true)} />
        <TrustBanner />
        <BrandCarousel />
        <WhyChooseUs />
        <HowItWorks />
        <SEOSection />
      </main>
      <Footer />

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
