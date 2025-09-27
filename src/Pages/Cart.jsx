// src/pages/Cart.jsx
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Heart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { currentUser, addToCart, removeFromCart, updateCartQty, toggleWishlist } = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);

  const cart = currentUser?.cart || [];

  const startLoading = (id) => setLoadingIds((prev) => [...prev, id]);
  const stopLoading = (id) => setLoadingIds((prev) => prev.filter((i) => i !== id));

  const increaseQty = async (item) => {
    startLoading(item.id);
    const currentQty = item.qty || 1;

    if (currentQty >= item.stock) {
      toast.error(`❌ Only ${item.stock} items in stock!`);
      stopLoading(item.id);
      return;
    }

    await updateCartQty(item.id, currentQty + 1);
    toast.success("✅ Quantity increased!");
    stopLoading(item.id);
  };

  const decreaseQty = async (item) => {
    startLoading(item.id);
    const currentQty = item.qty || 1;

    if (currentQty > 1) {
      await updateCartQty(item.id, currentQty - 1);
      toast.info("⚡ Quantity decreased!");
    } else {
      await removeFromCart(item.id);
      toast.info("🛒 Item removed from cart!");
    }

    stopLoading(item.id);
  };


  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

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
        {cart.map((item) => {
                    const isOutOfStock = item.stock === 0;

          return (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                  <p className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                    {isOutOfStock ? "Out of Stock" : `In Stock: ${item.stock}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item)}
                    disabled={loadingIds.includes(item.id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{item.qty || 1}</span>
                  <button
                    onClick={() => increaseQty(item)}
                    disabled={loadingIds.includes(item.id) || item.qty >= item.stock}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>

                  <button
                    onClick={() => {
                      startLoading(item.id);
                      removeFromCart(item.id);
                      toast.info("🛒 Item removed from cart!");
                      stopLoading(item.id);
                    }}
                    disabled={loadingIds.includes(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                
              </div>
            </div>
          );
        })}
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
          onClick={() => navigate("/payment")}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mt-4 w-full"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
