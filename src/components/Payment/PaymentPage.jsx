// src/components/Payment/PaymentPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CardPayment from "./CardPayment";
import UPIPayment from "./UPIPayment";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Truck, 
  Lock, 
  ArrowRight,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentData, setPaymentData] = useState({});
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const methods = [
    { 
      name: "Credit/Debit Card", 
      value: "card", 
      icon: CreditCard,
      description: "Pay with your card securely"
    },
    { 
      name: "UPI", 
      value: "upi", 
      icon: Smartphone,
      description: "Instant UPI payment"
    },
    { 
      name: "Net Banking", 
      value: "netbanking", 
      icon: Building,
      description: "Transfer from your bank"
    },
    { 
      name: "Cash on Delivery", 
      value: "cod", 
      icon: Truck,
      description: "Pay when you receive"
    },
  ];

  const banks = [
    { value: "sbi", label: "State Bank of India" },
    { value: "hdfc", label: "HDFC Bank" },
    { value: "icici", label: "ICICI Bank" },
    { value: "axis", label: "Axis Bank" },
    { value: "kotak", label: "Kotak Mahindra Bank" },
    { value: "pnb", label: "Punjab National Bank" },
  ];

  const validate = () => {
    if (paymentMethod === "card") {
      const { name, cardNumber, expiry, cvv } = paymentData || {};
      if (!name?.trim()) return "Cardholder name is required";
      if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) return "Card number must be 16 digits";
      if (!expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format";
      if (!cvv || !/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits";
    }

    if (paymentMethod === "upi") {
      const { upiId, isValid } = paymentData || {};
      if (!upiId?.trim()) return "UPI ID is required";
      if (!isValid) return "Please enter a valid UPI ID";
    }

    if (paymentMethod === "netbanking") {
      const { bank } = paymentData || {};
      if (!bank) return "Please select a bank";
    }

    return "";
  };

  useEffect(() => {
    setError(validate());
  }, [paymentMethod, paymentData]);

  const handleNext = async () => {
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate("/shipment", { state: { paymentMethod, paymentData } });
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Payment Required</h2>
          <p className="text-amber-700 mb-6">Please login to proceed with payment.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Login to Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Secure Payment</h1>
          <p className="text-amber-700">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-amber-600" />
                <span>Select Payment Method</span>
              </h2>

              {/* Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {methods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      onClick={() => {
                        setPaymentMethod(method.value);
                        setPaymentData({});
                        setError("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        paymentMethod === method.value
                          ? "border-amber-500 bg-amber-50 shadow-lg"
                          : "border-gray-200 hover:border-amber-300 hover:bg-amber-25"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          paymentMethod === method.value
                            ? "bg-amber-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{method.name}</p>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {paymentMethod === method.value && (
                          <CheckCircle className="w-5 h-5 text-amber-500 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Form */}
              <div className="mt-6">
                {paymentMethod === "card" && <CardPayment setPaymentData={setPaymentData} />}
                {paymentMethod === "upi" && <UPIPayment setPaymentData={setPaymentData} />}
                
                {paymentMethod === "netbanking" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Your Bank
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                      onChange={(e) => setPaymentData({ bank: e.target.value })}
                    >
                      <option value="">Choose your bank</option>
                      {banks.map(bank => (
                        <option key={bank.value} value={bank.value}>
                          {bank.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {paymentMethod === "cod" && (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-center">
                    <Truck className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Cash on Delivery</h3>
                    <p className="text-amber-700">Pay when you receive your order</p>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold border border-amber-300 text-amber-700 hover:bg-amber-50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cart</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={!!error || isProcessing}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Shipping</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}