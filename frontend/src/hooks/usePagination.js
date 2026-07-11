import { useState, useCallback } from 'react';

/**
 * usePagination — custom hook to encapsulate pagination state.
 */
export default function usePagination(initialSize = 6) {
  const [page, setPage] = useState(0);
  const [size] = useState(initialSize);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    size,
    setPage,
    resetPage,
  };
}
