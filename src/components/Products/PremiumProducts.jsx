// src/components/PremiumProducts.jsx
import { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import { UserContext } from "../../context/UserContext";

export default function PremiumProducts() {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products?premium=true", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching premium products:", err);
          showAlert("Failed to load premium products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort(); // cleanup on unmount
  }, []);

  // Show alert at top of page
  const showAlert = (message) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Alerts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-red-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn"
          >
            {alert.message}
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center">Premium Products</h2>

      {/* Loading, empty state, or product list */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          Loading premium products...
        </p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No premium products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAlert={showAlert}
            />
          ))}
        </div>
      )}
    </section>
  );
}
