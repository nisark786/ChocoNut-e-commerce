// src/helpers/cartHelpers.js

// Calculate total cart amount
export const calculateCartTotal = (cart) => {
  return cart?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;
};

// Update quantity safely
export const updateCartQuantity = (cart, productId, delta) => {
  return cart.map((item) => {
    if (item.id === productId) {
      const newQty = item.qty + delta;
      return { ...item, qty: newQty > 0 ? newQty : 1 };
    }
    return item;
  });
};
