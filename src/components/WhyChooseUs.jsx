const cards = [
  { img: '/features/icon1.webp', title: 'Transparent Work', desc: 'Complete visibility of repair process', color: 'blue' },
  { img: '/features/icon2.webp', title: 'Warranty On Repairing', desc: 'Guaranteed quality with warranty', color: 'green' },
  { img: '/features/icon3.webp', title: 'Certified Technician', desc: 'Expert technicians you can trust', color: 'yellow' },
  { img: '/features/icon4.webp', title: 'Quick Mobile Repairing', desc: 'Fast and efficient service', color: 'purple' },
];

const colorClasses = {
  blue: { bg: 'bg-blue-50', line: 'bg-blue-500' },
  green: { bg: 'bg-green-50', line: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-50', line: 'bg-yellow-500' },
  purple: { bg: 'bg-purple-50', line: 'bg-purple-500' },
};

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Why Choose Us</h2>
        <p className="section-subtitle">We're committed to providing the best mobile repair experience</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {cards.map((card, i) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center border border-gray-100/50 hover:-translate-y-1">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${colorClasses[card.color].bg}`}>
                <img src={card.img} alt={card.title} className="w-10 h-10 object-contain mix-blend-multiply" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight max-w-[150px] mx-auto">{card.title}</h3>
              <p className="text-sm text-gray-500 mb-8 px-2">{card.desc}</p>
              <div className={`w-8 h-1 rounded-full mt-auto ${colorClasses[card.color].line}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
