// src/pages/OrdersPage.jsx
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ArrowLeft,
  ShoppingBag
} from "lucide-react";

export default function OrdersPage() {
  const { currentUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  // Fetch orders from server
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/orders?userId=${currentUser.id}`);
        const data = await res.json();
        // Sort orders by date (newest first)
        const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Cancel order and restore stock
  const cancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      
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
    } finally {
      setCancellingOrder(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Processing":
        return <RefreshCw className="w-5 h-5 text-amber-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Order History</h2>
          <p className="text-amber-700 mb-6">Please login to view your order history and tracking information.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-amber-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">No Orders Yet</h2>
          <p className="text-amber-700 mb-8 text-lg">
            Start your ChocoNut journey! Your delicious orders will appear here.
          </p>
          <button
            onClick={() => window.location.href = "/shops"}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">My Orders</h1>
          <p className="text-amber-700 text-lg">
            Track and manage your {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <Package className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-amber-600">Order ID</p>
                      <p className="font-mono font-semibold text-amber-900">#{order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>

                    {/* Cancel Button */}
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {cancellingOrder === order.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{cancellingOrder === order.id ? "Cancelling..." : "Cancel"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <p className="text-sm text-amber-600">Order Date</p>
                    <p className="font-medium text-amber-900 text-lg">
                      {new Date(order.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-amber-600">Total Amount</p>
                    <p className="text-2xl font-bold text-amber-600">₹{order.total}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-amber-900 mb-4 flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                    <span>Order Items ({order.items.length})</span>
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center shadow">
                            <span className="text-amber-700 font-bold">{item.qty}</span>
                          </div>
                          <div>
                            <p className="font-medium text-amber-900">{item.name}</p>
                            <p className="text-sm text-amber-600">₹{item.price} each</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-900">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}