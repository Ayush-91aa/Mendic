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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: brand.color + '15' }}>
              <span className="text-xl font-bold" style={{ color: brand.color }}>{brand.name[0]}</span>
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-primary-500 transition-colors">{brand.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
