import React, { useState } from 'react';

/**
 * RestockDialog — admin-only dialog to increase vehicle stock levels.
 */
export default function RestockDialog({ vehicle, isOpen, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(5);

  if (!isOpen || !vehicle) return null;

  const { make, model, quantity: currentStock } = vehicle;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(vehicle.id, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="card relative w-full max-w-sm p-6 z-10 animate-scale-up">
        <h2 className="text-xl font-bold text-white mb-4">Restock Inventory</h2>

        <div className="bg-surface-800 rounded-lg p-3.5 mb-5 border border-surface-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Vehicle</p>
          <p className="text-sm font-bold text-white">{make} {model}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wide mt-2">Current Stock</p>
          <p className="text-sm font-bold text-slate-200">{currentStock} units</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="restock-qty">Units to Add</label>
            <input
              id="restock-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input"
              required
            />
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
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
