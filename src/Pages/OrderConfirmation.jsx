// src/pages/OrderConfirmation.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentMethod, paymentData, orderId: locationOrderId, items = [] } = location.state || {};
  const { currentUser } = useContext(UserContext);

  const [orderId, setOrderId] = useState(locationOrderId || Date.now());

  // Save order to json-server
  useEffect(() => {
    if (!currentUser || !paymentMethod) return;

    const newOrder = {
      id: orderId,
      userId: currentUser.id,
      items,
      paymentMethod,
      paymentData,
      date: new Date().toISOString(),
      status: "Processing",
    };

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
      })
      .catch((err) => {
        console.error("Error saving order:", err);
      });
  }, [currentUser, paymentMethod, paymentData, items, orderId]);

  const renderPaymentDetails = () => {
    if (!paymentMethod) return null;

    switch (paymentMethod) {
      case "card":
        return <p className="mb-2">Card ending with {paymentData?.cardNumber?.slice(-4)}</p>;
      case "upi":
        return <p className="mb-2">UPI ID: {paymentData?.upiId}</p>;
      case "netbanking":
        return <p className="mb-2">Bank: {paymentData?.bank}</p>;
      case "cod":
        return <p className="mb-2">Cash on Delivery</p>;
      default:
        return null;
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold mb-4">Please login to view your orders.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-20 max-w-md mx-auto text-center bg-white shadow-lg rounded-lg p-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-4 text-green-600">✅ Order Placed Successfully!</h2>
      <p className="text-lg mb-4">
        Thank you {currentUser?.name || "Customer"}! Your order #{orderId} is being processed.
      </p>

      {paymentMethod && (
        <p className="text-md font-medium mb-2">
          Payment Method: {paymentMethod.toUpperCase()}
        </p>
      )}

      {renderPaymentDetails()}

      <div className="mt-6 flex flex-col gap-3 w-full">
        <Link
          to="/orders"
          className="w-full bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition text-center"
        >
          View Orders
        </Link>

        <Link
          to="/shops"
          className="w-full text-green-600 hover:underline text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
