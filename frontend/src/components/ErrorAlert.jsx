import React from 'react';

/**
 * ErrorAlert — displays a dismissible or static error alert box.
 */
export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-red-400">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-danger btn-sm whitespace-nowrap"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
