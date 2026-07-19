import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, FileText } from 'lucide-react';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function PurchaseSuccess() {
  const { state } = useLocation();
  const purchase = state?.purchase;
  const vehicle = state?.vehicle;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="mb-6 h-20 w-20 text-volt-400" strokeWidth={1.5} />
      <h1 className="mb-2 text-3xl font-bold text-white">Purchase Successful!</h1>
      <p className="mb-8 text-slate-400">Your order has been confirmed. A confirmation has been sent to your email.</p>

      {purchase && (
        <div className="card w-full p-6 text-left">
          <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {vehicle && (
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle</span>
                <span className="text-slate-200">{vehicle.make} {vehicle.model}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Quantity</span>
              <span className="text-slate-200">{purchase.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Invoice Number</span>
              <span className="text-slate-200">{purchase.invoiceNumber}</span>
            </div>
            <div className="flex justify-between border-t border-base-700 pt-2 font-semibold">
              <span className="text-slate-300">Total Paid</span>
              <span className="text-volt-400">{formatPrice(purchase.totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button className="btn-outline">
          <FileText className="h-4 w-4" /> View Invoice
        </button>
        <Link to="/inventory" className="btn-primary">Back to Inventory</Link>
      </div>
    </div>
  );
}
