import { Eye, Shield, Award, Zap } from 'lucide-react';

const cards = [
  { icon: Eye, title: 'Transparent Work', desc: 'Watch your device being repaired in front of you. No hidden charges, no surprises.' },
  { icon: Shield, title: 'Warranty On Repairing', desc: 'Get up to 180-day warranty on all repairs. Your satisfaction is our priority.' },
  { icon: Award, title: 'Certified Technician', desc: 'Our technicians are trained and certified to handle all types of phone repairs.' },
  { icon: Zap, title: 'Quick Mobile Repairing', desc: 'Most repairs completed in 30-60 minutes. Get your phone back in no time.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">We're committed to providing the best mobile repair experience</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {cards.map((card, i) => (
            <div key={card.title} className="card text-center group hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 transition-colors duration-300">
                <card.icon className="w-7 h-7 text-primary-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-dark mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
