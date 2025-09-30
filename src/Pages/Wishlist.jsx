// src/pages/Wishlist.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { Heart, ShoppingCart, Trash2, ArrowRight, LogIn, Search } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function Wishlist() {
  const { currentUser, addToCart, toggleWishlist } = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ---------------- Fetch wishlist ----------------
  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/wishlists/${currentUser.id}`);
        const data = await res.json();
        setWishlist(data.items || []);
      } catch (err) {
        toast.error("Failed to load wishlist");
        console.error(err);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Welcome to Your Wishlist</h2>
          <p className="text-amber-700 mb-6">Login to save your favorite chocolates and nuts for later!</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5" />
            <span>Login to Continue</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------- Remove from wishlist ----------------
  const handleRemove = async (product) => {
    setLoadingIds((prev) => [...prev, product.id]);
    try {
      await toggleWishlist(product);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Removed from wishlist!");
    } catch (err) {
      toast.error("Failed to remove from wishlist.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  // ---------------- Add to cart & remove from wishlist ----------------
  const handleAddToCart = async (product) => {
    setLoadingIds((prev) => [...prev, product.id]);
    try {
      await addToCart(product);
      await toggleWishlist(product);
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("🛒 Added to cart and removed from wishlist!");
    } catch (err) {
      toast.error("Failed to add to cart.");
      console.error(err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== product.id));
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-amber-700 mb-8 text-lg">Start exploring our delicious collection of chocolates and nuts!</p>
          <button
            onClick={() => navigate("/shops")}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>Explore Products</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-3">My Wishlist</h1>
          <p className="text-amber-700 text-lg">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100 group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleRemove(product)}
                    disabled={loadingIds.includes(product.id)}
                    className="bg-white/90 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full transition-all duration-200 shadow-lg disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-amber-600 mb-4">₹{product.price}</p>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingIds.includes(product.id)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-3 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/shops")}
            className="inline-flex items-center space-x-2 text-amber-700 hover:text-amber-900 font-semibold transition-colors duration-200 border border-amber-300 hover:border-amber-500 px-6 py-3 rounded-xl bg-white/50 backdrop-blur-sm"
          >
            <Search className="w-5 h-5" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}