import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

/**
 * Axios instance — the single HTTP client for the entire app.
 *
 * Why a shared instance?
 *  - One place to configure baseURL, headers, and timeouts
 *  - Interceptors run for every request/response automatically
 *  - Easy to test by mocking this module
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST interceptor — attaches JWT Bearer token to every outgoing request.
 *
 * Why interceptors instead of per-call headers?
 *  - DRY — the token is attached in exactly one place
 *  - Automatic — new service functions get auth for free
 *  - Token changes (refresh) only need to be updated here
 */
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE interceptor — handles global error scenarios.
 *
 * 401 Unauthorized → token expired or invalid: clear storage, redirect to /login
 * 403 Forbidden    → logged in but insufficient role (USER trying ADMIN action)
 *                    Let the caller handle it (show a toast)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — force logout
      tokenStorage.clear();
      // Redirect only if not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Enrich the error with a human-readable message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    error.userMessage = message;

    return Promise.reject(error);
  }
);

export default api;
