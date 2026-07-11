import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

/**
 * VehicleForm — modal form used to Add or Edit a vehicle.
 */
export default function VehicleForm({ vehicle, isOpen, onClose, onSave }) {
  const isEditMode = !!vehicle;
  const categories = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Convertible'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Reset form when isOpen or vehicle changes to populate default values
  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        reset({
          make: vehicle.make,
          model: vehicle.model,
          category: vehicle.category,
          price: vehicle.price,
          quantity: vehicle.quantity,
        });
      } else {
        reset({
          make: '',
          model: '',
          category: 'Sedan',
          price: '',
          quantity: 1,
        });
      }
    }
  }, [isOpen, vehicle, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      quantity: parseInt(data.quantity),
    };
    await onSave(vehicle?.id || null, payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-surface-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="card relative w-full max-w-md p-6 z-10 animate-scale-up max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-5">
          {isEditMode ? 'Edit Vehicle Details' : 'Add New Vehicle'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Make */}
          <div>
            <label className="label" htmlFor="form-make">Make</label>
            <input
              id="form-make"
              type="text"
              placeholder="e.g. Ford"
              className={`input ${errors.make ? 'input-error' : ''}`}
              {...register('make', {
                required: 'Make is required',
                maxLength: { value: 50, message: 'Max 50 characters' },
              })}
            />
            {errors.make && (
              <p className="mt-1 text-xs text-red-400">{errors.make.message}</p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="label" htmlFor="form-model">Model</label>
            <input
              id="form-model"
              type="text"
              placeholder="e.g. Mustang"
              className={`input ${errors.model ? 'input-error' : ''}`}
              {...register('model', {
                required: 'Model is required',
                maxLength: { value: 50, message: 'Max 50 characters' },
              })}
            />
            {errors.model && (
              <p className="mt-1 text-xs text-red-400">{errors.model.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label" htmlFor="form-category">Category</label>
            <select
              id="form-category"
              className="input"
              {...register('category', { required: 'Category is required' })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="label" htmlFor="form-price">Price ($)</label>
            <input
              id="form-price"
              type="number"
              placeholder="e.g. 35000"
              className={`input ${errors.price ? 'input-error' : ''}`}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Must be greater than 0' },
              })}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="label" htmlFor="form-qty">Quantity</label>
            <input
              id="form-qty"
              type="number"
              placeholder="e.g. 5"
              className={`input ${errors.quantity ? 'input-error' : ''}`}
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 0, message: 'Must be at least 0' },
              })}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-400">{errors.quantity.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 justify-end pt-3 border-t border-surface-850 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
