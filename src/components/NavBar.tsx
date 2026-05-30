import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/analyze', label: 'Analyze' },
  { path: '/builder', label: 'Build' },
  { path: '/jobs', label: 'Jobs' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, openLogin, logout } = useAuth();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-5 h-5 bg-brand rounded-sm flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M12 18v-6" />
                  <path d="M9 15h6" />
                </svg>
              </div>
              <span className="font-bold tracking-tight text-base">
                Resumebugs
              </span>
              <span className="mono-label text-ink-light">V1.0</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navItems.slice(1).map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`text-sm font-medium transition-colors ${
                        isActive ? 'text-brand' : 'text-ink hover:text-brand'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 btn-ghost px-3 py-2 text-sm"
                    >
                      <div className="w-6 h-6 bg-brand text-white flex items-center justify-center rounded-none text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 sharp-card bg-white shadow-lg z-50">
                        <div className="p-4 border-b border-black">
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="mono-xs text-ink-light mt-1">{user.email}</p>
                          <p className="mono-xs text-ink-light mt-1">via {user.provider}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/builder"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                          >
                            <User className="w-4 h-4" /> My Resume
                          </Link>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-danger"
                          >
                            <LogOut className="w-4 h-4" /> Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={openLogin}
                      className="text-sm font-medium text-ink hover:text-brand"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={openLogin}
                      className="btn-primary px-4 py-2 text-sm font-semibold flex items-center gap-2"
                    >
                      Get Started <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-black bg-white">
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-3 text-sm font-medium ${
                    location.pathname === item.path ? 'text-brand' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border-light">
                {user ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full text-left px-3 py-3 text-sm font-medium text-danger"
                  >
                    Sign out ({user.name})
                  </button>
                ) : (
                  <button
                    onClick={() => { openLogin(); setMobileOpen(false); }}
                    className="btn-primary w-full px-3 py-3 text-sm font-semibold"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
