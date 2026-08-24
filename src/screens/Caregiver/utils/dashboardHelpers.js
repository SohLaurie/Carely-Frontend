/**
 * Utility helper functions for the Caregiver Dashboard
 */

/**
 * Formats currency amount to XAF style
 * @param {string|number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (typeof amount === 'number') {
    return `${amount.toLocaleString()} XAF`;
  }
  return amount;
};

/**
 * Calculates rating percentage or details if needed
 * @param {number} rating 
 * @param {number} maxRating 
 * @returns {number}
 */
export const calculateRatingPercentage = (rating, maxRating = 5) => {
  return (rating / maxRating) * 100;
};
