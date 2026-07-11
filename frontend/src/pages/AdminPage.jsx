import React, { useState } from 'react';
import useVehicles from '../hooks/useVehicles';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import VehicleForm from '../components/VehicleForm';
import RestockDialog from '../components/RestockDialog';
import vehicleService from '../services/vehicleService';
import inventoryService from '../services/inventoryService';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { toast } from 'react-toastify';

/**
 * AdminPage — administrative portal to manage vehicle inventory in a clean table format.
 */
export default function AdminPage() {
  const { page, size, setPage } = usePagination(10); // Show 10 per page on admin table

  const {
    vehicles,
    totalPages,
    totalElements,
    isLoading,
    error,
    make,
    model,
    category,
    minPrice,
    maxPrice,
    setMake,
    setCategory,
    clearFilters,
    refresh,
  } = useVehicles(page, size);

  // Modal control
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleRestockClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockOpen(true);
  };

  const handleFormSave = async (id, data) => {
    try {
      if (id) {
        await vehicleService.update(id, data);
        toast.success('Vehicle updated successfully.');
      } else {
        await vehicleService.create(data);
        toast.success('Vehicle added successfully.');
      }
      setIsFormOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.userMessage || 'Operation failed.');
    }
  };

  const handleRestockConfirm = async (id, qty) => {
    try {
      await inventoryService.restock(id, qty);
      toast.success('Inventory restocked.');
      setIsRestockOpen(false);
      refresh();
    } catch (err) {
      toast.error(err.userMessage || 'Restocking failed.');
    }
  };

  const handleDeleteClick = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete the ${vehicle.make} ${vehicle.model}?`)) {
      try {
        await vehicleService.remove(vehicle.id);
        toast.success('Vehicle removed from catalog.');
        refresh();
      } catch (err) {
        toast.error(err.userMessage || 'Deletion failed.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 mt-1">Add, modify, restock, or remove catalog vehicles.</p>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary self-start sm:self-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Vehicle
        </button>
      </div>

      {/* Mini Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search make..."
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="input w-full md:w-48"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="">All Categories</option>
            {['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Convertible'].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {(make || category) && (
          <button onClick={clearFilters} className="text-xs text-primary-400 font-semibold">
            Clear filters
          </button>
        )}
      </div>

      {/* Table block */}
      {error ? (
        <ErrorAlert message={error} onRetry={refresh} />
      ) : vehicles.length === 0 && !isLoading ? (
        <EmptyState onReset={clearFilters} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-900 border-b border-surface-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-850 bg-surface-900/50">
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4 pl-6"><div className="skeleton h-4 w-6" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-32" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-16" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-20" /></td>
                        <td className="p-4"><div className="skeleton h-4 w-10" /></td>
                        <td className="p-4 pr-6 text-right"><div className="skeleton h-8 w-36 ml-auto" /></td>
                      </tr>
                    ))
                  : vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-surface-850/30 transition-colors text-slate-300 text-sm">
                        <td className="p-4 pl-6 font-mono text-slate-500">#{vehicle.id}</td>
                        <td className="p-4 font-bold text-white">
                          {vehicle.make} <span className="text-slate-400 font-medium">{vehicle.model}</span>
                        </td>
                        <td className="p-4">
                          <span className={`badge ${getCategoryColor(vehicle.category)}`}>
                            {vehicle.category}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-primary-400">{formatCurrency(vehicle.price)}</td>
                        <td className="p-4">
                          <span className={vehicle.quantity <= 0 ? 'text-red-400 font-semibold' : 'text-slate-200'}>
                            {vehicle.quantity}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button
                            onClick={() => handleRestockClick(vehicle)}
                            className="btn btn-outline btn-sm"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => handleEditClick(vehicle)}
                            className="btn btn-ghost btn-sm text-slate-300 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(vehicle)}
                            className="btn btn-ghost btn-sm text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Form modal */}
      <VehicleForm
        vehicle={selectedVehicle}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
      />

      {/* Restock modal */}
      <RestockDialog
        vehicle={selectedVehicle}
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        onConfirm={handleRestockConfirm}
      />
    </div>
  );
}
