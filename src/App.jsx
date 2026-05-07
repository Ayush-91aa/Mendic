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
import LoginModal from './components/LoginModal';
import BookingModal from './components/BookingModal';

function AppContent() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onOpenLogin={() => setLoginOpen(true)}
        onOpenBooking={() => setBookingOpen(true)}
      />
      <main>
        <HeroSection onOpenBooking={() => setBookingOpen(true)} />
        <TrustBanner />
        <BrandCarousel />
        <WhyChooseUs />
        <HowItWorks />
        <SEOSection />
      </main>
      <Footer />

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
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
