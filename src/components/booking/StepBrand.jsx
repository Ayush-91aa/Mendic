import { brands } from '../../data/repairData';
import { Smartphone } from 'lucide-react';

export default function StepBrand({ updateBooking, onNext }) {
  const handleSelect = (brand) => {
    updateBooking({ brand, model: null, issues: [], totalPrice: 0 });
    onNext();
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-bold text-dark mb-1">Select Your Brand</h3>
      <p className="text-sm text-muted mb-6">Choose the brand of your phone</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => handleSelect(brand)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50/50 transition-all duration-200 group"
          >
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-14 h-14 object-contain mix-blend-multiply" />
            ) : (
              <span className="text-4xl font-bold" style={{ color: brand.color }}>{brand.name[0]}</span>
            )}
            <span className="text-sm font-medium text-gray-600 group-hover:text-primary-500 transition-colors">{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
