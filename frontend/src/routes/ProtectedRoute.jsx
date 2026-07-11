import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards any route that requires authentication.
 *
 * Why a separate component instead of inline checks in each page?
 *  - Single Responsibility: auth logic lives in one place
 *  - Pages are clean — they assume they have an authenticated user
 *  - Easy to change the auth check without touching every page
 *
 * Usage in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<Dashboard />} />
 *   </Route>
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but remember where they were trying to go
    // so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/**
 * AdminRoute — guards routes that require the ADMIN role.
 * Authenticated USERs get a 403-like redirect to the dashboard.
 *
 * Usage in App.jsx:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin" element={<AdminPage />} />
 *   </Route>
 */
export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Authenticated but wrong role → back to dashboard
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
