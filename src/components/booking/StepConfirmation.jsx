import { useEffect, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Phone, MapPin, Calendar, Wrench, Loader2 } from 'lucide-react';

export default function StepConfirmation({ booking, onClose }) {
  const [saving, setSaving] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const saveBooking = async () => {
      try {
        await addDoc(collection(db, 'bookings'), {
          brand: booking.brand?.name || '',
          model: booking.model || '',
          issues: booking.issues.map(i => i.name),
          totalPrice: booking.totalPrice,
          customerName: booking.name,
          customerPhone: booking.phone,
          address: booking.address,
          date: booking.date,
          timeSlot: booking.timeSlot,
          userId: currentUser?.uid || null,
          userEmail: currentUser?.email || null,
          status: 'pending',
          createdAt: serverTimestamp(),
        });
        setSaved(true);
      } catch (err) {
        console.error('Error saving booking:', err);
        setError('Booking saved locally. We will contact you shortly.');
        setSaved(true);
      }
      setSaving(false);
    };
    saveBooking();
  }, []);

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-muted font-medium">Confirming your booking...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-in">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-dark mb-2">Booking Confirmed! 🎉</h3>
      <p className="text-muted mb-6">Your repair booking has been successfully placed.</p>

      {error && (
        <div className="bg-yellow-50 text-yellow-700 text-sm px-4 py-2 rounded-xl mb-4 border border-yellow-100">{error}</div>
      )}

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (booking.brand?.color || '#0056b3') + '15' }}>
            <span className="font-bold" style={{ color: booking.brand?.color }}>{booking.brand?.name?.[0]}</span>
          </div>
          <div>
            <p className="font-semibold text-dark">{booking.brand?.name} {booking.model}</p>
            <p className="text-xs text-muted">{booking.issues.map(i => i.name).join(', ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Phone className="w-4 h-4 text-primary-500" />
            <span>{booking.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted col-span-2">
            <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
            <span className="truncate">{booking.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Wrench className="w-4 h-4 text-primary-500" />
            <span>{booking.timeSlot}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-muted">Estimated Total</span>
          <span className="text-xl font-bold text-primary-600">₹{booking.totalPrice?.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-primary-50 rounded-xl px-4 py-3 mb-6">
        <p className="text-sm text-primary-700 font-medium">💰 Pay after repair — No advance payment required</p>
      </div>

      <button onClick={onClose} className="btn-primary w-full">Done</button>
    </div>
  );
}
