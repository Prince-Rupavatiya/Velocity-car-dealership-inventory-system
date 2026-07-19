import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, User, ClipboardList } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

const TABS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'purchases', label: 'My Purchases', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/purchases/my')
      .then((res) => setPurchases(res.data.purchases || []))
      .catch(() => setPurchases([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="card h-fit space-y-1 p-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-display text-sm font-semibold uppercase tracking-wide transition-colors ${
                tab === id ? 'bg-volt-500/10 text-volt-400' : 'text-slate-400 hover:bg-base-700/40 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div>
          {tab === 'overview' && (
            <div>
              <div className="card mb-6 flex items-center justify-between p-6">
                <div>
                  <p className="eyebrow mb-1">Welcome back</p>
                  <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                </div>
                <Link to="/inventory" className="btn-primary !py-2 text-xs">Browse Inventory</Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="card p-5">
                  <p className="text-xs text-slate-500">Total Purchases</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">{purchases.length}</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="mt-2 font-display text-2xl font-bold text-volt-400">
                    {formatPrice(purchases.reduce((s, p) => s + p.totalPrice, 0))}
                  </p>
                </div>
                <div className="card p-5">
                  <p className="text-xs text-slate-500">Account Status</p>
                  <p className="mt-2 font-display text-2xl font-bold text-emerald-400">Active</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Recent Purchases</h3>
                {purchases.slice(0, 3).length === 0 ? (
                  <p className="text-sm text-slate-400">No purchases yet.</p>
                ) : (
                  <div className="space-y-3">
                    {purchases.slice(0, 3).map((p) => (
                      <div key={p._id} className="card flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.vehicleId?.image} alt="" className="h-12 w-16 rounded object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-white">{p.vehicleId?.make} {p.vehicleId?.model}</p>
                            <p className="text-xs text-slate-500">{p.invoiceNumber}</p>
                          </div>
                        </div>
                        <p className="font-display text-sm font-bold text-volt-400">{formatPrice(p.totalPrice)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'purchases' && (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-base-700 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : purchases.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 flex items-center justify-center gap-2"><ClipboardList className="h-4 w-4" /> No purchase history yet</td></tr>
                  ) : (
                    purchases.map((p) => (
                      <tr key={p._id} className="border-b border-base-700/50 last:border-0">
                        <td className="px-4 py-3 text-slate-200">{p.vehicleId?.make} {p.vehicleId?.model}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-volt-400">{formatPrice(p.totalPrice)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">{p.status}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{p.invoiceNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'profile' && (
            <div className="card max-w-lg p-6">
              <h3 className="mb-6 font-display text-sm font-bold uppercase tracking-wider text-white">Profile Details</h3>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-volt-500/10 font-display text-xl font-bold text-volt-400">
                  {user?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input defaultValue={user?.name} className="input-field" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input defaultValue={user?.phone} className="input-field" />
                </div>
                <button className="btn-primary w-full">Update Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
