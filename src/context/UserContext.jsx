// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null; // ⚡ default is null
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Helper to update user
  const updateUser = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // ---------------- CART ----------------
  const addToCart = (product) => {
    if (!currentUser) return;
    const exists = currentUser.cart?.some((i) => i.id === product.id);
    if (!exists) {
      updateUser({ cart: [...(currentUser.cart || []), { ...product, qty: 1 }] });
    }
  };

  const removeFromCart = (productId) => {
    if (!currentUser) return;
    updateUser({ cart: currentUser.cart.filter((item) => item.id !== productId) });
  };

  const updateCartQty = (productId, qty) => {
    if (!currentUser) return;
    updateUser({
      cart: currentUser.cart.map((item) =>
        item.id === productId ? { ...item, qty } : item
      ),
    });
  };

  // ---------------- WISHLIST ----------------
  const toggleWishlist = (product) => {
    if (!currentUser) return;
    const exists = currentUser.wishlist?.some((i) => i.id === product.id);
    updateUser({
      wishlist: exists
        ? currentUser.wishlist.filter((i) => i.id !== product.id)
        : [...(currentUser.wishlist || []), product],
    });
  };

  // ---------------- ORDERS ----------------
  const addOrder = (order) => {
    if (!currentUser) return;
    updateUser({
      orders: [...(currentUser.orders || []), { ...order, status: "placed" }],
      cart: [], // clear cart
      stock: reduceStock(currentUser.stock, order.items),
    });
  };

  const cancelOrder = (orderId) => {
    if (!currentUser) return;
    const order = currentUser.orders.find((o) => o.id === orderId);

    if (order && order.status !== "cancelled") {
      const restoredStock = restoreStock(currentUser.stock, order.items);

      updateUser({
        orders: currentUser.orders.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        ),
        stock: restoredStock,
      });
    }
  };

  // ---------------- STOCK HELPERS ----------------
  const reduceStock = (stock, items) => {
    const newStock = { ...stock };
    items.forEach((item) => {
      if (newStock[item.id]) {
        newStock[item.id] = Math.max(newStock[item.id] - (item.qty || 1), 0);
      }
    });
    return newStock;
  };

  const restoreStock = (stock, items) => {
    const newStock = { ...stock };
    items.forEach((item) => {
      if (newStock[item.id]) {
        newStock[item.id] = newStock[item.id] + (item.qty || 1);
      }
    });
    return newStock;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
        addOrder,
        cancelOrder,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
