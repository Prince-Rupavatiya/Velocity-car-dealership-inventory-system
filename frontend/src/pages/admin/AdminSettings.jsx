import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="card max-w-lg space-y-4 p-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Admin Profile</h3>
        <div>
          <label className="label">Name</label>
          <input defaultValue={user?.name} className="input-field" />
        </div>
        <div>
          <label className="label">Email</label>
          <input defaultValue={user?.email} disabled className="input-field opacity-60" />
        </div>
        <button className="btn-primary w-full">Save Changes</button>
      </div>
    </div>
  );
}
