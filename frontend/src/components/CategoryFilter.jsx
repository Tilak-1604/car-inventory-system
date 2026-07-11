import React from 'react';

/**
 * CategoryFilter — select dropdown for category filter.
 */
export default function CategoryFilter({ category, onCategoryChange }) {
  const categories = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Van', 'Convertible'];

  return (
    <div>
      <label className="label" htmlFor="filter-category">Category</label>
      <select
        id="filter-category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="input"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
