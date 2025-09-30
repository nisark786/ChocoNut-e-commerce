// src/components/Shipment/ShipmentPage.jsx
import { useLocation } from "react-router-dom";
import OrderSummary from "./OrderSummery";
import ShippingAddress from "./ShippingAddress";
import { Truck, Package, CheckCircle, ArrowRight } from "lucide-react";

export default function ShipmentPage() {
  const location = useLocation();
  const { paymentMethod, paymentData } = location.state || {};

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Complete Your Order</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address - Left Side */}
          <div className="order-2 lg:order-2">
            <ShippingAddress paymentMethod={paymentMethod} paymentData={paymentData} />
          </div>

          {/* Order Summary - Right Side */}
          <div className="order-1 lg:order-1">
            <OrderSummary paymentMethod={paymentMethod} paymentData={paymentData} />
            
            {/* Additional Information */}
            <div className="mt-6 space-y-4">
              {/* Security Badge */}
              <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Secure Checkout</p>
                    <p className="text-sm text-amber-600">Your information is protected</p>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <div className="flex items-center space-x-2 text-amber-700 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="font-semibold">Need Help?</span>
                </div>
                <p className="text-sm text-amber-600">
                  Our support team is here to help with your order. 
                  Call us at <span className="font-semibold">+91 98765 43210</span>
                </p>
              </div>

              {/* Delivery Promise */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 p-4">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Truck className="w-4 h-4" />
                  <span className="font-semibold text-sm">Our Promise</span>
                </div>
                <ul className="text-xs text-amber-700 mt-2 space-y-1">
                  <li className="flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Fresh ingredients guaranteed</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>2-3 day delivery across India</span>
                  </li>
                  <li className="flex items-center space-x-1">
                    <ArrowRight className="w-3 h-3" />
                    <span>Gift-ready packaging included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-amber-600 text-sm">
            By completing your order, you agree to our{" "}
            <button className="text-amber-700 hover:text-amber-900 font-semibold underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-amber-700 hover:text-amber-900 font-semibold underline">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}