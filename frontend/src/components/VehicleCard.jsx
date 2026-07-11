import React from 'react';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

/**
 * VehicleCard
 * Shows vehicle information and handles action triggers (Purchase, Edit, Delete, Restock).
 * Respects ADMIN vs USER role-based rendering for buttons.
 */
export default function VehicleCard({ vehicle, onPurchase, onEdit, onDelete, onRestock }) {
  const { isAdmin } = useAuth();
  const { id, make, model, category, price, quantity } = vehicle;
  const isOutOfStock = quantity <= 0;

  // Placeholder images based on category or default
  const getPlaceholderImage = (cat) => {
    const images = {
      Sedan: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400',
      SUV: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
      Truck: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
      Coupe: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    };
    return images[cat] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=400';
  };

  return (
    <div className="card-hover overflow-hidden flex flex-col h-full">
      {/* Image container */}
      <div className="relative h-48 w-full bg-surface-950 overflow-hidden">
        <img
          src={getPlaceholderImage(category)}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className={`badge ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-red-400 font-bold tracking-wider text-sm border-2 border-red-500/30 px-3 py-1.5 rounded-lg uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide truncate">
            {make} <span className="text-slate-300 font-medium">{model}</span>
          </h3>
          <p className="text-2xl font-extrabold text-primary-400 mt-2">
            {formatCurrency(price)}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-surface-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase font-medium">Stock</span>
          <span className={`text-sm font-bold ${isOutOfStock ? 'text-red-400' : 'text-slate-200'}`}>
            {quantity} {quantity === 1 ? 'unit' : 'units'}
          </span>
        </div>
      </div>

      {/* Actions footer */}
      <div className="p-5 pt-0 mt-auto flex flex-col gap-2">
        <button
          onClick={() => onPurchase(vehicle)}
          disabled={isOutOfStock}
          className="btn btn-primary w-full"
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>

        {/* Admin specific features */}
        {isAdmin && (
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-surface-800">
            <button
              onClick={() => onRestock(vehicle)}
              className="btn btn-outline btn-sm text-xs font-semibold py-2"
              title="Restock"
            >
              Restock
            </button>
            <button
              onClick={() => onEdit(vehicle)}
              className="btn btn-outline btn-sm text-xs font-semibold py-2"
              title="Edit"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="btn btn-danger btn-sm text-xs font-semibold py-2"
              title="Delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
