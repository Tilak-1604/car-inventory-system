import React from 'react';

/**
 * PriceFilter — minimum and maximum price range inputs.
 */
export default function PriceFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div>
        <label className="label" htmlFor="filter-min-price">Min Price ($)</label>
        <input
          id="filter-min-price"
          type="number"
          placeholder="0"
          min="0"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="filter-max-price">Max Price ($)</label>
        <input
          id="filter-max-price"
          type="number"
          placeholder="No Max"
          min="0"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="input"
        />
      </div>
    </div>
  );
}
