import { useState, useEffect } from "react";

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

  useEffect(() => {
    setError("");
    const cardDigits = cardNumber.replace(/\s/g, "");
    const expiryRegex = /^(\d{2})\/(\d{2})$/;
    const match = expiry.match(expiryRegex);

    const [month, year] = match ? [parseInt(match[1], 10), parseInt(match[2], 10)] : [null, null];
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (!name.trim()) setError("Name is required");
    else if (cardDigits.length !== 16) setError("Card number must be 16 digits");
    else if (!match || month < 1 || month > 12) setError("Invalid expiry date");
    else if (year < currentYear || (year === currentYear && month < currentMonth))
      setError("Card is expired");
    else if (cvv.length < 3 || cvv.length > 4) setError("CVV must be 3 or 4 digits");
    else {
      setError("");
      setPaymentData({ name, cardNumber: cardDigits, expiry, cvv });
      return;
    }

    setPaymentData(null);
  }, [name, cardNumber, expiry, cvv, setPaymentData]);

  return (
    <div className="flex flex-col gap-4 border p-4 rounded-lg">
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <input
        type="text"
        placeholder="Name on Card"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
        aria-label="Name on Card"
      />

      <input
        type="text"
        placeholder="Card Number (16 digits)"
        value={cardNumber}
        onChange={handleCardNumberChange}
        className="border p-2 rounded"
        maxLength={19}
        aria-label="Card Number"
      />

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={handleExpiryChange}
          className="border p-2 rounded w-1/2"
          maxLength={5}
          aria-label="Expiry Date"
        />
        <input
          type="password"
          placeholder="CVV"
          value={cvv}
          onChange={handleCvvChange}
          className="border p-2 rounded w-1/2"
          maxLength={4}
          aria-label="CVV"
        />
      </div>
    </div>
  );
}
