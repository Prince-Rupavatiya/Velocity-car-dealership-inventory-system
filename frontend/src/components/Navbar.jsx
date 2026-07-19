import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Gauge, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-700/60 bg-base-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Gauge className="h-7 w-7 text-volt-500" strokeWidth={2.5} />
          <span className="font-display text-xl font-bold uppercase tracking-widest text-white">
            Velocity<span className="text-volt-500">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-display text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-volt-400' : 'text-slate-300 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                {isAdmin ? 'Admin' : 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-xs">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-xs">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-base-700/60 bg-base-950 px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-4 pt-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-sm font-semibold uppercase tracking-wider text-slate-300"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-base-700/60 pt-4">
              {user ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="btn-outline">
                    {isAdmin ? 'Admin' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="btn-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-outline">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
