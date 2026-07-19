import React from 'react';
import { Target, Eye, Award } from 'lucide-react';

const TIMELINE = [
  { year: '2016', text: 'Velocity Motors founded with a single showroom and a promise: no hidden fees.' },
  { year: '2019', text: 'Crossed 5,000 vehicles sold, expanded to 3 cities.' },
  { year: '2022', text: 'Launched online inventory search and instant purchase.' },
  { year: '2026', text: 'Serving 15+ brands and 500+ dealers nationwide.' },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Our story</p>
      <h1 className="mb-6 text-4xl font-bold text-white">About Velocity Motors</h1>
      <p className="max-w-2xl text-slate-400">
        We built Velocity Motors to make buying a car feel like driving one: fast, transparent, and exciting.
        From verified listings to secure payments, every part of the experience is engineered for trust.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <Target className="mb-3 h-8 w-8 text-volt-400" />
          <h3 className="mb-2 font-display text-lg font-bold text-white">Our Mission</h3>
          <p className="text-sm text-slate-400">Connect buyers with verified, quality vehicles at fair prices through a seamless digital experience.</p>
        </div>
        <div className="card p-6">
          <Eye className="mb-3 h-8 w-8 text-volt-400" />
          <h3 className="mb-2 font-display text-lg font-bold text-white">Our Vision</h3>
          <p className="text-sm text-slate-400">Become the most trusted vehicle marketplace, where every dealer is verified and every deal is transparent.</p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-white">Milestones</h2>
        <div className="space-y-6 border-l border-base-700 pl-6">
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative">
              <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-volt-500" />
              <p className="font-display text-sm font-bold text-volt-400">{t.year}</p>
              <p className="text-sm text-slate-400">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 flex items-center gap-3 rounded-lg border border-base-700/60 bg-base-900 p-6">
        <Award className="h-8 w-8 shrink-0 text-volt-400" />
        <p className="text-sm text-slate-400">
          Recognized as a top-rated automotive marketplace by industry publications for three consecutive years.
        </p>
      </div>
    </div>
  );
}
