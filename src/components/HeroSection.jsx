import { CheckCircle, Shield, Award, Zap } from 'lucide-react';

export default function HeroSection({ onOpenBooking }) {
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

          {/* Right Visual */}
          <div className="relative flex items-center justify-center animate-slide-in-right">
            <div className="relative w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-300/30 to-primary-500/20 rounded-3xl blur-2xl scale-110" />
              {/* Phone comparison */}
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                <div className="grid grid-cols-2 gap-6 items-center">
                  {/* Broken phone */}
                  <div className="text-center space-y-3">
                    <div className="w-28 h-48 mx-auto bg-gray-900 rounded-2xl border-4 border-gray-700 relative overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-600/30 to-transparent" />
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-600 rounded-full" />
                      {/* Crack lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 170">
                        <path d="M20,0 L45,60 L30,80 L55,170" stroke="#ff4444" strokeWidth="2" fill="none" opacity="0.8" />
                        <path d="M45,60 L70,50 L80,90" stroke="#ff4444" strokeWidth="1.5" fill="none" opacity="0.6" />
                        <path d="M30,80 L15,120 L25,170" stroke="#ff4444" strokeWidth="1" fill="none" opacity="0.5" />
                      </svg>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-gray-600 rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-red-500">Before</p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-soft">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  </div>

                  {/* Fixed phone */}
                  <div className="text-center space-y-3">
                    <div className="w-28 h-48 mx-auto bg-gray-900 rounded-2xl border-4 border-gray-700 relative overflow-hidden shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-blue-400/20" />
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-600 rounded-full" />
                      <div className="absolute inset-4 top-8 flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="space-y-1.5 w-full">
                          <div className="h-1.5 bg-gray-700 rounded-full w-full" />
                          <div className="h-1.5 bg-gray-700 rounded-full w-3/4" />
                          <div className="h-1.5 bg-primary-500/40 rounded-full w-1/2" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-gray-600 rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-green-500">After</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
