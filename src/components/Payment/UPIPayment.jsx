// src/components/Payment/UPIPayment.jsx
import { useState, useEffect } from "react";

export default function UPIPayment({ setPaymentData }) {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  // Validate UPI ID
  useEffect(() => {
    setError("");
    const upiRegex = /^[\w.\-_]{2,256}@[a-zA-Z]{2,64}$/; // Example: username@bank

    if (!upiId.trim()) {
      setError("UPI ID is required");
      setPaymentData(null);
    } else if (!upiRegex.test(upiId)) {
      setError("Enter a valid UPI ID (e.g. username@upi)");
      setPaymentData(null);
    } else {
      setError("");
      setPaymentData({ method: "upi", upiId });
    }
  }, [upiId, setPaymentData]);

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <input
        type="text"
        placeholder="Enter UPI ID (e.g. name@upi)"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className="border p-2 rounded"
      />

      <p className="text-gray-600 text-sm">
        Make sure your UPI ID is linked with your bank for successful payment.
      </p>
    </div>
  );
}
