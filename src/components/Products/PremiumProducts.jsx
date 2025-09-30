// src/components/PremiumProducts.jsx
import { useEffect, useState, useContext } from "react";
import ProductCard from "./ProductCard";
import { Crown, Sparkles, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PremiumProducts() {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/products", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        const premiumProducts = data.filter((product) => product.premium === true);
        setProducts(premiumProducts);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching premium products:", err);
          showAlert("Failed to load premium products", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const showAlert = (message, type = "error") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "warning":
        return "bg-amber-500 text-white border-amber-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-red-500 text-white border-red-600";
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Alerts */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-md w-full px-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`px-4 py-3 rounded-xl shadow-2xl border-2 ${getAlertStyles(alert.type)} animate-fade-in-down flex items-center space-x-2`}
          >
            {alert.type === "success" && <Sparkles className="w-4 h-4" />}
            {alert.type === "warning" && <Star className="w-4 h-4" />}
            {alert.type === "error" && <TrendingUp className="w-4 h-4" />}
            <span className="flex-1 text-sm font-medium">{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-2xl mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
          Premium Collection
        </h2>
        <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
          Indulge in our exclusive selection of premium chocolates and nuts,
          crafted with the finest ingredients for an extraordinary experience.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-amber-900 mb-2">
            Loading Premium Collection
          </h3>
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-3">
            No Premium Products Available
          </h3>
          <button
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
            onClick={() => navigate("/shops")}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showAlert={showAlert} />
          ))}
        </div>
      )}
    </section>
  );
}
