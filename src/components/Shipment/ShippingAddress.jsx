import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { 
  MapPin, User, Mail, Phone, Home, Navigation, 
  ArrowRight, CheckCircle
} from "lucide-react";

export default function ShippingAddress({ paymentMethod, paymentData }) {
  const navigate = useNavigate();
  const { currentUser, addOrder } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number required";
    else if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Invalid mobile number";
    if (!form.address.trim()) newErrors.address = "Address required";
    if (!form.city.trim()) newErrors.city = "City required";
    if (!form.state.trim()) newErrors.state = "State required";
    if (!form.pin.trim()) newErrors.pin = "PIN Code required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const checkoutCart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
      if (!checkoutCart.length) throw new Error("Cart is empty!");

      const total = checkoutCart.reduce((sum, item) => sum + item.price * item.qty, 0);

      const orderData = { 
        items: checkoutCart,
        total,
        user: form,
        paymentMethod,
        paymentData,
      };

      // Create order safely
      await addOrder(orderData);

      localStorage.removeItem("checkoutCart");
      localStorage.removeItem("checkoutTotal");

      toast.success("Order placed successfully!");
      navigate("/confirmation", { state: { items: checkoutCart, total, paymentMethod, paymentData } });

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: "fullName", label: "Full Name", icon: User, type: "text", placeholder: "Enter your full name" },
    { name: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "your@email.com" },
    { name: "mobile", label: "Mobile Number", icon: Phone, type: "tel", placeholder: "10-digit mobile number" },
    { name: "address", label: "Street Address", icon: Home, type: "text", placeholder: "House no., Street, Area" },
    { name: "city", label: "City", icon: MapPin, type: "text", placeholder: "Your city" },
    { name: "state", label: "State", icon: Navigation, type: "text", placeholder: "Your state" },
    { name: "pin", label: "PIN Code", icon: MapPin, type: "text", placeholder: "6-digit PIN code" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 sm:px-6 lg:px-0">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-amber-600" />
            <span>Delivery Address</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-amber-900 mb-2">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full pl-10 pr-4 py-3 bg-amber-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900 ${
                      errors[field.name] ? 'border-red-300' : 'border-amber-200'
                    }`}
                  />
                </div>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors[field.name]}</span>
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Place Order & Pay</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
