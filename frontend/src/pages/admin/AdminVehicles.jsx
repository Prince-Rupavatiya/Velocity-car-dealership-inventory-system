import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Plus, Pencil, Trash2, PackagePlus, X } from 'lucide-react';
import api from '../../api/axios';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);
  const [restockQty, setRestockQty] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vehicles', { params: { limit: 100 } });
      setVehicles(data.vehicles || []);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      await api.delete(`/vehicles/${deleteTarget._id}`);
      toast.success('Vehicle deleted');
      setVehicles(vehicles.filter((v) => v._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRestock = async () => {
    try {
      const { data } = await api.post(`/vehicles/${restockTarget._id}/restock`, { quantity: Number(restockQty) });
      toast.success('Vehicle restocked');
      setVehicles(vehicles.map((v) => (v._id === restockTarget._id ? { ...v, quantity: data.newStock } : v)));
      setRestockTarget(null);
      setRestockQty(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Restock failed');
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-white">Vehicle Management</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="input-field w-56 pl-10" />
          </div>
          <Link to="/admin/vehicles/new" className="btn-primary !py-2 text-xs">
            <Plus className="h-4 w-4" /> Add Vehicle
          </Link>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-base-700 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Make / Model</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No vehicles found</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v._id} className="border-b border-base-700/50 last:border-0">
                  <td className="px-4 py-3">
                    <img src={v.image} alt="" className="h-12 w-16 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 text-slate-200">{v.make} {v.model}</td>
                  <td className="px-4 py-3 text-slate-400">{v.category}</td>
                  <td className="px-4 py-3 text-volt-400">{formatPrice(v.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${v.quantity > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {v.quantity} in stock
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setRestockTarget(v)} title="Restock" className="rounded p-2 text-slate-400 hover:bg-base-700/50 hover:text-volt-400">
                        <PackagePlus className="h-4 w-4" />
                      </button>
                      <Link to={`/admin/vehicles/${v._id}/edit`} title="Edit" className="rounded p-2 text-slate-400 hover:bg-base-700/50 hover:text-volt-400">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setDeleteTarget(v)} title="Delete" className="rounded p-2 text-slate-400 hover:bg-base-700/50 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-sm p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Delete Vehicle</h3>
              <button onClick={() => setDeleteTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              Are you sure you want to delete <span className="text-white">{deleteTarget.make} {deleteTarget.model}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 rounded-md bg-red-500 py-3 font-display text-sm font-semibold uppercase text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock modal */}
      {restockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-sm p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Restock Vehicle</h3>
              <button onClick={() => setRestockTarget(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              {restockTarget.make} {restockTarget.model} — current stock: {restockTarget.quantity}
            </p>
            <label className="label">Quantity to Add</label>
            <input type="number" min={1} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} className="input-field mb-6" />
            <div className="flex gap-3">
              <button onClick={() => setRestockTarget(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleRestock} className="btn-primary flex-1">Confirm Restock</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
