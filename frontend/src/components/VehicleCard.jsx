import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, GitCompare, Fuel, Gauge, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

// Curated online fallback images (Unsplash) keyed by category, used when a
// vehicle has no `image` set. Swap these for your own CDN URLs in production.
const FALLBACK_IMAGES = {
  SUV: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
  Sedan: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
  Hatchback: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
  Luxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
  Sports: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  Electric: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80',
  Hybrid: 'https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&w=900&q=80',
  Pickup: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=900&q=80',
  Van: 'https://images.unsplash.com/photo-1609520505218-7421df709529?auto=format&fit=crop&w=900&q=80',
};

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function VehicleCard({ vehicle }) {
  const outOfStock = vehicle.quantity <= 0;
  const image = vehicle.image || FALLBACK_IMAGES[vehicle.category] || FALLBACK_IMAGES.Sedan;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card group relative overflow-hidden"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-950/80 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded bg-volt-500 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-base-950">
            {vehicle.category}
          </span>
          {outOfStock && (
            <span className="rounded bg-red-500 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-white">
              Out of Stock
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex gap-2">
          <button
            aria-label="Add to wishlist"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-base-950/70 text-slate-200 backdrop-blur hover:text-volt-400"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            aria-label="Add to compare"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-base-950/70 text-slate-200 backdrop-blur hover:text-volt-400"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-display text-lg font-bold text-white">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>
        <p className="mb-3 font-display text-xl font-bold text-volt-400">{formatPrice(vehicle.price)}</p>

        <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {vehicle.year}</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {vehicle.fuelType}</span>
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {vehicle.transmission}</span>
        </div>

        <Link
          to={`/inventory/${vehicle._id}`}
          className="btn-primary w-full !py-2 text-xs"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
