import api from './api';

/**
 * vehicleService — all vehicle CRUD + search API calls.
 */
const vehicleService = {
  /** GET /api/vehicles */
  getAll: () =>
    api.get('/vehicles').then((res) => res.data),

  /** GET /api/vehicles/:id */
  getById: (id) =>
    api.get(`/vehicles/${id}`).then((res) => res.data),

  /**
   * GET /api/vehicles/search
   * @param {object} params — { make, model, category, minPrice, maxPrice, page, size, sort }
   */
  search: (params) =>
    api.get('/vehicles/search', { params }).then((res) => res.data),

  /** POST /api/vehicles */
  create: (data) =>
    api.post('/vehicles', data).then((res) => res.data),

  /** PUT /api/vehicles/:id */
  update: (id, data) =>
    api.put(`/vehicles/${id}`, data).then((res) => res.data),

  /** DELETE /api/vehicles/:id */
  remove: (id) =>
    api.delete(`/vehicles/${id}`).then((res) => res.data),
};

export default vehicleService;
