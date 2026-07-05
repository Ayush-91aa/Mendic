import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Users, Wrench, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Phone, MapPin, Laptop, Smartphone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ADMIN_EMAILS = [
  'mendicindia@gmail.com',
  'divyaprakashsinghchauhan1234@gmail.com',
  'dpsc90071@gmail.com',
  'modulusfunctio9@gmail.com'
];

export default function AdminDashboard() {
  const { currentUser, login } = useAuth();
  const [activeTab, setActiveTab] = useState('mechanics'); // 'mechanics' | 'orders'
  const [mechanics, setMechanics] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passphrase, setPassphrase] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = currentUser && (currentUser.role === 'admin' || ADMIN_EMAILS.includes(currentUser.email?.toLowerCase()));
  const hasAccess = isAdmin || unlocked;

  const fetchData = async () => {
    setLoading(true);
    try {
      const API_BASE = 'https://mendic-api.mendic.workers.dev';
      const [mechRes, ordRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/mechanics`).then(r => r.json()),
        fetch(`${API_BASE}/api/admin/orders`).then(r => r.json())
      ]);
      if (mechRes.success) setMechanics(mechRes.mechanics);
      if (ordRes.success) setOrders(ordRes.orders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchData();
    }
  }, [hasAccess]);

  const handleVerifyMechanic = async (mechId) => {
    setActionLoading(mechId);
    try {
      const res = await fetch(`https://mendic-api.mendic.workers.dev/api/admin/mechanics/${mechId}/verify`, {
        method: 'PATCH',
      }).then(r => r.json());
      if (res.success) {
        setMechanics(prev => prev.map(m => m.id === mechId ? { ...m, verification_status: 'verified' } : m));
      }
    } catch (err) {
      console.error('Failed to verify mechanic:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="card bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto border border-primary-100">
            <ShieldCheck className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Admin Portal</h1>
            <p className="text-sm text-muted mt-2">Please log in with an authorized owner account to access the Mendic Control Center.</p>
          </div>
          <button onClick={login} className="btn-primary w-full py-3.5 font-bold">Log In to Admin</button>
          <Link to="/" className="inline-block text-xs text-muted hover:text-dark">← Back to Landing Page</Link>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="card bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl border border-gray-100">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-100">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">Restricted Access</h1>
            <p className="text-sm text-muted mt-2">Logged in as <strong>{currentUser.email}</strong>.<br />Enter the Admin Passphrase to unlock marketplace controls.</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Enter Admin Passphrase (MENDIC_ADMIN_2026)"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-center font-mono focus:border-primary-500 outline-none"
            />
            <button
              onClick={() => { if (passphrase === 'MENDIC_ADMIN_2026') setUnlocked(true); else alert('Incorrect passphrase!'); }}
              className="btn-primary w-full py-3 font-bold"
            >
              Unlock Dashboard
            </button>
          </div>
          <Link to="/" className="inline-block text-xs text-muted hover:text-dark">← Back to Landing Page</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-dark hover:bg-gray-50 transition-all text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Landing Page</span>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <span className="text-xl font-nasalization tracking-wide block leading-none text-dark">MENDIC</span>
                <span className="text-[10px] font-bold tracking-wider text-primary-500 uppercase block mt-1">Admin Control Center</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all flex items-center gap-1.5 text-xs font-semibold">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-primary-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span>Admin Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === 'mechanics' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-muted hover:text-dark'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Technicians Verification</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-dark font-mono">{mechanics.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
              activeTab === 'orders' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-muted hover:text-dark'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Marketplace Orders</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-dark font-mono">{orders.length}</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted font-medium">Loading marketplace records...</div>
        ) : activeTab === 'mechanics' ? (
          /* Mechanics Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mechanics.length === 0 ? (
              <div className="col-span-2 py-16 text-center bg-white rounded-3xl border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted font-medium">No technician onboarding applications yet.</p>
              </div>
            ) : (
              mechanics.map(mech => (
                <div key={mech.id} className="card bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-muted bg-gray-100 px-2 py-0.5 rounded-md">{mech.id}</span>
                      <h3 className="text-lg font-bold text-dark mt-1">{mech.full_name}</h3>
                      <p className="text-xs text-primary-600 font-semibold uppercase">{mech.specializations || 'Repair'} Specialist • {mech.experience_years} Yrs Exp</p>
                    </div>
                    {mech.verification_status === 'verified' ? (
                      <span className="px-3 py-1 rounded-xl bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Partner
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Verification
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary-500" />
                      <span>{mech.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />
                      <span>{mech.city || 'Bangalore'}</span>
                    </div>
                  </div>

                  {mech.verification_status !== 'verified' && (
                    <button
                      onClick={() => handleVerifyMechanic(mech.id)}
                      disabled={actionLoading === mech.id}
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-4"
                    >
                      {actionLoading === mech.id ? 'Verifying...' : '✅ Verify & Activate Mechanic'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Orders Tab */
          <div className="grid grid-cols-1 gap-4">
            {orders.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-100">
                <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-muted font-medium">No repair orders placed yet.</p>
              </div>
            ) : (
              orders.map(ord => (
                <div key={ord.id} className="card bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded">{ord.id}</span>
                      {ord.device_type === 'laptop' ? (
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-bold flex items-center gap-1"><Laptop className="w-3 h-3" /> Laptop</span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-bold flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</span>
                      )}
                      {ord.status === 'searching_mechanic' && <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-xs font-bold animate-pulse">🔍 Searching Mechanic</span>}
                      {ord.status === 'accepted' && <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-md text-xs font-bold">✅ Assigned to {ord.mechanic_name}</span>}
                    </div>
                    <h4 className="text-base font-bold text-dark">{ord.brand} {ord.model}</h4>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 font-medium">{ord.issue_description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary-500" /> {ord.customer_name} ({ord.customer_phone})</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-500" /> {ord.address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-500" /> {ord.time_slot}</span>
                    </div>
                  </div>

                  <div className="text-right min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                    <span className="text-[10px] text-muted font-bold uppercase block">Est. Payout</span>
                    <span className="text-xl font-extrabold text-green-600">₹{ord.estimated_price?.toLocaleString()}</span>
                    <span className="text-[10px] text-muted block mt-1">{ord.created_at}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
