// src/pages/OrdersPage.jsx
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  // Fetch orders from server
  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://localhost:5000/orders?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => toast.error("❌ Failed to load orders"));
  }, [currentUser]);

  // Cancel order and restore stock
  const cancelOrder = async (orderId) => {
    try {
      // 1️⃣ Find the order to cancel
      const orderToCancel = orders.find((o) => o.id === orderId);
      if (!orderToCancel) return;

      // 2️⃣ Restore stock for each item
      for (const item of orderToCancel.items) {
        const res = await fetch(`http://localhost:5000/products/${item.id}`);
        const product = await res.json();
        const newStock = (product.stock || 0) + (item.qty || 1);

        await fetch(`http://localhost:5000/products/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock }),
        });
      }

      // 3️⃣ Update order status to "Cancelled"
      await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      // 4️⃣ Update state locally
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );

      toast.info("⚡ Order cancelled and stock restored!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to cancel order");
    }
  };

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-xl text-gray-600 font-medium">No orders yet</p>
          <p className="text-gray-500 mt-2">
            Start shopping to see your orders here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-semibold text-gray-900">{order.id}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* Cancel Button */}
                  {order.status !== "Delivered" && order.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="ml-4 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium text-gray-900">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-indigo-600">₹{order.total}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Order Items
                  </h4>
                  <ul className="space-y-3">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">{item.qty}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">₹{item.price} each</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.price * item.qty}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
