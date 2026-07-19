import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Gauge className="mb-4 h-14 w-14 text-volt-500" />
      <h1 className="font-display text-6xl font-bold text-white">404</h1>
      <p className="mt-2 text-slate-400">Looks like this road doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
