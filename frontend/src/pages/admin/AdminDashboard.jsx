import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/purchases/admin/stats').then((res) => setStats(res.data.stats)).catch(() => {});
    api.get('/purchases').then((res) => setRecent((res.data.purchases || []).slice(0, 5))).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Vehicles', value: stats?.totalVehicles ?? '—', icon: Car, color: 'text-volt-400' },
    { label: 'Available Vehicles', value: stats?.availableVehicles ?? '—', icon: ShoppingCart, color: 'text-emerald-400' },
    { label: 'Total Sales', value: stats?.totalSales ?? '—', icon: TrendingUp, color: 'text-amber-400' },
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue), icon: DollarSign, color: 'text-volt-400' },
    { label: 'Customers', value: stats?.totalCustomers ?? '—', icon: Users, color: 'text-sky-400' },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        </div>
        <Link to="/admin/vehicles/new" className="btn-primary !py-2 text-xs">Add Vehicle</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <Icon className={`mb-3 h-6 w-6 ${color}`} />
            <p className="font-display text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Inventory Status</h3>
          <div className="flex items-center gap-6">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-base-700">
              <div
                className="absolute inset-0 rounded-full border-8 border-volt-500"
                style={{
                  clipPath: `inset(0 ${100 - Math.round(((stats?.availableVehicles || 0) / (stats?.totalVehicles || 1)) * 100)}% 0 0)`,
                }}
              />
              <span className="font-display text-lg font-bold text-white">{stats?.totalVehicles ?? 0}</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-volt-500" /> In Stock</p>
              <p className="flex items-center gap-2 text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-base-700" /> Out of Stock</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Recent Purchases</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">No purchases yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-200">{p.userId?.name}</p>
                    <p className="text-xs text-slate-500">{p.vehicleId?.make} {p.vehicleId?.model}</p>
                  </div>
                  <p className="font-semibold text-volt-400">{formatPrice(p.totalPrice)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
