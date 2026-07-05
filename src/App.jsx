import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Show } from '@clerk/react';
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
import MechanicDashboard from './components/mechanic/MechanicDashboard';
import MechanicAuth from './components/mechanic/MechanicAuth';
import AdminDashboard from './components/admin/AdminDashboard';

function LandingPage() {
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
      <BrowserRouter>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Control Center Route */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Dedicated Mechanic Auth Route */}
          <Route path="/mechanic/join/*" element={<MechanicAuth />} />

          {/* Protected Mechanic Portal Route */}
          <Route
            path="/mechanic/*"
            element={
              <>
                <Show when="signed-in">
                  <MechanicDashboard />
                </Show>
                <Show when="signed-out">
                  <Navigate to="/mechanic/join" replace />
                </Show>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
