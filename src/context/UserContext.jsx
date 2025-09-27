// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
const API_URL = "http://localhost:5000";

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("currentUser");
  }, [currentUser]);

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  // ---------------- CART ----------------
  const addToCart = async (product) => {
    if (!currentUser) return;

    const exists = currentUser.cart?.some((i) => i.id === product.id);
    const newCart = exists ? currentUser.cart : [...(currentUser.cart || []), { ...product, qty: 1 }];

    // Update both /users and /carts
    await axios.patch(`${API_URL}/users/${currentUser.id}`, { cart: newCart });
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });

    setCurrentUser({ ...currentUser, cart: newCart });
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    const newCart = currentUser.cart.filter((item) => item.id !== productId);

    await axios.patch(`${API_URL}/users/${currentUser.id}`, { cart: newCart });
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });

    setCurrentUser({ ...currentUser, cart: newCart });
  };

  const updateCartQty = async (productId, qty) => {
    if (!currentUser) return;
    const newCart = currentUser.cart.map((item) =>
      item.id === productId ? { ...item, qty } : item
    );

    await axios.patch(`${API_URL}/users/${currentUser.id}`, { cart: newCart });
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });

    setCurrentUser({ ...currentUser, cart: newCart });
  };

  // ---------------- WISHLIST ----------------
  const toggleWishlist = async (product) => {
    if (!currentUser) return;

    const exists = currentUser.wishlist?.some((i) => i.id === product.id);
    const newWishlist = exists
      ? currentUser.wishlist.filter((i) => i.id !== product.id)
      : [...(currentUser.wishlist || []), product];

    await axios.patch(`${API_URL}/users/${currentUser.id}`, { wishlist: newWishlist });
    await axios.patch(`${API_URL}/wishlists/${currentUser.id}`, { items: newWishlist });

    setCurrentUser({ ...currentUser, wishlist: newWishlist });
  };

  // ---------------- ORDERS ----------------
  const addOrder = async (order) => {
    if (!currentUser) return;

    const newOrder = {
      userId: currentUser.id,
      items: order.items,
      total: order.total,
      status: "placed",
      createdAt: new Date().toISOString(),
    };

    await axios.post(`${API_URL}/orders`, newOrder);

    // Clear cart in /users and /carts
    await axios.patch(`${API_URL}/users/${currentUser.id}`, { cart: [] });
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: [] });

    setCurrentUser({ ...currentUser, cart: [] });
  };

  const cancelOrder = async (orderId) => {
    await axios.patch(`${API_URL}/orders/${orderId}`, { status: "cancelled" });
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
