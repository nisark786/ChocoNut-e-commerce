import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { requireLogin, isInCart, isInWishlist } from "../../helpers/userHelpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { currentUser, addToCart, removeFromCart, toggleWishlist } = useContext(UserContext);

  const inCart = isInCart(currentUser, product.id);
  const inWishlist = isInWishlist(currentUser, product.id);

  const isOutOfStock = product.stock === 0;

  const handleCart = () => {
    if (!requireLogin(currentUser, navigate)) return;

    if (isOutOfStock) {
      toast.error("❌ Product is out of stock!");
      return;
    }

    if (inCart) {
      removeFromCart(product.id);
      toast.info("🛒 Removed from cart!");
    } else {
      addToCart(product);
      toast.success("✅ Added to cart!");
    }
  };

  const handleWishlist = () => {
    if (!requireLogin(currentUser, navigate)) return;

    toggleWishlist(product);
    if (inWishlist) {
      toast.info("❤️ Removed from wishlist!");
    } else {
      toast.success("💖 Added to wishlist!");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer relative">
      {product.premium && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded">
          PREMIUM
        </span>
      )}

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover hover:opacity-90"
        onClick={() => navigate(`/product/${product.id}`)}
      />

      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-red-900 font-bold mb-2">₹{product.price}</p>
        <p className={`text-sm font-medium mb-4 ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleCart}
            disabled={isOutOfStock}
            className={`px-3 py-1 rounded-md transition ${
              inCart
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-400 text-black hover:bg-green-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {inCart ? "Remove from Cart" : "Add to Cart"}
          </button>

          <button
            onClick={handleWishlist}
            className={`transition ${
              inWishlist ? "text-red-900" : "text-pink-600 hover:text-pink-800"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${inWishlist ? "text-red-500 fill-current" : "text-pink-600"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
