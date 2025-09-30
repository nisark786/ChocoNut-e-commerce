// src/components/Payment/UPIPayment.jsx
import { useState, useEffect } from "react";
import { Smartphone, QrCode, Shield, CheckCircle } from "lucide-react";

export default function UPIPayment({ setPaymentData }) {
  const [upiId, setUpiId] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  // UPI ID validation regex
  const validateUPI = (id) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/;
    return upiRegex.test(id);
  };

  useEffect(() => {
    const valid = validateUPI(upiId);
    setIsValid(valid);
    setPaymentData({ 
      method: "upi", 
      upiId: upiId.trim(),
      isValid: valid
    });
  }, [upiId, setPaymentData]);

  const handleInputChange = (e) => {
    setUpiId(e.target.value);
    setTouched(true);
  };

  const upiExamples = [
    "yourname@oksbi",
    "mobilenumber@paytm",
    "username@ybl",
    "email@axisbank"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">UPI Payment</h3>
          <p className="text-gray-600">Instant and secure payment</p>
        </div>
      </div>

      {/* UPI Input Field */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          UPI ID
          <span className="text-red-500 ml-1">*</span>
        </label>
        
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="yourname@upi"
            value={upiId}
            onChange={handleInputChange}
            onBlur={() => setTouched(true)}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
              touched && !isValid && upiId
                ? "border-red-300 focus:ring-red-500 bg-red-50"
                : isValid
                ? "border-green-300 focus:ring-green-500 bg-green-50"
                : "border-gray-300 focus:ring-blue-500 bg-white"
            }`}
          />
          
          {isValid && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Validation Messages */}
        {touched && upiId && !isValid && (
          <p className="text-red-600 text-sm flex items-center space-x-1">
            <span>⚠️</span>
            <span>Please enter a valid UPI ID (e.g., name@oksbi)</span>
          </p>
        )}
        
        {isValid && (
          <p className="text-green-600 text-sm flex items-center space-x-1">
            <span>✅</span>
            <span>Valid UPI ID</span>
          </p>
        )}
      </div>

      {/* UPI Examples */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <QrCode className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Common UPI ID formats:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {upiExamples.map((example, index) => (
            <div key={index} className="text-blue-700 bg-white/50 px-2 py-1 rounded border border-blue-200">
              {example}
            </div>
          ))}
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-900">Secure UPI Payment</span>
        </div>
        <ul className="text-xs text-amber-700 space-y-1">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            <span>Instant payment processing</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            <span>Bank-level security</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            <span>No additional charges</span>
          </li>
        </ul>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600 space-y-2">
        <p className="font-medium text-gray-700">How it works:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Enter your registered UPI ID</li>
          <li>Complete payment through your UPI app</li>
          <li>Instant order confirmation</li>
        </ol>
      </div>

      {/* Payment Apps Logos (Visual only) */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-3">Supported by all UPI apps:</p>
        <div className="flex items-center justify-center space-x-4 opacity-60">
          <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
          <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
          <div className="w-8 h-8 bg-purple-500 rounded-lg"></div>
          <div className="w-8 h-8 bg-red-500 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}