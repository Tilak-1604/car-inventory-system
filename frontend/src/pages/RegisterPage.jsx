import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterPage
 *
 * After successful registration, redirect to /login (NOT auto-login).
 * The user verifies their credentials explicitly on first login —
 * this is the safer and more deliberate UX pattern.
 */
export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: 'USER' } });

  const onSubmit = async (data) => {
    // Don't send confirmPassword to backend
    const { confirmPassword, ...payload } = data;
    try {
      await registerUser(payload);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.userMessage || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-glow mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-slate-400 mt-1">Join AutoInventory today</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            {/* Username */}
            <div>
              <label className="label" htmlFor="reg-username">Username</label>
              <input
                id="reg-username"
                type="text"
                placeholder="john_doe"
                autoComplete="username"
                className={`input ${errors.username ? 'input-error' : ''}`}
                {...register('username', {
                  required: 'Username is required',
                  minLength: { value: 3, message: 'At least 3 characters' },
                  maxLength: { value: 50, message: 'Max 50 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Only letters, numbers, and underscores',
                  },
                })}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                className={`input ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) =>
                    val === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full btn-lg mt-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
