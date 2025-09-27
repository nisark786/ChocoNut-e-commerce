// src/components/Payment/CardPayment.jsx
import { useState } from "react";
import { toast } from "react-toastify";

export default function CardPayment({ setPaymentData }) {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) value = value.replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setCvv(value);
  };

  const validateCard = () => {
    const cardDigits = cardNumber.replace(/\s/g, "");
    const expiryRegex = /^(\d{2})\/(\d{2})$/;
    const match = expiry.match(expiryRegex);
    const [month, year] = match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : [null, null];
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!name.trim()) return "Name is required";
    if (cardDigits.length !== 16) return "Card number must be 16 digits";
    if (!match || month < 1 || month > 12) return "Invalid expiry date";
    if (year < currentYear || (year === currentYear && month < currentMonth)) return "Card is expired";
    if (cvv.length < 3 || cvv.length > 4) return "CVV must be 3 or 4 digits";

    return "";
  };

  const handleSave = async () => {
    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      setPaymentData(null);
      return;
    }

    setError("");
    const paymentInfo = { method: "card", name, cardNumber: cardNumber.replace(/\s/g, ""), expiry, cvv };
    setPaymentData(paymentInfo);

    try {
      const res = await fetch("http://localhost:5000/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentInfo),
      });

      if (!res.ok) throw new Error("Failed to save payment");
      toast.success("Payment info saved successfully!");
    } catch {
      toast.error("Failed to save payment info!");
    }
  };

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <input type="text" placeholder="Name on Card" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
      <input type="text" placeholder="Card Number (16 digits)" value={cardNumber} onChange={handleCardNumberChange} className="border p-2 rounded" maxLength={19} />
      
      <div className="flex gap-4">
        <input type="text" placeholder="MM/YY" value={expiry} onChange={handleExpiryChange} className="border p-2 rounded w-1/2" maxLength={5} />
        <input type="password" placeholder="CVV" value={cvv} onChange={handleCvvChange} className="border p-2 rounded w-1/2" maxLength={4} />
      </div>

      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Save Card
      </button>
    </div>
  );
}
