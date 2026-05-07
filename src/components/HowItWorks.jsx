import { CalendarCheck, MapPin, Banknote } from 'lucide-react';

const steps = [
  { icon: CalendarCheck, step: '01', title: 'Book Your Repair', desc: 'Select your device, choose the issue, and pick a convenient time slot.' },
  { icon: MapPin, step: '02', title: 'We Come to You', desc: 'Our certified technician visits your location at the scheduled time.' },
  { icon: Banknote, step: '03', title: 'Pay After Repair', desc: 'Pay only after your device is repaired and you are fully satisfied.' },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">How We Work</h2>
        <p className="section-subtitle">Getting your phone repaired is as easy as 1-2-3</p>

        <div className="grid md:grid-cols-3 gap-8 mt-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center group">
              {/* Step number badge */}
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-white rounded-2xl border-2 border-primary-100 flex items-center justify-center mx-auto shadow-lg group-hover:border-primary-500 group-hover:shadow-primary-100 transition-all duration-300 relative z-10">
                  <s.icon className="w-9 h-9 text-primary-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white text-sm font-bold z-20 shadow-md">
                  {s.step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
