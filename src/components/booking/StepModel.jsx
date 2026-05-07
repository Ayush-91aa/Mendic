import { useState } from 'react';
import { models } from '../../data/repairData';
import { Search, Smartphone } from 'lucide-react';

export default function StepModel({ booking, updateBooking, onNext }) {
  const [search, setSearch] = useState('');
  const brandModels = models[booking.brand?.id] || [];
  const filtered = brandModels.filter(m => m.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (model) => {
    updateBooking({ model });
    onNext();
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-bold text-dark mb-1">Select Your Model</h3>
      <p className="text-sm text-muted mb-4">Choose your {booking.brand?.name} model</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search model..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-1">
        {filtered.map((model) => (
          <button
            key={model}
            onClick={() => handleSelect(model)}
            className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary-500 hover:bg-primary-50/50 transition-all text-left text-sm group"
          >
            <Smartphone className="w-4 h-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0 transition-colors" />
            <span className="text-gray-700 group-hover:text-primary-600 font-medium truncate">{model}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted text-sm">No models found for "{search}"</div>
        )}
      </div>
    </div>
  );
}
