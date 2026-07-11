import React from 'react';

/**
 * EmptyState — displayed when search or filters return no results.
 */
export default function EmptyState({ title = 'No vehicles found', message = 'Try adjusting your search filters or check back later.', onReset }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 card">
      <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="btn btn-outline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
