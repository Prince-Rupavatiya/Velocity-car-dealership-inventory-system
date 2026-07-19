import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Car, Users as UsersIcon, Settings, Gauge } from 'lucide-react';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/vehicles', label: 'Vehicles', icon: Car },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="card h-fit space-y-1 p-3">
          <div className="mb-3 flex items-center gap-2 px-3 py-2">
            <Gauge className="h-5 w-5 text-volt-500" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-white">Admin Panel</span>
          </div>
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                  isActive ? 'bg-volt-500/10 text-volt-400' : 'text-slate-400 hover:bg-base-700/40 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
