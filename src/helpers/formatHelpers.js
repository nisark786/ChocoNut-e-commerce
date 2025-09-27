// src/helpers/formatHelpers.js

// Format price nicely
export const formatPrice = (price) => `₹${price.toFixed(2)}`;

// Shorten long text
export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
