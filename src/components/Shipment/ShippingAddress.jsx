// src/components/Shipment/ShippingAddress.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

export default function ShippingAddress({ paymentMethod, paymentData }) {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

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
      const order = { userId: currentUser.id, user: form, items: checkoutCart, total, status: "Pending", paymentMethod, paymentData, date: new Date().toISOString() };

      // 1️⃣ Save order
      await fetch("http://localhost:5000/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });

      // 2️⃣ Update stock
      for (const item of checkoutCart) {
        await fetch(`http://localhost:5000/products/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: item.stock - item.qty }),
        });
      }

      // 3️⃣ Clear cart
      await fetch(`http://localhost:5000/carts/${currentUser.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [] }) });
      setCurrentUser({ ...currentUser, cart: [] });

      localStorage.removeItem("checkoutCart");
      localStorage.removeItem("checkoutTotal");

      toast.success("Order placed successfully!");
      navigate("/confirmation", { state: { order } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["fullName","email","mobile","address","city","state","pin"].map((field) => (
          <div key={field}>
            <input type="text" name={field} value={form[field]} onChange={handleChange} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} className="border p-2 rounded w-full" />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600">{loading ? "Processing..." : "Place Order"}</button>
      </form>
    </div>
  );
}
