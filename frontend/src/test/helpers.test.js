import { describe, it, expect } from 'vitest';
import { formatCurrency, getCategoryColor, isAdmin, truncate } from '../utils/helpers';

describe('Helpers Utility Unit Tests', () => {
  describe('formatCurrency', () => {
    it('should format numbers into USD currency string', () => {
      expect(formatCurrency(28500)).toBe('$28,500');
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('getCategoryColor', () => {
    it('should map specific categories to correct badge class', () => {
      expect(getCategoryColor('Sedan')).toBe('badge-info');
      expect(getCategoryColor('SUV')).toBe('badge-success');
      expect(getCategoryColor('Truck')).toBe('badge-warn');
      expect(getCategoryColor('Coupe')).toBe('badge-danger');
      expect(getCategoryColor('Unknown')).toBe('badge-info');
    });
  });

  describe('isAdmin', () => {
    it('should identify users with ADMIN role', () => {
      expect(isAdmin({ role: 'ADMIN' })).toBe(true);
      expect(isAdmin({ role: 'USER' })).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe('truncate', () => {
    it('should truncate strings exceeding max length', () => {
      expect(truncate('Super Long Vehicle Model Name', 10)).toBe('Super Long…');
      expect(truncate('ShortName', 20)).toBe('ShortName');
    });
  });
});
