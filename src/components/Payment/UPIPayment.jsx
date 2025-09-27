// src/components/Payment/UPIPayment.jsx
import { useState, useEffect } from "react";

export default function UPIPayment({ setPaymentData }) {
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    setPaymentData({ method: "upi", upiId: upiId.trim() });
  }, [upiId, setPaymentData]);

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="border p-2 rounded" />
      <p className="text-gray-600 text-sm">Ensure your UPI ID is linked with your bank.</p>
    </div>
  );
}
