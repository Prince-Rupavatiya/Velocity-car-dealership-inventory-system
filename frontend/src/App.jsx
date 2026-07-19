import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Inventory from './pages/Inventory';
import VehicleDetails from './pages/VehicleDetails';
import PurchaseSuccess from './pages/PurchaseSuccess';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVehicles from './pages/admin/AdminVehicles';
import AddEditVehicle from './pages/admin/AddEditVehicle';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-base-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#0F1730', color: '#F8FAFC', border: '1px solid #182242' },
        }}
      />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<VehicleDetails />} />

          <Route
            path="/purchase-success"
            element={
              <ProtectedRoute>
                <PurchaseSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/new" element={<AddEditVehicle />} />
            <Route path="vehicles/:id/edit" element={<AddEditVehicle />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
