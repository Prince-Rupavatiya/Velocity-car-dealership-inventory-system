import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gauge, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agree: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.agree) {
      toast.error('Please accept the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
          alt="Car showroom"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/40 to-base-950/10" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="eyebrow mb-2">Join us today</p>
          <h2 className="text-3xl font-bold text-white">Create your account and start your journey with us.</h2>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <Gauge className="h-7 w-7 text-volt-500" />
            <span className="font-display text-xl font-bold uppercase tracking-widest text-white">Velocity.</span>
          </Link>

          <h1 className="mb-1 text-2xl font-bold text-white">Register</h1>
          <p className="mb-8 text-sm text-slate-400">Create a new account to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input name="name" required value={form.name} onChange={handleChange} placeholder="Enter your full name" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@email.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="label">Confirm</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input-field pl-10" />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Register As</label>
              <div className="flex gap-3">
                {['user', 'admin'].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    className={`flex-1 rounded-md border px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
                      form.role === r
                        ? 'border-volt-500 bg-volt-500/10 text-volt-400'
                        : 'border-base-700 text-slate-400 hover:border-base-600'
                    }`}
                  >
                    {r === 'user' ? 'Customer' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-400">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="mt-0.5 h-4 w-4 rounded border-base-700 bg-base-900 accent-volt-500" />
              I agree to the Terms &amp; Conditions and Privacy Policy
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-volt-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
