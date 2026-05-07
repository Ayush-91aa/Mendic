import { ShieldCheck, Clock, Award, Cpu } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'Certified Technicians', desc: 'Skilled & verified experts' },
  { icon: Clock, title: 'Upto 180-Day Warranty', desc: 'On every repair we do' },
  { icon: Award, title: 'Certified Parts', desc: 'Genuine quality components' },
  { icon: Cpu, title: 'Same Day Service', desc: 'Quick turnaround time' },
];

export default function TrustBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-500 to-primary-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 text-white group">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/25 transition-colors backdrop-blur-sm">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
                <p className="text-primary-100 text-xs md:text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
