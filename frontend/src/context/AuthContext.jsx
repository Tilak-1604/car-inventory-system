import { createContext, useContext, useState, useCallback } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import authService from '../services/authService';

/**
 * AuthContext — single source of truth for authentication state.
 *
 * Why Context API instead of Redux?
 *  - Auth state is simple: { token, user, isAuthenticated }
 *  - Only 2 mutations: login + logout
 *  - Redux overhead (actions, reducers, selectors, middleware) is unjustified
 *  - Context + useReducer / useState covers this perfectly
 *
 * State shape:
 *  {
 *    user: { username: string, role: 'USER' | 'ADMIN' } | null,
 *    token: string | null,
 *    isAuthenticated: boolean,
 *    isLoading: boolean,
 *  }
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Rehydrate from localStorage on mount — enables "stay logged in" after refresh
  const [user, setUser]   = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getToken());

  const isAuthenticated = !!token;

  /**
   * login — call the auth API, persist token + user, update state.
   * @param {{ username, password }} credentials
   * @returns {Promise<{ username, role }>}
   */
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    // data = { token, type, username, role }
    const userInfo = { username: data.username, role: data.role };

    tokenStorage.setToken(data.token);
    tokenStorage.setUser(userInfo);
    setToken(data.token);
    setUser(userInfo);

    return userInfo;
  }, []);

  /**
   * register — call the register API (does NOT auto-login).
   * After registration the user is redirected to /login.
   */
  const register = useCallback(async (data) => {
    return authService.register(data);
  }, []);

  /**
   * logout — clear all auth state and localStorage.
   */
  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — convenience hook so consumers don't import AuthContext directly.
 * Throws a descriptive error if used outside AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
