import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * MainLayout — wrapper for all authenticated pages.
 * Renders Navbar + page content via <Outlet />.
 *
 * Why a Layout component?
 *  - The Navbar doesn't need to be copy-pasted into every page
 *  - Adding a footer/sidebar later only requires changing this file
 *  - React Router v6 nesting makes this the idiomatic pattern
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
