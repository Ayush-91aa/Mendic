import { useState } from 'react';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Wrench,
  FileText,
  Info,
  Briefcase,
  LogIn,
  UserPlus,
} from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Book A Repair', href: '#booking', icon: Wrench },
  { name: 'About', href: '#about', icon: Info },
];

export default function Header({ onOpenBooking }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (e, href) => {
    if (href === '#booking') {
      e.preventDefault();
      onOpenBooking();
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-3xl tracking-wide font-bold" style={{ fontFamily: 'Mokoto, sans-serif', color: '#0056b3' }}>
              MENDIC
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
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/mechanic/join"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/50 transition-all duration-200"
            >
              <Briefcase className="w-4 h-4 text-primary-500" />
              <span>Work with us</span>
            </Link>
            <Show when="signed-in">
              <UserButton afterSignOutUrl="/" />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary-500 text-primary-500 text-sm font-semibold hover:bg-primary-50 transition-all duration-200">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition-all duration-200 shadow-md shadow-primary-500/20">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
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
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3 space-y-3">
              <Link
                to="/mechanic/join"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50/50 font-semibold transition-all text-sm"
              >
                <Briefcase className="w-4 h-4 text-primary-500" />
                <span>Work with us (Technician Portal)</span>
              </Link>
              <Show when="signed-in">
                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-dark text-sm">My Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </Show>
              <Show when="signed-out">
                <div className="flex items-center gap-3 px-4 py-2">
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-primary-500 text-primary-500 font-semibold text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </Show>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
