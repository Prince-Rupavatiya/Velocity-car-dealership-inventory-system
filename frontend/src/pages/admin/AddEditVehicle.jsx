import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Sports', 'Electric', 'Hybrid', 'Pickup', 'Van'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];

// Curated online stock images the admin can pick from instead of uploading files
const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
];

const emptyForm = {
  make: '', model: '', category: 'SUV', year: new Date().getFullYear(), color: '', fuelType: 'Petrol',
  transmission: 'Automatic', engine: '', mileage: '', price: '', quantity: '', description: '',
  image: STOCK_IMAGES[0],
};

export default function AddEditVehicle() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/vehicles/${id}`).then((res) => setForm(res.data.vehicle)).catch(() => toast.error('Vehicle not found'));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, year: Number(form.year), price: Number(form.price), quantity: Number(form.quantity) };
      if (isEdit) {
        await api.put(`/vehicles/${id}`, payload);
        toast.success('Vehicle updated');
      } else {
        await api.post('/vehicles', payload);
        toast.success('Vehicle added');
      }
      navigate('/admin/vehicles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
        </div>
        <button onClick={() => navigate('/admin/vehicles')} className="rounded p-2 text-slate-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6 p-6">
        <div>
          <label className="label flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> Vehicle Image</label>
          <div className="mb-3 h-48 w-full overflow-hidden rounded-lg border border-base-700">
            <img src={form.image} alt="preview" className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {STOCK_IMAGES.map((src) => (
              <button
                type="button"
                key={src}
                onClick={() => setForm({ ...form, image: src })}
                className={`h-14 overflow-hidden rounded border-2 ${form.image === src ? 'border-volt-500' : 'border-transparent'}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Make</label>
            <input name="make" required value={form.make} onChange={handleChange} className="input-field" placeholder="Toyota" />
          </div>
          <div>
            <label className="label">Model</label>
            <input name="model" required value={form.model} onChange={handleChange} className="input-field" placeholder="Fortuner" />
          </div>
          <div>
            <label className="label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" name="year" required value={form.year} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Price (₹)</label>
            <input type="number" name="price" required value={form.price} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Quantity</label>
            <input type="number" name="quantity" required value={form.quantity} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Fuel Type</label>
            <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input-field">
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Transmission</label>
            <select name="transmission" value={form.transmission} onChange={handleChange} className="input-field">
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Color</label>
            <input name="color" value={form.color} onChange={handleChange} className="input-field" placeholder="Black" />
          </div>
          <div>
            <label className="label">Mileage</label>
            <input name="mileage" value={form.mileage} onChange={handleChange} className="input-field" placeholder="14 km/l" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Engine</label>
            <input name="engine" value={form.engine} onChange={handleChange} className="input-field" placeholder="2.8L Diesel" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="input-field" placeholder="Premium SUV with advanced safety features." />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/admin/vehicles')} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : isEdit ? 'Update Vehicle' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
}
