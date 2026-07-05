import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/react';
import { useAuth } from '../../context/AuthContext';
import { Wrench, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MechanicVerificationForm from './MechanicVerificationForm';
import PendingApproval from './PendingApproval';
import MechanicOrderFeed from './MechanicOrderFeed';

export default function MechanicDashboard() {
  const [mechanicStatus, setMechanicStatus] = useState('incomplete'); // 'incomplete' | 'pending' | 'approved'
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      fetch(`https://mendic-api.mendic.workers.dev/api/mechanic/feed?userId=${currentUser.uid}`)
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            if (res.verified || res.status === 'verified') {
              setMechanicStatus('approved');
            } else if (res.status === 'pending' || (res.mechanic && !res.verified)) {
              setMechanicStatus('pending');
            } else {
              setMechanicStatus('incomplete');
            }
          }
        })
        .catch(err => console.error('Error checking mechanic status:', err));
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-dark hover:bg-gray-50 transition-all text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Landing</span>
            </Link>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-nasalization tracking-wide block leading-none" style={{ color: '#F45D40' }}>
                  MENDIC
                </span>
                <span className="text-[10px] font-bold tracking-wider text-muted uppercase block mt-1">
                  Technician Portal
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-2xl border border-gray-200/80 text-xs font-bold">
              <span className="text-muted">Account Status:</span>
              {mechanicStatus === 'incomplete' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  1. KYC Incomplete
                </span>
              )}
              {mechanicStatus === 'pending' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  2. Under Review
                </span>
              )}
              {mechanicStatus === 'approved' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-green-100 text-green-700 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  3. Active Partner
                </span>
              )}
            </div>

            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {mechanicStatus === 'incomplete' && (
          <MechanicVerificationForm onSubmitSuccess={() => setMechanicStatus('pending')} />
        )}
        {mechanicStatus === 'pending' && <PendingApproval />}
        {mechanicStatus === 'approved' && <MechanicOrderFeed />}
      </main>
    </div>
  );
}
