import React from 'react';

/**
 * SearchBar — text inputs for Make and Model.
 */
export default function SearchBar({ make, model, onMakeChange, onModelChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div>
        <label className="label" htmlFor="search-make">Make</label>
        <input
          id="search-make"
          type="text"
          placeholder="e.g. Toyota"
          value={make}
          onChange={(e) => onMakeChange(e.target.value)}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="search-model">Model</label>
        <input
          id="search-model"
          type="text"
          placeholder="e.g. Camry"
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="input"
        />
      </div>
    </div>
  );
}
