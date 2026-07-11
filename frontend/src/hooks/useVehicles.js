import { useState, useEffect, useCallback, useRef } from 'react';
import vehicleService from '../services/vehicleService';

/**
 * useVehicles — hook to manage vehicle list, search filters, pagination, and data loading.
 */
export default function useVehicles(page, size) {
  const [vehicles, setVehicles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounced search queries
  const [debouncedMake, setDebouncedMake] = useState('');
  const [debouncedModel, setDebouncedModel] = useState('');

  // Track keystroke timeouts for debouncing search inputs
  const timeoutRef = useRef(null);

  // Debounce logic for text inputs (make and model)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedMake(make);
      setDebouncedModel(model);
    }, 400); // 400ms debounce

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [make, model]);

  /** Fetch vehicles based on current query parameters and pagination */
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size,
        sort: 'id,desc', // Sort new vehicles first
      };

      if (debouncedMake.trim()) params.make = debouncedMake.trim();
      if (debouncedModel.trim()) params.model = debouncedModel.trim();
      if (category) params.category = category;
      if (minPrice) params.minPrice = parseFloat(minPrice);
      if (maxPrice) params.maxPrice = parseFloat(maxPrice);

      const response = await vehicleService.search(params);
      setVehicles(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError(err.userMessage || 'Failed to load vehicles.');
    } finally {
      setIsLoading(false);
    }
  }, [page, size, debouncedMake, debouncedModel, category, minPrice, maxPrice]);

  // Fetch when dependency parameters change
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const clearFilters = useCallback(() => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  }, []);

  return {
    vehicles,
    totalPages,
    totalElements,
    isLoading,
    error,
    make,
    model,
    category,
    minPrice,
    maxPrice,
    setMake,
    setModel,
    setCategory,
    setMinPrice,
    setMaxPrice,
    clearFilters,
    refresh: fetchVehicles,
  };
}
