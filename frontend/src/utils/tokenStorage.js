/**
 * tokenStorage — utility for managing the JWT in localStorage.
 *
 * Why localStorage (not cookies)?
 *  - Simpler to implement without a backend cookie config
 *  - Accessible synchronously in the JS context
 *  - Sufficient for this SPA; in a real bank-grade app, httpOnly cookies
 *    would be safer against XSS attacks
 */

const TOKEN_KEY = 'dealership_token';
const USER_KEY  = 'dealership_user';

export const tokenStorage = {
  /** Save JWT token */
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),

  /** Retrieve JWT token */
  getToken: () => localStorage.getItem(TOKEN_KEY),

  /** Remove JWT token */
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  /** Save user info (username, role) */
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

  /** Retrieve user info */
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  },

  /** Remove user info */
  removeUser: () => localStorage.removeItem(USER_KEY),

  /** Clear everything (on logout) */
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
