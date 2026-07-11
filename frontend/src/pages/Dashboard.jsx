import React, { useState } from 'react';
import useVehicles from '../hooks/useVehicles';
import usePagination from '../hooks/usePagination';
import { useAuth } from '../context/AuthContext';
import VehicleGrid from '../components/VehicleGrid';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import PriceFilter from '../components/PriceFilter';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import PurchaseDialog from '../components/PurchaseDialog';
import RestockDialog from '../components/RestockDialog';
import VehicleForm from '../components/VehicleForm';
import inventoryService from '../services/inventoryService';
import vehicleService from '../services/vehicleService';
import { toast } from 'react-toastify';

/**
 * Dashboard Page
 * Connects the vehicle list, search filters, pagination hooks, and admin actions.
 */
export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { page, size, setPage, resetPage } = usePagination(6);

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
    setModel,
    setCategory,
    setMinPrice,
    setMaxPrice,
    clearFilters,
    refresh,
  } = useVehicles(page, size);

  // Dialog State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);

  // Search filter wrappers that reset current page to 0 on change
  const handleMakeChange = (val) => {
    setMake(val);
    resetPage();
  };

  const handleModelChange = (val) => {
    setModel(val);
    resetPage();
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    resetPage();
  };

  const handleMinPriceChange = (val) => {
    setMinPrice(val);
    resetPage();
  };

  const handleMaxPriceChange = (val) => {
    setMaxPrice(val);
    resetPage();
  };

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handlePurchaseClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsPurchaseOpen(true);
  };

  const handlePurchaseConfirm = async (id, qty) => {
    try {
      await inventoryService.purchase(id, qty);
      toast.success('Purchase successful! Thank you.');
      setIsPurchaseOpen(false);
      refresh();
    } catch (err) {
      const msg = err.userMessage || 'Purchase failed.';
      toast.error(msg);
    }
  };

  const handleRestockClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRestockOpen(true);
  };

  const handleRestockConfirm = async (id, qty) => {
    try {
      await inventoryService.restock(id, qty);
      toast.success('Inventory restocked successfully.');
      setIsRestockOpen(false);
      refresh();
    } catch (err) {
      const msg = err.userMessage || 'Restocking failed.';
      toast.error(msg);
    }
  };

  const handleAddClick = () => {
    setEditVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setEditVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSave = async (id, data) => {
    try {
      if (id) {
        await vehicleService.update(id, data);
        toast.success('Vehicle updated successfully.');
      } else {
        await vehicleService.create(data);
        toast.success('Vehicle added to catalog.');
      }
      setIsFormOpen(false);
      refresh();
    } catch (err) {
      const msg = err.userMessage || 'Saving vehicle failed.';
      toast.error(msg);
    }
  };

  const handleDeleteClick = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`)) {
      try {
        await vehicleService.remove(vehicle.id);
        toast.success('Vehicle deleted successfully.');
        refresh();
      } catch (err) {
        const msg = err.userMessage || 'Deletion failed.';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Vehicle Inventory
          </h1>
          <p className="text-slate-400 mt-1">
            Browse, search, and manage available dealership vehicles.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleAddClick}
            className="btn btn-primary self-start sm:self-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vehicle
          </button>
        )}
      </div>

      {/* Filter panel */}
      <div className="card p-6 space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Filters &amp; Search
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SearchBar
            make={make}
            model={model}
            onMakeChange={handleMakeChange}
            onModelChange={handleModelChange}
          />
          <CategoryFilter
            category={category}
            onCategoryChange={handleCategoryChange}
          />
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
          />
        </div>

        {(make || model || category || minPrice || maxPrice) && (
          <div className="flex items-center justify-between border-t border-surface-800 pt-4 mt-2">
            <span className="text-xs text-slate-400">
              Showing matching elements
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {error ? (
        <ErrorAlert message={error} onRetry={refresh} />
      ) : vehicles.length === 0 && !isLoading ? (
        <EmptyState onReset={clearFilters} />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-200">
              {isLoading ? 'Searching catalog…' : `Available Listings (${totalElements})`}
            </h2>
          </div>

          <VehicleGrid
            vehicles={vehicles}
            isLoading={isLoading}
            onPurchase={handlePurchaseClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onRestock={handleRestockClick}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      <PurchaseDialog
        vehicle={selectedVehicle}
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        onConfirm={handlePurchaseConfirm}
      />

      <RestockDialog
        vehicle={selectedVehicle}
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        onConfirm={handleRestockConfirm}
      />

      <VehicleForm
        vehicle={editVehicle}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
      />
    </div>
  );
}
