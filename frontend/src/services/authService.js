import api from './api';

/**
 * authService — wraps all authentication API calls.
 * Pages/hooks never call Axios directly; they call these functions.
 */
const authService = {
  /**
   * Register a new user.
   * POST /api/auth/register
   * @param {{ username, email, password, role }} data
   * @returns {Promise<{ id, username, email, role }>}
   */
  register: (data) =>
    api.post('/auth/register', data).then((res) => res.data),

  /**
   * Log in and receive a JWT token.
   * POST /api/auth/login
   * @param {{ username, password }} credentials
   * @returns {Promise<{ token, type, username, role }>}
   */
  login: (credentials) =>
    api.post('/auth/login', credentials).then((res) => res.data),
};

export default authService;
