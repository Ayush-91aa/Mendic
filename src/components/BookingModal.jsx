import { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import StepBrand from './booking/StepBrand';
import StepModel from './booking/StepModel';
import StepIssue from './booking/StepIssue';
import StepDetails from './booking/StepDetails';
import StepConfirmation from './booking/StepConfirmation';

const stepLabels = ['Brand', 'Model', 'Issue', 'Details', 'Confirmed'];

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({
    brand: null,
    model: null,
    issues: [],
    totalPrice: 0,
    name: '',
    phone: '',
    address: '',
    date: '',
    timeSlot: '',
  });

  if (!isOpen) return null;

  const updateBooking = (data) => setBooking(prev => ({ ...prev, ...data }));
  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleClose = () => {
    setStep(1);
    setBooking({ brand: null, model: null, issues: [], totalPrice: 0, name: '', phone: '', address: '', date: '', timeSlot: '' });
    onClose();
  };

  const progress = (step / 5) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {step > 1 && step < 5 && (
              <button onClick={back} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div>
              <h2 className="font-bold text-dark text-lg">Book Your Repair</h2>
              <p className="text-xs text-muted">Step {step} of 5 — {stepLabels[step - 1]}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-primary-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && <StepBrand booking={booking} updateBooking={updateBooking} onNext={next} />}
          {step === 2 && <StepModel booking={booking} updateBooking={updateBooking} onNext={next} />}
          {step === 3 && <StepIssue booking={booking} updateBooking={updateBooking} onNext={next} />}
          {step === 4 && <StepDetails booking={booking} updateBooking={updateBooking} onNext={next} />}
          {step === 5 && <StepConfirmation booking={booking} onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}
