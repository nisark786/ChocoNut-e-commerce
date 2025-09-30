import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { requireLogin } from "../../helpers/userHelpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard({ product }) {
  if (!product) return null; 

  const navigate = useNavigate();
  const { currentUser, cart, addToCart, removeFromCart, wishlist, toggleWishlist } = useContext(UserContext);
  const [actionLoading, setActionLoading] = useState(false);

  const inCart = cart.some((item) => item.id === product.id);
  const inWishlist = wishlist.some((item) => item.id === product.id);
  const isOutOfStock = product.stock === 0;

  // Navigate to product details page
  const goToDetails = () => {
    navigate(`/product/${product.id}`); // 👈 Adjust route if different
  };

  // Handle Cart Add/Remove
  const handleCart = async (e) => {
    e.stopPropagation(); // 👈 Prevents card click
    if (!requireLogin(currentUser, navigate)) return;

    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    setActionLoading(true);
    try {
      if (inCart) {
        await removeFromCart(product.id);
        toast.info("Removed from cart!");
      } else {
        await addToCart(product);
        toast.success("Added to cart!");
      }
    } catch {
      toast.error("Operation failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlist = async (e) => {
    e.stopPropagation(); // 👈 Prevents card click
    if (!requireLogin(currentUser, navigate)) return;

    setActionLoading(true);
    try {
      await toggleWishlist(product);
      if (inWishlist) toast.info("Removed from wishlist!");
      else toast.success("Added to wishlist!");
    } catch {
      toast.error("Operation failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      onClick={goToDetails} // 👈 Clicking the card navigates
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-amber-200 overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer relative"
    >
      {/* Product Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-amber-900 mb-1">{product.name}</h3>
        <p className="text-amber-700 text-sm mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-900">₹{product.price}</span>
          {product.premium && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-xl">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between space-x-2 p-4">
        <button
          onClick={handleCart} // 👈 stops card click
          disabled={isOutOfStock || actionLoading}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 ${
            inCart
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
          }`}
        >
          {actionLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">{inCart ? "Remove" : "Add to Cart"}</span>
            </>
          )}
        </button>

        <button
          onClick={handleWishlist} // 👈 stops card click
          disabled={actionLoading}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${
            inWishlist
              ? "bg-pink-50 border-pink-200 text-pink-500"
              : "bg-amber-50 border-amber-200 text-amber-500"
          }`}
        >
          {actionLoading ? (
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-pink-500" : ""}`} />
          )}
        </button>
      </div>
    </div>
  );
}
