// src/components/Payment/PaymentPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CardPayment from "./CardPayment";
import UPIPayment from "./UPIPayment";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({});
  const [error, setError] = useState("");

  const methods = [
    { name: "Card", value: "card" },
    { name: "UPI", value: "upi" },
    { name: "NetBanking", value: "netbanking" },
    { name: "COD", value: "cod" },
  ];

  const validate = () => {
    if (paymentMethod === "card") {
      const { name, cardNumber, expiry, cvv } = paymentData || {};
      if (!name?.trim()) return "Name is required";
      if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) return "Card number must be 16 digits";
      if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format";
      if (!cvv || !/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits";
    }

    if (paymentMethod === "upi") {
      const { upiId } = paymentData || {};
      if (!upiId?.match(/^[\w.-]+@[\w.-]+$/)) return "Enter valid UPI ID";
    }

    if (paymentMethod === "netbanking") {
      const { bank } = paymentData || {};
      if (!bank) return "Select a bank";
    }

    return "";
  };

  useEffect(() => {
    setError(validate());
  }, [paymentMethod, paymentData]);

  const handleNext = () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      setError(validationError);
      return;
    }

    navigate("/shipment", { state: { paymentMethod, paymentData } });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Payment Method</h1>
      <div className="flex gap-4 mb-4">
        {methods.map((m) => (
          <button
            key={m.value}
            className={`px-4 py-2 rounded ${paymentMethod === m.value ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => {
              setPaymentMethod(m.value);
              setPaymentData({});
              setError("");
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="mb-4">
        {paymentMethod === "card" && <CardPayment setPaymentData={setPaymentData} />}
        {paymentMethod === "upi" && <UPIPayment setPaymentData={setPaymentData} />}
        {paymentMethod === "netbanking" && (
          <div className="p-4 border rounded">
            <select className="border p-2 w-full rounded" onChange={(e) => setPaymentData({ bank: e.target.value })}>
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="ICICI">ICICI</option>
            </select>
          </div>
        )}
        {paymentMethod === "cod" && <div className="p-4 border rounded"><p>Cash on Delivery (COD)</p></div>}
      </div>

      {error && <p className="text-red-600 font-medium mb-2">{error}</p>}

      <button onClick={handleNext} disabled={!!error} className={`px-4 py-2 rounded w-full text-white ${error ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}>
        Shipping
      </button>
    </div>
  );
}
