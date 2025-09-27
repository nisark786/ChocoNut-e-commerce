import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function OrderSummary() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const cart = currentUser?.cart || [];

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  if (cart.length === 0) {
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
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {/* List of items */}
      <div className="space-y-4 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <p className="text-gray-500 text-sm">Qty: {item.qty || 1}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary totals */}
      <div className="border-t pt-4">
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

       
      </div>
    </div>
  );
}
