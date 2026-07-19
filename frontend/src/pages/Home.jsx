import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, Wallet, Lock, Truck, Users, ArrowRight, Star } from 'lucide-react';
import api from '../api/axios';
import VehicleCard from '../components/VehicleCard';
import { useCountUp } from '../hooks/useCountUp';

const CATEGORIES = [
  { name: 'SUV', img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sedan', img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Luxury', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80' },
  { name: 'Sports', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80' },
  { name: 'Electric', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hybrid', img: 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pickup', img: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=400&q=80' },
  { name: 'Van', img: 'https://images.unsplash.com/photo-1609520505218-7421df709529?auto=format&fit=crop&w=400&q=80' },
];

const FEATURES = [
  { icon: ShieldCheck, label: 'Verified Cars' },
  { icon: Wallet, label: 'Best Prices' },
  { icon: Lock, label: 'Secure Payments' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: Users, label: 'Trusted Dealers' },
];

const STATS = [
  { value: 120, suffix: '+', label: 'Vehicles Listed' },
  { value: 15, suffix: '+', label: 'Trusted Brands' },
  { value: 500, suffix: '+', label: 'Happy Customers' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',
    role: 'Verified Buyer — Toyota Fortuner',
    quote: 'The whole process took twenty minutes end to end. Transparent pricing, no surprise fees, and the car matched the listing exactly.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sara Kapoor',
    role: 'Verified Buyer — Honda City',
    quote: 'I compared four dealers before landing here. Velocity had the best price and the dashboard made tracking my purchase effortless.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Rohan Das',
    role: 'Verified Buyer — Hyundai i20',
    quote: 'Support answered every question fast, and restock alerts meant I didn\u2019t miss the color I wanted.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

const BRANDS = ['Toyota', 'Honda', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Tata', 'Mahindra', 'Kia'];

function StatItem({ value, suffix, label }) {
  const [ref, count] = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-bold text-white sm:text-5xl">
        {count}
        <span className="text-volt-400">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">{label}</p>
    </div>
  );
}


export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Public preview: try to load real inventory, silently ignore if unauthenticated/offline
    api
      .get('/vehicles?limit=6')
      .then((res) => setFeatured(res.data.vehicles || []))
      .catch(() => setFeatured([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/inventory${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-speed-lines bg-radial-glow">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow mb-4">Performance. Precision. Power.</p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find Your <span className="text-volt-400">Dream Car</span> Today
            </h1>
            <p className="mt-5 max-w-md text-slate-400">
              Explore a curated inventory of premium vehicles at the best prices, backed by verified dealers and instant purchase.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-md gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search make, model or category..."
                className="input-field"
              />
              <button type="submit" className="btn-primary !px-4">
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/inventory" className="btn-primary">
                Browse Inventory <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="btn-outline">
                Sell Your Vehicle
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-4 gap-4">
              {[['120+', 'Vehicles'], ['15+', 'Brands'], ['500+', 'Customers'], ['98%', 'Satisfaction']].map(
                ([num, label]) => (
                  <div key={label} className="stat-divider pl-3 first:border-l-0 first:pl-0">
                    <p className="font-display text-2xl font-bold text-volt-400">{num}</p>
                    <p className="text-xs text-slate-500">{label}</p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="stripe-accent absolute -top-4 left-0 right-0" />
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
              alt="Performance car"
              className="clip-angled w-full rounded-lg object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow mb-2">Browse by type</p>
        <h2 className="mb-8 text-2xl font-bold text-white sm:text-3xl">Popular Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={`/inventory?category=${c.name}`}
              className="group relative h-32 overflow-hidden rounded-lg border border-base-700/60"
            >
              <img src={c.img} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-base-950/60 transition-colors group-hover:bg-base-950/40" />
              <span className="absolute bottom-3 left-3 font-display text-sm font-bold uppercase tracking-wider text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CARS */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">Fresh off the lot</p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Featured Vehicles</h2>
            </div>
            <Link to="/inventory" className="hidden font-display text-sm font-semibold uppercase text-volt-400 sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="border-y border-base-700/60 bg-base-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow mb-2">The Velocity difference</p>
          <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">Why Choose Us</h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-volt-500/40 bg-volt-500/10">
                  <Icon className="h-6 w-6 text-volt-400" />
                </div>
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-slate-200">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-base-700/60 bg-base-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow mb-2">Feedback</p>
          <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">Customer Reviews</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-volt-400 text-volt-400' : 'text-base-700'}`} />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-11 w-11 rounded-full border border-base-700 object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-volt-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="eyebrow mb-6 text-center">Vehicles from brands you trust</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {BRANDS.map((b) => (
            <div
              key={b}
              className="flex h-14 items-center justify-center rounded-lg border border-base-700/60 bg-base-900 text-center font-display text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:border-volt-500/40 hover:text-volt-400"
            >
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to find your next ride?</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Create a free account to save vehicles, track purchases and get notified when new inventory drops.
        </p>
        <Link to="/register" className="btn-primary mt-8 inline-flex">
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
