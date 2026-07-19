import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin } from 'lucide-react';

const FAQS = [
  { q: 'How do I reserve a vehicle?', a: 'Create an account, browse inventory, and click Purchase Now on any vehicle in stock.' },
  { q: 'Can I return a purchased vehicle?', a: 'Returns are handled case-by-case with your assigned dealer within 7 days of purchase.' },
  { q: 'Do you offer financing?', a: 'Financing partners are available at checkout for eligible vehicles.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! Our team will get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Get in touch</p>
      <h1 className="mb-10 text-4xl font-bold text-white">Contact Us</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="card mb-6 overflow-hidden">
            <iframe
              title="map"
              className="h-64 w-full grayscale invert"
              src="https://www.google.com/maps?q=Ahmedabad,Gujarat,India&output=embed"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Phone className="h-5 w-5 text-volt-400" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="h-5 w-5 text-volt-400" /> hello@velocity-motors.example
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <MapPin className="h-5 w-5 text-volt-400" /> Ahmedabad, Gujarat, India
            </div>
          </div>

          <div className="mt-10">
            <h3 className="mb-4 font-display text-lg font-bold text-white">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="card p-4">
                  <summary className="cursor-pointer font-display text-sm font-semibold text-slate-200">{f.q}</summary>
                  <p className="mt-2 text-sm text-slate-400">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <div>
            <label className="label">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field" placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn-primary w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
