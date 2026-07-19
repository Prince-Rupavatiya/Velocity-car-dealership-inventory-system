import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-base-700/60 bg-base-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-6 w-6 text-volt-500" />
              <span className="font-display text-lg font-bold uppercase tracking-widest text-white">Velocity.</span>
            </div>
            <p className="text-sm text-slate-400">
              Performance-inspired vehicle inventory, built for dealers and buyers who move fast.
            </p>
            <div className="mt-4 flex gap-3 text-slate-400">
              <Facebook className="h-4 w-4 hover:text-volt-400" />
              <Instagram className="h-4 w-4 hover:text-volt-400" />
              <Twitter className="h-4 w-4 hover:text-volt-400" />
              <Youtube className="h-4 w-4 hover:text-volt-400" />
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/inventory" className="hover:text-white">Inventory</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Ahmedabad, Gujarat, India</li>
              <li>hello@velocity-motors.example</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Newsletter</h4>
            <p className="mb-3 text-sm text-slate-400">Get new arrivals and price drops in your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="you@email.com" className="input-field !py-2 text-xs" />
              <button className="btn-primary !px-4 !py-2 text-xs">Join</button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-base-700/60 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Velocity Motors. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
