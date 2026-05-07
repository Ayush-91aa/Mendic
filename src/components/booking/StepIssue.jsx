import { issues } from '../../data/repairData';
import { Check } from 'lucide-react';

export default function StepIssue({ booking, updateBooking, onNext }) {
  const selected = booking.issues || [];

  const toggle = (issue) => {
    const exists = selected.find(i => i.id === issue.id);
    let updated;
    if (exists) {
      updated = selected.filter(i => i.id !== issue.id);
    } else {
      updated = [...selected, issue];
    }
    const total = updated.reduce((sum, i) => sum + i.price, 0);
    updateBooking({ issues: updated, totalPrice: total });
  };

  const isSelected = (id) => selected.some(i => i.id === id);

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-bold text-dark mb-1">Select Issues</h3>
      <p className="text-sm text-muted mb-4">What's wrong with your {booking.model}?</p>

      <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
        {issues.map((issue) => (
          <button
            key={issue.id}
            onClick={() => toggle(issue)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left ${
              isSelected(issue.id)
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              isSelected(issue.id) ? 'bg-primary-500' : 'bg-gray-100'
            }`}>
              {isSelected(issue.id) && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-lg flex-shrink-0">{issue.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-dark">{issue.name}</span>
            </div>
            <span className={`text-sm font-bold flex-shrink-0 ${isSelected(issue.id) ? 'text-primary-600' : 'text-gray-500'}`}>
              ₹{issue.price.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      {/* Total & Continue */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted">Estimated Total</p>
          <p className="text-2xl font-bold text-primary-600">
            ₹{booking.totalPrice?.toLocaleString() || 0}
          </p>
        </div>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="btn-primary px-8 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
