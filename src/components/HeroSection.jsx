import { CheckCircle, Shield, Award, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection({ onOpenBooking }) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFixed((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-500 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Now in Jaipur
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-tight">
              Mobile Repair{' '}
              <span className="text-gradient">at Home</span>
            </h1>

            <p className="text-lg text-muted max-w-lg">
              Get your phone repaired at your doorstep by certified technicians.
              Fast, reliable, and hassle-free service.
            </p>

            <ul className="space-y-3">
              {[
                { icon: CheckCircle, text: 'Screen replacement' },
                { icon: Shield, text: 'Battery repair' },
                { icon: Award, text: 'Water damage fix' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={onOpenBooking} className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
                Book Mobile Repair at Home
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>


          </div>

          {/* Right Visual - Animated Phone */}
          <div className="relative flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full max-w-sm mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300/40 to-primary-500/30 rounded-[3rem] blur-2xl scale-105" />
              
              {/* Image Container */}
              <div className="relative shadow-2xl overflow-hidden aspect-[9/19] w-full max-w-[280px] mx-auto rounded-[2.5rem] bg-transparent">
                {/* Dynamic Screen Images */}
                <div className="relative w-full h-full bg-transparent">
                   {/* Broken Screen (scaled to crop black padding) */}
                   <img 
                     src="/images/broken-screen.png" 
                     alt="Broken Screen" 
                     className={`absolute inset-0 w-full h-full object-cover scale-[1.4] object-center transition-opacity duration-1000 ${isFixed ? 'opacity-0' : 'opacity-100'}`} 
                   />
                   {/* Fixed Screen */}
                   <img 
                     src="/images/fixed-screen.png" 
                     alt="Fixed Screen" 
                     className={`absolute inset-0 w-full h-full object-cover scale-[1.4] object-center transition-opacity duration-1000 ${isFixed ? 'opacity-100' : 'opacity-0'}`} 
                   />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
