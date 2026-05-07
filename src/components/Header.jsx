import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Home,
  Wrench,
  FileText,
  Info,
  Briefcase,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Book A Repair', href: '#booking', icon: Wrench },
  { name: 'Blog', href: '#blog', icon: FileText },
  { name: 'About', href: '#about', icon: Info },
  { name: 'Career', href: '#career', icon: Briefcase },
];

export default function Header({ onOpenBooking, onOpenLogin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleNavClick = (e, href) => {
    if (href === '#booking') {
      e.preventDefault();
      onOpenBooking();
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">
              Device<span className="text-primary-500">cure</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-500 hover:bg-primary-50 transition-all duration-200"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-dark max-w-[120px] truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-semibold text-dark truncate">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-xs text-muted truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all duration-200 shadow-md shadow-primary-500/20"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden animate-fade-in border-t border-gray-100 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-all"
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              {currentUser ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {currentUser.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs text-muted">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 font-medium text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full flex items-center justify-center gap-2 mx-4 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                  style={{ width: 'calc(100% - 2rem)' }}
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
