import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Sports', 'Electric', 'Hybrid', 'Pickup', 'Van'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

const emptyFilters = { category: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '' };

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({ ...emptyFilters, category: searchParams.get('category') || '' });
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState('grid');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const hasFilters = query || Object.values(filters).some(Boolean);
      const endpoint = hasFilters ? '/vehicles/search' : '/vehicles';
      const params = hasFilters ? { q: query || undefined, ...filters } : {};
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);

      const { data } = await api.get(endpoint, { params });
      setVehicles(data.vehicles || []);
    } catch (err) {
      toast.error('Could not load inventory. Is the API running?');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedVehicles = useMemo(() => {
    const list = [...vehicles];
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'year-desc') list.sort((a, b) => b.year - a.year);
    return list;
  }, [vehicles, sort]);

  const resetFilters = () => {
    setFilters(emptyFilters);
    setQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">Full inventory</p>
          <h1 className="text-3xl font-bold text-white">All Vehicles</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchVehicles();
          }}
          className="flex gap-2"
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles..." className="input-field w-64 pl-10" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest</option>
          </select>
          <div className="flex overflow-hidden rounded-md border border-base-700">
            <button type="button" onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-volt-500 text-base-950' : 'text-slate-400'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-volt-500 text-base-950' : 'text-slate-400'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar filters */}
        <aside className="card h-fit space-y-6 p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-white">
              <SlidersHorizontal className="h-4 w-4 text-volt-400" /> Filters
            </h3>
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-volt-400">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div>
            <label className="label">Category</label>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input-field">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Fuel Type</label>
            <select value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })} className="input-field">
              <option value="">All Fuel Types</option>
              {FUEL_TYPES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Transmission</label>
            <select value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })} className="input-field">
              <option value="">All</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Price Range (₹)</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="input-field" />
              <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="input-field" />
            </div>
          </div>

          <button onClick={fetchVehicles} className="btn-primary w-full !py-2 text-xs">
            Apply Filters
          </button>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-slate-400">
            {loading ? 'Loading...' : `Showing ${sortedVehicles.length} vehicle${sortedVehicles.length !== 1 ? 's' : ''}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-base-800/50" />
              ))}
            </div>
          ) : sortedVehicles.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 py-20 text-center">
              <p className="font-display text-lg font-bold text-white">No vehicles found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}>
              {sortedVehicles.map((v) => (
                <VehicleCard key={v._id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
