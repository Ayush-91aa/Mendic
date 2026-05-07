import { useState } from 'react';
import { timeSlots } from '../../data/repairData';
import { User, Phone, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';

export default function StepDetails({ booking, updateBooking, onNext }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!booking.name?.trim()) e.name = 'Name is required';
    if (!booking.phone?.trim()) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(booking.phone.trim())) e.phone = 'Enter valid 10-digit number';
    if (!booking.address?.trim()) e.address = 'Address is required';
    if (!booking.date) e.date = 'Select a date';
    if (!booking.timeSlot) e.timeSlot = 'Select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onNext(); }, 500);
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm transition-all ${errors[field] ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`;

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-bold text-dark mb-1">Your Details</h3>
      <p className="text-sm text-muted mb-5">Tell us where and when to come</p>

      <div className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Full Name" value={booking.name} onChange={e => { updateBooking({ name: e.target.value }); setErrors(p => ({ ...p, name: '' })); }} className={inputClass('name')} />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="tel" placeholder="Phone Number" maxLength={10} value={booking.phone} onChange={e => { updateBooking({ phone: e.target.value.replace(/\D/g, '') }); setErrors(p => ({ ...p, phone: '' })); }} className={inputClass('phone')} />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
        </div>

        <div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea placeholder="Full Address" rows={2} value={booking.address} onChange={e => { updateBooking({ address: e.target.value }); setErrors(p => ({ ...p, address: '' })); }} className={`${inputClass('address')} resize-none`} />
          </div>
          {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
        </div>

        <div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="date" min={today} max={maxDate} value={booking.date} onChange={e => { updateBooking({ date: e.target.value }); setErrors(p => ({ ...p, date: '' })); }} className={inputClass('date')} />
          </div>
          {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark mb-2">
            <Clock className="w-4 h-4 text-gray-400" /> Preferred Time Slot
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map(slot => (
              <button key={slot} onClick={() => { updateBooking({ timeSlot: slot }); setErrors(p => ({ ...p, timeSlot: '' })); }}
                className={`px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${booking.timeSlot === slot ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                {slot}
              </button>
            ))}
          </div>
          {errors.timeSlot && <p className="text-red-500 text-xs mt-1 ml-1">{errors.timeSlot}</p>}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Booking'}
      </button>
    </div>
  );
}
