import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gauge, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed. Check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      {/* Left: image panel */}
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80"
          alt="Sports car at night"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-950 via-base-950/40 to-base-950/10" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <p className="eyebrow mb-2">Welcome back</p>
          <h2 className="text-3xl font-bold text-white">Sign in to continue to your account and explore amazing deals.</h2>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <Gauge className="h-7 w-7 text-volt-500" />
            <span className="font-display text-xl font-bold uppercase tracking-widest text-white">Velocity.</span>
          </Link>

          <h1 className="mb-1 text-2xl font-bold text-white">Login</h1>
          <p className="mb-8 text-sm text-slate-400">Enter your credentials to sign in</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <Link to="/login" className="text-xs text-volt-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input type="checkbox" className="h-4 w-4 rounded border-base-700 bg-base-900 accent-volt-500" />
              Remember me
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-volt-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
