import api from './api';

/**
 * inventoryService — purchase and restock operations.
 */
const inventoryService = {
  /**
   * POST /api/vehicles/:id/purchase
   * @param {number} id — vehicle id
   * @param {number} quantity — units to purchase
   * @returns {Promise<VehicleResponse>}
   */
  purchase: (id, quantity) =>
    api.post(`/vehicles/${id}/purchase`, { quantity }).then((res) => res.data),

  /**
   * POST /api/vehicles/:id/restock (ADMIN only)
   * @param {number} id — vehicle id
   * @param {number} quantity — units to add
   * @returns {Promise<VehicleResponse>}
   */
  restock: (id, quantity) =>
    api.post(`/vehicles/${id}/restock`, { quantity }).then((res) => res.data),
};

export default inventoryService;
