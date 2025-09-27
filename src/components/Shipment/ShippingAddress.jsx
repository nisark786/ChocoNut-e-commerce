// src/components/Shipment/ShippingAddress.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function ShippingAddress() {
  const navigate = useNavigate();
  const { currentUser, addOrder } = useContext(UserContext);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim()) newErrors.pin = "PIN Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const order = {
      id: Date.now(),
      user: form,
      items: currentUser.cart,
      total: currentUser.cart.reduce(
        (sum, item) => sum + item.price * (item.qty || 1),
        0
      ),
      date: new Date().toLocaleString(),
      status: "Pending",
    };

    addOrder(order); // save order + reduce stock + clear cart
    navigate("/confirmation", { state: { order } });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName","email","mobile","address","city","state","pin"].map((field) => (
          <div key={field}>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          Submit Shipping Details
        </button>
      </form>
    </div>
  );
}
