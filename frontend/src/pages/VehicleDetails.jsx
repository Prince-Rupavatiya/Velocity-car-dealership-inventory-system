import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Fuel, Gauge, Calendar, Palette, Cog, ShieldCheck, Minus, Plus } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    api
      .get(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data.vehicle))
      .catch(() => toast.error('Vehicle not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }
    setPurchasing(true);
    try {
      const { data } = await api.post(`/vehicles/${id}/purchase`, { quantity: qty });
      toast.success('Purchase successful!');
      navigate('/purchase-success', { state: { purchase: data.purchase, vehicle } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-volt-500 border-t-transparent" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Vehicle not found</h1>
        <Link to="/inventory" className="btn-primary inline-flex">Back to Inventory</Link>
      </div>
    );
  }

  const outOfStock = vehicle.quantity <= 0;
  const gallery = vehicle.gallery?.length ? vehicle.gallery : [vehicle.image];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/inventory" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-volt-400">
        <ArrowLeft className="h-4 w-4" /> Back to Inventory
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="mb-3 overflow-hidden rounded-xl border border-base-700/60">
            <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="h-96 w-full object-cover" />
          </div>
          <div className="flex gap-3">
            {gallery.slice(0, 4).map((img, i) => (
              <img key={i} src={img} alt="" className="h-20 w-24 rounded-md border border-base-700/60 object-cover opacity-70 hover:opacity-100" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="rounded bg-volt-500/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-volt-400">
            {vehicle.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white">{vehicle.make} {vehicle.model}</h1>
          <p className="mt-2 font-display text-3xl font-bold text-volt-400">{formatPrice(vehicle.price)}</p>
          <p className={`mt-2 text-sm font-semibold ${outOfStock ? 'text-red-400' : 'text-emerald-400'}`}>
            {outOfStock ? 'Out of Stock' : `${vehicle.quantity} unit(s) available`}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-base-700/60 py-6">
            {[
              [Calendar, 'Year', vehicle.year],
              [Fuel, 'Fuel Type', vehicle.fuelType],
              [Cog, 'Transmission', vehicle.transmission],
              [Palette, 'Color', vehicle.color || '—'],
              [Gauge, 'Mileage', vehicle.mileage || '—'],
              [ShieldCheck, 'Engine', vehicle.engine || '—'],
            ].map(([Icon, label, value]) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-base-800">
                  <Icon className="h-4 w-4 text-volt-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-200">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-white">Description</h3>
            <p className="text-sm leading-relaxed text-slate-400">{vehicle.description || 'No description provided.'}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border border-base-700">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={outOfStock}
                className="p-3 text-slate-300 hover:text-volt-400 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-display font-semibold text-white">{qty}</span>
              <button
                onClick={() => setQty(Math.min(vehicle.quantity, qty + 1))}
                disabled={outOfStock}
                className="p-3 text-slate-300 hover:text-volt-400 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button onClick={handlePurchase} disabled={outOfStock || purchasing} className="btn-primary flex-1">
              {purchasing ? 'Processing...' : outOfStock ? 'Out of Stock' : 'Purchase Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
