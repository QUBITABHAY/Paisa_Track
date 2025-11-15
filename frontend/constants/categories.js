/**
 * Category definitions for expenses and income
 */

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', label: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', label: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', label: 'Shopping', icon: 'cart', color: '#45B7D1' },
  { id: 'bills', name: 'Bills & Utilities', label: 'Bills', icon: 'document-text', color: '#96CEB4' },
  { id: 'entertainment', name: 'Entertainment', label: 'Entertainment', icon: 'musical-notes', color: '#FFEAA7' },
  { id: 'health', name: 'Health & Fitness', label: 'Health', icon: 'fitness', color: '#FD79A8' },
  { id: 'education', name: 'Education', label: 'Education', icon: 'school', color: '#A29BFE' },
  { id: 'other', name: 'Other', label: 'Other', icon: 'apps', color: '#636E72' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', label: 'Salary', icon: 'cash', color: '#00B894' },
  { id: 'freelance', name: 'Freelance', label: 'Freelance', icon: 'laptop', color: '#6C5CE7' },
  { id: 'investment', name: 'Investment', label: 'Investment', icon: 'trending-up', color: '#0984E3' },
  { id: 'business', name: 'Business', label: 'Business', icon: 'business', color: '#FDCB6E' },
  { id: 'gift', name: 'Gift', label: 'Gift', icon: 'gift', color: '#E17055' },
  { id: 'refund', name: 'Refund', label: 'Refund', icon: 'refresh', color: '#74B9FF' },
  { id: 'other', name: 'Other', label: 'Other', icon: 'apps', color: '#636E72' },
];

export const PAYMENT_METHODS = ['UPI', 'Card', 'Cash', 'Net Banking', 'Wallet'];

/**
 * Get category details by ID
 */
export const getCategoryById = (categoryId, type = 'expense') => {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  return categories.find(cat => cat.id === categoryId) || EXPENSE_CATEGORIES[7]; // Return 'other' as default
};

/**
 * Get all categories as a map for quick lookup
 */
export const getCategoriesMap = () => {
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return allCategories.reduce((map, cat) => {
    map[cat.id] = cat;
    return map;
  }, {});
};
