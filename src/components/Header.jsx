import { useState } from 'react';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/react';
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
  { name: 'Blog', href: '#blog', icon: FileText },
  { name: 'About', href: '#about', icon: Info },
  { name: 'Career', href: '#career', icon: Briefcase },
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
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-nasalization tracking-wide" style={{ color: '#F45D40' }}>
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
                <link.icon className="w-4 h-4" />
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
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
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
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
