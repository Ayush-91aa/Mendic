import { useState } from 'react';
import {
  Laptop,
  Smartphone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

const dummyOrders = [
  {
    id: 'ORD-8941',
    deviceType: 'laptop',
    deviceModel: 'MacBook Pro M1 (16-inch, 2021)',
    issueDescription: 'Screen flickering and horizontal lines appearing after opening the hinge beyond 90 degrees. No external display issues.',
    location: 'Indiranagar 100ft Road, Bangalore',
    distance: '2.4 km away',
    timeSlot: 'Today, 4:00 PM – 6:00 PM',
    payout: '₹4,500 – ₹6,000',
    urgency: 'High Priority',
  },
  {
    id: 'ORD-8942',
    deviceType: 'mobile',
    deviceModel: 'iPhone 13 (128GB, Midnight)',
    issueDescription: 'Severe battery degradation (Health at 68%). Rapid draining and unexpected shutdowns when charge drops below 30%.',
    location: 'Koramangala 4th Block, Bangalore',
    distance: '3.8 km away',
    timeSlot: 'Tomorrow, 10:00 AM – 12:00 PM',
    payout: '₹2,800',
    urgency: 'Standard',
  },
];

export default function MechanicOrderFeed() {
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const handleAccept = (id) => {
    setAcceptedOrders((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark">Live Repair Requests</h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              {dummyOrders.length - acceptedOrders.length} Live Jobs
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            Accept verified laptop and mobile phone repair jobs in your service radius.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-semibold text-dark flex items-center gap-2">
            <span className="text-muted">Radius:</span>
            <span className="text-primary-600 font-bold">10 km (Bangalore)</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6">
        {dummyOrders.map((order) => {
          const isAccepted = acceptedOrders.includes(order.id);

          return (
            <div
              key={order.id}
              className={`card bg-white rounded-3xl border transition-all duration-300 p-6 sm:p-8 shadow-md hover:shadow-xl ${
                isAccepted ? 'border-green-300 bg-green-50/20' : 'border-gray-100 hover:border-primary-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                {/* Left info block */}
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-muted bg-gray-100 px-2.5 py-1 rounded-lg">
                      {order.id}
                    </span>
                    {order.deviceType === 'laptop' ? (
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5" />
                        Laptop Repair
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        Mobile Phone Repair
                      </span>
                    )}
                    {order.urgency === 'High Priority' && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {order.urgency}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-dark">{order.deviceModel}</h3>
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 leading-relaxed font-medium">
                      <span className="font-bold text-dark block text-xs uppercase tracking-wider mb-1 text-muted">
                        Reported Issue:
                      </span>
                      {order.issueDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-gray-700 font-medium">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span>{order.location}</span>
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                        {order.distance}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span>{order.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Right payout & action block */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
                  <div className="text-left md:text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                      Estimated Payout
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-green-600 tracking-tight block mt-1">
                      {order.payout}
                    </span>
                    <span className="text-[11px] text-muted block mt-0.5">Instant transfer via UPI</span>
                  </div>

                  <div className="w-full sm:w-auto">
                    {isAccepted ? (
                      <button
                        disabled
                        className="w-full px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-default"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Job Accepted</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAccept(order.id)}
                        className="w-full btn-primary py-3.5 px-8 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <span>Accept Job</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
