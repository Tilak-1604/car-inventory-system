import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage
 *
 * Why React Hook Form?
 *  - Uncontrolled inputs — no re-render on every keystroke
 *  - Built-in validation with descriptive messages
 *  - Minimal boilerplate vs useState for every field
 *
 * Flow:
 *  1. User submits form
 *  2. useAuth().login() calls backend → gets JWT + role
 *  3. JWT is stored in localStorage via AuthContext
 *  4. Redirect to the page they originally tried to visit
 *     (or dashboard if no prior location)
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after successful login
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success(`Welcome back, ${data.username}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.userMessage || 'Invalid username or password.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-glow mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to AutoInventory</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Username */}
            <div>
              <label className="label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="your_username"
                autoComplete="username"
                className={`input ${errors.username ? 'input-error' : ''}`}
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                })}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full btn-lg mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
