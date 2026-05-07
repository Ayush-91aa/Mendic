import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, signup, loginWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        await signup(form.email, form.password, form.name);
      }
      onClose();
    } catch (err) {
      const c = err.code;
      if (c === 'auth/invalid-email') setError('Invalid email address');
      else if (c === 'auth/user-not-found') setError('No account found');
      else if (c === 'auth/wrong-password' || c === 'auth/invalid-credential') setError('Invalid email or password');
      else if (c === 'auth/email-already-in-use') setError('Email already registered');
      else if (c === 'auth/weak-password') setError('Password must be at least 6 characters');
      else setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try { await loginWithGoogle(); onClose(); }
    catch (err) { setError(err.code === 'auth/popup-closed-by-user' ? 'Sign-in cancelled' : 'Google sign-in failed'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-8 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"><User className="w-8 h-8" /></div>
          <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-primary-100 mt-1 text-sm">{isLogin ? 'Log in to track your repairs' : 'Sign up to get started'}</p>
        </div>
        <div className="p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 animate-fade-in">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative animate-fade-in">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPw ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6} className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}</button>
          </form>
          <div className="flex items-center gap-3"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-muted font-medium">OR</span><div className="flex-1 h-px bg-gray-200" /></div>
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium disabled:opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <p className="text-center text-sm text-muted">{isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}<button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-primary-500 font-semibold hover:underline">{isLogin ? 'Sign Up' : 'Sign In'}</button></p>
        </div>
      </div>
    </div>
  );
}
