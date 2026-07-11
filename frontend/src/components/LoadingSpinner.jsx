/**
 * LoadingSpinner — centered spinner for full-page loading states.
 * @param {string} message — optional label below the spinner
 */
export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface-800" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse">{message}</p>
    </div>
  );
}
