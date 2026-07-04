import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PendingApproval({ onSimulateApprove }) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="card bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 text-center space-y-8 animate-slide-up">
        {/* Animated Badge */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-white">
            <Clock className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
            KYC Status: Under Review
          </span>
          <h1 className="text-3xl font-extrabold text-dark">Verification in Progress</h1>
          <p className="text-muted text-base max-w-lg mx-auto leading-relaxed">
            Thank you for completing your technician profile. Our admin team is currently reviewing your Aadhaar, PAN, and professional credentials.
          </p>
        </div>

        {/* Review Timeline */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left space-y-4 max-w-md mx-auto">
          <h3 className="text-xs font-bold text-dark uppercase tracking-wider text-center mb-2">
            Onboarding Checklist
          </h3>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Profile & KYC Submitted</p>
              <p className="text-xs text-muted">Your identity documents have been securely uploaded.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-3 h-3 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-dark">Admin Verification (In Progress)</p>
              <p className="text-xs text-muted">Manual verification of certifications and ID proofs (Approx. 2–4 hours).</p>
            </div>
          </div>

          <div className="flex items-start gap-3 opacity-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Order Feed Activation</p>
              <p className="text-xs text-muted">Unlock live laptop and mobile repair requests in your area.</p>
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100 flex items-center justify-center gap-3 text-sm text-primary-700 font-medium">
          <ShieldCheck className="w-5 h-5 text-primary-500 flex-shrink-0" />
          <span>We will notify you via SMS and Email once your account is approved.</span>
        </div>

        {/* Demo/Testing Only: Simulate Admin Approval */}
        {onSimulateApprove && (
          <div className="pt-4 border-t border-gray-100/80">
            <button
              type="button"
              onClick={onSimulateApprove}
              className="text-xs text-muted hover:text-green-600 underline font-semibold transition-colors"
            >
              [Demo Only: Simulate Admin Approval & View Order Feed]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
