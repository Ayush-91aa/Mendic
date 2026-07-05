import { useState } from 'react';
import { SignIn, SignUp, Show } from '@clerk/react';
import { Wrench, ArrowLeft, ShieldCheck, CheckCircle2, Award, Zap } from 'lucide-react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

export default function MechanicAuth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signin' ? 'sign-in' : 'sign-up';
  const [authMode, setAuthMode] = useState(initialMode);

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setSearchParams({ mode: mode === 'sign-in' ? 'signin' : 'signup' });
  };

  return (
    <>
      {/* If already logged in, push immediately to progressive onboarding dashboard */}
      <Show when="signed-in">
        <Navigate to="/mechanic" replace />
      </Show>

      <Show when="signed-out">
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans animate-fade-in">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200/80 text-gray-600 hover:text-dark hover:border-gray-300 text-xs font-semibold mb-6 shadow-sm hover:shadow transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Landing Page</span>
            </Link>

            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/30 border border-primary-400">
                <Wrench className="w-7 h-7 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-dark tracking-tight">
              Join as a Mendic Technician
            </h1>
            <p className="mt-2 text-sm text-muted max-w-sm mx-auto leading-relaxed">
              Partner with India's premier mobile and laptop repair network. Earn competitive payouts with instant UPI transfers.
            </p>

            {/* Quick Value Props */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-semibold text-gray-700 max-w-sm mx-auto">
              <div className="bg-white/80 border border-gray-200/60 p-2 rounded-xl flex flex-col items-center gap-1 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant UPI</span>
              </div>
              <div className="bg-white/80 border border-gray-200/60 p-2 rounded-xl flex flex-col items-center gap-1 shadow-2xs">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Verified Jobs</span>
              </div>
              <div className="bg-white/80 border border-gray-200/60 p-2 rounded-xl flex flex-col items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Zero Fee</span>
              </div>
            </div>

            {/* Auth Mode Switcher */}
            <div className="mt-6 flex justify-center">
              <div className="bg-gray-200/80 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold border border-gray-300/50">
                <button
                  type="button"
                  onClick={() => handleModeChange('sign-up')}
                  className={`px-5 py-2 rounded-xl transition-all ${
                    authMode === 'sign-up'
                      ? 'bg-white text-dark shadow-sm border border-gray-200/50'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  New Partner (Sign Up)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('sign-in')}
                  className={`px-5 py-2 rounded-xl transition-all ${
                    authMode === 'sign-in'
                      ? 'bg-white text-dark shadow-sm border border-gray-200/50'
                      : 'text-muted hover:text-dark'
                  }`}
                >
                  Existing (Sign In)
                </button>
              </div>
            </div>
          </div>

          {/* Clerk Component Container */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex justify-center px-4">
            <div className="w-full flex justify-center transition-all duration-300">
              {authMode === 'sign-up' ? (
                <SignUp
                  routing="virtual"
                  signInUrl="/mechanic/join?mode=signin"
                  forceRedirectUrl="/mechanic"
                  fallbackRedirectUrl="/mechanic"
                />
              ) : (
                <SignIn
                  routing="virtual"
                  signUpUrl="/mechanic/join?mode=signup"
                  forceRedirectUrl="/mechanic"
                  fallbackRedirectUrl="/mechanic"
                />
              )}
            </div>
          </div>

          {/* Reassuring Footer */}
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-gray-200/80 shadow-2xs flex items-center justify-center gap-2.5 text-xs text-muted font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Secured by Clerk & Mendic Technician Shield</span>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
