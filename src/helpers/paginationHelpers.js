// src/helpers/paginationHelpers.js

export const getPageItems = (items, currentPage, perPage) => {
  const start = (currentPage - 1) * perPage;
  return items.slice(start, start + perPage);
};

export const getTotalPages = (items, perPage) => {
  return Math.ceil(items.length / perPage);
};
