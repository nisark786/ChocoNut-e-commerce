// src/components/Payment/CardPayment.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { CreditCard, User, Lock, Calendar, CheckCircle } from "lucide-react";

export default function CardPayment({ setPaymentData }) {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

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

    if (!name.trim()) return "Cardholder name is required";
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
    const paymentInfo = { 
      method: "card", 
      name, 
      cardNumber: cardNumber.replace(/\s/g, ""), 
      expiry, 
      cvv 
    };
    setPaymentData(paymentInfo);

    try {
      const res = await fetch("http://localhost:5000/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentInfo),
      });

      if (!res.ok) throw new Error("Failed to save payment");
      
      setIsSaved(true);
      toast.success("💳 Payment information saved successfully!");
      
      // Reset form after successful save
      setTimeout(() => {
        setName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setIsSaved(false);
      }, 2000);
      
    } catch {
      toast.error("❌ Failed to save payment information!");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-900">Credit/Debit Card</h3>
          <p className="text-amber-600">Secure payment with SSL encryption</p>
        </div>
      </div>

      {/* Success State */}
      {isSaved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-semibold text-green-800">Payment Method Saved!</p>
            <p className="text-green-700 text-sm">Your card details have been securely stored</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">!</span>
          </div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Card Form */}
      <div className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Cardholder Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900"
            />
          </div>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900 font-mono"
            />
          </div>
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              CVV
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="password"
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center space-x-2 text-amber-700">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Your payment details are secure</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            We use industry-standard encryption to protect your information
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaved}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSaved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Save Card Securely</span>
            </>
          )}
        </button>
      </div>

      {/* Accepted Cards */}
      <div className="mt-6 pt-4 border-t border-amber-200">
        <p className="text-sm text-amber-600 mb-3">We accept:</p>
        <div className="flex space-x-3">
          {['Visa', 'MasterCard', 'Amex', 'RuPay'].map((card) => (
            <div key={card} className="bg-amber-100 rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-amber-700">{card}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}