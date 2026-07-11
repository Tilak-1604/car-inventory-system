import React from 'react';
import VehicleCard from './VehicleCard';

/**
 * VehicleGrid
 * Displays a responsive grid of VehicleCards or loading skeletons.
 */
export default function VehicleGrid({
  vehicles,
  isLoading,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card overflow-hidden h-[420px] flex flex-col justify-between p-5 space-y-4">
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="space-y-2 flex-grow mt-4">
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-8 w-1/3" />
            </div>
            <div className="skeleton h-10 w-full rounded-lg mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="animate-slide-up">
          <VehicleCard
            vehicle={vehicle}
            onPurchase={onPurchase}
            onEdit={onEdit}
            onDelete={onDelete}
            onRestock={onRestock}
          />
        </div>
      ))}
    </div>
  );
}
