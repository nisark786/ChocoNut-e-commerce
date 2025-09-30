// src/components/Shipment/OrderSummary.jsx
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Package, CreditCard, Wallet } from "lucide-react";

export default function OrderSummary({ paymentMethod, paymentData }) {
  const { currentUser } = useContext(UserContext);
  const cart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  const shipping = 0 ;
  const total = subtotal;

 


  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-900">Order Summary</h2>
          <p className="text-amber-600 text-sm">{totalItems} {totalItems === 1 ? 'item' : 'items'} in cart</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">Items</h3>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-3 flex-1">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded-lg shadow-sm" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-amber-900 truncate">{item.name}</h3>
                <p className="text-amber-600 text-sm">₹{item.price} × {item.qty || 1}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-amber-900">₹{item.price * (item.qty || 1)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-amber-700">Subtotal ({totalItems} items)</span>
            <span className="text-amber-900">₹{subtotal}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-amber-700">Shipping</span>
            <span className="text-green-600 font-semibold">
              FREE
            </span>
          </div>


          <hr className="border-amber-200" />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-amber-900">Total Amount</span>
            <span className="text-amber-600">₹{total}</span>
          </div>
        </div>
      </div>


      {/* Delivery Information */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-3 flex items-center space-x-2">
          <span>Delivery Information</span>
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-amber-700">Est. Delivery</span>
            <span className="text-amber-900 font-medium">{getEstimatedDelivery()}</span>
          </div>
         
        </div>
      </div>


     
    
    </div>
  );
}