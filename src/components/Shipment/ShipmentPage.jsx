// src/components/Shipment/ShipmentPage.jsx
import { useLocation } from "react-router-dom";
import OrderSummary from "./OrderSummery";
import ShippingAddress from "./ShippingAddress";

export default function ShipmentPage() {
  const location = useLocation();
  const { paymentMethod, paymentData } = location.state || {};

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2"><OrderSummary paymentMethod={paymentMethod} paymentData={paymentData} /></div>
        <div className="md:w-1/2"><ShippingAddress paymentMethod={paymentMethod} paymentData={paymentData} /></div>
      </div>
    </div>
  );
}
