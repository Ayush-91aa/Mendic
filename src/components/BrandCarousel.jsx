import { brands } from '../data/repairData';

export default function BrandCarousel() {
  const doubled = [...brands, ...brands];

  return (
    <section className="py-12 md:py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Brands We Repair</h2>
        <p className="section-subtitle">Expert repair services for all major smartphone brands</p>

        <div className="mt-10 marquee-container overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee">
            {doubled.map((brand, i) => (
              <div key={`a-${i}`} className="flex-shrink-0 mx-4 md:mx-6">
                <div className="w-28 md:w-36 h-20 md:h-24 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center hover:shadow-md hover:border-primary-200 transition-all duration-300 group cursor-pointer px-4">
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-colors rounded-xl mx-auto" style={{ backgroundColor: brand.logo ? 'transparent' : brand.color + '15' }}>
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold" style={{ color: brand.color }}>{brand.name}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
