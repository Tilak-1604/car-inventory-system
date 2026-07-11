/**
 * formatCurrency — formats a number as USD currency.
 * Example: 28500 → "$28,500.00"
 */
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * getCategoryColor — returns a Tailwind badge class for a vehicle category.
 */
export const getCategoryColor = (category) => {
  const map = {
    Sedan:   'badge-info',
    SUV:     'badge-success',
    Truck:   'badge-warn',
    Coupe:   'badge-danger',
    Hatchback: 'badge-info',
    Van:     'badge-warn',
    Convertible: 'badge-danger',
  };
  return map[category] ?? 'badge-info';
};

/**
 * isAdmin — checks if the current user has ADMIN role.
 */
export const isAdmin = (user) => user?.role === 'ADMIN';

/**
 * truncate — truncates a string to a max length with ellipsis.
 */
export const truncate = (str, max = 30) =>
  str && str.length > max ? `${str.slice(0, max)}…` : str;
