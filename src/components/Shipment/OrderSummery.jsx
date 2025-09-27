// src/components/Shipment/OrderSummary.jsx
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function OrderSummary({ paymentMethod, paymentData }) {
  const { currentUser } = useContext(UserContext);
  const cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const renderPaymentDetails = () => {
    if (!paymentMethod) return null;
    switch (paymentMethod) {
      case "card": return <p>Card ending: {paymentData?.cardNumber?.slice(-4)}</p>;
      case "upi": return <p>UPI ID: {paymentData?.upiId}</p>;
      case "netbanking": return <p>Bank: {paymentData?.bank}</p>;
      case "cod": return <p>Cash on Delivery</p>;
      default: return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <p className="text-gray-500 text-sm">Qty: {item.qty || 1}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="flex justify-between mb-2"><span>Total Items:</span><span>{totalItems}</span></p>
        <p className="flex justify-between mb-2"><span>Subtotal:</span><span>₹{subtotal}</span></p>
        {paymentMethod && <div className="mt-2"><p className="font-medium">Payment Method: {paymentMethod.toUpperCase()}</p>{renderPaymentDetails()}</div>}
        <hr className="my-2" />
        <p className="flex justify-between font-bold text-lg"><span>Total:</span><span>₹{subtotal}</span></p>
      </div>
    </div>
  );
}
