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
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-50" />

          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center group hover:-translate-y-2 transition-transform duration-300">
              {/* Icon box */}
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-md border border-primary-100 group-hover:shadow-xl group-hover:shadow-primary-500/20 group-hover:border-primary-500 transition-all duration-300 relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <s.icon className="w-9 h-9 text-primary-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 relative z-10" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary-600 transition-colors duration-300">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
