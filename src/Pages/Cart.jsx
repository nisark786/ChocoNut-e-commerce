// src/pages/Cart.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { currentUser, updateCartQty, removeFromCart, setCurrentUser } =
    useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
  const [cart, setCart] = useState([]);

  // ------------------ Fetch cart ------------------
  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/carts/${currentUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cart not found");
        return res.json();
      })
      .then((data) => setCart(data.items || []))
      .catch(() => toast.error("❌ Failed to load cart"));
  }, [currentUser]);

  const startLoading = (id) => setLoadingIds((prev) => [...prev, id]);
  const stopLoading = (id) =>
    setLoadingIds((prev) => prev.filter((i) => i !== id));

  // ------------------ Quantity increase ------------------
  const increaseQty = async (item) => {
    if (item.qty >= item.stock) {
      toast.error(`❌ Only ${item.stock} items in stock!`);
      return;
    }

    startLoading(item.id);
    const updatedQty = item.qty + 1;

    try {
      await fetch(`http://localhost:5000/carts/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) =>
            i.id === item.id ? { ...i, qty: updatedQty } : i
          ),
        }),
      });

      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, qty: updatedQty } : i))
      );
      updateCartQty(item.id, updatedQty);
      toast.success("✅ Quantity increased!");
    } catch {
      toast.error("❌ Failed to update quantity");
    }
    stopLoading(item.id);
  };

  // ------------------ Quantity decrease ------------------
  const decreaseQty = async (item) => {
    if (item.qty <= 1) return removeCartItem(item.id);

    startLoading(item.id);
    const updatedQty = item.qty - 1;

    try {
      await fetch(`http://localhost:5000/carts/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i) =>
            i.id === item.id ? { ...i, qty: updatedQty } : i
          ),
        }),
      });

      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, qty: updatedQty } : i))
      );
      updateCartQty(item.id, updatedQty);
      toast.info("⚡ Quantity decreased!");
    } catch {
      toast.error("❌ Failed to update quantity");
    }
    stopLoading(item.id);
  };

  // ------------------ Remove item ------------------
  const removeCartItem = async (id) => {
    startLoading(id);
    try {
      const newItems = cart.filter((i) => i.id !== id);

      await fetch(`http://localhost:5000/carts/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: newItems }),
      });

      setCart(newItems);
      removeFromCart(id);
      toast.info("🛒 Item removed from cart!");
    } catch {
      toast.error("❌ Failed to remove item");
    }
    stopLoading(id);
  };

  // ------------------ Proceed to Payment ------------------
  const handleCheckout = () => {
    if (!cart.length) return;

    // Save cart & subtotal in localStorage for Payment & Shipping pages
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    localStorage.setItem("checkoutTotal", subtotal);

    // Navigate to Payment page
    navigate("/payment");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!currentUser || cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty 🛍️</h2>
        <button
          onClick={() => navigate("/shops")}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <p
                  className={`text-sm font-medium ${
                    item.stock === 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.stock === 0
                    ? "Out of Stock"
                    : `In Stock: ${item.stock}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item)}
                  disabled={loadingIds.includes(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => increaseQty(item)}
                  disabled={loadingIds.includes(item.id) || item.qty >= item.stock}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
                <button
                  onClick={() => removeCartItem(item.id)}
                  disabled={loadingIds.includes(item.id)}
                  className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="flex justify-between mb-2">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </p>
        <p className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>₹{subtotal}</span>
        </p>
        <hr className="my-2" />
        <p className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{subtotal}</span>
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mt-4 w-full"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
