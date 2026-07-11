import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

/**
 * PurchaseDialog — confirmation modal for vehicle purchases.
 */
export default function PurchaseDialog({ vehicle, isOpen, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !vehicle) return null;

  const { make, model, price, quantity: stock } = vehicle;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(vehicle.id, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="card relative w-full max-w-md p-6 max-h-[90vh] overflow-y-auto z-10 animate-scale-up">
        <h2 className="text-xl font-bold text-white mb-4">Confirm Purchase</h2>

        <div className="bg-surface-800 rounded-lg p-4 mb-5 border border-surface-700/50">
          <p className="text-sm text-slate-400">Vehicle</p>
          <p className="text-base font-bold text-white mb-2">{make} {model}</p>
          <p className="text-sm text-slate-400">Price per unit</p>
          <p className="text-lg font-bold text-primary-400">{formatCurrency(price)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="purchase-qty">Quantity to Purchase</label>
            <input
              id="purchase-qty"
              type="number"
              min="1"
              max={stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
              className="input"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              Available stock: {stock} units
            </p>
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Confirm &amp; Pay {formatCurrency(price * quantity)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
