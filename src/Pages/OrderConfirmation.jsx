// src/pages/OrderConfirmation.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { CheckCircle, Package, Truck, Clock, ArrowRight, Home, ShoppingBag, CreditCard, Wallet, Banknote, Smartphone } from "lucide-react";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentMethod, paymentData, orderId: locationOrderId, items = [], total } = location.state || {};
  const { currentUser } = useContext(UserContext);

  const [orderId, setOrderId] = useState(locationOrderId || Date.now());
  const [isSaving, setIsSaving] = useState(true);

  // Save order to json-server
  useEffect(() => {
    if (!currentUser || !paymentMethod) return;

    const newOrder = {
      id: orderId,
      userId: currentUser.id,
      items,
      total: total || items.reduce((sum, item) => sum + (item.price * item.qty), 0),
      paymentMethod,
      paymentData,
      date: new Date().toISOString(),
      status: "Processing",
    };

    setIsSaving(true);
    
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save order");
        return res.json();
      })
      .then((data) => {
        console.log("Order saved:", data);
        setIsSaving(false);
      })
      .catch((err) => {
        console.error("Error saving order:", err);
        setIsSaving(false);
      });
  }, [currentUser, paymentMethod, paymentData, items, orderId, total]);

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case "card":
        return <CreditCard className="w-5 h-5" />;
      case "upi":
        return <Smartphone className="w-5 h-5" />;
      case "netbanking":
        return <Banknote className="w-5 h-5" />;
      case "cod":
        return <Wallet className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const renderPaymentDetails = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod) {
      case "card":
        return (
          <div className="flex items-center space-x-2 text-amber-700">
            <CreditCard className="w-4 h-4" />
            <span>Card ending with {paymentData?.cardNumber?.slice(-4)}</span>
          </div>
        );
      case "upi":
        return (
          <div className="flex items-center space-x-2 text-amber-700">
            <Smartphone className="w-4 h-4" />
            <span>UPI ID: {paymentData?.upiId}</span>
          </div>
        );
      case "netbanking":
        return (
          <div className="flex items-center space-x-2 text-amber-700">
            <Banknote className="w-4 h-4" />
            <span>Bank: {paymentData?.bank}</span>
          </div>
        );
      case "cod":
        return (
          <div className="flex items-center space-x-2 text-amber-700">
            <Wallet className="w-4 h-4" />
            <span>Cash on Delivery</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Order Confirmation</h2>
          <p className="text-amber-700 mb-6">Please login to view your order confirmation.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Login to Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Order Confirmed!</h1>
          <p className="text-amber-700 text-lg">
            Thank you {currentUser?.name || "Customer"}! Your order has been placed successfully.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Details */}
            <div>
              <h3 className="font-semibold text-amber-900 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Order Details</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-amber-600">Order ID</span>
                  <span className="font-mono font-semibold text-amber-900">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-600">Order Date</span>
                  <span className="text-amber-900">{new Date().toLocaleDateString()}</span>
                </div>
                
              </div>
            </div>

            {/* Delivery & Payment */}
            <div>
              <h3 className="font-semibold text-amber-900 mb-4 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <span>Delivery & Payment</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-amber-600">Est. Delivery</span>
                  <span className="text-amber-900">{getEstimatedDelivery()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-600">Status</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                    Processing
                  </span>
                </div>
               
              </div>
            </div>
          </div>
        </div>

        
        {/* Next Steps */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>What's Next?</span>
          </h3>
          <div className="space-y-2 text-amber-700">
            <p>• You'll receive an order confirmation email shortly</p>
            <p>• We'll notify you when your order ships</p>
            <p>• Estimated delivery: {getEstimatedDelivery()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 text-center flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/shops"
            className="border border-amber-300 text-amber-700 py-3 px-6 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200 text-center flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Quick Home Navigation */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}