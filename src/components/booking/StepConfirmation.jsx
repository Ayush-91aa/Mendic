import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Phone, MapPin, Calendar, Wrench, Loader2, ShieldCheck, Radio, UserCheck } from 'lucide-react';

export default function StepConfirmation({ booking, onClose }) {
  const [saving, setSaving] = useState(true);
  const [orderStatus, setOrderStatus] = useState('searching_mechanic'); // 'searching_mechanic' | 'accepted' | 'error'
  const [assignedMechanic, setAssignedMechanic] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    let pollTimer;
    const saveOrder = async () => {
      try {
        // Save locally as fallback
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localId = 'booking_' + Math.random().toString(36).substr(2, 9);
        const newBooking = {
          id: localId,
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
          status: 'searching_mechanic',
          createdAt: new Date().toISOString(),
        };
        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Post to remote live Worker API
        const res = await fetch('https://mendic-api.mendic.workers.dev/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: currentUser?.uid || null,
            customerName: booking.name,
            customerPhone: booking.phone,
            customerEmail: currentUser?.email || null,
            address: booking.address,
            deviceType: booking.brand?.type || 'laptop',
            brand: booking.brand?.name || '',
            model: booking.model || '',
            issueDescription: booking.issues.map(i => i.name).join(', '),
            estimatedPrice: booking.totalPrice || 0,
            timeSlot: booking.timeSlot || 'As soon as possible'
          }),
        }).then(r => r.json());

        if (res.success && res.orderId) {
          setOrderId(res.orderId);
        }
      } catch (err) {
        console.error('Error creating live order:', err);
        setError('Order saved locally. Broadcasting to nearby technicians...');
      } finally {
        setTimeout(() => setSaving(false), 800);
      }
    };

    saveOrder();

    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, []);

  // Poll for mechanic acceptance if order was submitted
  useEffect(() => {
    if (!saving && currentUser?.uid && orderStatus === 'searching_mechanic') {
      const checkStatus = async () => {
        try {
          const res = await fetch(`https://mendic-api.mendic.workers.dev/api/orders/user/${currentUser.uid}`).then(r => r.json());
          if (res.success && res.orders && res.orders.length > 0) {
            const latest = res.orders[0];
            if (latest.status === 'accepted') {
              setOrderStatus('accepted');
              setAssignedMechanic({
                name: latest.mechanic_name || 'Verified Technician',
                phone: latest.mechanic_phone || 'Contact Support'
              });
            }
          }
        } catch (err) {
          console.error('Error polling order status:', err);
        }
      };

      const pollTimer = setInterval(checkStatus, 3000);
      return () => clearInterval(pollTimer);
    }
  }, [saving, currentUser, orderStatus]);

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-muted font-medium">Broadcasting order to verified technicians...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in text-center">
      {/* Dynamic Header State */}
      {orderStatus === 'searching_mechanic' ? (
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75" />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-white">
              <Radio className="w-9 h-9 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-dark mt-4 mb-1">Looking for Nearby Mechanic...</h3>
          <p className="text-sm text-muted max-w-sm mx-auto">
            Your request is currently live on the technician broadcast feed. Waiting for an Admin-Verified mechanic to accept.
          </p>
        </div>
      ) : (
        <div className="mb-6 animate-bounce-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-dark mt-4 mb-1">Booking Confirmed! 🎉</h3>
          <p className="text-sm text-muted">A verified technician has accepted your job!</p>
        </div>
      )}

      {/* Assigned Mechanic Banner (If Accepted) */}
      {orderStatus === 'accepted' && assignedMechanic && (
        <div className="bg-green-50/80 border border-green-200 rounded-2xl p-4 text-left mb-6 flex items-center justify-between shadow-sm animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 block">Assigned Verified Technician</span>
              <p className="text-base font-extrabold text-dark">{assignedMechanic.name}</p>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-green-600" /> {assignedMechanic.phone}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-white text-green-700 rounded-lg text-xs font-bold border border-green-200 shadow-2xs">On The Way</span>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 text-yellow-700 text-xs px-4 py-2 rounded-xl mb-4 border border-yellow-100">{error}</div>
      )}

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-4 mb-6 border border-gray-100/80">
        <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: (booking.brand?.color || '#0056b3') + '15', color: booking.brand?.color }}>
              {booking.brand?.name?.[0]}
            </div>
            <div>
              <p className="font-bold text-dark">{booking.brand?.name} {booking.model}</p>
              <p className="text-xs text-muted">{booking.issues.map(i => i.name).join(', ')}</p>
            </div>
          </div>
          {orderId && <span className="text-xs font-mono font-bold bg-gray-200 px-2 py-0.5 rounded text-dark">{orderId}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <Phone className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-medium text-dark">{booking.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Calendar className="w-3.5 h-3.5 text-primary-500" />
            <span className="font-medium text-dark">{booking.date}</span>
          </div>
          <div className="flex items-center gap-2 text-muted col-span-2">
            <MapPin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="truncate font-medium text-dark">{booking.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted col-span-2">
            <Wrench className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            <span className="font-medium text-dark">Slot: {booking.timeSlot}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Estimated Total</span>
          <span className="text-lg font-extrabold text-primary-600">₹{booking.totalPrice?.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-primary-50/70 rounded-xl px-4 py-3 mb-6 border border-primary-100 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary-600 flex-shrink-0" />
        <p className="text-xs text-primary-700 font-semibold">💰 Pay after repair — No advance payment required</p>
      </div>

      <button onClick={onClose} className="btn-primary w-full py-3.5 font-bold shadow-md">Done & Return to Home</button>
    </div>
  );
}
